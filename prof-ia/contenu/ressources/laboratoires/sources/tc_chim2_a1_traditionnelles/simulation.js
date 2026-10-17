/*
Rôle : simulation de l'activité 1 du chapitre « Extraction, séparation et identification » (tronc commun) : documents
       historiques (enfleurage, macération, infusion, décoction, distillation chez les savants arabes) ; comparer, par
       l'observation seulement, macération, infusion et décoction ; classer des préparations. Objectif O1.
Reçoit : rien (les vérifications lisent les faits notés par les paillasses).
Produit : la simulation démarrée : documents ; comparer trois techniques ; classer.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const X = (faits) => faits.extraction_the || {}, b = (faits, id) => X(faits)[id] || {};

  const DOCUMENTS = {
    id: "documents", paillasse: 0, titre: "Des techniques très anciennes",
    objectif: "Comment extrayait-on autrefois les parfums et les principes actifs des plantes ?",
    entetes: [],
    conclusion: "Enfleurage : une graisse froide se charge du parfum des fleurs. Macération : la plante trempe longtemps dans un liquide froid. Infusion : on verse de l'eau bouillante sur la plante. Décoction : on fait bouillir la plante dans l'eau. Les savants arabes ont perfectionné la distillation (alambic, de l'arabe al-inbiq).",
    conclusion_courte: "Enfleurage, macération, infusion, décoction.",
    etapes: [
      { consigne: "Touchez chacun des quatre documents pour le lire en grand (touchez-le de nouveau pour le refermer).", court: "Lisez les quatre documents.", verifier: ({ faits }) => (faits.documents_extraction || []).length >= 4 || false },
      { consigne: "Dans l'enfleurage, le parfum des fleurs passe…", court: "Répondez dans le carnet.", question: choix(["dans une graisse froide", "dans de l'eau bouillante", "dans l'air de la pièce"], "Relisez le document 1.", "Exact.") },
      { consigne: "Quelle est la différence entre une infusion et une décoction ?", court: "Répondez dans le carnet.", question: choix(["dans la décoction, la plante bout dans l'eau ; dans l'infusion, on verse l'eau bouillante sur la plante, hors du feu", "il n'y en a aucune", "l'infusion se fait dans l'huile"], "Relisez le document 3.", "Exact.") },
      { consigne: "Le mot « alambic » vient…", court: "Répondez dans le carnet.", question: choix(["de l'arabe al-inbiq", "du latin", "du chinois"], "Relisez le document 4.", "Exact.") },
    ],
  };

  const COMPARER = {
    id: "comparer", paillasse: 1, titre: "Macération, infusion, décoction",
    objectif: "Les trois béchers contiennent 3 g des mêmes feuilles de thé. Que se passe-t-il selon la technique ?",
    entetes: [],
    conclusion: "Après 10 minutes, la décoction (C) est la plus colorée, puis l'infusion (B) ; la macération à froid (A) est à peine colorée. L'eau a extrait des espèces chimiques des feuilles, d'autant plus vite qu'elle est chaude. La macération demande des heures.",
    conclusion_courte: "Plus l'eau est chaude, plus l'extraction est rapide.",
    etapes: [
      { consigne: "Versez environ 100 mL d'eau froide (graduation 100) dans A (macération) et dans C (décoction) : portez le bécher d'eau froide au-dessus de chacun et inclinez-le avec la poignée.", court: "Eau froide dans A et dans C.", verifier: ({ faits }) => (b(faits, "A").eau && b(faits, "C").eau) || false },
      { consigne: "L'eau de la bouilloire vient de bouillir : amenez son bec au-dessus de B (infusion) et lâchez-la, elle verse 100 mL. Attention aux brûlures.", court: "Eau de la bouilloire dans B.", verifier: ({ faits }) => b(faits, "B").eau || false },
      { consigne: "Allumez la plaque chauffante sous C (touche I/O), puis mettez le chronomètre en marche.", court: "Plaque allumée, chronomètre en marche.", verifier: ({ faits }) => (X(faits).plaque && (faits.chronometre || {}).en_marche) || false, aide_geste: "Sur cette paillasse, 1 seconde représente 1 minute." },
      { consigne: "Observez les trois béchers pendant 10 minutes (lisez le chronomètre). C finit par bouillir.", court: "Observez 10 minutes.", verifier: ({ faits }) => ((faits.chronometre || {}).minutes >= 10 && X(faits).plaque) || false },
      { consigne: "Après 10 minutes, le liquide le plus coloré est…", court: "Répondez dans le carnet.", question: choix(["C (décoction), puis B (infusion) ; A (macération) est à peine coloré", "A (macération)", "les trois sont identiques"], "Comparez les trois béchers.", "Exact.") },
      { consigne: "Dans les trois béchers, l'eau…", court: "Répondez dans le carnet.", question: choix(["s'est colorée : elle a extrait des espèces chimiques des feuilles", "est restée pure", "a coloré les feuilles"], "Que contenait l'eau au départ ?", "Exact.") },
      { consigne: "D'après vos observations, plus l'eau est chaude, plus l'extraction…", court: "Répondez dans le carnet.", question: choix(["est rapide", "est lente", "est la même"], "Comparez A (froide) et C (bouillante).", "Exact.") },
    ],
  };

  const CLASSER = {
    id: "classer", paillasse: 2, titre: "Quelle technique choisir ?",
    objectif: "Associer chaque préparation à sa technique d'extraction.",
    entetes: [],
    conclusion: "Les fleurs fragiles (jasmin) : enfleurage. Le henné : macération dans l'eau. Les feuilles (thé, verveine) : infusion. Les parties dures (cannelle, racines de gingembre) : décoction.",
    conclusion_courte: "La technique dépend de la partie de la plante.",
    etapes: [
      { consigne: "Glissez chaque étiquette dans la colonne de sa technique.", court: "Classez les préparations.", verifier: ({ faits }) => L.tableau_tri.verifier(L.ETIQUETTES_TECHNIQUES, faits.tri_techniques) },
      { consigne: "Pour extraire les espèces des racines de gingembre, très dures, on choisit plutôt…", court: "Répondez dans le carnet.", question: choix(["la décoction", "l'infusion", "l'enfleurage"], "Relisez le document 3.", "Exact.") },
    ],
  };

  L.demarrer({ id: "tc_chim2_a1_traditionnelles", titre: "Laboratoire : techniques traditionnelles d'extraction", paillasses: [L.poste_documents_extraction, L.poste_comparer, L.poste_classer_techniques], missions: [DOCUMENTS, COMPARER, CLASSER] });
})(window.Labo);
