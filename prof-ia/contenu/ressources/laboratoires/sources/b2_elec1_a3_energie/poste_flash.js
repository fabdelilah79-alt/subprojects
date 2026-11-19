/*
Rôle : paillasse « énergie stockée dans un condensateur, modèle de flash » : générateur réglable (0 à 12 V), commutateur K,
       boîte de condensateurs (470 µF à 4,7 mF), lampe 6 V – 0,1 A, interface d'acquisition et ordinateur, deux documents
       (le flash, le défibrillateur). K en position 1 : le condensateur se charge ; en position 2 : il se décharge dans la
       lampe, qui s'allume brièvement. Chaque éclair est mesuré : tension de départ, éclat maximal, durée (éclat > 20 %).
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_flash(g) -> { pense_bete } ; faits « montage_flash » = { charge, eclair, mesure }, « eclairs » =
          [{ C (F), U0 (V), pic, duree (s) }], « docs_flash » (numéros lus), et ceux des appareils.
Utilisé par : simulation.js.
*/
(function (L) {
  const DOCS = [
    { x: 40, y: 330, l: 104, h: 140, taille: 3.6, titre: "Le flash", texte: "Dans un appareil photo, un petit circuit électronique charge un condensateur d'environ 150 µF sous 300 V en quelques secondes. Quand on déclenche, le condensateur se décharge en 1 ms environ dans un tube rempli de xénon : l'énergie stockée est libérée en un temps très court, la puissance est très grande et l'éclair très lumineux. Une pile seule ne pourrait pas fournir une telle puissance." },
    { x: 152, y: 330, l: 104, h: 140, taille: 3.6, titre: "Le défibrillateur", texte: "Un défibrillateur charge un condensateur sous plusieurs milliers de volts. Au moment du choc, le condensateur se décharge en quelques millisecondes à travers le thorax du patient : il délivre une énergie d'environ 200 J, qui peut remettre le cœur en rythme. Les condensateurs servent aussi de réserve d'énergie de secours (mémoires d'ordinateur) et à lisser les tensions." },
  ];

  function montage(c) {
    // Charge (G+, K1, K0, C1 ; C2, G−), décharge dans la lampe (K2, lampe, C2), mesure (EA0 sur C1, GND sur C2).
    const n = (a, b) => c.meme_noeud(a, b);
    const lampe = (n("K.2", "lampe.1") && n("lampe.2", "C.2")) || (n("K.2", "lampe.2") && n("lampe.1", "C.2"));
    return { charge: n("generateur.+", "K.1") && n("K.0", "C.1") && n("C.2", "generateur.−"), eclair: lampe, mesure: n("interface.EA0", "C.1") && n("interface.GND", "C.2") };
  }

  function surveiller(c, h, lampe, C) {
    // Repère chaque éclair : il commence quand l'éclat dépasse 5 %, se termine quand il retombe sous 1 %.
    const eclairs = [];
    let e = null;
    h.sur_pas((t) => {
      if (!e && lampe.eclat > 0.05) e = { C: C.C, U0: Math.round(Math.abs(C.u) * 100) / 100, pic: 0, debut: null, fin: t };
      if (!e) return;
      e.pic = Math.max(e.pic, lampe.eclat);
      if (lampe.eclat > 0.2) { e.debut = e.debut ?? t; e.fin = t; }
      if (lampe.eclat < 0.01) { eclairs.push({ C: e.C, U0: e.U0, pic: Math.round(e.pic * 100) / 100, duree: e.debut === null ? 0 : Math.round((e.fin - e.debut) * 1000) / 1000 }); e = null; L.missions.noter("eclairs", eclairs.slice()); }
    });
  }

  L.poste_flash = function (g) {
    // Matériel, horloge, interface, documents ; faits du montage et des éclairs.
    const { pense_bete } = L.decor_circuit(g, 0), c = L.circuit(g), h = L.horloge_circuit(c, { pas: 2.5e-4 });
    L.generateur(c, { id: "generateur", x: 40, y: 190, E: 6, r: 0.5, I_max: 1, reglable: true, nom: "G" });
    const K = L.commutateur(c, { id: "K", x: 280, y: 200, position: 2 });
    const C = L.condensateur(c, { id: "C", x: 430, y: 210, C: 2.2e-3, valeurs: [4.7e-4, 1e-3, 2.2e-3, 4.7e-3] });
    const lampe = L.lampe(c, { id: "lampe", x: 300, y: 320, U_n: 6, I_n: 0.1 });
    L.interface_acquisition(c, { id: "interface", x: 290, y: 450, ecran: { x: 560, y: 150 }, etiquette: () => ({ C: C.C, K: K.position }) });
    L.documents_mur(g, DOCS, "docs_flash");
    surveiller(c, h, lampe, C);
    let vu = "";
    c.sur_calcul(() => { const m = montage(c), k = JSON.stringify(m); if (k !== vu) { vu = k; L.missions.noter("montage_flash", m); } });
    c.calculer();
    return { pense_bete };
  };
})(window.Labo);
