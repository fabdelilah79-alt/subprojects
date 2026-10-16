/*
Rôle : simulation de l'activité 2 du chapitre « Montages électroniques » (tronc commun) : l'amplificateur opérationnel.
       Objectifs O4 (AO idéal, caractéristique de transfert), O5 (suiveur, inverseur Us = −(R2/R1)·Ue, non-inverseur
       Us = ((R1 + R2)/R1)·Ue) et O6 (chaîne électronique) ; oscilloscope bicourbe.
Reçoit : rien (les vérifications lisent les mesures, la feuille et la courbe du tableur).
Produit : la simulation démarrée : transfert ; suiveur ; inverseur ; non-inverseur.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const { transfert, suiveur, outils } = L.MISSIONS_AO, { choix, montage, bien_regle } = outils;
  const I = montage("inverseur"), N = montage("non_inverseur");

  function feuille_inverseur({ feuille, faits, courbe }) {
    // Lignes : Ue max (A) et Us au même instant (B, négative) lus à l'oscilloscope ; C = B/A ; graphique B en fonction de A.
    const lignes = feuille.lignes(["A", "B", "C"]), pts = I(faits).points || [], proche = (x, y) => Math.abs(x - y) <= 0.15 + 0.03 * Math.abs(y);
    for (const [k, l] of lignes.entries()) {
      if (!pts.some((p) => proche(l.A, p.ue) && proche(l.B, p.us))) return `Ligne ${k + 2} : ces valeurs ne correspondent à aucune lecture de l'écran (Us est négative quand Ue est maximale).`;
      if (Math.abs(l.C - l.B / l.A) > 0.01) return `C${k + 2} : calculez Us/Ue (par exemple =B${k + 2}/A${k + 2}).`;
    }
    if (lignes.length < 5) return false;
    return (courbe.x === "A" && courbe.y === "B" && courbe.n >= 5 && courbe.modele !== "aucun") || "Tracez Us (B) en fonction de Ue (A) et modélisez.";
  }

  const INVERSEUR = {
    id: "inverseur", paillasse: 2, titre: "Le montage inverseur",
    objectif: "Avec R1 = 10 kΩ entre le GBF et e−, et R2 = 22 kΩ entre e− et s, quelle relation lie Us à Ue ?",
    entetes: ["Ue max (V)", "Us (V)", "Us/Ue"],
    conclusion: "Montage inverseur : e+ à la masse, R1 entre l'entrée et e−, R2 entre e− et s. En régime linéaire, ε = 0 et i− = 0 : Us = −(R2/R1)·Ue (ici −2,2). Us est en opposition de phase avec Ue. Si (R2/R1)·Ue max dépasse Vsat, la sortie est écrêtée à ±13,5 V : l'AO est saturé.",
    conclusion_courte: "Inverseur : Us = −(R2/R1)·Ue.",
    etapes: [
      { consigne: "AO déjà alimenté. SORTIE du GBF → R1 → e− ; R2 entre e− et s ; e+ → 0 ; masse du GBF → 0. Oscilloscope : Y1 sur la SORTIE du GBF (Ue), Y2 sur s (Us), masse ⏚ sur 0.", court: "Montez l'inverseur et l'oscilloscope.", verifier: ({ faits }) => (I(faits).monte && I(faits).ue_max > 0.3) || false },
      { consigne: "Réglez la sensibilité de chaque voie : les deux courbes entières dans l'écran.", court: "Réglez Sv de chaque voie.", verifier: bien_regle("inverseur") },
      { consigne: "Comparez les deux courbes : quand Ue est maximale, Us est…", court: "Répondez dans le carnet.", question: choix(["minimale : Us et Ue sont en opposition de phase", "maximale aussi : elles sont en phase", "nulle"], "Regardez le même instant sur les deux courbes.", "Exact : le montage inverse le signe de la tension.") },
      { consigne: "Faites varier l'amplitude du GBF (Ue max de 1 V à 5 V) : pour au moins 5 réglages, lisez Ue max (Y1) et Us au même instant (Y2).", court: "Au moins 5 lectures (Ue max, Us).", verifier: ({ faits }) => (I(faits).points || []).length >= 5 || false, aide_geste: "Réajustez les sensibilités si une courbe sort de l'écran." },
      { consigne: "Tableur : Ue max en A, Us (négative) en B, Us/Ue en C. Tracez Us en fonction de Ue et modélisez par une fonction linéaire.", court: "Tableur, puis Us en fonction de Ue.", verifier: feuille_inverseur },
      { consigne: "Que vaut le coefficient Us/Ue ?", court: "Us/Ue ?", question: { type: "nombre", unite: "", attendu: -2.2, tolerance: 0.1, aide: "C'est le coefficient directeur de la droite (il est négatif).", bravo: "Exact : −2,2." } },
      { consigne: "R1 = 10 kΩ et R2 = 22 kΩ. Pour le montage inverseur, Us =…", court: "Répondez dans le carnet.", question: choix(["−(R2/R1)·Ue", "(R2/R1)·Ue", "((R1 + R2)/R1)·Ue"], "Calculez R2/R1.", "Exact.") },
      { consigne: "Augmentez l'amplitude du GBF jusqu'au maximum. Observez Us.", court: "Amplitude du GBF au maximum.", verifier: ({ faits }) => (I(faits).monte && I(faits).us_max > 13.2 && I(faits).ue_max > 7 && bien_regle("inverseur")({ faits })) || false, aide_geste: "Réajustez les sensibilités : les deux courbes doivent rester entières dans l'écran." },
      { consigne: "Les sommets de Us sont aplatis à ±13,5 V (écrêtage) parce que…", court: "Répondez dans le carnet.", question: choix(["l'AO est saturé : |Us| ne peut pas dépasser Vsat", "le GBF est en panne", "la sensibilité de l'oscilloscope est mal réglée"], "Calculez 2,2 × Ue max.", "Exact : la relation Us = −2,2·Ue n'est valable qu'en régime linéaire.") },
    ],
  };

  const NON_INVERSEUR = {
    id: "non_inverseur", paillasse: 3, titre: "Le montage non-inverseur",
    objectif: "Avec le GBF sur e+, R1 = 10 kΩ entre e− et la masse, R2 = 22 kΩ entre e− et s : quelle relation lie Us à Ue ?",
    entetes: [],
    conclusion: "Montage non-inverseur : Us = ((R1 + R2)/R1)·Ue = (1 + R2/R1)·Ue (ici 3,2), en phase avec Ue. Dans une chaîne électronique (capteur → traitement → sortie), un montage à AO est un circuit de traitement : il amplifie le signal du capteur.",
    conclusion_courte: "Non-inverseur : Us = ((R1 + R2)/R1)·Ue.",
    etapes: [
      { consigne: "AO déjà alimenté. SORTIE du GBF → e+ ; R1 entre e− et 0 ; R2 entre e− et s ; masse du GBF → 0. Oscilloscope : Y1 sur la SORTIE du GBF (Ue), Y2 sur s (Us), masse ⏚ sur 0.", court: "Montez le non-inverseur et l'oscilloscope.", verifier: ({ faits }) => (N(faits).monte && N(faits).ue_max > 0.3) || false },
      { consigne: "Réglez la sensibilité de chaque voie : les deux courbes entières dans l'écran.", court: "Réglez Sv de chaque voie.", verifier: bien_regle("non_inverseur") },
      { consigne: "Comparez les deux courbes : Us et Ue sont…", court: "Répondez dans le carnet.", question: choix(["en phase : elles sont maximales au même instant", "en opposition de phase", "de fréquences différentes"], "Regardez le même instant sur les deux courbes.", "Exact.") },
      { consigne: "Lisez Ue max sur la voie 1 (en V).", court: "Ue max (V) ?", question: { type: "nombre", unite: "", attendu: (faits) => N(faits).ue_max, tolerance: 0.15, aide: "Ue max = Sv1 × y.", bravo: "Exact." } },
      { consigne: "Lisez Us max sur la voie 2 (en V).", court: "Us max (V) ?", question: { type: "nombre", unite: "", attendu: (faits) => N(faits).us_max, tolerance: 0.3, aide: "Us max = Sv2 × y.", bravo: "Exact." } },
      { consigne: "Calculez Us max / Ue max.", court: "Us/Ue ?", question: { type: "nombre", unite: "", attendu: 3.2, tolerance: 0.15, aide: "Divisez vos deux lectures.", bravo: "Exact : 3,2." } },
      { consigne: "R1 = 10 kΩ et R2 = 22 kΩ. Pour le montage non-inverseur, Us =…", court: "Répondez dans le carnet.", question: choix(["((R1 + R2)/R1)·Ue = (1 + R2/R1)·Ue", "−(R2/R1)·Ue", "(R2/R1)·Ue"], "Calculez (R1 + R2)/R1.", "Exact.") },
      { consigne: "Sonorisation : microphone → amplificateur à AO → haut-parleur. Dans cette chaîne électronique, l'AO est…", court: "Répondez dans le carnet.", question: choix(["le circuit de traitement : il amplifie la tension du capteur (microphone) pour commander la sortie (haut-parleur)", "le capteur", "la sortie"], "Qui transforme le son en tension ? Qui produit le son ?", "Exact : capteur → traitement → sortie.") },
    ],
  };

  L.demarrer({ id: "tc_elec4_a2_ao", titre: "Laboratoire : l'amplificateur opérationnel", decor: "aucun", paillasses: [L.poste_transfert, L.poste_suiveur, L.poste_inverseur, L.poste_non_inverseur], missions: [transfert, suiveur, INVERSEUR, NON_INVERSEUR] });
})(window.Labo);
