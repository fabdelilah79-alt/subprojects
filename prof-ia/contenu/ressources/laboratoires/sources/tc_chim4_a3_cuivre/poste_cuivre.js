/*
Rôle : paillasse du cycle du cuivre, sous la hotte aspirante : lunettes et gants, tube à essai de tournure de cuivre dans
       un porte-tubes, flacons compte-gouttes d'acide nitrique, de soude et d'acide sulfurique (on ne les prend qu'avec
       lunettes et gants), pot de poudre de fer et sa spatule, bain-marie à 90 °C. Les transformations se font dans le tube
       (reactions_cuivre.js) ; pendant l'attaque nitrique, un gaz roux (NO₂, toxique) monte vers la hotte.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_cuivre(groupe) -> { pense_bete } ; fait « cycle » = { epi, metal, ions, hydroxyde, oxyde, fer, gaz, T, bain }.
Utilisé par : simulation.js.
*/
(function (L) {
  const SOL = 576, E = 1.6;

  function hotte(g) {
    // Hotte aspirante : montants, bandeau supérieur et vitre relevée ; voyant d'aspiration.
    for (const x of [96, 1004]) L.svg("rect", { x: x - 8, y: 0, width: 16, height: 590, fill: "url(#metal)", stroke: "#7d868c" }, g);
    L.svg("rect", { x: 88, y: 0, width: 932, height: 30, fill: "#cfd5d8", stroke: "#8f989e" }, g);
    L.svg("rect", { x: 104, y: 30, width: 892, height: 14, fill: "rgba(205,228,236,0.55)", stroke: "#8f989e" }, g);
    L.svg("rect", { x: 104, y: 42, width: 892, height: 5, fill: "#8f989e" }, g);
    L.svg("circle", { cx: 588, cy: 15, r: 4, fill: "#3ccf5a" }, g);
    L.texte(g, 720, 18, "HOTTE ASPIRANTE — aspiration en marche", { "font-size": 9, "font-weight": 700, fill: "#33414b" });
  }

  function gaz(g, t, phase) {
    // Volutes rousses de dioxyde d'azote qui sortent du tube et montent vers la hotte.
    g.replaceChildren();
    if (!t.c.gaz) return;
    const a = t.monde(t.pr.levres.g), b = t.monde(t.pr.levres.d), x = (a.x + b.x) / 2, y = (a.y + b.y) / 2;
    for (let i = 0; i < 4; i++) {
      const h = ((phase * 40 + i * 30) % 120), o = 0.55 * (1 - h / 120);
      L.svg("path", { d: `M${x - 4} ${y - h} q-8 -10 0 -20 q8 -10 0 -20`, stroke: "#a0501c", "stroke-width": 7 + h / 12, "stroke-linecap": "round", fill: "none", opacity: o }, g);
    }
  }

  L.poste_cuivre = function (g) {
    // Matériel, gestes, transformations à chaque pas ; le fait « cycle » est noté quand il change.
    hotte(g);
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230), ctx = L.paillasse_chimie(g), calque = L.svg("g", { "pointer-events": "none" }, g);
    L.ecoulement(ctx, { sol: SOL, e: E });
    const dire = (t) => { calque.replaceChildren(); if (t) { L.svg("rect", { x: 380, y: 236, width: 320, height: 28, rx: 5, fill: "#fff6e0", stroke: "#d08a1a" }, calque); L.texte(calque, 540, 250, t, { "font-size": 7.4, "font-weight": 700, fill: "#6b3d00" }); } };
    const epi = L.equipement(g, { x: 300, y: 70, changer: () => dire("") });
    const autoriser = (quoi) => () => { if (epi.protege()) { dire(""); return true; } dire(`Mettez vos lunettes et vos gants : ${quoi}.`); return false; };
    const rack = L.porte_tubes(ctx, { x: 250, sol: SOL, e: E, n: 2, pas: 30 });
    const bain = L.bain_marie_physique(ctx, { x: 730, sol: SOL, e: E, T: 90 });
    [["nitrique", 350, "acide_nitrique", "Acide\nnitrique", "l'acide nitrique est corrosif"], ["soude", 420, "soude", "Soude", "la soude est corrosive"], ["sulfurique", 490, "acide_sulfurique", "Acide\nsulfurique", "l'acide sulfurique est corrosif"]]
      .forEach(([id, x, liquide, texte, raison]) => L.flacon_gouttes(ctx, { id, x, sol: SOL, e: E, liquide, texte, autoriser: autoriser(raison) }));
    L.spatule_poudre(ctx, { x: 578, sol: SOL, e: E, solide: "fer_poudre", dose: 0.1, texte: "Fer\nen poudre", rgb: [96, 98, 102] });
    const t = L.recipient(ctx, { id: "tube", profil: "tube", x: rack[0].x, y: rack[0].y, contenu: { cuivre_metal: 0.25 }, etiquette: "cuivre" });
    t.place = rack[0];
    L.manipuler(ctx, t, { sol: SOL, supports: [...rack, ...bain.places], pose_libre: false });
    const g_gaz = L.svg("g", { "pointer-events": "none" }, ctx.haut);
    let avant = "", phase = 0;
    ctx.ecoulement.sur_pas((dt) => {
      const s0 = JSON.stringify(L.CUIVRE.bilan(t.c));
      L.CUIVRE.evoluer(t.c, dt); phase += dt;
      const v = { epi: epi.protege(), ...L.CUIVRE.bilan(t.c), bain: !!t.place?.bain }, s = JSON.stringify(v);
      if (JSON.stringify(L.CUIVRE.bilan(t.c)) !== s0) t.sig = null;
      gaz(g_gaz, t, phase);
      if (s !== avant) { avant = s; L.missions.noter("cycle", v); }
    });
    return { pense_bete };
  };
})(window.Labo);
