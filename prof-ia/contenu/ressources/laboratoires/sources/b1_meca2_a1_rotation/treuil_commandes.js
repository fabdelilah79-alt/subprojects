/*
Rôle : commandes du treuil électrique : alimentation du moteur (bouton de réglage de 0 à 12 V, bornes où arrivent les
       câbles du moteur) et boîtier de commande à trois boutons : Monter, Arrêter, Descendre.
Reçoit : le groupe SVG de la paillasse et l'état du treuil (U et sens y sont écrits).
Produit : Labo.treuil_commandes(g, etat) -> le bouton de réglage de la tension.
Utilisé par : poste_treuil.js.
*/
(function (L) {
  L.treuil_commandes = function (g, e) {
    // Alimentation à droite, boîtier de commande au centre de la paillasse.
    L.svg("rect", { x: 725, y: 398, width: 150, height: 110, rx: 6, fill: "#2c3e50", stroke: "#111" }, g);
    L.texte(g, 800, 410, "ALIMENTATION MOTEUR", { "font-size": 7.5, "font-weight": 700, fill: "#e8ecef" });
    [[845, "#1b1e21"], [865, "#c0392b"]].forEach(([x, c]) => L.svg("circle", { cx: x, cy: 420, r: 4.5, fill: c, stroke: "#000" }, g));
    const reglage = L.bouton_reglage(g, { x: 800, y: 470, min: 0, max: 12, pas: 0.1, valeur: 0, unite: "V", titre: "tension", sur_changement: (v) => { e.U = v; } });
    L.svg("rect", { x: 630, y: 432, width: 90, height: 112, rx: 6, fill: "#d9dde0", stroke: "#555" }, g);
    L.texte(g, 675, 446, "COMMANDE", { "font-size": 7.5, "font-weight": 700, fill: "#23315a" });
    [["Monter", 1], ["Arrêter", 0], ["Descendre", -1]].forEach(([t, s], i) => L.bouton_texte(g, 675, 468 + i * 28, t, () => { e.sens = s; }));
    return reglage;
  };
})(window.Labo);
