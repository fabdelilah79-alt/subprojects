/*
Rôle : diodes du circuit, sur support : diode au silicium 1N4007 (seuil vers 0,6 V) et diode Zener 5,1 V (en inverse,
       elle conduit dès que la tension atteint environ 5,1 V). Caractéristiques exponentielles réalistes ; bague de la
       cathode dessinée sur le corps, symbole normalisé sur le support. Borne « A » (anode) à gauche, « K » (cathode) à droite.
Reçoit : le circuit (circuit.js) et le réglage { id, x, y, lettres }.
Produit : Labo.diode(c, reglage), Labo.zener(c, reglage) -> composant { i (A, de A vers K), u (V, U_AK) } ;
          Labo.courant_diode(u), Labo.courant_zener(u) (A).
Utilisé par : les postes des simulations de caractéristiques.
*/
(function (L) {
  const IS = 5e-9, NVT = 0.0491, IZ = 1e-3, UZ = 4.939, VZ = 0.1;

  function exponentielle(x) {
    // exp(x), prolongée par sa tangente au-delà de x = 40 (évite les débordements pendant le calcul).
    return x < 40 ? Math.exp(x) : Math.exp(40) * (1 + x - 40);
  }

  L.courant_diode = (u) => IS * (exponentielle(u / NVT) - 1);
  L.courant_zener = (u) => L.courant_diode(u) - IZ * (exponentielle((-u - UZ) / VZ) - exponentielle(-UZ / VZ));

  function symbole(g, cx, cy, zener) {
    // Triangle (sens passant de A vers K) et barre ; barre à ailettes pour la Zener.
    const trait = { stroke: "#222", "stroke-width": 1.3, fill: "none" };
    L.svg("path", { d: `M${cx - 21} ${cy} H${cx - 6} M${cx + 6} ${cy} H${cx + 21}`, ...trait }, g);
    L.svg("path", { d: `M${cx - 6} ${cy - 7} V${cy + 7} L${cx + 6} ${cy} Z`, fill: "#222" }, g);
    L.svg("path", { d: zener ? `M${cx + 2} ${cy - 9} l4 2 V${cy + 7} l4 2` : `M${cx + 6} ${cy - 7} V${cy + 7}`, ...trait }, g);
  }

  function corps(g, x, y, zener) {
    // Corps de la diode couché au-dessus du symbole : noir à bague argentée (1N4007) ou verre orangé à bague noire (Zener).
    L.svg("line", { x1: x + 14, y1: y + 14, x2: x + 78, y2: y + 14, stroke: "#9aa0a6", "stroke-width": 1.4 }, g);
    L.svg("rect", { x: x + 32, y: y + 8, width: 28, height: 12, rx: 3, fill: zener ? "#e88f3a" : "#1e1f21", opacity: zener ? 0.85 : 1 }, g);
    L.svg("rect", { x: x + 53, y: y + 8, width: 4, height: 12, fill: zener ? "#1e1f21" : "#d6d8da" }, g);
    for (const dx of [14, 78]) L.svg("line", { x1: x + dx, y1: y + 14, x2: x + dx, y2: y + 26, stroke: "#9aa0a6", "stroke-width": 1.4 }, g);
  }

  function construire(c, { id, x, y, lettres = ["A", "K"] }, zener) {
    // Support, corps, symbole et modèle électrique de la diode.
    const comp = { id, i: 0, u: 0, g: L.svg("g", { class: `diode diode-${id}` }, c.calque_composants) };
    L.support_dipole(c, comp, x, y, zener ? "Zener 5,1 V" : "Diode 1N4007", ["A", "K"], ["#4a4f55", "#4a4f55"], lettres);
    corps(comp.g, x, y, zener);
    symbole(comp.g, x + 46, y + 33, zener);
    const dipole = L.dipole_non_lineaire("A", "K", zener ? L.courant_zener : L.courant_diode, 0.08);
    comp.dipoles = () => [dipole];
    comp.mettre_a_jour = ({ u, i }) => { comp.i = i[0]; comp.u = u("A", "K"); };
    return c.ajouter(comp);
  }

  L.diode = (c, reglage) => construire(c, reglage, false);
  L.zener = (c, reglage) => construire(c, reglage, true);
})(window.Labo);
