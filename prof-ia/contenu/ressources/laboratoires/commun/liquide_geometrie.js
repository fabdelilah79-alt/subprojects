/*
Rôle : géométrie des liquides dans un récipient vu en coupe : aire d'un polygone, découpe par la surface libre (un demi-plan),
       recherche du niveau de la surface pour une aire donnée (par dichotomie). La surface libre est une droite de normale
       u (vers le haut, hors du liquide) ; le liquide occupe les points p tels que u·p ≤ s.
Reçoit : des polygones [{ x, y }] en coordonnées de la scène (y vers le bas), une normale u et une aire.
Produit : Labo.geometrie = { aire(poly), couper(poly, u, s), niveau(poly, u, aire) -> { s, region }, transformer(poly, pose) }.
Utilisé par : recipient_physique.js, verrerie_rendu.js.
*/
(function (L) {
  const pv = (u, p) => u.x * p.x + u.y * p.y;

  function aire(poly) {
    // Aire d'un polygone (formule du lacet), toujours positive.
    let a = 0;
    for (let i = 0; i < poly.length; i++) { const p = poly[i], q = poly[(i + 1) % poly.length]; a += p.x * q.y - q.x * p.y; }
    return Math.abs(a) / 2;
  }

  function couper(poly, u, s) {
    // Partie du polygone sous la surface (u·p ≤ s) : algorithme de Sutherland-Hodgman pour un demi-plan.
    const r = [];
    for (let i = 0; i < poly.length; i++) {
      const p = poly[i], q = poly[(i + 1) % poly.length], dp = pv(u, p) - s, dq = pv(u, q) - s;
      if (dp <= 0) r.push(p);
      if ((dp < 0 && dq > 0) || (dp > 0 && dq < 0)) { const t = dp / (dp - dq); r.push({ x: p.x + (q.x - p.x) * t, y: p.y + (q.y - p.y) * t }); }
    }
    return r;
  }

  function niveau(poly, u, a) {
    // Position s de la surface telle que l'aire du liquide vaille a (dichotomie sur l'intervalle des projections).
    let lo = Infinity, hi = -Infinity;
    for (const p of poly) { const v = pv(u, p); lo = Math.min(lo, v); hi = Math.max(hi, v); }
    if (a <= 0) return { s: lo, region: [] };
    if (a >= aire(poly)) return { s: hi, region: poly };
    for (let k = 0; k < 40; k++) { const m = (lo + hi) / 2; if (aire(couper(poly, u, m)) < a) lo = m; else hi = m; }
    return { s: hi, region: couper(poly, u, hi) };
  }

  function transformer(poly, { x, y, angle = 0, e = 1 }) {
    // Passe des coordonnées du récipient (mm, origine au bas, y vers le haut) à la scène (px), avec rotation (degrés).
    const c = Math.cos((angle * Math.PI) / 180), s = Math.sin((angle * Math.PI) / 180);
    return poly.map((p) => ({ x: x + e * (p.x * c + p.y * s), y: y + e * (p.x * s - p.y * c) }));
  }

  L.geometrie = { aire, couper, niveau, transformer, pv };
})(window.Labo);
