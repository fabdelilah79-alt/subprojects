/*
Rôle : paillasses (3) test de l'amidon : flacon d'eau iodée et quatre verres de montre (papier, papier filtre, pomme de
       terre en témoin, pulpe d'orange) ; (4) test du glucose : trois tubes à essai dans un porte-tubes (jus d'orange, eau
       distillée, solution de glucose en témoin), flacon de liqueur de Fehling, bain-marie à 80 °C. Vraies dimensions.
Reçoit : le groupe SVG de chaque paillasse.
Produit : Labo.poste_amidon, Labo.poste_glucose (groupe) -> { pense_bete } ; faits notés « test_amidon » = { n : { iode, bleu_noir } }
          et « test_glucose » = { n : { fehling (mL), bain, T, avance } }.
Utilisé par : simulation.js.
*/
(function (L) {
  const SOL = 576, E = 1.6;
  const arrondi = (v, k = 10) => Math.round(v * k) / k;

  L.poste_amidon = function (g) {
    // Paillasse 3 : quelques gouttes d'eau iodée sur chaque échantillon solide.
    const { pense_bete, ctx } = L.paillasse_physique(g);
    L.flacon_gouttes(ctx, { id: "iode", x: 250, sol: 548, e: E, liquide: "eau_iodee", texte: "Eau\niodée" });
    const noms = [["papier", "papier"], ["papier_filtre", "papier filtre"], ["pomme_de_terre", "pomme de terre"], ["pulpe_orange", "pulpe d'orange"]];
    const verres = noms.map(([solide, texte], k) => {
      const x = 390 + k * 120;
      L.carte_chimie(ctx.fond, x, 573, `${k + 1} ${texte}`);
      return L.verre_montre(ctx, { id: `s${k + 1}`, x, sol: 564, e: E, diametre: 60, solide });
    });
    ctx.noter("test_amidon", () => {
      const etat = {};
      verres.forEach((v, k) => { const iode = v.c.recus.includes("eau_iodee"); etat[k + 1] = { iode, bleu_noir: iode && L.CHIMIE.solides[v.c.solide].amidon }; });
      return etat;
    });
    return { pense_bete };
  };

  function etat_tube(t) {
    // Ce que l'on sait d'un tube : liqueur de Fehling versée (mL), dans le bain ou non, température, avancement du test.
    const fehling = t.c.phases.reduce((s, p) => s + (p.liquides.fehling || 0), 0);
    return { fehling: arrondi(fehling), bain: !!t.place?.bain, T: Math.round(t.c.T ?? 20), avance: arrondi(t.c.avance || 0, 100) };
  }

  L.poste_glucose = function (g) {
    // Paillasse 4 : liqueur de Fehling dans les trois tubes, puis bain-marie.
    const { pense_bete, ctx } = L.paillasse_physique(g);
    const rack = L.porte_tubes(ctx, { x: 290, sol: SOL, e: E, n: 3, pas: 30 });
    const bain = L.bain_marie_physique(ctx, { x: 680, sol: SOL, e: E, T: 80 });
    L.flacon_gouttes(ctx, { id: "fehling", x: 450, sol: SOL, e: E, liquide: "fehling", texte: "Liqueur de\nFehling" });
    const noms = [["jus_orange", "jus"], ["eau", "eau"], ["solution_glucose", "glucose"]];
    const tubes = noms.map(([liquide, texte], k) => {
      const t = L.recipient(ctx, { id: `t${k + 1}`, profil: "tube", x: rack[k].x, y: rack[k].y, contenu: { [liquide]: 2 }, etiquette: texte });
      t.place = rack[k];
      L.manipuler(ctx, t, { sol: SOL, supports: [...rack, ...bain.places], pose_libre: false });
      return t;
    });
    ctx.noter("test_glucose", () => {
      const etat = {};
      tubes.forEach((t, k) => { etat[k + 1] = etat_tube(t); });
      return etat;
    });
    return { pense_bete };
  };
})(window.Labo);
