/*
Rôle : verser le solide d'une coupelle de pesée dans un récipient (ou dans un entonnoir posé sur une fiole) : lâchée,
       son bord au-dessus de l'ouverture, la coupelle reste tenue, inclinée ; la poudre glisse et tombe (chute libre,
       ecoulement.js), mais quelques grains restent collés à la coupelle (moins pour une poudre
       qui ne colle pas : Labo.LIQUIDES[solide].collant, 1 par défaut). Un jet de pissette sur la coupelle inclinée
       la rince : l'eau entraîne les grains restants dans le récipient.
Reçoit : le contexte de la paillasse (avec ctx.ecoulement), la coupelle (pesee_poudre.js), le point où on la lâche et le
         nom du solide (Labo.LIQUIDES).
Produit : Labo.coupelle_verser(ctx, coupelle, p, solide) -> vrai si la coupelle verse ; coupelle.versant ; Labo.coupelle_placer(coupelle).
Utilisé par : pesee_poudre.js.
*/
(function (L) {
  const INCLINAISON = 35, LEVRE = { x: 25.4, y: 5.6 }, RESTE = 0.02;

  function ouverture(ctx, p) {
    // Ouverture la plus proche sous le bord de la coupelle : récipient ouvert, ou cible qui a une bouche (entonnoir).
    const lev = { x: p.x + LEVRE.x, y: p.y + LEVRE.y }, choix = [];
    for (const r of ctx.ecoulement.recipients) {
      if (r.bouchon || r.ferme) continue;
      const b = r.monde({ x: 0, y: -r.pr.H });
      choix.push({ x: b.x, y: b.y, r: r.pr.r(r.pr.H) * r.pose.e + 14 });
    }
    for (const c of ctx.ecoulement.cibles) if (c.bouche) { const b = c.bouche(); choix.push({ x: b.x, y: b.y, r: b.r + 10 }); }
    return choix.filter((b) => Math.abs(lev.x - b.x) < b.r && lev.y < b.y + 6 && lev.y > b.y - 90).sort((a, b) => Math.abs(lev.x - a.x) - Math.abs(lev.x - b.x))[0];
  }

  L.coupelle_placer = function (c) {
    // Position de la coupelle : à plat, ou inclinée au-dessus d'une ouverture.
    c.g.setAttribute("transform", `translate(${c.pos.x} ${c.pos.y})` + (c.versant ? ` rotate(${INCLINAISON})` : ""));
  };

  function installer(ctx) {
    // Une seule fois par paillasse : la poudre s'écoule à chaque pas ; le jet de pissette qui touche une coupelle inclinée la rince.
    const E = ctx.ecoulement, versantes = new Set(), source = { c: L.contenu({ eau: 1 }), interieur_monde: () => [] };
    const levre = (c) => ({ x: c.pos.x + LEVRE.x, y: c.pos.y + LEVRE.y });
    const part = (c, m) => ({ classe: "solide", liquides: { [c.versant.solide]: m / L.LIQUIDES[c.versant.solide].d }, dissous: {}, T: 20 });
    E.sur_pas((dt) => {
      for (const c of versantes) {
        if (!c.versant) { versantes.delete(c); continue; }
        const m = Math.min(c.poudre - c.versant.reste, 1.5 * dt);
        if (m <= 1e-5) continue;
        c.poudre -= m; c.masse -= m; c.dessiner();
        E.emettre({ c: L.contenu({ [c.versant.solide]: 1 }), interieur_monde: () => [] }, levre(c), { x: 15, y: 30 }, [part(c, m)], m / L.LIQUIDES[c.versant.solide].d);
      }
    });
    E.ajouter_cible({
      contient: (gt) => gt.source !== source && [...versantes].some((c) => c.versant && Math.abs(gt.x - c.pos.x) < 24 && gt.y > c.pos.y - 16 && gt.y < c.pos.y + 3),
      recevoir: (gt) => {
        // L'eau ruisselle sur la coupelle et emporte une partie des grains restants.
        const c = [...versantes].find((k) => Math.abs(gt.x - k.pos.x) < 24), parts = [...gt.parts];
        const m = c.poudre * Math.min(1, gt.V / 0.5) * 0.6;
        if (m > 0) { c.poudre -= m; c.masse -= m; c.versant.reste = Math.max(0, c.versant.reste - m); parts.push(part(c, m)); if (c.poudre < 1e-4) { c.masse -= c.poudre; c.poudre = 0; } c.dessiner(); }
        E.emettre(source, levre(c), { x: 10, y: 40 }, parts, gt.V);
      },
    });
    return versantes;
  }

  L.coupelle_verser = function (ctx, c, p, solide) {
    // La coupelle lâchée au-dessus d'une ouverture se place, inclinée, son bord juste au-dessus ; la poudre commence à couler.
    const b = c.poudre > 0 && ouverture(ctx, p);
    if (!b) return false;
    const versantes = ctx.versantes || (ctx.versantes = installer(ctx));
    c.pos = { x: b.x - LEVRE.x, y: b.y - 22 }; const k = L.LIQUIDES[solide].collant ?? 1;
    c.versant = { solide, reste: Math.min(c.poudre, k * Math.max(0.01, c.poudre * RESTE)) };
    versantes.add(c); c.dessiner();
    return true;
  };
})(window.Labo);
