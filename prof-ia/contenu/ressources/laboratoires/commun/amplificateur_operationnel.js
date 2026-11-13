/*
Rôle : alimentation symétrique ±15 V (bornes +15, 0, −15) et amplificateur opérationnel (type 741) monté sur une plaquette :
       entrées e+ et e−, sortie s, alimentation +15, 0, −15. Modèle : Us = A·(V+ − V−) avec A = 2·10⁵, limitée à ±Vsat
       (tension d'alimentation − 1,5 V, soit ±13,5 V) ; tension de décalage d'entrée 1 mV ; résistance d'entrée 2 MΩ, de sortie
       75 Ω. Sans alimentation, la sortie reste à 0 V.
       Option « bilan » (désactivée par défaut) : le courant débité par la sortie vient de la borne +15 (ou part vers −15
       quand la sortie absorbe du courant) et un courant de repos (1,7 mA) traverse l'AO de +15 à −15 : des ampèremètres
       placés sur l'alimentation mesurent les vrais courants ; l'AO est alimenté dès que ses bornes sont à ±15 V
       (même à travers un ampèremètre).
Reçoit : le circuit (circuit.js) et le réglage { id, x, y, bilan } (+ alimentation : id de l'alimentation symétrique).
Produit : Labo.alimentation_symetrique(c, reglage), Labo.ao(c, { id, x, y, alimentation, bilan }) -> composant { us, epsilon } ;
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

  function sortie_rails() {
    // Option « bilan » : même sortie (source de Thévenin référencée à 0), mais deux dipôles vers s, l'un depuis +15, l'autre
    // depuis −15 ; un seul est actif (selon le sens du courant de sortie). Commandes : ε, V0 − V(rail), V+15 − V0, V0 − V−15.
    // Chaque dipôle signale aussi un changement de ses propres valeurs (l'autre dipôle a pu basculer entre-temps).
    const VSAT = 15 - CHUTE, G = 1 / R_SORTIE, e = { etat: "eteint", rail: "+" };
    const faire = (r) => ({ a: r, b: "s", g: 0, j: 0, ctrl: [{ c: "e+", d: "e−", g: 0 }, { c: "0", d: r, g: 0 }, { c: "+15", d: "0", g: 0 }, { c: "0", d: "−15", g: 0 }] });
    const ds = [faire("+15"), faire("−15")];
    const fem = () => (e.etat === "+" ? VSAT : e.etat === "−" ? -VSAT : 0);
    const appliquer = () => ds.forEach((d, n) => {
      const w = (n === 0) === (e.rail === "+") && e.etat !== "eteint" ? 1 : 0, lin = e.etat === "lineaire";
      Object.assign(d, { g: w * G, j: w * G * (lin ? A * DECALAGE : fem()) });
      d.ctrl[0].g = lin ? w * G * A : 0; d.ctrl[1].g = w * G;
    });
    for (const d of ds) d.ajuster = (u, i, [eps, , vp, vm]) => {
      // État de la sortie d'après ε ; le rail est choisi d'après le courant réel du dipôle actif (état inchangé).
      const avant = e.etat + e.rail, ancien = d.vu, etat0 = e.etat, v = A * (eps + DECALAGE);
      if (vp < 5 || vm < 5) e.etat = "eteint";
      else if (e.etat === "+" || e.etat === "−") e.etat = (e.etat === "+" ? v < VSAT : v > -VSAT) ? "lineaire" : e.etat;
      else e.etat = v > VSAT ? "+" : v < -VSAT ? "−" : "lineaire";
      if (d.actif && e.etat === etat0) e.rail = i >= 0 ? "+" : "−";
      appliquer(); d.vu = `${d.g}|${d.j}|${d.ctrl[0].g}`; d.actif = d.g > 0;
      return e.etat + e.rail !== avant || d.vu !== ancien;
    };
    appliquer();
    return [...ds, { a: "+15", b: "−15", g: 1.7e-3 / 30, j: 0 }];
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

  L.ao = function (c, { id = "ao", x, y, alimentation = "alim", bilan = false }) {
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
    const s = bilan ? sortie_rails() : [sortie(alimente)];
    comp.dipoles = () => [{ a: "e+", b: "e−", g: 1 / R_ENTREE, j: 0 }, ...s];
    comp.mettre_a_jour = ({ u }) => { comp.epsilon = u("e+", "e−"); comp.us = u("s", "0"); };
    return c.ajouter(comp);
  };
})(window.Labo);
