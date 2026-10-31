/*
Rôle : paillasse « bille en chute libre filmée » : potence, électroaimant, règle graduée de 1 m fixée sur la potence,
       bac à sable ; deux billes (acier 33 g, verre 5 g) dans une coupelle ; boîtier de commande (électroaimant, lâcher) ;
       caméra sur trépied (25 images/s) reliée par câble USB au portable de pointage vidéo. La bille, lâchée sans vitesse,
       tombe sous l'action de son seul poids (frottements de l'air négligeables pour ces billes denses) : y = y0 − ½·g·t².
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_chute(g) -> { pense_bete } ; faits « bille » (nom de la bille accrochée), « chutes » = [{ id, bille,
          masse_g }], « pointage » (voir pointage_video.js).
Utilisé par : simulation.js.
*/
(function (L) {
  const G = 9.81, FPS = 25, Y0 = 1.08, YB = 0.12, PX = 380, BAS = 506, XC = 400, TIGE = 300, REGLE = 416;
  const BILLES = [{ id: "acier", nom: "bille d'acier", masse_g: 33, teinte: "url(#acier)" }, { id: "verre", nom: "bille de verre", masse_g: 5, teinte: "#9fd3c7" }];
  const ecran_y = (y) => BAS - (y - 0.1) * PX;

  function potence(g) {
    // Socle en fonte, tige, noix et bras, électroaimant ; règle graduée (0 en haut, 100 cm en bas) ; bac à sable.
    L.ombre_sol(g, TIGE + 20, 528, 70, 8, 0.4);
    L.svg("path", { d: `M${TIGE - 40} 512 h120 l10 16 h-140 Z`, fill: "#3b4046", stroke: "#1e2226" }, g);
    L.tige(g, `M${TIGE} 512 V88`, 7); L.tige(g, `M${TIGE} 99 H${XC}`, 5);
    L.svg("rect", { x: TIGE - 10, y: 91, width: 20, height: 16, rx: 3, fill: "#555c63" }, g);
    L.svg("rect", { x: XC - 12, y: 103, width: 24, height: 23, rx: 3, fill: "#b8562b", stroke: "#5a2a14" }, g);
    L.svg("path", { d: `M${XC - 12} 108 C${XC - 60} 90 ${TIGE - 40} 140 ${TIGE - 60} 300 S 222 380 222 428`, fill: "none", stroke: "#222", "stroke-width": 2 }, g);
    L.svg("rect", { x: REGLE, y: ecran_y(1.1) - 8, width: 26, height: PX + 16, fill: "#f3e7c9", stroke: "#a88b55" }, g);
    for (let cm = 0; cm <= 100; cm++) { const y = ecran_y(1.1 - cm / 100), l = cm % 10 === 0 ? 12 : cm % 5 === 0 ? 8 : 4; L.svg("line", { x1: REGLE, y1: y, x2: REGLE + l, y2: y, stroke: "#2b2416", "stroke-width": cm % 10 ? 0.35 : 0.7 }, g); if (cm % 10 === 0) L.texte(g, REGLE + 18, y + 2.5, String(cm), { "font-size": 6.5, fill: "#2b2416" }); }
    L.svg("path", { d: `M${XC - 50} ${BAS + 4} h100 l6 22 h-112 Z`, fill: "url(#bois-face)", stroke: "#6b4a2a" }, g);
    L.svg("ellipse", { cx: XC, cy: BAS + 6, rx: 48, ry: 6, fill: "#d9c08a" }, g);
  }

  function camera(g) {
    // Caméra sur trépied tournée vers la règle, voyant d'enregistrement, câble USB jusqu'au portable.
    L.ombre_sol(g, 492, 528, 36, 6, 0.35);
    for (const dx of [-22, 0, 22]) L.tige(g, `M492 400 L${492 + dx} 524`, 3);
    L.svg("rect", { x: 472, y: 370, width: 40, height: 28, rx: 4, fill: "#24282c", stroke: "#000" }, g);
    L.svg("circle", { cx: 472, cy: 384, r: 9, fill: "#111", stroke: "#666" }, g);
    L.svg("path", { d: "M512 386 C530 386 528 455 548 470", fill: "none", stroke: "#222", "stroke-width": 2.5 }, g);
    return L.svg("circle", { cx: 506, cy: 375, r: 2.5, fill: "#5a1d1d" }, g);
  }

  function video(id, bille) {
    // Vidéo filmée : 25 images/s depuis le lâcher ; image k : fond, potence, règle, bille à sa position.
    const n = Math.floor(Math.sqrt((2 * (Y0 - YB)) / G) * FPS) + 1, y = (k) => Y0 - 0.5 * G * (k / FPS) ** 2;
    return { id, fps: FPS, n, largeur_m: 0.9, hauteur_m: 1.2, etalon: { a: { x: 0.62, y: 1.1 }, b: { x: 0.62, y: 0.1 }, longueur_m: 1 }, objet: (k) => ({ x: 0.45, y: y(k) }),
      dessiner(gv, k, m) {
        const r = (a, b, c, d, fill) => { const p = m(a, b), q = m(c, d); L.svg("rect", { x: p.x, y: q.y, width: q.x - p.x, height: p.y - q.y, fill }, gv); };
        r(0, 0, 0.9, 1.2, "#3a3f44"); r(0.13, 0, 0.17, 1.15, "#8d949a"); r(0.15, 1.13, 0.47, 1.15, "#8d949a"); r(0.42, 1.1, 0.48, 1.16, "#b8562b");
        r(0.58, 0.08, 0.66, 1.12, "#efe3c4"); r(0.33, 0, 0.57, 0.08, "#8a6a40");
        for (let cm = 0; cm <= 100; cm += 5) { const p = m(0.58, 1.1 - cm / 100); L.svg("line", { x1: p.x, y1: p.y, x2: p.x + (cm % 10 ? 3 : 6), y2: p.y, stroke: "#222", "stroke-width": 0.6 }, gv); if (cm % 50 === 0) L.texte(gv, p.x + 9, p.y + 2, String(cm), { "font-size": 5, fill: "#222" }); }
        const b = m(0.45, y(k)); L.svg("circle", { cx: b.x, cy: b.y, r: 2.6, fill: bille.id === "acier" ? "#c9d0d5" : "#bfe8de", stroke: "#111", "stroke-width": 0.5 }, gv);
      } };
  }

  L.poste_chute = function (g) {
    // Matériel, choix de la bille, lâcher : la bille tombe sur la paillasse, la caméra filme, la vidéo va au logiciel.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230);
    potence(g); const voyant = camera(g), logiciel = L.pointage_video(g, { nom: "pointage", x: 540, y: 180 });
    const vue = L.svg("g", {}, g), chutes = [];
    let bille = BILLES[0], t = null, numero = 0;
    const dessiner = () => { vue.replaceChildren(); const yb = t === null ? Y0 : Math.max(YB, Y0 - 0.5 * G * t * t); L.svg("circle", { cx: XC, cy: ecran_y(yb), r: 8, fill: bille.teinte, stroke: "#222", "stroke-width": 0.6 }, vue); };
    L.svg("rect", { x: 110, y: 418, width: 130, height: 82, rx: 4, fill: "url(#facade)", stroke: "#4a5254" }, g);
    L.texte(g, 160, 432, "ÉLECTROAIMANT", { "font-size": 7, "font-weight": 700, fill: "#23315a" });
    L.svg("circle", { cx: 222, cy: 430, r: 4, fill: "#222", stroke: "#888" }, g);
    L.bouton_poussoir(g, 175, 474, { textes: ["Lâcher", "Raccrocher"], sur_changement: (oui) => {
      if (!oui) { t = null; dessiner(); return; }
      t = 0; voyant.setAttribute("fill", "#ff3b30");
      const avant = performance.now(), pas = () => { t = (performance.now() - avant) / 1000; dessiner(); if (Y0 - 0.5 * G * t * t > YB) return requestAnimationFrame(pas); voyant.setAttribute("fill", "#5a1d1d"); const id = `chute${++numero}`; chutes.push({ id, bille: bille.id, masse_g: bille.masse_g }); L.missions.noter("chutes", chutes.slice()); logiciel.charger(video(id, bille)); };
      requestAnimationFrame(pas);
    } });
    L.svg("ellipse", { cx: 280, cy: 548, rx: 46, ry: 10, fill: "#cfd3d6", stroke: "#8a9096" }, g);
    BILLES.forEach((b, i) => {
      const el = L.svg("g", { role: "button", "aria-label": b.nom, class: `bille-${b.id}` }, g);
      L.svg("circle", { cx: 262 + i * 36, cy: 545, r: 8, fill: b.teinte, stroke: "#222", "stroke-width": 0.6 }, el);
      L.texte(el, 262 + i * 36, 568, `${b.id === "acier" ? "acier" : "verre"} ${b.masse_g} g`, { "font-size": 6.5, fill: "#f4f1e6" });
      L.glissable(el, { soulever: false, debut: () => ({ x: 0, y: 0 }), toucher: () => { if (t !== null) return; bille = b; L.missions.noter("bille", b.id); dessiner(); } });
    });
    L.missions.noter("bille", bille.id);
    dessiner();
    return { pense_bete };
  };
})(window.Labo);
