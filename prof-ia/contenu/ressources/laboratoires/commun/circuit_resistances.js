/*
Rôle : résistances du circuit avec leur vrai code des couleurs (2 chiffres, multiplicateur, tolérance or 5 %), et
       plaquette de résistances en série : plusieurs résistances soudées entre des bornes nommées (A, B, C, D...).
Reçoit : le circuit (circuit.js) et le réglage { id, x, y, R: [valeurs en Ω], lettres: [noms des bornes] }.
Produit : Labo.code_couleurs(R) -> [4 couleurs] ; Labo.plaquette_resistances(c, reglage) -> composant { i: [courants] } ;
          bornes nommées par leurs lettres.
Utilisé par : les postes des simulations de tension.
*/
(function (L) {
  const COULEURS = ["#111111", "#7b4a1e", "#d32f2f", "#f57c00", "#fdd835", "#2e7d32", "#1565c0", "#7b1fa2", "#8d8d8d", "#f5f5f5"];
  const OR = "#c9a227", ECART = 96;

  L.code_couleurs = function (R) {
    // Deux premiers chiffres, puis le multiplicateur (nombre de zéros), puis la tolérance (or : 5 %).
    const zeros = Math.floor(Math.log10(R)) - 1, deux = Math.round(R / Math.pow(10, zeros));
    return [COULEURS[Math.floor(deux / 10)], COULEURS[deux % 10], COULEURS[zeros], OR];
  };

  function resistance(g, x1, x2, y, R, nom) {
    // Résistance couchée entre deux pistes de cuivre : pattes métalliques, corps beige, anneaux de couleur, nom et valeur.
    const m = (x1 + x2) / 2;
    L.svg("line", { x1, y1: y, x2, y2: y, stroke: "#9aa0a6", "stroke-width": 1.6 }, g);
    L.svg("rect", { x: m - 24, y: y - 7, width: 48, height: 14, rx: 6, fill: "#e8d3a6", stroke: "#a68b55" }, g);
    L.code_couleurs(R).forEach((couleur, k) => L.svg("rect", { x: m - 17 + k * 8 + (k === 3 ? 6 : 0), y: y - 7, width: 4, height: 14, fill: couleur }, g));
    L.svg("rect", { x: m - 22, y: y - 5, width: 44, height: 3, rx: 1.5, fill: "#fff", opacity: 0.35 }, g);
    L.texte(g, m, y + 16, `${nom} = ${R} Ω`, { "font-size": 8.5, "font-weight": 700, fill: "#f4f1e0" });
  }

  L.plaquette_resistances = function (c, { id = "plaquette", x, y, R = [100, 220, 330], lettres = ["A", "B", "C", "D"] }) {
    // Plaquette en époxy verte : bornes nommées, résistances soudées entre deux bornes voisines.
    const comp = { id, i: [], g: L.svg("g", { class: "plaquette" }, c.calque_composants) };
    const largeur = ECART * R.length + 40;
    L.boitier(comp.g, x, y, largeur, 64, 8, { dessus: "#2f6b45", face: "#1f4a30" });
    L.svg("rect", { x: x + 6, y: y + 6, width: largeur - 12, height: 52, rx: 3, fill: "none", stroke: "#c9b26a", "stroke-width": 0.8, opacity: 0.6 }, comp.g);
    const bx = (k) => x + 20 + k * ECART;
    lettres.forEach((t, k) => L.svg("line", { x1: bx(k), y1: y + 24, x2: bx(k), y2: y + 44, stroke: "#c98a3a", "stroke-width": 3 }, comp.g));
    R.forEach((r, k) => resistance(comp.g, bx(k), bx(k + 1), y + 24, r, `R${k + 1}`));
    lettres.forEach((t, k) => {
      L.texte(comp.g, bx(k), y + 9, t, { "font-size": 11, "font-weight": 700, fill: "#f4f1e0" });
      c.borne(comp, t, bx(k), y + 46, "#c9a227");
    });
    comp.dipoles = () => R.map((r, k) => ({ a: lettres[k], b: lettres[k + 1], g: 1 / r, j: 0 }));
    comp.mettre_a_jour = ({ i }) => { comp.i = i; };
    return c.ajouter(comp);
  };
})(window.Labo);
