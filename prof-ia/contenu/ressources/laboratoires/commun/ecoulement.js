/*
Rôle : écoulement des liquides sur une paillasse de chimie : le liquide qui sort d'un récipient (débordement, robinet)
       tombe en chute libre (pesanteur réelle, 9,81 m/s² à l'échelle de la scène) sous forme d'un filet ; il entre dans
       le récipient ouvert qu'il rencontre, ou se renverse sur la paillasse (flaque). Boucle d'animation de la paillasse.
Reçoit : le contexte de la paillasse { objets, haut } et { sol (y de la paillasse, px), e (px/mm) }.
Produit : Labo.dans_polygone(poly, p) ; Labo.ecoulement(ctx, reglage) -> { ajouter(r), ajouter_cible({ contient(p), recevoir(goutte) }) (surface qui reçoit des
          gouttes : verre de montre, papier), emettre(source, p, v, parts, V), renverse (mL), sur_pas(f) } ;
          ctx.ecoulement est créé.
Utilisé par : recipient_physique.js, recipient_gestes.js et les simulations de chimie.
*/
(function (L) {
  function dedans(poly, p) {
    // Le point est-il dans le polygone (méthode du rayon) ?
    let ok = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const a = poly[i], b = poly[j];
      if (a.y > p.y !== b.y > p.y && p.x < ((b.x - a.x) * (p.y - a.y)) / (b.y - a.y) + a.x) ok = !ok;
    }
    return ok;
  }

  L.dans_polygone = dedans;

  L.ecoulement = function (ctx, { sol, e = 1.6 }) {
    // Particules de liquide, flaques, boucle d'animation (dessin des récipients qui bougent ou qui coulent).
    const E = { recipients: [], cibles: [], gouttes: [], flaques: [], renverse: 0, ecouteurs: [], g: 9810 * e };
    const calque = L.svg("g", { class: "ecoulement", "pointer-events": "none" }, ctx.haut), sol_g = L.svg("g", { class: "flaques", "pointer-events": "none" }, ctx.fond);
    E.ajouter = (r) => E.recipients.push(r);
    E.ajouter_cible = (c) => E.cibles.push(c);
    E.sur_pas = (f) => E.ecouteurs.push(f);
    E.emettre = (source, p, v, parts, V) => {
      // Une portion de liquide quitte un récipient en p (px), à la vitesse v (px/s).
      if (V <= 0) return;
      const c = source.c.phases.length ? source.c.couleur(source.c.phases[source.c.phases.length - 1]) : { rgb: [220, 235, 245], alpha: 0.5 };
      E.gouttes.push({ x: p.x, y: p.y, vx: v.x, vy: v.y, parts, V, rgb: c.rgb, source, t: performance.now() });
    };
    const recevoir = (gt) => E.recipients.find((r) => r !== gt.source && !r.bouchon && dedans(r.interieur_monde(), gt));
    function deplacer(dt) {
      // Chute libre de chaque portion ; entrée dans un récipient, ou flaque sur la paillasse.
      for (const gt of E.gouttes) {
        gt.vy += E.g * dt; gt.x += gt.vx * dt; gt.y += gt.vy * dt;
        const cb = E.cibles.find((c) => c.contient(gt));
        if (cb) { gt.fini = true; cb.recevoir(gt); continue; }
        const r = recevoir(gt);
        if (r) { gt.fini = true; gt.parts.forEach((p) => r.c.verser(p)); r.sale = true; continue; }
        if (gt.y >= sol && !dedans(gt.source.interieur_monde(), gt)) {
          gt.fini = true; E.renverse += gt.V;
          const f = E.flaques.find((q) => Math.abs(q.x - gt.x) < 30) || (E.flaques.push({ x: gt.x, V: 0, rgb: gt.rgb }), E.flaques[E.flaques.length - 1]);
          f.V += gt.V;
        }
      }
      E.gouttes = E.gouttes.filter((gt) => !gt.fini);
    }
    function dessiner() {
      // Filet : les portions successives d'un même récipient sont reliées ; flaques : ovales qui s'étalent.
      calque.replaceChildren();
      let prec = null;
      for (const gt of E.gouttes) {
        if (prec && prec.source === gt.source && Math.hypot(prec.x - gt.x, prec.y - gt.y) < 40) {
          // Bord du filet un peu plus sombre (on voit aussi un filet d'eau incolore), puis le liquide.
          L.svg("line", { x1: prec.x, y1: prec.y, x2: gt.x, y2: gt.y, stroke: "rgba(110,140,155,0.55)", "stroke-width": 3.6, "stroke-linecap": "round" }, calque);
          L.svg("line", { x1: prec.x, y1: prec.y, x2: gt.x, y2: gt.y, stroke: L.rgb(gt.rgb), "stroke-width": 2.2, "stroke-linecap": "round", opacity: 0.9 }, calque);
        }
        else L.svg("circle", { cx: gt.x, cy: gt.y, r: 1.6, fill: L.rgb(gt.rgb), opacity: 0.85 }, calque);
        prec = gt;
      }
      sol_g.replaceChildren();
      for (const f of E.flaques) L.svg("ellipse", { cx: f.x, cy: sol + 3, rx: 6 + 7 * Math.sqrt(f.V), ry: 1.5 + 1.6 * Math.sqrt(f.V), fill: L.rgb(f.rgb), opacity: 0.55 }, sol_g);
    }
    let avant = null;
    const image = (t) => {
      const dt = avant === null ? 0 : Math.min(0.033, (t - avant) / 1000); avant = t;
      if (dt > 0) {
        // Pas fins (4 ms) pour une chute et un ballottement stables.
        for (let k = 0, n = Math.ceil(dt / 0.004); k < n; k++) { for (const r of E.recipients) r.pas(dt / n); deplacer(dt / n); }
        for (const r of E.recipients) {
          // On ne redessine que les récipients dont l'aspect a changé.
          const sig = `${r.pose.x} ${r.pose.y} ${r.pose.angle} ${r.phi.toFixed(3)} ${r.c.volume().toFixed(3)} ${r.c.phases.length} ${r.c.emulsion.toFixed(2)} ${(r.c.avance || 0).toFixed(3)} ${r.bouchon} ${r.robinet?.ouvert} ${r.coule}`;
          if (sig !== r.sig) { r.sig = sig; r.dessiner(); }
        }
        if (E.gouttes.length || E.trace) dessiner();
        E.trace = E.gouttes.length > 0;
        E.ecouteurs.forEach((f) => f(dt));
      }
      requestAnimationFrame(image);
    };
    requestAnimationFrame(image);
    ctx.ecoulement = E;
    return E;
  };
})(window.Labo);
