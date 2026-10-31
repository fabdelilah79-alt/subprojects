/*
Rôle : simulation de l'activité 2 du chapitre « Oscillations forcées d'un circuit RLC série » (2e année du bac) : courbes de
       résonance I = f(N) à tension efficace constante pour R = 47 Ω et R = 220 Ω (ampèremètre et voltmètre en alternatif,
       tableur, courbe) ; fréquence de résonance, bande passante à −3 dB, facteur de qualité, influence de R ; surtension aux
       bornes du condensateur ; puissance moyenne (R + r)·I² et facteur de puissance. Objectifs O3, O4.
Reçoit : rien (les vérifications lisent les faits « montage_force », « points_force », « tensions_c », la feuille et la courbe).
Produit : la simulation démarrée.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const nombre = (unite, attendu, tolerance, aide, bravo) => ({ type: "nombre", unite, attendu, tolerance, aide, bravo });
  const relatif = (unite, attendu, t, aide, bravo) => ({ type: "nombre", unite, attendu, tolerance_relative: t, aide, bravo });
  const P = (f) => (f.points_force || []).filter((p) => p.L === 0.5 && p.C === 1e-6), M = (f) => f.montage_force || {};
  const max47 = (f) => P(f).filter((p) => p.R === 47).reduce((m, p) => (p.I > m.I ? p : m), { I: 18.1, U: 1.06, N: 225 });
  const UC = (f) => (f.tensions_c || []).find((t) => t.N === 225 && t.R === 47);

  function tableau({ faits, feuille }) {
    // Au moins huit fréquences : N (Hz) en A, I (mA) pour R = 47 Ω en B, I (mA) pour R = 220 Ω en C (mesures relevées).
    const l = feuille.lignes(["A", "B", "C"]), p = P(faits), vu = (N, R, I) => p.some((q) => q.N === N && q.R === R && Math.abs(q.I - I) <= 0.02 * q.I + 0.1);
    if (l.length < 8) return false;
    for (const [k, x] of l.entries()) if (!vu(x.A, 47, x.B) || !vu(x.A, 220, x.C)) return `Ligne ${k + 2} : en A la fréquence N (Hz), en B et en C l'intensité lue (mA) pour R = 47 Ω et pour R = 220 Ω à cette fréquence.`;
    const N = l.map((x) => x.A);
    return (Math.min(...N) <= 200 && Math.max(...N) >= 250) || "Choisissez des fréquences de part et d'autre de la résonance (au moins de 200 Hz à 250 Hz).";
  }

  const RESONANCE = {
    id: "resonance", paillasse: 0, titre: "Courbes de résonance",
    objectif: "Tracer I = f(N) pour deux résistances ; fréquence de résonance, bande passante, facteur de qualité.",
    entetes: ["N (Hz)", "I (mA), R = 47 Ω", "I (mA), R = 220 Ω", ""],
    donnees: ["C = 1,0 µF ; bobine : r = 10 Ω, L = 0,50 H (noyau)", "Tension efficace du GBF : U ≈ 1,06 V, gardée constante", "Bande passante à −3 dB : fréquences où I ≥ I₀/√2"],
    conclusion: "L'intensité efficace passe par un maximum I₀ = U/(R + r) pour N₀ = 1/(2π√(LC)) ≈ 225 Hz : c'est la résonance d'intensité. La bande passante à −3 dB est l'intervalle de fréquences où I ≥ I₀/√2 ; sa largeur vaut ΔN = (R + r)/(2πL). Le facteur de qualité Q = N₀/ΔN mesure l'acuité de la résonance : une petite résistance donne une résonance aiguë (Q grand), une grande résistance une résonance floue.",
    conclusion_courte: "Résonance à N₀ ; Q = N₀/ΔN.",
    etapes: [
      { consigne: "Câblez : SORTIE du GBF vers la borne mA de l'ampèremètre, COM vers C, C vers la bobine, bobine vers R, R vers la masse du GBF ; voltmètre (V~) aux bornes du GBF.", court: "Câblez le circuit, l'ampèremètre et le voltmètre.", verifier: ({ faits }) => (M(faits).serie && M(faits).amperemetre && M(faits).voltmetre === "gbf") || false },
      { consigne: "Pour au moins huit fréquences entre 150 et 300 Hz, relevez I avec R = 47 Ω puis avec R = 220 Ω. Tableur : en A : N (Hz) ; en B : I (mA) pour 47 Ω ; en C : I (mA) pour 220 Ω.", court: "Tableur : N, I (47 Ω), I (220 Ω).", aide_geste: "Touchez l'afficheur du GBF pour des pas de 50 Hz ; resserrez les mesures près du maximum.", verifier: tableau },
      { consigne: "Tracez B et C en fonction de A (Ordonnée 2 : C).", court: "Courbes I = f(N).", verifier: ({ courbe }) => (courbe.x === "A" && courbe.y === "B" && courbe.y2 === "C" && courbe.n >= 8) || "Abscisse : A ; ordonnée : B ; ordonnée 2 : C." },
      { consigne: "Fréquence de résonance N₀ (Hz) ?", court: "N₀ (Hz) ?", question: nombre("Hz", 225, 5, "Fréquence du maximum des deux courbes.", "Exact : N₀ = 1/(2π√(LC)), elle ne dépend pas de R.") },
      { consigne: "Intensité à la résonance I₀ pour R = 47 Ω (mA) ?", court: "I₀ (mA) ?", question: relatif("mA", (f) => max47(f).I, 0.03, "Maximum de la courbe B.", "Exact.") },
      { consigne: "Largeur de la bande passante à −3 dB pour R = 47 Ω, ΔN (Hz) ?", court: "ΔN (Hz) ?", question: nombre("Hz", 18.6, 4, "Fréquences où I = I₀/√2, de part et d'autre de N₀ ; mesurez près du maximum.", "Exact : ΔN = (R + r)/(2πL).") },
      { consigne: "Facteur de qualité Q = N₀/ΔN pour R = 47 Ω ?", court: "Q ?", question: nombre("", 12.1, 2.5, "Q = N₀ / ΔN.", "Exact : Q = L·ω₀/(R + r).") },
      { consigne: "Quand R augmente…", court: "Répondez dans le carnet.", question: choix(["I₀ diminue, ΔN augmente, Q diminue : la résonance est plus floue", "N₀ augmente", "la résonance devient plus aiguë"], "Comparez les deux courbes.", "Exact : N₀ ne change pas.") },
    ],
  };

  const SURTENSION = {
    id: "surtension", paillasse: 0, titre: "Surtension et puissance",
    objectif: "Mesurer la tension aux bornes du condensateur à la résonance ; puissance moyenne et facteur de puissance.",
    entetes: [],
    donnees: ["À la résonance : UC = Q·U (surtension)", "Puissance moyenne : P = (R + r)·I²", "Facteur de puissance : k = P / (U·I)"],
    conclusion: "À la résonance, la tension efficace aux bornes du condensateur vaut UC = Q·U : elle peut être beaucoup plus grande que la tension du générateur (surtension), ce qui peut détruire un condensateur. La puissance moyenne n'est consommée que par effet Joule dans les résistances : P = (R + r)·I² ; le condensateur et la bobine échangent de l'énergie sans en consommer en moyenne. Le facteur de puissance k = P/(U·I) = (R + r)/Z vaut 1 à la résonance.",
    conclusion_courte: "UC = Q·U ; P = (R + r)·I² ; k = P/(U·I).",
    etapes: [
      { consigne: "N = 225 Hz, R = 47 Ω : branchez le voltmètre (V~) aux bornes du condensateur.", court: "Mesurez UC à la résonance.", verifier: ({ faits }) => !!UC(faits) || false },
      { consigne: "Surtension UC / U (U : tension du GBF relevée à 225 Hz) ?", court: "UC / U ?", question: relatif("", (f) => (UC(f) || { UC: 12.9 }).UC / max47(f).U, 0.05, "UC sur le voltmètre ; U dans vos mesures précédentes.", "Exact : environ Q.") },
      { consigne: "Cette surtension…", court: "Répondez dans le carnet.", question: choix(["peut être dangereuse : UC est bien plus grande que la tension du générateur", "est toujours plus petite que U", "n'existe que hors résonance"], "Comparez UC et U.", "Exact.") },
      { consigne: "Puissance moyenne consommée à la résonance, P = (R + r)·I₀² avec R + r = 57 Ω (mW) ?", court: "P (mW) ?", question: relatif("mW", (f) => 57 * (max47(f).I / 1000) ** 2 * 1000, 0.05, "I₀ en ampères.", "Exact.") },
      { consigne: "Facteur de puissance k = P / (U·I₀) à la résonance ?", court: "k ?", question: nombre("", (f) => (57 * max47(f).I) / 1000 / max47(f).U, 0.03, "P en W, U en V, I₀ en A.", "Exact : presque 1 (la résistance de l'ampèremètre consomme le reste).") },
      { consigne: "La puissance moyenne est consommée…", court: "Répondez dans le carnet.", question: choix(["seulement par effet Joule dans les résistances : P = (R + r)·I²", "par le condensateur", "par la bobine idéale"], "Que font le condensateur et la bobine de l'énergie ?", "Exact : k = (R + r)/Z ≤ 1, égal à 1 à la résonance.") },
    ],
  };

  L.demarrer({ id: "b2_elec4_a2_resonance", titre: "Laboratoire : résonance d'intensité", decor: "aucun", paillasses: [(g) => L.poste_rlc_force(g, { oscillo: false, R: 47, Umax: 1.5 })], missions: [RESONANCE, SURTENSION] });
})(window.Labo);
