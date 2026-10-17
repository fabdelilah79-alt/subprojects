/*
Rôle : paillasse de synthèse au chauffage à reflux : lunettes et gants à mettre, béchers de réactifs (un réactif
       corrosif ne se prend pas sans gants ni lunettes) à verser par l'entonnoir, flacon compte-gouttes éventuel
       (catalyseur), pierre ponce, montage à reflux, chronomètre, et un bécher récepteur où l'on verse ensuite le
       contenu refroidi du ballon (on y suit une transformation : relargage, lavage...).
Reçoit : { fait, T_eb, duree, reagir(contenu, d), reactifs : [{ id, x, contenu, texte, pictos }], gouttes : { liquide, texte }
         ou null, recepteur : { profil, contenu, etiquette }, evoluer_recepteur(contenu, dt), mesure(recepteur) -> nombre }.
Produit : Labo.poste_synthese(reglage) -> fabrique(groupe) -> { pense_bete } ; fait « <fait> » = { epi, <réactifs> (mL dans
          le ballon), état du montage (montage_reflux.js), recu (mesure du récepteur) }.
Utilisé par : les simulations de synthèse (savon, arôme de banane).
*/
(function (L) {
  const SOL = 576, E = 1.6;

  function message(calque, t) {
    // Bulle d'avertissement au-dessus de la paillasse.
    calque.replaceChildren();
    if (!t) return;
    L.svg("rect", { x: 420, y: 236, width: 300, height: 28, rx: 5, fill: "#fff6e0", stroke: "#d08a1a" }, calque);
    L.texte(calque, 570, 250, t, { "font-size": 7.4, "font-weight": 700, fill: "#6b3d00" });
  }

  function reactifs(ctx, cfg, epi, dire) {
    // Béchers de 50 mL ; un réactif corrosif (SGH05) exige gants et lunettes ; récepteur à droite.
    for (const { id, x, contenu, texte, pictos } of cfg.reactifs) {
      const r = L.recipient(ctx, { id, profil: "becher_50", x, y: SOL - 2.2, contenu, etiquette: texte, pictos });
      const autoriser = () => { if (pictos.includes("SGH05") && !epi.protege()) { dire(`Mettez vos lunettes et vos gants : ${texte} est corrosif.`); return false; } dire(""); return true; };
      L.manipuler(ctx, r, { sol: SOL - 2.2, autoriser });
    }
    if (cfg.gouttes) L.flacon_gouttes(ctx, { id: "catalyseur", x: 690, sol: SOL, e: E, liquide: cfg.gouttes.liquide, texte: cfg.gouttes.texte, autoriser: () => { if (!epi.protege()) { dire("Mettez vos lunettes et vos gants : ce flacon contient un acide corrosif."); return false; } dire(""); return true; } });
    return L.recipient(ctx, { id: "recepteur", profil: cfg.recepteur.profil, x: 782, y: SOL - 2.2, contenu: cfg.recepteur.contenu, etiquette: cfg.recepteur.etiquette });
  }

  L.poste_synthese = (cfg) => function (g) {
    // Montage à reflux ; le temps du chronomètre fait avancer la transformation ; le récepteur évolue à chaque pas.
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
    m = L.montage_reflux(ctx, { T_eb: cfg.T_eb, duree: cfg.duree, reagir: cfg.reagir, dire, autoriser_ballon, ponce_x: cfg.gouttes ? 620 : 700 });
    const px = cfg.gouttes ? 620 : 700;
    ctx.obstacles.push([px - 24, px + 24]); if (cfg.gouttes) ctx.obstacles.push([660, 720]);
    const rec = reactifs(ctx, cfg, epi, dire);
    const noter = () => {
      const tous = (n) => Math.round(m.ballon.c.phases.reduce((s, p) => s + (p.liquides[n] || 0), 0) * 10) / 10;
      const v = { epi: epi.protege(), ...Object.fromEntries(cfg.suivis.map((n) => [n, tous(n)])), ...m.etat(), recu: Math.round(cfg.mesure(rec)) };
      if (JSON.stringify(v) !== noter.avant) { noter.avant = JSON.stringify(v); L.missions.noter(cfg.fait, v); }
    };
    m.sur_maj = noter;
    ctx.ecoulement.sur_pas((dt) => { cfg.evoluer_recepteur(rec.c, dt); if (rec.c.phases.length > 1) rec.sig = null; noter(); });
    L.chronometre(g, { x: 560, y: 150 }).tic((dt) => m.tic(dt));
    return { pense_bete };
  };
})(window.Labo);
