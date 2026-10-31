/*
Rôle : dessins du tableau de Lewis : tableau blanc et quadrillage, aimants d'atomes (couleurs conventionnelles des modèles
       moléculaires), doublets liants (un, deux ou trois traits entre deux atomes) et non liants (un trait à côté de
       l'atome), réserve d'aimants (toucher pour choisir, ou glisser), bouton texte.
Reçoit : les groupes SVG, l'état du tableau (tableau_lewis.js) et la position des nœuds du quadrillage.
Produit : Labo.cadre_lewis(g, G), Labo.aimant_atome(g, el), Labo.dessin_lewis(g, etat, noeud, rendre_glissable),
          Labo.reserve_lewis(g, elements, choix, poser(el, point), dire), Labo.bouton_texte(g, x, y, texte, action).
Utilisé par : tableau_lewis.js.
*/
(function (L) {
  const COULEUR = { H: ["#f4f4f2", "#222"], C: ["#2b2b2b", "#fff"], N: ["#2f5fc4", "#fff"], O: ["#d0312d", "#fff"], Cl: ["#2f9a3c", "#fff"], F: ["#9ad46a", "#222"], Si: ["#d8c49a", "#222"], P: ["#f08a24", "#fff"], S: ["#f2d22e", "#222"] };
  const NOMS = { H: "hydrogène", C: "carbone", N: "azote", O: "oxygène", Cl: "chlore", F: "fluor", Si: "silicium", P: "phosphore", S: "soufre" };
  const COTES = { h: [0, -1], b: [0, 1], g: [-1, 0], d: [1, 0] };

  L.cadre_lewis = function (g, G) {
    // Tableau blanc à cadre aluminium, titre, points du quadrillage, colonne de la réserve.
    L.svg("rect", { x: 244, y: 30, width: 562, height: 368, rx: 3, fill: "url(#metal-h)", filter: "url(#ombre)" }, g);
    L.svg("rect", { x: 250, y: 36, width: 550, height: 356, fill: "#fbfcfd" }, g);
    L.texte(g, 580, 48, "Représentation de Lewis", { class: "etiquette-carton", "font-size": 15 });
    for (let i = 0; i < G.nx; i++) for (let j = 0; j < G.ny; j++) L.svg("circle", { cx: G.x + i * G.pas, cy: G.y + j * G.pas, r: 1.6, fill: "#b9c4cc" }, g);
    L.svg("line", { x1: 332, y1: 44, x2: 332, y2: 386, stroke: "#d6dde2" }, g);
  };

  L.aimant_atome = function (g, el) {
    // Aimant rond bombé, à la couleur de l'élément, avec son symbole.
    const [f, t] = COULEUR[el], a = L.svg("g", { class: `aimant-atome aimant-${el}`, role: "button", "aria-label": el }, g);
    L.svg("circle", { r: 15, fill: f, stroke: "#333", "stroke-width": 0.8 }, a);
    L.svg("circle", { cx: -4.5, cy: -5, r: 5, fill: "#fff", opacity: 0.28 }, a);
    L.texte(a, 0, 4.5, el, { "font-size": 13, "font-weight": 700, fill: t });
    return a;
  };

  function liaison(g, p, q, n) {
    // n traits parallèles (doublets liants) entre les bords de deux atomes.
    const d = Math.hypot(q.x - p.x, q.y - p.y), u = { x: (q.x - p.x) / d, y: (q.y - p.y) / d };
    for (let k = 0; k < n; k++) {
      const o = (k - (n - 1) / 2) * 5;
      L.svg("line", { x1: p.x + 17 * u.x - o * u.y, y1: p.y + 17 * u.y + o * u.x, x2: q.x - 17 * u.x - o * u.y, y2: q.y - 17 * u.y + o * u.x, stroke: "#1f2a44", "stroke-width": 2.4, "stroke-linecap": "round", "pointer-events": "none" }, g);
    }
  }

  L.dessin_lewis = function (g, etat, noeud, rendre_glissable) {
    // Redessine liaisons, doublets non liants et atomes.
    g.replaceChildren();
    const pos = (cle) => noeud(...cle.split(",").map(Number));
    for (const [k, n] of Object.entries(etat.liaisons)) { const [a, b] = k.split("|"); liaison(g, pos(a), pos(b), n); }
    for (const k of Object.keys(etat.paires)) {
      const [cle, cote] = k.split("|"), p = pos(cle), [u, v] = COTES[cote], c = { x: p.x + 22 * u, y: p.y + 22 * v };
      L.svg("line", { x1: c.x - 6 * v, y1: c.y - 6 * u, x2: c.x + 6 * v, y2: c.y + 6 * u, stroke: "#1f2a44", "stroke-width": 2.4, "stroke-linecap": "round", "pointer-events": "none" }, g);
    }
    for (const [cle, el] of Object.entries(etat.atomes)) { const a = L.aimant_atome(g, el), p = pos(cle); L.placer(a, p.x, p.y); rendre_glissable(a, cle); }
  };

  L.reserve_lewis = function (g, elements, choix, poser, dire) {
    // Réserve d'aimants : un toucher choisit l'élément (cerclé de jaune) ; on peut aussi glisser un aimant sur le tableau.
    const repere = L.svg("circle", { r: 20, fill: "none", stroke: "#f2b705", "stroke-width": 3, "pointer-events": "none" }, g);
    repere.style.display = "none";
    elements.forEach((el, k) => {
      const pas = Math.min(58, 300 / elements.length), p = { x: 292, y: 82 + k * pas }, a = L.aimant_atome(g, el);
      L.placer(a, p.x, p.y);
      if (pas > 50) L.texte(g, p.x, p.y + 26, NOMS[el], { "font-size": 7.5, fill: "#33414b" });
      L.glissable(a, { debut: () => ({ ...p }), deplacer: (q) => L.placer(a, q.x, q.y), lacher: (q) => { L.placer(a, p.x, p.y); poser(el, q); },
        toucher: () => { choix.choisi = el; repere.style.display = ""; L.placer(repere, p.x, p.y); dire(`Atome ${el} choisi : touchez un point du quadrillage.`); } });
    });
  };

  L.bouton_texte = function (g, x, y, texte, action) {
    // Bouton arrondi avec un texte (au toucher).
    const b = L.svg("g", { class: "bouton-texte", role: "button", "aria-label": texte }, g);
    L.svg("rect", { x: x - 38, y: y - 11, width: 76, height: 22, rx: 11, fill: "#e9eef2", stroke: "#8a96a0" }, b);
    L.texte(b, x, y + 3, texte, { "font-size": 9, "font-weight": 700, fill: "#23315a" });
    L.glissable(b, { soulever: false, debut: () => ({ x: 0, y: 0 }), toucher: action });
    return b;
  };
})(window.Labo);
