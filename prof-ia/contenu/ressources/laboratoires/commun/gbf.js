/*
Rôle : générateur basse fréquence (GBF) : tension alternative sinusoïdale, triangulaire ou carrée, de fréquence affichée
       (50 Hz à 2 kHz) et d'amplitude réglable (0,5 à 10 V) mais non affichée — on la mesure à l'oscilloscope, comme
       en vrai. Résistance de sortie 50 Ω ; bornes SORTIE (rouge) et masse (noire).
Reçoit : le circuit (circuit.js) et le réglage { id, x, y, forme, f (Hz), Umax (V) }.
Produit : Labo.gbf(c, reglage) -> composant { forme, f, Umax } ; il tient à jour c.alternatif = { forme, f, Umax } ;
          Labo.forme_tension(forme, phase) -> valeur entre −1 et 1 ; Labo.bouton_rond(g, x, y, texte, action).
Utilisé par : les postes des simulations de tensions variables ; oscilloscope.js (bouton_rond, forme_tension).
*/
(function (L) {
  const FREQUENCES = [50, 100, 200, 250, 500, 1000, 2000], R_SORTIE = 50;

  L.forme_tension = function (forme, phase) {
    // Valeur (entre −1 et 1) d'une tension de forme donnée ; phase en radians, 0 = passage à zéro en montant.
    const s = Math.sin(phase);
    if (forme === "triangle") return (2 / Math.PI) * Math.asin(s);
    if (forme === "carre") return s >= 0 ? 1 : -1;
    return s;
  };

  L.bouton_rond = function (g, x, y, texte, action, rayon = 9) {
    // Petit bouton poussoir rond, touchable.
    const b = L.svg("g", { class: "bouton-rond", role: "button", "aria-label": texte }, g);
    L.svg("circle", { cx: x + 0.8, cy: y + 1.5, r: rayon, fill: "#000", opacity: 0.3 }, b);
    L.svg("circle", { cx: x, cy: y, r: rayon, fill: "url(#acier)", stroke: "#111" }, b);
    L.texte(b, x, y + 0.5, texte, { "font-size": 10, "font-weight": 700, fill: "#eef" });
    L.glissable(b, { soulever: false, debut: () => ({ x, y }), toucher: action });
    return b;
  };

  function symbole(g, x, y, forme) {
    // Petit dessin de la forme de tension sur la touche.
    const d = { sinus: `M${x - 8} ${y} q4 -9 8 0 t8 0`, triangle: `M${x - 8} ${y} l4 -6 l8 12 l4 -6`, carre: `M${x - 8} ${y + 5} v-10 h8 v10 h8 v-10` }[forme];
    L.svg("path", { d, fill: "none", stroke: "#e8f0ff", "stroke-width": 1.4, "pointer-events": "none" }, g);
  }

  function dessiner(g, x, y) {
    // Boîtier gris, plaque, afficheur de fréquence, légendes.
    L.boitier(g, x, y, 220, 104, 30, { dessus: "#d5d9dc", face: "#7f8a92" });
    L.svg("rect", { x: x + 10, y: y + 8, width: 70, height: 13, rx: 2, fill: "#37474f" }, g);
    L.texte(g, x + 45, y + 15, "GBF", { "font-size": 8.5, fill: "#eef3f6", "font-weight": 700, "letter-spacing": 1 });
    L.svg("rect", { x: x + 92, y: y + 6, width: 118, height: 24, rx: 2, fill: "#2b1208", stroke: "#120702" }, g);
    for (const [dx, t] of [[30, "FORME"], [126, "FRÉQ."], [184, "AMPL."]]) L.texte(g, x + dx + 6, y + 40, t, { "font-size": 7, "font-weight": 700, fill: "#37474f" });
    L.texte(g, x + 124, y + 87, "SORTIE", { "font-size": 7, "font-weight": 700, fill: "#37474f" });
    L.texte(g, x + 176, y + 87, "⏚", { "font-size": 10, "font-weight": 700, fill: "#37474f" });
    return L.texte(g, x + 204, y + 19, "", { "text-anchor": "end", "font-size": 14, "font-family": "monospace", "font-weight": 700, fill: "#ff7a3c" });
  }

  L.gbf = function (c, { id = "gbf", x, y, forme = "sinus", f = 500, Umax = 3 }) {
    // Construit le GBF, ses touches (forme, fréquence −/+, amplitude −/+) et ses deux bornes.
    const comp = { id, forme, f, Umax, g: L.svg("g", { class: "gbf" }, c.calque_composants) };
    L.cordon_secteur(comp.g, { x: x + 200, y: y + 24 }, c.prise());
    const afficheur = dessiner(comp.g, x, y);
    const changer = (k) => {
      Object.assign(comp, k);
      c.alternatif = { forme: comp.forme, f: comp.f, Umax: comp.Umax };
      afficheur.textContent = comp.f >= 1000 ? `${comp.f / 1000} kHz` : `${comp.f} Hz`;
      L.missions.noter("gbf", { ...c.alternatif });
      c.calculer();
    };
    ["sinus", "triangle", "carre"].forEach((nom, k) => {
      L.bouton_rond(comp.g, x + 18 + k * 24, y + 56, "", () => changer({ forme: nom }), 10);
      symbole(comp.g, x + 18 + k * 24, y + 56, nom);
    });
    const pas = (liste, v, s) => liste[Math.max(0, Math.min(liste.length - 1, liste.indexOf(v) + s))];
    L.bouton_rond(comp.g, x + 120, y + 54, "−", () => changer({ f: pas(FREQUENCES, comp.f, -1) }));
    L.bouton_rond(comp.g, x + 144, y + 54, "+", () => changer({ f: pas(FREQUENCES, comp.f, 1) }));
    L.bouton_rond(comp.g, x + 178, y + 54, "−", () => changer({ Umax: Math.max(0.5, comp.Umax - 0.5) }));
    L.bouton_rond(comp.g, x + 202, y + 54, "+", () => changer({ Umax: Math.min(10, comp.Umax + 0.5) }));
    c.borne(comp, "sortie", x + 150, y + 86, L.ROUGE_BORNE);
    c.borne(comp, "masse", x + 194, y + 86, L.NOIR_BORNE);
    comp.dipoles = (mode) => [{ a: "masse", b: "sortie", g: 1 / R_SORTIE, j: mode === "alternatif" ? 1 / R_SORTIE : 0 }];
    c.ajouter(comp);
    changer({});
    return comp;
  };
})(window.Labo);
