/*
Rôle : paillasses de l'activité « onde progressive sinusoïdale » : (1) corde reliée à un vibreur et à un GBF, observée en
       lumière ordinaire puis au stroboscope, règle et curseurs (corde_vibreur.js) ; (2) haut-parleur alimenté par un GBF,
       deux microphones sur une règle de 1 m et oscilloscope à deux voies (banc_haut_parleur.js, oscilloscope_memoire.js).
Reçoit : le groupe SVG de chaque paillasse.
Produit : Labo.poste_corde_vibreur, Labo.poste_son_periodique (groupe) -> { pense_bete } ; faits « corde_vibreur »,
          « son_periodique », « oscillo_son » (Sv, Sv2, b).
Utilisé par : simulation.js.
*/
(function (L) {
  L.poste_corde_vibreur = function (g) {
    // Corde et appareils d'abord : le pense-bête reste au-dessus du voile de la salle obscure.
    L.corde_vibreur(g, { x0: 170, k: 500, y_axe: 380, sol: 470, fait: "corde_vibreur" });
    return { pense_bete: L.decor.pense_bete(g, 24, 52, 230) };
  };

  L.poste_son_periodique = function (g) {
    // Oscilloscope au fond, haut-parleur, micros et GBF.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230);
    const o = L.oscilloscope_memoire(g, { x: 650, y: 140, Sv: 0.5, Sv2: 0.5, b: 0.1, fait: "oscillo_son", titre: "OSCILLOSCOPE NUMÉRIQUE — DEUX VOIES" });
    L.banc_haut_parleur(g, o, { x0: 300, k: 500, sol: 545, theta: 20, positions: [0.1, 0.3], fait: "son_periodique" });
    return { pense_bete };
  };
})(window.Labo);
