/*
Rôle : paillasse « chauffage à reflux » de la synthèse du savon (matériel : poste_synthese.js) : huile, soude (corrosive)
       et éthanol dans le ballon ; après le reflux, le contenu refroidi est versé dans le bécher d'eau salée (relargage).
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_reflux_savon(groupe) -> { pense_bete } ; fait « reflux_savon » = { epi, huile, soude, ethanol, état du
          montage, recu (mL de savon en grains dans l'eau salée) }.
Utilisé par : simulation.js.
*/
(function (L) {
  const S = L.SAVON;
  L.poste_reflux_savon = L.poste_synthese({
    fait: "reflux_savon", T_eb: 82, duree: 30, reagir: S.saponifier, suivis: ["huile", "soude", "ethanol"],
    reactifs: [
      { id: "huile", x: 500, contenu: { huile: 20 }, texte: "huile", pictos: [] },
      { id: "soude", x: 570, contenu: { soude: 20 }, texte: "soude 30 %", pictos: ["SGH05"] },
      { id: "ethanol", x: 640, contenu: { ethanol: 20 }, texte: "éthanol", pictos: ["SGH02"] },
    ],
    recepteur: { profil: "becher_250", contenu: { eau_salee: 150 }, etiquette: "eau salée" },
    evoluer_recepteur: S.relarguer,
    mesure: (r) => r.c.phases.reduce((s, p) => s + (p.liquides.savon_grains || 0), 0),
  });
})(window.Labo);
