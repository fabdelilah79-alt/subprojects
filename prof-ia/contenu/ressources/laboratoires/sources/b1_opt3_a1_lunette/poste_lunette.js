/*
Rôle : paillasse « maquette de lunette astronomique » : banc d'optique tourné vers la Lune (fenêtre), objectif L1 fixe
       (f'1 = 40 cm, 6 cm de diamètre), oculaire L2 (f'2 = 5 cm) que l'on pose et fait glisser, écran blanc mobile (image
       intermédiaire, puis cercle oculaire), élève qui regarde (on le fait glisser le long du banc) ; vues « à l'œil nu »
       et « dans la lunette » (ou vue rapprochée de l'écran quand il est en place) ; touche Faisceau (marche d'un faisceau parallèle incliné).
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_lunette(g) -> { pense_bete } ; fait « lunette » = { images: [xS], nets: [{ xoc, G }], cercle, oeil_cercle, faisceau }.
Utilisé par : simulation.js.
*/
(function (L) {
  const X1 = 25, F1 = 40, F2 = 5, ALPHA = 0.0093, DOBJ = 60, borne = (v, a, b) => Math.max(a, Math.min(b, v));

  function etat_optique(e) {
    // Lentilles en place, cercle oculaire, ce que reçoivent l'écran et l'œil.
    const lentilles = [{ x: X1, f: F1, r: 3 }, ...(e.oculaire ? [{ x: e.xoc, f: F2, r: 1.5 }] : [])];
    const xc = e.oculaire ? e.xoc + 1 / (1 / F2 + 1 / (X1 - e.xoc)) : null, bloque = e.ecran && e.xS < e.xe;
    const ins = L.instrument({ infini: true, alpha: ALPHA, lentilles, oeil: e.xe });
    const avant = !e.oculaire || e.xS < e.xoc, image = avant ? { diametre: F1 * ALPHA * 10, flou: (DOBJ * Math.abs(e.xS - X1 - F1)) / F1 } : null;
    const tache = avant ? null : (DOBJ * F2) / F1 + 4 * Math.abs(e.xS - xc);
    return { lentilles, xc, bloque, ins, image, tache, champ: e.oculaire ? borne(1 - 0.12 * Math.abs(e.xe - xc), 0.2, 1) : 0.12 };
  }

  function noter(e) {
    // Au lâcher : image nette sur l'écran, vision nette dans la lunette, cercle oculaire trouvé, œil au cercle oculaire.
    const o = etat_optique(e), net = !o.bloque && e.oculaire && o.ins.flou < 0.8;
    if (e.ecran && o.image && o.image.flou < 1.5) e.images.push(e.xS);
    if (net) e.nets.push({ xoc: e.xoc, G: Math.round(o.ins.G * 10) / 10 });
    if (e.ecran && o.tache !== null && Math.abs(e.xS - o.xc) < 0.5) e.cercle = true;
    if (net && Math.abs(e.xe - o.xc) < 0.8) e.oeil_cercle = true;
  }

  L.poste_lunette = function (g) {
    // Décor, banc, élève, objectif, oculaire et écran saisissables, vues, faisceau ; touches.
    const { pense_bete } = L.decor_circuit(g, 1), e = { ecran: true, xS: 50, oculaire: false, xoc: 75, xe: 96, faisceau: false, images: [], nets: [], cercle: false, oeil_cercle: false, faisceau_vu: false };
    L.fenetre_lune(g);
    const go = L.svg("g", { class: "eleve", role: "slider", "aria-label": "Élève qui regarde" }, g), fond = L.svg("g", {}, g), b = L.banc_optique(fond, {});
    L.lentille_banc(fond, b, { x: X1, nom: "L1 : f'1 = 40 cm", ry: 36 });
    const gc = L.svg("g", { class: "oculaire", role: "slider", "aria-label": "Oculaire" }, g), gs = L.svg("g", { class: "ecran", role: "slider", "aria-label": "Écran" }, g);
    const gi = L.svg("g", { "pointer-events": "none" }, g), gf = L.svg("g", { "pointer-events": "none" }, g), v1 = L.svg("g", { "pointer-events": "none" }, g), v2 = L.svg("g", { "pointer-events": "none" }, g);
    const dessiner = () => {
      // Élève, oculaire, écran et ce qu'il reçoit, faisceau, vues.
      const o = etat_optique(e);
      go.replaceChildren(); L.svg("rect", { x: b.px(e.xe) - 30, y: b.axe - 70, width: 110, height: 170, fill: "#fff", opacity: 0.01 }, go); L.observateur(go, { x: b.px(e.xe), y: b.axe });
      gc.replaceChildren(); if (e.oculaire) L.oculaire_banc(gc, b, { x: e.xoc, nom: "L2 : f'2 = 5 cm" });
      gs.replaceChildren(); gi.replaceChildren(); if (e.ecran) L.ecran_lunette(gi, L.ecran_banc(gs, b, { x: e.xS }), o);
      if (e.faisceau) { L.faisceau_lunette(gf, b, { lentilles: o.lentilles, xfin: e.ecran ? e.xS : e.xe - 1, foyers: [[X1 + F1, "F'1"], ...(e.oculaire ? [[e.xoc - F2, "F2"]] : [])] }); e.faisceau_vu = e.faisceau_vu || e.oculaire; } else gf.replaceChildren();
      L.vue_instrument(v1, { x: 470, y: 76, r: 40, titre: "à l'œil nu", sujet: L.lune, G: 1, flou: 0 });
      if (e.ecran) L.vue_ecran_lunette(v2, o); else L.vue_instrument(v2, { x: 660, y: 76, r: 66, titre: "dans la lunette", sujet: L.lune, G: o.ins.G, flou: o.ins.flou, champ: o.champ, noir: o.bloque });
    };
    const glisser = (gr, k, min, max) => L.glissable(gr, { soulever: false, debut: () => ({ x: b.px(e[k]), y: b.axe }), deplacer: (p) => { e[k] = Math.round(borne(b.cm(p.x), min(), max()) * 10) / 10; dessiner(); }, lacher: () => noter(e) });
    glisser(gc, "xoc", () => X1 + 10, () => Math.min(e.xe - 1, 95)); glisser(gs, "xS", () => X1 + 4, () => 99); glisser(go, "xe", () => (e.oculaire ? e.xoc + 1 : X1 + 10), () => 99);
    [["Écran", () => { e.ecran = !e.ecran; }], ["Oculaire", () => { e.oculaire = !e.oculaire; e.xe = Math.max(e.xe, e.xoc + 1); }], ["Faisceau", () => { e.faisceau = !e.faisceau; }]]
      .forEach(([t, f], k) => L.bouton_texte(g, 400 + k * 92, 560, t, () => { f(); dessiner(); noter(e); }));
    dessiner();
    setInterval(() => L.missions.noter("lunette", JSON.parse(JSON.stringify({ images: e.images, nets: e.nets, cercle: e.cercle, oeil_cercle: e.oeil_cercle, faisceau: e.faisceau_vu }))), 250);
    return { pense_bete };
  };
})(window.Labo);
