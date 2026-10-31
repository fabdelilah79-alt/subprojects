/*
Rôle : oscilloscope numérique à mémoire à deux voies, en mode monocoup : déclenché par la voie 1 (dès que sa tension
       dépasse 50 mV), il enregistre les deux voies et garde les traces à l'écran (1 division avant le déclenchement,
       9 après). Écran 10 × 8 divisions ; voie 1 décalée de 2 divisions vers le haut, voie 2 de 2 divisions vers le bas
       (repères à gauche) ; sensibilités Sv1, Sv2 (V/div) et balayage b (ms/div) réglés par des touches −/+.
Reçoit : le groupe SVG et { x, y (coin du boîtier), Sv, Sv2, b, fait, titre (facultatif) }.
Produit : Labo.oscilloscope_memoire(g, reglage) -> o { prises [CH1, CH2] ({ x, y }), enregistrer([u1(t), u2(t)]) (t en s
          après l'événement), Sv, Sv2, b } ; fait « <fait> » = { Sv, Sv2, b, enregistre (nombre d'enregistrements) }.
Utilisé par : les simulations d'ondes (retard d'un son entre deux micros).
*/
(function (L) {
  const SV = [0.05, 0.1, 0.2, 0.5, 1, 2, 5], B = [0.1, 0.2, 0.5, 1, 2, 5], DIV = 20, N = 600, DECALAGE = [2, -2];
  const ecrire = (v, u) => `${String(v).replace(".", ",")} ${u}/div`;

  function ecran(g, x, y) {
    // Fond, divisions, graduations des axes centraux, repères des deux voies ; renvoie le calque des traces.
    L.svg("rect", { x: x - 6, y: y - 6, width: 10 * DIV + 12, height: 8 * DIV + 12, rx: 6, fill: "#111614" }, g);
    L.svg("rect", { x, y, width: 10 * DIV, height: 8 * DIV, fill: "#0b1f17" }, g);
    const t = { stroke: "#5fae86", "stroke-width": 0.6, opacity: 0.55 }, cy = y + 4 * DIV;
    for (let i = 0; i <= 10; i++) L.svg("line", { x1: x + i * DIV, y1: y, x2: x + i * DIV, y2: y + 8 * DIV, ...t }, g);
    for (let j = 0; j <= 8; j++) L.svg("line", { x1: x, y1: y + j * DIV, x2: x + 10 * DIV, y2: y + j * DIV, ...t }, g);
    for (let k = 0; k <= 50; k++) L.svg("line", { x1: x + k * 4, y1: cy - 2, x2: x + k * 4, y2: cy + 2, ...t }, g);
    DECALAGE.forEach((d, i) => { const yy = cy - d * DIV, c = i ? "#ffe27a" : "#7cff9a"; L.svg("path", { d: `M${x - 7} ${yy - 4} l6 4 l-6 4 Z`, fill: c }, g); L.texte(g, x - 12, yy, String(i + 1), { "font-size": 7, "font-weight": 700, fill: c }); });
    const id = `ecran-memoire-${Math.round(x)}-${Math.round(y)}`, clip = L.svg("clipPath", { id }, g);
    L.svg("rect", { x, y, width: 10 * DIV, height: 8 * DIV }, clip);
    return L.svg("g", { "clip-path": `url(#${id})` }, g);
  }

  function reglage(g, x, y, liste, lire, unite, changer) {
    // Afficheur d'un réglage et ses deux touches −/+.
    L.svg("rect", { x: x + 238, y, width: 102, height: 48, rx: 4, fill: "none", stroke: "#9aa5ad" }, g);
    L.svg("rect", { x: x + 246, y: y + 13, width: 86, height: 14, rx: 2, fill: "#0b1f17" }, g);
    const t = L.texte(g, x + 289, y + 20.5, ecrire(lire(), unite), { "font-size": 8.5, "font-family": "monospace", "font-weight": 700, fill: "#7cff9a" });
    const pas = (s) => { const v = liste[Math.max(0, Math.min(liste.length - 1, liste.indexOf(lire()) + s))]; changer(v); t.textContent = ecrire(v, unite); };
    L.bouton_rond(g, x + 268, y + 37, "−", () => pas(-1));
    L.bouton_rond(g, x + 310, y + 37, "+", () => pas(1));
  }

  function declenchement(u1) {
    // Premier instant (pas de 2 µs, jusqu'à 30 ms) où la voie 1 dépasse 50 mV.
    for (let t = 0; t < 0.03; t += 2e-6) if (Math.abs(u1(t)) > 0.05) return t;
    return 0;
  }

  L.oscilloscope_memoire = function (g, { x, y, Sv = 0.5, Sv2 = 0.5, b = 0.5, fait = "oscillo_memoire", titre = "OSCILLOSCOPE NUMÉRIQUE — MONOCOUP" }) {
    // Boîtier, écran, réglages, prises ; enregistrer() fige les traces, que les réglages redessinent.
    const o = { Sv, Sv2, b, n: 0, signaux: null, prises: [{ x: x + 266, y: y + 196 }, { x: x + 312, y: y + 196 }] };
    L.boitier(g, x, y, 350, 236, 34, { dessus: "#dfe3e6", face: "#8d979e" });
    L.texte(g, x + 18, y + 14, titre, { "text-anchor": "start", "font-size": 8, "font-weight": 700, fill: "#37474f", "letter-spacing": 0.8 });
    const calque = ecran(g, x + 18, y + 34), cy = y + 34 + 4 * DIV;
    const tracer = () => {
      calque.replaceChildren();
      if (o.signaux) o.signaux.forEach((u, i) => {
        const Svi = i ? o.Sv2 : o.Sv, pts = [];
        for (let k = 0; k <= N; k++) { const t = o.t_trig - o.b * 1e-3 + (k / N) * 10 * o.b * 1e-3, v = Math.max(-6, Math.min(6, u(t) / Svi + DECALAGE[i])); pts.push(`${(x + 18 + (k / N) * 10 * DIV).toFixed(1)},${(cy - v * DIV).toFixed(1)}`); }
        L.svg("polyline", { points: pts.join(" "), fill: "none", stroke: i ? "#ffe27a" : "#b8ffc8", "stroke-width": 1.2 }, calque);
      });
      L.missions.noter(fait, { Sv: o.Sv, Sv2: o.Sv2, b: o.b, enregistre: o.n });
    };
    [[12, SV, "Sv", "V", "VOLTS/DIV  CH1"], [58, SV, "Sv2", "V", "VOLTS/DIV  CH2"], [104, B, "b", "ms", "TIME/DIV"]].forEach(([dy, liste, cle, u, titre]) => {
      reglage(g, x, y + dy, liste, () => o[cle], u, (v) => { o[cle] = v; tracer(); });
      L.texte(g, x + 289, y + dy + 8, titre, { "font-size": 6.5, "font-weight": 700, fill: "#37474f" });
    });
    o.prises.forEach((p, i) => { L.svg("circle", { cx: p.x, cy: p.y, r: 8, fill: "url(#metal)", stroke: "#444" }, g); L.texte(g, p.x, p.y + 16, `CH${i + 1}`, { "font-size": 6.5, "font-weight": 700, fill: "#37474f" }); });
    o.enregistrer = (signaux) => { o.signaux = signaux; o.t_trig = declenchement(signaux[0]); o.n++; tracer(); };
    tracer();
    return o;
  };
})(window.Labo);
