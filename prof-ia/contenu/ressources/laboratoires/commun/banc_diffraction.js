/*
Rôle : banc de diffraction de la lumière : source (laser rouge 650 nm, laser vert 532 nm, ou lampe avec fente source :
       lumière blanche), diapositive de fentes (40 à 150 µm), de fils (100 à 200 µm) et d'un cheveu, posée près de la
       source ; écran blanc sur son pied, que l'on fait glisser le long d'un mètre-ruban (distance D de 0,50 à 2,20 m).
       L'écran vu de face (agrandi au mur, 120 mm de large) montre la figure de diffraction, perpendiculaire à la fente :
       intensité sinc²(π·a·x / (λ·D)) (un fil donne la même figure qu'une fente de même largeur) ; deux curseurs mesurent la
       largeur L de la tache centrale. θ = λ / a et L = 2·λ·D / a.
Reçoit : le groupe SVG et { x0 (px de la diapositive), k (px par m), sol, y_faisceau, vue { x, y }, fait }.
Produit : Labo.banc_diffraction(g, reglage) -> s { source, objet, D } ; fait « <fait> » = { source, lambda (nm, null en lumière
          blanche), objet (texte), type (fente, fil, cheveu), a (µm), D (m), L (mm, largeur vraie de la tache centrale),
          ecart (mm, entre les curseurs) } ; Labo.couleur_onde(λ en nm) -> [r, g, b].
Utilisé par : les simulations de diffraction de la lumière.
*/
(function (L) {
  const OBJETS = [["fente", 40], ["fente", 50], ["fente", 70], ["fente", 100], ["fente", 150], ["fil", 100], ["fil", 200], ["cheveu", 72]];
  const SOURCES = { rouge: 650, vert: 532, blanche: null }, PX_MM = 3, LARG = 120;

  L.couleur_onde = function (l) {
    // Couleur approchée d'une radiation visible (380 à 780 nm).
    const r = l < 440 ? (440 - l) / 60 : l < 510 ? 0 : l < 580 ? (l - 510) / 70 : 1, v = l < 440 ? 0 : l < 490 ? (l - 440) / 50 : l < 580 ? 1 : l < 645 ? (645 - l) / 65 : 0, b = l < 490 ? 1 : l < 510 ? (510 - l) / 20 : 0;
    const f = l < 420 ? 0.3 + (0.7 * (l - 380)) / 40 : l > 700 ? 0.3 + (0.7 * (780 - l)) / 80 : 1;
    return [r * f, v * f, b * f];
  };

  function intensite(x_mm, a_um, l_nm, D) {
    // Intensité relative au point x de l'écran (mm) pour une fente de largeur a.
    const u = (Math.PI * a_um * 1e-6 * x_mm * 1e-3) / (l_nm * 1e-9 * D);
    return Math.abs(u) < 1e-9 ? 1 : (Math.sin(u) / u) ** 2;
  }

  function peindre(s, img, toile) {
    // Figure sur l'écran (salle dans la pénombre) : pour la lumière blanche, somme de quinze radiations colorées ; tache de 4 mm de haut.
    const c = toile.getContext("2d"), W = toile.width, H = toile.height, d = c.createImageData(W, H), [, a] = OBJETS[s.objet];
    const raies = s.source === "blanche" ? Array.from({ length: 15 }, (_, i) => 400 + i * 23) : [SOURCES[s.source]];
    for (let i = 0; i < W; i++) {
      const x = ((i + 0.5) / W - 0.5) * LARG, rgb = [0, 0, 0];
      for (const l of raies) { const I = intensite(x, a, l, s.D), col = L.couleur_onde(l); for (let k = 0; k < 3; k++) rgb[k] += (I * col[k] * 3) / raies.length; }
      for (let j = 0; j < H; j++) { const h = Math.exp(-(((j - H / 2) / (H / 5)) ** 2)), p = 4 * (j * W + i); for (let k = 0; k < 3; k++) d.data[p + k] = Math.min(255, 70 + 200 * Math.sqrt(Math.min(1, rgb[k] * h))); d.data[p + 3] = 255; }
    }
    c.putImageData(d, 0, 0); img.setAttribute("href", toile.toDataURL());
  }

  function vue(g, s, c, noter) {
    // Écran vu de face (agrandi) : figure, règle en millimètres, deux curseurs rouges.
    const { x, y } = c.vue, w = LARG * PX_MM;
    L.svg("rect", { x: x - 12, y: y - 26, width: w + 24, height: 132, rx: 3, fill: "#f7f7f2", stroke: "#9a9a90", filter: "url(#ombre)" }, g);
    L.texte(g, x + w / 2, y - 16, "Écran vu de face (agrandi)", { "font-size": 8, "font-weight": 700, fill: "#23315a" });
    const img = L.svg("image", { x, y, width: w, height: 60, preserveAspectRatio: "none" }, g);
    for (let m = 0; m <= LARG; m++) L.svg("line", { x1: x + m * PX_MM, y1: y + 62, x2: x + m * PX_MM, y2: y + 62 + (m % 10 ? (m % 5 ? 3 : 5) : 8), stroke: "#333", "stroke-width": 0.5 }, g);
    for (let m = 0; m <= LARG; m += 10) L.texte(g, x + m * PX_MM, y + 78, String(m - LARG / 2), { "font-size": 6.5, fill: "#333" });
    L.texte(g, x + w + 6, y + 78, "mm", { "font-size": 6.5, fill: "#333", "text-anchor": "start" });
    [["c1", -20], ["c2", 20]].forEach(([cle, m]) => {
      s[cle] = m;
      const b = L.svg("g", { class: `curseur-${cle}`, role: "button", "aria-label": `Curseur ${cle}` }, g);
      const placer = () => { b.replaceChildren(); const px = x + (s[cle] + LARG / 2) * PX_MM; L.svg("line", { x1: px, y1: y - 4, x2: px, y2: y + 66, stroke: "#e53935", "stroke-width": 1 }, b); L.svg("path", { d: `M${px} ${y + 96} l-6 8 h12 Z`, fill: "#e53935" }, b); L.svg("rect", { x: px - 10, y: y - 6, width: 20, height: 112, fill: "#000", opacity: 0 }, b); };
      L.glissable(b, { soulever: false, debut: () => ({ x: x + (s[cle] + LARG / 2) * PX_MM, y: 0 }), deplacer: (p) => { s[cle] = Math.max(-LARG / 2, Math.min(LARG / 2, Math.round(((p.x - x) / PX_MM - LARG / 2) * 2) / 2)); placer(); }, lacher: noter });
      placer();
    });
    return img;
  }

  function banc(g, s, c, changer) {
    // Mètre-ruban, source, diapositive sur son support, écran déplaçable ; boutons de la source et de l'objet.
    for (let i = 0; i <= 22; i++) { const x = c.x0 + i * 0.1 * c.k; L.svg("line", { x1: x, y1: c.sol - 2, x2: x, y2: c.sol + (i % 5 ? 4 : 8), stroke: "#e8e2cc" }, g); if (i % 5 === 0) L.texte(g, x, c.sol + 16, `${(i / 10).toFixed(1).replace(".", ",")} m`, { "font-size": 7, fill: "#e8e2cc" }); }
    L.svg("rect", { x: c.x0, y: c.sol - 2, width: 2.2 * c.k, height: 3, fill: "#e8c84a" }, g);
    L.boitier(g, c.x0 - 120, c.y_faisceau - 12, 90, 10, 22, { dessus: "#d9dcd8", face: "#3b4248" });
    L.tige(g, `M${c.x0 - 75} ${c.y_faisceau + 20} V${c.sol}`, 3);
    L.svg("rect", { x: c.x0 - 3, y: c.y_faisceau - 22, width: 6, height: 40, fill: "#2b2f33" }, g); L.tige(g, `M${c.x0} ${c.y_faisceau + 18} V${c.sol}`, 3);
    const faisceau = L.svg("line", { x1: c.x0 - 30, y1: c.y_faisceau, x2: c.x0, y2: c.y_faisceau, "stroke-width": 1.5, opacity: 0.7 }, g), ge = L.svg("g", { class: "ecran-diffraction", role: "button", "aria-label": "Écran" }, g);
    const dessiner = () => { const xe = c.x0 + s.D * c.k; faisceau.setAttribute("stroke", s.source === "blanche" ? "#fff7d8" : s.source === "rouge" ? "#ff3b30" : "#34c759"); ge.replaceChildren(); L.svg("line", { x1: c.x0, y1: c.y_faisceau, x2: xe, y2: c.y_faisceau, stroke: faisceau.getAttribute("stroke"), "stroke-width": 0.8, opacity: 0.35 }, ge); L.tige(ge, `M${xe} ${c.y_faisceau + 40} V${c.sol}`, 3); L.svg("rect", { x: xe - 4, y: c.y_faisceau - 45, width: 8, height: 85, fill: "#f4f4ee", stroke: "#999" }, ge); L.svg("rect", { x: xe - 20, y: c.y_faisceau - 50, width: 40, height: c.sol - c.y_faisceau + 55, fill: "#000", opacity: 0 }, ge); };
    L.glissable(ge, { soulever: false, debut: () => ({ x: c.x0 + s.D * c.k, y: 0 }), deplacer: (p) => { s.D = Math.max(0.5, Math.min(2.2, Math.round(((p.x - c.x0) / c.k) * 20) / 20)); dessiner(); }, lacher: () => changer() });
    L.bouton_texte(g, c.x0 - 75, c.y_faisceau - 62, "Source", () => { const k = Object.keys(SOURCES); s.source = k[(k.indexOf(s.source) + 1) % k.length]; dessiner(); changer(); });
    L.bouton_texte(g, c.x0 + 40, c.y_faisceau - 62, "Diapositive", () => { s.objet = (s.objet + 1) % OBJETS.length; changer(); });
    return dessiner;
  }

  L.banc_diffraction = function (g, { x0, k, sol, y_faisceau, vue: v, fait = "diffraction" }) {
    // Banc, écran vu de face ; tout changement recalcule la figure.
    const s = { source: "rouge", objet: 3, D: 2.0 }, c = { x0, k, sol, y_faisceau, vue: v }, toile = document.createElement("canvas");
    toile.width = 360; toile.height = 24;
    const etiquette = L.svg("g", {}, g);
    const noter = () => { const [type, a] = OBJETS[s.objet], l = SOURCES[s.source]; L.missions.noter(fait, { source: s.source, lambda: l, objet: `${type} ${a} µm`, type, a, D: s.D, L: l ? Math.round(((2 * l * 1e-9 * s.D) / (a * 1e-6)) * 10000) / 10 : null, ecart: Math.abs(s.c2 - s.c1) }); };
    const img = vue(g, s, c, noter);
    const changer = () => { peindre(s, img, toile); const [type, a] = OBJETS[s.objet]; etiquette.replaceChildren(); L.texte(etiquette, x0, y_faisceau - 30, type === "cheveu" ? "cheveu" : `${type} ${a} µm`, { "font-size": 7.5, "font-weight": 700, fill: "#f4f1e6" }); L.texte(etiquette, x0 - 75, y_faisceau - 22, s.source === "blanche" ? "lampe + fente" : `laser ${SOURCES[s.source]} nm`, { "font-size": 7, "font-weight": 700, fill: "#f4f1e6" }); noter(); };
    const dessiner = banc(g, s, c, changer);
    dessiner(); changer();
    return s;
  };
})(window.Labo);
