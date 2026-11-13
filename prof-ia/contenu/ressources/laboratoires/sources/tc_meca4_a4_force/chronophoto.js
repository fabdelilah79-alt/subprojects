/*
Rôle : chronophotographie d'une bille d'acier : lâchée par un électroaimant (chute verticale) ou lancée au bout d'un rail
       horizontal (vitesse initiale horizontale). Le stroboscope laisse une image pâle de la bille toutes les τ ;
       l'élève lit les positions sur le panneau du mur avec les fils de lecture.
Reçoit : le groupe SVG ; { nom, tau, duree, origine (px : centre de la bille au départ), echelle (px par m), v0x (m/s), sol (px),
         depart: "electroaimant" | "rail", bouton: { x, y, texte } }.
Produit : Labo.chronophoto(groupe, reglages) ; fait noté « <nom> » = { fini: oui } quand la bille a fini sa course.
Utilisé par : simulation.js.
*/
(function (L) {
  const G = 9.8, R = 7;

  function bille(g, p, pale) {
    // Une bille (dégradé radial) ; pâle pour les images du stroboscope.
    L.svg("circle", { cx: p.x, cy: p.y, r: R, fill: pale ? "#9aa3a9" : "url(#bille-chrono)", opacity: pale ? 0.55 : 1, stroke: "#2a2e33", "stroke-width": 0.5 }, g);
  }

  function support(g, s) {
    // Dégradé de la bille ; électroaimant sur sa potence, ou rail de lancement terminé au point de départ.
    const d = L.svg("radialGradient", { id: "bille-chrono", cx: 0.35, cy: 0.3, r: 0.8 }, g.ownerSVGElement.querySelector("defs"));
    for (const [o, c] of [[0, "#ffffff"], [0.3, "#c9d0d5"], [0.75, "#5d666d"], [1, "#22282d"]]) L.svg("stop", { offset: o, "stop-color": c }, d);
    const o = s.origine;
    if (s.depart === "electroaimant") {
      L.tige(g, `M${o.x - 90} ${o.y - 30} V${s.sol}`, 8);
      L.svg("rect", { x: o.x - 130, y: s.sol - 8, width: 80, height: 10, rx: 2, fill: "url(#acier)" }, g);
      L.tige(g, `M${o.x - 90} ${o.y - 24} H${o.x}`, 6);
      L.svg("rect", { x: o.x - 13, y: o.y - 34, width: 26, height: 26, rx: 3, fill: "#b8562b", stroke: "#5a2a14" }, g);
      L.svg("path", { d: `M${o.x - 13} ${o.y - 28} C${o.x - 40} ${o.y - 60} ${o.x - 120} ${o.y - 40} ${o.x - 140} ${o.y - 70}`, stroke: "#222", "stroke-width": 2, fill: "none" }, g);
      return;
    }
    L.svg("path", { d: `M${o.x - 200} ${o.y - 70} Q${o.x - 120} ${o.y + R} ${o.x - 40} ${o.y + R} H${o.x + 4}`, fill: "none", stroke: "url(#metal)", "stroke-width": 6 }, g);
    L.tige(g, `M${o.x - 30} ${o.y + R + 3} V${s.sol}`, 6);
    L.tige(g, `M${o.x - 190} ${o.y - 60} V${s.sol}`, 6);
  }

  function position(s, t) {
    // Centre de la bille (px) à l'instant t.
    return { x: s.origine.x + s.v0x * t * s.echelle, y: s.origine.y + 0.5 * G * t * t * s.echelle };
  }

  L.chronophoto = function (g, s) {
    // Construit le support, la bille et le bouton ; la bille tombe dès qu'on appuie.
    support(g, s);
    const bas = position(s, s.duree).y + R;
    L.svg("path", { d: `M${position(s, s.duree).x - 50} ${bas} H${position(s, s.duree).x + 50} V${s.sol} H${position(s, s.duree).x - 50} Z`, fill: "url(#bois-face)", stroke: "#6b4a2a" }, g);
    const images = L.svg("g", { "pointer-events": "none" }, g), vue = L.svg("g", { "pointer-events": "none" }, g);
    const etat = { parti: false, t: 0, photo: 0 };
    L.bouton_poussoir(g, s.bouton.x, s.bouton.y, {
      textes: [s.bouton.texte, "Recommencer"],
      sur_changement: (enfonce) => { images.replaceChildren(); Object.assign(etat, { parti: enfonce, t: 0, photo: 0, fini: false }); },
    });
    let avant = null;
    const image = (instant) => {
      const dt = avant === null ? 0 : Math.min(0.05, (instant - avant) / 1000);
      avant = instant;
      for (let reste = dt; etat.parti && !etat.fini && reste > 1e-6; reste -= 0.002) {
        // Pas de 2 ms : chaque image du stroboscope est prise à l'instant exact.
        if (etat.photo <= 1e-9) { bille(images, position(s, etat.t), true); etat.photo += s.tau; }
        const pas = Math.min(0.002, reste);
        etat.t += pas;
        etat.photo -= pas;
        if (etat.t >= s.duree) { etat.fini = true; L.missions.noter(s.nom, { fini: true }); }
      }
      vue.replaceChildren();
      bille(vue, position(s, etat.parti ? etat.t : 0), false);
      requestAnimationFrame(image);
    };
    requestAnimationFrame(image);
  };
})(window.Labo);
