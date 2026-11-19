/*
Rôle : loupe « modèle » : promenée sur une baguette ou un chiffon, elle montre le modèle de la matière : des noyaux
       positifs fixes et des électrons. Un objet neutre a autant de charges + que de charges − ; un objet chargé
       négativement a des électrons en excès, un objet chargé positivement en manque.
Reçoit : le groupe SVG ; une fonction objets() -> [{ id, nom, q (nC), zone(x, y) (vrai si le point est sur l'objet) }].
Produit : Labo.loupe(groupe, objets, depart) ; fait noté « loupe » = { <id> : signe de la charge vue (−1, 0, 1) }.
Utilisé par : poste_etrier.js.
*/
(function (L) {
  const R = 48;

  // Places des électrons : entre les noyaux (centres des carrés, puis milieux des côtés), jamais sur un noyau.
  const PLACES = [[-13, -13], [13, 13], [13, -13], [-13, 13], [0, -13], [0, 13], [-13, 0], [13, 0],
    [-26, -13], [26, 13], [26, -13], [-26, 13], [-13, -26], [13, 26], [13, -26], [-13, 26]];

  function modele(g, c, q) {
    // 9 noyaux « + » en grille ; 9 électrons « − », plus ou moins selon la charge (un signe pour environ 10⁹ électrons).
    const n = Math.round(Math.max(-4, Math.min(4, -q)));
    for (let i = 0; i < 9; i++) {
      const x = c.x - 26 + (i % 3) * 26, y = c.y - 26 + Math.floor(i / 3) * 26;
      L.svg("circle", { cx: x, cy: y, r: 7, fill: "#f4c7c3", stroke: "#b71c1c", "stroke-width": 0.8 }, g);
      L.texte(g, x, y + 0.5, "+", { "font-size": 10, "font-weight": 700, fill: "#b71c1c" });
    }
    for (const [dx, dy] of PLACES.slice(0, 9 + n)) {
      L.svg("circle", { cx: c.x + dx, cy: c.y + dy, r: 4.5, fill: "#cfe3f7", stroke: "#0d47a1", "stroke-width": 0.7 }, g);
      L.texte(g, c.x + dx, c.y + dy + 0.5, "−", { "font-size": 8, "font-weight": 700, fill: "#0d47a1" });
    }
  }

  function legende(g, p, texte) {
    // Légende sous la loupe, sur une étiquette sombre (lisible au-dessus des objets de la paillasse).
    const l = texte.length * 6.2 + 14;
    L.svg("rect", { x: p.x - l / 2, y: p.y + R + 7, width: l, height: 18, rx: 3, fill: "#1e2326", opacity: 0.92 }, g);
    L.texte(g, p.x, p.y + R + 16.5, texte, { "font-size": 11, "font-weight": 700, fill: "#f1ead2" });
  }

  L.loupe = function (parent, objets, depart) {
    // Loupe déplaçable : lentille, monture, manche ; elle affiche le modèle de ce qu'elle survole.
    const g = L.svg("g", { class: "loupe", role: "button", "aria-label": "Loupe : modèle de la matière" }, parent), vues = {};
    let p = { ...depart };
    const dessiner = () => {
      g.replaceChildren();
      const o = objets().find((x) => x.zone(p.x, p.y));
      L.svg("line", { x1: p.x + R * 0.7, y1: p.y + R * 0.7, x2: p.x + R * 1.5, y2: p.y + R * 1.5, stroke: "#4e342e", "stroke-width": 10, "stroke-linecap": "round" }, g);
      L.svg("circle", { cx: p.x, cy: p.y, r: R, fill: o ? "#fbfbf6" : "#dbeeff", "fill-opacity": o ? 0.97 : 0.35, stroke: "#5d4037", "stroke-width": 6 }, g);
      if (!o) return;
      modele(g, p, o.q);
      legende(g, p, `${o.nom} : ${Math.abs(o.q) < 0.3 ? "neutre" : o.q < 0 ? "électrons en excès" : "électrons en manque"}`);
      vues[o.id] = Math.abs(o.q) < 0.3 ? 0 : Math.sign(o.q);
      L.missions.noter("loupe", { ...vues });
    };
    L.glissable(g, { soulever: false, debut: () => ({ ...p }), deplacer: (q) => { p = q; dessiner(); }, lacher: () => dessiner() });
    dessiner();
    return { dessiner };
  };
})(window.Labo);
