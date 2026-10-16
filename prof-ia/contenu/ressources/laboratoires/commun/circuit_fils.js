/*
Rôle : fils de connexion du circuit : l'élève tire un fil depuis une borne et le lâche sur une autre borne ; il tire un fil
       posé pour le débrancher (le bout le plus proche suit le doigt : lâché sur une borne, il s'y rebranche ; ailleurs, le
       fil est rangé). Les fiches banane s'empilent sur une borne ; le câble pend un peu.
Reçoit : le circuit (circuit.js) et ses bornes ; les gestes de l'élève.
Produit : Labo.fils.brancher_borne(circuit, borne), Labo.fils.dessiner(circuit) ; Labo.fils.point(fil, t) (point du câble).
Utilisé par : circuit.js.
*/
(function (L) {
  const FICHE = 15, ETAGE = 11, PRISE_PX = 18, COULEURS = ["#e8b923", "#2f6fd0", "#3c9a4a", "#8e44ad"];
  let temporaire = null;

  function couleur_fil(c, a) {
    // Rouge depuis une borne rouge, noir depuis une borne noire, sinon une couleur à tour de rôle.
    const b = c.bornes[a];
    if (b.couleur === L.ROUGE_BORNE) return "#d32f2f";
    if (b.couleur === L.NOIR_BORNE) return "#25282b";
    return COULEURS[c.fils.length % COULEURS.length];
  }

  function bout(c, cle, fil) {
    // Haut de la fiche d'un fil sur une borne (les fiches déjà branchées sont en dessous ; fil absent : au-dessus de toutes).
    const b = c.bornes[cle], sur = c.fils.filter((f) => f.a === cle || f.b === cle), rang = fil ? sur.indexOf(fil) : sur.length;
    return { x: b.x, y: b.y - FICHE - ETAGE * rang, base: b.y - ETAGE * rang };
  }

  function chemin(P, Q) {
    // Câble souple entre deux points : il retombe sur la paillasse (vers l'avant), plus bas s'il est long.
    const pend = 22 + 0.22 * Math.hypot(Q.x - P.x, Q.y - P.y);
    return { P, C1: { x: P.x, y: P.y + pend }, C2: { x: Q.x, y: Q.y + pend }, Q };
  }

  function point_bezier({ P, C1, C2, Q }, t) {
    // Point du câble au paramètre t (0 : premier bout, 1 : second bout).
    const s = 1 - t, k = [s * s * s, 3 * s * s * t, 3 * s * t * t, t * t * t];
    return { x: k[0] * P.x + k[1] * C1.x + k[2] * C2.x + k[3] * Q.x, y: k[0] * P.y + k[1] * C1.y + k[2] * C2.y + k[3] * Q.y };
  }

  function dessiner_cable(g, ch, couleur) {
    // Câble : ombre portée, gaine colorée, reflet.
    const d = `M${ch.P.x} ${ch.P.y} C${ch.C1.x} ${ch.C1.y} ${ch.C2.x} ${ch.C2.y} ${ch.Q.x} ${ch.Q.y}`;
    L.svg("path", { d, fill: "none", stroke: "#000", "stroke-width": 5, opacity: 0.25, transform: "translate(2 4)" }, g);
    L.svg("path", { d, fill: "none", stroke: couleur, "stroke-width": 4.5, "stroke-linecap": "round" }, g);
    L.svg("path", { d, fill: "none", stroke: "#fff", "stroke-width": 1.2, opacity: 0.3, transform: "translate(-0.8 -0.8)" }, g);
    return L.svg("path", { d, fill: "none", stroke: "#000", "stroke-width": 16, opacity: 0.001, class: "fil" }, g);
  }

  function dessiner_fiche(g, p, couleur) {
    // Fiche banane debout sur la borne : corps isolant coloré, bague claire.
    L.svg("rect", { x: p.x - 4.5, y: p.y, width: 9, height: p.base - p.y, rx: 3, fill: couleur, stroke: "#00000070", "stroke-width": 0.8 }, g);
    L.svg("rect", { x: p.x - 4.5, y: p.y + 3, width: 9, height: 2, fill: "#fff", opacity: 0.35 }, g);
    L.svg("ellipse", { cx: p.x, cy: p.y, rx: 4.5, ry: 2.2, fill: "#151719" }, g);
  }

  function borne_sous(c, p, sauf) {
    // Borne la plus proche du point lâché (à moins de PRISE_PX), autre que « sauf ».
    let meilleure = null, d_min = PRISE_PX;
    for (const b of Object.values(c.bornes)) {
      const d = Math.hypot(b.x - p.x, b.y - p.y);
      if (b.cle !== sauf && d < d_min) [meilleure, d_min] = [b, d];
    }
    return meilleure;
  }

  function rendre_tirable(c, fil, zone) {
    // Tirer un fil posé : le bout le plus proche se débranche et suit le pointeur.
    let bouge = null, fixe = null;
    L.glissable(zone, {
      soulever: false,
      debut: (e) => {
        const p = L.scene.vers_scene(e), A = c.bornes[fil.a], B = c.bornes[fil.b];
        [bouge, fixe] = Math.hypot(p.x - A.x, p.y - A.y) < Math.hypot(p.x - B.x, p.y - B.y) ? ["a", "b"] : ["b", "a"];
        return { x: c.bornes[fil[bouge]].x, y: c.bornes[fil[bouge]].y };
      },
      deplacer: (p) => { const k = c.fils.indexOf(fil); if (k >= 0) c.fils.splice(k, 1); temporaire = { de: fil[fixe], vers: p, couleur: fil.couleur, fil }; L.fils.dessiner(c); },
      lacher: (p) => {
        const b = borne_sous(c, p, fil[fixe]);
        temporaire = null;
        if (b && !c.relies(b.cle, fil[fixe])) c.fils.push({ ...fil, [bouge]: b.cle, [fixe]: fil[fixe] });
        c.calculer();
      },
    });
  }

  L.fils = {
    brancher_borne(c, b) {
      // Zone de la borne : tirer depuis là crée un nouveau fil.
      const zone = L.svg("circle", { cx: b.x, cy: b.y - 6, r: 13, fill: "#000", opacity: 0.001, class: "zone-borne", "aria-label": `Borne ${b.nom}` }, c.calque_bornes);
      L.glissable(zone, {
        soulever: false,
        debut: () => ({ x: b.x, y: b.y }),
        deplacer: (p) => { temporaire = { de: b.cle, vers: p, couleur: couleur_fil(c, b.cle) }; L.fils.dessiner(c); },
        lacher: (p) => {
          const cible = borne_sous(c, p, b.cle);
          temporaire = null;
          if (cible && !c.relies(b.cle, cible.cle)) c.fils.push({ a: b.cle, b: cible.cle, couleur: couleur_fil(c, b.cle), i: 0 });
          c.calculer();
        },
      });
    },
    dessiner(c) {
      // Redessine tous les fils (et le fil en cours de pose) avec leurs fiches.
      const g = c.calque_fils;
      g.replaceChildren();
      for (const fil of c.fils) {
        const P = bout(c, fil.a, fil), Q = bout(c, fil.b, fil);
        fil.chemin = chemin(P, Q);
        dessiner_fiche(g, P, fil.couleur); dessiner_fiche(g, Q, fil.couleur);
        rendre_tirable(c, fil, dessiner_cable(g, fil.chemin, fil.couleur));
      }
      if (!temporaire) return;
      const P = bout(c, temporaire.de, null), Q = { x: temporaire.vers.x, y: temporaire.vers.y - FICHE, base: temporaire.vers.y };
      dessiner_fiche(g, P, temporaire.couleur); dessiner_fiche(g, Q, temporaire.couleur);
      dessiner_cable(g, chemin(P, Q), temporaire.couleur);
    },
    point: (fil, t) => point_bezier(fil.chemin, t),
  };
})(window.Labo);
