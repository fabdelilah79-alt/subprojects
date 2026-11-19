/*
Rôle : paillasse « relation fondamentale de la dynamique en rotation » : tige à masselottes (J = J_tige + 2·m'·d², avec
       J_tige = 2,4 × 10⁻³ kg·m², m' = 150 g, d = 5, 10, 15 ou 20 cm) tournant autour d'un axe horizontal fixe (roulements :
       frottements négligés), entraînée par un fil enroulé sur un tambour (r = 2,5 cm) qui porte une masse m (porte-masse
       de 50 g + disques de 50 g). « Lâcher » desserre le frein et met le chronomètre en marche ; la cellule placée 50 cm plus
       bas l'arrête au passage du plateau. Système : θ̈ = m·g·r / (J + m·r²), a = r·θ̈, h = ½·a·t².
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_tige(g) -> { pense_bete } ; faits « reglage » = { m_g, d_cm }, « essais » = [{ id, m_g, d_cm, t (s) }].
Utilisé par : simulation.js.
*/
(function (L) {
  const G = 9.81, RT = 0.025, J_TIGE = 0.0024, MP = 0.15, H = 0.5, MOUSSE = 0.55, DISTANCES = [0.05, 0.1, 0.15, 0.2];
  const alpha = (m, d) => (m * G * RT) / (J_TIGE + 2 * MP * d * d + m * RT * RT);

  function boitier(g) {
    // Chronomètre et commande du frein : câbles vers la cellule et vers le frein, cordon secteur, afficheur.
    const D = L.tige_dessin;
    L.svg("path", { d: `M463 ${D.Y_CELLULE + 9} C463 ${D.Y_CELLULE + 40} 520 506 562 500`, fill: "none", stroke: "#222", "stroke-width": 2 }, g);
    L.svg("path", { d: `M434 ${D.C.y - 36} C520 30 556 220 562 452`, fill: "none", stroke: "#222", "stroke-width": 2 }, g);
    L.cordon_secteur(g, { x: 780, y: 446 }, { x: 962, y: 322 });
    L.svg("rect", { x: 560, y: 430, width: 230, height: 94, rx: 4, fill: "url(#facade)", stroke: "#4a5254", filter: "url(#ombre)" }, g);
    L.texte(g, 675, 443, "CHRONOMÈTRE ET FREIN", { "font-size": 7, "font-weight": 700, fill: "#23315a" });
    for (const [t, y] of [["frein", 452], ["cellule", 500]]) { L.svg("circle", { cx: 565, cy: y, r: 3, fill: "#1b1e21", stroke: "#888" }, g); L.texte(g, 571, y + 2, t, { "font-size": 5.5, fill: "#23315a", "text-anchor": "start" }); }
    L.svg("rect", { x: 600, y: 450, width: 150, height: 26, rx: 3, fill: "#1d2a22" }, g);
    return L.texte(g, 675, 468, "0,000 s", { "font-size": 14, "font-weight": 700, fill: "#7dff9a", "font-family": "monospace" });
  }

  function fiche(g) {
    // Fiche des données collée au mur.
    L.svg("rect", { x: 590, y: 40, width: 400, height: 80, rx: 3, fill: "#fdfdf8", stroke: "#c9c4b0", filter: "url(#ombre)" }, g);
    const l = ["Tige : 125 g, L = 48 cm : J_tige = m·L²/12 = 2,4 × 10⁻³ kg·m²", "Masselottes : 2 × 150 g à la distance d de l'axe (points matériels)", "Tambour : r = 2,5 cm ; chute mesurée : h = 50 cm ; g = 9,81 m/s²"];
    L.texte(g, 790, 56, "Solide en rotation autour d'un axe fixe", { "font-size": 9.5, "font-weight": 700, fill: "#23315a" });
    l.forEach((t, i) => L.texte(g, 790, 74 + i * 15, t, { "font-size": 8.5, fill: "#222" }));
  }

  function avancer(e, essais, ecran, gm) {
    // Chute : φ = ½·θ̈·t² ; la cellule arrête le chronomètre à 50 cm ; la masse se pose à 55 cm, le fil se décroche.
    const t = performance.now() / 1000 - e.t0, m = 0.05 * (1 + e.disques), a = alpha(m, e.d), tp = Math.sqrt((2 * MOUSSE) / RT / a), tc = Math.sqrt((2 * H) / RT / a);
    e.phi = 0.5 * a * Math.min(t, tp) ** 2 + (t > tp ? a * tp * (t - tp) : 0);
    if (t >= tc && e.chrono === null) {
      e.chrono = Math.round(tc * 1000) / 1000;
      essais.push({ id: `essai${essais.length + 1}`, m_g: Math.round(m * 1000), d_cm: Math.round(e.d * 100), t: e.chrono });
      L.missions.noter("essais", essais.slice());
    }
    ecran.textContent = `${(e.chrono ?? t).toFixed(3).replace(".", ",")} s`;
    L.tige_dessin.masse(gm, RT * e.phi, e.disques, t > tp);
  }

  function zone(g, x, y, l, h, nom, etiquette, action) {
    // Zone touchable invisible posée sur un objet (masselotte, porte-masse).
    const z = L.svg("rect", { x, y, width: l, height: h, fill: "#000", opacity: 0.001, class: nom, role: "button", "aria-label": etiquette }, g);
    L.glissable(z, { soulever: false, debut: () => ({ x: 0, y: 0 }), toucher: action });
  }

  L.poste_tige = function (g) {
    // Matériel, réglages (masselottes, disques) frein serré, lâcher, chronomètre, mouvement image par image.
    const D = L.tige_dessin, pense_bete = L.decor.pense_bete(g, 24, 52, 230);
    fiche(g); D.fond(g); D.cellule(g);
    const ecran = boitier(g), gc = L.svg("g", {}, g), gm = L.svg("g", {}, g), gt = L.svg("g", {}, g), zones = L.svg("g", {}, g);
    const e = { d: 0.1, disques: 0, mode: "tenu", t0: 0, phi: 0, chrono: null }, essais = [], tenu = () => e.mode === "tenu";
    const regler = () => {
      // Masse et masselottes redessinées, disques du coffret et masselottes rendus touchables.
      L.missions.noter("reglage", { m_g: 50 * (1 + e.disques), d_cm: Math.round(e.d * 100) });
      D.masse(gm, 0, e.disques, false); zones.replaceChildren();
      D.coffret(gc, 4 - e.disques).forEach((el) => L.glissable(el, { soulever: false, debut: () => ({ x: 0, y: 0 }), toucher: () => { if (tenu() && e.disques < 4) { e.disques++; regler(); } } }));
      for (const s of [-1, 1]) zone(zones, D.C.x + s * e.d * D.PX - 10, D.C.y - 16, 20, 32, "zone-masselotte", "Masselotte", () => { if (tenu()) { e.d = DISTANCES[(DISTANCES.indexOf(e.d) + 1) % 4]; regler(); } });
    };
    zone(g, D.C.x - 4, 240, 28, 40, "zone-porte-masse", "Retirer un disque", () => { if (tenu() && e.disques > 0) { e.disques--; regler(); } });
    L.bouton_poussoir(g, 675, 500, { textes: ["Lâcher", "Remonter"], sur_changement: (oui) => {
      Object.assign(e, oui ? { mode: "chute", t0: performance.now() / 1000, chrono: null } : { mode: "tenu", phi: 0, chrono: null });
      ecran.textContent = "0,000 s"; if (!oui) regler();
    } });
    const image = () => { if (e.mode === "chute") avancer(e, essais, ecran, gm); D.tige(gt, e.phi, e.d); requestAnimationFrame(image); };
    regler(); L.missions.noter("essais", []); image();
    return { pense_bete };
  };
})(window.Labo);
