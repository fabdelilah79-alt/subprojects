/*
Rôle : poste de mesure de conductance aux vraies dimensions (2,4 px par mm) : cellule à deux plaques parallèles de 1 cm de
       large et 4 cm de haut, tenue par une barrette graduée (on fait glisser la plaque de droite : L de 0,5 à 3 cm) au bout
       d'un pied ; bécher de 100 mL sur un support élévateur (on fait glisser le plateau : la surface immergée S = 1 cm ×
       profondeur varie de 0 à 3 cm) ; flacons de solutions (un toucher rince le bécher et le remplit) ; étagère du GBF et
       des deux appareils, câbles branchés. U efficace réglée par les touches du GBF (0,50 à 2,00 V) ; I = G × U.
Reçoit : le groupe SVG de la paillasse et { flacons: [{ id, texte, sol (Labo.SOLUTIONS), C (mol/L) }], L (cm), L_fixe, S_fixe (cm² : le plateau n'a que deux positions, bas ou plaques immergées de S_fixe cm) }.
Produit : Labo.cellule_conductance(g, reglage) -> { etat() -> { flacon, sol, C, L, S, U, I, G }, mesures: [] } ;
          fait « conductance » = { flacon, L, S, U, I, G, mesures: [{ flacon, L, S, U, I, G }] }.
Utilisé par : les simulations de conductimétrie.
*/
(function (L) {
  const X = 580, YB = 262, YP = 335, E = 2.4, PX_CM = 24, SOL = 560, HAUT_LIQ = 85;

  function cellule(g, l) {
    // Barrette graduée, tige, deux plaques (vues de trois quarts) ; renvoie les points d'attache des câbles.
    g.replaceChildren();
    const xg = X - 36, xd = xg + l * PX_CM;
    L.svg("rect", { x: X - 60, y: YB - 8, width: 120, height: 8, rx: 2, fill: "#f0efe8", stroke: "#8f8b7c" }, g);
    for (let c = 0; c <= 4; c += 0.5) L.svg("line", { x1: xg + c * PX_CM, y1: YB - 8, x2: xg + c * PX_CM, y2: YB - (c % 1 ? 5 : 3), stroke: "#333", "stroke-width": 0.6 }, g);
    for (const x of [xg, xd]) {
      L.svg("rect", { x: x - 5, y: YB - 12, width: 10, height: 14, rx: 2, fill: "#2b3035" }, g);
      L.svg("rect", { x: x + 3, y: YB, width: 3, height: YP - YB + 2, fill: "url(#metal)" }, g);
      L.svg("path", { d: `M${x} ${YP + 4} L${x + 10} ${YP - 2} V${YP + 90} L${x} ${YP + 96} Z`, fill: "#4a4f55", stroke: "#22262a" }, g);
    }
    for (let k = 1; k <= 3; k++) { const y = YP + 96 - k * PX_CM; L.svg("line", { x1: xg - 6, y1: y, x2: xg, y2: y, stroke: "#e8e2cc", "stroke-width": 0.8 }, g); L.texte(g, xg - 12, y + 3, `${k} cm`, { "font-size": 6, fill: "#e8e2cc" }); }
    return { g: { x: xg, y: YB - 12 }, d: { x: xd, y: YB - 12 } };
  }

  function becher(g, y, rgb, texte) {
    // Support élévateur (ciseaux) dont le plateau est en y, bécher de 100 mL posé dessus, liquide, étiquette.
    g.replaceChildren();
    L.ombre_sol(g, X, SOL + 2, 74, 6, 0.4);
    L.svg("rect", { x: X - 70, y: SOL - 8, width: 140, height: 8, rx: 2, fill: "url(#metal)", stroke: "#444" }, g);
    for (const s of [-1, 1]) L.svg("line", { x1: X - 60, y1: s > 0 ? SOL - 8 : y + 8, x2: X + 60, y2: s > 0 ? y + 8 : SOL - 8, stroke: "#6a7177", "stroke-width": 4 }, g);
    L.svg("rect", { x: X - 70, y, width: 140, height: 8, rx: 2, fill: "url(#metal)", stroke: "#444" }, g);
    L.svg("rect", { x: X - 60, y: y - HAUT_LIQ, width: 120, height: HAUT_LIQ, fill: rgb, opacity: 0.45 }, g);
    L.svg("path", { d: `M${X - 62} ${y - 168} V${y} H${X + 62} V${y - 168}`, fill: "none", stroke: "#8fb3bd", "stroke-width": 2 }, g);
    L.svg("rect", { x: X - 62, y: y - 168, width: 124, height: 168, fill: "#e8f2f6", opacity: 0.18 }, g);
    if (texte) { L.svg("rect", { x: X + 8, y: y - 60, width: 50, height: 18, rx: 2, fill: "#fdfdf8", stroke: "#999" }, g); L.texte(g, X + 33, y - 48, texte, { "font-size": 6.5, "font-weight": 700, fill: "#222" }); }
  }

  function cables(g, a, b, bornes) {
    // Câbles : GBF → ampèremètre → plaque gauche ; plaque droite → GBF ; voltmètre aux bornes des plaques.
    g.replaceChildren();
    const c = (p, q, couleur) => L.svg("path", { d: `M${p.x} ${p.y} C${p.x} ${p.y + 60} ${q.x} ${q.y - 70} ${q.x} ${q.y}`, fill: "none", stroke: couleur, "stroke-width": 2.2 }, g);
    c(bornes.gbf[0], bornes.a[0], "#c62828"); c(bornes.a[1], a, "#111"); c(bornes.gbf[1], b, "#111"); c(bornes.v[0], { x: a.x - 3, y: a.y }, "#c62828"); c(bornes.v[1], { x: b.x + 3, y: b.y }, "#111");
  }

  L.cellule_conductance = function (g, { flacons, L: l0 = 1, L_fixe = false, S_fixe = null }) {
    // Matériel, gestes, calcul de G et des lectures ; mesures notées quand on lâche un réglage ou change de solution.
    const e = { l: l0, y: 540, flacon: null, U: 1, mesures: [] }, fond = L.svg("g", {}, g);
    L.pied_support(fond, 480, SOL, 226); L.svg("rect", { x: 480, y: 238, width: X - 480, height: 6, fill: "url(#metal)" }, fond); L.svg("rect", { x: X - 3, y: 238, width: 6, height: YB - 246, fill: "url(#metal)" }, fond); L.noix(fond, 480, 241);
    const app = L.etagere_appareils(fond, { x: 672, y: 150 });
    const gb = L.svg("g", { class: "plateau", role: "slider", "aria-label": "Plateau du support élévateur" }, g), gc = L.svg("g", {}, g), gd = L.svg("g", { class: "plaque", role: "slider", "aria-label": "Plaque mobile" }, g), gk = L.svg("g", { "pointer-events": "none" }, g);
    const f = () => flacons.find((k) => k.id === e.flacon);
    const etat = () => {
      // Profondeur immergée (cm), surface S (cm²), conductance et lectures.
      const prof = f() ? Math.max(0, Math.min(4, (YP + 96 - (e.y - HAUT_LIQ)) / PX_CM)) : 0, S = Math.round(prof * 10) / 10;
      const G = prof > 0 ? L.conductance({ nom: f().sol, C: f().C, S: S * 1e-4, L: e.l * 1e-2 }) : 0;
      return { flacon: e.flacon, sol: f()?.sol || null, C: f()?.C ?? null, L: e.l, S: prof > 0 ? S : 0, U: e.U, I: G * e.U, G };
    };
    const dessiner = () => { const p = cellule(gc, e.l); becher(gb, e.y, f() ? [200, 225, 238] : [255, 255, 255], f()?.texte); cables(gk, p.g, p.d, app.bornes); gd.replaceChildren(); L.svg("rect", { x: p.d.x - 10, y: YB - 20, width: 22, height: YP - YB + 116, fill: "#fff", opacity: 0.01 }, gd); app.afficher(e.U, etat().I); };
    const noter = () => { const s = etat(); if (s.S > 0 && !e.mesures.some((m) => m.flacon === s.flacon && m.L === s.L && m.S === s.S && m.U === s.U)) e.mesures.push({ flacon: s.flacon, L: s.L, S: s.S, U: s.U, I: s.I, G: s.G }); };
    L.glissable(gb, { soulever: false, debut: () => ({ x: X, y: e.y }), deplacer: (p) => { e.y = Math.max(440, Math.min(540, p.y)); if (S_fixe) { const haut = YP + 96 + HAUT_LIQ - S_fixe * PX_CM; e.y = e.y < (haut + 540) / 2 ? haut : 540; } dessiner(); }, lacher: noter });
    if (!L_fixe) L.glissable(gd, { soulever: false, debut: () => ({ x: X - 36 + e.l * PX_CM, y: 0 }), deplacer: (p) => { e.l = Math.round(Math.max(0.5, Math.min(3, (p.x - X + 36) / PX_CM)) * 2) / 2; dessiner(); }, lacher: noter });
    flacons.forEach((k, i) => {
      const x = (flacons.length > 4 ? 120 : 215) + i * 44, gf = L.svg("g", { class: "flacon", role: "button", "aria-label": `Flacon : ${k.texte}` }, g);
      L.svg("rect", { x: x - 16, y: 396, width: 32, height: 70, rx: 5, fill: "#e8f2f6", opacity: 0.8, stroke: "#8fb3bd" }, gf); L.svg("rect", { x: x - 8, y: 384, width: 16, height: 14, rx: 2, fill: "#3b7cc4" }, gf);
      L.svg("rect", { x: x - 15, y: 420, width: 30, height: 26, fill: "#fdfdf8" }, gf); L.texte(gf, x, 431, k.texte.split("\n")[0], { "font-size": 5.6, "font-weight": 700, fill: "#222" }); L.texte(gf, x, 440, k.texte.split("\n")[1] || "", { "font-size": 5.2, fill: "#222" });
      L.glissable(gf, { soulever: false, debut: () => ({ x: 0, y: 0 }), toucher: () => { e.flacon = k.id; e.y = 540; dessiner(); } });
    });
    [["−", -0.25], ["+", 0.25]].forEach(([t, d], k) => L.bouton_rond(g, 712 + k * 22, 254, t, () => { e.U = Math.max(0.5, Math.min(2, e.U + d)); dessiner(); noter(); }, 7));
    dessiner();
    setInterval(() => { app.afficher(e.U, etat().I); L.missions.noter("conductance", JSON.parse(JSON.stringify({ ...etat(), mesures: e.mesures }))); }, 400);
    return { etat, mesures: e.mesures };
  };
})(window.Labo);
