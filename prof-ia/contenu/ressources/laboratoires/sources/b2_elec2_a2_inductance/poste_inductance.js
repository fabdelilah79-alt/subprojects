/*
Rôle : paillasse « inductance d'une bobine avec une tension triangulaire » : GBF piloté par l'horloge (triangle, 50 Hz à
       2 kHz), bobine de 1 000 spires (r = 10 Ω ; L = 50 mH, 0,5 H avec son noyau de fer doux), boîte de résistances (100 Ω
       à 2,2 kΩ), interface d'acquisition et ordinateur. Horloge : pas de 10 µs, temps ralenti 40 fois. L'élève pose les fils ;
       la masse de l'interface se branche entre la bobine et la résistance (EA0 : uL ; EA1 : −uR, à inverser).
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_inductance(g) -> { pense_bete } ; fait « montage_l » = { serie, mesure } ; et ceux des appareils.
Utilisé par : simulation.js.
*/
(function (L) {
  function montage(c) {
    // Boucle GBF – bobine – résistance ; masse de l'interface au point commun, EA0 à l'autre borne de la bobine, EA1 à celle de R.
    const n = (a, b) => c.meme_noeud(a, b), haut = n("gbf.sortie", "L.1"), milieu = n("L.2", "R.1") || n("L.2", "R.2");
    const basR = n("L.2", "R.1") ? "R.2" : "R.1";
    return { serie: haut && milieu && n(basR, "gbf.masse"), mesure: n("interface.GND", "L.2") && n("interface.EA0", "L.1") && n("interface.EA1", basR) };
  }

  L.poste_inductance = function (g) {
    // Matériel, horloge ralentie, interface ; fait du montage noté quand il change.
    const { pense_bete } = L.decor_circuit(g, 0), c = L.circuit(g);
    L.horloge_circuit(c, { pas: 1e-5, ralenti: 40 });
    L.texte(g, 375, 430, "Temps ralenti 40 fois", { "font-size": 8, "font-weight": 700, fill: "#f4f1e6" });
    const gbf = L.gbf_temps(c, { id: "gbf", x: 40, y: 190, forme: "triangle", f: 500, Umax: 4 });
    const bob = L.bobine(c, { id: "L", x: 300, y: 210, L: 0.05, r: 10 });
    const R = L.boite_resistances(c, { id: "R", x: 300, y: 320, R: 470, valeurs: [100, 220, 470, 1000, 2200] });
    L.interface_acquisition(c, { id: "interface", x: 300, y: 440, ecran: { x: 560, y: 150 }, durees: [0.002, 0.005, 0.01, 0.02, 0.05],
      etiquette: () => ({ R: R.R, f: gbf.f, forme: gbf.forme, Umax: gbf.Umax, noyau: bob.noyau, L: bob.L }) });
    let vu = "";
    c.sur_calcul(() => { const m = montage(c), k = JSON.stringify(m); if (k !== vu) { vu = k; L.missions.noter("montage_l", m); } });
    c.calculer();
    return { pense_bete };
  };
})(window.Labo);
