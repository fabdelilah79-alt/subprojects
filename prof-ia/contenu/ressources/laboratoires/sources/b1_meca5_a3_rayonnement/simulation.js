/*
Rôle : simulation de l'activité 3 du chapitre « Énergie thermique, transfert thermique » (1re année du bac) : le
       rayonnement, mode de transfert d'énergie (lampe et plaques noire et brillante), et les trois modes de transfert
       thermique (tableau de situations et de documents). Objectifs O1 et O6.
Reçoit : rien (les vérifications lisent les faits « lampe » et « tri_transferts », la feuille de calcul et le graphique).
Produit : la simulation démarrée : lampe et plaques ; tableau magnétique.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const la = (f) => f.lampe || { releves: [] };

  function tableau({ faits, feuille }) {
    // Six relevés (0 à 5 min) : t, θ plaque noire, θ plaque brillante.
    const l = feuille.lignes(["A", "B", "C"]), r = la(faits).releves || [];
    if (l.length < 6) return false;
    for (const [k, x] of l.entries()) {
      const m = r.find((y) => y.min === Math.round(x.A));
      if (!m) return `Ligne ${k + 2} : t en minutes (colonne A), de 0 à 5, lampe allumée à 20 cm.`;
      if (Math.abs(x.B - m.tn) > 0.3 || Math.abs(x.C - m.tb) > 0.3) return `Ligne ${k + 2} : températures lues à ${m.min} min (plaque noire en B, plaque brillante en C).`;
    }
    return true;
  }

  const RAYONNEMENT = {
    id: "rayonnement", paillasse: 0, titre: "Le rayonnement",
    objectif: "Éclairer deux plaques identiques, l'une noire, l'autre brillante, avec une lampe ; suivre leurs températures.",
    entetes: ["t (min)", "θ noire (°C)", "θ brillante (°C)"],
    donnees: ["Lampe de 100 W, à 20 cm des plaques", "Plaques de cuivre identiques", "Chronomètre : temps accéléré × 10"],
    conclusion: "La lampe transfère de l'énergie aux plaques sans contact et sans déplacement de matière : c'est le rayonnement. Ce mode de transfert peut se faire à travers le vide (le rayonnement du Soleil chauffe la Terre). Une surface sombre et mate absorbe mieux le rayonnement qu'une surface claire et brillante, qui le réfléchit. La chaleur est un mode de transfert d'énergie : par conduction, par convection ou par rayonnement.",
    conclusion_courte: "Le rayonnement transfère de l'énergie sans contact, même dans le vide.",
    etapes: [
      { consigne: "La lampe est à 20 cm des plaques. Allumez-la : relevez les températures des deux plaques chaque minute, de 0 à 5 min.", court: "Lampe allumée à 20 cm.", verifier: ({ faits }) => la(faits).d === 20 && (la(faits).releves || []).length >= 6 },
      { consigne: "Tableur : t (min) en A, θ de la plaque noire en B, θ de la plaque brillante en C, de 0 à 5 min.", court: "Tableur : t, θ noire, θ brillante.", verifier: tableau },
      { consigne: "Tracez θ de la plaque noire (colonne B) en fonction du temps (colonne A).", court: "Graphique θ = f(t).", verifier: ({ courbe: c }) => (c.x === "A" && c.y === "B" && c.n >= 6) || false },
      { consigne: "Il n'y a aucun contact entre la lampe et les plaques, et l'air entre elles reste presque froid. L'énergie arrive aux plaques par…", court: "Répondez dans le carnet.", question: choix(["rayonnement", "conduction", "convection"], "La lumière et l'infrarouge de la lampe atteignent les plaques.", "Exact.") },
      { consigne: "Les deux plaques reçoivent le même rayonnement. La plaque noire s'échauffe beaucoup plus, car…", court: "Répondez dans le carnet.", question: choix(["une surface noire mate absorbe mieux le rayonnement qu'une surface brillante", "la plaque noire est plus lourde", "la plaque brillante est plus loin de la lampe"], "La plaque brillante renvoie le rayonnement, comme un miroir.", "Exact.") },
      { consigne: "Rapprochez la lampe à 15 cm des plaques et attendez : la température de la plaque noire…", court: "Lampe à 15 cm.", aide_geste: "Glissez la lampe le long de sa tige ; lisez la distance sur la règle.", verifier: ({ faits }) => (la(faits).allumee && la(faits).d === 15 && la(faits).tn > 46) || false },
      { consigne: "Plus la source est proche…", court: "Répondez dans le carnet.", question: choix(["plus la puissance reçue par rayonnement est grande", "moins la plaque s'échauffe", "plus la plaque brillante absorbe"], "Comparez les températures atteintes à 20 cm et à 15 cm.", "Exact.") },
    ],
  };

  const TRANSFERTS = {
    id: "transferts", paillasse: 1, titre: "Les modes de transfert thermique",
    objectif: "Classer des situations selon le mode de transfert thermique principal.",
    entetes: [],
    conclusion: "Trois modes de transfert thermique : la conduction (de proche en proche, sans déplacement de matière, surtout dans les solides), la convection (par le mouvement d'un fluide chaud) et le rayonnement (sans support matériel, même dans le vide). Le vase Dewar d'un calorimètre limite les trois : vide entre les parois (ni conduction ni convection), parois argentées (rayonnement réfléchi).",
    conclusion_courte: "Conduction, convection, rayonnement.",
    etapes: [
      { consigne: "Classez les situations selon le mode de transfert thermique principal.", court: "Classez les étiquettes.", verifier: ({ faits }) => L.tableau_tri.verifier(L.TRANSFERTS, faits.tri_transferts) },
      { consigne: "Le Soleil chauffe la Terre à travers 150 millions de kilomètres de vide. Le rayonnement…", court: "Répondez dans le carnet.", question: choix(["peut se propager dans le vide, sans support matériel", "a besoin d'air pour se propager", "est une forme de convection"], "Il n'y a pas de matière entre le Soleil et la Terre.", "Exact.") },
      { consigne: "Un calorimètre (vase Dewar) a une double paroi de verre argentée, avec du vide entre les deux parois. Ce vase…", court: "Répondez dans le carnet.", question: choix(["limite les trois modes de transfert : le vide arrête conduction et convection, l'argenture réfléchit le rayonnement", "laisse passer le rayonnement", "conduit bien la chaleur"], "Comparez à la plaque brillante.", "Exact.") },
    ],
  };

  L.demarrer({ id: "b1_meca5_a3_rayonnement", titre: "Laboratoire : le rayonnement", paillasses: [L.poste_lampe, L.poste_tri_transferts], missions: [RAYONNEMENT, TRANSFERTS] });
})(window.Labo);
