/*
Rôle : pesée d'un solide en poudre : pots de produits (chacun avec sa spatule plantée dedans), coupelles de pesée en
       plastique posées sur un plateau. On pose une coupelle sur la balance, on tare, puis on tient la spatule chargée
       au-dessus de la coupelle : la poudre y tombe peu à peu (environ 0,1 g par seconde) tant qu'on la tient là ; on
       retourne au pot pour recharger la spatule. Une coupelle ne reçoit qu'un seul produit ; touchée hors de la balance,
       elle est vidée.
Reçoit : le contexte de la paillasse, la balance (balance_electronique.js) et { pots [{ id, nom, x, rgb }], coupelles [x], sol, sol_pots
         (pots au fond de la paillasse, facultatif), e, dire }.
Produit : Labo.pesee_poudre(ctx, balance, reglage) -> { coupelles [{ produit, poudre (g), sur_balance }] }.
Utilisé par : les simulations de chimie (quantité de matière, préparation de solutions).
*/
(function (L) {
  const TARE = 1.25, DEBIT = 0.1, CHARGE = 1.0;

  function coupelle(g, c, rgb) {
    // Coupelle carrée en plastique blanc vue de biais, tas de poudre proportionnel à sa masse.
    g.replaceChildren();
    L.svg("path", { d: "M-24 -10 L24 -10 L18 0 L-18 0 Z", fill: "#f4f6f7", stroke: "#a9b0b4" }, g);
    L.svg("path", { d: "M-24 -10 L-20 -13 L20 -13 L24 -10", fill: "#e3e7e9", stroke: "#a9b0b4", "stroke-width": 0.6 }, g);
    if (c.poudre > 0.005) { const h = Math.min(9, 2 + 3.2 * Math.cbrt(c.poudre)), l = Math.min(18, 6 + 5 * Math.cbrt(c.poudre)); L.svg("path", { d: `M${-l} -9 Q0 ${-9 - 2 * h} ${l} -9 Z`, fill: L.rgb(rgb) }, g); }
  }

  function spatule(g, charge, rgb) {
    // Spatule-cuillère en inox, bout en (0, 0), manche vers le haut à droite ; poudre si elle est chargée.
    g.replaceChildren();
    L.svg("path", { d: "M-7 -1 Q0 5 7 -1 L5 -3 L-5 -3 Z M5 -3 L82 -120 L84 -118 L7 -1", fill: "url(#metal)", stroke: "#6d767c", "stroke-width": 0.5 }, g);
    if (charge > 0.02) L.svg("ellipse", { cx: 0, cy: -3, rx: 5.5, ry: 2 + 1.6 * (charge / CHARGE), fill: L.rgb(rgb) }, g);
    L.svg("path", { d: "M2 -2 L84 -120", stroke: "#000", "stroke-width": 16, opacity: 0 }, g);
  }

  L.pesee_poudre = function (ctx, balance, { pots, coupelles: xs, sol, sol_pots = sol, e = 1.6, dire = () => {} }) {
    // Pots et spatules ; coupelles déplaçables (plateau ou balance) ; la poudre coule à chaque pas si la spatule est au-dessus.
    const couleurs = Object.fromEntries(pots.map((p) => [p.id, p.rgb]));
    const C = xs.map((x) => ({ produit: null, poudre: 0, sur_balance: false, repos: { x, y: sol - 6 }, pos: { x, y: sol - 6 }, masse: TARE }));
    L.svg("rect", { x: Math.min(...xs) - 34, y: sol - 6, width: Math.max(...xs) - Math.min(...xs) + 68, height: 6, rx: 2, fill: "#d9dcde", stroke: "#a9b0b4" }, ctx.fond);
    const pan = { x: balance.plateau.x, y: balance.plateau.y - 1 };
    C.forEach((c) => {
      c.g = L.svg("g", { class: "coupelle", role: "button", "aria-label": "Coupelle de pesée" }, ctx.objets);
      const dessiner = () => { coupelle(c.g, c, couleurs[c.produit] || [255, 255, 255]); L.placer(c.g, c.pos.x, c.pos.y); };
      c.dessiner = dessiner;
      L.glissable(c.g, {
        debut: () => ({ ...c.pos }), saisir: () => { if (c.sur_balance) { balance.retirer(c); c.sur_balance = false; } ctx.haut.append(c.g); },
        deplacer: (p) => { c.pos = p; dessiner(); },
        lacher: (p) => {
          ctx.objets.append(c.g);
          const libre = !C.some((o) => o !== c && o.sur_balance);
          if (libre && Math.abs(p.x - pan.x) < balance.plateau.r && Math.abs(p.y - pan.y) < 50) { c.pos = { ...pan }; c.sur_balance = true; balance.ajouter(c); } else c.pos = { ...c.repos };
          dessiner(); ctx.signaler?.();
        },
        toucher: () => { if (!c.sur_balance && c.poudre > 0) { c.poudre = 0; c.produit = null; c.masse = TARE; dire("Coupelle vidée dans le récipient à déchets."); dessiner(); ctx.signaler?.(); } },
      });
      dessiner();
    });
    pots.forEach((p) => L.pot_spatule(ctx, p, sol_pots, e, C, couleurs, dire));
    return { coupelles: C };
  };

  L.pot_spatule = function (ctx, p, sol, e, C, couleurs, dire) {
    // Un pot et sa spatule : sortie du pot, elle est chargée ; tenue au-dessus d'une coupelle, la poudre coule.
    const s = { charge: 0, tenue: false, pos: { x: p.x, y: sol - 30 } }, g = L.svg("g", { class: `spatule-${p.id}`, role: "button", "aria-label": `spatule ${p.nom}` }, ctx.fond);
    L.pot_poudre(ctx.fond, p.x, sol, e, p.nom, p.rgb);
    const avant = g.nextSibling, repos = { x: p.x - 4, y: sol - 40 };
    const ranger = () => { s.tenue = false; s.charge = 0; spatule(g, 0, p.rgb); L.placer(g, repos.x, repos.y); ctx.fond.insertBefore(g, avant); };
    L.glissable(g, { debut: () => ({ ...repos }), saisir: () => { s.tenue = true; s.charge = CHARGE; ctx.haut.append(g); }, deplacer: (q) => { s.pos = q; L.placer(g, q.x, q.y); }, lacher: ranger });
    ctx.ecoulement.sur_pas((dt) => {
      if (!s.tenue || s.charge <= 0) return;
      const c = C.find((o) => Math.abs(o.pos.x - s.pos.x) < 22 && s.pos.y < o.pos.y - 8 && s.pos.y > o.pos.y - 70);
      if (!c) return;
      if (c.produit && c.produit !== p.id) return dire("Cette coupelle contient déjà un autre produit : prenez-en une autre.");
      const d = Math.min(s.charge, DEBIT * dt * (0.8 + 0.4 * Math.random()));
      c.produit = p.id; c.poudre += d; c.masse = TARE + c.poudre; s.charge -= d;
      spatule(g, s.charge, p.rgb); c.dessiner(); ctx.signaler?.();
    });
    ranger();
  };
})(window.Labo);
