/*
Rôle : paillasses du suivi temporel par prélèvements : (1) banc de titrage : bécher du mélange réactionnel (50 mL d'iodure de
       potassium à 1,0 mol/L ; « Mélanger » y verse 50 mL de peroxodisulfate de potassium à 0,020 mol/L et démarre l'horloge
       murale), pipette graduée de 10 mL, bécher de 40 mL d'eau glacée (trempe, 0 °C), empois d'amidon, burette de
       thiosulfate de sodium à 0,010 mol/L, agitateur ; la réaction lente S₂O₈²⁻ + 2 I⁻ → 2 SO₄²⁻ + I₂ continue dans le
       mélange (et, très lentement, dans la trempe) ; (2) affiche des résultats des autres groupes (VE à chaque date).
Reçoit : le groupe SVG de chaque paillasse.
Produit : Labo.poste_prelevement, Labo.poste_resultats (groupe) -> { pense_bete } ; fait « suivi » = { t0 (vrai si mélangé), t (s),
          prelevement { t_p (s), V_p (mL) } ou null, amidon, I2 (mmol/L dans la trempe), VE_lu, titrages [{ t_p, V_p, VE }] } ; Labo.RESULTATS_CLASSE =
          [[t (min), VE (mL)]].
Utilisé par : simulation.js.
*/
(function (L) {
  const RESULTATS = [[1, 4.1], [2, 7.4], [4, 11.9], [5, 13.6], [6, 14.9], [8, 16.7], [10, 17.9], [12, 18.7], [15, 19.3], [20, 19.8]];
  L.RESULTATS_CLASSE = RESULTATS;
  const aq = (r) => r.c.phases.find((p) => p.classe === "aqueuse") || { liquides: {}, dissous: {}, V: 0 };

  function pinces_pipette(fond) {
    // Deux pinces fixées par des noix à la tige de la potence : la pipette rangée y est tenue debout.
    for (const y of [440, 300]) {
      L.svg("rect", { x: 404, y: y - 2.5, width: 26, height: 5, fill: "url(#metal)" }, fond); L.noix(fond, 430, y);
      L.svg("path", { d: `M405 ${y - 5} h-9 v10 h9`, fill: "none", stroke: "#5d646a", "stroke-width": 2 }, fond);
    }
  }

  function suivi(p, trempe, melange, afficher) {
    // À chaque pas : réactions lentes, horloge, prélèvement repéré, fin du titrage (bleu-noir disparu, agité, robinet fermé).
    const s = { t0: null, prel: null, VE: null, duree: 0, c: null, titrages: [] }, maintenant = () => performance.now() / 1000;
    p.ctx.ecoulement.sur_pas((dt) => {
      for (const r of [melange, trempe]) if (L.avancer_lent(r.c, dt)) r.sig = null;
      if (trempe.c !== s.c) { s.c = trempe.c; s.c.T = 0; Object.assign(s, { prel: null, VE: null, duree: 0 }); }
      const t = s.t0 === null ? null : maintenant() - s.t0, ph = aq(trempe);
      afficher(t);
      if (t !== null && !s.prel && (ph.dissous["I-"] || 0) > 0) s.prel = { t_p: Math.round(t), V_p: 0 };
      if (s.prel) s.prel.V_p = Math.round(((ph.liquides.cin_ki_1 || 0) + (ph.liquides.cin_peroxodisulfate || 0)) * 100) / 100;
      const b = p.burette.etat(), amidon = (ph.liquides.ox_amidon || 0) > 0, fin = s.prel && amidon && p.agitateur.agite(trempe) && b.robinet === "ferme" && L.concentration(ph, "I2") < 2e-6;
      s.duree = fin ? s.duree + dt : 0;
      if (s.duree >= 1.5 && s.VE === null && b.verse > 0.5) { s.VE = Math.round(b.verse * 100) / 100; s.titrages.push({ ...s.prel, VE: s.VE }); }
      L.missions.noter("suivi", { t0: s.t0 !== null, t: t === null ? null : Math.round(t), prelevement: s.prel, amidon, I2: Math.round(L.concentration(ph, "I2") * 1e6) / 1e3, VE_lu: s.VE, titrages: s.titrages.slice() });
    });
    return s;
  }

  L.poste_prelevement = function (g) {
    // Banc de titrage, mélange réactionnel, pipette graduée, horloge ; « Mélanger » démarre la transformation.
    const p = L.poste_titrage(g, { titrant: "cin_thiosulfate", texte: "Na₂S₂O₃ 0,010 mol/L", becher: { id: "trempe", contenu: { eau_glacee: 40 }, etiquette: "eau glacée" },
      autres: [{ id: "melange", profil: "becher_250", contenu: { cin_ki_1: 50 }, etiquette: "mélange" }], gouttes: [{ liquide: "ox_amidon", texte: "Empois\nd'amidon" }], places: [250, 335, 620, 790] });
    const melange = p.recipients[1], afficher = L.horloge_murale(g, { x: 800, y: 52 });
    pinces_pipette(p.ctx.fond);
    L.pipette_graduee(p.ctx, { support: { x: 400, y: 564 }, e: 1 });
    const s = suivi(p, p.becher, melange, afficher);
    L.bouton_texte(g, 140, 320, "Mélanger (t = 0)", () => {
      if (s.t0 !== null) return;
      melange.c.verser({ liquides: { cin_peroxodisulfate: 50 }, dissous: { "K+": 2, "S2O8--": 1 }, classe: "aqueuse", T: 20 });
      s.t0 = performance.now() / 1000; melange.sig = null;
    });
    return { pense_bete: p.pense_bete };
  };

  L.poste_resultats = function (g) {
    // Affiche des résultats de la classe : volume équivalent pour un prélèvement de 10,0 mL fait à chaque date.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230), x = 330, y = 60;
    L.svg("rect", { x, y, width: 300, height: 52 + RESULTATS.length * 15, rx: 3, fill: "#fdfdf8", stroke: "#c9c4b0", filter: "url(#ombre)" }, g);
    L.texte(g, x + 150, y + 18, "Résultats des autres groupes", { "font-size": 10, "font-weight": 700, fill: "#23315a" });
    L.texte(g, x + 150, y + 32, "prélèvement de 10,0 mL ; thiosulfate 0,010 mol/L", { "font-size": 7.5, fill: "#444" });
    [["t (min)", 90], ["VE (mL)", 210]].forEach(([t, dx]) => L.texte(g, x + dx, y + 48, t, { "font-size": 8.5, "font-weight": 700, fill: "#23315a" }));
    RESULTATS.forEach(([t, VE], k) => {
      L.svg("line", { x1: x + 30, y1: y + 53 + k * 15, x2: x + 270, y2: y + 53 + k * 15, stroke: "#e2ddcc" }, g);
      L.texte(g, x + 90, y + 64 + k * 15, String(t), { "font-size": 9, fill: "#222" }); L.texte(g, x + 210, y + 64 + k * 15, String(VE).replace(".", ","), { "font-size": 9, fill: "#222" });
    });
    return { pense_bete };
  };
})(window.Labo);
