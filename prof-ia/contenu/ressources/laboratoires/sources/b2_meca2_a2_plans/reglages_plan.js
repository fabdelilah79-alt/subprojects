/*
Rôle : boîtier de réglage du plan, posé sur la paillasse : angle α (touches − et +, 0° à 30°), choix du solide (chariot ou
       pavé de bois), lanceur à ressort armé ou non ; déclencheur relié au lanceur, bouton « Lancer » (le solide part ; un
       second appui le remet en haut).
Reçoit : le groupe SVG, l'état du poste { alpha, solide, lanceur }, la liste des angles, changer(k) et lancer().
Produit : Labo.reglages_plan(g, etat, angles, changer, lancer).
Utilisé par : poste_plan.js.
*/
(function (L) {
  function touche(g, x, y, l, texte, f) {
    // Touche grise du boîtier.
    const b = L.svg("g", { role: "button", "aria-label": texte }, g);
    L.svg("rect", { x, y, width: l, height: 18, rx: 3, fill: "#e4e8ec", stroke: "#8a96a0" }, b);
    L.texte(b, x + l / 2, y + 12.5, texte, { "font-size": 8, "font-weight": 700, fill: "#23315a" });
    L.glissable(b, { soulever: false, debut: () => ({ x: 0, y: 0 }), toucher: f });
  }

  L.reglages_plan = function (g, etat, angles, changer, lancer) {
    // Boîtier, afficheurs, touches, bouton de lancement.
    L.ombre_sol(g, 630, 585, 74, 5, 0.35);
    L.svg("rect", { x: 560, y: 503, width: 140, height: 81, rx: 5, fill: "url(#facade)", stroke: "#4a5254" }, g);
    L.texte(g, 630, 514, "RÉGLAGES DU PLAN", { "font-size": 7.5, "font-weight": 700, fill: "#23315a" });
    let montrer = () => {};
    const pas = (s) => { const i = angles.indexOf(etat.alpha) + s; changer({ alpha: angles[Math.max(0, Math.min(angles.length - 1, i))] }); montrer(); };
    touche(g, 566, 519, 18, "−", () => pas(-1)); touche(g, 676, 519, 18, "+", () => pas(1));
    touche(g, 566, 541, 128, "", () => { changer({ solide: etat.solide === "pave" ? "chariot" : "pave" }); montrer(); });
    touche(g, 566, 563, 128, "", () => { changer({ lanceur: !etat.lanceur }); montrer(); });
    const aff = L.svg("g", { "pointer-events": "none" }, g);
    montrer = () => {
      aff.replaceChildren();
      [[`α = ${etat.alpha}°`, 528], [etat.solide === "pave" ? "pavé de bois" : "chariot", 550], [etat.lanceur ? "lanceur armé" : "sans vitesse", 572]].forEach(([t, y]) => {
        L.svg("rect", { x: 588, y: y - 10, width: 84, height: 15, rx: 2, fill: "#10201a" }, aff);
        L.texte(aff, 630, y + 1, t, { "font-size": 7.5, "font-weight": 700, fill: "#7dff9a", "font-family": "monospace" });
      });
    };
    L.ombre_sol(g, 81, 446, 66, 5, 0.35);
    L.svg("rect", { x: 16, y: 376, width: 130, height: 68, rx: 4, fill: "url(#facade)", stroke: "#4a5254" }, g);
    L.texte(g, 81, 388, "DÉCLENCHEUR DU LANCEUR", { "font-size": 6.5, "font-weight": 700, fill: "#23315a" });
    L.bouton_poussoir(g, 81, 418, { textes: ["Lancer", "Remettre"], sur_changement: () => lancer() });
    montrer();
  };
})(window.Labo);
