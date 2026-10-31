/*
Rôle : simulation de l'activité 3 du chapitre « Dipôle RL » (2e année du bac) : réponse d'un dipôle RL à un échelon de
       tension enregistrée à l'interface d'acquisition : établissement et rupture du courant (i continue), régime
       permanent, τ = L / R (R : résistance totale), influence de R et de L, tension aux bornes de la bobine, équation
       différentielle et sa solution, énergie stockée ½·L·i². Objectifs O3, O4, O5, O6.
Reçoit : rien (les vérifications lisent les faits « montage_rl », « acquisition », « taus_rl », la feuille et la courbe).
Produit : la simulation démarrée.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const nombre = (unite, attendu, tolerance, aide, bravo) => ({ type: "nombre", unite, attendu, tolerance, aide, bravo });
  const D = (f) => (f.acquisition || {}).derniere || {}, M = (f) => f.montage_rl || {}, T = (f) => f.taus_rl || [];
  const vu = (f, sens) => T(f).some((t) => t.sens === sens && t.R === 100 && t.L === 0.5);

  function tableau({ faits, feuille }) {
    // Au moins quatre couples (R, L) : R (Ω) en A, L (H) en B, τ mesurée (ms) en C, L / (R + r) (ms) en D (r = 10 Ω).
    const l = feuille.lignes(["A", "B", "C", "D"]), t = T(faits);
    if (l.length < 4) return false;
    for (const [k, x] of l.entries()) {
      if (!t.some((m) => m.R === x.A && Math.abs(m.L - x.B) < 1e-9 && Math.abs(m.tau * 1000 - x.C) <= 0.03 * m.tau * 1000 + 0.02)) return `Ligne ${k + 2} : en A R (Ω), en B L (H) d'un de vos enregistrements, en C la constante de temps τ mesurée (ms).`;
      if (Math.abs(x.D - (1000 * x.B) / (x.A + 10)) > 0.003 * x.D + 1e-3) return `Ligne ${k + 2} : en D, L / (R + r) en ms : =1000*B${k + 2}/(A${k + 2}+10).`;
    }
    return new Set(l.map((x) => `${x.A}:${x.B}`)).size >= 4 || "Quatre couples (R, L) différents.";
  }

  const ETABLISSEMENT = {
    id: "etablissement", paillasse: 0, titre: "Établissement du courant",
    objectif: "Câbler le montage ; enregistrer l'établissement du courant dans un dipôle RL ; mesurer τ.",
    entetes: [],
    donnees: ["E = 6,0 V ; R = 100 Ω ; bobine : r = 10 Ω, L = 0,50 H avec son noyau", "uR = R·i : EA0 donne l'image de i", "τ : instant où i atteint 63 % de sa valeur finale"],
    conclusion: "Quand on ferme le circuit, l'intensité ne passe pas brusquement de 0 à sa valeur finale : la bobine retarde l'établissement du courant ; i est continue. En régime permanent, di/dt = 0 et la bobine se comporte comme sa résistance r : I₀ = E / (R + r) ≈ 54 mA. La constante de temps vaut τ = L / (R + r) ≈ 4,5 ms. La tension aux bornes de la bobine saute à E à la fermeture, puis diminue jusqu'à r·I₀.",
    conclusion_courte: "i continue ; τ = L / (R + r).",
    etapes: [
      { consigne: "Câblez : G+ vers K1, K0 vers la bobine, bobine vers R, R vers G− ; K2 vers G− ; GND au −, EA0 entre la bobine et R, EA1 sur K0.", court: "Câblez le montage.", verifier: ({ faits }) => (M(faits).serie && M(faits).boucle && M(faits).mesure) || false },
      { consigne: "R = 100 Ω, noyau enfoncé, K en position 2. Touchez « Lancer » (durée 50 ms), puis basculez K en position 1.", court: "Enregistrez l'établissement.", verifier: ({ faits }) => vu(faits, "etablissement") || false },
      { consigne: "Quand on ferme le circuit, l'intensité i (image : uR)…", court: "Répondez dans le carnet.", question: choix(["augmente progressivement : la bobine retarde l'établissement du courant, i est continue", "saute aussitôt à sa valeur finale", "reste nulle"], "Regardez le début de la courbe rouge.", "Exact.") },
      { consigne: "Intensité en régime permanent I₀ = uR / R (mA) ?", court: "I₀ (mA) ?", question: nombre("mA", (f) => ((D(f).u_fin || 5.43) / 100) * 1000, 1, "Fin de la courbe EA0, divisée par R.", "Exact : I₀ = E / (R + r).") },
      { consigne: "Constante de temps τ, lue à 63 % de I₀ (ms) ?", court: "τ (ms) ?", question: nombre("ms", (f) => (D(f).tau || 0.0045) * 1000, 0.25, "Curseur sur la courbe EA0.", "Exact.") },
      { consigne: "Calculez L / (R + r) (ms).", court: "L / (R + r) (ms) ?", question: nombre("ms", 4.55, 0.1, "L = 0,50 H ; R + r = 110 Ω.", "Exact : τ = L / (R + r).") },
      { consigne: "Touchez « Voie 2 » jusqu'à « EA1 − EA0 » : tension aux bornes de la bobine. À la fermeture, elle…", court: "Répondez dans le carnet.", question: choix(["saute à E, puis diminue jusqu'à r·I₀ en régime permanent", "reste nulle", "augmente comme i"], "u = r·i + L·di/dt : di/dt est grand au début.", "Exact.") },
    ],
  };

  const INFLUENCE = {
    id: "influence", paillasse: 0, titre: "Influence de R et de L",
    objectif: "Mesurer τ pour plusieurs résistances et inductances ; vérifier τ = L / (R + r).",
    entetes: ["R (Ω)", "L (H)", "τ (ms)", "L/(R+r) (ms)"],
    donnees: ["Résistance de la bobine : r = 10 Ω", "Noyau : L = 0,50 H ; sans noyau : L = 0,050 H", "Durée d'enregistrement : au moins 5τ"],
    conclusion: "τ augmente avec L et diminue quand R augmente : τ = L / R_totale. L'équation aux dimensions [L]/[R] = (V·s/A)/(V/A) = s confirme que τ est un temps.",
    conclusion_courte: "τ = L / (R + r).",
    etapes: [
      { consigne: "Mesurez τ pour au moins quatre couples (R, L) différents. Tableur : en A : R (Ω) ; en B : L (H) ; en C : τ (ms) ; en D : L / (R + r) (ms).", court: "Tableur : R, L, τ, L/(R+r).", aide_geste: "Boîte de résistances : touches − et + ; touchez la bobine pour enfoncer ou retirer le noyau.", verifier: tableau },
      { consigne: "Tracez τ (C) en fonction de L / (R + r) (D).", court: "Courbe τ = f(L/(R+r)).", verifier: ({ courbe }) => (courbe.x === "D" && courbe.y === "C" && courbe.n >= 4) || "Abscisse : D ; ordonnée : C." },
      { consigne: "La courbe est une droite de coefficient directeur…", court: "Répondez dans le carnet.", question: choix(["1 : τ = L / (R + r)", "R", "0,63"], "Comparez C et D.", "Exact.") },
      { consigne: "L'équation aux dimensions de L / R montre que τ est…", court: "Répondez dans le carnet.", question: choix(["un temps : (V·s/A) / (V/A) = s", "une intensité", "sans dimension"], "1 H = 1 V·s/A ; 1 Ω = 1 V/A.", "Exact.") },
    ],
  };

  const RUPTURE = {
    id: "rupture", paillasse: 0, titre: "Rupture, équation, énergie",
    objectif: "Enregistrer la rupture du courant ; établir l'équation différentielle ; calculer l'énergie stockée.",
    entetes: [],
    donnees: ["Additivité des tensions : uR + u_bobine = E ; u_bobine = r·i + L·di/dt", "Énergie stockée dans une bobine : E_m = ½·L·i²"],
    conclusion: "À l'ouverture (K en 2), le courant ne s'annule pas brusquement : la bobine retarde la rupture du courant ; i = I₀·e^(−t/τ). À l'établissement, (R + r)·i + L·di/dt = E, soit i + (L/R_t)·di/dt = E/R_t, de solution i = (E/R_t)·(1 − e^(−t/τ)) avec τ = L/R_t. Parcourue par I₀, la bobine stocke l'énergie ½·L·I₀² ≈ 0,74 mJ, rendue au circuit pendant la rupture (dissipée par effet Joule dans les résistances).",
    conclusion_courte: "i + (L/R)·di/dt = E/R ; énergie ½·L·i².",
    etapes: [
      { consigne: "Courant établi (K en 1), R = 100 Ω, noyau enfoncé : touchez « Lancer », puis basculez K en position 2.", court: "Enregistrez la rupture.", verifier: ({ faits }) => vu(faits, "rupture") || false },
      { consigne: "À l'ouverture, l'intensité…", court: "Répondez dans le carnet.", question: choix(["diminue progressivement jusqu'à 0 : la bobine retarde la rupture du courant", "s'annule aussitôt", "augmente"], "Regardez la courbe.", "Exact : i est continue.") },
      { consigne: "Avec R_t = R + r, l'équation différentielle de l'établissement du courant s'écrit…", court: "Répondez dans le carnet.", question: choix(["i + (L/R_t)·di/dt = E/R_t", "i − L·di/dt = E", "L·i + di/dt = E"], "R_t·i + L·di/dt = E, divisé par R_t.", "Exact.") },
      { consigne: "Sa solution, avec i(0) = 0, est…", court: "Répondez dans le carnet.", question: choix(["i = (E/R_t)·(1 − e^(−t/τ)), avec τ = L/R_t", "i = (E/R_t)·e^(−t/τ)", "i = E·t / L"], "Elle part de 0 et tend vers E/R_t.", "Exact.") },
      { consigne: "Énergie stockée dans la bobine parcourue par I₀ = 54,3 mA (mJ) ?", court: "Énergie (mJ) ?", question: nombre("mJ", 0.737, 0.03, "E_m = ½ × 0,50 × (0,0543)².", "Exact : environ 0,74 mJ.") },
      { consigne: "Pendant la rupture, cette énergie…", court: "Répondez dans le carnet.", question: choix(["est rendue au circuit et dissipée par effet Joule dans les résistances", "disparaît sans effet", "reste dans la bobine"], "Le courant continue de passer dans R.", "Exact.") },
    ],
  };

  L.demarrer({ id: "b2_elec2_a3_echelon", titre: "Laboratoire : réponse d'un dipôle RL", decor: "aucun", paillasses: [L.poste_echelon_rl], missions: [ETABLISSEMENT, INFLUENCE, RUPTURE] });
})(window.Labo);
