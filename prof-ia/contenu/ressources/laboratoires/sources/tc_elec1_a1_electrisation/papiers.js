/*
Rôle : petits morceaux de papier dans une coupelle : une baguette électrisée approchée à quelques centimètres les attire
       (ils sautent et se collent à elle) ; au contact, ils se chargent comme elle, sont repoussés et retombent ; chargés,
       ils ne sont plus attirés pendant 20 s (ou jusqu'à un nouveau frottement). Une baguette neutre ne fait rien.
Reçoit : le groupe SVG ; la position de la coupelle ; la liste des baguettes (état de frottement.js).
Produit : Labo.papiers(groupe, coupelle, baguettes) -> { lacher(baguette) } (seule une baguette tenue attire) ; faits notés :
          « papiers_attires » = { <id de baguette> : oui }, « papiers_neutre » = id d'une baguette neutre approchée.
Utilisé par : poste_papier.js.
*/
(function (L) {
  const N = 14, DEMI = 100, DECHARGE_S = 20;

  function distance_baguette(b, p) {
    // Distance d'un point au segment de la baguette (tenue horizontalement).
    const x = Math.max(b.pos.x - DEMI, Math.min(b.pos.x + DEMI, p.x));
    return { d: Math.hypot(p.x - x, p.y - b.pos.y), point: { x, y: b.pos.y + 6 } };
  }

  function vers(b, cible, vitesse, dt) {
    // Rapproche le morceau de sa cible ; renvoie la distance qui restait.
    const d = { x: cible.x - b.p.x, y: cible.y - b.p.y }, n = Math.hypot(d.x, d.y), v = Math.min(n, vitesse * dt);
    if (n > 0) b.p = { x: b.p.x + (d.x / n) * v, y: b.p.y + (d.y / n) * v };
    return n;
  }

  function avancer(b, dt, chercher, attires) {
    // Au repos → attiré (vol) → collé un moment → repoussé, il retombe chargé (il ne revient pas tant qu'il est chargé).
    b.decharge = Math.max(0, (b.decharge || 0) - dt);
    if (b.etat === "repos") { const bg = chercher(b); if (bg) Object.assign(b, { etat: "vole", bg, duree: 1.5 + ((b.a % 7) / 7) * 2 }); }
    else if (b.etat === "vole") {
      if (vers(b, distance_baguette(b.bg, b.p).point, 500, dt) < 4) {
        Object.assign(b, { etat: "colle", decalage: { x: b.p.x - b.bg.pos.x, y: b.p.y - b.bg.pos.y } });
        attires[b.bg.id] = true;
        L.missions.noter("papiers_attires", { ...attires });
      }
    } else if (b.etat === "colle") {
      b.p = { x: b.bg.pos.x + b.decalage.x, y: b.bg.pos.y + b.decalage.y };
      b.duree -= dt;
      if (b.duree < 0) Object.assign(b, { etat: "tombe", charge_par: b.bg.id, q_contact: Math.abs(b.bg.q), decharge: DECHARGE_S });
    } else if (vers(b, b.repos, 300, dt) < 1) b.etat = "repos";
  }

  L.papiers = function (g, coupelle, baguettes) {
    // Coupelle de verre et confettis ; boucle d'animation des vols vers la baguette et des chutes.
    const { x, y } = coupelle;
    L.svg("ellipse", { cx: x, cy: y + 10, rx: 50, ry: 11, fill: "#000", opacity: 0.3 }, g);
    L.svg("path", { d: `M${x - 48} ${y - 2} v8 a48 11 0 0 0 96 0 v-8`, fill: "#c9dde4", "fill-opacity": 0.35, stroke: "#9fb6be" }, g);
    L.svg("ellipse", { cx: x, cy: y - 2, rx: 48, ry: 11, fill: "#dfeef2", "fill-opacity": 0.25, stroke: "#b9cdd4" }, g);
    const calque = L.svg("g", { "pointer-events": "none" }, g), attires = {};
    L.svg("path", { d: `M${x - 48} ${y - 2} a48 11 0 0 0 96 0`, fill: "none", stroke: "#e8f4f7", "stroke-width": 1.5, opacity: 0.7 }, g);
    const bouts = Array.from({ length: N }, (_, i) => ({ repos: { x: coupelle.x - 30 + ((i * 37) % 60), y: coupelle.y - 4 + ((i * 13) % 9) }, a: (i * 47) % 180, etat: "repos" }));
    bouts.forEach((b) => { b.p = { ...b.repos }; });
    const chercher = (b) => {
      // Une baguette chargée assez proche attire le morceau ; une baguette neutre est notée sans effet.
      for (const bg of baguettes) {
        const { d } = distance_baguette(bg, b.p), q = Math.abs(bg.q);
        const charge = b.decharge > 0 && b.charge_par === bg.id && q < b.q_contact + 0.5;
        if (!bg.tenue) continue;
        if (q > 0.3 && !charge && d < 12 + 9 * q) return bg;
        if (q <= 0.3 && d < 40) L.missions.noter("papiers_neutre", bg.id);
      }
      return null;
    };
    let avant = null;
    const image = (t) => {
      const dt = avant === null ? 0 : Math.min(0.05, (t - avant) / 1000);
      avant = t;
      calque.replaceChildren();
      for (const b of bouts) {
        avancer(b, dt, chercher, attires);
        L.svg("rect", { x: b.p.x - 3, y: b.p.y - 2, width: 6, height: 4, fill: b.a % 3 ? "#fdfdf8" : "#f6d26a", stroke: "#999", "stroke-width": 0.3, transform: `rotate(${b.a} ${b.p.x} ${b.p.y})` }, calque);
      }
      requestAnimationFrame(image);
    };
    requestAnimationFrame(image);
    return {
      lacher(bg) {
        // La baguette est reposée : les papiers encore collés s'en détachent et retombent dans la coupelle.
        for (const b of bouts) if ((b.etat === "colle" || b.etat === "vole") && b.bg === bg) Object.assign(b, { etat: "tombe", charge_par: bg.id, q_contact: Math.abs(bg.q), decharge: DECHARGE_S });
      },
    };
  };
})(window.Labo);
