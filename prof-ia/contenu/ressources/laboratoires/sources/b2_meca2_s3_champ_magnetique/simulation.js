/*
Rôle : simulation de la partie « Particule chargée dans un champ magnétique uniforme » du chapitre « Applications des lois de
       Newton » (2e année du bac, filières PC, SMA, SMB) : tube à faisceau filiforme et bobines de Helmholtz ; force de Lorentz
       F = q·v ∧ B, mouvement circulaire uniforme quand v0 ⟂ B, rayon r = m·v0 / (|q|·B), mesure de e/m ; spectrographe de
       masse et cyclotron. Objectif O7. Vitesse initiale non perpendiculaire à B : hors programme (non proposée).
Reçoit : rien (les vérifications lisent « tube_b », « vues_b », « documents_b » et la feuille).
Produit : la simulation démarrée.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const nombre = (unite, attendu, tolerance, aide, bravo) => ({ type: "nombre", unite, attendu, tolerance, aide, bravo });
  const relatif = (unite, attendu, tol, aide, bravo) => ({ type: "nombre", unite, attendu, tolerance_relative: tol, aide, bravo });
  const T = (f) => f.tube_b || {}, VU = (f) => f.vues_b || [], KB = 7.79e-4;

  function rayons({ faits, feuille }) {
    // A : diamètre d (m) ; B : I (A) d'une vue à U = 200 V où le cercle a ce diamètre (à 3 mm) ; C : B = 7,79E-4·I ; D : 1/B.
    const v = (c, n) => feuille.valeur_sure(`${c}${n}`), diam = new Set();
    for (let n = 2; n <= 12; n++) {
      if (v("A", n) === null) continue;
      const vue = VU(faits).find((w) => w.U === 200 && w.sens === 1 && Math.abs(w.I - v("B", n)) < 0.006);
      if (!vue) return `Ligne ${n} : en B, un courant I avec lequel vous avez regardé l'ampoule en grand (U = 200 V).`;
      if (Math.abs(2 * vue.r - v("A", n)) > 0.003) return `Ligne ${n} : en A, le diamètre (m) du cercle lu sur les repères pour I = ${String(v("B", n)).replace(".", ",")} A.`;
      if (Math.abs(v("C", n) - KB * v("B", n)) > 2e-6) return `Ligne ${n} : en C, =7,79E-4*B${n}.`;
      if (Math.abs(v("D", n) - 1 / v("C", n)) > 1e-3 * Math.abs(v("D", n))) return `Ligne ${n} : en D, =1/C${n}.`;
      diam.add(Math.round(v("A", n) * 100));
    }
    return diam.size >= 4 || false;
  }

  const FAISCEAU = {
    id: "faisceau", paillasse: 0, titre: "Le faisceau dans le champ magnétique",
    conclusion: "Sans champ, le faisceau d'électrons est rectiligne (poids négligeable). Dans le champ magnétique uniforme B des bobines de Helmholtz, perpendiculaire à v0, chaque électron subit la force de Lorentz F = q·v ∧ B, perpendiculaire à sa vitesse : elle ne change pas la valeur de la vitesse, le mouvement est circulaire uniforme, dans le plan perpendiculaire à B. Le sens de la déviation change avec le sens de B.",
    objectif: "Observer le faisceau sans champ, puis dans le champ des bobines ; changer le sens du courant.",
    entetes: [], donnees: ["Champ au centre des bobines : B = 7,79 × 10⁻⁴ × I (T)", "Force de Lorentz : F = q·v ∧ B ; q = −e", "B perpendiculaire à v0 (vitesse à la sortie du canon)"],
    conclusion_courte: "Force de Lorentz ⟂ v : mouvement circulaire uniforme.",
    etapes: [
      { consigne: "Mettez le chauffage, réglez U à 200 V, sans courant dans les bobines : observez le faisceau.", court: "Chauffage, U = 200 V, I = 0.", verifier: ({ faits }) => (T(faits).faisceau && T(faits).U === 200 && T(faits).I === 0) || false },
      { consigne: "Sans courant dans les bobines, le faisceau est rectiligne, car…", court: "Répondez dans le carnet.", question: choix(["aucune force notable ne s'exerce sur les électrons (poids négligeable)", "le gaz du tube les guide", "le canon les attire"], "Pas de champ magnétique, pas de champ électrique après l'anode.", "Exact.") },
      { consigne: "Réglez le courant des bobines à 1,50 A : observez la trajectoire.", court: "I = 1,50 A.", aide_geste: "Bouton I : glissez vers le haut, puis réglez avec + et −.", verifier: ({ faits }) => (T(faits).faisceau && T(faits).I >= 1.49 && T(faits).r !== null && T(faits).sens === 1) || false },
      { consigne: "La force de Lorentz est perpendiculaire à la vitesse ; le mouvement des électrons est donc…", court: "Répondez dans le carnet.", question: choix(["circulaire uniforme : la valeur de la vitesse ne change pas", "rectiligne accéléré", "circulaire et de plus en plus rapide"], "Une force perpendiculaire à v ne fournit pas de travail.", "Exact.") },
      { consigne: "Inversez le sens du courant dans les bobines.", court: "Inversez le courant.", verifier: ({ faits }) => (T(faits).faisceau && T(faits).sens === -1 && T(faits).I > 0) || false },
      { consigne: "Le faisceau se courbe maintenant de l'autre côté, car…", court: "Répondez dans le carnet.", question: choix(["le champ B a changé de sens, donc la force F = q·v ∧ B aussi", "les électrons ont changé de charge", "la vitesse a changé de sens"], "Règle des trois doigts, ou produit vectoriel.", "Exact.") },
    ],
  };

  const RAYON = {
    id: "rayon", paillasse: 0, titre: "Rayon de la trajectoire et e/m",
    conclusion: "Le rayon de la trajectoire est r = m·v0 / (|q|·B), avec v0 = √(2·e·U/m) : à U fixé, le diamètre est inversement proportionnel à B. La pente de la droite d = f(1/B) vaut 2·√(2·U·m/e) ; on en tire e/m ≈ 1,76 × 10¹¹ C/kg. Le rayon augmente avec la vitesse (U plus grande).",
    objectif: "Régler I pour que le cercle passe par les repères 6, 8, 10 et 12 cm ; tracer d = f(1/B) ; en déduire e/m.",
    entetes: ["d (m)", "I (A)", "B (T)", "1/B (T⁻¹)"],
    donnees: ["B = 7,79 × 10⁻⁴ × I (T)", "r = m·v0 / (e·B) ; v0 = √(2·e·U/m)", "Pente de d = f(1/B) : a = 2·√(2·U·m/e), donc e/m = 8·U / a²"],
    conclusion_courte: "r = m·v0 / (|q|·B) ; e/m ≈ 1,76 × 10¹¹ C/kg.",
    etapes: [
      { consigne: "U = 200 V, sens normal : réglez I pour que le haut du cercle touche le repère « 8 cm » (touchez l'ampoule pour la voir en grand).", court: "Cercle de 8 cm.", verifier: ({ faits }) => VU(faits).some((w) => w.U === 200 && w.sens === 1 && Math.abs(2 * w.r - 0.08) <= 0.002) || false },
      { consigne: "Faites de même pour 6, 10 et 12 cm. Tableur : d (m) en A, I (A) en B, B = 7,79E-4·I en C, 1/B en D.", court: "Tableur : d, I, B, 1/B.", verifier: rayons },
      { consigne: "Tracez d (A) en fonction de 1/B (D), modèle y = a·x.", court: "Courbe d = f(1/B).", verifier: ({ courbe: c }) => (c.x === "D" && c.y === "A" && c.n >= 4 && c.modele === "lineaire") || "Abscisse : D ; ordonnée : A ; modèle y = a·x." },
      { consigne: "À U fixé, le diamètre de la trajectoire est…", court: "Répondez dans le carnet.", question: choix(["inversement proportionnel à B", "proportionnel à B", "indépendant de B"], "La droite passe par l'origine.", "Exact : r = m·v0 / (e·B).") },
      { consigne: "Déduisez du coefficient directeur a le rapport e/m = 8·U / a² (C/kg), avec U = 200 V.", court: "e/m (C/kg) ?", question: relatif("C/kg", 1.7588e11, 0.06, "a en m·T ; U = 200 V.", "Exact : e/m ≈ 1,76 × 10¹¹ C/kg.") },
      { consigne: "Gardez I et passez U à 300 V ; regardez l'ampoule en grand.", court: "U = 300 V.", verifier: ({ faits }) => VU(faits).some((w) => w.U === 300) || false },
      { consigne: "Quand U augmente, le rayon de la trajectoire…", court: "Répondez dans le carnet.", question: choix(["augmente : les électrons vont plus vite et r = m·v0 / (e·B)", "diminue", "ne change pas"], "v0 = √(2·e·U/m).", "Exact.") },
    ],
  };

  const APPLICATIONS = {
    id: "applications", paillasse: 0, titre: "Spectrographe de masse et cyclotron",
    conclusion: "Dans un spectrographe de masse, des ions de même charge et de même vitesse décrivent des cercles de rayon R = m·v / (|q|·B) proportionnel à leur masse : on sépare les isotopes. Dans un cyclotron, la durée d'un demi-tour, π·m / (|q|·B), ne dépend pas de la vitesse : une tension alternative de fréquence fixe accélère les particules à chaque passage.",
    objectif: "Lire les documents ; appliquer r = m·v / (|q|·B) au spectrographe et au cyclotron.",
    entetes: [], donnees: ["R = m·v / (|q|·B)", "Durée d'un demi-tour : π·m / (|q|·B)", "Isotopes du néon : ²⁰Ne et ²²Ne"],
    conclusion_courte: "Spectrographe : R ∝ m ; cyclotron : demi-tour en π·m / (|q|·B).",
    etapes: [
      { consigne: "Lisez les documents « Le spectrographe de masse » et « Le cyclotron » : touchez-les.", court: "Lisez les deux documents.", verifier: ({ faits }) => [1, 2].every((k) => (faits.documents_b || []).includes(k)) || false },
      { consigne: "Dans le spectrographe, des isotopes de même charge et de même vitesse…", court: "Répondez dans le carnet.", question: choix(["décrivent des cercles de rayons proportionnels à leur masse : ils sont séparés", "suivent tous la même trajectoire", "ne sont pas déviés"], "R = m·v / (|q|·B).", "Exact.") },
      { consigne: "Rapport des rayons R(²²Ne⁺) / R(²⁰Ne⁺) pour la même vitesse ?", court: "R(22) / R(20) ?", question: nombre("", 1.1, 0.02, "Masses dans le rapport 22/20.", "Exact : 1,1.") },
      { consigne: "Dans le cyclotron, la durée d'un demi-tour…", court: "Répondez dans le carnet.", question: choix(["ne dépend pas de la vitesse de la particule", "diminue quand la particule accélère", "augmente quand la particule accélère"], "π·m / (|q|·B) : où est v ?", "Exact : la tension accélératrice peut garder une fréquence fixe.") },
    ],
  };

  L.demarrer({ id: "b2_meca2_s3_champ_magnetique", titre: "Laboratoire : électrons dans un champ magnétique", paillasses: [L.poste_champ_magnetique], missions: [FAISCEAU, RAYON, APPLICATIONS] });
})(window.Labo);
