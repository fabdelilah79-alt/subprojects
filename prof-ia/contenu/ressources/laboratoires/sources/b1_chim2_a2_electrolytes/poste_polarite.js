/*
Rôle : paillasse « molécules polaires et solide ionique » : deux burettes sur un pied (eau, cyclohexane), robinets que l'on
       ouvre d'un toucher, filet de liquide qui tombe dans un bécher ; baguette de plastique que l'on frotte sur un chiffon
       de laine (elle se charge) puis que l'on approche des filets : le filet d'eau (molécules polaires) est attiré, celui
       de cyclohexane (molécules apolaires) ne l'est pas. Maquette du cristal de chlorure de sodium (ions Na⁺ et Cl⁻ alternés).
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_polarite(g) -> { pense_bete } ; fait « polarite » = { charge, eau (déviation maximale, px), cyclohexane (px),
          approche: [baguette chargée approchée du filet d'eau, du filet de cyclohexane] }.
Utilisé par : simulation.js.
*/
(function (L) {
  const SOL = 560, BURETTES = [{ x: 300, nom: "eau", rgb: "#cfe8f5", k: 1 }, { x: 420, nom: "cyclohexane", rgb: "#eef2f2", k: 0 }], HAUT = 402, BAS = 520;

  function burette(g, b) {
    // Burette de 50 mL (tube gradué, liquide), robinet ; bécher de récupération ; étiquette.
    L.svg("rect", { x: b.x - 7, y: 170, width: 14, height: 210, rx: 3, fill: b.rgb, stroke: "#8fb3bd" }, g);
    for (let k = 0; k <= 25; k++) L.svg("line", { x1: b.x - 7, y1: 185 + k * 7.6, x2: b.x - (k % 5 ? 2 : 0), y2: 185 + k * 7.6, stroke: "#1a3d7c", "stroke-width": 0.6 }, g);
    L.svg("path", { d: `M${b.x - 4} 380 V392 L${b.x - 1.5} ${HAUT} H${b.x + 1.5} L${b.x + 4} 392 V380 Z`, fill: "#e8f2f6", stroke: "#8fb3bd" }, g);
    L.svg("path", { d: `M${b.x - 34} ${BAS} L${b.x - 30} ${SOL} H${b.x + 30} L${b.x + 34} ${BAS}`, fill: "#e8f2f6", opacity: 0.6, stroke: "#8fb3bd" }, g);
    L.svg("rect", { x: b.x - 29, y: SOL - 18, width: 58, height: 17, fill: b.rgb, opacity: 0.8 }, g);
    L.texte(g, b.x, 162, b.nom, { "font-size": 8, "font-weight": 700, fill: "#23315a" });
  }

  function robinet(g, b, ouvert) {
    // Robinet de burette (clé en PTFE) : horizontal fermé, vertical ouvert.
    g.replaceChildren();
    L.svg("rect", { x: b.x - 6, y: 382, width: 12, height: 9, rx: 2, fill: "#e8f2f6", stroke: "#8fb3bd" }, g);
    L.svg("rect", ouvert ? { x: b.x - 3, y: 374, width: 6, height: 24, rx: 2, fill: "#f4f4f0", stroke: "#999" } : { x: b.x - 14, y: 383.5, width: 28, height: 6, rx: 2, fill: "#f4f4f0", stroke: "#999" }, g);
    L.svg("rect", { x: b.x - 18, y: 370, width: 36, height: 34, fill: "#fff", opacity: 0.01 }, g);
  }

  function cristal(g) {
    // Maquette 3 × 3 × 3 : ions Cl⁻ (gros, verts) et Na⁺ (petits, gris) alternés, vue en perspective, sur son socle.
    const P = (i, j, k) => ({ x: 790 + (i - j) * 26, y: 450 + (i + j) * 13 - k * 30 });
    L.svg("path", { d: "M712 512 L790 551 L868 512 L790 473 Z", fill: "url(#bois)", stroke: "#6d4a26" }, g);
    const ions = [];
    for (let k = 0; k < 3; k++) for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) ions.push({ i, j, k, cl: (i + j + k) % 2 === 0 });
    ions.sort((a, b) => a.i + a.j - (b.i + b.j) || a.k - b.k);
    for (const a of ions) for (const [di, dj, dk] of [[1, 0, 0], [0, 1, 0], [0, 0, 1]]) if (a.i + di < 3 && a.j + dj < 3 && a.k + dk < 3) { const p = P(a.i, a.j, a.k), q = P(a.i + di, a.j + dj, a.k + dk); L.svg("line", { x1: p.x, y1: p.y, x2: q.x, y2: q.y, stroke: "#9a8a6a", "stroke-width": 1.4 }, g); }
    for (const a of ions) { const p = P(a.i, a.j, a.k); L.svg("circle", { cx: p.x, cy: p.y, r: a.cl ? 10 : 6, fill: a.cl ? "#3fae5a" : "#a9b0b6", stroke: "#222", "stroke-width": 0.6 }, g); }
    L.texte(g, 790, 368, "chlorure de sodium : Cl⁻ (vert), Na⁺ (gris)", { "font-size": 7.5, "font-weight": 700, fill: "#e8e2cc" });
  }

  function filet(g, b, ouvert, D) {
    // Filet de liquide de la pointe au bécher, courbé vers la baguette (déviation D en px au bas du filet).
    g.replaceChildren();
    if (!ouvert) return;
    const pts = Array.from({ length: 11 }, (_, k) => `${b.x + D * (k / 10) ** 2} ${HAUT + ((BAS + 6 - HAUT) * k) / 10}`).join(" L");
    L.svg("path", { d: `M${pts}`, fill: "none", stroke: b.rgb, "stroke-width": 2.2, opacity: 0.95 }, g);
  }

  L.poste_polarite = function (g) {
    // Matériel ; frottement de la baguette sur la laine ; déviation des filets ; fait.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230), e = { q: 0, p: { x: 600, y: 470 }, ouverts: [false, false], max: [0, 0], vu: [false, false] }, fond = L.svg("g", {}, g);
    L.pied_support(fond, 360, SOL, 150); L.svg("rect", { x: 292, y: 196, width: 136, height: 6, fill: "url(#metal)" }, fond); L.noix(fond, 360, 199);
    BURETTES.forEach((b) => burette(fond, b)); cristal(fond);
    L.svg("rect", { x: 540, y: 520, width: 120, height: 36, rx: 6, fill: "#c7b9a0", stroke: "#8f7f62" }, fond);
    for (let k = 0; k < 7; k++) L.svg("path", { d: `M${546 + k * 16} 524 q4 14 0 28`, fill: "none", stroke: "#b0a184", "stroke-width": 2 }, fond);
    L.texte(fond, 600, 572, "chiffon de laine", { "font-size": 7.5, "font-weight": 700, fill: "#e8e2cc" });
    const gf = BURETTES.map(() => L.svg("g", { "pointer-events": "none" }, g)), gr = BURETTES.map((b, k) => L.svg("g", { class: "robinet", role: "button", "aria-label": `Robinet de la burette de ${b.nom}` }, g));
    const gb = L.svg("g", { class: "baguette", role: "button", "aria-label": "Baguette en plastique" }, g);
    const dessiner = () => {
      // Robinets, filets (déviation selon la charge et la distance de la baguette), baguette.
      BURETTES.forEach((b, k) => {
        const d = Math.hypot(e.p.x - b.x, e.p.y - (HAUT + BAS) / 2), D = Math.sign(e.p.x - b.x) * Math.max(0, Math.min(Math.abs(e.p.x - b.x) - 4, (b.k * 70 * e.q) / (1 + (d / 45) ** 2)));
        if (e.ouverts[k]) { e.max[k] = Math.max(e.max[k], Math.abs(D)); if (e.q > 0.3 && d < 80) e.vu[k] = true; }
        robinet(gr[k], b, e.ouverts[k]); filet(gf[k], b, e.ouverts[k], D);
      });
      gb.replaceChildren(); const { x, y } = e.p;
      L.svg("rect", { x: x - 6, y: y - 6, width: 170, height: 12, rx: 6, fill: "#d9534f", stroke: "#7a2421" }, gb);
      L.svg("rect", { x: x + 110, y: y - 7, width: 60, height: 14, rx: 6, fill: "#333" }, gb);
      if (e.q > 0.05) L.texte(gb, x + 50, y - 12, "baguette chargée", { "font-size": 7, "font-weight": 700, fill: "#ffd54f" });
    };
    BURETTES.forEach((b, k) => L.glissable(gr[k], { soulever: false, debut: () => ({ x: 0, y: 0 }), toucher: () => { e.ouverts[k] = !e.ouverts[k]; dessiner(); } }));
    L.glissable(gb, { soulever: false, debut: () => ({ ...e.p }), deplacer: (p) => { const sur = p.x > 530 && p.x < 670 && p.y > 510 && p.y < 560; if (sur) e.q = Math.min(1, e.q + Math.hypot(p.x - e.p.x, p.y - e.p.y) / 600); e.p = { x: Math.max(120, Math.min(840, p.x)), y: Math.max(180, Math.min(560, p.y)) }; dessiner(); } });
    dessiner();
    setInterval(() => { e.q *= 0.9995; dessiner(); L.missions.noter("polarite", { charge: Math.round(e.q * 100) / 100, eau: Math.round(e.max[0]), cyclohexane: Math.round(e.max[1]), approche: [...e.vu] }); }, 200);
    return { pense_bete };
  };
})(window.Labo);
