/*
Rôle : paillasse « énergie mécanique du pendule de torsion » : fil A (C = 4,0 × 10⁻³ N·m/rad), barre et masselottes à 8 cm
       (J = 2,18 × 10⁻³ kg·m²), capteur de rotation sous la barre relié à l'interface ; logiciel θ(t) (en degrés) avec la vue
       « Énergies » : Ec = ½·J·θ̇², Ept = ½·C·θ², Em = Ec + Ept. Oscillations à peine amorties (τ = 400 s).
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_energie_torsion(g) -> { pense_bete } ; faits « lachers_energie » = [{ id, theta0 (°), Em0 (J) }], « acquisition ».
Utilisé par : simulation.js (paillasse 3).
*/
(function (L) {
  const C = 0.004, J = 0.0009 + 0.2 * 0.08 * 0.08, T0 = 2 * Math.PI * Math.sqrt(J / C), TAU = 400, MAX = 1;

  function fiche(g) {
    // Fiche des données collée au mur.
    L.svg("rect", { x: 600, y: 44, width: 380, height: 78, rx: 3, fill: "#fdfdf8", stroke: "#c9c4b0", filter: "url(#ombre)" }, g);
    L.texte(g, 790, 60, "Énergies du pendule de torsion", { "font-size": 9.5, "font-weight": 700, fill: "#23315a" });
    ["Fil A : C = 4,0 × 10⁻³ N·m/rad ; masselottes à 8 cm : J = 2,18 × 10⁻³ kg·m²", "Référence : Ept = 0 quand le fil n'est pas tordu (θ = 0)", "Logiciel : θ̇ = dθ/dt ; Ec = ½·J·θ̇² ; Ept = ½·C·θ²"].forEach((t, i) => L.texte(g, 790, 77 + i * 15, t, { "font-size": 8, fill: "#222" }));
  }

  L.poste_energie_torsion = function (g) {
    // Pendule et capteur, portable ; θ(t) calculé à chaque image depuis le lâcher, envoyé au logiciel.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230), lachers = [], B = { x: 436, y: 540 };
    fiche(g);
    const logiciel = L.logiciel_xt(g, { x: 560, y: 160, boitier: B, durees: [5, 10, 20], grandeur: { nom: "θ", unite: "°", facteur: 180 / Math.PI, decimales: 1 }, noms: ["Ec", "Ept"],
      energies: (th, w) => [0.5 * J * w * w, 0.5 * C * th * th], etiquette: () => "fil A ; d = 8 cm" });
    const P = L.pendule_torsion_dessin({ cx: 440, socle: 470, capteur: { x: B.x + 10, y: B.y + 28 } });
    P.fond(g);
    const gb = L.svg("g", {}, g), e = { th: 0, th0: 0, t0: 0, oscille: false }, maintenant = () => performance.now() / 1000;
    const z = L.svg("rect", { x: P.C.x + 60, y: P.C.y - 20, width: 80, height: 100, fill: "#000", opacity: 0.001, class: "aiguille", role: "button", "aria-label": "Aiguille" }, g);
    L.glissable(z, { soulever: false,
      debut: () => { e.oscille = false; return { x: P.C.x + P.R_CADRAN * Math.cos(e.th), y: P.C.y + P.BAS + P.K * P.R_CADRAN * Math.sin(e.th) }; },
      deplacer: (p) => { e.th = Math.max(-MAX, Math.min(MAX, Math.atan2((p.y - P.C.y - P.BAS) / P.K, p.x - P.C.x))); },
      lacher: () => {
        if (Math.abs(e.th) < 0.05) return Object.assign(e, { th: 0, oscille: false });
        Object.assign(e, { oscille: true, th0: e.th, t0: maintenant() });
        lachers.push({ id: `lacher${lachers.length + 1}`, theta0: Math.round((e.th * 1800) / Math.PI) / 10, Em0: Math.round(0.5 * C * e.th * e.th * 1e6) / 1e6 }); L.missions.noter("lachers_energie", lachers.slice()); logiciel.depart(e.t0);
      } });
    const image = () => {
      // Oscillation libre : θ = θ0·e^(−t/τ)·cos(2π·t/T0) ; mesure envoyée au logiciel.
      const t = maintenant();
      if (e.oscille) e.th = e.th0 * Math.exp(-(t - e.t0) / TAU) * Math.cos((2 * Math.PI * (t - e.t0)) / T0);
      logiciel.mesurer(t, e.th); P.barre(gb, e.th, 0.08, "A"); requestAnimationFrame(image);
    };
    L.missions.noter("lachers_energie", []); image();
    return { pense_bete };
  };
})(window.Labo);
