/*
Rôle : banc de l'onde sonore sinusoïdale : haut-parleur sur pied à l'origine d'une règle de 1 m, alimenté par un GBF
       (fréquence de 500 à 5 000 Hz, touche marche), deux microphones M1 et M2 que l'on fait glisser le long de la règle
       (au centimètre), reliés aux deux voies de l'oscilloscope (déclenché par la voie 1). Chaque micro reçoit une tension
       sinusoïdale de fréquence f ; celle de M2 est décalée du retard (x2 − x1) / v : les deux courbes sont en phase
       quand M1M2 est un multiple de la longueur d'onde λ = v / f. v = 331,4 + 0,6·θ (m/s).
Reçoit : le groupe SVG, l'oscilloscope (oscilloscope_memoire.js) et { x0 (px du zéro de la règle), k (px par m), sol, theta,
         positions [x1, x2] (m), fait }.
Produit : Labo.banc_haut_parleur(g, oscillo, reglage) -> s { f, x1, x2, v, marche } ; fait « <fait> » = { f, marche, x1, x2, d (m),
          lambda (cm), phase (décalage en fraction de période, de 0 à 1), en_phase }.
Utilisé par : les simulations d'ondes progressives périodiques.
*/
(function (L) {
  function haut_parleur(g, x, sol) {
    // Haut-parleur de 10 cm sur son pied, membrane tournée vers les micros.
    L.ombre_sol(g, x - 10, sol + 1, 22, 4, 0.4);
    L.svg("ellipse", { cx: x - 10, cy: sol - 2, rx: 16, ry: 4, fill: "#2b2f33" }, g);
    L.tige(g, `M${x - 10} ${sol - 3} V${sol - 60}`, 3);
    L.svg("rect", { x: x - 34, y: sol - 106, width: 30, height: 56, rx: 4, fill: "#2f3438", stroke: "#111" }, g);
    L.svg("ellipse", { cx: x - 4, cy: sol - 78, rx: 6, ry: 24, fill: "#50565b", stroke: "#111" }, g);
    L.svg("ellipse", { cx: x - 3, cy: sol - 78, rx: 2.5, ry: 8, fill: "#22272b" }, g);
  }

  function gbf(g, x, y, s, changer) {
    // GBF posé sur la paillasse : fréquence et marche.
    L.boitier(g, x - 66, y - 54, 132, 14, 112, { dessus: "#cfd5d9", face: "#5d6970" });
    L.texte(g, x, y - 47, "GBF — sinusoïdal", { "font-size": 7, "font-weight": 700, fill: "#23315a" });
    L.bouton_reglage(g, { x: x - 22, y: y + 18, min: 500, max: 5000, pas: 10, valeur: s.f, unite: "Hz", titre: "f", decimales: 0, sur_changement: (v) => { s.f = v; changer(); } });
    L.bouton_rond(g, x + 38, y + 14, "I/O", () => { s.marche = !s.marche; changer(); }, 10);
  }

  L.banc_haut_parleur = function (g, oscillo, { x0, k, sol, theta = 20, positions = [0.1, 0.3], fait = "son_periodique" }) {
    // Règle, haut-parleur, GBF, micros déplaçables et câbles ; tout changement renouvelle l'affichage de l'oscilloscope.
    const s = { f: 2000, marche: false, x1: positions[0], x2: positions[1], v: 331.4 + 0.6 * theta };
    L.regle_1m(g, x0, k, sol); haut_parleur(g, x0, sol);
    const cables = L.svg("g", { "pointer-events": "none" }, g), gm = [1, 2].map((i) => L.svg("g", { class: `micro-${i}`, role: "button", "aria-label": `Micro M${i}` }, g));
    const r3 = (v) => Math.round(v * 1000) / 1000;
    const changer = () => {
      const lambda = s.v / s.f, d = s.x2 - s.x1, ph = (((d / lambda) % 1) + 1) % 1, w = 2 * Math.PI * s.f;
      const a = (r) => (s.marche ? 0.12 / Math.max(r, 0.05) : 0);
      oscillo.enregistrer([(t) => a(s.x1) * Math.sin(w * t), (t) => a(s.x2) * Math.sin(w * t - 2 * Math.PI * (d / lambda))]);
      L.missions.noter(fait, { f: s.f, marche: s.marche, x1: s.x1, x2: s.x2, d: Math.round(Math.abs(d) * 100) / 100, lambda: Math.round(lambda * 1000) / 10, phase: r3(ph), en_phase: s.marche && (ph < 0.04 || ph > 0.96) });
    };
    const dessiner = () => {
      ["x1", "x2"].forEach((cle, i) => L.micro_pied(gm[i], x0 + s[cle] * k, sol, `M${i + 1}`)); cables.replaceChildren();
      ["x1", "x2"].forEach((cle, i) => { const x = x0 + s[cle] * k, p = oscillo.prises[i]; L.svg("path", { d: `M${x} ${sol - 2} C${x} ${sol + 30} ${p.x} ${p.y + 90} ${p.x} ${p.y}`, fill: "none", stroke: i ? "#c79a00" : "#2e7d32", "stroke-width": 2 }, cables); });
    };
    ["x1", "x2"].forEach((cle, i) => L.glissable(gm[i], { soulever: false, debut: () => ({ x: x0 + s[cle] * k, y: sol }), deplacer: (p) => { s[cle] = Math.max(0.05, Math.min(1, Math.round(((p.x - x0) / k) * 100) / 100)); dessiner(); changer(); } }));
    gbf(g, x0 - 140, sol - 150, s, changer);
    dessiner(); changer();
    return s;
  };
})(window.Labo);
