/*
Rôle : simulation de l'activité 3 du chapitre « Obtention de l'image d'un objet » (1re année du bac) : relation de
       conjugaison (1/OA' − 1/OA = 1/f') et grandissement (γ = A'B'/AB = OA'/OA) établis au banc d'optique ; la loupe
       (image virtuelle, droite, agrandie ; objet entre F et O). Objectifs O5, O6.
Reçoit : rien (les vérifications lisent les faits « conjugaison », « loupe » et la feuille du tableur).
Produit : la simulation démarrée.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const es = (f) => (f.conjugaison || {}).essais || [], lo = (f) => f.loupe || { vus: [] };
  const proche = (a, b, t) => Math.abs(a - b) <= t, rel = (a, b) => Math.abs(a - b) <= 0.02 * Math.abs(b) + 1e-4;
  const essai = (f, x) => es(f).find((m) => proche(m.OA, x.A, 0.15) && proche(m.OAp, x.B, 0.15));

  function tableau_conj({ faits, feuille }) {
    // Quatre images nettes : OA, OA' (cm, algébriques), 1/OA, 1/OA'.
    const l = feuille.lignes(["A", "B", "C", "D"]);
    if (l.length < 4) return false;
    for (const [k, x] of l.entries()) {
      if (!essai(faits, x)) return `Ligne ${k + 2} : OA (négatif : l'objet est avant la lentille) et OA' d'une image nette, en cm.`;
      if (!rel(x.C, 1 / x.A) || !rel(x.D, 1 / x.B)) return `Ligne ${k + 2} : C = 1/OA et D = 1/OA', par exemple =1/A${k + 2} et =1/B${k + 2}.`;
    }
    return new Set(l.map((x) => x.A)).size >= 4 || "Quatre positions différentes de la lentille.";
  }

  function tableau_grand({ faits, feuille }) {
    // Trois images nettes : OA, OA', A'B' lu sur la vue rapprochée (cm, négatif si renversée), OA'/OA.
    const l = feuille.lignes(["A", "B", "C", "D"]);
    if (l.length < 3) return false;
    for (const [k, x] of l.entries()) {
      const m = essai(faits, x);
      if (!m) return `Ligne ${k + 2} : OA et OA' (cm) d'une image nette.`;
      if (!proche(x.C, m.ApBp, 0.3)) return `Ligne ${k + 2} : A'B' (cm), lu sur la vue rapprochée ; négatif quand l'image est renversée.`;
      if (!rel(x.D, x.B / x.A)) return `Ligne ${k + 2} : D = OA'/OA, par exemple =B${k + 2}/A${k + 2}.`;
    }
    return new Set(l.map((x) => x.A)).size >= 3 || "Trois positions différentes de la lentille.";
  }

  const CONJ = {
    id: "conj", paillasse: 0, titre: "Relation de conjugaison",
    objectif: "Mesurer OA et OA' pour plusieurs images nettes ; chercher une relation entre 1/OA et 1/OA'.",
    entetes: ["OA (cm)", "OA' (cm)", "1/OA (cm⁻¹)", "1/OA' (cm⁻¹)"],
    donnees: ["Objet « F » à 10 cm sur le rail ; O : centre de la lentille (index de son cavalier)", "Axe orienté dans le sens de la lumière : OA < 0, OA' > 0"],
    conclusion: "Pour une lentille mince, les positions de l'objet et de son image sont liées par la relation de conjugaison : 1/OA' − 1/OA = 1/f' = C (distances algébriques, axe orienté dans le sens de la lumière). Elle permet de calculer la position de l'image.",
    conclusion_courte: "1/OA' − 1/OA = 1/f'.",
    etapes: [
      { consigne: "Obtenez quatre images nettes pour quatre positions de la lentille. En A : OA ; en B : OA' ; en C : 1/OA ; en D : 1/OA'.", court: "Tableur : A, B, C, D.", aide_geste: "Placez la lentille, puis faites glisser l'écran jusqu'à ce que le « F » soit net.", verifier: tableau_conj },
      { consigne: "Calculez D − C pour une ligne :", court: "D − C (cm⁻¹) ?", question: { type: "nombre", unite: "cm⁻¹", attendu: 0.1, tolerance: 0.01, aide: "Faites D − C ligne par ligne : la valeur ne change presque pas.", bravo: "Exact : 0,1 cm⁻¹ pour toutes les lignes." } },
      { consigne: "D − C a la même valeur pour toutes les images ; cette valeur est…", court: "Répondez dans le carnet.", question: choix(["1/f' : 1/OA' − 1/OA = 1/f'", "f'", "OA' − OA"], "f' = 10 cm : calculez 1/f'.", "Exact : c'est la relation de conjugaison.") },
      { consigne: "Déduisez-en la distance focale f' = 1 / (D − C) :", court: "f' (cm) ?", question: { type: "nombre", unite: "cm", attendu: 10, tolerance: 0.5, aide: "1 / 0,1 = …", bravo: "Exact : f' = 10 cm, comme l'indique l'étiquette." } },
    ],
  };

  const GRAND = {
    id: "grand", paillasse: 0, titre: "Grandissement",
    objectif: "Mesurer la taille de l'image sur l'écran et la comparer à OA'/OA.",
    entetes: ["OA (cm)", "OA' (cm)", "A'B' (cm)", "OA'/OA"],
    donnees: ["AB = 2,0 cm ; A'B' : lisez la vue rapprochée (1 carreau = 1 cm) ; négatif si l'image est renversée"],
    conclusion: "Le grandissement γ = A'B'/AB = OA'/OA compare l'image à l'objet : |γ| > 1, l'image est plus grande ; |γ| < 1, plus petite ; γ < 0, l'image est renversée (image réelle) ; γ > 0, elle est droite (image virtuelle).",
    conclusion_courte: "γ = A'B'/AB = OA'/OA.",
    etapes: [
      { consigne: "Pour trois images nettes : en A, OA ; en B, OA' ; en C, A'B' (vue rapprochée) ; en D, OA'/OA.", court: "Tableur : A, B, C, D.", verifier: tableau_grand },
      { consigne: "Comparez A'B'/AB (C divisé par 2) et OA'/OA (D) :", court: "Répondez dans le carnet.", question: choix(["ils sont égaux : γ = A'B'/AB = OA'/OA", "A'B'/AB = OA/OA'", "il n'y a pas de lien"], "Divisez C par 2, ligne par ligne.", "Exact : c'est la relation de grandissement.") },
      { consigne: "Ici γ est négatif, parce que…", court: "Répondez dans le carnet.", question: choix(["l'image réelle est renversée", "l'image est plus petite", "l'image est virtuelle"], "Comparez le « F » de la lanterne et celui de l'écran.", "Exact.") },
    ],
  };

  const LOUPE = {
    id: "loupe", paillasse: 1, titre: "La loupe",
    objectif: "Chercher où placer la loupe pour voir la coccinelle agrandie et nette ; construire l'image.",
    entetes: [],
    donnees: ["Loupe : f' = 5 cm ; règle graduée en cm (0 sous la carte)"],
    conclusion: "Une loupe est une lentille convergente de petite distance focale. L'objet est placé entre le foyer objet F et la lentille : l'image est virtuelle, droite et agrandie ; l'œil la voit à travers la loupe. Elle est vue la plus grande et sans fatigue quand l'objet est près du foyer : l'image est alors très loin.",
    conclusion_courte: "Loupe : objet entre F et O, image virtuelle droite agrandie.",
    etapes: [
      { consigne: "Approchez la loupe de la carte jusqu'à voir la coccinelle nette et grossie (plus de 2 fois).", court: "Coccinelle grossie.", aide_geste: "Faites glisser la loupe par son pied.", verifier: ({ faits }) => lo(faits).vus.some((v) => v.virtuelle && v.flou < 0.8 && v.G > 2) },
      { consigne: "L'image vue à travers la loupe est…", court: "Répondez dans le carnet.", question: choix(["droite, agrandie et virtuelle", "renversée et réelle", "plus petite que l'objet"], "Regardez la vue « ce que voit l'œil ».", "Exact.") },
      { consigne: "Éloignez la loupe à plus de 6 cm de la carte.", court: "Loupe éloignée.", verifier: ({ faits }) => lo(faits).vus.some((v) => !v.virtuelle) },
      { consigne: "Touchez « Rayons » avec la loupe à moins de 5 cm de la carte.", court: "Rayons (d < f').", verifier: ({ faits }) => !!lo(faits).rayons_virtuelle },
      { consigne: "Pour servir de loupe, la lentille doit être placée de façon que l'objet soit…", court: "Répondez dans le carnet.", question: choix(["entre le foyer objet F et la lentille", "avant le foyer objet F", "au foyer image F'"], "Où est F par rapport à la carte quand l'image est grossie ?", "Exact : les prolongements des rayons se croisent en B'.") },
      { consigne: "Vergence de cette loupe (f' = 5 cm) ?", court: "C (δ) ?", question: { type: "nombre", unite: "δ", attendu: 20, tolerance: 0.5, aide: "C = 1 / f', avec f' en mètres.", bravo: "Exact : 20 δ (le fabricant écrit « × 5 » : C / 4)." } },
    ],
  };

  L.demarrer({ id: "b1_opt2_a3_conjugaison", titre: "Laboratoire : conjugaison et loupe", decor: "aucun", paillasses: [L.poste_conjugaison, L.poste_observation_loupe], missions: [CONJ, GRAND, LOUPE] });
})(window.Labo);
