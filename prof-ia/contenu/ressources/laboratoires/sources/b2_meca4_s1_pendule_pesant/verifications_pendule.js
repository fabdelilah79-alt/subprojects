/*
Rôle : vérifications des missions « pendule pesant et pendule simple » : lâchers notés par les postes, périodes lues sur la
       courbe θ(t) (à 1,5 % près) ou au chronomètre (à 4 % près, temps de réaction), tableaux du tableur.
Reçoit : les faits (« lachers_pesant », « lachers_simple », « acquisition », « chronometre ») et la feuille du tableur.
Produit : Labo.verif_pendule = { lache_pesant(f, test), lache_simple(f, test), isochronisme(amplitudes), periodes_d, simple,
          pseudo_periode(f), sans_palette, choix, relatif }.
Utilisé par : simulation.js.
*/
(function (L) {
  const LP = (f) => f.lachers_pesant || [], LS = (f) => f.lachers_simple || [], fr = (v) => String(v).replace(".", ",");
  const pres = (a, b, t) => b !== null && Math.abs(a - b) <= t * Math.abs(a);
  const lache_pesant = (f, test) => LP(f).filter(test).slice(-1)[0], lache_simple = (f, test) => LS(f).filter(test).slice(-1)[0];
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const relatif = (unite, attendu, tol, aide, bravo) => ({ type: "nombre", unite, attendu, tolerance_relative: tol, aide, bravo });

  const isochronisme = (min, max, n_min) => ({ faits, feuille }) => {
    // A : amplitude θm (°) d'un lâcher (d = 40 cm, sans palette) ; B : T lue sur la courbe ; amplitudes entre min et max.
    const v = (c, n) => feuille.valeur_sure(`${c}${n}`), vus = new Set();
    for (let n = 2; n <= 12; n++) {
      if (v("A", n) === null || Math.abs(v("A", n)) < min - 1.5 || Math.abs(v("A", n)) > max + 1.5) continue;
      const l = lache_pesant(faits, (x) => x.d === 0.4 && !x.palette && Math.abs(Math.abs(x.theta0) - Math.abs(v("A", n))) <= 1.5);
      if (!l) return `Ligne ${n} : en A, l'amplitude (°) d'un lâcher que vous avez fait (d = 40 cm, sans palette).`;
      if (!pres(l.T, v("B", n), 0.015)) return `Ligne ${n} : en B, la période (s) lue sur la courbe : durée de 5 oscillations ÷ 5.`;
      vus.add(l.id);
    }
    return vus.size >= n_min || false;
  };

  function periodes_d({ faits, feuille }) {
    // A : d (m) ; B : T lue sur la courbe pour un lâcher de 15° au plus, sans palette ; quatre positions de la masse.
    const v = (c, n) => feuille.valeur_sure(`${c}${n}`), positions = new Set();
    for (let n = 2; n <= 12; n++) {
      if (v("A", n) === null) continue;
      const l = lache_pesant(faits, (x) => !x.palette && Math.abs(x.d - v("A", n)) < 1e-6 && Math.abs(x.theta0) <= 16);
      if (!l) return `Ligne ${n} : en A, une position d (m) de la masse pour laquelle vous avez lâché la tige à 15° au plus.`;
      if (!pres(l.T, v("B", n), 0.015)) return `Ligne ${n} : en B, la période (s) lue sur la courbe pour d = ${fr(l.d)} m.`;
      positions.add(l.d);
    }
    return positions.size >= 4 || false;
  }

  function simple({ faits, feuille }) {
    // A : l (m) lue sur la règle ; B : T = durée de 10 oscillations ÷ 10 (à 4 %) ; C : T² ; quatre longueurs de 20 à 80 cm.
    const v = (c, n) => feuille.valeur_sure(`${c}${n}`), longueurs = new Set();
    for (let n = 2; n <= 12; n++) {
      if (v("A", n) === null) continue;
      const l = lache_simple(faits, (x) => Math.abs(x.l - v("A", n)) <= 0.006);
      if (!l) return `Ligne ${n} : en A, une longueur l (m) que vous avez réglée et lue sur la règle, puis lâché la bille.`;
      if (!pres(l.T, v("B", n), 0.04)) return `Ligne ${n} : en B, T = (durée de 10 oscillations) ÷ 10, pour l = ${fr(l.l)} m.`;
      if (!pres(v("B", n) ** 2, v("C", n), 0.002)) return `Ligne ${n} : en C, =B${n}^2.`;
      longueurs.add(l.l);
    }
    const ls = [...longueurs];
    return (ls.length >= 4 && Math.max(...ls) - Math.min(...ls) >= 0.4) || false;
  }

  function pseudo_periode(f) {
    // Pseudo-période du dernier lâcher avec la palette : période d'une oscillation d'amplitude moyenne sur les cinq premières.
    const l = lache_pesant(f, (x) => x.palette) || { d: 0.4, theta0: 20 }, w2 = L.pendule_pesant_modele.omega2(l.d, true);
    return L.pendule.periode(w2, (0.6 * l.theta0 * Math.PI) / 180);
  }

  function sans_palette({ faits }) {
    // Lâcher à 15° au moins sans palette, après un lâcher avec la palette ; acquisition de 20 s terminée, sans palette.
    const a = lache_pesant(faits, (x) => x.palette), b = lache_pesant(faits, (x) => !x.palette && Math.abs(x.theta0) >= 15);
    const q = faits.acquisition || {}, der = (q.courbes || []).slice(-1)[0], rang = (x) => Number(x.id.slice(6));
    return (!!a && !!b && rang(b) > rang(a) && q.etat === "terminée" && q.duree === 20 && !!der && !der.etiquette.includes("palette")) || false;
  }

  L.verif_pendule = { lache_pesant, lache_simple, isochronisme, periodes_d, simple, pseudo_periode, sans_palette, choix, relatif };
})(window.Labo);
