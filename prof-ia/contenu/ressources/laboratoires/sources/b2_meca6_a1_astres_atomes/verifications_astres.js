/*
Rôle : vérifications des missions « astres et atomes » : documents lus, lancements du simulateur (orbites circulaires,
       trajectoires ouvertes, chute de l'électron), tableaux des forces et de la troisième loi de Kepler.
Reçoit : les faits (« documents_astres », « lancers ») et la feuille du tableur.
Produit : Labo.verif_astres = { lu(n…), lances(f, test), circulaires(f, mode), dernier_circulaire(f, mode, r0), forces, kepler,
          choix, nombre, relatif }.
Utilisé par : simulation.js.
*/
(function (L) {
  const K = 9.0e9, G = 6.67e-11, E = 1.6e-19, ME = 9.11e-31, MP = 1.67e-27, MU = 6.674e-11 * 5.972e24;
  const LA = (f) => f.lancers || [], pres = (a, b, t) => b !== null && Math.abs(a - b) <= t * Math.abs(a);
  const circulaires = (f, mode) => LA(f).filter((l) => l.mode === mode && l.issue === "orbite" && l.circulaire && !l.rayonnement);

  function differents(valeurs, ecart) {
    // Nombre de valeurs distinctes (deux valeurs plus proches que l'écart comptent pour une).
    return valeurs.reduce((liste, v) => (liste.some((u) => Math.abs(u - v) < ecart) ? liste : [...liste, v]), []).length;
  }

  function forces({ feuille }) {
    // A : d (m) ; B : Fe = k·e²/d² ; C : Fg = G·me·mp/d² ; D : Fe/Fg ; trois distances, dont 5,3 × 10⁻¹¹ m.
    const v = (c, n) => feuille.valeur_sure(`${c}${n}`), d = [];
    for (let n = 2; n <= 12; n++) {
      if (v("A", n) === null) continue;
      const x = v("A", n);
      if (!(x > 0)) return `Ligne ${n} : en A, une distance en mètres (par exemple 5,3E-11).`;
      if (!pres((K * E * E) / (x * x), v("B", n), 0.03)) return `Ligne ${n} : en B, Fe = 9E9*(1,6E-19)^2/A${n}^2.`;
      if (!pres((G * ME * MP) / (x * x), v("C", n), 0.03)) return `Ligne ${n} : en C, Fg = 6,67E-11*9,11E-31*1,67E-27/A${n}^2.`;
      if (!pres(v("B", n) / v("C", n), v("D", n), 0.01)) return `Ligne ${n} : en D, =B${n}/C${n}.`;
      d.push(x);
    }
    if (!d.some((x) => Math.abs(x - 5.3e-11) < 0.05e-11)) return d.length ? "Une des lignes doit être celle de l'atome d'hydrogène : d = 5,3E-11 m." : false;
    return differents(d, 1e-13) >= 3 || "Trois distances différentes.";
  }

  function kepler({ faits, feuille }) {
    // A : r (m) d'une orbite circulaire obtenue ; B : T (s) ; C : r³ ; D : T² ; trois lignes.
    const v = (c, n) => feuille.valeur_sure(`${c}${n}`), orbites = circulaires(faits, "terre"), r = [];
    for (let n = 2; n <= 12; n++) {
      if (v("A", n) === null) continue;
      const o = orbites.find((l) => pres(l.r0, v("A", n), 0.005));
      if (!o) return `Ligne ${n} : en A, le rayon (en mètres) d'une orbite circulaire que vous avez obtenue (1 km = 1 000 m).`;
      if (!pres(o.T, v("B", n), 0.01)) return `Ligne ${n} : en B, la période T (s) affichée pour cette orbite.`;
      if (!pres(v("A", n) ** 3, v("C", n), 0.005)) return `Ligne ${n} : en C, =A${n}^3.`;
      if (!pres(v("B", n) ** 2, v("D", n), 0.005)) return `Ligne ${n} : en D, =B${n}^2.`;
      r.push(o.r0);
    }
    return differents(r, 1e6) >= 3 || false;
  }

  L.verif_astres = {
    MU, circulaires, differents, forces, kepler,
    lu: (f, ...n) => n.every((k) => (f.documents_astres || []).includes(k)),
    lances: (f, test) => LA(f).some(test),
    dernier: (f, test) => LA(f).filter(test).slice(-1)[0],
    choix: (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo }),
    nombre: (unite, attendu, tolerance, aide, bravo) => ({ type: "nombre", unite, attendu, tolerance, aide, bravo }),
    relatif: (unite, attendu, tol, aide, bravo) => ({ type: "nombre", unite, attendu, tolerance_relative: tol, aide, bravo }),
  };
})(window.Labo);
