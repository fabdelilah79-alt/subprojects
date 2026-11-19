/*
Rôle : paillasse « construction géométrique de l'image » : planche à dessin sur chevalet, feuille quadrillée (1 cm), lentille
       mince convergente (f' = 3 cm) schématisée, axe orienté ; objet AB (1,5 cm) que l'on fait glisser le long de l'axe ;
       aimants F, F' et B' à poser ; touches Rayon 1, 2, 3 et Prolonger. Un cas est noté quand B' est posé sur l'image.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_construction(g) -> { pense_bete } ; fait « construction » = { F, Fp, rayons, prolonge,
          cas: [{ OA, OAp, gamma, reelle }] }.
Utilisé par : simulation.js.
*/
(function (L) {
  const F = 3, H = 1.5, C = () => L.CONSTRUCTION;

  function planche(g) {
    // Chevalet, planche de bois, feuille quadrillée, axe orienté, lentille, O, crayon posé sur le rebord.
    const { E, BORDS } = C(), a = E(BORDS.g, BORDS.h), b = E(BORDS.d, -BORDS.h);
    for (const x of [250, 810]) { L.svg("line", { x1: x, y1: 470, x2: x - 22, y2: 540, stroke: "url(#metal)", "stroke-width": 7 }, g); L.ombre_sol(g, x - 22, 542, 26, 5, 0.4); }
    L.svg("rect", { x: 180, y: 205, width: 700, height: 268, rx: 5, fill: "url(#bois)", stroke: "#6d4a26" }, g);
    L.svg("rect", { x: 180, y: 470, width: 700, height: 12, rx: 3, fill: "url(#bois-face)" }, g);
    L.svg("rect", { x: a.x, y: a.y, width: b.x - a.x, height: b.y - a.y, fill: "#fbfbf6", stroke: "#cfc9b6" }, g);
    for (let x = BORDS.g; x <= BORDS.d; x++) L.svg("line", { x1: E(x, 0).x, y1: a.y, x2: E(x, 0).x, y2: b.y, stroke: "#dfe6ea", "stroke-width": 0.6 }, g);
    for (let y = -5; y <= 5; y++) L.svg("line", { x1: a.x, y1: E(0, y).y, x2: b.x, y2: E(0, y).y, stroke: "#dfe6ea", "stroke-width": 0.6 }, g);
    for (const [x, y] of [[a.x, a.y], [b.x, a.y], [a.x, b.y], [b.x, b.y]]) L.svg("rect", { x: x - 12, y: y - 6, width: 24, height: 12, fill: "#f3e6a8", opacity: 0.75, transform: `rotate(-30 ${x} ${y})` }, g);
    L.svg("path", { d: `M${a.x} 330 H${b.x - 4} M${b.x - 12} 325 L${b.x - 2} 330 L${b.x - 12} 335`, fill: "none", stroke: "#222", "stroke-width": 1.1 }, g);
    L.texte(g, b.x - 40, 342, "sens de la lumière", { "font-size": 7, fill: "#444" });
    L.svg("path", { d: `M520 ${E(0, 5).y} V${E(0, -5).y} M512 ${E(0, 5).y + 10} L520 ${E(0, 5).y} L528 ${E(0, 5).y + 10} M512 ${E(0, -5).y - 10} L520 ${E(0, -5).y} L528 ${E(0, -5).y - 10}`, fill: "none", stroke: "#1a3d7c", "stroke-width": 2.2 }, g);
    L.texte(g, 470, E(0, -4.8).y, "L (f' = 3 cm)", { "font-size": 8, "font-weight": 700, fill: "#1a3d7c" });
    L.svg("circle", { cx: 520, cy: 330, r: 2.2, fill: "#1a3d7c" }, g); L.texte(g, 528, 342, "O", { "font-size": 8, "font-weight": 700, fill: "#1a3d7c" });
    L.svg("path", { d: "M640 466 L760 458 L768 461 L760 464 Z", fill: "#e2b23a", stroke: "#7a5a12" }, g);
  }

  function aimant(g, p, nom, couleur) {
    // Aimant rond (ombre, pastille, croix de visée) et son nom.
    g.replaceChildren();
    L.svg("circle", { cx: p.x + 1, cy: p.y + 2, r: 7, fill: "#000", opacity: 0.25 }, g); L.svg("circle", { cx: p.x, cy: p.y, r: 7, fill: couleur, stroke: "#222" }, g);
    L.svg("path", { d: `M${p.x - 4} ${p.y} H${p.x + 4} M${p.x} ${p.y - 4} V${p.y + 4}`, stroke: "#fff", "stroke-width": 1.2 }, g);
    L.texte(g, p.x + 12, p.y - 9, nom, { "font-size": 9, "font-weight": 700, fill: couleur });
  }

  function objet(g, xa) {
    // Flèche AB perpendiculaire à l'axe, lettres A et B.
    g.replaceChildren();
    const { E } = C(), a = E(xa, 0), b = E(xa, H);
    L.svg("rect", { x: a.x - 10, y: b.y - 6, width: 20, height: a.y - b.y + 12, fill: "#fff", opacity: 0.01 }, g);
    L.svg("path", { d: `M${a.x} ${a.y} V${b.y} M${a.x - 5} ${b.y + 8} L${a.x} ${b.y} L${a.x + 5} ${b.y + 8}`, fill: "none", stroke: "#e65100", "stroke-width": 2.4 }, g);
    L.texte(g, a.x - 8, a.y + 12, "A", { "font-size": 9, "font-weight": 700, fill: "#e65100" }); L.texte(g, a.x - 9, b.y - 2, "B", { "font-size": 9, "font-weight": 700, fill: "#e65100" });
  }

  L.poste_construction = function (g) {
    // Planche, objet saisissable, aimants, rayons, touches ; cas notés.
    const { pense_bete } = L.decor_circuit(g, 1), { E, M, BORDS } = C();
    planche(L.svg("g", {}, g));
    const e = { xa: -8, rayons: {}, prolonger: false, prolonge: false, mag: { F: { x: -14, y: -6 }, Fp: { x: -12, y: -6 }, Bp: { x: -10, y: -6 } }, cas: [] };
    const gr = L.svg("g", { "pointer-events": "none" }, g), go = L.svg("g", { class: "objet", role: "slider", "aria-label": "Objet AB" }, g);
    const mags = { F: ["F", "#1565c0"], Fp: ["F'", "#1565c0"], Bp: ["B'", "#c62828"] }, gm = {};
    const dessiner = () => {
      // Objet, rayons, aimants.
      objet(go, e.xa); L.rayons_construction(gr, { xa: e.xa, h: H, f: F, rayons: e.rayons, prolonger: e.prolonger });
      for (const k in mags) aimant(gm[k], E(e.mag[k].x, e.mag[k].y), ...mags[k]);
    };
    L.glissable(go, { soulever: false, debut: () => E(e.xa, H / 2), deplacer: (p) => { e.xa = Math.max(-12, Math.min(-1, Math.round(M(p).x * 2) / 2)); dessiner(); } });
    for (const k in mags) {
      gm[k] = L.svg("g", { class: "aimant", role: "button", "aria-label": `Aimant ${mags[k][0]}` }, g);
      L.glissable(gm[k], { soulever: false, debut: () => E(e.mag[k].x, e.mag[k].y), deplacer: (p) => { const q = M(p); e.mag[k] = { x: Math.max(BORDS.g, Math.min(BORDS.d, Math.round(q.x * 10) / 10)), y: Math.max(-6.5, Math.min(BORDS.h, Math.abs(q.y) < 0.3 ? 0 : Math.round(q.y * 10) / 10)) }; dessiner(); } });
    }
    [1, 2, 3].forEach((k) => L.bouton_texte(g, 360 + (k - 1) * 88, 560, `Rayon ${k}`, () => { e.rayons[k] = !e.rayons[k]; dessiner(); }));
    L.bouton_texte(g, 624, 560, "Prolonger", () => { e.prolonger = !e.prolonger; e.prolonge = e.prolonge || e.prolonger; dessiner(); });
    dessiner();
    setInterval(() => L.missions.noter("construction", JSON.parse(JSON.stringify(bilan(e)))), 250);
    return { pense_bete };
  };

  function bilan(e) {
    // Foyers bien placés (à 1 mm près) ; B' posé sur l'image (2 mm près) avec deux rayons au moins : cas noté.
    const pres = (m, x, y, t) => Math.abs(m.x - x) <= t && Math.abs(m.y - y) <= t, ip = L.image_construction({ xa: e.xa, h: H, f: F });
    const n = [1, 2, 3].filter((k) => e.rayons[k]).length;
    if (ip && n >= 2 && pres(e.mag.Bp, ip.x, ip.y, 0.2) && !e.cas.some((c) => c.OA === e.xa)) e.cas.push({ OA: e.xa, OAp: Math.round(ip.x * 10) / 10, gamma: Math.round((ip.x / e.xa) * 100) / 100, reelle: ip.x > 0 });
    return { F: pres(e.mag.F, -F, 0, 0.1), Fp: pres(e.mag.Fp, F, 0, 0.1), rayons: e.rayons, prolonge: e.prolonge, cas: e.cas };
  }
})(window.Labo);
