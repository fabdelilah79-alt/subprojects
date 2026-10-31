/*
Rôle : simulation de l'activité 2 du chapitre « Modèle de l'atome » (tronc commun) : constituants de l'atome et symbole
       ᴬ_ZX sur un tableau magnétique, ions et isotopes ; calcul de la masse d'atomes (la masse est dans le noyau) et
       nombre d'atomes d'un cylindre de cuivre pesé ; répartition des électrons sur les couches K, L, M. Objectifs O2, O3,
       O4, O5. On dit « nombre de nucléons » A (et non « nombre de masse »).
Reçoit : rien (les vérifications lisent les faits des paillasses).
Produit : la simulation démarrée : constituants ; masse ; couches électroniques.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const { construit, masses, pesee_cuivre, N_cuivre } = L.VERIF_ATOME;
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const construire = (texte, court, Z, A, e, couches) => ({ consigne: texte, court, aide_geste: "Glissez les aimants depuis les réserves ; touchez une réserve de protons ou de neutrons pour en ajouter un au noyau, ou touchez une couche pour y poser un électron. « Tout ranger » vide le tableau.", verifier: construit(Z, A, e, couches) });

  const CONSTITUANTS = {
    id: "constituants", paillasse: 0, titre: "Constituants de l'atome",
    objectif: "Construire des atomes à partir de leur symbole ᴬ_ZX : Z protons et A − Z neutrons dans le noyau, Z électrons autour.",
    entetes: [],
    conclusion: "Dans le symbole ᴬ_ZX, Z est le numéro atomique (nombre de protons) et A le nombre de nucléons (protons + neutrons) ; le noyau contient N = A − Z neutrons. L'atome a Z électrons : il est neutre. Un ion monoatomique a gagné ou perdu des électrons ; des isotopes ont le même Z et des A différents. Z caractérise l'élément chimique.",
    conclusion_courte: "ᴬ_ZX : Z protons, A − Z neutrons, Z électrons.",
    etapes: [
      construire("Construisez l'atome de carbone ¹²₆C : protons et neutrons dans le noyau, électrons sur les couches.", "Construisez ¹²₆C.", 6, 12),
      { consigne: "Dans le symbole ¹²₆C, le nombre 12 est…", court: "Répondez dans le carnet.", question: choix(["le nombre de nucléons A : protons + neutrons", "le nombre de neutrons", "le nombre d'électrons"], "Comptez les aimants du noyau.", "Exact : A = Z + N, avec N = 6 neutrons.") },
      { consigne: "La charge du noyau de carbone et celle de l'atome sont…", court: "Répondez dans le carnet.", question: choix(["noyau : +6e ; atome : 0", "noyau : 0 ; atome : +6e", "noyau : +12e ; atome : +6e"], "Seuls les protons (+e) et les électrons (−e) sont chargés.", "Exact : les 6 électrons (−6e) compensent les 6 protons.") },
      construire("Touchez « Tout ranger », puis construisez l'atome de sodium ²³₁₁Na : remplissez les couches dans l'ordre.", "Construisez ²³₁₁Na.", 11, 23, 11, true),
      construire("Retirez l'électron de la couche externe (M) : glissez-le hors de l'atome.", "Retirez l'électron externe.", 11, 23, 10, true),
      { consigne: "Vous avez obtenu une entité de 11 protons et 10 électrons. C'est…", court: "Répondez dans le carnet.", question: choix(["l'ion sodium Na⁺, de charge +e", "l'ion Na⁻, de charge −e", "un atome de néon (10 électrons)"], "Le noyau n'a pas changé : comparez le nombre de charges + et −.", "Exact : un ion monoatomique se forme quand un atome perd ou gagne des électrons ; son noyau ne change pas, c'est toujours l'élément sodium (Z = 11).") },
      { consigne: "Un atome a 11 protons et 13 neutrons. C'est…", court: "Répondez dans le carnet.", question: choix(["un isotope du sodium : ²⁴₁₁Na", "un atome de magnésium", "un ion sodium"], "Quel nombre caractérise l'élément ?", "Exact : même Z, donc même élément ; les isotopes diffèrent par leur nombre de neutrons.") },
    ],
  };

  const MASSE = {
    id: "masse", paillasse: 1, titre: "La masse d'un atome",
    objectif: "Calculer la masse de quelques atomes et la comparer à celle de leur noyau ; estimer le nombre d'atomes d'un objet.",
    entetes: ["Z", "A", "m atome (kg)", "m noyau / m atome"],
    donnees: ["Atomes : ¹H, ¹²C, ²⁷Al, ⁶³Cu", "Écriture : 1,673E-27 pour 1,673 × 10^{-27}"],
    conclusion: "La masse d'un atome vaut m = Z·m_p + (A − Z)·m_n + Z·m_e ; celle de ses électrons est négligeable : la masse de l'atome est concentrée dans son noyau. Un objet de quelques dizaines de grammes contient environ 10²³ atomes.",
    conclusion_courte: "Masse de l'atome ≈ masse du noyau.",
    etapes: [
      { consigne: "Pour ¹H, ¹²C, ²⁷Al et ⁶³Cu : Z en A, A en B, la masse de l'atome en C (lisez la fiche au mur), et en D la masse du noyau divisée par celle de l'atome.", court: "4 atomes : Z, A, m, m noyau / m.", verifier: masses, aide_geste: "Exemple de formule en C2 : =A2*1,673E-27+(B2-A2)*1,675E-27+A2*9,11E-31. Puis « Recopier vers le bas »." },
      { consigne: "Le rapport m noyau / m atome est très proche de 1 pour tous les atomes. On en déduit que…", court: "Répondez dans le carnet.", question: choix(["la masse de l'atome est presque toute dans son noyau", "les électrons sont plus lourds que les nucléons", "le noyau ne contient rien"], "Comparez la masse des électrons à celle du noyau.", "Exact : les électrons pèsent moins de 0,03 % de l'atome.") },
      { consigne: "Allumez la balance (touche I/O), puis posez le cylindre de cuivre sur le plateau et attendez que la mesure soit stable.", court: "Pesez le cylindre de cuivre.", verifier: pesee_cuivre },
      { consigne: "Combien d'atomes de cuivre (⁶³Cu) ce cylindre contient-il ? Divisez sa masse (en kg) par la masse d'un atome.", court: "Nombre d'atomes du cylindre ?", question: { type: "nombre", unite: "atomes", attendu: N_cuivre, tolerance_relative: 0.03, aide: "Convertissez la masse en kg (54,05 g = 0,05405 kg), puis divisez par la masse de l'atome de cuivre (ligne 5 de votre tableau).", bravo: "Exact : environ 5 × 10²³ atomes dans un petit cylindre !" } },
    ],
  };

  const COUCHES = {
    id: "couches", paillasse: 0, titre: "Répartition des électrons",
    objectif: "Répartir les électrons sur les couches K, L, M, écrire la formule électronique, repérer la couche externe.",
    entetes: [],
    conclusion: "Les électrons se répartissent sur des couches, dans l'ordre K, L, M (au plus 2 sur K, 8 sur L, 8 sur M pour Z ≤ 18). Formule électronique : (K)²(L)⁸(M)⁷ pour le chlore. La dernière couche occupée est la couche externe ; les autres sont des couches internes. Les électrons de la couche externe sont les moins liés au noyau.",
    conclusion_courte: "K ≤ 2, L ≤ 8, M ≤ 8 ; couche externe.",
    etapes: [
      construire("Touchez « Tout ranger », puis construisez l'atome d'oxygène ¹⁶₈O, en remplissant les couches dans l'ordre K, L, M.", "Construisez ¹⁶₈O.", 8, 16, 8, true),
      { consigne: "La formule électronique de l'oxygène est…", court: "Répondez dans le carnet.", question: choix(["(K)²(L)⁶", "(K)⁴(L)⁴", "(K)²(L)⁴(M)²"], "Comptez les électrons de chaque couche.", "Exact.") },
      construire("Construisez l'atome de chlore ³⁵₁₇Cl (couches remplies dans l'ordre).", "Construisez ³⁵₁₇Cl.", 17, 35, 17, true),
      { consigne: "Pour le chlore, (K)²(L)⁸(M)⁷, la couche externe est…", court: "Répondez dans le carnet.", question: choix(["la couche M, avec 7 électrons", "la couche K, avec 2 électrons", "la couche L, avec 8 électrons"], "La couche externe est la dernière couche occupée.", "Exact : K et L sont des couches internes. Les électrons de la couche externe, les plus éloignés du noyau, sont les moins liés : ce sont eux qui interviennent dans les transformations chimiques.") },
      { consigne: "La formule électronique de l'aluminium (Z = 13) est…", court: "Répondez dans le carnet.", question: choix(["(K)²(L)⁸(M)³", "(K)²(L)¹¹", "(K)³(L)⁸(M)²"], "K : 2 au plus, L : 8 au plus.", "Exact : 3 électrons sur la couche externe M.") },
    ],
  };

  L.demarrer({ id: "tc_chim4_a2_masse", titre: "Laboratoire : constituants et masse des atomes", paillasses: [L.poste_atome, L.poste_masse], missions: [CONSTITUANTS, MASSE, COUCHES] });
})(window.Labo);
