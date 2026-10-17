/*
Rôle : verrerie aux vraies dimensions (en mm) : profil intérieur (demi-largeur r selon la hauteur h depuis le fond),
       épaisseur du verre, bec, graduations. Pour chaque pièce : polygones intérieur et extérieur (repère du récipient :
       origine au milieu du fond, x vers la droite, y vers le bas, en mm), lèvres de l'ouverture, et tables qui relient le
       volume (mL) à l'aire de liquide vue en coupe (mm²) : un récipient droit est rempli exactement à la bonne hauteur.
Reçoit : le nom d'une pièce (becher_50, becher_100, becher_250, becher_600, tube, eprouvette_50, erlenmeyer_250, ampoule_125, ballon_250, fiole_500 (fiole à vide), flacon_gaz (flacon de 600 mL fermé par une plaque de verre), cristallisoir_90 (90 mm × 45 mm), buchner_70 (cuvette d'un entonnoir Büchner)).
Produit : Labo.profil(nom) -> { nom, H, h0 (fond intérieur : 0, sauf l'ampoule dont la tige est sous le robinet), t, interieur, exterieur, levres, aire_de(V), volume_de(A), hauteur_de(V), r(h), graduations, extras }.
Utilisé par : verrerie_rendu.js, recipient_physique.js.
*/
(function (L) {
  const sphere = (R, h0, h1, pas = 2) => { const p = []; for (let h = h0; h <= h1; h += pas) p.push([h, Math.sqrt(Math.max(0, R * R - (R - h) ** 2))]); return p; };
  // Corps d'ampoule en poire : cône qui s'évase vers le haut, épaule arrondie, puis col (points tous les 2 mm).
  const poire = (h0, h1, r0, rmax, r1) => { const p = []; for (let h = h0; h <= h1; h += 2) { const u = (h - h0) / (h1 - h0), w = u < 0.78 ? r0 + (rmax - r0) * Math.sin((Math.PI / 2) * Math.pow(u / 0.78, 0.85)) : r1 + (rmax - r1) * Math.cos((Math.PI / 2) * ((u - 0.78) / 0.22)); p.push([h, w]); } return p; };
  const becher = (r, H, grad) => ({ profil: [[0, r - 3], [1, r - 1.2], [3, r], [H, r]], t: 1.4, bec: true, grad });
  const DEFS = {
    becher_50: becher(20, 54, [10, 20, 30, 40, 50]),
    becher_100: becher(25, 68, [20, 40, 60, 80, 100]),
    becher_250: becher(33.5, 92, [50, 100, 150, 200, 250]),
    becher_600: becher(45, 125, [100, 200, 300, 400, 500, 600]),
    tube: { profil: [...sphere(7.5, 0, 7.5, 0.75), [150, 7.5]], t: 1, bourrelet: true, etiquette_h: 0.72 },
    eprouvette_50: { profil: [[0, 10.5], [175, 10.5]], t: 1.3, bec: true, pied: true, grad: [10, 20, 30, 40, 50] },
    erlenmeyer_250: { profil: [[0, 37], [2, 39.5], [80, 16], [92, 14], [118, 14]], t: 1.4, grad: [50, 100, 150, 200] },
    ampoule_125: { profil: [[54, 1.6], [62, 1.6], ...poire(64, 186, 3, 32, 11), [204, 10.5]], t: 1.5, robinet: 52, tige: true, rode: true },
    ballon_250: { profil: [...sphere(39.5, 0, 74), [80, 12.5], [118, 12.5]], t: 1.5, rode: true },
    fiole_500: { profil: [[0, 49], [3, 51], [110, 16], [140, 13], [180, 13]], t: 2.4, tubulure: 155, grad: [100, 200, 300, 400] },
    cristallisoir_90: { profil: [[0, 42], [1, 44], [3, 45], [45, 45]], t: 2 },
    flacon_gaz: { profil: [[0, 32], [2, 35], [160, 35]], t: 2.2, bourrelet: true, plaque: true },
    buchner_70: { profil: [[0, 33], [4, 35], [40, 35]], t: 3, sans_ombre: true },
  };
  const cache = {};

  function polygones(def) {
    // Polygones intérieur (le liquide) et extérieur (le verre), et lèvres de l'ouverture (bec à droite s'il y en a un).
    const p = def.profil, H = p[p.length - 1][0], t = def.t;
    const interieur = [...p.slice().reverse().map(([h, r]) => ({ x: -r, y: -h })), ...p.map(([h, r]) => ({ x: r, y: -h }))];
    const b = -p[0][0] + t;
    const exterieur = [...p.slice().reverse().map(([h, r]) => ({ x: -r - t, y: -h })), { x: -p[0][1] - t, y: b }, { x: p[0][1] + t, y: b }, ...p.map(([h, r]) => ({ x: r + t, y: -h }))];
    const rH = p[p.length - 1][1], levres = { g: { x: -rH, y: -H }, d: def.bec ? { x: rH + 3, y: -H - 1.5 } : { x: rH, y: -H } };
    return { H, interieur, exterieur, levres };
  }

  function tables(def, r) {
    // Volume (mL) et aire en coupe (mm²) jusqu'à chaque demi-millimètre de hauteur.
    const H = def.profil[def.profil.length - 1][0], h0 = def.profil[0][0], V = [0], A = [0];
    for (let h = h0 + 0.5; h <= H + 1e-9; h += 0.5) { const m = r(h - 0.25); V.push(V[V.length - 1] + (Math.PI * m * m * 0.5) / 1000); A.push(A[A.length - 1] + 2 * m * 0.5); }
    const chercher = (T, x) => { let i = 1; while (i < T.length - 1 && T[i] < x) i++; return Math.max(0, i - 1 + (x - T[i - 1]) / Math.max(1e-9, T[i] - T[i - 1])); };
    const lire = (T, k) => { const i = Math.min(T.length - 2, Math.floor(k)); return T[i] + (T[i + 1] - T[i]) * (k - i); };
    return { aire_de: (v) => lire(A, chercher(V, v)), volume_de: (a) => lire(V, chercher(A, a)), hauteur_de: (v) => h0 + chercher(V, v) * 0.5 };
  }

  L.profil = function (nom) {
    // Construit (une seule fois) la pièce demandée.
    if (cache[nom]) return cache[nom];
    const def = DEFS[nom], p = def.profil;
    const r = (h) => { for (let i = 1; i < p.length; i++) if (h <= p[i][0]) return p[i - 1][1] + ((p[i][1] - p[i - 1][1]) * (h - p[i - 1][0])) / (p[i][0] - p[i - 1][0]); return p[p.length - 1][1]; };
    const pr = { nom, t: def.t, h0: p[0][0], r, extras: def, ...polygones(def), ...tables(def, r) };
    pr.graduations = (def.grad || []).map((v) => ({ v, h: pr.hauteur_de(v) }));
    return (cache[nom] = pr);
  };
})(window.Labo);
