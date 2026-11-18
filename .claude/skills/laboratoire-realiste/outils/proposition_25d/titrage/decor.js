/*
Rôle : prototype « titrage en 2,5D » : décor gai et lumineux : mur turquoise clair, fenêtre ensoleillée (la lumière de la
       scène vient d'elle), affiche colorée du tableau périodique, horloge, étagère de flacons de couleur, carrelage avec
       carreaux de couleur, paillasse vue un peu d'en haut (dessus visible), placards corail, jaune, bleu.
Reçoit : le groupe SVG du décor.
Produit : P.decor(g) ; P.SOL (y du bord arrière du dessus de paillasse), P.AVANT (y du bord avant).
Utilisé par : prototype.html (proposition ; aucun laboratoire n'est modifié).
*/
(function (P) {
  P.SOL = 292; P.AVANT = 548;
  const el = P.el;

  function mur(g) {
    // Mur dégradé, carrelage blanc avec quelques carreaux de couleur, plinthe.
    el("rect", { width: 1024, height: P.SOL, fill: "#bfe8e3" }, g);
    el("rect", { width: 1024, height: 150, fill: "#d9f3ef", opacity: 0.6 }, g);
    const couleurs = ["#ffd166", "#ff8c69", "#4ecdc4", "#9b8cff"];
    for (let x = 0; x < 1024; x += 40) for (let y = 196; y < P.SOL; y += 32) {
      const n = (x * 7 + y * 3) % 17, c = n === 0 ? couleurs[(x / 40) % 4] : "#fbfdfc";
      el("rect", { x: x + 0.5, y: y + 0.5, width: 39, height: 31, fill: c, stroke: "#cfe3df" }, g);
    }
    el("rect", { y: 190, width: 1024, height: 7, fill: "#2a9d8f" }, g);
  }

  function fenetre(g) {
    // Fenêtre à gauche : ciel, soleil, montants (elle donne la direction de la lumière : ombres à droite des objets).
    el("rect", { x: 20, y: 22, width: 170, height: 150, rx: 6, fill: "#ffffff" }, g);
    el("rect", { x: 30, y: 32, width: 150, height: 130, fill: "#8fd3ff" }, g);
    el("rect", { x: 30, y: 112, width: 150, height: 50, fill: "#c8ecff" }, g);
    el("circle", { cx: 70, cy: 70, r: 34, fill: "url(#soleil)" }, g);
    el("path", { d: "M105 32 V162 M30 97 H180", stroke: "#ffffff", "stroke-width": 7 }, g);
  }

  function affiche(g) {
    // Affiche du tableau périodique : familles en couleurs vives, titre.
    el("rect", { x: 744, y: 26, width: 250, height: 146, rx: 4, fill: "#ffffff", stroke: "#e2e8e6" }, g);
    el("text", { x: 869, y: 46, "text-anchor": "middle", "font-family": "system-ui", "font-size": 12, "font-weight": 700, fill: "#264653" }, g).textContent = "Tableau périodique";
    const fam = ["#ff8c69", "#ffd166", "#4ecdc4", "#9b8cff", "#ef476f", "#06d6a0"];
    const plan = ["1........8", "12......78", "12..3456 78".replace(" ", ""), "1234567888"];
    plan.forEach((ligne, j) => [...ligne].forEach((c, i) => {
      if (c === ".") return;
      el("rect", { x: 760 + i * 22, y: 58 + j * 26, width: 19, height: 22, rx: 2, fill: fam[(+c + j) % 6], opacity: 0.85 }, g);
    }));
  }

  function etagere(g) {
    // Étagère de bois avec flacons de couleur (fioles, flacon rond) et une horloge au-dessus.
    el("rect", { x: 420, y: 120, width: 260, height: 9, rx: 2, fill: "#c98d4b" }, g);
    el("rect", { x: 420, y: 129, width: 260, height: 4, fill: "#8a5a2b" }, g);
    [["#ff8c69", 440, 44], ["#4ecdc4", 482, 34], ["#ffd166", 520, 50], ["#9b8cff", 566, 38], ["#ef476f", 606, 46], ["#06d6a0", 646, 30]].forEach(([c, x, h]) => {
      el("rect", { x, y: 120 - h, width: 24, height: h, rx: 5, fill: c, opacity: 0.85 }, g);
      el("rect", { x: x + 7, y: 112 - h, width: 10, height: 9, rx: 2, fill: "#3d4a55" }, g);
      el("rect", { x: x + 4, y: 124 - h, width: 4, height: h - 10, rx: 2, fill: "#fff", opacity: 0.45 }, g);
    });
    el("circle", { cx: 550, cy: 50, r: 26, fill: "#ffffff", stroke: "#264653", "stroke-width": 4 }, g);
    el("path", { d: "M550 50 V33 M550 50 L562 56", stroke: "#264653", "stroke-width": 3, "stroke-linecap": "round" }, g);
  }

  function paillasse(g) {
    // Dessus vu un peu d'en haut (résine sombre), bord avant, placards de couleur avec poignées.
    el("rect", { y: P.SOL, width: 1024, height: P.AVANT - P.SOL, fill: "url(#dessus-paillasse)" }, g);
    el("rect", { y: P.SOL, width: 1024, height: 6, fill: "#000", opacity: 0.25 }, g);
    el("rect", { y: P.AVANT, width: 1024, height: 16, fill: "#59697a" }, g);
    el("rect", { y: P.AVANT + 16, width: 1024, height: 4, fill: "#1b2329" }, g);
    ["#ff8c69", "#ffd166", "#4ecdc4", "#ff8c69"].forEach((c, i) => {
      el("rect", { x: i * 256 + 4, y: P.AVANT + 24, width: 248, height: 72, rx: 6, fill: c }, g);
      el("rect", { x: i * 256 + 4, y: P.AVANT + 24, width: 248, height: 8, rx: 4, fill: "#fff", opacity: 0.25 }, g);
      el("rect", { x: i * 256 + 98, y: P.AVANT + 44, width: 60, height: 10, rx: 5, fill: "#ffffff", opacity: 0.9 }, g);
    });
  }

  P.decor = function (g) {
    // Tout le décor, du fond vers l'avant.
    mur(g); fenetre(g); affiche(g); etagere(g); paillasse(g);
  };
})(window.P);
