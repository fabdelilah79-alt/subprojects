/*
Rôle : paillasse « réaliser un récepteur radio AM » : trois émetteurs (A : 171 kHz, son 400 Hz ; B : 207 kHz, 600 Hz ;
       C : 252 kHz, 900 Hz, taux de modulation 0,5) captés par l'antenne ; pièces du récepteur (pieces_recepteur.js),
       oscilloscope. D'après les fils posés (montage libre), le poste trouve le circuit d'accord L∥C entre antenne et terre
       (sélectivité Q = 30 autour de f₀ = 1/(2π√(LC))), le détecteur (diode puis R∥C) et l'écouteur (direct ou par le
       condensateur de liaison) ; il calcule les tensions (modulation.js) et reconnaît la station entendue.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_recepteur(g) -> { pense_bete } ; faits « recepteur » = { antenne, accord, diode, detecteur, ecouteur },
          « ecoute » = { CV (pF), f0 (Hz), station (« A », « B », « C » ou null), clarte, entendues [stations nettes] }.
Utilisé par : simulation.js.
*/
(function (L) {
  const ST = [["A", 171000, 400], ["B", 207000, 600], ["C", 252000, 900]], LB = 1e-3, Q = 30, E0 = 2;
  const deux = (c, p, a, b) => (c.meme_noeud(`${p}.1`, a) && c.meme_noeud(`${p}.2`, b)) || (c.meme_noeud(`${p}.2`, a) && c.meme_noeud(`${p}.1`, b));
  const autre = (c, p, a) => (c.meme_noeud(`${p}.1`, a) ? `${p}.2` : c.meme_noeud(`${p}.2`, a) ? `${p}.1` : null);

  function montage(c) {
    // Fonctions trouvées : antenne et terre, circuit d'accord, diode, détecteur R∥C, écouteur.
    const A = "ant.A", T = "terre.T", d = autre(c, "D", A), D = d && !c.meme_noeud(d, T) ? d : null;
    const accord = deux(c, "L", A, T) && deux(c, "CV", A, T), detecteur = !!D && deux(c, "R", D, T) && deux(c, "Cd", D, T);
    const x = D && autre(c, "Cl", D), ecouteur = !!D && (deux(c, "E", D, T) || (!!x && deux(c, "E", x, T)));
    return { antenne: deux(c, "L", A, T) || deux(c, "CV", A, T), accord, diode: !!D, detecteur, ecouteur, D };
  }

  function lisser(u, w) {
    // Moyenne glissante sur w échantillons (la membrane de l'écouteur ne suit pas la porteuse) ; somme courante.
    const s = new Array(u.length);
    let t = 0;
    for (let j = 0; j < w; j++) t += u[j % u.length];
    for (let i = 0; i < u.length; i++) { s[i] = t / w; t += u[(i + w) % u.length] - u[i]; }
    return s;
  }

  function signaux(c, m, p) {
    // Tension de l'antenne (stations filtrées par le circuit d'accord), du détecteur, de l'écouteur ; son entendu.
    const r = L.am.reglage([...ST.map((s) => s[1]), ...ST.map((s) => s[2])]), f0 = 1 / (2 * Math.PI * Math.sqrt(LB * p.cv.C));
    const gain = (f) => (m.accord ? 1 / Math.sqrt(1 + (Q * (f / f0 - f0 / f)) ** 2) : m.antenne ? 0.05 : 0.01);
    const VA = new Array(r.n).fill(0);
    for (const [, f, fs] of ST) { const k = E0 * gain(f); for (let i = 0; i < r.n; i++) { const t = i * r.dt; VA[i] += k * (1 + 0.5 * Math.cos(2 * Math.PI * fs * t)) * Math.cos(2 * Math.PI * f * t); } }
    const VD = m.diode ? L.am.detecteur(VA, r.dt, m.detecteur ? 1e4 * p.cd.C : 1e-7) : new Array(r.n).fill(0);
    const VE = m.ecouteur ? VD : new Array(r.n).fill(0), son = L.am.sans_continu(lisser(VE, Math.round(5e-5 / r.dt)));
    const proche = (fs) => Math.hypot(L.am.ressemblance(son, L.am.sinus(r, fs, 1)), L.am.ressemblance(son, son.map((_, i) => Math.cos(2 * Math.PI * fs * i * r.dt))));
    const notes = ST.map(([nom, , fs]) => [nom, proche(fs), fs]).sort((a, b) => b[1] - a[1]);
    const fort = Math.sqrt(son.reduce((s, v) => s + v * v, 0) / r.n) > 0.05;
    return { r, f0, w: { A: VA, D: VD, E: VE }, station: fort && notes[0][1] > 0.5 ? notes[0][0] : null, clarte: fort ? notes[0][1] : 0, ton: notes[0][2], volume: Math.min(1, fort ? notes[0][1] : 0) };
  }

  function ecouter(s) {
    // Son de l'écouteur pendant 1,5 s (Web Audio du navigateur) : le ton de la station, plus faible s'il est brouillé.
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)(), o = ctx.createOscillator(), g = ctx.createGain();
      o.frequency.value = s.ton; g.gain.value = 0.2 * s.volume; o.connect(g).connect(ctx.destination); o.start(); o.stop(ctx.currentTime + 1.5);
    } catch (e) { /* pas de son possible : l'oscilloscope reste le témoin */ }
  }

  L.poste_recepteur = function (g) {
    // Affiche des émetteurs, pièces, oscilloscope ; calcul quand un fil ou un réglage change.
    const { pense_bete } = L.decor_circuit(g, 0), c = L.circuit(g), p = L.pieces_recepteur(c), entendues = new Set();
    L.svg("rect", { x: 262, y: 56, width: 330, height: 74, rx: 3, fill: "#fbfaf4", stroke: "#c9c4b4" }, g);
    L.texte(g, 427, 72, "Émetteurs reçus au laboratoire (modulation d'amplitude)", { "font-size": 8, "font-weight": 700, fill: "#2a2a28" });
    ST.forEach(([nom, f, fs], k) => L.texte(g, 427, 90 + k * 13, `Station ${nom} : ${f / 1000} kHz — son de ${fs} Hz`, { "font-size": 8, fill: "#2a2a28" }));
    let cle = "", res = null;
    const etat = () => {
      const k = JSON.stringify([p.cv.C, p.cd.C, c.fils.map((f) => f.a + f.b)]);
      if (k !== cle) { cle = k; const m = montage(c); res = { m, ...signaux(c, m, p) }; if (res.station && res.clarte > 0.9) entendues.add(res.station); L.missions.noter("recepteur", { antenne: m.antenne, accord: m.accord, diode: m.diode, detecteur: m.detecteur, ecouteur: m.ecouteur }); L.missions.noter("ecoute", { CV: Math.round(p.cv.C * 1e12), f0: Math.round(res.f0), station: res.station, clarte: Math.round(res.clarte * 1000) / 1000, entendues: [...entendues].sort() }); }
      return res;
    };
    const point = (nom) => { const s = etat(); if (!c.meme_noeud("oscillo.masse", "terre.T")) return null; if (c.meme_noeud(nom, "ant.A")) return s.w.A; if (s.m.D && c.meme_noeud(nom, s.m.D)) return s.w.D; return null; };
    L.oscilloscope(c, { id: "oscillo", x: 650, y: 180, Sv: 1, Sv2: 1, b: 1, voies: 2, balayages: [0.002, 0.005, 0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1, 2], lire: { onde: (nom) => point(`oscillo.${nom}`), f: () => etat().r.f } });
    L.glissable(p.ecouteur.g, { soulever: false, debut: () => ({ x: 0, y: 0 }), toucher: () => ecouter(etat()) });
    c.calculer();
    return { pense_bete };
  };
})(window.Labo);
