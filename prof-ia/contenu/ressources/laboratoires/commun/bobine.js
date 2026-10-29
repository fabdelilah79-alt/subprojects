/*
Rôle : bobine de 1 000 spires sur son support, avec son noyau de fer doux que l'on enfonce ou que l'on retire d'un toucher
       (le noyau multiplie l'inductance par 10) ; résistance de son fil r. En convention récepteur, u = r·i + L·di/dt :
       avec l'horloge du circuit (circuit_temps.js), pendant un pas dt, i = (i précédente + (dt/L)·u) / (1 + r·dt/L) ;
       le courant qui la traverse ne fait donc jamais de saut. Sans horloge (courant continu), elle se comporte comme r.
Reçoit : le circuit et { id, x, y, L (H, sans noyau), r (Ω), noyau (vrai : enfoncé), nom }.
Produit : Labo.bobine(c, reglage) -> comp { L (H, inductance actuelle), r, i (A, de 1 vers 2), u (V), noyau, energie (J) } ;
          bornes « 1 », « 2 » ; fait « <id> » = { L, noyau }.
Utilisé par : les simulations du dipôle RL.
*/
(function (L) {
  function dessin(g, x, y, comp) {
    // Support, enroulement de fil de cuivre, joues, étiquette, noyau (dans la bobine ou posé à côté).
    g.replaceChildren();
    L.boitier(g, x, y, 130, 58, 12, { dessus: "#e3e1da", face: "#a8a59b" });
    L.svg("rect", { x: x + 30, y: y + 8, width: 70, height: 26, rx: 4, fill: "#b86b35", stroke: "#6e3b17" }, g);
    for (let k = 0; k < 18; k++) L.svg("line", { x1: x + 32 + k * 3.8, y1: y + 9, x2: x + 33 + k * 3.8, y2: y + 33, stroke: "#8a4a1e", "stroke-width": 0.8 }, g);
    for (const dx of [26, 100]) L.svg("rect", { x: x + dx, y: y + 4, width: 5, height: 34, rx: 1, fill: "#2f3438" }, g);
    const n = comp.noyau ? { x: x + 18, y: y + 17 } : { x: x + 40, y: y + 40 };
    L.svg("rect", { x: n.x, y: n.y, width: 94, height: 8, rx: 1.5, fill: "url(#metal)", stroke: "#444", opacity: comp.noyau ? 0.9 : 1 }, g);
    L.texte(g, x + 65, y + 62, `${comp.nom} : 1 000 spires, r = ${comp.r} Ω`, { "font-size": 6.5, "font-weight": 700, fill: "#2a2a28" });
  }

  L.bobine = function (c, { id = "bobine", x, y, L: L0 = 0.05, r = 10, noyau = false, nom = "L" }) {
    // Dessin, bornes, modèle à pas de temps ; toucher : noyau enfoncé ou retiré.
    const comp = { id, L: noyau ? 10 * L0 : L0, r, i: 0, i_calc: 0, u: 0, noyau, nom, energie: 0, g: L.svg("g", { class: `bobine bobine-${id}`, role: "button", "aria-label": "Bobine (toucher : noyau)" }, c.calque_composants) };
    const gd = L.svg("g", {}, comp.g), noter = () => L.missions.noter(id, { L: comp.L, noyau: comp.noyau });
    dessin(gd, x, y, comp);
    c.borne(comp, "1", x + 12, y + 44, "#4a4f55"); c.borne(comp, "2", x + 118, y + 44, "#4a4f55");
    L.glissable(comp.g, { soulever: false, debut: () => ({ x: 0, y: 0 }), toucher: () => { comp.noyau = !comp.noyau; comp.L = comp.noyau ? 10 * L0 : L0; dessin(gd, x, y, comp); noter(); c.calculer(); } });
    comp.dipoles = () => {
      if (!c.pas) return [{ a: "1", b: "2", g: 1 / r, j: 0 }];
      const k = 1 + (r * c.pas) / comp.L;
      return [{ a: "1", b: "2", g: c.pas / comp.L / k, j: comp.i / k }];
    };
    comp.mettre_a_jour = ({ u, i }) => { comp.i_calc = i[0] || 0; comp.u = u("1", "2"); };
    comp.valider = () => { comp.i = comp.i_calc; comp.energie = 0.5 * comp.L * comp.i * comp.i; };
    noter();
    return c.ajouter(comp);
  };
})(window.Labo);
