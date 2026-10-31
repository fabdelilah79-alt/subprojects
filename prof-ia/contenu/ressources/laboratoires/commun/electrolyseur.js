/*
Rôle : électrolyseur : cuve contenant une solution de soude et deux électrodes de nickel. Récepteur de force
       contre-électromotrice E' et de résistance interne r' : aucun courant tant que U < E' ; au-delà, U = E' + r'·I
       (le coude réel est arrondi). Des bulles de gaz montent des électrodes quand le courant passe : deux fois plus à la
       cathode (dihydrogène) qu'à l'anode (dioxygène).
Reçoit : le circuit (circuit.js) et le réglage { id, x, y, E (V, force contre-électromotrice E'), r (Ω, r'), lettres }.
Produit : Labo.electrolyseur(c, reglage) -> composant { i (A), u (V) } ; bornes « 1 » et « 2 ».
Utilisé par : les postes des simulations de dipôles actifs.
*/
(function (L) {
  const ARRONDI = 0.04;

  function courant(u, E, r) {
    // Caractéristique I(U) : nulle sous E', puis (U − E')/r', raccordées en douceur (dans les deux sens de branchement).
    const v = Math.abs(u) - E, lisse = v > 20 * ARRONDI ? v : ARRONDI * Math.log1p(Math.exp(v / ARRONDI));
    return (Math.sign(u) * lisse) / r;
  }

  function cuve(g, x, y) {
    // Cuve de verre, solution, électrodes de nickel et leurs bornes de couleur neutre.
    L.svg("ellipse", { cx: x + 70, cy: y + 132, rx: 76, ry: 12, fill: "#000", opacity: 0.3 }, g);
    L.svg("rect", { x: x + 4, y: y + 50, width: 132, height: 78, rx: 6, fill: "#d6ecf3", opacity: 0.75 }, g);
    L.svg("rect", { x: x, y: y + 20, width: 140, height: 112, rx: 8, fill: "url(#verre)", stroke: "#9fb6be" }, g);
    for (const dx of [34, 106]) L.svg("rect", { x: x + dx - 6, y: y + 10, width: 12, height: 104, rx: 2, fill: "#a7adb2", stroke: "#6e757b" }, g);
    L.svg("rect", { x: x - 6, y: y + 2, width: 152, height: 12, rx: 3, fill: "#2b2f33" }, g);
    L.texte(g, x + 70, y + 148, "Électrolyseur (solution de soude)", { "font-size": 8.5, "font-weight": 700, fill: "#e8e2cc" });
  }

  L.electrolyseur = function (c, { id = "electrolyseur", x, y, E = 1.7, r = 8, lettres = null }) {
    // Construit la cuve, ses bornes, son modèle électrique et l'animation des bulles.
    const comp = { id, i: 0, u: 0, g: L.svg("g", { class: "electrolyseur" }, c.calque_composants) };
    cuve(comp.g, x, y);
    c.borne(comp, "1", x + 34, y + 2, "#c9a227");
    c.borne(comp, "2", x + 106, y + 2, "#c9a227");
    if (lettres) [[16, lettres[0]], [124, lettres[1]]].forEach(([dx, t]) => L.texte(comp.g, x + dx, y + 26, t, { "font-size": 11, "font-weight": 700, fill: "#1a3d7c" }));
    const dipole = L.dipole_non_lineaire("1", "2", (u) => courant(u, E, r), 0.3);
    comp.dipoles = () => [dipole];
    comp.mettre_a_jour = ({ u, i }) => { comp.i = i[0]; comp.u = u("1", "2"); };
    const bulles = L.svg("g", { "pointer-events": "none" }, comp.g), liste = [];
    let avant = null;
    const image = (t) => {
      const dt = avant === null ? 0 : Math.min(0.05, (t - avant) / 1000);
      avant = t;
      // Le courant entre par l'anode et sort par la cathode ; la cathode dégage deux fois plus de gaz (dihydrogène).
      const cathode = comp.i >= 0 ? 106 : 34, anode = comp.i >= 0 ? 34 : 106;
      if (Math.random() < Math.abs(comp.i) * 40 * dt * 60) liste.push({ x: x + (Math.random() < 2 / 3 ? cathode : anode) + (Math.random() - 0.5) * 12, y: y + 110, r: 1 + Math.random() * 1.5 });
      bulles.replaceChildren();
      for (const b of liste) { b.y -= 40 * dt; L.svg("circle", { cx: b.x, cy: b.y, r: b.r, fill: "#fff", opacity: 0.8 }, bulles); }
      while (liste.length && liste[0].y < y + 52) liste.shift();
      requestAnimationFrame(image);
    };
    requestAnimationFrame(image);
    return c.ajouter(comp);
  };
})(window.Labo);
