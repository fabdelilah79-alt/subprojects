/*
Rôle : banc de conductimétrie (1 px/mm) : agitateur magnétique, sonde du conductimètre sur sa tige (pince et noix), boîtier
       du conductimètre (calibre automatique µS/cm – mS/cm, conductivité calculée sur les ions à l'équilibre), quatre béchers
       de 100 mL (70 mL de solution chacun) sur la paillasse ; on pose un bécher sur l'agitateur, on agite, on descend la
       sonde et on lit σ quand l'affichage est stable ; arrêter l'agitateur avant d'enlever le bécher et le déplacer doucement (secoué, il déborde, parfois dans le bécher voisin).
Reçoit : le groupe SVG de la paillasse et { bechers [{ id, liquide, etiquette }] (quatre au plus), fait (nom du fait noté) }.
Produit : Labo.banc_conductimetrie(g, reglage) -> { pense_bete } ; fait <fait> = { plonge, dans, sigma (µS/cm, lu), stable,
          mesures { id: σ lu en µS/cm (stable) } }.
Utilisé par : les simulations de l'état d'équilibre (2e année du bac).
*/
(function (L) {
  const SOL = 576, E = 1, X = 510, PLACES = [225, 292, 359, 628];

  L.banc_conductimetrie = function (g, { bechers, fait }) {
    // Agitateur, tige, conductimètre, béchers déplaçables entre leurs places et le plateau ; mesures stables notées.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230), ctx = L.paillasse_chimie(g);
    L.ecoulement(ctx, { sol: SOL, e: E });
    const agit = L.agitateur_magnetique(ctx, { x: X, sol: SOL, e: E });
    L.pied_support(ctx.fond, 430, SOL, 200);
    const places = PLACES.slice(0, bechers.length).map((x) => ({ x, y: SOL })), supports = [...places, agit.station];
    let cond = null;
    const recipients = bechers.map(({ id, liquide, etiquette }, k) => {
      const r = L.recipient(ctx, { id, profil: "becher_100", x: places[k].x, y: SOL, e: E, contenu: { [liquide]: 70 }, etiquette });
      r.place = places[k];
      L.manipuler(ctx, r, { sol: SOL, supports, pose_libre: false, autoriser: () => !(cond && cond.etat().plonge && r.place === agit.station) });
      return r;
    });
    cond = L.conductimetre(ctx, { x: 765, sol: SOL, e: E, tige: 430, sonde_x: 528, haut: 360, bas: agit.station.y - 3, recipients: () => recipients, agite: agit.agite, equilibre: true, micro: true });
    const mesures = {};
    ctx.ecoulement.sur_pas(() => {
      const sur = recipients.find((r) => r.place === agit.station);
      if (sur) agit.suivre(sur);
      const c = cond.etat(), lu = Number(c.affiche.replace(",", ".")) * (c.unite === "mS/cm" ? 1000 : 1);
      if (c.stable && c.plonge && c.dans) mesures[c.dans] = lu;
      L.missions.noter(fait, { plonge: c.plonge, dans: c.dans, sigma: lu, stable: c.stable, mesures: { ...mesures } });
    });
    return { pense_bete };
  };
})(window.Labo);
