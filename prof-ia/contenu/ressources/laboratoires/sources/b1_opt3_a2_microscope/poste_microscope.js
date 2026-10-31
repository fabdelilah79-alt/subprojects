/*
Rôle : paillasse « observer au microscope » : microscope (microscope_dessin.js), boîte de lames (oignon, micromètre objet)
       dont on fait glisser une lame sur la platine, vis macrométrique (grosse molette) et micrométrique (petite molette,
       au centre) que l'on tourne en glissant vers le haut ou le bas, revolver que l'on touche pour changer d'objectif,
       touches Lampe et Oculaire (×10 / ×20) ; noms des pièces ; vue « dans l'oculaire » ; documents au mur.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_microscope(g) -> { pense_bete } ; fait « microscope » = { lampe, lame, nets: ["lame:objectif:oculaire"], contact }.
Utilisé par : simulation.js.
*/
(function (L) {
  const M = () => L.MICRO, MOL = { x: 248, y: 478 }, BOITE = { oignon: { x: 130, y: 463 }, micrometre: { x: 130, y: 479 } };
  const NOMS = [["oculaire", 340, 244, 440, 232], ["tube", 341, 300, 440, 290], ["revolver", 358, 372, 440, 352], ["objectif", 336, 410, 440, 396], ["platine", 420, 424, 440, 432], ["lampe", 343, 543, 440, 530], ["vis macro / micrométrique", 262, 478, 440, 476]];

  function molette(g, r, crans) {
    // Molette moletée (ombre, disque d'acier, crans).
    L.svg("circle", { cx: MOL.x + 1, cy: MOL.y + 2, r, fill: "#000", opacity: 0.3 }, g);
    L.svg("circle", { cx: MOL.x, cy: MOL.y, r, fill: "url(#acier)", stroke: "#111" }, g);
    for (let k = 0; k < crans; k++) { const a = (k * 2 * Math.PI) / crans; L.svg("line", { x1: MOL.x + (r - 3) * Math.cos(a), y1: MOL.y + (r - 3) * Math.sin(a), x2: MOL.x + r * Math.cos(a), y2: MOL.y + r * Math.sin(a), stroke: "#222" }, g); }
  }

  function noms(g) {
    // Étiquettes des pièces, reliées par un trait fin.
    for (const [t, x1, y1, x2, y2] of NOMS) { L.svg("line", { x1, y1, x2: x2 - 4, y2: y2 - 3, stroke: "#c9c2b0", "stroke-width": 0.6 }, g); L.texte(g, x2, y2, t, { "text-anchor": "start", "font-size": 7.5, "font-weight": 700, fill: "#e8e2d4" }); }
  }

  function flou(e) {
    // Flou de mise au point (px) : écart à la position nette divisé par la profondeur de champ de l'objectif.
    return e.lame ? Math.min(12, Math.abs(e.z - M().net[e.obj]) / M().OBJ[e.obj].dof) : 0;
  }

  function noter(e) {
    // Image nette d'une préparation éclairée : notée (lame, objectif, oculaire).
    const cle = `${e.lame}:${M().OBJ[e.obj].g}:${e.oculaire}`;
    if (e.lame && e.lampe && flou(e) < 1 && !e.nets.includes(cle)) e.nets.push(cle);
  }

  L.poste_microscope = function (g) {
    // Matériel, gestes (lames, molettes, revolver), touches, vue ; faits.
    const { pense_bete } = L.decor_circuit(g, 0), e = { z: 3, obj: 0, oculaire: 10, lampe: false, lame: null, nets: [], contact: false, avertir: false };
    L.boite_lames(g); noms(g);
    const gm = L.svg("g", {}, g), gr = L.svg("g", { class: "revolver", role: "button", "aria-label": "Revolver" }, g), gM = L.svg("g", { class: "molette", role: "slider", "aria-label": "Vis macrométrique" }, g), gu = L.svg("g", { class: "molette", role: "slider", "aria-label": "Vis micrométrique" }, g);
    const gv = L.svg("g", { "pointer-events": "none" }, g), ga = L.svg("g", { "pointer-events": "none" }, g), lames = {};
    L.svg("ellipse", { cx: M().X, cy: M().REV - 2, rx: 32, ry: 13, fill: "#fff", opacity: 0.01 }, gr); molette(gM, 15, 18); molette(gu, 7, 10);
    const dessiner = () => {
      // Microscope, lames dans la boîte, vue, avertissement.
      L.microscope(gm, e);
      for (const n in lames) { lames[n].g.replaceChildren(); if (e.lame !== n) L.lame_dessin(lames[n].g, lames[n].p.x, lames[n].p.y, n); }
      L.vue_microscope(gv, { ...e, flou: flou(e) });
      ga.replaceChildren(); if (e.avertir) L.texte(ga, 330, 214, "Attention : l'objectif touche la lame ! Redescendez la platine.", { "font-size": 9, "font-weight": 700, fill: "#ff8a80" });
    };
    const hauteur = (z) => { const c = M().contact(e.obj); e.avertir = z > c; e.contact = e.contact || e.avertir; e.z = Math.max(0, Math.min(c, z)); dessiner(); };
    L.glissable(gM, { soulever: false, debut: () => ({ x: 0, y: -e.z / 0.05 }), deplacer: (p) => hauteur(-p.y * 0.05), lacher: () => noter(e) });
    L.glissable(gu, { soulever: false, debut: () => ({ x: 0, y: -e.z / 0.0005 }), deplacer: (p) => hauteur(-p.y * 0.0005), lacher: () => noter(e) });
    const tourner = () => { e.obj = (e.obj + 1) % 3; hauteur(e.z); noter(e); };
    L.glissable(gr, { soulever: false, debut: () => ({ x: 0, y: 0 }), toucher: tourner });
    for (const n in BOITE) {
      lames[n] = { p: { ...BOITE[n] }, g: L.svg("g", { class: "lame", role: "button", "aria-label": `Lame : ${L.LAMES[n]}` }, g) };
      L.glissable(lames[n].g, { soulever: false, debut: () => ({ ...lames[n].p }), deplacer: (p) => { lames[n].p = p; dessiner(); },
        lacher: () => { const p = lames[n].p; if (p.x > 240 && p.x < 430 && p.y > 360 && p.y < 470) e.lame = n; lames[n].p = { ...BOITE[n] }; dessiner(); noter(e); } });
    }
    [["Lampe", () => { e.lampe = !e.lampe; }], ["Oculaire", () => { e.oculaire = e.oculaire === 10 ? 20 : 10; }], ["Revolver", () => { e.obj = (e.obj + 1) % 3; e.z = Math.min(e.z, M().contact(e.obj)); }]]
      .forEach(([t, f], k) => L.bouton_texte(g, 630 + k * 82, 540, t, () => { f(); dessiner(); noter(e); }));
    dessiner(); L.documents_microscope(g);
    setInterval(() => L.missions.noter("microscope", JSON.parse(JSON.stringify({ lampe: e.lampe, lame: e.lame, nets: e.nets, contact: e.contact }))), 250);
    return { pense_bete };
  };
})(window.Labo);
