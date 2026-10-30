/*
Rôle : simulation de l'activité 1 du chapitre « Systèmes mécaniques oscillants » (2e année du bac) : reconnaître des
       oscillateurs (tri, sans équation) ; enregistrer x(t) d'un solide-ressort horizontal (capteur et logiciel) ; position
       d'équilibre, amplitude, période propre ; force de rappel, équation différentielle et sa solution DONNÉE ; influence de
       la masse et de la raideur ; amortissement (régimes pseudo-périodique et apériodique). Objectifs O1 à O4.
Reçoit : rien (les vérifications lisent « tri_oscillateurs », « essais_ressort », « acquisition », « montage », la feuille).
Produit : la simulation démarrée.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const nombre = (unite, attendu, tolerance, aide, bravo) => ({ type: "nombre", unite, attendu, tolerance, aide, bravo });
  const E = (f) => f.essais_ressort || [], A = (f) => f.acquisition || {};
  const essai = (f, m, k, a) => E(f).filter((e) => Math.abs(e.m - m) < 1e-6 && e.k === k && e.amortisseur === a).pop();
  const dernier = (f) => E(f)[E(f).length - 1] || {};
  const T = (m, k) => 2 * Math.PI * Math.sqrt(m / k);

  function enregistre(f, m, k, a) {
    // Un essai avec ce montage, lâché d'au moins 2 cm, et une acquisition terminée qui le contient.
    const e = essai(f, m, k, a);
    if (!e) return false;
    if (Math.abs(e.x0) < 0.02) return "Écartez le mobile d'au moins 2 cm avant de le lâcher.";
    return (A(f).n >= 1 && A(f).etat === "terminée" && (A(f).courbes || []).length > 0) || "Touchez « Acquérir » avant de lâcher le mobile.";
  }

  function tableau({ faits, feuille }) {
    // A : m (kg), B : k (N/m) d'un essai ; C : T0 mesurée (à 3 % près) ; D : 2π·√(m/k) ; quatre lignes au moins.
    const v = (c, n) => feuille.valeur_sure(`${c}${n}`);
    let lignes = 0;
    for (let n = 2; n <= 12; n++) {
      if (v("A", n) === null) continue;
      if (!E(faits).some((e) => Math.abs(e.m - v("A", n)) < 1e-6 && e.k === v("B", n) && e.amortisseur === "aucun")) return `Ligne ${n} : m (kg) et k (N/m) d'un enregistrement fait sans amortisseur.`;
      const t0 = T(v("A", n), v("B", n));
      if (v("C", n) === null || Math.abs(v("C", n) - t0) > 0.03 * t0) return `Ligne ${n} : en C, la période mesurée sur la courbe (durée de plusieurs oscillations divisée par leur nombre).`;
      if (v("D", n) === null || Math.abs(v("D", n) - t0) > 0.005 * t0) return `Ligne ${n} : en D, =2*PI()*RACINE(A${n}/B${n}).`;
      lignes++;
    }
    return lignes >= 4 || false;
  }

  const OSCILLATEURS = {
    id: "oscillateurs", paillasse: 0, titre: "Des oscillateurs mécaniques",
    objectif: "Ranger des systèmes : oscillateurs mécaniques ou autres mouvements.",
    entetes: [], donnees: ["Oscillateur : va-et-vient répété autour d'une position d'équilibre"],
    conclusion: "Un oscillateur mécanique est un système qui effectue un mouvement de va-et-vient autour d'une position d'équilibre stable : pendule simple, pendule pesant, pendule de torsion, solide-ressort. Écarté de l'équilibre puis lâché, il oscille ; la durée d'une oscillation est la période propre T0, le plus grand écart est l'amplitude. Les frottements diminuent l'amplitude : c'est l'amortissement.",
    conclusion_courte: "Oscillateur : va-et-vient autour d'un équilibre ; amplitude, période propre.",
    etapes: [
      { consigne: "Rangez les neuf systèmes du tableau : oscillateur mécanique ou pas.", court: "Rangez les systèmes.", aide_geste: "Faites glisser chaque étiquette dans sa colonne.", verifier: ({ faits }) => L.tableau_tri.verifier(L.SYSTEMES_OSCILLANTS.map(([id, , colonne]) => ({ id, colonne })), faits.tri_oscillateurs) },
      { consigne: "Ce qu'ont en commun les oscillateurs mécaniques :", court: "Répondez dans le carnet.", question: choix(["un mouvement de va-et-vient répété autour d'une position d'équilibre", "un mouvement toujours rectiligne", "un mouvement qui ne s'arrête jamais"], "Une balançoire et un balancier d'horloge.", "Exact.") },
      { consigne: "Une balançoire qu'on ne pousse plus oscille de moins en moins loin. On dit que ses oscillations sont…", court: "Répondez dans le carnet.", question: choix(["amorties (par les frottements)", "entretenues", "forcées"], "Que devient l'amplitude ?", "Exact.") },
    ],
  };

  const ENREGISTRER = {
    id: "enregistrer", paillasse: 1, titre: "Enregistrer x(t) d'un solide-ressort",
    objectif: "Mobile de 200 g, ressort de 10 N/m, sans amortisseur : enregistrer x(t), mesurer l'amplitude et la période propre.",
    entetes: [], donnees: ["x : écart du mobile à sa position d'équilibre", "Force de rappel du ressort : F = −k·x", "Solution DONNÉE : x(t) = Xm·cos(2π·t/T0 + φ)"],
    conclusion: "Écarté de sa position d'équilibre puis lâché, le mobile oscille : x(t) est une sinusoïde d'amplitude Xm et de période propre T0. Le ressort exerce la force de rappel F = −k·x ; le poids et la réaction du coussin d'air se compensent, et la deuxième loi de Newton donne m·ẍ = −k·x, soit ẍ + (k/m)·x = 0. Sa solution est x(t) = Xm·cos(2π·t/T0 + φ) ; les conditions initiales fixent Xm et φ (lâché sans vitesse à x = +Xm : φ = 0).",
    conclusion_courte: "ẍ + (k/m)·x = 0 ; x = Xm·cos(2π·t/T0 + φ).",
    etapes: [
      { consigne: "Mobile de 200 g au repos (ressort bleu, sans amortisseur) : touchez « Zéro » dans le logiciel.", court: "Zéro à l'équilibre.", verifier: ({ faits }) => (Math.abs((A(faits).zero ?? 0) - 0.3) < 0.002 && faits.montage?.m === 0.2 && faits.montage?.k === 10 && faits.montage?.amortisseur === "aucun") || false },
      { consigne: "Touchez « Acquérir » (5 s), écartez le mobile de 4 cm vers le capteur et lâchez-le.", court: "Enregistrez x(t).", aide_geste: "Faites glisser le mobile vers la droite, lisez l'écart sur la règle du rail, puis lâchez.", verifier: ({ faits }) => enregistre(faits, 0.2, 10, "aucun") },
      { consigne: "Le mobile oscille autour de…", court: "Répondez dans le carnet.", question: choix(["sa position d'équilibre (x = 0)", "l'extrémité du ressort", "la position où on l'a lâché"], "Où x(t) passe-t-il d'un côté à l'autre ?", "Exact.") },
      { consigne: "Amplitude Xm (cm) ? Lisez le plus grand x avec le curseur.", court: "Xm (cm) ?", question: nombre("cm", (f) => Math.abs(dernier(f).x0 || 0) * 100, 0.3, "Le curseur donne t et x.", "Exact : c'est l'écart initial (lâché sans vitesse).") },
      { consigne: "Période propre T0 (s) ? Mesurez la durée de 5 oscillations au curseur, puis divisez par 5.", court: "T0 (s) ?", question: nombre("s", (f) => essai(f, 0.2, 10, "aucun")?.T0 || 0, 0.03, "Deux crêtes séparées de 5 oscillations.", "Exact.") },
      { consigne: "La force exercée par le ressort sur le mobile est…", court: "Répondez dans le carnet.", question: choix(["F = −k·x : dirigée vers l'équilibre, proportionnelle à l'écart", "F = k·x : dans le sens de l'écart", "constante"], "Le ressort ramène le mobile.", "Exact : c'est une force de rappel.") },
      { consigne: "Avec la deuxième loi de Newton (poids et réaction se compensent), l'équation différentielle du mouvement est…", court: "Répondez dans le carnet.", question: choix(["ẍ + (k/m)·x = 0", "ẍ = −g", "ẋ + (k/m)·x = 0"], "m·ẍ = −k·x.", "Exact.") },
      { consigne: "Sa solution est x(t) = Xm·cos(2π·t/T0 + φ). Lâché sans vitesse à x = +Xm, la phase à l'origine φ vaut…", court: "Répondez dans le carnet.", question: choix(["0", "π/2", "π"], "x(0) = Xm·cos φ = Xm.", "Exact : x(t) = Xm·cos(2π·t/T0).") },
    ],
  };

  const INFLUENCES = {
    id: "influences", paillasse: 1, titre: "Influence de la masse et de la raideur",
    objectif: "Mesurer T0 pour 200, 300 et 400 g avec le ressort de 10 N/m, puis pour 200 g avec le ressort de 20 N/m.",
    entetes: ["m (kg)", "k (N/m)", "T0 mesurée (s)", "2π·√(m/k) (s)"], donnees: ["Période propre : T0 = 2π·√(m/k)", "Surcharges de 100 g : sur le plateau devant le banc"],
    conclusion: "La période propre du solide-ressort ne dépend que de la masse et de la raideur : T0 = 2π·√(m/k). Elle augmente avec la masse et diminue quand le ressort est plus raide ; elle ne dépend pas de l'amplitude.",
    conclusion_courte: "T0 = 2π·√(m/k).",
    etapes: [
      { consigne: "Ressort bleu (10 N/m) : enregistrez x(t) avec 200 g, puis 300 g et 400 g (surcharges du plateau) ; mesurez T0 à chaque fois.", court: "200, 300, 400 g.", aide_geste: "Touchez une surcharge du plateau pour la poser sur le mobile.", verifier: ({ faits }) => ([0.2, 0.3, 0.4].every((m) => essai(faits, m, 10, "aucun")) && enregistre(faits, dernier(faits).m, dernier(faits).k, "aucun")) || false },
      { consigne: "Échangez le ressort (ressort vert de 20 N/m, sur le plateau) ; enregistrez avec 200 g.", court: "Ressort de 20 N/m.", verifier: ({ faits }) => enregistre(faits, 0.2, 20, "aucun") },
      { consigne: "Tableur : m (kg) en A, k (N/m) en B, T0 mesurée en C, =2*PI()*RACINE(A2/B2) en D (quatre lignes).", court: "Tableur : m, k, T0.", verifier: tableau },
      { consigne: "La période propre…", court: "Répondez dans le carnet.", question: choix(["augmente avec m et diminue quand k augmente", "augmente avec m et avec k", "ne dépend ni de m ni de k"], "Comparez les lignes.", "Exact : T0 = 2π·√(m/k).") },
      { consigne: "Si on double la masse, T0 est…", court: "Répondez dans le carnet.", question: choix(["multipliée par √2 ≈ 1,41", "multipliée par 2", "inchangée"], "Comparez 200 g et 400 g.", "Exact.") },
    ],
  };

  const AMORTI = {
    id: "amortissement", paillasse: 1, titre: "Amortissement",
    objectif: "Enregistrer x(t) avec la palette, puis avec l'aimant de freinage (200 g, ressort de 10 N/m).",
    entetes: [], donnees: ["Palette en carton : frottement de l'air", "Aimant de freinage : freinage magnétique par le rail en aluminium"],
    conclusion: "Les frottements amortissent les oscillations. Faiblement amorti, l'oscillateur a un régime pseudo-périodique : l'amplitude diminue et la pseudo-période est presque égale à la période propre. Fortement amorti, il revient à l'équilibre sans osciller : régime apériodique.",
    conclusion_courte: "Pseudo-périodique (T ≈ T0) ou apériodique.",
    etapes: [
      { consigne: "Remettez 200 g et le ressort bleu ; posez la palette sur le mobile ; Durée 10 s, « Acquérir », écartez de 5 cm et lâchez.", court: "Enregistrez avec la palette.", verifier: ({ faits }) => enregistre(faits, 0.2, 10, "palette") },
      { consigne: "L'amplitude diminue et le mobile oscille encore : le régime est…", court: "Répondez dans le carnet.", question: choix(["pseudo-périodique", "apériodique", "périodique"], "Le mouvement se répète-t-il ?", "Exact.") },
      { consigne: "Pseudo-période (s) ? Comparez-la à T0 sans amortisseur.", court: "Pseudo-période (s) ?", question: nombre("s", T(0.2, 10), 0.03, "Durée de plusieurs oscillations au curseur.", "Exact : pour un amortissement faible, la pseudo-période est presque égale à T0.") },
      { consigne: "Remplacez la palette par l'aimant de freinage, puis enregistrez de nouveau.", court: "Enregistrez avec l'aimant.", verifier: ({ faits }) => enregistre(faits, 0.2, 10, "aimant") },
      { consigne: "Avec l'aimant, le mobile…", court: "Répondez dans le carnet.", question: choix(["revient à l'équilibre sans osciller : régime apériodique", "oscille plus longtemps", "oscille avec une période plus courte"], "Regardez la courbe.", "Exact.") },
    ],
  };

  L.demarrer({ id: "b2_meca4_a1_ressort", titre: "Laboratoire : l'oscillateur solide-ressort", paillasses: [L.poste_oscillateurs, L.poste_ressort], missions: [OSCILLATEURS, ENREGISTRER, INFLUENCES, AMORTI] });
})(window.Labo);
