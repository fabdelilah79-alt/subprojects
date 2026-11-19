/*
Rôle : paillasse « documents sur la lunette » : quatre documents au mur (Galilée, objectif et oculaire, diamètre apparent et
       grossissement, cercle oculaire) et un tableau magnétique où l'on range les rôles de l'objectif et de l'oculaire.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_documents_lunette(g) -> { pense_bete } ; faits « docs_lunette » = [numéros lus], « tri_lunette » = { étiquette : colonne } ;
          Labo.TRI_LUNETTE (étiquettes et colonnes attendues).
Utilisé par : simulation.js.
*/
(function (L) {
  const doc = (k, titre, texte) => ({ x: 336 + k * 138, y: 10, l: 132, h: 150, taille: 3.6, titre, texte });
  const DOCS = [
    doc(0, "Galilée et la lunette (1609)", "En 1609, Galilée construit une lunette et la tourne vers le ciel : il découvre les montagnes de la Lune, quatre satellites de Jupiter, les phases de Vénus et une multitude d'étoiles invisibles à l'œil nu. En 1611, Kepler propose la lunette astronomique, faite de deux lentilles convergentes. Aujourd'hui, lunettes et télescopes, sur Terre ou dans l'espace, nous montrent des galaxies très lointaines : l'optique a changé notre vision de l'Univers."),
    doc(1, "Objectif et oculaire", "Une lunette astronomique comporte deux lentilles convergentes de même axe. L'objectif, de grande distance focale, est tourné vers l'astre : il donne de cet objet très éloigné une image réelle et renversée A1B1, dans son plan focal image. L'oculaire, de petite distance focale, joue le rôle d'une loupe : l'œil, placé derrière lui, observe l'image A1B1. Quand le foyer image F'1 de l'objectif et le foyer objet F2 de l'oculaire sont confondus, la lunette est afocale : l'image finale est à l'infini et l'œil la voit sans fatigue."),
    doc(2, "Diamètre apparent et grossissement", "Le diamètre apparent α d'un objet est l'angle sous lequel on le voit. Pour un objet de taille AB, à la distance d, α ≈ AB / d (en radians). La Lune (3 474 km de diamètre, à 384 000 km) a un diamètre apparent α ≈ 9 × 10⁻³ rad, environ un demi-degré. Le grossissement d'un instrument est G = α' / α, où α' est le diamètre apparent de l'image vue dans l'instrument. Pour une lunette afocale : G = f'1 / f'2. Le grossissement commercial d'une loupe ou d'un oculaire est Gc = C / 4 (vergence C en dioptries)."),
    doc(3, "Le cercle oculaire", "Toute la lumière qui entre dans l'objectif ressort de l'oculaire en passant par un petit disque situé un peu après lui : le cercle oculaire. C'est l'image de la monture de l'objectif donnée par l'oculaire. On le voit sur une feuille de papier placée derrière l'oculaire : la tache de lumière y est la plus petite. C'est là qu'il faut placer l'œil : il reçoit toute la lumière et voit tout le champ de l'instrument. Si l'œil est trop près ou trop loin, le champ visible se rétrécit."),
  ];
  const e = (id, l1, l2, colonne) => ({ id, texte: [l1, l2], colonne });
  const ETIQUETTES = [
    e("grande", "grande distance", "focale", 0), e("astre", "tourné vers", "l'astre", 0), e("a1b1", "donne l'image A1B1", "de l'astre", 0),
    e("petite", "petite distance", "focale", 1), e("loupe", "joue le rôle", "d'une loupe", 1), e("oeil", "l'œil se place", "derrière lui", 1),
  ];

  L.poste_documents_lunette = function (g) {
    // Décor, tableau de tri, documents au mur.
    const { pense_bete } = L.decor_circuit(g, 0);
    L.tableau_tri(g, { x: 232, y: 196, largeur: 560, hauteur: 300, titre: "Rôle de chaque lentille", colonnes: [["L'objectif", ""], ["L'oculaire", ""]], etiquettes: ETIQUETTES, fait: "tri_lunette" });
    L.documents_mur(g, DOCS, "docs_lunette");
    return { pense_bete };
  };
  L.TRI_LUNETTE = ETIQUETTES;
})(window.Labo);
