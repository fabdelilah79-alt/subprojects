/*
Rôle : paillasse « histoire du modèle de l'atome » : cinq documents au mur (Démocrite et Dalton, Thomson, Rutherford,
       Bohr, Chadwick), chacun illustré, et un tableau magnétique où l'on range les découvertes par époque (objectif O1 :
       rechercher et trier l'information).
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_histoire(groupe) -> { pense_bete } ; faits « docs_atome » = [numéros lus] et « tri_atome » = { étiquette : colonne }.
Utilisé par : simulation.js.
*/
(function (L) {
  const D = L.DESSINS_ATOME, doc = (k, titre, dessin, texte) => ({ x: 262 + k * 150, y: 40, l: 140, h: 200, taille: 4.3, titre, dessin, texte });
  const DOCS = [
    doc(0, "Démocrite et Dalton", D.dalton, "Vers 400 avant J.-C., le philosophe grec Démocrite imagine que la matière est faite de grains minuscules et insécables, qu'il appelle atomos (« que l'on ne peut pas couper »). C'est une idée, sans expérience. En 1808, le chimiste anglais John Dalton reprend cette idée pour expliquer les réactions chimiques : chaque élément est fait d'atomes identiques, des sphères pleines et indivisibles ; les atomes de deux éléments différents n'ont pas la même masse."),
    doc(1, "Thomson : l'électron (1897)", D.thomson, "En 1897, l'Anglais Joseph John Thomson montre que les rayons cathodiques sont faits de particules de charge négative, environ 2 000 fois plus légères que l'atome d'hydrogène, et présentes dans toute matière : les électrons. L'atome n'est donc pas indivisible. Comme la matière est électriquement neutre, Thomson propose en 1904 un modèle : une sphère pleine chargée positivement, dans laquelle les électrons sont dispersés comme les raisins dans un pudding."),
    doc(2, "Rutherford : le noyau (1911)", D.rutherford, "En 1909, Geiger et Marsden, élèves d'Ernest Rutherford, envoient des particules alpha sur une très mince feuille d'or. Presque toutes la traversent sans être déviées ; quelques-unes sont fortement déviées, et environ une sur 8 000 repart en arrière. Rutherford en déduit en 1911 que l'atome est presque vide (structure lacunaire) : toute sa charge positive et presque toute sa masse sont concentrées dans un noyau minuscule, environ 100 000 fois plus petit que l'atome ; les électrons se déplacent autour."),
    doc(3, "Bohr et le proton (1913-1919)", D.bohr, "En 1913, le Danois Niels Bohr précise la place des électrons : ils se répartissent sur des couches autour du noyau, notées K, L, M… en partant du noyau. En 1919, Rutherford montre que le noyau contient des particules de charge positive, les protons. La charge d'un proton vaut +e, celle d'un électron −e, avec e = 1,6 × 10⁻¹⁹ C (la charge élémentaire). Un atome a autant d'électrons que de protons : il est électriquement neutre."),
    doc(4, "Chadwick : le neutron (1932)", D.chadwick, "En 1932, l'Anglais James Chadwick découvre dans le noyau une particule sans charge électrique, de masse très voisine de celle du proton : le neutron. Protons et neutrons sont appelés les nucléons. Ordres de grandeur : le diamètre d'un atome est d'environ 10⁻¹⁰ m, celui de son noyau d'environ 10⁻¹⁵ m. La masse d'un nucléon (1,67 × 10⁻²⁷ kg) est environ 1 800 fois plus grande que celle d'un électron (9,1 × 10⁻³¹ kg)."),
  ];
  const e = (id, l1, l2, colonne) => ({ id, texte: [l1, l2], colonne });
  const ETIQUETTES = [
    e("democrite", "Démocrite :", "atomos, insécable", 0), e("dalton", "Dalton : sphère", "pleine, indivisible", 0),
    e("electron", "Thomson : découverte", "de l'électron", 1), e("noyau", "Rutherford : un", "noyau minuscule", 1),
    e("couches", "Bohr : électrons", "sur des couches", 2), e("neutron", "Chadwick :", "le neutron", 2),
  ];

  L.poste_histoire = function (g) {
    // Documents au mur et tableau de tri par époque.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230);
    L.tableau_tri(g, { x: 262, y: 262, largeur: 560, hauteur: 290, titre: "Rangez les découvertes par époque", colonnes: [["Avant", "1897"], ["De 1897", "à 1911"], ["De 1912", "à 1932"]], etiquettes: ETIQUETTES, fait: "tri_atome" });
    L.documents_mur(g, DOCS, "docs_atome");
    return { pense_bete };
  };
  L.TRI_ATOME = ETIQUETTES;
})(window.Labo);
