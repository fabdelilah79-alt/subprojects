/*
Rôle : oscilloscope à une voie : écran 10 × 8 divisions, sensibilité verticale Sv (V/div) et balayage b (ms/div) réglés
       par des touches −/+, entrée CH1 par un adaptateur BNC-bananes (borne Y1 rouge, masse noire). Résistance d'entrée
       1 MΩ. On lit U = Sv·y (y en divisions verticales) et t = b·x (x en divisions horizontales).
Reçoit : le circuit (circuit.js) et le réglage { id, x, y, Sv, b }.
Produit : Labo.oscilloscope(c, reglage) -> composant { Sv, b, u_dc, ua } ; fait noté « oscillo » = { Sv, b, u_dc, ua, gbf }.
Utilisé par : les postes des simulations de tensions variables.
*/
(function (L) {
  const SV = [0.1, 0.2, 0.5, 1, 2, 5, 10], B = [0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10];
  const ecrire = (v, unite) => `${String(v).replace(".", ",")} ${unite}/div`;

  function corps(g, x, y) {
    // Boîtier gris clair, nom de l'appareil, cadres des réglages.
    L.boitier(g, x, y, 350, 236, 34, { dessus: "#dfe3e6", face: "#8d979e" });
    L.texte(g, x + 18, y + 14, "OSCILLOSCOPE", { "text-anchor": "start", "font-size": 9, "font-weight": 700, fill: "#37474f", "letter-spacing": 1.2 });
    for (const [dy, t] of [[24, "VOLTS/DIV  CH1"], [86, "TIME/DIV"]]) {
      L.svg("rect", { x: x + 238, y: y + dy, width: 102, height: 54, rx: 4, fill: "none", stroke: "#9aa5ad" }, g);
      L.texte(g, x + 289, y + dy + 9, t, { "font-size": 6.5, "font-weight": 700, fill: "#37474f" });
    }
  }

  function reglage(g, x, y, liste, valeur, unite, changer) {
    // Afficheur d'un réglage et ses deux touches ; renvoie la fonction qui met l'afficheur à jour.
    L.svg("rect", { x: x + 246, y: y + 16, width: 86, height: 15, rx: 2, fill: "#0b1f17" }, g);
    const t = L.texte(g, x + 289, y + 24, ecrire(valeur(), unite), { "font-size": 8.5, "font-family": "monospace", "font-weight": 700, fill: "#7cff9a" });
    const pas = (s) => { const v = liste[Math.max(0, Math.min(liste.length - 1, liste.indexOf(valeur()) + s))]; changer(v); t.textContent = ecrire(v, unite); };
    L.bouton_rond(g, x + 268, y + 42, "−", () => pas(-1));
    L.bouton_rond(g, x + 310, y + 42, "+", () => pas(1));
  }

  function entree(c, comp, x, y) {
    // Prise BNC de la voie CH1 et adaptateur à deux bornes de 4 mm (Y1 et masse).
    L.svg("circle", { cx: x + 289, cy: y + 166, r: 9, fill: "url(#metal)", stroke: "#444" }, comp.g);
    L.svg("rect", { x: x + 252, y: y + 176, width: 74, height: 44, rx: 4, fill: "#2b2f33" }, comp.g);
    L.texte(comp.g, x + 289, y + 154, "CH1", { "font-size": 7, "font-weight": 700, fill: "#37474f" });
    L.texte(comp.g, x + 270, y + 213, "Y1", { "font-size": 7, "font-weight": 700, fill: "#e8e8e2" });
    L.texte(comp.g, x + 308, y + 213, "⏚", { "font-size": 9, "font-weight": 700, fill: "#e8e8e2" });
    c.borne(comp, "Y1", x + 270, y + 196, L.ROUGE_BORNE);
    c.borne(comp, "masse", x + 308, y + 196, L.NOIR_BORNE);
  }

  L.oscilloscope = function (c, { id = "oscillo", x, y, Sv = 1, b = 0.5 }) {
    // Construit l'oscilloscope ; à chaque calcul du circuit, il retrace la tension entre Y1 et la masse.
    const comp = { id, Sv, b, u_dc: 0, ua: 0, g: L.svg("g", { class: "oscilloscope" }, c.calque_composants) };
    L.cordon_secteur(comp.g, { x: x + 330, y: y + 24 }, c.prise());
    corps(comp.g, x, y);
    const tracer = L.ecran_oscillo(comp.g, x + 18, y + 34);
    const retracer = () => {
      tracer({ u_dc: comp.u_dc, ua: comp.ua, alternatif: c.alternatif, Sv: comp.Sv, b: comp.b });
      L.missions.noter("oscillo", { Sv: comp.Sv, b: comp.b, u_dc: Math.round(comp.u_dc * 1000) / 1000, ua: Math.round(comp.ua * 1000) / 1000, gbf: c.alternatif ? { ...c.alternatif } : null });
    };
    reglage(comp.g, x, y + 24, SV, () => comp.Sv, "V", (v) => { comp.Sv = v; retracer(); });
    reglage(comp.g, x, y + 86, B, () => comp.b, "ms", (v) => { comp.b = v; retracer(); });
    entree(c, comp, x, y);
    comp.dipoles = () => [{ a: "Y1", b: "masse", g: 1e-6, j: 0 }];
    comp.mettre_a_jour = ({ u, ua }) => { comp.u_dc = u("Y1", "masse"); comp.ua = ua("Y1", "masse"); retracer(); };
    return c.ajouter(comp);
  };
})(window.Labo);
