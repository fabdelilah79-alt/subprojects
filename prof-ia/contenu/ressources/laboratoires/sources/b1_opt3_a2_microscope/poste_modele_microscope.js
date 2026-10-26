/*
Rôle : paillasse « modèle du microscope » au banc d'optique : lanterne avec un petit objet « F » (AB = 5 mm) à 10 cm,
       objectif L1 fixe (f'1 = 5 cm, à 17 cm), écran mobile pour recueillir l'image intermédiaire A1B1, oculaire L2
       (f'2 = 10 cm) à poser et faire glisser, élève qui regarde ; vues « à l'œil nu (à 25 cm) » et « dans le modèle »
       (ou vue rapprochée de l'écran) ; touche Faisceau (rayons issus de B à travers les deux lentilles).
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_modele_microscope(g) -> { pense_bete } ; fait « modele » = { images: [{ xS, OA, OAp }], nets: [{ xoc, G }], faisceau }.
Utilisé par : simulation.js.
*/
(function (L) {
  const XO = 10, X1 = 17, F1 = 5, F2 = 10, H = 0.5, borne = (v, a, b) => Math.max(a, Math.min(b, v));
  const lettre = (s) => L.svg("path", { d: "M-2 3 V-3 H1.6 M-2 0.3 H0.4", fill: "none", stroke: "#fff3b0", "stroke-width": 0.9, "stroke-linecap": "square" }, s);

  function face(g) {
    // Écran vu de face (2 px par mm, carreaux de 1 cm) dans la vue rapprochée ; transformation mm -> écran.
    const T = (u, v) => ({ x: 660 + 2 * u, y: 76 + 2 * v });
    L.vue_instrument(g, { x: 660, y: 76, r: 66, titre: "vue rapprochée de l'écran", fond: "#f4f2ea", G: 1, flou: 0, sujet: (s) => {
      for (let c = -30; c <= 30; c += 10) { L.svg("line", { x1: 2 * c, y1: -70, x2: 2 * c, y2: 70, stroke: "#d6d1c2", "stroke-width": 0.8 }, s); L.svg("line", { x1: -70, y1: 2 * c, x2: 70, y2: 2 * c, stroke: "#d6d1c2", "stroke-width": 0.8 }, s); }
    } });
    return T;
  }

  function noter(e, ins) {
    // Au lâcher : image intermédiaire nette sur l'écran ; image nette dans le modèle (écran retiré, oculaire posé).
    const c = L.conjuguer({ xO: XO, xL: X1, f: F1 });
    if (e.ecran && Math.abs(e.xS - X1 - c.OAp) < 0.6) e.images.push({ xS: e.xS, OA: XO - X1, OAp: Math.round((e.xS - X1) * 10) / 10 });
    if (!e.ecran && e.oculaire && ins.flou < 0.8) e.nets.push({ xoc: e.xoc, G: Math.round(ins.G * 10) / 10 });
  }

  L.poste_modele_microscope = function (g) {
    // Banc, objets saisissables, images, vues, faisceau ; touches ; faits.
    const { pense_bete } = L.decor_circuit(g, 1), e = { ecran: true, xS: 28, oculaire: false, xoc: 50, xe: 80, faisceau: false, images: [], nets: [], faisceau_vu: false };
    const go = L.svg("g", { class: "eleve", role: "slider", "aria-label": "Élève qui regarde" }, g), fond = L.svg("g", {}, g), b = L.banc_optique(fond, {});
    L.lanterne_banc(fond, b, { x: XO, taille: H }); L.lentille_banc(fond, b, { x: X1, nom: "L1 : f'1 = 5 cm", ry: 20 });
    const gb = L.svg("g", { "pointer-events": "none" }, g), gc = L.svg("g", { class: "oculaire", role: "slider", "aria-label": "Oculaire" }, g), gs = L.svg("g", { class: "ecran", role: "slider", "aria-label": "Écran" }, g);
    const gi = L.svg("g", { "pointer-events": "none" }, g), gf = L.svg("g", { "pointer-events": "none" }, g), v1 = L.svg("g", { "pointer-events": "none" }, g), v2 = L.svg("g", { "pointer-events": "none" }, g);
    let ins = {};
    const dessiner = () => {
      // Élève, oculaire, écran et image A1B1, faisceau, vues.
      const lentilles = [{ x: X1, f: F1, r: 1.6 }, ...(e.oculaire ? [{ x: e.xoc, f: F2, r: 1.6 }] : [])], reglage = { xE: e.xS, xL: X1, f: F1, xO: XO, D: 40, AB: 10 * H };
      ins = L.instrument({ xO: XO, h: H, lentilles, oeil: e.xe });
      go.replaceChildren(); L.svg("rect", { x: b.px(e.xe) - 30, y: b.axe - 70, width: 110, height: 170, fill: "#fff", opacity: 0.01 }, go); L.observateur(go, { x: b.px(e.xe), y: b.axe });
      gc.replaceChildren(); if (e.oculaire) L.oculaire_banc(gc, b, { x: e.xoc, nom: "L2 : f'2 = 10 cm" });
      gs.replaceChildren(); gi.replaceChildren(); gb.replaceChildren();
      if (e.ecran) { L.faisceau_banc(gb, b, { ...reglage, diaphragme: true }); L.image_banc(gi, L.ecran_banc(gs, b, { x: e.xS }), reglage); const T2 = face(v2); L.image_banc(L.svg("g", {}, v2), T2, reglage); }
      else L.vue_instrument(v2, { x: 660, y: 76, r: 66, titre: "dans le modèle", fond: "#16191c", sujet: lettre, G: ins.G, flou: ins.flou });
      if (e.faisceau) { faisceau(gf, b, lentilles, e); e.faisceau_vu = e.faisceau_vu || (e.oculaire && !e.ecran); } else gf.replaceChildren();
      L.vue_instrument(v1, { x: 470, y: 76, r: 40, titre: "à l'œil nu (à 25 cm)", fond: "#16191c", sujet: lettre, G: 1, flou: 0 });
    };
    const glisser = (gr, k, min, max) => L.glissable(gr, { soulever: false, debut: () => ({ x: b.px(e[k]), y: b.axe }), deplacer: (p) => { e[k] = Math.round(borne(b.cm(p.x), min(), max()) * 10) / 10; dessiner(); }, lacher: () => noter(e, ins) });
    glisser(gs, "xS", () => X1 + 4, () => (e.oculaire ? e.xoc - 3 : 96)); glisser(gc, "xoc", () => X1 + 18, () => Math.min(e.xe - 1, 92)); glisser(go, "xe", () => (e.oculaire ? e.xoc + 1 : X1 + 30), () => 99);
    [["Écran", () => { e.ecran = !e.ecran; if (e.oculaire) e.xS = Math.min(e.xS, e.xoc - 3); }], ["Oculaire", () => { e.oculaire = !e.oculaire; e.xe = Math.max(e.xe, e.xoc + 1); e.xS = Math.min(e.xS, e.xoc - 3); }], ["Faisceau", () => { e.faisceau = !e.faisceau; }]]
      .forEach(([t, f], k) => L.bouton_texte(g, 400 + k * 92, 560, t, () => { f(); dessiner(); noter(e, ins); }));
    dessiner();
    setInterval(() => L.missions.noter("modele", JSON.parse(JSON.stringify({ images: e.images, nets: e.nets, faisceau: e.faisceau_vu }))), 250);
    return { pense_bete };
  };

  function faisceau(g, b, lentilles, e) {
    // Trois rayons issus de B (sommet du « F ») jusqu'à l'écran ou jusqu'à l'œil ; foyers des deux lentilles.
    g.replaceChildren();
    const E = (q) => ({ x: b.px(q.x), y: b.axe - q.y * b.k }), xfin = e.ecran ? e.xS : e.xe - 1;
    for (const r of L.marche_rayons({ depart: { x: XO, y: H }, hauteurs: [-1.2, 0, 1.2], lentilles, xfin })) L.rayon_lumineux(g, r.map(E), { couleur: "#ffb74d", largeur: 1.1, halo: false });
    for (const [x, n, d] of [[X1 - F1, "F1", 18], [X1 + F1, "F'1", 18], ...(e.oculaire ? [[e.xoc - F2, "F2", -10]] : [])]) { const p = E({ x, y: 0 }); L.svg("line", { x1: p.x, y1: p.y - 5, x2: p.x, y2: p.y + 5, stroke: "#ffd54f", "stroke-width": 1.3 }, g); L.texte(g, p.x, p.y + d, n, { "font-size": 8, "font-weight": 700, fill: "#ffd54f" }); }
  }
})(window.Labo);
