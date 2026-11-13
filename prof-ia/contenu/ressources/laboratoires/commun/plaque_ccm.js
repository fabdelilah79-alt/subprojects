/*
Rôle : plaque de chromatographie sur couche mince (silice, 5 cm × 10 cm, aux vraies dimensions) et ce qui s'y passe :
       ligne de dépôt au crayon, dépôts (une goutte de chaque échantillon), montée du front de l'éluant par capillarité
       (le carré de la hauteur croît proportionnellement au temps), chaque espèce migre à la distance Rf × (distance du
       front) ; un dépôt plongé dans l'éluant s'y dissout. Les espèces incolores ne se voient qu'en lumière UV (taches
       sombres sur la plaque fluorescente) ou après le diiode (taches brunes). Taches entourées et front marqués au crayon.
Reçoit : { especes : { nom : { rgb ou null (incolore), Rf } } } ; puis les gestes et le temps (minutes).
Produit : Labo.plaque_ccm(reglage) -> { etat, tracer_ligne(y), deposer(n, especes, x, y), developper(dt, h_eluant),
          marquer_front(y), entourer(x, y), taches(), dessiner(g, mode) } (mm, origine au coin bas gauche, y vers le haut).
Utilisé par : les simulations de chromatographie.
*/
(function (L) {
  const LARGEUR = 50, HAUTEUR = 100, VITESSE = 400;

  function taches(p) {
    // Position de chaque espèce de chaque dépôt : y = ligne + Rf × (front − ligne).
    const e = p.etat, out = [];
    if (e.dissous) return out;
    for (const d of e.depots) for (const nom of d.especes) {
      const s = p.especes[nom], monte = e.front && e.front > e.ligne ? s.Rf * (e.front - e.ligne) : 0;
      out.push({ n: d.n, nom, x: d.x, y: d.y + monte, r: 1.6 + Math.min(1.4, monte / 40), rgb: s.rgb });
    }
    return out;
  }

  function dessiner(p, g, mode) {
    // Plaque blanche (bord en aluminium), zone mouillée, ligne et front au crayon, taches, cercles au crayon.
    g.replaceChildren();
    const e = p.etat, H = HAUTEUR, uv = mode === "uv";
    L.svg("rect", { x: 0, y: -H, width: LARGEUR, height: H, fill: uv ? "rgb(150,236,176)" : "#f7f7f2", stroke: "#b7bcbf", "stroke-width": 0.5 }, g);
    if (e.front && e.humide > 0) L.svg("rect", { x: 0.3, y: -e.front, width: LARGEUR - 0.6, height: e.front, fill: "rgb(190,205,214)", opacity: 0.35 * e.humide }, g);
    const crayon = { stroke: "#6d6f72", "stroke-width": 0.35 };
    if (e.ligne) L.svg("line", { x1: 2, x2: LARGEUR - 2, y1: -e.ligne, y2: -e.ligne, ...crayon }, g);
    if (e.front_marque) L.svg("line", { x1: 1, x2: LARGEUR - 1, y1: -e.front_marque, y2: -e.front_marque, ...crayon }, g);
    for (const t of taches(p)) {
      const vue = t.rgb ? L.rgb(t.rgb) : uv ? "#3c2a5a" : e.iode > 0 ? "#8a4e1c" : null;
      if (vue) L.svg("ellipse", { cx: t.x, cy: -t.y, rx: t.r, ry: t.r * 0.8, fill: vue, opacity: t.rgb || uv ? 0.9 : 0.85 * e.iode }, g);
    }
    for (const c of e.cercles) L.svg("ellipse", { cx: c.x, cy: -c.y, rx: 3.6, ry: 3, fill: "none", ...crayon }, g);
  }

  L.plaque_ccm = function ({ especes }) {
    // Plaque neuve, sans ligne ni dépôt.
    const p = { especes, L: LARGEUR, H: HAUTEUR };
    p.etat = { ligne: null, depots: [], front: null, humide: 0, dissous: false, front_marque: null, cercles: [], iode: 0 };
    p.tracer_ligne = (y) => { if (!p.etat.depots.length) p.etat.ligne = y; };
    p.deposer = (n, liste, x, y) => {
      // Une goutte de l'échantillon n à l'endroit touché (une seule par échantillon : la dernière compte).
      p.etat.depots = p.etat.depots.filter((d) => d.n !== n);
      p.etat.depots.push({ n, x, y, especes: liste });
    };
    p.developper = (dt, h) => {
      // Plaque dans la cuve : l'éluant monte (h² croît comme le temps) ; s'il recouvre la ligne, les dépôts se dissolvent.
      const e = p.etat;
      if (h <= 0.5) return;
      if (e.ligne && h >= e.ligne - 0.5) e.dissous = true;
      e.front = Math.min(HAUTEUR, Math.sqrt(Math.max(h, e.front || 0) ** 2 + VITESSE * dt));
      e.humide = 1;
    };
    p.secher = (dt) => { p.etat.humide = Math.max(0, p.etat.humide - dt / 3); };
    p.marquer_front = (y) => { if (p.etat.front && Math.abs(y - p.etat.front) < 6) p.etat.front_marque = p.etat.front; };
    p.entourer = (x, y) => {
      // Cercle au crayon autour de la tache la plus proche (si on a visé une tache).
      const t = taches(p).filter((q) => Math.hypot(q.x - x, q.y - y) < 5).sort((a, b) => Math.hypot(a.x - x, a.y - y) - Math.hypot(b.x - x, b.y - y))[0];
      if (t && !p.etat.cercles.some((c) => Math.hypot(c.x - t.x, c.y - t.y) < 1)) p.etat.cercles.push({ x: t.x, y: t.y });
    };
    p.taches = () => taches(p);
    p.dessiner = (g, mode) => dessiner(p, g, mode);
    return p;
  };
})(window.Labo);
