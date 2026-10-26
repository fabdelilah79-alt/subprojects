/*
Rôle : simulation de l'activité 2 du chapitre « Grandeurs physiques liées aux quantités de matière » (1re année du bac) :
       molécules polaires (filet d'eau dévié) et solide ionique ; préparer une solution électrolytique de sulfate de cuivre ;
       détecter les ions par précipitation ; migration des ions. Objectifs O1, O2, O4, O5, O6, O7.
Reçoit : rien (les vérifications lisent les faits « polarite », « preparation », « tests_ions », « migration »).
Produit : la simulation démarrée.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const nombre = (unite, attendu, tolerance, aide, bravo) => ({ type: "nombre", unite, attendu, tolerance, aide, bravo });
  const po = (f) => f.polarite || { approche: [] }, pr = (f) => f.preparation || { fiole: {} }, ti = (f) => f.tests_ions || {}, mi = (f) => f.migration || {};
  const a = (f, k, p) => (ti(f)[k] || []).includes(p);

  const POLARITE = {
    id: "polarite", paillasse: 0, titre: "Molécules polaires, solide ionique",
    objectif: "Approcher une baguette électrisée d'un filet d'eau et d'un filet de cyclohexane ; observer un modèle de cristal ionique.",
    entetes: [],
    conclusion: "Dans la molécule d'eau, l'atome d'oxygène, plus électronégatif, attire les électrons des liaisons : les centres des charges positives et négatives ne coïncident pas, la molécule est polaire et elle est attirée par un objet électrisé. Le cyclohexane est apolaire. HCl est aussi polaire. Dans un solide ionique comme le chlorure de sodium, chaque ion est entouré d'ions de signe opposé : les attractions électriques entre ions voisins assurent sa cohésion ; il est neutre, de formule statistique NaCl.",
    conclusion_courte: "Eau polaire ; solide ionique : ions alternés.",
    etapes: [
      { consigne: "Frottez la baguette sur le chiffon de laine, ouvrez la burette d'eau et approchez la baguette du filet.", court: "Filet d'eau et baguette.", aide_geste: "Faites aller et venir la baguette sur le chiffon ; touchez le robinet.", verifier: ({ faits }) => po(faits).eau > 10 },
      { consigne: "Recommencez avec le filet de cyclohexane (baguette chargée).", court: "Filet de cyclohexane.", verifier: ({ faits }) => !!po(faits).approche[1] },
      { consigne: "Le filet d'eau est attiré, celui de cyclohexane ne l'est pas, parce que…", court: "Répondez dans le carnet.", question: choix(["la molécule d'eau est polaire : les centres de ses charges + et − ne coïncident pas", "l'eau est plus lourde", "le cyclohexane est chargé"], "O est plus électronégatif que H.", "Exact.") },
      { consigne: "La molécule HCl est…", court: "Répondez dans le carnet.", question: choix(["polaire : le chlore, plus électronégatif, attire les électrons de la liaison", "apolaire", "un ion"], "Cl est à droite de H dans la classification.", "Exact.") },
      { consigne: "Dans le cristal de chlorure de sodium (maquette), la cohésion est due…", court: "Répondez dans le carnet.", question: choix(["aux attractions électriques entre chaque ion et ses voisins de signe opposé", "à des liaisons covalentes entre molécules NaCl", "au poids des ions"], "Regardez les voisins d'un ion Cl⁻.", "Exact : NaCl n'est qu'une formule statistique.") },
    ],
  };

  const PREPARER = {
    id: "preparer", paillasse: 1, titre: "Préparer une solution de sulfate de cuivre",
    objectif: "Préparer 100,0 mL de solution de sulfate de cuivre (II) à C = 0,100 mol/L ; calculer les concentrations des ions.",
    entetes: [],
    conclusion: "On pèse m = C × V × M = 2,50 g de sulfate de cuivre pentahydraté, on le dissout dans la fiole jaugée, on complète au trait et on homogénéise : CuSO₄(s) → Cu²⁺(aq) + SO₄²⁻(aq). La concentration du soluté apporté est C = 0,100 mol/L ; les concentrations effectives des ions sont [Cu²⁺] = [SO₄²⁻] = 0,100 mol/L. Pour Na₂SO₄ à 0,1 mol/L : [Na⁺] = 0,2 mol/L.",
    conclusion_courte: "C = n/V ; [ion] selon l'équation de dissolution.",
    etapes: [
      { consigne: "Lisez la fiche du produit et mettez lunettes et gants.", court: "Lunettes et gants.", aide_geste: "Touchez les lunettes et les gants accrochés au mur.", verifier: ({ faits }) => !!pr(faits).epi },
      { consigne: "Masse de sulfate de cuivre pentahydraté à peser (n = 0,0100 mol) ?", court: "m (g) ?", question: nombre("g", 2.5, 0.02, "m = n × M = 0,0100 × 249,7.", "Exact : 2,50 g.") },
      { consigne: "Pesez 2,50 g, versez-les dans la fiole, dissolvez, complétez au trait, bouchez et agitez.", court: "Solution prête.", verifier: ({ faits }) => { const p = pr(faits), f = p.fiole; if (!f || f.solide > 0.001 || Math.abs(f.ecart) > 0.2 || !f.homogene) return false; return Math.abs(p.cuivre - 10) <= 0.1 || "La masse dissoute n'est pas 2,50 g : recommencez la pesée."; } },
      { consigne: "Équation de dissolution :", court: "Répondez dans le carnet.", question: choix(["CuSO₄(s) → Cu²⁺(aq) + SO₄²⁻(aq)", "CuSO₄(s) → CuSO₄(aq)", "CuSO₄(s) → Cu(aq) + SO₄(aq)"], "Le solide ionique libère ses ions, entourés de molécules d'eau.", "Exact.") },
      { consigne: "Concentration du soluté apporté C (mol/L) ?", court: "C (mol/L) ?", question: nombre("mol/L", 0.1, 0.002, "C = n / V, V = 0,1000 L.", "Exact.") },
      { consigne: "Concentration effective [SO₄²⁻] (mol/L) ?", court: "[SO₄²⁻] ?", question: nombre("mol/L", 0.1, 0.002, "Un ion sulfate par unité CuSO₄ dissoute.", "Exact.") },
      { consigne: "Une solution de sulfate de sodium Na₂SO₄ à C = 0,1 mol/L : [Na⁺] (mol/L) ?", court: "[Na⁺] ?", question: nombre("mol/L", 0.2, 0.005, "Na₂SO₄(s) → 2 Na⁺(aq) + SO₄²⁻(aq).", "Exact : [Na⁺] = 2C.") },
    ],
  };

  const IONS = {
    id: "ions", paillasse: 2, titre: "Détecter les ions",
    objectif: "Identifier les ions de quatre solutions par des tests de précipitation.",
    entetes: [],
    conclusion: "Les ions HO⁻ (soude) donnent un précipité bleu avec Cu²⁺ et rouille avec Fe³⁺ ; les ions Ag⁺ (nitrate d'argent) un précipité blanc avec Cl⁻ ; les ions Ba²⁺ (chlorure de baryum) un précipité blanc avec SO₄²⁻. Une solution de chlorure de fer (III) s'écrit Fe³⁺(aq) + 3 Cl⁻(aq) : elle contient des ions, pas des « molécules FeCl₃ ».",
    conclusion_courte: "Précipités : HO⁻, Ag⁺, Ba²⁺ révèlent les ions.",
    etapes: [
      { consigne: "Lunettes et gants. Quelques gouttes de soude dans chaque tube.", court: "Soude.", aide_geste: "Sortez la pipette du flacon, lâchez-la au-dessus d'un tube, appuyez sur la poire.", verifier: ({ faits }) => a(faits, 1, "CuOH2") && a(faits, 4, "FeOH3") },
      { consigne: "La soude révèle…", court: "Répondez dans le carnet.", question: choix(["les ions Cu²⁺ (précipité bleu) et Fe³⁺ (précipité rouille)", "les ions Na⁺", "les ions Cl⁻"], "Tubes 1 et 4.", "Exact.") },
      { consigne: "« Nouveaux tubes », puis quelques gouttes de nitrate d'argent dans chaque tube.", court: "Nitrate d'argent.", verifier: ({ faits }) => a(faits, 2, "AgCl") && a(faits, 4, "AgCl") },
      { consigne: "« Nouveaux tubes », puis quelques gouttes de chlorure de baryum dans chaque tube.", court: "Chlorure de baryum.", verifier: ({ faits }) => a(faits, 1, "BaSO4") && a(faits, 3, "BaSO4") },
      { consigne: "Le chlorure de baryum révèle…", court: "Répondez dans le carnet.", question: choix(["les ions sulfate SO₄²⁻ (précipité blanc)", "les ions Cl⁻", "les ions Na⁺"], "Tubes 1 et 3.", "Exact.") },
      { consigne: "La solution 4 s'écrit…", court: "Répondez dans le carnet.", question: choix(["Fe³⁺(aq) + 3 Cl⁻(aq)", "FeCl₃(aq)", "Fe(aq) + Cl₃(aq)"], "Une solution électrolytique contient des ions dispersés.", "Exact.") },
    ],
  };

  const MIGRATION = {
    id: "migration", paillasse: 3, titre: "Migration des ions",
    objectif: "Observer le déplacement des ions colorés sous l'effet d'un générateur.",
    entetes: [],
    conclusion: "Quand le générateur fonctionne, les cations Cu²⁺ (bleus) se déplacent vers l'électrode reliée à la borne −, les anions MnO₄⁻ (violets) vers l'électrode reliée à la borne + ; si l'on inverse les bornes, ils changent de sens. Dans une solution électrolytique, le courant électrique est dû au déplacement des ions dans les deux sens.",
    conclusion_courte: "Cations vers −, anions vers +.",
    etapes: [
      { consigne: "Déposez une goutte du mélange au milieu de la bande de papier.", court: "Goutte au milieu.", aide_geste: "Faites glisser la pipette au-dessus du milieu de la bande, puis lâchez-la.", verifier: ({ faits }) => !!mi(faits).depot },
      { consigne: "Mettez le générateur en marche et observez pendant une dizaine de secondes.", court: "Générateur en marche.", verifier: ({ faits }) => mi(faits).cuivre > 30 && mi(faits).permanganate > 25 },
      { consigne: "La tache bleue (ions Cu²⁺) se déplace vers…", court: "Répondez dans le carnet.", question: choix(["l'électrode reliée à la borne − : les cations vont vers la borne −", "l'électrode reliée à la borne +", "nulle part"], "Lisez les étiquettes des bornes.", "Exact ; les anions MnO₄⁻ vont vers la borne +.") },
      { consigne: "Touchez « Inverser » et observez.", court: "Inverser.", verifier: ({ faits }) => !!mi(faits).inverse && mi(faits).cuivre > -10 },
      { consigne: "Dans une solution électrolytique, le courant électrique est dû…", court: "Répondez dans le carnet.", question: choix(["au déplacement des ions, cations et anions en sens opposés", "aux électrons libres de l'eau", "aux molécules d'eau"], "Qu'est-ce qui se déplace sur la bande ?", "Exact.") },
    ],
  };

  L.demarrer({ id: "b1_chim2_a2_electrolytes", titre: "Laboratoire : solutions électrolytiques", paillasses: [L.poste_polarite, L.poste_preparation_cuivre, L.poste_tests_ions, L.poste_migration], missions: [POLARITE, PREPARER, IONS, MIGRATION] });
})(window.Labo);
