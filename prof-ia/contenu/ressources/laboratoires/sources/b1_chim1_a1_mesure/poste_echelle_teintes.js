/*
Rôle : paillasse « échelle de teintes » : porte-tubes devant un carton blanc, cinq tubes étalons de colorant bleu E131
       (2, 4, 6, 8 et 10 mg/L), une place libre entre deux étalons ; tube de boisson à la menthe (sirop dilué 10 fois) sur
       son petit support, que l'on fait glisser dans le porte-tubes pour comparer sa teinte. Vraies dimensions.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_echelle_teintes(g) -> { pense_bete } ; fait « teintes » = { place (rang dans le porte-tubes) ou null,
          entre: [C à gauche, C à droite] (mg/L) ou null }.
Utilisé par : simulation.js.
*/
(function (L) {
  const SOL = 560, E = 1.6, ETALONS = [2, 4, 6, 8, 10], C_BOISSON = 5;
  L.TEINTES.E131 = { aqueuse: [22, 92, 206], organique: [22, 92, 206] };
  const liquide = (id, nom, C) => { L.LIQUIDES[id] = { nom, d: 1.0, rgb: [226, 239, 246], alpha: 0.32, classe: "aqueuse", dissous: { E131: 0.0075 * C } }; };
  ETALONS.forEach((C) => liquide(`e131_${C}`, `solution de E131 à ${C} mg/L`, C));
  liquide("boisson_menthe", "boisson à la menthe", C_BOISSON);

  function decor(g) {
    // Carton blanc derrière le porte-tubes (on compare les teintes sur fond blanc), légendes.
    L.svg("rect", { x: 296, y: 300, width: 420, height: 230, rx: 3, fill: "#fbfbf6", stroke: "#c9c4b0" }, g);
    L.svg("path", { d: "M300 530 L292 562 M712 530 L720 562", stroke: "#8d918a", "stroke-width": 3 }, g);
    L.texte(g, 506, 318, "Échelle de teintes : colorant bleu patenté E131", { "font-size": 9, "font-weight": 700, fill: "#23315a" });
    L.texte(g, 830, 288, "boisson à la menthe", { "font-size": 8, "font-weight": 700, fill: "#23315a" });
    L.texte(g, 830, 300, "(sirop dilué 10 fois)", { "font-size": 7.5, fill: "#23315a" });
  }

  L.poste_echelle_teintes = function (g) {
    // Décor, étalons fixes, boisson saisissable ; place notée quand le tube est posé.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230), ctx = L.paillasse_chimie(g);
    L.ecoulement(ctx, { sol: SOL, e: E }); decor(ctx.fond);
    const rack = L.porte_tubes(ctx, { x: 506, sol: SOL, e: E, n: 9, pas: 26 }), seul = L.porte_tubes(ctx, { x: 830, sol: SOL, e: E, n: 1, pas: 26 });
    ETALONS.forEach((C, k) => { L.recipient(ctx, { id: `t${C}`, profil: "tube", x: rack[2 * k].x, y: rack[2 * k].y, contenu: { [`e131_${C}`]: 12 }, etiquette: String(C) }); rack[2 * k].occupe = true; });
    ETALONS.forEach((C, k) => L.texte(ctx.fond, rack[2 * k].x, SOL + 14, `${C} mg/L`, { "font-size": 8, "font-weight": 700, fill: "#e8e2cc" }));
    const t = L.recipient(ctx, { id: "boisson", profil: "tube", x: seul[0].x, y: seul[0].y, contenu: { boisson_menthe: 12 }, etiquette: "?" });
    L.manipuler(ctx, t, { sol: SOL, supports: [...rack.filter((p) => !p.occupe), seul[0]], pose_libre: false });
    let avant = "";
    ctx.ecoulement.sur_pas(() => {
      // Rang du tube de boisson dans le porte-tubes (s'il y est posé) et étalons voisins.
      const k = t.tenu ? -1 : rack.findIndex((p) => Math.abs(p.x - t.pose.x) < 2);
      const v = k < 0 ? { place: null, entre: null } : { place: k, entre: k % 2 ? [ETALONS[(k - 1) / 2], ETALONS[(k + 1) / 2]] : null }, s = JSON.stringify(v);
      if (s !== avant) { avant = s; L.missions.noter("teintes", v); }
    });
    return { pense_bete };
  };
})(window.Labo);
