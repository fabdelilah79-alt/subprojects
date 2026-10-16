/*
Rôle : simulation de l'activité 2 du chapitre « Tension électrique » (tronc commun) : différence de potentiel.
       Objectif O2 (U_AB = V_A − V_B) : potentiels mesurés par rapport à un point de référence (la masse), tension
       entre deux points égale à la différence de leurs potentiels, indépendante de la référence choisie.
Reçoit : rien (les vérifications lisent les mesures du voltmètre et la feuille du tableur).
Produit : la simulation démarrée : une paillasse (générateur, plaquette de résistances A-B-C-D, voltmètre).
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const t = (faits) => faits.tensions || {};
  const proche = (a, b) => typeof a === "number" && typeof b === "number" && Math.abs(a - b) <= 0.015;
  const mesurees = (faits, noms) => noms.every((k) => typeof t(faits)[k] === "number") || false;

  function ligne(feuille, attendus, messages) {
    // Compare la ligne 2 du tableur aux valeurs attendues (colonne par colonne).
    const cols = "ABCD".slice(0, attendus.length).split(""), l = feuille.lignes(cols)[0];
    if (!l) return false;
    for (const [k, col] of cols.entries()) if (!proche(l[col], attendus[k])) return messages[k];
    return true;
  }

  const POTENTIELS = {
    id: "potentiels", paillasse: 0, titre: "Le potentiel d'un point",
    objectif: "On choisit un point de référence, la masse, de potentiel nul. Le potentiel d'un point est la tension entre ce point et la masse.",
    entetes: ["VA (V)", "VB (V)", "VC (V)", "VD (V)"],
    conclusion: "On choisit un point de référence, la masse, de potentiel nul. Le potentiel V_{A} d'un point A est la tension entre A et la masse : avec la masse en D, V_{A} = U_{AD}.",
    conclusion_courte: "V_{A} = U_{AD} (masse en D).",
    etapes: [
      { consigne: "Alimentez la plaquette : reliez P à A et D à N.", court: "Reliez P à A et D à N.", verifier: ({ faits }) => faits.plaquette_alimentee || false, aide_geste: "Tirez un fil d'une borne à l'autre." },
      { consigne: "D est le point de référence (la masse). Réglez le multimètre sur V⎓ 20, branchez sa borne COM sur D et ne la bougez plus. Avec la borne VΩ, mesurez U_{AD}, U_{BD} et U_{CD}.", court: "COM sur D ; mesurez UAD, UBD, UCD.", verifier: ({ faits }) => mesurees(faits, ["AD", "BD", "CD"]), aide_geste: "Déplacez seulement le fil branché sur la borne VΩ." },
      { consigne: "Dans le tableur, écrivez les potentiels : V_{A} en A2, V_{B} en B2, V_{C} en C2, V_{D} en D2.", court: "Tableur : VA, VB, VC, VD.", verifier: ({ feuille, faits }) => ligne(feuille, [t(faits).AD, t(faits).BD, t(faits).CD, 0], ["A2 : V_{A} = U_{AD}.", "B2 : V_{B} = U_{BD}.", "C2 : V_{C} = U_{CD}.", "D2 : le potentiel de la masse est nul."]) },
      { consigne: "Le potentiel d'un point, c'est…", court: "Répondez dans le carnet.", question: choix(["la tension entre ce point et le point de référence (la masse)", "l'intensité du courant en ce point", "la tension aux bornes du générateur"], "Où était branchée la borne COM ?", "Exact.") },
    ],
  };

  const DIFFERENCE = {
    id: "difference", paillasse: 0, titre: "La tension, différence de potentiel",
    objectif: "Comparer la tension U_{AB}, mesurée directement, à la différence des potentiels V_{A} − V_{B}.",
    entetes: ["UAB (V)", "VA − VB (V)", "UBC (V)", "VB − VC (V)"],
    conclusion: "La tension entre deux points est la différence de leurs potentiels : U_{AB} = V_{A} − V_{B}. Elle est algébrique : U_{BA} = −U_{AB}.",
    conclusion_courte: "U_{AB} = V_{A} − V_{B}.",
    etapes: [
      { consigne: "Mesurez directement U_{AB} (VΩ sur A, COM sur B), puis U_{BC} (VΩ sur B, COM sur C).", court: "Mesurez UAB et UBC.", verifier: ({ faits }) => mesurees(faits, ["AB", "BC"]) },
      { consigne: "Dans le tableur : U_{AB} mesurée en A2, V_{A} − V_{B} calculée en B2, U_{BC} en C2, V_{B} − V_{C} en D2 (potentiels de la mission précédente).", court: "Tableur : UAB, VA − VB, UBC, VB − VC.", verifier: ({ feuille, faits }) => { const v = t(faits); return ligne(feuille, [v.AB, v.AD - v.BD, v.BC, v.BD - v.CD], ["A2 : la tension U_{AB} lue.", "B2 : V_{A} − V_{B}, avec les potentiels mesurés (masse en D).", "C2 : la tension U_{BC} lue.", "D2 : V_{B} − V_{C}."]); } },
      { consigne: "On constate que…", court: "Répondez dans le carnet.", question: choix(["U_{AB} = V_{A} − V_{B}", "U_{AB} = V_{A} + V_{B}", "U_{AB} = V_{B} − V_{A}"], "Comparez les colonnes A et B.", "Exact : la tension est une différence de potentiel.") },
      { consigne: "Un point E a pour potentiel V_{E} = 8,0 V et un point F, V_{F} = 3,0 V. Que vaut U_{FE} (en V) ?", court: "UFE (V) ?", question: { type: "nombre", unite: "V", attendu: -5, tolerance: 0.05, aide: "U_{FE} = V_{F} − V_{E}.", bravo: "Exact : U_{FE} = −5,0 V = −U_{EF}." } },
    ],
  };

  const REFERENCE = {
    id: "reference", paillasse: 0, titre: "Changer de point de référence",
    objectif: "Si l'on choisit une autre masse, que deviennent les potentiels ? Et les tensions ?",
    entetes: [],
    conclusion: "Le potentiel d'un point dépend du point de référence choisi ; la tension entre deux points n'en dépend pas.",
    conclusion_courte: "Les potentiels dépendent de la masse ; les tensions, non.",
    etapes: [
      { consigne: "Prenez maintenant C comme masse : branchez la borne COM sur C et mesurez U_{AC}, U_{BC} et U_{DC}.", court: "COM sur C ; mesurez UAC, UBC, UDC.", verifier: ({ faits }) => mesurees(faits, ["AC", "BC", "DC"]) },
      { consigne: "Avec la masse en C, le potentiel de D est…", court: "Répondez dans le carnet.", question: choix(["négatif : V_{D} = U_{DC} < 0", "toujours nul", "égal à 12 V"], "Regardez le signe de U_{DC}.", "Exact : D est à un potentiel plus bas que C.") },
      { consigne: "Avec la masse en C, calculez U_{AB} = V_{A} − V_{B} (en V).", court: "UAB avec la masse en C (V) ?", question: { type: "nombre", unite: "V", attendu: (faits) => (t(faits).AC || 0) - (t(faits).BC || 0), tolerance: 0.015, aide: "Avec la masse en C : V_{A} = U_{AC} et V_{B} = U_{BC}.", bravo: "Exact : c'est la même valeur qu'avec la masse en D." } },
      { consigne: "Quand on change de point de référence…", court: "Répondez dans le carnet.", question: choix(["les potentiels changent, mais les tensions entre deux points restent les mêmes", "les potentiels et les tensions changent", "rien ne change"], "Comparez V_{A} et U_{AB} avec les deux masses.", "Exact.") },
    ],
  };

  L.demarrer({ id: "tc_elec2_a2_potentiel", titre: "Laboratoire : la différence de potentiel", decor: "aucun", paillasses: [L.poste_potentiel], missions: [POTENTIELS, DIFFERENCE, REFERENCE] });
})(window.Labo);
