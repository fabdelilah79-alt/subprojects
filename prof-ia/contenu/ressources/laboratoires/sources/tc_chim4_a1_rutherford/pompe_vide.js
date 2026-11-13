/*
Rôle : petite pompe à vide à palettes (moteur, carter d'huile, interrupteur Marche/Arrêt), tuyau à vide épais relié à
       l'embout du couvercle de la chambre, et manomètre numérique (pression dans la chambre, en hPa). Pompe en marche, la
       pression baisse jusqu'à environ 1 hPa ; arrêtée, la chambre étanche garde son vide (une fuite très lente).
Reçoit : le contexte de la paillasse et { x (milieu de la pompe), sol, embout { x, y } (embout du couvercle), manometre { x, y }
         (sur le couvercle), changer(p) }.
Produit : Labo.pompe_vide(ctx, reglage) -> { p (hPa), marche }.
Utilisé par : poste_rutherford.js.
*/
(function (L) {
  function pompe(g, x, sol) {
    // Moteur bleu (cylindre couché) à ailettes, corps de pompe et carter d'huile avec son voyant, pieds en caoutchouc.
    L.svg("ellipse", { cx: x + 6, cy: sol, rx: 96, ry: 6, fill: "#000", opacity: 0.28, filter: "url(#flou)" }, g);
    for (const dx of [-70, 66]) L.svg("rect", { x: x + dx - 8, y: sol - 8, width: 16, height: 8, rx: 2, fill: "#222" }, g);
    L.svg("rect", { x: x - 90, y: sol - 80, width: 96, height: 72, rx: 30, fill: "#2f5fa0", stroke: "#1f3f6d" }, g);
    for (let i = 0; i < 6; i++) L.svg("line", { x1: x - 80 + i * 14, y1: sol - 74, x2: x - 80 + i * 14, y2: sol - 14, stroke: "#244c82", "stroke-width": 3 }, g);
    L.svg("rect", { x: x + 4, y: sol - 72, width: 82, height: 64, rx: 6, fill: "url(#metal)", stroke: "#6d767c" }, g);
    L.svg("rect", { x: x + 18, y: sol - 46, width: 22, height: 14, rx: 3, fill: "#c9a22a", stroke: "#6d5a1a", opacity: 0.85 }, g);
    L.svg("rect", { x: x + 58, y: sol - 96, width: 14, height: 26, fill: "url(#metal)", stroke: "#5d646a" }, g);
    L.texte(g, x - 42, sol - 44, "POMPE À VIDE", { "font-size": 7, "font-weight": 700, fill: "#fff" });
  }

  function tuyau(g, de, vers) {
    // Tuyau à vide en caoutchouc noir, épais, qui s'enfile sur les deux embouts.
    const st = { stroke: "#202326", "stroke-width": 11, fill: "none", "stroke-linecap": "butt" };
    L.svg("path", { d: `M${de.x} ${de.y} V${de.y - 30} C${de.x} ${de.y - 120} ${vers.x} ${vers.y - 130} ${vers.x} ${vers.y - 20} V${vers.y + 6}`, ...st }, g);
    L.svg("path", { d: `M${de.x - 3} ${de.y - 30} V${de.y}`, stroke: "#4a4f54", "stroke-width": 1.5 }, g);
  }

  function manometre(g, x, y) {
    // Boîtier du manomètre numérique, monté sur une croix du tuyau (le texte de la pression est redessiné à part).
    L.svg("rect", { x: x - 44, y: y - 24, width: 88, height: 48, rx: 5, fill: "#e8eaeb", stroke: "#8f989e" }, g);
    L.svg("rect", { x: x - 36, y: y - 18, width: 72, height: 22, rx: 2, fill: "#1d2a22" }, g);
    L.texte(g, x, y + 15, "MANOMÈTRE (hPa)", { "font-size": 6.2, "font-weight": 700, fill: "#3d464c" });
  }

  L.pompe_vide = function (ctx, { x, sol, embout, manometre: M, changer = () => {} }) {
    // Dessine pompe, tuyau et manomètre ; l'interrupteur met la pompe en marche ; la pression évolue toutes les 0,1 s.
    const s = { p: 1013, marche: false };
    tuyau(ctx.devant, { x: x + 65, y: sol - 96 }, embout);
    L.svg("rect", { x: M.x - 5, y: M.y + 24, width: 10, height: 30, fill: "url(#metal)", stroke: "#5d646a" }, ctx.devant);
    manometre(ctx.devant, M.x, M.y);
    pompe(ctx.objets, x, sol);
    const ecran = L.svg("g", { "pointer-events": "none" }, ctx.devant), voyant = L.svg("circle", { cx: x + 70, cy: sol - 22, r: 3, fill: "#5b2420" }, ctx.objets);
    const dessiner = () => {
      ecran.replaceChildren();
      L.texte(ecran, M.x + 32, M.y - 4, s.p >= 10 ? String(Math.round(s.p)) : s.p.toFixed(1).replace(".", ","), { "font-size": 15, "font-family": "monospace", "text-anchor": "end", fill: "#7dff9a" });
      voyant.setAttribute("fill", s.marche ? "#ff3b2f" : "#5b2420");
    };
    L.bouton_rond(ctx.haut, x + 50, sol - 22, "I/O", () => { s.marche = !s.marche; dessiner(); changer(s.p); }, 9);
    setInterval(() => {
      const avant = s.p;
      s.p = s.marche ? Math.max(0.8, s.p * Math.exp(-0.1 / 0.6)) : Math.min(1013, s.p + 0.002);
      if (Math.abs(s.p - avant) > 1e-3) { dessiner(); changer(s.p); }
    }, 100);
    dessiner();
    return s;
  };
})(window.Labo);
