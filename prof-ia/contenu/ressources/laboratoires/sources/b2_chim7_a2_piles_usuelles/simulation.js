/*
Rôle : simulation de l'activité 2 du chapitre « Transformations spontanées dans les piles et production d'énergie » (2e année
       du bac) : documents sur l'histoire des piles, les piles usuelles, les accumulateurs, leurs dangers et leur recyclage ;
       quantité d'électricité d'une pile alcaline ; classement de huit générateurs en piles et accumulateurs. Objectifs O3, O4.
Reçoit : rien (les vérifications lisent les faits « docs_piles », « tri_piles »).
Produit : la simulation démarrée.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });

  function tri({ faits }) {
    // Toutes les étiquettes rangées dans la bonne colonne.
    const t = faits.tri_piles || {};
    if (L.TRI_PILES.some(([id]) => t[id] === undefined || t[id] === null)) return false;
    const faux = L.TRI_PILES.filter(([id, , c]) => t[id] !== c);
    return faux.length === 0 || `${faux.length} étiquette(s) mal rangée(s) : relisez le document « Accumulateurs ».`;
  }

  const DOCUMENTS = {
    id: "documents", paillasse: 0, titre: "Les piles, d'hier à aujourd'hui",
    conclusion: "Depuis la pile de Volta (1800), les piles convertissent de l'énergie chimique en énergie électrique grâce à une transformation spontanée d'oxydoréduction entre deux couples séparés. Une pile usée ne se recharge pas ; un accumulateur se recharge par une transformation forcée. La capacité d'une pile (en mAh) est la quantité d'électricité maximale qu'elle peut débiter : 2 400 mAh = 8 640 C. Piles et accumulateurs contiennent des métaux toxiques : on les dépose dans un point de collecte pour qu'ils soient recyclés.",
    objectif: "Lire des documents sur les piles et en tirer l'essentiel.",
    entetes: [], donnees: ["1 mAh = 3,6 C", "Quatre documents au mur"],
    conclusion_courte: "Énergie chimique → électrique ; collecte et recyclage.",
    etapes: [
      { consigne: "Lisez les quatre documents.", court: "Lisez les documents.", aide_geste: "Touchez un document pour l'ouvrir, puis pour le refermer.", verifier: ({ faits }) => (faits.docs_piles || []).length >= 4 || false },
      { consigne: "Une pile convertit…", court: "Répondez dans le carnet.", question: choix(["de l'énergie chimique en énergie électrique, par une transformation spontanée", "de l'énergie électrique en énergie chimique", "de la chaleur en électricité"], "Relisez « Histoire des piles ».", "Exact.") },
      { consigne: "Quantité d'électricité maximale Q (C) d'une pile alcaline de 2 400 mAh ?", court: "Q (C) ?", question: { type: "nombre", unite: "C", attendu: 2.4 * 3600, tolerance_relative: 0.02, aide: "Q = I·Δt : 2 400 mAh = 2,4 A × 3 600 s.", bravo: "Exact : 8 640 C." } },
      { consigne: "Une batterie de voiture donne 12 V, car…", court: "Répondez dans le carnet.", question: choix(["elle contient six éléments au plomb de 2 V en série", "un élément au plomb donne 12 V", "elle est rechargée en roulant"], "Relisez « Accumulateurs ».", "Exact.") },
      { consigne: "Une pile usagée doit…", court: "Répondez dans le carnet.", question: choix(["être déposée dans un point de collecte : elle contient des métaux toxiques que l'on recycle", "être jetée avec les ordures ménagères", "être brûlée"], "Relisez « Dangers et recyclage ».", "Exact.") },
    ],
  };

  const TRI = {
    id: "tri", paillasse: 1, titre: "Pile ou accumulateur ?",
    conclusion: "Piles (non rechargeables) : piles alcalines, salines, bouton et au lithium. Accumulateurs (rechargeables) : batterie au plomb, accumulateurs Ni-MH et Ni-Cd, batteries lithium-ion. Recharger un accumulateur, c'est lui imposer une transformation forcée, inverse de la transformation spontanée qui a lieu quand il débite.",
    objectif: "Distinguer piles et accumulateurs.",
    entetes: [], donnees: ["Huit générateurs électrochimiques de la vie courante"],
    conclusion_courte: "Accumulateur : rechargeable (transformation forcée).",
    etapes: [
      { consigne: "Rangez les huit étiquettes dans le tableau.", court: "Rangez les étiquettes.", aide_geste: "Faites glisser chaque étiquette dans une colonne.", verifier: tri },
      { consigne: "Recharger un accumulateur, c'est…", court: "Répondez dans le carnet.", question: choix(["lui imposer avec un générateur une transformation forcée, inverse de celle qui a lieu quand il débite", "le laisser se reposer", "lui ajouter de l'électrolyte"], "Relisez « Accumulateurs ».", "Exact.") },
    ],
  };

  L.demarrer({ id: "b2_chim7_a2_piles_usuelles", titre: "Laboratoire : piles et accumulateurs de la vie courante", paillasses: [L.poste_docs_piles, L.poste_tri_piles], missions: [DOCUMENTS, TRI] });
})(window.Labo);
