/*
Rôle : paillasses de l'estérification : (1) tableau magnétique des groupes caractéristiques (acide carboxylique, alcool, ester,
       anhydride d'acide) ; (2) banc de titrage (poste_titrage.js) : bécher A, contenu d'un tube scellé sorti du bain-marie
       bouillant à 60 min et versé dans 20 mL d'eau glacée ; bécher B, mélange 20 mmol d'acide + 60 mmol d'éthanol à
       l'équilibre, dans 20 mL d'eau glacée ; soude à 1,0 mol/L, phénolphtaléine ; (3) affiche des résultats de la classe
       (estérification, hydrolyse, influence de la température et du catalyseur).
Reçoit : le groupe SVG de chaque paillasse.
Produit : Labo.poste_groupes, Labo.poste_titrage_esters, Labo.poste_resultats_esters (groupe) -> { pense_bete } ; faits
          « tri_groupes » ({ id: colonne }) et « titrage_esters » = { sur, verse, robinet, VE : { A, B } (volume versé quand
          la teinte rose a persisté, ou null), phenol : { A, B } } ; Labo.TRI_GROUPES.
Utilisé par : simulation.js.
*/
(function (L) {
  const E = L.ESTERS, v2 = (v) => String(v).replace(".", ",");
  L.TRI_GROUPES = [
    ["a1", ["CH₃–CH₂–COOH", ""], 0], ["a2", ["H–COOH", ""], 0], ["o1", ["CH₃–CH₂–OH", ""], 1], ["o2", ["CH₃–CH(OH)–CH₃", ""], 1],
    ["e1", ["CH₃–COO–", "CH₂–CH₃"], 2], ["e2", ["H–COO–CH₃", ""], 2], ["n1", ["CH₃–CO–O–", "CO–CH₃"], 3], ["n2", ["CH₃–CH₂–CO–O–", "CO–CH₂–CH₃"], 3],
  ];

  L.poste_groupes = function (g) {
    // Pense-bête et tableau de tri en quatre colonnes.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230);
    L.tableau_tri(g, { x: 270, y: 30, largeur: 630, hauteur: 360, titre: "Quel groupe caractéristique ?", colonnes: [["Acide", "carboxylique"], "Alcool", "Ester", ["Anhydride", "d'acide"]], etiquettes: L.TRI_GROUPES.map(([id, texte, colonne]) => ({ id, texte, colonne })), fait: "tri_groupes", par_ligne: 4 });
    return { pense_bete };
  };

  function suivre(p) {
    // Toutes les 0,3 s : bécher sur l'agitateur ; volume versé quand la teinte rose persiste 1,5 s (agité, robinet fermé).
    const VE = { A: null, B: null }, duree = { A: 0, B: 0 }, aq = (r) => r.c.phases.find((q) => q.classe === "aqueuse");
    setInterval(() => {
      const b = p.burette.etat(), sur = p.sur_plateau(), id = sur ? sur.id : null, phenol = {};
      for (const r of p.recipients) phenol[r.id] = (aq(r)?.liquides.phenolphtaleine || 0) > 0;
      if (id && VE[id] === undefined) return;
      const ok = id && phenol[id] && p.agitateur.agite(sur) && b.robinet === "ferme" && L.concentration(aq(sur), "HO-") > 2e-4;
      if (id) duree[id] = ok ? duree[id] + 0.3 : 0;
      if (id && duree[id] >= 1.5 && VE[id] === null && b.verse > 0.3) VE[id] = Math.round(b.verse * 100) / 100;
      L.missions.noter("titrage_esters", { sur: id, verse: Math.round(b.verse * 100) / 100, robinet: b.robinet, VE: { ...VE }, phenol });
    }, 300);
  }

  L.poste_titrage_esters = function (g) {
    // Banc de titrage, deux béchers, phénolphtaléine, fiche des données.
    const p = L.poste_titrage(g, { titrant: "est_soude", texte: "NaOH 1,0 mol/L", becher: { id: "A", contenu: { est_tube_60: 2.3, eau_glacee: 20 }, etiquette: "A : tube 60 min" },
      autres: [{ id: "B", profil: "becher_100", contenu: { est_exces: 4.65, eau_glacee: 20 }, etiquette: "B : excès d'alcool" }], gouttes: [{ liquide: "phenolphtaleine", texte: "Phénol-\nphtaléine" }], places: [250, 335, 620, 790] });
    L.svg("rect", { x: 700, y: 46, width: 300, height: 92, rx: 3, fill: "#fdfdf8", stroke: "#c9c4b0", filter: "url(#ombre)" }, g);
    L.texte(g, 850, 64, "Tubes scellés au bain-marie bouillant", { "font-size": 9.5, "font-weight": 700, fill: "#23315a" });
    ["A : 20 mmol d'acide éthanoïque + 20 mmol d'éthanol,", "sorti du bain à t = 60 min, refroidi, versé dans l'eau glacée", "B : 20 mmol d'acide + 60 mmol d'éthanol, à l'équilibre", "Titrage : CH₃COOH + HO⁻ → CH₃COO⁻ + H₂O"].forEach((t, i) => L.texte(g, 850, 82 + i * 14, t, { "font-size": 8, fill: "#222" }));
    suivre(p);
    return { pense_bete: p.pense_bete };
  };

  function tableau(g, x, y, titre, sous, entetes, lignes, decimales) {
    // Petit tableau de résultats affiché au mur.
    L.svg("rect", { x, y, width: 230, height: 46 + lignes.length * 14, rx: 3, fill: "#fdfdf8", stroke: "#c9c4b0", filter: "url(#ombre)" }, g);
    L.texte(g, x + 115, y + 15, titre, { "font-size": 9.5, "font-weight": 700, fill: "#23315a" });
    L.texte(g, x + 115, y + 28, sous, { "font-size": 7, fill: "#444" });
    entetes.forEach((t, j) => L.texte(g, x + 60 + j * 110, y + 41, t, { "font-size": 8, "font-weight": 700, fill: "#23315a" }));
    lignes.forEach((l, k) => l.forEach((v, j) => L.texte(g, x + 60 + j * 110, y + 55 + k * 14, v2(v.toFixed(decimales[j])), { "font-size": 8.5, fill: "#222" })));
  }

  L.poste_resultats_esters = function (g) {
    // Trois affiches : estérification (sans la date 60 min), hydrolyse, influence des conditions.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230);
    tableau(g, 280, 40, "Estérification à 100 °C", "20 mmol d'acide + 20 mmol d'éthanol ; NaOH 1,0 mol/L", ["t (min)", "VE (mL)"], E.RESULTATS, [0, 2]);
    tableau(g, 525, 40, "Hydrolyse à 100 °C", "20 mmol d'ester + 20 mmol d'eau", ["t (min)", "n(acide) (mmol)"], E.HYDROLYSE, [0, 1]);
    L.svg("rect", { x: 525, y: 200, width: 470, height: 86, rx: 3, fill: "#fdfdf8", stroke: "#c9c4b0", filter: "url(#ombre)" }, g);
    L.texte(g, 760, 216, "Estérification équimolaire (20 + 20 mmol) : avancement x (mmol)", { "font-size": 9, "font-weight": 700, fill: "#23315a" });
    [["Conditions", 620], ["à 60 min", 790], ["état final", 900]].forEach(([t, dx]) => L.texte(g, dx, 232, t, { "font-size": 8, "font-weight": 700, fill: "#23315a" }));
    E.CONDITIONS.forEach(([t, a, b], k) => [[t, 620], [a, 790], [b, 900]].forEach(([v, dx]) => L.texte(g, dx, 248 + k * 14, v2(v), { "font-size": 8.5, fill: "#222" })));
    return { pense_bete };
  };
})(window.Labo);
