/*
Rôle : résistance chauffante plongée dans un calorimètre : bornier isolant (deux bornes) tenu par une tige, deux fils
       gainés qui descendent dans l'ouverture du calorimètre jusqu'à la résistance (cachée par la paroi). Elle reçoit
       l'énergie électrique et la cède à l'eau sous forme de chaleur : P = R·I².
Reçoit : le circuit (circuit.js) et le réglage { id, x, y (coin du bornier), R (Ω), sol (y de la paillasse), xd (x des
         fils dans l'ouverture), haut (y de l'ouverture) }.
Produit : Labo.resistance_chauffante(c, reglage) -> composant { i (A), P (W) } ; bornes « 1 » et « 2 ».
Utilisé par : poste_joule.js.
*/
(function (L) {
  L.resistance_chauffante = function (c, { id = "rc", x, y, R, sol, xd, haut }) {
    // Tige, bornier, étiquette, fils jusqu'à l'eau ; modèle électrique : conductance 1/R.
    const comp = { id, R, i: 0, P: 0, g: L.svg("g", { class: "resistance-chauffante" }, c.calque_composants) };
    L.tige(comp.g, `M${x + 28} ${sol} V${y + 30}`, 5);
    L.svg("rect", { x: x + 6, y: sol - 6, width: 44, height: 7, rx: 2, fill: "#3a3f44" }, comp.g);
    [["#c62828", 8], ["#263238", 15]].forEach(([couleur, dy]) => L.svg("path", { d: `M${x + 56} ${y + dy} H${xd + 15 - dy} V${haut + 4}`, fill: "none", stroke: couleur, "stroke-width": 2.4, "stroke-linejoin": "round" }, comp.g));
    L.boitier(comp.g, x, y, 56, 30, 8, { dessus: "#3d4247", face: "#24282c" });
    L.svg("rect", { x: x - 6, y: y - 22, width: 68, height: 16, rx: 2, fill: "#fdfdf8", stroke: "#c9c4b0" }, comp.g);
    L.texte(comp.g, x + 28, y - 14, `R = ${String(R.toFixed(1)).replace(".", ",")} Ω`, { "font-size": 8, "font-weight": 700, fill: "#222" });
    c.borne(comp, "1", x + 14, y + 20, "#4a4f55");
    c.borne(comp, "2", x + 42, y + 20, "#4a4f55");
    comp.dipoles = () => [{ a: "1", b: "2", g: 1 / R, j: 0 }];
    comp.mettre_a_jour = ({ i }) => { comp.i = i[0] || 0; comp.P = R * comp.i * comp.i; };
    return c.ajouter(comp);
  };
})(window.Labo);
