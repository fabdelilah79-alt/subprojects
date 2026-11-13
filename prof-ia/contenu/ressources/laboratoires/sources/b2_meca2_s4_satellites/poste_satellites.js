/*
Rôle : paillasse « satellites et planètes » : quatre documents au mur (référentiels héliocentrique et géocentrique, de Ptolémée
       à Newton, les trois lois de Kepler, données sur les planètes et sur la Terre) et, sur la paillasse, le portable où tourne
       le simulateur d'orbites (onglets « Terre – satellite » et « Soleil – planète », aires de Kepler, rotation de la Terre).
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_satellites(g) -> { pense_bete } ; faits « documents_satellites » (documents lus), « lancers », « simulateur ».
Utilisé par : simulation.js.
*/
(function (L) {
  const DOCUMENTS = [
    { x: 22, y: 160, l: 172, h: 112, titre: "Référentiels", texte: "Référentiel héliocentrique : origine au centre du Soleil, trois axes dirigés vers trois étoiles lointaines ; il convient au mouvement des planètes. Référentiel géocentrique : origine au centre de la Terre, axes parallèles à ceux du référentiel héliocentrique (il est en translation par rapport à lui) ; il convient au mouvement de la Lune et des satellites. Tous deux sont considérés comme galiléens." },
    { x: 202, y: 160, l: 172, h: 112, titre: "De Ptolémée à Newton", texte: "Ptolémée (IIe siècle) place la Terre immobile au centre du monde. Copernic (1543) place le Soleil au centre. Kepler, à partir des mesures de Tycho Brahe sur Mars, énonce ses deux premières lois en 1609 et la troisième en 1619. Newton (1687) les explique par la gravitation universelle : F = G·m·m′/r²." },
    { x: 22, y: 280, l: 172, h: 112, titre: "Les trois lois de Kepler", texte: "1. Dans le référentiel héliocentrique, chaque planète décrit une ellipse dont le Soleil occupe un foyer. 2. Le segment Soleil-planète balaie des aires égales pendant des durées égales. 3. Pour toutes les planètes, T² / a³ a la même valeur (a : demi-grand axe, rayon pour une orbite circulaire)." },
    { x: 202, y: 280, l: 172, h: 112, titre: "Données", texte: "Planètes (a en UA ; T en jours) : Mercure 0,387 ; 87,97. Vénus 0,723 ; 224,7. Terre 1,000 ; 365,25. Mars 1,524 ; 687,0. Jupiter 5,203 ; 4 332,6. Saturne 9,537 ; 10 759. 1 UA = 1,496 × 10¹¹ m ; 1 j = 86 400 s ; G = 6,67 × 10⁻¹¹ SI. Terre : M = 5,97 × 10²⁴ kg ; R = 6 371 km ; jour sidéral 86 164 s." },
  ];

  L.poste_satellites = function (g) {
    // Portable et simulateur, puis documents au mur (un document ouvert passe devant le portable).
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230);
    const dalle = L.portable(g, { x: 384, y: 34, l: 620, h: 372, titre: "Simulateur d'orbites — mécanique de Newton" });
    L.logiciel_orbites(g, dalle, { modes: ["soleil", "terre"] });
    L.documents_mur(g, DOCUMENTS, "documents_satellites");
    L.missions.noter("documents_satellites", []);
    return { pense_bete };
  };
})(window.Labo);
