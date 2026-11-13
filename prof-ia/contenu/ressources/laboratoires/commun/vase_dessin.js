/*
Rôle : dessin d'un vase thermique et de son contenu (échelle 1,2 px/mm) : calorimètre (vase Dewar de 11 cm, ouvert, paroi
       intérieure argentée) ou gobelet en polystyrène ; surface du liquide (eau ou huile), glaçons qui flottent, fil du
       cylindre plongé ; barrette posée sur le bord qui tient la sonde et l'agitateur ; sonde du thermomètre électronique et son afficheur (au dixième de degré) ; agitateur que l'on
       fait monter et descendre (il accélère l'équilibre thermique).
Reçoit : le groupe SVG, le modèle (vase_modele.js) et { x, base (y du fond), type ("calorimetre" ou "gobelet"),
         afficheur { x, y } }.
Produit : Labo.vase_dessin(g, modele, reglage) -> { dessiner(), dans(p) (centre de l'ouverture si p est au-dessus du vase, sinon null),
          haut } ; dessiner() est appelé à chaque image par la paillasse.
Utilisé par : les simulations du chapitre « Énergie thermique, transfert thermique ».
*/
(function (L) {
  const TYPES = { calorimetre: { R: 66, r: 54, H: 204 }, gobelet: { R: 48, r: 44, H: 120 } };

  function corps(g, t, x, haut, calo) {
    // Vase vu un peu d'en haut : paroi extérieure, bord, ouverture (paroi intérieure).
    if (calo) L.svg("rect", { x: x - t.R, y: haut, width: 2 * t.R, height: t.H, rx: 8, fill: "#d9dde0", stroke: "#6a7378" }, g);
    else L.svg("path", { d: `M${x - t.R} ${haut} L${x - t.R * 0.75} ${haut + t.H} H${x + t.R * 0.75} L${x + t.R} ${haut} Z`, fill: "#f6f6f2", stroke: "#b9b9b0" }, g);
    if (calo) L.texte(g, x, haut + t.H * 0.55, "CALORIMÈTRE", { "font-size": 8, "font-weight": 700, fill: "#3c4246" });
    L.svg("ellipse", { cx: x, cy: haut, rx: t.R, ry: t.R * 0.24, fill: calo ? "#aeb6bb" : "#ecece6", stroke: "#6a7378" }, g);
    L.svg("ellipse", { cx: x, cy: haut + 2, rx: t.r, ry: t.r * 0.22, fill: calo ? "#8a9298" : "#d8d8d0" }, g);
  }

  function contenu(g, v, t, x, haut) {
    // Surface du liquide (plus basse quand il y en a moins), glaçons, fil du solide plongé.
    const m = v.m + v.corps.reduce((s, k) => s + (k.liquide ? k.liquide.m : 0), 0);
    if (m > 0) {
      const y = haut + 2 + Math.max(2, t.r * 0.2 * (1 - m / 450)), huile = v.nom === "huile";
      L.svg("ellipse", { cx: x, cy: y, rx: t.r - 4, ry: (t.r - 4) * 0.2, fill: huile ? "#d9b13b" : "#7fb8d6", opacity: 0.9 }, g);
      for (let k = 0; k < Math.ceil(v.glace / 6); k++) L.svg("rect", { x: x - 30 + ((k * 23) % 50), y: y - 6 + ((k * 7) % 6), width: 9, height: 7, rx: 1.5, fill: "#f2fbff", stroke: "#a7c9d8", "stroke-width": 0.6 }, g);
    }
    if (v.corps.some((k) => !k.liquide)) L.svg("path", { d: `M${x + 6} ${haut - 70} V${haut + 4}`, stroke: "#e9e4d2", "stroke-width": 1.2 }, g);
  }

  L.vase_dessin = function (g, v, { x, base, type = "calorimetre", afficheur }) {
    // Groupes fixes (câble, boîtier de l'afficheur), groupe redessiné, agitateur saisissable.
    const t = TYPES[type], haut = base - t.H, calo = type === "calorimetre", a = { dy: 0 };
    L.svg("path", { d: `M${x - 22} ${haut - 70} C${x - 22} ${haut - 110} ${afficheur.x - 60} ${afficheur.y + 12} ${afficheur.x - 46} ${afficheur.y + 12}`, fill: "none", stroke: "#1b1e21", "stroke-width": 2 }, g);
    L.svg("rect", { x: afficheur.x - 48, y: afficheur.y - 14, width: 96, height: 40, rx: 5, fill: "#e9b949", stroke: "#6b5300" }, g);
    L.texte(g, afficheur.x, afficheur.y - 4, "THERMOMÈTRE", { "font-size": 6.5, "font-weight": 700, fill: "#3b2a05" });
    L.svg("rect", { x: afficheur.x - 40, y: afficheur.y, width: 80, height: 20, rx: 3, fill: "#1d2a22" }, g);
    const c = L.svg("g", {}, g), ag = L.svg("g", { class: "agitateur", role: "slider", "aria-label": "Agitateur" }, g);
    L.glissable(ag, { soulever: false, debut: () => ({ x: 0, y: a.dy }), deplacer: (p) => { a.dy = Math.max(-24, Math.min(10, p.y)); v.agiter(); }, lacher: () => { a.dy = 0; } });
    function dessiner() {
      // Vase, contenu, barrette, sonde, agitateur et température affichée.
      c.replaceChildren(); ag.replaceChildren();
      corps(c, t, x, haut, calo);
      contenu(c, v, t, x, haut);
      L.svg("rect", { x: x - t.R - 4, y: haut - 6, width: 2 * t.R + 8, height: 7, rx: 2, fill: "#2b3035", stroke: "#111" }, c);
      L.tige(c, `M${x - 22} ${haut - 70} V${haut + 6}`, 2.4);
      L.tige(ag, `M${x + 20} ${haut - 56 + a.dy} V${haut + 6 + a.dy}`, 1.6);
      L.svg("ellipse", { cx: x + 20, cy: haut - 60 + a.dy, rx: 7, ry: 4, fill: "none", stroke: "url(#metal)", "stroke-width": 2 }, ag);
      L.svg("rect", { x: x + 6, y: haut - 76 + a.dy, width: 28, height: 40, fill: "#000", opacity: 0.001 }, ag);
      L.texte(c, afficheur.x, afficheur.y + 15, `${v.theta.toFixed(1).replace(".", ",")} °C`, { "font-size": 12, "font-weight": 700, fill: "#7dff9a", "font-family": "monospace" });
    }
    dessiner();
    return { dessiner, haut, dans: (p) => (Math.abs(p.x - x) < t.R + 30 && p.y < haut + 60 && p.y > haut - 160 ? { x, y: haut } : null) };
  };
})(window.Labo);
