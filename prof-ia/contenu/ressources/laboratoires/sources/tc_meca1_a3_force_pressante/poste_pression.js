/*
Rôle : paillasse « Force pressante et pression » : bloc de mousse, deux briques de 2,00 kg, réglet, fiche technique,
       tableau magnétique pour classer les actions mécaniques.
       L'enfoncement suit la pression : d (mm) = P (Pa) / 200, avec P = F / S (F = poids des briques empilées).
Reçoit : le groupe SVG de la paillasse (décor déjà dessiné).
Produit : Labo.poste_pression(groupe) -> { pense_bete } ; faits notés : faces_vues, empilement, classement_forces.
Utilisé par : simulation.js.
*/
(function (L) {
  const G = 9.81;
  const PA_PAR_MM = 200;
  const Z = () => L.Mousse.ZONE;

  L.ETIQUETTES_FORCES = [
    { id: "brique_mousse", texte: ["Brique sur", "la mousse"], colonne: 1 },
    { id: "doigt_punaise", texte: ["Doigt sur la tête", "d'une punaise"], colonne: 0 },
    { id: "terre_brique", texte: ["Terre sur la brique", "(poids)"], colonne: 2 },
    { id: "eau_membrane", texte: ["Eau sur la membrane", "de la capsule"], colonne: 1 },
    { id: "aimant_clou", texte: ["Aimant sur", "un clou en fer"], colonne: 2 },
  ];

  function fiche(g) {
    // Fiche technique scotchée sur le carrelage, à gauche (une pile de briques ne la cache pas).
    L.svg("rect", { x: 24, y: 240, width: 290, height: 58, fill: "#fdfcf6", stroke: "#cfcab8", filter: "url(#ombre)" }, g);
    L.svg("rect", { x: 150, y: 234, width: 40, height: 12, fill: "#fff", opacity: 0.6 }, g);
    L.texte(g, 169, 260, "Brique pleine : 20 cm × 10 cm × 5 cm", { class: "etiquette-carton", "font-size": 18 });
    L.texte(g, 169, 282, "Masse : m = 2,00 kg (chaque brique)", { class: "etiquette-carton", "font-size": 18 });
  }

  L.poste_pression = function (g) {
    // Construit la paillasse et branche les gestes sur les briques.
    fiche(g);
    L.tableau_tri(g, { x: 700, y: 20, largeur: 300, hauteur: 262, titre: "Classez chaque action mécanique",
      colonnes: [["De contact", "localisée"], ["De contact", "répartie"], ["À distance"]], etiquettes: L.ETIQUETTES_FORCES, fait: "classement_forces" });
    const fond = L.svg("g", {}, g), sur_mousse = L.svg("g", {}, g), devant = L.svg("g", {}, g);
    const sur_paillasse = L.svg("g", {}, g), main = L.svg("g", {}, g);
    const mousse = new L.Mousse(fond, devant);
    new L.Reglet(devant, 640);
    const briques = [new L.Brique(sur_paillasse, "debout"), new L.Brique(sur_paillasse, "debout")];
    const etat = { d: 0, arret: null, faces: new Set() };
    const pile = () => [briques.find((b) => b.lieu === "mousse"), briques.find((b) => b.lieu === "dessus")].filter(Boolean);

    function placer_pile() {
      // Place les briques de la pile sur la mousse creusée de d millimètres.
      const [bas, haut] = pile();
      if (!bas) return mousse.creuser(null);
      const l = bas.dimensions().largeur;
      mousse.creuser({ x0: bas.pos.x - l / 2, x1: bas.pos.x + l / 2, d: etat.d });
      bas.placer(bas.pos.x, Z().surface + etat.d);
      if (haut) haut.placer(bas.pos.x, Z().surface + etat.d - bas.hauteur);
    }

    function noter() {
      // La mousse ne bouge plus : on note la face posée, ou l'empilement.
      const [bas, haut] = pile();
      if (bas && !haut) { etat.faces.add(bas.orientation); L.missions.noter("faces_vues", [...etat.faces]); }
      if (bas && haut) L.missions.noter("empilement", true);
    }

    function enfoncer() {
      // La mousse s'enfonce (ou remonte) doucement jusqu'à l'enfoncement d = P / 200.
      const [bas] = pile();
      const briques_pile = pile().length;
      const cible = bas ? (briques_pile * 2 * G) / bas.dimensions().surface_m2 / PA_PAR_MM : 0;
      const depart = etat.d;
      etat.arret?.();
      etat.arret = L.animer(0.8, (t) => { etat.d = depart + (cible - depart) * L.adoucir(t); placer_pile(); }, noter);
    }

    function lacher(b, p) {
      // Décide où va la brique lâchée : sur l'autre brique, sur la mousse, sur la paillasse, ou elle tombe.
      const autre = briques.find((x) => x !== b);
      const z = Z();
      const sommet = autre.pos.y - autre.hauteur;
      if (autre.lieu === "mousse" && Math.abs(p.x - autre.pos.x) < 90 && Math.abs(p.y - sommet) < 50) b.lieu = "dessus";
      else if (autre.lieu !== "mousse" && p.x > z.gauche && p.x < z.droite && p.y > z.surface - 70 && p.y < z.surface + 40) {
        const l = b.dimensions().largeur / 2;
        b.lieu = "mousse";
        b.placer(Math.max(z.gauche + l + 4, Math.min(z.droite - l - 4, p.x)), z.surface + etat.d);
      } else {
        b.lieu = "paillasse";
        const y = p.y > 440 && p.y < 580 ? p.y : 560;
        if (y !== p.y) L.tomber(b.g, { ...b.pos }, { x: p.x, y }, () => b.placer(p.x, y));
        else b.placer(p.x, y);
      }
      (b.lieu === "paillasse" ? sur_paillasse : sur_mousse).append(b.g);
      enfoncer();
    }

    briques.forEach((b, i) => {
      b.lieu = "paillasse";
      b.placer(i === 0 ? 255 : 790, 525);
      L.glissable(b.g, {
        debut: () => (b.lieu === "mousse" && pile().length === 2 ? null : { ...b.pos }),
        saisir: () => { b.lieu = "main"; main.append(b.g); enfoncer(); },
        deplacer: (p) => b.placer(p.x, p.y),
        lacher: (p) => lacher(b, p),
        toucher: () => { if (!(b.lieu === "mousse" && pile().length === 2)) { b.tourner(); enfoncer(); } },
      });
    });
    return { pense_bete: L.decor.pense_bete(g, 24, 52, 230) };
  };
})(window.Labo);
