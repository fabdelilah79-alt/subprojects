/*
Rôle : paillasses de l'activité « techniques traditionnelles » : (1) quatre documents historiques au mur (enfleurage,
       macération, infusion et décoction, distillation) ; (2) comparer macération, infusion et décoction de feuilles de
       thé (eau froide, bouilloire, plaque chauffante, chronomètre) ; (3) tableau pour classer des préparations.
Reçoit : le groupe SVG de chaque paillasse.
Produit : Labo.poste_documents_extraction, Labo.poste_comparer, Labo.poste_classer_techniques (groupe) -> { pense_bete } ;
          Labo.ETIQUETTES_TECHNIQUES ; faits « documents_extraction », « extraction_the » = { A, B, C : { eau, T, c }, plaque },
          « chronometre », « tri_techniques ».
Utilisé par : simulation.js.
*/
(function (L) {
  const doc = (x, y, titre, chaine, texte) => ({ x, y, l: 228, h: 170, taille: 5.3, titre, chaine, texte });
  const DOCS = [
    doc(280, 30, "L'enfleurage", ["fleurs fraîches", "(jasmin)", "graisse froide", "pommade parfumée"], "Au XIXe siècle, à Grasse (France), on étalait de la graisse froide sur des plaques de verre et l'on y posait des fleurs fragiles (jasmin, tubéreuse). Chaque jour, on remplaçait les fleurs fanées par des fleurs fraîches, pendant des semaines. La graisse chargée de parfum devenait une « pommade », que l'on lavait à l'alcool pour en retirer le parfum. Cette méthode très longue n'est presque plus utilisée."),
    doc(522, 30, "La macération", ["plante", "", "liquide froid", "macérat"], "On laisse tremper une plante dans un liquide (eau, huile, alcool) à la température ambiante, pendant des heures ou des jours. Exemples : la poudre de henné que l'on laisse tremper dans de l'eau avant de l'appliquer ; des plantes mises à macérer dans de l'huile d'olive."),
    doc(280, 214, "L'infusion et la décoction", ["plante", "", "eau très chaude", "tisane"], "Infusion : on verse de l'eau bouillante sur la plante et on laisse reposer quelques minutes, hors du feu (thé, verveine, menthe). Décoction : on fait bouillir la plante dans l'eau pendant plusieurs minutes ; on la réserve aux parties dures : racines, écorces, graines (cannelle, gingembre)."),
    doc(522, 214, "Les savants arabes et la distillation", ["pétales de rose", "+ eau", "alambic", "eau de rose"], "Le mot « alambic » vient de l'arabe al-inbiq. Aux Xe et XIe siècles, des savants comme Al-Razi et Ibn Sina (Avicenne) ont perfectionné la distillation, en particulier pour préparer l'eau de rose. Aujourd'hui encore, à Kelâa M'Gouna, dans la vallée du Dadès, on distille les roses pour produire de l'eau de rose."),
  ];
  L.ETIQUETTES_TECHNIQUES = [
    { id: "jasmin", texte: ["jasmin", "(parfum)"], colonne: 0 }, { id: "henne", texte: ["henné", "dans l'eau"], colonne: 1 },
    { id: "the", texte: ["thé", "à la menthe"], colonne: 2 }, { id: "verveine", texte: ["verveine", "(feuilles)"], colonne: 2 },
    { id: "cannelle", texte: ["bâtons de", "cannelle"], colonne: 3 }, { id: "gingembre", texte: ["racines de", "gingembre"], colonne: 3 },
  ];
  const pense = (g) => L.decor.pense_bete(g, 24, 52, 230);

  L.poste_documents_extraction = function (g) {
    // Paillasse 1 : quatre documents à lire.
    const pense_bete = pense(g);
    L.documents_mur(g, DOCS, "documents_extraction");
    return { pense_bete };
  };

  function bouilloire(g, x, bas) {
    // Bouilloire électrique sur son socle : corps évasé, couvercle, poignée à droite, bec à gauche d'où sort la vapeur.
    L.svg("ellipse", { cx: x + 4, cy: bas + 1, rx: 32, ry: 5, fill: "#000", opacity: 0.3 }, g);
    L.svg("rect", { x: x - 30, y: bas - 8, width: 60, height: 8, rx: 3, fill: "#3a3f44" }, g);
    L.svg("path", { d: `M${x + 16} ${bas - 52} q18 2 16 22 q-1 12 -12 16`, stroke: "#3a3f44", "stroke-width": 6, fill: "none", "stroke-linecap": "round" }, g);
    L.svg("path", { d: `M${x - 22} ${bas - 50} L${x - 38} ${bas - 64} L${x - 34} ${bas - 66} L${x - 18} ${bas - 56} Z`, fill: "#d9dbd7", stroke: "#8c918a" }, g);
    L.svg("path", { d: `M${x - 26} ${bas - 8} Q${x - 22} ${bas - 46} ${x - 16} ${bas - 58} H${x + 16} Q${x + 22} ${bas - 46} ${x + 26} ${bas - 8} Z`, fill: "#f2f3f1", stroke: "#8c918a" }, g);
    L.svg("ellipse", { cx: x, cy: bas - 58, rx: 16, ry: 3.5, fill: "#dfe1dd", stroke: "#8c918a" }, g);
    L.svg("rect", { x: x - 3, y: bas - 62, width: 6, height: 4, rx: 1.5, fill: "#3a3f44" }, g);
    L.svg("rect", { x: x - 12, y: bas - 46, width: 6, height: 32, rx: 2, fill: "#9fd3ea", opacity: 0.8 }, g);
    L.svg("path", { d: `M${x - 37} ${bas - 68} q-5 -7 0 -14 q5 -7 0 -14`, stroke: "#fff", "stroke-width": 3, opacity: 0.4, fill: "none" }, g);
  }

  function source(g, dessin, repos, cibles, verser) {
    // Récipient que l'on porte au-dessus d'un bécher pour y verser son eau ; il est redessiné après chaque versement.
    const e = L.svg("g", { class: "source-eau", role: "button" }, g);
    dessin(e); L.placer(e, 0, 0);
    L.glissable(e, { debut: () => ({ x: 0, y: 0 }), deplacer: (p) => L.placer(e, p.x, p.y), lacher: (p) => {
      L.placer(e, 0, 0);
      const c = cibles.find((b) => Math.hypot(repos.x + p.x - b.bouche().x, repos.y + p.y - b.bouche().y) < 50);
      if (c && verser(c)) dessin(e);
    } });
  }

  L.poste_comparer = function (g) {
    // Paillasse 2 : A eau froide (macération), B eau de la bouilloire (infusion), C sur la plaque (décoction).
    const pense_bete = pense(g);
    const A = L.becher_the(g, { id: "A", x: 340, bas: 545, lettre: "A", texte: "macération" });
    const B = L.becher_the(g, { id: "B", x: 460, bas: 545, lettre: "B", texte: "infusion" });
    const plaque = L.plaque_chauffante(g, { x: 590, bas: 562 });
    const C = L.becher_the(g, { id: "C", x: 590, bas: 526, lettre: "C", texte: "décoction" });
    const froide = L.melange({ eau: 220 });
    const verser_froide = (b) => froide.volumes.eau >= 100 && b.remplir(20) && (froide.volumes.eau -= 100, true);
    source(g, (e) => L.verrerie.becher(e, 705, 545, froide, "eau froide", { l: 70, h: 84, capacite: 250 }), { x: 705, y: 470 }, [A, C], verser_froide);
    source(g, (e) => { e.replaceChildren(); bouilloire(e, 800, 530); }, { x: 770, y: 466 }, [B], (b) => b.remplir(95));
    const chrono = L.chronometre(g, { x: 190, y: 415 });
    const noter = () => L.missions.noter("extraction_the", { ...Object.fromEntries([A, B, C].map((b) => [b.id, { eau: b.eau, T: Math.round(b.T), c: Math.round(b.c * 100) / 100 }])), plaque: plaque.allumee });
    chrono.tic((dt) => { A.avancer(dt, false); B.avancer(dt, false); C.avancer(dt, plaque.allumee); noter(); });
    return { pense_bete };
  };

  L.poste_classer_techniques = function (g) {
    // Paillasse 3 : chaque préparation dans la colonne de sa technique.
    const pense_bete = pense(g);
    L.tableau_tri(g, { x: 270, y: 40, largeur: 640, hauteur: 330, titre: "Quelle technique pour chaque préparation ?", colonnes: ["Enfleurage", "Macération", "Infusion", "Décoction"], etiquettes: [4, 0, 2, 5, 1, 3].map((k) => ({ ...L.ETIQUETTES_TECHNIQUES[k] })), fait: "tri_techniques" });
    return { pense_bete };
  };
})(window.Labo);
