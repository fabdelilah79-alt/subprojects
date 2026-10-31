/*
Rôle : accumulateur au plomb de laboratoire, composant du circuit : bécher d'acide sulfurique dilué (0,5 mol/L), deux plaques de
       plomb tenues par un couvercle à fentes, pinces crocodiles. Modèle simplifié : charge stockée q (C, signée : q > 0 si la
       plaque 2 est le pôle +) ; f.é.m. E = 2,05·(1 − e^(−|q|/0,3)) V ; résistance interne 3 Ω ; rendement de charge 70 %
       (le reste électrolyse l'eau : bulles), 60 C au plus. Pendant la charge, la plaque reliée au + du générateur se couvre
       de dioxyde de plomb (brun) ; neuves, les deux plaques sont identiques et E = 0.
Reçoit : le circuit (circuit.js) et { id, x, y }.
Produit : Labo.accumulateur_plomb(c, reglage) -> composant { i (A, de la borne 1 vers la borne 2 dans l'accumulateur),
          etat() -> { q (C), E (V), plus ("1", "2" ou null) } } ; bornes « 1 » (plaque de gauche) et « 2 » (plaque de droite).
Utilisé par : poste_accumulateur.js.
*/
(function (L) {
  const R_INT = 3, Q_MAX = 60, RENDEMENT = 0.7;

  function plaque(g, bx, y) {
    // Plaque de plomb gris terne, avec sa couche brune (dioxyde de plomb) dont on règle l'opacité.
    L.svg("rect", { x: bx - 9, y: y - 10, width: 18, height: 128, rx: 1, fill: "#7d838a", stroke: "#4c5056" }, g);
    L.svg("rect", { x: bx - 7, y: y - 8, width: 3, height: 124, fill: "#fff", opacity: 0.15 }, g);
    const brun = L.svg("rect", { x: bx - 9, y: y + 36, width: 18, height: 82, rx: 1, fill: "#4a2a17", opacity: 0 }, g);
    L.svg("path", { d: `M${bx - 6} ${y - 6} l-2 -12 h16 l-2 12 z`, fill: "#2b2f33", stroke: "#111" }, g);
    return brun;
  }

  function cuve(g, x, y) {
    // Bécher, acide sulfurique dilué, couvercle en plexiglas à deux fentes, étiquette.
    L.svg("ellipse", { cx: x + 60, cy: y + 152, rx: 66, ry: 9, fill: "#000", opacity: 0.3 }, g);
    L.svg("rect", { x: x + 4, y: y + 44, width: 112, height: 102, rx: 6, fill: "#e4eef0", opacity: 0.7 }, g);
    L.svg("rect", { x, y: y + 12, width: 120, height: 138, rx: 8, fill: "url(#verre)", stroke: "#9fb6be" }, g);
  }

  function couvercle(g, x, y) {
    // Couvercle posé sur le bord du bécher, devant les plaques qui le traversent.
    L.svg("rect", { x: x - 6, y: y + 6, width: 132, height: 9, rx: 2, fill: "rgba(225,235,240,0.85)", stroke: "#8aa1aa" }, g);
    L.texte(g, x + 60, y + 166, "Pb | H₂SO₄ (0,5 mol/L) | Pb", { "font-size": 8.5, "font-weight": 700, fill: "#e8e2cc" });
  }

  function bulles(g, x, y, comp) {
    // Petites bulles sur les deux plaques quand l'accumulateur est en charge (électrolyse de l'eau).
    const liste = [];
    let avant = null;
    const image = (t) => {
      const dt = avant === null ? 0 : Math.min(0.05, (t - avant) / 1000);
      avant = t;
      if (comp.en_charge && Math.random() < Math.abs(comp.i) * 60 * dt * 60) liste.push({ x: x + (Math.random() < 0.5 ? 32 : 88) + (Math.random() < 0.5 ? -11 : 11), y: y + 130, r: 0.8 + Math.random() });
      g.replaceChildren();
      for (const b of liste) { b.y -= 40 * dt; L.svg("circle", { cx: b.x, cy: b.y, r: b.r, fill: "#fff", opacity: 0.85 }, g); }
      while (liste.length && liste[0].y < y + 48) liste.shift();
      requestAnimationFrame(image);
    };
    requestAnimationFrame(image);
  }

  L.accumulateur_plomb = function (c, { id = "accu", x, y }) {
    // Cuve, plaques, couvercle, bornes ; modèle de Norton E(q), r ; charge et décharge cinq fois par seconde.
    const comp = { id, i: 0, en_charge: false, g: L.svg("g", { class: "accumulateur-plomb" }, c.calque_composants) };
    const s = { q: 0 };
    cuve(comp.g, x, y);
    const bruns = [plaque(comp.g, x + 32, y + 10), plaque(comp.g, x + 88, y + 10)];
    bulles(L.svg("g", { "pointer-events": "none" }, comp.g), x, y, comp);
    couvercle(comp.g, x, y);
    c.borne(comp, "1", x + 32, y - 14, "#c9a227"); c.borne(comp, "2", x + 88, y - 14, "#c9a227");
    const E = () => Math.sign(s.q) * 2.05 * (1 - Math.exp(-Math.abs(s.q) / 0.3));
    comp.dipoles = () => [{ a: "1", b: "2", g: 1 / R_INT, j: E() / R_INT }];
    comp.mettre_a_jour = ({ i }) => { comp.i = i[0]; comp.en_charge = Math.abs(comp.i) > 1e-3 && (s.q === 0 || comp.i * s.q < 0); };
    setInterval(() => {
      // Le courant qui entre par une plaque la rend pôle + (charge) ; celui qu'elle débite la décharge.
      const dq = -comp.i * 0.2 * (comp.en_charge ? RENDEMENT : 1);
      if (Math.abs(dq) < 1e-9) return;
      s.q = Math.max(-Q_MAX, Math.min(Q_MAX, s.q + dq));
      const a = Math.min(0.9, Math.abs(s.q) / 12);
      bruns[0].setAttribute("opacity", s.q < 0 ? a : 0); bruns[1].setAttribute("opacity", s.q > 0 ? a : 0);
      c.calculer();
    }, 200);
    comp.etat = () => ({ q: s.q, E: E(), plus: Math.abs(s.q) < 0.05 ? null : s.q > 0 ? "2" : "1" });
    return c.ajouter(comp);
  };
})(window.Labo);
