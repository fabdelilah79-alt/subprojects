/*
Rôle : simulation de l'activité 2 du chapitre « Le mouvement » (tronc commun, fiche tronc_commun/meca2_mouvement) :
       « Décrire le mouvement d'un point par rapport à un référentiel (choix du repère d'espace et de temps) ».
       Objectifs O1 (choisir un repère d'espace et de temps, décrire la trajectoire) et O4 (exploiter un enregistrement).
Reçoit : rien (les vérifications lisent l'enregistrement, l'origine du repère choisie et le tableur).
Produit : la simulation démarrée : table à coussin d'air, éclateur, feuille, transparent millimétré.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const V = L.VERIF_ENR, N = 7;
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });

  function enregistrement_droit({ faits }) {
    // Un enregistrement d'au moins 10 points, sans rebond sur les premiers points.
    const e = V.dernier(faits);
    if (!e) return false;
    if (e.points.length < 10) return "L'enregistrement est trop court : relancez le mobile pendant l'enregistrement.";
    return V.rectiligne(e.points, 10) || "Le mobile a rebondi sur un bord : relancez-le moins vite, vers le milieu de la table.";
  }

  function tableau({ feuille, faits }) {
    // t (s), x (cm), y (cm) des points M0 à M6, dans le repère choisi (origine du transparent), t = 0 en M0.
    const e = V.dernier(faits), o = faits.origine_repere;
    if (!e || !o) return false;
    const lignes = feuille.lignes(["A", "B", "C"]);
    for (let i = 0; i < Math.min(lignes.length, N); i++) {
      const l = lignes[i], c = V.coordonnees(e.points[i], o);
      if (Math.abs(l.A - i * e.tau_s) > 0.0005) return `Ligne ${i + 2} : t = ${i} × τ = ${L.nombre_court(i * e.tau_s)} s (t = 0 en M0).`;
      if (Math.abs(l.B - c.x) > 0.15 || Math.abs(l.C - c.y) > 0.15) return `Relisez les coordonnées de M${i} sur le transparent (en cm, au millimètre près).`;
    }
    return lignes.length >= N || false;
  }

  const REPERE = {
    id: "repere", paillasse: 0, titre: "Repérer le mouvement d'un point",
    objectif: "Enregistrer le mouvement du mobile, choisir un repère d'espace et un repère de temps, puis décrire la trajectoire.",
    entetes: ["t (s)", "x (cm)", "y (cm)"],
    conclusion: "Pour décrire un mouvement, on choisit un référentiel (ici la table), un repère d'espace (O, x, y) et un repère de temps (origine des dates t = 0).",
    conclusion_courte: "Référentiel + repère d'espace + repère de temps.",
    etapes: [
      { consigne: "Appuyez sur « Enregistrer » de l'éclateur, puis lancez le mobile d'un geste vif sur la table.", court: "Enregistrez le mouvement du mobile.", verifier: enregistrement_droit, aide_geste: "Faites glisser le mobile et lâchez-le en mouvement. Le bouton rotatif règle τ." },
      { consigne: "Touchez la feuille pour la prendre en main. Posez l'origine O du transparent où vous voulez (par exemple sur M0) : c'est votre repère d'espace.", court: "Prenez la feuille, posez l'origine O.", verifier: ({ faits }) => !!faits.origine_repere },
      { consigne: "Repère de temps : t = 0 au point M0. Dans le tableur, notez t (s), x (cm) et y (cm) des points M0 à M6.", court: "Tableur : t, x, y de M0 à M6.", verifier: tableau, aide_geste: "Deux points voisins sont séparés de τ. Zoomez sur la feuille pour lire au millimètre." },
      { consigne: "Tracez la trajectoire : y en fonction de x.", court: "Tracez y en fonction de x.", verifier: ({ courbe }) => courbe.x === "B" && courbe.y === "C" && courbe.n >= N },
      { consigne: "Dans le référentiel de la table, la trajectoire du mobile est…", court: "Répondez dans le carnet.", question: choix(["une droite : le mouvement est rectiligne", "un cercle", "une courbe quelconque"], "Les points sont-ils alignés ?", "Exact : les points sont alignés.") },
      { consigne: "Combien de temps sépare les points M0 et M5 ?", court: "Durée entre M0 et M5 ?", question: { type: "nombre", unite: "s", attendu: (f) => 5 * f.enregistrement.tau_s, tolerance: 0.0005, aide: "Entre deux points voisins, il s'écoule τ.", bravo: "Exact : 5 intervalles de durée τ." } },
      { consigne: "Si vous posez l'origine O ailleurs sur la feuille…", court: "Répondez dans le carnet.", question: choix(["les coordonnées changent, mais pas la forme de la trajectoire", "rien ne change", "la trajectoire change de forme"], "Déplacez le transparent et regardez les coordonnées d'un point.", "Exact : le repère change les coordonnées, pas la trajectoire dans ce référentiel.") },
    ],
  };

  L.demarrer({
    id: "tc_meca2_a2_repere", titre: "Laboratoire : repérer un mouvement",
    paillasses: [(g) => L.poste_coussin_air(g, { outils: ["transparent"] })],
    missions: [REPERE],
  });
})(window.Labo);
