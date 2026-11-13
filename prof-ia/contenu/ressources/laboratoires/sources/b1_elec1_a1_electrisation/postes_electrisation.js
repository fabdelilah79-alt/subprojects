/*
Rôle : les deux paillasses de l'électrisation (1re année du bac) : (1) pendule électrostatique sous une potence, baguettes
       de PVC et de verre, chiffons de laine et de soie, bouton pour toucher la boule avec le doigt, support isolant où poser une baguette ; (2) électroscope à
       feuilles d'or, mêmes baguettes et chiffons, main pour relier le plateau à la Terre, support isolant.
Reçoit : le groupe SVG de chaque paillasse.
Produit : Labo.poste_pendule(g), Labo.poste_electroscope(g) -> { pense_bete }.
Utilisé par : simulation.js.
*/
(function (L) {
  const CHIFFONS = () => [{ matiere: "laine", x: 660, y: 440, l: 120, h: 40 }, { matiere: "soie", x: 800, y: 440, l: 120, h: 40 }];
  const BAGUETTES = () => [{ id: "pvc", matiere: "pvc", repos: { x: 320, y: 470 } }, { id: "verre", matiere: "verre", repos: { x: 320, y: 524 } }];

  function support(g, f, x, y) {
    // Support isolant : une baguette lâchée sur son berceau y reste (pointe tournée vers l'appareil) ; « Reprendre » la rend.
    const gr = L.svg("g", { class: "support-isolant" }, g);
    L.svg("rect", { x: x - 24, y: 546, width: 48, height: 10, rx: 2, fill: "#3a3f44" }, gr);
    L.svg("rect", { x: x - 4, y: y + 6, width: 8, height: 546 - y - 6, fill: "#c8a46a", stroke: "#6b4a2a" }, gr);
    L.svg("path", { d: `M${x - 14} ${y - 4} L${x} ${y + 8} L${x + 14} ${y - 4}`, fill: "none", stroke: "#2b3035", "stroke-width": 3 }, gr);
    L.texte(gr, x, 572, "support isolant", { "font-size": 7, fill: "#e8ecef" });
    L.bouton_texte(g, x, y + 40, "Reprendre", () => { for (const b of f.baguettes) if (b.pose_sur_etrier) { b.pose_sur_etrier = false; b.pos = { ...b.repos }; f.redessiner(b); } });
    return (b) => { if (!f.baguettes.some((k) => k.pose_sur_etrier) && Math.abs(b.pos.x - (x - 40)) < 70 && Math.abs(b.pos.y - y) < 40) { b.pose_sur_etrier = true; b.pos = { x: x - 40, y }; f.redessiner(b); } };
  }

  function animer(objet) {
    // Boucle d'animation d'un appareil (pendule ou électroscope).
    let avant = null;
    const image = (t) => { objet.tic(avant === null ? 0 : Math.min(0.03, (t - avant) / 1000)); avant = t; requestAnimationFrame(image); };
    requestAnimationFrame(image);
  }

  L.poste_pendule = function (g) {
    // Potence et pendule ; baguettes et chiffons ; bouton « toucher la boule ».
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230), attache = L.potence(L.svg("g", {}, g));
    const fond = L.svg("g", {}, g), baguettes = L.svg("g", {}, g);
    let poser = null;
    const f = L.frottement(baguettes, { chiffons: CHIFFONS(), baguettes: BAGUETTES(), sur_deplacement: (b, lache) => { if (lache) poser(b); } });
    poser = support(fond, f, 800, 336);
    const p = L.pendule(fond, attache, f.baguettes);
    L.bouton_texte(g, 880, 200, "Toucher la boule", () => p.decharger());
    L.texte(g, 880, 226, "(avec le doigt)", { "font-size": 8, fill: "#33414b" });
    animer(p);
    return { pense_bete };
  };

  L.poste_electroscope = function (g) {
    // Électroscope ; baguettes et chiffons ; main à droite.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230), fond = L.svg("g", {}, g), baguettes = L.svg("g", {}, g);
    let poser = null;
    const f = L.frottement(baguettes, { chiffons: CHIFFONS(), baguettes: BAGUETTES(), sur_deplacement: (b, lache) => { if (lache) poser(b); } });
    poser = support(fond, f, 740, 330);
    const e = L.electroscope(fond, { x: 540, y: 330 }, f.baguettes);
    L.texte(g, 850, 340, "main (doigt) : reliez le plateau à la Terre", { "font-size": 8, fill: "#33414b" });
    animer(e);
    return { pense_bete };
  };
})(window.Labo);
