/*
Rôle : simulation de l'activité 2 du chapitre « Transformations rapides et transformations lentes » (2e année du bac) :
       exemples de la vie courante ; l'autocuiseur (l'eau y bout à 120 °C : la cuisson, suite de transformations lentes, est
       environ 3,5 fois plus rapide) ; la conservation des aliments par le froid (la même transformation lente, beaucoup plus
       lente dans un bain de glace à 2 °C qu'à 20 °C ; réfrigérateur et congélateur). Objectif O3.
Reçoit : rien (les vérifications lisent les documents lus, « tubes_froid » et la feuille).
Produit : la simulation démarrée.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const TF = (f) => f.tubes_froid || {};

  function cuisson({ feuille }) {
    // Lignes 2 à 5 : A durée à 100 °C, B durée à 120 °C (min) d'un aliment du document, C = A/B.
    const v = (c, n) => feuille.valeur_sure(`${c}${n}`), vus = new Set();
    for (let n = 2; n <= 12; n++) {
      if (v("A", n) === null) continue;
      const a = L.CUISSON.find(([, t1, t2]) => t1 === v("A", n) && t2 === v("B", n));
      if (!a) return `Ligne ${n} : en A la durée à 100 °C, en B la durée à 120 °C d'un même aliment (document « Durées de cuisson »).`;
      if (v("C", n) === null || Math.abs(v("C", n) - a[1] / a[2]) > 0.02) return `Ligne ${n} : en C, =A${n}/B${n}.`;
      vus.add(a[0]);
    }
    return vus.size >= 4 || false;
  }

  const AUTOCUISEUR = {
    id: "autocuiseur", paillasse: 0, titre: "L'autocuiseur",
    conclusion: "Dans l'autocuiseur, la vapeur reste enfermée : la pression atteint environ 2 bar et l'eau bout vers 120 °C au lieu de 100 °C. Les transformations chimiques de la cuisson, qui sont lentes, se font environ 3,5 fois plus vite : la cuisson dure environ trois à quatre fois moins longtemps. La température est un facteur cinétique.",
    objectif: "Comparer les durées de cuisson à 100 °C et à 120 °C.",
    entetes: ["100 °C (min)", "120 °C (min)", "rapport"], donnees: ["Une ligne par aliment du document", "Rapport = durée à 100 °C / durée à 120 °C"],
    conclusion_courte: "Autocuiseur : 120 °C, cuisson plus rapide.",
    etapes: [
      { consigne: "Lisez les deux documents au mur.", court: "Lisez les documents.", aide_geste: "Touchez un document pour l'ouvrir.", verifier: ({ faits }) => (faits.docs_autocuiseur || []).length >= 2 },
      { consigne: "Tableur : pour les quatre aliments, durée à 100 °C en A, durée à 120 °C en B, rapport =A2/B2 en C.", court: "Tableur : durées, rapport.", verifier: cuisson },
      { consigne: "Dans l'autocuiseur, la cuisson est plus rapide, car…", court: "Répondez dans le carnet.", question: choix(["l'eau y bout à 120 °C : à plus haute température, les transformations de la cuisson sont plus rapides", "la pression écrase les aliments", "il y a plus de vapeur qui cuit les aliments"], "Relisez « L'autocuiseur ».", "Exact : la température est un facteur cinétique.") },
      { consigne: "En moyenne, la cuisson est plus rapide d'environ…", court: "Répondez dans le carnet.", question: choix(["3 à 4 fois", "20 fois", "1,2 fois"], "Regardez la colonne C.", "Exact.") },
    ],
  };

  const FROID = {
    id: "froid", paillasse: 1, titre: "Conserver par le froid",
    conclusion: "Dans le bain de glace (2 °C), l'eau oxygénée oxyde les ions iodure environ cinq fois plus lentement qu'à 20 °C : la solution reste presque incolore. De même, au réfrigérateur (4 °C) et au congélateur (−18 °C), les transformations lentes qui altèrent les aliments sont fortement ralenties : on conserve les aliments plus longtemps.",
    objectif: "Comparer la même transformation lente à 20 °C et à 2 °C.",
    entetes: [], donnees: ["Bain de glace : 2 °C", "Porte-tubes : 20 °C", "Tubes 1 et 2 : iodure acidifié"],
    conclusion_courte: "Froid : transformations ralenties.",
    etapes: [
      { consigne: "Placez le tube 2 dans le bain de glace et attendez qu'il soit froid.", court: "Tube 2 dans la glace.", aide_geste: "Faites glisser le tube jusqu'à une place du bain.", verifier: ({ faits }) => ((TF(faits).t2 || {}).glace && (TF(faits).t2 || {}).T <= 5 && !(TF(faits).t1 || {}).glace) || false },
      { consigne: "Versez 10 gouttes d'eau oxygénée dans chaque tube et comparez-les pendant deux minutes.", court: "Eau oxygénée ; comparez.", verifier: ({ faits }) => { const a = TF(faits).t1 || {}, b = TF(faits).t2 || {}; return (a.peroxyde >= 0.4 && b.peroxyde >= 0.4 && a.I2 >= 2 && a.I2 > 3 * b.I2) || false; } },
      { consigne: "Dans le bain de glace, la transformation est…", court: "Répondez dans le carnet.", question: choix(["beaucoup plus lente : le froid ralentit les transformations", "plus rapide", "arrêtée pour toujours"], "Comparez les couleurs des deux tubes.", "Exact.") },
      { consigne: "Lisez le document « Conserver les aliments ». Au congélateur, les aliments se conservent des mois, car…", court: "Lisez le document ; répondez.", question: choix(["à −18 °C, les transformations qui les altèrent sont très lentes", "le froid tue toujours tous les microbes", "le froid empêche l'air d'entrer"], "Relisez le document.", "Exact.") },
    ],
  };

  L.demarrer({ id: "b2_chim1_a2_vie_courante", titre: "Laboratoire : transformations lentes de la vie courante", paillasses: [L.poste_autocuiseur, L.poste_refrigerateur], missions: [AUTOCUISEUR, FROID] });
})(window.Labo);
