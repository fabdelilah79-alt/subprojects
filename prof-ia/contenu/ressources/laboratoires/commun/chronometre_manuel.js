/*
Rôle : chronomètre à main posé sur la paillasse (au centième de seconde) : touche « Marche/Arrêt » et touche « Zéro ».
       C'est l'élève qui déclenche et arrête : sa mesure contient son temps de réaction.
Reçoit : le groupe SVG et { x, y (coin du boîtier), fait (nom du fait noté) }.
Produit : Labo.chronometre_manuel(g, reglage) -> { t (s), en_marche } ; fait « <fait> » = { t (s), en_marche, mesures [t] }.
Utilisé par : les simulations des oscillateurs mécaniques (2e année du bac).
*/
(function (L) {
  L.chronometre_manuel = function (g, { x, y, fait = "chronometre" }) {
    // Boîtier vu un peu d'en haut, afficheur à cristaux liquides, deux touches ; affichage rafraîchi 30 fois par seconde.
    const c = { t: 0, en_marche: false, depart: 0, mesures: [] }, e = L.svg("g", { class: "chronometre-manuel" }, g);
    L.ombre_sol(e, x + 52, y + 66, 54, 6, 0.4);
    L.svg("rect", { x, y, width: 104, height: 62, rx: 12, fill: "#2b5aa8", stroke: "#173a6e" }, e);
    L.svg("rect", { x: x + 10, y: y + 8, width: 84, height: 24, rx: 3, fill: "#c9d3b5", stroke: "#6d7660" }, e);
    const ecran = L.texte(e, x + 52, y + 25, "0,00 s", { "font-size": 14, "font-family": "monospace", "font-weight": 700, fill: "#1d2416" });
    const noter = () => L.missions.noter(fait, { t: Math.round(c.t * 100) / 100, en_marche: c.en_marche, mesures: c.mesures.slice() });
    const afficher = () => { ecran.textContent = `${c.t.toFixed(2).replace(".", ",")} s`; };
    L.bouton_rond(e, x + 30, y + 46, "▶∥", () => {
      c.en_marche = !c.en_marche;
      if (c.en_marche) c.depart = performance.now() / 1000 - c.t; else { c.t = performance.now() / 1000 - c.depart; c.mesures.push(Math.round(c.t * 100) / 100); afficher(); }
      noter();
    }, 9);
    L.bouton_rond(e, x + 74, y + 46, "0", () => { if (!c.en_marche) { c.t = 0; afficher(); noter(); } }, 9);
    setInterval(() => { if (c.en_marche) { c.t = performance.now() / 1000 - c.depart; afficher(); } }, 33);
    noter();
    return c;
  };
})(window.Labo);
