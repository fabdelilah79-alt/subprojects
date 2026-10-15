/*
Rôle : bouton-poussoir lumineux posé sur un poste (par exemple « Pause / Lecture » du temps qui s'écoule) :
       un appui l'enfonce et change son voyant ; utilisable au doigt, à la souris et au clavier (Entrée, Espace).
Reçoit : le groupe SVG, la position, les deux inscriptions (repos, enfoncé) et la fonction à appeler.
Produit : Labo.bouton_poussoir(parent, x, y, { textes: [repos, enfonce], sur_changement(enfonce) }) -> { regler(enfonce) }.
Utilisé par : les simulations où le temps s'écoule (tc_meca1_a2_gravitation).
*/
(function (L) {
  L.bouton_poussoir = function (parent, x, y, { textes, sur_changement }) {
    // Construit le bouton : socle métallique, capuchon coloré, voyant et inscription gravée.
    const g = L.svg("g", { transform: `translate(${x} ${y})`, class: "bouton-poussoir", role: "button", tabindex: 0 }, parent);
    L.svg("rect", { x: -48, y: -17, width: 96, height: 34, rx: 6, fill: "url(#acier)", stroke: "#1b1e21", filter: "url(#ombre)" }, g);
    const capuchon = L.svg("circle", { cx: -28, cy: 0, r: 11, stroke: "#111", "stroke-width": 1 }, g);
    const reflet = L.svg("ellipse", { cx: -31, cy: -4, rx: 5, ry: 3, fill: "#fff", opacity: 0.45 }, g);
    const texte = L.texte(g, 12, 1, "", { "font-size": 13, "font-weight": 700, fill: "#e8edf1" });
    const etat = { enfonce: false };

    function regler(enfonce) {
      // Affiche l'état : en marche (capuchon vert, « Pause ») ou arrêté (capuchon orange enfoncé, « Lecture »).
      etat.enfonce = enfonce;
      capuchon.setAttribute("fill", enfonce ? "#f2a33a" : "#3fbf6a");
      capuchon.setAttribute("r", enfonce ? 10 : 11);
      reflet.setAttribute("opacity", enfonce ? 0.25 : 0.45);
      texte.textContent = textes[enfonce ? 1 : 0];
      g.setAttribute("aria-pressed", String(enfonce));
      g.setAttribute("aria-label", textes[enfonce ? 1 : 0]);
    }

    function appuyer() {
      // Un appui change l'état et prévient la scène.
      regler(!etat.enfonce);
      sur_changement(etat.enfonce);
    }

    g.addEventListener("pointerdown", (e) => { e.labo_pris = true; });
    g.addEventListener("dblclick", (e) => { e.labo_pris = true; });
    g.addEventListener("click", appuyer);
    g.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); appuyer(); } });
    regler(false);
    return { regler };
  };
})(window.Labo);
