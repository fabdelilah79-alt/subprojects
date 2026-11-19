/*
Rôle : boîtier de réglage du lance-projectile, posé sur la paillasse : angle α (− et +), cran du ressort (v0 = 2,5 ; 3,0 ;
       3,5 m/s), projectile (bille d'acier ou balle de bois) ; boîtier de tir : « Tirer » (un second appui recharge).
Reçoit : le groupe SVG, l'état du poste { alpha, v0, projectile }, les listes { angles, vitesses, projectiles }, changer(k),
         tirer().
Produit : Labo.reglages_tir(g, etat, listes, changer, tirer).
Utilisé par : poste_tir.js.
*/
(function (L) {
  function touche(g, x, y, l, texte, f) {
    // Touche grise du boîtier.
    const b = L.svg("g", { role: "button", "aria-label": texte || "Changer" }, g);
    L.svg("rect", { x, y, width: l, height: 18, rx: 3, fill: "#e4e8ec", stroke: "#8a96a0" }, b);
    L.texte(b, x + l / 2, y + 12.5, texte, { "font-size": 8, "font-weight": 700, fill: "#23315a" });
    L.glissable(b, { soulever: false, debut: () => ({ x: 0, y: 0 }), toucher: f });
  }

  L.reglages_tir = function (g, etat, { angles, vitesses, projectiles }, changer, tirer) {
    // Deux boîtiers ; les afficheurs passent au-dessus des touches sans gêner le toucher.
    L.ombre_sol(g, 630, 585, 74, 5, 0.35);
    L.svg("rect", { x: 560, y: 503, width: 140, height: 81, rx: 5, fill: "url(#facade)", stroke: "#4a5254" }, g);
    L.texte(g, 630, 514, "LANCE-PROJECTILE", { "font-size": 7.5, "font-weight": 700, fill: "#23315a" });
    let montrer = () => {};
    const pas = (liste, cle, s) => { const i = liste.indexOf(etat[cle]) + s; changer({ [cle]: liste[Math.max(0, Math.min(liste.length - 1, i))] }); montrer(); };
    touche(g, 566, 519, 18, "−", () => pas(angles, "alpha", -1)); touche(g, 676, 519, 18, "+", () => pas(angles, "alpha", 1));
    touche(g, 566, 541, 18, "−", () => pas(vitesses, "v0", -1)); touche(g, 676, 541, 18, "+", () => pas(vitesses, "v0", 1));
    touche(g, 566, 563, 128, "", () => { changer({ projectile: etat.projectile === "acier" ? "bois" : "acier" }); montrer(); });
    const aff = L.svg("g", { "pointer-events": "none" }, g);
    montrer = () => {
      aff.replaceChildren();
      [[`α = ${etat.alpha}°`, 528], [`v0 = ${etat.v0.toFixed(1).replace(".", ",")} m/s`, 550], [`${projectiles[etat.projectile].nom} ${projectiles[etat.projectile].masse_g} g`, 572]].forEach(([t, y]) => {
        L.svg("rect", { x: 588, y: y - 10, width: 84, height: 15, rx: 2, fill: "#10201a" }, aff);
        L.texte(aff, 630, y + 1, t, { "font-size": 6.5, "font-weight": 700, fill: "#7dff9a", "font-family": "monospace" });
      });
    };
    L.ombre_sol(g, 772, 585, 60, 5, 0.35);
    L.svg("rect", { x: 712, y: 512, width: 120, height: 72, rx: 5, fill: "url(#facade)", stroke: "#4a5254" }, g);
    L.texte(g, 772, 524, "TIR", { "font-size": 7.5, "font-weight": 700, fill: "#23315a" });
    L.bouton_poussoir(g, 772, 554, { textes: ["Tirer", "Recharger"], sur_changement: (oui) => (oui ? tirer() : changer({ recharger: true })) });
    montrer();
  };
})(window.Labo);
