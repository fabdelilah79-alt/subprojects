/*
Rôle : géométrie d'un modèle moléculaire (boules et bâtonnets) que l'on assemble atome par atome : autour de chaque atome,
       les doublets (liaisons, trous encore libres, doublets non liants) se repoussent et s'écartent le plus possible :
       2 directions → droite (180°), 3 → triangle plan (120°), 4 → tétraèdre (109,5°). Les doublets non liants repoussent
       un peu plus : H–N–H = 107° dans NH₃, H–O–H = 104,5° dans H₂O. Une liaison double compte pour une seule direction.
Reçoit : la liste des atomes [{ el, parent (indice ou null), ordre (1 ou 2, liaison avec le parent), trou (facultatif : numéro
         de la direction du parent où il est accroché) }].
Produit : Labo.MOLECULE_3D = { placer(atomes) -> [{ pos [x, y, z], dirs (trous libres), libres (leurs numéros), ... }], TROUS, R, longueur } ;
          Labo.V3 (petites opérations sur les vecteurs).
Utilisé par : boite_modeles.js, modele_dessin.js.
*/
(function (L) {
  const V = {
    add: (a, b) => a.map((v, i) => v + b[i]), sub: (a, b) => a.map((v, i) => v - b[i]), mul: (a, k) => a.map((v) => v * k),
    dot: (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], cross: (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]],
  };
  V.norm = (a) => V.mul(a, 1 / Math.hypot(...a));
  V.angle = (a, b) => (Math.acos(Math.max(-1, Math.min(1, V.dot(V.norm(a), V.norm(b))))) * 180) / Math.PI;
  L.V3 = V;
  const TROUS = { H: 1, C: 4, N: 3, O: 2, Cl: 1 }, NON_LIANTS = { H: 0, C: 0, N: 1, O: 2, Cl: 3 }, R = { H: 13, C: 18, N: 18, O: 18, Cl: 20 };
  const LONGUEUR = { "C-H": 52, "C-C": 74, "C=C": 64, "C=O": 56, "O-H": 46, "N-H": 48, "C-O": 69, "C-N": 70, "C-Cl": 80, "H-Cl": 61, "H-H": 36 };
  const longueur = (a, b, n) => LONGUEUR[[a, b].sort().join(n === 2 ? "=" : "-")] || 60;

  function directions(n, e3, e1) {
    // n directions qui s'écartent au mieux, la première selon e3, la référence d'azimut selon e1.
    const e2 = V.cross(e3, e1), dir = (polaire, az) => { const p = (polaire * Math.PI) / 180, a = (az * Math.PI) / 180; return V.add(V.mul(e3, Math.cos(p)), V.add(V.mul(e1, Math.sin(p) * Math.cos(a)), V.mul(e2, Math.sin(p) * Math.sin(a)))); };
    if (n <= 1) return [e3];
    if (n === 2) return [e3, V.mul(e3, -1)];
    if (n === 3) return [e3, dir(120, 0), dir(120, 180)];
    return [e3, dir(109.47, 0), dir(109.47, 120), dir(109.47, 240)];
  }

  function resserrer(liants, angle) {
    // Doublets non liants : les liaisons se resserrent autour de leur direction moyenne jusqu'à l'angle voulu (2 ou 3 liaisons).
    if (liants.length < 2 || liants.length > 3) return liants;
    const m = V.norm(liants.reduce((s, d) => V.add(s, d), [0, 0, 0]));
    const phi = liants.length === 2 ? (angle * Math.PI) / 360 : Math.acos(Math.sqrt((1 + 2 * Math.cos((angle * Math.PI) / 180)) / 3));
    return liants.map((d) => V.add(V.mul(m, Math.cos(phi)), V.mul(V.norm(V.sub(d, V.mul(m, V.dot(d, m)))), Math.sin(phi))));
  }

  function perpendiculaire(e3, v) {
    // Vecteur unitaire perpendiculaire à e3, aussi proche que possible de v.
    const p = V.sub(v, V.mul(e3, V.dot(v, e3)));
    return Math.hypot(...p) > 1e-6 ? V.norm(p) : V.norm(V.cross(e3, Math.abs(e3[0]) < 0.9 ? [1, 0, 0] : [0, 0, 1]));
  }

  function placer(atomes) {
    // Positions de tous les atomes à partir du premier (au centre), et directions de leurs trous libres.
    const res = atomes.map((a) => ({ ...a, enfants: [], pos: [0, 0, 0], dirs: [] }));
    res.forEach((a, i) => { if (a.parent !== null) res[a.parent].enfants.push(i); });
    const etape = (i, e3, ref, decalage) => {
      // Place les voisins de l'atome i ; e3 : direction vers son parent (ou le haut pour le premier atome).
      const a = res[i], utilises = a.enfants.reduce((s, k) => s + res[k].ordre, a.parent === null ? 0 : a.ordre);
      const libres = Math.max(0, TROUS[a.el] - utilises), voisins = a.enfants.length + (a.parent === null ? 0 : 1);
      const n = voisins + libres + NON_LIANTS[a.el];
      let d = directions(n, e3, perpendiculaire(e3, ref));
      if (decalage && n === 4) d = directions(n, e3, perpendiculaire(e3, V.add(V.mul(ref, Math.cos(Math.PI / 3)), V.mul(V.cross(e3, ref), Math.sin(Math.PI / 3)))));
      const nl = NON_LIANTS[a.el], parent = a.parent === null ? [] : [d[0]];
      let liants = a.parent === null ? d.slice(nl) : d.slice(1, d.length - nl);
      if (a.parent === null && nl) liants = resserrer(liants, a.el === "N" ? 107 : 104.5);
      const pris = new Set(), place = {};
      for (const k of a.enfants) { const t = res[k].trou; if (t !== undefined && t < liants.length && !pris.has(t)) { place[k] = t; pris.add(t); } }
      for (const k of a.enfants) if (place[k] === undefined) { const t = liants.findIndex((x, jj) => !pris.has(jj)); place[k] = t; pris.add(t); }
      a.enfants.forEach((k) => {
        const j = place[k], u = liants[j], c = res[k];
        c.pos = V.add(a.pos, V.mul(u, longueur(a.el, c.el, c.ordre)));
        const autre = parent[0] || liants.find((x, jj) => jj !== j) || e3;
        etape(k, V.mul(u, -1), autre, c.ordre === 1 && a.el === "C" && c.el === "C");
      });
      a.libres = liants.map((x, jj) => jj).filter((jj) => !pris.has(jj)); a.dirs = a.libres.map((jj) => liants[jj]);
    };
    if (res.length) etape(0, [0, -1, 0], [1, 0, 0], false);
    return res;
  }

  L.MOLECULE_3D = { placer, TROUS, R, longueur, NON_LIANTS };
})(window.Labo);
