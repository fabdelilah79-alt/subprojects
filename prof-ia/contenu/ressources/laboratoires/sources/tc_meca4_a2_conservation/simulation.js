/*
Rôle : simulation de l'activité 2 du chapitre « Quantité de mouvement » (tronc commun) : « Expériences de conservation
       (solide pseudo-isolé) puis généralisation ». Objectif O3 (loi de conservation de la quantité de mouvement) ;
       orientation : « explosion » de deux mobiles sur table à coussin d'air.
Reçoit : rien (les vérifications lisent la surcharge et l'enregistrement des deux mobiles).
Produit : la simulation démarrée : table à coussin d'air, mobiles A et B reliés par un ressort et un fil, surcharge, règle.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const M = 0.2, S = 0.2, E_J = 0.0135;
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const e_ = (f) => { const e = L.VERIF_ENR.dernier(f); return e && e.points[0].a ? e : null; };
  const vitesse = (f, cote) => L.VERIF_ENR.distance(e_(f).points[0][cote], e_(f).points[10][cote]) / 1000 / (10 * e_(f).tau_s);
  const nombre = (court, cote, aide) => ({ consigne: `Prenez la feuille. Mesurez ${cote}0${cote}10 à la règle et calculez la vitesse v${cote} du mobile ${cote} (en m/s).`, court, question: { type: "nombre", unite: "m/s", attendu: (f) => vitesse(f, cote.toLowerCase()), tolerance_relative: 0.06, aide, bravo: "Exact." } });

  function explosion(ma, mb) {
    // Enregistrement après le fil coupé, avec les masses voulues, d'au moins 12 étincelles.
    return ({ faits }) => {
      const e = e_(faits);
      if (!e) return false;
      if (Math.abs(e.masse_kg.a - ma) > 1e-6 || Math.abs(e.masse_kg.b - mb) > 1e-6) return ma > mb ? "Posez la surcharge sur le mobile A avant de couper le fil." : "Retirez la surcharge avant de couper le fil.";
      return e.points.length >= 12 || "L'enregistrement est trop court : appuyez sur « Enregistrer » avant de couper le fil.";
    };
  }

  const EXPLOSION = {
    id: "explosion", paillasse: 0, titre: "L'explosion de deux mobiles",
    objectif: `A et B (${M * 1000} g chacun) sont serrés contre un ressort comprimé, retenus par un fil. Avec la surcharge de ${S * 1000} g sur A, on coupe le fil. Que deviennent les quantités de mouvement ?`,
    entetes: [],
    conclusion: "Avant : le système {A, B} est immobile, sa quantité de mouvement est nulle. Après : mA·vA = mB·vB et les vecteurs sont opposés, pA + pB = 0. La quantité de mouvement du système pseudo-isolé se conserve.",
    conclusion_courte: "pA + pB = 0 : p se conserve.",
    etapes: [
      { consigne: "Posez la surcharge de laiton sur le mobile A.", court: "Surcharge sur le mobile A.", verifier: ({ faits }) => faits.surcharge_sur === "A" },
      { consigne: "Appuyez sur « Enregistrer », puis touchez le fil pour le couper.", court: "Enregistrez, coupez le fil.", verifier: explosion(M + S, M) },
      nombre("vA (m/s) ?", "A", "vA = A0A10 / (10τ), avec A0A10 en mètre."),
      nombre("vB (m/s) ?", "B", "vB = B0B10 / (10τ)."),
      { consigne: `Calculez pA = mA·vA (mA = ${(M + S) * 1000} g) et pB = mB·vB (mB = ${M * 1000} g). Les vecteurs pA et pB…`, court: "Répondez dans le carnet.", question: choix(["ont la même valeur et des sens opposés : pA + pB = 0", "sont égaux (même sens)", "n'ont aucun rapport"], "Le mobile le plus lourd part moins vite.", "Exact.") },
      { consigne: "La quantité de mouvement du système {A, B} était nulle avant de couper le fil. Après, elle est…", court: "Répondez dans le carnet.", question: choix(["toujours nulle : elle se conserve", "égale à pA", "plus grande"], "Additionnez les deux vecteurs.", "Exact : le système est pseudo-isolé, sa quantité de mouvement se conserve.") },
    ],
  };

  const GENERALISATION = {
    id: "generalisation", paillasse: 0, titre: "Avec deux masses égales",
    objectif: "Recommencer sans la surcharge : les deux mobiles ont la même masse.",
    entetes: [],
    conclusion: "Loi de conservation : la quantité de mouvement d'un système isolé ou pseudo-isolé se conserve.",
    conclusion_courte: "Système pseudo-isolé : p se conserve.",
    etapes: [
      { consigne: "Touchez les mobiles pour les remettre contre le ressort, retirez la surcharge, appuyez sur « Enregistrer », puis coupez le fil.", court: "Sans surcharge : enregistrez, coupez le fil.", verifier: explosion(M, M) },
      { consigne: "Prenez la feuille. Les vitesses vA et vB sont maintenant…", court: "Répondez dans le carnet.", question: choix(["égales : mA = mB, donc vA = vB", "toujours différentes", "nulles"], "Comparez A0A10 et B0B10.", "Exact.") },
      { consigne: "Pour tout système isolé ou pseudo-isolé, la quantité de mouvement totale…", court: "Répondez dans le carnet.", question: choix(["se conserve", "augmente", "diminue jusqu'à zéro"], "C'est ce que montrent vos deux expériences.", "Exact : c'est la loi de conservation de la quantité de mouvement.") },
      { consigne: "Deux patineurs immobiles, de 60 kg et 40 kg, se repoussent. Le premier part à 2 m/s. À quelle vitesse part le second (en m/s) ?", court: "Vitesse du second patineur (m/s) ?", question: { type: "nombre", unite: "m/s", attendu: 3, tolerance: 0.05, aide: "60 × 2 = 40 × v.", bravo: "Exact : 3 m/s, en sens opposé." } },
    ],
  };

  L.demarrer({
    id: "tc_meca4_a2_conservation", titre: "Laboratoire : conservation de la quantité de mouvement",
    paillasses: [(g) => {
      const poste = L.poste_coussin_air(g, { nom: "explosion", outils: ["regle"] }), sous = L.svg("g", {}, g);
      g.insertBefore(sous, g.querySelector(".calque-dessus"));
      L.explosion(poste.table, sous, { masse_kg: M, surcharge_kg: S, energie_j: E_J });
      return poste;
    }],
    missions: [EXPLOSION, GENERALISATION],
  });
})(window.Labo);
