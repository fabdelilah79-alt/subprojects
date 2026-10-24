/*
Rôle : limaille de fer saupoudrée sur la feuille : chaque grain (2 mm) s'oriente selon la composante horizontale du champ
       quand on tapote la feuille, d'autant mieux que le champ est intense (bien alignés au-dessus de 0,2 mT, en désordre
       sous 0,05 mT). Les
       grains dessinent ainsi les lignes de champ. Les grains cachés (sous un aimant, une bobine…) ne sont pas dessinés.
Reçoit : le groupe SVG, le plan (plan_magnetique.js) et { pas (m), masque(p) -> vrai si le point est caché }.
Produit : Labo.limaille(g, plan, reglage) -> l { visible, saupoudrer(champ), tapoter(champ), retirer(), alignement(champ, seuil) (de 0 à 1) }.
Utilisé par : les postes des simulations de magnétisme.
*/
(function (L) {
  const SEUIL = 5e-4, DEMI = 0.0015;

  L.limaille = function (g, plan, { pas = 0.006, masque = () => false } = {}) {
    // Grains sur une grille irrégulière ; orientation au hasard au départ.
    const l = { visible: false, grains: [] }, gr = L.svg("g", { "pointer-events": "none" }, g);
    let graine = 11;
    const hasard = () => ((graine = (graine * 16807) % 2147483647) / 2147483647);
    for (let x = -plan.du + pas / 2; x < plan.du; x += pas) for (let y = -plan.dv + pas / 2; y < plan.dv; y += pas) l.grains.push({ x: x + (hasard() - 0.5) * pas * 0.6, y: y + (hasard() - 0.5) * pas * 0.6, a: hasard() * Math.PI });
    const dessiner = () => {
      // Petits traits gris foncé, projetés sur la feuille.
      gr.replaceChildren();
      if (!l.visible) return;
      let d = "";
      for (const q of l.grains) {
        if (masque(q)) continue;
        const a = plan.ecran({ x: q.x - DEMI * Math.cos(q.a), y: q.y - DEMI * Math.sin(q.a) }), b = plan.ecran({ x: q.x + DEMI * Math.cos(q.a), y: q.y + DEMI * Math.sin(q.a) });
        d += `M${a.x.toFixed(1)} ${a.y.toFixed(1)}L${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
      }
      L.svg("path", { d, stroke: "#3b3f44", "stroke-width": 1.1, "stroke-linecap": "round" }, gr);
    };
    l.tapoter = (champ) => {
      // Les grains s'alignent sur le champ, avec un désordre d'autant plus grand que le champ est faible.
      for (const q of l.grains) { const B = champ({ x: q.x, y: q.y, z: 0 }), ecart = Math.PI * Math.min(1, (6e-5 / Math.max(1e-9, Math.hypot(B.x, B.y))) ** 2); q.a = Math.atan2(B.y, B.x) + (hasard() - 0.5) * ecart; }
      dessiner();
    };
    l.saupoudrer = (champ) => { l.visible = true; l.tapoter(champ); };
    l.retirer = () => { l.visible = false; dessiner(); };
    l.alignement = (champ, seuil = SEUIL) => {
      // Moyenne de cos 2(a − φ) sur les grains où le champ dépasse le seuil : 1 si tous sont alignés sur le champ actuel.
      const s = l.grains.filter((q) => !masque(q)).map((q) => ({ q, B: champ({ x: q.x, y: q.y, z: 0 }) })).filter((x) => Math.hypot(x.B.x, x.B.y) > seuil);
      return s.length ? s.reduce((m, x) => m + Math.cos(2 * (x.q.a - Math.atan2(x.B.y, x.B.x))), 0) / s.length : 0;
    };
    return l;
  };
})(window.Labo);
