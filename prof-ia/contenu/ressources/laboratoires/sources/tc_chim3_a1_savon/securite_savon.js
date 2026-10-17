/*
Rôle : paillasse « sécurité » de la synthèse du savon : trois flacons de 250 mL (soude, éthanol, huile) avec leur
       étiquette et leurs pictogrammes de danger ; toucher un flacon ouvre sa fiche (dangers, précautions) ; bidon de
       récupération des déchets à côté de l'évier.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_securite_savon(groupe) -> { pense_bete } ; fait « fiches_lues » = [flacons dont la fiche a été lue].
Utilisé par : simulation.js.
*/
(function (L) {
  const FLACONS = [
    { nom: "soude", x: 380, titre: "Solution de soude à 30 %", pictos: ["SGH05"], verre: "#c9d6db", texte: "Hydroxyde de sodium. Provoque des brûlures graves de la peau et des lésions des yeux. Porter des gants et des lunettes de protection. En cas de contact : rincer longuement à l'eau." },
    { nom: "ethanol", x: 530, titre: "Éthanol à 95 %", pictos: ["SGH02", "SGH07"], verre: "#c9d6db", texte: "Liquide et vapeurs très inflammables : tenir à l'écart de toute flamme. Provoque une sévère irritation des yeux. Bien refermer le flacon." },
    { nom: "huile", x: 680, titre: "Huile d'olive", pictos: [], verre: "#cdb46a", texte: "Corps gras d'origine végétale. Pas de danger particulier. Les restes ne vont pas dans l'évier." },
  ];

  function flacon(g, f, sol) {
    // Flacon de 250 mL (70 × 140 mm) à bouchon à vis, étiquette blanche avec ses pictogrammes.
    const x = f.x, h = 224, l = 112;
    L.svg("ellipse", { cx: x + 4, cy: sol + 1, rx: 60, ry: 6, fill: "#000", opacity: 0.3 }, g);
    L.svg("path", { d: `M${x - l / 2} ${sol - 4} V${sol - h + 60} Q${x - l / 2} ${sol - h + 30} ${x - 22} ${sol - h + 20} V${sol - h} H${x + 22} V${sol - h + 20} Q${x + l / 2} ${sol - h + 30} ${x + l / 2} ${sol - h + 60} V${sol - 4} Q${x + l / 2} ${sol} ${x + l / 2 - 4} ${sol} H${x - l / 2 + 4} Q${x - l / 2} ${sol} ${x - l / 2} ${sol - 4} Z`, fill: f.verre, opacity: 0.85, stroke: "#7f9096" }, g);
    L.svg("rect", { x: x - 26, y: sol - h - 26, width: 52, height: 28, rx: 4, fill: "#1f4f88" }, g);
    L.svg("rect", { x: x - 46, y: sol - 150, width: 92, height: 110, fill: "#fbfaf3", stroke: "#cfcab8" }, g);
    L.texte(g, x, sol - 136, f.titre, { "font-size": 7.2, "font-weight": 700, fill: "#23315a" });
    f.pictos.forEach((c, i) => L.pictogramme(g, x + (i - (f.pictos.length - 1) / 2) * 40, sol - 90, 18, c));
    L.svg("rect", { x: x - l / 2 + 8, y: sol - h + 66, width: 8, height: 150, rx: 4, fill: "#fff", opacity: 0.3 }, g);
  }

  function fiche(calque, f) {
    // Grande fiche de sécurité au-dessus du flacon.
    calque.replaceChildren();
    const x = Math.max(170, Math.min(850, f.x)), y = 120, lignes = [""];
    for (const m of f.texte.split(" ")) { if ((lignes[lignes.length - 1] + " " + m).length > 48) lignes.push(m); else lignes[lignes.length - 1] = (lignes[lignes.length - 1] + " " + m).trim(); }
    L.svg("rect", { x: x - 150, y, width: 300, height: 34 + lignes.length * 12, rx: 3, fill: "#fffdf4", stroke: "#b9b19a", filter: "url(#ombre)" }, calque);
    L.texte(calque, x, y + 14, `Fiche de sécurité : ${f.titre}`, { "font-size": 9, "font-weight": 700, fill: "#23315a" });
    lignes.forEach((t, i) => L.texte(calque, x, y + 29 + i * 12, t, { "font-size": 8.5, fill: "#222" }));
  }

  L.poste_securite_savon = function (g) {
    // Trois flacons ; toucher l'un d'eux ouvre sa fiche et la note comme lue.
    L.affiche_securite(g, 780, 56);
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230), calque = L.svg("g", { "pointer-events": "none" }, g), lus = new Set();
    for (const f of FLACONS) {
      const e = L.svg("g", { class: `flacon-${f.nom}`, role: "button", "aria-label": f.titre }, g);
      flacon(e, f, 560);
      L.glissable(e, { soulever: false, debut: () => ({ x: 0, y: 0 }), toucher: () => { fiche(calque, f); lus.add(f.nom); L.missions.noter("fiches_lues", [...lus]); } });
    }
    L.ccm.bidon(g, 860, 520);
    return { pense_bete };
  };
})(window.Labo);
