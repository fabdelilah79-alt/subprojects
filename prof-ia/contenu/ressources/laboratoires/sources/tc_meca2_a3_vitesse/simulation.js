/*
Rôle : simulation de l'activité 3 du chapitre « Le mouvement » (tronc commun) : « Déterminer expérimentalement une
       vitesse instantanée ». Objectifs O2 (vitesse moyenne, km/h ↔ m/s), O3 (vitesse instantanée approchée,
       vecteur vitesse) et O4 (exploiter un enregistrement). Orientation : vitesse moyenne, puis vecteur vitesse.
Reçoit : rien (les vérifications lisent l'enregistrement, les flèches tracées et le tableur).
Produit : la simulation démarrée : table à coussin d'air inclinée, éclateur, règle transparente, flèches-vecteurs.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const V = L.VERIF_ENR, ECHELLE = 100, INDICES = [3, 7];
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const enr = (f) => V.dernier(f);

  function enregistrement_courbe({ faits }) {
    // Au moins 12 points, sans rebond sur un bord (la trajectoire doit rester sur la feuille).
    const e = enr(faits);
    if (!e) return false;
    if (e.points.length < 12) return "L'enregistrement est trop court : relancez le mobile pendant l'enregistrement.";
    const bord = e.points.slice(0, 12).some((p) => p.x < 40 || p.x > 560 || p.y > 360);
    return !bord || "Le mobile a touché un bord : lancez-le moins vite, vers la droite, depuis le haut de la table.";
  }

  function tableau({ feuille, faits }) {
    // Pour i = 1 à 8 : t (s), Mi-1Mi+1 (cm) mesuré à la règle, v (m/s) calculé.
    const e = enr(faits);
    if (!e) return false;
    const lignes = feuille.lignes(["A", "B", "C"]);
    for (let k = 0; k < Math.min(8, lignes.length); k++) {
      const i = k + 1, l = lignes[k], d_cm = V.distance(e.points[i - 1], e.points[i + 1]) / 10;
      if (Math.abs(l.A - i * e.tau_s) > 0.0005) return `Ligne ${k + 2} : point M${i}, t = ${i} × τ.`;
      if (Math.abs(l.B - d_cm) > 0.15) return `Remesurez M${i - 1}M${i + 1} à la règle (en cm, au millimètre près).`;
      if (Math.abs(l.C - l.B / 100 / (2 * e.tau_s)) > 0.01) return `v${i} = M${i - 1}M${i + 1} / (2τ), en m/s : par exemple =B${k + 2}/100/(2*${L.nombre_court(e.tau_s)}).`;
    }
    return lignes.length >= 8 || false;
  }

  function vecteurs({ faits }) {
    // Les flèches v3 et v7 sont correctes (direction et longueur).
    const e = enr(faits), v = faits.vecteurs || {};
    if (!e) return false;
    for (const i of INDICES) {
      const r = L.vecteurs_vitesse.verifier(v[i], e.points, i, e.tau_s, ECHELLE);
      if (r !== true) return r;
    }
    return true;
  }

  const VITESSE = {
    id: "vitesse", paillasse: 0, titre: "La vitesse instantanée",
    objectif: "Sur une table inclinée, la vitesse du mobile change. Mesurer des vitesses moyennes sur de petits intervalles pour approcher la vitesse instantanée, puis représenter le vecteur vitesse.",
    entetes: ["t (s)", "Mi-1Mi+1 (cm)", "v (m/s)"],
    conclusion: "Vitesse instantanée en Mi : vi ≈ Mi-1Mi+1 / (2τ). Le vecteur vitesse est tangent à la trajectoire, dans le sens du mouvement ; sa longueur suit une échelle.",
    conclusion_courte: "vi ≈ Mi-1Mi+1 / 2τ.",
    etapes: [
      { consigne: "Appuyez sur « Enregistrer », puis lancez le mobile vers la droite, depuis le haut de la table : il descend la pente en avançant.", court: "Enregistrez le mouvement sur la table inclinée.", verifier: enregistrement_courbe, aide_geste: "Lancez le mobile doucement, parallèlement au bord du fond." },
      { consigne: "Prenez la feuille. Avec la règle, mesurez M2M4. Calculez la vitesse moyenne entre M2 et M4 : v = M2M4 / (2τ), en m/s.", court: "Vitesse moyenne entre M2 et M4 ?", question: { type: "nombre", unite: "m/s", attendu: (f) => V.vitesse(f.enregistrement.points, 3, f.enregistrement.tau_s), tolerance_relative: 0.06, aide: "Mesurez M2M4 en mètre ; entre M2 et M4 il s'écoule 2τ.", bravo: "Exact : c'est une bonne valeur approchée de la vitesse instantanée en M3." } },
      { consigne: "Pour i = 1 à 8 : notez t (s) en A, Mi-1Mi+1 (cm) mesuré à la règle en B, et calculez v (m/s) en C.", court: "Tableur : t, Mi-1Mi+1, v pour i = 1 à 8.", verifier: tableau, aide_geste: "Faites pivoter la règle par sa poignée ronde. Zoomez pour lire au millimètre." },
      { consigne: "Tracez v en fonction de t.", court: "Tracez v en fonction de t.", verifier: ({ courbe }) => courbe.x === "A" && courbe.y === "C" && courbe.n >= 8 },
      { consigne: "Sur cette table inclinée, la vitesse du mobile…", court: "Répondez dans le carnet.", question: choix(["augmente au cours du temps", "reste constante", "diminue au cours du temps"], "Regardez votre courbe v = f(t).", "Exact : le mobile accélère en descendant la pente.") },
      { consigne: "Sur la feuille, tracez les vecteurs vitesse en M3 et M7 : faites glisser la pointe de chaque flèche (échelle : 1 cm ↔ 0,1 m/s).", court: "Tracez les vecteurs v3 et v7.", verifier: vecteurs },
      { consigne: "Le vecteur vitesse en un point de la trajectoire est…", court: "Répondez dans le carnet.", question: choix(["tangent à la trajectoire, dans le sens du mouvement", "dirigé vers le bas de la pente", "perpendiculaire à la trajectoire"], "Comparez la flèche et la direction Mi-1Mi+1.", "Exact : il est tangent à la trajectoire.") },
      { consigne: "Exprimez la vitesse v7 en km/h (1 m/s = 3,6 km/h).", court: "v7 en km/h ?", question: { type: "nombre", unite: "km/h", attendu: (f) => 3.6 * V.vitesse(f.enregistrement.points, 7, f.enregistrement.tau_s), tolerance_relative: 0.06, aide: "Multipliez v7 (en m/s) par 3,6.", bravo: "Exact." } },
      { consigne: "Un élève parcourt 1,5 km en 20 min pour venir au lycée. Quelle est sa vitesse moyenne en km/h ?", court: "Vitesse moyenne de l'élève (km/h) ?", question: { type: "nombre", unite: "km/h", attendu: 4.5, tolerance: 0.05, aide: "20 min = 1/3 h ; v = d / Δt.", bravo: "Exact : 4,5 km/h, soit 1,25 m/s." } },
    ],
  };

  L.demarrer({
    id: "tc_meca2_a3_vitesse", titre: "Laboratoire : la vitesse instantanée",
    paillasses: [(g) => L.poste_coussin_air(g, { inclinaison_mm_s2: 350, outils: ["regle"], vecteurs: { indices: INDICES, echelle_mm_par_ms: ECHELLE } })],
    missions: [VITESSE],
  });
})(window.Labo);
