/*
Rôle : paillasses de l'activité 3 : (1) inventaire des espèces trouvées dans l'orange et dans le papier (tableau à
       classer, flacons des tests) ; (2) naturelle, synthétique ou artificielle ? (étiquettes de six produits, tableau à
       trois colonnes) ; (3) documents sur l'industrie chimique.
Reçoit : le groupe SVG de chaque paillasse.
Produit : Labo.poste_inventaire, Labo.poste_origine, Labo.poste_documents (groupe) -> { pense_bete } ;
          Labo.ETIQUETTES_A3 = { inventaire, origine } ; faits « tri_inventaire », « tri_origine », « etiquettes_lues », « documents_lus ».
Utilisé par : simulation.js.
*/
(function (L) {
  const INVENTAIRE = [
    { id: "eau", texte: ["eau", "(sulfate de cuivre)"], colonne: 0 },
    { id: "glucose", texte: ["glucose", "(liqueur de Fehling)"], colonne: 0 },
    { id: "acide", texte: ["espèce acide", "(papier pH)"], colonne: 0 },
    { id: "huile", texte: ["huile odorante", "(odorat, loupe)"], colonne: 0 },
    { id: "amidon", texte: ["amidon", "(eau iodée)"], colonne: 1 },
    { id: "cellulose", texte: ["cellulose", "(loupe)"], colonne: 1 },
  ];
  const ORIGINE = [
    { id: "vanilline_gousse", texte: ["vanilline", "de la gousse"], colonne: 0 },
    { id: "ascorbique_citron", texte: ["acide ascorbique", "du citron"], colonne: 0 },
    { id: "vanilline_sucre", texte: ["vanilline du", "sucre vanilliné"], colonne: 1 },
    { id: "ascorbique_comprime", texte: ["acide ascorbique", "du comprimé"], colonne: 1 },
    { id: "nylon", texte: ["nylon", "du fil de pêche"], colonne: 2 },
    { id: "aspirine", texte: ["acide acétyl-", "salicylique"], colonne: 2 },
  ];
  L.ETIQUETTES_A3 = { inventaire: INVENTAIRE, origine: ORIGINE };
  const melanger = (liste) => [3, 0, 5, 1, 4, 2].map((k) => ({ ...liste[k] }));

  L.poste_inventaire = function (g) {
    // Paillasse 1 : tableau « dans l'orange / dans le papier » ; les flacons des tests rappellent l'activité 2.
    L.affiche_securite(g, 780, 56);
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230);
    L.tableau_tri(g, { x: 300, y: 40, largeur: 440, hauteur: 330, titre: "Inventaire des espèces trouvées", colonnes: ["Dans l'orange", "Dans le papier"], etiquettes: melanger(INVENTAIRE), fait: "tri_inventaire" });
    [["Eau\niodée", 330, "eau_iodee"], ["Liqueur de\nFehling", 400, "fehling"], ["Phénol-\nphtaléine", 470, "phenolphtaleine"]].forEach(([t, x, r]) => L.verrerie.flacon(L.svg("g", {}, g), x, 500, t, { liquide: L.rgb(L.CHIMIE.reactifs[r].rgb), bouchon: true }));
    return { pense_bete };
  };

  L.poste_origine = function (g) {
    // Paillasse 2 : lire les étiquettes des produits, puis classer chaque espèce selon son origine.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230);
    L.tableau_tri(g, { x: 270, y: 30, largeur: 600, hauteur: 350, titre: "Origine des espèces chimiques", colonnes: [["Naturelle", "(extraite de la nature)"], ["Synthétique, identique", "à une espèce naturelle"], ["Synthétique artificielle", "(absente de la nature)"]], etiquettes: melanger(ORIGINE), fait: "tri_origine" });
    L.produits_etiquettes(g, "etiquettes_lues");
    return { pense_bete };
  };

  L.poste_documents = function (g) {
    // Paillasse 3 : deux documents à lire.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230);
    L.documents_industrie(g, "documents_lus");
    return { pense_bete };
  };
})(window.Labo);
