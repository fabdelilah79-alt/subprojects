/*
Rôle : atelier où l'on assemble un modèle moléculaire posé sur son support : le premier atome se met au centre, chaque
       atome suivant s'enfonce dans le trou libre le plus proche de l'endroit où on le lâche ; glisser à côté du modèle le
       fait tourner ; toucher une liaison la fait passer de simple à double (deux ressorts) et inversement ; un atome tiré
       hors de l'atelier est démonté (avec ceux qui lui sont accrochés).
Reçoit : le contexte de la paillasse, { cx, cy (centre du modèle), r (rayon de l'atelier), fait, dire(texte) }.
Produit : Labo.atelier_modele(ctx, reglage) -> { atomes, accrocher(el, point) -> vrai si accroché, vider(), bilan() } ;
          fait « <fait> » = bilan : { brute, n, complet, central, voisins, angle_min, angle_max, plan, lineaire, vue { plan, avant, arriere } }.
Utilisé par : boite_modeles.js.
*/
(function (L) {
  const V = L.V3, M = L.MOLECULE_3D;

  function bilan(placees, P, e) {
    // Ce que l'on peut observer du modèle : formule brute, trous libres, géométrie autour de l'atome central, vue de face.
    const n = {}; placees.forEach((a) => { n[a.el] = (n[a.el] || 0) + 1; });
    const brute = Object.keys(n).sort((x, y) => (x === "C" ? -1 : y === "C" ? 1 : x === "H" ? -1 : y === "H" ? 1 : x.localeCompare(y))).map((e) => e + (n[e] > 1 ? n[e] : "")).join("");
    const voisins = (i) => placees.map((a, k) => (a.parent === i || placees[i].parent === k ? k : -1)).filter((k) => k >= 0);
    const c = placees.reduce((b, a, i) => (voisins(i).length > voisins(b).length ? i : b), 0), vs = placees.length ? voisins(c) : [];
    const angles = [];
    for (let x = 0; x < vs.length; x++) for (let y = x + 1; y < vs.length; y++) angles.push(V.angle(V.sub(placees[vs[x]].pos, placees[c].pos), V.sub(placees[vs[y]].pos, placees[c].pos)));
    const vue = { plan: 0, avant: 0, arriere: 0 };
    for (const k of vs) { const dz = (P[k].z - P[c].z) / (e * Math.max(1, Math.hypot(...V.sub(placees[k].pos, placees[c].pos)))); vue[dz > 0.3 ? "avant" : dz < -0.3 ? "arriere" : "plan"]++; }
    const pts = placees.map((a) => a.pos), nrm = pts.length > 2 ? V.cross(V.sub(pts[1], pts[0]), V.sub(pts[2], pts[0])) : [0, 0, 0];
    const plan = pts.length > 3 && Math.hypot(...nrm) > 1 && pts.every((p) => Math.abs(V.dot(V.norm(nrm), V.sub(p, pts[0]))) < 1);
    const r1 = (v) => Math.round(v * 10) / 10;
    return { brute, n: placees.length, complet: placees.length > 0 && placees.every((a) => !a.dirs.length), central: placees[c]?.el || "", voisins: vs.length,
      angle_min: angles.length ? r1(Math.min(...angles)) : 0, angle_max: angles.length ? r1(Math.max(...angles)) : 0, plan, lineaire: angles.length === 1 && angles[0] > 179, vue };
  }

  L.atelier_modele = function (ctx, { cx, cy, r, fait, dire = () => {} }) {
    // Support, zone de l'atelier, dessin du modèle ; chaque changement redessine et note le bilan.
    const a = { atomes: [] }, vue = { lacet: 1.5, tangage: -0.3, cx, cy, echelle: 1.8 };
    L.svg("ellipse", { cx, cy: 562, rx: 44, ry: 9, fill: "#3a3f44" }, ctx.fond);
    L.svg("rect", { x: cx - 2.5, y: cy, width: 5, height: 562 - cy, fill: "rgba(220,235,240,0.55)", stroke: "rgba(140,160,170,0.8)", "stroke-width": 0.5 }, ctx.fond);
    const zone = L.svg("circle", { cx, cy, r, fill: "#000", opacity: 0, class: "atelier" }, ctx.objets), g = L.svg("g", { "pointer-events": "none" }, ctx.objets);
    let placees = [], res = null, depart = null, prise = null;
    const maj = () => { placees = M.placer(a.atomes); res = L.dessiner_modele(g, placees, vue); L.missions.noter(fait, bilan(placees, res.P, vue.echelle)); };
    const sous = (p) => res.P.map((q, i) => ({ i, d: Math.hypot(q.x - p.x, q.y - p.y), q })).filter((o) => o.d < o.q.r).sort((u, w) => w.q.z - u.q.z)[0];
    const demonter = (i) => {
      // Retire l'atome i et tout ce qui lui est accroché ; renumérote les parents.
      const ote = new Set([i]); let change = true;
      while (change) { change = false; a.atomes.forEach((x, k) => { if (x.parent !== null && ote.has(x.parent) && !ote.has(k)) { ote.add(k); change = true; } }); }
      const nouveau = []; a.atomes.forEach((x, k) => { if (!ote.has(k)) nouveau[k] = nouveau.filter((v) => v !== undefined).length; });
      a.atomes = a.atomes.filter((x, k) => !ote.has(k)).map((x) => ({ ...x, parent: x.parent === null ? null : nouveau[x.parent] }));
    };
    zone.addEventListener("pointerdown", (e) => { depart = L.scene.vers_scene(e); });
    L.glissable(zone, {
      soulever: false, debut: () => ({ x: 0, y: 0 }),
      saisir: () => { const s = depart && sous(depart); prise = s ? s.i : null; prise ?? (prise = { lacet: vue.lacet, tangage: vue.tangage }); },
      deplacer: (d) => { if (typeof prise === "object") { vue.lacet = prise.lacet + d.x * 0.012; vue.tangage = Math.max(-1.5, Math.min(1.5, prise.tangage + d.y * 0.012)); maj(); } },
      lacher: (d) => { if (typeof prise === "number" && Math.hypot(depart.x + d.x - cx, depart.y + d.y - cy) > r) { demonter(prise); dire(""); maj(); } },
      toucher: () => {
        const l = depart && res.liaisons.map((o) => ({ ...o, d: Math.hypot(o.x - depart.x, o.y - depart.y) })).sort((u, w) => u.d - w.d)[0];
        if (!l || l.d > 12) return;
        const c = a.atomes[l.enfant], pa = placees[c.parent], en = placees[l.enfant];
        if (c.ordre === 2) c.ordre = 1; else if (pa.dirs.length && en.dirs.length) c.ordre = 2; else return dire("Pour une liaison double, il faut un trou libre sur chacun des deux atomes.");
        dire(""); maj();
      },
    });
    a.accrocher = (el, p) => {
      // Premier atome : au centre ; ensuite : dans le trou libre (point noir) le plus proche du point où on lâche la boule.
      if (!a.atomes.length) { if (Math.hypot(p.x - cx, p.y - cy) > r) return false; a.atomes.push({ el, parent: null, ordre: 1 }); maj(); return true; }
      let best = null;
      placees.forEach((x, i) => x.dirs.forEach((dir, k) => { const t = res.proj(V.add(x.pos, V.mul(dir, M.R[x.el] + 8))), d = Math.hypot(t.x - p.x, t.y - p.y); if (d < 40 && (!best || d < best.d)) best = { i, trou: x.libres[k], d }; }));
      if (!best) { dire("Lâchez la boule tout près d'un trou libre (point noir) d'un atome du modèle."); return false; }
      a.atomes.push({ el, parent: best.i, ordre: 1, trou: best.trou }); dire(""); maj(); return true;
    };
    a.vider = () => { a.atomes = []; maj(); };
    maj();
    return a;
  };
})(window.Labo);
