/*
Rôle : poste « fiole jaugée » : la fiole (100 mL ou 50 mL) et ses accessoires (entonnoir, bouchon, fiole_accessoires.js),
       une loupe qui grossit quatre fois le col autour du trait de jauge (comme l'œil placé à la hauteur du trait, pour
       amener le bas du ménisque sur le trait), et le suivi de l'homogénéisation : après le dernier ajout d'eau, il faut
       boucher la fiole et l'agiter (au moins 1,5 s de secousses) pour que la solution soit homogène.
Reçoit : le contexte de la paillasse (avec ctx.ecoulement) et { id, profil, x, sol, e, dire, entonnoir { x, sol } (facultatif),
         bouchon { x, sol }, loupe { x, y, r } }.
Produit : Labo.fiole_jaugee(ctx, reglage) -> { r (le récipient), entonnoir, etat() -> { V, ecart (mL au-dessus du trait),
          bouchon, entonnoir, homogene, solide (g de cristaux non dissous), dissous { espèce : quantité } }, vider() }.
Utilisé par : les simulations de chimie (préparation d'une solution, dilution).
*/
(function (L) {
  const GROSSI = 4;

  function loupe(ctx, r, { x, y, r: R }, id) {
    // Disque grossissant : copie vivante du dessin de la fiole (élément use), centrée sur le trait de jauge.
    r.g.id = `fiole-${id}`;
    const g = L.svg("g", { class: "loupe", "pointer-events": "none" }, ctx.haut), clip = L.svg("clipPath", { id: `loupe-${id}` }, g);
    L.svg("circle", { cx: x, cy: y, r: R }, clip);
    const vue = L.svg("g", { "clip-path": `url(#loupe-${id})` }, g);
    L.svg("circle", { cx: x, cy: y, r: R, fill: "#b9beba" }, vue);
    const copie = L.svg("use", { href: `#fiole-${id}` }, vue);
    L.svg("circle", { cx: x, cy: y, r: R, fill: "none", stroke: "#3a3f44", "stroke-width": 5 }, g);
    L.svg("circle", { cx: x, cy: y, r: R - 3, fill: "none", stroke: "#fff", "stroke-width": 1, opacity: 0.6 }, g);
    L.texte(g, x, y + R + 14, `Loupe ×${GROSSI} : trait de jauge`, { "font-size": 8, "font-weight": 700, fill: "#33414b" });
    let avant = "";
    return () => {
      const m = r.monde({ x: 0, y: -r.pr.hauteur_de(r.pr.extras.jauge) }), cle = `${m.x} ${m.y}`;
      if (cle !== avant) { avant = cle; copie.setAttribute("transform", `translate(${x} ${y}) scale(${GROSSI}) translate(${-m.x} ${-m.y})`); }
    };
  }

  L.fiole_jaugee = function (ctx, { id, profil, x, sol, e = 1.6, dire = () => {}, entonnoir = null, bouchon, loupe: lp }) {
    // Fiole déplaçable (sauf avec l'entonnoir), accessoires, loupe ; suivi des ajouts d'eau et des secousses bouché.
    const r = L.recipient(ctx, { id, profil, x, y: sol, e });
    const f = { r, entonnoir: entonnoir && L.entonnoir_fiole(ctx, r, { ...entonnoir, e, dire }) };
    L.bouchon_fiole(ctx, r, { ...bouchon, e, dire, entonnoir: f.entonnoir });
    L.manipuler(ctx, r, { sol, autoriser: () => !f.entonnoir?.sur_fiole || (dire("Retirez d'abord l'entonnoir pour prendre la fiole."), false) });
    const suivre = loupe(ctx, r, lp, id), s = { homogene: false, t: 0, V: 0 };
    ctx.ecoulement.sur_pas((dt) => {
      // Un ajout de liquide rend la solution hétérogène ; des secousses, fiole bouchée, la rendent homogène.
      suivre();
      const V = r.c.volume(), solide = r.c.phases.some((p) => p.classe === "solide");
      if (V > s.V + 0.004) { s.homogene = false; s.t = 0; }
      if (Math.abs(V - s.V) > 1e-4) s.change = true;
      s.attente = (s.attente || 0) + dt; s.V = V;
      if (s.change && s.attente > 0.15) { s.change = false; s.attente = 0; ctx.signaler?.(); }
      if (r.bouchon && Math.hypot(r.acc.x, r.acc.y) > 2500) s.t += dt;
      if (!s.homogene && s.t > 1.5 && !solide && V > 1) { s.homogene = true; dire("La solution est homogène."); ctx.signaler?.(); }
    });
    f.etat = () => {
      const dissous = {}, sol_g = r.c.phases.filter((p) => p.classe === "solide").reduce((t, p) => t + Object.entries(p.liquides).reduce((u, [n, v]) => u + v * L.LIQUIDES[n].d, 0), 0);
      r.c.phases.forEach((p) => Object.entries(p.dissous).forEach(([k, q]) => { dissous[k] = (dissous[k] || 0) + q; }));
      return { V: Math.round(r.c.volume() * 100) / 100, ecart: Math.round((r.c.volume() - r.pr.extras.jauge) * 100) / 100, bouchon: r.bouchon, entonnoir: !!f.entonnoir?.sur_fiole, homogene: s.homogene, solide: Math.round(sol_g * 1e4) / 1e4, dissous };
    };
    f.vider = () => { r.c.phases.splice(0); r.c.emulsion = 0; r.sig = null; s.homogene = false; s.V = 0; ctx.signaler?.(); };
    return f;
  };
})(window.Labo);
