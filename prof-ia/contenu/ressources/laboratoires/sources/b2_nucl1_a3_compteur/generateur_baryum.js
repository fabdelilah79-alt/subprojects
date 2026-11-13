/*
Rôle : générateur d'isotopes césium 137 / baryum 137m posé sur la paillasse (cylindre de plomb, seringue d'éluant) :
       on le touche pour faire passer l'éluant ; il en sort une coupelle d'éluat qui contient du baryum 137m, radioactif γ
       (demi-vie 153 s, soit 2,55 min). L'éluat est ajouté aux échantillons du banc de comptage : son taux d'impulsions
       vaut 80 × 2^(−(t − t0) / 153) par seconde, t0 étant l'instant de l'élution (temps du laboratoire).
Reçoit : le groupe SVG et le banc de comptage (banc_comptage.js).
Produit : Labo.generateur_baryum(g, banc) ; fait « generateur » = { elutions, t0 (s) }.
Utilisé par : simulation.js.
*/
(function (L) {
  const DEMI_VIE = 153, X = 222, Y = 470;

  function dessiner(g) {
    // Cylindre de plomb sur son socle, seringue d'éluant, robinet de sortie, étiquette.
    L.ombre_sol(g, X, Y + 34, 34, 5, 0.45);
    L.svg("rect", { x: X - 22, y: Y - 30, width: 44, height: 62, rx: 6, fill: "#5d646b", stroke: "#222" }, g);
    L.svg("ellipse", { cx: X, cy: Y - 30, rx: 22, ry: 5, fill: "#7a828a", stroke: "#222" }, g);
    L.svg("rect", { x: X - 4, y: Y - 70, width: 8, height: 40, fill: "rgba(225,236,240,0.8)", stroke: "#7d98a2" }, g);
    L.svg("rect", { x: X - 7, y: Y - 76, width: 14, height: 6, rx: 1, fill: "#2f3438" }, g);
    L.svg("path", { d: `M${X + 22} ${Y + 18} h10 v6`, fill: "none", stroke: "#2f3438", "stroke-width": 3 }, g);
    L.texte(g, X, Y + 4, "Cs 137", { "font-size": 6.5, "font-weight": 700, fill: "#f4f1e6" });
    L.texte(g, X, Y + 13, "Ba 137m", { "font-size": 6.5, "font-weight": 700, fill: "#f4f1e6" });
    L.texte(g, X, Y + 46, "générateur (touchez : éluer)", { "font-size": 6.5, "font-weight": 700, fill: "#e8e2d4" });
  }

  L.generateur_baryum = function (g, banc) {
    // Dessin ; au toucher, nouvelle élution : la coupelle d'éluat (créée au premier toucher) repart de son activité maximale.
    const b = L.svg("g", { class: "generateur", role: "button", "aria-label": "Générateur d'isotopes" }, g), e = { elutions: 0, t0: 0 };
    dessiner(b); L.svg("rect", { x: X - 26, y: Y - 80, width: 52, height: 116, fill: "#000", opacity: 0 }, b);
    const def = { nom: "éluat Ba 137m", couleur: "#e3f0f7", taux: (t) => ({ a: 0, b: 0, g: t < e.t0 ? 0 : 80 * 2 ** (-(t - e.t0) / DEMI_VIE) }) };
    const noter = () => L.missions.noter("generateur", { ...e });
    L.glissable(b, { soulever: false, debut: () => ({ x: 0, y: 0 }), toucher: () => { e.t0 = banc.compteur.t; if (!e.elutions) banc.ajouter("ba137", def, { x: 250, y: 536 }); e.elutions++; noter(); } });
    noter();
  };
})(window.Labo);
