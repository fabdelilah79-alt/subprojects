/*
Rôle : simulation de l'activité 2 du chapitre « Magnétisme » (1re année du bac) : champ magnétique créé par un courant
       dans un conducteur rectiligne, une spire, une bobine ; proportionnalité de B et de I ; règle de la main droite ;
       faces d'une bobine, comparaison avec un barreau aimanté. Objectif O3.
Reçoit : rien (les vérifications lisent les faits « fil », « bobine » et la feuille du tableur).
Produit : la simulation démarrée : conducteur rectiligne ; spire ; bobine.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const fil = (f) => f.fil || { vu: {}, points: {} }, bo = (f) => f.bobine || { vu: {}, points: {} }, mT = (x) => (x || 0) * 1000;
  const MU0 = 4e-7 * Math.PI;

  function colonnes(feuille, faits, [cx, cy], cle, nom) {
    // Lignes du tableur (cx, cy) qui correspondent chacune à une mesure faite ; au moins 4 valeurs différentes.
    const l = feuille.lignes([cx, cy]);
    if (l.length < 4) return false;
    for (const [k, r] of l.entries()) {
      const B = fil(faits).points[cle(r[cx])];
      if (B === undefined || Math.abs(r[cy] - mT(B)) > 0.0011 + 0.005 * mT(B)) return `Ligne ${k + 2} : ${nom}.`;
    }
    return new Set(l.map((r) => r[cx])).size >= 4 || "Quatre valeurs différentes.";
  }

  const FIL = {
    id: "fil", paillasse: 0, titre: "Champ d'un conducteur rectiligne",
    objectif: "Observer les lignes de champ autour d'un fil, le sens du champ ; mesurer B en fonction de I et de la distance.",
    entetes: ["I (A)", "B (mT) à 2 cm", "d (cm)", "B (mT) à 10 A"],
    conclusion: "Autour d'un conducteur rectiligne parcouru par un courant, les lignes de champ sont des cercles centrés sur le fil ; le sens du champ est donné par la règle de la main droite (le pouce dans le sens du courant, les doigts repliés indiquent le sens de B). En l'absence de milieu magnétique, B est proportionnel à I ; il diminue avec la distance d : B = 2×10⁻⁷·I/d (SI).",
    conclusion_courte: "B = 2×10⁻⁷·I/d ; B proportionnel à I.",
    etapes: [
      { consigne: "Fermez le circuit (I = 20 A), saupoudrez la limaille sur la plaque et tapotez.", court: "Limaille autour du fil.", aide_geste: "« Fermer / Ouvrir » sur le générateur ; « Limaille », puis « Tapoter ».", verifier: ({ faits }) => !!fil(faits).vu.lignes },
      { consigne: "Autour du fil, les lignes de champ sont…", court: "Répondez dans le carnet.", question: choix(["des cercles centrés sur le fil, dans un plan perpendiculaire au fil", "des droites qui partent du fil", "des droites parallèles au fil"], "Regardez la limaille près du fil.", "Exact.") },
      { consigne: "Placez la boussole à moins de 3 cm du fil (I ≥ 4 A), puis inversez le sens du courant.", court: "Boussole, puis courant inversé.", verifier: ({ faits }) => fil(faits).vu.sens1 && fil(faits).vu.sens2 },
      { consigne: "Le sens du champ autour du fil…", court: "Répondez dans le carnet.", question: choix(["change avec le sens du courant : il est donné par la règle de la main droite", "ne dépend pas du sens du courant", "est toujours dirigé vers le nord"], "Comparez l'aiguille pour les deux sens.", "Exact.") },
      { consigne: "Circuit ouvert, faites le zéro du teslamètre (il retranche le champ terrestre).", court: "Zéro du teslamètre.", verifier: ({ faits }) => !!fil(faits).zero_ok },
      { consigne: "Sonde à 2 cm du fil, mesurez B pour quatre intensités au moins (de 2 à 10 A). En A : I (A) ; en B : B (mT).", court: "Tableur : A, B.", verifier: ({ faits, feuille }) => colonnes(feuille, faits, ["A", "B"], (I) => `${I}:2`, "I en A et B en mT, mesuré à 2 cm du fil") },
      { consigne: "Le rapport B/I à 2 cm vaut…", court: "B/I (mT/A) ?", question: { type: "nombre", unite: "mT/A", attendu: 0.01, tolerance_relative: 0.05, aide: "Divisez B par I, ligne par ligne.", bravo: "Exact : B/I est constant, B est proportionnel à I." } },
      { consigne: "À I = 10 A, mesurez B à 1, 2, 3 et 4 cm du fil. En C : d (cm) ; en D : B (mT).", court: "Tableur : C, D.", verifier: ({ faits, feuille }) => colonnes(feuille, faits, ["C", "D"], (d) => `10:${d}`, "d en cm et B en mT, mesuré avec I = 10 A") },
      { consigne: "Que remarquez-vous en comparant B × d pour ces distances ?", court: "Répondez dans le carnet.", question: choix(["B × d est constant : B est inversement proportionnel à d (B = 2×10⁻⁷·I/d)", "B augmente avec d", "B ne dépend pas de d"], "Calculez B × d, ligne par ligne.", "Exact.") },
      { consigne: "Calculez B = 2×10⁻⁷·I/d pour I = 10 A et d = 5,0 cm.", court: "B (mT) ?", question: { type: "nombre", unite: "mT", attendu: 0.04, tolerance_relative: 0.02, aide: "d en mètres ; 1 T = 1000 mT.", bravo: "Exact : 4,0×10⁻⁵ T, comparable au champ terrestre." } },
    ],
  };

  const SPIRE = {
    id: "spire", paillasse: 1, titre: "Champ d'une spire",
    objectif: "Observer les lignes de champ d'une spire ; mesurer B en son centre.",
    entetes: [],
    donnees: ["Spire plate : N = 20 tours, R = 5,0 cm", "μ0 = 4π×10⁻⁷ SI"],
    conclusion: "Au centre d'une spire plate de N tours et de rayon R, le champ est perpendiculaire au plan de la spire et vaut B = μ0·N·I/(2R) : il est proportionnel à I.",
    conclusion_courte: "B = μ0·N·I/(2R) au centre.",
    etapes: [
      { consigne: "Fermez le circuit (spire, I = 4 A), saupoudrez la limaille et tapotez.", court: "Limaille, spire.", verifier: ({ faits }) => !!bo(faits).vu.lignes_spire },
      { consigne: "Circuit ouvert, faites le zéro du teslamètre. Puis mesurez B au centre de la spire pour I = 2 A, 4 A et 6 A.", court: "B au centre pour 2, 4, 6 A.", verifier: ({ faits }) => [2, 4, 6].every((I) => bo(faits).points[`spire:${I}`] !== undefined) || (bo(faits).zero_ok ? false : "Faites d'abord le zéro du teslamètre, circuit ouvert.") },
      { consigne: "Quand I double (de 2 à 4 A), B au centre…", court: "Répondez dans le carnet.", question: choix(["double : B est proportionnel à I", "est multiplié par 4", "ne change pas"], "Comparez vos mesures.", "Exact.") },
      { consigne: "Calculez B = μ0·N·I/(2R) pour I = 4 A.", court: "B (mT) ?", question: { type: "nombre", unite: "mT", attendu: (MU0 * 20 * 4) / (2 * 0.05) * 1000, tolerance_relative: 0.02, aide: "R en mètres.", bravo: "Exact : environ 1,0 mT ; comparez avec votre mesure." } },
    ],
  };

  const BOBINE = {
    id: "bobine", paillasse: 1, titre: "Champ d'une bobine",
    objectif: "Comparer les lignes de champ d'une bobine et d'un barreau aimanté ; trouver ses faces ; mesurer B au centre.",
    entetes: [],
    donnees: ["Bobine : N = 200 spires, longueur ℓ = 16 cm ; n = N/ℓ = 1250 spires/m", "μ0 = 4π×10⁻⁷ SI"],
    conclusion: "À l'intérieur d'une bobine longue, les lignes de champ sont parallèles à l'axe : le champ est uniforme et vaut B = μ0·n·I (n : nombre de spires par mètre). À l'extérieur, elles ressemblent à celles d'un barreau aimanté : la face d'où sortent les lignes est la face nord, l'autre la face sud ; elles s'échangent quand on inverse le courant.",
    conclusion_courte: "B = μ0·n·I ; faces nord et sud.",
    etapes: [
      { consigne: "Passez à la bobine (« Spire / Bobine »), fermez le circuit, saupoudrez la limaille et tapotez.", court: "Limaille, bobine.", verifier: ({ faits }) => !!bo(faits).vu.lignes_bobine },
      { consigne: "À l'intérieur de la bobine, les lignes de champ sont…", court: "Répondez dans le carnet.", question: choix(["parallèles à l'axe (champ uniforme) ; à l'extérieur, elles ressemblent à celles d'un barreau aimanté", "des cercles autour de l'axe", "absentes : le champ est nul dedans"], "Comparez avec la limaille autour d'un barreau aimanté.", "Exact.") },
      { consigne: "Placez la boussole devant la face avant de la bobine (I ≥ 2 A), puis inversez le courant.", court: "Boussole devant la face, courant inversé.", verifier: ({ faits }) => bo(faits).vu.face1 && bo(faits).vu.face2 },
      { consigne: "La face nord de la bobine est…", court: "Répondez dans le carnet.", question: choix(["la face d'où sortent les lignes de champ ; elle devient face sud quand on inverse le courant", "toujours la face avant", "la face la plus proche du générateur"], "Le pôle nord de l'aiguille s'éloigne d'une face nord.", "Exact.") },
      { consigne: "Après le zéro (circuit ouvert), mesurez B au centre de la bobine pour I = 2 A.", court: "B au centre, 2 A.", verifier: ({ faits }) => bo(faits).points["bobine:2"] !== undefined },
      { consigne: "Calculez B = μ0·n·I pour I = 2 A.", court: "B (mT) ?", question: { type: "nombre", unite: "mT", attendu: MU0 * 1250 * 2 * 1000, tolerance_relative: 0.02, aide: "n = 1250 spires par mètre.", bravo: "Exact : environ 3,1 mT ; votre mesure est un peu plus faible (bobine de longueur finie)." } },
    ],
  };

  L.demarrer({ id: "b1_elec3_a2_courants", titre: "Laboratoire : champ créé par un courant", decor: "aucun", paillasses: [L.poste_fil, L.poste_bobine], missions: [FIL, SPIRE, BOBINE] });
})(window.Labo);
