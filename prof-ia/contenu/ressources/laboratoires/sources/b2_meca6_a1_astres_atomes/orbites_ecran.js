/*
Rôle : fenêtre de visualisation du simulateur d'orbites : fond noir, centre attracteur (Terre à l'échelle, ou proton), trajectoire
       prévue (ellipse en pointillés), traînée du mobile (satellite ou électron), vecteur vitesse de lancement, barre d'échelle,
       message (orbite, échappement, chute, rayonnement).
Reçoit : le groupe SVG (dans le dessin, pour les matières de la Terre), le cadre { x, y, l, h } et, à chaque image, l'état du logiciel s { mode, r0, v0, o, p, trace, message }.
Produit : Labo.orbites_ecran(g, cadre) -> dessiner(s).
Utilisé par : logiciel_orbites.js.
*/
(function (L) {
  const ECHELLES = [1e-12, 2e-12, 5e-12, 1e-11, 2e-11, 5e-11, 1e-10, 1e6, 2e6, 5e6, 1e7, 2e7];

  function portee(s) {
    // Distance (m) représentée par la demi-hauteur de la fenêtre.
    const o = s.o, M = L.orbites.MODES[s.mode];
    const loin = o && o.issue !== "echappe" ? Math.max(o.rmax, s.r0) : 2.2 * s.r0;
    return 1.12 * Math.max(loin, M.R * 1.5);
  }

  function centre(g, terre, s, c, k) {
    // Terre à l'échelle (dessin réaliste de espace.js, éclairée par le Soleil hors champ, en haut à gauche) ou proton.
    terre.g.setAttribute("display", s.mode === "terre" ? "inline" : "none");
    if (s.mode === "terre") return terre.placer(c.x, c.y, L.orbites.MODES.terre.R * k, { x: c.x - 4000, y: c.y - 2500 });
    L.svg("circle", { cx: c.x, cy: c.y, r: 5, fill: "#e53935", stroke: "#ffcdd2", "stroke-width": 0.8 }, g);
    L.texte(g, c.x + 9, c.y - 6, "p⁺", { "font-size": 7, fill: "#ffcdd2" });
  }

  function echelle(g, s, cadre, k) {
    // Barre d'échelle d'environ 60 px, graduée en km ou en pm.
    const M = L.orbites.MODES[s.mode], d = ECHELLES.filter((v) => v * k <= 70).pop() || ECHELLES[0];
    const x = cadre.x + 10, y = cadre.y + cadre.h - 12;
    L.svg("path", { d: `M${x} ${y - 3} v3 h${d * k} v-3`, fill: "none", stroke: "#e0e0e0", "stroke-width": 1 }, g);
    L.texte(g, x + (d * k) / 2, y - 5, `${L.nombre_court(d / M.ur, 3)} ${M.nom_r}`, { "font-size": 6.5, fill: "#e0e0e0" });
  }

  function trajectoires(g, s, c, k) {
    // Ellipse prévue, traînée, mobile et sa vitesse de lancement.
    const X = (p) => c.x + p.x * k, Y = (p) => c.y - p.y * k;
    if (s.o && s.o.issue !== "echappe" && !s.rayonnement) {
      const pts = Array.from({ length: 121 }, (_, i) => L.orbites.position(s.o, (i / 120) * s.o.T));
      L.svg("path", { d: pts.map((p, i) => `${i ? "L" : "M"}${X(p).toFixed(1)} ${Y(p).toFixed(1)}`).join(" "), fill: "none", stroke: "#90a4ae", "stroke-width": 0.8, "stroke-dasharray": "3 3" }, g);
    }
    if (s.trace.length > 1) L.svg("path", { d: s.trace.map((p, i) => `${i ? "L" : "M"}${X(p).toFixed(1)} ${Y(p).toFixed(1)}`).join(" "), fill: "none", stroke: s.mode === "terre" ? "#ffd54f" : "#64b5f6", "stroke-width": 1.2, opacity: 0.9 }, g);
    const p = s.p || { x: s.r0, y: 0 };
    if (!s.o) L.svg("path", { d: `M${X(p)} ${Y(p)} v-26 m-3 5 l3 -5 l3 5`, fill: "none", stroke: "#81c784", "stroke-width": 1.2 }, g);
    L.svg("circle", { cx: X(p), cy: Y(p), r: s.mode === "terre" ? 3 : 2.6, fill: s.mode === "terre" ? "#eceff1" : "#42a5f5", stroke: "#fff", "stroke-width": 0.6 }, g);
    if (s.mode === "atome") L.texte(g, X(p) + 7, Y(p) - 5, "e⁻", { "font-size": 7, fill: "#bbdefb" });
  }

  L.orbites_ecran = function (g, cadre) {
    // Fond étoilé et Terre dessinés une fois, le tout découpé au cadre de la fenêtre ; le reste est redessiné à chaque image.
    const decoupe = L.svg("clipPath", { id: "fenetre-orbites" }, g.ownerSVGElement.querySelector("defs"));
    L.svg("rect", { x: cadre.x, y: cadre.y, width: cadre.l, height: cadre.h }, decoupe);
    g.setAttribute("clip-path", "url(#fenetre-orbites)");
    L.svg("rect", { x: cadre.x, y: cadre.y, width: cadre.l, height: cadre.h, fill: "#05080d" }, g);
    for (let i = 0; i < 40; i++) L.svg("circle", { cx: cadre.x + ((i * 97) % cadre.l), cy: cadre.y + ((i * 61) % cadre.h), r: 0.5, fill: "#fff", opacity: 0.5 }, g);
    const terre = new L.espace.Astre(g, "terre"), dyn = L.svg("g", {}, g);
    return (s) => {
      dyn.replaceChildren();
      const c = { x: cadre.x + cadre.l / 2, y: cadre.y + cadre.h / 2 }, k = cadre.h / 2 / portee(s);
      centre(dyn, terre, s, c, k); trajectoires(dyn, s, c, k); echelle(dyn, s, cadre, k);
      if (s.message) L.texte(dyn, c.x, cadre.y + 14, s.message, { "font-size": 7.5, "font-weight": 700, fill: "#ffe082" });
    };
  };
})(window.Labo);
