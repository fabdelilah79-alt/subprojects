/*
Rôle : vérifications des missions « satellites et planètes » : documents lus, lancements du simulateur (ellipses, aires de
       Kepler, orbites circulaires, satellite géostationnaire), tableau de la troisième loi de Kepler (données des planètes).
Reçoit : les faits (« documents_satellites », « lancers ») et la feuille du tableur.
Produit : Labo.verif_satellites = { PLANETES, lu, lance, dernier, kepler, choix, nombre, relatif }.
Utilisé par : simulation.js.
*/
(function (L) {
  const UA = 1.496e11, JOUR = 86400, LA = (f) => f.lancers || [];
  const PLANETES = [["Mercure", 0.387, 87.97], ["Vénus", 0.723, 224.7], ["Terre", 1, 365.25], ["Mars", 1.524, 687.0], ["Jupiter", 5.203, 4332.6], ["Saturne", 9.537, 10759]];
  const pres = (a, b, t) => b !== null && Math.abs(a - b) <= t * Math.abs(a);

  function kepler({ feuille }) {
    // A : a (m) ; B : T (s) ; C : a³ ; D : T² ; quatre planètes au moins, d'après le document « Données ».
    const v = (c, n) => feuille.valeur_sure(`${c}${n}`), vues = new Set();
    for (let n = 2; n <= 12; n++) {
      if (v("A", n) === null) continue;
      const p = PLANETES.find(([, a]) => pres(a * UA, v("A", n), 0.005));
      if (!p) return `Ligne ${n} : en A, le demi-grand axe a d'une planète, en mètres (1 UA = 1,496E11 m).`;
      if (!pres(p[2] * JOUR, v("B", n), 0.005)) return `Ligne ${n} : en B, la période de ${p[0]} en secondes (1 j = 86 400 s).`;
      if (!pres(v("A", n) ** 3, v("C", n), 0.005)) return `Ligne ${n} : en C, =A${n}^3.`;
      if (!pres(v("B", n) ** 2, v("D", n), 0.005)) return `Ligne ${n} : en D, =B${n}^2.`;
      vues.add(p[0]);
    }
    return vues.size >= 4 || (vues.size ? "Quatre planètes au moins." : false);
  }

  L.verif_satellites = {
    PLANETES, kepler,
    lu: (f, ...n) => n.every((k) => (f.documents_satellites || []).includes(k)),
    lance: (f, test) => LA(f).some(test),
    dernier: (f, test) => LA(f).filter(test).slice(-1)[0],
    choix: (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo }),
    nombre: (unite, attendu, tolerance, aide, bravo) => ({ type: "nombre", unite, attendu, tolerance, aide, bravo }),
    relatif: (unite, attendu, tol, aide, bravo) => ({ type: "nombre", unite, attendu, tolerance_relative: tol, aide, bravo }),
  };
})(window.Labo);
