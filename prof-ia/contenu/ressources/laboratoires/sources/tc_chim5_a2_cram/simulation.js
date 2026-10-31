/*
Rôle : simulation de l'activité 2 du chapitre « Géométrie de quelques molécules » (tronc commun) : modèles moléculaires
       (CH₄, NH₃, H₂O, C₂H₄, CO₂) dont la géométrie vient de la répulsion des doublets liants et non liants ; représentation de
       Cram du méthane, à partir du modèle tourné pour avoir deux liaisons dans le plan. Objectif O4.
Reçoit : rien (les vérifications lisent les faits « modele » et « cram »).
Produit : la simulation démarrée : géométrie ; Cram.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const M = (faits) => faits.modele || {};
  const GESTE = "Faites glisser une boule depuis la boîte et lâchez-la contre un trou libre (point noir) du modèle. Glissez à côté du modèle pour le tourner. Touchez une liaison pour la rendre double.";
  const indice = (t) => t.replace(/\d/g, (c) => "₀₁₂₃₄₅₆₇₈₉"[c]);
  const meme = (a, b) => [...a.matchAll(/([A-Z][a-z]?)(\d*)/g)].map(([, e, n]) => e + (n || 1)).sort().join() === [...b.matchAll(/([A-Z][a-z]?)(\d*)/g)].map(([, e, n]) => e + (n || 1)).sort().join();

  function modele(brute, autre = () => true) {
    // Le modèle a la bonne formule brute, sans trou libre, et vérifie une condition de plus.
    return ({ faits }) => {
      const m = M(faits);
      if (!m.n) return false;
      if (!meme(m.brute, brute)) return m.complet ? `Votre modèle est ${indice(m.brute)} : il faut ${indice(brute)}. Touchez « Tout démonter ».` : false;
      if (!m.complet) return "Il reste des trous libres : chaque atome doit former toutes ses liaisons.";
      return autre(m) || false;
    };
  }
  const batir = (brute, texte, autre, aide) => ({ consigne: texte, court: `Modèle de ${indice(brute)}.`, aide_geste: aide || GESTE, verifier: modele(brute, autre) });

  const GEOMETRIE = {
    id: "geometrie", paillasse: 0, titre: "La géométrie des molécules",
    objectif: "Construire les modèles de CH₄, NH₃ et H₂O et expliquer leur forme par la répulsion des doublets.",
    entetes: [],
    conclusion: "Autour d'un atome, les doublets d'électrons (liants et non liants) se repoussent et s'écartent le plus possible : quatre doublets sont dirigés vers les sommets d'un tétraèdre. CH₄ est tétraédrique (109,5°) ; NH₃ est pyramidale (107°) et H₂O coudée (104,5°), car leurs doublets non liants repoussent un peu plus les liaisons.",
    conclusion_courte: "Tétraèdre : CH₄ ; pyramide : NH₃ ; coudée : H₂O.",
    etapes: [
      batir("CH4", "Avec la boîte de modèles, construisez la molécule de méthane CH₄. Tournez le modèle pour bien le voir."),
      { consigne: "Les quatre atomes d'hydrogène du méthane sont aux sommets…", court: "Répondez dans le carnet.", question: choix(["d'un tétraèdre : chaque angle H–C–H vaut 109,5°", "d'un carré : les angles valent 90°", "d'un triangle : les angles valent 120°"], "Tournez le modèle dans tous les sens.", "Exact : c'est la forme où les 4 doublets liants sont le plus loin possible les uns des autres.") },
      batir("NH3", "Touchez « Tout démonter », puis construisez l'ammoniac NH₃."),
      { consigne: "La molécule NH₃ a la forme d'une pyramide, et l'angle H–N–H vaut 107°, un peu moins que 109,5°, car…", court: "Répondez dans le carnet.", question: choix(["le doublet non liant de l'azote repousse un peu plus les trois liaisons", "l'azote est plus gros que le carbone", "il manque un hydrogène"], "L'azote a 3 doublets liants et 1 doublet non liant.", "Exact.") },
      batir("H2O", "Construisez la molécule d'eau H₂O."),
      { consigne: "La molécule d'eau est…", court: "Répondez dans le carnet.", question: choix(["coudée (angle H–O–H de 104,5°), à cause des deux doublets non liants de l'oxygène", "droite (180°)", "plane en triangle (120°)"], "Regardez le modèle de côté.", "Exact.") },
    ],
  };

  const CRAM = {
    id: "cram", paillasse: 0, titre: "La représentation de Cram",
    objectif: "Représenter une molécule en perspective avec les conventions de Cram ; voir la géométrie des molécules à liaisons multiples.",
    entetes: [],
    conclusion: "Dans la représentation de Cram, un trait simple est une liaison dans le plan de la feuille, un triangle plein une liaison vers l'avant, un triangle hachuré une liaison vers l'arrière. Le méthane se dessine avec deux traits, un triangle plein et un triangle hachuré. Avec une liaison double, la molécule d'éthylène C₂H₄ est plane (120°) ; avec deux liaisons doubles, CO₂ est linéaire (180°).",
    conclusion_courte: "Cram : trait (plan), plein (avant), hachuré (arrière).",
    etapes: [
      batir("CH4", "Construisez de nouveau le méthane, puis tournez-le pour que deux liaisons C–H soient dans le plan de l'écran (une troisième vient vers vous, la quatrième part derrière).", (m) => (m.vue.plan === 2 && m.vue.avant === 1 && m.vue.arriere === 1) || false, "Glissez lentement à côté du modèle : une liaison doit pointer vers vous, une autre vers le fond."),
      { consigne: "Au tableau, dessinez la représentation de Cram du méthane : touchez chaque liaison pour choisir son style.", court: "Cram du méthane au tableau.", verifier: ({ faits }) => { const c = faits.cram || {}; return (c.plan === 2 && c.avant === 1 && c.arriere === 1) || false; } },
      { consigne: "Dans la représentation de Cram, un triangle hachuré représente une liaison…", court: "Répondez dans le carnet.", question: choix(["qui part en arrière du plan de la feuille", "qui vient vers l'avant", "double"], "Comparez avec le modèle.", "Exact ; le triangle plein vient vers l'avant, le trait simple est dans le plan.") },
      batir("C2H4", "Touchez « Tout démonter ». Construisez l'éthylène C₂H₄ : deux carbones, liaison double (touchez-la), puis les hydrogènes.", (m) => m.plan || "Le modèle devrait être plan : vérifiez la liaison double.", "Accrochez d'abord le deuxième carbone, touchez la liaison pour la doubler, puis ajoutez les hydrogènes."),
      { consigne: "La molécule d'éthylène est…", court: "Répondez dans le carnet.", question: choix(["plane : ses 6 atomes sont dans un même plan, avec des angles de 120°", "tétraédrique", "linéaire"], "Regardez le modèle par la tranche.", "Exact : autour de chaque carbone, il n'y a que 3 directions de doublets.") },
      batir("CO2", "Construisez le dioxyde de carbone CO₂ (deux liaisons doubles).", (m) => m.lineaire || "Le modèle devrait être droit : les deux liaisons doivent être doubles."),
      { consigne: "La molécule de CO₂ est linéaire, car…", court: "Répondez dans le carnet.", question: choix(["autour du carbone, il n'y a que 2 directions de doublets (deux liaisons doubles), qui s'écartent à 180°", "le carbone n'a pas de doublet", "l'oxygène attire le carbone"], "Une liaison double compte pour une seule direction.", "Exact.") },
    ],
  };

  L.demarrer({ id: "tc_chim5_a2_cram", titre: "Laboratoire : géométrie des molécules", paillasses: [L.poste_cram], missions: [GEOMETRIE, CRAM] });
})(window.Labo);
