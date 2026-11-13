/*
Rôle : équipement de protection individuelle accroché au mur : lunettes de protection et gants en nitrile. On les touche
       pour les mettre (ils quittent leur crochet) ; une étiquette rappelle ce que l'on porte (la blouse est déjà mise).
Reçoit : le groupe SVG de la paillasse, la position { x, y } du premier crochet et une fonction appelée à chaque changement.
Produit : Labo.equipement(g, reglage) -> { porte : { lunettes, gants }, protege() (vrai si lunettes et gants sont mis) }.
Utilisé par : les simulations de synthèse (soude, acides).
*/
(function (L) {
  function lunettes(g, x, y) {
    // Lunettes-masque : monture verte, écran transparent, élastique.
    L.svg("path", { d: `M${x - 30} ${y} Q${x - 30} ${y - 16} ${x} ${y - 16} Q${x + 30} ${y - 16} ${x + 30} ${y} Q${x + 30} ${y + 14} ${x + 12} ${y + 14} Q${x} ${y + 6} ${x - 12} ${y + 14} Q${x - 30} ${y + 14} ${x - 30} ${y} Z`, fill: "rgba(220,240,246,0.7)", stroke: "#3c8a4a", "stroke-width": 3 }, g);
    L.svg("path", { d: `M${x - 30} ${y - 4} Q${x} ${y - 34} ${x + 30} ${y - 4}`, fill: "none", stroke: "#2b2b2b", "stroke-width": 2 }, g);
  }

  function gant(g, x, y) {
    // Gant en nitrile bleu, doigts vers le bas.
    L.svg("path", { d: `M${x - 12} ${y - 22} H${x + 12} V${y + 4} L${x + 14} ${y + 22} Q${x + 12} ${y + 26} ${x + 9} ${y + 22} L${x + 7} ${y + 8} L${x + 5} ${y + 26} Q${x + 2} ${y + 29} ${x} ${y + 25} L${x - 1} ${y + 8} L${x - 3} ${y + 25} Q${x - 6} ${y + 28} ${x - 8} ${y + 23} L${x - 8} ${y + 6} L${x - 16} ${y + 14} Q${x - 19} ${y + 11} ${x - 16} ${y + 7} L${x - 12} ${y}`, fill: "#4f7fd1", stroke: "#2c4f8f", "stroke-width": 1 }, g);
  }

  L.equipement = function (g, { x, y, changer = () => {} }) {
    // Deux crochets ; toucher un objet le met ; l'étiquette dit ce que l'on porte.
    const e = { porte: { lunettes: false, gants: false } }, etiquette = L.svg("g", { "pointer-events": "none" }, g);
    const objets = [["lunettes", x, (q) => lunettes(q, x, y + 26)], ["gants", x + 90, (q) => { gant(q, x + 80, y + 34); gant(q, x + 102, y + 36); }]];
    for (const [nom, cx, dessin] of objets) {
      L.svg("circle", { cx, cy: y, r: 3.5, fill: "#8c949a" }, g);
      const o = L.svg("g", { class: `epi epi-${nom}`, role: "button", "aria-label": nom }, g);
      dessin(o);
      L.glissable(o, { soulever: false, debut: () => ({ x: 0, y: 0 }), toucher: () => { e.porte[nom] = true; o.style.display = "none"; maj(); changer(e); } });
    }
    const maj = () => {
      etiquette.replaceChildren();
      const liste = ["blouse", ...Object.keys(e.porte).filter((k) => e.porte[k])].join(", ");
      L.svg("rect", { x: x - 40, y: y + 70, width: 190, height: 18, rx: 3, fill: "#fbfaf3", stroke: "#cfcab8" }, etiquette);
      L.texte(etiquette, x + 55, y + 79, `Vous portez : ${liste}`, { "font-size": 7.5, "font-weight": 700, fill: "#23315a" });
    };
    e.protege = () => e.porte.lunettes && e.porte.gants;
    maj();
    return e;
  };
})(window.Labo);
