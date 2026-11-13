/*
Rôle : paillasse « pH et taux d'avancement final » (1 px/mm) : pH-mètre à étalonner, électrode sur sa tige au-dessus de
       l'agitateur magnétique ; cinq béchers de 50 mL (40 mL chacun) : tampons pH 4,00 et pH 7,00, acide chlorhydrique,
       acide méthanoïque et acide éthanoïque à 1,0 × 10⁻² mol/L. On pose un bécher sur l'agitateur, on descend l'électrode,
       on lit le pH quand l'affichage est stable.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_acides(g) -> { pense_bete } ; fait « ph_acides » = { cal7, cal4, plonge, dans, affiche, stable,
          mesures { id: pH lu (stable, après étalonnage) } }.
Utilisé par : simulation.js.
*/
(function (L) {
  const SOL = 576, E = 1, X = 510;
  const BECHERS = [["tampon4", "tampon_4", "pH 4", 220], ["tampon7", "tampon_7", "pH 7", 275], ["hcl", "eq_hcl", "HCl", 330], ["methanoique", "eq_methanoique", "HCOOH", 610], ["ethanoique", "eq_ethanoique", "CH₃COOH", 665]];

  L.poste_acides = function (g) {
    // Agitateur, tige, pH-mètre, béchers déplaçables entre leurs places et le plateau ; mesures notées.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230), ctx = L.paillasse_chimie(g);
    L.ecoulement(ctx, { sol: SOL, e: E });
    const agit = L.agitateur_magnetique(ctx, { x: X, sol: SOL, e: E });
    L.pied_support(ctx.fond, 430, SOL, 200);
    const places = BECHERS.map(([, , , x]) => ({ x, y: SOL })), supports = [...places, agit.station];
    let metre = null;
    const recipients = BECHERS.map(([id, liquide, etiquette], k) => {
      const r = L.recipient(ctx, { id, profil: "becher_50", x: places[k].x, y: SOL, e: E, contenu: { [liquide]: 40 }, etiquette });
      r.place = places[k];
      L.manipuler(ctx, r, { sol: SOL, supports, pose_libre: false, autoriser: () => !(metre && metre.etat().plonge && r.place === agit.station) });
      return r;
    });
    metre = L.ph_metre(ctx, { x: 780, sol: SOL, e: E, tige: 430, sonde_x: 516, haut: 360, bas: agit.station.y - 4, recipients: () => recipients, agite: agit.agite });
    const mesures = {};
    ctx.ecoulement.sur_pas(() => {
      const sur = recipients.find((r) => r.place === agit.station);
      if (sur) agit.suivre(sur);
      const m = metre.etat();
      if (m.stable && m.cal4 && m.dans) mesures[m.dans] = m.affiche;
      L.missions.noter("ph_acides", { cal7: m.cal7, cal4: m.cal4, plonge: m.plonge, dans: m.dans, affiche: m.affiche, stable: m.stable, mesures: { ...mesures } });
    });
    return { pense_bete };
  };
})(window.Labo);
