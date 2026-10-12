/*
Rôle : bloc de mousse jaune (8 cm d'épaisseur) qui se creuse sous la brique, et réglet en acier gradué en mm,
       que l'on fait glisser contre la face avant de la mousse, son zéro au niveau de la surface.
Reçoit : les groupes SVG ; l'empreinte de la brique (bords gauche et droit, enfoncement en mm).
Produit : new Mousse(fond, devant) avec creuser(empreinte) ; new Reglet(parent) ; Mousse.SURFACE (niveau du dessus).
Utilisé par : poste_pression.js.
*/
(function (L) {
  const M = { gauche: 330, droite: 690, surface: 470, bas: 550, recul: { x: 36, y: -48 } };

  function Mousse(fond, devant) {
    // Dessine le dessus (derrière les briques) et prépare la face avant (devant les briques).
    L.ombre_sol(fond, (M.gauche + M.droite) / 2 + 12, M.bas + 2, 200, 10, 0.55);
    const { x: rx, y: ry } = M.recul;
    L.svg("path", { d: `M${M.gauche} ${M.surface} L${M.gauche + rx} ${M.surface + ry} H${M.droite + rx} L${M.droite} ${M.surface} Z`, fill: "url(#mousse-haut)" }, fond);
    L.svg("path", { d: `M${M.droite} ${M.surface} L${M.droite + rx} ${M.surface + ry} V${M.bas + ry} L${M.droite} ${M.bas} Z`, fill: "#d3a42f" }, fond);
    this.creux = L.svg("path", { fill: "#c99a2a", opacity: 0.55 }, fond);
    this.face = L.svg("path", { fill: "url(#mousse-face)", stroke: "#c8961f", "stroke-width": 0.8 }, devant);
    this.creuser(null);
  }

  Mousse.prototype.creuser = function (empreinte) {
    // Redessine la face avant : creusée sous la brique sur « d » millimètres (1 px = 1 mm), avec des bords arrondis.
    const { gauche: g, droite: dr, surface: s, bas: b } = M;
    if (!empreinte || empreinte.d < 0.05) {
      this.face.setAttribute("d", `M${g} ${s} H${dr} V${b} H${g} Z`);
      this.creux.setAttribute("d", "");
      return;
    }
    const { x0, x1, d } = empreinte;
    const bord = Math.min(18, 4 + d);
    this.face.setAttribute("d", `M${g} ${s} H${x0 - bord} C${x0 - bord / 3} ${s} ${x0} ${s + d * 0.6} ${x0} ${s + d}` +
      ` H${x1} C${x1} ${s + d * 0.6} ${x1 + bord / 3} ${s} ${x1 + bord} ${s} H${dr} V${b} H${g} Z`);
    const { x: rx, y: ry } = M.recul;
    this.creux.setAttribute("d", `M${x0 - bord} ${s} L${x1 + bord} ${s} L${x1 + bord + rx * 0.6} ${s + ry * 0.6} L${x0 - bord + rx * 0.6} ${s + ry * 0.6} Z`);
  };

  function Reglet(parent, x) {
    // Réglet en acier vertical : 0 au niveau de la surface de la mousse, graduations vers le bas jusqu'à 70 mm (il s'arrête au bas de la mousse).
    this.g = L.svg("g", { filter: "url(#ombre)", class: "reglet" }, parent);
    L.svg("rect", { x: -9, y: -14, width: 18, height: 93, rx: 1.5, fill: "url(#metal)", stroke: "#6c747a", "stroke-width": 0.6 }, this.g);
    L.svg("circle", { cx: -4, cy: -8, r: 2.2, fill: "#4c5359" }, this.g);
    for (let mm = 0; mm <= 70; mm++) {
      const longueur = mm % 10 === 0 ? 9 : (mm % 5 === 0 ? 6 : 3.5);
      L.svg("line", { x1: -9, y1: mm, x2: -9 + longueur, y2: mm, stroke: "#151515", "stroke-width": mm % 10 === 0 ? 0.6 : 0.35 }, this.g);
      if (mm % 10 === 0) L.texte(this.g, 4, mm, String(mm / 10), { class: "graduation", "font-size": 6.5 });
    }
    L.texte(this.g, 4, -8, "cm", { class: "graduation", "font-size": 5 });
    this.x = x;
    L.placer(this.g, x, M.surface);
    L.glissable(this.g, {
      debut: () => ({ x: this.x, y: M.surface }),
      deplacer: (p) => { this.x = Math.max(M.gauche - 30, Math.min(M.droite + 30, p.x)); L.placer(this.g, this.x, M.surface); },
      lacher: () => {},
    });
  }

  L.Mousse = Mousse;
  L.Reglet = Reglet;
  L.Mousse.ZONE = M;
})(window.Labo);
