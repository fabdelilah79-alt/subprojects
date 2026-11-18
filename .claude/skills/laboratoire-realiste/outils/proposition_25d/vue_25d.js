/*
Rôle : la vue 2,5D commune à tous les laboratoires, à un seul endroit : hauteur du regard (rapport des ovales), lumière,
       ombres posées, et deux dessins de base qui respectent ces règles : boîte à trois faces et cylindre.
       Règles (voir GUIDE_25D.md de la compétence) : on regarde de trois quarts, un peu d'en haut ; tout cercle horizontal
       (bord d'un bécher, surface d'un liquide, socle rond) devient un ovale de rapport VUE.k ; la lumière vient d'en haut
       à gauche : dessus le plus clair, face moyenne, côté droit le plus sombre ; chaque objet posé a une ombre floue.
Reçoit : rien au chargement ; Labo.VUE peut être réglée par une simulation (par défaut : k = 0,12, la vue d'avant).
Produit : Labo.VUE { k, recul, lumiere, ombre } ; Labo.vue.ry(rx) ; Labo.vue.teinte(rgb, face) ;
          Labo.vue.ombre(g, x, y, rx) ; Labo.vue.boite(g, x, y, { l, h, p, rgb }) ; Labo.vue.cylindre(g, x, y, { r, h, rgb }).
Utilisé par : PROPOSITION seulement (dossier proposition_25d de la compétence) : verrerie_rendu_25d.js et outils/banc_25d.html.
       Pas encore dans les laboratoires : à copier dans commun/ seulement si l'enseignant valide la proposition.
*/
(function (L) {
  L.VUE = { k: 0.12, recul: 0.5, lumiere: { dessus: 1.18, face: 1, cote: 0.72, reflet: 0.28 },
    ombre: { dx: 5, dy: 3, flou: 3, opacite: 0.3 } };

  const borne = (v) => Math.max(0, Math.min(255, Math.round(v)));

  L.vue = {
    ry(rx) {
      // Demi-hauteur de l'ovale d'un cercle horizontal de demi-largeur rx : le même rapport pour tous les objets.
      return rx * L.VUE.k;
    },
    teinte(rgb, face) {
      // Couleur d'une face selon la lumière (haut-gauche) : « dessus », « face » ou « cote ».
      const f = L.VUE.lumiere[face] ?? 1;
      return `rgb(${rgb.map((v) => borne(face === "dessus" ? v + (255 - v) * (f - 1) * 2 : v * f)).join(",")})`;
    },
    ombre(g, x, y, rx) {
      // Ombre posée sous un objet : ovale flou décalé vers le bas à droite (la lumière vient d'en haut à gauche).
      const o = L.VUE.ombre;
      return L.svg("ellipse", { class: "ombre-posee", cx: x + o.dx, cy: y + o.dy, rx: rx * 1.05, ry: Math.max(2, L.vue.ry(rx) * 1.3),
        fill: "#000", opacity: o.opacite, filter: "url(#flou)" }, g);
    },
    boite(g, x, y, { l, h, p, rgb }) {
      // Boîte posée (x, y : coin avant gauche du pied) : face avant, dessus, côté droit (profondeur p, fuyante vers le haut à droite).
      const dx = p * L.VUE.recul, dy = p * L.VUE.k * 2, b = L.svg("g", { class: "boite-25d" }, g);
      L.vue.ombre(b, x + l / 2 + dx / 2, y - dy / 2, l / 2 + dx / 2);
      L.svg("path", { class: "face-avant", d: `M${x} ${y} h${l} v${-h} h${-l} z`, fill: L.vue.teinte(rgb, "face") }, b);
      L.svg("path", { class: "face-dessus", d: `M${x} ${y - h} l${dx} ${-dy} h${l} l${-dx} ${dy} z`, fill: L.vue.teinte(rgb, "dessus") }, b);
      L.svg("path", { class: "face-cote", d: `M${x + l} ${y} l${dx} ${-dy} v${-h} l${-dx} ${dy} z`, fill: L.vue.teinte(rgb, "cote") }, b);
      return b;
    },
    cylindre(g, x, y, { r, h, rgb }) {
      // Cylindre posé (x, y : milieu du pied) : corps ombré de gauche (clair) à droite (sombre), dessus ovale, reflet vertical.
      const ry = L.vue.ry(r), c = L.svg("g", { class: "cylindre-25d" }, g), id = `cyl-${Math.round(x)}-${Math.round(y)}`;
      const deg = L.svg("linearGradient", { id, x1: 0, x2: 1 }, c);
      [[0, "dessus"], [0.45, "face"], [1, "cote"]].forEach(([o, f]) => L.svg("stop", { offset: o, "stop-color": L.vue.teinte(rgb, f) }, deg));
      L.vue.ombre(c, x, y, r);
      L.svg("path", { class: "corps", d: `M${x - r} ${y - h} V${y} A${r} ${ry} 0 0 0 ${x + r} ${y} V${y - h} Z`, fill: `url(#${id})` }, c);
      L.svg("ellipse", { class: "face-dessus", cx: x, cy: y - h, rx: r, ry, fill: L.vue.teinte(rgb, "dessus") }, c);
      L.svg("rect", { x: x - r * 0.62, y: y - h + ry, width: r * 0.12, height: h - ry, fill: "#fff", opacity: L.VUE.lumiere.reflet }, c);
      return c;
    },
  };
})(window.Labo);
