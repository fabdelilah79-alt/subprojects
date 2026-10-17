/*
Rôle : paillasse de chromatographie sur couche mince, aux vraies dimensions : plaque de silice sur son support, règle,
       échantillons et capillaires, crayon, cuve (bécher de 600 mL) et son couvercle, bécher d'éluant que l'on verse
       soi-même, bidon de récupération, chronomètre ; pour les espèces incolores, lampe UV et bocal de diiode.
       Plaque dans la cuve, l'éluant monte ; sortie, elle sèche.
Reçoit : le réglage de la paillasse { fait, especes, echantillons : [{ n, x, texte, rgb, especes }], eluant (étiquette),
         revelation (vrai : lampe UV et diiode) }.
Produit : Labo.poste_ccm(reglage) -> fabrique(groupe) -> { pense_bete } ; fait « <fait> » (voir noter()).
Utilisé par : simulation.js.
*/
(function (L) {
  const SOL = 576, E = 1.6, C = L.ccm;

  function decor(ctx, s, cfg) {
    // Support de la plaque, bidon, bocal de diiode.
    L.svg("rect", { x: 236, y: SOL - 20, width: 108, height: 20, rx: 2, fill: "#f2f3f0", stroke: "#a7aba3" }, ctx.fond);
    C.bidon(ctx.fond, s.BIDON.x, s.BIDON.sol);
    if (s.IODE) C.bocal_iode(ctx.fond, s.IODE.x, s.IODE.sol);
  }

  function noter(s) {
    // Faits de la paillasse (notés seulement quand ils changent).
    const e = s.plaque.etat, xs = e.depots.map((d) => d.x).sort((a, b) => a - b), h = s.cuve.c.volume() ? s.cuve.pr.hauteur_de(s.cuve.c.volume()) : 0;
    if (s.uv && e.front && e.depots.length) s.uv_vu = true;
    const d = {};
    for (const t of s.plaque.taches()) (d[t.n] = d[t.n] || []).push(Math.round((t.y - e.ligne) * 10) / 10);
    const v = {
      ligne: e.ligne && Math.round(e.ligne * 10) / 10, depots: e.depots.map((q) => q.n).sort(), sur_ligne: e.depots.every((q) => Math.abs(q.y - e.ligne) <= 2),
      espaces: xs.length > 0 && xs[0] >= 5 && xs[xs.length - 1] <= 45 && xs.every((x, i) => !i || x - xs[i - 1] >= 6),
      eluant: Math.round(h * 10) / 10, couvercle: s.couvercle, lieu: s.lieu, front: e.front && Math.round(e.front), front_marque: !!e.front_marque,
      D: e.front_marque && Math.round((e.front_marque - e.ligne) * 10) / 10, dissous: e.dissous, d, uv_vu: !!s.uv_vu, cercles: e.cercles.length, iode: Math.round(e.iode * 10) / 10,
    };
    const t = JSON.stringify(v);
    if (t !== s.avant) { s.avant = t; L.missions.noter(s.fait, v); }
  }

  function construire(ctx, cfg) {
    // État partagé de la paillasse (lu et modifié par gestes_ccm.js).
    const s = { fait: cfg.fait, echantillons: cfg.echantillons, SUPPORT: { x: 250, y: SOL - 20 }, BIDON: { x: 920, sol: 528 }, lieu: "support", couvercle: false, lampe: false };
    if (cfg.revelation) Object.assign(s, { LAMPE: { x: 214, y: 352 }, IODE: { x: 530, sol: SOL } });
    s.plaque = L.plaque_ccm({ especes: cfg.especes });
    s.pos = { ...s.SUPPORT };
    s.cuve = L.recipient(ctx, { id: "cuve", profil: "becher_600", x: 670, y: SOL - 2.2 });
    s.cuve.g.setAttribute("pointer-events", "none");
    L.manipuler(ctx, L.recipient(ctx, { id: "eluant", profil: "becher_100", x: 790, y: SOL - 2.2, contenu: { eau: 80 }, etiquette: cfg.eluant }), { sol: SOL - 2.2 });
    return s;
  }

  L.poste_ccm = (cfg) => function (g) {
    // Construit la paillasse ; le temps (chronomètre, 1 s = 1 min) fait monter l'éluant, sécher la plaque, agir le diiode.
    L.affiche_securite(g, 780, 56);
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230), ctx = L.paillasse_chimie(g);
    L.ecoulement(ctx, { sol: SOL, e: E }); ctx.obstacles = [[226, 350], [cfg.echantillons[0].x - 24, cfg.echantillons[cfg.echantillons.length - 1].x + 24], [890, 950]].concat(cfg.revelation ? [[470, 590]] : []);
    const s = construire(ctx, cfg), calque = L.svg("g", { "pointer-events": "none" }, g);
    decor(ctx, s, cfg);
    const g_regle = L.svg("g", { "pointer-events": "none" }, ctx.fond), g_lampe = L.svg("g", {}, ctx.fond), g_ouvert = L.svg("g", { "pointer-events": "none" }, ctx.fond), g_ferme = L.svg("g", { "pointer-events": "none" }, ctx.devant);
    s.g_plaque = L.svg("g", { class: "plaque-ccm", role: "button", "aria-label": "Plaque de chromatographie" }, ctx.objets);
    s.dire = (t) => { calque.replaceChildren(); if (t) { L.svg("rect", { x: 380, y: 236, width: 270, height: 28, rx: 5, fill: "#fff6e0", stroke: "#d08a1a" }, calque); L.texte(calque, 515, 250, t, { "font-size": 7.4, "font-weight": 700, fill: "#6b3d00" }); } };
    s.placer = (lieu) => {
      // Pose la plaque : sur son support, au fond de la cuve (derrière la paroi avant) ou dans le bocal de diiode.
      s.lieu = lieu;
      s.pos = lieu === "cuve" ? { x: s.cuve.pose.x - 40, y: s.cuve.pose.y - 1 } : lieu === "iode" ? { x: s.IODE.x - 40, y: s.IODE.sol - 10 } : { ...s.SUPPORT };
      if (lieu === "cuve") ctx.objets.insertBefore(s.g_plaque, s.cuve.g); else ctx.objets.append(s.g_plaque);
      s.maj();
    };
    s.maj = () => {
      s.uv = s.lampe && s.lieu === "support";
      s.plaque.dessiner(s.g_plaque, s.uv ? "uv" : "normal"); L.placer(s.g_plaque, s.pos.x, s.pos.y, E);
      C.regle(g_regle, s.SUPPORT.x - 2, s.SUPPORT.y, s.SUPPORT.y - (s.plaque.etat.ligne || 0) * E);
      const bouche = s.cuve.pose.y - s.cuve.pr.H * E;
      C.couvercle(s.couvercle ? g_ferme : g_ouvert, s.cuve.pose.x, bouche, s.couvercle); (s.couvercle ? g_ouvert : g_ferme).replaceChildren();
      if (s.LAMPE) C.lampe_uv(g_lampe, s.LAMPE.x, s.LAMPE.y, s.lampe);
      noter(s);
    };
    L.gestes_ccm(ctx, s);
    L.chronometre(g, { x: 560, y: 190 }).tic((dt) => {
      const e = s.plaque.etat;
      if (s.lieu === "cuve") { s.plaque.developper(dt, s.cuve.c.volume() ? s.cuve.pr.hauteur_de(s.cuve.c.volume()) : 0); if (e.front >= 99 && !s.trop) { s.trop = true; s.dire("Le front a atteint le haut de la plaque : il fallait la sortir avant."); } }
      else s.plaque.secher(dt);
      if (s.lieu === "iode") e.iode = Math.min(1, e.iode + dt / 3);
      s.maj();
    });
    s.maj();
    return { pense_bete };
  };

})(window.Labo);
