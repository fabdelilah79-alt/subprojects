/*
Rôle : missions « oxydation à reflux », « éliminer le dioxyde de manganèse » et « précipiter l'acide benzoïque » de
       l'activité 3 du chapitre « Lecture d'une formule chimique » (objectifs O5 et O6).
Reçoit : rien (les vérifications lisent les faits des paillasses).
Produit : Labo.MISSIONS_BENZOIQUE = { reflux, filtration, precipitation, choix }.
Utilisé par : simulation.js.
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const R = (f) => f.reflux_benzoique || {}, F = (f) => f.filtration_mno2 || {}, P = (f) => f.precipitation || {}, C = (f) => f.filtration_cristaux || {};
  const arreter = (lire) => ({ faits }) => { const f = lire(faits); if (f.retour) return "Retour d'eau : il fallait débrancher le tuyau avant de fermer le robinet."; return (!f.vide && !f.branche) || false; };
  const papier = (lire) => ({ faits }) => (lire(faits).papier && lire(faits).mouille) || false;

  const REFLUX = {
    id: "reflux", paillasse: 0, titre: "Oxyder l'alcool benzylique",
    objectif: "Chauffer à reflux l'alcool benzylique avec le permanganate de potassium en milieu basique.",
    entetes: [],
    donnees: ["Alcool benzylique C₆H₅–CH₂OH : alcool primaire", "Ion permanganate MnO₄⁻ : violet ; dioxyde de manganèse MnO₂ : solide brun"],
    conclusion: "À chaud, l'ion permanganate (violet) oxyde l'alcool benzylique, un alcool primaire : 3 C₆H₅–CH₂OH + 4 MnO₄⁻ → 3 C₆H₅–COO⁻ + 4 MnO₂ + HO⁻ + 4 H₂O. Le permanganate est réduit en dioxyde de manganèse, solide brun ; en milieu basique, l'acide benzoïque formé est sous forme d'ions benzoate C₆H₅–COO⁻, solubles. Le reflux permet de chauffer longtemps sans perdre de matière.",
    conclusion_courte: "Alcool primaire oxydé en ions benzoate ; MnO₄⁻ → MnO₂ brun.",
    etapes: [
      { consigne: "Mettez les lunettes et les gants (touchez-les sur leurs crochets).", court: "Lunettes et gants.", verifier: ({ faits }) => R(faits).epi || false },
      { consigne: "Par l'entonnoir, versez dans le ballon les 2,0 mL d'alcool benzylique, puis la solution de permanganate de potassium et de soude.", court: "Alcool et permanganate dans le ballon.", aide_geste: "Portez chaque bécher au-dessus de l'entonnoir, puis inclinez-le avec la poignée.", verifier: ({ faits }) => (R(faits).alcool_benzylique >= 1.5 && R(faits).permanganate_basique >= 40) || false },
      { consigne: "Ajoutez quelques grains de pierre ponce par l'entonnoir.", court: "Pierre ponce.", verifier: ({ faits }) => R(faits).ponce || false },
      { consigne: "Rangez l'entonnoir, posez le réfrigérant sur le col du ballon et ouvrez l'eau.", court: "Réfrigérant posé, eau ouverte.", verifier: ({ faits }) => (R(faits).refrigerant === "monte" && R(faits).eau) || false },
      { consigne: "Allumez le chauffe-ballon et chauffez à reflux pendant 20 minutes (chronomètre). Observez la couleur.", court: "Reflux pendant 20 min.", verifier: ({ faits }) => { const r = R(faits); if (r.fuite) return "Des vapeurs s'échappent : le réfrigérant doit être posé et l'eau ouverte."; return r.avance >= 1 || false; } },
      { consigne: "Le violet disparaît et un solide brun se forme parce que…", court: "Répondez dans le carnet.", question: choix(["l'ion permanganate MnO₄⁻ est réduit en dioxyde de manganèse MnO₂ ; l'alcool est oxydé", "l'alcool brûle", "le permanganate s'évapore"], "MnO₄⁻ est un oxydant : il capte des électrons.", "Exact.") },
      { consigne: "L'alcool benzylique est un alcool primaire ; son oxydation par un oxydant en excès donne…", court: "Répondez dans le carnet.", question: choix(["un acide carboxylique, l'acide benzoïque C₆H₅–COOH (ici sous forme d'ions benzoate C₆H₅–COO⁻)", "une cétone", "un alcène, par déshydratation"], "Alcool primaire → aldéhyde → acide carboxylique.", "Exact.") },
      { consigne: "Arrêtez le chauffage, laissez refroidir, ôtez le réfrigérant, puis versez le contenu du ballon dans le bécher.", court: "Versez le mélange dans le bécher.", aide_geste: "Prenez le ballon par son col et inclinez-le au-dessus du bécher.", verifier: ({ faits }) => R(faits).recu >= 30 || false },
    ],
  };

  const FILTRATION = {
    id: "filtration", paillasse: 1, titre: "Éliminer le dioxyde de manganèse",
    objectif: "Séparer le solide brun de la solution par filtration sous vide.",
    entetes: [],
    conclusion: "Le dioxyde de manganèse, solide, reste sur le papier filtre. Le filtrat est incolore : il contient les ions benzoate C₆H₅–COO⁻, solubles dans l'eau. La filtration sous vide (Büchner, fiole à vide, trompe à eau) est plus rapide qu'une filtration simple.",
    conclusion_courte: "MnO₂ retenu ; filtrat : ions benzoate.",
    etapes: [
      { consigne: "Posez un papier filtre dans le Büchner et mouillez-le avec la pissette.", court: "Papier posé et mouillé.", verifier: papier(F) },
      { consigne: "Ouvrez le robinet de la trompe à eau, puis versez tout le mélange dans le Büchner.", court: "Vide, mélange versé.", aide_geste: "Portez le bécher au-dessus du Büchner et inclinez-le avec la poignée.", verifier: ({ faits }) => (F(faits).vide && F(faits).residu && F(faits).filtrat >= 40) || false },
      { consigne: "Arrêtez : débranchez d'abord le tuyau de la fiole, puis fermez le robinet.", court: "Tuyau débranché, robinet fermé.", verifier: arreter(F) },
      { consigne: "Le filtrat est incolore. Il contient…", court: "Répondez dans le carnet.", question: choix(["les ions benzoate C₆H₅–COO⁻, solubles dans l'eau", "le dioxyde de manganèse", "de l'acide benzoïque solide"], "Qu'est-ce qui est resté sur le papier ?", "Exact.") },
    ],
  };

  const PRECIPITATION = {
    id: "precipitation", paillasse: 2, titre: "Précipiter l'acide benzoïque",
    objectif: "Acidifier le filtrat pour obtenir l'acide benzoïque solide, puis le recueillir.",
    entetes: [],
    donnees: ["Solubilité de l'acide benzoïque dans l'eau : 2,4 g/L à 20 °C, beaucoup moins à 0 °C", "Les ions benzoate sont très solubles"],
    conclusion: "L'acide chlorhydrique apporte des ions H₃O⁺ : C₆H₅–COO⁻ + H₃O⁺ → C₆H₅–COOH + H₂O. L'acide benzoïque, peu soluble dans l'eau froide, précipite en cristaux blancs ; on ajoute l'acide jusqu'à ce que plus rien ne précipite (pH acide). Une filtration sous vide le recueille ; on le rince à l'eau glacée et on le sèche à l'étuve avant de le peser.",
    conclusion_courte: "C₆H₅–COO⁻ + H₃O⁺ → C₆H₅–COOH (solide blanc).",
    etapes: [
      { consigne: "Mettez lunettes et gants, puis versez l'acide chlorhydrique dans le filtrat, peu à peu, jusqu'à ce qu'il ne se forme plus de précipité.", court: "Acidifier le filtrat.", aide_geste: "Portez le bécher d'acide au-dessus du filtrat et inclinez-le doucement.", verifier: ({ faits }) => (P(faits).cristaux > 5 && P(faits).benzoate <= 0.5) || false },
      { consigne: "Le précipité blanc est…", court: "Répondez dans le carnet.", question: choix(["l'acide benzoïque C₆H₅–COOH, peu soluble dans l'eau : C₆H₅–COO⁻ + H₃O⁺ → C₆H₅–COOH + H₂O", "du chlorure de sodium", "du dioxyde de manganèse"], "Les ions H₃O⁺ réagissent avec les ions benzoate.", "Exact.") },
      { consigne: "Posez et mouillez un papier filtre dans le Büchner.", court: "Papier posé et mouillé.", verifier: papier(C) },
      { consigne: "Ouvrez le robinet de la trompe, puis versez tout le mélange dans le Büchner.", court: "Cristaux filtrés.", verifier: ({ faits }) => (C(faits).vide && C(faits).residu && C(faits).filtrat >= 35) || false },
      { consigne: "Arrêtez : tuyau débranché d'abord, puis robinet fermé.", court: "Tuyau débranché, robinet fermé.", verifier: arreter(C) },
      { consigne: "On rince les cristaux avec de l'eau glacée plutôt qu'avec de l'eau tiède parce que…", court: "Répondez dans le carnet.", question: choix(["l'acide benzoïque est encore moins soluble à froid : on en perd moins", "l'eau glacée sèche plus vite", "l'eau tiède le transformerait en ions benzoate"], "Regardez les données de solubilité.", "Exact.") },
    ],
  };

  L.MISSIONS_BENZOIQUE = { reflux: REFLUX, filtration: FILTRATION, precipitation: PRECIPITATION, choix };
})(window.Labo);
