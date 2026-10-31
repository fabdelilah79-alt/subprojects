/*
Rôle : bécher de 250 mL contenant un liquide de masse connue (eau froide, eau chaude, huile), avec sa sonde de température
       et son petit afficheur ; on le fait glisser au-dessus d'un vase : il se penche, se vide dans le vase, puis revient à
       sa place, vide. Le liquide d'un bécher se rapproche lentement de la température de la salle (constante de temps 10 min).
Reçoit : le groupe SVG et { x, base, m (g), c (J·kg⁻¹·K⁻¹), theta (°C), nom, etiquette, cible(p) -> point de l'ouverture du
         vase où verser (ou null), verser(m, c, theta, nom) }.
Produit : Labo.becher_verseur(g, reglage) -> b { plein, theta, remplir(), dessiner(), tic(dt) }.
Utilisé par : les simulations du chapitre « Énergie thermique, transfert thermique ».
*/
(function (L) {
  const L_PX = 72, H_PX = 100, AMBIANTE = 20;

  function dessin(g, b, p, angle) {
    // Bécher (verre), liquide, étiquette, bec verseur ; incliné d'un angle quand il verse ; vapeur au-dessus de l'eau chaude.
    const gr = L.svg("g", { class: "becher-verseur", role: "button", "aria-label": b.etiquette, transform: `rotate(${angle} ${p.x} ${p.y - H_PX})` }, g);
    if (b.plein && !angle) {
      const n = b.nom === "huile" ? "#d9b13b" : "#7fb8d6";
      L.svg("rect", { x: p.x - L_PX / 2 + 3, y: p.y - (b.m / 250) * H_PX * 0.92, width: L_PX - 6, height: (b.m / 250) * H_PX * 0.92 - 2, fill: n, opacity: 0.75 }, gr);
      if (b.theta > 45) for (const k of [-14, 4, 18]) L.svg("path", { d: `M${p.x + k} ${p.y - H_PX - 4} c-6 -8 6 -12 0 -22`, fill: "none", stroke: "#ffffff", "stroke-width": 2, opacity: 0.5 }, gr);
    }
    L.svg("path", { d: `M${p.x - L_PX / 2} ${p.y - H_PX} V${p.y - 4} q0 4 4 4 H${p.x + L_PX / 2 - 4} q4 0 4 -4 V${p.y - H_PX} l6 -5`, fill: "url(#verre)", stroke: "#9fb6be", "stroke-width": 1.2 }, gr);
    L.svg("rect", { x: p.x - 26, y: p.y - 46, width: 52, height: 24, rx: 2, fill: "#fdfdf8", stroke: "#c9c4b0" }, gr);
    L.texte(gr, p.x, p.y - 36, b.plein ? b.etiquette : "vide", { "font-size": 6.5, "font-weight": 700, fill: "#222" });
    if (b.plein) L.texte(gr, p.x, p.y - 27, `${b.m} g`, { "font-size": 6.5, fill: "#222" });
  }

  L.becher_verseur = function (g, r) {
    // Bécher saisissable ; vidé dans le vase s'il est lâché au-dessus de son ouverture.
    const b = { ...r, plein: true, theta0: r.theta, tenu: null, versement: 0 }, c = L.svg("g", {}, g);
    b.remplir = () => { b.plein = true; b.theta = b.theta0; };
    b.tic = (dt) => {
      // Refroidissement lent ; fin du versement.
      b.theta += ((AMBIANTE - b.theta) * dt) / 600;
      if (b.versement > 0) { b.versement -= dt; if (b.versement <= 0) { b.verser(b.m, b.c, b.theta, b.nom); b.plein = false; b.tenu = null; } }
    };
    b.dessiner = () => {
      // Bécher à sa place, tenu à la main ou en train de verser ; afficheur de sa sonde.
      c.replaceChildren();
      const p = b.tenu || { x: b.x, y: b.base };
      if (b.versement > 0) L.svg("path", { d: `M${b.bec.x} ${b.bec.y - 20} V${b.bec.y + 8}`, fill: "none", stroke: b.nom === "huile" ? "#d9b13b" : "#7fb8d6", "stroke-width": 5, opacity: 0.8, "stroke-linecap": "round" }, c);
      dessin(c, b, p, b.versement > 0 ? 70 : 0);
      if (b.plein && !b.tenu) {
        L.svg("rect", { x: b.x - 26, y: b.base + 4, width: 52, height: 14, rx: 2, fill: "#1d2a22" }, c);
        L.texte(c, b.x, b.base + 14, `${b.theta.toFixed(1).replace(".", ",")} °C`, { "font-size": 8.5, "font-weight": 700, fill: "#7dff9a", "font-family": "monospace" });
      }
    };
    L.glissable(c, {
      soulever: false,
      debut: () => (b.plein && b.versement <= 0 ? { x: b.x, y: b.base } : null),
      deplacer: (p) => { b.tenu = p; },
      lacher: (p) => { const q = b.cible(p); if (q) { b.bec = q; b.tenu = { x: q.x - 12, y: q.y - 54 + H_PX }; b.versement = 0.8; } else b.tenu = null; },
    });
    return b;
  };
})(window.Labo);
