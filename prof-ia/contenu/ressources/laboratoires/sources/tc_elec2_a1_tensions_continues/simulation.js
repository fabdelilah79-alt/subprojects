/*
Rôle : simulation de l'activité 1 du chapitre « Tension électrique » (tronc commun) : mesures de tensions continues.
       Objectifs O1 (tension, grandeur algébrique représentée par une flèche ; voltmètre), O3 (additivité des tensions
       en série, égalité en dérivation) et O4 (résultat avec son incertitude et le bon nombre de chiffres significatifs).
Reçoit : rien (les vérifications lisent les mesures du voltmètre et la feuille du tableur).
Produit : la simulation démarrée : paillasse « série », paillasse « dérivation ».
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const T = (faits) => faits.tension || {};
  const lu = (faits, nom) => T(faits).nom === nom;
  const proche = (a, b) => typeof a === "number" && typeof b === "number" && Math.abs(a - b) <= 0.015;

  function tableau(cle, colonnes) {
    // Ligne 2 du tableur : les tensions mesurées (V) dans l'ordre des colonnes, puis, en dernière colonne, une somme.
    return ({ feuille, faits }) => {
      const t = faits[cle] || {}, l = feuille.lignes(["A", "B", "C"])[0];
      if (!l) return false;
      for (const [k, nom] of colonnes.entries()) if (!proche(l["ABC"[k]], t[nom])) return `${"ABC"[k]}2 : écrivez la tension U${nom} mesurée (en V).`;
      return true;
    };
  }

  const VOLTMETRE = {
    id: "voltmetre", paillasse: 0, titre: "Le voltmètre et la tension",
    objectif: "Mesurer la tension aux bornes du générateur, et comprendre son signe.",
    entetes: [],
    conclusion: "La tension se mesure avec un voltmètre branché en dérivation. C'est une grandeur algébrique : U_{NP} = −U_{PN}. U_{PN} est représentée par une flèche qui pointe vers P. On choisit le plus petit calibre supérieur à la valeur, et on donne le résultat avec son incertitude : U_{PN} = (6,00 ± 0,05) V.",
    conclusion_courte: "U_{NP} = −U_{PN} ; résultat ± incertitude.",
    etapes: [
      { consigne: "Tournez le commutateur sur V⎓ 20 et branchez le multimètre aux bornes du générateur : la borne VΩ sur P, la borne COM sur N.", court: "Voltmètre : VΩ sur P, COM sur N.", verifier: ({ faits }) => (lu(faits, "PN") && T(faits).valeur > 5) || false, aide_geste: "Touchez le repère « 20 » du groupe V⎓, puis tirez deux fils." },
      { consigne: "Le voltmètre est branché…", court: "Répondez dans le carnet.", question: choix(["en dérivation : ses deux bornes sont reliées aux deux bornes du dipôle", "en série, dans la boucle du circuit", "sur une seule borne du générateur"], "Combien de fils relient le voltmètre au générateur ?", "Exact.") },
      { consigne: "Échangez les deux fils du voltmètre : VΩ sur N, COM sur P.", court: "Échangez les fils du voltmètre.", verifier: ({ faits }) => (lu(faits, "NP") && T(faits).valeur < -5) || false },
      { consigne: "Le voltmètre affiche maintenant U_{NP}. On en déduit que…", court: "Répondez dans le carnet.", question: choix(["U_{NP} = −U_{PN} : la tension est une grandeur algébrique", "U_{NP} = U_{PN}", "le voltmètre est mal réglé"], "Comparez les deux affichages.", "Exact.") },
      { consigne: "Sur un schéma, la tension U_{PN} est représentée par une flèche dessinée à côté du générateur…", court: "Répondez dans le carnet.", question: choix(["dont la pointe est dirigée vers P", "dont la pointe est dirigée vers N", "sur le fil, dans le sens du courant"], "La pointe de la flèche U_{XY} est dirigée vers le premier point, X.", "Exact.") },
      { consigne: "Rebranchez VΩ sur P et COM sur N, puis tournez le commutateur sur V⎓ 2.", court: "UPN sur le calibre 2 V.", verifier: ({ faits }) => (faits.voltmetre && faits.voltmetre.mode === "2V" && faits.voltmetre.depasse) || false },
      { consigne: "L'écran n'affiche qu'un « 1 ». Pour mesurer U_{PN}, le meilleur calibre est…", court: "Répondez dans le carnet.", question: choix(["20 V : le plus petit calibre supérieur à la tension", "200 V : le plus grand", "2 V : le plus précis"], "Le calibre doit être supérieur à la valeur mesurée.", "Exact : remettez le calibre 20 V.") },
      { consigne: "Sur le calibre 20 V, la notice donne : ±(0,5 % de la lecture + 2 unités du dernier chiffre). Le dernier chiffre est celui des centièmes de volt. Calculez l'incertitude ΔU sur votre mesure de U_{PN} (en V).", court: "Incertitude ΔU (V) ?", question: { type: "nombre", unite: "V", attendu: (faits) => 0.005 * Math.abs((faits.tension || {}).valeur || 6) + 0.02, tolerance: 0.006, aide: "ΔU = 0,005 × U + 2 × 0,01 V.", bravo: "Exact : ΔU ≈ 0,05 V." } },
      { consigne: "Comment écrire correctement le résultat ?", court: "Répondez dans le carnet.", question: choix(["U_{PN} = (6,00 ± 0,05) V", "U_{PN} = (6 ± 0,05) V", "U_{PN} = 6,0000 V"], "Le résultat et son incertitude s'arrêtent au même rang (les centièmes) : 3 chiffres significatifs.", "Exact.") },
    ],
  };

  const ADDITIVITE = {
    id: "additivite", paillasse: 0, titre: "Les tensions dans un circuit en série",
    objectif: "Comment la tension du générateur se répartit-elle entre deux lampes en série ?",
    entetes: ["UPN (V)", "UAB (V)", "UCD (V)", "UAB + UCD (V)"],
    conclusion: "Loi d'additivité des tensions : dans un circuit en série, U_{PN} = U_{AB} + U_{CD}. Interrupteur ouvert, aucun courant ne circule, mais la tension à ses bornes est égale à celle du générateur.",
    conclusion_courte: "En série : U_{PN} = U_{AB} + U_{CD}.",
    etapes: [
      { consigne: "Réalisez le circuit en série : P vers E, F vers A (lampe L1), B vers C (lampe L2), D vers N. Fermez l'interrupteur.", court: "Circuit P-E, F-A, B-C, D-N ; fermez K.", verifier: ({ faits }) => faits.serie_fermee || false, aide_geste: "Les deux lampes doivent briller (L2 faiblement)." },
      { consigne: "Mesurez U_{PN}, U_{AB} (aux bornes de L1) et U_{CD} (aux bornes de L2), interrupteur fermé.", court: "Mesurez UPN, UAB, UCD.", verifier: ({ faits }) => { const t = faits.tensions_ferme || {}; return ["PN", "AB", "CD"].every((k) => typeof t[k] === "number") || false; }, aide_geste: "VΩ sur la première lettre, COM sur la seconde." },
      { consigne: "Dans le tableur : U_{PN} en A2, U_{AB} en B2, U_{CD} en C2 ; calculez U_{AB} + U_{CD} en D2.", court: "Tableur : UPN, UAB, UCD, somme.", verifier: ({ feuille, faits }) => { const r = tableau("tensions_ferme", ["PN", "AB", "CD"])({ feuille, faits }); if (r !== true) return r; const l = feuille.lignes(["A", "B", "C", "D"])[0]; return (l && Math.abs(l.D - (l.B + l.C)) < 0.005) || "En D2, calculez la somme (par exemple =B2+C2)."; } },
      { consigne: "Comparez U_{PN} et U_{AB} + U_{CD}. Dans un circuit en série…", court: "Répondez dans le carnet.", question: choix(["la tension du générateur est égale à la somme des tensions aux bornes des lampes", "chaque lampe reçoit toute la tension du générateur", "la tension est la même aux bornes de chaque lampe"], "Comparez les colonnes A et D.", "Exact : c'est la loi d'additivité des tensions.") },
      { consigne: "Ouvrez l'interrupteur et mesurez la tension U_{EF} à ses bornes.", court: "K ouvert : mesurez UEF.", verifier: ({ faits }) => (faits.tensions_ouvert && Math.abs(faits.tensions_ouvert.EF || 0) > 5) || false },
      { consigne: "Interrupteur ouvert, aucun courant ne circule, et pourtant…", court: "Répondez dans le carnet.", question: choix(["la tension aux bornes de l'interrupteur ouvert est égale à celle du générateur", "la tension est nulle partout, puisqu'il n'y a pas de courant", "la tension aux bornes des lampes est égale à celle du générateur"], "Une tension peut exister sans courant.", "Exact : U_{EF} = U_{PN}, et U_{AB} = U_{CD} = 0.") },
    ],
  };

  const DERIVATION = {
    id: "derivation", paillasse: 1, titre: "Les tensions en dérivation",
    objectif: "Deux lampes en dérivation aux bornes du générateur : quelles tensions reçoivent-elles ?",
    entetes: ["UPN (V)", "UAB (V)", "UCD (V)"],
    conclusion: "Les tensions aux bornes de dipôles montés en dérivation sont égales : U_{AB} = U_{CD} = U_{PN}.",
    conclusion_courte: "En dérivation : U_{AB} = U_{CD} = U_{PN}.",
    etapes: [
      { consigne: "Montez L1 (A, B) et L2 (C, D) en dérivation aux bornes du générateur, avec l'interrupteur dans la branche principale. Fermez l'interrupteur : les deux lampes brillent normalement.", court: "L1 et L2 en dérivation ; fermez K.", verifier: ({ faits }) => faits.derivation_fermee || false, aide_geste: "Deux fiches peuvent s'empiler sur une même borne." },
      { consigne: "Mesurez U_{PN}, U_{AB} et U_{CD}.", court: "Mesurez UPN, UAB, UCD.", verifier: ({ faits }) => { const t = faits.tensions_derivation || {}; return ["PN", "AB", "CD"].every((k) => typeof t[k] === "number") || false; } },
      { consigne: "Dans le tableur : U_{PN} en A2, U_{AB} en B2, U_{CD} en C2.", court: "Tableur : UPN, UAB, UCD.", verifier: tableau("tensions_derivation", ["PN", "AB", "CD"]) },
      { consigne: "Pour deux lampes montées en dérivation…", court: "Répondez dans le carnet.", question: choix(["les tensions à leurs bornes sont égales, et égales à U_{PN}", "les tensions s'additionnent : U_{PN} = U_{AB} + U_{CD}", "la lampe la plus brillante reçoit la plus grande tension"], "Comparez les trois colonnes.", "Exact.") },
    ],
  };

  L.demarrer({ id: "tc_elec2_a1_tensions_continues", titre: "Laboratoire : mesurer des tensions continues", decor: "aucun", paillasses: [L.poste_tension_serie, L.poste_tension_derivation], missions: [VOLTMETRE, ADDITIVITE, DERIVATION] });
})(window.Labo);
