/*
Rôle : simulation de l'activité 1 du chapitre « Titrages » (1re année du bac) : indicateurs colorés et produits de la vie
       courante (acides, neutres, basiques) ; transfert de protons montré par un changement de couleur : vinaigre + soude
       (CH₃CO₂H + HO⁻ → CH₃CO₂⁻ + H₂O), ammoniaque + acide chlorhydrique (NH₃ + H₃O⁺ → NH₄⁺ + H₂O) ; acide et base selon
       Brønsted, couples, eau ampholyte. Objectifs O1, O2.
Reçoit : rien (les vérifications lisent les faits « indicateurs » et « transfert »).
Produit : la simulation démarrée.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const tr = (f, id) => ((f.transfert || {})[id]) || {};
  const a_reagi = (f, id, eq) => (tr(f, id).reactions || []).includes(eq);

  const INDICATEURS = {
    id: "indicateurs", paillasse: 0, titre: "Acides et bases de la vie courante",
    objectif: "Classer six produits de la vie courante avec un indicateur coloré : le bleu de bromothymol (BBT).",
    entetes: [],
    donnees: ["BBT : jaune si pH < 6,0 ; vert entre 6,0 et 7,6 ; bleu si pH > 7,6", "Hélianthine : rouge si pH < 3,1 ; jaune si pH > 4,4", "Phénolphtaléine : incolore si pH < 8,2 ; rose au-delà"],
    conclusion: "Le vinaigre et le jus de citron sont acides (BBT jaune) ; l'eau distillée est neutre (vert) ; l'eau savonneuse, l'ammoniaque et le déboucheur sont basiques (bleu). Un indicateur coloré est un couple acide/base dont les deux formes n'ont pas la même couleur : sa teinte dépend du pH.",
    conclusion_courte: "L'indicateur classe acides, neutres, basiques.",
    etapes: [
      { consigne: "Ajoutez deux ou trois gouttes de BBT dans chacun des six tubes et observez la teinte.", court: "BBT dans les six tubes.", aide_geste: "Sortez la pipette du flacon de BBT, tenez-la au-dessus d'un tube et appuyez sur la poire ; mettez lunettes et gants pour le déboucheur.", verifier: ({ faits }) => [1, 2, 3, 4, 5, 6].every((k) => ((faits.indicateurs || {})[k] || {}).bbt) },
      { consigne: "Les produits acides sont…", court: "Répondez dans le carnet.", question: choix(["le vinaigre et le jus de citron", "l'eau savonneuse et le déboucheur", "l'eau distillée"], "BBT jaune : pH < 6.", "Exact.") },
      { consigne: "Les produits basiques sont…", court: "Répondez dans le carnet.", question: choix(["l'eau savonneuse, l'ammoniaque et le déboucheur", "le vinaigre et l'ammoniaque", "le jus de citron et l'eau"], "BBT bleu : pH > 7,6.", "Exact.") },
      { consigne: "Pour l'acide acétique du vinaigre et le jus de citron, quelle couleur prend l'hélianthine ? Essayez sur un tube neuf.", court: "Répondez dans le carnet.", question: choix(["rouge pour le jus de citron (pH ≈ 2,4), orange pour le vinaigre (pH ≈ 2,9)", "jaune pour les deux", "rose pour les deux"], "Comparez le pH des deux produits aux zones de virage.", "Exact : l'hélianthine distingue des pH que le BBT ne distingue pas.") },
    ],
  };

  const TRANSFERT = {
    id: "transfert", paillasse: 1, titre: "Le transfert de protons",
    objectif: "Faire réagir un acide et une base en présence de BBT ; écrire l'équation ; identifier les couples acide/base.",
    entetes: [],
    donnees: ["Vinaigre dilué : 20 mL d'acide acétique CH₃CO₂H à 0,08 mol/L", "Ammoniaque diluée : 10 mL d'ammoniac NH₃ à 0,1 mol/L", "Soude et acide chlorhydrique à 1,0 mol/L (corrosifs)"],
    conclusion: "Selon Brønsted, un acide est une espèce capable de céder un proton H⁺, une base une espèce capable d'en capter un. Dans CH₃CO₂H + HO⁻ → CH₃CO₂⁻ + H₂O, l'acide acétique cède un proton à l'ion hydroxyde ; dans NH₃ + H₃O⁺ → NH₄⁺ + H₂O, l'ammoniac capte le proton de l'ion oxonium. Les protons ne sont jamais libres en solution : ils passent directement de l'acide d'un couple à la base d'un autre couple. Couples : CH₃CO₂H/CH₃CO₂⁻, H₂O/HO⁻, NH₄⁺/NH₃, H₃O⁺/H₂O ; l'eau est acide dans un couple et base dans l'autre : c'est un ampholyte.",
    conclusion_courte: "Acide : donneur de H⁺ ; base : accepteur de H⁺.",
    etapes: [
      { consigne: "Ajoutez quelques gouttes de BBT au vinaigre, puis de la soude goutte à goutte jusqu'à ce que la teinte devienne bleue.", court: "Vinaigre + BBT + soude.", aide_geste: "Gardez la poire appuyée : une goutte toutes les 0,3 s ; remettez la pipette dans son flacon pour la remplir.", verifier: ({ faits }) => { const v = tr(faits, "vinaigre"); if (!v.bbt && v.reactions?.length) return "Ajoutez aussi du BBT au vinaigre pour voir le changement de teinte."; return v.bbt && a_reagi(faits, "vinaigre", "CH₃CO₂H + HO⁻ → CH₃CO₂⁻ + H₂O") && v.teinte === "bleu"; } },
      { consigne: "L'équation de la réaction est…", court: "Répondez dans le carnet.", question: choix(["CH₃CO₂H + HO⁻ → CH₃CO₂⁻ + H₂O", "CH₃CO₂⁻ + H₂O → CH₃CO₂H + HO⁻", "CH₃CO₂H + Na⁺ → CH₃CO₂Na + H⁺"], "L'ion Na⁺ est spectateur ; le proton passe de l'acide acétique à l'ion HO⁻.", "Exact.") },
      { consigne: "Dans cette réaction, l'acide acétique CH₃CO₂H…", court: "Répondez dans le carnet.", question: choix(["cède un proton H⁺ : c'est un acide (couple CH₃CO₂H/CH₃CO₂⁻)", "capte un proton : c'est une base", "cède un électron"], "Comparez CH₃CO₂H et CH₃CO₂⁻.", "Exact.") },
      { consigne: "Ajoutez du BBT à l'ammoniaque, puis de l'acide chlorhydrique goutte à goutte jusqu'à ce que la teinte devienne jaune.", court: "Ammoniaque + BBT + acide.", verifier: ({ faits }) => tr(faits, "ammoniaque").bbt && a_reagi(faits, "ammoniaque", "NH₃ + H₃O⁺ → NH₄⁺ + H₂O") && tr(faits, "ammoniaque").teinte === "jaune" },
      { consigne: "L'équation de cette réaction est…", court: "Répondez dans le carnet.", question: choix(["NH₃ + H₃O⁺ → NH₄⁺ + H₂O", "NH₄⁺ + H₂O → NH₃ + H₃O⁺", "NH₃ + Cl⁻ → NH₃Cl⁻"], "L'ammoniac capte le proton de l'ion oxonium.", "Exact : couples NH₄⁺/NH₃ et H₃O⁺/H₂O.") },
      { consigne: "L'eau est un ampholyte parce que…", court: "Répondez dans le carnet.", question: choix(["elle est la base du couple H₃O⁺/H₂O et l'acide du couple H₂O/HO⁻", "elle est neutre", "elle dissout les acides et les bases"], "Cherchez H₂O dans les couples des deux réactions.", "Exact.") },
    ],
  };

  L.demarrer({ id: "b1_chim4_a1_protons", titre: "Laboratoire : transfert de protons", paillasses: [L.poste_indicateurs, L.poste_transfert], missions: [INDICATEURS, TRANSFERT] });
})(window.Labo);
