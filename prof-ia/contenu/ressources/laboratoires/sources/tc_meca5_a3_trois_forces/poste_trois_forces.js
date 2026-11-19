/*
Rôle : paillasse « trois forces » : table à forces au mur, rapporteur, construction du polygone des forces, carte d'échelle.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_trois_forces(groupe) -> { pense_bete }.
Utilisé par : simulation.js.
*/
(function (L) {
  L.poste_trois_forces = function (g) {
    // Assemble la table à forces, le rapporteur (posé sur le mur, à droite) et, par-dessus, les vecteurs du polygone.
    const table = L.table_forces(g);
    L.svg("rect", { x: 856, y: 100, width: 150, height: 52, rx: 3, fill: "#f7f5ee", stroke: "#c9c3b0" }, g);
    L.texte(g, 931, 114, "Échelle des forces", { class: "etiquette-carton", "font-size": 14 });
    L.svg("line", { x1: 886, y1: 136, x2: 916, y2: 136, stroke: "#333", "stroke-width": 2 }, g);
    L.texte(g, 950, 137, "↔ 0,5 N", { class: "etiquette-carton", "font-size": 14 });
    const rapporteur = L.rapporteur(g, () => table.etat().O, { x: 930, y: 260 });
    L.polygone(g, table);
    table.sur_changement(() => rapporteur.recaler());
    return { pense_bete: L.decor.pense_bete(g, 24, 52, 150, 160) };
  };
})(window.Labo);
