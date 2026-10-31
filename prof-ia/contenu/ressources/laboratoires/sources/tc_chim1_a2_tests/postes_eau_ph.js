/*
Rôle : paillasses (1) test de l'eau : sulfate de cuivre anhydre, quatre verres de montre (jus d'orange, papier sec, huile,
       eau distillée en témoin), trois béchers d'échantillon avec leur pipette Pasteur ; (2) acide ou basique : cinq béchers
       (jus d'orange, vinaigre, eau distillée, eau savonneuse, eau de chaux) avec leur pipette, carreau de bandes de papier
       pH, boîte et son échelle de teintes, flacon de phénolphtaléine. Matériel aux vraies dimensions (1,6 px par mm).
Reçoit : le groupe SVG de chaque paillasse.
Produit : Labo.poste_eau, Labo.poste_ph (groupe) -> { pense_bete } ; faits notés « test_eau » = { n : { poudre, liquide } }
          et « test_ph » = { n : { pH (lu sur la bande n) ou null, phenol, rose } } ; Labo.paillasse_physique(g).
Utilisé par : simulation.js.
*/
(function (L) {
  const SOL = 576, E = 1.6;

  L.paillasse_physique = function (g) {
    // Affiche de sécurité, pense-bête, plans de dessin, écoulement des liquides ; noter(cle, f) note un fait s'il a changé.
    L.affiche_securite(g, 780, 56);
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230), ctx = L.paillasse_chimie(g);
    L.ecoulement(ctx, { sol: SOL, e: E });
    ctx.noter = (cle, f) => {
      let avant = "";
      const maj = () => { const v = f(), s = JSON.stringify(v); if (s !== avant) { avant = s; L.missions.noter(cle, v); } };
      ctx.sur_changement(maj); ctx.ecoulement.sur_pas(maj); maj();
    };
    return { pense_bete, ctx };
  };

  L.echantillon = function (ctx, { id, x, y, liquide, texte, V = 25 }) {
    // Bécher de 50 mL fixe, étiqueté, avec sa pipette Pasteur.
    const b = L.recipient(ctx, { id, profil: "becher_50", x, y, contenu: { [liquide]: V }, etiquette: texte });
    L.flacon_gouttes(ctx, { id: `pip_${id}`, becher: b, e: E });
    return b;
  };

  L.poste_eau = function (g) {
    // Paillasse 1 : poudre dans chaque verre de montre, puis gouttes de chaque liquide ; le papier est déjà posé dans le 2.
    const { pense_bete, ctx } = L.paillasse_physique(g);
    L.poudre_sulfate(ctx, { x: 236, bas: 536, repos: { x: 190, y: 584 }, echelle: E });
    const noms = [["jus_orange", "jus d'orange"], [null, "papier sec"], ["huile", "huile"], ["eau", "eau distillée"]];
    const verres = noms.map(([liquide, texte], k) => {
      const x = 390 + k * 120;
      if (liquide) L.echantillon(ctx, { id: `b${k + 1}`, x, y: 500, liquide, texte: `${k + 1} ${texte}` });
      L.carte_chimie(ctx.fond, x, 573, `${k + 1} ${texte}`);
      return L.verre_montre(ctx, { id: `v${k + 1}`, x, sol: 564, e: E, diametre: 60, solide: liquide ? null : "papier" });
    });
    ctx.noter("test_eau", () => {
      const etat = {};
      verres.forEach((v, k) => { etat[k + 1] = { poudre: v.c.poudre ? (v.poudre_bleue() ? "bleue" : "blanche") : null, liquide: v.c.recus.length > 0 }; });
      return etat;
    });
    return { pense_bete };
  };

  L.poste_ph = function (g) {
    // Paillasse 2 : une goutte de chaque liquide sur sa bande de papier pH ; phénolphtaléine dans les béchers.
    const { pense_bete, ctx } = L.paillasse_physique(g);
    const noms = [["jus_orange", "jus d'orange"], ["vinaigre", "vinaigre"], ["eau", "eau distillée"], ["eau_savonneuse", "eau savonneuse"], ["eau_chaux", "eau de chaux"]];
    L.boite_ph(ctx.fond, 38, 440);
    L.flacon_gouttes(ctx, { id: "phenol", x: 226, sol: 528, e: E, liquide: "phenolphtaleine", texte: "Phénol-\nphtaléine" });
    const xs = noms.map((_, k) => 330 + k * 115);
    const carreau = L.carreau_ph(ctx, { x1: 286, x2: 834, sol: 572, e: E, bandes: xs });
    const bechers = noms.map(([liquide, texte], k) => L.echantillon(ctx, { id: `b${k + 1}`, x: xs[k], y: 520, liquide, texte: `${k + 1} ${texte}` }));
    ctx.noter("test_ph", () => {
      const etat = {};
      bechers.forEach((b, k) => {
        const ph = b.c.phases.find((p) => p.classe === "aqueuse"), phenol = (ph?.liquides.phenolphtaleine || 0) > 0;
        etat[k + 1] = { pH: carreau.bandes[k].pH, phenol, rose: phenol && L.pH_phase(ph) >= 8.2 };
      });
      return etat;
    });
    return { pense_bete };
  };
})(window.Labo);
