/*
Rôle : petit flacon de grains de pierre ponce (40 mm) et pincée de grains : on prend quelques grains dans le flacon et
       on les lâche au-dessus de l'ouverture d'un ballon (ou de l'entonnoir posé dessus) ; ils régularisent l'ébullition.
Reçoit : le contexte de la paillasse et { x, sol (bas du flacon), ouverture() -> { x, y } (où lâcher les grains), quand() }.
Produit : Labo.pierre_ponce(ctx, reglage).
Utilisé par : les montages d'hydrodistillation et de chauffage à reflux.
*/
(function (L) {
  function flacon(g, x, bas) {
    // Flacon en verre, grains gris, étiquette.
    L.svg("rect", { x: x - 20, y: bas - 56, width: 40, height: 56, rx: 5, fill: "rgba(205,228,236,0.5)", stroke: "#9fb6be" }, g);
    for (let i = 0; i < 24; i++) L.svg("circle", { cx: x - 15 + ((i * 7) % 30), cy: bas - 5 - Math.floor(i / 5) * 5, r: 2.6, fill: "#9a968c" }, g);
    L.svg("rect", { x: x - 17, y: bas - 48, width: 34, height: 14, fill: "#fbfaf3" }, g);
    L.texte(g, x, bas - 41, "pierre ponce", { "font-size": 5.4, "font-weight": 700, fill: "#23315a" });
  }

  L.pierre_ponce = function (ctx, { x, sol, ouverture, quand }) {
    // Flacon fixe et pincée de grains déplaçable (elle revient toujours dans le flacon).
    flacon(ctx.fond, x, sol);
    const g = L.svg("g", { class: "pincee", role: "button", "aria-label": "Pierre ponce" }, ctx.objets), y = sol - 54;
    L.svg("rect", { x: x - 20, y: sol - 60, width: 40, height: 60, fill: "#000", opacity: 0 }, g);
    for (const dx of [-4, 1, 5]) L.svg("circle", { cx: x + dx, cy: y + Math.abs(dx), r: 2.6, fill: "#9a968c" }, g);
    L.glissable(g, { debut: () => ({ x: 0, y: 0 }), deplacer: (p) => L.placer(g, p.x, p.y), lacher: (p) => {
      L.placer(g, 0, 0);
      const o = ouverture();
      if (o && Math.hypot(x + p.x - o.x, y + p.y - o.y) < 40) quand();
    } });
  };
})(window.Labo);
