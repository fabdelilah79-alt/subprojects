/*
Rôle : simulation de l'activité 1 du chapitre « Suivi temporel d'une transformation, vitesse de réaction » (2e année du bac) :
       suivi de S₂O₈²⁻ + 2 I⁻ → 2 SO₄²⁻ + I₂ par prélèvements : prélèvement de 10 mL, trempe dans l'eau glacée, titrage du
       diiode par le thiosulfate (empois d'amidon), avancement x au moment du prélèvement ; résultats de la classe au
       tableur, courbe x = f(t), avancement final, temps de demi-réaction, évolution de la vitesse lue sur les tangentes
       (sans calcul, comme le demandent les orientations). Objectifs O1, O2, O3, O4, O5, O6.
Reçoit : rien (les vérifications lisent le fait « suivi » et la feuille).
Produit : la simulation démarrée.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const relatif = (unite, attendu, tol, aide, bravo) => ({ type: "nombre", unite, attendu, tolerance_relative: tol, aide, bravo });
  const S = (f) => f.suivi || {}, dernier = (f) => (S(f).titrages || []).slice(-1)[0];

  function tableau({ faits, feuille }) {
    // A : t (min) ; B : VE (mL) d'un groupe (affiche) ou du sien ; C : x = 0,05 × VE (mmol) ; huit lignes au moins.
    const v = (c, n) => feuille.valeur_sure(`${c}${n}`), lignes = [...L.RESULTATS_CLASSE, ...(S(faits).titrages || []).map((r) => [r.t_p / 60, r.VE])];
    let n_ok = 0;
    for (let n = 2; n <= 12; n++) {
      if (v("A", n) === null) continue;
      if (!lignes.some(([t, VE]) => Math.abs(t - v("A", n)) < 0.06 && Math.abs(VE - v("B", n)) < 0.06)) return `Ligne ${n} : en A la date (min), en B le volume équivalent (mL) d'un même prélèvement.`;
      if (v("C", n) === null || Math.abs(v("C", n) - 0.05 * v("B", n)) > 0.002) return `Ligne ${n} : en C, x = 0,05 × B${n} (mmol).`;
      n_ok++;
    }
    return n_ok >= 8 || false;
  }

  const PRELEVEMENT = {
    id: "prelevement", paillasse: 0, titre: "Prélèvement, trempe et titrage",
    conclusion: "On suit une transformation lente en faisant des prélèvements à des dates connues. Chaque prélèvement est versé dans l'eau glacée : la dilution et le refroidissement bloquent presque la transformation (trempe). Le diiode formé est titré par le thiosulfate (I₂ + 2 S₂O₃²⁻ → 2 I⁻ + S₄O₆²⁻) ; à l'équivalence, la teinte bleu-noir de l'empois d'amidon disparaît : n(I₂) = c·VE/2. Dans le mélange de 100 mL, x = n(I₂) × 100/10.",
    objectif: "Faire un prélèvement, le tremper, le titrer et en déduire l'avancement à cette date.",
    entetes: [], donnees: ["Mélange : 100 mL ; n(S₂O₈²⁻) initiale = 1,0 mmol ; I⁻ en excès", "Titrage : I₂ + 2 S₂O₃²⁻ → 2 I⁻ + S₄O₆²⁻ ; thiosulfate 0,010 mol/L", "Prélèvement : 10,0 mL"],
    conclusion_courte: "Prélever, tremper, titrer : x à chaque date.",
    etapes: [
      { consigne: "Touchez « Mélanger » : 50 mL de peroxodisulfate de potassium sont versés dans 50 mL d'iodure de potassium ; l'horloge démarre.", court: "Mélanger (t = 0).", verifier: ({ faits }) => S(faits).t0 || false },
      { consigne: "Le mélange jaunit puis brunit peu à peu, car…", court: "Répondez dans le carnet.", question: choix(["le diiode se forme lentement : S₂O₈²⁻ + 2 I⁻ → 2 SO₄²⁻ + I₂", "l'iodure de potassium s'évapore", "la transformation est instantanée"], "Le diiode est brun en solution.", "Exact.") },
      { consigne: "Prélevez 10,0 mL du mélange avec la pipette graduée et versez-les dans le bécher d'eau glacée ; l'horloge donne la date du prélèvement.", court: "Prélèvement de 10,0 mL.", aide_geste: "Plongez la pointe dans le mélange, montez la molette pour aspirer, puis videz la pipette dans l'eau glacée.", verifier: ({ faits }) => { const p = S(faits).prelevement; return (p && p.V_p >= 9.8 && p.V_p <= 10.2) || false; } },
      { consigne: "On verse le prélèvement dans l'eau glacée pour…", court: "Répondez dans le carnet.", question: choix(["arrêter presque la transformation (dilution et froid) : la quantité de diiode ne change plus pendant le titrage", "dissoudre le diiode", "accélérer la transformation"], "Rappelez-vous les facteurs cinétiques.", "Exact : c'est la trempe.") },
      { consigne: "Ajoutez quelques gouttes d'empois d'amidon, posez le bécher sur l'agitateur, remplissez la burette et titrez jusqu'à la disparition de la teinte bleu-noir.", court: "Titrage du diiode.", verifier: ({ faits }) => !!dernier(faits) || false },
      { consigne: "À l'équivalence…", court: "Répondez dans le carnet.", question: choix(["le diiode et le thiosulfate ont été mélangés dans les proportions de l'équation du titrage : n(S₂O₃²⁻) = 2 n(I₂)", "tout le thiosulfate de la burette a été versé", "le diiode est en excès"], "Équation : I₂ + 2 S₂O₃²⁻ → 2 I⁻ + S₄O₆²⁻.", "Exact.") },
      { consigne: "Avancement x dans le mélange (100 mL) à la date du prélèvement (mmol) ?", court: "x (mmol) ?", question: relatif("mmol", (f) => (0.01 * (dernier(f) || { VE: 0 }).VE / 2) * 10, 0.03, "n(I₂) = c·VE/2 dans 10 mL ; x = 10 × n(I₂).", "Exact.") },
    ],
  };

  const COURBE = {
    id: "courbe", paillasse: 1, titre: "Courbe x = f(t), temps de demi-réaction",
    conclusion: "L'avancement augmente de plus en plus lentement et tend vers x_max = 1,0 mmol (S₂O₈²⁻ est le réactif limitant). Le temps de demi-réaction, durée au bout de laquelle x = x_max/2, vaut environ 3 min. La vitesse volumique v = (1/V)·dx/dt, proportionnelle à la pente de la tangente, est la plus grande au début et diminue, car les réactifs s'épuisent ; elle se compare sur la courbe, sans calcul.",
    objectif: "Tracer x = f(t) avec les résultats de la classe et l'exploiter.",
    entetes: ["t (min)", "VE (mL)", "x (mmol)"], donnees: ["x = 10 × c·VE/2 = 0,05 × VE (mmol)", "Ajoutez votre propre mesure", "t1/2 : x = x_max / 2"],
    conclusion_courte: "x tend vers x_max ; t1/2 ≈ 3 min ; vitesse décroissante.",
    etapes: [
      { consigne: "Tableur : recopiez les résultats de l'affiche (et le vôtre) : t (min) en A, VE (mL) en B, x = 0,05·VE en C.", court: "Tableur : t, VE, x.", verifier: tableau },
      { consigne: "Tracez x (C) en fonction de t (A).", court: "Courbe x = f(t).", verifier: ({ courbe: c }) => (c.x === "A" && c.y === "C" && c.n >= 8) || "Abscisse : A ; ordonnée : C." },
      { consigne: "Avancement final x_max (mmol) ?", court: "x_max (mmol) ?", question: relatif("mmol", 1.0, 0.05, "S₂O₈²⁻ est le réactif limitant : 50 mL à 0,020 mol/L.", "Exact : 1,0 mmol.") },
      { consigne: "Temps de demi-réaction t1/2 (min), lu sur la courbe ?", court: "t1/2 (min) ?", question: relatif("min", 3.0, 0.15, "Cherchez la date où x = x_max / 2 = 0,50 mmol.", "Exact : environ 3 min.") },
      { consigne: "Sur la courbe, la tangente est la plus inclinée…", court: "Répondez dans le carnet.", question: choix(["au début : la vitesse est la plus grande quand les réactifs sont les plus concentrés, puis elle diminue", "à la fin", "elle a la même pente partout"], "Tracez des tangentes à quelques dates.", "Exact.") },
      { consigne: "Avec un mélange plus chaud ou plus concentré, t1/2 serait…", court: "Répondez dans le carnet.", question: choix(["plus petit : la vitesse augmente avec la température et la concentration", "plus grand", "le même"], "Facteurs cinétiques.", "Exact.") },
    ],
  };

  L.demarrer({ id: "b2_chim2_a1_prelevements", titre: "Laboratoire : suivi par prélèvements et titrage", paillasses: [L.poste_prelevement, L.poste_resultats], missions: [PRELEVEMENT, COURBE] });
})(window.Labo);
