/*
Rôle : goniomètre à prisme, vu un peu d'en haut : plateau gradué, prisme équilatéral (A = 60°) en verre flint
       (n = 1,5970 + 9 400 / λ², λ en nm : 1,619 dans le rouge, 1,630 dans le vert), source fixe (laser rouge 650 nm,
       laser vert 532 nm ou lampe avec fente : lumière blanche), lunette (alidade) que l'on fait tourner autour du
       plateau. On règle l'angle d'incidence i en tournant le prisme ; le trajet de la lumière suit les lois de Descartes
       (sin i = n·sin r, A = r + r′, sin i′ = n·sin r′, D = i + i′ − A) ; la lunette affiche la déviation qu'elle vise et
       signale quand le faisceau est sur son réticule.
Reçoit : le groupe SVG et { x, y (centre du plateau), fait }.
Produit : Labo.goniometre_prisme(g, reglage) -> s { source, i, visee } ; fait « <fait> » = { source, i (°), visee (°), aligne,
          D (° pour la source, null en lumière blanche), emerge (faux : réflexion totale) } ; Labo.indice_flint(λ).
Utilisé par : les simulations de dispersion de la lumière.
*/
(function (L) {
  const A = 60, R = 200, KY = 0.3, RAD = Math.PI / 180, SOURCES = { rouge: [650], vert: [532], blanche: [410, 450, 490, 530, 570, 610, 650, 700] };
  L.indice_flint = (l) => 1.597 + 9400 / (l * l);
  const p = (c, x, y) => `${(c.x + x).toFixed(1)} ${(c.y - y * KY).toFixed(1)}`;

  function trajet(i, n) {
    // Angles du trajet (degrés) ; null si la lumière ne sort pas (réflexion totale sur la deuxième face).
    const r = Math.asin(Math.sin(i * RAD) / n) / RAD, r2 = A - r, s = n * Math.sin(r2 * RAD);
    if (Math.abs(s) >= 1) return null;
    const i2 = Math.asin(s) / RAD;
    return { r, r2, i2, D: i + i2 - A };
  }

  function prisme(g, c, i) {
    // Prisme de 6 cm de côté et 3 cm de haut, tourné de (30° − i) autour de son centre ; base vers les angles négatifs.
    const rot = (30 - i) * RAD, cote = 60, pts = [[0, cote / Math.sqrt(3)], [-cote / 2, -cote / (2 * Math.sqrt(3))], [cote / 2, -cote / (2 * Math.sqrt(3))]];
    const q = pts.map(([x, y]) => [x * Math.cos(rot) - y * Math.sin(rot), x * Math.sin(rot) + y * Math.cos(rot)]);
    const bas = q.map(([x0, y0]) => p(c, x0, y0)), haut = bas.map((t) => { const [a, b] = t.split(" ").map(Number); return `${a} ${b - 36}`; });
    L.svg("path", { d: `M${bas[0]} L${bas[1]} L${bas[2]} Z`, fill: "rgba(200,225,233,0.45)", stroke: "#6f9aa6" }, g);
    for (let k = 0; k < 3; k++) L.svg("line", { x1: +bas[k].split(" ")[0], y1: +bas[k].split(" ")[1], x2: +haut[k].split(" ")[0], y2: +haut[k].split(" ")[1], stroke: "#6f9aa6", "stroke-width": 0.8 }, g);
    L.svg("path", { d: `M${haut[0]} L${haut[1]} L${haut[2]} Z`, fill: "rgba(215,236,243,0.55)", stroke: "#6f9aa6" }, g);
  }

  function rayons(g, c, s) {
    // Faisceau incident (axe du plateau), puis, pour chaque radiation, faisceau émergent jusqu'au bord du plateau.
    const raies = SOURCES[s.source], couleur = (l) => { const [r, v, b] = L.couleur_onde(l); return `rgb(${Math.round(255 * r)},${Math.round(255 * v)},${Math.round(255 * b)})`; };
    L.svg("line", { x1: c.x - R - 40, y1: c.y, x2: c.x, y2: c.y, stroke: s.source === "blanche" ? "#fff7d8" : couleur(raies[0]), "stroke-width": 2 }, g);
    for (const l of raies) {
      const t = trajet(s.i, L.indice_flint(l));
      if (!t) continue;
      const a = -t.D * RAD; L.svg("path", { d: `M${p(c, 0, 0)} L${p(c, R * Math.cos(a), R * Math.sin(a))}`, stroke: couleur(l), "stroke-width": s.source === "blanche" ? 1.4 : 2, opacity: 0.9 }, g);
    }
  }

  function plateau(g, c) {
    // Plateau gradué (0° dans l'axe du faisceau incident, déviations comptées vers la base du prisme, 0 à 90°) et source.
    L.svg("ellipse", { cx: c.x, cy: c.y, rx: R + 24, ry: (R + 24) * KY, fill: "#d8dcd6", stroke: "#8a948c" }, g);
    const xs = c.x - R - 60;
    L.ombre_sol(g, xs, c.y + 26, 40, 5, 0.4); L.tige(g, `M${xs} ${c.y + 8} V${c.y + 26}`, 4);
    L.svg("rect", { x: xs - 40, y: c.y - 9, width: 60, height: 18, rx: 4, fill: "#3b4248", stroke: "#111" }, g);
    L.svg("rect", { x: xs + 20, y: c.y - 4, width: 10, height: 8, fill: "#22272b" }, g);
    for (let d = 0; d <= 90; d += 1) { const a = -d * RAD, l = d % 10 ? (d % 5 ? 6 : 10) : 16; L.svg("line", { x1: c.x + (R + 4) * Math.cos(a), y1: c.y - (R + 4) * Math.sin(a) * KY, x2: c.x + (R + 4 + l) * Math.cos(a), y2: c.y - (R + 4 + l) * Math.sin(a) * KY, stroke: "#2b2f33", "stroke-width": 0.5 }, g); if (d % 10 === 0) L.texte(g, c.x + (R - 12) * Math.cos(a), c.y - (R - 12) * Math.sin(a) * KY, `${d}°`, { "font-size": 7, "font-weight": 700, fill: "#2b2f33" }); }
  }

  function lunette(g, c, s) {
    // Lunette sur son bras, pointée vers le centre du plateau, à l'angle visé.
    const a = -s.visee * RAD, x = c.x + (R + 50) * Math.cos(a), y = c.y - (R + 50) * Math.sin(a) * KY;
    L.svg("line", { x1: c.x, y1: c.y, x2: x, y2: y, stroke: "#5d646a", "stroke-width": 3 }, g);
    L.svg("rect", { x: x - 18, y: y - 26, width: 36, height: 14, rx: 4, fill: "#2f3438", stroke: "#111", transform: `rotate(${-s.visee * 0.3} ${x} ${y - 19})` }, g);
    L.tige(g, `M${x} ${y - 12} V${y}`, 3);
  }

  function commandes(g, c, s, changer) {
    // Lecture du goniomètre, réglage de l'incidence (rotation du prisme), réglage de la lunette, choix de la source.
    const x = c.x + R + 150, y = c.y - 190;
    L.boitier(g, x - 90, y - 30, 180, 14, 230, { dessus: "#cfd5d9", face: "#46525a" });
    L.texte(g, x, y - 23, "GONIOMÈTRE", { "font-size": 7, "font-weight": 700, fill: "#23315a" });
    L.bouton_reglage(g, { x: x - 40, y: y + 60, min: 20, max: 80, pas: 0.5, valeur: s.i, unite: "°", titre: "incidence i", decimales: 1, sur_changement: (v) => { s.i = v; changer(); } });
    L.bouton_reglage(g, { x: x + 44, y: y + 60, min: 0, max: 90, pas: 0.1, valeur: s.visee, unite: "°", titre: "lunette", decimales: 1, sur_changement: (v) => { s.visee = Math.round(v * 10) / 10; changer(); } });
    L.bouton_texte(g, x, y + 120, "Source", () => { const k = Object.keys(SOURCES); s.source = k[(k.indexOf(s.source) + 1) % k.length]; changer(); });
    const ecran = L.svg("g", {}, g);
    return (t) => { ecran.replaceChildren(); L.svg("rect", { x: x - 76, y: y + 140, width: 152, height: 40, rx: 3, fill: "#1d2a22" }, ecran); L.texte(ecran, x, y + 153, s.source === "blanche" ? "lampe + fente" : `laser ${SOURCES[s.source][0]} nm`, { "font-size": 7.5, fill: "#7dff9a", "font-family": "monospace" }); L.texte(ecran, x, y + 169, t, { "font-size": 8, "font-weight": 700, fill: "#7dff9a", "font-family": "monospace" }); };
  }

  L.goniometre_prisme = function (g, { x, y, fait = "goniometre" }) {
    // Plateau, prisme, rayons, lunette et commandes ; chaque réglage redessine tout.
    const s = { source: "rouge", i: 50, visee: 30 }, c = { x, y };
    plateau(g, c);
    const gd = L.svg("g", { "pointer-events": "none" }, g), lire = commandes(g, c, s, () => changer());
    const changer = () => {
      gd.replaceChildren(); rayons(gd, c, s); prisme(gd, c, s.i); lunette(gd, c, s);
      const t = s.source === "blanche" ? null : trajet(s.i, L.indice_flint(SOURCES[s.source][0])), aligne = !!t && Math.abs(t.D - s.visee) <= 0.15;
      lire(aligne ? "faisceau sur le réticule" : "réticule : pas de faisceau");
      L.missions.noter(fait, { source: s.source, i: s.i, visee: s.visee, aligne, D: t ? Math.round(t.D * 100) / 100 : null, emerge: s.source === "blanche" || !!t });
    };
    changer();
    return s;
  };
})(window.Labo);
