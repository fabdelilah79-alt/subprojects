/*
Rôle : simulation de l'activité 2 du chapitre « Courant électrique continu » (tronc commun) : nature du courant dans les
       métaux et les électrolytes. Objectifs O3 (sens conventionnel ; électrons dans les métaux, ions dans les électrolytes)
       et O4 (Q = n·e, I = Q/Δt et leurs unités).
Reçoit : rien (les vérifications lisent le circuit, le multimètre, la loupe et le tube en U).
Produit : la simulation démarrée : paillasse lampe-DEL, paillasse d'électrolyse.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const nombre = (attendu, aide, bravo) => ({ type: "nombre", unite: "", attendu, tolerance_relative: 0.03, aide, bravo });
  const circuit = (faits) => faits.circuit || {};
  const I = (faits) => Math.abs((faits.mesure || {}).valeur || 0);

  const SENS = {
    id: "sens", paillasse: 0, titre: "Le sens du courant",
    objectif: "Le courant électrique a-t-il un sens ? Une DEL va nous le dire.",
    entetes: [],
    conclusion: "Le courant électrique a un sens. Par convention, à l'extérieur du générateur, il va de la borne + vers la borne −.",
    conclusion_courte: "Sens conventionnel : de + vers − hors du générateur.",
    etapes: [
      { consigne: "Avec les fils, réalisez un circuit en série : générateur, interrupteur, lampe et DEL (borne + de la DEL du côté de la borne + du générateur). Fermez l'interrupteur.", court: "Circuit en série avec la DEL, puis fermez K.", verifier: ({ faits }) => { const c = circuit(faits); return (c.ferme && c.del_allumee && c.eclat > 0.02 && Math.abs(c.i_lampe - c.i_del) < 5e-4) || false; }, aide_geste: "Tirez un fil depuis une borne et lâchez-le sur une autre. Touchez l'interrupteur pour le fermer." },
      { consigne: "Échangez les deux fils branchés sur la DEL, l'interrupteur restant fermé.", court: "Échangez les fils de la DEL.", verifier: ({ faits }) => circuit(faits).del_inverse || false, aide_geste: "Tirez un fil près de sa fiche pour le débrancher, puis lâchez-le sur l'autre borne." },
      { consigne: "Branchée à l'envers, la DEL ne s'allume pas. Cela montre que…", court: "Répondez dans le carnet.", question: choix(["le courant électrique a un sens", "la DEL est grillée", "le générateur ne fonctionne plus"], "Remettez la DEL dans le bon sens : que se passe-t-il ?", "Exact.") },
      { consigne: "La lampe s'est éteinte, elle aussi. Pourquoi ?", court: "Répondez dans le carnet.", question: choix(["la DEL bloquée empêche le courant de passer dans tout le circuit en série", "la lampe ne laisse passer le courant que dans un sens", "la lampe a grillé"], "Dans un circuit en série, il n'y a qu'un seul chemin.", "Exact.") },
      { consigne: "Par convention, à l'extérieur du générateur, le courant circule…", court: "Répondez dans le carnet.", question: choix(["de la borne + vers la borne −", "de la borne − vers la borne +", "dans les deux sens à la fois"], "La DEL brille quand sa borne + est du côté de la borne + du générateur.", "Exact : c'est le sens conventionnel.") },
    ],
  };

  const METAL = {
    id: "metal", paillasse: 0, titre: "Le courant dans un métal",
    objectif: "Que se passe-t-il dans un fil de cuivre quand le courant passe ?",
    entetes: [],
    conclusion: "Dans un métal, le courant est un déplacement d'ensemble d'électrons libres, en sens inverse du sens conventionnel.",
    conclusion_courte: "Métal : électrons libres, sens inverse de I.",
    etapes: [
      { consigne: "Fermez le circuit de la lampe (avec ou sans la DEL dans le bon sens) et promenez la loupe sur un fil.", court: "La loupe sur un fil, circuit fermé.", verifier: ({ faits }) => (faits.loupe_fil && faits.loupe_fil.courant) || false, aide_geste: "La loupe est accrochée au mur : faites-la glisser sur un fil." },
      { consigne: "Dans le fil de cuivre, les électrons libres se déplacent…", court: "Répondez dans le carnet.", question: choix(["en sens inverse du sens conventionnel du courant (flèche I)", "dans le sens de la flèche I", "ils ne bougent pas"], "Comparez le mouvement des petits ronds bleus à la flèche rouge I.", "Exact : ils vont vers la borne + du générateur.") },
      { consigne: "Ouvrez l'interrupteur et regardez de nouveau le fil à la loupe.", court: "Ouvrez K, puis la loupe sur un fil.", verifier: ({ faits }) => (faits.loupe_fil && !faits.loupe_fil.courant && !circuit(faits).ferme) || false },
      { consigne: "Circuit ouvert, les électrons libres du cuivre…", court: "Répondez dans le carnet.", question: choix(["s'agitent sans avancer : il n'y a pas de courant", "ont disparu", "avancent plus vite"], "Ils sont toujours là, mais avancent-ils ?", "Exact.") },
      { consigne: "Le courant électrique dans un métal est…", court: "Répondez dans le carnet.", question: choix(["un déplacement d'ensemble d'électrons libres", "un déplacement des ions positifs du métal", "un déplacement d'ions dans l'air"], "Qu'est-ce qui bouge dans la loupe ?", "Exact.") },
    ],
  };

  const INTENSITE = {
    id: "intensite", paillasse: 0, titre: "Intensité et quantité d'électricité",
    objectif: "L'ampèremètre mesure l'intensité I : la quantité d'électricité qui traverse le circuit chaque seconde.",
    entetes: [],
    conclusion: "La quantité d'électricité Q qui traverse un circuit pendant Δt vaut Q = I·Δt (Q en coulombs, I en ampères, Δt en secondes) ; elle correspond à n = Q/e électrons.",
    conclusion_courte: "Q = I·Δt = n·e.",
    etapes: [
      { consigne: "Retirez la DEL. Branchez le multimètre en série avec la lampe (bornes mA et COM), réglez-le sur 200 mA et fermez l'interrupteur.", court: "Multimètre en série, calibre 200 mA.", verifier: ({ faits }) => { const m = faits.mesure || {}; return (m.mode === "200mA" && !m.depasse && Math.abs(m.valeur) > 0.01 && Math.abs(Math.abs(m.valeur) - Math.abs(m.i_lampe)) < 5e-4) || false; }, aide_geste: "Touchez le repère « 200m » du commutateur." },
      { consigne: "Lisez l'intensité I du courant. Écrivez-la en ampères (1 mA = 0,001 A).", court: "I en ampères ?", question: nombre((faits) => I(faits), "L'écran affiche des milliampères.", "Exact.") },
      { consigne: "Quelle quantité d'électricité Q traverse la lampe en 2 minutes ? (Q = I·Δt, en coulombs)", court: "Q en 2 min (C) ?", question: nombre((faits) => I(faits) * 120, "Δt = 2 min = 120 s.", "Exact.") },
      { consigne: "Combien d'électrons cela représente-t-il ? (n = Q/e, avec e = 1,6 × 10⁻¹⁹ C)", court: "Nombre d'électrons ?", question: nombre((faits) => (I(faits) * 120) / 1.6e-19, "Écrivez par exemple 7,3E19.", "Exact : un nombre immense.") },
      { consigne: "Un courant de 1 A, c'est…", court: "Répondez dans le carnet.", question: choix(["1 coulomb qui traverse le circuit chaque seconde", "1 électron par seconde", "1 coulomb par heure"], "I = Q / Δt.", "Exact : 1 A = 1 C/s.") },
    ],
  };

  const ELECTROLYTE = {
    id: "electrolyte", paillasse: 1, titre: "Le courant dans un électrolyte",
    objectif: "Le courant passe-t-il dans une solution ? Qui transporte les charges ?",
    entetes: [],
    conclusion: "Dans un électrolyte, le courant est dû à la double migration des ions : les cations dans le sens conventionnel du courant, les anions en sens inverse.",
    conclusion_courte: "Électrolyte : cations dans le sens de I, anions en sens inverse.",
    etapes: [
      { consigne: "Réalisez un circuit en série : générateur, interrupteur, multimètre (bornes mA et COM, 200 mA) et les deux électrodes du tube en U. Fermez l'interrupteur.", court: "Circuit en série avec le tube, puis fermez K.", verifier: ({ faits }) => { const e = faits.electrolyse || {}; return (Math.abs(e.i_tube) > 0.02 && !e.depasse && e.mode === "200mA" && Math.abs(Math.abs(e.mesure) - Math.abs(e.i_tube)) < 5e-4) || false; } },
      { consigne: "Observez le tube pendant quelques instants : les couleurs montent dans les branches.", court: "Observez le tube.", verifier: ({ faits }) => (faits.migration && faits.migration.hauteur_mm >= 6) || false },
      { consigne: "Promenez la loupe dans la solution du tube.", court: "La loupe dans la solution.", verifier: ({ faits }) => (faits.loupe_solution && faits.loupe_solution.courant) || false },
      { consigne: "Les ions cuivre Cu²⁺ (bleus) se déplacent vers…", court: "Répondez dans le carnet.", question: choix(["l'électrode reliée à la borne − du générateur", "l'électrode reliée à la borne + du générateur", "le fond du tube"], "Suivez les fils depuis l'électrode où monte le bleu.", "Exact : les cations vont dans le sens conventionnel du courant.") },
      { consigne: "Inversez les branchements du générateur et observez les couleurs.", court: "Inversez le générateur.", verifier: ({ faits }) => faits.migration_inversee || false },
      { consigne: "Dans un électrolyte, le courant électrique est dû…", court: "Répondez dans le carnet.", question: choix(["au déplacement des ions : cations dans le sens du courant, anions en sens inverse", "au déplacement d'électrons libres dans l'eau", "au déplacement des seuls ions positifs"], "Il y a deux couleurs, qui vont en sens contraires.", "Exact : c'est une double migration.") },
    ],
  };

  L.demarrer({ id: "tc_elec1_a2_nature_courant", titre: "Laboratoire : la nature du courant électrique", decor: "aucun", paillasses: [L.poste_lampe_del, L.poste_electrolyse], missions: [SENS, METAL, INTENSITE, ELECTROLYTE] });
})(window.Labo);
