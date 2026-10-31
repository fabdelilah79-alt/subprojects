/*
Rôle : simulation de l'activité 2 du chapitre « Classification périodique des éléments » (tronc commun) : remplir la
       classification actuelle (Z ≤ 18) à partir des formules électroniques ; prévoir le nombre de liaisons et la charge
       des ions d'après la colonne ; écrire des formules de Lewis à l'aide de la classification. Objectifs O1, O2, O3, O4.
Reçoit : rien (les vérifications lisent les faits « periodique » et « lewis »).
Produit : la simulation démarrée : classification ; liaisons et formules.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const { molecule } = L.VERIF_LEWIS, I = L.indice;
  const GESTE = "Touchez un aimant de la réserve, puis un point du quadrillage. Touchez entre deux atomes pour une liaison, à côté d'un atome pour un doublet non liant.";
  const batir = (brute, texte) => ({ consigne: texte, court: `Construisez ${I(brute)}.`, aide_geste: GESTE, verifier: molecule(brute, true) });

  function rangees({ faits }) {
    // Les 18 cartes sont rangées dans la bonne case.
    const p = faits.periodique || {}, att = L.CARTES_PERIODIQUE, ids = Object.keys(att);
    if (Object.keys(p).length < ids.length) return false;
    const faux = ids.filter((s) => p[s] !== att[s]).length;
    return !faux || `${faux} carte${faux > 1 ? "s sont mal placées" : " est mal placée"} : une ligne par couche occupée, et dans une colonne le même nombre d'électrons externes.`;
  }

  const TABLEAU = {
    id: "tableau", paillasse: 0, titre: "La classification actuelle",
    objectif: "Ranger les 18 premiers éléments par Z croissant, d'après leur formule électronique.",
    entetes: [],
    conclusion: "Les éléments sont rangés par numéro atomique Z croissant. Une ligne (période) correspond à une couche électronique : les éléments de la 3e période ont des électrons sur K, L et M. Les éléments d'une même colonne ont le même nombre d'électrons sur leur couche externe (sauf l'hélium) : ils forment une famille. Colonne 1 : les alcalins (sauf H) ; colonne 17 : les halogènes ; colonne 18 : les gaz nobles.",
    conclusion_courte: "Période = couche ; colonne = électrons externes.",
    etapes: [
      { consigne: "Rangez les 18 cartes dans la classification : par Z croissant, une nouvelle ligne pour chaque nouvelle couche ; l'hélium va dans la colonne 18, avec les gaz nobles.", court: "Rangez les 18 cartes.", aide_geste: "Faites glisser chaque carte dans une case.", verifier: rangees },
      { consigne: "Le numéro de la période (ligne) d'un élément est…", court: "Répondez dans le carnet.", question: choix(["le nombre de couches électroniques occupées", "le nombre d'électrons externes", "son numéro atomique"], "Regardez les formules électroniques d'une même ligne.", "Exact.") },
      { consigne: "Les éléments d'une même colonne ont…", court: "Répondez dans le carnet.", question: choix(["le même nombre d'électrons sur leur couche externe", "la même masse", "le même nombre de couches"], "Comparez Li et Na, ou F et Cl.", "Exact : colonnes 1, 2 → 1, 2 électrons externes ; colonnes 13 à 18 → 3 à 8 (He : 2).") },
      { consigne: "Les familles des colonnes 1, 17 et 18 s'appellent…", court: "Répondez dans le carnet.", question: choix(["les alcalins (sauf H), les halogènes, les gaz nobles", "les halogènes, les alcalins, les gaz nobles", "les gaz nobles, les alcalins, les halogènes"], "Pensez à l'activité précédente.", "Exact.") },
      { consigne: "Le soufre est dans la 3e période, colonne 16. Combien d'électrons a-t-il sur sa couche externe ?", court: "Électrons externes du soufre ?", question: { type: "nombre", unite: "", attendu: 6, tolerance: 0, aide: "Colonne 13 : 3 électrons externes, colonne 14 : 4…", bravo: "Exact : (K)²(L)⁸(M)⁶." } },
    ],
  };

  const FORMULES = {
    id: "formules", paillasse: 1, titre: "Prévoir les liaisons et les ions",
    objectif: "Utiliser la position d'un élément pour prévoir le nombre de liaisons qu'il forme, la charge de son ion, et écrire des formules.",
    entetes: [],
    conclusion: "Un atome forme autant de liaisons qu'il lui manque d'électrons pour avoir l'octet (le duet pour H) : 4 pour les colonnes 14 (C, Si), 3 pour la colonne 15 (N, P), 2 pour la colonne 16 (O, S), 1 pour la colonne 17 (F, Cl). Les éléments des colonnes 1, 2, 13 donnent les ions M⁺, M²⁺, M³⁺ ; ceux des colonnes 16 et 17 donnent X²⁻ et X⁻. Deux éléments d'une même colonne forment des molécules de même formule : H₂O et H₂S, NH₃ et PH₃, CH₄ et SiH₄.",
    conclusion_courte: "Colonne 14 → 4 liaisons… 17 → 1 ; ions selon la colonne.",
    etapes: [
      { consigne: "Combien de liaisons covalentes forme un atome des colonnes 14, 15, 16, 17 ?", court: "Répondez dans le carnet.", question: choix(["14 : 4 ; 15 : 3 ; 16 : 2 ; 17 : 1", "14 : 1 ; 15 : 2 ; 16 : 3 ; 17 : 4", "toujours 2"], "Il en forme autant qu'il lui manque d'électrons pour avoir 8 électrons externes.", "Exact.") },
      { consigne: "Quelle charge ont les ions monoatomiques des colonnes 1, 2, 13, 16, 17 ?", court: "Répondez dans le carnet.", question: choix(["+1, +2, +3, −2, −1", "−1, −2, −3, +2, +1", "+1, +1, +1, −1, −1"], "Perdre ses électrons externes, ou gagner ceux qui manquent pour l'octet.", "Exact : Na⁺, Mg²⁺, Al³⁺, O²⁻, Cl⁻.") },
      batir("H2S", "Le soufre est sous l'oxygène : représentez la molécule de sulfure d'hydrogène H₂S."),
      batir("PH3", "Le phosphore est sous l'azote : représentez la phosphine PH₃."),
      batir("SiH4", "Le silicium est sous le carbone : représentez le silane SiH₄."),
      batir("CCl4", "Représentez le tétrachlorométhane CCl₄."),
      { consigne: "Le magnésium (colonne 2) et le chlore (colonne 17) forment le chlorure de magnésium, de formule…", court: "Répondez dans le carnet.", question: choix(["MgCl₂ (un ion Mg²⁺ pour deux ions Cl⁻)", "MgCl", "Mg₂Cl"], "Le composé est électriquement neutre.", "Exact.") },
    ],
  };

  L.demarrer({ id: "tc_chim6_a2_tableau", titre: "Laboratoire : utiliser la classification périodique", paillasses: [L.poste_tableau, L.poste_formules], missions: [TABLEAU, FORMULES] });
})(window.Labo);
