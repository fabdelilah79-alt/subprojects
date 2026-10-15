/*
Rôle : solide formé de deux palets autoporteurs de masses différentes, reliés par une tige rigide légère ; chaque palet
       a son électrode (marques A et B sur la feuille). Lancé d'un geste, le solide avance en tournant sur lui-même :
       son centre d'inertie G (sur AB, plus près du palet lourd) va en ligne droite à vitesse constante.
Reçoit : la table à coussin d'air (Labo.CoussinAir) à transformer ; { m_a, m_b (kg), ab (mm) }.
Produit : Labo.palets_solidaires(table, reglages) -> { ga, gb } (mm) ; la table reçoit solide, marge, marques(),
          dessiner_mobile() et lancer() propres au solide.
Utilisé par : simulation.js.
*/
(function (L) {
  const R_A = 34, R_B = 28;

  L.palets_solidaires = function (table, { m_a = 0.4, m_b = 0.2, ab = 120 } = {}) {
    // Remplace le mobile de la table par le solide ; G est placé au milieu de la moitié gauche de la table.
    const ga = (m_b / (m_a + m_b)) * ab, gb = ab - ga, vers_ecran = L.CoussinAir.vers_ecran;
    Object.assign(table, { solide: { angle: -0.4, omega: 0 }, marge: gb + R_B, pos: { x: 160, y: 200 } });
    const bouts = () => {
      const u = { x: Math.cos(table.solide.angle), y: Math.sin(table.solide.angle) };
      return { a: { x: table.pos.x - ga * u.x, y: table.pos.y - ga * u.y }, b: { x: table.pos.x + gb * u.x, y: table.pos.y + gb * u.y } };
    };
    table.marques = bouts;
    table.dessiner_mobile = function () {
      // Tige entre les deux palets, puis les palets du plus lointain au plus proche.
      const { a, b } = bouts(), pa = vers_ecran(a.x, a.y), pb = vers_ecran(b.x, b.y);
      this.mobile.replaceChildren();
      const ordre = [[pa, R_A, { surcharge: true }], [pb, R_B, {}]].sort((x, y) => x[0].y - y[0].y);
      L.dessiner_palet(this.mobile, ...ordre[0]);
      L.tige(this.mobile, `M${pa.x} ${pa.y - 9} L${pb.x} ${pb.y - 9}`, 4);
      L.dessiner_palet(this.mobile, ...ordre[1]);
    };
    table.lancer = function (historique) {
      // Vitesse du geste pour G ; le solide part en tournant (plus vite s'il est lancé plus vite).
      L.CoussinAir.prototype.lancer.call(this, historique);
      const v = Math.hypot(this.vitesse.x, this.vitesse.y);
      this.solide.omega = v > 20 ? Math.max(1.2, Math.min(4, v / 150)) : 0;
    };
    table.dessiner_mobile();
    return { ga, gb };
  };
})(window.Labo);
