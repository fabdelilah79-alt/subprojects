/*
Rôle : dessin d'une spire (20 tours, R = 5,0 cm) ou d'une bobine (200 spires, R = 2,5 cm, longueur 16 cm) d'axe
       horizontal dirigé vers l'élève, qui traverse une plaque de plexiglas par son milieu : moitiés inférieures sous la
       plaque (vues à travers), moitiés supérieures au-dessus ; câbles jusqu'au générateur. Sources de champ correspondantes.
Reçoit : les groupes « dessous » et « dessus », le plan (plan_magnetique.js), le mode (« spire » ou « bobine »), le générateur.
Produit : Labo.dessin_bobinage(dessous, dessus, plan, mode, gen) ; Labo.sources_bobinage(mode, I) ; Labo.BOBINAGES
          (caractéristiques) ; Labo.masque_bobinage(mode, p) (points de la plaque traversés par le fil).
Utilisé par : poste_bobine.js.
*/
(function (L) {
  const KZ = 1100, B = { spire: { R: 0.05, N: 20, l: 0 }, bobine: { R: 0.025, N: 200, l: 0.16 } };
  L.BOBINAGES = B;

  function arc(g, plan, y, R, haut, epaisseur) {
    // Demi-tour au-dessus (haut) ou au-dessous de la plaque, centré sur l'axe en y.
    const c = plan.ecran({ x: 0, y }), rx = R * plan.ex, ry = R * KZ, s = haut ? 1 : 0;
    L.svg("path", { d: `M${c.x - rx} ${c.y} A${rx} ${ry} 0 0 ${s} ${c.x + rx} ${c.y}`, fill: "none", stroke: "#b5651d", "stroke-width": epaisseur, opacity: haut ? 1 : 0.55 }, g);
  }

  L.dessin_bobinage = function (dessous, dessus, plan, mode, gen) {
    // Spire épaisse (faisceau de 20 tours) ou 32 tours visibles de la bobine, du fond vers l'avant ; câbles.
    dessous.replaceChildren(); dessus.replaceChildren();
    const b = B[mode], n = mode === "spire" ? 1 : 32, ys = Array.from({ length: n }, (_, k) => (n === 1 ? 0 : (k / (n - 1) - 0.5) * b.l));
    ys.forEach((y) => arc(dessous, plan, y, b.R, false, mode === "spire" ? 6 : 2));
    ys.forEach((y) => arc(dessus, plan, y, b.R, true, mode === "spire" ? 6 : 2));
    const a = plan.ecran({ x: -b.R, y: ys[0] }), z = plan.ecran({ x: -b.R, y: ys[n - 1] });
    L.svg("path", { d: `M${a.x} ${a.y - 2} H250 V${gen.bornes.rouge.y} H${gen.bornes.rouge.x + 4}`, fill: "none", stroke: "#c62828", "stroke-width": 2.4, "stroke-linejoin": "round" }, dessus);
    L.svg("path", { d: `M${z.x} ${z.y + 2} H262 V${gen.bornes.noire.y} H${gen.bornes.noire.x + 4}`, fill: "none", stroke: "#263238", "stroke-width": 2.4, "stroke-linejoin": "round" }, dessus);
    L.texte(dessus, plan.ecran({ x: 0, y: 0 }).x, plan.ecran({ x: 0, y: -plan.dv }).y - 12, mode === "spire" ? "spire plate : N = 20 tours, R = 5,0 cm" : "bobine : N = 200 spires, longueur 16 cm, R = 2,5 cm", { "font-size": 8, "font-weight": 700, fill: "#e8e2d4" });
  };

  L.sources_bobinage = (mode, I) => (mode === "spire" ? L.champ_magnetique.spire({ x: 0, y: 0, R: B.spire.R, N: B.spire.N, I, axe: Math.PI / 2 }) : L.champ_magnetique.bobine({ x: 0, y: 0, R: B.bobine.R, longueur: B.bobine.l, N: B.bobine.N, I, axe: Math.PI / 2 }));

  L.masque_bobinage = (mode, p) => Math.abs(Math.abs(p.x) - B[mode].R) < 0.0025 && Math.abs(p.y) <= B[mode].l / 2 + 0.0025;
})(window.Labo);
