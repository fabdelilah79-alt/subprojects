/*
Rôle : missions « synthèse de l'arôme » (chauffage à reflux) et « lavage à l'eau salée » de l'activité 2 du chapitre
       « Synthèse d'espèces chimiques ».
Reçoit : rien (les vérifications lisent les faits des paillasses).
Produit : Labo.MISSIONS_AROME = { reflux, lavage, choix }.
Utilisé par : simulation.js.
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const R = (faits) => faits.reflux_arome || {}, W = (faits) => faits.lavage || {};

  const REFLUX = {
    id: "reflux", paillasse: 0, titre: "Synthétiser un arôme de banane",
    objectif: "L'acétate d'isoamyle donne son odeur à la banane. On le fabrique à partir de l'alcool isoamylique et de l'acide acétique.",
    entetes: [],
    conclusion: "Alcool isoamylique + acide acétique → acétate d'isoamyle + eau. La transformation est lente : on chauffe à reflux pendant 30 minutes, et quelques gouttes d'acide sulfurique (catalyseur) l'accélèrent. Les réactifs sont inflammables et corrosifs : lunettes, gants, pas de flamme.",
    conclusion_courte: "Alcool + acide → ester + eau (à reflux, catalyseur).",
    etapes: [
      { consigne: "Mettez les lunettes et les gants.", court: "Lunettes et gants.", verifier: ({ faits }) => R(faits).epi || false },
      { consigne: "Par l'entonnoir, versez l'alcool isoamylique et l'acide acétique dans le ballon, puis ajoutez 2 ou 3 gouttes d'acide sulfurique avec le compte-gouttes.", court: "Réactifs et catalyseur dans le ballon.", verifier: ({ faits }) => { const r = R(faits); return (r.alcool_isoamylique >= 12 && r.acide_acetique >= 15 && r.acide_sulfurique >= 0.09) || false; }, aide_geste: "Pour les gouttes : lâchez la pipette au-dessus de l'entonnoir, puis appuyez sur la poire." },
      { consigne: "Ajoutez la pierre ponce, rangez l'entonnoir, posez le réfrigérant et ouvrez l'eau.", court: "Ponce, réfrigérant, eau.", verifier: ({ faits }) => { const r = R(faits); return (r.ponce && r.refrigerant === "monte" && r.eau) || false; } },
      { consigne: "Chauffez à reflux pendant 30 minutes.", court: "Reflux pendant 30 min.", verifier: ({ faits }) => { const r = R(faits); if (r.fuite) return "Des vapeurs inflammables s'échappent : réfrigérant posé et eau ouverte !"; return r.avance >= 1 || false; } },
      { consigne: "L'acide sulfurique ajouté en petite quantité…", court: "Répondez dans le carnet.", question: choix(["accélère la transformation (c'est un catalyseur)", "donne l'odeur de banane", "refroidit le mélange"], "Sans lui, la transformation serait beaucoup plus lente.", "Exact.") },
      { consigne: "Arrêtez le chauffage, laissez refroidir, ôtez le réfrigérant, puis versez le contenu du ballon dans le bécher « mélange obtenu ».", court: "Versez le mélange obtenu.", verifier: ({ faits }) => R(faits).recu >= 20 || false },
    ],
  };

  const LAVAGE = {
    id: "lavage", paillasse: 1, titre: "Laver et séparer l'ester",
    objectif: "Séparer l'ester formé de l'eau et de l'acide qui restent, grâce à l'eau salée.",
    entetes: [],
    conclusion: "L'ester est peu soluble dans l'eau salée et moins dense qu'elle (0,87) : il forme la phase supérieure, qui sent la banane. La phase aqueuse (en bas) contient l'acide restant ; on l'élimine par le robinet. On sent une espèce par déplacement d'air, jamais en mettant le nez au-dessus.",
    conclusion_courte: "L'ester, moins dense, est la phase du dessus.",
    etapes: [
      { consigne: "Fermez le robinet de l'ampoule, puis versez le mélange obtenu et l'eau salée.", court: "Robinet fermé ; mélange et eau salée.", verifier: ({ faits }) => { const w = W(faits); return (w.sale >= 40 && w.brut + w.ester / 0.4 >= 30) || false; } },
      { consigne: "Bouchez l'ampoule, secouez-la, reposez-la sur l'anneau et dégazez (touchez le robinet).", court: "Bouchez, agitez, dégazez.", verifier: ({ faits }) => (W(faits).agitee && W(faits).degaze) || false },
      { consigne: "Laissez décanter. La phase du dessus est…", court: "Répondez dans le carnet.", question: choix(["l'ester (densité 0,87), moins dense que l'eau salée", "l'eau salée", "l'acide sulfurique"], "Comparez les densités.", "Exact.") },
      { consigne: "Ôtez le bouchon, éliminez la phase aqueuse par le robinet et fermez-le juste avant l'ester.", court: "Phase aqueuse éliminée.", verifier: ({ faits }) => { const w = W(faits); if (w.recu_ester > 1.5) return "De l'ester est passé dans le bécher : il fallait fermer plus tôt."; return (w.decante && w.aq < 1.5 && w.recu_aq >= 50 && !w.robinet && w.ester >= 8) || false; } },
      { consigne: "Sentez l'ester par déplacement d'air (touchez la carte « Sentir »).", court: "Sentez l'ester.", verifier: ({ faits }) => W(faits).senti || false },
    ],
  };

  L.MISSIONS_AROME = { reflux: REFLUX, lavage: LAVAGE, choix };
})(window.Labo);
