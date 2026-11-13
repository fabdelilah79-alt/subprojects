/*
Rôle : les deux paillasses de l'activité « représentation de Lewis » : (1) le tableau magnétique de l'atome (pour former
       des ions monoatomiques) et une affiche des gaz nobles ; (2) le tableau magnétique de Lewis et une affiche des
       électrons externes de H, C, N, O, Cl.
Reçoit : le groupe SVG de chaque paillasse.
Produit : Labo.poste_ions(groupe), Labo.poste_lewis(groupe) -> { pense_bete } ; faits « atome » (tableau_atome.js) et « lewis »
          (tableau_lewis.js).
Utilisé par : simulation.js.
*/
(function (L) {
  function affiche(g, x, y, titre, lignes, pied) {
    // Affiche murale : titre, lignes de texte, phrase en bas.
    const h = 40 + lignes.length * 18 + (pied ? 30 : 0);
    L.svg("rect", { x, y, width: 186, height: h, rx: 3, fill: "#fdfdf8", stroke: "#c9c4b0", filter: "url(#ombre)" }, g);
    L.texte(g, x + 93, y + 18, titre, { "font-size": 10.5, "font-weight": 700, fill: "#23315a" });
    lignes.forEach((t, i) => L.texte(g, x + 12, y + 42 + i * 18, t, { "font-size": 9.5, "text-anchor": "start", fill: "#222" }));
    if (pied) pied.forEach((t, i) => L.texte(g, x + 93, y + h - 22 + i * 11, t, { "font-size": 7.6, fill: "#555", "font-style": "italic" }));
  }

  L.poste_ions = function (g) {
    // Paillasse 1 : tableau de l'atome, affiche des gaz nobles.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 200);
    L.tableau_atome(g, "atome");
    affiche(g, 820, 60, "Les gaz nobles", ["He (Z = 2) : (K)²", "Ne (Z = 10) : (K)²(L)⁸", "Ar (Z = 18) : (K)²(L)⁸(M)⁸"], ["Couche externe pleine : ils", "restent à l'état d'atomes isolés."]);
    return { pense_bete };
  };

  L.poste_lewis = function (g) {
    // Paillasse 2 : tableau de Lewis, affiche des électrons externes.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 200);
    L.tableau_lewis(g, "lewis");
    affiche(g, 820, 60, "Électrons externes", ["H : 1   (duet)", "C : 4   N : 5", "O : 6   Cl : 7", "1 doublet = 2 électrons"], ["Liant : entre deux atomes.", "Non liant : sur un seul atome."]);
    return { pense_bete };
  };
})(window.Labo);
