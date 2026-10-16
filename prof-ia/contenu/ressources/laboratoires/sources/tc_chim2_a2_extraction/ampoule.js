/*
Rôle : ampoule à décanter de 125 mL : forme en poire, bouchon, robinet ; contenu en deux phases (aqueuse en bas, solvant
       au-dessus s'il est moins dense que l'eau et non miscible) ou une seule phase (solvant miscible) ; émulsion après
       agitation, qui se sépare peu à peu (décantation). Le diiode passe de l'eau dans le cyclohexane quand on agite.
Reçoit : le groupe SVG, le centre x, le haut du col y et l'état { aq, org (mL), miscible, I2_aq, I2_org (0 à 1), melange (0 à 1),
         bouchon, robinet, angle }.
Produit : Labo.ampoule = { dessiner(g, x, y, e), niveau(V) -> y (bas du liquide = y + 120), COULEURS }.
Utilisé par : poste_solvant.js.
*/
(function (L) {
  const VERRE = { fill: "url(#verre)", stroke: "#9fb6be" };
  // Demi-largeur intérieure à la hauteur s (0 : haut du corps, 1 : pointe) : poire large en haut, cône vers le robinet.
  const largeur = (s) => 4 + 30 * Math.sin(Math.PI * Math.pow(Math.max(0, Math.min(1, (s - 0.03) / 0.97)), 0.575));
  const HAUT_CORPS = 15, H = 105;
  const CUMUL = (() => { const c = [0]; for (let j = 1; j <= H; j++) c.push(c[j - 1] + largeur(1 - j / H) ** 2); return c.map((v) => (v / c[H]) * 125); })();
  const niveau = (V) => { let i = 0; while (i < H && CUMUL[i] < V) i++; return HAUT_CORPS + H - i; };
  const COULEURS = { iode: [176, 96, 18], aq_pale: [238, 220, 170], org: [168, 58, 160], solvant: [240, 244, 246], ethanol_iode: [150, 70, 20] };
  const mix = (a, b, k) => a.map((v, i) => Math.round(v + (b[i] - v) * k));

  function contour(x, y) {
    // Contour intérieur de l'ampoule (du haut du col à la pointe), pour remplir et découper.
    let d = `M${x - 5} ${y}`;
    for (let i = 0; i <= H; i++) d += ` L${x - largeur(i / H)} ${y + HAUT_CORPS + i}`;
    for (let i = H; i >= 0; i--) d += ` L${x + largeur(i / H)} ${y + HAUT_CORPS + i}`;
    return d + ` L${x + 5} ${y} Z`;
  }

  function couleurs(e) {
    // Couleur de chaque phase selon le diiode qu'elle contient, et de l'émulsion.
    if (e.miscible) return { bas: COULEURS.ethanol_iode, haut: null };
    const bas = mix(COULEURS.aq_pale, COULEURS.iode, e.I2_aq), haut = mix(COULEURS.solvant, COULEURS.org, e.I2_org);
    return { bas, haut, emulsion: mix(bas, haut, 0.5) };
  }

  function dessiner(g, x, y, e) {
    // Ampoule complète, éventuellement inclinée (angle en degrés, autour de son centre).
    g.replaceChildren();
    const a = L.svg("g", { transform: `rotate(${e.angle || 0} ${x} ${y + 70})` }, g), id = `clip-ampoule-${Math.round(x)}`;
    const clip = L.svg("clipPath", { id }, a);
    L.svg("path", { d: contour(x, y) }, clip);
    const c = couleurs(e), z = L.svg("g", { "clip-path": `url(#${id})` }, a), V = e.aq + e.org;
    const bas = y + HAUT_CORPS + H, y_aq = y + niveau(e.aq), y_tout = y + niveau(V);
    if (V > 0 && (e.miscible || e.melange > 0.02)) L.svg("rect", { x: x - 40, y: y_tout, width: 80, height: bas - y_tout, fill: L.rgb(e.miscible ? c.bas : c.emulsion), opacity: 0.85 }, z);
    if (V > 0 && !e.miscible) {
      const k = 1 - (e.melange || 0);
      if (e.aq > 0) L.svg("rect", { x: x - 40, y: y_aq, width: 80, height: bas - y_aq, fill: L.rgb(c.bas), opacity: 0.85 * k }, z);
      if (e.org > 0) L.svg("rect", { x: x - 40, y: y_tout, width: 80, height: y_aq - y_tout, fill: L.rgb(c.haut), opacity: 0.85 * k }, z);
      if (e.aq > 0 && e.org > 0 && k > 0.6) L.svg("line", { x1: x - 40, x2: x + 40, y1: y_aq, y2: y_aq, stroke: "#ffffff", opacity: 0.6 }, z);
    }
    L.svg("path", { d: contour(x, y), ...VERRE, "stroke-width": 1.2 }, a);
    L.svg("path", { d: `M${x - 18} ${y + 40} Q${x - 22} ${y + 70} ${x - 10} ${y + 100}`, stroke: "#fff", "stroke-width": 2, opacity: 0.5, fill: "none" }, a);
    L.svg("rect", { x: x - 3, y: bas, width: 6, height: 26, ...VERRE }, a);
    L.svg("rect", { x: x - 10, y: bas + 6, width: 20, height: 7, rx: 3, fill: "#2f6fb8" }, a);
    L.svg("rect", { x: e.robinet ? x - 2 : x - 9, y: e.robinet ? bas + 2 : bas + 8, width: e.robinet ? 4 : 18, height: e.robinet ? 15 : 3, rx: 1, fill: "#1d3f6b" }, a);
    if (e.bouchon) L.svg("path", { d: `M${x - 6} ${y - 8} H${x + 6} L${x + 5} ${y + 4} H${x - 5} Z`, fill: "#2f6fb8", stroke: "#1d3f6b" }, a);
  }

  L.ampoule = { dessiner, niveau, COULEURS, BAS: HAUT_CORPS + H };
})(window.Labo);
