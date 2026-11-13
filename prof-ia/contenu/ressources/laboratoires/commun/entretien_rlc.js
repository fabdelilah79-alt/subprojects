/*
Rôle : dispositif d'entretien des oscillations d'un circuit RLC (montage à amplificateur opérationnel, alimenté en ±15 V à
       l'intérieur du boîtier) : rôle fonctionnel seulement. Entre ses deux bornes, il se comporte comme une « résistance
       négative » : u = −R₀·i (il fournit au circuit l'énergie P = R₀·i²). Au-delà de 40 mA, l'amplificateur sature : le
       dispositif se comporte alors comme une résistance positive de 100 Ω, qui limite l'amplitude. Touches − et + : R₀.
       Une résistance d'entrée de 10 kΩ relie ses bornes.
Reçoit : le circuit et { id, x, y, valeurs [Ω], R0 (Ω) }.
Produit : Labo.entretien_rlc(c, reglage) -> comp { R0, i } ; bornes « 1 », « 2 » ; fait « <id> » = R₀ (Ω).
Utilisé par : poste_rlc.js (simulations du circuit RLC).
*/
(function (L) {
  const I_SAT = 0.04, R_SAT = 100, G_ENTREE = 1e-4;

  function dipole(comp) {
    // i(1 → 2) = −u/R₀ tant que |i| ≤ 40 mA ; au-delà, droite de pente 1/100 Ω qui prolonge la caractéristique.
    const d = { a: "1", b: "2", g: 0, j: 0, sature: 0 };
    d.regler = () => {
      if (!comp.R0) return Object.assign(d, { g: 1000, j: 0 });
      const s = d.sature, ub = comp.R0 * I_SAT;
      return Object.assign(d, s ? { g: 1 / R_SAT, j: s * (I_SAT + ub / R_SAT) } : { g: -1 / comp.R0, j: 0 });
    };
    d.ajuster = (u, i) => {
      const dehors = Math.abs(i) > I_SAT * (d.sature ? 0.9999 : 1.0001), s = comp.R0 && dehors ? Math.sign(i) : 0;
      if (s === d.sature) return false;
      d.sature = s; d.regler();
      return true;
    };
    return d.regler();
  }

  L.entretien_rlc = function (c, { id = "D", x, y, valeurs = [0, 5, 10, 15, 20, 25, 30, 40], R0 = 0 }) {
    // Boîtier, voyant, afficheur de R₀, touches − et + (au-dessus des fils), deux bornes.
    const comp = { id, R0, i: 0, g: L.svg("g", { class: `entretien entretien-${id}` }, c.calque_composants) };
    L.boitier(comp.g, x, y, 150, 60, 14, { dessus: "#c9d3dc", face: "#56616b" });
    L.texte(comp.g, x + 75, y + 10, "DISPOSITIF D'ENTRETIEN", { "font-size": 6.5, "font-weight": 700, fill: "#23315a" });
    L.texte(comp.g, x + 75, y + 18, "amplificateur opérationnel, ±15 V", { "font-size": 5.5, fill: "#3a4654" });
    L.svg("circle", { cx: x + 12, cy: y + 12, r: 3, fill: "#5cff7a", stroke: "#1d5e2a" }, comp.g);
    L.svg("rect", { x: x + 45, y: y + 22, width: 60, height: 16, rx: 2, fill: "#1d2a22", stroke: "#000" }, comp.g);
    const ecran = L.svg("g", {}, comp.g), afficher = () => { ecran.replaceChildren(); L.texte(ecran, x + 75, y + 34, `R₀ = ${comp.R0} Ω`, { "font-size": 8, "font-weight": 700, fill: "#7dff9a", "font-family": "monospace" }); L.missions.noter(id, comp.R0); };
    const d = dipole(comp);
    [[-1, "−", x + 30], [1, "+", x + 120]].forEach(([s, t, bx]) => {
      const b = L.svg("g", { class: s > 0 ? "plus" : "moins", role: "button", "aria-label": s > 0 ? "Augmenter R0" : "Diminuer R0" }, c.calque_bornes);
      L.svg("rect", { x: bx - 9, y: y + 21, width: 18, height: 18, rx: 3, fill: "#e9eef2", stroke: "#8a96a0" }, b);
      L.texte(b, bx, y + 35, t, { "font-size": 12, "font-weight": 700, fill: "#23315a" });
      L.glissable(b, { soulever: false, debut: () => ({ x: 0, y: 0 }), toucher: () => { const k = valeurs.indexOf(comp.R0) + s; comp.R0 = valeurs[Math.max(0, Math.min(valeurs.length - 1, k))]; d.sature = 0; d.regler(); afficher(); c.calculer(); } });
    });
    c.borne(comp, "1", x + 20, y + 50, "#c9a227"); c.borne(comp, "2", x + 130, y + 50, "#c9a227");
    comp.dipoles = () => [d, { a: "1", b: "2", g: G_ENTREE, j: 0 }];
    comp.mettre_a_jour = ({ i }) => { comp.i = i[0]; };
    afficher();
    return c.ajouter(comp);
  };
})(window.Labo);
