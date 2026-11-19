/*
Rôle : pièces du récepteur radio AM, posées sur la paillasse, que l'élève relie comme il veut : antenne (long fil tendu
       sur le mur), prise de terre, bobine d'accord (1 mH), condensateur variable (100 à 1 000 pF, touches −/+ de 10 pF et
       de 100 pF), diode, résistance (10 kΩ), condensateur du détecteur (1, 10 ou 100 nF : un toucher), condensateur de
       liaison (1 µF) et écouteur. Ces pièces n'ont pas de modèle électrique : le poste calcule les tensions d'après les fils.
Reçoit : le circuit et, pour chaque pièce, { id, x, y }.
Produit : Labo.pieces_recepteur(c) -> { cv { C (F) }, cd { C (F) }, ecouteur } ; bornes : antenne « A », terre « T »,
          pièces à deux bornes « 1 », « 2 » ; fait « cv » = capacité (pF), « c_detecteur » = capacité (nF).
Utilisé par : poste_recepteur.js.
*/
(function (L) {
  const CV = Array.from({ length: 91 }, (_, k) => (100 + 10 * k) * 1e-12), CD = [1e-9, 1e-8, 1e-7];

  function piece(c, id, x, y, nom, dessin) {
    // Support à deux bornes, sans modèle électrique, avec son dessin.
    const comp = { id, g: L.svg("g", { class: `piece-${id}` }, c.calque_composants) };
    L.support_dipole(c, comp, x, y, nom);
    dessin(comp.g, x + 46, y + 16);
    comp.dipoles = () => [];
    return c.ajouter(comp);
  }

  function antenne_terre(c) {
    // Long fil d'antenne tendu le long du mur entre deux isolateurs, descente jusqu'à sa borne ; prise de terre.
    const a = { id: "ant", g: L.svg("g", { class: "antenne" }, c.calque_composants) }, t = { id: "terre", g: L.svg("g", { class: "terre" }, c.calque_composants) };
    L.svg("path", { d: "M70 312 V150 H630", fill: "none", stroke: "#b87333", "stroke-width": 2 }, a.g);
    for (const [x, y] of [[70, 150], [630, 150]]) L.svg("ellipse", { cx: x, cy: y, rx: 8, ry: 5, fill: "#efe6d0", stroke: "#8a7a5a" }, a.g);
    L.boitier(a.g, 46, 300, 50, 30, 8, { dessus: "#d9d5cc", face: "#9c978c" });
    L.texte(a.g, 71, 345, "antenne", { "font-size": 7.5, "font-weight": 700, fill: "#f4f1e6" });
    c.borne(a, "A", 71, 314, "#c9a227");
    L.boitier(t.g, 46, 420, 50, 30, 8, { dessus: "#d9d5cc", face: "#9c978c" });
    L.texte(t.g, 71, 465, "⏚ terre", { "font-size": 7.5, "font-weight": 700, fill: "#f4f1e6" });
    L.svg("path", { d: "M71 450 v18", stroke: "#3b9b3b", "stroke-width": 3, "stroke-dasharray": "5 3" }, t.g);
    c.borne(t, "T", 71, 434, "#3b9b3b");
    a.dipoles = t.dipoles = () => [];
    c.ajouter(a); c.ajouter(t);
  }

  function touche(c, x, y, t, f) {
    // Petite touche au-dessus des fils.
    const b = L.svg("g", { role: "button", "aria-label": t }, c.calque_bornes);
    L.svg("rect", { x: x - 9, y: y - 8, width: 18, height: 16, rx: 3, fill: "#e9eef2", stroke: "#8a96a0" }, b);
    L.texte(b, x, y + 4, t, { "font-size": 9, "font-weight": 700, fill: "#23315a" });
    L.glissable(b, { soulever: false, debut: () => ({ x: 0, y: 0 }), toucher: f });
  }

  function condensateur_variable(c, x, y) {
    // Condensateur variable à air : lames, bouton, afficheur de C, touches −/+ (10 pF) et «/» (100 pF).
    const cv = piece(c, "CV", x, y, "condensateur variable", (g, cx, cy) => { for (let k = 0; k < 5; k++) L.svg("path", { d: `M${cx - 18} ${cy - 6 + k * 3} h36`, stroke: "#9aa0a6", "stroke-width": 1.2 }, g); L.svg("circle", { cx, cy: cy - 10, r: 6, fill: "#222" }, g); });
    cv.C = 3e-10;
    const aff = L.svg("g", {}, cv.g), afficher = () => { aff.replaceChildren(); L.svg("rect", { x: x + 16, y: y + 58, width: 60, height: 14, rx: 2, fill: "#10201a" }, aff); L.texte(aff, x + 46, y + 68, `${Math.round(cv.C * 1e12)} pF`, { "font-size": 8, "font-weight": 700, fill: "#7dff9a", "font-family": "monospace" }); L.missions.noter("cv", Math.round(cv.C * 1e12)); };
    const pas = (s) => { cv.C = CV[Math.max(0, Math.min(CV.length - 1, Math.round(cv.C * 1e12 / 10) - 10 + s))]; afficher(); c.calculer(); };
    touche(c, x + 4, y + 65, "«", () => pas(-10)); touche(c, x + 4, y + 83, "−", () => pas(-1));
    touche(c, x + 88, y + 65, "»", () => pas(10)); touche(c, x + 88, y + 83, "+", () => pas(1));
    afficher();
    return cv;
  }

  L.pieces_recepteur = function (c) {
    // Toutes les pièces du récepteur à leur place sur la paillasse.
    antenne_terre(c);
    piece(c, "L", 140, 200, "bobine d'accord 1 mH", (g, cx, cy) => { for (let k = 0; k < 7; k++) L.svg("ellipse", { cx: cx - 18 + k * 6, cy, rx: 4, ry: 8, fill: "none", stroke: "#b86b35", "stroke-width": 1.6 }, g); });
    const cv = condensateur_variable(c, 140, 300);
    piece(c, "D", 290, 200, "diode", (g, cx, cy) => L.svg("path", { d: `M${cx - 16} ${cy} h10 M${cx + 6} ${cy} h10 M${cx - 6} ${cy - 7} v14 L${cx + 6} ${cy} Z M${cx + 6} ${cy - 7} v14`, fill: "#111", stroke: "#111", "stroke-width": 1.4 }, g));
    piece(c, "R", 290, 300, "résistance 10 kΩ", (g, cx, cy) => L.svg("rect", { x: cx - 16, y: cy - 5, width: 32, height: 10, rx: 4, fill: "#d9b77a", stroke: "#5a4420" }, g));
    const cd = piece(c, "Cd", 290, 400, "C du détecteur", () => {});
    cd.C = 1e-8;
    const ecd = L.svg("g", {}, cd.g), voir = () => { ecd.replaceChildren(); L.svg("rect", { x: 314, y: 406, width: 44, height: 20, rx: 5, fill: "#2d5fa8" }, ecd); L.texte(ecd, 336, 420, `${Math.round(cd.C * 1e9)} nF`, { "font-size": 8, "font-weight": 700, fill: "#f4f1e6" }); L.missions.noter("c_detecteur", Math.round(cd.C * 1e9)); };
    L.glissable(cd.g, { soulever: false, debut: () => ({ x: 0, y: 0 }), toucher: () => { cd.C = CD[(CD.indexOf(cd.C) + 1) % CD.length]; voir(); c.calculer(); } });
    voir();
    piece(c, "Cl", 430, 200, "liaison 1 µF", (g, cx, cy) => L.svg("rect", { x: cx - 12, y: cy - 8, width: 24, height: 14, rx: 3, fill: "#2d5fa8" }, g));
    const ecouteur = piece(c, "E", 430, 320, "écouteur", (g, cx, cy) => { L.svg("circle", { cx, cy: cy - 2, r: 12, fill: "#2b2b2b", stroke: "#000" }, g); L.svg("circle", { cx, cy: cy - 2, r: 6, fill: "#555" }, g); });
    return { cv, cd, ecouteur };
  };
})(window.Labo);
