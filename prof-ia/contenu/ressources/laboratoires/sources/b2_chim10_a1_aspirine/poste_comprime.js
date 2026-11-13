/*
Rôle : paillasse du titrage direct d'un comprimé d'aspirine 500 (poste_titrage.js) : bécher de 250 mL où le comprimé broyé a
       été dissous dans 10 mL d'éthanol et 50 mL d'eau froide ; soude à 0,20 mol/L ; phénolphtaléine. À froid et vite, seule
       la réaction acide-base a lieu ; l'ester de l'aspirine ne réagit pas (sa saponification demanderait de chauffer).
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_comprime(g) -> { pense_bete } ; fait « titrage_comprime » = { sur, verse, robinet, phenol, VE (volume versé
          quand la teinte rose a persisté 1,5 s, solution agitée, robinet fermé ; null sinon) }.
Utilisé par : simulation.js.
*/
(function (L) {
  const aq = (r) => r.c.phases.find((q) => q.classe === "aqueuse");

  L.poste_comprime = function (g) {
    // Banc de titrage, comprimé dissous, phénolphtaléine, fiche ; fin repérée à la teinte rose persistante.
    const p = L.poste_titrage(g, { titrant: "asp_soude", texte: "NaOH 0,20 mol/L", becher: { id: "comprime", contenu: { asp_comprime: 60 }, etiquette: "comprimé dissous" },
      gouttes: [{ liquide: "phenolphtaleine", texte: "Phénol-\nphtaléine" }], places: [250, 335, 620, 790] });
    L.svg("rect", { x: 700, y: 46, width: 300, height: 78, rx: 3, fill: "#fdfdf8", stroke: "#c9c4b0", filter: "url(#ombre)" }, g);
    L.texte(g, 850, 64, "Comprimé d'aspirine 500", { "font-size": 9.5, "font-weight": 700, fill: "#23315a" });
    ["Broyé, dissous dans 10 mL d'éthanol + 50 mL d'eau froide", "Titrage rapide, à froid : C₉H₈O₄ + HO⁻ → C₉H₇O₄⁻ + H₂O", "M(aspirine) = 180 g/mol"].forEach((t, i) => L.texte(g, 850, 82 + i * 14, t, { "font-size": 8, fill: "#222" }));
    let duree = 0, VE = null, c = p.becher.c;
    setInterval(() => {
      if (p.becher.c !== c) { c = p.becher.c; VE = null; duree = 0; }
      const b = p.burette.etat(), sur = p.sur_plateau(), ph = aq(p.becher), phenol = (ph?.liquides.phenolphtaleine || 0) > 0;
      const ok = sur === p.becher && phenol && p.agitateur.agite(sur) && b.robinet === "ferme" && L.concentration(ph, "HO-") > 2e-5;
      duree = ok ? duree + 0.3 : 0;
      if (duree >= 1.5 && VE === null && b.verse > 0.3) VE = Math.round(b.verse * 100) / 100;
      L.missions.noter("titrage_comprime", { sur: sur ? sur.id : null, verse: Math.round(b.verse * 100) / 100, robinet: b.robinet, phenol, VE });
    }, 300);
    return { pense_bete: p.pense_bete };
  };
})(window.Labo);
