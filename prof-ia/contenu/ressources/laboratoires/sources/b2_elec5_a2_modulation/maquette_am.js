/*
Rôle : maquette (carte électronique verte) de modulation et de démodulation d'amplitude, en trois blocs reliés par l'élève :
       multiplieur (circuit intégré AD633, k = 0,1 V⁻¹ ; entrées X et Y, tension de décalage U₀ réglable ajoutée à Y,
       sortie S), détecteur d'enveloppe (diode, R₁ = 10 kΩ en parallèle avec C₁ choisi par un toucher ; entrée E, sortie D),
       filtre passe-haut (C₂ = 1 µF, R₂ = 10 kΩ ; entrée F, sortie O) ; une borne de masse commune.
Reçoit : le circuit et { id, x, y }.
Produit : Labo.maquette_am(c, reglage) -> comp { U0 (V), C1 (F), tau (s) } ; bornes « X », « Y », « S », « E », « D », « F », « O »,
          « masse » ; fait « <id> » = { U0, C1, tau }.
Utilisé par : poste_modulation.js.
*/
(function (L) {
  const C1 = [1e-9, 4.7e-9, 1e-8, 4.7e-8, 1e-7], U0 = [0, 0.5, 1, 1.5, 2, 2.5, 3], R1 = 1e4, OR = "#c9a227";
  const nF = (C) => `${String(Math.round(C * 1e10) / 10).replace(".", ",")} nF`;

  function carte(g, x, y) {
    // Carte verte, pistes, titres des trois blocs, circuit intégré, diode, résistances et condensateur du filtre.
    L.boitier(g, x, y, 340, 160, 8, { dessus: "#1f6b3c", face: "#123f24" });
    for (const [x1, t] of [[x + 6, "MULTIPLIEUR (AD633)"], [x + 124, "DÉTECTEUR D'ENVELOPPE"], [x + 240, "FILTRE PASSE-HAUT"]]) {
      L.svg("rect", { x: x1, y: y + 6, width: x1 === x + 240 ? 94 : 112, height: 112, rx: 4, fill: "none", stroke: "#cfe8d4", "stroke-dasharray": "3 2", opacity: 0.7 }, g);
      L.texte(g, x1 + (x1 === x + 240 ? 47 : 56), y + 15, t, { "font-size": 6.5, "font-weight": 700, fill: "#eaf6ec" });
    }
    L.svg("rect", { x: x + 46, y: y + 40, width: 36, height: 46, rx: 2, fill: "#1b1b1b" }, g);
    for (let k = 0; k < 4; k++) for (const dx of [-3, 36]) L.svg("rect", { x: x + 46 + dx, y: y + 44 + k * 10, width: 3, height: 4, fill: "#c0c0c0" }, g);
    L.texte(g, x + 64, y + 66, "AD633", { "font-size": 6.5, "font-weight": 700, fill: "#e0e0e0" });
    L.texte(g, x + 64, y + 76, "x·(y + U₀)", { "font-size": 5.5, fill: "#bdbdbd" });
    L.svg("path", { d: `M${x + 150} ${y + 52} h12 M${x + 174} ${y + 52} h12 M${x + 162} ${y + 45} v14 L${x + 174} ${y + 52} Z M${x + 174} ${y + 45} v14`, fill: "#111", stroke: "#111", "stroke-width": 1.4 }, g);
    L.texte(g, x + 168, y + 40, "diode", { "font-size": 6, fill: "#eaf6ec" });
    L.svg("rect", { x: x + 196, y: y + 60, width: 8, height: 22, rx: 2, fill: "#d9b77a", stroke: "#5a4420" }, g);
    L.texte(g, x + 192, y + 74, "R₁ 10 kΩ", { "font-size": 5.5, fill: "#eaf6ec", "text-anchor": "end" });
    L.svg("rect", { x: x + 262, y: y + 40, width: 18, height: 14, rx: 3, fill: "#2d5fa8" }, g);
    L.texte(g, x + 271, y + 64, "C₂ 1 µF", { "font-size": 5.5, fill: "#eaf6ec" });
    L.svg("rect", { x: x + 296, y: y + 60, width: 8, height: 22, rx: 2, fill: "#d9b77a", stroke: "#5a4420" }, g);
    L.texte(g, x + 300, y + 92, "R₂ 10 kΩ", { "font-size": 5.5, fill: "#eaf6ec" });
  }

  function touche(c, x, y, t, f) {
    // Petite touche au-dessus des fils.
    const b = L.svg("g", { role: "button", "aria-label": t }, c.calque_bornes);
    L.svg("rect", { x: x - 8, y: y - 8, width: 16, height: 16, rx: 3, fill: "#e9eef2", stroke: "#8a96a0" }, b);
    L.texte(b, x, y + 4, t, { "font-size": 11, "font-weight": 700, fill: "#23315a" });
    L.glissable(b, { soulever: false, debut: () => ({ x: 0, y: 0 }), toucher: f });
  }

  L.maquette_am = function (c, { id = "M", x, y }) {
    // Carte, afficheurs de U₀ et de C₁, touches, bornes ; chaque réglage recalcule le circuit.
    const comp = { id, U0: 2, C1: 4.7e-8, tau: R1 * 4.7e-8, g: L.svg("g", { class: "maquette-am" }, c.calque_composants) };
    carte(comp.g, x, y);
    const aff = L.svg("g", {}, comp.g), afficher = () => {
      aff.replaceChildren(); comp.tau = R1 * comp.C1;
      for (const [cx, t] of [[x + 64, `U₀ = ${String(comp.U0).replace(".", ",")} V`], [x + 180, `C₁ = ${nF(comp.C1)}`]]) { L.svg("rect", { x: cx - 30, y: y + 94, width: 60, height: 15, rx: 2, fill: "#10201a", stroke: "#000" }, aff); L.texte(aff, cx, y + 105, t, { "font-size": 7.5, "font-weight": 700, fill: "#7dff9a", "font-family": "monospace" }); }
      L.missions.noter(id, { U0: comp.U0, C1: comp.C1, tau: comp.tau });
    };
    const pas = (liste, v, s) => liste[Math.max(0, Math.min(liste.length - 1, liste.indexOf(v) + s))];
    touche(c, x + 22, y + 101, "−", () => { comp.U0 = pas(U0, comp.U0, -1); afficher(); c.calculer(); });
    touche(c, x + 106, y + 101, "+", () => { comp.U0 = pas(U0, comp.U0, 1); afficher(); c.calculer(); });
    touche(c, x + 138, y + 101, "−", () => { comp.C1 = pas(C1, comp.C1, -1); afficher(); c.calculer(); });
    touche(c, x + 222, y + 101, "+", () => { comp.C1 = pas(C1, comp.C1, 1); afficher(); c.calculer(); });
    for (const [n, dx, dy] of [["X", 22, 46], ["Y", 22, 80], ["S", 106, 63], ["E", 138, 63], ["D", 222, 63], ["F", 254, 92], ["O", 318, 92], ["masse", 170, 138]]) {
      c.borne(comp, n, x + dx, y + dy, n === "masse" ? L.NOIR_BORNE : OR);
      L.texte(comp.g, x + dx + (n === "masse" ? 22 : 0), y + dy + (n === "masse" ? 3 : -11), n === "masse" ? "⏚ masse" : n, { "font-size": 7.5, "font-weight": 700, fill: "#ffffff" });
    }
    comp.dipoles = () => [];
    afficher();
    return c.ajouter(comp);
  };
})(window.Labo);
