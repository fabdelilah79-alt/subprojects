/*
Rôle : petits morceaux de papier dans une coupelle : une baguette électrisée tenue à quelques centimètres les attire
       (ils sautent et se collent à elle) ; au contact, ils se chargent comme elle, sont repoussés et retombent ; chargés,
       ils ne sont plus attirés pendant 20 s (ou jusqu'à un nouveau frottement). Une baguette neutre ne fait rien.
Reçoit : le groupe SVG ; la position de la coupelle ; la liste des baguettes (état de frottement.js).
Produit : Labo.papiers(groupe, coupelle, baguettes) -> { lacher(baguette) } (seule une baguette tenue attire) ; faits notés :
          « papiers_attires » = { <id de baguette> : oui }, « papiers_neutre » = id d'une baguette neutre approchée.
Utilisé par : poste_papier.js (le mouvement de chaque morceau est dans papiers_mouvement.js).
*/
(function (L) {
  const N = 14;

  function coupelle_verre(g, x, y) {
    // Coupelle de verre vue un peu d'en haut : ombre, paroi, fond.
    L.svg("ellipse", { cx: x, cy: y + 10, rx: 50, ry: 11, fill: "#000", opacity: 0.3 }, g);
    L.svg("path", { d: `M${x - 48} ${y - 2} v8 a48 11 0 0 0 96 0 v-8`, fill: "#c9dde4", "fill-opacity": 0.35, stroke: "#9fb6be" }, g);
    L.svg("ellipse", { cx: x, cy: y - 2, rx: 48, ry: 11, fill: "#dfeef2", "fill-opacity": 0.25, stroke: "#b9cdd4" }, g);
  }

  function dessiner(calque, b) {
    // Morceau de papier ; son ombre au sol s'éloigne et pâlit quand il est en l'air.
    const p = L.papier.ecran(b);
    if (b.h > 1) L.svg("ellipse", { cx: b.sol.x + 1, cy: b.sol.y + 1, rx: 3, ry: 1.5, fill: "#000", opacity: Math.max(0.05, 0.3 - b.h / 200) }, calque);
    L.svg("rect", { x: p.x - 3, y: p.y - 2, width: 6, height: 4, fill: b.couleur, stroke: "#999", "stroke-width": 0.3, transform: `rotate(${b.a} ${p.x} ${p.y})` }, calque);
  }

  L.papiers = function (g, coupelle, baguettes) {
    // Coupelle et confettis ; boucle d'animation des vols vers la baguette et des chutes.
    const { x, y } = coupelle;
    coupelle_verre(g, x, y);
    const calque = L.svg("g", { "pointer-events": "none" }, g), attires = {};
    L.svg("path", { d: `M${x - 48} ${y - 2} a48 11 0 0 0 96 0`, fill: "none", stroke: "#e8f4f7", "stroke-width": 1.5, opacity: 0.7 }, g);
    const bouts = Array.from({ length: N }, (_, i) => ({
      sol: { x: x - 30 + ((i * 37) % 60), y: y - 4 + ((i * 13) % 9) }, h: 0, v: 0, a: (i * 47) % 180, phase: (i * 2.3) % 6,
      couleur: i % 3 ? "#fdfdf8" : "#f6d26a", etat: "repos",
    }));
    const chercher = (b) => {
      // Une baguette chargée, tenue assez près, attire le morceau ; une baguette neutre approchée est notée sans effet.
      const p = L.papier.ecran(b);
      for (const bg of baguettes) {
        if (!bg.tenue) continue;
        const { d } = L.papier.point_baguette(bg, p), q = Math.abs(bg.q);
        const charge = b.decharge > 0 && b.charge_par === bg.id && q < b.q_contact + 0.5;
        if (q > 0.3 && !charge && d < 12 + 9 * q) return bg;
        if (q <= 0.3 && d < 40) L.missions.noter("papiers_neutre", bg.id);
      }
      return null;
    };
    const contact = (bg) => { attires[bg.id] = true; L.missions.noter("papiers_attires", { ...attires }); };
    let avant = null;
    const image = (t) => {
      const dt = avant === null ? 0 : Math.min(0.05, (t - avant) / 1000);
      avant = t;
      calque.replaceChildren();
      for (const b of bouts) { L.papier.avancer(b, dt, t / 1000, chercher, contact); dessiner(calque, b); }
      requestAnimationFrame(image);
    };
    requestAnimationFrame(image);
    return {
      lacher(bg) {
        // La baguette est reposée : les papiers encore collés s'en détachent et tombent.
        for (const b of bouts) if ((b.etat === "colle" || b.etat === "vole") && b.bg === bg) L.papier.detacher(b, bg);
      },
    };
  };
})(window.Labo);
