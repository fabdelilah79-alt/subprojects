/*
Rôle : les deux paillasses de l'activité « masse des atomes » : (1) le tableau magnétique où l'on construit un atome ;
       (2) une balance au centième de gramme, des cylindres de cuivre, d'aluminium et de fer, et une fiche des constituants
       de l'atome (masses et charges) affichée au mur.
Reçoit : le groupe SVG de chaque paillasse.
Produit : Labo.poste_atome(groupe), Labo.poste_masse(groupe) -> { pense_bete } ; faits « atome » (tableau_atome.js) et
          « pesee » = { sur_balance : [métaux sur le plateau], lecture (g, ou null si instable ou éteinte) }.
Utilisé par : simulation.js.
*/
(function (L) {
  const SOL = 576, E = 1.6;
  const FICHE = [["particule", "masse (kg)", "charge"], ["proton", "1,673 × 10⁻²⁷", "+e"], ["neutron", "1,675 × 10⁻²⁷", "0"], ["électron", "9,11 × 10⁻³¹", "−e"]];

  L.poste_atome = function (g) {
    // Paillasse 1 : le tableau magnétique.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 200);
    L.tableau_atome(g, "atome");
    return { pense_bete };
  };

  function fiche(g) {
    // Fiche murale : masses et charges des constituants de l'atome ; e = 1,6 × 10⁻¹⁹ C.
    L.svg("rect", { x: 560, y: 60, width: 300, height: 128, rx: 3, fill: "#fdfdf8", stroke: "#c9c4b0", filter: "url(#ombre)" }, g);
    L.texte(g, 710, 78, "Constituants de l'atome", { "font-size": 11, "font-weight": 700, fill: "#23315a" });
    FICHE.forEach((ligne, i) => ligne.forEach((t, j) => L.texte(g, 600 + j * 110, 100 + i * 18, t, { "font-size": 9.5, "font-weight": i ? 400 : 700, fill: "#222" })));
    L.texte(g, 710, 178, "charge élémentaire : e = 1,6 × 10⁻¹⁹ C", { "font-size": 9, fill: "#222" });
  }

  L.poste_masse = function (g) {
    // Paillasse 2 : balance, cylindres de métal sur leur plaque, fiche des constituants.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230), ctx = L.paillasse_chimie(g);
    fiche(ctx.fond);
    const b = L.balance_electronique(ctx, { x: 360, sol: SOL, e: E });
    const ech = L.echantillons_metal(ctx, b, [{ id: "cu", metal: "cuivre", x: 600 }, { id: "al", metal: "aluminium", x: 670 }, { id: "fe", metal: "fer", x: 740 }], { sol: 560, e: E });
    const noter = () => L.missions.noter("pesee", { sur_balance: ech.filter((o) => o.sur_balance).map((o) => o.metal), lecture: b.lecture() });
    b.sur_changement(noter); noter();
    return { pense_bete };
  };
})(window.Labo);
