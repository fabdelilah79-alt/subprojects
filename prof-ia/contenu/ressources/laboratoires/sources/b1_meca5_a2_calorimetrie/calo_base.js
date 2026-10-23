/*
Rôle : base commune des paillasses de calorimétrie : calorimètre (capacité thermique C = 150 J/K) contenant 200 g d'eau à
       une température donnée, thermomètre électronique, agitateur, bouton « Recommencer » (calorimètre vidé et rempli à
       nouveau, accessoires remis en place) ; détection des essais : après chaque ajout, l'essai est noté quand le
       mélange est à l'équilibre thermique depuis 2 s (température initiale θ1, température finale θe).
Reçoit : le groupe SVG de la paillasse et { theta (°C de l'eau du calorimètre), recommencer() (remise en place des
         accessoires) }.
Produit : Labo.calo_base(g, reglage) -> { v (modèle), vase (dessin), ajouter(infos), essais, tic(dt) }.
Utilisé par : postes_calorimetrie.js.
*/
(function (L) {
  const C_EAU = L.vase_modele.C_EAU, arrondi = (x) => Math.round(x * 10) / 10;

  L.calo_base = function (g, { theta, recommencer = () => {} }) {
    // Calorimètre rempli, afficheur, bouton Recommencer, suivi des essais.
    const v = L.vase_modele({ C: 150, pertes_s: 20000, ambiante: 20 });
    const remplir = () => { v.vider(theta); v.verser(200, C_EAU, theta, "eau"); };
    remplir();
    const vase = L.vase_dessin(g, v, { x: 430, base: 556, type: "calorimetre", afficheur: { x: 620, y: 300 } });
    const b = { v, vase, essais: [], ajout: null, stable: 0 };
    b.ajouter = (infos) => { b.ajout = { theta1: arrondi(v.theta), ...infos }; b.stable = 0; };
    b.tic = (dt) => {
      // Un pas de temps ; essai noté après 2 s d'équilibre.
      v.tic(dt);
      if (!b.ajout || !v.equilibre()) { b.stable = 0; return; }
      b.stable += dt;
      if (b.stable > 2) { b.essais.push({ ...b.ajout, thetae: arrondi(v.theta) }); b.ajout = null; }
    };
    L.bouton_texte(g, 620, 254, "Recommencer", () => { remplir(); b.ajout = null; recommencer(); });
    return b;
  };
})(window.Labo);
