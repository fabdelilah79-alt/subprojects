/*
Rôle : simulation de l'activité 1 du chapitre « Transformations spontanées dans les piles et production d'énergie » (2e année
       du bac) : transfert spontané d'électrons entre espèces mélangées (cuivre dans les ions argent, fer dans les ions cuivre) ;
       piles Cu | Cu²⁺ || Ag⁺ | Ag et Fe | Fe²⁺ || Cu²⁺ | Cu : rôle du pont salin, f.é.m. et polarité au voltmètre, sens du
       courant et porteurs de charge, réactions aux électrodes, quantité d'électricité Q = I·Δt et masse consommée.
       Objectifs O1 à O4.
Reçoit : rien (les vérifications lisent les faits « melanges », « pile_cu_ag », « pile_fe_cu »).
Produit : la simulation démarrée.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const relatif = (unite, attendu, tol, aide, bravo) => ({ type: "nombre", unite, attendu, tolerance_relative: tol, aide, bravo });
  const P = (f, k) => f[k] || {}, MEL = (f) => f.melanges || {};
  const tension = (k) => ({ faits }) => { const p = P(faits, k); if (p.U_21 !== null && p.U_21 !== undefined && !p.pont) return "Le voltmètre lit 0 : il manque le pont salin."; return (p.pont && p.U_21 !== null && p.U_21 !== undefined && Math.abs(p.U_21) > 0.2) || false; };
  const courant = (k) => ({ faits }) => (P(faits, k).I_lu > 0.5) || "Montez la pile, la résistance R et l'ampèremètre (calibre 20 mA) en série.";

  const MELANGE = {
    id: "melange", paillasse: 0, titre: "Espèces mélangées",
    conclusion: "Plongé dans une solution d'ions argent, le cuivre se couvre d'argent et la solution bleuit : Cu + 2 Ag⁺ → Cu²⁺ + 2 Ag. Au départ Qr,i = [Cu²⁺]/[Ag⁺]² = 0 < K : le sens direct est spontané. Les électrons passent directement du cuivre aux ions argent, au contact : on ne peut pas les utiliser. Dans une pile, on sépare les deux couples pour que les électrons passent par un circuit extérieur.",
    objectif: "Observer un transfert spontané d'électrons entre espèces mélangées.",
    entetes: [], donnees: ["Tube 1 : AgNO₃ 0,10 mol/L ; tube 2 : CuSO₄ 0,050 mol/L", "Fiche des constantes au mur"],
    conclusion_courte: "Transfert direct d'électrons entre espèces mélangées.",
    etapes: [
      { consigne: "Mettez le fil de cuivre dans le tube 1 (ions Ag⁺) et le clou en fer dans le tube 2 (ions Cu²⁺) ; observez.", court: "Cuivre → tube 1 ; fer → tube 2.", aide_geste: "Faites glisser le métal au-dessus du tube et lâchez-le.", verifier: ({ faits }) => (MEL(faits).t1?.Ag_depose > 0.05 && MEL(faits).t2?.Cu_depose > 0.03) || false },
      { consigne: "Pour Cu + 2 Ag⁺ ⇌ Cu²⁺ + 2 Ag, au départ…", court: "Répondez dans le carnet.", question: choix(["Qr,i = [Cu²⁺] / [Ag⁺]² = 0 < K : le sens direct est spontané, comme on l'observe (dépôt d'argent)", "Qr,i > K : sens inverse", "Qr,i = K : rien ne se passe"], "Il n'y a pas d'ions Cu²⁺ au départ ; les solides ne figurent pas dans Qr.", "Exact.") },
      { consigne: "Dans ces tubes, les électrons…", court: "Répondez dans le carnet.", question: choix(["passent directement du métal aux ions, au contact : aucun courant n'est utilisable", "traversent un fil extérieur", "restent sur le métal"], "Il n'y a aucun circuit.", "Exact : pour obtenir un courant, on sépare les couples : c'est la pile.") },
    ],
  };

  const CU_AG = {
    id: "cu_ag", paillasse: 1, titre: "La pile cuivre-argent",
    conclusion: "Sans pont salin, le voltmètre lit 0 : le circuit est ouvert. Avec le pont, la pile Cu | Cu²⁺ || Ag⁺ | Ag a une f.é.m. E ≈ 0,43 V ; la lame d'argent est le pôle +, la lame de cuivre le pôle −. Dans le circuit extérieur, les électrons vont du cuivre vers l'argent (le courant de l'argent vers le cuivre) ; dans le pont salin, les ions NO₃⁻ vont vers le compartiment du cuivre et les ions K⁺ vers celui de l'argent. Pôle − (anode) : Cu → Cu²⁺ + 2 e⁻ ; pôle + (cathode) : Ag⁺ + e⁻ → Ag. Bilan : Cu + 2 Ag⁺ → Cu²⁺ + 2 Ag, le sens spontané prévu par Qr,i < K.",
    objectif: "Réaliser une pile, mesurer sa f.é.m., trouver sa polarité et interpréter son fonctionnement.",
    entetes: [], donnees: ["Cu | Cu²⁺ (0,10 mol/L) et Ag⁺ (0,10 mol/L) | Ag", "Voltmètre : COM sur une lame, VΩ sur l'autre", "R = 100 Ω"],
    conclusion_courte: "Pôle + : argent ; pôle − : cuivre ; E ≈ 0,43 V.",
    etapes: [
      { consigne: "Branchez le voltmètre (V⎓, calibre 2 V) entre les deux lames, puis posez le pont salin.", court: "Voltmètre ; pont salin.", aide_geste: "Touchez le pont salin pour le poser sur les béchers.", verifier: tension("pile_cu_ag") },
      { consigne: "Le pont salin…", court: "Répondez dans le carnet.", question: choix(["ferme le circuit et maintient l'électroneutralité des solutions en laissant passer des ions", "apporte des électrons", "sert seulement à tenir les béchers"], "Sans lui, le voltmètre lit 0.", "Exact.") },
      { consigne: "Force électromotrice E de la pile (V) ?", court: "E (V) ?", question: relatif("V", (f) => Math.abs(P(f, "pile_cu_ag").U_21 ?? 0.43), 0.03, "C'est la valeur absolue lue au voltmètre (courant nul).", "Exact.") },
      { consigne: "Le pôle positif de la pile est…", court: "Répondez dans le carnet.", question: choix(["la lame d'argent", "la lame de cuivre", "le pont salin"], "Le voltmètre lit U positive quand sa borne VΩ est sur le pôle +.", "Exact.") },
      { consigne: "Montez en série la pile, la résistance R et l'ampèremètre (A⎓, calibre 20 mA).", court: "Pile + R + ampèremètre.", verifier: courant("pile_cu_ag") },
      { consigne: "Dans le circuit extérieur et dans le pont salin…", court: "Répondez dans le carnet.", question: choix(["les électrons vont du cuivre vers l'argent par les fils ; dans le pont, les ions NO₃⁻ vont vers le cuivre, les K⁺ vers l'argent", "les électrons traversent le pont salin", "le courant va du cuivre vers l'argent dans les fils"], "Le courant sort par le pôle +.", "Exact.") },
      { consigne: "Les réactions aux électrodes sont…", court: "Répondez dans le carnet.", question: choix(["pôle − : Cu → Cu²⁺ + 2 e⁻ ; pôle + : Ag⁺ + e⁻ → Ag ; bilan Cu + 2 Ag⁺ → Cu²⁺ + 2 Ag", "pôle − : Ag → Ag⁺ + e⁻ ; pôle + : Cu²⁺ + 2 e⁻ → Cu", "il n'y a pas de réaction, seulement des électrons"], "Comparez avec le tube 1 de la paillasse 1.", "Exact.") },
    ],
  };

  const FE_CU = {
    id: "fe_cu", paillasse: 2, titre: "La pile fer-cuivre et la quantité d'électricité",
    conclusion: "La pile Fe | Fe²⁺ || Cu²⁺ | Cu a une f.é.m. E ≈ 0,78 V ; le cuivre est le pôle +, le fer le pôle −. Elle débite I = E / (R + r) ≈ 3 mA dans R = 100 Ω. En une heure, elle fait circuler Q = I·Δt ≈ 11 C, soit n(e⁻) = Q / F ; au pôle −, Fe → Fe²⁺ + 2 e⁻ : m(Fe) = Q·M / (2F) ≈ 3 mg de fer consommé. La pile est un système hors d'équilibre ; elle est usée quand Qr atteint K (ou qu'un réactif est épuisé).",
    objectif: "Mesurer la f.é.m. et le courant ; relier quantité d'électricité, intensité, durée et quantité de matière.",
    entetes: [], donnees: ["Fe | Fe²⁺ (0,10 mol/L) et Cu²⁺ (0,10 mol/L) | Cu", "F = 96 500 C/mol ; M(Fe) = 55,8 g/mol", "R = 100 Ω"],
    conclusion_courte: "Q = I·Δt ; m = Q·M / (n·F).",
    etapes: [
      { consigne: "Posez le pont salin et mesurez la f.é.m. de la pile.", court: "Pont salin ; f.é.m.", verifier: tension("pile_fe_cu") },
      { consigne: "Force électromotrice E (V) ?", court: "E (V) ?", question: relatif("V", (f) => Math.abs(P(f, "pile_fe_cu").U_21 ?? 0.78), 0.03, "Valeur lue au voltmètre.", "Exact.") },
      { consigne: "Le pôle négatif de cette pile est…", court: "Répondez dans le carnet.", question: choix(["la lame de fer : le fer est oxydé (Fe → Fe²⁺ + 2 e⁻)", "la lame de cuivre", "le pont salin"], "Le fer est plus réducteur que le cuivre.", "Exact.") },
      { consigne: "Faites débiter la pile dans R avec l'ampèremètre en série.", court: "Pile + R + ampèremètre.", verifier: courant("pile_fe_cu") },
      { consigne: "Quantité d'électricité Q (C) débitée en 1 h avec ce courant ?", court: "Q en 1 h (C) ?", question: relatif("C", (f) => (P(f, "pile_fe_cu").I_lu || 3.1) * 1e-3 * 3600, 0.03, "Q = I·Δt, I en A et Δt en s.", "Exact.") },
      { consigne: "Masse de fer consommée en 1 h (mg) ?", court: "m(Fe) en 1 h (mg) ?", question: relatif("mg", (f) => ((P(f, "pile_fe_cu").I_lu || 3.1) * 1e-3 * 3600 * 55.8 * 1000) / (2 * 96500), 0.04, "n(Fe) = n(e⁻) / 2 = Q / (2F) ; m = n·M.", "Exact.") },
      { consigne: "Une pile est usée quand…", court: "Répondez dans le carnet.", question: choix(["le système atteint l'équilibre (Qr = K) ou qu'un réactif est épuisé : la f.é.m. s'annule", "le pont salin sèche toujours avant", "la résistance chauffe"], "Une pile qui débite est un système hors d'équilibre.", "Exact.") },
    ],
  };

  const pile = (numero, gauche, droite, fait) => (g) => L.poste_pile_lab(g, { numero, gauche, droite, fait });
  L.demarrer({ id: "b2_chim7_a1_piles", titre: "Laboratoire : les piles", paillasses: [L.poste_melange, pile(1, { metal: "cuivre", C: 0.1 }, { metal: "argent", C: 0.1 }, "pile_cu_ag"), pile(2, { metal: "fer", C: 0.1 }, { metal: "cuivre", C: 0.1 }, "pile_fe_cu")], missions: [MELANGE, CU_AG, FE_CU] });
})(window.Labo);
