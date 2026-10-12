/*
Rôle : carnet de laboratoire posé sur la paillasse : un toucher l'ouvre ; il montre les missions (marque-pages),
       l'objectif, les étapes cochées au fur et à mesure, la question à laquelle répondre et le tampon de réussite.
Reçoit : l'étage de la scène ; les annonces « missions » ; les réponses de l'élève (choix ou nombre).
Produit : Labo.carnet : creer(), ouvrir(), fermer() ; appelle Labo.missions.repondre() et Labo.missions.aller().
Utilisé par : la page de chaque simulation.
*/
(function (L) {
  const TAILLE = { l: 410, h: 576 };
  const c = { element: null, ouvert: true, pos: { x: 12, y: 32 }, repos: { x: 118, y: 574 }, signature: "" };

  function appliquer() {
    // Place le carnet : ouvert devant l'élève, ou fermé et couché sur la paillasse.
    c.element.style.left = `${c.pos.x}px`;
    c.element.style.top = `${c.pos.y}px`;
    c.element.classList.toggle("ferme", !c.ouvert);
    if (c.ouvert) { c.element.style.transform = "none"; return; }
    const dx = c.repos.x - c.pos.x - TAILLE.l / 2, dy = c.repos.y - c.pos.y - TAILLE.h;
    c.element.style.transform = `translate(${dx}px, ${dy}px) perspective(700px) rotateX(64deg) rotateZ(-4deg) scale(0.36)`;
  }

  function question(zone, q) {
    // Champs de réponse de la question en cours : choix à entourer, ou nombre avec son unité.
    if (q.type === "choix") {
      q.options.forEach((texte, i) => {
        const b = L.ecrire_riche(L.html("button", { type: "button", class: "carnet-choix" }, zone), texte);
        b.addEventListener("click", () => L.missions.repondre(i));
      });
      return;
    }
    const ligne = L.html("div", { class: "carnet-reponse" }, zone);
    const champ = L.html("input", { type: "text", inputmode: "decimal", "aria-label": "Votre réponse", autocomplete: "off" }, ligne);
    L.html("span", { class: "carnet-unite" }, ligne, q.unite || "");
    const valider = L.html("button", { type: "button", class: "carnet-bouton" }, ligne, "Vérifier");
    valider.addEventListener("click", () => L.missions.repondre(champ.value));
    champ.addEventListener("keydown", (e) => { if (e.key === "Enter") L.missions.repondre(champ.value); });
  }

  function marque_pages(page, e) {
    // Un marque-page par mission ; les missions pas encore ouvertes sont grisées.
    const rangee = L.html("div", { class: "carnet-marques" }, page);
    e.missions.forEach((m, i) => {
      const b = L.html("button", { type: "button", class: "carnet-marque" + (m.accomplie ? " accomplie" : "") }, rangee, `Mission ${i + 1}`);
      b.setAttribute("aria-pressed", String(i === e.vue));
      if (i > e.courante) b.disabled = true;
      b.addEventListener("click", () => L.missions.aller(i));
    });
  }

  function etapes(page, m, message) {
    // Liste des étapes : cochées, en cours (avec question et message), ou à venir.
    const liste = L.html("ol", { class: "carnet-etapes" }, page);
    m.etapes.forEach((etape, i) => {
      const etat_etape = i < m.etape || m.accomplie ? "faite" : (i === m.etape ? "courante" : "a-venir");
      const li = L.ecrire_riche(L.html("li", { class: etat_etape }, liste), etape.consigne);
      if (etat_etape !== "courante") return;
      if (etape.question) question(L.html("div", {}, li), etape.question);
      if (message) L.ecrire_riche(L.html("p", { class: "carnet-message " + (message.juste ? "juste" : "faux"), role: "status" }, li), message.texte);
      else if (etape.aide_geste) L.ecrire_riche(L.html("p", { class: "carnet-astuce" }, li), etape.aide_geste);
    });
  }

  function fin_de_mission(page, e) {
    // Tampon « Mission accomplie » et passage à la paillasse suivante.
    L.html("div", { class: "carnet-tampon" }, page, "Mission accomplie");
    const m = e.missions[e.vue];
    if (m.conclusion) L.ecrire_riche(L.html("p", { class: "carnet-conclusion" }, page), m.conclusion);
    if (e.vue + 1 < e.missions.length) {
      const suite = L.html("button", { type: "button", class: "carnet-bouton" }, page, `Passer à la mission ${e.vue + 2}`);
      suite.addEventListener("click", () => L.missions.aller(e.vue + 1));
    } else if (e.missions.every((x) => x.accomplie)) {
      L.html("p", { class: "carnet-conclusion" }, page, "Toutes les missions sont accomplies. Vous pouvez revenir au cours.");
    }
  }

  function ecrire(e) {
    // Réécrit la page du carnet si l'état des missions a changé (sans effacer une réponse en cours de saisie).
    const m = e.missions[e.vue];
    const message = e.messages[m.id];
    const signature = JSON.stringify([e.vue, e.courante, m.etape, m.accomplie, message, e.missions.map((x) => x.accomplie)]);
    if (signature === c.signature) return;
    c.signature = signature;
    c.page.replaceChildren();
    marque_pages(c.page, e);
    L.html("h2", { class: "carnet-titre" }, c.page, `Mission ${e.vue + 1} — ${m.titre}`);
    L.ecrire_riche(L.html("p", { class: "carnet-objectif" }, c.page), m.objectif);
    if (m.donnees) {
      const fiche = L.html("div", { class: "carnet-donnees" }, c.page);
      for (const ligne of m.donnees) L.ecrire_riche(L.html("p", {}, fiche), ligne);
    }
    etapes(c.page, m, message);
    if (m.accomplie) fin_de_mission(c.page, e);
  }

  L.carnet = {
    creer(etage, repos = null) {
      // Construit le carnet (couverture, spirale, page) et le rend mobile ; repos : où il est posé, fermé.
      if (repos) c.repos = repos;
      c.element = L.html("section", { class: "carnet", "aria-label": "Carnet de laboratoire" }, etage);
      L.html("div", { class: "carnet-spirale" }, c.element);
      c.page = L.html("div", { class: "carnet-page" }, c.element);
      const fermer = L.html("button", { type: "button", class: "carnet-fermer" }, c.element, "Poser le carnet");
      fermer.addEventListener("click", () => L.carnet.fermer());
      L.html("div", { class: "carnet-couverture" }, c.element, "Carnet de laboratoire");
      L.glissable(c.element, {
        debut: (e) => (!c.ouvert || e.target.classList.contains("carnet-spirale") ? { ...c.pos } : null),
        deplacer: (p) => { if (c.ouvert) { c.pos = { x: Math.max(-200, Math.min(800, p.x)), y: Math.max(-300, Math.min(300, p.y)) }; appliquer(); } },
        toucher: () => { if (!c.ouvert) L.carnet.ouvrir(); },
      });
      L.ecouter("missions", ecrire);
      appliquer();
    },
    ouvrir() {
      // Ouvre le carnet devant l'élève.
      c.ouvert = true;
      c.element.parentNode.append(c.element);
      appliquer();
    },
    fermer() {
      // Referme le carnet et le repose sur la paillasse.
      c.ouvert = false;
      appliquer();
    },
  };
})(window.Labo);
