/*
Rôle : pot de sulfate de cuivre anhydre (poudre blanche, pictogrammes de danger) et spatule : on prend une pointe de
       spatule de poudre dans le pot, puis on la dépose dans un verre de montre.
Reçoit : la paillasse de chimie et { x, bas } (pot), { repos } (spatule posée sur la paillasse).
Produit : Labo.poudre_sulfate(ctx, reglage) -> { spatule : { chargee } } ; appelle recevoir_poudre() du verre de montre visé.
Utilisé par : les simulations de chimie (test de l'eau).
*/
(function (L) {
  function pot(g, x, bas) {
    // Pot à large col, ouvert, son couvercle posé à côté, étiquette et pictogrammes (nocif ; dangereux pour l'environnement : arbre et poisson).
    L.svg("ellipse", { cx: x + 4, cy: bas + 1, rx: 24, ry: 4, fill: "#000", opacity: 0.28 }, g);
    L.svg("rect", { x: x - 22, y: bas - 52, width: 44, height: 52, rx: 5, fill: "#f4f6f6", stroke: "#a9b0b2" }, g);
    L.svg("ellipse", { cx: x, cy: bas - 52, rx: 17, ry: 4, fill: "#e9ebe6", stroke: "#a9b0b2" }, g);
    L.svg("ellipse", { cx: x, cy: bas - 51, rx: 13, ry: 2.6, fill: "#f1f1ea" }, g);
    L.svg("rect", { x: x - 19, y: bas - 40, width: 38, height: 28, fill: "#fff", stroke: "#c9c4b0", "stroke-width": 0.5 }, g);
    L.texte(g, x, bas - 35, "Sulfate de cuivre", { "font-size": 4.4, "font-weight": 700, fill: "#222" });
    L.texte(g, x, bas - 30, "anhydre CuSO₄", { "font-size": 4.4, "font-weight": 700, fill: "#222" });
    for (const dx of [-6, 6]) L.svg("rect", { x: x + dx - 3.5, y: bas - 24.5, width: 7, height: 7, transform: `rotate(45 ${x + dx} ${bas - 21})`, fill: "#fff", stroke: "#d01c1c", "stroke-width": 0.9 }, g);
    L.texte(g, x - 6, bas - 20.6, "!", { "font-size": 5, "font-weight": 700, fill: "#111" });
    L.svg("path", { d: `M${x + 4.5} ${bas - 18} V${bas - 23} M${x + 4.5} ${bas - 21} l-1.5 -1.5 M${x + 4.5} ${bas - 21.5} l1.5 -1.5 M${x + 6.5} ${bas - 18.5} q1.5 -1.5 3 0 q-1.5 1.5 -3 0`, stroke: "#111", "stroke-width": 0.5, fill: "none" }, g);
    L.svg("ellipse", { cx: x + 40, cy: bas - 3, rx: 17, ry: 4.5, fill: "#3f6fb0", stroke: "#24456f" }, g);
    L.svg("rect", { x: x + 23, y: bas - 7, width: 34, height: 4, fill: "#2f5a93" }, g);
  }

  function spatule(g, chargee) {
    // Spatule-cuillère en inox, la cuillère en (0, 0) ; une pointe de poudre blanche si elle est chargée.
    g.replaceChildren();
    L.svg("path", { d: "M2 -1 L86 -16", stroke: "url(#metal)", "stroke-width": 2.6, "stroke-linecap": "round" }, g);
    L.svg("path", { d: "M58 -11 L90 -17", stroke: "#8c949a", "stroke-width": 4.2, "stroke-linecap": "round" }, g);
    L.svg("ellipse", { cx: 0, cy: 0, rx: 7, ry: 3.4, fill: "#c9cfd3", stroke: "#7d868c", "stroke-width": 0.6 }, g);
    if (chargee) L.svg("path", { d: "M-5 0 Q0 -5 5 0 Z", fill: "#f1f1ea", stroke: "#00000022" }, g);
  }

  L.poudre_sulfate = function (ctx, { x, bas, repos }) {
    // Construit le pot et la spatule ; gestes : pot -> spatule chargée ; verre de montre -> poudre déposée.
    pot(L.svg("g", { class: "pot-sulfate" }, ctx.fond), x, bas);
    const s = { chargee: false, g: L.svg("g", { class: "spatule", role: "button", "aria-label": "Spatule" }, ctx.objets) };
    const ranger = () => { ctx.objets.append(s.g); L.placer(s.g, repos.x, repos.y); spatule(s.g, s.chargee); };
    ranger();
    L.glissable(s.g, {
      debut: () => ({ ...repos }),
      saisir: () => ctx.haut.append(s.g),
      deplacer: (p) => L.placer(s.g, p.x, p.y),
      lacher: (p) => {
        if (Math.abs(p.x - x) < 20 && Math.abs(p.y - (bas - 50)) < 30) s.chargee = true;
        const c = s.chargee && ctx.cibles.find((k) => k.recevoir_poudre && Math.abs(k.bouche().x - p.x) < 30 && Math.abs(k.bouche().y - p.y) < 28);
        if (c) { s.chargee = false; c.recevoir_poudre(); ctx.signaler(); }
        ranger();
      },
    });
    return { spatule: s };
  };
})(window.Labo);
