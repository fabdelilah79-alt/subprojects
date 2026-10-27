/*
Rôle : simulation de l'activité 1 du chapitre « Ondes mécaniques progressives périodiques » (2e année du bac) : onde
       sinusoïdale le long d'une corde observée au stroboscope (période, fréquence, longueur d'onde, λ = v·T) ; onde
       sonore sinusoïdale reçue par deux microphones (oscilloscope : période, points en phase, λ, célérité). Objectifs O1, O2.
Reçoit : rien (les vérifications lisent les faits « corde_vibreur », « son_periodique », la feuille et la courbe).
Produit : la simulation démarrée.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const nombre = (unite, attendu, tolerance, aide, bravo) => ({ type: "nombre", unite, attendu, tolerance, aide, bravo });
  const C = (f) => f.corde_vibreur || {}, S = (f) => f.son_periodique || {};

  function tableau({ feuille }) {
    // Au moins quatre fréquences f (A, Hz) et les longueurs d'onde mesurées λ (B, m) : λ = 10 / f à 6 mm près.
    const l = feuille.lignes(["A", "B"]);
    if (l.length < 4) return false;
    for (const [k, x] of l.entries()) if (Math.abs(x.B - 10 / x.A) > 0.006) return `Ligne ${k + 2} : en A la fréquence f (Hz) du GBF, en B la longueur d'onde mesurée λ (m) pour cette fréquence.`;
    return new Set(l.map((x) => x.A)).size >= 4 || "Quatre fréquences différentes.";
  }

  const CORDE = {
    id: "corde", paillasse: 0, titre: "Une onde sinusoïdale le long d'une corde",
    objectif: "Observer au stroboscope une onde progressive sinusoïdale ; mesurer sa longueur d'onde ; relier λ, v et T.",
    entetes: ["f (Hz)", "λ (m)", "v = λ·f (m/s)"],
    donnees: ["Le coton, à droite, absorbe l'onde : elle n'est pas réfléchie", "L'œil garde une image pendant environ 0,1 s"],
    conclusion: "Chaque point de la corde vibre avec la période T = 1/f de la source : c'est une périodicité temporelle. À un instant donné, la corde a une forme sinusoïdale qui se répète tous les λ : c'est une périodicité spatiale. La longueur d'onde λ est la distance parcourue par l'onde pendant une période : λ = v·T = v / f. Ici v ≈ 10 m/s quelle que soit la fréquence. Deux points distants de λ vibrent en phase.",
    conclusion_courte: "λ = v·T = v / f ; double périodicité.",
    etapes: [
      { consigne: "Mettez le GBF en marche (f = 50 Hz) et regardez la corde en lumière ordinaire.", court: "GBF en marche.", aide_geste: "Touchez la touche I/O du GBF.", verifier: ({ faits }) => C(faits).marche || false },
      { consigne: "En lumière ordinaire, on ne voit qu'une bande floue parce que…", court: "Répondez dans le carnet.", question: choix(["la corde vibre trop vite (50 fois par seconde) : l'œil superpose ses positions", "la corde est cassée", "la lumière est trop faible"], "Combien d'oscillations par seconde ?", "Exact.") },
      { consigne: "Allumez le stroboscope et réglez sa fréquence fe pour que la corde paraisse immobile, avec la plus grande fe possible.", court: "Corde immobile, fe la plus grande.", aide_geste: "Tournez le bouton fe (glissez vers le haut ou le bas) ; touches + et − pour le réglage fin.", verifier: ({ faits }) => { const c = C(faits); if (!c.strobo) return false; if (Math.abs(c.rapport - Math.round(c.rapport)) < 0.0015 && c.rapport >= 1.5) return "La corde paraît immobile, mais il existe une fréquence d'éclairs plus grande qui l'immobilise aussi."; return Math.abs(c.rapport - 1) < 0.0015 || false; } },
      { consigne: "Avec fe = f / 2, la corde paraît aussi immobile parce que…", court: "Répondez dans le carnet.", question: choix(["entre deux éclairs, chaque point fait exactement deux oscillations et revient à la même position", "le stroboscope est en panne", "la corde s'arrête"], "Comparez la durée entre deux éclairs à la période T.", "Exact.") },
      { consigne: "Placez les deux curseurs rouges sur deux sommets consécutifs de la corde immobile.", court: "Curseurs sur deux sommets.", aide_geste: "Glissez chaque curseur le long de la règle.", verifier: ({ faits }) => (C(faits).strobo && Math.abs(C(faits).ecart - C(faits).lambda) <= 0.6) || false },
      { consigne: "Longueur d'onde λ lue sur la règle (cm) ?", court: "λ (cm) ?", question: nombre("cm", (f) => C(f).lambda || 20, 0.6, "Distance entre deux sommets consécutifs.", "Exact.") },
      { consigne: "Calculez la célérité v = λ·f (m/s).", court: "v (m/s) ?", question: nombre("m/s", 10, 0.4, "λ en mètres, f en hertz.", "Exact : environ 10 m/s.") },
      { consigne: "Tableur : pour quatre fréquences du GBF (immobilisez la corde à chaque fois), mesurez λ. En A : f (Hz) ; en B : λ (m) ; en C : =A2*B2.", court: "Tableur : f, λ, v.", verifier: tableau },
      { consigne: "Quand la fréquence augmente, la longueur d'onde…", court: "Répondez dans le carnet.", question: choix(["diminue : λ = v / f, et la célérité v reste la même", "augmente", "ne change pas"], "Regardez la colonne C.", "Exact.") },
      { consigne: "Réglez fe un peu au-dessous de f (par exemple 49 Hz). L'onde semble…", court: "Répondez dans le carnet.", question: choix(["avancer lentement vers le coton : c'est un mouvement apparent, au ralenti", "reculer très vite", "rester immobile"], "Regardez la corde quelques secondes.", "Exact.") },
    ],
  };

  const SON = {
    id: "son", paillasse: 1, titre: "Une onde sonore sinusoïdale",
    objectif: "Visualiser à l'oscilloscope les tensions de deux micros ; mesurer la période et la longueur d'onde du son.",
    entetes: [],
    donnees: ["Température de la salle : 20 °C", "Les deux courbes sont en phase quand leurs maximums ont lieu aux mêmes instants"],
    conclusion: "Les deux micros reçoivent un son de même période T = 1/f que la tension du GBF. Quand on éloigne M2, sa courbe se décale ; elle est de nouveau en phase avec celle de M1 chaque fois que M1M2 augmente d'une longueur d'onde. Pour 5λ ≈ 86 cm à 2 000 Hz : λ ≈ 17,2 cm et v = λ·f ≈ 343 m/s.",
    conclusion_courte: "Points en phase distants de λ ; v = λ·f.",
    etapes: [
      { consigne: "Mettez le GBF en marche (f = 2 000 Hz). Lisez la période T sur l'oscilloscope.", court: "T (ms) ?", question: nombre("ms", 0.5, 0.03, "Comptez les divisions d'une période, multipliez par le balayage (ms/div).", "Exact : T = 1/f = 0,5 ms.") },
      { consigne: "M1 reste à 10 cm. Éloignez M2 jusqu'à ce que les deux courbes soient en phase pour la première fois.", court: "M1M2 = λ.", aide_geste: "Faites glisser M2 centimètre par centimètre en regardant l'écran.", verifier: ({ faits }) => { const s = S(faits); return (s.marche && s.x1 === 0.1 && s.en_phase && s.d > 0.1 && s.d < 0.25) || false; } },
      { consigne: "Continuez : éloignez M2 jusqu'à la cinquième position où les courbes sont en phase.", court: "M1M2 = 5λ.", verifier: ({ faits }) => { const s = S(faits); return (s.marche && s.x1 === 0.1 && s.en_phase && Math.abs(s.d * 100 - 5 * s.lambda) < 2) || false; } },
      { consigne: "Longueur d'onde du son (cm) ?", court: "λ (cm) ?", question: nombre("cm", 17.2, 0.5, "λ = M1M2 / 5.", "Exact.") },
      { consigne: "Célérité du son v = λ·f (m/s) ?", court: "v (m/s) ?", question: nombre("m/s", 343, 10, "λ en mètres, f = 2 000 Hz.", "Exact.") },
      { consigne: "La longueur d'onde est…", court: "Répondez dans le carnet.", question: choix(["la distance parcourue par l'onde pendant une période : λ = v·T", "la hauteur des courbes", "la distance entre le haut-parleur et le micro"], "λ = v / f = v·T.", "Exact.") },
    ],
  };

  L.demarrer({ id: "b2_ondes2_a1_sinusoidale", titre: "Laboratoire : ondes sinusoïdales", paillasses: [L.poste_corde_vibreur, L.poste_son_periodique], missions: [CORDE, SON] });
})(window.Labo);
