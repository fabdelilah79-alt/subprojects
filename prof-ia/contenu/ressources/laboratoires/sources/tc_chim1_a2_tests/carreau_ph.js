/*
Rôle : objets de la paillasse « acide ou basique » et petites cartes des échantillons : carreau de faïence blanc portant
       des bandes de papier pH (une goutte qui tombe sur une bande la colore selon le pH du liquide), boîte de papier pH
       avec son échelle de teintes de 1 à 14, carte posée devant un échantillon.
Reçoit : le contexte de la paillasse (avec ctx.ecoulement) et { x1, x2, sol, e (px/mm), bandes : [x des bandes] }.
Produit : Labo.carreau_ph(ctx, reglage) -> { bandes : [{ x, pH (null tant qu'aucune goutte) }] } ; Labo.boite_ph(g, x, y) ;
          Labo.carte_chimie(g, x, y, texte).
Utilisé par : postes_eau_ph.js, postes_amidon_glucose.js.
*/
(function (L) {
  L.carte_chimie = function (g, x, y, texte) {
    // Petite carte blanche posée sur la paillasse (numéro et nom de l'échantillon).
    const l = Math.max(44, texte.length * 4.4 + 10);
    L.svg("rect", { x: x - l / 2, y, width: l, height: 11, rx: 1, fill: "#fbfaf3", stroke: "#cfcab8", "stroke-width": 0.5 }, g);
    L.texte(g, x, y + 5.8, texte, { "font-size": 7, "font-weight": 700, fill: "#23315a" });
  };

  L.boite_ph = function (g, x, y) {
    // Boîte de papier pH universel avec son échelle de teintes de 1 à 14.
    L.svg("rect", { x: x + 3, y: y + 4, width: 150, height: 42, fill: "#000", opacity: 0.25, filter: "url(#flou)" }, g);
    L.svg("rect", { x, y, width: 150, height: 42, rx: 2, fill: "#f6f3e8", stroke: "#b9b19a" }, g);
    L.texte(g, x + 75, y + 8, "PAPIER pH universel 1 – 14", { "font-size": 6.5, "font-weight": 700, fill: "#23315a" });
    for (let k = 1; k <= 14; k++) {
      L.svg("rect", { x: x + 5 + (k - 1) * 10, y: y + 14, width: 9, height: 13, fill: L.couleur_ph(k) }, g);
      L.texte(g, x + 9.5 + (k - 1) * 10, y + 34, String(k), { "font-size": 5.5, fill: "#333" });
    }
  };

  function ph_goutte(gt) {
    // pH du liquide d'une goutte (null pour un liquide non aqueux).
    const part = gt.parts[0];
    if (!part || part.classe !== "aqueuse") return null;
    return L.pH_phase({ ...part, V: Object.values(part.liquides).reduce((s, v) => s + v, 0) });
  }

  function dessiner(g, { x1, x2, sol, e }, bandes, mouilles) {
    // Carreau vu un peu d'en haut (dessus de 12 mm en perspective, chant de 6 mm), bandes de 7 mm, taches.
    g.replaceChildren();
    const haut = sol - 18 * e, dessus = sol - 6 * e;
    L.svg("ellipse", { cx: (x1 + x2) / 2 + 4, cy: sol + 1, rx: (x2 - x1) / 2 + 4, ry: 4, fill: "#000", opacity: 0.28 }, g);
    L.svg("path", { d: `M${x1 + 6} ${haut} H${x2 - 6} L${x2} ${dessus} H${x1} Z`, fill: "#fbfbf9", stroke: "#c9ccc8", "stroke-width": 0.6 }, g);
    L.svg("rect", { x: x1, y: dessus, width: x2 - x1, height: 6 * e, fill: "#e9ebe8", stroke: "#c9ccc8", "stroke-width": 0.6 }, g);
    for (const m of mouilles) L.svg("ellipse", { cx: m, cy: sol - 12 * e, rx: 4, ry: 2, fill: "#cfe3ec", opacity: 0.8 }, g);
    for (const b of bandes) {
      L.svg("path", { d: `M${b.x - 3.5 * e + 1.5} ${sol - 16 * e} H${b.x + 3.5 * e + 1.5} L${b.x + 3.5 * e - 1} ${sol - 8 * e} H${b.x - 3.5 * e - 1} Z`, fill: L.couleur_ph(null), stroke: "#c9a35a", "stroke-width": 0.4 }, g);
      if (b.tache) L.svg("ellipse", { cx: b.tache, cy: sol - 12 * e, rx: 4.6, ry: 3, fill: L.couleur_ph(b.pH) }, g);
    }
  }

  L.carreau_ph = function (ctx, reglage) {
    // Construit le carreau et l'inscrit comme cible des gouttes.
    const { x1, x2, sol, e = 1.6 } = reglage, bandes = reglage.bandes.map((x) => ({ x, pH: null, tache: null })), mouilles = [];
    const g = L.svg("g", { class: "carreau-ph", "pointer-events": "none" }, ctx.fond);
    ctx.ecoulement.ajouter_cible({
      contient: (p) => p.x > x1 && p.x < x2 && p.y > sol - 18 * e && p.y < sol - 6 * e,
      recevoir: (gt) => {
        const b = bandes.find((q) => Math.abs(q.x - gt.x) < 3.5 * e + 2);
        if (b) Object.assign(b, { pH: ph_goutte(gt), tache: Math.max(b.x - 3, Math.min(b.x + 3, gt.x)) }); else mouilles.push(gt.x);
        dessiner(g, { x1, x2, sol, e }, bandes, mouilles); ctx.signaler?.();
      },
    });
    dessiner(g, { x1, x2, sol, e }, bandes, mouilles);
    return { bandes };
  };
})(window.Labo);
