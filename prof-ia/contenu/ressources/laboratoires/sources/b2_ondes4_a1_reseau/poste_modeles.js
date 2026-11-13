/*
Rôle : paillasse « modèles de réseau » : boîte de trois diapositives (réseaux de 100, 300 et 600 traits par mm), un CD et
       un DVD dont on a retiré la couche réfléchissante. On touche un objet : sa photographie au microscope s'affiche en
       haut (traits parallèles et équidistants ; sillons du CD et du DVD, avec leurs cuvettes), avec une règle en
       micromètres et deux curseurs rouges pour mesurer le pas a (distance entre deux traits voisins).
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_modeles(g) -> { pense_bete } ; fait « modeles » = { objet, a (µm), c1, c2, ecart (µm), vus [objets] }.
Utilisé par : simulation.js.
*/
(function (L) {
  const OBJETS = {
    r100: { nom: "réseau 100 traits/mm", a: 10, champ: 60, grad: 1, chiffres: 10 }, r300: { nom: "réseau 300 traits/mm", a: 1000 / 300, champ: 24, grad: 0.5, chiffres: 2 },
    r600: { nom: "réseau 600 traits/mm", a: 1000 / 600, champ: 12, grad: 0.2, chiffres: 2 }, cd: { nom: "CD", a: 1.6, champ: 20, grad: 0.5, chiffres: 2, sillons: true },
    dvd: { nom: "DVD", a: 0.74, champ: 10, grad: 0.2, chiffres: 1, sillons: true },
  };
  const X = 306, Y = 54, W = 680, H = 150, hasard = (i, j) => { const s = Math.sin(i * 12.9898 + j * 78.233) * 43758.5453; return s - Math.floor(s); };

  function photo(g, o) {
    // Photographie : fentes claires (b = 0,15·a) sur fond sombre, ou sillons de cuvettes sombres sur le plastique clair.
    const e = W / o.champ, clip = L.svg("clipPath", { id: "photo_reseau" }, g); L.svg("rect", { x: X, y: Y, width: W, height: H }, clip);
    const z = L.svg("g", { "clip-path": "url(#photo_reseau)" }, g);
    L.svg("rect", { x: X, y: Y, width: W, height: H, fill: o.sillons ? "#c9ced2" : "#2a2d31" }, z);
    for (let j = 0; (j + 0.3) * o.a <= o.champ + o.a; j++) {
      const x = X + (j + 0.3) * o.a * e;
      if (!o.sillons) { L.svg("rect", { x: x - 0.075 * o.a * e, y: Y, width: 0.15 * o.a * e, height: H, fill: "#e8ecd8" }, z); continue; }
      for (let y = -hasard(j, 0) * 3, n = 0; y < H / e; n++) { const l = (o.a > 1 ? 0.9 : 0.4) + hasard(j, n + 1) * (o.a > 1 ? 2.4 : 1.4); L.svg("rect", { x: x - 0.17 * o.a * e, y: Y + y * e, width: 0.34 * o.a * e, height: l * e, rx: 0.17 * o.a * e, fill: "#4d545b" }, z); y += l + (o.a > 1 ? 0.8 : 0.4) + hasard(n, j) * 1.5; }
    }
    for (let m = 0; m <= o.champ + 1e-9; m += o.grad) { const x = X + m * e, fort = Math.abs(m / o.chiffres - Math.round(m / o.chiffres)) < 1e-6; L.svg("line", { x1: x, y1: Y + H + 2, x2: x, y2: Y + H + (fort ? 10 : 5), stroke: "#333", "stroke-width": 0.6 }, g); if (fort) L.texte(g, x, Y + H + 19, String(Math.round(m * 10) / 10).replace(".", ","), { "font-size": 7, fill: "#333" }); }
    L.texte(g, X + W + 8, Y + H + 19, "µm", { "font-size": 7, fill: "#333", "text-anchor": "start" });
  }

  function curseurs(g, e, o, noter) {
    // Deux curseurs rouges glissés le long de la règle (au dixième de graduation).
    [["c1", 0.2], ["c2", 0.7]].forEach(([cle, f]) => {
      e[cle] = Math.round(f * o.champ / o.grad) * o.grad;
      const b = L.svg("g", { class: `curseur-${cle}`, role: "button", "aria-label": `Curseur ${cle}` }, g), px = () => X + (e[cle] / o.champ) * W;
      const placer = () => { b.replaceChildren(); L.svg("line", { x1: px(), y1: Y - 4, x2: px(), y2: Y + H + 4, stroke: "#ff3b30", "stroke-width": 1 }, b); L.svg("path", { d: `M${px()} ${Y + H + 22} l-6 9 h12 Z`, fill: "#e53935" }, b); L.texte(b, px(), Y + H + 42, `${cle} : ${e[cle].toFixed(2).replace(".", ",")} µm`, { "font-size": 7.5, "font-weight": 700, fill: "#b71c1c" }); L.svg("rect", { x: px() - 11, y: Y - 6, width: 22, height: H + 40, fill: "#000", opacity: 0 }, b); };
      L.glissable(b, { soulever: false, debut: () => ({ x: px(), y: 0 }), deplacer: (p) => { const r = o.grad / 10; e[cle] = Math.max(0, Math.min(o.champ, Math.round(((p.x - X) / W) * o.champ / r) * r)); placer(); }, lacher: noter });
      placer();
    });
  }

  function objets_table(g, choisir) {
    // Boîte de diapositives (cadres de 5 cm), CD et DVD de 12 cm posés sur la paillasse ; on les touche.
    L.boitier(g, 300, 470, 230, 16, 54, { dessus: "#8b5e34", face: "#6d4a26" });
    [["r100", "100"], ["r300", "300"], ["r600", "600"]].forEach(([cle, t], k) => {
      const b = L.svg("g", { class: `objet-${cle}`, role: "button", "aria-label": OBJETS[cle].nom }, g), x = 318 + k * 72;
      L.svg("path", { d: `M${x + 6} 446 h52 l-6 30 h-52 Z`, fill: "#f2f0ea", stroke: "#9a978c" }, b);
      L.svg("path", { d: `M${x + 18} 452 h24 l-3 16 h-24 Z`, fill: "#b7c6cc", opacity: 0.8 }, b);
      L.texte(b, x + 29, 482, `${t} traits/mm`, { "font-size": 6.5, "font-weight": 700, fill: "#f4f1e6" });
      L.glissable(b, { soulever: false, debut: () => ({ x: 0, y: 0 }), toucher: () => choisir(cle) });
    });
    [["cd", 650, "CD", "#e9e4f2"], ["dvd", 790, "DVD", "#d9cde8"]].forEach(([cle, x, t, c]) => {
      const b = L.svg("g", { class: `objet-${cle}`, role: "button", "aria-label": t }, g);
      L.ombre_sol(b, x, 512, 62, 6, 0.35);
      L.svg("ellipse", { cx: x, cy: 488, rx: 60, ry: 22, fill: c, stroke: "#8e88a0" }, b);
      for (const [d, col] of [[48, "#ff8a80"], [40, "#ffe082"], [32, "#a5d6a7"], [24, "#90caf9"]]) L.svg("path", { d: `M${x - d} 488 A${d} ${d * 0.37} 0 0 1 ${x - d * 0.3} ${488 - d * 0.35}`, fill: "none", stroke: col, "stroke-width": 3, opacity: 0.7 }, b);
      L.svg("ellipse", { cx: x, cy: 488, rx: 8, ry: 3, fill: "#5c5a56" }, b);
      L.texte(b, x, 526, t, { "font-size": 7, "font-weight": 700, fill: "#f4f1e6" });
      L.glissable(b, { soulever: false, debut: () => ({ x: 0, y: 0 }), toucher: () => choisir(cle) });
    });
    L.texte(g, 720, 540, "(couche réfléchissante retirée)", { "font-size": 7, fill: "#d8d2c0" });
  }

  L.poste_modeles = function (g) {
    // Panneau de la photographie, objets ; toucher un objet change la photographie.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230), e = { objet: "r100", c1: 0, c2: 0, vus: [] };
    L.svg("rect", { x: X - 14, y: Y - 28, width: W + 40, height: H + 82, rx: 3, fill: "#f3f2ec", stroke: "#9a9a90", filter: "url(#ombre)" }, g);
    const titre = L.svg("g", {}, g), gp = L.svg("g", {}, g);
    const noter = () => { const o = OBJETS[e.objet]; L.missions.noter("modeles", { objet: e.objet, a: Math.round(o.a * 1000) / 1000, c1: e.c1, c2: e.c2, ecart: Math.round(Math.abs(e.c2 - e.c1) * 100) / 100, vus: [...e.vus] }); };
    const choisir = (cle) => {
      e.objet = cle; if (!e.vus.includes(cle)) e.vus.push(cle);
      titre.replaceChildren(); L.texte(titre, X, Y - 14, `Photographie au microscope : ${OBJETS[cle].nom}`, { "font-size": 8, "font-weight": 700, fill: "#23315a", "text-anchor": "start" });
      gp.replaceChildren(); photo(gp, OBJETS[cle]); curseurs(gp, e, OBJETS[cle], noter); noter();
    };
    objets_table(g, choisir); choisir("r100");
    return { pense_bete };
  };
})(window.Labo);
