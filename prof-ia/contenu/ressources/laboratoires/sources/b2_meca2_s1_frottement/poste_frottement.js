/*
Rôle : paillasse « chute verticale avec frottement » : on choisit une balle (coupelle), on la place dans la fourche d'une colonne
       (toucher la colonne), on règle la cadence de la caméra (10 ou 2 images par seconde), on la lâche (déclencheur) : elle
       tombe en temps réel ; la vidéo va au logiciel de pointage (étalonnage sur la règle, origine, pointage, export).
       Une balle moins dense que le liquide (40 g dans la glycérine) flotte.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_frottement(g) -> { pense_bete } ; faits « montage » = { balle, colonne, cadence }, « chutes_fluide » = [{ id, balle,
          masse, liquide, fps, flotte, vlim, tau, a0 }], « pointage » (voir pointage_video.js).
Utilisé par : simulation.js.
*/
(function (L) {
  const D = L.frottement_dessin, F = L.chute_fluide, CHAMP = { l: 0.42, h: 1.15 };

  function video(id, b, liquide, m, fps) {
    // Vidéo filmée par la caméra, cadrée sur la colonne et la règle ; image k : décor, liquide, règle, balle à sa profondeur.
    const xt = liquide === "eau" ? 0.14 : 0.28, xr = liquide === "eau" ? 0.33 : 0.09, y = (k) => 1.06 - m.profondeur(k / fps);
    return { id, fps, n: Math.max(2, Math.floor(m.duree * fps) + 1), largeur_m: CHAMP.l, hauteur_m: CHAMP.h, etalon: { a: { x: xr, y: 1.08 }, b: { x: xr, y: 0.08 }, longueur_m: 1 }, objet: (k) => ({ x: xt, y: y(k) }),
      dessiner(gv, k, ecran) {
        const r = (a, b2, c, d, fill) => { const p = ecran(a, b2), q = ecran(c, d); L.svg("rect", { x: p.x, y: q.y, width: q.x - p.x, height: p.y - q.y, fill }, gv); };
        r(0, 0, CHAMP.l, CHAMP.h, "#3a3f44"); r(xt - 0.045, 0.05, xt + 0.045, 1.13, "#9fb6be"); r(xt - 0.04, 0.08, xt + 0.04, 1.08, D.COLONNES[liquide].teinte);
        r(xr - 0.035, 0.06, xr + 0.035, 1.10, "#efe3c4");
        for (let cm = 0; cm <= 100; cm += 5) { const p = ecran(xr - 0.035, 1.08 - cm / 100); L.svg("line", { x1: p.x, y1: p.y, x2: p.x + (cm % 10 ? 3 : 6), y2: p.y, stroke: "#222", "stroke-width": 0.6 }, gv); if (cm % 50 === 0) L.texte(gv, p.x + 10, p.y + 2, String(cm), { "font-size": 5, fill: "#222" }); }
        const c = ecran(xt, y(k)); L.svg("circle", { cx: c.x, cy: c.y, r: 3.2, fill: "#f08a24", stroke: "#111", "stroke-width": 0.5 }, gv);
      } };
  }

  function lacher(e, s) {
    // Lâche la balle : chute en temps réel, puis vidéo au logiciel ; une balle qui flotte reste à la surface.
    const m = F.mouvement(e.balle, F.LIQUIDES[e.colonne]), id = `chute${e.chutes.length + 1}`;
    e.chutes.push({ id, balle: e.balle.id, masse: e.balle.masse, liquide: e.colonne, fps: e.fps, flotte: m.flotte, vlim: m.vlim, tau: m.tau, a0: m.a0 });
    L.missions.noter("chutes_fluide", e.chutes.map((c) => ({ ...c })));
    if (m.flotte) { s.message.textContent = `La balle de ${e.balle.nom} flotte : elle est moins dense que la glycérine.`; return; }
    s.message.textContent = ""; s.voyant.setAttribute("fill", "#ff3b30");
    const debut = performance.now(), pas = () => {
      e.z = m.profondeur((performance.now() - debut) / 1000); s.dessiner();
      if ((performance.now() - debut) / 1000 < m.duree) return requestAnimationFrame(pas);
      s.voyant.setAttribute("fill", "#5a1d1d"); s.logiciel.charger(video(id, e.balle, e.colonne, m, e.fps));
    };
    requestAnimationFrame(pas);
  }

  function commandes(g, e, s) {
    // Balles de la coupelle, zones des colonnes, cadence de la caméra, bouton du déclencheur.
    const touche = (el, f) => L.glissable(el, { soulever: false, debut: () => ({ x: 0, y: 0 }), toucher: () => { if (e.tombe) return; f(); s.noter(); s.dessiner(); } });
    F.BALLES.forEach((b, i) => { const el = L.svg("g", { class: `balle-${b.id}`, role: "button", "aria-label": `Balle de ${b.nom}` }, g); D.balle(el, 262 + i * 38, 549, b.nom); touche(el, () => { e.balle = b; e.z = null; }); });
    for (const [cle, c] of Object.entries(D.COLONNES)) touche(L.svg("rect", { class: `colonne-${cle}`, x: c.x - 16, y: 140, width: 32, height: 350, fill: "#000", opacity: 0.001 }, g), () => { e.colonne = cle; e.z = null; });
    const cad = L.svg("g", { class: "camera-cadence", role: "button", "aria-label": "Cadence de la caméra" }, g);
    L.svg("rect", { x: 478, y: 386, width: 30, height: 10, rx: 2, fill: "#111" }, cad);
    const texte = L.texte(cad, 493, 393.5, "10 im/s", { "font-size": 6, "font-weight": 700, fill: "#7dff9a", "font-family": "monospace" });
    touche(cad, () => { e.fps = e.fps === 10 ? 2 : 10; texte.textContent = `${e.fps} im/s`; });
    L.bouton_poussoir(g, 165, 474, { textes: ["Lâcher", "Remonter"], sur_changement: (oui) => { if (oui) { e.tombe = true; lacher(e, s); } else { e.tombe = false; e.z = null; s.dessiner(); } } });
  }

  L.poste_frottement = function (g) {
    // Matériel, caméra, logiciel ; la balle choisie est dessinée dans la fourche ou à sa profondeur dans la colonne.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230), e = { balle: F.BALLES[0], colonne: "eau", fps: 10, z: null, tombe: false, chutes: [] };
    D.fond(g);
    const s = { voyant: D.camera(g), logiciel: L.pointage_video(g, { nom: "pointage", x: 540, y: 180 }), vue: L.svg("g", { "pointer-events": "none" }, g) };
    s.message = L.texte(g, 360, 100, "", { "font-size": 8, "font-weight": 700, fill: "#c62828" });
    s.dessiner = () => {
      // La balle choisie quitte la coupelle et se dessine dans la fourche de sa colonne, ou à sa profondeur pendant la chute.
      s.vue.replaceChildren(); D.balle(s.vue, D.COLONNES[e.colonne].x, D.ecran_y(e.z || 0));
      for (const b of F.BALLES) g.querySelector(`.balle-${b.id}`).setAttribute("opacity", b === e.balle ? 0 : 1);
    };
    s.noter = () => L.missions.noter("montage", { balle: e.balle.id, colonne: e.colonne, cadence: e.fps });
    commandes(g, e, s);
    s.noter(); L.missions.noter("chutes_fluide", []); s.dessiner();
    return { pense_bete };
  };
})(window.Labo);
