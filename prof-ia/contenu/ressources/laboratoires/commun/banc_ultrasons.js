/*
Rôle : banc de diffraction des ultrasons, vu un peu d'en haut : émetteur à 40 kHz (λ = 8,5 mm dans l'air), deux plaques
       métalliques formant une fente de largeur a (10, 20 ou 40 mm), demi-rapporteur gradué tous les 10° centré sur la
       fente, récepteur au bout d'un bras de 26 cm que l'on fait tourner (au degré, de −60° à 60°), amplificateur qui
       affiche l'amplitude reçue U et l'angle θ. U(θ) = U0·|sin(π·a·sinθ/λ) / (π·a·sinθ/λ)| : plus la fente est étroite
       (a proche de λ), plus le faisceau s'élargit derrière elle.
Reçoit : le groupe SVG et { x, y (centre de la fente sur la paillasse), fait }.
Produit : Labo.banc_ultrasons(g, reglage) -> s { a, theta, marche } ; fait « <fait> » = { marche, a (mm), theta (°), U (V) }.
Utilisé par : les simulations de diffraction.
*/
(function (L) {
  const LAMBDA = 8.5, R = 260, KY = 0.3, LARGEURS = [10, 20, 40];
  const pt = (c, r, deg) => ({ x: c.x + r * Math.cos((deg * Math.PI) / 180), y: c.y - r * Math.sin((deg * Math.PI) / 180) * KY });

  function amplitude(s) {
    // Amplitude reçue (V), avec un léger bruit de mesure.
    if (!s.marche) return 0;
    const u = (Math.PI * s.a * Math.sin((s.theta * Math.PI) / 180)) / LAMBDA, f = Math.abs(u) < 1e-6 ? 1 : Math.abs(Math.sin(u) / u);
    return Math.max(0, 3 * Math.sqrt(s.a / 40) * f + (Math.random() - 0.5) * 0.01);
  }

  function rapporteur(g, c) {
    // Demi-rapporteur posé sur la paillasse, gradué tous les 10° de −60° à 60°.
    const a1 = pt(c, R + 30, -70), a2 = pt(c, R + 30, 70);
    L.svg("path", { d: `M${c.x} ${c.y} L${a1.x} ${a1.y} A${R + 30} ${(R + 30) * KY} 0 0 0 ${a2.x} ${a2.y} Z`, fill: "#f3efe0", stroke: "#b8ab7a", opacity: 0.9 }, g);
    for (let d = -60; d <= 60; d += 5) { const p = pt(c, R + 14, d), q = pt(c, R + (d % 10 ? 22 : 28), d); L.svg("line", { x1: p.x, y1: p.y, x2: q.x, y2: q.y, stroke: "#3b3220", "stroke-width": 0.7 }, g); if (d % 10 === 0) { const t = pt(c, R + 2, d); L.texte(g, t.x, t.y, `${d}°`, { "font-size": 6.5, fill: "#3b3220" }); } }
    const e = pt(c, -190, 0);
    L.svg("line", { x1: e.x, y1: e.y, x2: pt(c, R + 30, 0).x, y2: c.y, stroke: "#b8ab7a", "stroke-dasharray": "4 3" }, g);
  }

  function capteur(g, p, texte, vers) {
    // Émetteur ou récepteur à ultrasons (pastille argentée) sur un petit pied, tourné dans la direction « vers ».
    L.ombre_sol(g, p.x + 2, p.y + 2, 12, 4, 0.4);
    L.tige(g, `M${p.x} ${p.y} V${p.y - 34}`, 2.5);
    L.svg("rect", { x: p.x - 12, y: p.y - 50, width: 24, height: 18, rx: 4, fill: "#2f3438", stroke: "#111", transform: `rotate(${vers} ${p.x} ${p.y - 41})` }, g);
    L.svg("circle", { cx: p.x, cy: p.y - 41, r: 5, fill: "url(#metal)" }, g);
    L.texte(g, p.x, p.y + 12, texte, { "font-size": 7, "font-weight": 700, fill: "#f4f1e6" });
  }

  function plaques(g, c, a) {
    // Deux plaques métalliques (12 cm de large, 15 cm de haut) de part et d'autre de la fente, vues en perspective.
    g.replaceChildren();
    const p = (d, h) => `${c.x + d * 0.25} ${c.y - d * KY - h}`;
    for (const s of [1, -1]) { const d1 = s * (a / 2), d2 = s * (a / 2 + 120); L.svg("path", { d: `M${p(d1, 0)} L${p(d2, 0)} L${p(d2, 60)} L${p(d1, 60)} Z`, fill: s > 0 ? "#8e999f" : "#b3bdc3", stroke: "#4a555c", opacity: 0.95 }, g); }
  }

  function afficheur(g, x, y, s, changer) {
    // Émetteur (marche) et amplificateur du récepteur : U et θ ; touches de la largeur de fente.
    L.boitier(g, x - 80, y - 46, 160, 14, 96, { dessus: "#cfd5d9", face: "#46525a" });
    L.texte(g, x, y - 39, "ÉMETTEUR 40 kHz — RÉCEPTEUR", { "font-size": 6.5, "font-weight": 700, fill: "#23315a" });
    L.svg("rect", { x: x - 66, y: y - 26, width: 132, height: 36, rx: 3, fill: "#1d2a22" }, g);
    const ecran = L.svg("g", {}, g);
    L.bouton_rond(g, x - 50, y + 30, "I/O", () => { s.marche = !s.marche; changer(); }, 10);
    L.bouton_texte(g, x + 30, y + 30, "Largeur a", () => { s.a = LARGEURS[(LARGEURS.indexOf(s.a) + 1) % LARGEURS.length]; changer(); });
    return (U) => { ecran.replaceChildren(); L.texte(ecran, x, y - 15, `U = ${U.toFixed(2).replace(".", ",")} V`, { "font-size": 11, "font-weight": 700, fill: "#7dff9a", "font-family": "monospace" }); L.texte(ecran, x, y + 2, `θ = ${s.theta}°   a = ${s.a} mm`, { "font-size": 8, "font-weight": 700, fill: "#7dff9a", "font-family": "monospace" }); };
  }

  L.banc_ultrasons = function (g, { x, y, fait = "ultrasons" }) {
    // Rapporteur, émetteur, plaques, bras et récepteur déplaçable, afficheur.
    const s = { a: 40, theta: 0, marche: false }, c = { x, y };
    rapporteur(g, c); capteur(g, pt(c, -190, 0), "émetteur", 0);
    const gp = L.svg("g", { "pointer-events": "none" }, g), bras = L.svg("g", { class: "recepteur", role: "button", "aria-label": "Récepteur" }, g);
    const afficher = afficheur(g, 880, 445, s, () => changer());
    const changer = () => {
      plaques(gp, c, s.a); bras.replaceChildren();
      const p = pt(c, R, s.theta); L.svg("line", { x1: c.x, y1: c.y, x2: p.x, y2: p.y, stroke: "#5d646a", "stroke-width": 4, "stroke-linecap": "round" }, bras);
      capteur(bras, p, "récepteur", -s.theta); L.svg("circle", { cx: p.x, cy: p.y - 30, r: 30, fill: "#000", opacity: 0 }, bras);
      const U = amplitude(s); afficher(U); L.missions.noter(fait, { marche: s.marche, a: s.a, theta: s.theta, U: Math.round(U * 100) / 100 });
    };
    L.glissable(bras, { soulever: false, debut: () => pt(c, R, s.theta), deplacer: (q) => { const t = Math.round((Math.atan2(-(q.y - c.y) / KY, q.x - c.x) * 180) / Math.PI); s.theta = Math.max(-60, Math.min(60, t)); changer(); } });
    changer();
    return s;
  };
})(window.Labo);
