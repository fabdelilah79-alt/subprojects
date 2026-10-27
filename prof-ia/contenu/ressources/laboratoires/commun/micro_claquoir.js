/*
Rôle : banc de mesure du retard d'un son : claquoir en bois (deux planchettes articulées) à l'origine d'une règle de 1 m
       posée sur la paillasse, deux microphones sur pied (M1, M2) que l'on fait glisser le long de la règle (au
       centimètre), reliés aux voies 1 et 2 de l'oscilloscope à mémoire. Toucher le claquoir le fait claquer : chaque
       micro reçoit une salve sonore (environ 4 kHz, amortie en 1 ms) avec le retard r / v, d'autant plus faible que le
       micro est loin ; l'oscilloscope l'enregistre. v = 331,4 + 0,6·θ (m/s), θ en °C.
Reçoit : le groupe SVG, l'oscilloscope (oscilloscope_memoire.js) et { x0 (px du zéro de la règle), k (px par m), sol,
         theta (°C), positions [x1, x2] (m), fait }.
Produit : Labo.banc_son(g, oscillo, reglage) -> s { x1, x2, v } ; fait « <fait> » = { x1, x2, d (m), tau (ms, retard réel
          de M2 sur M1), claps }.
Utilisé par : les simulations d'ondes (célérité du son).
*/
(function (L) {
  const salve = (t) => (t <= 0 ? 0 : Math.sin(2 * Math.PI * 4000 * t) * Math.exp(-t / 0.0006) * (1 - Math.exp(-t / 0.00006)));

  function regle(g, x0, k, sol) {
    // Règle de 1 m graduée tous les 5 cm (chiffres tous les 10 cm).
    L.svg("rect", { x: x0 - 6, y: sol - 6, width: k + 12, height: 12, rx: 1, fill: "#efe3b8", stroke: "#a8935a" }, g);
    for (let i = 0; i <= 20; i++) {
      const x = x0 + i * 0.05 * k;
      L.svg("line", { x1: x, y1: sol - 6, x2: x, y2: sol - (i % 2 ? 2.5 : 0), stroke: "#3b3220", "stroke-width": 0.7 }, g);
      if (i % 2 === 0) L.texte(g, x, sol + 3.5, String(i * 5), { "font-size": 5, fill: "#3b3220" });
    }
  }

  function claquoir(g, x0, sol, ouvert) {
    // Deux planchettes de 20 cm articulées à gauche ; ouvertes, celle du dessus se relève.
    g.replaceChildren();
    L.ombre_sol(g, x0 - 50, sol + 1, 52, 4, 0.4);
    L.svg("rect", { x: x0 - 100, y: sol - 10, width: 100, height: 8, rx: 2, fill: "url(#bois)", stroke: "#5b3b1c" }, g);
    L.svg("rect", { x: x0 - 100, y: sol - 18, width: 100, height: 8, rx: 2, fill: "url(#bois)", stroke: "#5b3b1c", transform: `rotate(${ouvert ? -28 : 0} ${x0 - 100} ${sol - 12})` }, g);
    L.svg("circle", { cx: x0 - 100, cy: sol - 11, r: 3, fill: "#777" }, g);
    L.svg("rect", { x: x0 - 108, y: sol - 70, width: 116, height: 76, fill: "#000", opacity: 0 }, g);
  }

  function micro(g, x, sol, nom) {
    // Pied (socle, tige de 15 cm) et micro cylindrique tourné vers le claquoir.
    g.replaceChildren();
    L.ombre_sol(g, x + 2, sol + 1, 12, 3, 0.4);
    L.svg("ellipse", { cx: x, cy: sol - 2, rx: 11, ry: 3.5, fill: "#2b2f33" }, g);
    L.tige(g, `M${x} ${sol - 3} V${sol - 75}`, 2.5);
    L.svg("rect", { x: x - 12, y: sol - 81, width: 18, height: 10, rx: 5, fill: "#30363b", stroke: "#111" }, g);
    L.svg("rect", { x: x - 13, y: sol - 80, width: 4, height: 8, rx: 1.5, fill: "#8a949b" }, g);
    L.texte(g, x, sol - 90, nom, { "font-size": 8, "font-weight": 700, fill: "#23315a" });
    L.svg("rect", { x: x - 16, y: sol - 96, width: 32, height: 98, fill: "#000", opacity: 0 }, g);
  }

  L.banc_son = function (g, oscillo, { x0, k, sol, theta = 20, positions = [0.1, 0.5], fait = "son" }) {
    // Règle, claquoir, deux micros déplaçables et leurs câbles ; un toucher du claquoir déclenche l'enregistrement.
    const s = { x1: positions[0], x2: positions[1], v: 331.4 + 0.6 * theta, claps: 0 };
    regle(g, x0, k, sol);
    const cables = L.svg("g", { "pointer-events": "none" }, g), gc = L.svg("g", { class: "claquoir", role: "button", "aria-label": "Claquoir" }, g);
    const gm = [L.svg("g", { class: "micro-1", role: "button", "aria-label": "Micro M1" }, g), L.svg("g", { class: "micro-2", role: "button", "aria-label": "Micro M2" }, g)];
    const r3 = (v) => Math.round(v * 1000) / 1000, noter = () => L.missions.noter(fait, { x1: s.x1, x2: s.x2, d: Math.round(Math.abs(s.x2 - s.x1) * 100) / 100, tau: r3(((s.x2 - s.x1) / s.v) * 1000), claps: s.claps });
    const dessiner = () => {
      ["x1", "x2"].forEach((cle, i) => micro(gm[i], x0 + s[cle] * k, sol, `M${i + 1}`)); cables.replaceChildren();
      ["x1", "x2"].forEach((cle, i) => { const x = x0 + s[cle] * k, p = oscillo.prises[i]; L.svg("path", { d: `M${x} ${sol - 2} C${x} ${sol + 30} ${p.x} ${p.y + 90} ${p.x} ${p.y}`, fill: "none", stroke: i ? "#c79a00" : "#2e7d32", "stroke-width": 2 }, cables); });
    };
    ["x1", "x2"].forEach((cle, i) => L.glissable(gm[i], { soulever: false, debut: () => ({ x: x0 + s[cle] * k, y: sol }), deplacer: (p) => { s[cle] = Math.max(0.05, Math.min(1, Math.round(((p.x - x0) / k) * 100) / 100)); dessiner(); }, lacher: noter }));
    claquoir(gc, x0, sol, true);
    const signal = (r) => (t) => (0.25 / Math.max(r, 0.05)) * salve(t - r / s.v);
    L.glissable(gc, { soulever: false, debut: () => ({ x: 0, y: 0 }), toucher: () => {
      claquoir(gc, x0, sol, false); s.claps++; oscillo.enregistrer([signal(s.x1), signal(s.x2)]); noter();
      setTimeout(() => claquoir(gc, x0, sol, true), 350);
    } });
    dessiner(); noter();
    return s;
  };
})(window.Labo);
