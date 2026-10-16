/*
Rôle : dessin de la verrerie de chimie en 2,5D : tube à essai (liquide, ménisque, précipité déposé au fond, étiquette),
       bécher, verre de montre (solide, poudre, gouttes, bande de papier pH), flacon compte-gouttes, pipette, porte-tubes.
Reçoit : le groupe SVG où dessiner, la position (bas de l'objet) et ce qu'il contient (aspect donné par chimie_melange.js).
Produit : Labo.verrerie = { tube, becher, coupelle, flacon, pipette, porte_tubes } (chaque fonction redessine le groupe).
Utilisé par : chimie_objets.js, chimie_gouttes.js, chimie_chauffage.js.
*/
(function (L) {
  const VERRE = { fill: "url(#verre)", stroke: "#9fb6be", "stroke-width": 1 };
  const PX_ML_TUBE = 4.4;

  function remplissage(g, x, bas, demi, haut, couleur, alpha) {
    // Liquide d'un récipient à fond rond : de « bas » (fond intérieur) jusqu'à « haut », avec son ménisque.
    const r = demi, y_coude = bas - r;
    const d = haut < y_coude ? `M${x - r} ${haut} V${y_coude} A${r} ${r} 0 0 0 ${x + r} ${y_coude} V${haut} Z` : `M${x - r} ${y_coude} A${r} ${r} 0 0 0 ${x + r} ${y_coude} Z`;
    L.svg("path", { d, fill: couleur, opacity: alpha }, g);
    if (haut < y_coude) L.svg("ellipse", { cx: x, cy: haut, rx: r, ry: 1.8, fill: "#fff", opacity: 0.35 }, g);
  }

  function etiquette(g, x, y, texte, largeur = 20) {
    // Bout de ruban adhésif blanc sur lequel on a écrit au feutre.
    L.svg("rect", { x: x - largeur / 2, y, width: largeur, height: 10, rx: 1, fill: "#fbfaf3", stroke: "#cfcab8", "stroke-width": 0.5 }, g);
    L.texte(g, x, y + 5.5, texte, { "font-size": texte.length > 5 ? 5 : 6.5, "font-weight": 700, fill: "#23315a" });
  }

  function solide(g, x, y, nom) {
    // Échantillon solide posé dans le verre de montre.
    const c = L.rgb(L.CHIMIE.solides[nom].rgb), e = 1.25;
    if (nom === "papier") L.svg("path", { d: `M${x - 16 * e} ${y - 2 * e} L${x + 6 * e} ${y - 6 * e} L${x + 18 * e} ${y + e} L${x - 4 * e} ${y + 5 * e} Z`, fill: c, stroke: "#c8c8c0", "stroke-width": 0.5 }, g);
    if (nom === "papier_filtre") L.svg("path", { d: `M${x - 22} ${y + 2} A24 8 0 0 1 ${x + 22} ${y + 2} L${x} ${y + 5} Z`, fill: c, stroke: "#d4d4cc", "stroke-width": 0.5 }, g);
    if (nom === "pomme_de_terre") {
      L.svg("ellipse", { cx: x, cy: y, rx: 21, ry: 7.5, fill: "#9b7a45" }, g);
      L.svg("ellipse", { cx: x, cy: y - 0.6, rx: 19.5, ry: 6.5, fill: c }, g);
    }
    if (nom === "pulpe_orange") {
      L.svg("path", { d: `M${x - 20} ${y + 2} Q${x} ${y - 11} ${x + 20} ${y + 2} Q${x} ${y + 7} ${x - 20} ${y + 2} Z`, fill: c, stroke: "#c96f12", "stroke-width": 0.6 }, g);
      for (const dx of [-8, -3, 2, 7]) L.svg("path", { d: `M${x + dx} ${y + 3} l${dx / 4} -6`, stroke: "#ffd08a", "stroke-width": 0.8 }, g);
    }
  }
  L.dessin_solide = solide;

  const verrerie = {
    tube(g, x, bas, m, texte = "") {
      // Tube à essai de 18 × 150 mm vu de face : bas = point le plus bas du verre.
      g.replaceChildren();
      L.svg("ellipse", { cx: x + 3, cy: bas + 2, rx: 10, ry: 2.5, fill: "#000", opacity: 0.25 }, g);
      const a = m ? m.aspect() : null, V = m ? m.volume() : 0;
      if (a && V > 0) remplissage(g, x, bas - 2, 9, bas - 2 - V * PX_ML_TUBE, L.rgb(a.rgb), a.alpha);
      if (a && a.precipite) remplissage(g, x, bas - 2, 9, bas - 2 - 9 - 5 * a.precipite.q, L.rgb(a.precipite.rgb), 0.9);
      L.svg("path", { d: `M${x - 11} ${bas - 130} V${bas - 11} A11 11 0 0 0 ${x + 11} ${bas - 11} V${bas - 130}`, ...VERRE }, g);
      L.svg("ellipse", { cx: x, cy: bas - 130, rx: 12.5, ry: 2.6, fill: "none", stroke: "#9fb6be", "stroke-width": 1.4 }, g);
      L.svg("path", { d: `M${x - 7} ${bas - 124} V${bas - 16}`, stroke: "#fff", "stroke-width": 1.6, opacity: 0.6 }, g);
      if (texte) etiquette(g, x, bas - 116, texte, 20);
    },
    becher(g, x, bas, m, texte = "", { l = 46, h = 58, capacite = 50 } = {}) {
      // Petit bécher à bec, graduations, liquide.
      g.replaceChildren();
      L.svg("ellipse", { cx: x + 4, cy: bas + 1, rx: l / 2 + 2, ry: 4, fill: "#000", opacity: 0.25 }, g);
      const a = m ? m.aspect() : null, V = m ? m.volume() : 0;
      if (a && V > 0) {
        const haut = bas - 3 - (V / capacite) * (h - 8);
        L.svg("rect", { x: x - l / 2 + 2, y: haut, width: l - 4, height: bas - 3 - haut, fill: L.rgb(a.rgb), opacity: a.alpha }, g);
        L.svg("ellipse", { cx: x, cy: haut, rx: l / 2 - 2, ry: 2.4, fill: "#fff", opacity: 0.3 }, g);
      }
      L.svg("path", { d: `M${x - l / 2} ${bas - h} V${bas - 2} Q${x - l / 2} ${bas} ${x - l / 2 + 3} ${bas} H${x + l / 2 - 3} Q${x + l / 2} ${bas} ${x + l / 2} ${bas - 2} V${bas - h} l3 -3`, ...VERRE }, g);
      for (let k = 1; k <= 4; k++) L.svg("line", { x1: x - l / 2 + 4, x2: x - l / 2 + 10, y1: bas - 3 - (k / 5) * (h - 8), y2: bas - 3 - (k / 5) * (h - 8), stroke: "#fff", opacity: 0.7 }, g);
      if (texte) etiquette(g, x + 6, bas - h + 16, texte, Math.max(22, texte.length * 4.2));
    },
    coupelle(g, x, y, c) {
      // Verre de montre de 8 cm posé sur la paillasse (vu un peu d'en haut) ; les gouttes s'étalent sous la poudre.
      g.replaceChildren();
      L.svg("ellipse", { cx: x + 3, cy: y + 5, rx: 40, ry: 11, fill: "#000", opacity: 0.25 }, g);
      L.svg("ellipse", { cx: x, cy: y, rx: 40, ry: 12, ...VERRE }, g);
      L.svg("ellipse", { cx: x, cy: y + 1, rx: 31, ry: 7.5, fill: "#ffffff", opacity: 0.12 }, g);
      if (c.solide) solide(g, x, y, c.solide);
      if (c.bande_ph) {
        L.svg("rect", { x: x - 24, y: y - 4, width: 48, height: 8, fill: L.couleur_ph(null), stroke: "#c9a35a", "stroke-width": 0.4 }, g);
        if (c.bande_ph.tache) L.svg("ellipse", { cx: x, cy: y, rx: 7, ry: 4, fill: c.bande_ph.tache }, g);
      }
      for (const t of c.taches || []) L.svg("ellipse", { cx: x + t.dx, cy: y + t.dy, rx: t.r, ry: t.r * 0.45, fill: t.couleur, opacity: t.alpha ?? 0.85 }, g);
      if (c.poudre) L.svg("path", { d: `M${x - 12} ${y + 3} Q${x} ${y - 9} ${x + 12} ${y + 3} Z`, fill: c.poudre, stroke: "#00000022" }, g);
    },
    flacon(g, x, bas, texte, { verre = "#6b3a12", liquide = null, ouvert = false, bouchon = false } = {}) {
      // Flacon compte-gouttes en verre teinté avec son étiquette ; ouvert : sa pipette a été retirée ; bouchon : on dessine sa poire.
      g.replaceChildren();
      L.svg("ellipse", { cx: x + 4, cy: bas + 1, rx: 17, ry: 3.5, fill: "#000", opacity: 0.28 }, g);
      L.svg("path", { d: `M${x - 15} ${bas - 2} V${bas - 36} Q${x - 15} ${bas - 44} ${x - 6} ${bas - 46} V${bas - 52} H${x + 6} V${bas - 46} Q${x + 15} ${bas - 44} ${x + 15} ${bas - 36} V${bas - 2} Q${x + 15} ${bas} ${x + 12} ${bas} H${x - 12} Q${x - 15} ${bas} ${x - 15} ${bas - 2} Z`, fill: verre, opacity: 0.88, stroke: "#2b1606" }, g);
      if (liquide) L.svg("rect", { x: x - 13, y: bas - 30, width: 26, height: 28, fill: liquide, opacity: 0.35 }, g);
      L.svg("rect", { x: x - 12, y: bas - 32, width: 24, height: 18, fill: "#f7f3e6", stroke: "#bdb59c", "stroke-width": 0.5 }, g);
      String(texte).split("\n").forEach((t, i, tout) => L.texte(g, x, bas - 23 - 3 * (tout.length - 1) + i * 6, t, { "font-size": 4.6, "font-weight": 700, fill: "#222" }));
      if (ouvert) L.svg("ellipse", { cx: x, cy: bas - 52, rx: 6, ry: 1.8, fill: "#1a0d04" }, g);
      if (bouchon) {
        L.svg("rect", { x: x - 6, y: bas - 60, width: 12, height: 8, rx: 1.5, fill: "#2a2a2c" }, g);
        L.svg("path", { d: `M${x - 5} ${bas - 60} V${bas - 72} Q${x - 5} ${bas - 83} ${x} ${bas - 83} Q${x + 5} ${bas - 83} ${x + 5} ${bas - 72} V${bas - 60} Z`, fill: "#1d1d1f" }, g);
      }
    },
    pipette(g, x, bout, { rgb = null, poire = "#1d1d1f", bague = true } = {}) {
      // Pipette, pointe en bas en (x, bout) : tube de verre effilé, poire en caoutchouc ; bague : celle d'un flacon compte-gouttes.
      g.replaceChildren();
      L.svg("path", { d: `M${x - 0.8} ${bout} L${x - 3} ${bout - 22} V${bout - 66} H${x + 3} V${bout - 22} L${x + 0.8} ${bout} Z`, ...VERRE }, g);
      if (rgb) L.svg("path", { d: `M${x - 0.6} ${bout - 1} L${x - 2.2} ${bout - 18} H${x + 2.2} L${x + 0.6} ${bout - 1} Z`, fill: L.rgb(rgb), opacity: 0.9 }, g);
      if (bague) L.svg("rect", { x: x - 6, y: bout - 72, width: 12, height: 8, rx: 1.5, fill: "#2a2a2c" }, g);
      L.svg("path", { d: `M${x - 5} ${bout - (bague ? 72 : 64)} V${bout - 84} Q${x - 5} ${bout - 95} ${x} ${bout - 95} Q${x + 5} ${bout - 95} ${x + 5} ${bout - 84} V${bout - (bague ? 72 : 64)} Z`, fill: poire }, g);
      L.svg("path", { d: `M${x - 2.5} ${bout - 90} V${bout - 76}`, stroke: "#fff", "stroke-width": 1, opacity: 0.25 }, g);
    },
    porte_tubes(fond, devant, x, bas, n, pas = 40) {
      // Porte-tubes en bois : socle et plaque percée ; le bord avant de la plaque passe devant les tubes.
      const largeur = n * pas + 16, y_plaque = bas - 64;
      L.svg("ellipse", { cx: x + largeur / 2 + 4, cy: bas + 3, rx: largeur / 2 + 6, ry: 5, fill: "#000", opacity: 0.3 }, fond);
      L.svg("rect", { x, y: bas - 10, width: largeur, height: 10, rx: 2, fill: "url(#bois)" }, fond);
      for (const dx of [4, largeur - 12]) L.svg("rect", { x: x + dx, y: y_plaque, width: 8, height: 56, fill: "url(#bois-face)" }, fond);
      L.svg("rect", { x, y: y_plaque - 8, width: largeur, height: 8, fill: "#c99a64" }, fond);
      for (let k = 0; k < n; k++) L.svg("ellipse", { cx: x + 8 + pas * (k + 0.5), cy: y_plaque - 4, rx: 12, ry: 3, fill: "#5a3d1e" }, fond);
      L.svg("rect", { x, y: y_plaque, width: largeur, height: 7, fill: "url(#bois)", "pointer-events": "none" }, devant);
      return Array.from({ length: n }, (_, k) => ({ x: x + 8 + pas * (k + 0.5), bas: bas - 4 }));
    },
  };
  L.verrerie = verrerie;
})(window.Labo);
