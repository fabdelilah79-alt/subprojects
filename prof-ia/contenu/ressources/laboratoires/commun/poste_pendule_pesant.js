/*
Rôle : paillasse « pendule pesant » : tige en aluminium (100 g, 50 cm, axe à 1 cm du bout : J1 = 7,84 × 10⁻³ kg·m², G1 à 24 cm
       de l'axe) et masse coulissante de 200 g à d = 10, 20, 30 ou 40 cm (J = J1 + m2·d², M·a = m1·a1 + m2·d) ; palette
       d'amortissement de 4 g que l'on monte au bas de la tige. On écarte la tige (jusqu'à 50°) et on la lâche : le capteur
       de rotation envoie θ(t) au logiciel. Modèle sans approximation des petits angles (sin θ), frottement de l'air faible
       (τ = 400 s) ou fort avec la palette (τ = 4 s) : les grandes amplitudes ont une période plus longue.
       Variante « énergies » : la touche « Énergies » du logiciel montre Ec = ½·J·θ̇², Epp = M·g·a·(1 − cos θ) (référence :
       position d'équilibre) et Em.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_pendule_pesant(g) et Labo.poste_pendule_pesant_energies(g) -> { pense_bete } ; faits « pendule_pesant » = { d (m), palette, T0 (s) },
          « lachers_pesant » = [{ id, d, palette, theta0 (°), T (s) }], « acquisition » ; Labo.pendule_pesant_modele
          = { omega2(d, palette), J(d), Ma(d) } (pour les vérifications et les tests).
Utilisé par : b2_meca4_s1_pendule_pesant (période, amortissement), b2_meca5_s1_pendule_pesant (énergies).
*/
(function (L) {
  const M1 = 0.1, A1 = 0.24, J1 = 0.1 * (0.25 / 12 + A1 * A1), M2 = 0.2, M3 = 0.004, A3 = 0.4625, MAX = (50 * Math.PI) / 180;
  const J = (d, p) => J1 + M2 * d * d + (p ? M3 * A3 * A3 : 0), Ma = (d, p) => M1 * A1 + M2 * d + (p ? M3 * A3 : 0);
  const omega2 = (d, p) => (L.pendule.G * Ma(d, p)) / J(d, p), deg = (r) => Math.round((r * 1800) / Math.PI) / 10;
  L.pendule_pesant_modele = { omega2, J, Ma };

  function fiche(g, energies) {
    // Fiche des données collée au mur (la dernière ligne rappelle, dans la variante « énergies », ce que calcule le logiciel).
    L.svg("rect", { x: 560, y: 40, width: 420, height: 94, rx: 3, fill: "#fdfdf8", stroke: "#c9c4b0", filter: "url(#ombre)" }, g);
    L.texte(g, 770, 56, "Pendule pesant", { "font-size": 9.5, "font-weight": 700, fill: "#23315a" });
    ["Tige : m1 = 100 g ; J1 = 7,84 × 10⁻³ kg·m² ; son centre d'inertie G1 est à a1 = 24 cm de l'axe", "Masse coulissante (ponctuelle) : m2 = 200 g à la distance d de l'axe : J2 = m2·d²",
      "J = J1 + m2·d² ; moment du poids : −(m1·a1 + m2·d)·g·sin θ ; g = 9,81 m/s²", energies ? "Logiciel : θ̇ = dθ/dt ; Ec et Epp calculées, Epp = 0 à l'équilibre (θ = 0)" : "Palette d'amortissement : 4 g (masse négligeable)"].forEach((t, i) => L.texte(g, 770, 73 + i * 15, t, { "font-size": 8, fill: "#222" }));
  }

  function zones(g, P, e, m, noter, lacher) {
    // Zones touchables (invisibles) qui suivent la tige : la tige (écarter, lâcher ; un appui bref l'arrête) ; la masse, que l'on
    // fait glisser le long de la tige (geste vers le haut ou le bas) ou par laquelle on écarte le pendule (geste sur le côté).
    const gz = L.svg("g", {}, g), vers = (ev) => L.scene.vers_scene(ev), incliner = (p) => { m.th = Math.max(-MAX, Math.min(MAX, Math.atan2(p.x - P.AXE.x, p.y - P.AXE.y))); };
    const tige = L.svg("rect", { x: -16, y: 20, width: 32, height: 232, fill: "#000", opacity: 0.001, class: "tige-pendule", role: "slider", "aria-label": "Tige du pendule" }, gz);
    const masse = L.svg("rect", { x: -20, y: e.d * P.PX - 12, width: 40, height: 24, fill: "#000", opacity: 0.001, class: "masse-coulissante", role: "slider", "aria-label": "Masse coulissante" }, gz);
    L.glissable(tige, { soulever: false, debut: (ev) => { m.arreter(); return vers(ev); }, deplacer: incliner, lacher, toucher: () => { m.th = 0; } });
    let mode = null, p0 = null;
    L.glissable(masse, { soulever: false, debut: (ev) => { m.arreter(); m.th = 0; mode = null; p0 = vers(ev); return p0; },
      deplacer: (p) => {
        mode ??= Math.abs(p.x - p0.x) > Math.abs(p.y - p0.y) ? "balancer" : "glisser";
        if (mode === "balancer") return incliner(p);
        e.d = Math.max(1, Math.min(4, Math.round((p.y - P.AXE.y) / P.PX / 0.1))) / 10; masse.setAttribute("y", e.d * P.PX - 12);
      },
      lacher: () => (mode === "balancer" ? lacher() : noter()) });
    return () => gz.setAttribute("transform", `translate(${P.AXE.x} ${P.AXE.y}) rotate(${(-m.th * 180) / Math.PI})`);
  }

  function chaine(g, e, B, energies) {
    // Interface et logiciel θ(t) en degrés ; vue « Énergies » (Ec, Epp, Em) dans la variante « énergies ».
    const en = energies ? (th, w) => [0.5 * J(e.d, e.palette) * w * w, Ma(e.d, e.palette) * L.pendule.G * (1 - Math.cos(th))] : null;
    return L.logiciel_xt(g, { x: 560, y: 160, boitier: B, durees: [5, 10, 20], grandeur: { nom: "θ", unite: "°", facteur: 180 / Math.PI, decimales: 1 },
      energies: en, noms: ["Ec", "Epp"], etiquette: () => `d = ${Math.round(e.d * 100)} cm${e.palette ? " ; palette" : ""}` });
  }

  function poste(g, energies) {
    // Pendule, palette, chaîne d'acquisition ; le modèle est intégré à chaque image et envoie θ au logiciel.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230), B = { x: 588, y: 524 }, e = { d: 0.4, palette: false }, lachers = [];
    fiche(g, energies);
    const logiciel = chaine(g, e, B, energies);
    const P = L.pendule_pesant_dessin({ x: 360, y: 196, sol: 496, prise: { x: B.x + 10, y: B.y + 28 } });
    P.fond(g);
    const gt = L.svg("g", {}, g), gp = L.svg("g", {}, g), m = L.pendule.creer({ omega2: omega2(e.d, false), tau: 400 }), maintenant = () => performance.now() / 1000;
    const noter = () => { Object.assign(m, { omega2: omega2(e.d, e.palette), tau: e.palette ? 4 : 400 }); L.missions.noter("pendule_pesant", { d: e.d, palette: e.palette, T0: Math.round(L.pendule.periode(m.omega2, 0) * 10000) / 10000 }); };
    let t_lacher = 0;
    const lacher = () => {
      // Lâcher sans vitesse depuis l'angle atteint ; l'essai est noté et l'acquisition démarre.
      if (Math.abs(m.th) < 0.02) return Object.assign(m, { th: 0 });
      m.lacher(m.th); t_lacher = maintenant();
      lachers.push({ id: `lacher${lachers.length + 1}`, d: e.d, palette: e.palette, theta0: deg(m.th), T: Math.round(L.pendule.periode(m.omega2, m.th) * 10000) / 10000 });
      L.missions.noter("lachers_pesant", lachers.slice()); logiciel.depart(t_lacher);
    };
    const suivre = zones(g, P, e, m, noter, lacher);
    const palette = L.svg("rect", { x: P.ZONE_PALETTE.x - 34, y: P.ZONE_PALETTE.y - 12, width: 68, height: 34, fill: "#000", opacity: 0.001, class: "palette", role: "button", "aria-label": "Palette d'amortissement" }, g);
    L.glissable(palette, { soulever: false, debut: () => ({ x: 0, y: 0 }), toucher: () => { m.arreter(); m.th = 0; e.palette = !e.palette; P.palette_table(gt, e.palette); noter(); } });
    let avant = maintenant();
    const image = () => {
      // Intègre le mouvement depuis l'image précédente, envoie chaque mesure au logiciel, redessine.
      const t = maintenant();
      if (m.oscille) m.avancer(t - avant, (tm, th) => logiciel.mesurer(t_lacher + tm, th)); else logiciel.mesurer(t, m.th);
      avant = t; P.pendule(gp, m.th, e.d, e.palette); suivre(); requestAnimationFrame(image);
    };
    P.palette_table(gt, false); noter(); L.missions.noter("lachers_pesant", []); image();
    return { pense_bete };
  }

  L.poste_pendule_pesant = (g) => poste(g, false);
  L.poste_pendule_pesant_energies = (g) => poste(g, true);
})(window.Labo);
