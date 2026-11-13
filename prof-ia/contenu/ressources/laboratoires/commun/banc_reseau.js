/*
Rôle : banc de diffraction par un réseau, vu de dessus dans la salle obscure (un peu de poussière de craie rend les
       faisceaux visibles) : source (laser rouge 650 nm, laser vert 532 nm, ou lampe avec fente source : lumière blanche),
       diapositive (fentes, réseaux, CD et DVD sans couche réfléchissante) sur un plateau tournant gradué (incidence i,
       si l'option est choisie), mètre-ruban, grand écran que l'on fait glisser (D de 0,25 à 1,30 m). Les rayons diffractés
       partent dans les directions des maximums ; ceux qui manquent l'écran continuent sur la table. Écran vu de face en haut.
Reçoit : le groupe SVG et { fait, incidence (vrai : bouton de rotation du réseau), objets (indices dans Labo.RESEAUX), D }.
Produit : Labo.banc_reseau(g, reglage) -> s ; fait « <fait> » = { source, lambda (nm, null en lumière blanche), objet (nom),
          type, n (traits/mm), a (µm), i (°), D (m), c1, c2, ecart (mm), ordres [{ k, x (mm), ecran }], maximums }.
Utilisé par : les simulations de diffraction par un réseau.
*/
(function (L) {
  const XA = 640, YR = 560, K = 280, T = { x: 262, y: 182, l: 756, h: 454 }, SOURCES = ["rouge", "vert", "blanche"];
  const RAD = Math.PI / 180, ys = (s) => YR - s.D * K;

  function table(g) {
    // Table de bois dans la pénombre ; mètre-ruban le long du faisceau, zéro sous le réseau.
    L.svg("rect", { x: T.x, y: T.y, width: T.l, height: T.h, fill: "url(#bois)" }, g);
    L.svg("rect", { x: T.x, y: T.y, width: T.l, height: T.h, fill: "#06080c", opacity: 0.72, stroke: "#9a9a90" }, g);
    L.texte(g, T.x + 10, T.y + 16, "La table vue de dessus (salle obscure)", { "font-size": 8, "font-weight": 700, fill: "#e8e2d4", "text-anchor": "start" });
    const xr = XA - 150;
    L.svg("rect", { x: xr - 6, y: YR - 1.32 * K, width: 12, height: 1.32 * K + 4, fill: "#c9a93a", opacity: 0.85 }, g);
    for (let c = 0; c <= 130; c += 5) { const y = YR - c * 0.01 * K; L.svg("line", { x1: xr - 6, y1: y, x2: xr - 6 + (c % 10 ? 4 : 8), y2: y, stroke: "#2b2410", "stroke-width": 0.7 }, g); if (c % 10 === 0) L.texte(g, xr + 3, y + 2.5, String(c), { "font-size": 5.5, fill: "#2b2410" }); }
    L.texte(g, xr, YR + 14, "mètre-ruban (cm)", { "font-size": 6.5, fill: "#d8d2c0" });
  }

  function rayons(g, s) {
    // Faisceau incident, puis faisceaux diffractés (un par ordre et par radiation) ; cône étroit pour une fente.
    const o = L.RESEAUX[s.objet], raies = L.raies_source(s.source).filter((l, k) => s.source !== "blanche" || k % 3 === 0), blanc = s.source === "blanche";
    L.svg("line", { x1: XA, y1: YR + 12, x2: XA, y2: o.type === "reseau" && blanc ? ys(s) : YR, stroke: blanc ? "#fff7d8" : L.couleur_css(raies[0]), "stroke-width": 2 }, g);
    for (const l of raies) {
      const c = L.couleur_css(l);
      if (o.type === "fente") { const e = Math.max(1.5, ((l * 1e-3) / o.b) * s.D * K); L.svg("path", { d: `M${XA} ${YR} L${XA - e} ${ys(s)} H${XA + e} Z`, fill: c, opacity: blanc ? 0.12 : 0.35 }, g); continue; }
      for (const r of L.ordres_reseau(o, l, s.i)) {
        if (Math.abs(r.delta) >= Math.PI / 2 || (blanc && r.k === 0)) continue;
        const x = s.D * Math.tan(r.delta), long = Math.abs(x) <= 0.35 ? s.D / Math.cos(r.delta) : 2.2;
        L.svg("line", { x1: XA, y1: YR, x2: XA + long * K * Math.sin(r.delta), y2: YR - long * K * Math.cos(r.delta), stroke: c, "stroke-width": blanc ? 1 : 1.4, opacity: (blanc ? 0.45 : 0.9) * Math.sqrt(r.eclat) }, g);
      }
    }
  }

  function materiel(g, s, incidence) {
    // Source (laser ou lampe et fente), plateau tournant gradué, diapositive tournée de i, normale au réseau ; écran.
    const blanc = s.source === "blanche", o = L.RESEAUX[s.objet];
    L.svg("rect", { x: XA - (blanc ? 16 : 8), y: YR + 12, width: blanc ? 32 : 16, height: 56, rx: 3, fill: blanc ? "#4b5157" : "#2f3438", stroke: "#000" }, g);
    L.texte(g, XA + 26, YR + 46, blanc ? "lampe + fente source" : s.source === "vert" ? "laser vert" : "laser rouge 650 nm", { "font-size": 7, "font-weight": 700, fill: "#f4f1e6", "text-anchor": "start" });
    L.svg("circle", { cx: XA, cy: YR, r: 18, fill: "#3a4046", stroke: "#111" }, g);
    for (let d = -60; d <= 60; d += 10) L.svg("line", { x1: XA - 18 * Math.sin(d * RAD), y1: YR + 18 * Math.cos(d * RAD), x2: XA - 14 * Math.sin(d * RAD), y2: YR + 14 * Math.cos(d * RAD), stroke: "#d8d2c0", "stroke-width": 0.6 }, g);
    const p = L.svg("g", { transform: `rotate(${-s.i} ${XA} ${YR})` }, g);
    L.svg("rect", { x: XA - 14, y: YR - 1.5, width: 28, height: 3, fill: o.n > 600 ? "#b9a7d8" : "#d9e4e8", stroke: "#222", "stroke-width": 0.5 }, p);
    if (incidence) L.svg("line", { x1: XA, y1: YR + 30, x2: XA, y2: YR - 60, stroke: "#9fd6ff", "stroke-width": 0.8, "stroke-dasharray": "4 3" }, p);
    L.texte(g, XA + 26, YR + 4, o.nom, { "font-size": 7, "font-weight": 700, fill: "#f4f1e6", "text-anchor": "start" });
    L.svg("rect", { x: XA - 0.35 * K, y: ys(s) - 6, width: 0.7 * K, height: 6, fill: "#f4f4ee", stroke: "#888" }, g);
    for (const dx of [-0.3, 0.3]) L.svg("rect", { x: XA + dx * K - 6, y: ys(s) - 2, width: 12, height: 9, fill: "#555b61" }, g);
    L.texte(g, XA + 0.35 * K + 8, ys(s) + 1, `écran (D = ${s.D.toFixed(2).replace(".", ",")} m)`, { "font-size": 7, "font-weight": 700, fill: "#f4f1e6", "text-anchor": "start" });
  }

  function fait(s) {
    // Ce que l'on peut lire et mesurer.
    const o = L.RESEAUX[s.objet], l = s.source === "blanche" ? null : L.raies_source(s.source)[0];
    const ordres = l && o.type === "reseau" ? L.ordres_reseau(o, l, s.i).map((r) => { const x = Math.abs(r.delta) < Math.PI / 2 ? s.D * 1000 * Math.tan(r.delta) : null; return { k: r.k, x: x === null ? null : Math.round(x * 10) / 10, ecran: x !== null && Math.abs(x) <= 350 }; }) : [];
    return { source: s.source, lambda: l, objet: o.nom, type: o.type, n: o.n || null, a: o.n ? Math.round(1e6 / o.n) / 1000 : o.b, i: s.i, D: s.D, c1: s.c1, c2: s.c2, ecart: Math.abs(s.c2 - s.c1), ordres, maximums: ordres.length };
  }

  L.banc_reseau = function (g, { fait: cle = "reseau", incidence = false, objets = [0, 1, 2, 3, 4, 5, 6], D = 1 }) {
    // Écran vu de face, table, rayons, matériel ; boutons Source et Diapositive, plateau tournant, écran déplaçable.
    const s = { source: "rouge", objet: objets[0], D, i: 0, c1: -160, c2: 160 }, toile = document.createElement("canvas");
    toile.width = 700; toile.height = 60;
    const noter = () => L.missions.noter(cle, fait(s)), image = L.ecran_reseau(g, s, noter);
    table(g);
    const clip = L.svg("clipPath", { id: "table_reseau" }, g); L.svg("rect", { x: T.x, y: T.y, width: T.l, height: T.h }, clip);
    const gr = L.svg("g", { "clip-path": "url(#table_reseau)", "pointer-events": "none" }, g), gm = L.svg("g", { "pointer-events": "none" }, g);
    const dessiner = () => { gr.replaceChildren(); gm.replaceChildren(); rayons(gr, s); materiel(gm, s, incidence); };
    const changer = () => { dessiner(); L.peindre_reseau(s, toile, image); noter(); };
    const ge = L.svg("g", { class: "ecran-reseau", role: "button", "aria-label": "Écran" }, g), poignee = () => { ge.replaceChildren(); L.svg("rect", { x: XA - 0.35 * K, y: ys(s) - 16, width: 0.7 * K, height: 30, fill: "#000", opacity: 0 }, ge); };
    L.glissable(ge, { soulever: false, debut: () => ({ x: 0, y: ys(s) }), deplacer: (p) => { s.D = Math.max(0.25, Math.min(1.3, Math.round(((YR - p.y) / K) * 20) / 20)); poignee(); dessiner(); }, lacher: changer });
    L.bouton_texte(g, 330, 560, "Source", () => { s.source = SOURCES[(SOURCES.indexOf(s.source) + 1) % 3]; changer(); });
    L.bouton_texte(g, 330, 600, "Diapositive", () => { s.objet = objets[(objets.indexOf(s.objet) + 1) % objets.length]; changer(); });
    if (incidence) L.boitier(g, 284, 400, 92, 10, 126, { dessus: "#cfd5d9", face: "#46525a" });
    if (incidence) L.bouton_reglage(g, { x: 330, y: 468, min: 0, max: 40, pas: 1, valeur: 0, unite: "°", titre: "rotation du réseau i", decimales: 0, sur_changement: (v) => { s.i = v; changer(); } });
    poignee(); changer();
    return s;
  };
})(window.Labo);
