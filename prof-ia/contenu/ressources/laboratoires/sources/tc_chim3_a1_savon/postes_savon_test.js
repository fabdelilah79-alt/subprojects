/*
Rôle : paillasses (3) filtration sous vide des grains de savon (buchner_poste.js) ; (4) test de la mousse : trois tubes
       bouchés dans un porte-tubes (eau + savon obtenu, eau + savon du commerce, eau seule) ; on secoue un tube : s'il
       contient du savon, une mousse se forme au-dessus de l'eau et reste quelques minutes.
Reçoit : le groupe SVG de chaque paillasse.
Produit : Labo.poste_filtration_savon, Labo.poste_mousse (groupe) -> { pense_bete } ; faits « filtration_savon » (voir
          buchner_poste.js) et « mousse » = { 1, 2, 3 : hauteur de mousse (0 à 1) }.
Utilisé par : simulation.js.
*/
(function (L) {
  const SOL = 576, E = 1.6;

  L.poste_filtration_savon = function (g) {
    // Le mélange du relargage (grains de savon dans l'eau salée) est filtré ; le savon reste sur le papier.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230), ctx = L.paillasse_chimie(g);
    L.ecoulement(ctx, { sol: SOL, e: E });
    L.filtration_buchner(ctx, { fait: "filtration_savon", melange: { contenu: { eau_salee: 140, savon_grains: 25 }, etiquette: "savon + eau salée" }, retenu: { savon_grains: null }, residu_rgb: [246, 240, 222] });
    return { pense_bete };
  };

  function dessiner_mousse(g, tubes) {
    // Mousse blanche au-dessus de l'eau de chaque tube posé dans le porte-tubes.
    g.replaceChildren();
    for (const t of tubes) {
      if (!t.mousse || !t.place || t.tenu) continue;
      const bas = t.pose.y - t.pr.hauteur_de(t.c.volume()) * E, haut = bas - t.mousse * 45 * E;
      L.svg("rect", { x: t.pose.x - 11, y: haut, width: 22, height: bas - haut, rx: 4, fill: "#fbfbf8", opacity: 0.92 }, g);
      for (let k = 0; k < 10; k++) L.svg("circle", { cx: t.pose.x - 8 + ((k * 7) % 16), cy: haut + 3 + ((k * 11) % Math.max(4, bas - haut - 4)), r: 2.2, fill: "none", stroke: "#d6dde0", "stroke-width": 0.6 }, g);
    }
  }

  L.poste_mousse = function (g) {
    // Trois tubes bouchés ; secoués (accélération forte), ceux qui contiennent du savon moussent.
    L.affiche_securite(g, 780, 56);
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230), ctx = L.paillasse_chimie(g);
    L.ecoulement(ctx, { sol: SOL, e: E });
    const g_mousse = L.svg("g", { "pointer-events": "none" }, ctx.devant);
    const rack = L.porte_tubes(ctx, { x: 500, sol: SOL, e: E, n: 3, pas: 40 });
    const noms = [["eau_savon_obtenu", "1"], ["eau_savon_commerce", "2"], ["eau", "3"]];
    const tubes = noms.map(([liquide, texte], k) => {
      const t = L.recipient(ctx, { id: `m${k + 1}`, profil: "tube", x: rack[k].x, y: rack[k].y, contenu: { [liquide]: 5 }, bouchon: true, etiquette: texte });
      t.place = rack[k]; t.mousse = 0;
      L.manipuler(ctx, t, { sol: SOL, supports: rack, pose_libre: false });
      return t;
    });
    [["1 : eau + savon obtenu", 470], ["2 : eau + savon du commerce", 490], ["3 : eau seule (témoin)", 510]].forEach(([t, y]) => L.texte(ctx.fond, 700, y, t, { "font-size": 8, "font-weight": 700, fill: "#e8e2cc", "text-anchor": "start" }));
    let avant = "";
    ctx.ecoulement.sur_pas((dt) => {
      for (const t of tubes) {
        const savon = t.c.phases.some((p) => Object.keys(p.liquides).some((n) => L.LIQUIDES[n].mousse));
        if (t.tenu && t.bouchon && savon && Math.hypot(t.acc.x, t.acc.y) > 2500) t.mousse = Math.min(1, t.mousse + dt * 0.8);
        else t.mousse = Math.max(0, t.mousse - dt / 120);
      }
      dessiner_mousse(g_mousse, tubes);
      const v = Object.fromEntries(tubes.map((t, k) => [k + 1, Math.round(t.mousse * 10) / 10])), s = JSON.stringify(v);
      if (s !== avant) { avant = s; L.missions.noter("mousse", v); }
    });
    return { pense_bete };
  };
})(window.Labo);
