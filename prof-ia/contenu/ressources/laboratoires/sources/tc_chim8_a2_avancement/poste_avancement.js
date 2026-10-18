/*
Rôle : paillasse « avancement maximal » (dessinée à 1,2 px/mm) : balance au fond, pot d'hydrogénocarbonate de sodium et
       coupelles ; erlenmeyer de 250 mL ; montage fixe : ampoule de coulée isobare (10,0 mL de vinaigre dilué à 0,50 mol/L,
       robinet à toucher), bouchon à deux trous et tube à dégagement qui plonge dans la cuve à eau sous l'éprouvette à gaz
       (recueil_gaz.js). L'erlenmeyer posé sous le bouchon est relié au montage ; sinon le gaz s'échappe. « Nouvel essai »
       remet tout en place. Chaque essai terminé est enregistré (masse introduite, volume de gaz recueilli).
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_avancement(groupe) -> { pense_bete } ; Labo.ESSAIS_AVANCEMENT (liste partagée des essais) ;
          fait « avancement » = { essais [{ m (g pesés), V (mL de gaz) }], courant { m, m_erlen, V_acide, V_gaz, relie }, pesee, lecture }.
Utilisé par : simulation.js.
*/
(function (L) {
  const SOL = 576, FOND = 470, E = 1.2, XS = 520, XR = 380, XE = 700, VM = 24;
  L.ESSAIS_AVANCEMENT = [];

  function montage(ctx, a) {
    // Support de l'ampoule, tube d'égalisation de pression, bouchon à deux trous et tube à dégagement (fixes).
    L.svg("rect", { x: 560, y: FOND - 8, width: 70, height: 8, rx: 2, fill: "#3a3f44" }, ctx.fond);
    L.tige(ctx.fond, `M595 ${FOND - 8} V180`, 5);
    const p = (x, y) => a.monde({ x, y }), h = a.pr.H, rc = a.pr.r(h - 3) + a.pr.t, pince = p(0, -h + 5);
    L.tige(ctx.fond, `M595 ${pince.y} H${pince.x + (rc + 3) * E}`, 3);
    L.svg("rect", { x: 588, y: pince.y - 7, width: 14, height: 14, rx: 2, fill: "#5d646a" }, ctx.fond);
    L.svg("path", { d: `M${pince.x + (rc + 5) * E} ${pince.y - 7} q-6 7 0 14`, fill: "none", stroke: "#c0392b", "stroke-width": 3 }, ctx.fond);
    // Tube d'égalisation de pression (ampoule isobare) : soudé au col, il descend à l'extérieur de la poire et rejoint la tige sous le robinet.
    const X = 37, haut = -h + 16, bas = -40, d = [p(a.pr.r(-haut) + a.pr.t - 0.3, haut), p(X - 3, haut), p(X, haut + 3), p(X, bas - 3), p(X - 3, bas), p(2.6, bas)].map((q) => `${q.x.toFixed(1)} ${q.y.toFixed(1)}`).join(" L");
    for (const [c, l] of [["rgba(110,140,150,0.95)", 4.4], ["rgba(232,245,250,0.95)", 2.6]]) L.svg("path", { d: `M${d}`, fill: "none", stroke: c, "stroke-width": l, "stroke-linejoin": "round" }, ctx.devant);
    const t = p(0, -h);
    L.svg("path", { d: `M${t.x - 8} ${t.y + 10} L${t.x - 10} ${t.y - 4} H${t.x + 10} L${t.x + 8} ${t.y + 10} Z`, fill: "#3b7cc4", stroke: "#1d3f6b" }, ctx.devant);
    const yb = SOL - 118 * E;
    L.svg("path", { d: `M${XS - 16} ${yb + 14} L${XS - 19} ${yb - 12} H${XS + 19} L${XS + 16} ${yb + 14} Z`, fill: "#7a3b2a", stroke: "#4a2016" }, ctx.devant);
    // Tube à dégagement : sort du bouchon juste au-dessus, plonge dans la cuve et remonte à l'intérieur de l'éprouvette.
    const tube = `M${XS + 8} ${yb + 10} V${yb - 10} Q${XS + 8} ${yb - 18} ${XS + 16} ${yb - 18} H632 Q640 ${yb - 18} 640 ${yb - 10} V558 Q640 568 650 568 H${XE - 14} Q${XE - 5} 568 ${XE - 5} 559 V532`;
    for (const [c, l] of [["rgba(110,140,150,0.9)", 4.6], ["rgba(230,244,250,0.95)", 2.6]]) L.svg("path", { d: tube, fill: "none", stroke: c, "stroke-width": l, "stroke-linejoin": "round" }, ctx.devant);
  }

  function robinet(ctx, a, dire) {
    // Zone du robinet de l'ampoule : un toucher l'ouvre ou le ferme.
    const z = L.svg("circle", { r: 15, fill: "#000", opacity: 0, class: "robinet", role: "button", "aria-label": "Robinet de l'ampoule" }, ctx.haut);
    const q = a.monde({ x: 14, y: -a.pr.extras.robinet }); z.setAttribute("cx", q.x); z.setAttribute("cy", q.y);
    L.glissable(z, { soulever: false, debut: () => ({ x: 0, y: 0 }), toucher: () => { a.robinet.ouvert = !a.robinet.ouvert; dire(a.robinet.ouvert ? "Robinet ouvert." : "Robinet fermé."); } });
  }

  L.poste_avancement = function (g) {
    // Matériel ; à chaque pas, la réaction dans l'erlenmeyer et le gaz recueilli ; enregistrement des essais.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230), ctx = L.paillasse_chimie(g), calque = L.svg("g", { "pointer-events": "none" }, g);
    const dire = (t) => { calque.replaceChildren(); if (t) { L.svg("rect", { x: 400, y: 120, width: 330, height: 24, rx: 5, fill: "#fff6e0", stroke: "#d08a1a" }, calque); L.texte(calque, 565, 132, t, { "font-size": 7.4, "font-weight": 700, fill: "#6b3d00" }); } };
    L.ecoulement(ctx, { sol: SOL, e: E });
    const b = L.balance_electronique(ctx, { x: 260, sol: FOND, e: E });
    const P = L.pesee_poudre(ctx, b, { pots: [{ id: "bic", nom: "Hydrogéno-\ncarbonate\nde sodium", x: 425, rgb: [250, 250, 248], solide: "hydrogenocarbonate" }], coupelles: [235, 285], sol: SOL, sol_pots: FOND, e: E, dire });
    const gaz = L.recueil_gaz(ctx, { x: XE, sol: SOL, e: E });
    const amp = L.recipient(ctx, { id: "ampoule", profil: "ampoule_125", x: XS, y: SOL - 118 * E + 20, e: E, robinet: true, contenu: { acide_ethanoique: 10 }, etiquette: "vinaigre" });
    amp.g.setAttribute("pointer-events", "none");
    const erl = L.recipient(ctx, { id: "erlen", profil: "erlenmeyer_250", x: XR, y: SOL, e: E });
    L.EFFERVESCENCE.habiller(erl);
    L.manipuler(ctx, erl, { sol: SOL, supports: [{ x: XS, y: SOL, station: true }] });
    montage(ctx, amp); robinet(ctx, amp, dire);
    const s = { CO2: 0, pesee: 0, enregistre: false, calme: 0, echappe: 0 };
    const nouvel = () => {
      // Nouvel essai : erlenmeyer vidé et rincé, ampoule remplie, éprouvette pleine d'eau, coupelles propres.
      erl.c.phases.splice(0); Object.assign(erl.pose, { x: XR, y: SOL }); erl.place = null; erl.ferme = false; erl.sig = null;
      amp.c.phases.splice(0); amp.c.ajouter("acide_ethanoique", 10); amp.robinet.ouvert = false; amp.sig = null; gaz.vider();
      P.coupelles.forEach((c) => { if (c.sur_balance) b.retirer(c); Object.assign(c, { produit: null, poudre: 0, masse: 1.25, versant: null, sur_balance: false, pos: { ...c.repos } }); c.dessiner(); });
      Object.assign(s, { CO2: 0, pesee: 0, enregistre: false, calme: 0, echappe: 0 }); noter(); dire("Nouvel essai : tout est propre et rempli.");
    };
    L.bouton_texte(g, 140, 250, "Nouvel essai", nouvel);
    const r3 = (v) => Math.round(v * 1000) / 1000;
    const etat = () => {
      // m : masse pesée et versée dans l'erlenmeyer (celle que l'élève note) ; m_erlen : ce qui y est vraiment arrivé.
      const V_acide = Math.round((10 - amp.c.volume()) * 100) / 100, m_erlen = r3(((L.EFFERVESCENCE.bilan(erl.c).bic + s.CO2) * 84) / 1000);
      return { m: m_erlen > 0.005 ? s.pesee : 0, m_erlen, V_acide, V_gaz: Math.round(gaz.V * 10) / 10, relie: !!erl.place?.station };
    };
    ctx.ecoulement.sur_pas((dt) => {
      erl.ferme = !!erl.place?.station;
      const dn = L.EFFERVESCENCE.evoluer(erl, dt);
      s.CO2 += dn;
      if (dn && erl.ferme) gaz.ajouter(dn * VM); else if (dn) { s.echappe += dn; if (s.echappe > 0.05) dire("Le gaz s'échappe : l'erlenmeyer n'est pas relié au montage."); }
      const c = etat();
      const n = L.EFFERVESCENCE.bilan(erl.c);
      s.calme = c.V_acide > 9.9 && Math.min(n.acide, n.bic) < 0.005 ? s.calme + dt : 0;
      if (!s.enregistre && s.calme > 2 && c.m_erlen > 0.005) { s.enregistre = true; L.ESSAIS_AVANCEMENT.push({ m: c.m, V: c.V_gaz }); dire(`Essai ${L.ESSAIS_AVANCEMENT.length} terminé : lisez le volume de gaz.`); }
    });
    function noter() {
      // Masse pesée (coupelle sur la balance), essais, essai en cours.
      const c = P.coupelles.find((k) => k.produit);
      if (c?.sur_balance) s.pesee = r3(c.poudre);
      L.missions.noter("avancement", { essais: L.ESSAIS_AVANCEMENT.map((x) => ({ ...x })), courant: etat(), pesee: s.pesee, lecture: b.lecture() });
    }
    ctx.sur_changement(noter); b.sur_changement(noter); setInterval(noter, 300); noter();
    return { pense_bete };
  };
})(window.Labo);
