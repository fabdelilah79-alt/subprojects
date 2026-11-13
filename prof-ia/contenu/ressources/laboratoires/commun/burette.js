/*
Rôle : burette graduée de 25 mL aux vraies dimensions (tube de 10,9 mm de diamètre intérieur : 25 mL sur 270 mm, graduée
       tous les 0,1 mL), tenue par une pince sur la tige d'un pied ; robinet à trois positions : un toucher sur la clé
       ouvre au goutte à goutte (une goutte de 0,05 mL toutes les 0,45 s) ou ferme ; on fait tourner la clé en la glissant
       vers le haut pour un filet (environ 0,5 mL/s), vers le bas pour fermer ; le liquide tombe vraiment (ecoulement.js) ; loupe qui grossit cinq fois le tube autour du
       ménisque (on lit le bas du ménisque, à 0,05 mL près). La burette est remplie et ajustée au zéro par remplir().
Reçoit : le contexte de la paillasse (avec ctx.ecoulement) et { x (axe), bas (y de la pointe), e (px/mm), titrant (nom
         d'un liquide), texte (étiquette), tige (x de la tige du pied), sol }.
Produit : Labo.burette(ctx, reglage) -> { etat() -> { verse (mL, valeur vraie), robinet ("ferme" | "goutte" | "filet") },
          remplir(), pointe { x, y } }.
Utilisé par : les postes de titrage.
*/
(function (L) {
  const ZERO = 350, VINGT_CINQ = 80, ROBINET = 50, POINTE = 0, HAUT = 380, R_INT = 5.45, MORT = 1.8, GROSSI = 5;
  const MM_ML = (ZERO - VINGT_CINQ) / 25;
  // Un liquide incolore reste visible dans le tube étroit (reflets bleutés du verre et du liquide).
  const teinte = (rgb) => L.rgb(rgb.map((v, i) => v * 0.75 + [150, 190, 215][i] * 0.25));

  function tube(g, e, verse, rgb) {
    // Tube de verre, liquide jusqu'au ménisque, graduations (repère : pointe en 0, y vers le haut négatif, mm × e).
    g.replaceChildren();
    const y = (h) => -h * e, men = ZERO - Math.min(verse, 25 + MORT * 0.99) * MM_ML, c = teinte(rgb);
    L.svg("rect", { x: -R_INT * e, y: y(men), width: 2 * R_INT * e, height: (men - ROBINET - 8) * e, fill: c, opacity: 0.6 }, g);
    L.svg("path", { d: `M${-R_INT * e} ${y(men)} Q0 ${y(men) + 2 * e} ${R_INT * e} ${y(men)}`, fill: "none", stroke: "#24435e", "stroke-width": 0.7 }, g);
    L.svg("rect", { x: -6.5 * e, y: y(HAUT), width: 13 * e, height: (HAUT - ROBINET - 8) * e, rx: 2, fill: "rgba(214,233,240,0.18)", stroke: "rgba(120,150,160,0.85)", "stroke-width": 0.8 }, g);
    L.svg("rect", { x: -5 * e, y: y(HAUT - 4), width: 1.4 * e, height: (HAUT - ROBINET - 20) * e, fill: "#fff", opacity: 0.3 }, g);
    for (let k = 0; k <= 250; k++) {
      const h = ZERO - (k / 10) * MM_ML, l = k % 10 === 0 ? 6 : k % 5 === 0 ? 4.5 : 3;
      L.svg("line", { x1: -6.5 * e, y1: y(h), x2: (-6.5 + l) * e, y2: y(h), stroke: "#1d2730", "stroke-width": k % 10 ? 0.25 : 0.45 }, g);
      if (k % 10 === 0) L.texte(g, 9 * e, y(h) + 1.8, `${k / 10}`, { "font-size": 4.6, fill: "#1d2730", "text-anchor": "start" });
    }
  }

  function bas_de_burette(g, e, robinet, rgb) {
    // Pointe effilée, corps du robinet, clé en PTFE : horizontale fermée, inclinée en goutte à goutte, verticale en filet.
    g.replaceChildren();
    const angle = { ferme: 90, goutte: 55, filet: 0 }[robinet];
    L.svg("path", { d: `M${-2 * e} ${-ROBINET * e} L${-1 * e} ${-POINTE * e} H${1 * e} L${2 * e} ${-ROBINET * e} Z`, fill: "rgba(214,233,240,0.35)", stroke: "rgba(120,150,160,0.85)", "stroke-width": 0.6 }, g);
    L.svg("rect", { x: -0.8 * e, y: -(ROBINET - 4) * e, width: 1.6 * e, height: (ROBINET - 6) * e, fill: L.rgb(rgb), opacity: 0.7 }, g);
    L.svg("rect", { x: -4 * e, y: -(ROBINET + 10) * e, width: 8 * e, height: 12 * e, rx: 2, fill: "rgba(214,233,240,0.4)", stroke: "rgba(120,150,160,0.9)" }, g);
    L.svg("rect", { x: -16 * e, y: -(ROBINET + 6) * e, width: 32 * e, height: 4 * e, rx: 2, fill: "#eef0ec", stroke: "#8b8f88", transform: `rotate(${90 - angle} 0 ${-(ROBINET + 4) * e})` }, g);
    L.svg("circle", { cx: 0, cy: -(ROBINET + 4) * e, r: 3 * e, fill: "#d7dad4", stroke: "#8b8f88" }, g);
  }

  function loupe(g, e, verse, rgb, id) {
    // Le tube grossi cinq fois autour du ménisque : graduations tous les 0,1 mL, nombres, bas du ménisque.
    g.replaceChildren();
    const k = GROSSI * MM_ML * e, R = 46, lu = Math.min(verse, 25), y = (v) => (v - lu) * k;
    L.svg("circle", { cx: 0, cy: 0, r: R + 4, fill: "#2b2f33" }, g);
    const vue = L.svg("g", { "clip-path": `url(#loupe-${id})` }, g);
    L.svg("clipPath", { id: `loupe-${id}` }, g).append(L.svg("circle", { cx: 0, cy: 0, r: R }));
    L.svg("rect", { x: -R, y: -R, width: 2 * R, height: 2 * R, fill: "#eef4f6" }, vue);
    L.svg("rect", { x: -R, y: 0, width: 2 * R, height: R, fill: teinte(rgb), opacity: 0.5 }, vue);
    L.svg("path", { d: `M${-R} -4 Q0 6 ${R} -4 V-6 Q0 4 ${-R} -6 Z`, fill: "#24435e", opacity: 0.8 }, vue);
    for (let t = Math.ceil((lu - 1) * 10); t <= (lu + 1) * 10; t++) {
      if (t < 0 || t > 250) continue;
      const long = t % 10 === 0 ? 34 : t % 5 === 0 ? 24 : 16;
      L.svg("line", { x1: -R, y1: y(t / 10), x2: -R + long, y2: y(t / 10), stroke: "#1d2730", "stroke-width": t % 10 ? 1 : 1.6 }, vue);
      if (t % 10 === 0) L.texte(vue, -R + 46, y(t / 10) + 4, `${t / 10}`, { "font-size": 12, "font-weight": 700, fill: "#1d2730" });
    }
    L.svg("circle", { cx: 0, cy: 0, r: R, fill: "none", stroke: "#cfd3cf", "stroke-width": 3 }, g);
  }

  L.burette = function (ctx, { x, bas, e = 1, titrant, texte, tige, sol }) {
    // Pied, pince, burette, loupe ; robinet touchable ; écoulement de gouttes ou d'un filet.
    const b = { verse: 0, robinet: "ferme", c: L.contenu({}) }, source = { c: b.c, interieur_monde: () => [] }, rgb = () => L.LIQUIDES[titrant].rgb.map((v) => v * 0.97);
    L.pied_support(ctx.fond, tige, sol, bas - HAUT * e - 10);
    const g = L.svg("g", { class: "burette", transform: `translate(${x} ${bas})` }, ctx.fond), gt = L.svg("g", {}, g), gb = L.svg("g", { class: "robinet", role: "button", "aria-label": "Robinet de la burette" }, g);
    L.svg("rect", { x: tige - x, y: -(ZERO - 70) * e - 3, width: x - tige - 6 * e, height: 6, fill: "url(#metal)" }, g); L.noix(g, tige - x, -(ZERO - 70) * e);
    L.svg("rect", { x: -9 * e, y: -(ZERO - 70) * e - 5, width: 18 * e, height: 10, rx: 3, fill: "#c8302c" }, g);
    L.svg("rect", { x: -16 * e, y: -(HAUT + 26) * e, width: 32 * e, height: 18, rx: 2, fill: "#fdfdf8", stroke: "#c9c4b0" }, g);
    L.texte(g, 0, -(HAUT + 17) * e, texte, { "font-size": 6.4, "font-weight": 700, fill: "#222" });
    const gl = L.svg("g", { "pointer-events": "none" }, ctx.haut);
    const dessiner = () => { tube(gt, e, b.verse, rgb()); bas_de_burette(gb, e, b.robinet, rgb()); loupe(gl, e, b.verse, rgb(), `burette-${titrant}`); gl.setAttribute("transform", `translate(${x + 70} ${bas - (ZERO - Math.min(b.verse, 25) * MM_ML) * e})`); };
    const cle = { x, y: bas - (ROBINET + 4) * e };
    L.glissable(gb, {
      soulever: false, debut: () => ({ ...cle }),
      deplacer: (p) => { const r = p.y < cle.y - 8 ? "filet" : p.y > cle.y + 8 ? "ferme" : b.robinet; if (r !== b.robinet) { b.robinet = r; dessiner(); } },
      toucher: () => { b.robinet = b.robinet === "ferme" ? "goutte" : "ferme"; dessiner(); },
    });
    const pointe = { x, y: bas + 1 }, couler = (v) => { v = Math.min(v, b.c.volume() - 0.02); if (v <= 0) { b.robinet = "ferme"; return dessiner(); } b.verse += v; ctx.ecoulement.emettre(source, pointe, { x: 0, y: 20 }, b.c.retirer(v), v); dessiner(); };
    let t_goutte = 0;
    setInterval(() => { if (b.robinet === "filet") couler(0.04); else if (b.robinet === "goutte" && (t_goutte += 0.08) >= 0.45) { t_goutte = 0; couler(0.05); } }, 80);
    b.remplir = () => { b.c.phases.length = 0; b.c.ajouter(titrant, 25 + MORT); b.verse = 0; b.robinet = "ferme"; dessiner(); };
    b.remplir();
    return { etat: () => ({ verse: Math.round(b.verse * 1000) / 1000, robinet: b.robinet }), remplir: b.remplir, pointe };
  };
})(window.Labo);
