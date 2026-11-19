/*
Rôle : paillasse « pression et température » : ballon de 250 mL fermé (air enfermé à 20 °C sous 1 013 hPa), tenu par une
       noix sur un pied, plongé dans la cuve vitrée d'un bain thermostaté (consigne de 0 à 80 °C, réglée au bouton) ;
       thermomètre électronique dans l'eau, pressiomètre relié au bouchon. L'eau du bain rejoint la consigne, puis l'air
       du ballon prend la température de l'eau (le temps passe vite) : P = n R T / V, à volume constant.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_temperature(g) -> { pense_bete } ; fait « temperature » = { consigne, bain, air, P, mesures: [{ theta, P }] }.
Utilisé par : simulation.js.
*/
(function (L) {
  const P0 = 1013, T0 = 293.15, SOL = 560;

  function cuve(g) {
    // Socle du bain (tableau de commande), cuve vitrée, fond et paroi arrière.
    L.ombre_sol(g, 600, SOL + 16, 140, 8, 0.45);
    L.svg("rect", { x: 466, y: 490, width: 268, height: 86, rx: 6, fill: "#d9dcd8", stroke: "#7d827b" }, g);
    L.texte(g, 600, 572, "BAIN THERMOSTATÉ", { "font-size": 7, "font-weight": 700, fill: "#33393f" });
    L.svg("rect", { x: 480, y: 320, width: 240, height: 170, fill: "#eaf4f8", opacity: 0.35, stroke: "#9fb6be" }, g);
  }

  function ballon(g) {
    // Ballon (sphère et col), bouchon de caoutchouc, tube ; pied, tige et noix.
    L.pied_support(g, 780, SOL, 270); L.svg("rect", { x: 612, y: 315, width: 168, height: 6, rx: 2, fill: "url(#metal)", stroke: "#555", "stroke-width": 0.5 }, g); L.noix(g, 780, 318);
    L.svg("path", { d: "M588 300 V380 A42 42 0 1 0 612 380 V300 Z", fill: "#e8f2f6", opacity: 0.6, stroke: "#8fb3bd", "stroke-width": 1.4 }, g);
    L.svg("ellipse", { cx: 586, cy: 410, rx: 6, ry: 16, fill: "#fff", opacity: 0.45 }, g);
    L.svg("rect", { x: 604, y: 312, width: 18, height: 12, rx: 2, fill: "#2b2f33" }, g);
    L.svg("path", { d: "M586 302 H614 L611 288 H589 Z", fill: "#5a3a2a", stroke: "#2b1a10" }, g);
  }

  L.poste_temperature = function (g) {
    // Matériel, réglage de la consigne, évolution des températures, affichages ; mesures notées quand tout est stable.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230), e = { consigne: 20, bain: 20, air: 20, mesures: [] };
    const fond = L.svg("g", {}, g); cuve(fond);
    const capteur = L.pressiometre(fond, { x: 190, y: 430 });
    L.svg("path", { d: `M600 288 C600 240 ${capteur.embout.x} 250 ${capteur.embout.x} ${capteur.embout.y}`, fill: "none", stroke: "#cfd8d4", "stroke-width": 6 }, fond);
    ballon(fond);
    L.svg("rect", { x: 480, y: 348, width: 240, height: 142, fill: "#9fd0e6", opacity: 0.35 }, fond);
    L.svg("ellipse", { cx: 600, cy: 348, rx: 120, ry: 5, fill: "#cfeaf5", opacity: 0.7 }, fond);
    const thermo = L.thermometre_numerique(fond, { x: 840, y: 440, sonde: [{ x: 885, y: 290 }, { x: 690, y: 290 }, { x: 690, y: 330 }, { x: 690, y: 470 }] });
    const gb = L.svg("g", { "pointer-events": "none" }, fond);
    L.texte(fond, 598, 556, "consigne", { "font-size": 7.5, "font-weight": 700, fill: "#33393f" });
    L.bouton_reglage(g, { x: 540, y: 552, min: 0, max: 80, pas: 10, valeur: 20, unite: "°C", decimales: 0, titre: "", sur_changement: (v) => { e.consigne = v; } });
    setInterval(() => {
      // Pas de 0,1 s : l'eau rejoint la consigne (constante de temps 1,5 s), l'air rejoint l'eau (0,8 s).
      e.bain += ((e.consigne - e.bain) * 0.1) / 1.5; e.air += ((e.bain - e.air) * 0.1) / 0.8;
      const P = (P0 * (e.air + 273.15)) / T0;
      if (Math.abs(e.air - e.consigne) < 0.15 && !e.mesures.some((m) => m.theta === e.consigne)) e.mesures.push({ theta: e.consigne, P: Math.round(P) });
      capteur.afficher(P); thermo.afficher(e.bain);
      gb.replaceChildren(); L.svg("rect", { x: 622, y: 508, width: 92, height: 22, rx: 3, fill: "#1d2a22" }, gb); L.texte(gb, 668, 523, `bain ${e.bain.toFixed(1).replace(".", ",")} °C`, { "font-size": 9, "font-weight": 700, fill: "#7dff9a", "font-family": "monospace" });
      L.missions.noter("temperature", JSON.parse(JSON.stringify({ consigne: e.consigne, bain: e.bain, air: e.air, P, mesures: e.mesures })));
    }, 100);
    return { pense_bete };
  };
})(window.Labo);
