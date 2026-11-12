/*
Rôle : paillasse « propriétés du savon » : quatre tubes bouchés dans un porte-tubes ; 1 : eau distillée + savon ; 2 : eau
       calcaire + savon (les ions Ca²⁺ précipitent le savon : trouble blanc, presque pas de mousse) ; 3 : eau + savon + 1 mL
       d'huile ; 4 : eau + 1 mL d'huile (témoin). Secoué, un tube qui contient du savon dissous mousse ; l'huile se disperse
       en fines gouttelettes : avec le savon, l'émulsion reste trouble ; sans savon, l'huile remonte en quelques secondes.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_proprietes_savon(g) -> { pense_bete } ; fait « proprietes » = { mousse : { 1..4 : hauteur de 0 à 1 },
          emulsion : { 3, 4 : part de l'huile dispersée, 0 à 1 }, secoues : [numéros des tubes secoués] }.
Utilisé par : simulation.js.
*/
(function (L) {
  const SOL = 576, E = 1.6;
  Object.assign(L.LIQUIDES, {
    eau_dure_savon: { nom: "eau calcaire + savon (précipité)", d: 1.0, rgb: [236, 236, 230], alpha: 0.82, classe: "aqueuse" },
    emulsion_savon: { nom: "huile dispersée dans l'eau savonneuse", d: 1.0, rgb: [244, 236, 200], alpha: 0.8, classe: "aqueuse", mousse: true },
    emulsion_seule: { nom: "gouttelettes d'huile dans l'eau", d: 0.98, rgb: [240, 226, 180], alpha: 0.7, classe: "aqueuse" },
  });
  const TUBES = [["eau_savon_obtenu", 5, null, "1"], ["eau_dure_savon", 5, null, "2"], ["eau_savon_obtenu", 5, "huile", "3"], ["eau", 5, "huile", "4"]];
  const somme = (c, n) => c.phases.reduce((s, p) => s + (p.liquides[n] || 0), 0), convertir = L.convertir_liquide;

  function dessiner_mousse(g, tubes) {
    // Mousse blanche au-dessus du liquide de chaque tube posé dans le porte-tubes.
    g.replaceChildren();
    for (const t of tubes) {
      if (!t.mousse || !t.place || t.tenu) continue;
      const bas = t.pose.y - t.pr.hauteur_de(t.c.volume()) * E, haut = bas - t.mousse * 40 * E;
      L.svg("rect", { x: t.pose.x - 11, y: haut, width: 22, height: bas - haut, rx: 4, fill: "#fbfbf8", opacity: 0.92 }, g);
      for (let k = 0; k < 8; k++) L.svg("circle", { cx: t.pose.x - 8 + ((k * 7) % 16), cy: haut + 3 + ((k * 11) % Math.max(4, bas - haut - 4)), r: 2, fill: "none", stroke: "#d6dde0", "stroke-width": 0.6 }, g);
    }
  }

  function evoluer(t, dt) {
    // Secoué : mousse (s'il y a du savon dissous) et huile dispersée ; au repos : la mousse retombe, l'émulsion sans savon se sépare.
    const secoue = t.tenu && t.bouchon && Math.hypot(t.acc.x, t.acc.y) > 2500, savon = somme(t.c, "eau_savon_obtenu") + somme(t.c, "emulsion_savon") > 0;
    if (secoue) t.secoue = true;
    t.mousse = secoue && savon ? Math.min(1, t.mousse + dt * 0.8) : secoue && somme(t.c, "eau_dure_savon") > 0 ? Math.min(0.08, t.mousse + dt * 0.1) : Math.max(0, t.mousse - dt / 120);
    if (secoue && somme(t.c, "huile") > 0) {
      const v = Math.min(somme(t.c, "huile"), 0.6 * dt);
      convertir(t.c, "huile", savon ? "emulsion_savon" : "emulsion_seule", v);
      if (savon) convertir(t.c, "eau_savon_obtenu", "emulsion_savon", 2 * v);
      t.sig = null;
    } else if (!t.tenu && somme(t.c, "emulsion_seule") > 0) { convertir(t.c, "emulsion_seule", "huile", 0.15 * dt); t.sig = null; }
  }

  L.poste_proprietes_savon = function (g) {
    // Porte-tubes, quatre tubes bouchés, légendes ; à chaque pas : mousse, émulsion, fait noté s'il change.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230), ctx = L.paillasse_chimie(g);
    L.ecoulement(ctx, { sol: SOL, e: E });
    const g_mousse = L.svg("g", { "pointer-events": "none" }, ctx.devant), rack = L.porte_tubes(ctx, { x: 480, sol: SOL, e: E, n: 4, pas: 40 });
    const tubes = TUBES.map(([liquide, V, huile, texte], k) => {
      const t = L.recipient(ctx, { id: `t${k + 1}`, profil: "tube", x: rack[k].x, y: rack[k].y, contenu: { [liquide]: V, ...(huile ? { [huile]: 1 } : {}) }, bouchon: true, etiquette: texte });
      Object.assign(t, { place: rack[k], mousse: 0, secoue: false });
      L.manipuler(ctx, t, { sol: SOL, supports: rack, pose_libre: false });
      return t;
    });
    [["1 : eau distillée + savon", 456], ["2 : eau calcaire + savon", 474], ["3 : eau + savon + huile", 492], ["4 : eau + huile (témoin)", 510]].forEach(([t, y]) => L.texte(ctx.fond, 720, y, t, { "font-size": 8, "font-weight": 700, fill: "#e8e2cc", "text-anchor": "start" }));
    let avant = "";
    ctx.ecoulement.sur_pas((dt) => {
      for (const t of tubes) evoluer(t, dt);
      dessiner_mousse(g_mousse, tubes);
      const r1 = (v) => Math.round(Math.min(1, v) * 10) / 10;
      const f = { mousse: Object.fromEntries(tubes.map((t, k) => [k + 1, Math.round(t.mousse * 10) / 10])), emulsion: { 3: r1(somme(tubes[2].c, "emulsion_savon") / 3), 4: r1(somme(tubes[3].c, "emulsion_seule")) }, secoues: tubes.filter((t) => t.secoue).map((t) => Number(t.id.slice(1))) };
      const s = JSON.stringify(f);
      if (s !== avant) { avant = s; L.missions.noter("proprietes", f); }
    });
    return { pense_bete };
  };
})(window.Labo);
