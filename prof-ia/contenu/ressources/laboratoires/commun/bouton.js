/*
Rôle : bouton-poussoir lumineux posé sur un poste (par exemple « Pause / Lecture » du temps qui s'écoule) :
       un appui l'enfonce et change son voyant ; utilisable au doigt, à la souris et au clavier (Entrée, Espace).
Reçoit : le groupe SVG, la position, les deux inscriptions (repos, enfoncé) et la fonction à appeler.
Produit : Labo.bouton_poussoir(parent, x, y, { textes: [repos, enfonce], sur_changement(enfonce) }) -> { regler(enfonce) }.
Utilisé par : les simulations où le temps s'écoule (gravitation, relativité), l'éclateur (eclateur.js).
*/
(function (L) {
  function dessiner(g, textes) {
    // Socle métallique (largeur adaptée à l'inscription), capuchon coloré et son reflet, inscription gravée.
    const largeur = 44 + Math.max(...textes.map((t) => t.length)) * 7.6;
    L.svg("rect", { x: -largeur / 2, y: -17, width: largeur, height: 34, rx: 6, fill: "url(#acier)", stroke: "#1b1e21", filter: "url(#ombre)" }, g);
    return {
      capuchon: L.svg("circle", { cx: -largeur / 2 + 20, cy: 0, r: 11, stroke: "#111", "stroke-width": 1 }, g),
      reflet: L.svg("ellipse", { cx: -largeur / 2 + 17, cy: -4, rx: 5, ry: 3, fill: "#fff", opacity: 0.45 }, g),
      texte: L.texte(g, 18, 1, "", { "font-size": 13, "font-weight": 700, fill: "#e8edf1" }),
    };
  }

  L.bouton_poussoir = function (parent, x, y, { textes, sur_changement }) {
    // Construit le bouton et le rend utilisable au doigt, à la souris et au clavier.
    const g = L.svg("g", { transform: `translate(${x} ${y})`, class: "bouton-poussoir", role: "button", tabindex: 0 }, parent);
    const { capuchon, reflet, texte } = dessiner(g, textes), etat = { enfonce: false };

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

    const appuyer = () => { regler(!etat.enfonce); sur_changement(etat.enfonce); };
    g.addEventListener("pointerdown", (e) => { e.labo_pris = true; });
    g.addEventListener("dblclick", (e) => { e.labo_pris = true; });
    g.addEventListener("click", appuyer);
    g.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); appuyer(); } });
    regler(false);
    return { regler };
  };
})(window.Labo);
