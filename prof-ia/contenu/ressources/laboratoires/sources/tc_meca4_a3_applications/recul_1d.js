/*
Rôle : scène de recul, vue de côté : deux corps immobiles se repoussent (l'enfant saute de la barque, le canon tire
       sa bille). Le corps 1 part avec la vitesse v1 ; le corps 2 recule avec v2 = −m1·v1 / m2 (conservation de la
       quantité de mouvement). Une photographie à pose multiple marque un point repère de chaque corps à intervalles réguliers.
Reçoit : le groupe SVG ; { nom, photo_s, duree_s, echelle (px par m), origine_px, sol_y, corps: [c1, c2], bouton: { x, y, texte } } ;
         chaque corps : { masse, x0 (m), v (m/s, pour c1), arret(x) (vrai quand il s'arrête), dessiner(groupe, x_px, etat),
         repere_y (hauteur du point repère, ou fonction de l'état), couleur (null : pas de point sur la photographie) }.
Produit : Labo.scene_recul(groupe, reglages) -> { etat } ; fait noté « <nom> » = { fini: oui } à la fin de la photographie.
Utilisé par : barque.js, canon.js.
*/
(function (L) {
  function photographier(s, groupe) {
    // Une image : un point repère (et un trait vers la graduation) pour chaque corps.
    s.corps.forEach((c, i) => {
      if (!c.couleur) return;
      const x = s.origine_px + s.etat.x[i] * s.echelle, y = typeof c.repere_y === "function" ? c.repere_y(s.etat) : c.repere_y;
      L.svg("line", { x1: x, y1: y, x2: x, y2: s.sol_y, stroke: c.couleur, "stroke-width": 0.8, opacity: 0.6, "stroke-dasharray": "2 2" }, groupe);
      L.svg("circle", { cx: x, cy: y, r: 3.5, fill: c.couleur, stroke: "#111", "stroke-width": 0.6 }, groupe);
    });
  }

  function avancer(s, dt, photos) {
    // Les corps avancent à vitesse constante jusqu'à leur arrêt ; une photo toutes les photo_s, au pas de 2 ms.
    const e = s.etat;
    for (let reste = dt; reste > 1e-6 && e.parti && !e.fini; reste -= 0.002) {
      const pas = Math.min(0.002, reste);
      s.corps.forEach((c, i) => { if (!e.arrete[i]) { e.x[i] += e.v[i] * pas; e.arrete[i] = c.arret(e.x[i]); } });
      e.t += pas;
      e.photo -= pas;
      if (e.photo <= 1e-9) { e.photo += s.photo_s; photographier(s, photos); }
      if (e.t >= s.duree_s) { e.fini = true; L.missions.noter(s.nom, { fini: true }); }
    }
  }

  L.scene_recul = function (g, s) {
    // Construit les deux corps, la photographie et le bouton qui déclenche (puis remet en place).
    const [c1, c2] = s.corps, depart = () => ({ x: [c1.x0, c2.x0], v: [0, 0], arrete: [false, false], parti: false, fini: false, t: 0, photo: 0 });
    s.etat = depart();
    const dessins = [L.svg("g", {}, g), L.svg("g", {}, g)], photos = L.svg("g", { "pointer-events": "none" }, g);
    L.bouton_poussoir(g, s.bouton.x, s.bouton.y, {
      textes: [s.bouton.texte, "Recommencer"],
      sur_changement: (enfonce) => {
        photos.replaceChildren();
        s.etat = depart();
        if (enfonce) Object.assign(s.etat, { parti: true, v: [c1.v, (-c1.masse * c1.v) / c2.masse] });
      },
    });
    let avant = null;
    const image = (instant) => {
      const dt = avant === null ? 0 : Math.min(0.05, (instant - avant) / 1000);
      avant = instant;
      avancer(s, dt, photos);
      s.corps.forEach((c, i) => { dessins[i].replaceChildren(); c.dessiner(dessins[i], s.origine_px + s.etat.x[i] * s.echelle, s.etat); });
      requestAnimationFrame(image);
    };
    requestAnimationFrame(image);
    return s;
  };
})(window.Labo);
