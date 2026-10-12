/*
Rôle : vue réaliste du système Soleil-Terre-Lune depuis l'espace, un peu au-dessus du plan de l'orbite.
       Le temps s'écoule (une année en 40 s) ; saisir la Terre arrête le temps et permet d'avancer ou de reculer.
       La Lune fait 13,37 tours par an (12,37 nouvelles lunes). Au premier plan, le bord du poste d'observation
       où sont posés la tablette, le carnet et le plateau des flèches-forces.
Reçoit : le groupe SVG de la scène.
Produit : Labo.poste_systeme_solaire(groupe) -> {} ; faits : annees (tours de la Terre), fleches_placees, fleche_erreur.
Utilisé par : simulation.js.
*/
(function (L) {
  const C = { x: 512, y: 280 }, ORBITE = { rx: 390, ry: 112 }, SOLEIL_R = 56;
  const LUNE = { rx: 46, ry: 14 }, TERRE_R = 15, LUNE_R = 4.6, RAPPORT = 13.37, ANNEE_S = 40;
  const MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];

  function console_observation(g) {
    // Bord du poste d'observation : plan de travail sombre où l'on pose le matériel.
    L.svg("rect", { x: 0, y: 566, width: L.LARGEUR, height: 74, fill: "url(#paillasse)" }, g);
    L.svg("rect", { x: 0, y: 566, width: L.LARGEUR, height: 3, fill: "#6d777e" }, g);
    L.texte(g, 16, 24, "Tailles et distances ne sont pas à l'échelle.", { "text-anchor": "start", "font-size": 12, fill: "#8d97a3" });
  }

  function date(theta_parcouru) {
    // Date affichée à partir de l'angle parcouru depuis le 1er janvier.
    const jour = Math.floor((((theta_parcouru / (2 * Math.PI)) % 1) + 1) % 1 * 365);
    const debuts = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
    const m = debuts.filter((d) => d <= jour).length - 1;
    return `${jour - debuts[m] + 1} ${MOIS[m]}`;
  }

  L.poste_systeme_solaire = function (g) {
    // Construit la scène et fait tourner la Terre et la Lune.
    L.espace.ciel(L.svg("g", {}, g));
    L.svg("ellipse", { cx: C.x, cy: C.y, rx: ORBITE.rx, ry: ORBITE.ry, fill: "none", stroke: "#8fb3d9", "stroke-width": 0.8, "stroke-dasharray": "3 6", opacity: 0.45 }, g);
    const derriere = L.svg("g", {}, g), soleil = L.svg("g", {}, g), devant = L.svg("g", {}, g);
    L.espace.soleil(soleil, C.x, C.y, SOLEIL_R);
    const systeme = L.svg("g", { class: "systeme-terre" }, devant);
    const orbite_lune = L.svg("ellipse", { fill: "none", stroke: "#aab4c0", "stroke-width": 0.6, "stroke-dasharray": "2 4", opacity: 0.5 }, systeme);
    const lune = new L.espace.Astre(systeme, "lune"), terre = new L.espace.Astre(systeme, "terre");
    const vecteurs = L.svg("g", { "pointer-events": "none" }, g);
    console_observation(g);
    const affichage = L.texte(g, C.x, 24, "", { fill: "#d5dde8", "font-size": 16, "font-weight": 600 });
    const etat = { theta: Math.PI / 2, parcouru: 0, saisie: false, dernier_fait: 0 };

    function astres() {
      // Positions à l'écran : la Terre plus grosse quand elle est au premier plan (perspective).
      const k = 1 + 0.2 * Math.sin(etat.theta);
      const t = { x: C.x + ORBITE.rx * Math.cos(etat.theta), y: C.y + ORBITE.ry * Math.sin(etat.theta), r: TERRE_R * k };
      const phi = RAPPORT * etat.theta;
      const l = { x: t.x + LUNE.rx * k * Math.cos(phi), y: t.y + LUNE.ry * k * Math.sin(phi), r: LUNE_R * k, devant: Math.sin(phi) > 0 };
      return { soleil: { ...C, r: SOLEIL_R }, terre: t, lune: l, k };
    }

    function dessiner() {
      // Place les astres, l'ordre devant/derrière, la date ; appelle les écouteurs (flèches-forces).
      const a = astres();
      terre.placer(a.terre.x, a.terre.y, a.terre.r, C);
      lune.placer(a.lune.x, a.lune.y, a.lune.r, C);
      Object.entries({ cx: a.terre.x, cy: a.terre.y, rx: LUNE.rx * a.k, ry: LUNE.ry * a.k }).forEach(([c, v]) => orbite_lune.setAttribute(c, v));
      if (a.lune.devant) systeme.append(lune.g); else systeme.insertBefore(lune.g, terre.g);
      (Math.sin(etat.theta) < 0 ? derriere : devant).append(systeme);
      affichage.textContent = date(etat.parcouru);
      L.annoncer("astres", a);
    }

    function avancer(dtheta) {
      // Fait tourner la Terre (sens direct vu du nord : l'angle diminue dans cette vue) et note les années.
      etat.theta -= dtheta;
      etat.parcouru += dtheta;
      dessiner();
      const annees = Math.abs(etat.parcouru) / (2 * Math.PI);
      if (Math.abs(annees - etat.dernier_fait) > 0.05) { etat.dernier_fait = annees; L.missions.noter("annees", annees); }
    }

    let avant = null;
    const tourner = (instant) => {
      // Le temps s'écoule tant que l'élève ne tient pas la Terre.
      const dt = avant === null ? 0 : Math.min(0.05, (instant - avant) / 1000);
      avant = instant;
      if (!etat.saisie) avancer((2 * Math.PI * dt) / ANNEE_S);
      requestAnimationFrame(tourner);
    };
    requestAnimationFrame(tourner);

    L.glissable(terre.g, {
      soulever: false,
      debut: () => { const t = astres().terre; etat.saisie = true; return { x: t.x, y: t.y }; },
      deplacer: (p) => {
        const angle = Math.atan2((p.y - C.y) / ORBITE.ry, (p.x - C.x) / ORBITE.rx);
        const d = ((etat.theta - angle + 3 * Math.PI) % (2 * Math.PI)) - Math.PI;
        avancer(d);
      },
      fin: () => { etat.saisie = false; },
    });
    L.fleches_forces(g, vecteurs);
    dessiner();
    return {};
  };
})(window.Labo);
