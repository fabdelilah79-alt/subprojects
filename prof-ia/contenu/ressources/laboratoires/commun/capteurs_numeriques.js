/*
Rôle : capteurs de laboratoire en 2,5D : pressiomètre numérique (manomètre absolu : boîtier, écran à cristaux liquides en
       hPa, embout sur le dessus où se branche le tuyau, câble) et thermomètre électronique (boîtier, écran en °C, câble,
       sonde en inox). L'affichage est mis à jour par la simulation ; une petite agitation (± 1 chiffre) le rend réaliste.
Reçoit : le groupe SVG et { x, y (coin haut gauche du boîtier) }.
Produit : Labo.pressiometre(g, { x, y }) -> { embout { x, y }, afficher(P en hPa ou null) } ;
          Labo.thermometre_numerique(g, { x, y, sonde: [points de la sonde] }) -> { afficher(θ en °C) }.
Utilisé par : les simulations de chimie (gaz, pression d'un gaz produit).
*/
(function (L) {
  function boitier(g, x, y, l, h, titre) {
    // Boîtier gris arrondi (ombre, face, tranche), écran vert, légende.
    L.ombre_sol(g, x + l / 2 + 4, y + h + 3, l / 2 + 4, 5, 0.4);
    L.svg("rect", { x: x + 3, y: y + 3, width: l, height: h, rx: 7, fill: "#1d2125" }, g);
    L.svg("rect", { x, y, width: l, height: h, rx: 7, fill: "#e4e6e3", stroke: "#8f948d" }, g);
    L.svg("rect", { x: x + 8, y: y + 10, width: l - 16, height: 30, rx: 3, fill: "#1d2a22", stroke: "#000" }, g);
    L.texte(g, x + l / 2, y + h - 10, titre, { "font-size": 7, "font-weight": 700, fill: "#33393f" });
    return L.svg("g", {}, g);
  }

  L.pressiometre = function (g, { x, y }) {
    // Boîtier de 120 × 70, embout de raccordement en haut à gauche ; renvoie l'embout et l'affichage.
    L.svg("rect", { x: x + 16, y: y - 12, width: 12, height: 14, rx: 2, fill: "url(#metal)", stroke: "#444" }, g);
    L.svg("rect", { x: x + 18, y: y - 18, width: 8, height: 8, rx: 1, fill: "#b8c0c4", stroke: "#555" }, g);
    const ecran = boitier(g, x, y, 120, 70, "PRESSIOMÈTRE (absolu)");
    L.svg("path", { d: `M${x + 120} ${y + 50} C${x + 150} ${y + 56} ${x + 150} ${y + 80} ${x + 170} ${y + 84}`, fill: "none", stroke: "#1b1e21", "stroke-width": 2.4 }, g);
    return {
      embout: { x: x + 22, y: y - 18 },
      afficher: (P) => {
        ecran.replaceChildren();
        const t = P === null ? "- - - -" : P > 2500 ? "> 2500" : `${Math.round(P + (Math.random() - 0.5) * 1.4)} hPa`;
        L.texte(ecran, x + 60, y + 31, t, { "font-size": 15, "font-weight": 700, fill: "#7dff9a", "font-family": "monospace" });
      },
    };
  };

  L.thermometre_numerique = function (g, { x, y, sonde }) {
    // Boîtier de 90 × 60, câble jusqu'à la sonde (dernier point : pointe) ; renvoie l'affichage.
    const d = sonde.map((p, k) => `${k ? "L" : "M"}${p.x} ${p.y}`).join(" "), b = sonde[sonde.length - 2], c = sonde[sonde.length - 1];
    L.svg("path", { d: `M${x + 45} ${y} ${d.replace(/^M/, "L")}`, fill: "none", stroke: "#1b1e21", "stroke-width": 2 }, g);
    L.svg("line", { x1: b.x, y1: b.y, x2: c.x, y2: c.y, stroke: "url(#metal)", "stroke-width": 4, "stroke-linecap": "round" }, g);
    const ecran = boitier(g, x, y, 90, 60, "THERMOMÈTRE");
    return { afficher: (T) => { ecran.replaceChildren(); L.texte(ecran, x + 45, y + 31, `${(T + (Math.random() - 0.5) * 0.08).toFixed(1).replace(".", ",")} °C`, { "font-size": 14, "font-weight": 700, fill: "#7dff9a", "font-family": "monospace" }); } };
  };
})(window.Labo);
