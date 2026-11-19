/*
Rôle : les deux paillasses du transfert de protons. Paillasse 1 : porte-tubes de six produits de la vie courante (vinaigre,
       jus de citron, eau distillée, eau savonneuse, ammoniaque, déboucheur dilués), flacons de bleu de bromothymol (BBT),
       d'hélianthine et de phénolphtaléine. Paillasse 2 : bécher de vinaigre dilué (20 mL) et bécher d'ammoniaque diluée
       (10 mL), flacons de BBT, de soude et d'acide chlorhydrique à 1 mol/L : chaque goutte réagit (acide_base.js) et
       l'indicateur change de teinte. Lunettes et gants exigés pour la soude, l'acide et le déboucheur.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_indicateurs(g), Labo.poste_transfert(g) -> { pense_bete } ; faits « indicateurs » = { 1…6 : { bbt,
          helianthine, phenol (indicateurs présents), teinte (du BBT : jaune, vert, bleu, ou null) } } et « transfert » =
          { vinaigre, ammoniaque : { bbt, teinte, pH, reactions } }.
Utilisé par : simulation.js.
*/
(function (L) {
  const SOL = 576, E = 1.6;
  const aq = (nom, dissous) => ({ nom, d: 1.0, rgb: [230, 240, 246], alpha: 0.3, classe: "aqueuse", pH: null, dissous });
  Object.assign(L.LIQUIDES, { ab_soude1: aq("soude", { "Na+": 1, "HO-": 1 }), ab_hcl1: aq("acide chlorhydrique", { "H3O+": 1, "Cl-": 1 }) });
  const PRODUITS = [["ab_vinaigre", "1 vinaigre"], ["ab_citron", "2 citron"], ["eau", "3 eau dist."], ["eau_savonneuse", "4 savon"], ["ab_ammoniaque", "5 ammoniaque"], ["ab_deboucheur", "6 déboucheur"]];
  const teinte = (ph) => { if (!(ph.liquides.ab_bbt > 0)) return null; const pH = L.pH_phase(ph) ?? 7; return pH < 6 ? "jaune" : pH <= 7.6 ? "vert" : "bleu"; };
  const phase = (r) => r.c.phases.find((p) => p.classe === "aqueuse") || { liquides: {}, dissous: {}, V: 0 };

  function banc(g, flacons, x_flacons) {
    // Décor, équipement de protection, contexte de chimie, message d'aide, flacons compte-gouttes (protégés si corrosifs).
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230), ctx = L.paillasse_chimie(g), calque = L.svg("g", { "pointer-events": "none" }, g);
    const dire = (t) => { calque.replaceChildren(); if (t) { L.svg("rect", { x: 380, y: 236, width: 320, height: 26, rx: 5, fill: "#fff6e0", stroke: "#d08a1a" }, calque); L.texte(calque, 540, 249, t, { "font-size": 7.4, "font-weight": 700, fill: "#6b3d00" }); } };
    L.ecoulement(ctx, { sol: SOL, e: E });
    const epi = L.equipement(g, { x: 300, y: 70, changer: () => dire("") });
    const proteger = () => { if (epi.protege()) { dire(""); return true; } dire("Mettez lunettes et gants : ce produit est corrosif."); return false; };
    flacons.forEach(([liquide, texte, corrosif], k) => L.flacon_gouttes(ctx, { id: liquide, x: x_flacons + k * 85, sol: SOL, e: E, liquide, texte, autoriser: corrosif ? proteger : () => true }));
    return { pense_bete, ctx, epi, proteger, dire };
  }

  L.poste_indicateurs = function (g) {
    // Six tubes de produits (3 mL) ; indicateurs en gouttes ; « Nouveaux tubes ».
    const b = banc(g, [["ab_bbt", "BBT"], ["ab_helianthine", "Hélianthine"], ["phenolphtaleine", "Phénol-\nphtaléine"]], 640);
    const rack = L.porte_tubes(b.ctx, { x: 360, sol: SOL, e: E, n: 6, pas: 30 });
    const tubes = PRODUITS.map(([sol, texte], k) => { const t = L.recipient(b.ctx, { id: `t${k}`, profil: "tube", x: rack[k].x, y: rack[k].y, contenu: { [sol]: 3 }, etiquette: texte }); t.place = rack[k]; L.manipuler(b.ctx, t, { sol: SOL, supports: rack, pose_libre: false, autoriser: () => k < 5 || b.proteger() }); return t; });
    L.bouton_texte(g, 140, 250, "Nouveaux tubes", () => { tubes.forEach((t, k) => { t.c = L.contenu({ [PRODUITS[k][0]]: 3 }); t.sig = null; }); b.dire("Tubes rincés et remplis de nouveau (3 mL)."); });
    setInterval(() => {
      const f = {};
      tubes.forEach((t, k) => { const ph = phase(t); f[k + 1] = { bbt: ph.liquides.ab_bbt > 0, helianthine: ph.liquides.ab_helianthine > 0, phenol: ph.liquides.phenolphtaleine > 0, teinte: teinte(ph) }; });
      L.missions.noter("indicateurs", f);
    }, 400);
    return { pense_bete: b.pense_bete };
  };

  L.poste_transfert = function (g) {
    // Deux béchers ; chaque goutte de soude ou d'acide réagit aussitôt (réaction totale) ; pH et teinte notés.
    const b = banc(g, [["ab_bbt", "BBT"], ["ab_soude1", "Soude\n1 mol/L", true], ["ab_hcl1", "Acide chlor-\nhydrique 1 mol/L", true]], 640);
    const bechers = [["vinaigre", 290, { ab_vinaigre: 20 }, "vinaigre dilué"], ["ammoniaque", 440, { ab_ammoniaque: 10 }, "ammoniaque diluée"]].map(([id, x, contenu, etiquette]) => {
      const r = L.recipient(b.ctx, { id, profil: "becher_100", x, y: SOL, e: E, contenu, etiquette }); r.g.setAttribute("pointer-events", "none"); return r;
    });
    L.bouton_texte(g, 140, 250, "Béchers neufs", () => { bechers.forEach((r, k) => { r.c = L.contenu(k ? { ab_ammoniaque: 10 } : { ab_vinaigre: 20 }); r.sig = null; }); b.dire("Béchers rincés et remplis de nouveau."); });
    b.ctx.ecoulement.sur_pas(() => bechers.forEach((r) => { if (L.reagir(r.c)) r.sig = null; }));
    setInterval(() => {
      const f = {};
      bechers.forEach((r) => { const ph = phase(r); f[r.id] = { bbt: ph.liquides.ab_bbt > 0, teinte: teinte(ph), pH: Math.round((L.pH_phase(ph) ?? 7) * 10) / 10, reactions: [...(r.c.reactions || [])] }; });
      L.missions.noter("transfert", f);
    }, 400);
    return { pense_bete: b.pense_bete };
  };
})(window.Labo);
