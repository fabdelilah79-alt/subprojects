/*
Rôle : calcul du champ magnétique B (en teslas) en un point de l'espace, par superposition : champ terrestre (composantes
       horizontale vers le nord et verticale vers le bas), pôles d'aimants (modèle des « masses magnétiques » :
       B = q·r/r³), courants dans des segments rectilignes (loi de Biot et Savart, forme exacte pour un segment).
       Repère (en mètres) : x vers l'est, y vers le sud (vers l'élève), z vers le haut.
       Sources prêtes à l'emploi : barreau aimanté, aimant en U (pôles en regard), fil rectiligne vertical, spire, bobine.
Reçoit : la liste des sources et le point.
Produit : Labo.champ_magnetique.calculer(sources, p) -> { x, y, z } ; Labo.champ_magnetique.terre, barreau, aimant_u,
          fil_vertical, fil, spire, bobine (-> listes de sources) ; MU0.
Utilisé par : boussole, limaille, teslamètre et postes des simulations de magnétisme.
*/
(function (L) {
  const MU0 = 4e-7 * Math.PI, K = 1e-7;
  const sous = (a, b) => ({ x: a.x - b.x, y: a.y - b.y, z: a.z - b.z }), pv = (a, b) => ({ x: a.y * b.z - a.z * b.y, y: a.z * b.x - a.x * b.z, z: a.x * b.y - a.y * b.x });
  const ps = (a, b) => a.x * b.x + a.y * b.y + a.z * b.z, n = (a) => Math.sqrt(ps(a, a));

  function segment(s, p, B) {
    // Champ d'un segment a → b parcouru par I : B = (μ0·I/4π)·((r1/|r1| − r2/|r2|)·u)·(u × r1)/|u × r1|².
    const u = sous(s.b, s.a), r1 = sous(p, s.a), r2 = sous(p, s.b), c = pv(u, r1), c2 = ps(c, c), n1 = n(r1), n2 = n(r2);
    if (c2 < 1e-14 || n1 < 1e-4 || n2 < 1e-4) return;
    const f = (K * s.I * ((r1.x / n1 - r2.x / n2) * u.x + (r1.y / n1 - r2.y / n2) * u.y + (r1.z / n1 - r2.z / n2) * u.z)) / c2;
    B.x += f * c.x; B.y += f * c.y; B.z += f * c.z;
  }

  function calculer(sources, p) {
    // Somme des champs de toutes les sources au point p.
    const B = { x: 0, y: 0, z: 0 };
    for (const s of sources) {
      if (s.type === "terre") { B.y -= s.BH; B.z -= s.BV; }
      else if (s.type === "pole") { const r = sous(p, s), d = Math.max(0.004, n(r)), f = s.q / (d * d * d); B.x += f * r.x; B.y += f * r.y; B.z += f * r.z; }
      else segment(s, p, B);
    }
    return B;
  }

  const pole = (x, y, q, z = 0) => ({ type: "pole", x, y, z, q });

  function spire({ x, y, z = 0, R, N = 1, I, axe = 0, morceaux = 24 }) {
    // Spire (N tours) de centre (x, y, z), d'axe horizontal (angle dans le plan) ; I > 0 : champ au centre selon l'axe.
    const a = { x: Math.cos(axe), y: Math.sin(axe) }, e1 = { x: -a.y, y: a.x }, pt = (t) => ({ x: x + R * Math.cos(t) * e1.x, y: y + R * Math.cos(t) * e1.y, z: z + R * Math.sin(t) });
    return Array.from({ length: morceaux }, (_, k) => ({ type: "segment", a: pt((2 * Math.PI * k) / morceaux), b: pt((2 * Math.PI * (k + 1)) / morceaux), I: I * N }));
  }

  L.champ_magnetique = {
    MU0, calculer, pole,
    terre: (BH = 2.9e-5, BV = 3.0e-5) => [{ type: "terre", BH, BV }],
    barreau: ({ x, y, angle = 0, longueur = 0.1, q = 1.6e-6 }) => {
      // Pôles nord (vers l'angle donné) et sud, à 0,4·longueur du centre.
      const d = 0.4 * longueur, c = Math.cos(angle), s = Math.sin(angle);
      return [pole(x + d * c, y + d * s, q), pole(x - d * c, y - d * s, -q)];
    },
    aimant_u: ({ x, y, angle = 0, entrefer = 0.04, largeur = 0.03, q = 1.6e-6, nb = 7 }) => {
      // Deux faces polaires en regard (nord à gauche de l'axe, sud à droite) : champ presque uniforme dans l'entrefer.
      const c = Math.cos(angle), s = Math.sin(angle), r = [];
      for (let k = 0; k < nb; k++) {
        const t = (k / (nb - 1) - 0.5) * largeur, h = entrefer / 2 + 0.004;
        r.push(pole(x - h * c - t * s, y - h * s + t * c, q / nb), pole(x + h * c - t * s, y + h * s + t * c, -q / nb));
      }
      return r;
    },
    fil_vertical: ({ x, y, I }) => [{ type: "segment", a: { x, y, z: -0.5 }, b: { x, y, z: 0.5 }, I }],
    fil: (a, b, I) => [{ type: "segment", a, b, I }],
    spire,
    bobine: ({ x, y, R, longueur, N, I, axe = 0, tranches = 20 }) => {
      // Bobine (solénoïde) de N spires sur la longueur donnée, représentée par des tranches de N/tranches spires.
      const r = [], c = Math.cos(axe), s = Math.sin(axe);
      for (let k = 0; k < tranches; k++) { const t = (k / (tranches - 1) - 0.5) * longueur; r.push(...spire({ x: x + t * c, y: y + t * s, R, N: N / tranches, I, axe, morceaux: 16 })); }
      return r;
    },
  };
})(window.Labo);
