/*
Rôle : paillasse « chauffage à reflux » de la synthèse du savon : lunettes et gants à mettre, béchers d'huile, de soude
       (on ne peut pas la prendre sans gants ni lunettes) et d'éthanol à verser par l'entonnoir, pierre ponce, montage à
       reflux, chronomètre ; après refroidissement, on verse le contenu du ballon dans le bécher d'eau salée (relargage).
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_reflux_savon(groupe) -> { pense_bete } ; fait « reflux_savon » = { epi, huile, soude, ethanol (mL dans
          le ballon), etat du montage (montage_reflux.js), grains (mL de savon en grains dans l'eau salée) }.
Utilisé par : simulation.js.
*/
(function (L) {
  const SOL = 576, E = 1.6, S = L.SAVON;

  function message(calque, t) {
    // Bulle d'avertissement au-dessus de la paillasse.
    calque.replaceChildren();
    if (!t) return;
    L.svg("rect", { x: 420, y: 236, width: 300, height: 28, rx: 5, fill: "#fff6e0", stroke: "#d08a1a" }, calque);
    L.texte(calque, 570, 250, t, { "font-size": 7.4, "font-weight": 700, fill: "#6b3d00" });
  }

  function reactifs(ctx, epi, dire) {
    // Béchers de 50 mL (20 mL chacun) et leurs fiches posées devant ; la soude exige gants et lunettes.
    const liste = [["huile", 500, { huile: 20 }, "huile", []], ["soude", 570, { soude: 20 }, "soude 30 %", ["SGH05"]], ["ethanol", 640, { ethanol: 20 }, "éthanol", ["SGH02"]]];
    for (const [id, x, contenu, texte, pictos] of liste) {
      const r = L.recipient(ctx, { id, profil: "becher_50", x, y: SOL - 2.2, contenu, etiquette: texte, pictos });
      const autoriser = () => { if (pictos.includes("SGH05") && !epi.protege()) { dire("Mettez vos lunettes et vos gants : la soude est corrosive."); return false; } dire(""); return true; };
      L.manipuler(ctx, r, { sol: SOL - 2.2, autoriser });
    }
    return L.recipient(ctx, { id: "eau_salee", profil: "becher_250", x: 782, y: SOL - 2.2, contenu: { eau_salee: 150 }, etiquette: "eau salée" });
  }

  L.poste_reflux_savon = function (g) {
    // Montage à reflux (82 °C, 30 min) ; le temps du chronomètre fait avancer la saponification et le relargage.
    L.affiche_securite(g, 780, 56);
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230), ctx = L.paillasse_chimie(g), calque = L.svg("g", { "pointer-events": "none" }, g);
    L.ecoulement(ctx, { sol: SOL, e: E });
    const dire = (t) => message(calque, t);
    let m = null;
    const epi = L.equipement(g, { x: 300, y: 70, changer: () => m?.maj() });
    const autoriser_ballon = () => {
      const r = !m ? "" : m.refrigerant === "monte" ? "Ôtez d'abord le réfrigérant." : m.entonnoir === "col" ? "Ôtez d'abord l'entonnoir." : m.chauffe ? "Arrêtez d'abord le chauffage." : (m.ballon.c.T ?? 20) > 45 ? "Laissez refroidir le ballon : il est encore chaud." : "";
      if (r) dire(r); return !r;
    };
    m = L.montage_reflux(ctx, { T_eb: 82, duree: 30, reagir: S.saponifier, dire, autoriser_ballon });
    const bain = reactifs(ctx, epi, dire);
    const noter = () => {
      const tous = (n) => Math.round(m.ballon.c.phases.reduce((s, p) => s + (p.liquides[n] || 0), 0));
      const grains = bain.c.phases.reduce((s, p) => s + (p.liquides.savon_grains || 0), 0);
      const v = { epi: epi.protege(), huile: tous("huile"), soude: tous("soude"), ethanol: tous("ethanol"), ...m.etat(), grains: Math.round(grains) };
      if (JSON.stringify(v) !== noter.avant) { noter.avant = JSON.stringify(v); L.missions.noter("reflux_savon", v); }
    };
    m.sur_maj = noter;
    ctx.ecoulement.sur_pas((dt) => { S.relarguer(bain.c, dt); if (bain.c.phases.length > 1) bain.sig = null; noter(); });
    L.chronometre(g, { x: 560, y: 150 }).tic((dt) => m.tic(dt));
    return { pense_bete };
  };
})(window.Labo);
