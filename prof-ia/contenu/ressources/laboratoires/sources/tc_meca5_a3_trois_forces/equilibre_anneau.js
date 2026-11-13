/*
Rôle : position d'équilibre d'un anneau tiré par trois fils : deux passent sur des poulies P1 et P2 et portent des
       masses (forces F1 et F2 le long des fils), le troisième descend à la verticale (force F3 vers le bas).
       À l'équilibre, F1 + F2 + F3 = 0 : le triangle des forces donne les angles des fils avec la verticale.
       Si une force est trop grande, son porte-masses descend jusqu'à la paillasse, qui en porte une partie.
Reçoit : les poulies P1, P2 (px), les forces F1, F2, F3 (N) et y_max (l'anneau ne descend pas plus bas).
Produit : Labo.equilibre_anneau(P1, P2, F, y_max) -> { O (px), alpha1, alpha2 (rad, avec la verticale), efficaces [F1, F2, F3], pose (indice du
          porte-masses posé, ou -1) }.
Utilisé par : table_forces.js.
*/
(function (L) {
  const MARGE = 0.97;

  function efficaces(F) {
    // Forces réellement transmises : aucune ne dépasse ce que les deux autres peuvent équilibrer.
    const f = [...F];
    let pose = -1;
    for (let i = 0; i < 3; i++) {
      const autres = f.reduce((s, x, j) => (j === i ? s : s + x), 0);
      if (f[i] > MARGE * autres) { f[i] = MARGE * autres; pose = i; }
    }
    for (const [i, j] of [[0, 1], [1, 0]]) {
      // Fil sur poulie : l'anneau reste sous les poulies (angle avec la verticale inférieur à 90°).
      const max = MARGE * Math.sqrt(f[j] * f[j] + f[2] * f[2]);
      if (f[i] > max) { f[i] = max; pose = i; }
    }
    return { f, pose };
  }

  function position(P1, P2, f) {
    // Angles par la loi des cosinus dans le triangle des forces, puis O à l'intersection des deux fils.
    const [F1, F2, F3] = f;
    const alpha1 = Math.acos(Math.max(-1, Math.min(1, (F1 * F1 + F3 * F3 - F2 * F2) / (2 * F1 * F3))));
    const alpha2 = Math.acos(Math.max(-1, Math.min(1, (F2 * F2 + F3 * F3 - F1 * F1) / (2 * F2 * F3))));
    const d1 = { x: Math.sin(alpha1), y: Math.cos(alpha1) }, d2 = { x: -Math.sin(alpha2), y: Math.cos(alpha2) };
    const det = d1.x * -d2.y - d1.y * -d2.x, dx = P2.x - P1.x, dy = P2.y - P1.y;
    const t = (dx * -d2.y - dy * -d2.x) / det;
    return { O: { x: P1.x + t * d1.x, y: P1.y + t * d1.y }, alpha1, alpha2 };
  }

  L.equilibre_anneau = function (P1, P2, F, y_max) {
    // Équilibre ; si l'anneau descendrait sous y_max, le porte-masses 3 se pose : F3 transmise est réduite (dichotomie).
    let { f, pose } = efficaces(F), r = position(P1, P2, f);
    if (r.O.y > y_max) {
      let bas = 0.05 * f[2], haut = f[2];
      for (let i = 0; i < 40; i++) { const m = (bas + haut) / 2; if (position(P1, P2, [f[0], f[1], m]).O.y > y_max) haut = m; else bas = m; }
      f = [f[0], f[1], bas];
      pose = 2;
      r = position(P1, P2, f);
    }
    return { ...r, efficaces: f, pose };
  };
})(window.Labo);
