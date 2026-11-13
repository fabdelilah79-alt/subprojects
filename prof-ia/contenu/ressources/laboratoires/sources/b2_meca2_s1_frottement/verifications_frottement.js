/*
Rôle : vérifications des missions « chute verticale avec frottement » : chutes filmées, pointage, vitesses calculées au tableur,
       tableau du modèle de frottement, tableau de la méthode d'Euler (récurrence, pas, constantes A et B).
Reçoit : les faits (« chutes_fluide », « pointage ») et la feuille du tableur.
Produit : Labo.verif_frottement = { chute(f, test), derniere, pointee(f, n), vitesses, modele, euler, choix, nombre, relatif }.
Utilisé par : simulation.js.
*/
(function (L) {
  const CH = (f) => f.chutes_fluide || [], P = (f) => f.pointage || {}, V = 3.351e-5, G = 9.81;
  const pres = (a, b, t) => b !== null && Math.abs(a - b) <= t * Math.abs(a);
  const chute = (f, test) => CH(f).find(test), eau40 = (f) => chute(f, (c) => c.liquide === "eau" && c.balle === "b40") || { vlim: 0.48, a0: 1.122 };

  function vitesses({ faits, feuille }) {
    // A, C : t et y exportés ; D : v = (y précédent − y suivant) / (2Δt), en valeur absolue, sur sept lignes au moins.
    const v = (c, n) => feuille.valeur_sure(`${c}${n}`), pts = P(faits).points || [];
    let n_v = 0;
    for (let n = 3; n <= 11; n++) {
      if (v("A", n) === null || v("D", n) === null) continue;
      if (!pts.some((q) => Math.abs(q.t - v("A", n)) < 1e-3)) return "Touchez « Exporter » dans le logiciel pour copier t, x, y.";
      if (v("C", n - 1) === null || v("C", n + 1) === null) continue;
      const attendu = (v("C", n - 1) - v("C", n + 1)) / (v("A", n + 1) - v("A", n - 1));
      if (Math.abs(Math.abs(v("D", n)) - Math.abs(attendu)) > 0.005) return `Ligne ${n} : en D, v = (C${n - 1} − C${n + 1}) / (A${n + 1} − A${n - 1}).`;
      n_v++;
    }
    return n_v >= 7 || false;
  }

  function modele({ faits, feuille }) {
    // A : m (kg) ; B : vlim mesurée (à 6 %) ; C : P − Π = (m − ρ·V)·g ; D : (P − Π)/vlim² ; les trois balles dans l'eau.
    const v = (c, n) => feuille.valeur_sure(`${c}${n}`), masses = new Set();
    for (let n = 2; n <= 12; n++) {
      if (v("A", n) === null) continue;
      const c = chute(faits, (x) => x.liquide === "eau" && Math.abs(x.masse - v("A", n)) < 1e-4);
      if (!c) return `Ligne ${n} : en A, la masse (kg) d'une balle que vous avez lâchée dans l'eau.`;
      if (!pres(c.vlim, v("B", n), 0.06)) return `Ligne ${n} : en B, la vitesse limite mesurée (m/s) de la balle de ${Math.round(c.masse * 1000)} g.`;
      if (!pres((c.masse - 1000 * V) * G, v("C", n), 0.01)) return `Ligne ${n} : en C, =(A${n}-1000*3,35E-5)*9,81.`;
      if (!pres(v("C", n) / v("B", n) ** 2, v("D", n), 0.01)) return `Ligne ${n} : en D, =C${n}/B${n}^2.`;
      masses.add(c.masse);
    }
    return masses.size >= 3 || false;
  }

  const euler = (pas_min) => ({ faits, feuille }) => {
    // Récurrence v(n+1) = v(n) + a(n)·Δt et a = A − B·v², v = 0 au départ ; A et B proches de ceux de la balle de 40 g dans l'eau ;
    // pas Δt d'au moins pas_min (huit pas si le pas est petit, quatre sinon).
    const v = (c, n) => feuille.valeur_sure(`${c}${n}`), dt = v("A", 3) - v("A", 2), A = v("C", 2), c = eau40(faits);
    if (v("A", 2) === null || !(dt > 0) || Math.abs(v("B", 2) || 0) > 1e-9) return "Ligne 2 : t = 0 en A, v = 0 en B, a = A − B·v² en C.";
    const B = (A - v("C", 3)) / v("B", 3) ** 2;
    if (!pres(c.a0, A, 0.3) || !pres(c.a0 / c.vlim ** 2, B, 0.35)) return "Les constantes A et B sont loin de celles trouvées : A = vlim / τ, B = A / vlim².";
    let n = 2;
    for (; n < 12 && v("A", n + 1) !== null; n++) {
      if (Math.abs(v("A", n + 1) - v("A", n) - dt) > 1e-6) return `Ligne ${n + 1} : en A, le pas Δt doit rester le même.`;
      if (Math.abs(v("B", n + 1) - (v("B", n) + v("C", n) * dt)) > 1e-3) return `Ligne ${n + 1} : en B, v = B${n} + C${n}*${String(dt).replace(".", ",")}.`;
      if (Math.abs(v("C", n + 1) - (A - B * v("B", n + 1) ** 2)) > 2e-3) return `Ligne ${n + 1} : en C, a = A − B·v² avec les mêmes A et B.`;
    }
    if (n < (pas_min > 0.2 ? 6 : 10)) return false;
    return dt >= pas_min - 1e-9 || `Prenez un pas Δt de ${String(pas_min).replace(".", ",")} s au moins.`;
  };

  L.verif_frottement = {
    vitesses, modele, euler, eau40,
    chute: (f, test) => !!chute(f, test),
    pointee: (f, n) => { const c = CH(f).slice(-1)[0], p = P(f); return !!c && p.video === c.id && p.echelle_ok && !!p.origine && (p.points || []).length >= n; },
    choix: (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo }),
    nombre: (unite, attendu, tolerance, aide, bravo) => ({ type: "nombre", unite, attendu, tolerance, aide, bravo }),
    relatif: (unite, attendu, tol, aide, bravo) => ({ type: "nombre", unite, attendu, tolerance_relative: tol, aide, bravo }),
  };
})(window.Labo);
