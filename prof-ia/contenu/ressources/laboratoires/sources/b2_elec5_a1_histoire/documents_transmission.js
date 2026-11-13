/*
Rôle : deux paillasses de documents : « histoire de la transmission de l'information » (quatre documents au mur, tableau
       magnétique où l'on range huit moyens de communication selon ce qui porte l'information) et « les bandes de
       fréquences » (un document, tableau où l'on range huit services selon leur bande de fréquences).
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_histoire(g), Labo.poste_bandes(g) -> { pense_bete } ; faits « docs_histoire », « tri_histoire »,
          « docs_bandes », « tri_bandes » ; Labo.TRI_TRANSMISSION = { histoire, bandes } (étiquettes et colonnes attendues).
Utilisé par : simulation.js.
*/
(function (L) {
  const doc = (k, titre, texte) => ({ x: 262 + k * 148, y: 40, l: 140, h: 190, taille: 4, titre, texte });
  const DOCS = [
    doc(0, "Sans électricité", "Depuis l'Antiquité, on transmet des messages à distance par des signaux de fumée, des feux, des tambours ou des pigeons voyageurs. En 1794, Claude Chappe met en service le télégraphe optique : des bras articulés, placés sur des tours distantes d'une dizaine de kilomètres, forment des signes que chaque tour recopie. Un message traverse la France en quelques heures, mais seulement de jour et par beau temps."),
    doc(1, "Le courant dans des fils", "En 1838, Samuel Morse invente un télégraphe électrique et son code (points et traits) : l'information est portée par un courant dans un fil. Le premier câble télégraphique sous l'Atlantique fonctionne en 1866. En 1876, Graham Bell fait breveter le téléphone : la voix est transformée en un courant variable qui parcourt les fils. Il faut un fil entre l'émetteur et le récepteur."),
    doc(2, "Les ondes de Hertz", "En 1864, James Clerk Maxwell prévoit l'existence d'ondes électromagnétiques qui se propagent dans le vide à la vitesse de la lumière, c ≈ 3,0 × 10⁸ m/s. En 1887, Heinrich Hertz les produit avec des étincelles et les détecte à quelques mètres. En 1890, Édouard Branly invente un détecteur, le cohéreur ; Alexandre Popov utilise une antenne. Une onde électromagnétique transporte de l'énergie, sans transport de matière."),
    doc(3, "De la TSF à nos jours", "En 1896, Guglielmo Marconi réalise la télégraphie sans fil (TSF) ; en 1901, un message traverse l'Atlantique. Dans les années 1920, la radio en modulation d'amplitude transmet la voix et la musique ; puis viennent la télévision, les satellites de télécommunication (1962) et le téléphone portable. Le son (20 Hz à 20 kHz) n'est pas émis directement : il est confié à une onde porteuse de haute fréquence, qui demande une antenne de taille raisonnable."),
  ];
  const BANDES = [{ x: 262, y: 40, l: 580, h: 190, taille: 4.6, titre: "Les bandes de fréquences", texte: "Toutes les ondes électromagnétiques se propagent dans le vide à la même vitesse c ≈ 3,0 × 10⁸ m/s ; leur longueur d'onde vaut λ = c / f. Pour que les émetteurs ne se brouillent pas, les fréquences sont partagées par des accords internationaux (Union internationale des télécommunications) : chaque service reçoit sa bande. Radio en modulation d'amplitude : grandes ondes (GO, 150 à 285 kHz) et petites ondes (PO, 526 à 1 606 kHz) ; radio FM : 87,5 à 108 MHz ; radioamateurs et cibistes : vers 27 MHz ; talkies-walkies : 446 MHz ; télévision numérique terrestre : 470 à 790 MHz ; téléphones portables : 0,7 à 2,6 GHz ; Wi-Fi : 2,4 et 5 GHz. Les grandes ondes portent loin ; les hautes fréquences permettent de transmettre beaucoup d'informations avec de petites antennes." }];
  const e = (id, l1, l2, colonne) => ({ id, texte: [l1, l2], colonne });
  const HISTOIRE = [
    e("fumee", "Signaux de fumée", "(Antiquité)", 0), e("chappe", "Télégraphe de Chappe", "(1794)", 0),
    e("morse", "Télégraphe Morse", "(1838)", 1), e("cable", "Câble sous l'Atlantique", "(1866)", 1),
    e("bell", "Téléphone de Bell", "(1876)", 1), e("tsf", "TSF de Marconi", "(1896)", 2),
    e("radio", "Radio AM", "(années 1920)", 2), e("portable", "Téléphone portable", "(années 1990)", 2),
  ];
  const SERVICES = [
    e("go", "Radio grandes ondes", "150 à 285 kHz", 0), e("po", "Radio petites ondes", "526 à 1 606 kHz", 0),
    e("fm", "Radio FM", "87,5 à 108 MHz", 1), e("cb", "Cibistes", "27 MHz", 1),
    e("tnt", "Télévision numérique", "470 à 790 MHz", 2), e("pmr", "Talkie-walkie", "446 MHz", 2),
    e("gsm", "Téléphone portable", "0,7 à 2,6 GHz", 3), e("wifi", "Wi-Fi", "2,4 et 5 GHz", 3),
  ];
  L.TRI_TRANSMISSION = { histoire: HISTOIRE, bandes: SERVICES };

  L.poste_histoire = function (g) {
    // Pense-bête, documents, tableau de tri chronologique.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230);
    L.tableau_tri(g, { x: 232, y: 262, largeur: 600, hauteur: 300, titre: "Qu'est-ce qui porte l'information ?", colonnes: [["Signaux visibles", "ou sonores"], ["Courant dans", "des fils"], ["Ondes", "électromagnétiques"]], etiquettes: HISTOIRE, fait: "tri_histoire", par_ligne: 4 });
    L.documents_mur(g, DOCS, "docs_histoire");
    return { pense_bete };
  };

  L.poste_bandes = function (g) {
    // Pense-bête, document des bandes de fréquences, tableau de tri.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230);
    L.tableau_tri(g, { x: 232, y: 262, largeur: 600, hauteur: 300, titre: "Dans quelle bande de fréquences ?", colonnes: [["Kilohertz", "(radio AM)"], ["Dizaines", "de MHz"], ["Centaines", "de MHz"], ["Gigahertz", ""]], etiquettes: SERVICES, fait: "tri_bandes", par_ligne: 4 });
    L.documents_mur(g, BANDES, "docs_bandes");
    return { pense_bete };
  };
})(window.Labo);
