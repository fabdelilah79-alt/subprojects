/*
Rôle : paillasse « le noyau sur la balance » (modèle) : balance de précision à fléau ; sur le plateau de droite, un noyau
       choisi (²H, ⁴He, ¹²C, ⁵⁶Fe, ²³⁵U) ; sur le plateau de gauche, des protons et des neutrons séparés, que l'on ajoute ou
       retire avec les touches. L'écran au mur donne les deux masses en unités de masse atomique (u) et leur différence ;
       le fléau penche du côté le plus lourd (inclinaison amplifiée). Même composition : les nucléons séparés sont plus
       lourds que le noyau ; la différence est le défaut de masse Δm.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_balance(g) -> { pense_bete } ; fait « balance » = { noyau, p, n, mg, md, dm } (masses en u).
Utilisé par : simulation.js.
*/
(function (L) {
  const CHOIX = ["H2", "He4", "C12", "Fe56", "U235"], O = { x: 700, y: 340 }, BRAS = 140;

  function balle(g, x, y, proton) {
    // Un nucléon : proton rouge, neutron gris.
    L.svg("circle", { cx: x, cy: y, r: 4, fill: proton ? "#e53935" : "#9aa2a6", stroke: "#333", "stroke-width": 0.5 }, g);
  }

  function plateau(g, x, y, contenu) {
    // Plateau suspendu par trois fils au bout du fléau ; contenu dessiné au-dessus.
    for (const dx of [-36, 0, 36]) L.svg("line", { x1: x, y1: y - 100, x2: x + dx, y2: y, stroke: "#8a8f94", "stroke-width": 0.8 }, g);
    L.svg("ellipse", { cx: x, cy: y + 2, rx: 46, ry: 8, fill: "url(#metal)", stroke: "#333" }, g);
    contenu(g, x, y);
  }

  function nucleons(e) {
    // Tas de nucléons séparés (60 au plus dessinés) et leur nombre.
    return (g, x, y) => {
      const total = Math.min(60, e.p + e.n);
      for (let k = 0; k < total; k++) { const rang = Math.floor(k / 12), j = k % 12; balle(g, x - 33 + j * 6 + (rang % 2) * 3, y - 2 - rang * 7, k < Math.round((total * e.p) / Math.max(1, e.p + e.n))); }
      L.texte(g, x, y + 24, `${e.p} p + ${e.n} n${e.p + e.n > 60 ? " (en partie dessinés)" : ""}`, { "font-size": 7.5, "font-weight": 700, fill: "#f4f1e6" });
    };
  }

  function noyau(e) {
    // Noyau : boule de nucléons serrés, rayon proportionnel à A^(1/3).
    return (g, x, y) => {
      const k = L.NOYAUX[e.noyau], r = 5 * Math.cbrt(k.a);
      L.svg("circle", { cx: x, cy: y - r, r, fill: "#b9a6a0", stroke: "#333" }, g);
      for (let i = 0; i < Math.min(40, k.a); i++) { const a = i * 2.4, d = r * 0.8 * Math.sqrt((i + 0.5) / Math.min(40, k.a)); balle(g, x + d * Math.cos(a), y - r + d * Math.sin(a), i % 2 === 0); }
      L.texte(g, x, y + 24, `noyau ${k.symbole}`, { "font-size": 8, "font-weight": 700, fill: "#f4f1e6" });
    };
  }

  function dessiner(g, ge, e) {
    // Balance (inclinaison selon la différence de masse, amplifiée) et écran au mur.
    g.replaceChildren();
    const a = Math.max(-10, Math.min(10, ((e.mg - e.md) / e.md) * 300)) * (Math.PI / 180), xg = O.x - BRAS * Math.cos(a), yg = O.y + BRAS * Math.sin(a), xd = O.x + BRAS * Math.cos(a), yd = O.y - BRAS * Math.sin(a);
    L.ombre_sol(g, O.x, 552, 130, 8, 0.45);
    L.svg("rect", { x: O.x - 120, y: 530, width: 240, height: 22, rx: 3, fill: "#3b4248", stroke: "#111" }, g);
    L.tige(g, `M${O.x} 530 V${O.y}`, 8);
    L.svg("line", { x1: xg, y1: yg, x2: xd, y2: yd, stroke: "#5d646a", "stroke-width": 6, "stroke-linecap": "round" }, g);
    L.svg("path", { d: `M${O.x - 7} ${O.y + 10} L${O.x} ${O.y - 4} L${O.x + 7} ${O.y + 10} Z`, fill: "#2b2f33" }, g);
    L.svg("line", { x1: O.x, y1: O.y, x2: O.x + 60 * Math.sin(-a), y2: O.y + 60 * Math.cos(-a), stroke: "#d32f2f", "stroke-width": 1.5 }, g);
    plateau(g, xg, yg + 100, nucleons(e)); plateau(g, xd, yd + 100, noyau(e));
    ge.replaceChildren();
    const t = (s, y, k, c = "#7dff9a") => L.texte(ge, 525, y, s, { "font-size": k, "font-weight": 700, fill: c, "font-family": "monospace" });
    L.svg("rect", { x: 290, y: 40, width: 470, height: 150, rx: 4, fill: "#1d2a22", stroke: "#000", filter: "url(#ombre)" }, ge);
    t("Balance de précision (modèle) — masses en u", 62, 9, "#c8e6c9");
    t(`gauche : ${e.p} protons + ${e.n} neutrons = ${e.mg.toFixed(6).replace(".", ",")} u`, 94, 10);
    t(`droite : noyau ${L.NOYAUX[e.noyau].symbole} = ${e.md.toFixed(6).replace(".", ",")} u`, 120, 10);
    t(`gauche − droite = ${(e.mg - e.md).toFixed(6).replace(".", ",")} u`, 152, 12);
    t(e.p === L.NOYAUX[e.noyau].z && e.n === L.NOYAUX[e.noyau].a - L.NOYAUX[e.noyau].z ? "même composition : les nucléons séparés sont plus lourds" : "", 176, 8, "#ffe082");
  }

  L.poste_balance = function (g) {
    // Réserves de nucléons, touches, balance, écran, document ; fait noté à chaque geste.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230), e = { noyau: "He4", p: 0, n: 0, mg: 0, md: 0 };
    const gb = L.svg("g", { "pointer-events": "none" }, g), ge = L.svg("g", {}, g), N = L.NUCLEONS;
    const maj = () => { e.mg = e.p * N.mp + e.n * N.mn; e.md = L.NOYAUX[e.noyau].m; dessiner(gb, ge, e); L.missions.noter("balance", { noyau: e.noyau, p: e.p, n: e.n, mg: Math.round(e.mg * 1e6) / 1e6, md: e.md, dm: Math.round((e.mg - e.md) * 1e6) / 1e6 }); };
    [["p", "protons", 320, true], ["n", "neutrons", 410, false]].forEach(([cle, nom, x, proton]) => {
      L.svg("rect", { x: x - 30, y: 414, width: 30, height: 18, rx: 3, fill: "#2f3438", stroke: "#111" }, g);
      for (let k = 0; k < 6; k++) balle(g, x - 23 + (k % 3) * 8, 419 + Math.floor(k / 3) * 8, proton);
      L.texte(g, x + 4, 427, nom, { "font-size": 7, fill: "#e8e2d4", "text-anchor": "start" });
      [[1, "+1"], [10, "+10"], [-1, "−1"]].forEach(([d, t], k) => L.bouton_texte(g, x, 452 + k * 30, `${t} ${cle}`, () => { e[cle] = Math.max(0, Math.min(250, e[cle] + d)); maj(); }));
    });
    L.bouton_texte(g, 320, 552, "Vider", () => { e.p = 0; e.n = 0; maj(); });
    L.bouton_texte(g, 410, 552, "Noyau", () => { e.noyau = CHOIX[(CHOIX.indexOf(e.noyau) + 1) % CHOIX.length]; maj(); });
    L.documents_mur(g, [{ x: 786, y: 40, l: 214, h: 170, taille: 4.4, titre: "Unités de l'infiniment petit", texte: "Unité de masse atomique : 1 u = 1/12 de la masse d'un atome de carbone 12 = 1,66054 × 10⁻²⁷ kg. Électronvolt : 1 eV = 1,602 × 10⁻¹⁹ J ; 1 MeV = 10⁶ eV. Einstein : une masse m au repos équivaut à une énergie E = m·c², avec c = 2,998 × 10⁸ m/s. L'équation aux dimensions [E] = [m]·[c]² = M·L²·T⁻² montre que le joule vaut kg·m²·s⁻². Ainsi 1 u équivaut à 931,5 MeV : on écrit 1 u = 931,5 MeV/c²." }], "docs_unites");
    maj();
    return { pense_bete };
  };
})(window.Labo);
