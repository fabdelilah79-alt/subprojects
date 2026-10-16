/*
Rôle : paillasses du point de fonctionnement : (1) pile 4,5 V (r = 2 Ω), interrupteur, lampe 6 V – 0,1 A, résistance 47 Ω,
       électrolyseur, ampèremètre et voltmètre ; (2) alimentation réglable, lampe 6 V – 0,1 A, ampèremètre et voltmètre
       (caractéristique de la lampe, pour la méthode graphique).
Reçoit : le groupe SVG de chaque paillasse.
Produit : Labo.poste_pile_charges, Labo.poste_lampe_seule (groupe) -> { pense_bete } ; faits notés « montages » =
          { <dipôles parcourus par le courant de la pile, ex. « lampe », « r », « electrolyseur+r »> : { I (A), U_lampe (V) } },
          « points_lampe » (caracteristique.js).
Utilisé par : simulation.js.
*/
(function (L) {
  const type = (m) => (L.MULTIMETRE_MODES.find((k) => k.nom === m.mode) || {}).type;

  function suivre_montages(c, pile, k, dipoles, ampere, volt) {
    // Range l'intensité lue (et la tension de la lampe) selon les dipôles traversés par le courant de la pile.
    const vus = {};
    c.sur_calcul(() => {
      const I = pile.i;
      if (!k.ferme || I < 1e-3 || type(ampere) !== "A" || ampere.depasse || Math.abs(Math.abs(ampere.valeur) - I) > 0.01 * I + 2e-5) return;
      const cle = dipoles.filter((d) => Math.abs(Math.abs(d.i) - I) < 0.01 * I + 1e-5).map((d) => d.id).sort().join("+");
      if (!cle) return;
      const lampe = dipoles.find((d) => d.id === "lampe"), sur_lampe = [[1, 2], [2, 1]].some(([p, q]) => c.meme_noeud(`${volt.id}.VΩ`, `lampe.${p}`) && c.meme_noeud(`${volt.id}.COM`, `lampe.${q}`));
      vus[cle] = { I: Math.round(Math.abs(ampere.valeur) * 1e5) / 1e5, U_lampe: sur_lampe && type(volt) === "V" ? Math.round(Math.abs(volt.valeur) * 1000) / 1000 : (vus[cle] || {}).U_lampe ?? null };
      L.missions.noter("montages", { ...vus });
    });
  }

  L.poste_pile_charges = function (g) {
    // Paillasse 1 : la pile et plusieurs dipôles à brancher l'un ou l'autre (ou ensemble).
    const { pense_bete } = L.decor_circuit(g, 0), c = L.circuit(g);
    const pile = L.pile(c, { x: 60, y: 230, E: 4.5, r: 2, lettres: ["N", "P"] });
    const k = L.interrupteur(c, { id: "k", x: 250, y: 230 });
    const lampe = L.lampe(c, { id: "lampe", x: 250, y: 400, I_n: 0.1, etiquette: "L" });
    const r = L.resistance(c, { id: "r", x: 420, y: 230, R: 47, R_reelle: 46.8, nom: "R" });
    const e = L.electrolyseur(c, { x: 400, y: 360, E: 1.7, r: 8 });
    const ampere = L.multimetre(c, { id: "A", x: 580, y: 300, etiquette: "A" }), volt = L.multimetre(c, { id: "V", x: 820, y: 230, etiquette: "V" });
    suivre_montages(c, pile, k, [lampe, r, e], ampere, volt);
    c.calculer();
    return { pense_bete };
  };

  L.poste_lampe_seule = function (g) {
    // Paillasse 2 : caractéristique de la même lampe, avec l'alimentation réglable.
    const { pense_bete } = L.decor_circuit(g, 1), c = L.circuit(g);
    L.generateur(c, { x: 40, y: 196, E: 0, lettres: ["N", "P"], reglable: true });
    const lampe = L.lampe(c, { id: "lampe", x: 290, y: 400, I_n: 0.1, etiquette: "L" });
    const ampere = L.multimetre(c, { id: "A", x: 470, y: 300, etiquette: "A" }), volt = L.multimetre(c, { id: "V", x: 820, y: 230, etiquette: "V" });
    L.suivre_caracteristique(c, { ampere, volt, nom: "lampe", dipole: { a: "lampe.1", b: "lampe.2", courant: () => lampe.i } });
    c.calculer();
    return { pense_bete };
  };
})(window.Labo);
