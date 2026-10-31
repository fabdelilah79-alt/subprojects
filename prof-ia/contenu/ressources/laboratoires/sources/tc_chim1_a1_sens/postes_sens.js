/*
Rôle : paillasses de l'activité « les cinq sens » : (1) une orange sur une planche, un couteau, un presse-agrumes ;
       (2) une feuille de papier ; sur chacune, les cartes des cinq sens et une loupe.
Reçoit : le groupe SVG de chaque paillasse.
Produit : Labo.poste_orange, Labo.poste_papier (groupe) -> { pense_bete } ; faits notés « orange » = { coupee, jus },
          « sens_orange » et « sens_papier » = { objet : [sens] }, « papier » = { froisse }.
Utilisé par : simulation.js.
*/
(function (L) {
  const D = L.dessins_sens;
  const RIEN = "Rien de particulier : l'ouïe ne renseigne pas ici sur les espèces chimiques.";
  const OBS = {
    orange: { vue: "Une sphère orange ; la peau est granuleuse, percée de petits pores.", odorat: "Une légère odeur d'orange, plus forte quand on gratte la peau.", toucher: "Peau ferme ; un peu grasse quand on la gratte.", ouie: RIEN },
    pulpe: { vue: "Une pulpe orange en quartiers, faite de petits sacs pleins de jus ; un pépin.", odorat: "Une forte odeur d'orange.", toucher: "Humide et collant.", ouie: RIEN },
    peau: { vue: "Une peau orange vif, criblée de petits pores ; dessous, une couche blanche.", odorat: "Une odeur d'orange très forte quand on presse la peau.", toucher: "Un peu grasse : une huile sort des pores quand on la presse.", ouie: RIEN },
    jus: { vue: "Un liquide orange et trouble ; des débris de pulpe se déposent.", odorat: "Une odeur d'orange.", toucher: "Mouillé ; les doigts collent en séchant.", ouie: RIEN },
    papier: { vue: "Une feuille blanche, mince, opaque et mate.", odorat: "Aucune odeur.", toucher: "Sec, lisse et souple.", ouie: "Froissé, il fait un bruit sec : le papier est sec et un peu raide." },
  };
  const cible = (nom, titre, zone, loupe, action) => ({ nom, titre, obs: OBS[nom], zone, loupe, action });

  function couteau(g, etat, couper) {
    // Couteau déplaçable : posé sur l'orange entière, il la coupe en deux.
    const c = L.svg("g", { class: "couteau", role: "button", "aria-label": "Couteau" }, g), repos = { x: 570, y: 552 };
    D.couteau(c); L.placer(c, repos.x, repos.y, 3);
    L.glissable(c, { debut: () => ({ ...repos }), deplacer: (p) => L.placer(c, p.x, p.y, 3), lacher: (p) => { L.placer(c, repos.x, repos.y, 3); if (!etat.coupee && Math.hypot(p.x - 400, p.y - 428) < 70) couper(); } });
  }

  L.poste_orange = function (g) {
    // Paillasse 1 : observer l'orange entière, la couper, observer pulpe et peau, presser une moitié, observer le jus.
    D.degrades(g);
    L.affiche_securite(g, 780, 56);
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230), etat = { coupee: false, jus: false };
    D.planche(g, 230, 462);
    const g_presse = L.svg("g", {}, g), g_orange = L.svg("g", { class: "orange" }, g), g_peau = L.svg("g", {}, g), g_pulpe = L.svg("g", { class: "demi-orange", role: "button", "aria-label": "Demi-orange" }, g);
    const dessiner = () => {
      [g_presse, g_orange, g_peau, g_pulpe].forEach((e) => e.replaceChildren());
      D.presse(g_presse, 760, 482, etat.jus ? 1 : 0);
      L.missions.noter("orange", { ...etat });
      if (!etat.coupee) return D.orange(g_orange, 400, 428);
      D.demi_peau(g_peau, 500, 484);
      if (etat.jus) D.ecorce(g_peau, 320, 482); else D.demi_pulpe(g_pulpe, 320, 476);
    };
    couteau(g, etat, () => { etat.coupee = true; dessiner(); });
    L.glissable(g_pulpe, {
      debut: () => (etat.coupee && !etat.jus ? { x: 0, y: 0 } : null), deplacer: (p) => L.placer(g_pulpe, p.x, p.y),
      lacher: (p) => { L.placer(g_pulpe, 0, 0); if (Math.hypot(320 + p.x - 760, 476 + p.y - 440) < 70) { etat.jus = true; dessiner(); } },
    });
    dessiner();
    L.cartes_sens(g, {
      fait: "sens_orange", x: 250, y: 557, loupe: { x: 910, y: 430 },
      cibles: [
        cible("orange", "orange entière", () => (!etat.coupee ? { x: 400, y: 428, r: 60 } : null), "peau"),
        cible("pulpe", "pulpe", () => (etat.coupee && !etat.jus ? { x: 320, y: 476, r: 56 } : null), "pulpe"),
        cible("peau", "peau", () => (etat.coupee ? { x: 500, y: 460, r: 56 } : null), "peau"),
        cible("jus", "jus", () => (etat.jus ? { x: 760, y: 470, r: 74 } : null), "jus"),
      ],
    });
    return { pense_bete };
  };

  L.poste_papier = function (g) {
    // Paillasse 2 : une feuille de papier ; l'ouïe la froisse.
    L.affiche_securite(g, 780, 56);
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230), feuille = L.svg("g", { class: "papier" }, g), etat = { froisse: false };
    const dessiner = () => { feuille.replaceChildren(); D.papier(feuille, 470, 470, etat.froisse); L.missions.noter("papier", { ...etat }); };
    dessiner();
    L.cartes_sens(g, {
      fait: "sens_papier", x: 250, y: 557, loupe: { x: 910, y: 430 },
      cibles: [cible("papier", "papier", () => ({ x: 470, y: 470, r: 120 }), "papier", { ouie: () => { etat.froisse = true; dessiner(); } })],
    });
    return { pense_bete };
  };
})(window.Labo);
