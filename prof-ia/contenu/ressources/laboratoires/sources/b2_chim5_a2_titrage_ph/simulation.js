/*
Rôle : simulation de l'activité 2 du chapitre « Transformations associées aux réactions acide-base en solution aqueuse »
       (2e année du bac) : titrage d'un vinaigre dilué par l'hydroxyde de sodium, suivi au pH-mètre et à l'ordinateur ;
       courbe pH = f(V), point d'équivalence à l'extremum de dpH/dV, concentration et degré du vinaigre, pKA lu à la
       demi-équivalence, choix de l'indicateur coloré, réaction de titrage quasi totale. Objectifs O3, O4, O5.
Reçoit : rien (les vérifications lisent les faits « banc_titrage_ph », « titrage_ph »).
Produit : la simulation démarrée.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const nombre = (unite, attendu, tolerance, aide, bravo) => ({ type: "nombre", unite, attendu, tolerance, aide, bravo });
  const relatif = (unite, attendu, tol, aide, bravo) => ({ type: "nombre", unite, attendu, tolerance_relative: tol, aide, bravo });
  const B = (f) => f.banc_titrage_ph || {}, T = (f) => f.titrage_ph || {}, P = (f) => T(f).points || [];

  const TITRAGE = {
    id: "titrage", paillasse: 0, titre: "Titrage pH-métrique d'un vinaigre",
    conclusion: "La réaction de titrage CH₃CO₂H + HO⁻ → CH₃CO₂⁻ + H₂O est quasi totale (τ ≈ 1). La courbe pH = f(V) présente un saut de pH ; le point d'équivalence correspond au maximum de dpH/dV : VE = 8,0 mL. À l'équivalence, n(acide) = Cb·VE : le vinaigre dilué est à 0,080 mol/L, le vinaigre commercial à 0,80 mol/L (environ 4,8 g d'acide pour 100 mL, vinaigre « à 5° »). À la demi-équivalence, [CH₃CO₂H] = [CH₃CO₂⁻] et pH = pKA = 4,8. Le pH à l'équivalence (environ 8,3) est dans la zone de virage de la phénolphtaléine : c'est l'indicateur qui convient.",
    objectif: "Tracer pH = f(V), trouver VE, la concentration du vinaigre et le pKA ; choisir un indicateur.",
    entetes: [], donnees: ["Prise d'essai : 10,0 mL de vinaigre dilué dix fois, + 90 mL d'eau", "Burette : NaOH, Cb = 0,100 mol/L", "CH₃CO₂H + HO⁻ → CH₃CO₂⁻ + H₂O ; M(CH₃CO₂H) = 60 g/mol"],
    conclusion_courte: "VE à l'extremum de dpH/dV ; pKA à VE/2.",
    etapes: [
      { consigne: "Remplissez la burette, posez le bécher sur l'agitateur, mettez l'agitation en marche et plongez l'électrode.", court: "Burette, bécher, agitation, électrode.", aide_geste: "Faites glisser le bécher sur le plateau, touchez le bouton de l'agitateur, puis faites descendre l'électrode.", verifier: ({ faits }) => (B(faits).plonge && B(faits).agite) || false },
      { consigne: "Touchez « Mesurer » sur l'ordinateur pour enregistrer le pH initial (V = 0).", court: "Point à V = 0.", verifier: ({ faits }) => P(faits).some(([V]) => V < 0.05) || false },
      { consigne: "Versez la soude mL par mL (par 0,2 mL entre 7 et 9 mL) jusqu'à 15 mL ; après chaque ajout, attendez que le pH soit stable et touchez « Mesurer ».", court: "Titrage : mesures jusqu'à 15 mL.", aide_geste: "Robinet : un toucher donne une goutte (0,05 mL) ; faites-le glisser vers le haut pour un filet, puis touchez-le pour le fermer.", verifier: ({ faits }) => { const p = P(faits); return (p.length >= 18 && p[p.length - 1][0] >= 14 && p.filter(([V]) => V >= 7 && V <= 9).length >= 5) || false; } },
      { consigne: "Affichez dpH/dV et placez le curseur sur son maximum : volume à l'équivalence VE (mL) ?", court: "VE (mL) ?", question: relatif("mL", 8.0, 0.025, "Le point d'équivalence correspond à l'extremum de dpH/dV.", "Exact : VE = 8,0 mL.") },
      { consigne: "Concentration C de l'acide dans le vinaigre dilué (mol/L) ?", court: "C (mol/L) ?", question: relatif("mol/L", 0.08, 0.03, "À l'équivalence : C·Va = Cb·VE, avec Va = 10,0 mL.", "Exact.") },
      { consigne: "Le vinaigre commercial est dix fois plus concentré. Masse d'acide éthanoïque dans 100 mL de vinaigre commercial (g) ?", court: "Masse pour 100 mL (g) ?", question: relatif("g", 4.8, 0.04, "m = 10·C × 0,100 L × 60 g/mol.", "Exact : c'est un vinaigre « à 5° » environ.") },
      { consigne: "Placez le curseur à V = VE / 2 : pH à la demi-équivalence, égal au pKA du couple CH₃CO₂H / CH₃CO₂⁻ ?", court: "pKA ?", question: nombre("", 4.76, 0.1, "À la demi-équivalence, [CH₃CO₂H] = [CH₃CO₂⁻], donc pH = pKA.", "Exact : pKA = 4,8.") },
      { consigne: "Pour faire ce titrage sans pH-mètre, il faut choisir…", court: "Répondez dans le carnet.", question: choix(["la phénolphtaléine : sa zone de virage (8,2 – 10,0) contient le pH à l'équivalence", "l'hélianthine", "le bleu de bromothymol"], "Lisez le pH à l'équivalence sur la courbe et le document mural.", "Exact.") },
      { consigne: "À V = 4,0 mL, pH ≈ 4,8 : [HO⁻] = 10^(pH − 14) ≈ 6 × 10⁻¹⁰ mol/L, alors que 0,40 mmol d'ions HO⁻ ont été versés. On en conclut que…", court: "Répondez dans le carnet.", question: choix(["presque tous les ions HO⁻ versés ont réagi : la réaction de titrage est quasi totale (τ ≈ 1)", "la réaction de titrage n'a pas lieu avant l'équivalence", "la réaction de titrage est limitée (τ ≈ 0,5)"], "Comparez la quantité d'ions HO⁻ restant à celle versée.", "Exact.") },
    ],
  };

  L.demarrer({ id: "b2_chim5_a2_titrage_ph", titre: "Laboratoire : titrage pH-métrique du vinaigre", paillasses: [L.poste_vinaigre], missions: [TITRAGE] });
})(window.Labo);
