/*
Rôle : paillasse « particule chargée dans un champ magnétique » : tube à faisceau filiforme entre deux bobines de Helmholtz.
       Chauffage, tension accélératrice U (0 à 300 V ; faisceau visible à partir de 100 V), courant I dans les bobines (0 à 3 A),
       inverseur du sens du courant. Champ au centre B = 7,79 × 10⁻⁴ × I (T), perpendiculaire à la vitesse initiale ; vitesse à la
       sortie du canon v0 = √(2·e·U/m) ; trajectoire circulaire de rayon r = m·v0 / (e·B), tangente à la sortie du canon ; le
       faisceau s'arrête s'il touche le verre. Toucher l'ampoule l'ouvre en grand pour lire le diamètre sur les repères.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_champ_magnetique(g) -> { pense_bete } ; faits « tube_b » = { chauffage, U, I, sens, B, r (m ou null), faisceau },
          « vues_b » = [{ U, I, sens, r }] (ampoule ouverte en grand), « documents_b » (documents lus : spectrographe, cyclotron) ; Labo.champ_b = { KB, rayon(U, I) }.
Utilisé par : simulation.js.
*/
(function (L) {
  const D = L.bobines_dessin, KB = 7.79e-4, EM = 1.7588e11, rayon = (U, I) => Math.sqrt((2 * U) / EM) / (KB * I);

  function points(e, echelle = 1, centre = D.SPHERE, sortie = D.SORTIE) {
    // Points (px) du faisceau : droite si I = 0, sinon cercle tangent à la sortie du canon, coupé par le verre.
    if (!e.chauffage || e.U < 100) return [];
    const k = D.K * echelle, dedans = (p) => Math.hypot(p.x - centre.x, p.y - centre.y) < D.SPHERE.r * echelle - 2, pts = [];
    const r = e.I > 0 ? rayon(e.U, e.I) : null;
    for (let i = 0; i <= 240; i++) {
      const p = r === null ? { x: sortie.x + i * 0.0006 * k, y: sortie.y } : { x: sortie.x + r * Math.sin((i / 240) * 2 * Math.PI) * k, y: sortie.y - e.sens * r * (1 - Math.cos((i / 240) * 2 * Math.PI)) * k };
      if (i > 0 && !dedans(p)) { pts.push(p); break; }
      pts.push(p);
    }
    return pts;
  }

  function grand(gv, e) {
    // Ampoule vue en grand (× 3) : verre, réglette de repères, trace, réglages.
    gv.replaceChildren();
    const c = { x: 512, y: 300 }, s = 3, so = { x: c.x, y: c.y + (D.SORTIE.y - D.SPHERE.y) * s };
    L.svg("rect", { x: c.x - 260, y: c.y - 250, width: 520, height: 500, rx: 10, fill: "#101418" }, gv);
    L.svg("circle", { cx: c.x, cy: c.y, r: D.SPHERE.r * s, fill: "#1a2030", stroke: "#9fb6be", "stroke-width": 2 }, gv);
    L.svg("line", { x1: so.x, y1: so.y - 12, x2: so.x, y2: so.y - 0.12 * D.K * s - 6, stroke: "#c9d2d8", "stroke-width": 2 }, gv);
    for (let d = 2; d <= 12; d += 2) { const y = so.y - (d / 100) * D.K * s; L.svg("rect", { x: so.x - 7, y: y - 2, width: 14, height: 4, fill: "#e8f6a8" }, gv); L.texte(gv, so.x - 14, y + 4, `${d} cm`, { "font-size": 11, fill: "#e8f6a8", "text-anchor": "end" }); }
    L.svg("rect", { x: so.x - 60, y: so.y - 10, width: 60, height: 22, rx: 4, fill: "#7a8288" }, gv);
    const pts = points(e, s, c, so), d = pts.map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
    if (pts.length > 1) { L.svg("path", { d, fill: "none", stroke: "#8f7dff", "stroke-width": 10, opacity: 0.3 }, gv); L.svg("path", { d, fill: "none", stroke: "#d8d4ff", "stroke-width": 2.4 }, gv); }
    L.texte(gv, c.x, c.y - 226, pts.length ? `U = ${e.U} V ; I = ${e.I.toFixed(2).replace(".", ",")} A` : "Aucun faisceau : chauffage et U ≥ 100 V.", { "font-size": 13, "font-weight": 700, fill: "#dfe6ec" });
    L.texte(gv, c.x, c.y + 238, "Touchez pour refermer.", { "font-size": 10, fill: "#888" });
  }

  function commandes(g, e, maj) {
    // Interrupteur du chauffage et bouton U (alimentation du tube) ; bouton I et inverseur (alimentation des bobines).
    const b = L.svg("g", { class: "chauffage", role: "switch", "aria-label": "Chauffage" }, g), y0 = D.BOITE1.y;
    L.svg("rect", { x: D.BOITE1.x + 14, y: y0 + 24, width: 16, height: 22, rx: 3, fill: "#111" }, b);
    const bascule = L.svg("rect", { x: D.BOITE1.x + 17, y: y0 + 27, width: 10, height: 8, rx: 2, fill: "#c62828" }, b);
    L.texte(g, D.BOITE1.x + 22, y0 + 56, "Chauffage", { "font-size": 5.5, fill: "#dfe6ec" });
    L.glissable(b, { soulever: false, debut: () => ({ x: 0, y: 0 }), toucher: () => { e.chauffage = !e.chauffage; bascule.setAttribute("y", e.chauffage ? y0 + 35 : y0 + 27); maj(); } });
    L.bouton_reglage(g, { x: D.BOITE1.x + 120, y: y0 + 75, min: 0, max: 300, pas: 5, valeur: 0, unite: "V", titre: "U", decimales: 0, sur_changement: (v) => { e.U = v; maj(); } });
    L.bouton_reglage(g, { x: D.BOITE2.x + 70, y: y0 + 75, min: 0, max: 3, pas: 0.01, valeur: 0, unite: "A", titre: "I", decimales: 2, sur_changement: (v) => { e.I = v; maj(); } });
    const inv = L.svg("g", { class: "inverseur", role: "switch", "aria-label": "Sens du courant" }, g);
    L.svg("rect", { x: D.BOITE2.x + 132, y: y0 + 32, width: 14, height: 28, rx: 7, fill: "#111" }, inv);
    const levier = L.svg("circle", { cx: D.BOITE2.x + 139, cy: y0 + 39, r: 5, fill: "url(#acier)" }, inv);
    L.texte(g, D.BOITE2.x + 139, y0 + 72, "sens", { "font-size": 5.5, fill: "#dfe6ec" });
    L.glissable(inv, { soulever: false, debut: () => ({ x: 0, y: 0 }), toucher: () => { e.sens = -e.sens; levier.setAttribute("cy", e.sens > 0 ? y0 + 39 : y0 + 53); maj(); } });
  }

  const DOCUMENTS = [
    { x: 540, y: 40, l: 220, h: 130, titre: "Le spectrographe de masse", texte: "Des ions de même charge q, accélérés puis triés pour avoir tous la même vitesse v, entrent dans un champ magnétique B perpendiculaire à v : ils décrivent des demi-cercles de rayon R = m·v / (|q|·B). Des isotopes, de masses différentes, arrivent en des points différents du détecteur : on sépare les isotopes et on mesure leurs masses." },
    { x: 776, y: 40, l: 220, h: 130, titre: "Le cyclotron", texte: "Deux demi-boîtes en forme de D sont placées dans un champ magnétique uniforme. À chaque passage entre les D, une tension alternative accélère les particules. Dans un D, elles décrivent un demi-cercle en une durée π·m / (|q|·B), qui ne dépend pas de leur vitesse ; le rayon augmente à chaque tour." },
  ];

  L.poste_champ_magnetique = function (g) {
    // Matériel, commandes, trace ; l'ampoule se touche pour l'ouvrir en grand.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230), e = { chauffage: false, U: 0, I: 0, sens: 1 }, vues = [];
    L.documents_mur(g, DOCUMENTS, "documents_b"); D.fond(g);
    const gt = L.svg("g", { "pointer-events": "none" }, g), zone = L.svg("circle", { class: "ampoule", cx: D.SPHERE.x, cy: D.SPHERE.y, r: D.SPHERE.r, fill: "#000", opacity: 0.001 }, g);
    const etat = () => ({ ...e, B: Math.round(KB * e.I * 1e7) / 1e7, r: e.I > 0 && e.U >= 100 && e.chauffage ? rayon(e.U, e.I) : null, faisceau: points(e).length > 1 });
    const maj = () => { D.trace(gt, points(e), e.chauffage); L.missions.noter("tube_b", etat()); };
    commandes(g, e, maj);
    const gv = L.svg("g", { class: "vue-ampoule" }, g);
    L.glissable(zone, { soulever: false, debut: () => ({ x: 0, y: 0 }), toucher: () => { grand(gv, e); const s = etat(); if (s.faisceau) { vues.push({ U: e.U, I: e.I, sens: e.sens, r: s.r }); L.missions.noter("vues_b", vues.slice()); } } });
    L.glissable(gv, { soulever: false, debut: () => ({ x: 0, y: 0 }), toucher: () => gv.replaceChildren() });
    maj(); L.missions.noter("vues_b", []); L.missions.noter("documents_b", []);
    g.append(g.querySelector(".document-ouvert"));
    return { pense_bete };
  };
  L.champ_b = { KB, rayon };
})(window.Labo);
