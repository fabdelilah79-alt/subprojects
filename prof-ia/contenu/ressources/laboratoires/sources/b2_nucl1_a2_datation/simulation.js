/*
Rôle : simulation de l'activité 2 du chapitre « Décroissance radioactive » (2e année du bac) : radioactivité dans
       l'environnement et effets biologiques (documents), choix du radioélément adapté à une datation (tableau de tri) ;
       datation au carbone 14 (compteur à scintillation) : courbe a(t) = a₀·e^(−λt) au tableur, méthodes graphique et
       calculatoire. Objectifs O4, O5, O6.
Reçoit : rien (les vérifications lisent les faits « docs_radio », « tri_datation », « datation », la feuille et la courbe).
Produit : la simulation démarrée.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const nombre = (unite, attendu, tolerance, aide, bravo) => ({ type: "nombre", unite, attendu, tolerance, aide, bravo });
  const LAMBDA = Math.LN2 / 5730, M = (f) => ((f.datation || {}).mesures || {});
  const age = (f, id) => (M(f)[id] && M(f).actuel ? Math.log(M(f).actuel / M(f)[id]) / LAMBDA : 0);

  function tableau({ faits, feuille }) {
    // Courbe théorique : t (ans) en A, de 0 à au moins 40 000 ans ; a = a₀·e^(−λt) en B (a₀ mesurée ou 0,227 Bq/g).
    const l = feuille.lignes(["A", "B"]), a0 = M(faits).actuel || 0.227;
    if (l.length < 8) return false;
    for (const [k, x] of l.entries()) {
      const ok = [a0, 0.227].some((v) => Math.abs(x.B - v * Math.exp(-LAMBDA * x.A)) <= 0.015 * v * Math.exp(-LAMBDA * x.A) + 1e-4);
      if (!ok) return `Ligne ${k + 2} : en B, a = a₀·e^(−λt) : =${String(a0).replace(".", ",")}*EXP(-0,000121*A${k + 2}).`;
    }
    return Math.max(...l.map((x) => x.A)) >= 40000 || "Allez jusqu'à t = 40 000 ans au moins.";
  }

  const ENVIRONNEMENT = {
    id: "environnement", paillasse: 0, titre: "La radioactivité autour de nous",
    objectif: "Lire les documents ; choisir le radioélément adapté pour dater un objet.",
    entetes: [],
    donnees: ["Au bout de n demi-vies, il reste une fraction 1/2ⁿ des noyaux"],
    conclusion: "La radioactivité est partout : roches, radon, rayons cosmiques, et notre propre corps (potassium 40, carbone 14). Ses effets biologiques dépendent de l'activité, de la durée d'exposition, du rayonnement et de l'énergie déposée dans le corps. Pour dater un objet, on choisit un radioélément dont la demi-vie est du même ordre de grandeur que l'âge cherché : carbone 14 pour les restes d'êtres vivants jusqu'à 50 000 ans environ, potassium 40 ou uranium 238 pour les roches, tritium pour quelques dizaines d'années.",
    conclusion_courte: "Demi-vie du même ordre que l'âge à mesurer.",
    etapes: [
      { consigne: "Lisez les quatre documents au mur.", court: "Lisez les documents.", aide_geste: "Touchez un document pour l'ouvrir, touchez-le de nouveau pour le refermer.", verifier: ({ faits }) => (faits.docs_radio || []).length >= 4 || false },
      { consigne: "La radioactivité de notre corps vient surtout…", court: "Répondez dans le carnet.", question: choix(["du potassium 40 et du carbone 14 qu'il contient", "des téléphones portables", "de la lumière du Soleil"], "Document « La radioactivité autour de nous ».", "Exact : environ 8 000 Bq pour un adulte.") },
      { consigne: "Les effets biologiques d'un rayonnement dépendent…", court: "Répondez dans le carnet.", question: choix(["de l'activité, de la durée d'exposition, du rayonnement et de l'énergie déposée dans le corps", "seulement de la couleur de la source", "de rien : la radioactivité est sans effet"], "Document « Effets biologiques ».", "Exact.") },
      { consigne: "Rangez chaque objet dans la colonne du radioélément qui permet de le dater.", court: "Tableau : quel radioélément ?", aide_geste: "Faites glisser chaque étiquette jaune dans une colonne.", verifier: ({ faits }) => L.tableau_tri.verifier(L.TRI_DATATION, faits.tri_datation) },
      { consigne: "Pour dater un objet, on choisit un radioélément…", court: "Répondez dans le carnet.", question: choix(["dont la demi-vie est du même ordre de grandeur que l'âge cherché", "de demi-vie la plus courte possible", "de demi-vie la plus longue possible"], "Document « Dater des roches ».", "Exact.") },
      { consigne: "Au bout de 10 demi-vies, quelle fraction des noyaux reste-t-il (en ‰) ?", court: "Fraction (‰) ?", question: nombre("‰", 1000 / 1024, 0.03, "1/2¹⁰ = 1/1024.", "Exact : moins d'un millième : la datation au carbone 14 s'arrête vers 50 000 ans.") },
    ],
  };

  const DATATION = {
    id: "datation", paillasse: 1, titre: "Dater au carbone 14",
    objectif: "Mesurer l'activité de carbone actuel et ancien ; tracer a(t) ; dater par une méthode graphique, puis par le calcul.",
    entetes: ["t (ans)", "a (Bq/g)"],
    donnees: ["Carbone 14 : t½ = 5 730 ans ; λ = ln 2 / t½ = 1,21 × 10⁻⁴ an⁻¹", "a(t) = a₀·e^(−λt), donc t = (1/λ)·ln(a₀ / a)"],
    conclusion: "Le carbone d'un être vivant a une activité a₀ ≈ 0,227 Bq/g. Après sa mort, a(t) = a₀·e^(−λt). Sur la courbe, on lit l'âge correspondant à l'activité mesurée (méthode graphique) ; par le calcul, t = (1/λ)·ln(a₀ / a) = (t½ / ln 2)·ln(a₀ / a). Le charbon de la grotte a environ 17 000 ans, l'os de mammouth environ 28 000 ans.",
    conclusion_courte: "t = (1/λ)·ln(a₀ / a).",
    etapes: [
      { consigne: "Glissez la fiole « charbon de bois actuel » dans le puits et touchez « Mesurer ».", court: "Mesure : carbone actuel.", verifier: ({ faits }) => !!M(faits).actuel || false },
      { consigne: "Activité a₀ du carbone actuel (Bq/g) ?", court: "a₀ (Bq/g) ?", question: nombre("Bq/g", (f) => M(f).actuel || 0.227, 0.0015, "Lisez la fiche de mesures.", "Exact : environ 0,227 Bq/g, comme celui d'un être vivant.") },
      { consigne: "Tableur : t de 0 à 40 000 ans (tous les 5 000 ans) en A ; a = a₀·e^(−λt) en B.", court: "Tableur : t, a(t).", aide_geste: "En B2 : =0,227*EXP(-0,000121*A2), puis « Recopier vers le bas ».", verifier: tableau },
      { consigne: "Tracez a (B) en fonction de t (A).", court: "Courbe a = f(t).", verifier: ({ courbe }) => (courbe.x === "A" && courbe.y === "B" && courbe.n >= 8) || "Abscisse : A (t) ; ordonnée : B (a)." },
      { consigne: "Mesurez l'activité du charbon de la grotte.", court: "Mesure : charbon de la grotte.", verifier: ({ faits }) => !!M(faits).grotte || false },
      { consigne: "Méthode graphique : sur la courbe, quel âge correspond à l'activité du charbon de la grotte (ans) ?", court: "Âge lu sur la courbe ?", question: nombre("ans", (f) => age(f, "grotte"), 1500, "Cherchez a mesurée sur l'axe des ordonnées, puis lisez t.", "Exact.") },
      { consigne: "Par le calcul : t = (1/λ)·ln(a₀ / a) (ans) ?", court: "Âge calculé (grotte) ?", question: nombre("ans", (f) => age(f, "grotte"), 200, "λ = 1,21 × 10⁻⁴ an⁻¹.", "Exact : environ 17 000 ans.") },
      { consigne: "Mesurez l'activité du carbone de l'os de mammouth.", court: "Mesure : os de mammouth.", verifier: ({ faits }) => !!M(faits).os || false },
      { consigne: "Âge de l'os de mammouth, par le calcul (ans) ?", court: "Âge de l'os ?", question: nombre("ans", (f) => age(f, "os"), 400, "Même calcul avec l'activité de l'os.", "Exact : environ 28 000 ans.") },
      { consigne: "Tant qu'il vit, un être vivant garde une activité constante en carbone 14 parce que…", court: "Répondez dans le carnet.", question: choix(["il échange du carbone avec l'atmosphère : le carbone 14 désintégré est remplacé", "le carbone 14 ne se désintègre pas dans un être vivant", "il fabrique du carbone 14"], "Document « Le carbone 14 ».", "Exact : après la mort, les échanges cessent.") },
    ],
  };

  L.demarrer({ id: "b2_nucl1_a2_datation", titre: "Laboratoire : radioactivité et datation", paillasses: [L.poste_environnement, L.poste_datation], missions: [ENVIRONNEMENT, DATATION] });
})(window.Labo);
