/*
Rôle : paillasse de filtration sous vide, avec le matériel physique : fiole à vide de 500 mL, entonnoir Büchner, papier
       filtre, pissette, trompe à eau sur le robinet, bécher du mélange à filtrer, que l'on incline soi-même au-dessus du
       Büchner. Avec le vide, le liquide traverse vite le papier (15 mL/s) ; sans vide, lentement (1,5 mL/s) ; le solide
       reste sur le papier (sinon il passe : filtrat trouble). Il faut débrancher le tuyau AVANT de fermer le robinet,
       sinon l'eau de la trompe remonte dans la fiole (retour d'eau).
Reçoit : le contexte de la paillasse (avec ctx.ecoulement) et { fait, melange : { contenu, etiquette }, retenu : { liquide :
         nom du filtrat qu'il donne, ou null s'il reste tout entier sur le papier }, residu_rgb }.
Produit : Labo.filtration_buchner(ctx, reglage) -> e ; fait « <fait> » = { papier, mouille, vide, branche, verse, filtrat,
          residu, retour, trouble }.
Utilisé par : les simulations d'extraction (chim2 A2) et de synthèse (savon).
*/
(function (L) {
  const SOL = 576, Bu = L.buchner, E = Bu.E;

  function filtrer(e, cfg, buchner, fiole, dt) {
    // Le liquide du Büchner passe dans la fiole ; ce qui est solide reste sur le papier (sinon, il passe : trouble).
    const V = Math.min(buchner.c.volume(), (e.vide && e.branche ? 15 : 1.5) * dt);
    e.filet = V > 0 ? fiole.pose.y - fiole.pr.hauteur_de(fiole.c.volume()) * E : null;
    if (V <= 0) return;
    for (const part of buchner.c.retirer(V, "bas")) for (const [n, v] of Object.entries(part.liquides)) {
      if (n in cfg.retenu && e.papier) { e.residu = true; if (cfg.retenu[n]) fiole.c.ajouter(cfg.retenu[n], v); } else fiole.c.ajouter(n, v);
    }
  }

  function pissette(ctx, e, buchner) {
    // Pissette : lâchée la pointe au-dessus du Büchner, on la presse : un jet d'eau de 4 mL mouille le papier.
    const g = L.svg("g", { class: "pissette", role: "button", "aria-label": "Pissette" }, ctx.objets), repos = { x: 360, y: SOL };
    const placer = (p, presse) => { Bu.pissette(g, presse); L.placer(g, p.x, p.y, E); };
    placer(repos, false);
    L.glissable(g, { debut: () => ({ ...repos }), saisir: () => ctx.haut.append(g), deplacer: (p) => placer(p, false), lacher: (p) => {
      const pointe = { x: p.x + 34 * E, y: p.y - 150 * E };
      if (Math.abs(pointe.x - Bu.B.x) > 70 || pointe.y > Bu.B.haut - 4 || pointe.y < Bu.B.haut - 160) { ctx.objets.append(g); return placer(repos, false); }
      let k = 0;
      placer(p, true);
      const jet = setInterval(() => {
        ctx.ecoulement.emettre({ c: L.contenu({ eau: 1 }), interieur_monde: () => [] }, pointe, { x: 60, y: -20 }, [{ classe: "aqueuse", liquides: { eau: 0.4 }, dissous: {} }], 0.4);
        if (++k >= 10) { clearInterval(jet); setTimeout(() => { ctx.objets.append(g); placer(repos, false); }, 400); }
      }, 50);
    } });
  }

  function papier(ctx, e, maj) {
    // Un papier filtre pris dans la boîte ; lâché sur le Büchner, il s'y pose.
    const g = L.svg("g", { class: "papier-filtre", role: "button", "aria-label": "Papier filtre" }, ctx.objets);
    L.svg("ellipse", { cx: 250, cy: SOL - 23, rx: 54, ry: 7, fill: "#fff", stroke: "#c8c8c0" }, g);
    L.glissable(g, { debut: () => ({ x: 0, y: 0 }), deplacer: (p) => L.placer(g, p.x, p.y), lacher: (p) => {
      L.placer(g, 0, 0);
      if (!e.papier && Math.hypot(250 + p.x - Bu.B.x, SOL - 23 + p.y - Bu.B.haut) < 50) { e.papier = true; maj(); }
    } });
  }

  function boutons(ctx, e, fiole, maj) {
    // Robinet de la trompe (s'il est fermé tuyau branché : retour d'eau) et tubulure de la fiole (brancher, débrancher).
    const robinet = L.svg("circle", { cx: Bu.T.x + 16, cy: Bu.T.y - 13, r: 7, fill: "url(#acier)", stroke: "#111", role: "button", "aria-label": "Robinet" }, ctx.haut);
    L.glissable(robinet, { soulever: false, debut: () => ({ x: 0, y: 0 }), toucher: () => { if (e.vide && e.branche) { e.retour = true; fiole.c.ajouter("eau", 30); } e.vide = !e.vide; maj(); } });
    const raccord = L.svg("circle", { cx: Bu.BRAS.x + 4, cy: Bu.BRAS.y, r: 16, fill: "#000", opacity: 0, role: "button", "aria-label": "Tuyau à vide" }, ctx.haut);
    L.glissable(raccord, { soulever: false, debut: () => ({ x: 0, y: 0 }), toucher: () => { e.branche = !e.branche; maj(); } });
  }

  L.filtration_buchner = function (ctx, cfg) {
    // Construit le matériel, ses gestes, et la filtration à chaque pas.
    const e = { papier: false, mouille: false, vide: false, branche: true, verse: 0, filtrat: 0, residu: false, retour: false, trouble: false, residu_rgb: cfg.residu_rgb };
    const g_trompe = L.svg("g", { "pointer-events": "none" }, ctx.fond);
    const fiole = L.recipient(ctx, { id: "fiole", profil: "fiole_500", x: Bu.F.x, y: Bu.F.y });
    const buchner = L.recipient(ctx, { id: "buchner", profil: "buchner_70", x: Bu.B.x, y: Bu.B.y });
    fiole.g.setAttribute("pointer-events", "none"); buchner.g.setAttribute("pointer-events", "none");
    Bu.fixe(ctx, fiole);
    const g_dessus = L.svg("g", { "pointer-events": "none" }, ctx.devant);
    Bu.boite_papiers(ctx.fond, 250, SOL);
    L.manipuler(ctx, L.recipient(ctx, { id: "melange", profil: "becher_250", x: 660, y: SOL, contenu: cfg.melange.contenu, etiquette: cfg.melange.etiquette }), { sol: SOL });
    const maj = () => {
      const ph = buchner.c.phases[0];
      Bu.dessus(g_dessus, { ...e, liquide: ph ? buchner.c.couleur(ph).rgb : null }); Bu.trompe(g_trompe, e);
      const v = { ...e, filet: undefined, residu_rgb: undefined, verse: Math.round(buchner.c.volume()), filtrat: Math.round(fiole.c.volume()) };
      if (JSON.stringify(v) !== maj.avant) { maj.avant = JSON.stringify(v); L.missions.noter(cfg.fait, v); }
    };
    papier(ctx, e, maj); pissette(ctx, e, buchner); boutons(ctx, e, fiole, maj);
    ctx.ecoulement.sur_pas((dt) => {
      // Ce qui arrive dans le Büchner : l'eau mouille le papier ; le mélange versé sur un papier sec ou absent trouble le filtrat.
      for (const ph of buchner.c.phases) {
        if (e.papier && ph.liquides.eau > 0) e.mouille = true;
        if (Object.keys(cfg.retenu).some((n) => ph.liquides[n] > 0) && (!e.papier || !e.mouille)) e.trouble = true;
      }
      filtrer(e, cfg, buchner, fiole, dt); maj();
    });
    maj();
    return e;
  };
})(window.Labo);
