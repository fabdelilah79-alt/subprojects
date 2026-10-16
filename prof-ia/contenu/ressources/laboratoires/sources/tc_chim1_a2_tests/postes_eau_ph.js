/*
Rôle : paillasses (1) test de l'eau : sulfate de cuivre anhydre, quatre verres de montre (jus d'orange, papier sec, huile,
       eau distillée en témoin) ; (2) acide ou basique : cinq béchers (jus d'orange, vinaigre, eau distillée, eau
       savonneuse, eau de chaux), papier pH et son échelle de teintes, phénolphtaléine.
Reçoit : le groupe SVG de chaque paillasse.
Produit : Labo.poste_eau, Labo.poste_ph (groupe) -> { pense_bete } ; faits notés « test_eau » = { n : { poudre, liquide } }
          et « test_ph » = { n : { pH (lu sur la bande) ou null, phenol, rose } }.
Utilisé par : simulation.js.
*/
(function (L) {
  L.carte_chimie = function (g, x, y, lignes) {
    // Petite carte posée sur la paillasse devant un échantillon (numéro et nom).
    L.svg("rect", { x: x - 30, y, width: 60, height: 8 + 8 * lignes.length, rx: 1, fill: "#fbfaf3", stroke: "#cfcab8", "stroke-width": 0.5, filter: "url(#ombre)" }, g);
    lignes.forEach((t, i) => L.texte(g, x, y + 8 + i * 8, t, { "font-size": i ? 6.5 : 7.5, "font-weight": i ? 400 : 700, fill: "#23315a" }));
  };

  function decor(g, numero) {
    // Affiche de sécurité au mur et pense-bête.
    L.affiche_securite(g, 780, 56);
    return L.decor.pense_bete(g, 24, 52, 230);
  }

  L.poste_eau = function (g) {
    // Paillasse 1 : poudre dans chaque verre de montre, puis gouttes de chaque liquide ; le papier est déjà posé dans le 2.
    const pense_bete = decor(g, 0), ctx = L.paillasse_chimie(g);
    L.poudre_sulfate(ctx, { x: 270, bas: 522, repos: { x: 236, y: 566 } });
    const noms = [["jus_orange", "jus d'orange"], [null, "papier sec"], ["huile", "huile"], ["eau", "eau distillée"]];
    const coupelles = noms.map(([produit, texte], k) => {
      const x = 400 + k * 95;
      if (produit) L.becher_echantillon(ctx, { id: `b${k + 1}`, x, bas: 478, produit, texte: String(k + 1) });
      L.carte_chimie(ctx.fond, x, 548, [String(k + 1), texte]);
      return L.coupelle_chimie(ctx, { id: `v${k + 1}`, x, y: 528, solide: produit ? null : "papier" });
    });
    ctx.sur_changement(() => {
      const etat = {};
      coupelles.forEach((v, k) => { etat[k + 1] = { poudre: v.c.poudre ? (v.poudre_bleue() ? "bleue" : "blanche") : null, liquide: v.c.recus.length > 0 }; });
      L.missions.noter("test_eau", etat);
    });
    ctx.signaler();
    return { pense_bete };
  };

  function boite_ph(g, x, y) {
    // Boîte de papier pH universel avec son échelle de teintes de 1 à 14.
    L.svg("rect", { x: x + 3, y: y + 4, width: 150, height: 42, fill: "#000", opacity: 0.25, filter: "url(#flou)" }, g);
    L.svg("rect", { x, y, width: 150, height: 42, rx: 2, fill: "#f6f3e8", stroke: "#b9b19a" }, g);
    L.texte(g, x + 75, y + 8, "PAPIER pH universel 1 – 14", { "font-size": 6.5, "font-weight": 700, fill: "#23315a" });
    for (let k = 1; k <= 14; k++) {
      L.svg("rect", { x: x + 5 + (k - 1) * 10, y: y + 14, width: 9, height: 13, fill: L.couleur_ph(k) }, g);
      L.texte(g, x + 9.5 + (k - 1) * 10, y + 34, String(k), { "font-size": 5.5, fill: "#333" });
    }
  }

  L.poste_ph = function (g) {
    // Paillasse 2 : une goutte de chaque liquide sur sa bande de papier pH ; phénolphtaléine dans les béchers.
    const pense_bete = decor(g, 1), ctx = L.paillasse_chimie(g);
    const noms = [["jus_orange", "jus d'orange"], ["vinaigre", "vinaigre"], ["eau", "eau distillée"], ["eau_savonneuse", "eau savonneuse"], ["eau_chaux", "eau de chaux"]];
    L.flacon_reactif(ctx, { id: "phenol", x: 250, bas: 482, reactif: "phenolphtaleine", texte: "Phénol-\nphtaléine", dose: 0.1, n: 2 });
    boite_ph(ctx.fond, 790, 440);
    const postes = noms.map(([produit, texte], k) => {
      const x = 330 + k * 92;
      const b = L.becher_echantillon(ctx, { id: `b${k + 1}`, x, bas: 478, produit, texte: String(k + 1) });
      L.carte_chimie(ctx.fond, x, 548, [String(k + 1), texte]);
      return { b, v: L.coupelle_chimie(ctx, { id: `p${k + 1}`, x, y: 528, bande_ph: true }), produit };
    });
    ctx.sur_changement(() => {
      const etat = {};
      postes.forEach(({ b, v, produit }, k) => {
        const phenol = (b.m.volumes.phenolphtaleine || 0) > 0;
        etat[k + 1] = { pH: v.c.bande_ph.tache ? L.CHIMIE.produits[produit].pH : null, phenol, rose: phenol && b.m.pH() >= 8.2 };
      });
      L.missions.noter("test_ph", etat);
    });
    ctx.signaler();
    return { pense_bete };
  };
})(window.Labo);
