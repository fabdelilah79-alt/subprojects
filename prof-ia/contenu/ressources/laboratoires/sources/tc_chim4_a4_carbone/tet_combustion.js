/*
Rôle : têt à combustion (cuillère à déflagration) aux vraies dimensions : tige d'acier de 18 cm, coupelle de 15 mm où est
       posé un morceau de charbon de bois (0,20 g), disque-couvercle de 8 cm, rangé sur son support. On le tient dans la
       flamme : le charbon chauffe et rougeoit ; dans l'air, il brûle à peine ; plongé dans le flacon de dioxygène, il brûle
       vivement (incandescence blanche, étincelles) en consommant le dioxygène : C + O₂ → CO₂ (2,67 g de O₂ et 3,67 g de CO₂
       par gramme de carbone).
Reçoit : le contexte de la paillasse, le bec Bunsen (chaleur(p)) et { support { x, sol }, flacon (récipient), O2_initial (g),
         dire(texte), plaque() (vrai si la plaque de verre ferme le flacon), autoriser() (on peut prendre le têt) }.
Produit : Labo.tet_combustion(ctx, bec, reglage) -> t { m (g de carbone), T (°C), lieu (« support », « main », « flacon »),
          O2 (g dans le flacon), CO2 (g), pas(dt) }.
Utilisé par : poste_carbone.js.
*/
(function (L) {
  const E = 1.6, M0 = 0.2, TIGE = 180 * E, DISQUE = 90 * E;

  function dessiner(g, t, p, angle) {
    // Tige, disque, poignée, coupelle et charbon (plus petit à mesure qu'il brûle, lueur selon sa température).
    g.replaceChildren();
    g.setAttribute("transform", `translate(${p.x} ${p.y}) rotate(${angle})`);
    L.svg("line", { x1: 0, y1: -4, x2: 0, y2: -TIGE, stroke: "#6d767c", "stroke-width": 3 }, g);
    L.svg("rect", { x: -4, y: -TIGE - 40, width: 8, height: 44, rx: 3, fill: "url(#bois)", stroke: "#7a5730" }, g);
    L.svg("ellipse", { cx: 0, cy: -DISQUE, rx: 64, ry: 6, fill: "url(#metal-h)", stroke: "#6d767c" }, g);
    L.svg("path", { d: "M-12 -6 Q0 6 12 -6 Z", fill: "url(#metal)", stroke: "#5d646a" }, g);
    if (t.m <= 0.002) return;
    const k = Math.sqrt(t.m / M0), lueur = t.T < 450 ? 0 : Math.min(1, (t.T - 450) / 400);
    L.svg("path", { d: `M${-10 * k} -5 Q${-8 * k} ${-5 - 12 * k} ${2 * k} ${-5 - 13 * k} Q${11 * k} ${-5 - 9 * k} ${10 * k} -5 Z`, fill: "#26221f", stroke: "#111", "stroke-width": 0.5 }, g);
    if (lueur) L.svg("path", { d: `M${-9 * k} -5 Q${-7 * k} ${-5 - 11 * k} ${2 * k} ${-5 - 12 * k} Q${10 * k} ${-5 - 8 * k} ${9 * k} -5 Z`, fill: t.T > 1000 ? "#fff3c4" : t.T > 750 ? "#ff9a2a" : "#c0281a", opacity: 0.35 + 0.6 * lueur }, g);
    if (t.T > 1000) for (let i = 0; i < 6; i++) L.svg("circle", { cx: (Math.random() - 0.5) * 50, cy: -10 - Math.random() * 40, r: 1.2, fill: "#ffe9a0" }, g);
  }

  function bruler(t, dt, flamme, dans_flacon) {
    // Chauffage par la flamme ; combustion d'autant plus vive que l'air est riche en dioxygène ; refroidissement.
    // Dans la flamme, le charbon (qui rayonne) ne dépasse pas 950 °C environ : il rougeoie, orange.
    flamme = Math.min(flamme, 950);
    if (flamme > t.T) t.T += (flamme - t.T) * (1 - Math.exp(-dt / 2.5));
    const f = dans_flacon ? t.O2 / t.O2_0 : 0.21, Tc = 300 + 1000 * f;
    t.brule = t.m > 0.002 && t.T > 450 && Tc > 450;
    if (!t.brule) { if (flamme <= t.T) t.T = 20 + (t.T - 20) * Math.exp(-dt / 5); return; }
    const dm = Math.min(t.m, 0.03 * f * f * dt, dans_flacon ? (t.O2 * 12) / 32 : 1);
    t.m -= dm;
    if (dans_flacon) { t.O2 -= (dm * 32) / 12; t.CO2 += (dm * 44) / 12; }
    t.T += (Math.max(Tc, flamme) - t.T) * (1 - Math.exp(-dt / 1.5));
  }

  L.tet_combustion = function (ctx, bec, { support, flacon, O2_initial, dire, plaque, autoriser = () => true }) {
    // Le têt se tient à la main (incliné), se range sur son support ou se plonge dans le flacon ouvert.
    const t = { m: M0, T: 20, lieu: "support", O2: O2_initial, O2_0: O2_initial, CO2: 0, brule: false, pos: { x: support.x, y: support.sol - 14 } };
    const g = L.svg("g", { class: "tet", role: "button", "aria-label": "Têt à combustion" }, ctx.objets);
    const haut = () => flacon.monde(flacon.pr.levres.g).y;
    const place = () => (t.lieu === "flacon" ? { x: flacon.pose.x, y: haut() + DISQUE - 3 } : t.lieu === "support" ? { x: support.x, y: support.sol - 14 } : t.pos);
    const ranger = () => { if (t.lieu === "flacon") ctx.objets.insertBefore(g, flacon.g); else if (t.lieu === "support") ctx.objets.append(g); };
    L.glissable(g, {
      debut: () => (autoriser() ? { ...place() } : null),
      saisir: () => { t.lieu = "main"; flacon.ferme = false; ctx.haut.append(g); },
      deplacer: (p) => { t.pos = p; },
      lacher: (p) => {
        const ouverture = Math.abs(p.x - flacon.pose.x) < 40 && p.y > haut() - 60 && p.y < haut() + 170;
        if (ouverture && plaque()) dire("Ôtez d'abord la plaque de verre du flacon.");
        t.lieu = ouverture && !plaque() ? "flacon" : "support"; flacon.ferme = t.lieu === "flacon"; ranger();
      },
    });
    t.pas = (dt) => {
      const p = place();
      bruler(t, dt, t.lieu === "main" ? bec.chaleur({ x: p.x, y: p.y - 10 }) : 20, t.lieu === "flacon");
      dessiner(g, t, p, t.lieu === "main" ? 25 : 0);
    };
    ranger(); t.pas(0);
    return t;
  };
})(window.Labo);
