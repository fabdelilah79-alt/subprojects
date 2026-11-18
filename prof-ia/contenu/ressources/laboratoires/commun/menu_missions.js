/*
Rôle : menu des missions (proposition à valider, avec l'option « mobile=1 ») : la liste des missions avec leur état
       (terminée, en cours, pas commencée) ; « Y aller » ouvre directement une mission, même si la précédente n'est pas
       finie ; « Recommencer » remet le laboratoire à son état de départ et reprend à cette mission.
       En mode « une seule mission » (#mission=<id>, cours), seul « Recommencer » est proposé.
Reçoit : Labo.missions.etat() ; l'adresse de la page (ses autres réglages sont gardés quand on recommence).
Produit : Labo.menu_missions.ouvrir() : le menu (et le bouton « Plein écran »), par-dessus le laboratoire ; il se ferme par
         « Fermer » ou après un choix.
Utilisé par : mobile.js (bouton « Missions ») ; styles dans mobile.css.
*/
(function (L) {
  let panneau = null;

  function recommencer(m, seule) {
    // Recharge la page : tout revient à l'état de départ ; « depart=<id> » reprend à cette mission (sauf mission seule).
    if (!seule) {
      const reglages = window.location.hash.replace(/^#/, "").split("&").filter((r) => r && !r.startsWith("depart="));
      history.replaceState(null, "", "#" + [...reglages, `depart=${m.id}`].join("&"));
    }
    window.location.reload();
  }

  function etat_texte(m, i, e) {
    // État d'une mission en quelques mots.
    if (m.accomplie) return "terminée";
    if (i === e.vue) return `en cours : étape ${m.etape + 1} sur ${m.etapes.length}`;
    return m.etape > 0 ? `commencée : étape ${m.etape + 1} sur ${m.etapes.length}` : "pas commencée";
  }

  function ligne(liste, m, i, e) {
    // Une mission : numéro, titre, état, boutons.
    const seule = e.seule !== null;
    const li = L.html("li", { class: i === e.vue ? "actuelle" : "" }, liste);
    L.html("strong", {}, li, `Mission ${i + 1} · ${m.titre}`);
    L.html("span", { class: "menu-etat" }, li, etat_texte(m, i, e));
    const boutons = L.html("div", { class: "menu-boutons" }, li);
    if (!seule && i !== e.vue) {
      const aller = L.html("button", { type: "button", class: "mobile-bouton" }, boutons, "Y aller");
      aller.addEventListener("click", () => { fermer(); L.missions.ouvrir(i); });
    }
    const refaire = L.html("button", { type: "button", class: "mobile-bouton secondaire" }, boutons, "Recommencer");
    refaire.addEventListener("click", () => recommencer(m, seule));
  }

  function fermer() {
    // Retire le menu.
    panneau?.remove();
    panneau = null;
  }

  L.menu_missions = {
    ouvrir() {
      // Construit le menu à partir de l'état des missions.
      fermer();
      const e = L.missions.etat();
      panneau = L.html("section", { class: "menu-missions", role: "dialog", "aria-label": "Missions" }, document.body);
      const tete = L.html("div", { class: "menu-tete" }, panneau);
      L.html("h2", {}, tete, "Missions");
      if (document.fullscreenEnabled && L.plein_ecran) L.html("button", { type: "button", class: "mobile-bouton secondaire" }, tete, "Plein écran").addEventListener("click", () => { fermer(); L.plein_ecran(); });
      L.html("button", { type: "button", class: "mobile-bouton" }, tete, "Fermer").addEventListener("click", fermer);
      const liste = L.html("ol", {}, panneau);
      e.missions.forEach((m, i) => { if (e.seule === null || e.seule === i) ligne(liste, m, i, e); });
      L.html("p", { class: "menu-note" }, panneau, "« Recommencer » remet tout le laboratoire à son état de départ.");
    },
  };
})(window.Labo);
