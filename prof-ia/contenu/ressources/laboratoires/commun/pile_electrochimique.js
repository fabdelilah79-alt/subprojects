/*
Rôle : pile électrochimique de laboratoire, composant du circuit : deux béchers de 100 mL (50 mL de solution chacun), une lame
       métallique plongée dans chaque bécher, tenue par une pince crocodile reliée à une borne ; pont salin (tube en U de
       gel au nitrate de potassium) que l'on pose sur les deux béchers ou que l'on retire d'un toucher. Modèle : potentiel de
       chaque électrode E = E° + (0,059 / n)·log[Mⁿ⁺] ; f.é.m. = E(droite) − E(gauche) ; résistance interne 150 Ω ; sans pont
       salin, le circuit est ouvert. Le courant débité fait varier les concentrations et les masses des lames (F = 96 500 C/mol).
Reçoit : le circuit (circuit.js) et { id, x, y, gauche, droite : { metal (« cuivre », « argent », « fer », « zinc »), C (mol/L) },
         pont (posé au départ, faux par défaut) }.
Produit : Labo.pile_electrochimique(c, reglage) -> composant { i (A, du pôle − vers le pôle + dans la pile), etat() -> { pont, E (V),
          Q (C), C_gauche, C_droite, dm_gauche, dm_droite (mg) } } ; bornes « 1 » (lame de gauche) et « 2 » (lame de droite) ;
          Labo.COUPLES_METAUX.
Utilisé par : les simulations des piles (2e année du bac).
*/
(function (L) {
  const F = 96500, R_INT = 150, V_SOL = 0.05;
  L.COUPLES_METAUX = {
    cuivre: { ion: "Cu²⁺", sym: "Cu", n: 2, E0: 0.34, M: 63.5, rgb: [190, 112, 66], sol: [70, 140, 220], a: 0.55 },
    argent: { ion: "Ag⁺", sym: "Ag", n: 1, E0: 0.8, M: 107.9, rgb: [204, 208, 212], sol: [230, 240, 246], a: 0.25 },
    fer: { ion: "Fe²⁺", sym: "Fe", n: 2, E0: -0.44, M: 55.8, rgb: [112, 116, 122], sol: [176, 206, 160], a: 0.4 },
    zinc: { ion: "Zn²⁺", sym: "Zn", n: 2, E0: -0.76, M: 65.4, rgb: [170, 178, 184], sol: [230, 240, 246], a: 0.25 },
  };
  const potentiel = (m, C) => m.E0 + (0.059 / m.n) * Math.log10(Math.max(C, 1e-6));

  function demi_pile(g, x, y, m) {
    // Bécher, solution, lame métallique et pince crocodile ; inscription sous le bécher.
    L.svg("ellipse", { cx: x + 45, cy: y + 142, rx: 50, ry: 8, fill: "#000", opacity: 0.3 }, g);
    L.svg("rect", { x: x + 4, y: y + 70, width: 82, height: 66, rx: 6, fill: L.rgb(m.sol), opacity: m.a }, g);
    L.svg("rect", { x, y: y + 30, width: 90, height: 110, rx: 8, fill: "url(#verre)", stroke: "#9fb6be" }, g);
    L.svg("rect", { x: x + 38, y: y - 4, width: 14, height: 128, rx: 1.5, fill: L.rgb(m.rgb), stroke: L.rgb(m.rgb.map((v) => v * 0.6)) }, g);
    L.svg("rect", { x: x + 40, y: y - 2, width: 3, height: 124, fill: "#fff", opacity: 0.3 }, g);
    L.svg("path", { d: `M${x + 34} ${y - 2} l7 -14 h8 l7 14 z`, fill: "#2b2f33", stroke: "#111" }, g);
    L.texte(g, x + 45, y + 158, `${m.sym} | ${m.ion}`, { "font-size": 9, "font-weight": 700, fill: "#e8e2cc" });
  }

  function pont_salin(g, x, y, pose) {
    // Tube en U retourné rempli de gel : posé, ses branches plongent dans les deux béchers ; retiré, il est couché sur la table.
    g.replaceChildren();
    const d = pose ? `M${x + 70} ${y + 110} V${y + 14} Q${x + 70} ${y - 8} ${x + 95} ${y - 8} H${x + 145} Q${x + 170} ${y - 8} ${x + 170} ${y + 14} V${y + 110}` : `M${x + 60} ${y + 172} H${x + 180}`;
    L.svg("path", { d, fill: "none", stroke: "rgba(150,170,180,0.9)", "stroke-width": 11, "stroke-linecap": "round" }, g);
    L.svg("path", { d, fill: "none", stroke: "#eef2e6", "stroke-width": 7, "stroke-linecap": "round" }, g);
    L.texte(g, x + 120, pose ? y - 16 : y + 188, "pont salin (KNO₃)", { "font-size": 7.5, "font-weight": 700, fill: "#e8e2cc" });
    L.svg("rect", { x: x + 55, y: pose ? y - 24 : y + 160, width: 130, height: pose ? 30 : 34, fill: "#fff", opacity: 0.001 }, g);
  }

  L.pile_electrochimique = function (c, { id = "pile_e", x, y, gauche, droite, pont = false }) {
    // Deux demi-piles, bornes sur les pinces, pont salin touchable ; débit de la pile à chaque pas de temps.
    const mg = L.COUPLES_METAUX[gauche.metal], md = L.COUPLES_METAUX[droite.metal];
    const s = { pont, Cg: gauche.C, Cd: droite.C, Q: 0, dmg: 0, dmd: 0 }, comp = { id, i: 0, g: L.svg("g", { class: "pile-electrochimique" }, c.calque_composants) };
    demi_pile(comp.g, x, y, mg); demi_pile(comp.g, x + 150, y, md);
    const gp = L.svg("g", { class: "pont-salin", role: "button", "aria-label": "Pont salin" }, comp.g);
    pont_salin(gp, x, y, s.pont);
    L.glissable(gp, { soulever: false, debut: () => ({ x: 0, y: 0 }), toucher: () => { s.pont = !s.pont; pont_salin(gp, x, y, s.pont); c.calculer(); } });
    c.borne(comp, "1", x + 45, y - 18, "#c9a227"); c.borne(comp, "2", x + 195, y - 18, "#c9a227");
    const E = () => potentiel(md, s.Cd) - potentiel(mg, s.Cg);
    comp.dipoles = () => [s.pont ? { a: "1", b: "2", g: 1 / R_INT, j: E() / R_INT } : { a: "1", b: "2", g: 1e-12, j: 0 }];
    comp.mettre_a_jour = ({ i }) => { comp.i = i[0]; };
    setInterval(() => {
      // 0,2 s de débit : oxydation à la lame de gauche et réduction à droite si i > 0 (l'inverse sinon).
      const dq = comp.i * 0.2, ne = dq / F;
      if (Math.abs(ne) < 1e-15) return;
      s.Q += dq; s.Cg += ne / mg.n / V_SOL; s.Cd -= ne / md.n / V_SOL; s.dmg -= (ne / mg.n) * mg.M * 1000; s.dmd += (ne / md.n) * md.M * 1000;
    }, 200);
    comp.etat = () => ({ pont: s.pont, E: E(), Q: s.Q, C_gauche: s.Cg, C_droite: s.Cd, dm_gauche: s.dmg, dm_droite: s.dmd });
    return c.ajouter(comp);
  };
})(window.Labo);
