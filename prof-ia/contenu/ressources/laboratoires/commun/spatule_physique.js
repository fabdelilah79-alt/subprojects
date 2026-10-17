/*
Rôle : pot de poudre à large col (étiquette, pictogrammes) et microspatule en inox de 12 cm, aux vraies dimensions : la
       spatule est plantée dans la poudre ; on la sort (elle emporte une pointe de poudre), puis on la lâche, son bout
       au-dessus de l'ouverture d'un récipient : la poudre tombe dedans. Ensuite, ou lâchée ailleurs, elle retourne dans le pot.
Reçoit : le contexte de la paillasse (avec ctx.ecoulement) et { x, sol, e (px/mm), solide (nom dans Labo.LIQUIDES), dose (mL),
         texte (étiquette), rgb (couleur de la poudre), pictos, autoriser() }.
Produit : Labo.spatule_poudre(ctx, reglage) -> { versees (nombre de pointes versées) }.
Utilisé par : les simulations de chimie (poudre de fer, de zinc...).
*/
(function (L) {
  function pot(g, x, sol, e, texte, rgb, pictos) {
    // Pot en plastique blanc de 50 mm, ouvert, poudre visible dans le col, étiquette et pictogrammes.
    const l = 50 * e, h = 60 * e;
    L.svg("ellipse", { cx: x + 4, cy: sol + 1, rx: l / 2 + 3, ry: 4, fill: "#000", opacity: 0.28 }, g);
    L.svg("rect", { x: x - l / 2, y: sol - h, width: l, height: h, rx: 5, fill: "#f2f3f0", stroke: "#a9b0b2" }, g);
    L.svg("ellipse", { cx: x, cy: sol - h, rx: l / 2 - 4, ry: 5, fill: "#dfe2df", stroke: "#a9b0b2" }, g);
    L.svg("ellipse", { cx: x, cy: sol - h + 1, rx: l / 2 - 9, ry: 3.2, fill: L.rgb(rgb) }, g);
    L.svg("rect", { x: x - l / 2 + 6, y: sol - h + 18, width: l - 12, height: 40, fill: "#fff", stroke: "#c9c4b0", "stroke-width": 0.5 }, g);
    String(texte).split("\n").forEach((t, i) => L.texte(g, x, sol - h + 30 + i * 9, t, { "font-size": 7.4, "font-weight": 700, fill: "#222" }));
    (pictos || []).forEach((code, i) => L.pictogramme(g, x - 10 + i * 20, sol - 26, 16, code));
    return { x, y: sol - h };
  }

  function spatule(g, chargee, rgb, e) {
    // Microspatule : bout plat (où se pose la poudre) en (0, 0), tige vers la droite ; poudre éventuelle.
    g.replaceChildren();
    L.svg("path", { d: `M-2 -2 Q-6 0 -2 2 H${10 * e} L${12 * e} 0.8 H${120 * e} V-0.8 H${12 * e} L${10 * e} -2 Z`, fill: "url(#metal)", stroke: "#6d767c", "stroke-width": 0.4 }, g);
    if (chargee) L.svg("path", { d: `M-2 -1.5 Q${5 * e} -7 ${10 * e} -1.5 Z`, fill: L.rgb(rgb) }, g);
  }

  L.spatule_poudre = function (ctx, { x, sol, e = 1.6, solide, dose, texte, rgb, pictos = [], autoriser = () => true }) {
    // Spatule plantée dans le pot (derrière sa paroi), inclinée ; sortie, elle porte une pointe de poudre.
    const s = { versees: 0 }, g = L.svg("g", { class: "spatule", role: "button", "aria-label": "Spatule" }, ctx.fond);
    pot(ctx.fond, x, sol, e, texte, rgb, pictos);
    const repos = { x, y: sol - 22 * e }, ANGLE = -64;
    const poser = (p) => g.setAttribute("transform", `translate(${p.x} ${p.y}) rotate(${ANGLE})`);
    const bouche = (r) => { const a = r.monde(r.pr.levres.g), b = r.monde(r.pr.levres.d); return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }; };
    L.glissable(g, {
      debut: () => (autoriser() ? { ...repos } : null),
      saisir: () => { ctx.haut.append(g); spatule(g, true, rgb, e); },
      deplacer: poser,
      lacher: (p) => {
        const r = ctx.ecoulement.recipients.find((q) => !q.bouchon && Math.hypot(bouche(q).x - p.x, bouche(q).y - p.y) < 22);
        if (r) { r.c.ajouter(solide, dose); s.versees++; ctx.signaler?.(); }
        ctx.fond.insertBefore(g, ctx.fond.children[ordre]); spatule(g, false, rgb, e); poser(repos);
      },
    });
    const ordre = [...ctx.fond.children].indexOf(g);
    spatule(g, false, rgb, e); poser(repos);
    return s;
  };
})(window.Labo);
