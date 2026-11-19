/*
Rôle : paillasse « oscillations forcées d'un circuit RLC série » : GBF sinusoïdal (excitateur, 50 Hz à 1 kHz par pas de
       5 Hz, résistance de sortie 0,5 Ω : il garde une tension efficace presque constante), boîte de condensateurs (1 à
       10 µF), bobine (r = 10 Ω ; 0,5 H avec son noyau), boîte de résistances, et selon l'activité : oscilloscope bicourbe
       + voltmètre (u et i), ou ampèremètre + voltmètre (courbe de résonance). Le circuit est calculé en régime sinusoïdal
       forcé (circuit_sinus.js).
Reçoit : le groupe SVG et { oscillo (vrai : oscilloscope et voltmètre), R (Ω, valeur de départ), Umax (V, amplitude du GBF) }.
Produit : Labo.poste_rlc_force(g, options) -> { pense_bete, c, gbf, C, bob, R } ; faits « montage_force » = { serie, oscillo,
          amperemetre, voltmetre (« gbf », « C » ou null) }, « oscillo_force » = { N, R, L, C, Um, URm, tau (s, > 0 : i en
          retard sur u) }, « points_force » = [{ N, R, L, C, I (mA), U (V) }], « tensions_c » = [{ N, R, UC (V) }].
Utilisé par : les simulations du chapitre « Oscillations forcées d'un circuit RLC série ».
*/
(function (L) {
  const FREQ = Array.from({ length: 191 }, (_, k) => 50 + 5 * k), arrondi = (v, n) => Math.round(v * 10 ** n) / 10 ** n;

  function montage(c, oscillo) {
    // Boucle série (GBF, [ampèremètre], C, bobine, R) ; branchements de l'oscilloscope et du voltmètre.
    const n = (a, b) => c.meme_noeud(a, b), A = !oscillo && n("gbf.sortie", "A.mA") && n("A.COM", "C.1");
    const serie = (A || n("gbf.sortie", "C.1")) && n("C.2", "L.1") && n("L.2", "R.1") && n("R.2", "gbf.masse");
    const v = (a, b) => (n("V.VΩ", a) && n("V.COM", b)) || (n("V.VΩ", b) && n("V.COM", a));
    return { serie, amperemetre: A, oscillo: oscillo && n("oscillo.masse", "gbf.masse") && n("oscillo.Y1", "gbf.sortie") && n("oscillo.Y2", "R.1"),
      voltmetre: v("gbf.sortie", "gbf.masse") ? "gbf" : v("C.1", "C.2") ? "C" : null };
  }

  function phase(o) {
    // Position de l'onde (fraction de période) par la première harmonique de ses échantillons.
    let a = 0, b = 0;
    o.forEach((v, k) => { const t = (2 * Math.PI * k) / o.length; a += v * Math.sin(t); b += v * Math.cos(t); });
    return Math.atan2(b, a) / (2 * Math.PI);
  }

  function noter(c, m, o, r) {
    // Faits des mesures : oscilloscope (amplitudes, retard), ampèremètre et voltmètre (points de la courbe, tension de C).
    const N = r.gbf.f, cle = { N, R: r.R.R, L: r.bob.L, C: r.C.C };
    if (m.serie && m.oscillo && o.v1.onde && o.v2.onde) {
      let d = phase(o.v1.onde) - phase(o.v2.onde); d -= Math.round(d);
      L.missions.noter("oscillo_force", { ...cle, Um: arrondi(Math.max(...o.v1.onde), 3), URm: arrondi(Math.max(...o.v2.onde), 4), tau: arrondi(d / N, 6) });
    }
    const A = r.amp, V = r.volt, ok = (x, t) => x && L.MULTIMETRE_MODES.find((k) => k.nom === x.mode).type === t && !x.depasse;
    if (m.serie && m.amperemetre && ok(A, "AAC") && m.voltmetre === "gbf" && ok(V, "VAC")) r.points.set(`${N}:${cle.R}:${cle.L}:${cle.C}`, { ...cle, I: Number(A.lecture), U: Number(V.lecture) });
    if (m.serie && m.voltmetre === "C" && ok(V, "VAC")) r.uc.set(`${N}:${cle.R}`, { N, R: cle.R, UC: Number(V.lecture) });
    L.missions.noter("points_force", [...r.points.values()]); L.missions.noter("tensions_c", [...r.uc.values()]);
  }

  L.poste_rlc_force = function (g, { oscillo = true, R: R0 = 100, Umax = 3 } = {}) {
    // Matériel ; faits du montage et des mesures à chaque calcul.
    const { pense_bete } = L.decor_circuit(g, 0), c = L.circuit(g);
    const gbf = L.gbf(c, { id: "gbf", x: 40, y: 180, forme: "sinus", f: 150, Umax, frequences: FREQ, r_sortie: 0.5 });
    const C = L.condensateur(c, { id: "C", x: 290, y: 195, C: 1e-6, valeurs: [1e-6, 2.2e-6, 4.7e-6, 1e-5] });
    const bob = L.bobine(c, { id: "L", x: 410, y: 190, L: 0.05, r: 10, noyau: true });
    const R = L.boite_resistances(c, { id: "R", x: 300, y: 300, R: R0, valeurs: [10, 22, 47, 100, 220, 470] });
    const o = oscillo ? L.oscilloscope(c, { id: "oscillo", x: 640, y: 180, Sv: 1, Sv2: 0.5, b: 1, voies: 2 }) : null;
    const amp = oscillo ? null : L.multimetre(c, { id: "A", x: 620, y: 250, mode: "200mA~", etiquette: "A" });
    const volt = L.multimetre(c, { id: "V", x: oscillo ? 470 : 800, y: oscillo ? 300 : 250, mode: "20V~", etiquette: "V" });
    const r = { gbf, C, bob, R, amp, volt, points: new Map(), uc: new Map() };
    let vu = "";
    c.sur_calcul(() => { const m = montage(c, oscillo), k = JSON.stringify(m); if (k !== vu) { vu = k; L.missions.noter("montage_force", m); } noter(c, m, o, r); });
    c.calculer();
    return { pense_bete, c, gbf, C, bob, R };
  };
})(window.Labo);
