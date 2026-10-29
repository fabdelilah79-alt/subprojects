/*
Rôle : ordinateur portable et logiciel de pointage vidéo (comme Aviméca) : la caméra a filmé l'expérience ; on avance
       image par image (◀ ▶), on étalonne l'échelle en cliquant les deux repères de l'étalon filmé (règle de longueur
       connue), on place l'origine, puis on pointe l'objet sur chaque image (le logiciel passe seul à l'image suivante).
       Les coordonnées viennent des clics de l'élève : x vers la droite, y vers le haut, en mètres. « Exporter » copie
       t, x, y dans le tableur de la tablette (colonnes A, B, C).
Reçoit : le groupe SVG et { nom (fait), x, y (coin du portable) } ; puis, à chaque vidéo filmée, charger(video) avec
         video = { id, fps, n (images), largeur_m, hauteur_m (champ filmé), dessiner(g, k, m) (fond et objet de
         l'image k ; m(xm, ym) -> point de l'écran), etalon { a, b (m), longueur_m }, objet(k) (position vraie, pour les tests) }.
Produit : Labo.pointage_video(g, reglages) -> { charger(video), m(xm, ym), video } ; Labo.pointages[nom] (pour les tests) ;
          fait « <nom> » = { video, echelle (px/m de l'élève), echelle_ok, origine, points [{ k, t, x, y }] }.
Utilisé par : les simulations du chapitre « Applications des lois de Newton ».
*/
(function (L) {
  const V = { x: 16, y: 40, l: 262, h: 200 }, OUTILS = ["◀", "▶", "Échelle", "Origine", "Pointer", "Exporter"];
  const fr = (v, n = 3) => v.toFixed(n).replace(".", ",").replace("-", "−");
  L.pointages = {};

  function portable(g, x, y) {
    // Écran, charnière et clavier en perspective, posés sur la paillasse, avec leur ombre.
    L.ombre_sol(g, x + 220, y + 318, 240, 10, 0.4);
    L.svg("path", { d: `M${x - 10} ${y + 270} h460 l30 44 h-520 Z`, fill: "#b9bec3", stroke: "#6c737a" }, g);
    for (let r = 0; r < 4; r++) L.svg("rect", { x: x + 10 - r * 6, y: y + 276 + r * 9, width: 420 + r * 12, height: 6, rx: 1, fill: "#40464c", opacity: 0.7 }, g);
    L.svg("rect", { x, y, width: 440, height: 268, rx: 8, fill: "#1b1e21", stroke: "#000" }, g);
    L.svg("rect", { x: x + 10, y: y + 10, width: 420, height: 246, fill: "#f4f5f2" }, g);
    L.texte(g, x + 220, y + 8, "Pointage vidéo", { "font-size": 6.5, fill: "#9aa0a6" });
  }

  function image(s, cadre) {
    // Image courante de la vidéo (ou écran noir), repères de l'élève, points déjà pointés, compteur.
    cadre.replaceChildren();
    L.svg("rect", { x: s.x + V.x, y: s.y + V.y, width: V.l, height: V.h, fill: "#0e1114" }, cadre);
    if (!s.video) return L.texte(cadre, s.x + V.x + V.l / 2, s.y + V.y + V.h / 2, "Aucune vidéo : filmez l'expérience.", { "font-size": 8, fill: "#cfd3d6" });
    s.video.dessiner(cadre, s.k, s.m);
    for (const p of Object.values(s.points)) L.svg("path", { d: `M${p.px - 4} ${p.py} h8 M${p.px} ${p.py - 4} v8`, stroke: "#ff3b30", "stroke-width": 1.2 }, cadre);
    for (const q of s.clics) L.svg("circle", { cx: q.x, cy: q.y, r: 3, fill: "none", stroke: "#2196f3", "stroke-width": 1.4 }, cadre);
    if (s.origine) L.svg("path", { d: `M${s.origine.x - 8} ${s.origine.y} h16 M${s.origine.x} ${s.origine.y - 8} v16`, stroke: "#ffd54f", "stroke-width": 1.2 }, cadre);
    L.texte(cadre, s.x + V.x + 6, s.y + V.y + 10, `image ${s.k} / ${s.video.n - 1}   t = ${fr(s.k / s.video.fps)} s`, { "font-size": 7, fill: "#ffffff", "text-anchor": "start", "font-family": "monospace" });
  }

  function tableau(s, g) {
    // Panneau de droite : mode, échelle, origine, tableau des points pointés (les dix derniers).
    g.replaceChildren();
    const X = s.x + 288, lignes = [`Mode : ${s.mode || "—"}`, `Échelle : ${s.echelle ? `${fr(s.echelle, 1)} px/m` : "à faire"}`, `Origine : ${s.origine ? "placée" : "à placer"}`, "k    t (s)    x (m)    y (m)"];
    const pts = Object.values(s.points).sort((a, b) => a.k - b.k);
    pts.slice(-10).forEach((p) => lignes.push(`${String(p.k).padEnd(3)} ${fr(p.t)}  ${fr(p.x)}  ${fr(p.y)}`));
    lignes.forEach((t, i) => L.texte(g, X, s.y + 48 + i * 11, t, { "font-size": i < 3 ? 7 : 6.5, fill: i === 3 ? "#23315a" : "#333", "text-anchor": "start", "font-family": i > 2 ? "monospace" : "inherit", "font-weight": i === 3 ? 700 : 400 }));
  }

  function noter(s) {
    // Fait du pointage (coordonnées arrondies au millimètre).
    const pts = Object.values(s.points).sort((a, b) => a.k - b.k).map(({ k, t, x, y }) => ({ k, t, x: Math.round(x * 1000) / 1000, y: Math.round(y * 1000) / 1000 }));
    L.missions.noter(s.nom, { video: s.video ? s.video.id : null, echelle: s.echelle, echelle_ok: !!s.echelle && Math.abs(s.echelle / s.k_ecran - 1) < 0.03, origine: !!s.origine, points: pts });
  }

  function cliquer(s, p) {
    // Un clic dans la vidéo, selon le mode : repères de l'échelle, origine, ou point de l'image courante.
    if (!s.video) return;
    if (s.mode === "Échelle") { s.clics.push(p); if (s.clics.length === 2) { s.echelle = Math.hypot(s.clics[0].x - s.clics[1].x, s.clics[0].y - s.clics[1].y) / s.video.etalon.longueur_m; s.clics = []; s.mode = null; } }
    else if (s.mode === "Origine") { s.origine = p; s.mode = "Pointer"; }
    else if (s.mode === "Pointer" && s.echelle && s.origine) {
      s.points[s.k] = { k: s.k, t: s.k / s.video.fps, x: (p.x - s.origine.x) / s.echelle, y: (s.origine.y - p.y) / s.echelle, px: p.x, py: p.y };
      s.k = Math.min(s.video.n - 1, s.k + 1);
    }
  }

  function exporter(s) {
    // Copie t, x, y des points (onze au plus) dans les colonnes A, B, C du tableur de la mission affichée.
    const f = L.tablette.feuille(), pts = Object.values(s.points).sort((a, b) => a.k - b.k).slice(0, 11), v = (x) => String(Math.round(x * 1000) / 1000).replace(".", ",");
    Object.assign(f.brut, { A1: "t (s)", B1: "x (m)", C1: "y (m)" });
    pts.forEach((p, i) => Object.assign(f.brut, { [`A${i + 2}`]: v(p.t), [`B${i + 2}`]: v(p.x), [`C${i + 2}`]: v(p.y) }));
    f.afficher(); L.annoncer("tableur", { feuille: f });
  }

  L.pointage_video = function (g, { nom = "pointage", x, y }) {
    // Portable, logiciel (touches, vidéo, tableau) ; renvoie de quoi charger chaque nouvelle vidéo.
    const s = { nom, x, y, video: null, k: 0, mode: null, echelle: null, origine: null, points: {}, clics: [], k_ecran: 1 };
    portable(g, x, y);
    const cadre = L.svg("g", {}, g), panneau = L.svg("g", {}, g), maj = () => { image(s, cadre); tableau(s, panneau); noter(s); };
    s.m = (xm, ym) => ({ x: s.x + V.x + (V.l - s.video.largeur_m * s.k_ecran) / 2 + xm * s.k_ecran, y: s.y + V.y + V.h - (V.h - s.video.hauteur_m * s.k_ecran) / 2 - ym * s.k_ecran });
    OUTILS.forEach((t, i) => {
      const b = L.svg("g", { role: "button", "aria-label": t, class: `pointage-${i}` }, g);
      L.svg("rect", { x: x + 16 + i * 68, y: y + 16, width: 62, height: 17, rx: 3, fill: "#e4e8ec", stroke: "#8a96a0" }, b);
      L.texte(b, x + 47 + i * 68, y + 28, t, { "font-size": 8, "font-weight": 700, fill: "#23315a" });
      L.glissable(b, { soulever: false, debut: () => ({ x: 0, y: 0 }), toucher: () => {
        if (!s.video) return;
        if (t === "◀" || t === "▶") s.k = Math.max(0, Math.min(s.video.n - 1, s.k + (t === "▶" ? 1 : -1)));
        else if (t === "Exporter") exporter(s);
        else { s.mode = t; s.clics = []; }
        maj();
      } });
    });
    const zone = L.svg("rect", { x: x + V.x, y: y + V.y, width: V.l, height: V.h, fill: "#000", opacity: 0, class: "pointage-video", role: "button", "aria-label": "Vidéo" }, g);
    let ici = null;
    L.glissable(zone, { soulever: false, debut: (e) => (ici = L.scene.vers_scene(e)), toucher: () => { cliquer(s, ici); maj(); } });
    const api = { charger: (video) => { Object.assign(s, { video, k: 0, mode: null, echelle: null, origine: null, points: {}, clics: [], k_ecran: Math.min(V.l / video.largeur_m, V.h / video.hauteur_m) }); maj(); }, m: (a, b) => s.m(a, b), etat: s };
    L.pointages[nom] = api;
    maj();
    return api;
  };
})(window.Labo);
