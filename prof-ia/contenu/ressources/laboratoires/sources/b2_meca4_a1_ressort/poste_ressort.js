/*
Rôle : paillasse « solide-ressort horizontal » : banc à coussin d'air, mobile de 200 g relié à un ressort de 10 N/m (ressort
       de rechange de 20 N/m), surcharges de 100 g, palette et aimant de freinage ; capteur de position, interface et
       logiciel x(t). À chaque lâcher, l'essai est noté (masse, raideur, amortisseur, écart initial, période propre).
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_ressort(g) -> { pense_bete } ; faits « essais_ressort » = [{ id, m, k, amortisseur, x0 (m), T0 (s) }],
          « montage », « acquisition ».
Utilisé par : simulation.js (paillasse 2).
*/
(function (L) {
  const DECALAGE = 0.3, fr = (v, n) => v.toFixed(n).replace(".", ",");

  function fiche(g) {
    // Fiche des données collée au mur.
    L.svg("rect", { x: 272, y: 48, width: 264, height: 78, rx: 3, fill: "#fdfdf8", stroke: "#c9c4b0", filter: "url(#ombre)" }, g);
    L.texte(g, 404, 64, "Oscillateur solide-ressort", { "font-size": 9.5, "font-weight": 700, fill: "#23315a" });
    ["Mobile : 200 g ; surcharges : 100 g chacune", "Ressort bleu : k = 10 N/m ; vert : k = 20 N/m", "Capteur : x = 0 après « Zéro » (mobile au repos)"].forEach((t, i) => L.texte(g, 404, 81 + i * 15, t, { "font-size": 8, fill: "#222" }));
  }

  L.poste_ressort = function (g) {
    // Banc, accessoires, chaîne d'acquisition ; le lâcher déclenche l'acquisition et note l'essai.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230), essais = [];
    fiche(g);
    const etiquette = () => `m = ${fr(banc.masse(), 1)} kg ; k = ${banc.e.k} N/m${banc.e.amortisseur === "aucun" ? "" : ` ; ${banc.e.amortisseur}`}`;
    const logiciel = L.logiciel_xt(g, { x: 560, y: 160, boitier: { x: 704, y: 508 }, etiquette });
    const banc = L.banc_ressort(g, {
      k: 10, h_base: 0.04,
      sur_pas: (t, x) => logiciel.mesurer(t, DECALAGE + x),
      sur_lacher: (x0) => {
        const e = banc.e;
        essais.push({ id: `essai${essais.length + 1}`, m: Math.round(banc.masse() * 1000) / 1000, k: e.k, amortisseur: e.amortisseur, x0: Math.round(x0 * 1000) / 1000, T0: Math.round(banc.T0() * 10000) / 10000 });
        L.missions.noter("essais_ressort", essais.slice()); logiciel.depart(e.t);
      },
    });
    L.accessoires_ressort(g, banc, { rechange: 20 });
    L.missions.noter("essais_ressort", []);
    return { pense_bete };
  };
})(window.Labo);
