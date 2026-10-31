/*
Rôle : simulation de l'activité 1 du chapitre « Montages électroniques » (tronc commun) : comportement d'un transistor
       NPN, montages à transistor. Objectifs O1 (comportement, régimes, fonction), O2 (I_E = I_B + I_C, I_C = β·I_B),
       O3 (capteur, traitement, sortie d'un détecteur d'obscurité) et O6 (chaîne électronique).
Reçoit : rien (les vérifications lisent l'état du transistor, les mesures, la feuille et la courbe du tableur).
Produit : la simulation démarrée : effet transistor ; mesures des courants ; détecteur d'obscurité.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const E = (faits) => faits.effet || {}, P = (faits) => faits.courants_transistor || [], D = (faits) => faits.detecteur || {};
  const vu = (regime) => ({ faits }) => (E(faits).monte && (E(faits).vus || []).includes(regime)) || false;

  function tableau({ feuille, faits, courbe }) {
    // Lignes : I_B, I_C, I_E mesurés (mA) ; D = I_B + I_C ; graphique I_C en fonction de I_B.
    const lignes = feuille.lignes(["A", "B", "C", "D"]), pts = P(faits);
    for (const [k, l] of lignes.entries()) {
      if (!pts.some((p) => Math.abs(p.IB - l.A) < 0.0015 && Math.abs(p.IC - l.B) < 0.06 && Math.abs(p.IE - l.C) < 0.06)) return `Ligne ${k + 2} : ces valeurs (mA) ne correspondent à aucune mesure.`;
      if (Math.abs(l.D - (l.A + l.B)) > 0.002) return `D${k + 2} : calculez I_B + I_C (par exemple =A${k + 2}+B${k + 2}).`;
    }
    if (lignes.length < 5) return false;
    return (courbe.x === "A" && courbe.y === "B" && courbe.n >= 5 && courbe.modele !== "aucun") || "Tracez I_C (B) en fonction de I_B (A) et modélisez.";
  }

  const EFFET = {
    id: "effet", paillasse: 0, titre: "L'effet transistor",
    objectif: "Un faible courant dans la base peut-il commander l'allumage d'une lampe placée dans le circuit du collecteur ?",
    entetes: [],
    conclusion: "Un faible courant de base I_B commande un courant de collecteur I_C beaucoup plus intense : c'est l'effet transistor. Le transistor est bloqué si I_B = 0 (interrupteur ouvert), il fonctionne en régime linéaire (I_C = β·I_B), puis il se sature (U_CE ≈ 0 : interrupteur fermé).",
    conclusion_courte: "Bloqué, linéaire, saturé.",
    etapes: [
      { consigne: "Circuit de base : G1 (+) → R_B → base B. Circuit du collecteur : G2 (+) → lampe → collecteur C. Reliez l'émetteur E aux bornes − de G1 et de G2. G1 est réglé à 0 V.", court: "Montez les circuits de base et de collecteur.", verifier: vu("bloqué"), aide_geste: "Deux fiches peuvent s'empiler sur la borne E." },
      { consigne: "Augmentez lentement la tension de G1 (touches fines) : la lampe commence à briller.", court: "Augmentez G1 : la lampe s'allume.", verifier: ({ faits }) => (vu("linéaire")({ faits }) && E(faits).eclat > 0.05 && E(faits).eclat < 0.8) || false, aide_geste: "Rien ne se passe sous 0,6 V environ." },
      { consigne: "Continuez à augmenter G1 jusqu'à ce que la lampe brille normalement, puis encore un peu.", court: "Continuez : la lampe brille normalement.", verifier: vu("saturé") },
      { consigne: "Le courant de base, qui traverse une résistance de 10 kΩ, est très faible. Pourtant…", court: "Répondez dans le carnet.", question: choix(["il commande un courant de collecteur bien plus intense : c'est l'effet transistor", "la lampe est alimentée par G1", "le transistor fabrique du courant"], "Quel générateur alimente la lampe ?", "Exact.") },
      { consigne: "Lampe éteinte avec I_B = 0, lampe qui brille normalement même si l'on augmente encore I_B : le transistor est passé du régime…", court: "Répondez dans le carnet.", question: choix(["bloqué (interrupteur ouvert) au régime saturé (interrupteur fermé), en passant par le régime linéaire", "saturé au régime bloqué", "linéaire au régime bloqué"], "Dans quel régime I_C ne dépend-il plus de I_B ?", "Exact.") },
    ],
  };

  const MESURES = {
    id: "mesures", paillasse: 1, titre: "Les courants du transistor",
    objectif: "Mesurer I_B, I_C et I_E pour plusieurs valeurs de I_B, en régime linéaire.",
    entetes: ["IB (mA)", "IC (mA)", "IE (mA)", "IB + IC (mA)"],
    conclusion: "En régime linéaire, I_C = β·I_B (β, coefficient d'amplification en courant, vaut ici environ 150) et, comme pour un nœud, I_E = I_B + I_C.",
    conclusion_courte: "I_C = β·I_B ; I_E = I_B + I_C.",
    etapes: [
      { consigne: "Montez le circuit : G1 → ampèremètre A B (calibre 2 mA) → R_B → base ; G2 → R_C → ampèremètre A C (200 mA) → collecteur ; émetteur → ampèremètre A E (200 mA) → bornes − de G1 et G2.", court: "Montage avec les trois ampèremètres.", verifier: ({ faits }) => P(faits).length >= 1 || false, aide_geste: "Réglez G1 sur quelques volts pour obtenir une mesure." },
      { consigne: "Faites varier la tension de G1 de 2 à 10 V : relevez au moins 5 mesures (I_B, I_C, I_E).", court: "Au moins 5 mesures.", verifier: ({ faits }) => P(faits).length >= 5 || false },
      { consigne: "Tableur : I_B en A, I_C en B, I_E en C (en mA), et I_B + I_C en D. Tracez I_C en fonction de I_B et modélisez par une fonction linéaire.", court: "Tableur, puis IC en fonction de IB.", verifier: tableau },
      { consigne: "Que vaut le coefficient d'amplification β = I_C / I_B ?", court: "β ?", question: { type: "nombre", unite: "", attendu: 150, tolerance_relative: 0.06, aide: "C'est le coefficient directeur de la droite.", bravo: "Exact : β ≈ 150." } },
      { consigne: "Comparez les colonnes C et D. Pour le transistor…", court: "Répondez dans le carnet.", question: choix(["I_E = I_B + I_C : le courant qui sort par l'émetteur est la somme des deux courants qui entrent", "I_E = I_C − I_B", "I_E = β·I_B"], "Le transistor se comporte comme un nœud.", "Exact.") },
    ],
  };

  const DETECTEUR = {
    id: "detecteur", paillasse: 2, titre: "Un détecteur d'obscurité",
    objectif: "Ce montage, câblé par le professeur, allume une DEL quand il fait sombre. Comment fonctionne-t-il ?",
    entetes: [],
    conclusion: "Un montage électronique est une chaîne : un capteur (photorésistance) transforme une grandeur physique en grandeur électrique, un circuit de traitement (le transistor et R1) l'exploite, et une sortie (la DEL) agit.",
    conclusion_courte: "Chaîne : capteur → traitement → sortie.",
    etapes: [
      { consigne: "Branchez le générateur 6 V au montage : borne + sur la borne libre de R1, borne − sur l'émetteur E du transistor.", court: "Alimentez le montage.", verifier: ({ faits }) => D(faits).alimente || false },
      { consigne: "Posez le cache sur la photorésistance.", court: "Cache sur la photorésistance.", verifier: ({ faits }) => (D(faits).alimente && D(faits).cache && D(faits).del) || false },
      { consigne: "Retirez le cache et éclairez la photorésistance de près avec la lampe de poche.", court: "Éclairez la photorésistance.", verifier: ({ faits }) => (D(faits).alimente && D(faits).lampe && !D(faits).del) || false },
      { consigne: "Dans ce montage, le capteur, le traitement et la sortie sont…", court: "Répondez dans le carnet.", question: choix(["la photorésistance, le transistor (avec R1), la DEL", "la DEL, la photorésistance, le transistor", "le générateur, la DEL, le transistor"], "Qui détecte la lumière ? Qui signale l'obscurité ?", "Exact.") },
      { consigne: "Dans l'obscurité, la résistance de la photorésistance augmente, la tension de la base augmente et le transistor…", court: "Répondez dans le carnet.", question: choix(["devient conducteur : il se comporte comme un interrupteur fermé et la DEL s'allume", "se bloque et la DEL s'éteint", "fabrique de la lumière"], "Que fait la DEL dans l'obscurité ?", "Exact : le transistor est un interrupteur commandé.") },
      { consigne: "Pour faire un indicateur de température, on remplacerait la photorésistance par…", court: "Répondez dans le carnet.", question: choix(["une thermistance (CTN)", "une diode Zener", "une lampe"], "Quel capteur est sensible à la température ?", "Exact : seul le capteur change dans la chaîne.") },
    ],
  };

  L.demarrer({ id: "tc_elec4_a1_transistor", titre: "Laboratoire : le transistor NPN", decor: "aucun", paillasses: [L.poste_effet, L.poste_mesures_transistor, L.poste_detecteur], missions: [EFFET, MESURES, DETECTEUR] });
})(window.Labo);
