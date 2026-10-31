/*
Rôle : simulation de l'activité 4 du chapitre « Quantité de mouvement » (tronc commun) : « Vérification expérimentale de
       F = Δp/Δt ». Objectif O4 (direction et sens d'une force à partir de la variation de p, et inversement) ;
       orientation : la Terre agit sur une bille (approche de la dynamique).
Reçoit : rien (les vérifications lisent la fin des chronophotographies et le tableur).
Produit : la simulation démarrée : chute d'une bille devant une règle, bille lancée devant un tableau quadrillé.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const M = 0.05, TAU = 0.05, G = 9.8, V0 = 1, SOL = 562;
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const nombre = (unite, attendu, aide) => ({ type: "nombre", unite, attendu, tolerance_relative: 0.06, aide, bravo: "Exact." });
  const y_cm = (i) => 0.5 * G * (i * TAU) ** 2 * 100;

  function tableau({ feuille }) {
    // t (s) en A et y (cm) lue sur la règle en B, pour i = 0 à 9 (lecture à 3 mm près).
    const lignes = feuille.lignes(["A", "B"]);
    for (let i = 0; i < Math.min(10, lignes.length); i++) {
      if (Math.abs(lignes[i].A - i * TAU) > 5e-4) return `Ligne ${i + 2} : t = ${i} × τ, avec τ = 0,05 s.`;
      if (Math.abs(lignes[i].B - y_cm(i)) > 0.3) return `Relisez la position de l'image ${i} : placez le fil rouge sur le centre de la bille, zoomez sur la règle.`;
    }
    return lignes.length >= 10 || false;
  }

  function fond(g) {
    // Grand mur carrelé (le panneau y est fixé) et plan de travail bas, où sont posés le matériel, le carnet et la tablette.
    L.svg("rect", { width: L.LARGEUR, height: SOL, fill: "url(#mur)" }, g);
    L.svg("rect", { y: 230, width: L.LARGEUR, height: SOL - 230, fill: "url(#carrelage)" }, g);
    L.svg("rect", { y: SOL, width: L.LARGEUR, height: L.HAUTEUR - SOL, fill: "url(#paillasse)" }, g);
    L.svg("rect", { y: SOL, width: L.LARGEUR, height: 6, fill: "#000", opacity: 0.25 }, g);
  }

  function poste(g, reglages, panneau, fils, carte) {
    // Une paillasse : panneau de mesure au mur, chronophotographie, fils de lecture, carte des données.
    fond(g);
    L.panneau(g, panneau);
    L.chronophoto(g, reglages);
    for (const [sens, de, a, p] of fils) L.fil_lecture(g, sens, de, a, p);
    L.svg("rect", { x: 790, y: 90, width: 220, height: 44, rx: 3, fill: "#f7f5ee", stroke: "#c9c3b0" }, g);
    carte.forEach((ligne, i) => L.texte(g, 900, 105 + i * 18, ligne, { class: "etiquette-carton", "font-size": 15 }));
    return { pense_bete: L.decor.pense_bete(g, 24, 40, 230) };
  }

  const CHUTE = {
    id: "chute", paillasse: 0, titre: "La chute d'une bille",
    objectif: `La Terre agit sur une bille de ${M * 1000} g lâchée sans vitesse. Comparer Δp/Δt et le poids P = m·g.`,
    entetes: ["t (s)", "y (cm)"],
    conclusion: "Pour la bille qui tombe, Δp/Δt = m·g = P : la force qui agit est égale à la variation de la quantité de mouvement par unité de temps, F = Δp/Δt ; Δp a la direction et le sens de la force.",
    conclusion_courte: "F = Δp / Δt.",
    etapes: [
      { consigne: "Appuyez sur « Lâcher la bille » : l'électroaimant la libère, le stroboscope la photographie toutes les 0,05 s.", court: "Lâchez la bille.", verifier: ({ faits }) => !!faits.chute },
      { consigne: "Pour i = 0 à 9 : notez t (s) en A et la position y (cm) de l'image i, lue sur la règle, en B.", court: "Tableur : t et y (i = 0 à 9).", verifier: tableau, aide_geste: "Faites glisser le fil rouge sur le centre de chaque image ; zoomez pour lire au millimètre." },
      { consigne: "Calculez v3 = (y4 − y2) / (2τ), en m/s.", court: "v3 (m/s) ?", question: nombre("m/s", G * 3 * TAU, "y4 − y2 en mètre ; 2τ = 0,1 s.") },
      { consigne: "Calculez v7 = (y8 − y6) / (2τ), en m/s.", court: "v7 (m/s) ?", question: nombre("m/s", G * 7 * TAU, "y8 − y6 en mètre.") },
      { consigne: `Calculez Δp / Δt = m·(v7 − v3) / (t7 − t3), en newton (m = ${M * 1000} g).`, court: "Δp/Δt (N) ?", question: nombre("N", M * G, "t7 − t3 = 4τ = 0,2 s ; m en kg.") },
      { consigne: "Comparez Δp/Δt au poids de la bille, P = m·g (g = 9,8 N/kg).", court: "Répondez dans le carnet.", question: choix(["Δp/Δt = P : la force qui agit sur la bille est égale à Δp/Δt", "Δp/Δt est nul", "Δp/Δt est dix fois plus grand que P"], `P = ${M} × 9,8.`, "Exact : F = Δp/Δt.") },
      { consigne: "Le vecteur Δp = p7 − p3 est…", court: "Répondez dans le carnet.", question: choix(["vertical, vers le bas : comme le poids", "vertical, vers le haut", "nul"], "La vitesse augmente vers le bas.", "Exact : Δp a la direction et le sens de la force.") },
    ],
  };

  const LANCER = {
    id: "lancer", paillasse: 1, titre: "La bille lancée horizontalement",
    objectif: "La bille quitte le rail avec une vitesse horizontale. Quelle est la direction de la force qui agit sur elle ?",
    entetes: [],
    conclusion: "La vitesse horizontale reste constante, la vitesse verticale augmente : Δp est vertical vers le bas, donc la force (le poids) est verticale vers le bas.",
    conclusion_courte: "Δp vertical : force verticale.",
    etapes: [
      { consigne: "Appuyez sur « Lancer la bille » : elle roule sur le rail et le quitte au point O.", court: "Lancez la bille.", verifier: ({ faits }) => !!faits.lancer_h },
      { consigne: "Avec le fil vertical, mesurez la distance horizontale entre deux images successives. Elle est…", court: "Répondez dans le carnet.", question: choix(["constante", "de plus en plus grande", "de plus en plus petite"], "Comparez plusieurs intervalles sur le quadrillage.", "Exact : aucune force horizontale n'agit.") },
      { consigne: "Calculez la composante horizontale vx de la vitesse (en m/s).", court: "vx (m/s) ?", question: nombre("m/s", V0, "vx = distance horizontale entre deux images / τ (τ = 0,05 s).") },
      { consigne: "Entre deux instants, le vecteur Δp…", court: "Répondez dans le carnet.", question: choix(["est vertical vers le bas : la force qui agit (le poids) est verticale", "est horizontal", "est tangent à la trajectoire"], "Seule la composante verticale de la vitesse change.", "Exact.") },
      { consigne: "Inversement : une force constante agit sur un corps. Entre deux instants, Δp…", court: "Répondez dans le carnet.", question: choix(["a la direction et le sens de la force (F = Δp/Δt)", "est perpendiculaire à la force", "est toujours nul"], "C'est la relation que vous avez vérifiée.", "Exact.") },
    ],
  };

  L.demarrer({
    id: "tc_meca4_a4_force", titre: "Laboratoire : la force et la quantité de mouvement",
    decor: "aucun", repos_carnet: { x: 118, y: 634 }, repos_tablette: { x: 922, y: 632 },
    paillasses: [
      (g) => poste(g, { nom: "chute", tau: TAU, duree: 0.47, origine: { x: 430, y: 62 }, echelle: 400, v0x: 0, depart: "electroaimant", sol: SOL, bouton: { x: 680, y: 604, texte: "Lâcher la bille" } },
        { type: "regle", origine: { x: 470, y: 62 }, echelle: 400, hauteur_m: 1.2 }, [["horizontal", 380, 560, 300]], [`Bille : ${M * 1000} g`, "Stroboscope : τ = 0,05 s"]),
      (g) => poste(g, { nom: "lancer_h", tau: TAU, duree: 0.35, origine: { x: 330, y: 100 }, echelle: 700, v0x: V0, depart: "rail", sol: SOL, bouton: { x: 680, y: 604, texte: "Lancer la bille" } },
        { type: "quadrillage", origine: { x: 330, y: 100 }, echelle: 700, largeur_m: 0.6, hauteur_m: 0.6 }, [["horizontal", 320, 760, 300], ["vertical", 100, 540, 500]], [`Bille : ${M * 1000} g`, "Stroboscope : τ = 0,05 s"]),
    ],
    missions: [CHUTE, LANCER],
  });
})(window.Labo);
