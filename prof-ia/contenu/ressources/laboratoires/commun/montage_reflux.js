/*
Rôle : montage de chauffage à reflux aux vraies dimensions, que l'élève assemble et conduit : support et pinces,
       chauffe-ballon, ballon de 250 mL, entonnoir (posé sur le col pour verser les réactifs, ou rangé dans son anneau),
       pierre ponce, réfrigérant à boules (couché sur la paillasse, ou posé sur le col), robinet d'eau et tuyaux, évier.
       Chauffé, le mélange atteint son ébullition ; avec le réfrigérant et l'eau, les vapeurs se condensent et retombent
       (reflux) ; sinon elles s'échappent (perte de matière, vapeurs souvent inflammables). Pendant la chauffe, la
       réaction avance (cfg.reagir) ; arrêté, le ballon refroidit.
Reçoit : le contexte de la paillasse (avec ctx.ecoulement) et { T_eb (°C), duree (min de reflux), reagir(contenu, d_avance),
         dire(texte), autoriser_ballon(), ponce_x (place du flacon de pierre ponce) }.
Produit : Labo.montage_reflux(ctx, cfg) -> s { ballon, avance, T, ebullition, perte, ponce, entonnoir, refrigerant, eau,
          chauffe, tic(dt_min), etat() } (le temps est donné par le chronomètre de la paillasse).
Utilisé par : les simulations de synthèse (savon, arôme).
*/
(function (L) {
  const E = 1.6, SOL = 576;
  const S0 = { X: 330, COL: { x: 330, y: 496 - 118 * E }, CH: { x: 330, haut: 432, bas: 576 }, ANNEAU: { x: 170, y: 360 }, ROBINET: { x: 600, y: 380 }, EVIER: { x: 600, y: 446 }, REPOS: { x: 830, y: 440 } };

  function support(g) {
    // Tige et socle, pince du col du ballon, pince du réfrigérant, anneau de l'entonnoir.
    L.svg("rect", { x: 168, y: 542, width: 124, height: 9, rx: 2, fill: "#3a3f44" }, g);
    L.tige(g, "M230 544 V24", 6);
    for (const [y, x2] of [[330, 312], [170, 294]]) { L.svg("rect", { x: 222, y: y - 8, width: 16, height: 16, rx: 2, fill: "#5d646a" }, g); L.tige(g, `M230 ${y} H${x2}`, 4); L.svg("rect", { x: x2 - 3, y: y - 12, width: 14, height: 24, rx: 4, fill: "#b9894f", stroke: "#7a5730" }, g); }
    L.tige(g, `M230 ${S0.ANNEAU.y} H${S0.ANNEAU.x + 34}`, 3);
    L.svg("ellipse", { cx: S0.ANNEAU.x, cy: S0.ANNEAU.y, rx: 34, ry: 5, fill: "none", stroke: "#5d646a", "stroke-width": 3 }, g);
    L.svg("rect", { x: S0.EVIER.x - 60, y: S0.EVIER.y - 22, width: 120, height: 44, rx: 6, fill: "#c9d0d4", stroke: "#8f989e" }, g);
    L.svg("rect", { x: S0.EVIER.x - 52, y: S0.EVIER.y - 16, width: 104, height: 32, rx: 5, fill: "#7f8a90" }, g);
    L.svg("rect", { x: S0.ROBINET.x - 8, y: S0.ROBINET.y - 18, width: 16, height: 12, rx: 2, fill: "url(#metal)" }, g);
    L.svg("path", { d: `M${S0.ROBINET.x - 4} ${S0.ROBINET.y - 6} V${S0.ROBINET.y + 10} h8 V${S0.ROBINET.y - 6}`, fill: "url(#metal)", stroke: "#7d868c" }, g);
  }

  function bulles(g, s) {
    // Ébullition : petites bulles avec la pierre ponce, grosses sans ; vapeurs qui s'échappent sans reflux.
    g.replaceChildren();
    const b = s.ballon, y = b.pose.y - b.pr.hauteur_de(b.c.volume()) * E;
    if (s.ebullition) for (let i = 0; i < (s.ponce ? 10 : 2); i++) L.svg("circle", { cx: b.pose.x + Math.random() * 60 - 30, cy: y + 3 + Math.random() * 12, r: s.ponce ? 1.8 : 5 + Math.random() * 5, fill: "none", stroke: "#fff", opacity: 0.85 }, g);
    const haut = s.refrigerant === "monte" ? { x: S0.X, y: S0.COL.y - 288 } : { x: S0.X, y: S0.COL.y };
    if (s.fuite) for (let i = 0; i < 3; i++) L.svg("path", { d: `M${haut.x - 8 + i * 8} ${haut.y - 4} q-6 -12 0 -24 q6 -12 0 -24`, stroke: "#fff", "stroke-width": 4, opacity: 0.45, fill: "none" }, g);
  }

  function evoluer(s, cfg, dt) {
    // Température, ébullition, reflux ou perte de vapeurs, avancement de la réaction.
    const c = s.ballon.c, V = c.volume(), T = c.T ?? 20;
    c.T = s.chauffe && V > 1 ? Math.min(cfg.T_eb, T + (cfg.T_eb + 15 - T) * (1 - Math.exp(-dt / 3))) : 20 + (T - 20) * Math.exp(-dt / 8);
    s.ebullition = s.chauffe && V > 1 && c.T >= cfg.T_eb - 0.3;
    s.soubresauts = s.ebullition && !s.ponce;
    s.fuite = s.ebullition && !(s.refrigerant === "monte" && s.eau);
    if (s.fuite) { const v = Math.min(V, 1.5 * dt); c.retirer(v, "haut"); s.perte += v; }
    if (c.T > cfg.T_eb - 8 && s.avance < 1) { const d = Math.min(1 - s.avance, dt / cfg.duree); s.avance += d; cfg.reagir(c, d); }
    if (s.avance > 0) s.ballon.sig = null;
  }

  L.montage_reflux = function (ctx, cfg) {
    // Construit le montage ; les gestes sont dans reflux_gestes.js.
    const s = { ...S0, PONCE_X: cfg.ponce_x, avance: 0, perte: 0, ponce: false, entonnoir: "col", refrigerant: "repos", ref_pos: { ...S0.REPOS }, eau: false, chauffe: false, dire: cfg.dire };
    support(ctx.fond); ctx.obstacles = (ctx.obstacles || []).concat([[130, 450]]);
    s.g_tuyaux = L.svg("g", { "pointer-events": "none" }, ctx.fond);
    const chauffe = L.chauffe_ballon(ctx.fond, ctx.devant, S0.CH);
    s.ballon = L.recipient(ctx, { id: "ballon", profil: "ballon_250", x: S0.X, y: 496 });
    L.manipuler(ctx, s.ballon, { sol: SOL, supports: [{ x: S0.X, y: 496 }], pose_libre: false, autoriser: cfg.autoriser_ballon });
    const g_bulles = L.svg("g", { "pointer-events": "none" }, ctx.objets);
    L.gestes_reflux(ctx, s);
    s.tic = (dt) => { evoluer(s, cfg, dt); chauffe.allumer(s.chauffe); bulles(g_bulles, s); s.maj(); };
    s.etat = () => ({ entonnoir: s.entonnoir, refrigerant: s.refrigerant, eau: s.eau, chauffe: s.chauffe, T: Math.round(s.ballon.c.T ?? 20), ebullition: s.ebullition, fuite: !!s.fuite, perte: Math.round(s.perte), soubresauts: !!s.soubresauts, ponce: s.ponce, avance: Math.round(s.avance * 100) / 100, V: Math.round(s.ballon.c.volume()) });
    s.maj();
    return s;
  };
})(window.Labo);
