/*
Rôle : cylindres de métal pleins (cuivre, aluminium, fer, zinc…), de même taille (diamètre 16 mm, hauteur 30 mm), posés
       sur une plaque de bois avec leur étiquette ; on les prend pour les poser sur le plateau d'une balance, puis on les
       repose à leur place. Leur masse est celle du volume réel (6,03 cm³) multiplié par la masse volumique du métal.
Reçoit : le contexte de la paillasse, la balance (balance_electronique.js) et la liste [{ id, metal, x }] ; { sol, e }.
Produit : Labo.echantillons_metal(ctx, balance, liste, reglage) -> [{ id, metal, masse, sur_balance }] ;
          Labo.METAUX (masse volumique en g/cm³, couleurs, nom).
Utilisé par : les simulations de chimie (masse des atomes).
*/
(function (L) {
  const METAUX = {
    cuivre: { nom: "cuivre", rho: 8.96, clair: "#e7a77c", fonce: "#9a4f27" },
    aluminium: { nom: "aluminium", rho: 2.7, clair: "#eef1f3", fonce: "#9aa2a8" },
    fer: { nom: "fer", rho: 7.87, clair: "#b9bec2", fonce: "#5d6368" },
    zinc: { nom: "zinc", rho: 7.14, clair: "#d7dde2", fonce: "#7f8a92" },
  };
  L.METAUX = METAUX;
  const V = Math.PI * 0.8 * 0.8 * 3;

  function cylindre(g, m, e) {
    // Cylindre vu un peu d'en haut : flanc dégradé (reflet métallique) et face supérieure ; repère : bas au point (0, 0).
    const r = 8 * e, h = 30 * e, id = `metal-${m.nom}`;
    if (!document.getElementById(id)) {
      const d = L.svg("linearGradient", { id, x1: 0, y1: 0, x2: 1, y2: 0 }, document.querySelector("svg defs"));
      [[0, m.fonce], [0.35, m.clair], [0.55, m.clair], [1, m.fonce]].forEach(([o, c]) => L.svg("stop", { offset: o, "stop-color": c }, d));
    }
    L.svg("ellipse", { cx: 2, cy: 1, rx: r + 2, ry: 3, fill: "#000", opacity: 0.3 }, g);
    L.svg("path", { d: `M${-r} ${-h} V0 A${r} ${r * 0.3} 0 0 0 ${r} 0 V${-h} Z`, fill: `url(#${id})`, stroke: m.fonce, "stroke-width": 0.5 }, g);
    L.svg("ellipse", { cx: 0, cy: -h, rx: r, ry: r * 0.3, fill: m.clair, stroke: m.fonce, "stroke-width": 0.5 }, g);
  }

  function plaque(g, liste, sol) {
    // Plaque de bois sous les cylindres, et une étiquette par métal.
    const x1 = Math.min(...liste.map((o) => o.x)) - 34, x2 = Math.max(...liste.map((o) => o.x)) + 34;
    L.svg("rect", { x: x1, y: sol - 6, width: x2 - x1, height: 8, rx: 2, fill: "url(#bois)", stroke: "#7a5730" }, g);
    for (const o of liste) {
      L.svg("rect", { x: o.x - 26, y: sol + 3, width: 52, height: 11, rx: 1, fill: "#fff", stroke: "#c9c4b0" }, g);
      L.texte(g, o.x, sol + 10.5, METAUX[o.metal].nom, { "font-size": 7, "font-weight": 700, fill: "#222" });
    }
  }

  L.echantillons_metal = function (ctx, balance, liste, { sol, e = 1.6 }) {
    // Chaque cylindre se glisse sur le plateau (place libre la plus proche) ou retourne sur sa plaque.
    plaque(ctx.fond, liste, sol);
    const places = [-36, 0, 36].map((dx) => ({ x: balance.plateau.x + dx, y: balance.plateau.y + 2, libre: true }));
    return liste.map((o) => {
      const m = METAUX[o.metal], ech = { id: o.id, metal: o.metal, masse: Math.round(V * m.rho * 100) / 100, sur_balance: false, pos: { x: o.x, y: sol - 6 } };
      const g = L.svg("g", { class: `echantillon echantillon-${o.id}`, role: "button", "aria-label": `cylindre de ${m.nom}` }, ctx.objets);
      cylindre(g, m, e);
      const aller = (q) => { ech.pos = q; L.placer(g, q.x, q.y); };
      L.glissable(g, {
        debut: () => ({ ...ech.pos }),
        saisir: () => { if (ech.place) { ech.place.libre = true; ech.place = null; balance.retirer(ech); ech.sur_balance = false; } ctx.haut.append(g); },
        deplacer: aller,
        lacher: (q) => {
          ctx.objets.append(g);
          const p = places.filter((s) => s.libre).sort((a, b) => Math.abs(a.x - q.x) - Math.abs(b.x - q.x))[0];
          if (p && Math.abs(q.x - balance.plateau.x) < balance.plateau.r + 10 && Math.abs(q.y - balance.plateau.y) < 60) {
            p.libre = false; ech.place = p; ech.sur_balance = true; aller(p); balance.ajouter(ech);
          } else aller({ x: o.x, y: sol - 6 });
          ctx.signaler?.();
        },
      });
      aller(ech.pos);
      return ech;
    });
  };
})(window.Labo);
