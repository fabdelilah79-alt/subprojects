/*
Rôle : paillasse de mesure de conductance : GBF (tension alternative de 500 Hz, amplitude réglable), deux multimètres
       (A et V), cellule de conductance et béchers (cellule_conductance.js). L'élève tire les fils : GBF → ampèremètre (borne
       mA, puis COM) → cellule → GBF ; voltmètre (VΩ, COM) aux bornes de la cellule ; il choisit les calibres
       alternatifs (V~ et A~). Une mesure est notée quand le montage est juste et que les deux appareils affichent une valeur
       en alternatif : U et I lus, G = I/U.
Reçoit : le groupe SVG de la paillasse et le réglage de la cellule (cellule_conductance.js).
Produit : Labo.poste_conductance(g, reglage) -> { pense_bete } ; fait « conductance » = { flacon, L, S, U, I, G, montage
          { serie, derivation, A (mode), V (mode) }, mesures: [{ flacon, L, S, U (V), I (A), G (S) }] } (U et I lus sur les
          afficheurs, G = I/U) ; Labo.etape_montage_conductance : étape de mission « câbler et choisir les calibres ».
Utilisé par : les simulations de conductimétrie.
*/
(function (L) {
  const mode = (m) => L.MULTIMETRE_MODES.find((k) => k.nom === m.mode) || {};
  const lu = (m, type) => (mode(m).type === type && !m.depasse ? Number(m.lecture) / mode(m).facteur : null);

  function montage(c) {
    // Ampèremètre en série avec la cellule sur le GBF, voltmètre en dérivation sur la cellule, sans court-circuit.
    const n = (a, b) => c.meme_noeud(a, b), deux = [["1", "2"], ["2", "1"]], gbf = [["sortie", "masse"], ["masse", "sortie"]];
    const boucle = (p, q) => gbf.some(([x, y]) => deux.some(([r, s]) => n(`gbf.${x}`, `A.${p}`) && n(`A.${q}`, `cellule.${r}`) && n(`cellule.${s}`, `gbf.${y}`)));
    const court = n("gbf.sortie", "gbf.masse") || n("cellule.1", "cellule.2") || n("A.mA", "A.COM") || n("A.10A", "A.COM");
    const serie = (boucle("mA", "COM") || boucle("COM", "mA")) && !court;
    const derivation = deux.some(([r, s]) => n("V.VΩ", `cellule.${r}`) && n("V.COM", `cellule.${s}`)) && !court;
    return { serie, derivation };
  }

  function lire(c, A, V, cel) {
    // État de la cellule, montage, lectures (U en V, I en A) si le montage est juste et les calibres alternatifs.
    const s = cel.etat(), m = montage(c), U = m.derivation ? lu(V, "VAC") : null, I = m.serie ? lu(A, "AAC") : null;
    const ok = s.S > 0 && U > 0 && I !== null;
    return { flacon: s.flacon, L: s.L, S: s.S, U: ok ? U : null, I: ok ? I : null, G: ok ? I / U : null, montage: { ...m, A: A.mode, V: V.mode } };
  }

  L.poste_conductance = function (g, reglage) {
    // Décor, circuit (calques entre les béchers posés et l'objet tenu), appareils, cellule ; mesures notées hors réglage.
    const { pense_bete } = L.decor_circuit(g, 0), ctx = L.paillasse_chimie(g), c = L.circuit(g), mesures = [];
    g.append(ctx.haut);
    L.gbf(c, { x: 30, y: 176, forme: "sinus", f: 500, Umax: 1.5 });
    const A = L.multimetre(c, { id: "A", x: 704, y: 176, etiquette: "A" }), V = L.multimetre(c, { id: "V", x: 862, y: 176, etiquette: "V" });
    const cel = L.cellule_conductance(ctx, c, reglage);
    const noter = () => {
      const l = lire(c, A, V, cel);
      if (l.G !== null && !mesures.some((k) => k.flacon === l.flacon && k.L === l.L && k.S === l.S && k.U === l.U && k.I === l.I)) mesures.push({ flacon: l.flacon, L: l.L, S: l.S, U: l.U, I: l.I, G: l.G });
    };
    c.sur_calcul(() => { if (!cel.glisse()) noter(); });
    cel.sur_lacher(noter);
    setInterval(() => L.missions.noter("conductance", JSON.parse(JSON.stringify({ ...lire(c, A, V, cel), mesures }))), 400);
    c.calculer();
    return { pense_bete };
  };

  L.etape_montage_conductance = {
    consigne: "Câblez : sortie du GBF → borne mA de l'ampèremètre ; COM → une borne de la cellule ; l'autre borne de la cellule → masse du GBF. Voltmètre (VΩ, COM) aux bornes de la cellule. Calibres : 20 mA~ et 2 V~. Posez un bécher de solution sur le plateau et montez-le.",
    court: "Montage et calibres.",
    aide_geste: "Tirez un fil d'une borne à une autre ; touchez un repère du commutateur pour choisir le calibre.",
    verifier: ({ faits }) => {
      // Montage juste, puis calibres alternatifs, puis une lecture.
      const f = faits.conductance || {}, m = f.montage || {};
      if (!m.serie || !m.derivation) return false;
      if (!/~$/.test(m.A) || !/~$/.test(m.V) || !/mA/.test(m.A)) return "Le GBF délivre une tension alternative : choisissez les calibres A~ (borne mA) et V~.";
      return f.G !== null && f.G !== undefined;
    },
  };
})(window.Labo);
