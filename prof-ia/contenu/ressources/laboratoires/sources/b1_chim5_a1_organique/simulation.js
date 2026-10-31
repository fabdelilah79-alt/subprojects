/*
Rôle : simulation de l'activité du chapitre « Expansion de la chimie organique » (1re année du bac) : documents
       (composition, histoire, matières naturelles, diversité et importance économique) ; combustion d'une bougie :
       buée (hydrogène) et eau de chaux troublée (carbone) ; modèles moléculaires de l'éthane, de l'éthène et de l'éthyne
       (liaisons simple, double, triple du carbone ; duet, octet ; géométrie). Objectifs O1, O2.
Reçoit : rien (les vérifications lisent les faits « documents », « bougie » et « modele »).
Produit : la simulation démarrée.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const b = (f) => f.bougie || {}, mo = (f) => f.modele || {};

  function poste_modeles(g) {
    // Boîte de modèles moléculaires et atelier d'assemblage (le modèle se tourne au doigt).
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230), ctx = L.paillasse_chimie(g), calque = L.svg("g", { "pointer-events": "none" }, g);
    const dire = (t) => { calque.replaceChildren(); if (t) { L.svg("rect", { x: 420, y: 188, width: 400, height: 22, rx: 5, fill: "#fff6e0", stroke: "#d08a1a" }, calque); L.texte(calque, 620, 199, t, { "font-size": 7.6, "font-weight": 700, fill: "#6b3d00" }); } };
    L.boite_modeles(ctx, { x: 206, sol: 576, cx: 620, cy: 380, fait: "modele", dire });
    return { pense_bete };
  }

  const DOCUMENTS = {
    id: "documents", paillasse: 0, titre: "La chimie organique",
    objectif: "Lire les quatre documents : composition, histoire, matières naturelles, diversité et importance économique.",
    entetes: [],
    conclusion: "Les espèces organiques sont constituées principalement de carbone et d'hydrogène. On les a d'abord extraites des êtres vivants ; depuis la synthèse de l'urée par Wöhler (1828), on sait les fabriquer. Les plantes les produisent par photosynthèse ; le pétrole, le gaz naturel et le charbon en sont des réserves fossiles. La chimie organique de synthèse fournit carburants, plastiques, textiles et médicaments.",
    conclusion_courte: "Espèces organiques : surtout C et H.",
    etapes: [
      { consigne: "Touchez chaque document pour le lire en grand, puis touchez-le de nouveau pour le refermer.", court: "Lire les quatre documents.", verifier: ({ faits }) => (faits.documents || []).length >= 4 },
      { consigne: "Une espèce organique est constituée principalement…", court: "Répondez dans le carnet.", question: choix(["d'atomes de carbone et d'hydrogène", "d'atomes d'oxygène et d'azote", "d'ions métalliques"], "Document 1.", "Exact.") },
      { consigne: "En 1828, la synthèse de l'urée par Wöhler a montré que…", court: "Répondez dans le carnet.", question: choix(["une espèce organique peut être fabriquée sans être vivant : la « force vitale » n'est pas nécessaire", "l'urée est une espèce minérale", "le carbone forme quatre liaisons"], "Document 2.", "Exact.") },
      { consigne: "Le pétrole, le gaz naturel et le charbon sont…", court: "Répondez dans le carnet.", question: choix(["des hydrocarbures fossiles, formés à partir d'êtres vivants il y a des millions d'années", "des espèces minérales", "des ressources renouvelables"], "Document 3.", "Exact.") },
      { consigne: "Il existe tant d'espèces organiques parce que…", court: "Répondez dans le carnet.", question: choix(["les atomes de carbone se lient entre eux en chaînes et en cycles, par des liaisons simples, doubles ou triples", "le carbone est très abondant", "elles sont toutes naturelles"], "Document 4.", "Exact.") },
    ],
  };

  const BOUGIE = {
    id: "bougie", paillasse: 1, titre: "De quoi est faite la paraffine ?",
    objectif: "Identifier les produits de la combustion d'une bougie pour trouver les éléments de la paraffine.",
    entetes: [],
    donnees: ["La paraffine d'une bougie est un mélange d'espèces organiques", "L'eau de chaux se trouble en présence de dioxyde de carbone", "La buée est de l'eau : le sulfate de cuivre anhydre blanc bleuit à son contact"],
    conclusion: "La combustion de la paraffine dans le dioxygène de l'air produit de l'eau (buée sur la paroi froide) et du dioxyde de carbone (eau de chaux troublée). D'après la conservation des éléments, la paraffine contient les éléments hydrogène et carbone : c'est un hydrocarbure. Sans renouvellement de l'air, la flamme s'éteint : la combustion consomme du dioxygène.",
    conclusion_courte: "Combustion : H₂O et CO₂ ; la paraffine contient H et C.",
    etapes: [
      { consigne: "Tenez le bécher sec et froid, retourné, au-dessus de la flamme pendant quelques secondes ; observez sa paroi.", court: "Bécher au-dessus de la flamme.", aide_geste: "Faites glisser le bécher retourné au-dessus de la bougie ; la flamme doit être à l'intérieur.", verifier: ({ faits }) => b(faits).buee >= 0.5 },
      { consigne: "La buée sur la paroi montre que…", court: "Répondez dans le carnet.", question: choix(["de l'eau s'est formée : la paraffine contient l'élément hydrogène", "la paraffine contient de l'eau liquide", "l'air est humide"], "La paroi était sèche avant l'expérience ; H₂O contient l'élément hydrogène.", "Exact.") },
      { consigne: "Lâchez le bécher sur la paillasse (il est remis à l'endroit), versez-y de l'eau de chaux et observez.", court: "Eau de chaux dans le bécher.", aide_geste: "Prenez le bécher d'eau de chaux, tenez-le au-dessus du bécher et inclinez-le avec la poignée.", verifier: ({ faits }) => (b(faits).chaux > 0 && b(faits).trouble >= 0.3) || (b(faits).chaux > 0 && b(faits).co2 === 0 && b(faits).trouble === 0 ? "L'eau de chaux reste limpide : tenez d'abord le bécher au-dessus de la flamme." : false) },
      { consigne: "L'eau de chaux troublée montre que…", court: "Répondez dans le carnet.", question: choix(["du dioxyde de carbone s'est formé : la paraffine contient l'élément carbone", "l'eau de chaux était sale", "la paraffine contient de l'oxygène"], "CO₂ contient l'élément carbone ; l'oxygène peut venir du dioxygène de l'air.", "Exact.") },
      { consigne: "Si l'on garde le bécher sur la bougie, la flamme s'éteint parce que…", court: "Répondez dans le carnet.", question: choix(["la combustion consomme le dioxygène de l'air enfermé", "la buée éteint la flamme", "le bécher chauffe trop"], "Essayez : la flamme faiblit puis s'éteint.", "Exact.") },
    ],
  };

  const LIAISONS = {
    id: "liaisons", paillasse: 2, titre: "Les liaisons du carbone",
    objectif: "Construire l'éthane, l'éthène et l'éthyne ; décrire leurs liaisons avec le duet et l'octet.",
    entetes: [],
    donnees: ["Carbone (Z = 6) : 4 électrons externes, il forme 4 liaisons (octet) ; hydrogène (Z = 1) : 1 liaison (duet)", "Boule noire : carbone, 4 trous ; boule blanche : hydrogène, 1 trou", "Toucher une liaison : simple → double → triple → simple"],
    conclusion: "Dans toutes ces molécules, chaque atome de carbone forme quatre liaisons (quatre doublets liants : octet) et chaque atome d'hydrogène une seule (duet). L'éthane C₂H₆ n'a que des liaisons simples : autour de chaque carbone, les quatre liaisons forment un tétraèdre (109,5°). L'éthène C₂H₄ a une liaison double C=C : la molécule est plane (angles de 120°). L'éthyne C₂H₂ a une liaison triple C≡C : la molécule est linéaire (180°). La représentation de Lewis permet de prévoir ces liaisons et leur orientation dans l'espace.",
    conclusion_courte: "C : 4 liaisons ; simple (109,5°), double (plan, 120°), triple (linéaire).",
    etapes: [
      { consigne: "Construisez l'éthane C₂H₆ : deux carbones liés par une liaison simple, et des hydrogènes dans tous les trous libres.", court: "Éthane C₂H₆.", aide_geste: "Prenez une boule dans un casier et lâchez-la contre un trou libre ; glissez à côté du modèle pour le tourner.", verifier: ({ faits }) => mo(faits).brute === "C2H6" && mo(faits).complet },
      { consigne: "Autour de chaque carbone de l'éthane, les quatre liaisons…", court: "Répondez dans le carnet.", question: choix(["pointent vers les sommets d'un tétraèdre (angles de 109,5°)", "sont dans un même plan, à 90°", "sont alignées"], "Tournez le modèle.", "Exact.") },
      { consigne: "Démontez le modèle (« Tout démonter »), puis construisez l'éthène C₂H₄ : touchez la liaison C–C pour la rendre double.", court: "Éthène C₂H₄.", verifier: ({ faits }) => { const m = mo(faits); return m.brute === "C2H4" && m.complet && m.liaisons?.doubles === 1 && m.plan; } },
      { consigne: "Dans l'éthène, chaque carbone forme…", court: "Répondez dans le carnet.", question: choix(["une liaison double et deux liaisons simples : quatre doublets liants (octet) ; la molécule est plane", "trois liaisons seulement", "quatre liaisons simples"], "Comptez les doublets liants autour d'un carbone.", "Exact.") },
      { consigne: "Construisez l'éthyne (acétylène) C₂H₂ : une liaison triple entre les deux carbones.", court: "Éthyne C₂H₂.", aide_geste: "Touchez deux fois la liaison C–C. Si un trou est caché derrière une boule, inclinez le modèle : glissez vers le haut ou le bas à côté de lui.", verifier: ({ faits }) => { const m = mo(faits); return m.brute === "C2H2" && m.complet && m.liaisons?.triples === 1; } },
      { consigne: "La molécule d'éthyne est…", court: "Répondez dans le carnet.", question: choix(["linéaire : les quatre atomes sont alignés (180°)", "plane, avec des angles de 120°", "en tétraèdre"], "Tournez le modèle.", "Exact : H–C≡C–H.") },
      { consigne: "La représentation de Lewis de l'éthyne est…", court: "Répondez dans le carnet.", question: choix(["H–C≡C–H : chaque carbone a quatre doublets liants", "H–C=C–H", "H=C–C=H"], "Chaque carbone doit respecter l'octet.", "Exact.") },
    ],
  };

  L.demarrer({ id: "b1_chim5_a1_organique", titre: "Laboratoire : la chimie organique", paillasses: [L.poste_documents_organique, L.poste_bougie, poste_modeles], missions: [DOCUMENTS, BOUGIE, LIAISONS] });
})(window.Labo);
