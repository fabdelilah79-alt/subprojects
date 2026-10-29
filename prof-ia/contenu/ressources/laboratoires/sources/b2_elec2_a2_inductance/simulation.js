/*
Rôle : simulation de l'activité 2 du chapitre « Dipôle RL » (2e année du bac) : inductance d'une bobine mise en évidence
       avec une tension triangulaire : uR = R·i est triangulaire, la tension aux bornes de la bobine est en créneaux ;
       uL = L·di/dt, mesure de L (sans noyau, puis avec le noyau de fer doux), équation aux dimensions. Objectifs O1, O2.
Reçoit : rien (les vérifications lisent les faits « montage_l » et « acquisition »).
Produit : la simulation démarrée.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const nombre = (unite, attendu, tolerance, aide, bravo) => ({ type: "nombre", unite, attendu, tolerance, aide, bravo });
  const relatif = (unite, attendu, aide, bravo) => ({ type: "nombre", unite, attendu, tolerance_relative: 0.12, aide, bravo });
  const A = (f) => f.acquisition || {}, D = (f) => A(f).derniere || {};
  const pente = (d) => (4 * d.f * d.R * d.Umax) / (d.R + 60);
  const ref = (f) => (D(f).f ? D(f) : { f: 500, R: 470, Umax: 4, L: 0.05 });

  const TRIANGLE = {
    id: "triangle", paillasse: 0, titre: "Bobine et tension triangulaire",
    objectif: "Alimenter une bobine et une résistance par une tension triangulaire ; enregistrer uR et la tension de la bobine ; mesurer L.",
    entetes: [],
    donnees: ["uR = R·i : uR est l'image de l'intensité", "Bobine en convention récepteur : u = r·i + L·di/dt (r = 10 Ω)", "di/dt = (1/R)·duR/dt"],
    conclusion: "Avec une tension triangulaire, i (donc uR) varie à vitesse constante sur chaque montée et chaque descente ; la tension aux bornes de la bobine est alors constante (créneaux) : elle est proportionnelle à di/dt. En convention récepteur, u = r·i + L·di/dt ; quand i = 0, u = L·di/dt. On en déduit L = u / (di/dt) = 50 mH. Le henry (H) vaut 1 V·s/A. Avec le noyau de fer doux, L est environ dix fois plus grande : 0,5 H.",
    conclusion_courte: "u = r·i + L·di/dt ; L = 50 mH, 0,5 H avec le noyau.",
    etapes: [
      { consigne: "Câblez : GBF (sortie) vers la borne 1 de la bobine, borne 2 vers R, l'autre borne de R vers la masse du GBF ; GND de l'interface sur la borne 2 de la bobine, EA0 sur la borne 1, EA1 à l'autre borne de R.", court: "Câblez le montage.", verifier: ({ faits }) => ((faits.montage_l || {}).serie && faits.montage_l.mesure) || false },
      { consigne: "GBF : triangle, 500 Hz ; R = 470 Ω ; bobine sans noyau. Touchez « Voie 2 » jusqu'à « −EA1 » (uR), puis « Lancer » (durée 20 ms).", court: "Enregistrez uL et uR.", verifier: ({ faits }) => (A(faits).voie2 === "−EA1" && D(faits).forme === "triangle" && D(faits).f === 500 && D(faits).R === 470 && !D(faits).noyau) || false },
      { consigne: "La tension uR (image de i) est triangulaire. Celle de la bobine…", court: "Répondez dans le carnet.", question: choix(["est en créneaux : elle est constante quand i varie à vitesse constante", "est aussi triangulaire", "est nulle"], "Comparez les deux courbes.", "Exact : elle est liée à di/dt.") },
      { consigne: "Avec le curseur, mesurez la pente de uR sur une montée : ΔuR/Δt (V/s) ?", court: "Pente de uR (V/s) ?", question: relatif("V/s", (f) => pente(ref(f)), "Deux lectures du curseur sur la même montée.", "Exact.") },
      { consigne: "Tension de la bobine au milieu de cette montée, quand uR = 0 (V) ?", court: "uL (V) ?", question: relatif("V", (f) => (ref(f).L * pente(ref(f))) / ref(f).R, "Lisez EA0 au curseur.", "Exact.") },
      { consigne: "Inductance L = uL / (di/dt), avec di/dt = (1/R)·ΔuR/Δt (H) ?", court: "L (H) ?", question: nombre("H", 0.05, 0.006, "di/dt = pente / R.", "Exact : L = 50 mH.") },
      { consigne: "L'équation aux dimensions de u = L·di/dt montre que le henry vaut…", court: "Répondez dans le carnet.", question: choix(["1 H = 1 V·s/A", "1 H = 1 V/A", "1 H = 1 A·s/V"], "L = u / (di/dt).", "Exact.") },
      { consigne: "Enfoncez le noyau de fer doux (touchez la bobine) et refaites un enregistrement (baissez la fréquence à 50 Hz pour que uR reste triangulaire ; durée 50 ms).", court: "Enregistrement avec le noyau.", verifier: ({ faits }) => (D(faits).noyau && D(faits).forme === "triangle") || false },
      { consigne: "Inductance de la bobine avec son noyau (H) ?", court: "L avec noyau (H) ?", question: nombre("H", 0.5, 0.06, "Même méthode.", "Exact : environ dix fois plus grande.") },
      { consigne: "Le noyau de fer doux…", court: "Répondez dans le carnet.", question: choix(["augmente l'inductance de la bobine ; la relation u = r·i + L·di/dt reste valable", "diminue l'inductance", "ne change rien"], "Comparez les deux valeurs de L.", "Exact.") },
    ],
  };

  L.demarrer({ id: "b2_elec2_a2_inductance", titre: "Laboratoire : inductance d'une bobine", decor: "aucun", paillasses: [L.poste_inductance], missions: [TRIANGLE] });
})(window.Labo);
