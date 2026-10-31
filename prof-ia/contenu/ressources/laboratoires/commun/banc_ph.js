/*
Rôle : banc de pH-métrie (1 px/mm) : agitateur magnétique, électrode combinée sur sa tige, pH-mètre déjà étalonné (ph_metre.js,
       pH exact : equilibre_acide.js), cinq béchers de 50 mL (40 mL chacun) sur la paillasse ; on pose un bécher sur
       l'agitateur, on agite, on descend l'électrode et on lit le pH quand l'affichage est stable ; arrêter l'agitateur avant
       d'enlever le bécher et le déplacer doucement (secoué, il déborde).
Reçoit : le groupe SVG de la paillasse et { bechers [{ id, liquide, etiquette, contenu (facultatif : mélange { liquide: mL }) }]
         (cinq au plus), fait (nom du fait noté) }.
Produit : Labo.banc_ph(g, reglage) -> { pense_bete } ; fait <fait> = { plonge, dans, pH (lu), stable, mesures { id: pH lu (stable) } }.
Utilisé par : les simulations acide-base (2e année du bac).
*/
(function (L) {
  const SOL = 576, E = 1, X = 510, PLACES = [220, 275, 330, 610, 665];

  L.banc_ph = function (g, { bechers, fait }) {
    // Agitateur, tige, pH-mètre, béchers déplaçables entre leurs places et le plateau ; mesures stables notées.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230), ctx = L.paillasse_chimie(g);
    L.ecoulement(ctx, { sol: SOL, e: E });
    const agit = L.agitateur_magnetique(ctx, { x: X, sol: SOL, e: E });
    L.pied_support(ctx.fond, 430, SOL, 200);
    const places = PLACES.slice(0, bechers.length).map((x) => ({ x, y: SOL })), supports = [...places, agit.station];
    let metre = null;
    const recipients = bechers.map(({ id, liquide, etiquette, contenu }, k) => {
      const r = L.recipient(ctx, { id, profil: "becher_50", x: places[k].x, y: SOL, e: E, contenu: contenu || { [liquide]: 40 }, etiquette });
      r.place = places[k];
      L.manipuler(ctx, r, { sol: SOL, supports, pose_libre: false, autoriser: () => !(metre && metre.etat().plonge && r.place === agit.station) });
      return r;
    });
    metre = L.ph_metre(ctx, { x: 780, sol: SOL, e: E, tige: 430, sonde_x: 516, haut: 360, bas: agit.station.y - 4, recipients: () => recipients, agite: agit.agite, etalonne: true });
    const mesures = {};
    ctx.ecoulement.sur_pas(() => {
      const sur = recipients.find((r) => r.place === agit.station);
      if (sur) agit.suivre(sur);
      const m = metre.etat();
      if (m.stable && m.dans) mesures[m.dans] = m.affiche;
      L.missions.noter(fait, { plonge: m.plonge, dans: m.dans, pH: m.affiche, stable: m.stable, mesures: { ...mesures } });
    });
    return { pense_bete };
  };
})(window.Labo);
