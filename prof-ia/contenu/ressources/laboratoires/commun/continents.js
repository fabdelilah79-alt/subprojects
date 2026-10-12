/*
Rôle : contours simplifiés des continents (latitude, longitude en degrés) et projection orthographique :
       la Terre vue de l'espace, centrée sur l'Afrique et le Maroc, avec des côtes reconnaissables.
Reçoit : le rayon de dessin et le centre de la vue (latitude, longitude).
Produit : Labo.continents(rayon) -> liste de chemins SVG (une terre émergée par chemin), lissés.
Utilisé par : espace.js (Terre).
*/
(function (L) {
  const CENTRE = { lat: 18, lon: 12 };
  const TERRES = [
    // Afrique (de Tanger, vers l'est, puis le tour du continent)
    [[35.8, -5.9], [35.2, -2], [36.8, 3], [37.1, 10], [33.8, 10.5], [32.5, 15.5], [30.4, 19.3], [32.3, 23.2], [31.5, 29.5], [31.3, 32.2], [29.5, 32.6], [22.5, 36.6], [15.5, 39.4], [12.5, 43.4], [11.8, 51.2], [7, 49.7], [2, 45.5], [-4, 39.7], [-10.4, 40.4], [-15, 40.7], [-19.8, 34.9], [-25.9, 32.6], [-29.8, 31], [-33.9, 25.6], [-34.8, 20], [-33.9, 18.4], [-29.2, 16.8], [-22.9, 14.5], [-17.2, 11.7], [-12.4, 13.6], [-8.8, 13.2], [-4.6, 11.8], [-0.7, 8.8], [4, 9.6], [4.3, 6.2], [6.4, 3.4], [5.6, -0.2], [5, -4], [4.4, -7.5], [6.3, -10.8], [8.5, -13.2], [11, -15.3], [14.7, -17.4], [20.8, -17.1], [24, -16], [27.7, -13.2], [30.4, -9.6], [33.6, -7.6], [35.8, -5.9]],
    // Madagascar
    [[-12, 49.3], [-15.9, 50.3], [-25, 47.1], [-25.4, 44.8], [-20, 44.1], [-16, 44.5], [-12, 49.3]],
    // Péninsule arabique et Proche-Orient
    [[29.5, 34.9], [27.9, 35.2], [21.5, 39.2], [16.5, 42.7], [12.8, 44.9], [14.5, 49.1], [16.8, 53.4], [22.5, 59.8], [24.4, 56.6], [26.2, 56.3], [24.2, 51.6], [26, 50.1], [29.3, 48], [30.5, 47.8], [37, 42], [37, 36.3], [35.5, 35.8], [33, 35.1], [31.4, 34.3], [29.5, 34.9]],
    // Europe (péninsule Ibérique, France, Italie, Balkans, Turquie, plaine du Nord)
    [[36.1, -5.4], [37, -8.9], [38.7, -9.5], [42.9, -9.3], [43.5, -1.6], [46.2, -1.2], [47.8, -4.4], [48.6, -1.6], [49.7, 0.2], [51, 2.4], [53.4, 6.9], [54.8, 8.6], [57.6, 10.5], [55.6, 12.6], [54.4, 13.6], [54.4, 18.6], [57.4, 21.5], [59.4, 24.7], [60.2, 30], [56, 44], [47, 44], [45.3, 36.5], [41.6, 41.6], [41, 29], [40.4, 26.5], [37.7, 24], [36.4, 22.5], [39.6, 20], [42.4, 18.5], [45.6, 13.7], [44.3, 12.3], [41.9, 15.9], [40, 18.4], [38, 15.6], [40.6, 14.3], [42.3, 11.2], [44.4, 8.8], [43.3, 5.4], [43.3, 3.5], [41.4, 2.2], [39.5, -0.3], [36.7, -2.2], [36.1, -5.4]],
    // Grande-Bretagne
    [[50, -5.6], [50.8, 0.3], [51.4, 1.4], [53, 0.4], [55, -1.4], [57.6, -1.9], [58.6, -3.1], [57.9, -5.3], [55.3, -5.1], [54, -3.1], [53.3, -4.5], [51.6, -5], [50, -5.6]],
    // Amérique du Sud (côte est, visible au bord gauche)
    [[10.5, -66], [5.8, -55], [4, -51.5], [0, -50], [-2.5, -44.3], [-5.2, -35.3], [-8.1, -34.9], [-13, -38.5], [-22.9, -42], [-25, -48], [-34.9, -56], [-40, -62.3], [-55, -68], [-40, -73.5], [-18, -70.5], [-5, -81], [7, -78], [10.5, -66]],
  ];

  function projeter(lat, lon) {
    // Projection orthographique (vue de loin) : point (x, y) sur le disque de rayon 1, et s'il est visible.
    const r = Math.PI / 180, l0 = CENTRE.lat * r, p = lat * r, dl = (lon - CENTRE.lon) * r;
    const visible = Math.sin(l0) * Math.sin(p) + Math.cos(l0) * Math.cos(p) * Math.cos(dl);
    return { x: Math.cos(p) * Math.sin(dl), y: -(Math.cos(l0) * Math.sin(p) - Math.sin(l0) * Math.cos(p) * Math.cos(dl)), visible };
  }

  function lisser(points) {
    // Chemin fermé qui passe au milieu de chaque côté et s'arrondit sur les sommets (côtes douces).
    const milieu = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    const n = points.length;
    let d = `M${milieu(points[n - 1], points[0]).map((v) => v.toFixed(2)).join(" ")}`;
    for (let i = 0; i < n; i++) d += ` Q${points[i].map((v) => v.toFixed(2)).join(" ")} ${milieu(points[i], points[(i + 1) % n]).map((v) => v.toFixed(2)).join(" ")}`;
    return d + " Z";
  }

  L.continents = function (rayon) {
    // Chemins des terres visibles ; un point caché derrière la Terre est ramené sur le bord du disque.
    return TERRES.map((terre) => lisser(terre.slice(0, -1).map(([lat, lon]) => {
      const p = projeter(lat, lon);
      const k = p.visible < 0 ? 1 / Math.hypot(p.x, p.y) : 1;
      return [p.x * k * rayon, p.y * k * rayon];
    })));
  };
})(window.Labo);
