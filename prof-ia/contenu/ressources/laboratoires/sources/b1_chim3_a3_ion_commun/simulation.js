/*
Rôle : simulation de l'activité 3 du chapitre « La conductance » (1re année du bac) : conductances de six solutions de même
       concentration (5,0 mmol/L) ayant un ion commun (NaCl, KCl, NaOH, KOH, HCl, NH₄Cl), même cellule ; conductivités
       σ = G·L/S ; comparaisons deux à deux : conductivités molaires ioniques λ, σ = Σ λi·[Xi], ions H₃O⁺ et HO⁻ très
       conducteurs. Objectifs O3, O5, O6.
Reçoit : rien (les vérifications lisent le fait « conductance » et la feuille du tableur).
Produit : la simulation démarrée.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const nombre = (unite, attendu, tolerance, aide, bravo) => ({ type: "nombre", unite, attendu, tolerance, aide, bravo });
  const ORDRE = [["NaCl", "NaCl"], ["KCl", "KCl"], ["NaOH", "NaOH"], ["KOH", "KOH"], ["HCl", "HCl"], ["NH4Cl", "NH₄Cl"]];
  const FLACONS = ORDRE.map(([sol, t]) => ({ id: sol, texte: `${t}\n5 mmol/L`, sol, C: 0.005 }));
  const me = (f) => (f.conductance || {}).mesures || [];

  function poste(g) {
    // Paillasse unique : cellule de géométrie fixe (L = 1 cm, S = 1 cm²), six flacons à 5,0 mmol/L.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230);
    L.cellule_conductance(g, { flacons: FLACONS, L: 1, L_fixe: true, S_fixe: 1 });
    return { pense_bete };
  }

  function tableau({ faits, feuille }) {
    // Une ligne par solution, dans l'ordre NaCl, KCl, NaOH, KOH, HCl, NH₄Cl : G (mS), σ (S/m).
    const l = feuille.lignes(["A", "B"]);
    if (l.length < 6) return false;
    for (const [k, x] of l.entries()) {
      const id = ORDRE[k]?.[0];
      if (!id || !me(faits).some((m) => m.flacon === id && Math.abs(m.G * 1000 - x.A) <= 0.01 * m.G * 1000 + 0.002)) return `Ligne ${k + 2} : G (mS) mesurée pour ${ORDRE[k]?.[1] || "…"}.`;
      if (Math.abs(x.B - x.A / 10) > 0.01 * x.B + 1e-4) return `Ligne ${k + 2} : σ = G·L/S en S/m (G en mS, L = 1 cm, S = 1 cm²) : =A${k + 2}/10.`;
    }
    return true;
  }

  const MESURES = {
    id: "mesures", paillasse: 0, titre: "Six solutions de même concentration",
    objectif: "Mesurer la conductance et calculer la conductivité de six solutions à 5,0 mmol/L.",
    entetes: ["G (mS)", "σ (S/m)"],
    donnees: ["Toutes les solutions : C = 5,0 mmol/L = 5,0 mol/m³ ; cellule : L = 1 cm, S = 1 cm²"],
    conclusion: "À même concentration, les conductivités sont différentes : elles dépendent de la nature des ions. La solution d'acide chlorhydrique est de loin la plus conductrice, puis celles d'hydroxyde de sodium et de potassium.",
    conclusion_courte: "σ dépend de la nature des ions.",
    etapes: [
      { consigne: "Mesurez G pour les six solutions. Une ligne par solution, dans l'ordre NaCl, KCl, NaOH, KOH, HCl, NH₄Cl : en A, G (mS) ; en B, σ (S/m).", court: "Tableur : A, B.", aide_geste: "Touchez un flacon (le bécher est rincé) ; montez le plateau.", verifier: tableau },
      { consigne: "La solution la plus conductrice est…", court: "Répondez dans le carnet.", question: choix(["l'acide chlorhydrique (ions H₃O⁺)", "le chlorure de sodium", "le chlorure d'ammonium"], "Comparez la colonne B.", "Exact.") },
    ],
  };

  const LAMBDA = {
    id: "lambda", paillasse: 0, titre: "Conductivités molaires ioniques",
    objectif: "Comparer les solutions deux à deux (un ion commun) ; utiliser σ = Σ λi·[Xi].",
    entetes: [],
    donnees: ["λ à 25 °C (mS·m²/mol) : H₃O⁺ 34,98 ; HO⁻ 19,86 ; Na⁺ 5,01 ; K⁺ 7,35 ; NH₄⁺ 7,34 ; Cl⁻ 7,63", "σ en S/m ; λ en S·m²/mol ; [X] en mol/m³"],
    conclusion: "Chaque ion contribue à la conductivité : σ = Σ λi·[Xi]. Les différences σ(KCl) − σ(NaCl) et σ(KOH) − σ(NaOH) sont égales : elles valent (λ(K⁺) − λ(Na⁺))·C. Les ions H₃O⁺ et HO⁻ ont des conductivités molaires ioniques beaucoup plus grandes que les autres ions. Les valeurs mesurées sont un peu plus faibles que celles calculées avec les tables, établies pour une dilution infinie.",
    conclusion_courte: "σ = Σ λi·[Xi] ; λ(H₃O⁺) et λ(HO⁻) très grandes.",
    etapes: [
      { consigne: "Comparez σ(KCl) − σ(NaCl) et σ(KOH) − σ(NaOH) :", court: "Répondez dans le carnet.", question: choix(["elles sont égales : seul l'ion Na⁺ est remplacé par K⁺", "la première est deux fois plus grande", "elles sont de signes opposés"], "Calculez les deux différences.", "Exact : l'ion K⁺ conduit mieux que Na⁺.") },
      { consigne: "Déduisez-en λ(K⁺) − λ(Na⁺) = [σ(KCl) − σ(NaCl)] / C (en mS·m²/mol ; C en mol/m³) :", court: "Δλ (mS·m²/mol) ?", question: nombre("mS·m²/mol", 2.3, 0.3, "Δσ (S/m) / 5,0 (mol/m³), puis × 1000.", "Exact : la table donne 7,35 − 5,01 = 2,34.") },
      { consigne: "σ(NaOH) est plus grande que σ(NaCl) parce que…", court: "Répondez dans le carnet.", question: choix(["λ(HO⁻) est bien plus grande que λ(Cl⁻)", "NaOH est plus concentrée", "Na⁺ conduit mieux dans la soude"], "Ion commun : Na⁺.", "Exact.") },
      { consigne: "Calculez avec les tables σ(NaCl) à 5,0 mmol/L (S/m) :", court: "σ calculée (S/m) ?", question: nombre("S/m", 0.0632, 0.002, "σ = (λ(Na⁺) + λ(Cl⁻)) × C, λ en S·m²/mol, C = 5,0 mol/m³.", "Exact : 0,0632 S/m.") },
      { consigne: "La valeur mesurée est un peu plus faible, parce que…", court: "Répondez dans le carnet.", question: choix(["les λ des tables valent pour une dilution infinie ; à 5 mmol/L les ions se gênent un peu", "la cellule est mal réglée", "l'eau distillée ne conduit pas"], "Comparez avec la limite de l'étalonnage.", "Exact.") },
    ],
  };

  L.demarrer({ id: "b1_chim3_a3_ion_commun", titre: "Laboratoire : conductivités molaires ioniques", paillasses: [poste], missions: [MESURES, LAMBDA] });
})(window.Labo);
