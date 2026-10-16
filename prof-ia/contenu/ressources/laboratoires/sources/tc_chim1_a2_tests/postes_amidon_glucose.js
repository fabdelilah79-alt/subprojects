/*
Rôle : paillasses (3) test de l'amidon : eau iodée et quatre échantillons (papier, papier filtre, pomme de terre en témoin,
       pulpe d'orange) ; (4) test du glucose : trois tubes (jus d'orange, eau distillée, solution de glucose en témoin),
       liqueur de Fehling, bain-marie à 80 °C.
Reçoit : le groupe SVG de chaque paillasse.
Produit : Labo.poste_amidon, Labo.poste_glucose (groupe) -> { pense_bete } ; faits notés « test_amidon » = { n : { iode, bleu_noir } }
          et « test_glucose » = { n : { fehling (mL), bain, T, avance } }.
Utilisé par : simulation.js.
*/
(function (L) {
  const pense = (g) => { L.affiche_securite(g, 780, 56); return L.decor.pense_bete(g, 24, 52, 230); };

  L.poste_amidon = function (g) {
    // Paillasse 3 : deux gouttes d'eau iodée sur chaque échantillon solide.
    const pense_bete = pense(g), ctx = L.paillasse_chimie(g);
    L.flacon_reactif(ctx, { id: "iode", x: 270, bas: 482, reactif: "eau_iodee", texte: "Eau\niodée", dose: 0.1, n: 2 });
    const noms = [["papier", "papier"], ["papier_filtre", "papier filtre"], ["pomme_de_terre", "pomme de terre"], ["pulpe_orange", "pulpe d'orange"]];
    const coupelles = noms.map(([solide, texte], k) => {
      const x = 400 + k * 100;
      L.carte_chimie(ctx.fond, x, 548, [String(k + 1), texte]);
      return L.coupelle_chimie(ctx, { id: `s${k + 1}`, x, y: 528, solide });
    });
    ctx.sur_changement(() => {
      const etat = {};
      coupelles.forEach((v, k) => { const iode = v.c.recus.includes("eau_iodee"); etat[k + 1] = { iode, bleu_noir: iode && L.CHIMIE.solides[v.c.solide].amidon }; });
      L.missions.noter("test_amidon", etat);
    });
    ctx.signaler();
    return { pense_bete };
  };

  L.poste_glucose = function (g) {
    // Paillasse 4 : liqueur de Fehling dans les trois tubes, puis bain-marie.
    const pense_bete = pense(g), ctx = L.paillasse_chimie(g);
    const rack = L.verrerie.porte_tubes(ctx.fond, ctx.devant, 250, 562, 3, 44);
    L.places_tubes(ctx, rack);
    const noms = [["jus_orange", "jus"], ["eau", "eau"], ["glucose", "glucose"]];
    const tubes = noms.map(([produit, texte], k) => L.tube_essai(ctx, { id: `t${k + 1}`, place: k, volumes: { [produit]: 5 }, texte }));
    L.flacon_reactif(ctx, { id: "fehling", x: 470, bas: 482, reactif: "fehling", texte: "Liqueur de\nFehling", dose: 1, n: 5 });
    L.bain_marie(ctx, { x: 680, bas: 572, T: 80 });
    ctx.sur_changement(() => {
      const etat = {};
      tubes.forEach((t, k) => { etat[k + 1] = { fehling: Math.round((t.m.volumes.fehling || 0) * 10) / 10, bain: !!t.place.bain, T: Math.round(t.m.T), avance: Math.round(t.m.avance * 100) / 100 }; });
      L.missions.noter("test_glucose", etat);
    });
    ctx.signaler();
    return { pense_bete };
  };
})(window.Labo);
