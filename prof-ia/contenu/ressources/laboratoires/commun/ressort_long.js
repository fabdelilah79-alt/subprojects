/*
Rôle : long ressort à spires non jointives (2 m tendu, spires de 7 cm de diamètre) posé à l'horizontale entre la main de
       l'élève (une poignée en bois, à gauche) et une tige fixée à la paillasse (à droite), vu de face. On déplace la
       poignée perpendiculairement au ressort (onde transversale) ou le long de son axe (onde longitudinale : les spires
       se serrent puis s'écartent) ; relâchée, elle revient au repos. Une spire peinte en rouge, au milieu, montre que la
       matière ne se déplace pas avec l'onde : elle bouge puis revient à sa place.
Reçoit : le groupe SVG et { x0 (px de l'extrémité gauche), k (px par m), y_axe, sol, v (m/s), fait }.
Produit : Labo.ressort_long(g, reglage) -> { transversal, longitudinal (milieux, milieu_1d.js), rouge (m) } ; fait « <fait> » =
          { trans (m, plus grand déplacement transversal de la main), longi (idem le long de l'axe), rouge { dx, dy } (plus
          grands écarts de la spire rouge, cm), rouge_repos (vrai si elle est revenue à sa place) }.
Utilisé par : les simulations d'ondes mécaniques.
*/
(function (L) {
  const LONGUEUR = 2, SPIRES = 90, R = 0.035, MAX = 0.12, ROUGE = 1.0;

  function spires(c, mt, ml) {
    // Une ellipse par spire (le ressort est vu presque de profil) ; la spire rouge à part.
    let d = "", rouge = "";
    for (let i = 0; i <= SPIRES; i++) {
      const s = (i / SPIRES) * LONGUEUR, x = c.x0 + (s + ml.elongation(s)) * c.k, y = c.y_axe - mt.elongation(s) * c.k, ry = R * c.k, rx = ry * 0.28;
      const arc = `M${x.toFixed(1)} ${(y - ry).toFixed(1)} a${rx} ${ry} 0 1 0 0 ${2 * ry} a${rx} ${ry} 0 1 0 0 ${-2 * ry}`;
      if (Math.abs(s - ROUGE) < 1e-6) rouge = arc; else d += arc;
    }
    c.p_spires.setAttribute("d", d); c.p_rouge.setAttribute("d", rouge);
  }

  function supports(g, c) {
    // Tige fixe et sa pince à droite ; ombre du ressort sur la paillasse.
    const xd = c.x0 + LONGUEUR * c.k;
    L.ombre_sol(g, c.x0 + (LONGUEUR * c.k) / 2, c.sol - 4, (LONGUEUR * c.k) / 2, 5, 0.25);
    L.svg("rect", { x: xd - 16, y: c.sol - 10, width: 32, height: 10, rx: 2, fill: "#3a4046" }, g);
    L.tige(g, `M${xd} ${c.sol - 10} V${c.y_axe - 40}`, 5);
    L.svg("rect", { x: xd - 8, y: c.y_axe - 6, width: 16, height: 12, rx: 2, fill: "#5d646a", stroke: "#222" }, g);
  }

  function poignee(g, c, main) {
    // Poignée en bois que l'on saisit ; son déplacement (limité à 12 cm) est la source des deux ondes.
    const p = L.svg("g", { class: "poignee-ressort", role: "button", "aria-label": "Poignée du ressort" }, g);
    const dessiner = () => {
      p.replaceChildren();
      const x = c.x0 + main.lx * c.k, y = c.y_axe - main.ty * c.k;
      L.svg("rect", { x: x - 44, y: y - 7, width: 42, height: 14, rx: 6, fill: "url(#bois)", stroke: "#5b3b1c" }, p);
      L.svg("rect", { x: x - 4, y: y - 3, width: 6, height: 6, fill: "#777" }, p);
      L.svg("rect", { x: x - 56, y: y - 26, width: 64, height: 52, fill: "#000", opacity: 0 }, p);
    };
    L.glissable(p, {
      soulever: false, debut: () => { main.tenue = true; return { x: c.x0 + main.lx * c.k, y: c.y_axe - main.ty * c.k }; },
      deplacer: (q) => { main.cx = Math.max(-MAX, Math.min(MAX, (q.x - c.x0) / c.k)); main.cy = Math.max(-MAX, Math.min(MAX, (c.y_axe - q.y) / c.k)); },
      lacher: () => { main.tenue = false; },
    });
    return dessiner;
  }

  L.ressort_long = function (g, { x0, k, y_axe, sol, v = 2, fait = "ressort" }) {
    // Deux milieux (déplacements transversaux et longitudinaux) animés en temps réel.
    const c = { x0, k, y_axe, sol }, opt = { longueur: LONGUEUR, n: 201, v, amortissement: 0.6, fin: "fixe" };
    const mt = L.milieu_1d(opt), ml = L.milieu_1d(opt), main = { lx: 0, ty: 0, cx: 0, cy: 0, tenue: false };
    supports(g, c);
    c.p_spires = L.svg("path", { d: "", fill: "none", stroke: "#8f9aa2", "stroke-width": 1.4 }, g);
    c.p_rouge = L.svg("path", { d: "", fill: "none", stroke: "#d32f2f", "stroke-width": 2.4 }, g);
    const dessiner_main = poignee(g, c, main), suivi = { trans: 0, longi: 0, dx: 0, dy: 0 };
    let avant = null, note = "";
    const image = (t) => {
      const dt = avant === null ? 0 : Math.min(0.05, (t - avant) / 1000); avant = t;
      if (!main.tenue) { main.cx *= Math.exp(-dt / 0.04); main.cy *= Math.exp(-dt / 0.04); }
      const de = { x: main.lx, y: main.ty }, t0 = mt.t;
      const vers = (a, b) => (tt) => a + (b - a) * Math.min(1, (tt - t0) / Math.max(dt, 1e-6));
      mt.avancer(dt, vers(de.y, main.cy)); ml.avancer(dt, vers(de.x, main.cx));
      main.lx = main.cx; main.ty = main.cy;
      suivi.trans = Math.max(suivi.trans, Math.abs(main.ty)); suivi.longi = Math.max(suivi.longi, Math.abs(main.lx));
      suivi.dx = Math.max(suivi.dx, Math.abs(ml.elongation(ROUGE))); suivi.dy = Math.max(suivi.dy, Math.abs(mt.elongation(ROUGE)));
      spires(c, mt, ml); dessiner_main();
      const f = { trans: Math.round(suivi.trans * 100) / 100, longi: Math.round(suivi.longi * 100) / 100, rouge: { dx: Math.round(suivi.dx * 100), dy: Math.round(suivi.dy * 100) }, rouge_repos: Math.abs(ml.elongation(ROUGE)) < 0.003 && Math.abs(mt.elongation(ROUGE)) < 0.003 };
      if (JSON.stringify(f) !== note) { note = JSON.stringify(f); L.missions.noter(fait, f); }
      requestAnimationFrame(image);
    };
    requestAnimationFrame(image);
    return { transversal: mt, longitudinal: ml, rouge: ROUGE, longueur: LONGUEUR };
  };
})(window.Labo);
