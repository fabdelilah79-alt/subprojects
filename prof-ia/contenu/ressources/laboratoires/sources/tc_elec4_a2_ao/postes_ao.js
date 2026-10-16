/*
Rôle : paillasses de l'amplificateur opérationnel : (1) caractéristique de transfert : alimentation symétrique à brancher,
       générateur réglable G sur e+, pile de 4,5 V sur e−, voltmètres pour ε = V+ − V− et Us ; (2, 3, 4) suiveur, inverseur et
       non-inverseur : AO déjà alimenté, GBF, oscilloscope bicourbe (Y1 : Ue, Y2 : Us) et, pour (3) et (4),
       R1 = 10 kΩ et R2 = 22 kΩ.
Reçoit : le groupe SVG de chaque paillasse.
Produit : Labo.poste_transfert, Labo.poste_suiveur, Labo.poste_inverseur, Labo.poste_non_inverseur (groupe) -> { pense_bete } ;
          faits notés « transfert » = { alimente, monte, points : [{ eps, us }] } et « montage_<type> » = { monte, ue_max, us_max,
          us_min, us_a_ue_max, points : [{ ue, us }] }.
Utilisé par : simulation.js.
*/
(function (L) {
  const r2 = (v) => Math.round(v * 100) / 100, V = (m) => (L.MULTIMETRE_MODES.find((k) => k.nom === m.mode) || {}).type === "V" && !m.depasse;

  function entre(c, r, p, q) {
    // Vrai si la résistance r relie les points p et q (dans un sens ou dans l'autre) sans être court-circuitée.
    if (c.meme_noeud(p, q)) return false;
    return (c.meme_noeud(`${r}.1`, p) && c.meme_noeud(`${r}.2`, q)) || (c.meme_noeud(`${r}.1`, q) && c.meme_noeud(`${r}.2`, p));
  }

  const alimente = (c) => ["+15", "0", "−15"].every((b) => c.meme_noeud(`ao.${b}`, `alim.${b}`));

  L.poste_transfert = function (g) {
    // Paillasse 1 : ε = V+ − V− varie avec G (V− fixé à 4,5 V par la pile) ; chaque couple (ε, Us) lu est enregistré.
    const { pense_bete } = L.decor_circuit(g, 0), c = L.circuit(g), points = {};
    L.generateur(c, { id: "g", x: 40, y: 196, E: 0, reglable: true, nom: "G" });
    L.pile(c, { x: 300, y: 230 });
    L.ao(c, { x: 300, y: 400 });
    L.alimentation_symetrique(c, { x: 560, y: 470 });
    const ve = L.multimetre(c, { id: "ve", x: 640, y: 186, etiquette: "V1" }), vs = L.multimetre(c, { id: "vs", x: 820, y: 186, etiquette: "V2" });
    c.sur_calcul(() => {
      const entrees = c.meme_noeud("g.+", "ao.e+") && c.meme_noeud("pile.+", "ao.e−") && c.meme_noeud("g.−", "ao.0") && c.meme_noeud("pile.−", "ao.0");
      const lu = V(ve) && V(vs) && c.meme_noeud("ve.VΩ", "ao.e+") && c.meme_noeud("ve.COM", "ao.e−") && c.meme_noeud("vs.VΩ", "ao.s") && c.meme_noeud("vs.COM", "ao.0");
      const monte = alimente(c) && entrees && lu;
      if (monte) points[r2(ve.valeur).toFixed(2)] = { eps: r2(ve.valeur), us: r2(vs.valeur) };
      L.missions.noter("transfert", { alimente: alimente(c), monte, points: Object.values(points).sort((a, b) => a.eps - b.eps) });
    });
    c.calculer();
    return { pense_bete };
  };

  const CONTRE_REACTION = {
    // Ce que chaque montage exige en plus du GBF (SORTIE sur Y1), de la masse commune et de Y2 sur la sortie s.
    suiveur: (c) => c.meme_noeud("gbf.sortie", "ao.e+") && c.meme_noeud("ao.s", "ao.e−"),
    inverseur: (c) => c.meme_noeud("ao.e+", "ao.0") && entre(c, "r1", "gbf.sortie", "ao.e−") && entre(c, "r2", "ao.e−", "ao.s"),
    non_inverseur: (c) => c.meme_noeud("gbf.sortie", "ao.e+") && entre(c, "r1", "ao.e−", "ao.0") && entre(c, "r2", "ao.e−", "ao.s"),
  };

  function lecture(o) {
    // Valeurs que l'élève peut lire sur l'écran : extrêmes des deux voies et Us à l'instant où Ue est maximale.
    const u1 = o.v1.onde || [o.v1.u_dc], u2 = o.v2.onde || [o.v2.u_dc], k = u1.indexOf(Math.max(...u1));
    return { ue_max: r2(Math.max(...u1)), us_max: r2(Math.max(...u2)), us_min: r2(Math.min(...u2)), us_a_ue_max: r2(u2[k] ?? u2[0]) };
  }

  function poste_montage(type, numero, resistances) {
    // Paillasse d'un montage à AO : alimentation déjà câblée par le professeur ; l'élève monte le reste.
    return function (g) {
      const { pense_bete } = L.decor_circuit(g, numero), c = L.circuit(g), points = {};
      L.gbf(c, { x: 40, y: 196, forme: "sinus", f: 500, Umax: 2 });
      L.ao(c, { x: 300, y: 400 });
      L.alimentation_symetrique(c, { x: 560, y: 470 });
      if (resistances) [["r1", 300, 10000, 10040, "R1"], ["r2", 450, 22000, 21900, "R2"]].forEach(([id, x, R, R_reelle, nom]) => L.resistance(c, { id, x, y: 230, R, R_reelle, nom }));
      const o = L.oscilloscope(c, { id: `oscillo_${type}`, x: 650, y: 180, Sv: 2, Sv2: 2, b: 0.5, voies: 2 });
      for (const [b, couleur] of [["+15", "#d32f2f"], ["0", "#25282b"], ["−15", "#2f6fd0"]]) c.fils.push({ a: `alim.${b}`, b: `ao.${b}`, couleur, i: 0 });
      c.sur_calcul(() => {
        const masses = ["gbf.masse", `${o.id}.masse`, "alim.0"].every((p) => c.meme_noeud(p, "ao.0"));
        const sondes = c.meme_noeud(`${o.id}.Y1`, "gbf.sortie") && c.meme_noeud(`${o.id}.Y2`, "ao.s");
        const monte = alimente(c) && masses && sondes && CONTRE_REACTION[type](c), l = lecture(o);
        if (monte && l.ue_max > 0.3 && Math.abs(l.us_a_ue_max) < 13) points[l.ue_max.toFixed(2)] = { ue: l.ue_max, us: l.us_a_ue_max };
        L.missions.noter(`montage_${type}`, { monte, ...l, points: Object.values(points).sort((a, b) => a.ue - b.ue) });
      });
      c.calculer();
      return { pense_bete };
    };
  }

  L.poste_suiveur = poste_montage("suiveur", 1, false);
  L.poste_inverseur = poste_montage("inverseur", 2, true);
  L.poste_non_inverseur = poste_montage("non_inverseur", 3, true);
})(window.Labo);
