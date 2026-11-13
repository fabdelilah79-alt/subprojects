/*
Rôle : dessin d'un modèle moléculaire vu sous un angle choisi : boules en plastique brillant aux couleurs conventionnelles
       (C noir, H blanc, O rouge, N bleu, Cl vert), bâtonnets gris (liaison simple) ou deux ressorts souples (liaison
       double), trous libres marqués d'un point sombre. Les objets les plus proches de l'œil sont dessinés en dernier ;
       une légère perspective agrandit ce qui est devant.
Reçoit : le groupe SVG, les atomes placés (molecule_3d.js), la vue { lacet, tangage (radians), cx, cy, echelle }.
Produit : Labo.vue_3d(vue) -> fonction p -> { x, y, z, k } ; Labo.dessiner_modele(g, atomes, vue) -> atomes projetés
          [{ x, y, z, r }] et liaisons projetées [{ a, b, x, y }] (pour savoir ce que l'on touche).
Utilisé par : boite_modeles.js.
*/
(function (L) {
  const V = L.V3, COULEURS = { H: ["#ffffff", "#c8c8c4"], C: ["#5a5a5a", "#111"], N: ["#7aa6ff", "#1d3f9a"], O: ["#ff7a70", "#a01a14"], Cl: ["#7fe08a", "#1d7a2a"] };

  function degrades() {
    // Dégradés radiaux des boules (reflet en haut à gauche), créés une seule fois.
    const defs = document.querySelector("svg defs");
    if (!defs || document.getElementById("boule-C")) return;
    for (const [el, [clair, fonce]] of Object.entries(COULEURS)) {
      const r = L.svg("radialGradient", { id: `boule-${el}`, cx: 0.35, cy: 0.32, r: 0.75 }, defs);
      [[0, "#ffffff"], [0.18, clair], [1, fonce]].forEach(([o, c]) => L.svg("stop", { offset: o, "stop-color": c }, r));
    }
  }

  L.vue_3d = function ({ lacet, tangage, cx, cy, echelle = 1 }) {
    // Rotation (lacet autour de la verticale, puis tangage), échelle du modèle et perspective douce (œil à 900 px).
    const cl = Math.cos(lacet), sl = Math.sin(lacet), ct = Math.cos(tangage), st = Math.sin(tangage);
    return ([x, y, z]) => {
      const x1 = cl * x + sl * z, z1 = -sl * x + cl * z, y2 = ct * y - st * z1, z2 = st * y + ct * z1, k = (echelle * 900) / (900 - z2 * echelle);
      return { x: cx + x1 * k, y: cy + y2 * k, z: z2 * echelle, k };
    };
  };

  function baton(g, P0, Q0, ordre) {
    // Bâtonnet gris (liaison simple), deux ou trois ressorts plus fins (liaison double ou triple), qui sortent de la surface de chaque boule.
    const L3 = Math.hypot(Q0.x - P0.x, Q0.y - P0.y, Q0.z - P0.z) || 1, f = (k) => ({ x: P0.x + (Q0.x - P0.x) * k, y: P0.y + (Q0.y - P0.y) * k });
    const p = f(P0.r / L3), q = f(1 - Q0.r / L3);
    const d = Math.hypot(q.x - p.x, q.y - p.y) || 1, n = { x: -(q.y - p.y) / d, y: (q.x - p.x) / d };
    const decal = ordre === 3 ? [-6, 0, 6] : ordre === 2 ? [-4.5, 4.5] : [0], ressort = ordre > 1;
    for (const o of decal) {
      const a = { x: p.x + n.x * o, y: p.y + n.y * o }, b = { x: q.x + n.x * o, y: q.y + n.y * o };
      L.svg("line", { x1: a.x, y1: a.y, x2: b.x, y2: b.y, stroke: "#6f757a", "stroke-width": ressort ? (ordre === 3 ? 4 : 5) : 8, "stroke-linecap": "round" }, g);
      L.svg("line", { x1: a.x, y1: a.y, x2: b.x, y2: b.y, stroke: ressort ? "#e9edf0" : "#d9dde0", "stroke-width": ressort ? 2 : 4.5, "stroke-linecap": "round", "stroke-dasharray": ressort ? "3 2" : "none" }, g);
    }
  }

  L.dessiner_modele = function (g, atomes, vue) {
    // Projette, trie par profondeur, dessine ; renvoie ce qu'il faut pour toucher un atome ou une liaison.
    degrades(); g.replaceChildren();
    const proj = L.vue_3d(vue), P = atomes.map((a) => ({ ...proj(a.pos), r: L.MOLECULE_3D.R[a.el] }));
    const objets = [];
    atomes.forEach((a, i) => {
      P[i].r *= P[i].k;
      objets.push({ z: P[i].z, f: () => {
        L.svg("circle", { cx: P[i].x, cy: P[i].y, r: P[i].r, fill: `url(#boule-${a.el})`, stroke: "#222", "stroke-width": 0.6 }, g);
        for (const d of a.dirs) { const t = proj(V.add(a.pos, V.mul(d, L.MOLECULE_3D.R[a.el] * 0.86))); if (t.z > P[i].z - 2) L.svg("circle", { cx: t.x, cy: t.y, r: 2.6, fill: "#111", opacity: 0.8 }, g); }
      } });
      if (a.parent !== null) objets.push({ z: (P[i].z + P[a.parent].z) / 2 - 1, f: () => baton(g, P[a.parent], P[i], a.ordre) });
    });
    objets.sort((u, w) => u.z - w.z).forEach((o) => o.f());
    const liaisons = atomes.map((a, i) => (a.parent === null ? null : { enfant: i, x: (P[i].x + P[a.parent].x) / 2, y: (P[i].y + P[a.parent].y) / 2 })).filter(Boolean);
    return { P, liaisons, proj };
  };
})(window.Labo);
