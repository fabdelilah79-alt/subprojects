/*
Rôle : paillasses des transferts d'énergie : (1) générateur 6,0 V, interrupteur, lampe 6 V – 0,1 A, moteur à treuil et
       électrolyseur, à brancher l'un après l'autre ; on note ce que chaque récepteur fait quand il est parcouru par le
       courant ; (2) tableau magnétique : appareils de la vie courante à classer selon la forme principale d'énergie utile.
Reçoit : le groupe SVG de chaque paillasse.
Produit : Labo.poste_recepteurs(g), Labo.poste_tri_energies(g) -> { pense_bete } ; Labo.APPAREILS_ENERGIE ; faits
          « recepteurs » = { lampe, moteur, electrolyseur (vrai quand l'effet a été observé) }, « tri_energies ».
Utilisé par : simulation.js.
*/
(function (L) {
  L.poste_recepteurs = function (g) {
    // Matériel de la paillasse 1 ; à chaque calcul du circuit, effets observés.
    const { pense_bete } = L.decor_circuit(g, 0), c = L.circuit(g);
    L.generateur(c, { x: 40, y: 196, E: 6, lettres: ["N", "P"] });
    const k = L.interrupteur(c, { id: "k", x: 260, y: 230 });
    const lampe = L.lampe(c, { id: "lampe", x: 380, y: 230, I_n: 0.1, etiquette: "L" });
    const e = L.electrolyseur(c, { x: 505, y: 250, E: 1.7, r: 8 });
    const m = L.moteur_treuil(c, { id: "moteur", x: 650, y: 470 });
    const vu = { lampe: false, moteur: false, electrolyseur: false };
    const noter = () => {
      if (k.ferme && lampe.eclat > 0.5) vu.lampe = true;
      if (k.ferme && m.h > 0.15) vu.moteur = true;
      if (k.ferme && Math.abs(e.i) > 0.05) vu.electrolyseur = true;
      L.missions.noter("recepteurs", { ...vu });
    };
    c.sur_calcul(noter);
    setInterval(noter, 500);
    c.calculer();
    return { pense_bete };
  };

  const E = (id, l1, l2, colonne) => ({ id, texte: [l1, l2], colonne });
  L.APPAREILS_ENERGIE = [
    E("lampe", "Lampe", "de bureau", 0), E("del", "Lampe", "à DEL", 0),
    E("radiateur", "Radiateur", "électrique", 1), E("fer", "Fer", "à repasser", 1),
    E("ventilateur", "Ventilateur", "", 2), E("perceuse", "Perceuse", "électrique", 2),
    E("electrolyseur", "Électrolyseur", "(soude)", 3), E("accu", "Batterie", "en charge", 3),
  ];

  L.poste_tri_energies = function (g) {
    // Décor de paillasse ordinaire et tableau magnétique à quatre colonnes.
    L.decor.paillasse(g, 1);
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230), ordre = [4, 0, 6, 2, 7, 5, 1, 3];
    L.tableau_tri(g, { x: 270, y: 30, largeur: 600, hauteur: 360, titre: "Forme principale de l'énergie utile", colonnes: [["rayonnement", "(lumière)"], ["thermique", "(chaleur)"], ["mécanique", ""], ["chimique", ""]], etiquettes: ordre.map((i) => L.APPAREILS_ENERGIE[i]), fait: "tri_energies", par_ligne: 6 });
    return { pense_bete };
  };
})(window.Labo);
