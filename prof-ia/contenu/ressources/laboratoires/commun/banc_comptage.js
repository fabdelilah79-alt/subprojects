/*
Rôle : banc de comptage de la radioactivité : compteur (compteur_geiger.js), tube de Geiger-Müller tenu par une potence
       au-dessus d'un petit plateau où l'on pose l'échantillon, fente où l'on glisse un écran (papier, aluminium de 5 mm,
       plomb de 5 mm) ; coffret de sources scellées (américium 241 : α et un peu de γ ; strontium 90 : β− ; césium 137 :
       β− et γ) et coupelles d'échantillons naturels (granite, engrais au chlorure de potassium, sel de table). Le taux
       d'impulsions = bruit de fond (0,4 par seconde) + rayonnement de l'échantillon qui traverse l'écran : le papier
       arrête α ; l'aluminium arrête aussi β ; le plomb atténue γ.
Reçoit : le groupe SVG et { fait (nom du fait du compteur), sources (identifiants à mettre dans le coffret) }.
Produit : Labo.banc_comptage(g, reglage) -> { s { source, ecran }, compteur, ajouter(id, definition, place) } ;
          fait « banc » = { source, ecran } ; Labo.SOURCES_RADIO.
Utilisé par : les simulations de radioactivité.
*/
(function (L) {
  const S = L.SOURCES_RADIO = {
    am241: { nom: "Am 241", taux: { a: 35, b: 0, g: 1.5 }, scellee: true }, sr90: { nom: "Sr 90", taux: { a: 0, b: 70, g: 0 }, scellee: true },
    cs137: { nom: "Cs 137", taux: { a: 0, b: 45, g: 8 }, scellee: true }, granite: { nom: "granite", taux: { a: 0, b: 0.6, g: 0.35 }, couleur: "#b9a9a0" },
    kcl: { nom: "KCl (engrais)", taux: { a: 0, b: 1.6, g: 0.05 }, couleur: "#f1e9e4" }, nacl: { nom: "NaCl (sel)", taux: { a: 0, b: 0, g: 0 }, couleur: "#fbfbfb" },
  };
  const ECRANS = { papier: { nom: "papier", f: { a: 0, b: 0.92, g: 1 }, c: "#f4f1e6" }, aluminium: { nom: "aluminium", f: { a: 0, b: 0.01, g: 0.96 }, c: "#c9ced2" }, plomb: { nom: "plomb", f: { a: 0, b: 0, g: 0.55 }, c: "#5d646b" } };
  const BRUIT = 0.4, SUPPORT = { x: 660, y: 470 }, FENTE = { x: 660, y: 452 }, pres = (p) => Math.abs(p.x - 660) < 70 && p.y > 410 && p.y < 505;

  function potence(g) {
    // Socle, tige, bras, tube de Geiger-Müller (fenêtre vers le bas), plateau de l'échantillon, câble vers le compteur.
    L.ombre_sol(g, 640, 548, 80, 7, 0.45);
    L.svg("rect", { x: 580, y: 534, width: 130, height: 14, rx: 2, fill: "#3b4248", stroke: "#111" }, g);
    L.tige(g, "M600 534 V330", 5); L.tige(g, "M600 342 H668", 4);
    L.svg("rect", { x: 648, y: 336, width: 24, height: 96, rx: 4, fill: "url(#metal-h)", stroke: "#222" }, g);
    L.svg("rect", { x: 650, y: 428, width: 20, height: 5, fill: "#6e5a2c" }, g);
    L.texte(g, 680, 380, "tube de Geiger-Müller", { "font-size": 7.5, "font-weight": 700, fill: "#23315a", "text-anchor": "start" });
    L.tige(g, "M600 478 H628", 3); L.svg("path", { d: "M622 474 H700 L704 480 H618 Z", fill: "#6c747a", stroke: "#222" }, g);
  }

  function cable(g) {
    // Câble du tube : il part du haut du tube et se branche (fiche métallique) sur la prise « entrée tube » du compteur.
    L.svg("path", { d: "M660 336 C660 312 640 306 622 314 C590 328 574 420 560 480 C552 512 540 524 522 524", fill: "none", stroke: "#1b1b1b", "stroke-width": 3, "stroke-linecap": "round" }, g);
    L.svg("rect", { x: 516, y: 519, width: 12, height: 10, rx: 2, fill: "url(#metal)", stroke: "#111" }, g);
  }

  function objet(g, def, p, ecran) {
    // Pastille scellée sur son porte-source, coupelle d'échantillon, ou plaque d'écran.
    if (ecran) return void (L.svg("rect", { x: p.x - 26, y: p.y - 3, width: 52, height: 6, fill: ecran.c, stroke: "#333", "stroke-width": 0.6 }, g), L.texte(g, p === FENTE ? p.x - 32 : p.x, p === FENTE ? p.y + 3 : p.y + 14, ecran.nom, { "font-size": 6.5, "font-weight": 700, fill: "#f4f1e6", "text-anchor": p === FENTE ? "end" : "middle" }));
    if (def.scellee) { L.svg("rect", { x: p.x - 16, y: p.y - 3, width: 32, height: 6, rx: 2, fill: "#9aa2a6", stroke: "#333" }, g); L.svg("ellipse", { cx: p.x, cy: p.y - 3, rx: 6, ry: 2, fill: "#d9b44a" }, g); }
    else { L.svg("path", { d: `M${p.x - 18} ${p.y - 6} h36 l-4 9 h-28 Z`, fill: "#d9d4cc", stroke: "#666" }, g); L.svg("ellipse", { cx: p.x, cy: p.y - 6, rx: 15, ry: 3, fill: def.couleur }, g); }
    L.texte(g, p.x, p.y + 14, def.nom, { "font-size": 6.5, "font-weight": 700, fill: "#f4f1e6" });
  }

  function deplacable(b, maison, ici, est_ici, poser, dessiner) {
    // Objet que l'on fait glisser : posé sur le banc s'il est lâché près du tube, rangé sinon ; on le reprend sur le banc.
    const p = { ...maison };
    const tracer = () => { b.replaceChildren(); if (est_ici()) L.svg("rect", { x: ici.x - 30, y: ici.y - 8, width: 60, height: 16, fill: "#000", opacity: 0 }, b); else dessiner(b, p); };
    L.glissable(b, { soulever: false, debut: () => (est_ici() ? { ...ici } : { ...p }), deplacer: (q) => { if (est_ici()) poser(false); Object.assign(p, q); tracer(); }, lacher: (q) => { poser(pres(q)); Object.assign(p, maison); tracer(); } });
    tracer();
    return tracer;
  }

  L.banc_comptage = function (g, { fait = "compteur", sources = Object.keys(S) }) {
    // Coffret, écrans, potence, compteur ; dessin de ce qui est posé sur le banc ; taux d'impulsions.
    const s = { source: null, ecran: null }, defs = {}, tracers = [];
    L.boitier(g, 730, 430, 236, 12, 30, { dessus: "#4a4f55", face: "#33373b" });
    L.texte(g, 848, 488, "coffret en plomb (sources et échantillons)", { "font-size": 6.5, fill: "#d8d2c0" });
    potence(g);
    const banc = L.svg("g", { "pointer-events": "none" }, g), noter = () => L.missions.noter("banc", { ...s });
    const maj = () => { banc.replaceChildren(); if (s.source) objet(banc, defs[s.source], SUPPORT); if (s.ecran) objet(banc, null, FENTE, ECRANS[s.ecran]); tracers.forEach((t) => t()); noter(); };
    const ajouter = (id, def, maison) => {
      defs[id] = def;
      const b = L.svg("g", { class: `source-${id}`, role: "button", "aria-label": def.nom }, g);
      tracers.push(deplacable(b, maison, SUPPORT, () => s.source === id, (oui) => { s.source = oui ? id : s.source === id ? null : s.source; maj(); }, (bb, p) => objet(bb, def, p)));
    };
    sources.forEach((id, k) => ajouter(id, S[id], { x: 752 + k * 38, y: 438 }));
    Object.keys(ECRANS).forEach((id, k) => {
      const b = L.svg("g", { class: `ecran-${id}`, role: "button", "aria-label": `Écran : ${ECRANS[id].nom}` }, g);
      tracers.push(deplacable(b, { x: 330 + k * 66, y: 572 }, FENTE, () => s.ecran === id, (oui) => { s.ecran = oui ? id : s.ecran === id ? null : s.ecran; maj(); }, (bb, p) => objet(bb, null, p, ECRANS[id])));
    });
    const taux = (t) => { if (!s.source) return BRUIT; const d = defs[s.source], r = typeof d.taux === "function" ? d.taux(t) : d.taux, f = s.ecran ? ECRANS[s.ecran].f : { a: 1, b: 1, g: 1 }; return BRUIT + r.a * f.a + r.b * f.b + r.g * f.g; };
    const compteur = L.compteur_geiger(g, { x: 300, y: 400, taux, etiquette: () => ({ ...s }), fait });
    cable(g);
    maj();
    return { s, compteur, ajouter: (id, def, maison) => { ajouter(id, def, maison); maj(); } };
  };
})(window.Labo);
