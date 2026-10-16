/*
Rôle : récipient de liquide qui respecte la physique : la surface reste perpendiculaire à la pesanteur apparente (elle
       penche quand on accélère le récipient et oscille ensuite, comme un vrai liquide qui ballotte) ; le liquide qui
       dépasse la lèvre la plus basse déborde (débit d'un déversoir) ; un robinet ouvert laisse couler le liquide du bas
       (loi de Torricelli, v = √(2gh)), sauf si le récipient est bouché (l'air ne peut pas entrer).
Reçoit : le contexte (ctx.ecoulement), et { id, profil, x, y, angle, e (px/mm), contenu, bouchon, robinet }.
Produit : Labo.recipient(ctx, reglage) -> { id, pr, pose, c, bouchon, robinet, pas(dt), etat(), monde(p) (p dans le repère du
          récipient, y vers le bas, mm), interieur_monde(), dessiner() }.
Utilisé par : recipient_gestes.js, ecoulement.js et les simulations de chimie.
*/
(function (L) {
  const G = L.geometrie, g_mm = 9810, RAIDEUR = 300, AMORTI = 5;
  const rad = (a) => (a * Math.PI) / 180;

  function regions(r) {
    // Région de chaque phase dans le repère du récipient (du bas vers le haut), et la corde de la surface.
    // Chaque phase occupe la tranche comprise entre deux niveaux (elles ne se recouvrent pas).
    const u = r.normale(), out = [], bas = { x: -u.x, y: -u.y };
    let V = 0, s = null;
    const phases = r.c.emulsion > 0.5 ? [{ ...r.c.phases[0], V: r.c.volume(), melange: true }] : r.c.phases;
    for (const ph of phases) {
      V += ph.V;
      const n = G.niveau(r.pr.interieur, u, r.pr.aire_de(V)), poly = s === null ? n.region : G.couper(n.region, bas, -s);
      out.push({ poly, ...(ph.melange ? melange(r.c) : r.c.couleur(ph)) }); s = n.s;
    }
    return { regions: out.reverse(), s, u };
  }

  function melange(c) {
    // Couleur d'une émulsion : moyenne des phases, trouble.
    const cs = c.phases.map((p) => ({ ...c.couleur(p), V: p.V })), V = c.volume();
    return { rgb: [0, 1, 2].map((i) => cs.reduce((s, p) => s + (p.rgb[i] * p.V) / V, 0)), alpha: Math.min(0.92, cs.reduce((s, p) => s + (p.alpha * p.V) / V, 0) + 0.25) };
  }

  function corde(region, u, s) {
    // Les deux extrémités de la surface libre (points de la région situés sur la droite u·p = s).
    const sur = region.filter((p) => Math.abs(G.pv(u, p) - s) < 0.05);
    if (sur.length < 2) return null;
    const t = { x: -u.y, y: u.x };
    sur.sort((a, b) => G.pv(t, a) - G.pv(t, b));
    return [sur[0], sur[sur.length - 1]];
  }

  function deborder(r, dt, u, s) {
    // Liquide au-dessus de la lèvre la plus basse : il s'écoule (débit d'un déversoir de 15 mm de large).
    if (r.bouchon || !r.c.volume()) return;
    const lev = [r.pr.levres.g, r.pr.levres.d].sort((a, b) => G.pv(u, a) - G.pv(u, b))[0], h = s - G.pv(u, lev);
    if (h <= 0.05) return;
    const q = 0.6 * 15 * Math.pow(h, 1.5) * Math.sqrt(2 * g_mm) / 1000, V = Math.min(r.c.volume(), q * dt);
    const sens = Math.sign(lev.x) || 1, v = Math.sqrt(2 * g_mm * h) * r.pose.e, a = rad(r.pose.angle);
    r.sortie(lev, { x: sens * Math.cos(a) * v * 0.22 + r.vitesse.x, y: Math.abs(Math.sin(a)) * v * 0.22 + r.vitesse.y }, r.c.retirer(V, "haut"), V);
  }

  function vidanger(r, dt, u, s) {
    // Robinet ouvert : vidange par la pointe (orifice de 2 mm) ; bouché, le flacon ne laisse couler que quelques gouttes.
    if (!r.robinet || !r.robinet.ouvert || !r.c.volume()) return;
    if (r.bouchon && r.robinet.air <= 0) return;
    const pointe = { x: 0, y: 0 }, h = Math.max(0, s - G.pv(u, pointe)), v = Math.sqrt(2 * g_mm * h);
    const V = Math.min(r.c.volume(), (0.6 * Math.PI * 1 * v * dt) / 1000);
    if (r.bouchon) r.robinet.air -= V;
    if (V > 0) r.coule = r.c.couleur(r.c.phases[0]).rgb;
    if (V <= 0) return;
    r.sortie(pointe, { x: r.vitesse.x, y: v * r.pose.e * 0.5 + r.vitesse.y }, r.c.retirer(V, "bas"), V);
  }

  L.recipient = function (ctx, { id, profil, x, y, angle = 0, e = 1.6, contenu = {}, bouchon = false, robinet = null, etiquette = "" }) {
    // Construit le récipient et l'inscrit dans l'écoulement de la paillasse.
    const pr = L.profil(profil);
    const r = { id, pr, pose: { x, y, angle, e }, c: L.contenu(contenu), bouchon, robinet: robinet && { ouvert: false, air: 0.4 }, etiquette, phi: 0, w: 0, vitesse: { x: 0, y: 0 }, acc: { x: 0, y: 0 }, g: L.svg("g", { class: `recipient recipient-${id}` }, ctx.objets) };
    r.normale = () => { const a = r.phi - rad(r.pose.angle); return { x: Math.sin(a), y: -Math.cos(a) }; };
    r.monde = (p) => G.transformer([{ x: p.x, y: -p.y }], r.pose)[0];
    r.interieur_monde = () => G.transformer(pr.interieur.map((p) => ({ x: p.x, y: -p.y })), r.pose);
    r.sortie = (p, v, parts, V) => ctx.ecoulement.emettre(r, r.monde(p), v, parts, V);
    r.pas = (dt) => {
      // Ballottement (oscillateur amorti vers l'angle de la pesanteur apparente), puis débordement et robinet.
      const cible = Math.atan2(r.acc.x, g_mm * r.pose.e);
      r.w += (-RAIDEUR * (r.phi - cible) - AMORTI * r.w) * dt; r.phi = Math.max(-1.2, Math.min(1.2, r.phi + r.w * dt));
      if (r.bouchon && Math.hypot(r.acc.x, r.acc.y) > 2500) r.c.agiter(dt * 2); else r.c.decanter(dt);
      const k = Math.exp(-dt / 0.06); r.acc.x *= k; r.acc.y *= k; r.vitesse.x *= k; r.vitesse.y *= k;
      const { s, u } = regions(r);
      r.coule = null;
      deborder(r, dt, u, s); vidanger(r, dt, u, s);
    };
    r.etat = () => { const R = regions(r), haut = R.regions[0]; return { regions: R.regions, surface: haut ? corde(haut.poly, R.u, R.s) : null, droit: Math.abs(r.phi - rad(r.pose.angle)) < 0.15, bouchon: r.bouchon, robinet: r.robinet, etiquette: r.etiquette, coule: r.coule }; };
    r.dessiner = () => L.dessiner_verrerie(r.g, pr, r.pose, r.etat());
    ctx.ecoulement.ajouter(r);
    r.dessiner();
    return r;
  };
})(window.Labo);
