/*
Rôle : transistor NPN (type BC547) sur support, bornes B (base), C (collecteur), E (émetteur). Modèle d'Ebers-Moll :
       jonction base-émetteur (seuil vers 0,65 V), jonction base-collecteur, courant de transfert. Il donne les trois
       régimes : bloqué (I_B = 0, donc I_C = 0), linéaire (I_C = β·I_B, β ≈ 150), saturé (U_CE ≈ 0,1 V, I_C < β·I_B).
Reçoit : le circuit (circuit.js) et le réglage { id, x, y, beta }.
Produit : Labo.transistor(c, reglage) -> composant { IB, IC, IE (A), UBE, UCE (V), regime } ;
          fait noté « transistor_<id> » = { regime, IB, IC, UCE } à chaque calcul.
Utilisé par : les postes des simulations d'électronique.
*/
(function (L) {
  const IS = 1e-14, VT = 0.02585, BR = 2, PAS = 0.08;
  const ex = (x) => (x < 40 ? Math.exp(x) : Math.exp(40) * (1 + x - 40));
  const jonction = (v) => IS * (ex(v / VT) - 1), pente = (v) => (IS / VT) * (v / VT < 40 ? Math.exp(v / VT) : Math.exp(40));

  function transfert() {
    // Courant de transfert C → E : I_T = I_F(V_BE) − I_R(V_BC), linéarisé en V_BE et V_BC (sources commandées).
    const d = { a: "C", b: "E", g: 1e-12, j: 0, ctrl: [{ c: "B", d: "E", g: 0 }, { c: "B", d: "C", g: 0 }], vbe: 0, vbc: 0 };
    const tangente = () => {
      const gF = pente(d.vbe), gR = pente(d.vbc);
      d.ctrl[0].g = gF; d.ctrl[1].g = -gR;
      d.j = jonction(d.vbe) - jonction(d.vbc) - gF * d.vbe + gR * d.vbc;
    };
    tangente();
    d.ajuster = (u, i, [vbe, vbc]) => {
      const nbe = d.vbe + Math.max(-PAS, Math.min(PAS, vbe - d.vbe)), nbc = d.vbc + Math.max(-PAS, Math.min(PAS, vbc - d.vbc));
      if (Math.abs(nbe - d.vbe) < 1e-6 && Math.abs(nbc - d.vbc) < 1e-6) return false;
      Object.assign(d, { vbe: nbe, vbc: nbc });
      tangente();
      return true;
    };
    return d;
  }

  function dessiner(g, x, y) {
    // Support, boîtier TO-92 noir vu de dessus, côté plat devant : pattes C, B, E (brochage du BC547) plantées dans le support.
    L.boitier(g, x, y, 132, 58, 12, { dessus: "#e3e1da", face: "#a8a59b" });
    L.svg("path", { d: `M${x + 22} ${y + 18} a14 14 0 0 1 28 0 Z`, fill: "#1b1c1e" }, g);
    L.texte(g, x + 36, y + 14, "BC547", { "font-size": 5, fill: "#bbb" });
    for (const [t, dx] of [["C", 29], ["B", 36], ["E", 43]]) {
      L.svg("path", { d: `M${x + dx} ${y + 18} V${y + 25}`, stroke: "#9aa0a6", "stroke-width": 1.4 }, g);
      L.svg("circle", { cx: x + dx, cy: y + 26, r: 1.4, fill: "#555" }, g);
      L.texte(g, x + dx, y + 32, t, { "font-size": 5, fill: "#555" });
    }
    const s = { stroke: "#222", "stroke-width": 1.3, fill: "none" }, cx = x + 92, cy = y + 16;
    L.svg("path", { d: `M${cx - 16} ${cy} H${cx - 4} M${cx - 4} ${cy - 8} V${cy + 8} M${cx - 4} ${cy - 3} L${cx + 8} ${cy - 10} M${cx - 4} ${cy + 3} L${cx + 8} ${cy + 10}`, ...s }, g);
    L.svg("path", { d: `M${cx + 8} ${cy + 10} l-5.5 -1 l2.6 -3.6 Z`, fill: "#222" }, g);
    L.texte(g, x + 66, y + 66, "Transistor NPN", { "font-size": 8, "font-weight": 700, fill: "#2a2a28" });
    for (const [t, dx] of [["B", 18], ["C", 66], ["E", 114]]) L.texte(g, x + dx - 12, y + 30, t, { "font-size": 10, "font-weight": 700, fill: "#1a3d7c" });
  }

  L.transistor = function (c, { id = "t", x, y, beta = 150 }) {
    // Construit le transistor : jonctions B-E et B-C (diodes), transfert C → E ; régime déduit des courants.
    const comp = { id, IB: 0, IC: 0, IE: 0, UBE: 0, UCE: 0, regime: "bloqué", g: L.svg("g", { class: `transistor transistor-${id}` }, c.calque_composants) };
    dessiner(comp.g, x, y);
    for (const [nom, dx] of [["B", 18], ["C", 66], ["E", 114]]) c.borne(comp, nom, x + dx, y + 44, "#4a4f55");
    const be = L.dipole_non_lineaire("B", "E", (v) => jonction(v) / beta, PAS), bc = L.dipole_non_lineaire("B", "C", (v) => jonction(v) / BR, PAS), t = transfert();
    comp.dipoles = () => [be, bc, t];
    comp.mettre_a_jour = ({ u, i }) => {
      Object.assign(comp, { IB: i[0] + i[1], IC: i[2] - i[1], IE: i[0] + i[2], UBE: u("B", "E"), UCE: u("C", "E") });
      comp.regime = comp.IC < 1e-6 ? "bloqué" : comp.UCE < 0.3 ? "saturé" : "linéaire";
      const r = (v) => Number(v.toPrecision(4));
      L.missions.noter(`transistor_${id}`, { regime: comp.regime, IB: r(comp.IB), IC: r(comp.IC), UCE: r(comp.UCE) });
    };
    return c.ajouter(comp);
  };
})(window.Labo);
