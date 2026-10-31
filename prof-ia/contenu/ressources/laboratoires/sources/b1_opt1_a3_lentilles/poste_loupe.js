/*
Rôle : paillasse « reconnaître une lentille » : feuille imprimée posée sur la paillasse et deux lentilles rondes montées
       dans une bague noire à manche (A : bords minces ; B : bords épais), chacune vue aussi de profil sur son étiquette.
       Placée au-dessus du texte, A le montre agrandi (elle est convergente, utilisée en loupe), B le montre plus petit.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_loupe(g) -> { pense_bete } ; fait « loupe » = { A, B } (vrai quand la lentille a été placée sur le texte).
Utilisé par : simulation.js.
*/
(function (L) {
  const LIGNES = ["La lumière se propage en ligne droite", "dans un milieu transparent et homogène.", "Une lentille convergente a des bords", "minces ; une lentille divergente a des", "bords épais. Placée près d'un texte,", "la lentille convergente l'agrandit :", "c'est une loupe."];
  const FEUILLE = { x: 290, y: 230, l: 440, h: 230 }, R = 46;

  function texte(g) {
    // Feuille blanche et lignes de texte imprimé.
    L.ombre_sol(g, FEUILLE.x + FEUILLE.l / 2 + 6, FEUILLE.y + FEUILLE.h + 4, FEUILLE.l / 2, 8, 0.4);
    L.svg("rect", { ...{ x: FEUILLE.x, y: FEUILLE.y, width: FEUILLE.l, height: FEUILLE.h }, fill: "#fdfdf8", stroke: "#ccc" }, g);
    LIGNES.forEach((t, k) => L.texte(g, FEUILLE.x + 24, FEUILLE.y + 34 + k * 28, t, { "font-size": 15, fill: "#222", "text-anchor": "start", "font-family": "Georgia, serif" }));
  }

  function profil(g, x, y, minces) {
    // Petit dessin de la lentille vue de profil (bords minces ou épais), sur l'étiquette.
    const d = minces ? `M${x} ${y - 20} Q${x + 12} ${y} ${x} ${y + 20} Q${x - 12} ${y} ${x} ${y - 20} Z` : `M${x - 7} ${y - 20} H${x + 7} Q${x + 1} ${y} ${x + 7} ${y + 20} H${x - 7} Q${x - 1} ${y} ${x - 7} ${y - 20} Z`;
    L.svg("path", { d, fill: "#cfe8ef", stroke: "#6f9aa6" }, g);
  }

  L.poste_loupe = function (g) {
    // Décor, feuille, copies agrandie et réduite du texte vues à travers chaque lentille, lentilles saisissables ; faits.
    L.decor.paillasse(g, 1);
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230), e = { A: false, B: false };
    const t = L.svg("g", { id: "texte_loupe" }, g);
    texte(t);
    const loupes = [["A", 820, 290, 1.7, true], ["B", 820, 430, 0.62, false]].map(([nom, x, y, k, minces]) => ({ nom, x, y, k, minces }));
    for (const l of loupes) {
      const clip = L.svg("clipPath", { id: `vue_${l.nom}` }, g), cercle = L.svg("circle", { r: R - 4 }, clip);
      const vue = L.svg("g", { "clip-path": `url(#vue_${l.nom})` }, g), fond = L.svg("rect", { width: 2 * R, height: 2 * R, fill: "#fdfdf8" }, vue), copie = L.svg("use", { href: "#texte_loupe" }, vue);
      const corps = L.svg("g", { class: "lentille", role: "button", "aria-label": `Lentille ${l.nom}` }, g);
      l.maj = () => {
        // Bague, manche, reflet ; à l'intérieur, le texte vu à travers la lentille (agrandi ou réduit autour du centre).
        cercle.setAttribute("cx", l.x); cercle.setAttribute("cy", l.y); fond.setAttribute("x", l.x - R); fond.setAttribute("y", l.y - R);
        copie.setAttribute("transform", `translate(${l.x} ${l.y}) scale(${l.k}) translate(${-l.x} ${-l.y})`);
        corps.replaceChildren();
        L.svg("line", { x1: l.x + R * 0.7, y1: l.y + R * 0.7, x2: l.x + R * 1.5, y2: l.y + R * 1.5, stroke: "#1e2226", "stroke-width": 12, "stroke-linecap": "round" }, corps);
        L.svg("circle", { cx: l.x, cy: l.y, r: R, fill: "#cfe8ef", "fill-opacity": 0.12, stroke: "#1e2226", "stroke-width": 8 }, corps);
        L.svg("path", { d: `M${l.x - R * 0.6} ${l.y - R * 0.3} A${R * 0.7} ${R * 0.7} 0 0 1 ${l.x - R * 0.1} ${l.y - R * 0.65}`, fill: "none", stroke: "#fff", "stroke-width": 3, opacity: 0.6 }, corps);
        L.texte(corps, l.x, l.y + R + 14, `lentille ${l.nom}`, { "font-size": 8, "font-weight": 700, fill: "#333" });
        L.svg("line", { x1: l.x + R * 1.3, y1: l.y + R * 1.3, x2: l.x + R + 26, y2: l.y + 24, stroke: "#999", "stroke-width": 0.8 }, corps);
        L.svg("rect", { x: l.x + R + 10, y: l.y - 26, width: 32, height: 64, rx: 4, fill: "#fdfdf8", stroke: "#999" }, corps);
        profil(corps, l.x + R + 26, l.y, l.minces); L.texte(corps, l.x + R + 26, l.y + 30, "profil", { "font-size": 6.5, fill: "#333" });
        const sur = l.x > FEUILLE.x + 30 && l.x < FEUILLE.x + FEUILLE.l - 30 && l.y > FEUILLE.y + 30 && l.y < FEUILLE.y + FEUILLE.h - 30;
        vue.setAttribute("opacity", sur ? 1 : 0); if (sur) e[l.nom] = true;
      };
      L.glissable(corps, { soulever: false, debut: () => ({ x: l.x, y: l.y }), deplacer: (p) => { l.x = Math.max(80, Math.min(960, p.x)); l.y = Math.max(200, Math.min(540, p.y)); l.maj(); } });
      l.maj();
    }
    setInterval(() => L.missions.noter("loupe", { ...e }), 250);
    return { pense_bete };
  };
})(window.Labo);
