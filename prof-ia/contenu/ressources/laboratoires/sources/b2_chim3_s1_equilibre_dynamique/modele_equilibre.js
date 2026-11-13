/*
Rôle : modèle microscopique (à deux dimensions) de la réaction A + B ⇌ C + D : disques de même masse et de même rayon qui
       se déplacent en ligne droite dans une boîte dont les parois sont à la température T (une particule qui touche une
       paroi en repart comme si elle était émise par la paroi) ; chocs élastiques. Un choc A–B est efficace (sens direct)
       si l'énergie cinétique relative le long de la ligne des centres atteint E1 = 3,0 k·T(300 K) : A et B deviennent C et D ;
       un choc C–D est efficace (sens inverse) s'il atteint E2 = 4,0 k·T(300 K) : C et D redeviennent A et B. L'énergie de
       réaction n'est pas comptée (les parois maintiennent la température). Unités : px, s ; k·T = 80,7 × T.
Reçoit : { depart (« AB » : 30 A et 30 B ; « CD » : 30 C et 30 D), n, T (K), W, H (px) } ; puis la durée à simuler.
Produit : Labo.equilibre_chocs = { creer(reglage) -> s { particules, t, direct, inverse (chocs efficaces cumulés), compte() },
          pas(s, dt), E1, E2 }.
Utilisé par : poste_equilibre.js.
*/
(function (L) {
  const K = 80.67, E1 = 3.0 * K * 300, E2 = 4.0 * K * 300, R = 6, DT_MAX = 0.004;
  const gauss = () => Math.sqrt(-2 * Math.log(1 - Math.random())) * Math.cos(2 * Math.PI * Math.random());

  function creer({ depart, n = 30, T = 300, W, H }) {
    // Particules placées au hasard, sans chevauchement, avec des vitesses de Maxwell à T.
    const s = { particules: [], t: 0, direct: 0, inverse: 0, T, W, H }, sig = Math.sqrt(K * T);
    const ajouter = (type) => {
      for (let essai = 0; essai < 300; essai++) {
        const p = { type, x: R + Math.random() * (W - 2 * R), y: R + Math.random() * (H - 2 * R), vx: sig * gauss(), vy: sig * gauss() };
        if (s.particules.every((q) => Math.hypot(q.x - p.x, q.y - p.y) > 2 * R + 1)) return s.particules.push(p);
      }
    };
    const [a, b] = depart === "CD" ? ["C", "D"] : ["A", "B"];
    for (let k = 0; k < n; k++) { ajouter(a); ajouter(b); }
    s.compte = () => s.particules.reduce((c, p) => ({ ...c, [p.type]: c[p.type] + 1 }), { A: 0, B: 0, C: 0, D: 0 });
    return s;
  }

  function parois(s, p) {
    // Paroi à T : composante normale selon la loi de Rayleigh (flux), composante tangentielle gaussienne.
    const sig = Math.sqrt(K * s.T), n = () => sig * Math.sqrt(-2 * Math.log(1 - Math.random())), t = () => sig * gauss();
    if (p.x < R && p.vx < 0) Object.assign(p, { x: R, vx: n(), vy: t() });
    if (p.x > s.W - R && p.vx > 0) Object.assign(p, { x: s.W - R, vx: -n(), vy: t() });
    if (p.y < R && p.vy < 0) Object.assign(p, { y: R, vy: n(), vx: t() });
    if (p.y > s.H - R && p.vy > 0) Object.assign(p, { y: s.H - R, vy: -n(), vx: t() });
  }

  function choc(s, a, b, nx, ny, vn) {
    // Choc élastique entre a et b (vn < 0) ; A–B ou C–D assez énergique : les deux particules changent de nature.
    const paire = a.type + b.type, e = 0.25 * vn * vn;
    if ((paire === "AB" || paire === "BA") && e >= E1) { s.direct++; a.type = a.type === "A" ? "C" : "D"; b.type = b.type === "A" ? "C" : "D"; }
    else if ((paire === "CD" || paire === "DC") && e >= E2) { s.inverse++; a.type = a.type === "C" ? "A" : "B"; b.type = b.type === "C" ? "A" : "B"; }
    a.vx += vn * nx; a.vy += vn * ny; b.vx -= vn * nx; b.vy -= vn * ny;
  }

  function sous_pas(s, dt) {
    // Déplacement, parois, puis chocs entre particules qui se touchent et se rapprochent.
    const P = s.particules;
    for (const p of P) { p.x += p.vx * dt; p.y += p.vy * dt; parois(s, p); }
    for (let i = 0; i < P.length; i++) for (let k = i + 1; k < P.length; k++) {
      const a = P[i], b = P[k], dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy);
      if (d >= 2 * R || d === 0) continue;
      const nx = dx / d, ny = dy / d, vn = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
      if (vn < 0) choc(s, a, b, nx, ny, vn);
    }
    s.t += dt;
  }

  function pas(s, duree) {
    // Avance de « duree » en sous-pas de 4 ms au plus.
    const n = Math.max(1, Math.ceil(Math.min(duree, 0.1) / DT_MAX));
    for (let k = 0; k < n; k++) sous_pas(s, Math.min(duree, 0.1) / n);
  }

  L.equilibre_chocs = { creer, pas, E1, E2, R };
})(typeof window !== "undefined" ? window.Labo : (globalThis.Labo = globalThis.Labo || {}));
