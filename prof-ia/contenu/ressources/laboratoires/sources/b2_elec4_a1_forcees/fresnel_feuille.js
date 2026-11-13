/*
Rôle : feuille posée sur la paillasse : construction de Fresnel du circuit RLC série pour la fréquence actuelle du GBF,
       à une échelle choisie pour remplir la feuille : vecteur (R + r)·Im (horizontal), L·ω·Im (vers le haut), Im/(C·ω)
       (vers le bas), et leur somme, le vecteur de longueur Um. Les longueurs ne sont pas chiffrées : l'élève les calcule.
Reçoit : le groupe SVG, le poste (circuit, GBF, condensateur, bobine, résistance) et le coin { x, y } de la feuille.
Produit : Labo.fresnel_feuille(g, poste, coin) ; la figure se redessine à chaque calcul du circuit.
Utilisé par : simulation.js (activité 1).
*/
(function (L) {
  const LARG = 240, HAUT = 150;

  function fleche(g, x1, y1, x2, y2, couleur, nom, dx, dy) {
    // Vecteur avec sa pointe et son nom.
    const a = Math.atan2(y2 - y1, x2 - x1), p = (k) => `${x2 - 7 * Math.cos(a + k)} ${y2 - 7 * Math.sin(a + k)}`;
    L.svg("line", { x1, y1, x2, y2, stroke: couleur, "stroke-width": 1.8 }, g);
    L.svg("path", { d: `M${x2} ${y2} L${p(0.4)} L${p(-0.4)} Z`, fill: couleur }, g);
    L.texte(g, (x1 + x2) / 2 + dx, (y1 + y2) / 2 + dy, nom, { "font-size": 7.5, "font-weight": 700, fill: couleur });
  }

  function construire(g, x, y, p) {
    // Les trois vecteurs bout à bout, puis leur somme (Um) ; une même échelle, choisie pour remplir la feuille.
    g.replaceChildren();
    const w = 2 * Math.PI * p.gbf.f, Z = Math.hypot(p.R.R + p.bob.r, p.bob.L * w - 1 / (p.C.C * w));
    const a = (p.R.R + p.bob.r) / Z, b = (p.bob.L * w) / Z, d = 1 / (p.C.C * w * Z), bas = Math.min(0, b - d);
    const k = Math.min((LARG - 110) / a, (HAUT - 44) / (b - bas)), O = { x: x + 50, y: y + 24 + b * k };
    const A = { x: O.x + a * k, y: O.y }, B = { x: A.x, y: O.y - b * k }, C = { x: A.x + 6, y: O.y - (b - d) * k };
    L.svg("line", { x1: x + 10, y1: O.y, x2: x + LARG - 10, y2: O.y, stroke: "#9aa0a6", "stroke-dasharray": "3 3" }, g);
    fleche(g, O.x, O.y, A.x, A.y, "#1565c0", "(R + r)·Im", 0, 11);
    fleche(g, A.x, A.y, B.x, B.y, "#e65100", "L·ω·Im", 28, 0);
    fleche(g, B.x + 6, B.y, C.x, C.y, "#2e7d32", "Im/(C·ω)", 38, 10);
    fleche(g, O.x, O.y, C.x, C.y, "#c62828", "Um", -16, 0);
  }

  L.fresnel_feuille = function (g, poste, { x, y }) {
    // Feuille blanche (ombre portée sur la paillasse), titre, figure tenue à jour.
    L.ombre_sol(g, x + LARG / 2, y + HAUT + 4, LARG / 2, 6, 0.35);
    L.svg("rect", { x, y, width: LARG, height: HAUT, fill: "#fbfaf4", stroke: "#c9c4b4" }, g);
    L.texte(g, x + LARG / 2, y + 12, `Construction de Fresnel (axe de référence : i)`, { "font-size": 8, "font-weight": 700, fill: "#2a2a28" });
    const figure = L.svg("g", {}, g), dessiner = () => construire(figure, x, y, poste);
    poste.c.sur_calcul(dessiner);
    dessiner();
  };
})(window.Labo);
