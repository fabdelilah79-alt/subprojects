/*
Rôle : simulation de l'activité 1 du chapitre « Synthèse d'espèces chimiques » (tronc commun) : synthèse d'un savon —
       sécurité (pictogrammes, protection, déchets), chauffage à reflux, relargage, filtration sous vide, test de la
       mousse comparé à un savon du commerce. Objectifs O1, O2, O3.
Reçoit : rien (les vérifications lisent les faits des paillasses).
Produit : la simulation démarrée : sécurité ; reflux ; filtration ; mousse.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const { securite, reflux, choix } = L.MISSIONS_SAVON;
  const F = (faits) => faits.filtration_savon || {}, M = (faits) => faits.mousse || {};

  const FILTRATION = {
    id: "filtration", paillasse: 2, titre: "Récupérer le savon",
    objectif: "Séparer les grains de savon de l'eau salée.",
    entetes: [],
    conclusion: "La filtration sous vide sépare le savon (solide, retenu par le papier) de l'eau salée qui contient l'éthanol, le glycérol et le reste de soude (filtrat). Pour arrêter : on débranche le tuyau, puis on ferme le robinet.",
    conclusion_courte: "Le savon solide reste sur le papier filtre.",
    etapes: [
      { consigne: "Posez un papier filtre dans le Büchner et mouillez-le avec la pissette.", court: "Papier posé et mouillé.", verifier: ({ faits }) => (F(faits).papier && F(faits).mouille) || false },
      { consigne: "Ouvrez le robinet de la trompe à eau, puis versez tout le mélange dans le Büchner.", court: "Vide, mélange versé.", verifier: ({ faits }) => (F(faits).vide && F(faits).residu && F(faits).filtrat >= 110) || false, aide_geste: "Portez le bécher au-dessus du Büchner et inclinez-le avec la poignée." },
      { consigne: "Arrêtez : débranchez d'abord le tuyau de la fiole (touchez la tubulure), puis fermez le robinet.", court: "Tuyau débranché, robinet fermé.", verifier: ({ faits }) => { const f = F(faits); if (f.retour) return "Retour d'eau : il fallait débrancher le tuyau avant de fermer le robinet."; return (!f.vide && !f.branche) || false; } },
      { consigne: "Sur le papier filtre, il reste…", court: "Répondez dans le carnet.", question: choix(["le savon, solide", "l'eau salée", "l'huile"], "Qu'est-ce qui traverse le papier ?", "Exact.") },
    ],
  };

  const MOUSSE = {
    id: "mousse", paillasse: 3, titre: "Est-ce bien du savon ?",
    objectif: "Comparer le produit obtenu à un savon du commerce : un savon fait mousser l'eau.",
    entetes: [],
    conclusion: "Secoués, les tubes 1 (savon obtenu) et 2 (savon du commerce) se remplissent de mousse ; le tube 3 (eau seule, témoin) n'en donne pas. Le produit synthétisé a la même propriété que le savon du commerce : on a bien fabriqué un savon.",
    conclusion_courte: "Il mousse comme le savon du commerce.",
    etapes: [
      { consigne: "Pour vérifier que le produit obtenu est un savon, on peut…", court: "Proposez une méthode.", question: choix(["le comparer à un savon du commerce : secouer chacun avec de l'eau et observer la mousse, avec de l'eau seule comme témoin", "le goûter", "regarder sa couleur"], "Que fait un savon dans l'eau ?", "Exact.") },
      { consigne: "Prenez chaque tube (il est bouché), secouez-le vivement, puis reposez-le dans le porte-tubes.", court: "Secouez les 3 tubes.", verifier: ({ faits }) => { const m = M(faits); return (m[1] > 0.5 && m[2] > 0.5) || false; } },
      { consigne: "La mousse s'est formée…", court: "Répondez dans le carnet.", question: choix(["dans les tubes 1 et 2 ; pas dans le tube 3 (témoin)", "dans les trois tubes", "seulement dans le tube 2"], "Comparez au témoin.", "Exact.") },
      { consigne: "On conclut que…", court: "Répondez dans le carnet.", question: choix(["le produit obtenu se comporte comme un savon : la synthèse a réussi", "le produit n'est pas un savon", "on ne peut rien dire"], "Comparez le tube 1 au tube 2.", "Exact.") },
    ],
  };

  L.demarrer({ id: "tc_chim3_a1_savon", titre: "Laboratoire : synthèse d'un savon", paillasses: [L.poste_securite_savon, L.poste_reflux_savon, L.poste_filtration_savon, L.poste_mousse], missions: [securite, reflux, FILTRATION, MOUSSE] });
})(window.Labo);
