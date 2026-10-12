/*
Rôle : vue réaliste de la Terre depuis l'espace, avec un rail gradué des altitudes (0 à 36 000 km, à l'échelle :
       1 px ≈ 58 km) et ses repères (ISS, satellites GPS, orbite géostationnaire). Une sonde de 1000 kg glisse le long
       du rail ; son capteur affiche l'altitude h et la force F exercée par la Terre : F = m·g0·R²/(R+h)².
Reçoit : le groupe SVG de la scène.
Produit : Labo.poste_altitude(groupe) -> {} ; fait noté : mesures_altitude = [{ h, F }].
Utilisé par : simulation.js.
*/
(function (L) {
  const TERRE = { x: 170, y: 560, R: 110 }, R_KM = 6400, G0 = 9.81, MASSE = 1000, H_MAX = 36000;
  const KM_PAR_PX = R_KM / TERRE.R, U = { x: Math.cos((40 * Math.PI) / 180), y: -Math.sin((40 * Math.PI) / 180) };
  const REPERES = [[400, "ISS"], [20200, "satellites GPS"], [35786, "orbite géostationnaire"]];
  const point = (h) => { const r = TERRE.R + h / KM_PAR_PX; return { x: TERRE.x + U.x * r, y: TERRE.y + U.y * r }; };
  const force = (h) => (MASSE * G0 * R_KM * R_KM) / Math.pow(R_KM + h, 2);

  function rail(g) {
    // Rail gradué : un trait tous les 1000 km, un nombre tous les 5000 km, et les repères connus.
    const debut = point(0), fin = point(H_MAX);
    L.svg("line", { x1: debut.x, y1: debut.y, x2: fin.x, y2: fin.y, stroke: "#8fb3d9", "stroke-width": 1.2, opacity: 0.7 }, g);
    const n = { x: -U.y, y: U.x };
    for (let h = 0; h <= H_MAX; h += 1000) {
      const p = point(h), l = h % 5000 === 0 ? 9 : 4;
      L.svg("line", { x1: p.x - n.x * l, y1: p.y - n.y * l, x2: p.x + n.x * l, y2: p.y + n.y * l, stroke: "#8fb3d9", "stroke-width": 1, opacity: 0.8 }, g);
      if (h % 5000 === 0 && h > 0) L.texte(g, p.x + n.x * 30, p.y + n.y * 30, `${h.toLocaleString("fr-FR")} km`, { "font-size": 10.5, fill: "#a9bdd6" });
    }
    for (const [h, nom] of REPERES) {
      const p = point(h), cote = h < 1000 ? 1 : -1, ecart = h < 1000 ? 46 : 16;
      L.svg("circle", { cx: p.x, cy: p.y, r: 3, fill: "#f1d58a" }, g);
      if (h < 1000) L.svg("line", { x1: p.x, y1: p.y, x2: p.x + n.x * (ecart - 4), y2: p.y + n.y * (ecart - 4), stroke: "#f1d58a", "stroke-width": 0.6 }, g);
      L.texte(g, p.x + cote * n.x * ecart, p.y + cote * n.y * ecart, `${nom} (${h.toLocaleString("fr-FR")} km)`, { "font-size": 10.5, fill: "#f1d58a", "text-anchor": cote > 0 ? "start" : "end" });
    }
  }

  function bord(g) {
    // Bord du poste d'observation, où sont posés la tablette et le carnet.
    L.svg("rect", { x: 0, y: 566, width: L.LARGEUR, height: 74, fill: "url(#paillasse)" }, g);
    L.svg("rect", { x: 0, y: 566, width: L.LARGEUR, height: 3, fill: "#6d777e" }, g);
  }

  L.poste_altitude = function (g) {
    // Construit la scène et branche le déplacement de la sonde le long du rail.
    L.espace.ciel(L.svg("g", {}, g));
    const terre = new L.espace.Astre(g, "terre");
    terre.placer(TERRE.x, TERRE.y, TERRE.R, { x: -2500, y: -1800 });
    rail(g);
    L.texte(g, 16, 24, "Altitudes à l'échelle ; la taille de la sonde ne l'est pas.", { "text-anchor": "start", "font-size": 12, fill: "#8d97a3" });
    const sonde = new L.Sonde(g, { masse_kg: MASSE, cote: "gauche" });
    const vecteur = L.svg("line", { "pointer-events": "none", stroke: "#e8513f", "stroke-width": 2.6, "marker-end": "url(#fleche-rouge)" }, g);
    const etat = { h: 2000 }, mesures = [];

    function placer() {
      // Place la sonde à l'altitude h, met à jour l'afficheur et la flèche de la force.
      const p = point(etat.h), F = force(etat.h), l = F * 0.012;
      sonde.placer(p.x, p.y);
      sonde.afficher([`h = ${etat.h.toLocaleString("fr-FR")} km`, `F = ${L.nombre_court(F, 4)} N`]);
      Object.entries({ x1: p.x, y1: p.y, x2: p.x - U.x * l, y2: p.y - U.y * l }).forEach(([k, v]) => vecteur.setAttribute(k, v));
    }

    L.glissable(sonde.g, {
      debut: () => ({ ...sonde.pos }),
      deplacer: (p) => {
        const r = (p.x - TERRE.x) * U.x + (p.y - TERRE.y) * U.y;
        etat.h = Math.max(0, Math.min(H_MAX, Math.round(((r - TERRE.R) * KM_PAR_PX) / 100) * 100));
        placer();
      },
      lacher: () => { mesures.push({ h: etat.h, F: force(etat.h) }); L.missions.noter("mesures_altitude", [...mesures]); },
    });
    bord(g);
    placer();
    return {};
  };

  L.ALTITUDE = { R_KM, G0, MASSE, force };
})(window.Labo);
