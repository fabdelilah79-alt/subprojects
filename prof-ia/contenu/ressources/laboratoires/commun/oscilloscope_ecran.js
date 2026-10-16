/*
Rôle : écran de l'oscilloscope : quadrillage de 10 divisions sur 8 (1 division = 20 px), graduations de 0,2 division
       sur les axes centraux, repère de la masse (niveau 0 V) et trace verte de la tension, déclenchée sur un front
       montant (la courbe commence par un passage à zéro en montant, elle est donc immobile).
Reçoit : le groupe SVG et le coin de l'écran ; à chaque tracé : tension continue, onde (tensions à des instants régulièrement
         répartis sur une période, ou null), fréquence f (Hz), sensibilité Sv (V/div) et balayage b (ms/div).
Produit : Labo.ecran_oscillo(groupe, x, y) -> tracer({ u_dc, onde, f, Sv, b }).
Utilisé par : oscilloscope.js.
*/
(function (L) {
  const DIV = 20, NX = 10, NY = 8, N = 500;

  function quadrillage(g, x, y) {
    // Fond sombre, lignes des divisions, petites graduations sur les deux axes centraux.
    L.svg("rect", { x: x - 6, y: y - 6, width: NX * DIV + 12, height: NY * DIV + 12, rx: 6, fill: "#111614", stroke: "#000" }, g);
    L.svg("rect", { x, y, width: NX * DIV, height: NY * DIV, fill: "#0b1f17" }, g);
    const traits = { stroke: "#5fae86", "stroke-width": 0.6, opacity: 0.55 };
    for (let i = 0; i <= NX; i++) L.svg("line", { x1: x + i * DIV, y1: y, x2: x + i * DIV, y2: y + NY * DIV, ...traits }, g);
    for (let j = 0; j <= NY; j++) L.svg("line", { x1: x, y1: y + j * DIV, x2: x + NX * DIV, y2: y + j * DIV, ...traits }, g);
    const cx = x + (NX * DIV) / 2, cy = y + (NY * DIV) / 2;
    for (let k = 0; k <= NX * 5; k++) L.svg("line", { x1: x + k * 4, y1: cy - 2, x2: x + k * 4, y2: cy + 2, ...traits }, g);
    for (let k = 0; k <= NY * 5; k++) L.svg("line", { x1: cx - 2, y1: y + k * 4, x2: cx + 2, y2: y + k * 4, ...traits }, g);
  }

  function valeur(onde, phase) {
    // Tension à une fraction de période donnée (onde périodique, interpolation entre deux instants calculés).
    const n = onde.length, p = (((phase % 1) + 1) % 1) * n, k = Math.floor(p), r = p - k;
    return onde[k % n] * (1 - r) + onde[(k + 1) % n] * r;
  }

  function declenchement(onde) {
    // Déclenchement sur front montant au niveau 0 V (ou au niveau moyen si la tension ne passe pas par 0) : fraction de période.
    const min = Math.min(...onde), max = Math.max(...onde), niveau = min < 0 && max > 0 ? 0 : (min + max) / 2, n = onde.length;
    for (let k = 0; k < n; k++) {
      const a = onde[k], b = onde[(k + 1) % n];
      if (a <= niveau && b > niveau) return (k + (niveau - a) / (b - a)) / n;
    }
    return 0;
  }

  L.ecran_oscillo = function (g, x, y) {
    // Dessine l'écran ; renvoie la fonction qui trace la tension et le repère de masse.
    quadrillage(g, x, y);
    const id = `ecran-oscillo-${Math.round(x)}-${Math.round(y)}`, clip = L.svg("clipPath", { id }, g);
    L.svg("rect", { x, y, width: NX * DIV, height: NY * DIV }, clip);
    const calque = L.svg("g", { "clip-path": `url(#${id})` }, g), cy = y + (NY * DIV) / 2;
    L.svg("path", { d: `M${x - 7} ${cy - 4} l6 4 l-6 4 Z`, fill: "#ffcc4d" }, g);
    L.texte(g, x - 12, cy, "1", { "font-size": 7, "font-weight": 700, fill: "#ffcc4d" });
    return ({ u_dc, onde, f, Sv, b }) => {
      calque.replaceChildren();
      const duree = (NX * b) / 1000, depart = onde ? declenchement(onde) : 0, points = [];
      for (let k = 0; k <= N; k++) {
        const t = (k / N) * duree, v = Math.max(-50 * Sv, Math.min(50 * Sv, onde ? valeur(onde, depart + f * t) : u_dc));
        points.push(`${(x + (k / N) * NX * DIV).toFixed(2)},${(cy - (v / Sv) * DIV).toFixed(2)}`);
      }
      L.svg("polyline", { points: points.join(" "), fill: "none", stroke: "#7cff9a", "stroke-width": 3, opacity: 0.25 }, calque);
      L.svg("polyline", { points: points.join(" "), fill: "none", stroke: "#b8ffc8", "stroke-width": 1.3 }, calque);
    };
  };
})(window.Labo);
