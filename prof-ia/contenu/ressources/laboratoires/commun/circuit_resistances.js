/*
Rôle : résistances du circuit avec leur vrai code des couleurs (2 chiffres, multiplicateur, tolérance or 5 %) : sur un
       support, ou en plaquette (plusieurs résistances soudées entre des bornes nommées A, B, C, D...) ; planche de fils
       résistants (R = ρ·l/S).
Reçoit : le circuit (circuit.js) et le réglage { id, x, y, R: [valeurs en Ω], lettres: [noms des bornes] }.
Produit : Labo.code_couleurs(R) -> [4 couleurs] ; Labo.plaquette_resistances(c, reglage) -> composant { i: [courants] } ;
          Labo.resistance(c, { id, x, y, R, R_reelle, nom, lettres }) (sur support) ;
          Labo.fils_resistants(c, { x, y, fils: [{ nom, matiere, rho, l (m), S (mm²) }] }) (bornes « <nom>1 », « <nom>2 »).
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

  function resistance(g, x1, x2, y, R, nom = "") {
    // Résistance couchée entre deux pistes de cuivre : pattes métalliques, corps beige, anneaux de couleur, nom et valeur.
    const m = (x1 + x2) / 2;
    L.svg("line", { x1, y1: y, x2, y2: y, stroke: "#9aa0a6", "stroke-width": 1.6 }, g);
    L.svg("rect", { x: m - 24, y: y - 7, width: 48, height: 14, rx: 6, fill: "#e8d3a6", stroke: "#a68b55" }, g);
    L.code_couleurs(R).forEach((couleur, k) => L.svg("rect", { x: m - 17 + k * 8 + (k === 3 ? 6 : 0), y: y - 7, width: 4, height: 14, fill: couleur }, g));
    L.svg("rect", { x: m - 22, y: y - 5, width: 44, height: 3, rx: 1.5, fill: "#fff", opacity: 0.35 }, g);
    if (nom) L.texte(g, m, y + 16, `${nom} = ${R} Ω`, { "font-size": 8.5, "font-weight": 700, fill: "#f4f1e0" });
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

  L.resistance = function (c, { id, x, y, R, R_reelle = R, nom = "R", lettres = null }) {
    // Résistance sur support : anneaux de sa valeur nominale R ; sa valeur réelle R_reelle reste dans la tolérance (5 %).
    const comp = { id, R: R_reelle, i: 0, g: L.svg("g", { class: `resistance resistance-${id}` }, c.calque_composants) };
    L.support_dipole(c, comp, x, y, `${nom} : ${R >= 1000 ? R / 1000 + " kΩ" : R + " Ω"} ± 5 %`, ["1", "2"], ["#4a4f55", "#4a4f55"], lettres);
    for (const dx of [14, 78]) L.svg("line", { x1: x + dx, y1: y + 16, x2: x + dx, y2: y + 26, stroke: "#9aa0a6", "stroke-width": 1.6 }, comp.g);
    resistance(comp.g, x + 14, x + 78, y + 16, R);
    comp.dipoles = () => [{ a: "1", b: "2", g: 1 / R_reelle, j: 0 }];
    comp.mettre_a_jour = ({ i }) => { comp.i = i[0]; };
    return c.ajouter(comp);
  };

  L.fils_resistants = function (c, { id = "fils", x, y, fils }) {
    // Planche de bois : fils tendus entre deux bornes ; R = ρ·l/S (ρ en Ω·m, l en m, S en mm²). 1 m = 400 px.
    const comp = { id, g: L.svg("g", { class: "fils-resistants" }, c.calque_composants) };
    L.boitier(comp.g, x, y, 470, 40 + 46 * fils.length, 10, { dessus: "#c89b62", face: "#8d6337" });
    fils.forEach((f, k) => {
      const yy = y + 34 + 46 * k, x2 = x + 30 + f.l * 400;
      L.svg("line", { x1: x + 30, y1: yy, x2, y2: yy, stroke: f.matiere === "cuivre" ? "#c8742e" : "#b9bcc0", "stroke-width": f.S > 0.07 ? 2.2 : 1.3 }, comp.g);
      L.texte(comp.g, x + 30, yy - 14, `${f.nom} : ${f.matiere}, l = ${String(f.l.toFixed(2)).replace(".", ",")} m, S = ${String(f.S.toFixed(2)).replace(".", ",")} mm²`, { "text-anchor": "start", "font-size": 8.5, "font-weight": 700, fill: "#3b2a16" });
      c.borne(comp, `${f.nom}1`, x + 22, yy + 4, "#c9a227");
      c.borne(comp, `${f.nom}2`, x2 + 8, yy + 4, "#c9a227");
    });
    comp.dipoles = () => fils.map((f) => ({ a: `${f.nom}1`, b: `${f.nom}2`, g: (f.S * 1e-6) / (f.rho * f.l), j: 0 }));
    return c.ajouter(comp);
  };
})(window.Labo);
