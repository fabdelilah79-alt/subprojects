/*
Rôle : paillasse « pendule de torsion » : barre (J_barre = 9,0 × 10⁻⁴ kg·m²) et deux masselottes de 100 g à d = 4, 8 ou 12 cm
       (J = J_barre + 2·m'·d²), suspendues à un fil d'acier : fil A (C = 4,0 × 10⁻³ N·m/rad) ou fil B, plus épais
       (C = 1,6 × 10⁻² N·m/rad). On tourne la barre par son aiguille et on la lâche : θ(t) = θm·cos(2π·t/T0), T0 = 2π·√(J/C)
       (amortissement très faible). Chronomètre à main pour mesurer plusieurs oscillations.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_torsion(g) -> { pense_bete } ; faits « pendule » = { fil, C, d (m), J }, « lachers_torsion » = [{ id, fil, d,
          theta0 (°), T0 (s) }], « chronometre ».
Utilisé par : simulation.js.
*/
(function (L) {
  const FILS = { A: 0.004, B: 0.016 }, J_BARRE = 0.0009, MP = 0.1, D = [0.04, 0.08, 0.12], TAU = 150, MAX = 1;
  const J = (d) => J_BARRE + 2 * MP * d * d, T0 = (e) => 2 * Math.PI * Math.sqrt(J(e.d) / FILS[e.fil]);

  function fiche(g) {
    // Fiche des données collée au mur.
    L.svg("rect", { x: 610, y: 44, width: 380, height: 80, rx: 3, fill: "#fdfdf8", stroke: "#c9c4b0", filter: "url(#ombre)" }, g);
    L.texte(g, 800, 60, "Pendule de torsion", { "font-size": 9.5, "font-weight": 700, fill: "#23315a" });
    ["Barre : 120 g, 30 cm : J_barre = 9,0 × 10⁻⁴ kg·m²", "Masselottes : 2 × 100 g à d de l'axe : J = J_barre + 2·m'·d²", "Fil A : C = 4,0 × 10⁻³ N·m/rad ; fil B : C = 1,6 × 10⁻² N·m/rad"].forEach((t, i) => L.texte(g, 800, 77 + i * 15, t, { "font-size": 8.5, fill: "#222" }));
  }

  function zone(g, x, y, l, h, nom, reglage) {
    // Zone touchable invisible (côté de l'aiguille, ou masselotte).
    const z = L.svg("rect", { x, y, width: l, height: h, fill: "#000", opacity: 0.001, class: nom, role: "button", "aria-label": nom }, g);
    L.glissable(z, { soulever: false, ...reglage });
  }

  L.poste_torsion = function (g) {
    // Pendule, chronomètre, fil de rechange ; θ(t) calculé à chaque image depuis le lâcher.
    const P = L.pendule_torsion_dessin(), pense_bete = L.decor.pense_bete(g, 24, 52, 230), lachers = [];
    fiche(g); P.fond(g);
    const gb = L.svg("g", {}, g), gr = L.svg("g", { class: "fil-rechange", role: "button", "aria-label": "Fil de rechange" }, g), zones = L.svg("g", {}, g);
    const e = { fil: "A", d: 0.08, th: 0, th0: 0, t0: 0, oscille: false };
    L.chronometre_manuel(g, { x: 640, y: 470, fait: "chronometre" });
    const noter = () => L.missions.noter("pendule", { fil: e.fil, C: FILS[e.fil], d: e.d, J: Math.round(J(e.d) * 1e7) / 1e7 });
    const arreter = () => Object.assign(e, { oscille: false, th: 0 });
    const masselottes = () => { zones.querySelectorAll(".masselotte").forEach((z) => z.remove()); for (const s of [-1, 1]) zone(zones, P.C.x + s * e.d * P.PX - 9, P.C.y - 18, 18, 24, "masselotte", { debut: () => ({ x: 0, y: 0 }), toucher: () => { arreter(); e.d = D[(D.indexOf(e.d) + 1) % 3]; noter(); masselottes(); } }); };
    zone(zones, P.C.x + 60, P.C.y - 20, 80, 100, "aiguille", {
      debut: () => { e.oscille = false; return { x: P.C.x + P.R_CADRAN * Math.cos(e.th), y: P.C.y + P.BAS + P.K * P.R_CADRAN * Math.sin(e.th) }; },
      deplacer: (p) => { e.th = Math.max(-MAX, Math.min(MAX, Math.atan2((p.y - P.C.y - P.BAS) / P.K, p.x - P.C.x))); },
      lacher: () => { if (Math.abs(e.th) < 0.05) return arreter(); Object.assign(e, { oscille: true, th0: e.th, t0: performance.now() / 1000 }); lachers.push({ id: `lacher${lachers.length + 1}`, fil: e.fil, d: e.d, theta0: Math.round((e.th * 1800) / Math.PI) / 10, T0: Math.round(T0(e) * 10000) / 10000 }); L.missions.noter("lachers_torsion", lachers.slice()); },
    });
    L.glissable(gr, { soulever: false, debut: () => ({ x: 0, y: 0 }), toucher: () => { arreter(); e.fil = e.fil === "A" ? "B" : "A"; P.rechange(gr, e.fil === "A" ? "B" : "A"); noter(); } });
    const image = () => {
      // Oscillation libre, à peine amortie : θ = θ0·e^(−t/τ)·cos(2π·t/T0).
      if (e.oscille) { const t = performance.now() / 1000 - e.t0; e.th = e.th0 * Math.exp(-t / TAU) * Math.cos((2 * Math.PI * t) / T0(e)); }
      P.barre(gb, e.th, e.d, e.fil); requestAnimationFrame(image);
    };
    P.rechange(gr, "B"); masselottes(); noter(); L.missions.noter("lachers_torsion", []); image();
    return { pense_bete };
  };
})(window.Labo);
