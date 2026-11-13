/*
Rôle : paillasse « modulation et démodulation d'amplitude » : GBF 1 (porteuse, 10 à 200 kHz), GBF 2 (signal modulant,
       100 Hz à 2 kHz), maquette (multiplieur, détecteur d'enveloppe, filtre passe-haut), oscilloscope bicourbe. Les tensions
       sont calculées sur une période commune (modulation.js) d'après les fils posés ; l'oscilloscope les lit.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_modulation(g) -> { pense_bete } ; faits « montage_am » = { X, Y (« porteuse », « signal » ou null),
          masses, detection, filtre, voies { Y1, Y2 } }, « am » = { Fp, Fs, Pm, Sm, U0, m (Sm/U0), m_mesure, Umax, Umin, tau,
          fid_D, fid_O (ressemblance avec le signal modulant) } ; et ceux des appareils.
Utilisé par : simulation.js.
*/
(function (L) {
  const K = 0.1, POINTS = [["gbf1.sortie", "porteuse"], ["gbf2.sortie", "signal"], ["M.S", "S"], ["M.D", "D"], ["M.O", "O"]];
  const arr = (v, n) => Math.round(v * 10 ** n) / 10 ** n;

  function source(c, borne, points) {
    // Nom du point (GBF ou sortie de la maquette) relié à cette borne, ou null.
    const p = points.find(([b]) => c.meme_noeud(borne, b));
    return p ? p[1] : null;
  }

  function calculer(c, gbf, M) {
    // Toutes les tensions : GBF, multiplieur, détecteur, filtre ; puis les faits de la modulation.
    const r = L.am.reglage([gbf[0].f, gbf[1].f]), w = { porteuse: L.am.sinus(r, gbf[0].f, gbf[0].Umax), signal: L.am.sinus(r, gbf[1].f, gbf[1].Umax) }, zero = new Array(r.n).fill(0);
    const masses = ["gbf1.masse", "gbf2.masse"].every((b) => c.meme_noeud(b, "M.masse")), entree = (b, liste) => (masses && w[source(c, b, liste)]) || zero;
    const X = source(c, "M.X", POINTS.slice(0, 2)), Y = source(c, "M.Y", POINTS.slice(0, 2));
    w.S = L.am.produit(K, entree("M.X", POINTS.slice(0, 2)), entree("M.Y", POINTS.slice(0, 2)), M.U0);
    w.D = L.am.detecteur(entree("M.E", POINTS.slice(0, 3)), r.dt, M.tau);
    w.O = L.am.sans_continu(entree("M.F", POINTS.slice(0, 4)));
    const voies = { Y1: c.meme_noeud("oscillo.masse", "M.masse") ? source(c, "oscillo.Y1", POINTS) : null, Y2: c.meme_noeud("oscillo.masse", "M.masse") ? source(c, "oscillo.Y2", POINTS) : null };
    L.missions.noter("montage_am", { X, Y, masses, detection: source(c, "M.E", POINTS.slice(0, 3)) === "S", filtre: source(c, "M.F", POINTS.slice(0, 4)) === "D", voies });
    const fp = X === "porteuse" ? gbf[0] : gbf[1], fs = X === "porteuse" ? gbf[1] : gbf[0], e = L.am.enveloppe(w.S, Math.round((r.n * r.f) / fp.f));
    L.missions.noter("am", { Fp: fp.f, Fs: fs.f, Pm: fp.Umax, Sm: fs.Umax, U0: M.U0, m: M.U0 ? arr(fs.Umax / M.U0, 3) : null, m_mesure: arr((e.max - e.min) / (e.max + e.min || 1), 3), Umax: arr(e.max, 3), Umin: arr(e.min, 3), tau: M.tau, fid_D: arr(L.am.ressemblance(w.D, w.signal), 3), fid_O: arr(L.am.ressemblance(w.O, w.signal), 3) });
    return { r, w, voies };
  }

  L.poste_modulation = function (g) {
    // Matériel ; l'oscilloscope lit les tensions calculées (recalculées quand un réglage ou un fil change).
    const { pense_bete } = L.decor_circuit(g, 0), c = L.circuit(g);
    const g1 = L.gbf(c, { id: "gbf1", x: 40, y: 180, f: 100000, Umax: 10, frequences: [10000, 20000, 50000, 100000, 200000] });
    const g2 = L.gbf(c, { id: "gbf2", x: 40, y: 340, f: 500, Umax: 1, frequences: [100, 200, 500, 1000, 2000] });
    L.texte(g, 150, 330, "GBF 1 : porteuse", { "font-size": 8, "font-weight": 700, fill: "#f4f1e6" });
    L.texte(g, 150, 490, "GBF 2 : signal modulant", { "font-size": 8, "font-weight": 700, fill: "#f4f1e6" });
    const M = L.maquette_am(c, { id: "M", x: 290, y: 210 });
    let cle = "", res = null;
    const etat = () => { const k = JSON.stringify([g1.f, g1.Umax, g2.f, g2.Umax, M.U0, M.C1, c.fils.map((f) => f.a + f.b)]); if (k !== cle) { cle = k; res = calculer(c, [g1, g2], M); } return res; };
    L.oscilloscope(c, { id: "oscillo", x: 650, y: 180, Sv: 1, Sv2: 1, b: 0.5, voies: 2, balayages: [0.002, 0.005, 0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1, 2],
      lire: { onde: (nom) => { const s = etat(); return s.voies[nom] ? s.w[s.voies[nom]] : null; }, f: () => etat().r.f } });
    c.calculer();
    return { pense_bete };
  };
})(window.Labo);
