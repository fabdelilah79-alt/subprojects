/*
Rôle : tableau magnétique « représentation de Lewis » : des aimants d'atomes (H blanc, C noir, N bleu, O rouge, Cl vert,
       couleurs des modèles moléculaires) et des aimants « doublet » (un trait). On touche un aimant de la réserve pour le
       choisir, puis un point du quadrillage pour y poser l'atome (ou on le fait glisser) ; un toucher entre deux atomes
       voisins ajoute un doublet liant (simple, double, triple, puis rien) ; un toucher à côté d'un atome, là où il n'y a
       pas de liaison, pose ou ôte un doublet non liant. Un atome glissé hors du quadrillage retourne dans la réserve.
Reçoit : le groupe SVG de la paillasse et le nom du fait à noter.
Produit : Labo.tableau_lewis(g, fait) -> { etat, vider() } ; fait « <fait> » = bilan de Labo.LEWIS.analyser (lewis_regles.js).
Utilisé par : les simulations de chimie (molécules) ; dessin : lewis_dessin.js.
*/
(function (L) {
  const G = { x: 372, y: 100, pas: 56, nx: 8, ny: 5 }, ELEMENTS = ["H", "C", "N", "O", "Cl"];
  const COTES = { h: [0, -1], b: [0, 1], g: [-1, 0], d: [1, 0] };
  const noeud = (i, j) => ({ x: G.x + i * G.pas, y: G.y + j * G.pas });
  const cle_l = (a, b) => [a, b].sort().join("|");

  function lieu(p) {
    // Ce que désigne un point du tableau : un nœud, le milieu entre deux nœuds voisins, ou un côté d'un nœud.
    const fi = (p.x - G.x) / G.pas, fj = (p.y - G.y) / G.pas, i = Math.round(fi), j = Math.round(fj);
    if (i < 0 || j < 0 || i >= G.nx || j >= G.ny || Math.abs(fi - i) > 0.62 || Math.abs(fj - j) > 0.62) return null;
    const dx = fi - i, dy = fj - j, d = Math.hypot(dx, dy);
    if (d < 0.2) return { type: "noeud", cle: `${i},${j}` };
    const cote = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "d" : "g") : dy > 0 ? "b" : "h", [u, v] = COTES[cote];
    if (d > 0.38) return { type: "milieu", a: `${i},${j}`, b: `${i + u},${j + v}` };
    return { type: "cote", cle: `${i},${j}`, cote, voisin: `${i + u},${j + v}` };
  }

  L.tableau_lewis = function (g, fait) {
    // Construit le tableau ; chaque geste change l'état, puis on redessine et on note le bilan.
    const etat = { atomes: {}, liaisons: {}, paires: {} }, s = { choisi: null };
    const fond = L.svg("g", {}, g);
    L.cadre_lewis(fond, G);
    const zone = L.svg("rect", { x: G.x - 34, y: G.y - 34, width: G.pas * (G.nx - 1) + 68, height: G.pas * (G.ny - 1) + 68, fill: "#000", opacity: 0, class: "quadrillage" }, g);
    const dessin = L.svg("g", {}, g), bulle = L.svg("g", { "pointer-events": "none" }, g);
    const dire = (t) => { bulle.replaceChildren(); if (t) { L.svg("rect", { x: 380, y: 50, width: 400, height: 20, rx: 4, fill: "#fff6e0", stroke: "#d08a1a" }, bulle); L.texte(bulle, 580, 60, t, { "font-size": 8, "font-weight": 700, fill: "#6b3d00" }); } };
    const maj = () => { L.dessin_lewis(dessin, etat, noeud, deplacer_atome); L.missions.noter(fait, L.LEWIS.analyser(etat)); };
    const oter = (cle) => { delete etat.atomes[cle]; for (const k of Object.keys(etat.liaisons)) if (k.split("|").includes(cle)) delete etat.liaisons[k]; for (const k of Object.keys(etat.paires)) if (k.startsWith(cle + "|")) delete etat.paires[k]; };
    const poser = (el, q) => { const l = lieu(q); if (l?.type === "noeud" && !etat.atomes[l.cle]) etat.atomes[l.cle] = el; else if (l?.type === "noeud") dire("Ce point est déjà occupé par un atome."); };
    function toucher(q) {
      // Toucher le tableau : poser l'atome choisi, changer une liaison, poser ou ôter un doublet non liant.
      const l = lieu(q); dire("");
      if (!l) return;
      if (l.type === "noeud" && !etat.atomes[l.cle]) return s.choisi ? poser(s.choisi, q) : dire("Touchez d'abord un aimant de la réserve (H, C, N, O ou Cl).");
      if (l.type === "milieu" && etat.atomes[l.a] && etat.atomes[l.b]) { const k = cle_l(l.a, l.b); etat.liaisons[k] = ((etat.liaisons[k] || 0) + 1) % 4; if (!etat.liaisons[k]) delete etat.liaisons[k]; return; }
      if (l.type === "cote" && etat.atomes[l.cle]) {
        if (etat.liaisons[cle_l(l.cle, l.voisin)]) return dire("Ce côté porte déjà une liaison.");
        const k = `${l.cle}|${l.cote}`; if (etat.paires[k]) delete etat.paires[k]; else etat.paires[k] = true;
      }
    }
    let dernier = null;
    zone.addEventListener("pointerdown", (e) => { dernier = L.scene.vers_scene(e); });
    L.glissable(zone, { soulever: false, debut: () => ({ x: 0, y: 0 }), toucher: () => { if (dernier) toucher(dernier); maj(); } });
    function deplacer_atome(el_svg, cle) {
      // Un atome posé se fait glisser vers un autre point libre, ou hors du quadrillage (il est retiré) ; un toucher agit comme sur le tableau.
      const depart = noeud(...cle.split(",").map(Number));
      L.glissable(el_svg, { debut: () => ({ ...depart }), deplacer: (q) => L.placer(el_svg, q.x, q.y), toucher: () => { toucher(depart); maj(); },
        lacher: (q) => { const el = etat.atomes[cle], l = lieu(q); oter(cle); if (l?.type === "noeud" && !etat.atomes[l.cle]) etat.atomes[l.cle] = el; maj(); } });
    }
    L.reserve_lewis(g, ELEMENTS, s, (el, q) => { poser(el, q); maj(); }, dire);
    L.bouton_texte(g, 754, 381, "Tout ranger", () => { etat.atomes = {}; etat.liaisons = {}; etat.paires = {}; dire(""); maj(); });
    g.append(bulle);
    maj();
    return { etat, vider: () => { etat.atomes = {}; etat.liaisons = {}; etat.paires = {}; maj(); } };
  };
  L.LEWIS_GRILLE = G;
})(window.Labo);
