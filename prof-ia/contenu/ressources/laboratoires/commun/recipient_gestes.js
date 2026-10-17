/*
Rôle : gestes de la main sur un récipient : le prendre et le déplacer (ses accélérations font ballotter le liquide ;
       secoué trop fort, il déborde), le poser sur la paillasse, ou le tenir au-dessus d'un autre récipient pour verser :
       une poignée apparaît, on l'incline soi-même (le débit dépend de l'inclinaison) ; un toucher le redresse et le repose.
Reçoit : le contexte de la paillasse (ctx.obstacles : bandes [x1, x2] de la paillasse déjà occupées, comme un socle), le récipient (recipient_physique.js) et { sol (y de pose, px), fixe (non déplaçable),
         support : { x, y } ou supports : [{ x, y, ... }] (places sur un support : anneau, porte-tubes, bain-marie ; lâché près
         d'une place libre, il s'y met, et r.place la désigne), pose_libre (faux pour un tube : il ne tient pas debout sur la
         paillasse et retourne à la place libre la plus proche), autoriser() (faux : on ne peut pas le prendre, par exemple
         sans gants ; la fonction peut afficher pourquoi) } ; on verse aussi dans une cible qui a une ouverture (bouche()).
Produit : Labo.manipuler(ctx, r, reglage) ; r.tenu, r.versement (vrai pendant que l'on verse).
Utilisé par : les simulations de chimie.
*/
(function (L) {
  function suivre_mouvement(r, p) {
    // Vitesse et accélération du récipient tenu (moyennées), qui font ballotter le liquide.
    const t = performance.now() / 1000, m = r.mvt || { t, x: p.x, y: p.y, vx: 0, vy: 0 }, dt = Math.max(0.008, t - m.t);
    const vx = (p.x - m.x) / dt, vy = (p.y - m.y) / dt;
    r.acc = { x: 0.6 * r.acc.x + 0.4 * ((vx - m.vx) / dt), y: 0.6 * r.acc.y + 0.4 * ((vy - m.vy) / dt) };
    r.vitesse = { x: vx, y: vy };
    r.mvt = { t, x: p.x, y: p.y, vx, vy };
  }

  function cible_de_versement(ctx, r) {
    // Récipient ouvert dont l'ouverture est juste sous la lèvre de celui qu'on tient (et plus bas que son bord) ;
    // s'il y en a plusieurs, celui dont l'ouverture est la plus proche de la lèvre.
    let choix = null;
    for (const q of ctx.ecoulement.recipients) {
      if (q === r || q.bouchon) continue;
      const bouche = q.monde({ x: 0, y: -q.pr.H }), sens = Math.sign(bouche.x - r.pose.x) || 1;
      const levre = r.monde(sens > 0 ? r.pr.levres.d : r.pr.levres.g), larg = (q.pr.r(q.pr.H) + 12) * q.pose.e, d = Math.abs(levre.x - bouche.x);
      if (d < larg + 20 && levre.y < bouche.y - 4 && levre.y > bouche.y - 120 && (!choix || d < choix.d)) choix = { q, sens, d };
    }
    for (const c of ctx.ecoulement.cibles) {
      // Cible qui a une ouverture (entonnoir) : on peut aussi verser dedans.
      if (!c.bouche) continue;
      const b = c.bouche(), sens = Math.sign(b.x - r.pose.x) || 1, levre = r.monde(sens > 0 ? r.pr.levres.d : r.pr.levres.g), d = Math.abs(levre.x - b.x);
      if (d < b.r + 20 && levre.y < b.y - 4 && levre.y > b.y - 120 && (!choix || d < choix.d)) choix = { q: c, sens, d };
    }
    return choix;
  }

  function poignee(ctx, r, sens) {
    // Poignée ronde au-dessus du récipient : on la fait tourner autour de la lèvre (le bec reste au-dessus de l'autre récipient).
    const lev = sens > 0 ? r.pr.levres.d : r.pr.levres.g, pivot = r.monde(lev);
    const g = L.svg("g", { class: "poignee", role: "button", "aria-label": "Incliner" }, ctx.haut);
    const placer = () => { const p = r.monde({ x: -sens * r.pr.r(r.pr.H) * 0.6, y: -r.pr.H - 16 }); g.replaceChildren(); L.svg("circle", { cx: p.x, cy: p.y, r: 12, fill: "#fff7d6", stroke: "#c08a16", "stroke-width": 2 }, g); L.svg("path", { d: `M${p.x - 5} ${p.y + 2} a6 6 0 1 1 8 -6 m0 0 l1 -4 m-1 4 l-4 -1`, fill: "none", stroke: "#8a5a00", "stroke-width": 1.6 }, g); };
    const orienter = (a) => {
      // Nouvelle inclinaison, la lèvre restant fixe.
      r.pose.angle = a;
      const c = Math.cos((a * Math.PI) / 180), s = Math.sin((a * Math.PI) / 180), lx = lev.x, ly = lev.y;
      r.pose.x = pivot.x - r.pose.e * (lx * c - ly * s); r.pose.y = pivot.y - r.pose.e * (lx * s + ly * c);
    };
    let depart = null;
    placer();
    L.glissable(g, { soulever: false, debut: () => { depart = null; return { x: 0, y: 0 }; }, deplacer: (d, ev) => {
      const q = L.scene.vers_scene(ev), ang = (Math.atan2(q.y - pivot.y, q.x - pivot.x) * 180) / Math.PI;
      if (depart === null) depart = { ang, a: r.pose.angle };
      let delta = ang - depart.ang; if (delta > 180) delta -= 360; if (delta < -180) delta += 360;
      orienter(sens > 0 ? Math.max(0, Math.min(135, depart.a + delta)) : Math.min(0, Math.max(-135, depart.a + delta))); placer();
    } });
    return { placer, retirer: () => g.remove() };
  }

  function place_libre(ctx, r, sol) {
    // Abscisse libre la plus proche sur la paillasse : deux objets ne peuvent pas occuper la même place.
    const R = (q) => (Math.max(q.pr.r(q.pr.h0), q.pr.r(q.pr.H)) + q.pr.t) * q.pose.e + 3;
    const occupe = (x) => ctx.ecoulement.recipients.some((q) => q !== r && Math.abs(q.pose.y - sol) < 2 && !q.tenu && Math.abs(q.pose.x - x) < R(q) + R(r)) || (ctx.obstacles || []).some(([a, b]) => x + R(r) > a && x - R(r) < b);
    for (let d = 0; d < 600; d += 4) for (const x of [r.pose.x + d, r.pose.x - d]) if (x > 200 && x < 830 && !occupe(x)) return x;
    return r.pose.x;
  }

  L.manipuler = function (ctx, r, { sol, fixe = false, support = null, supports = null, pose_libre = true, autoriser = () => true }) {
    const places = supports || (support ? [support] : []);
    // Rend le récipient déplaçable (s'il n'est pas fixe) ; gère la pose et le versement.
    let pg = null;
    const reposer = () => {
      // Redresse le récipient et le pose sur la paillasse, à l'aplomb de l'endroit où on le lâche.
      pg?.retirer(); pg = null; r.versement = false; r.tenu = false;
      r.pose.angle = 0; r.pose.y = sol; r.pose.x = place_libre(ctx, r, sol); r.acc = { x: 0, y: 0 }; r.vitesse = { x: 0, y: 0 }; r.mvt = null; r.w += 0.8;
      ctx.objets.append(r.g);
    };
    const libre = (q) => !ctx.ecoulement.recipients.some((o) => o !== r && Math.hypot(o.pose.x - q.x, o.pose.y - q.y) < 2);
    const place_proche = () => places.filter(libre).sort((a, b) => Math.hypot(r.pose.x - a.x, r.pose.y - a.y) - Math.hypot(r.pose.x - b.x, r.pose.y - b.y))[0];
    const sur_support = (sup = place_proche()) => { reposer(); Object.assign(r.pose, { x: sup.x, y: sup.y }); r.place = sup; };
    if (fixe) return;
    L.glissable(r.g, {
      soulever: false,
      debut: () => (autoriser() ? { x: r.pose.x, y: r.pose.y } : null),
      saisir: () => { r.tenu = true; ctx.haut.append(r.g); },
      deplacer: (p) => { if (r.versement) return; r.pose.x = p.x; r.pose.y = Math.min(sol, p.y); suivre_mouvement(r, p); },
      lacher: () => {
        if (r.versement) return;
        r.acc = { x: 0, y: 0 };
        const sup = place_proche();
        // Près d'une place libre : on l'y pose ; au-dessus d'un récipient : on verse ; sinon on le pose (ou, s'il ne tient
        // pas debout, il retourne à la place libre la plus proche).
        if (sup && Math.hypot(r.pose.x - sup.x, r.pose.y - sup.y) < 80) return sur_support(sup);
        r.place = null;
        const c = cible_de_versement(ctx, r);
        if (c) { r.versement = true; r.vitesse = { x: 0, y: 0 }; pg = poignee(ctx, r, c.sens); } else if (sup && !pose_libre) sur_support(sup); else reposer();
      },
      toucher: () => { if (!r.versement) return; if (!pose_libre && place_proche()) sur_support(); else reposer(); },
    });
  };
})(window.Labo);
