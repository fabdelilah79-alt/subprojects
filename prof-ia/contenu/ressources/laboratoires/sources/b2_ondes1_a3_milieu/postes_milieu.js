/*
Rôle : paillasses de l'activité « influence du milieu sur la célérité » : (1) corde tendue par des masses sur une poulie
       (corde_tendue.js), trois cordes de masses linéiques différentes, deux cellules et le chronomètre électronique
       (detecteurs_onde.js) ; chaque mesure est rangée par corde et par masse ; (2) deux documents sur la célérité du son
       dans différents milieux et selon la température.
Reçoit : le groupe SVG de chaque paillasse.
Produit : Labo.poste_corde, Labo.poste_milieux (groupe) -> { pense_bete } ; faits « corde » (corde, mu, M, T), « chrono_corde »
          (xA, xB, dt), « mesures_corde » = { « corde|M » : v (m/s) }, « docs_milieux » (numéros lus).
Utilisé par : simulation.js.
*/
(function (L) {
  const DOCS = [
    { x: 300, y: 40, l: 300, h: 200, taille: 5, titre: "Célérité du son dans quelques milieux", texte: "Mesures à 20 °C : air 343 m/s ; dioxyde de carbone 267 m/s ; hélium 1 007 m/s ; eau 1 480 m/s ; caoutchouc environ 1 500 m/s ; béton environ 3 500 m/s ; aluminium 6 300 m/s ; acier 5 900 m/s. Dans un solide rigide, les particules sont fortement liées : une perturbation se transmet très vite de proche en proche. Plus le milieu est rigide (peu compressible), plus la célérité est grande ; plus il a d'inertie (masse volumique) à même rigidité, plus elle est faible." },
    { x: 620, y: 40, l: 300, h: 200, taille: 5, titre: "Célérité du son et température", texte: "Dans l'air, la célérité du son augmente avec la température : v ≈ 331,4 + 0,6·θ (m/s), θ en °C. À 0 °C, v ≈ 331 m/s ; à 20 °C, v ≈ 343 m/s ; à 40 °C, v ≈ 355 m/s. La célérité dépend donc du milieu et de son état (température, pression pour un gaz ; tension et masse linéique pour une corde : v = √(T / μ)), mais pas de la forme ni de l'amplitude de la perturbation." },
  ];

  L.poste_corde = function (g) {
    // Cellules et chronomètre derrière la corde ; un changement de corde ou de masse remet le chronomètre à zéro.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230), fond = L.svg("g", {}, g), mesures = {};
    let d = null;
    const c = L.corde_tendue(g, { x0: 210, k: 300, y_axe: 380, sol: 480, fait: "corde", changer: () => d?.raz() });
    d = L.detecteurs_onde(fond, c.milieu, { x0: 210, k: 300, y_axe: 380, sol: 530, positions: [0.5, 1.5], seuil: 0.02, chrono: { x: 920, y: 440 }, fait: "chrono_corde",
      sur_mesure: (dt) => { mesures[`${c.etat.corde}|${c.etat.M}`] = Math.round((Math.abs(d.xB - d.xA) / dt) * 100) / 100; L.missions.noter("mesures_corde", { ...mesures }); } });
    return { pense_bete };
  };

  L.poste_milieux = function (g) {
    // Pense-bête et deux documents.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230);
    L.documents_mur(g, DOCS, "docs_milieux");
    return { pense_bete };
  };
})(window.Labo);
