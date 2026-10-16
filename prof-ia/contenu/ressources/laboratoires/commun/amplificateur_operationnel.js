/*
Rôle : alimentation symétrique ±15 V (bornes +15, 0, −15) et amplificateur opérationnel (type 741) monté sur une plaquette :
       entrées e+ et e−, sortie s, alimentation +15, 0, −15. Modèle : Us = A·(V+ − V−) avec A = 2·10⁵, limitée à ±Vsat
       (tension d'alimentation − 1,5 V, soit ±13,5 V) ; tension de décalage d'entrée 1 mV ; résistance d'entrée 2 MΩ, de sortie
       75 Ω. Sans alimentation, la sortie reste à 0 V.
Reçoit : le circuit (circuit.js) et le réglage { id, x, y } (+ alimentation : id de l'alimentation symétrique).
Produit : Labo.alimentation_symetrique(c, reglage), Labo.ao(c, { id, x, y, alimentation }) -> composant { us, epsilon } ;
          bornes de l'AO « e+ », « e− », « s », « +15 », « 0 », « −15 ».
Utilisé par : les postes des simulations d'électronique.
*/
(function (L) {
  const A = 2e5, R_SORTIE = 75, R_ENTREE = 2e6, CHUTE = 1.5, DECALAGE = 1e-3;

  L.alimentation_symetrique = function (c, { id = "alim", x, y }) {
    // Boîtier à deux sources de 15 V en série : +15 / 0 / −15 ; cordon secteur.
    const comp = { id, g: L.svg("g", { class: "alimentation-symetrique" }, c.calque_composants) };
    L.cordon_secteur(comp.g, { x: x + 150, y: y + 20 }, c.prise());
    L.boitier(comp.g, x, y, 170, 74, 30, { dessus: "#c9d3da", face: "#5f7383" });
    L.svg("rect", { x: x + 10, y: y + 8, width: 150, height: 13, rx: 2, fill: "#2c3e50" }, comp.g);
    L.texte(comp.g, x + 85, y + 15, "ALIMENTATION SYMÉTRIQUE ±15 V", { "font-size": 7, fill: "#e6eef4", "font-weight": 700 });
    [["+15", 30, L.ROUGE_BORNE], ["0", 85, L.NOIR_BORNE], ["−15", 140, "#1f5fbf"]].forEach(([nom, dx, couleur]) => {
      L.texte(comp.g, x + dx, y + 32, nom === "0" ? "0 V" : `${nom} V`, { "font-size": 9, "font-weight": 700, fill: "#2c3e50" });
      c.borne(comp, nom, x + dx, y + 54, couleur);
    });
    comp.dipoles = () => [{ a: "0", b: "+15", g: 2, j: 30 }, { a: "−15", b: "0", g: 2, j: 30 }];
    return c.ajouter(comp);
  };

  function sortie(alimente) {
    // Dipôle de sortie (0 → s) : g·(Us − (Vs − V0)), avec Us = A·(ε + décalage) en régime linéaire, ou ±Vsat en saturation.
    // L'état (linéaire, saturé +, saturé −) est choisi à chaque tour pour être cohérent avec ε calculé.
    const VSAT = 15 - CHUTE, d = { a: "0", b: "s", g: 1 / R_SORTIE, j: 0, ctrl: [{ c: "e+", d: "e−", g: 0 }], etat: "lineaire" };
    const appliquer = () => {
      const lin = d.etat === "lineaire";
      d.ctrl[0].g = lin ? d.g * A : 0;
      d.j = d.g * (lin ? A * DECALAGE : d.etat === "+" ? VSAT : d.etat === "−" ? -VSAT : 0);
    };
    d.ajuster = (u, i, [eps]) => {
      const v = A * (eps + DECALAGE), avant = d.etat;
      if (!alimente()) d.etat = "eteint";
      else if (d.etat === "+") d.etat = v < VSAT ? "lineaire" : "+";
      else if (d.etat === "−") d.etat = v > -VSAT ? "lineaire" : "−";
      else d.etat = v > VSAT ? "+" : v < -VSAT ? "−" : "lineaire";
      appliquer();
      return d.etat !== avant;
    };
    appliquer();
    return d;
  }

  function dessiner(g, x, y) {
    // Plaquette verte, boîtier DIL-8 noir avec son encoche, symbole triangulaire de l'AO.
    L.boitier(g, x, y, 220, 100, 8, { dessus: "#2f6b45", face: "#1f4a30" });
    L.svg("rect", { x: x + 22, y: y + 18, width: 46, height: 28, rx: 2, fill: "#1b1c1e" }, g);
    L.svg("path", { d: `M${x + 22} ${y + 28} a4 4 0 0 1 0 8`, fill: "#3a3d41" }, g);
    L.texte(g, x + 45, y + 32, "741", { "font-size": 8, fill: "#ccc", "font-weight": 700 });
    const s = { stroke: "#f4f1e0", "stroke-width": 1.3, fill: "none" };
    L.svg("path", { d: `M${x + 112} ${y + 12} V${y + 52} L${x + 152} ${y + 32} Z M${x + 100} ${y + 22} H${x + 112} M${x + 100} ${y + 42} H${x + 112} M${x + 152} ${y + 32} H${x + 166}`, ...s }, g);
    L.texte(g, x + 118, y + 22, "−", { "font-size": 10, fill: "#f4f1e0", "font-weight": 700 });
    L.texte(g, x + 118, y + 42, "+", { "font-size": 10, fill: "#f4f1e0", "font-weight": 700 });
    L.texte(g, x + 132, y + 32, "∞", { "font-size": 8, fill: "#f4f1e0" });
  }

  L.ao = function (c, { id = "ao", x, y, alimentation = "alim" }) {
    // Construit l'AO ; il n'est alimenté que si ses trois bornes d'alimentation sont reliées à celles de l'alimentation.
    const comp = { id, us: 0, epsilon: 0, g: L.svg("g", { class: "ao" }, c.calque_composants) };
    dessiner(comp.g, x, y);
    const alimente = () => ["+15", "0", "−15"].every((b) => c.meme_noeud(`${id}.${b}`, `${alimentation}.${b}`));
    // Noms sous les bornes du bas, à gauche de la sortie : les fiches enfoncées ne les cachent pas.
    const bornes = [["e−", 20, 72], ["e+", 60, 72], ["s", 200, 32], ["+15", 100, 72], ["0", 140, 72], ["−15", 180, 72]];
    for (const [nom, dx, dy] of bornes) {
      L.texte(comp.g, nom === "s" ? x + dx - 16 : x + dx, nom === "s" ? y + dy + 4 : y + dy + 20, nom, { "font-size": 9, "font-weight": 700, fill: "#f4f1e0" });
      c.borne(comp, nom, x + dx, y + dy, nom === "s" ? "#e0a800" : "#c9a227");
    }
    const s = sortie(alimente);
    comp.dipoles = () => [{ a: "e+", b: "e−", g: 1 / R_ENTREE, j: 0 }, s];
    comp.mettre_a_jour = ({ u }) => { comp.epsilon = u("e+", "e−"); comp.us = u("s", "0"); };
    return c.ajouter(comp);
  };
})(window.Labo);
