/*
Rôle : poste « découvrir la loi de gravitation » dans l'espace : la Terre, la Lune, des cercles de distance gradués
       et trois sondes (250, 500, 1000 kg). L'élève déplace une sonde ; son capteur affiche la distance au centre
       de chaque astre et la force qu'il exerce sur elle (calculée par F = G·m·M/d², que l'élève doit découvrir).
       Échelle : 1 px = 100 km ; la distance Terre-Lune n'est pas à l'échelle (signalé).
Reçoit : le groupe SVG de la scène.
Produit : Labo.poste_loi(groupe) -> {} ; fait noté : mesures_sondes = [{ m, dT, FT, dL, FL }].
Utilisé par : simulation.js.
*/
(function (L) {
  const G = 6.67e-11, KM_PAR_PX = 100;
  const ASTRES = { T: { x: 250, y: 300, R: 64, M: 5.97e24, nom: "Terre" }, L: { x: 850, y: 300, R: 17.4, M: 7.35e22, nom: "Lune" } };
  const SOLEIL_LOIN = { x: -4000, y: -300 };
  const sig = (v) => Number(v.toPrecision(3)).toLocaleString("fr-FR", { maximumFractionDigits: 6 });
  const km = (v) => Math.round(v).toLocaleString("fr-FR");

  function cercles(g) {
    // Cercles de distance (tous les 10 000 km autour de la Terre, 5 000 km autour de la Lune), notés en km.
    for (const [a, pas, n] of [[ASTRES.T, 100, 5], [ASTRES.L, 50, 2]]) {
      for (let i = 1; i <= n; i++) {
        const r = pas * i;
        L.svg("circle", { cx: a.x, cy: a.y, r, fill: "none", stroke: "#7f9cc0", "stroke-width": 0.7, "stroke-dasharray": "4 5", opacity: 0.55 }, g);
        const angle = a === ASTRES.T ? -0.62 : -2.3;
        L.texte(g, a.x + r * Math.cos(angle), a.y + r * Math.sin(angle), `${km(r * KM_PAR_PX)} km`, { "font-size": 10, fill: "#a9bdd6", stroke: "#03050b", "stroke-width": 3, "paint-order": "stroke" });
      }
    }
  }

  function mesurer(p, m) {
    // Distances (arrondies à 100 km) et forces exercées par la Terre et par la Lune sur une sonde de masse m.
    const res = { m };
    for (const [c, a] of Object.entries(ASTRES)) {
      const d = Math.round((Math.hypot(p.x - a.x, p.y - a.y) * KM_PAR_PX) / 100) * 100;
      res["d" + c] = d;
      res["F" + c] = (G * m * a.M) / Math.pow(d * 1000, 2);
    }
    return res;
  }

  function ajuster(p) {
    // Au lâcher : la sonde reste hors des astres et se cale sur un multiple de 500 km de l'astre le plus proche.
    const a = Math.hypot(p.x - ASTRES.L.x, p.y - ASTRES.L.y) < 150 ? ASTRES.L : ASTRES.T;
    const d = Math.hypot(p.x - a.x, p.y - a.y) || 1, mini = a.R + 8;
    const voulu = Math.max(Math.ceil(mini / 5) * 5, Math.round(d / 5) * 5);
    return { x: a.x + ((p.x - a.x) * voulu) / d, y: a.y + ((p.y - a.y) * voulu) / d };
  }

  function vecteurs(calque, s, mesure) {
    // Forces exercées sur la sonde : vers la Terre (rouge) et vers la Lune (bleu), longueur liée à l'intensité.
    for (const [c, couleur] of [["T", "rouge"], ["L", "bleue"]]) {
      const a = ASTRES[c], d = Math.hypot(a.x - s.pos.x, a.y - s.pos.y) || 1, l = Math.min(120, mesure["F" + c] * 0.12);
      if (l < 2) continue;
      L.svg("line", { x1: s.pos.x, y1: s.pos.y, x2: s.pos.x + ((a.x - s.pos.x) * l) / d, y2: s.pos.y + ((a.y - s.pos.y) * l) / d, stroke: couleur === "rouge" ? "#e8513f" : "#4d9bff", "stroke-width": 2.4, "marker-end": `url(#fleche-${couleur})` }, calque);
    }
  }

  L.poste_loi = function (g) {
    // Construit la scène et branche le déplacement des sondes.
    L.espace.ciel(L.svg("g", {}, g));
    cercles(g);
    for (const [c, a] of Object.entries(ASTRES)) {
      const astre = new L.espace.Astre(g, c === "T" ? "terre" : "lune");
      astre.placer(a.x, a.y, a.R, SOLEIL_LOIN);
      L.texte(g, a.x, a.y + a.R + 16, a.nom, { "font-size": 13, "font-weight": 700, fill: "#d5dde8" });
    }
    L.texte(g, 16, 24, "Les cercles sont espacés de 10 000 km (Terre) et de 5 000 km (Lune). La distance Terre – Lune n'est pas à l'échelle.", { "text-anchor": "start", "font-size": 12, fill: "#8d97a3" });
    const mesures = [];
    const sondes = [250, 500, 1000].map((m, i) => {
      const s = new L.Sonde(g, { masse_kg: m });
      s.placer(470 + i * 120, 520);
      return s;
    });
    const calque = L.svg("g", { "pointer-events": "none" }, g);
    const rafraichir = () => { calque.replaceChildren(); for (const s of sondes) { const me = mesurer(s.pos, s.masse_kg); s.afficher(s.choisie ? [`d_{T} = ${km(me.dT)} km`, `F_{T} = ${sig(me.FT)} N`, `d_{L} = ${km(me.dL)} km`, `F_{L} = ${sig(me.FL)} N`] : []); vecteurs(calque, s, me); } };
    sondes.forEach((s) => {
      L.glissable(s.g, {
        debut: () => { sondes.forEach((x) => { x.choisie = x === s; }); rafraichir(); return { ...s.pos }; },
        deplacer: (p) => { s.placer(p.x, Math.min(540, p.y)); rafraichir(); },
        lacher: (p) => {
          const q = ajuster({ x: p.x, y: Math.min(540, p.y) });
          s.placer(q.x, q.y);
          rafraichir();
          mesures.push(mesurer(s.pos, s.masse_kg));
          L.missions.noter("mesures_sondes", [...mesures]);
        },
      });
    });
    const bord = L.svg("rect", { x: 0, y: 566, width: L.LARGEUR, height: 74, fill: "url(#paillasse)" }, g);
    L.svg("rect", { x: 0, y: 566, width: L.LARGEUR, height: 3, fill: "#6d777e" }, g);
    g.insertBefore(bord, calque);
    rafraichir();
    return {};
  };

  L.LOI_GRAVITATION = { G, M_T: ASTRES.T.M, M_L: ASTRES.L.M };
})(window.Labo);
