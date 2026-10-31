/*
Rôle : simulation de l'activité 1 du chapitre « Oscillations forcées d'un circuit RLC série » (2e année du bac) : u (GBF)
       et i (image uR) à l'oscilloscope bicourbe ; oscillations forcées (excitateur, résonateur) ; amplitudes, impédance
       Z = Um / Im, construction de Fresnel (feuille sur la paillasse) ; valeur efficace au voltmètre ; retard de i sur u
       (ou avance) selon la fréquence, fréquence où u et i passent ensemble par zéro. Objectifs O1, O2, O3.
Reçoit : rien (les vérifications lisent les faits « montage_force », « oscillo_force », « gbf »).
Produit : la simulation démarrée.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const nombre = (unite, attendu, tolerance, aide, bravo) => ({ type: "nombre", unite, attendu, tolerance, aide, bravo });
  const relatif = (unite, attendu, t, aide, bravo) => ({ type: "nombre", unite, attendu, tolerance_relative: t, aide, bravo });
  const O = (f) => f.oscillo_force || {}, M = (f) => f.montage_force || {};
  const Im = (f) => (O(f).URm || 0.5) / (O(f).R || 100), w = (f) => 2 * Math.PI * (O(f).N || 150);
  const reglage150 = (f) => O(f).N === 150 && O(f).R === 100 && O(f).C === 1e-6 && O(f).L === 0.5;

  const FORCEES = {
    id: "forcees", paillasse: 0, titre: "Oscillations forcées : u et i",
    objectif: "Visualiser la tension u du GBF et l'intensité i (image uR) ; reconnaître des oscillations forcées.",
    entetes: [],
    donnees: ["GBF sinusoïdal : l'excitateur ; circuit RLC série : le résonateur", "C = 1,0 µF ; bobine : r = 10 Ω, L = 0,50 H (noyau) ; R = 100 Ω", "Voie 1 : u ; voie 2 : uR = R·i"],
    conclusion: "Le GBF (excitateur) impose sa fréquence N au circuit RLC (résonateur) : l'intensité i est sinusoïdale, de même fréquence que u, quelle que soit la fréquence propre N₀ du circuit. Ce sont des oscillations forcées. Dans des oscillations libres, au contraire, le circuit oscille à sa propre fréquence. L'amplitude de i dépend de N.",
    conclusion_courte: "Oscillations forcées : i à la fréquence du GBF.",
    etapes: [
      { consigne: "Câblez : SORTIE du GBF vers C, C vers la bobine, bobine vers R, R vers la masse du GBF. Oscilloscope : masse sur la masse du GBF, Y1 sur SORTIE (u), Y2 entre la bobine et R (uR).", court: "Câblez le circuit et l'oscilloscope.", verifier: ({ faits }) => (M(faits).serie && M(faits).oscillo) || false },
      { consigne: "N = 150 Hz : observez les deux courbes (réglez les sensibilités et le balayage).", court: "Observez u et i à 150 Hz.", verifier: ({ faits }) => (O(faits).N === 150 && O(faits).URm > 0.05) || false },
      { consigne: "L'intensité i…", court: "Répondez dans le carnet.", question: choix(["est sinusoïdale et a la même fréquence que u : le GBF (excitateur) l'impose au circuit (résonateur)", "oscille à la fréquence propre du circuit", "est constante"], "Comparez les périodes des deux courbes.", "Exact : ce sont des oscillations forcées.") },
      { consigne: "Réglez N = 300 Hz et observez à nouveau.", court: "Observez à 300 Hz.", aide_geste: "Touches − et + de la fréquence ; touchez l'afficheur pour des pas de 50 Hz.", verifier: ({ faits }) => O(faits).N === 300 || false },
      { consigne: "Oscillations libres et oscillations forcées…", court: "Répondez dans le carnet.", question: choix(["libres : le circuit oscille à sa fréquence propre ; forcées : il suit la fréquence de l'excitateur", "elles ont toujours la même fréquence", "les oscillations forcées s'amortissent"], "Rappelez-vous la décharge d'un condensateur dans une bobine.", "Exact.") },
    ],
  };

  const IMPEDANCE = {
    id: "impedance", paillasse: 0, titre: "Impédance et construction de Fresnel",
    objectif: "Mesurer Um et Im, calculer l'impédance Z ; retrouver Um par la construction de Fresnel ; valeur efficace.",
    entetes: [],
    donnees: ["Im = URm / R", "Z = Um / Im (Ω)", "Construction de Fresnel : (R + r)·Im, L·ω·Im et Im/(C·ω), avec ω = 2πN"],
    conclusion: "L'impédance du dipôle RLC est Z = Um / Im = U / I, en ohms. La construction de Fresnel (feuille) additionne les vecteurs (R + r)·Im, L·ω·Im (perpendiculaire, vers le haut) et Im/(C·ω) (vers le bas) : Um² = ((R + r)·Im)² + (L·ω·Im − Im/(C·ω))², d'où Z = √((R + r)² + (L·ω − 1/(C·ω))²). Le voltmètre mesure la valeur efficace U = Um/√2 (de même I = Im/√2).",
    conclusion_courte: "Z = √((R + r)² + (Lω − 1/(Cω))²).",
    etapes: [
      { consigne: "Revenez à N = 150 Hz (R = 100 Ω, C = 1,0 µF, noyau enfoncé).", court: "N = 150 Hz.", verifier: ({ faits }) => reglage150(faits) || false },
      { consigne: "Amplitude Um de la tension u (V) ?", court: "Um (V) ?", question: relatif("V", (f) => O(f).Um, 0.04, "Voie 1 : nombre de divisions × sensibilité.", "Exact.") },
      { consigne: "Amplitude Im de l'intensité (mA) ?", court: "Im (mA) ?", question: relatif("mA", (f) => Im(f) * 1000, 0.05, "Im = URm / R : lisez URm sur la voie 2.", "Exact.") },
      { consigne: "Impédance Z = Um / Im (Ω) ?", court: "Z (Ω) ?", question: relatif("Ω", (f) => O(f).Um / Im(f), 0.06, "Um en V, Im en A.", "Exact : Z s'exprime en ohms.") },
      { consigne: "Fresnel : longueur du vecteur L·ω·Im (V) ?", court: "L·ω·Im (V) ?", question: relatif("V", (f) => 0.5 * w(f) * Im(f), 0.06, "ω = 2π × 150 rad/s ; L = 0,50 H.", "Exact.") },
      { consigne: "Fresnel : longueur du vecteur Im/(C·ω) (V) ?", court: "Im/(C·ω) (V) ?", question: relatif("V", (f) => Im(f) / (1e-6 * w(f)), 0.06, "C = 1,0 × 10⁻⁶ F.", "Exact.") },
      { consigne: "Avec (R + r)·Im, la construction donne Um = √(((R + r)·Im)² + (L·ω·Im − Im/(C·ω))²) (V) ?", court: "Um par Fresnel (V) ?", question: relatif("V", (f) => O(f).Um, 0.06, "Théorème de Pythagore sur la figure de la feuille.", "Exact : on retrouve la mesure.") },
      { consigne: "L'impédance d'un dipôle RLC série s'écrit…", court: "Répondez dans le carnet.", question: choix(["Z = √((R + r)² + (L·ω − 1/(C·ω))²)", "Z = R + r + L·ω + C·ω", "Z = L·ω / (C·ω)"], "Lisez-la sur la construction de Fresnel.", "Exact.") },
      { consigne: "Branchez le voltmètre (V~) aux bornes du GBF : tension efficace U lue (V) ?", court: "U (V) ?", question: relatif("V", (f) => O(f).Um / Math.SQRT2, 0.03, "Voltmètre sur V~ : VΩ sur SORTIE, COM sur la masse.", "Exact : U = Um/√2.") },
    ],
  };

  const RETARD = {
    id: "retard", paillasse: 0, titre: "Retard de i sur u",
    objectif: "Mesurer l'avance ou le retard de i sur u selon N ; trouver la fréquence où u et i passent ensemble par zéro.",
    entetes: [],
    donnees: ["Fréquence propre : N₀ = 1 / (2π√(LC))", "Durée entre deux passages par zéro en montant de u et de i : retard (ou avance)"],
    conclusion: "Pour N < N₀, i est en avance sur u (le condensateur l'emporte) ; pour N > N₀, i est en retard sur u (la bobine l'emporte). Pour N = N₀ = 1/(2π√(LC)) ≈ 225 Hz, u et i passent ensemble par zéro : L·ω = 1/(C·ω), Z = R + r est minimale et Im est maximale. C'est la résonance d'intensité.",
    conclusion_courte: "N < N₀ : i en avance ; N > N₀ : en retard ; N₀ : ensemble.",
    etapes: [
      { consigne: "À N = 150 Hz, i…", court: "Répondez dans le carnet.", question: choix(["est en avance sur u : elle passe par zéro avant u", "est en retard sur u", "passe par zéro en même temps que u"], "Comparez les passages par zéro en montant des deux courbes.", "Exact.") },
      { consigne: "Durée de cette avance (ms) ?", court: "Avance de i (ms) ?", question: relatif("ms", (f) => Math.abs(O(f).tau || 0.00147) * 1000, 0.12, "Nombre de divisions horizontales entre les deux passages par zéro × balayage.", "Exact.") },
      { consigne: "Réglez N = 400 Hz.", court: "N = 400 Hz.", verifier: ({ faits }) => (O(faits).N === 400 && O(faits).tau > 0) || false },
      { consigne: "À N = 400 Hz, i…", court: "Répondez dans le carnet.", question: choix(["est en retard sur u", "est en avance sur u", "passe par zéro en même temps que u"], "Comparez les passages par zéro.", "Exact.") },
      { consigne: "Cherchez la fréquence pour laquelle u et i passent ensemble par zéro.", court: "u et i ensemble.", verifier: ({ faits }) => (Math.abs((O(faits).tau || 1) * (O(faits).N || 0)) < 0.01 && O(faits).L === 0.5 && O(faits).C === 1e-6) || false },
      { consigne: "Cette fréquence N₀ (Hz) ?", court: "N₀ (Hz) ?", question: nombre("Hz", 225, 5, "Lisez l'afficheur du GBF.", "Exact.") },
      { consigne: "Calculez 1 / (2π√(LC)) avec L = 0,50 H et C = 1,0 µF (Hz).", court: "1/(2π√(LC)) (Hz) ?", question: nombre("Hz", 225.1, 1.5, "√(0,50 × 1,0 × 10⁻⁶).", "Exact : c'est la fréquence propre du résonateur.") },
      { consigne: "À N₀…", court: "Répondez dans le carnet.", question: choix(["L·ω = 1/(C·ω) : Z = R + r est minimale, Im est maximale", "Z est maximale", "i est nulle"], "Regardez la construction de Fresnel.", "Exact : c'est la résonance d'intensité.") },
    ],
  };

  function paillasse(g) {
    // Poste du circuit forcé, avec la feuille de la construction de Fresnel.
    const p = L.poste_rlc_force(g, { oscillo: true, R: 100 });
    L.fresnel_feuille(g, p, { x: 40, y: 335 });
    return p;
  }

  L.demarrer({ id: "b2_elec4_a1_forcees", titre: "Laboratoire : oscillations forcées", decor: "aucun", paillasses: [paillasse], missions: [FORCEES, IMPEDANCE, RETARD] });
})(window.Labo);
