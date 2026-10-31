/*
Rôle : paillasse « solides homogènes » : une tige, une barre, un disque et une sphère posés sur la paillasse, et une
       planche de gommettes rouges. L'élève colle une gommette au centre d'inertie de chaque solide.
Reçoit : le groupe SVG de la paillasse ; les gestes de l'élève.
Produit : Labo.poste_solides(groupe) -> { pense_bete } ; faits notés : centres = { tige, barre, disque, sphere } (vrai si
          la gommette est au centre), gommette_hors_centre (nom du solide où une gommette est mal placée, ou null).
Utilisé par : simulation.js.
*/
(function (L) {
  const SOLIDES = {
    tige: { centre: { x: 430, y: 445 }, zone: 140, etiquette: { x: 430, y: 470 } },
    barre: { centre: { x: 730, y: 446 }, zone: 115, etiquette: { x: 886, y: 452 } },
    disque: { centre: { x: 430, y: 530 }, zone: 85, etiquette: { x: 300, y: 532 } },
    sphere: { centre: { x: 700, y: 522 }, zone: 42, etiquette: { x: 790, y: 522 } },
  };
  const NOMS = { tige: "tige", barre: "barre", disque: "disque", sphere: "sphère" };

  function etiquette(g, p, texte) {
    // Petite carte de papier posée près du solide, avec son nom écrit à la main.
    L.svg("rect", { x: p.x - 32, y: p.y - 11, width: 64, height: 22, rx: 2, fill: "#f7f5ee", stroke: "#c9c3b0", transform: `rotate(-2 ${p.x} ${p.y})` }, g);
    L.texte(g, p.x, p.y + 1, texte, { class: "etiquette-carton", "font-size": 15 });
  }

  function dessiner_solides(g) {
    // Tige d'acier, barre d'aluminium, disque de laiton, sphère d'acier, avec leurs ombres et leurs étiquettes.
    L.ombre_sol(g, 432, 452, 140, 6, 0.35);
    L.tige(g, "M300 445 H560", 10);
    for (const x of [300, 560]) L.svg("ellipse", { cx: x, cy: 445, rx: 2.5, ry: 5, fill: "#9aa3a9" }, g);
    L.ombre_sol(g, 732, 468, 118, 7, 0.35);
    L.svg("path", { d: "M620 452 H840 V466 H620 Z", fill: "url(#acier)" }, g);
    L.svg("path", { d: "M628 440 H832 L840 452 H620 Z", fill: "url(#metal-h)", stroke: "#5d666d", "stroke-width": 0.6 }, g);
    L.ombre_sol(g, 434, 544, 86, 12, 0.35);
    L.svg("path", { d: "M350 530 V540 A80 26 0 0 0 510 540 V530", fill: "url(#laiton)" }, g);
    L.svg("ellipse", { cx: 430, cy: 530, rx: 80, ry: 26, fill: "url(#laiton-haut)", stroke: "#7a5b14", "stroke-width": 0.8 }, g);
    L.ombre_sol(g, 706, 560, 40, 8, 0.4);
    const d = L.svg("radialGradient", { id: "sphere-acier", cx: 0.35, cy: 0.3, r: 0.8 }, g.ownerSVGElement.querySelector("defs"));
    for (const [o, c] of [[0, "#ffffff"], [0.3, "#c9d0d5"], [0.75, "#5d666d"], [1, "#22282d"]]) L.svg("stop", { offset: o, "stop-color": c }, d);
    L.svg("circle", { cx: 700, cy: 522, r: 38, fill: "url(#sphere-acier)", stroke: "#1b1f22", "stroke-width": 0.6 }, g);
    for (const [nom, s] of Object.entries(SOLIDES)) etiquette(g, s.etiquette, NOMS[nom]);
  }

  function planche(g) {
    // Planche de gommettes : papier blanc posé à gauche ; renvoie les places des quatre gommettes.
    L.svg("rect", { x: 34, y: 418, width: 170, height: 62, rx: 3, fill: "#f7f5ee", stroke: "#c9c3b0", filter: "url(#ombre)", transform: "rotate(-3 119 449)" }, g);
    L.texte(g, 119, 432, "Gommettes", { class: "etiquette-carton", "font-size": 13, fill: "#555" });
    return [64, 102, 140, 178].map((x) => ({ x, y: 456 }));
  }

  function gommette(g, place, etat) {
    // Une gommette rouge déplaçable ; près d'un centre libre, elle s'y colle.
    const pos = { ...place }, el = L.svg("circle", { r: 7, fill: "#e53935", stroke: "#8e1c1c", "stroke-width": 1, class: "gommette" }, g);
    const montrer = () => { el.setAttribute("cx", pos.x); el.setAttribute("cy", pos.y); };
    L.glissable(el, {
      debut: () => ({ ...pos }),
      deplacer: (p) => { Object.assign(pos, p); montrer(); },
      lacher: (p) => { Object.assign(pos, poser(p, etat, el, place)); montrer(); },
    });
    montrer();
  }

  function poser(p, etat, el, place) {
    // Où la gommette se pose : au centre (collée), ailleurs sur un solide (signalé), ou de retour sur la planche.
    for (const nom of Object.keys(etat.colle)) if (etat.colle[nom] === el) delete etat.colle[nom];
    for (const [nom, s] of Object.entries(SOLIDES)) {
      if (etat.colle[nom]) continue;
      const d = Math.hypot(p.x - s.centre.x, p.y - s.centre.y);
      if (d < 10) { etat.colle[nom] = el; noter(etat, null); return s.centre; }
      if (d < s.zone) { noter(etat, nom); return p; }
    }
    noter(etat, null);
    return place;
  }

  function noter(etat, hors_centre) {
    // Note les centres trouvés et l'éventuelle gommette mal placée.
    L.missions.noter("gommette_hors_centre", hors_centre);
    L.missions.noter("centres", Object.fromEntries(Object.keys(SOLIDES).map((n) => [n, !!etat.colle[n]])));
  }

  L.poste_solides = function (g) {
    // Construit la paillasse des solides homogènes.
    dessiner_solides(g);
    const etat = { colle: {} }, places = planche(g), calque = L.svg("g", {}, g);
    for (const place of places) gommette(calque, place, etat);
    return { pense_bete: L.decor.pense_bete(g, 24, 40, 230) };
  };
})(window.Labo);
