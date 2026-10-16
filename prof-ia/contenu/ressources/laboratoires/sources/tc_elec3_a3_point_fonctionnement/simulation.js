/*
Rôle : simulation de l'activité 3 du chapitre « Montages électriques » (tronc commun) : point de fonctionnement.
       Objectif O7 (point de fonctionnement par l'expérience, le graphique et le calcul ; loi de Pouillet ; association
       de générateurs en série), à partir d'un problème d'adaptation entre une pile et une lampe.
Reçoit : Labo.MISSIONS_POINT (missions_point.js).
Produit : la simulation démarrée : pile et dipôles ; caractéristique de la lampe ; association de deux piles.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const nombre = (attendu, tolerance, aide, bravo) => ({ type: "nombre", unite: "A", attendu, tolerance_relative: tolerance, aide, bravo });
  const mont = (faits, cle) => (faits.montages || {})[cle] || {};
  const A = (faits) => faits.association || {}, LA = (faits) => faits.lampe_association || {};

  const POUILLET = {
    id: "pouillet", paillasse: 0, titre: "La loi de Pouillet",
    objectif: "Calculer l'intensité du courant dans un circuit série, sans la mesurer, puis vérifier.",
    entetes: [],
    conclusion: "Loi de Pouillet : dans un circuit série, I = (ΣE − ΣE')/ΣR, où ΣE est la somme des f.é.m. des générateurs, ΣE' celle des f.c.é.m. des récepteurs et ΣR la somme de toutes les résistances (internes comprises).",
    conclusion_courte: "I = (ΣE − ΣE')/ΣR.",
    etapes: [
      { consigne: "Pile seule avec la résistance R = 47 Ω : calculez I = E/(R + r), avec E = 4,5 V et r = 2 Ω (en A).", court: "I = E/(R + r) (A) ?", question: nombre(4.5 / 49, 0.01, "4,5 / (47 + 2).", "Exact : environ 92 mA.") },
      { consigne: "Vérifiez : circuit série pile, interrupteur, ampèremètre et R ; mesurez I.", court: "Mesurez I avec R.", verifier: ({ faits }) => (mont(faits, "r").I > 0.05) || false },
      { consigne: "Ajoutez l'électrolyseur (E' = 1,7 V, r' = 8 Ω) en série avec R. Calculez I = (E − E')/(R + r + r') (en A).", court: "I = (E − E')/(R + r + r') (A) ?", question: nombre(2.8 / 57, 0.015, "(4,5 − 1,7) / (47 + 2 + 8).", "Exact : environ 49 mA.") },
      { consigne: "Vérifiez en mesurant I dans ce circuit.", court: "Mesurez I avec R et l'électrolyseur.", verifier: ({ faits }) => (mont(faits, "electrolyseur+r").I > 0.03) || false },
      { consigne: "Les valeurs mesurées sont un peu plus petites que les valeurs calculées. Pourquoi ?", court: "Répondez dans le carnet.", question: choix(["l'ampèremètre a lui aussi une petite résistance (environ 1 Ω), qui s'ajoute à ΣR", "la loi de Pouillet est fausse", "le courant s'use dans le circuit"], "Toutes les résistances du circuit comptent.", "Exact.") },
    ],
  };

  const ASSOCIATION = {
    id: "association", paillasse: 2, titre: "Associer deux piles en série",
    objectif: "Pour alimenter la lampe 6 V – 0,1 A, on associe deux piles de 4,5 V en série. Faut-il encore adapter le circuit ?",
    entetes: [],
    conclusion: "Des générateurs associés en série (borne + de l'un reliée à la borne − de l'autre) équivalent à un générateur de f.é.m. E = E1 + E2 et de résistance interne r = r1 + r2. Pour adapter la lampe, on ajoute une résistance en série : R = (E − U)/I − r.",
    conclusion_courte: "Série : E = E1 + E2, r = r1 + r2.",
    etapes: [
      { consigne: "Reliez la borne + de la pile 1 à la borne − de la pile 2. Mesurez la tension à vide entre les deux bornes restées libres (V⎓ 20).", court: "Piles en série : tension à vide ?", verifier: ({ faits }) => (A(faits).serie && A(faits).u_vide > 8.5) || false },
      { consigne: "Deux piles en série équivalent à un générateur de f.é.m.…", court: "Répondez dans le carnet.", question: choix(["E = E1 + E2 = 9 V, de résistance interne r = r1 + r2 = 4 Ω", "E = 4,5 V, comme une seule pile", "E = 9 V, sans résistance interne"], "Comparez la tension à vide à celle d'une pile.", "Exact.") },
      { consigne: "Branchez la lampe L (avec l'interrupteur) sur les deux piles en série, et fermez l'interrupteur.", court: "La lampe sur les deux piles.", verifier: ({ faits }) => (LA(faits).serie && LA(faits).eclat > 1.2) || false },
      { consigne: "La lampe brille plus que la normale : elle est sur-alimentée et risque de griller. Calculez la résistance R à ajouter en série pour qu'elle reçoive 6 V et 0,1 A : R = (E − U)/I − r (en Ω).", court: "R à ajouter (Ω) ?", question: { type: "nombre", unite: "Ω", attendu: 26, tolerance: 1.5, aide: "(9 − 6) / 0,1 − 4.", bravo: "Exact : on prend la valeur normalisée 27 Ω." } },
      { consigne: "Ajoutez la résistance R = 27 Ω en série avec la lampe.", court: "Ajoutez R = 27 Ω en série.", verifier: ({ faits }) => (LA(faits).avec_R && LA(faits).eclat > 0.85 && LA(faits).eclat < 1.15) || false },
      { consigne: "Si l'on relie la borne + de la pile 1 à la borne + de la pile 2 (piles en opposition), la tension à vide vaut…", court: "Répondez dans le carnet.", question: choix(["0 V : les f.é.m. se retranchent", "9 V", "4,5 V"], "Les deux f.é.m. agissent en sens contraires.", "Exact.") },
    ],
  };

  const [EXPERIENCE, GRAPHIQUE] = L.MISSIONS_POINT;
  L.demarrer({ id: "tc_elec3_a3_point_fonctionnement", titre: "Laboratoire : point de fonctionnement", decor: "aucun", paillasses: [L.poste_pile_charges, L.poste_lampe_seule, L.poste_association], missions: [EXPERIENCE, GRAPHIQUE, POUILLET, ASSOCIATION] });
})(window.Labo);
