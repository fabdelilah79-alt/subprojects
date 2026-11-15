/*
Rôle : ambiance de couleur des laboratoires (mur, carrelage, frise, paillasse, placards), réglée à un seul endroit.
       « zellige » (choix de l'enseignant, 15/11/2026) : mur crème, frise de zellige bleu de Fès, vert et ocre sous la
       plinthe bleue, paillasse sombre (la verrerie reste bien visible), placards bleu de Fès. « actuelle » : l'ancien gris.
Reçoit : l'adresse de la page peut contenir « ambiance=actuelle » (par exemple …html#mission=x&ambiance=actuelle).
Produit : Labo.ambiance() -> couleurs de l'ambiance ; Labo.ambiance.motif(defs) : motif « zellige » ;
          Labo.ambiance.frise(groupe, y) : la frise sur la largeur de la paillasse (rien si l'ambiance n'en a pas).
Utilisé par : materiaux.js (dégradés du décor), decor.js et circuit_decor.js (plinthe, frise, placards).
*/
(function (L) {
  const AMBIANCES = {
    actuelle: { mur: ["#d9dcd5", "#c5c9c1"], carreau: "#eef0ec", joint: "#c9cdc6", plinthe: "#b9bdb5",
      paillasse: ["#4b5359", "#353b40", "#2a2f33"], bord: ["#5c656c", "#22262a"], placard: ["#8a9497", "#6c7578"],
      cadre_placard: "#5d6567", frise: false },
    zellige: { mur: ["#f4efe4", "#e8e0cf"], carreau: "#fbf8f1", joint: "#d8cfbd", plinthe: "#1d5f7a",
      paillasse: ["#3f4a52", "#2f373d", "#262c31"], bord: ["#566168", "#1f2428"], placard: ["#1d5f7a", "#174d63"],
      cadre_placard: "#123f52", frise: true },
  };
  const PAR_DEFAUT = "zellige";
  const BLEU = "#1d5f7a", VERT = "#2e8c6e", OCRE = "#d9a12b", TERRE = "#b9472f", FOND = "#f7f2e7";

  L.ambiance = function () {
    // Couleurs de l'ambiance demandée par l'adresse, sinon celles de l'ambiance par défaut.
    const nom = (window.location.hash.match(/ambiance=([a-z_]+)/) || [])[1];
    return AMBIANCES[nom] || AMBIANCES[PAR_DEFAUT];
  };

  function etoile(cx, cy, r) {
    // Étoile à huit branches du zellige : deux carrés croisés (points du contour).
    const pts = [];
    for (let k = 0; k < 16; k++) {
      const a = (Math.PI / 8) * k - Math.PI / 2, rayon = k % 2 ? r * 0.72 : r;
      pts.push(`${(cx + rayon * Math.cos(a)).toFixed(2)},${(cy + rayon * Math.sin(a)).toFixed(2)}`);
    }
    return pts.join(" ");
  }

  L.ambiance.motif = function (defs) {
    // Carreau de 32 px : étoile bleue, étoile verte, cœur ocre, coins en terre cuite.
    const motif = L.svg("pattern", { id: "zellige", width: 32, height: 32, patternUnits: "userSpaceOnUse" }, defs);
    L.svg("rect", { width: 32, height: 32, fill: FOND }, motif);
    L.svg("polygon", { points: etoile(16, 16, 13), fill: BLEU }, motif);
    L.svg("polygon", { points: etoile(16, 16, 7.5), fill: VERT }, motif);
    L.svg("circle", { cx: 16, cy: 16, r: 2.4, fill: OCRE }, motif);
    L.svg("path", { d: "M0 0h7L0 7zM32 0h-7l7 7zM0 32h7l-7-7zM32 32h-7l7-7z", fill: TERRE }, motif);
  };

  L.ambiance.frise = function (g, y) {
    // Frise de zellige sous la plinthe, entre deux filets bleus (seulement si l'ambiance en a une).
    if (!L.ambiance().frise) return;
    const bande = L.svg("g", { transform: `translate(0 ${y})` }, g);  // le motif part du haut de la frise : carreaux entiers
    L.svg("rect", { x: 0, y: 0, width: L.LARGEUR, height: 32, fill: "url(#zellige)" }, bande);
    for (const yy of [0, 31]) L.svg("rect", { x: 0, y: yy, width: L.LARGEUR, height: 1.5, fill: BLEU, opacity: 0.8 }, bande);
  };
})(window.Labo);
