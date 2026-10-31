/*
Rôle : simulation de l'activité 2 du chapitre « Propagation d'une onde lumineuse » (2e année du bac) : dispersion de la
       lumière par un prisme au goniomètre (goniometre_prisme.js) — déviation en fonction de l'incidence, minimum de
       déviation, indice n = sin((A + Dm)/2) / sin(A/2) pour le rouge et le vert, spectre de la lumière blanche ;
       fréquence inchangée, longueur d'onde et célérité dans le verre. Objectifs O3, O4, O5.
Reçoit : rien (les vérifications lisent le fait « goniometre », la feuille et la courbe).
Produit : la simulation démarrée.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const nombre = (unite, attendu, tolerance, aide, bravo) => ({ type: "nombre", unite, attendu, tolerance, aide, bravo });
  const G = (f) => f.goniometre || {}, RAD = Math.PI / 180;
  const deviation = (i, n) => { const r = Math.asin(Math.sin(i * RAD) / n) / RAD, s = n * Math.sin((60 - r) * RAD); return Math.abs(s) < 1 ? i + Math.asin(s) / RAD - 60 : null; };
  const minimum = (n) => 2 * Math.asin(n * Math.sin(30 * RAD)) / RAD - 60;

  function tableau({ feuille }) {
    // Laser rouge : au moins six incidences i (A, °) et les déviations lues D (B, °), à 0,3° près.
    const l = feuille.lignes(["A", "B"]), n = L.indice_flint(650);
    if (l.length < 6) return false;
    for (const [k, x] of l.entries()) { const D = deviation(x.A, n); if (D === null || Math.abs(x.B - D) > 0.3) return `Ligne ${k + 2} : en A l'incidence i (°), en B la déviation D lue à la lunette pour cette incidence (laser rouge).`; }
    return new Set(l.map((x) => x.A)).size >= 6 || "Six incidences différentes.";
  }

  const DEVIATION = {
    id: "deviation", paillasse: 0, titre: "La déviation par un prisme",
    objectif: "Mesurer la déviation D d'un faisceau laser rouge par un prisme pour plusieurs incidences ; trouver le minimum de déviation ; calculer l'indice.",
    entetes: ["i (°)", "D (°)"],
    donnees: ["Prisme : angle au sommet A = 60°", "Au minimum de déviation : n = sin((A + Dm)/2) / sin(A/2)", "Lois de Descartes : sin i = n·sin r ; sin i′ = n·sin r′ ; A = r + r′ ; D = i + i′ − A", "Sous 38° d'incidence environ, la lumière ne sort plus par la deuxième face (réflexion totale)"],
    conclusion: "La déviation D dépend de l'incidence i : elle passe par un minimum Dm ≈ 48,1° (pour i ≈ 54°, trajet symétrique dans le prisme). Les lois de Descartes appliquées aux deux faces donnent alors n = sin((A + Dm)/2) / sin(A/2) ≈ 1,619 pour la radiation rouge de 650 nm.",
    conclusion_courte: "Minimum de déviation ; n(rouge) ≈ 1,619.",
    etapes: [
      { consigne: "Laser rouge, incidence i = 50°. Tournez la lunette jusqu'à ce que le faisceau soit sur le réticule.", court: "Lunette sur le faisceau (i = 50°).", aide_geste: "Tournez le bouton « lunette » (glissez vers le haut ou le bas) ; touches + et − pour le réglage fin.", verifier: ({ faits }) => (G(faits).source === "rouge" && G(faits).i === 50 && G(faits).aligne) || false },
      { consigne: "Déviation D lue à la lunette (°) ?", court: "D (°) ?", question: nombre("°", (f) => G(f).D || 48.5, 0.2, "Lisez l'afficheur du bouton « lunette ».", "Exact.") },
      { consigne: "Tableur : mesurez D pour au moins six incidences, de 40° à 75°. En A : i (°) ; en B : D (°).", court: "Tableur : i, D.", verifier: tableau },
      { consigne: "Tracez D (B) en fonction de i (A).", court: "Courbe D = f(i).", verifier: ({ courbe }) => (courbe.x === "A" && courbe.y === "B" && courbe.n >= 6) || "Abscisse : A (i) ; ordonnée : B (D)." },
      { consigne: "Déviation minimale Dm (°) ?", court: "Dm (°) ?", question: nombre("°", minimum(L.indice_flint(650)), 0.4, "Le plus bas point de la courbe ; affinez autour de i = 54°.", "Exact : environ 48,1°.") },
      { consigne: "Indice du verre pour cette radiation : n = sin((A + Dm)/2) / sin(A/2) ?", court: "n (rouge) ?", question: nombre("", L.indice_flint(650), 0.004, "A = 60° ; sin 30° = 0,5.", "Exact : n ≈ 1,619.") },
    ],
  };

  const COULEURS = {
    id: "couleurs", paillasse: 0, titre: "Couleurs et indice",
    objectif: "Comparer l'indice du verre pour le rouge et le vert ; observer le spectre de la lumière blanche.",
    entetes: [],
    donnees: ["c = 3,00 × 10⁸ m/s ; n = c / v", "Laser rouge : λ = 650 nm ; laser vert : λ = 532 nm (dans le vide)"],
    conclusion: "Au minimum de déviation, le vert est plus dévié que le rouge : n(vert) ≈ 1,630 > n(rouge) ≈ 1,619. L'indice du verre dépend de la fréquence de la radiation : le verre est un milieu dispersif, et le prisme sépare les radiations de la lumière blanche (le violet est le plus dévié). En entrant dans le verre, la fréquence ne change pas ; la célérité devient v = c / n et la longueur d'onde λ = λ₀ / n.",
    conclusion_courte: "n dépend de la fréquence : verre dispersif.",
    etapes: [
      { consigne: "Prenez le laser vert. Cherchez le minimum de déviation (tournez le prisme en suivant le faisceau avec la lunette) et visez-le.", court: "Minimum de déviation (vert).", verifier: ({ faits }) => { const g = G(faits); return (g.source === "vert" && g.aligne && Math.abs(g.D - minimum(L.indice_flint(532))) < 0.15) || false; } },
      { consigne: "Indice du verre pour le vert ?", court: "n (vert) ?", question: nombre("", L.indice_flint(532), 0.004, "n = sin((A + Dm)/2) / sin(A/2).", "Exact : n ≈ 1,630.") },
      { consigne: "L'indice n'est pas le même pour le rouge et pour le vert. Le verre est donc…", court: "Répondez dans le carnet.", question: choix(["un milieu dispersif : l'indice dépend de la fréquence de la radiation", "un milieu non dispersif", "un milieu opaque au vert"], "Pensez à la cuve à ondes.", "Exact.") },
      { consigne: "Passez en lumière blanche. Après le prisme, on voit…", court: "Répondez dans le carnet.", question: choix(["un spectre continu ; le violet est le plus dévié, le rouge le moins", "un seul faisceau blanc", "un spectre où le rouge est le plus dévié"], "Regardez l'éventail de couleurs.", "Exact.") },
      { consigne: "Quand la lumière rouge passe de l'air au verre, sa fréquence…", court: "Répondez dans le carnet.", question: choix(["ne change pas ; sa célérité et sa longueur d'onde diminuent", "diminue", "augmente"], "La fréquence est imposée par la source.", "Exact.") },
      { consigne: "Longueur d'onde de la radiation rouge dans le verre, λ = λ₀ / n (nm) ?", court: "λ dans le verre (nm) ?", question: nombre("nm", 650 / L.indice_flint(650), 4, "λ₀ = 650 nm ; n ≈ 1,619.", "Exact : environ 401 nm.") },
    ],
  };

  L.poste_goniometre = function (g) {
    // Pense-bête et goniomètre.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230);
    L.goniometre_prisme(g, { x: 470, y: 495, fait: "goniometre" });
    return { pense_bete };
  };

  L.demarrer({ id: "b2_ondes3_a2_prisme", titre: "Laboratoire : dispersion par un prisme", paillasses: [L.poste_goniometre], missions: [DEVIATION, COULEURS] });
})(window.Labo);
