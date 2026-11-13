/*
Rôle : affiche murale « Masses des noyaux » : 21 noyaux (symbole, Z, A, masse du noyau en u, à 10⁻⁶ u près), rangés en
       trois colonnes par A croissant, et les constantes utiles (proton, neutron, électron, u, eV, c).
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.affiche_masses(g).
Utilisé par : simulation.js.
*/
(function (L) {
  const X = 270, Y = 30, LARG = 740;

  function ligne(g, x, y, k) {
    // Une ligne du tableau : symbole, Z, A, masse.
    const v = [k.symbole, String(k.z), String(k.a), `${k.m.toFixed(6).replace(".", ",")} u`];
    v.forEach((s, i) => L.texte(g, x + [0, 62, 92, 128][i], y, s, { "font-size": i ? 9 : 10, "font-weight": i ? 400 : 700, fill: "#222", "text-anchor": "start", "font-family": i === 3 ? "monospace" : "inherit" }));
  }

  L.affiche_masses = function (g) {
    // Cadre, titre, trois colonnes de sept noyaux, constantes.
    L.svg("rect", { x: X, y: Y, width: LARG, height: 300, rx: 3, fill: "#fbfbf7", stroke: "#b9b4a6", filter: "url(#ombre)" }, g);
    L.texte(g, X + LARG / 2, Y + 20, "Masses des NOYAUX (en unités de masse atomique u)", { "font-size": 10, "font-weight": 700, fill: "#23315a" });
    const liste = Object.values(L.NOYAUX).sort((a, b) => a.a - b.a || a.z - b.z);
    for (let c = 0; c < 3; c++) {
      const x = X + 24 + c * 242;
      ["noyau", "Z", "A", "masse"].forEach((s, i) => L.texte(g, x + [0, 62, 92, 128][i], Y + 46, s, { "font-size": 8, "font-weight": 700, fill: "#555", "text-anchor": "start" }));
      liste.slice(c * 7, c * 7 + 7).forEach((k, i) => ligne(g, x, Y + 68 + i * 24, k));
    }
    const N = L.NUCLEONS;
    L.texte(g, X + LARG / 2, Y + 252, `proton : mp = ${String(N.mp).replace(".", ",")} u   ·   neutron : mn = ${String(N.mn).replace(".", ",")} u   ·   électron : me = ${String(N.me).replace(".", ",")} u`, { "font-size": 9, fill: "#222" });
    L.texte(g, X + LARG / 2, Y + 274, "1 u = 1,66054 × 10⁻²⁷ kg = 931,5 MeV/c²   ·   1 eV = 1,602 × 10⁻¹⁹ J   ·   c = 2,998 × 10⁸ m/s   ·   NA = 6,022 × 10²³ mol⁻¹", { "font-size": 9, fill: "#222" });
  };
})(window.Labo);
