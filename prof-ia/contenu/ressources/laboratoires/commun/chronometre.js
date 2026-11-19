/*
Rôle : chronomètre de paillasse et temps accéléré : sur cette paillasse, une seconde réelle représente une minute
       (c'est écrit sur l'appareil). Touches « Marche/Arrêt » et « Zéro » ; l'afficheur donne les minutes et secondes
       du temps simulé. Les transformations lentes de la paillasse avancent avec ce temps, que le chronomètre tourne ou non.
Reçoit : le groupe SVG et { x, y, acceleration (60 par défaut), fait (nom du fait noté : temps du chronomètre en minutes) }.
Produit : Labo.chronometre(g, reglage) -> { minutes, en_marche, tic(f) } ; f(dt_min) est appelée 5 fois par seconde réelle.
Utilisé par : les simulations de chimie (extractions).
*/
(function (L) {
  const DT_S = 0.2;

  L.chronometre = function (g, { x, y, acceleration = 60, fait = "chronometre" }) {
    // Boîtier, afficheur à cristaux liquides, deux touches ; horloge commune de la paillasse.
    const c = { minutes: 0, en_marche: false, abonnes: [] }, e = L.svg("g", { class: "chronometre" }, g);
    L.svg("rect", { x: x + 3, y: y + 4, width: 116, height: 62, rx: 10, fill: "#000", opacity: 0.25, filter: "url(#flou)" }, e);
    L.svg("rect", { x, y, width: 116, height: 62, rx: 10, fill: "#e5462e", stroke: "#9b2a18" }, e);
    L.svg("rect", { x: x + 10, y: y + 8, width: 96, height: 24, rx: 3, fill: "#c9d3b5", stroke: "#6d7660" }, e);
    const ecran = L.texte(e, x + 58, y + 21, "00:00", { "font-size": 16, "font-family": "monospace", "font-weight": 700, fill: "#1d2416" });
    L.texte(e, x + 58, y + 58, "temps accéléré : 1 s = 1 min", { "font-size": 6, fill: "#fff" });
    const afficher = () => { const s = Math.round(c.minutes * 60), m = Math.floor(s / 60); ecran.textContent = `${String(m).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`; };
    const noter = () => L.missions.noter(fait, { minutes: Math.round(c.minutes * 10) / 10, en_marche: c.en_marche });
    L.bouton_rond(e, x + 34, y + 44, "▶∥", () => { c.en_marche = !c.en_marche; noter(); }, 8);
    L.bouton_rond(e, x + 82, y + 44, "0", () => { c.minutes = 0; afficher(); noter(); }, 8);
    c.tic = (f) => c.abonnes.push(f);
    setInterval(() => {
      const dt = (DT_S * acceleration) / 60;
      if (c.en_marche) { c.minutes += dt; afficher(); noter(); }
      c.abonnes.forEach((f) => f(dt));
    }, DT_S * 1000);
    return c;
  };
})(window.Labo);
