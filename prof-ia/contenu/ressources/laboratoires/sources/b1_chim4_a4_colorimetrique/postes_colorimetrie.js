/*
Rôle : les deux paillasses des titrages colorimétriques. Paillasse 1 : burette de permanganate de potassium (0,020 mol/L),
       bécher de 10,0 mL de solution d'ions fer II (+ 20 mL d'eau), bécher d'acide sulfurique à ajouter ; l'équivalence est
       repérée par la première teinte rose qui persiste. Paillasse 2 : burette de thiosulfate de sodium (0,100 mol/L),
       bécher de 10,0 mL de solution de diiode (+ 20 mL d'eau), flacon d'empois d'amidon ; l'équivalence est repérée par la
       disparition de la teinte bleu-noir. Une teinte est « persistante » quand elle dure 1,5 s dans la solution agitée,
       robinet fermé.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_fer(g), Labo.poste_iode(g) -> { pense_bete } ; faits « fer » et « iode » = { sur, vitesse, verse,
          robinet, VE_lu (volume versé quand la fin est apparue, ou null) } ; en plus, « fer » : H (mmol d'ions H⁺ dans le
          bécher), « iode » : amidon (vrai s'il y en a dans le bécher).
Utilisé par : simulation.js.
*/
(function (L) {
  const aq = (r) => r.c.phases.find((p) => p.classe === "aqueuse");

  function suivre(p, fait, fin, plus) {
    // Toutes les 0,3 s : état du titrage ; VE_lu au moment où la fin est atteinte (remis à zéro avec un bécher neuf).
    let t = 0, VE = null, c = p.becher.c;
    setInterval(() => {
      if (p.becher.c !== c) { c = p.becher.c; VE = null; t = 0; }
      const b = p.burette.etat(), sur = p.sur_plateau(), ph = aq(p.becher), ok = sur === p.becher && p.agitateur.agite(sur) && b.robinet === "ferme";
      t = ok && ph && fin(ph) ? t + 0.3 : 0;
      if (t >= 1.5 && VE === null) VE = b.verse;
      L.missions.noter(fait, { ...b, sur: sur && sur.id, vitesse: p.agitateur.vitesse(), VE_lu: VE, ...plus(ph) });
    }, 300);
  }

  L.poste_fer = function (g) {
    // Permanganate et ions fer II ; fin : ions permanganate en excès (la solution reste rose).
    const p = L.poste_titrage(g, { titrant: "ox_permanganate", texte: "KMnO₄ 0,020 mol/L", becher: { id: "becher", contenu: { ox_mohr: 10, eau: 20 }, etiquette: "ions fer II" }, autres: [{ id: "acide", profil: "becher_100", contenu: { ox_sulfurique: 40 }, etiquette: "acide sulfurique" }], places: [250, 335, 620, 790] });
    suivre(p, "fer", (ph) => L.concentration(ph, "MnO4-") > 5e-6, (ph) => ({ H: ph ? Math.round((ph.dissous["H3O+"] || 0) * 100) / 100 : 0 }));
    return { pense_bete: p.pense_bete };
  };

  L.poste_iode = function (g) {
    // Thiosulfate et diiode ; fin : plus de diiode (la teinte bleu-noir disparaît), empois d'amidon présent.
    const p = L.poste_titrage(g, { titrant: "ox_thiosulfate", texte: "Na₂S₂O₃ 0,100 mol/L", becher: { id: "becher", contenu: { ox_diiode: 10, eau: 20 }, etiquette: "diiode" }, gouttes: [{ liquide: "ox_amidon", texte: "Empois\nd'amidon" }], places: [250, 335, 620, 790] });
    suivre(p, "iode", (ph) => (ph.liquides.ox_amidon || 0) > 0 && L.concentration(ph, "I2") < 2e-6, (ph) => ({ amidon: !!ph && (ph.liquides.ox_amidon || 0) > 0 }));
    return { pense_bete: p.pense_bete };
  };
})(window.Labo);
