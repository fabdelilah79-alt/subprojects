/*
Rôle : paillasse « réponse d'un dipôle RC à un échelon de tension » : générateur de tension réglable (6 V), commutateur K,
       boîte de résistances (1 à 100 kΩ), boîte de condensateurs (47 à 470 µF), interface d'acquisition et ordinateur ;
       horloge du circuit (pas de 0,5 ms). L'élève pose les fils. À chaque acquisition terminée, R, C, E et la position de K
       sont gardés avec le résultat.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_echelon(g) -> { pense_bete } ; faits « montage_rc » = { serie, decharge, mesure } (vrai quand la partie du
          montage est câblée), « taus » = [{ R, C, tau }] (charges ou décharges enregistrées en entier), et ceux des appareils.
Utilisé par : simulation.js.
*/
(function (L) {
  const C_VALEURS = [4.7e-5, 1e-4, 2.2e-4, 4.7e-4];

  function montage(c) {
    // Les trois parties du montage : boucle de charge (G+, K1, K0, R, C, G−), décharge (K2 vers C2), mesure (EA0 sur C1, GND sur C2).
    const n = (a, b) => c.meme_noeud(a, b), R1 = (x) => n("K.0", "R.1") && n("R.2", x), R2 = (x) => n("K.0", "R.2") && n("R.1", x);
    const serie = n("generateur.+", "K.1") && (R1("C.1") || R2("C.1")) && n("C.2", "generateur.−");
    return { serie, decharge: n("K.2", "C.2"), mesure: n("interface.EA0", "C.1") && n("interface.GND", "C.2") };
  }

  function complete(d) {
    // Charge (ou décharge) enregistrée en entier : départ de 0 (ou de E), arrivée à moins de 3 % de E (ou de 0).
    return d.u_fin > d.u_debut ? d.u_debut < 0.03 * d.E && d.u_fin > 0.97 * d.E : d.u_debut > 0.97 * d.E && d.u_fin < 0.03 * d.E;
  }

  L.poste_echelon = function (g) {
    // Matériel, horloge, interface ; faits du montage et des constantes de temps mesurées.
    const { pense_bete } = L.decor_circuit(g, 0), c = L.circuit(g);
    L.horloge_circuit(c, { pas: 5e-4 });
    const gen = L.generateur(c, { id: "generateur", x: 40, y: 190, E: 6, r: 0.5, I_max: 1, reglable: true, nom: "G" });
    const K = L.commutateur(c, { id: "K", x: 280, y: 200, position: 2 });
    const R = L.boite_resistances(c, { id: "R", x: 270, y: 300, R: 10000 });
    const C = L.condensateur(c, { id: "C", x: 430, y: 300, C: 1e-4, valeurs: C_VALEURS });
    const taus = [];
    L.interface_acquisition(c, { id: "interface", x: 270, y: 440, ecran: { x: 560, y: 150 }, etiquette: () => ({ R: R.R, C: C.C, E: gen.E, K: K.position }),
      sur_fin: (d) => { if (d.tau && complete(d)) { taus.push({ R: d.R, C: d.C, tau: d.tau }); L.missions.noter("taus", taus.slice()); } } });
    let vu = "";
    c.sur_calcul(() => { const m = montage(c), k = JSON.stringify(m); if (k !== vu) { vu = k; L.missions.noter("montage_rc", m); } });
    c.calculer();
    return { pense_bete };
  };
})(window.Labo);
