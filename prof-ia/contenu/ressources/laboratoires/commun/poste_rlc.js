/*
Rôle : paillasse « oscillations libres d'un circuit RLC série » : générateur réglable (6 V), commutateur K (position 1 :
       charge du condensateur ; position 2 : décharge dans la bobine et la résistance), boîte de condensateurs (1 à 10 µF),
       bobine de 1 000 spires (r = 10 Ω ; 50 mH, 0,5 H avec son noyau), boîte de résistances (10 Ω à 2,2 kΩ), éventuellement
       le dispositif d'entretien (entretien_rlc.js), interface d'acquisition et ordinateur. Horloge : pas de 10 µs, méthode
       des trapèzes, temps ralenti 40 fois. Chaque acquisition est analysée : passages de uC par 0, pseudo-période, régime.
Reçoit : le groupe SVG et { entretien (vrai : dispositif dans la boucle), energies (vrai : mode Énergies du logiciel) }.
Produit : Labo.poste_rlc(g, options) -> { pense_bete } ; faits « montage_rlc » = { charge, decharge, mesure, intensite },
          « oscillations » = [{ R, L, C, R0, regime (« pseudo-periodique », « periodique », « amplifie », « aperiodique »),
          T (s ou null), U0 (V) }] ; et ceux des appareils.
Utilisé par : les simulations du chapitre « Oscillations libres d'un circuit RLC série ».
*/
(function (L) {
  const C_VALEURS = [1e-6, 2.2e-6, 4.7e-6, 1e-5];

  function montage(c, entretien) {
    // Charge (G+, K1, K0, C, G−), décharge (K2, bobine, R, [dispositif], C2), mesure (GND sur C2, EA0 sur C1), EA1 sur R1.
    const n = (a, b) => c.meme_noeud(a, b), fin = entretien ? n("R.2", "D.1") && n("D.2", "C.2") : n("R.2", "C.2");
    return { charge: n("generateur.+", "K.1") && n("K.0", "C.1") && n("C.2", "generateur.−"), decharge: n("K.2", "L.1") && n("L.2", "R.1") && fin,
      mesure: n("interface.GND", "C.2") && n("interface.EA0", "C.1"), intensite: n("interface.EA1", "R.1") };
  }

  function analyser(pts) {
    // Passages de uC par 0 (interpolés), amplitude des demi-oscillations (première et dernière complètes), période, régime.
    const U0 = pts[0][1], z = [], m = [];
    let ext = 0;
    for (let k = 1; k < pts.length; k++) {
      const [a, b] = [pts[k - 1], pts[k]];
      ext = Math.max(ext, Math.abs(b[1]));
      if (a[1] * b[1] < 0) { z.push(a[0] + (a[1] / (a[1] - b[1])) * (b[0] - a[0])); if (z.length > 1) m.push(ext); ext = 0; }
    }
    if (z.length && ext > 0.01 * Math.abs(U0)) m.push(ext);
    if (!z.length || m.length < 1 || m[0] < 0.01 * Math.abs(U0)) return { regime: "aperiodique", T: null, U0 };
    const T = z.length > 1 ? (2 * (z[z.length - 1] - z[0])) / (z.length - 1) : null;
    const k = m.length > 2 ? m[m.length - 2] / m[0] : 0;
    const regime = k > 1.05 ? "amplifie" : k > 0.95 ? "periodique" : "pseudo-periodique";
    return { regime, T: T && Math.round(T * 1e6) / 1e6, U0 };
  }

  L.poste_rlc = function (g, { entretien = false, energies = false } = {}) {
    // Matériel, horloge, interface ; analyse de chaque acquisition partie de uC chargé ; fait du montage.
    const { pense_bete } = L.decor_circuit(g, 0), c = L.circuit(g);
    L.horloge_circuit(c, { pas: 1e-5, ralenti: 40, trapeze: true });
    L.texte(g, 475, 392, "Temps ralenti 40 fois", { "font-size": 8, "font-weight": 700, fill: "#f4f1e6" });
    L.generateur(c, { id: "generateur", x: 40, y: 190, E: 6, r: 0.5, I_max: 1, reglable: true, nom: "G" });
    const K = L.commutateur(c, { id: "K", x: 250, y: 200, position: 1 });
    const C = L.condensateur(c, { id: "C", x: 400, y: 195, C: 1e-5, valeurs: C_VALEURS });
    const bob = L.bobine(c, { id: "L", x: 250, y: 300, L: 0.05, r: 10, noyau: true });
    const R = L.boite_resistances(c, { id: "R", x: 410, y: 300, R: 10, valeurs: [10, 22, 47, 100, 220, 470, 1000, 2200] });
    const D = entretien ? L.entretien_rlc(c, { id: "D", x: 60, y: 335 }) : null;
    const liste = [], interf = L.interface_acquisition(c, { id: "interface", x: 300, y: 440, ecran: { x: 560, y: 150 }, durees: [0.01, 0.02, 0.05, 0.1, 0.2],
      etiquette: () => ({ R: R.R, L: bob.L, C: C.C, R0: D ? D.R0 : 0, K: K.position }),
      energies: energies ? (p) => { const ee = 0.5 * C.C * p[1] * p[1] * 1e6, i = p[2] / R.R, em = 0.5 * bob.L * i * i * 1e6; return [ee, em, ee + em]; } : null,
      sur_fin: (d) => { const pts = interf.s.courbes[interf.s.courbes.length - 1].pts; if (Math.abs(pts[0][1]) < 1 || pts.length < 50) return; liste.push({ R: d.R, L: d.L, C: d.C, R0: d.R0, ...analyser(pts) }); L.missions.noter("oscillations", liste.slice()); } });
    let vu = "";
    c.sur_calcul(() => { const m = montage(c, entretien), k = JSON.stringify(m); if (k !== vu) { vu = k; L.missions.noter("montage_rlc", m); } });
    c.calculer();
    return { pense_bete };
  };
})(window.Labo);
