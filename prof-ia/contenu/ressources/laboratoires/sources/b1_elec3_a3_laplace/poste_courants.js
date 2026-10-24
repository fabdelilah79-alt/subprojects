/*
Rôle : paillasse « courants parallèles et faisceau d'électrons » : (1) deux rubans d'aluminium verticaux et parallèles,
       parcourus par des courants de même sens ou de sens contraires (10 A) : ils s'attirent ou se repoussent ;
       (2) tube à faisceau d'électrons (trace verte sur l'écran fluorescent) et barreau aimanté que l'on approche par
       l'avant, pôle nord ou pôle sud tourné vers le tube : le faisceau est dévié vers le haut ou vers le bas.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_courants(g) -> { pense_bete } ; faits « courants » = { attire, repousse }, « faisceau » = { haut, bas }.
Utilisé par : simulation.js.
*/
(function (L) {
  const TX0 = 600, TX1 = 900, TY = 300;

  function rubans(g, e) {
    // Potence isolante, deux rubans (courbés selon la force), flèches du sens des courants.
    g.replaceChildren();
    L.svg("rect", { x: 200, y: 220, width: 200, height: 14, rx: 3, fill: "#f0e6c8", stroke: "#8a7a4a" }, g);
    L.svg("rect", { x: 200, y: 486, width: 200, height: 14, rx: 3, fill: "#f0e6c8", stroke: "#8a7a4a" }, g);
    const d = !e.ferme ? 0 : e.meme ? 14 : -14;
    [[270, 1, 1], [330, -1, e.meme ? 1 : -1]].forEach(([x, s, sens]) => {
      L.svg("path", { d: `M${x} 234 Q${x + s * d * 2} 360 ${x} 486`, fill: "none", stroke: "#c9cdd1", "stroke-width": 6 }, g);
      if (e.ferme) L.svg("path", { d: `M${x + 16 * s} ${360 - 12 * sens} V${360 + 12 * sens} M${x + 16 * s - 4} ${360 + 7 * sens} L${x + 16 * s} ${360 + 12 * sens} L${x + 16 * s + 4} ${360 + 7 * sens}`, fill: "none", stroke: "#c62828", "stroke-width": 1.8 }, g);
    });
    L.texte(g, 300, 516, e.ferme ? (e.meme ? "courants de même sens" : "courants de sens contraires") : "circuit ouvert", { "font-size": 8, "font-weight": 700, fill: "#e8e2d4" });
  }

  function faisceau(g, a) {
    // Tube de verre, canon à électrons, écran fluorescent ; trace déviée par le champ du barreau aimanté (à l'avant).
    g.replaceChildren();
    L.svg("rect", { x: TX0 - 40, y: TY - 50, width: TX1 - TX0 + 60, height: 100, rx: 46, fill: "url(#verre)", stroke: "#9fb6be", "stroke-width": 1.5 }, g);
    L.svg("rect", { x: TX0 - 30, y: TY - 8, width: 34, height: 16, rx: 3, fill: "#5c6168" }, g);
    L.svg("rect", { x: TX0 + 4, y: TY - 40, width: TX1 - TX0 - 4, height: 80, fill: "#1f3b2a", opacity: 0.18 }, g);
    const k = a.pose ? (a.pole * 9000) / Math.max(60, Math.hypot(a.x - (TX0 + TX1) / 2, a.y - TY)) ** 2 : 0;
    let y = TY, pente = 0, d = `M${TX0 + 4} ${TY}`;
    for (let x = TX0 + 8; x <= TX1; x += 6) { pente -= k * Math.exp(-(((x - a.x) / 70) ** 2)) * 6 * 0.004; y = Math.max(TY - 38, Math.min(TY + 38, y + pente * 6)); d += ` L${x} ${y.toFixed(1)}`; }
    L.svg("path", { d, fill: "none", stroke: "#7dff9a", "stroke-width": 2.4, opacity: 0.9 }, g);
    a.deviation = y - TY;
    L.texte(g, (TX0 + TX1) / 2, TY - 62, "tube à faisceau d'électrons (vers la droite)", { "font-size": 8, "font-weight": 700, fill: "#e8e2d4" });
  }

  function barreau(g, a) {
    // Barreau aimanté vu par son extrémité, pôle tourné vers le tube marqué N ou S.
    g.replaceChildren();
    L.svg("rect", { x: a.x - 18, y: a.y - 14, width: 36, height: 44, rx: 3, fill: "#4a4f55" }, g);
    L.svg("rect", { x: a.x - 18, y: a.y - 20, width: 36, height: 20, rx: 3, fill: a.pole > 0 ? "#d63a2f" : "#2f6fd0", stroke: "#222" }, g);
    L.texte(g, a.x, a.y - 9, a.pole > 0 ? "N" : "S", { "font-size": 11, "font-weight": 700, fill: "#fff" });
  }

  L.poste_courants = function (g) {
    // Matériel, touches, glisser du barreau ; faits.
    const { pense_bete } = L.decor_circuit(g, 2), e = { ferme: false, meme: true, attire: false, repousse: false };
    const a = { x: 760, y: 500, pole: 1, pose: false, deviation: 0 }, f = {};
    const gr = L.svg("g", {}, g), gf = L.svg("g", {}, g), gb = L.svg("g", { class: "aimant", role: "button", "aria-label": "Barreau aimanté" }, g);
    const maj = () => { rubans(gr, e); faisceau(gf, a); barreau(gb, a); };
    L.bouton_texte(g, 300, 548, "Fermer / Ouvrir", () => { e.ferme = !e.ferme; maj(); });
    L.bouton_texte(g, 392, 548, "Sens", () => { e.meme = !e.meme; maj(); });
    L.bouton_texte(g, 760, 548, "Retourner", () => { a.pole = -a.pole; maj(); });
    L.glissable(gb, { soulever: false, debut: () => ({ x: a.x, y: a.y }), deplacer: (p) => { a.x = Math.max(TX0, Math.min(TX1, p.x)); a.y = Math.max(TY + 60, Math.min(520, p.y)); a.pose = a.y < 460; maj(); } });
    maj();
    setInterval(() => {
      if (e.ferme) e[e.meme ? "attire" : "repousse"] = true;
      if (a.deviation < -12) f.haut = true;
      if (a.deviation > 12) f.bas = true;
      L.missions.noter("courants", { attire: e.attire, repousse: e.repousse }); L.missions.noter("faisceau", { ...f });
    }, 250);
    return { pense_bete };
  };
})(window.Labo);
