/*
Rôle : diagramme des niveaux d'énergie d'un atome, à l'échelle (comme dans un manuel) : un trait par niveau, son nom à gauche
       (n = 1, 2… ou E1, E2…), sa valeur en eV à droite, le niveau 0 (atome ionisé) en pointillés, flèche des énergies croissantes.
       Les étiquettes trop proches se décalent d'elles-mêmes vers le haut ou vers le bas.
Reçoit : le groupe SVG, le centre (x, y), l'échelle k (1 sur une affiche, environ 2,6 sur un document ouvert) et
         { titre, niveaux [[nom, E (eV)]] du plus bas au plus haut, hauteur (en unités de k) }.
Produit : Labo.niveaux_energie(g, x, y, k, reglage).
Utilisé par : les documents des simulations « L'atome et la mécanique de Newton ».
*/
(function (L) {
  const ecrit = (v) => `${String(v).replace(".", ",").replace("-", "−")} eV`;

  function places(ys, ecart) {
    // Lignes de base des étiquettes : sous le trait s'il y a la place avant le niveau inférieur, sinon au-dessus.
    // (il faut deux hauteurs de texte si l'étiquette du niveau inférieur est déjà au-dessus de son trait).
    const dessus = [];
    return ys.map((y, i) => {
      dessus[i] = i > 0 && ys[i - 1] - y < (dessus[i - 1] ? 2.6 : 1.3) * ecart;
      return dessus[i] ? y - 0.3 * ecart : y + 1.1 * ecart;
    });
  }

  L.niveaux_energie = function (g, x, y, k, { titre, niveaux, hauteur = 72 }) {
    // Traits, noms, valeurs, flèche et titre ; Emin en bas, 0 eV en haut.
    const Emin = niveaux[0][1], Y = (E) => y - (hauteur * k) / 2 + hauteur * k * (E / Emin), taille = 3.4 * k;
    const ys = niveaux.map(([, E]) => Y(E)), bases = places(ys, taille);
    niveaux.forEach(([nom, E], i) => {
      L.svg("line", { x1: x - 22 * k, y1: ys[i], x2: x + 10 * k, y2: ys[i], stroke: E === 0 ? "#888" : "#1f3f66", "stroke-width": 0.7 * k, "stroke-dasharray": E === 0 ? `${2 * k} ${2 * k}` : "none" }, g);
      L.texte(g, x + 12 * k, bases[i], ecrit(E), { "font-size": taille, fill: "#1f3f66", "text-anchor": "start" });
      L.texte(g, x - 24 * k, bases[i], nom, { "font-size": taille, fill: "#555", "text-anchor": "end" });
    });
    const haut = ys[ys.length - 1] - 4 * k;
    L.svg("path", { d: `M${x - 40 * k} ${ys[0]} V${haut} m${-1.5 * k} ${2.5 * k} l${1.5 * k} ${-2.5 * k} l${1.5 * k} ${2.5 * k}`, fill: "none", stroke: "#555", "stroke-width": 0.5 * k }, g);
    L.texte(g, x - 6 * k, haut - 4 * k, titre, { "font-size": 4 * k, "font-weight": 700, fill: "#23315a" });
  };
})(window.Labo);
