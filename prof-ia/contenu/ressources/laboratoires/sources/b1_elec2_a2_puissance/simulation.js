/*
Rôle : simulation de l'activité 2 du chapitre « Transfert d'énergie dans un circuit électrique » (1re année du bac) :
       mesures de U, I et Δt pendant la montée d'une masse par un moteur ; énergie électrique reçue W = U·I·Δt,
       puissance P = U·I (vitesse de transfert), travail utile, chaleur, rendement pour trois tensions. Objectifs O2, O4, O5.
Reçoit : rien (les vérifications lisent le fait « moteur » et la feuille du tableur).
Produit : la simulation démarrée : énergie et puissance reçues ; rendement du moteur.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const WU = 0.2 * 9.81 * 0.4, essais = (f) => (f.moteur || {}).essais || [], dernier = (f) => essais(f).slice(-1)[0] || { U: 0, I: 0, dt: 0 };
  const W = (e) => e.U * e.I * e.dt;

  function mesure({ faits }) {
    // Au moins une montée mesurée avec les appareils bien branchés.
    if (essais(faits).length) return true;
    return (faits.moteur || {}).mal_branche ? "La masse est montée, mais les appareils ne mesuraient pas U et I du moteur : ampèremètre en série (mA et COM), voltmètre aux bornes du moteur (V et COM)." : false;
  }

  function tableau({ faits, feuille }) {
    // Trois montées à des tensions différentes : U, I, Δt recopiés, puis η = m·g·Δh / (U·I·Δt).
    const l = feuille.lignes(["A", "B", "C"]);
    if (l.length < 3) return false;
    for (const [k, r] of l.entries()) {
      const ok = essais(faits).some((e) => Math.abs(e.U - r.A) < 0.015 && Math.abs(e.I - r.B) < 2e-4 && Math.abs(e.dt - r.C) < 0.015);
      if (!ok) return `Ligne ${k + 2} : U (V), I (A) et Δt (s) d'une même montée mesurée.`;
    }
    const U = l.map((r) => r.A);
    return Math.max(...U) - Math.min(...U) > 1.5 || "Trois tensions bien différentes : environ 4 V, 5 V et 6 V.";
  }

  function rendements({ feuille }) {
    // Colonne D : rendement de chaque montée.
    const l = feuille.lignes(["A", "B", "C", "D"]);
    if (l.length < 3) return false;
    for (const [k, r] of l.entries()) if (Math.abs(r.D - WU / (r.A * r.B * r.C)) > 0.02 * r.D) return `Ligne ${k + 2} : η = 0,785 / (U × I × Δt), par exemple =0,785/(A${k + 2}*B${k + 2}*C${k + 2}).`;
    return true;
  }

  const ENERGIE = {
    id: "energie", paillasse: 0, titre: "Énergie et puissance reçues",
    objectif: "Mesurer U, I et la durée Δt d'une montée ; calculer W = U·I·Δt, P = U·I, le travail utile et la chaleur.",
    entetes: [],
    donnees: ["Masse : m = 200 g ; montée chronométrée : Δh = 40 cm", "g = 9,81 N/kg"],
    conclusion: "Un récepteur soumis à la tension U et traversé par le courant I pendant Δt reçoit l'énergie électrique W = U·I·Δt ; la puissance électrique reçue P = U·I = W/Δt est la vitesse du transfert d'énergie (1 W = 1 J/s). Le moteur fournit un travail utile et cède de la chaleur : W = W_u + Q.",
    conclusion_courte: "W = U·I·Δt ; P = U·I ; W = W_u + Q.",
    etapes: [
      { consigne: "Montez en série le générateur (6 V), l'interrupteur, l'ampèremètre (bornes mA et COM, calibre 200 mA) et le moteur ; branchez le voltmètre (calibre 20 V) aux bornes du moteur. Fermez l'interrupteur et laissez la masse monter.", court: "Circuit et première montée.", aide_geste: "Tirez un fil d'une borne à une autre ; tournez le commutateur des multimètres ; fermez l'interrupteur d'un toucher.", verifier: mesure },
      { consigne: "Énergie électrique reçue par le moteur pendant la montée chronométrée : W = U·I·Δt.", court: "W (J) ?", question: { type: "nombre", unite: "J", attendu: (f) => W(dernier(f)), tolerance_relative: 0.03, aide: "U en V, I en A (1 mA = 0,001 A), Δt en s.", bravo: "Exact." } },
      { consigne: "Puissance électrique reçue par le moteur : P = U·I.", court: "P (W) ?", question: { type: "nombre", unite: "W", attendu: (f) => dernier(f).U * dernier(f).I, tolerance_relative: 0.03, aide: "P = U × I, I en ampères.", bravo: "Exact : P = W/Δt aussi." } },
      { consigne: "La puissance électrique P = W/Δt représente…", court: "Répondez dans le carnet.", question: choix(["la vitesse à laquelle le moteur reçoit l'énergie (en J/s, c'est-à-dire en watts)", "la quantité totale d'énergie reçue", "la force exercée par le moteur"], "P s'exprime en joules par seconde.", "Exact : la puissance est une vitesse de transfert d'énergie.") },
      { consigne: "Travail utile fourni à la masse (énergie potentielle gagnée) : W_u = m·g·Δh.", court: "W_u (J) ?", question: { type: "nombre", unite: "J", attendu: WU, tolerance_relative: 0.02, aide: "m = 0,200 kg, Δh = 0,40 m.", bravo: "Exact : W_u ≈ 0,785 J." } },
      { consigne: "Chaleur cédée par le moteur pendant la montée : Q = W − W_u.", court: "Q (J) ?", question: { type: "nombre", unite: "J", attendu: (f) => W(dernier(f)) - WU, tolerance_relative: 0.06, aide: "Énergie reçue moins travail utile.", bravo: "Exact : le bobinage chauffe (effet Joule) et il y a des frottements." } },
      { consigne: "L'énergie électrique reçue par le moteur…", court: "Répondez dans le carnet.", question: choix(["est égale à W_u + Q : elle se conserve, elle change seulement de forme", "est plus petite que W_u", "disparaît en partie"], "Comme en mécanique, l'énergie se conserve.", "Exact.") },
    ],
  };

  const RENDEMENT = {
    id: "rendement", paillasse: 0, titre: "Rendement du moteur",
    objectif: "Comparer le rendement du moteur pour trois tensions.",
    entetes: ["U (V)", "I (A)", "Δt (s)", "η"],
    donnees: ["Travail utile : W_u = m·g·Δh = 0,785 J", "Rendement : η = W_u / W = W_u / (U·I·Δt)"],
    conclusion: "Le rendement d'un récepteur est le rapport de l'énergie utile à l'énergie électrique reçue : η = W_u / W (toujours inférieur à 1). Ici, il augmente avec la tension : la montée est plus rapide et la chaleur cédée (effet Joule dans le bobinage) est plus petite.",
    conclusion_courte: "η = W_u / W < 1.",
    etapes: [
      { consigne: "Faites monter la masse avec le générateur réglé à 4 V, 5 V puis 6 V (touche « ↓ » pour la redescendre). Recopiez U, I et Δt de chaque montée dans les colonnes A, B et C.", court: "Trois montées : A, B, C.", aide_geste: "Touches « +1 / −1 » du générateur ; « ↓ » sur le socle du moteur.", verifier: tableau },
      { consigne: "En D, calculez le rendement η = 0,785 / (U·I·Δt) de chaque montée.", court: "Colonne D : η.", verifier: rendements },
      { consigne: "Quand la tension augmente, le rendement du moteur…", court: "Répondez dans le carnet.", question: choix(["augmente : la montée est plus rapide, la chaleur cédée est plus petite", "diminue", "ne change pas"], "Comparez les valeurs de la colonne D.", "Exact.") },
      { consigne: "Pour le même travail utile, la montée est plus rapide à 6 V parce que…", court: "Répondez dans le carnet.", question: choix(["la puissance reçue P = U·I est plus grande : l'énergie est transférée plus vite", "l'énergie reçue W est plus grande", "le courant est beaucoup plus fort"], "Comparez U·I pour les trois montées : I change peu.", "Exact.") },
    ],
  };

  L.demarrer({ id: "b1_elec2_a2_puissance", titre: "Laboratoire : puissance électrique", decor: "aucun", paillasses: [L.poste_puissance], missions: [ENERGIE, RENDEMENT] });
})(window.Labo);
