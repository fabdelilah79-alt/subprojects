/*
Rôle : les deux paillasses des tensions continues : (1) générateur (bornes P et N), interrupteur (E, F), lampes L1 (A, B)
       et L2 (C, D) à monter en série, multimètre et sa notice ; (2) le même matériel, lampes à monter en dérivation.
Reçoit : le groupe SVG de chaque paillasse.
Produit : Labo.poste_tension_serie(groupe), Labo.poste_tension_derivation(groupe) -> { pense_bete } ; faits notés :
          « tension » = { nom, valeur, ferme } (mesure en cours), « voltmetre » = { mode, depasse },
          « serie_fermee », « tensions_ferme » et « tensions_ouvert » = { <nom> : valeur } (paillasse 1),
          « derivation_fermee », « tensions_derivation » (paillasse 2).
Utilisé par : simulation.js.
*/
(function (L) {
  const POINTS = { P: "generateur.+", N: "generateur.−", E: "k.1", F: "k.2", A: "l1.1", B: "l1.2", C: "l2.1", D: "l2.2" };

  function notice(g, x, y) {
    // Notice du multimètre posée sur la paillasse : précision de chaque fonction.
    L.svg("rect", { x: x + 3, y: y + 4, width: 230, height: 74, fill: "#000", opacity: 0.25, filter: "url(#flou)" }, g);
    L.svg("rect", { x, y, width: 230, height: 74, fill: "#fbfaf4", stroke: "#c9c5b5", transform: `rotate(-2 ${x} ${y})` }, g);
    const t = L.svg("g", { transform: `rotate(-2 ${x} ${y})` }, g);
    L.texte(t, x + 12, y + 14, "Notice du multimètre — précision", { "text-anchor": "start", "font-size": 9, "font-weight": 700, fill: "#222" });
    ["V⎓ : ±(0,5 % de la lecture + 2 unités du dernier chiffre)", "V~ : ±(1 % de la lecture + 3 unités du dernier chiffre)", "A⎓ : ±(1 % de la lecture + 2 unités du dernier chiffre)"]
      .forEach((ligne, k) => L.texte(t, x + 12, y + 32 + k * 15, ligne, { "text-anchor": "start", "font-size": 8, fill: "#333" }));
  }

  function materiel(g, numero, places) {
    // Générateur, interrupteur, deux lampes et le multimètre, aux places données.
    const { pense_bete } = L.decor_circuit(g, numero), c = L.circuit(g);
    L.generateur(c, { x: 40, y: 196, E: 6, lettres: ["N", "P"] });
    const k = L.interrupteur(c, { id: "k", ...places.k, lettres: ["E", "F"] });
    const l1 = L.lampe(c, { id: "l1", ...places.l1, I_n: 0.1, etiquette: "L1", lettres: ["A", "B"] });
    const l2 = L.lampe(c, { id: "l2", ...places.l2, I_n: 0.3, etiquette: "L2", lettres: ["C", "D"] });
    const m = L.multimetre(c, { x: 820, y: 230 });
    return { pense_bete, c, k, l1, l2, m };
  }

  function suivre(p, etat, enregistrer) {
    // À chaque changement : l'état du montage, la mesure en cours, le voltmètre ; enregistrer(t) range les mesures utiles.
    p.c.sur_calcul(() => {
      etat();
      const t = L.tension_mesuree(p.c, p.m, POINTS);
      L.missions.noter("voltmetre", { mode: p.m.mode, depasse: p.m.depasse });
      L.missions.noter("tension", t ? { ...t, ferme: p.k.ferme } : null);
      if (t) enregistrer(t);
    });
    p.c.calculer();
  }

  L.poste_tension_serie = function (g) {
    // Paillasse 1 : mesures aux bornes du générateur, puis du circuit en série (fermé ou ouvert).
    const p = materiel(g, 0, { k: { x: 300, y: 214 }, l1: { x: 450, y: 214 }, l2: { x: 610, y: 214 } }), ferme = {}, ouvert = {};
    notice(g, 250, 478);
    const serie = () => p.k.ferme && p.l1.i > 0.005 && Math.abs(p.l1.i - p.l2.i) < 5e-4;
    suivre(p, () => L.missions.noter("serie_fermee", serie()), (t) => {
      if (serie()) { ferme[t.nom] = t.valeur; L.missions.noter("tensions_ferme", { ...ferme }); }
      if (!p.k.ferme) { ouvert[t.nom] = t.valeur; L.missions.noter("tensions_ouvert", { ...ouvert }); }
    });
    return { pense_bete: p.pense_bete };
  };

  L.poste_tension_derivation = function (g) {
    // Paillasse 2 : lampes à monter en dérivation aux bornes du générateur.
    const p = materiel(g, 1, { k: { x: 70, y: 420 }, l1: { x: 450, y: 300 }, l2: { x: 620, y: 300 } }), vues = {};
    const derivation = () => p.k.ferme && p.l1.eclat > 0.6 && p.l2.eclat > 0.6;
    suivre(p, () => L.missions.noter("derivation_fermee", derivation()), (t) => {
      if (derivation()) { vues[t.nom] = t.valeur; L.missions.noter("tensions_derivation", { ...vues }); }
    });
    return { pense_bete: p.pense_bete };
  };
})(window.Labo);
