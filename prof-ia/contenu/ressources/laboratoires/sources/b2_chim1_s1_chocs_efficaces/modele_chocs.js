/*
Rôle : modèle microscopique (à deux dimensions) de la réaction A + B → C : disques de même rayon qui se déplacent en ligne
       droite dans une boîte ; parois à la température T (une particule qui touche la paroi en repart comme si elle était
       émise par une paroi à T) ; chocs élastiques ; un choc A–B est efficace si l'énergie cinétique relative le long de la
       ligne des centres atteint l'énergie seuil EA : A et B forment alors une particule C (quantité de mouvement conservée).
       Unités : px, s ; k·T = 80,7 × T (v quadratique moyenne de 220 px/s à 300 K) ; EA = 3,5 k·T(300 K).
Reçoit : { nA, nB, T (K), W, H (px, taille de la boîte) } ; puis la durée à simuler.
Produit : Labo.chocs = { creer(reglage) -> s { particules, t, chocs, efficaces, C }, pas(s, dt), K, EA, R }.
Utilisé par : logiciel_chocs.js.
*/
(function (L) {
  const K = 80.67, EA = 3.5 * K * 300, R = 6, DT_MAX = 0.004;
  const gauss = () => Math.sqrt(-2 * Math.log(1 - Math.random())) * Math.cos(2 * Math.PI * Math.random());
  const vitesse = (T, m) => { const s = Math.sqrt((K * T) / m); return { vx: s * gauss(), vy: s * gauss() }; };

  function creer({ nA, nB, T, W, H }) {
    // Particules A et B placées au hasard, sans chevauchement, avec des vitesses de Maxwell à T.
    const s = { particules: [], t: 0, chocs: 0, efficaces: 0, C: 0, T, W, H };
    const ajouter = (type) => {
      for (let essai = 0; essai < 200; essai++) {
        const p = { type, m: 1, r: R, x: R + Math.random() * (W - 2 * R), y: R + Math.random() * (H - 2 * R), ...vitesse(T, 1) };
        if (s.particules.every((q) => Math.hypot(q.x - p.x, q.y - p.y) > q.r + p.r + 1)) return s.particules.push(p);
      }
    };
    for (let k = 0; k < nA; k++) ajouter("A");
    for (let k = 0; k < nB; k++) ajouter("B");
    return s;
  }

  function parois(s, p) {
    // Une particule qui touche une paroi en repart avec la vitesse d'une particule émise par une paroi à T : composante
    // normale selon la loi de Rayleigh (flux), composante tangentielle gaussienne.
    const sig = Math.sqrt((K * s.T) / p.m), n = () => sig * Math.sqrt(-2 * Math.log(1 - Math.random())), t = () => sig * gauss();
    if (p.x < p.r && p.vx < 0) Object.assign(p, { x: p.r, vx: n(), vy: t() });
    if (p.x > s.W - p.r && p.vx > 0) Object.assign(p, { x: s.W - p.r, vx: -n(), vy: t() });
    if (p.y < p.r && p.vy < 0) Object.assign(p, { y: p.r, vy: n(), vx: t() });
    if (p.y > s.H - p.r && p.vy > 0) Object.assign(p, { y: s.H - p.r, vy: -n(), vx: t() });
  }

  function choc(s, a, b, nx, ny, vn) {
    // Choc entre a et b (vn < 0 : ils se rapprochent) ; A–B efficace : formation de C ; sinon choc élastique. Vrai si fusion.
    const AB = (a.type === "A" && b.type === "B") || (a.type === "B" && b.type === "A"), mu = (a.m * b.m) / (a.m + b.m);
    if (AB) {
      s.chocs++;
      if (0.5 * mu * vn * vn >= EA) {
        s.efficaces++; s.C++;
        const m = a.m + b.m;
        Object.assign(a, { type: "C", m, r: R + 1.5, x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, vx: (a.m * a.vx + b.m * b.vx) / m, vy: (a.m * a.vy + b.m * b.vy) / m });
        return true;
      }
    }
    const j = (2 * mu * vn);
    a.vx += (j / a.m) * nx; a.vy += (j / a.m) * ny; b.vx -= (j / b.m) * nx; b.vy -= (j / b.m) * ny;
    return false;
  }

  function sous_pas(s, dt) {
    // Déplacement, parois, puis chocs entre particules qui se touchent et se rapprochent.
    const P = s.particules;
    for (const p of P) { p.x += p.vx * dt; p.y += p.vy * dt; parois(s, p); }
    for (let i = 0; i < P.length; i++) for (let k = i + 1; k < P.length; k++) {
      const a = P[i], b = P[k], dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy);
      if (d >= a.r + b.r || d === 0) continue;
      const nx = dx / d, ny = dy / d, vn = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
      if (vn < 0 && choc(s, a, b, nx, ny, vn)) { P.splice(k, 1); k--; }
    }
    s.t += dt;
  }

  function pas(s, duree) {
    // Avance de « duree » en sous-pas de 4 ms au plus.
    const n = Math.max(1, Math.ceil(Math.min(duree, 0.1) / DT_MAX));
    for (let k = 0; k < n; k++) sous_pas(s, Math.min(duree, 0.1) / n);
  }

  L.chocs = { creer, pas, K, EA, R };
})(typeof window !== "undefined" ? window.Labo : (globalThis.Labo = globalThis.Labo || {}));
