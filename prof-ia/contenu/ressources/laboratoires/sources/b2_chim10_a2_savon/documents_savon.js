/*
Rôle : paillasse documentaire du savon : quatre documents au mur (l'ion carboxylate, comment le savon lave, savon et eau
       calcaire, catalyse et industrie).
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_docs_savon(g) -> { pense_bete } ; fait « docs_savon » (documents lus).
Utilisé par : simulation.js.
*/
(function (L) {
  const doc = (k, titre, chaine, texte) => ({ x: 262 + (k % 2) * 370, y: 34 + Math.floor(k / 2) * 180, l: 360, h: 170, taille: 4, titre, chaine, texte });

  L.poste_docs_savon = function (g) {
    // Pense-bête et quatre documents.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230);
    L.documents_mur(g, [
      doc(0, "L'ion carboxylate", ["C₁₇H₃₅–COO⁻", "stéarate", "queue hydrophobe", "tête hydrophile"], "Un savon est un mélange de carboxylates de sodium (savon dur) ou de potassium (savon mou), R–COO⁻ + Na⁺, avec une longue chaîne carbonée R (12 à 18 atomes de carbone). La chaîne carbonée, comme l'huile, n'aime pas l'eau : elle est hydrophobe (et lipophile). Le groupe –COO⁻, chargé, est attiré par l'eau : il est hydrophile. L'ion carboxylate est dit amphiphile."),
      doc(1, "Comment le savon lave", ["ions à la surface", "mousse", "micelles", "salissure entraînée"], "Dans l'eau, les ions carboxylates se placent à la surface, tête dans l'eau et queue dans l'air : la surface de l'eau s'étire plus facilement, d'où la mousse. Autour d'une goutte de graisse, ils plantent leur queue dans la graisse et laissent leur tête dans l'eau : la goutte, entourée de charges négatives, se détache du tissu et reste dispersée dans l'eau (micelle) ; le rinçage l'emporte."),
      doc(2, "Savon et eau calcaire", ["Ca²⁺, Mg²⁺", "+ R–COO⁻", "précipité", "moins de mousse"], "Une eau calcaire (eau dure) contient beaucoup d'ions calcium Ca²⁺ et magnésium Mg²⁺. Ils forment avec les ions carboxylates un précipité blanc : 2 R–COO⁻ + Ca²⁺ → (R–COO)₂Ca. Le savon précipité ne lave plus : il faut davantage de savon, et la mousse se forme mal. En milieu acide, le savon donne aussi un précipité : l'acide gras R–COOH."),
      doc(3, "Catalyse et industrie", ["catalyseur", "plus rapide", "sélectif", "même équilibre"], "Un catalyseur accélère une transformation sans être consommé : il est régénéré à la fin. Il ne change pas l'état final d'un équilibre : il le fait atteindre plus vite. Il peut être sélectif : parmi plusieurs réactions possibles à partir des mêmes réactifs, il n'en accélère qu'une. L'industrie choisit ainsi ses catalyseurs pour obtenir surtout le produit voulu (enzymes, métaux, acides)."),
    ], "docs_savon");
    g.append(g.querySelector(".document-ouvert"));
    return { pense_bete };
  };
})(window.Labo);
