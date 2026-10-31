/*
Rôle : simulation de l'activité 3 du chapitre « Décroissance radioactive » (2e année du bac) : compteur de Geiger-Müller
       (banc_comptage.js) ; caractère aléatoire des désintégrations (série de comptages, moyenne, variance, écart-type) ;
       radioactivité naturelle (granite, engrais au potassium) ; rayonnements α, β−, γ et écrans ; décroissance du baryum
       137m (generateur_baryum.js) : N(t), ln N = f(t), λ, t½, τ, activité. Objectifs O3, O4, O5, O7.
Reçoit : rien (les vérifications lisent les faits « compteur », « banc », « generateur », la feuille et la courbe).
Produit : la simulation démarrée.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const nombre = (unite, attendu, tolerance, aide, bravo) => ({ type: "nombre", unite, attendu, tolerance, aide, bravo });
  const mesures = (f, source, ecran, duree) => ((f.compteur || {}).serie || []).filter((m) => m.source === source && (m.ecran || null) === ecran && (!duree || m.duree === duree));
  const kcl = (f) => mesures(f, "kcl", null, 10).slice(-10).map((m) => m.N), ba = (f) => mesures(f, "ba137", null, 30);
  const moyenne = (v) => v.reduce((a, b) => a + b, 0) / Math.max(1, v.length), variance = (v) => moyenne(v.map((x) => (x - moyenne(v)) ** 2));

  function tableau_kcl({ faits, feuille }) {
    // Les dix derniers comptages de 10 s avec l'engrais : numéro en A, N en B.
    const l = feuille.lignes(["A", "B"]), v = kcl(faits);
    if (l.length < 10) return false;
    const a = l.map((x) => x.B).sort((p, q) => p - q).join(), b = [...v].sort((p, q) => p - q).join();
    return a === b || "En B, recopiez les dix derniers comptages de 10 s avec l'engrais (relevé du compteur).";
  }

  function tableau_ba({ faits, feuille }) {
    // Au moins dix mesures de l'éluat : t en A, N en B (relevé), ln N en C.
    const l = feuille.lignes(["A", "B", "C"]), v = ba(faits);
    if (l.length < 10) return false;
    for (const [k, x] of l.entries()) {
      if (!v.some((m) => Math.abs(m.t - x.A) <= 0.5 && m.N === x.B)) return `Ligne ${k + 2} : en A le début t du comptage (s), en B le nombre N lu sur le relevé (éluat, comptages de 30 s).`;
      if (Math.abs(x.C - Math.log(x.B)) > 0.01) return `Ligne ${k + 2} : en C, ln N : =LN(B${k + 2}).`;
    }
    return true;
  }

  const ALEATOIRE = {
    id: "aleatoire", paillasse: 0, titre: "Un phénomène aléatoire",
    objectif: "Mesurer le bruit de fond ; répéter un même comptage ; calculer la moyenne, la variance et l'écart-type.",
    entetes: ["n°", "N"],
    donnees: ["Moyenne m = (N₁ + N₂ + … + Nₙ) / n", "Variance V = moyenne des (N − m)² ; écart-type σ = √V"],
    conclusion: "Même sans échantillon, le compteur enregistre quelques impulsions : c'est le bruit de fond (radioactivité naturelle du sol, de l'air, rayons cosmiques). Avec le même échantillon et la même durée, le nombre d'impulsions change d'un comptage à l'autre : la désintégration d'un noyau est aléatoire ; on ne peut pas prévoir quand un noyau se désintègre. Sur de nombreux comptages, les résultats se répartissent autour d'une moyenne m, avec un écart-type σ voisin de √m. L'engrais contient du potassium 40 radioactif : c'est aussi de la radioactivité naturelle.",
    conclusion_courte: "Désintégrations aléatoires ; moyenne, écart-type.",
    etapes: [
      { consigne: "Sans échantillon sous le tube : durée 60 s, Départ. C'est le bruit de fond.", court: "Bruit de fond (60 s).", aide_geste: "Touchez « Durée » jusqu'à 60 s, puis « Départ ».", verifier: ({ faits }) => mesures(faits, null, null, 60).length > 0 || false },
      { consigne: "Bruit de fond : nombre d'impulsions par seconde ?", court: "Bruit de fond (/s) ?", question: nombre("par seconde", (f) => { const m = mesures(f, null, null, 60); return m.length ? m[m.length - 1].N / 60 : 0.4; }, 0.02, "N / 60 (dernier comptage de 60 s).", "Exact : environ 0,4 impulsion par seconde.") },
      { consigne: "Posez l'engrais (KCl) sous le tube. Durée 10 s, mode série : faites au moins dix comptages.", court: "KCl : dix comptages de 10 s.", aide_geste: "Glissez la coupelle KCl du coffret sur le plateau ; « Série » puis « Départ ».", verifier: ({ faits }) => kcl(faits).length >= 10 || false },
      { consigne: "D'un comptage à l'autre, le nombre N…", court: "Répondez dans le carnet.", question: choix(["change : on ne peut pas prévoir quand un noyau se désintègre (phénomène aléatoire)", "reste toujours le même", "augmente régulièrement"], "Lisez le relevé.", "Exact : la désintégration est aléatoire.") },
      { consigne: "Tableur : recopiez les dix derniers comptages. En A : n° ; en B : N.", court: "Tableur : n°, N.", verifier: tableau_kcl },
      { consigne: "Moyenne m des dix comptages ?", court: "m ?", question: nombre("", (f) => moyenne(kcl(f)), 0.06, "Somme des N divisée par 10 (ou tableur : =(B2+B3+…+B11)/10).", "Exact.") },
      { consigne: "Variance V = moyenne des (N − m)² ?", court: "V ?", question: nombre("", (f) => variance(kcl(f)), 0.5, "Colonne C : =(B2−m)^2 ; puis la moyenne de la colonne C.", "Exact.") },
      { consigne: "Écart-type σ = √V ?", court: "σ ?", question: nombre("", (f) => Math.sqrt(variance(kcl(f))), 0.08, "Racine carrée de la variance.", "Exact : σ est voisin de √m.") },
      { consigne: "L'engrais donne plus d'impulsions que le bruit de fond parce que…", court: "Répondez dans le carnet.", question: choix(["le potassium naturel contient un isotope radioactif, le potassium 40", "il est chaud", "le sel attire les rayons cosmiques"], "Le potassium a plusieurs isotopes.", "Exact : c'est de la radioactivité naturelle.") },
    ],
  };

  const RAYONNEMENTS = {
    id: "rayonnements", paillasse: 0, titre: "Rayonnements α, β, γ",
    objectif: "Comparer des échantillons naturels ; identifier les rayonnements α, β− et γ par les écrans qui les arrêtent.",
    entetes: [],
    donnees: ["Am 241 : radioactif α ; Sr 90 : radioactif β− ; Cs 137 : radioactif β−, suivi d'une émission γ", "Écrans : papier, aluminium (5 mm), plomb (5 mm)"],
    conclusion: "Le granite est légèrement radioactif, le sel de table ne donne que le bruit de fond. Le rayonnement α (noyaux d'hélium) est arrêté par une feuille de papier ; le rayonnement β− (électrons) traverse le papier mais est arrêté par quelques millimètres d'aluminium ; le rayonnement γ (électromagnétique, de très courte longueur d'onde) traverse l'aluminium et n'est qu'atténué par le plomb. Pour se protéger : s'éloigner, limiter la durée d'exposition, utiliser un écran adapté.",
    conclusion_courte: "α : papier ; β : aluminium ; γ : plomb (atténué).",
    etapes: [
      { consigne: "Faites un comptage de 60 s avec le granite, puis avec le sel de table (NaCl).", court: "Granite, sel : 60 s chacun.", verifier: ({ faits }) => (mesures(faits, "granite", null, 60).length > 0 && mesures(faits, "nacl", null, 60).length > 0) || false },
      { consigne: "Comparez au bruit de fond. Le granite…", court: "Répondez dans le carnet.", question: choix(["est légèrement radioactif ; le sel de table ne donne que le bruit de fond", "n'est pas radioactif", "est aussi radioactif que le césium 137"], "Comparez les N du relevé.", "Exact : radioactivité naturelle des roches.") },
      { consigne: "Américium 241 : un comptage de 10 s sans écran, puis un avec l'écran de papier.", court: "Am 241 : sans écran, papier.", aide_geste: "Glissez l'écran dans la fente, entre le tube et l'échantillon.", verifier: ({ faits }) => (mesures(faits, "am241", null, 10).length > 0 && mesures(faits, "am241", "papier", 10).length > 0) || false },
      { consigne: "Une feuille de papier arrête presque tout le rayonnement de l'américium. C'est…", court: "Répondez dans le carnet.", question: choix(["le rayonnement α : des noyaux d'hélium ⁴₂He, très peu pénétrants", "le rayonnement γ", "le bruit de fond"], "Am 241 est radioactif α.", "Exact.") },
      { consigne: "Strontium 90 : un comptage de 10 s avec le papier, puis un avec l'aluminium.", court: "Sr 90 : papier, aluminium.", verifier: ({ faits }) => (mesures(faits, "sr90", "papier", 10).length > 0 && mesures(faits, "sr90", "aluminium", 10).length > 0) || false },
      { consigne: "Le rayonnement β− du strontium…", court: "Répondez dans le carnet.", question: choix(["traverse le papier mais est arrêté par l'aluminium : ce sont des électrons", "est arrêté par le papier", "traverse l'aluminium sans être atténué"], "Comparez les deux comptages.", "Exact.") },
      { consigne: "Césium 137 : un comptage de 10 s avec l'aluminium, puis un avec le plomb.", court: "Cs 137 : aluminium, plomb.", verifier: ({ faits }) => (mesures(faits, "cs137", "aluminium", 10).length > 0 && mesures(faits, "cs137", "plomb", 10).length > 0) || false },
      { consigne: "Derrière l'aluminium, le césium donne encore des impulsions, moins nombreuses derrière le plomb. C'est…", court: "Répondez dans le carnet.", question: choix(["le rayonnement γ : électromagnétique, très pénétrant, seulement atténué par le plomb", "le rayonnement α", "des électrons"], "L'aluminium arrête les β−.", "Exact.") },
      { consigne: "Pour se protéger d'une source radioactive, il faut…", court: "Répondez dans le carnet.", question: choix(["s'en éloigner, limiter la durée d'exposition et utiliser un écran adapté", "la regarder de près", "la tenir à la main avec un gant de laine"], "Distance, durée, écran.", "Exact : l'énergie déposée dans le corps dépend de l'activité, de la durée et du rayonnement.") },
    ],
  };

  const DECROISSANCE = {
    id: "decroissance", paillasse: 0, titre: "Décroissance du baryum 137m",
    objectif: "Suivre la décroissance de l'éluat ; tracer N(t) et ln N(t) ; déterminer λ, la demi-vie et la constante de temps.",
    entetes: ["t (s)", "N", "ln N"],
    donnees: ["N est proportionnel au nombre de noyaux présents (le bruit de fond est négligeable)", "N(t) = N₀·e^(−λt) ; t½ = ln 2 / λ ; τ = 1 / λ", "1 Bq = une désintégration par seconde"],
    conclusion: "Le nombre de désintégrations diminue au cours du temps : ln N est une fonction affine de t, de pente −λ. La loi de décroissance s'écrit N(t) = N₀·e^(−λt), et l'activité a(t) = λ·N(t) = a₀·e^(−λt) (en becquerels). Pour le baryum 137m, λ ≈ 4,5 × 10⁻³ s⁻¹ : la demi-vie t½ = ln 2 / λ ≈ 153 s (au bout de t½, la moitié des noyaux s'est désintégrée) et la constante de temps τ = 1 / λ ≈ 221 s. λ s'exprime en s⁻¹ : λ·t est sans dimension.",
    conclusion_courte: "N = N₀·e^(−λt) ; t½ = ln 2 / λ.",
    etapes: [
      { consigne: "Touchez le générateur (élution), posez la coupelle d'éluat sous le tube, touchez « Effacer », puis : durée 30 s, série, horloge × 20, Départ. Faites au moins seize comptages.", court: "Éluat : seize comptages de 30 s.", aide_geste: "L'horloge × 20 fait passer 30 s en 1,5 s.", verifier: ({ faits }) => ba(faits).length >= 16 || false },
      { consigne: "Tableur : au moins dix mesures (une sur deux du relevé convient). En A : t (s) ; en B : N ; en C : ln N.", court: "Tableur : t, N, ln N.", verifier: tableau_ba },
      { consigne: "Tracez N (B) en fonction de t (A). N…", court: "Répondez dans le carnet.", question: choix(["diminue de moins en moins vite : décroissance exponentielle", "diminue régulièrement (droite)", "reste constant"], "Regardez la forme de la courbe.", "Exact.") },
      { consigne: "Tracez ln N (C) en fonction de t (A) et modélisez par une droite y = a·x + b.", court: "Courbe ln N = f(t), modèle affine.", verifier: ({ courbe }) => (courbe.x === "A" && courbe.y === "C" && courbe.n >= 10 && courbe.modele === "affine") || "Abscisse : A (t) ; ordonnée : C (ln N) ; modèle y = a·x + b." },
      { consigne: "La pente vaut −λ. Constante radioactive λ (s⁻¹) ?", court: "λ (s⁻¹) ?", question: nombre("s⁻¹", Math.LN2 / 153, 0.0004, "λ = −a, coefficient directeur de la droite.", "Exact : environ 4,5 × 10⁻³ s⁻¹.") },
      { consigne: "Demi-vie t½ = ln 2 / λ (s) ?", court: "t½ (s) ?", question: nombre("s", 153, 14, "ln 2 ≈ 0,693.", "Exact : environ 153 s (2,55 min).") },
      { consigne: "Constante de temps τ = 1 / λ (s) ?", court: "τ (s) ?", question: nombre("s", 221, 20, "τ = 1 / λ.", "Exact : environ 221 s.") },
      { consigne: "Au bout d'une demi-vie…", court: "Répondez dans le carnet.", question: choix(["la moitié des noyaux présents s'est désintégrée : N est divisé par 2", "tous les noyaux se sont désintégrés", "N est divisé par 10"], "Lisez N à t = 0 et à t = 153 s.", "Exact.") },
      { consigne: "Si le compteur recevait toutes les désintégrations, quelle serait l'activité de l'éluat au premier comptage (Bq) ?", court: "a (Bq) ?", question: nombre("Bq", (f) => { const v = ba(f).sort((p, q) => p.t - q.t); return v.length ? v[0].N / 30 : 70; }, 3, "a = N / Δt, avec Δt = 30 s.", "Exact : 1 Bq = une désintégration par seconde.") },
    ],
  };

  L.poste_compteur = function (g) {
    // Pense-bête, banc de comptage avec ses sources, générateur de baryum 137m.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230);
    const banc = L.banc_comptage(g, { fait: "compteur", sources: ["am241", "sr90", "cs137", "granite", "kcl", "nacl"] });
    L.generateur_baryum(g, banc);
    return { pense_bete };
  };

  L.demarrer({ id: "b2_nucl1_a3_compteur", titre: "Laboratoire : le compteur et la décroissance", paillasses: [L.poste_compteur], missions: [ALEATOIRE, RAYONNEMENTS, DECROISSANCE] });
})(window.Labo);
