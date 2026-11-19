/*
Rôle : ticket jaune du laboratoire en mode cours (le carnet est retiré) : il montre la consigne complète de l'étape
       en cours, l'astuce de geste et le message de vérification (ce qu'il faut corriger) ; un toucher le plie ou le déplie,
       un glissé le déplace. Il prend la place et la taille du pense-bête de la paillasse (la place que chaque laboratoire
       a laissée libre) ; un texte long s'écrit un peu plus serré ; s'il ne tient toujours pas, « toucher pour lire la
       suite » : un appui l'agrandit le temps de lire (appuis successifs : agrandi, plié, à sa place).
       Les étapes « question » ne sont pas comptées : c'est le professeur IA qui les pose.
Reçoit : l'étage de la scène ; les annonces « missions » (Labo.missions.etat()).
Produit : Labo.ticket.creer(etage) : le ticket posé en haut à gauche de la scène, au-dessus du décor ; en bas,
         « Recommencer » et « Mission suivante » (même si la mission n'est pas finie).
Utilisé par : demarrage.js (à la place du carnet et des pense-bêtes du mur, quand Labo.mode_prof est vrai).
*/
(function (L) {
  const tk = { element: null, contenu: null, etat: "normal", signature: "", pos: { x: 22, y: 46 }, deplace: false };
  const ECHELLE_MIN = 0.72;

  function place_du_pense_bete(m) {
    // Position et taille du pense-bête (caché) de la paillasse de la mission, ou null s'il n'y en a pas.
    const groupe = document.querySelectorAll('[clip-path="url(#cadre-paillasse)"]')[m.paillasse];
    const feuille = groupe?.querySelector(".pense-bete"), fond = feuille?.querySelectorAll("rect")[1];
    const t = (feuille?.getAttribute("transform") || "").match(/translate\(([-\d.]+)[ ,]+([-\d.]+)\)/);
    return t && fond ? { x: Number(t[1]), y: Number(t[2]), l: Number(fond.getAttribute("width")), h: Number(fond.getAttribute("height")) } : null;
  }

  function ajuster(m) {
    // Pose le ticket à la place du pense-bête, puis resserre l'écriture jusqu'à ce que le texte tienne (sinon il défile).
    const el = tk.element, p = place_du_pense_bete(m);
    if (p && !tk.deplace) Object.assign(tk.pos, { x: p.x, y: p.y });
    Object.assign(el.style, { left: `${tk.pos.x}px`, top: `${tk.pos.y}px` });
    if (p) Object.assign(el.style, { width: `${p.l}px`, height: tk.etat === "normal" ? `${p.h}px` : "" });
    let echelle = 1;
    el.style.setProperty("--echelle", echelle);
    while (tk.etat === "normal" && deborde() && echelle > ECHELLE_MIN) {
      echelle = Math.round((echelle - 0.04) * 100) / 100;
      el.style.setProperty("--echelle", echelle);
    }
    el.classList.toggle("deborde", tk.etat === "normal" && deborde());
  }

  const deborde = () => tk.contenu.scrollHeight > tk.contenu.clientHeight + 1;

  function toucher() {
    // Appui bref : à sa place -> agrandi (si le texte déborde) ou plié ; agrandi -> plié ; plié -> à sa place.
    const suivant = { normal: tk.element.classList.contains("deborde") ? "grand" : "plie", grand: "plie", plie: "normal" };
    tk.etat = suivant[tk.etat];
    tk.signature = "";
    ecrire(L.missions.etat());
  }

  function gestes(m) {
    // Les étapes de manipulation (sans les questions) et le rang de l'étape en cours parmi elles.
    const faites = m.etapes.slice(0, m.etape).filter((e) => !e.question).length;
    return { total: m.etapes.filter((e) => !e.question).length, rang: faites + 1 };
  }

  function fin(e, m) {
    // Mission accomplie : retour au cours, ou passage à la mission suivante (laboratoire complet).
    L.html("p", { class: "ticket-titre" }, tk.contenu, "Mission accomplie");
    L.html("p", { class: "ticket-texte" }, tk.contenu, "Revenez au cours : le professeur va exploiter vos mesures.");
    if (e.seule !== null || e.vue + 1 >= e.missions.length) return;
    const suite = L.html("button", { type: "button", class: "ticket-bouton" }, tk.contenu, "Mission suivante");
    suite.addEventListener("click", (ev) => { ev.stopPropagation(); L.missions.aller(e.vue + 1); });
  }

  function pied(e) {
    // Bas du ticket : « Recommencer » (laboratoire remis à l'état de départ) et « Mission suivante » s'il y en a une.
    tk.pied.replaceChildren();
    const refaire = L.html("button", { type: "button", class: "ticket-bouton" }, tk.pied, "Recommencer");
    refaire.addEventListener("click", (ev) => { ev.stopPropagation(); L.missions.recommencer(); });
    if (e.seule !== null || e.vue + 1 >= e.missions.length || e.missions[e.vue].accomplie) return;
    const suite = L.html("button", { type: "button", class: "ticket-bouton" }, tk.pied, "Mission suivante");
    suite.addEventListener("click", (ev) => { ev.stopPropagation(); L.missions.aller(e.vue + 1); });
  }

  function etape(e, m) {
    // Étape en cours : consigne, astuce de geste, message de vérification.
    const { total, rang } = gestes(m), en_cours = m.etapes[m.etape], message = e.messages[m.id];
    L.html("p", { class: "ticket-titre" }, tk.contenu, `${m.titre} · étape ${rang} sur ${total}`);
    L.ecrire_riche(L.html("p", { class: "ticket-texte" }, tk.contenu), en_cours.consigne);
    if (en_cours.aide_geste) L.ecrire_riche(L.html("p", { class: "ticket-astuce" }, tk.contenu), en_cours.aide_geste);
    if (message && !message.juste) L.ecrire_riche(L.html("p", { class: "ticket-message", role: "status" }, tk.contenu), message.texte);
  }

  function ecrire(e) {
    // Réécrit le ticket quand la mission affichée change d'étape ou reçoit un message.
    const m = e.missions[e.vue], message = e.messages[m.id];
    const etape_vue = JSON.stringify([e.vue, m.etape, m.accomplie]);
    if (etape_vue !== tk.etape_vue && tk.etat === "grand") tk.etat = "normal";  // nouvelle étape : le ticket reprend sa place
    tk.etape_vue = etape_vue;
    const signature = JSON.stringify([etape_vue, message, tk.etat]);
    if (signature === tk.signature) return;
    tk.signature = signature;
    tk.contenu.replaceChildren();
    tk.element.classList.toggle("plie", tk.etat === "plie");
    tk.element.classList.toggle("grand", tk.etat === "grand");
    if (m.accomplie) fin(e, m);
    else etape(e, m);
    pied(e);
    ajuster(m);
  }

  L.ticket = {
    creer(etage) {
      // Colle le ticket en haut à gauche de la scène ; un toucher le plie (pour voir dessous), un glissé le déplace.
      tk.element = L.html("section", { class: "ticket", "aria-label": "Consignes de l'expérience", "aria-live": "polite" }, etage);
      L.html("div", { class: "ticket-scotch" }, tk.element);
      tk.contenu = L.html("div", { class: "ticket-contenu" }, tk.element);
      tk.pied = L.html("div", { class: "ticket-pied" }, tk.element);
      L.glissable(tk.element, {
        debut: (e) => (e.target.closest("button") ? null : { ...tk.pos }),
        deplacer: (p) => {
          tk.pos = { x: Math.max(0, Math.min(760, p.x)), y: Math.max(24, Math.min(560, p.y)) };
          tk.deplace = true;
          Object.assign(tk.element.style, { left: `${tk.pos.x}px`, top: `${tk.pos.y}px` });
        },
        toucher,
      });
      L.ecouter("missions", ecrire);
      document.fonts?.ready.then(() => { tk.signature = ""; ecrire(L.missions.etat()); });
    },
  };
})(window.Labo);
