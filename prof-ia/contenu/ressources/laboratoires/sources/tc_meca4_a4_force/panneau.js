/*
Rôle : panneau de mesure fixé au mur derrière la bille : soit une règle verticale graduée (0 à 120 cm, au millimètre),
       soit un tableau quadrillé (carreaux de 5 cm) ; et les fils de lecture rouges que l'élève fait glisser pour lire
       une position avec précision (zoomer pour lire au millimètre).
Reçoit : le groupe SVG ; { type: "regle" | "quadrillage", origine (px du zéro), echelle (px par m), largeur_m, hauteur_m }.
Produit : Labo.panneau(groupe, reglages) ; Labo.fil_lecture(groupe, sens, de, a, position) (« horizontal » ou « vertical »).
Utilisé par : chronophoto.js.
*/
(function (L) {
  function regle(g, o, e, h_m) {
    // Règle de bois clair verticale : traits au millimètre, au demi-centimètre, au centimètre ; nombres tous les 10 cm.
    L.svg("rect", { x: o.x - 4, y: o.y - 14, width: 64, height: h_m * e + 28, fill: "#f3e7c9", stroke: "#a88b55", filter: "url(#ombre)" }, g);
    for (let mm = 0; mm <= h_m * 1000; mm++) {
      const y = o.y + (mm / 1000) * e, l = mm % 10 === 0 ? 16 : mm % 5 === 0 ? 10 : 5;
      L.svg("line", { x1: o.x, y1: y, x2: o.x + l, y2: y, stroke: "#2b2416", "stroke-width": mm % 10 === 0 ? 0.6 : 0.25 }, g);
      if (mm % 100 === 0) L.texte(g, o.x + 34, y, String(mm / 10), { "font-size": 9, "font-weight": 700, fill: "#2b2416" });
    }
    L.texte(g, o.x + 34, o.y - 7, "cm", { "font-size": 7, fill: "#2b2416" });
  }

  function quadrillage(g, o, e, l_m, h_m) {
    // Tableau blanc quadrillé : un trait tous les 5 cm, plus marqué tous les 10 cm, numéroté en cm.
    L.svg("rect", { x: o.x - 18, y: o.y - 18, width: l_m * e + 36, height: h_m * e + 36, fill: "#fbfbf8", stroke: "#9aa1a7", filter: "url(#ombre)" }, g);
    for (let cm = 0; cm <= l_m * 100; cm += 5) {
      const x = o.x + (cm / 100) * e;
      L.svg("line", { x1: x, y1: o.y, x2: x, y2: o.y + h_m * e, stroke: "#5b8fbf", "stroke-width": cm % 10 ? 0.4 : 0.8 }, g);
      if (cm % 10 === 0) L.texte(g, x, o.y - 8, String(cm), { "font-size": 8, fill: "#1f4d78" });
    }
    for (let cm = 0; cm <= h_m * 100; cm += 5) {
      const y = o.y + (cm / 100) * e;
      L.svg("line", { x1: o.x, y1: y, x2: o.x + l_m * e, y2: y, stroke: "#5b8fbf", "stroke-width": cm % 10 ? 0.4 : 0.8 }, g);
      if (cm % 10 === 0) L.texte(g, o.x - 10, y, String(cm), { "font-size": 8, fill: "#1f4d78" });
    }
  }

  L.panneau = function (g, { type, origine, echelle, largeur_m = 0, hauteur_m }) {
    // Dessine la règle ou le quadrillage.
    if (type === "regle") regle(g, origine, echelle, hauteur_m);
    else quadrillage(g, origine, echelle, largeur_m, hauteur_m);
  };

  L.fil_lecture = function (g, sens, de, a, position) {
    // Fil rouge tendu, déplaçable perpendiculairement à lui-même, avec une poignée ronde à un bout.
    const f = L.svg("g", { class: `fil-lecture-${sens}`, role: "slider", "aria-label": `Fil de lecture ${sens}` }, g);
    const h = sens === "horizontal";
    L.svg("line", h ? { x1: de, y1: 0, x2: a, y2: 0, stroke: "#000", "stroke-width": 12, opacity: 0.001 } : { x1: 0, y1: de, x2: 0, y2: a, stroke: "#000", "stroke-width": 12, opacity: 0.001 }, f);
    L.svg("line", h ? { x1: de, y1: 0, x2: a, y2: 0, stroke: "#d32f2f", "stroke-width": 0.7 } : { x1: 0, y1: de, x2: 0, y2: a, stroke: "#d32f2f", "stroke-width": 0.7 }, f);
    L.svg("circle", h ? { cx: a, cy: 0, r: 6, fill: "#d32f2f", opacity: 0.8 } : { cx: 0, cy: a, r: 6, fill: "#d32f2f", opacity: 0.8 }, f);
    let p = position;
    const placer = () => f.setAttribute("transform", h ? `translate(0 ${p})` : `translate(${p} 0)`);
    L.glissable(f, { soulever: false, debut: () => (h ? { x: 0, y: p } : { x: p, y: 0 }), deplacer: (q) => { p = h ? q.y : q.x; placer(); } });
    placer();
  };
})(window.Labo);
