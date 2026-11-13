/*
Rôle : simulation de l'activité 2 du chapitre « Contrôle de l'évolution des systèmes chimiques » (2e année du bac) : synthèse
       d'un savon par saponification à reflux (paillasse du tronc commun réutilisée : tc_chim3_a1_savon) et relargage ;
       propriétés : mousse, eau calcaire, émulsion de l'huile ; documents sur l'ion carboxylate, le lavage, l'eau calcaire
       et la catalyse. Objectifs O2, O3, O4.
Reçoit : rien (les vérifications lisent les faits « reflux_savon », « proprietes », « docs_savon »).
Produit : la simulation démarrée.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const R = (f) => f.reflux_savon || {}, P = (f) => f.proprietes || { mousse: {}, emulsion: {}, secoues: [] };

  function secouer({ faits }) {
    // Les quatre tubes secoués ; mousse dans le tube 1 et huile dispersée dans le tube 3.
    const p = P(faits);
    if ((p.secoues || []).length < 4) return false;
    return (p.mousse[1] >= 0.5 && p.emulsion[3] >= 0.5) || "Secouez vivement chaque tube, quelques secondes.";
  }

  const SYNTHESE = {
    id: "synthese", paillasse: 0, titre: "La saponification",
    conclusion: "L'huile est un triester du glycérol. À chaud, la soude l'hydrolyse : triester + 3 HO⁻ → glycérol + 3 R–COO⁻ (ions carboxylates du savon). Cette hydrolyse basique, la saponification, est totale et assez rapide, contrairement à l'hydrolyse d'un ester par l'eau, limitée. L'éthanol permet à l'huile et à la soude de se mélanger ; le reflux accélère sans perte de matière. Dans l'eau salée, le savon, peu soluble, se rassemble en grains : c'est le relargage.",
    objectif: "Préparer un savon par saponification à reflux (O2).",
    entetes: [], donnees: ["Huile (triester du glycérol), soude à 30 % (corrosive), éthanol (inflammable)", "Eau salée pour le relargage"],
    conclusion_courte: "Triester + 3 HO⁻ → glycérol + 3 R–COO⁻ (totale).",
    etapes: [
      { consigne: "Mettez les lunettes et les gants (touchez-les sur leurs crochets).", court: "Lunettes et gants.", verifier: ({ faits }) => R(faits).epi || false },
      { consigne: "Par l'entonnoir, versez dans le ballon l'huile, la soude puis l'éthanol ; ajoutez la pierre ponce.", court: "Réactifs et pierre ponce.", aide_geste: "Portez chaque bécher au-dessus de l'entonnoir, puis inclinez-le avec la poignée.", verifier: ({ faits }) => { const r = R(faits); return (r.huile >= 15 && r.soude >= 15 && r.ethanol >= 15 && r.ponce) || false; } },
      { consigne: "Rangez l'entonnoir, posez le réfrigérant, ouvrez l'eau et chauffez à reflux pendant 30 minutes.", court: "Reflux pendant 30 min.", verifier: ({ faits }) => { const r = R(faits); if (r.fuite) return "Des vapeurs s'échappent : le réfrigérant doit être posé et l'eau ouverte."; return r.avance >= 1 || false; } },
      { consigne: "L'équation de la saponification d'un triester du glycérol est…", court: "Répondez dans le carnet.", question: choix(["triester + 3 HO⁻ → glycérol + 3 R–COO⁻", "triester + 3 H₂O ⇌ glycérol + 3 R–COOH", "glycérol + 3 R–COO⁻ → triester + 3 HO⁻"], "La soude apporte les ions HO⁻ ; le savon est un carboxylate.", "Exact.") },
      { consigne: "Contrairement à l'hydrolyse d'un ester par l'eau, la saponification est…", court: "Répondez dans le carnet.", question: choix(["totale", "limitée à 33 %", "limitée à 67 %"], "Comparez avec le chapitre précédent.", "Exact.") },
      { consigne: "Arrêtez le chauffage, laissez refroidir, ôtez le réfrigérant et versez le contenu du ballon dans l'eau salée.", court: "Relargage dans l'eau salée.", aide_geste: "Prenez le ballon par son col et inclinez-le au-dessus du bécher.", verifier: ({ faits }) => R(faits).recu >= 10 || false },
    ],
  };

  const PROPRIETES = {
    id: "proprietes", paillasse: 1, titre: "Propriétés du savon",
    conclusion: "Dans l'eau distillée, le savon mousse. Dans l'eau calcaire, les ions Ca²⁺ précipitent les ions carboxylates (trouble blanc) : presque plus de mousse, le savon ne lave plus. Secouée avec de l'eau savonneuse, l'huile se disperse en fines gouttelettes qui restent en suspension (émulsion) ; sans savon, elle remonte en quelques secondes. L'ion carboxylate a une tête hydrophile (–COO⁻) et une longue queue hydrophobe : il fait le lien entre l'eau et la graisse.",
    objectif: "Étudier la mousse, l'effet de l'eau calcaire et le pouvoir émulsionnant du savon (O3).",
    entetes: [], donnees: ["Tubes bouchés : on peut les secouer sans risque", "Le tube 4 est un témoin"],
    conclusion_courte: "Mousse ; Ca²⁺ précipite le savon ; émulsion de l'huile.",
    etapes: [
      { consigne: "Prenez chaque tube, secouez-le vivement, puis reposez-le dans le porte-tubes ; comparez.", court: "Secouez les 4 tubes.", aide_geste: "Faites glisser le tube vivement de gauche à droite plusieurs fois, puis lâchez-le près du porte-tubes.", verifier: secouer },
      { consigne: "Dans l'eau calcaire (tube 2), le savon mousse mal parce que…", court: "Répondez dans le carnet.", question: choix(["les ions Ca²⁺ précipitent les ions carboxylates", "les ions Ca²⁺ détruisent la chaîne carbonée", "les ions Cl⁻ de l'eau neutralisent le savon"], "Regardez le trouble blanc du tube 2.", "Exact.") },
      { consigne: "Après agitation, l'huile reste dispersée dans le tube 3 et pas dans le tube 4, car…", court: "Répondez dans le carnet.", question: choix(["les ions carboxylates entourent les gouttelettes d'huile", "le savon transforme l'huile en une espèce soluble", "le savon rend l'huile plus dense que l'eau"], "Lisez le document « L'ion carboxylate » si besoin.", "Exact.") },
    ],
  };

  const DOCUMENTS = {
    id: "documents", paillasse: 2, titre: "Structure du savon et catalyse",
    conclusion: "L'ion carboxylate R–COO⁻ est amphiphile : tête –COO⁻ hydrophile, queue carbonée hydrophobe et lipophile. Il se place à la surface de l'eau (mousse) et autour des gouttes de graisse (micelles), que le rinçage emporte. Un catalyseur accélère une transformation sans être consommé et sans changer l'état final ; il peut être sélectif et favoriser un produit : l'industrie le choisit pour cela.",
    objectif: "Relier la structure de l'ion carboxylate à ses propriétés ; connaître le rôle d'un catalyseur (O3, O4).",
    entetes: [], donnees: ["Quatre documents au mur"],
    conclusion_courte: "Tête hydrophile, queue hydrophobe ; catalyseur sélectif.",
    etapes: [
      { consigne: "Lisez les quatre documents.", court: "Lisez les documents.", aide_geste: "Touchez un document pour l'ouvrir, puis pour le refermer.", verifier: ({ faits }) => (faits.docs_savon || []).length >= 4 || false },
      { consigne: "Dans l'ion C₁₇H₃₅–COO⁻…", court: "Répondez dans le carnet.", question: choix(["–COO⁻ est hydrophile, C₁₇H₃₅– hydrophobe", "–COO⁻ est hydrophobe, C₁₇H₃₅– hydrophile", "–COO⁻ et C₁₇H₃₅– sont tous deux hydrophiles"], "Ce qui est chargé est attiré par l'eau.", "Exact.") },
      { consigne: "Un catalyseur…", court: "Répondez dans le carnet.", question: choix(["accélère sans être consommé ni changer l'état final", "accélère et augmente le rendement à l'équilibre", "est consommé, comme les autres réactifs"], "Relisez « Catalyse et industrie ».", "Exact.") },
    ],
  };

  L.demarrer({ id: "b2_chim10_a2_savon", titre: "Laboratoire : le savon et ses propriétés", paillasses: [L.poste_reflux_savon, L.poste_proprietes_savon, L.poste_docs_savon], missions: [SYNTHESE, PROPRIETES, DOCUMENTS] });
})(window.Labo);
