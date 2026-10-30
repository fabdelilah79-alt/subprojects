/*
Rôle : paillasse « rôle de l'alimentation d'un AO » : amplificateur non inverseur câblé par le professeur (générateur G
       réglable sur e+, R1 = 10 kΩ entre e− et 0, R2 = 22 kΩ entre s et e− : Us = 3,2·Ue), résistance de charge RL = 1 kΩ entre
       s et 0, ampèremètre A+ sur la ligne +15 V, ampèremètre A− sur la ligne −15 V ; l'élève relie l'alimentation symétrique
       (+15 → A+, A− → −15, 0 → 0) et branche le voltmètre libre. Modèle de l'AO avec l'option « bilan » (courants réels
       dans l'alimentation, courant de repos 1,7 mA).
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_bilan_ao(g) -> { pense_bete } ; fait « bilan_ao » = { alimente, E, us_sans (V, lue sans alimentation),
          ue, us (V), ip, im (mA) (pour ce réglage et cet état de l'alimentation) }.
Utilisé par : simulation.js (paillasse 2).
*/
(function (L) {
  const FILS = [["g.+", "ao.e+", "#d32f2f"], ["g.−", "ao.0", "#25282b"], ["r1.1", "ao.e−", "#3c9a4a"], ["r1.2", "ao.0", "#25282b"],
    ["r2.1", "ao.s", "#e0a800"], ["r2.2", "ao.e−", "#3c9a4a"], ["rl.1", "ao.s", "#e0a800"], ["rl.2", "ao.0", "#25282b"],
    ["Ap.COM", "ao.+15", "#d32f2f"], ["ao.−15", "Am.mA", "#2f6fd0"]];
  const type = (m) => (L.MULTIMETRE_MODES.find((k) => k.nom === m.mode) || {}).type, r3 = (v) => Number(v.toPrecision(4));

  function lectures(c, v, ap, am, m, alimente) {
    // Tension lue au voltmètre (Ue : e+ par rapport à 0 ; Us : s par rapport à 0), intensités des ampèremètres.
    const sur = (p) => c.meme_noeud("V.VΩ", p) && c.meme_noeud("V.COM", "ao.0");
    if (type(v) === "V" && !v.depasse) {
      if (sur("ao.e+")) m.ue = r3(v.valeur);
      if (sur("ao.s")) { m.us = r3(v.valeur); if (!alimente) m.us_sans = m.us; }
    }
    const lu = (a) => (type(a) === "A" && !a.depasse ? r3(Math.abs(a.valeur) * 1000) : null);
    return { ip: lu(ap), im: lu(am) };
  }

  L.poste_bilan_ao = function (g) {
    // Montage câblé, alimentation à relier ; à chaque calcul, les mesures sont enregistrées.
    const { pense_bete } = L.decor_circuit(g, 1), c = L.circuit(g), m = { cle: null, ue: null, us: null, us_sans: null };
    const gen = L.generateur(c, { id: "g", x: 40, y: 196, E: 0, reglable: true, nom: "G" });
    L.resistance(c, { id: "r1", x: 60, y: 420, R: 10000, R_reelle: 10050, nom: "R1" });
    L.resistance(c, { id: "r2", x: 300, y: 250, R: 22000, R_reelle: 21900, nom: "R2" });
    L.resistance(c, { id: "rl", x: 175, y: 330, R: 1000, R_reelle: 998, nom: "RL" });
    L.ao(c, { x: 300, y: 400, bilan: true });
    L.alimentation_symetrique(c, { x: 560, y: 470 });
    const ap = L.multimetre(c, { id: "Ap", x: 590, y: 186, mode: "20mA", etiquette: "A+" }), am = L.multimetre(c, { id: "Am", x: 760, y: 186, mode: "20mA", etiquette: "A−" });
    const v = L.multimetre(c, { id: "V", x: 420, y: 186, etiquette: "V" });
    for (const [a, b, couleur] of FILS) c.fils.push({ a, b, couleur, i: 0 });
    c.sur_calcul(() => {
      const alimente = c.meme_noeud("alim.+15", "Ap.mA") && c.meme_noeud("alim.−15", "Am.COM") && c.meme_noeud("alim.0", "ao.0"), cle = `${alimente}|${gen.E}`;
      if (cle !== m.cle) Object.assign(m, { cle, ue: null, us: null });
      const i = lectures(c, v, ap, am, m, alimente);
      L.missions.noter("bilan_ao", { alimente, E: gen.E, us_sans: m.us_sans, ue: m.ue, us: m.us, ...i });
    });
    c.calculer();
    return { pense_bete };
  };
})(window.Labo);
