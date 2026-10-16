/*
Rôle : ce que l'on voit à la loupe (grossissement 10 environ) : vésicules de jus de la pulpe, pores de la peau d'orange
       (glandes à huile essentielle), débris de pulpe dans le jus, fibres enchevêtrées du papier ; vue ronde au-dessus
       de l'objet, avec une légende.
Reçoit : le calque où dessiner, la cible observée (zone(), titre) et le type de vue (« pulpe », « peau », « jus », « papier »).
Produit : Labo.vue_loupe(calque, cible, type).
Utilisé par : cartes_sens.js.
*/
(function (L) {
  const LEGENDES = {
    pulpe: "Pulpe à la loupe : de petits sacs (vésicules) gonflés de jus.",
    peau: "Peau à la loupe : de nombreux pores, des glandes qui contiennent une huile odorante.",
    jus: "Jus à la loupe : un liquide qui contient des débris de pulpe.",
    papier: "Papier à la loupe : un enchevêtrement de fibres (de la cellulose, venue du bois).",
  };

  function contenu(g, cx, cy, r, type) {
    // Dessine l'intérieur de la vue agrandie.
    const fond = { pulpe: "#f6a630", peau: "#f08c16", jus: "#f5a63a", papier: "#fafaf4" }[type];
    L.svg("circle", { cx, cy, r, fill: fond }, g);
    if (type === "pulpe") for (let k = 0; k < 18; k++) {
      const x = cx - r + 8 + ((k * 37) % (2 * r - 10)), y = cy - r + 10 + ((k * 23) % (2 * r - 16));
      L.svg("ellipse", { cx: x, cy: y, rx: 5, ry: 13, transform: `rotate(${(k * 47) % 180} ${x} ${y})`, fill: "#f9b448", stroke: "#fbe0a6", "stroke-width": 1 }, g);
      L.svg("ellipse", { cx: x - 1.5, cy: y - 4, rx: 1.4, ry: 3, transform: `rotate(${(k * 47) % 180} ${x} ${y})`, fill: "#fff", opacity: 0.6 }, g);
    }
    if (type === "peau") for (let k = 0; k < 40; k++) {
      const a = k * 2.4, d = r * Math.sqrt((k + 0.5) / 40) * 0.95;
      L.svg("circle", { cx: cx + d * Math.cos(a), cy: cy + d * Math.sin(a), r: 3.2, fill: "#c6600a" }, g);
      L.svg("circle", { cx: cx + d * Math.cos(a) - 1, cy: cy + d * Math.sin(a) - 1, r: 1, fill: "#ffd27a", opacity: 0.8 }, g);
    }
    if (type === "jus") for (let k = 0; k < 14; k++) {
      const x = cx - r + 10 + ((k * 41) % (2 * r - 20)), y = cy - r + 10 + ((k * 29) % (2 * r - 20));
      L.svg("path", { d: `M${x} ${y} q4 -6 9 -1 q-2 6 -9 1 Z`, fill: "#e98a12", opacity: 0.8 }, g);
      if (k % 3 === 0) L.svg("circle", { cx: x + 14, cy: y + 6, r: 2, fill: "none", stroke: "#fff3d6", "stroke-width": 0.8 }, g);
    }
    if (type === "papier") for (let k = 0; k < 34; k++) {
      const x = cx - r + ((k * 53) % (2 * r)), y = cy - r + ((k * 31) % (2 * r)), a = (k * 67) % 180;
      L.svg("path", { d: `M${x} ${y} q12 -6 26 2 q10 6 24 -1`, transform: `rotate(${a} ${x} ${y})`, stroke: k % 4 ? "#d9d6c8" : "#c9c4b0", "stroke-width": 1.4, fill: "none" }, g);
    }
  }

  L.vue_loupe = function (calque, cible, type) {
    // Vue ronde agrandie, cerclée de noir comme la lentille, reliée à l'objet, avec sa légende.
    const z = cible.zone(), r = 52, cx = Math.max(130, Math.min(800, z.x)), cy = z.y - z.r - 80;
    const clip = L.svg("clipPath", { id: `clip-loupe-${type}` }, calque);
    L.svg("circle", { cx, cy, r }, clip);
    L.svg("line", { x1: z.x, y1: z.y - z.r, x2: cx, y2: cy + r, stroke: "#55606a", "stroke-dasharray": "3 2" }, calque);
    contenu(L.svg("g", { "clip-path": `url(#clip-loupe-${type})` }, calque), cx, cy, r, type);
    L.svg("circle", { cx, cy, r, fill: "none", stroke: "#1c1d1f", "stroke-width": 5 }, calque);
    L.svg("rect", { x: cx + r + 6, y: cy - 24, width: 150, height: 48, rx: 5, fill: "#fff", stroke: "#8a96a0" }, calque);
    const mots = LEGENDES[type].split(" "), lignes = [""];
    for (const m of mots) { if ((lignes[lignes.length - 1] + " " + m).length > 30) lignes.push(m); else lignes[lignes.length - 1] = (lignes[lignes.length - 1] + " " + m).trim(); }
    lignes.slice(0, 4).forEach((t, i) => L.texte(calque, cx + r + 81, cy - 13 + i * 10, t, { "font-size": 7.5, fill: "#222" }));
    L.texte(calque, cx, cy - r - 8, "× 10 environ", { "font-size": 7, fill: "#23315a", "font-weight": 700 });
  };
})(window.Labo);
