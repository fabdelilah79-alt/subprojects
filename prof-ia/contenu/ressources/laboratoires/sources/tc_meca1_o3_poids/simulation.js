/*
Rôle : simulation complémentaire du chapitre « Exemples d'actions mécaniques » (tronc commun), objectif O3 :
       « Connaître et utiliser P = m·g » (g en altitude : tc_meca1_o3_altitude). La fiche officielle ne cite pas d'activité pour cet
       objectif : simulation proposée en complément, à valider par l'enseignant.
Reçoit : rien (les vérifications lisent les faits notés par la paillasse, le tableur et la courbe).
Produit : la simulation démarrée (une paillasse, une mission).
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const G = 9.81;
  const proche_de_liste = (v, liste, tol) => liste.some((x) => Math.abs(x - v) <= tol);

  function tableau_poids({ feuille, faits }) {
    // Au moins 5 masses différentes réellement pesées, P lu correctement (à 0,15 N près).
    const lignes = feuille.lignes(["A", "B"]);
    for (const l of lignes) {
      if (l.A > 2) return `La masse doit être en kilogrammes : ${L.nombre(l.A, 0)} g = ${L.nombre(l.A / 1000, 3)} kg.`;
      if (!proche_de_liste(l.A, faits.poids_mesures || [], 0.0006)) return `Vous n'avez pas encore accroché m = ${L.nombre(l.A, 3)} kg au dynamomètre.`;
      if (Math.abs(l.B - l.A * G) > 0.15) return `Relisez le dynamomètre pour m = ${L.nombre(l.A, 3)} kg (zoomez à deux doigts).`;
    }
    if (faits.poids_surcharge) return "Attention : au-delà de 10 N, le dynamomètre est en butée. Retirez des masses.";
    return new Set(lignes.map((l) => l.A)).size >= 5 || false;
  }


  const POIDS = {
    id: "poids", paillasse: 0, titre: "Le poids d'un corps",
    objectif: "Trouver la relation entre le poids P d'un corps et sa masse m.",
    entetes: ["m (kg)", "P (N)"],
    conclusion: "P et m sont proportionnels : P = m·g, avec g ≈ 9,8 N/kg, l'intensité de la pesanteur au sol.",
    conclusion_courte: "P = m·g ; g ≈ 9,8 N/kg.",
    etapes: [
      { consigne: "Prenez une masse marquée dans le coffret et accrochez-la au crochet du dynamomètre.", court: "Accrochez une masse au crochet du dynamomètre.", verifier: ({ faits }) => !!faits.poids_accroche, aide_geste: "Faites glisser la masse par son crochet jusqu'au crochet du dynamomètre." },
      { consigne: "Mesurez le poids P de 5 masses différentes (vous pouvez accrocher les masses les unes sous les autres). Notez m (kg) et P (N) dans le tableur de la tablette.", court: "5 masses : notez m (kg) et P (N) dans le tableur.", verifier: tableau_poids, aide_geste: "Touchez la tablette pour la prendre. Zoomez à deux doigts pour bien lire le dynamomètre." },
      { consigne: "Dans l'application Graphique, tracez P en fonction de m.", court: "Tracez P en fonction de m.", verifier: ({ courbe }) => courbe.x === "A" && courbe.y === "B" && courbe.n >= 5 },
      { consigne: "Modélisez la courbe par une droite. Combien vaut g, le coefficient de proportionnalité ?", court: "Modélisez : combien vaut g ?", question: { type: "nombre", unite: "N/kg", attendu: G, tolerance: 0.25, aide: "Lisez le coefficient a du modèle P = a × m.", bravo: "Exact : g ≈ 9,8 N/kg." } },
      { consigne: "Défi : quelle est la masse du caillou ? Pesez-le, puis calculez m = P / g.", court: "Défi : trouvez la masse du caillou.", question: { type: "nombre", unite: "kg", attendu: 0.35, tolerance: 0.015, aide: "Accrochez le caillou seul, lisez P, puis calculez m = P / g (en kg).", bravo: "Exact : m ≈ 0,35 kg." } },
    ],
  };

  L.demarrer({ id: "tc_meca1_o3_poids", titre: "Laboratoire : le poids d'un corps", paillasses: [L.poste_poids], missions: [POIDS] });
})(window.Labo);
