/*
Rôle : objets que l'élève pose sur le plateau : un aimant droit (pôles N et S) et une cale en bois couchée,
       qu'un toucher fait tourner d'un huitième de tour. Lâché hors du plateau, l'objet revient à sa place de rangement.
Reçoit : le groupe SVG, le nom de l'objet (« aimant » ou « cale »), sa place de rangement (mm, à droite du plateau).
Produit : new Labo.ObjetPlateau(parent, nom, rangement) : pos (mm), angle (rad), sur_plateau(), segment() (pour la cale).
Utilisé par : poste_bille.js, bille.js.
*/
(function (L) {
  const TAILLES = { aimant: { l: 84, h: 24 }, cale: { l: 110, h: 24 } };

  function coins(pos, angle, l, h) {
    // Les quatre coins de l'objet (mm), tourné de angle autour de son centre.
    const c = Math.cos(angle), s = Math.sin(angle);
    return [[-l / 2, -h / 2], [l / 2, -h / 2], [l / 2, h / 2], [-l / 2, h / 2]].map(([u, v]) => ({ x: pos.x + u * c - v * s, y: pos.y + u * s + v * c }));
  }

  function ObjetPlateau(parent, nom, rangement) {
    // Crée l'objet à sa place de rangement et le rend déplaçable.
    this.nom = nom;
    this.rangement = rangement;
    this.pos = { ...rangement };
    this.angle = nom === "cale" ? Math.PI / 4 : 0;
    this.g = L.svg("g", { class: `objet-${nom}`, role: "button", "aria-label": nom === "aimant" ? "Aimant droit" : "Cale en bois" }, parent);
    this.dessiner();
    L.glissable(this.g, {
      debut: () => L.Plateau.vers_ecran(this.pos.x, this.pos.y),
      deplacer: (p) => { this.pos = L.Plateau.vers_plateau(p); this.dessiner(); },
      lacher: () => { if (!this.sur_plateau()) this.pos = { ...this.rangement }; this.dessiner(); L.annoncer("objet_pose", { objet: this }); },
      toucher: () => { if (this.nom === "cale") { this.angle = (this.angle + Math.PI / 4) % Math.PI; this.dessiner(); } },
    });
  }

  const O = ObjetPlateau.prototype;

  O.sur_plateau = function () {
    // L'objet est-il posé sur le plateau (à l'intérieur du cadre) ?
    const P = L.Plateau.P;
    return this.pos.x > 20 && this.pos.x < P.l - 20 && this.pos.y > 15 && this.pos.y < P.h - 15;
  };

  O.segment = function () {
    // La cale vue comme un segment (son grand axe), pour les chocs avec la bille.
    const c = Math.cos(this.angle), s = Math.sin(this.angle), l = TAILLES.cale.l / 2;
    return { a: { x: this.pos.x - l * c, y: this.pos.y - l * s }, b: { x: this.pos.x + l * c, y: this.pos.y + l * s }, demi_epaisseur: TAILLES.cale.h / 2 };
  };

  function prisme(g, base, ep, haut, cote) {
    // Pavé couché : ombre, faces latérales (de l'arrière vers l'avant), face du dessus.
    const bas = base.map((q) => L.Plateau.vers_ecran(q.x, q.y)), dessus = bas.map((p) => ({ x: p.x, y: p.y - ep }));
    const d = (points) => "M" + points.map((p) => `${p.x} ${p.y}`).join(" L") + " Z";
    L.svg("path", { d: d(bas.map((p) => ({ x: p.x + 4, y: p.y + 3 }))), fill: "#000", opacity: 0.25, filter: "url(#flou)" }, g);
    const faces = bas.map((p, i) => [p, bas[(i + 1) % 4], dessus[(i + 1) % 4], dessus[i]]).sort((a, b) => a[0].y + a[1].y - b[0].y - b[1].y);
    for (const f of faces) L.svg("path", { d: d(f), fill: cote, stroke: "#00000040", "stroke-width": 0.5 }, g);
    L.svg("path", { d: d(dessus), fill: haut, stroke: "#00000060", "stroke-width": 0.6 }, g);
  }

  O.dessiner = function () {
    // Aimant : deux pavés, rouge (N) et bleu (S), lettres gravées ; cale : pavé de bois.
    const { l, h } = TAILLES[this.nom], g = this.g, c = Math.cos(this.angle), s = Math.sin(this.angle);
    g.replaceChildren();
    if (this.nom === "cale") { prisme(g, coins(this.pos, this.angle, l, h), 15, "url(#bois)", "#a0713f"); return; }
    for (const [de, couleur, ombre, lettre] of [[-1, "#d32f2f", "#8e1c1c", "N"], [1, "#2463c4", "#163f80", "S"]]) {
      const centre = { x: this.pos.x + c * (l / 4) * de, y: this.pos.y + s * (l / 4) * de };
      prisme(g, coins(centre, this.angle, l / 2, h), 10, couleur, ombre);
      const p = L.Plateau.vers_ecran(centre.x, centre.y);
      L.texte(g, p.x, p.y - 10, lettre, { "font-size": 9, "font-weight": 700, fill: "#fff" });
    }
  };

  L.ObjetPlateau = ObjetPlateau;
})(window.Labo);
