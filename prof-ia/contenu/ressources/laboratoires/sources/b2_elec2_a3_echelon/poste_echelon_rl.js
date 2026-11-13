/*
Rôle : paillasse « réponse d'un dipôle RL à un échelon de tension » : générateur réglable (6 V), commutateur K, bobine de
       1 000 spires (r = 10 Ω ; 50 mH, 0,5 H avec son noyau), boîte de résistances (10 à 220 Ω), interface d'acquisition et
       ordinateur. Horloge : pas de 10 µs, temps ralenti 40 fois. Montage : K1 au +, K0 vers la bobine, bobine puis R vers
       le − ; K2 au − (en position 2, la bobine et R restent en boucle). GND au −, EA0 entre bobine et R (uR = R·i),
       EA1 sur K0 (EA1 − EA0 : tension de la bobine).
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_echelon_rl(g) -> { pense_bete } ; faits « montage_rl » = { serie, boucle, mesure }, « taus_rl » =
          [{ R, L, tau, sens }] (établissements ou ruptures enregistrés en entier, durée ≥ 5τ), et ceux des appareils.
Utilisé par : simulation.js.
*/
(function (L) {
  function montage(c) {
    // Série (G+, K1, K0, bobine, R, G−), boucle de rupture (K2 au −), mesure (GND au −, EA0 entre bobine et R, EA1 sur K0).
    const n = (a, b) => c.meme_noeud(a, b);
    const serie = n("generateur.+", "K.1") && n("K.0", "L.1") && n("L.2", "R.1") && n("R.2", "generateur.−");
    return { serie, boucle: n("K.2", "generateur.−"), mesure: n("interface.GND", "generateur.−") && n("interface.EA0", "R.1") && n("interface.EA1", "K.0") };
  }

  function complete(d) {
    // Établissement (départ de 0) ou rupture (arrivée à 0), enregistré sur au moins 5τ.
    const monte = d.u_fin > d.u_debut, depart = monte ? d.u_debut < 0.03 * d.u_fin : d.u_fin < 0.03 * d.u_debut;
    return !!d.tau && depart && Math.abs(d.u_fin - d.u_debut) > 0.3 && d.duree >= 5 * d.tau;
  }

  L.poste_echelon_rl = function (g) {
    // Matériel, horloge ralentie, interface ; faits du montage et des constantes de temps.
    const { pense_bete } = L.decor_circuit(g, 0), c = L.circuit(g);
    L.horloge_circuit(c, { pas: 1e-5, ralenti: 40 });
    L.texte(g, 375, 430, "Temps ralenti 40 fois", { "font-size": 8, "font-weight": 700, fill: "#f4f1e6" });
    const gen = L.generateur(c, { id: "generateur", x: 40, y: 190, E: 6, r: 0.5, I_max: 1, reglable: true, nom: "G" });
    const K = L.commutateur(c, { id: "K", x: 280, y: 200, position: 2 });
    const bob = L.bobine(c, { id: "L", x: 420, y: 205, L: 0.05, r: 10, noyau: true });
    const R = L.boite_resistances(c, { id: "R", x: 300, y: 320, R: 100, valeurs: [10, 22, 47, 100, 220] });
    const taus = [];
    L.interface_acquisition(c, { id: "interface", x: 300, y: 440, ecran: { x: 560, y: 150 }, durees: [0.005, 0.01, 0.02, 0.05, 0.1],
      etiquette: () => ({ R: R.R, L: bob.L, noyau: bob.noyau, E: gen.E, K: K.position }),
      sur_fin: (d) => { if (complete(d)) { taus.push({ R: d.R, L: d.L, tau: d.tau, sens: d.u_fin > d.u_debut ? "etablissement" : "rupture" }); L.missions.noter("taus_rl", taus.slice()); } } });
    let vu = "";
    c.sur_calcul(() => { const m = montage(c), k = JSON.stringify(m); if (k !== vu) { vu = k; L.missions.noter("montage_rl", m); } });
    c.calculer();
    return { pense_bete };
  };
})(window.Labo);
