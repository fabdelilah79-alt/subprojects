/*
Rôle : paillasses de la synthèse de l'aspirine : (1) chauffage à reflux doux (chauffe-ballon réglé sur 65 °C, 20 min) de
       l'acide salicylique pesé (3,00 g, déjà dans le ballon sec) avec l'anhydride éthanoïque et quelques gouttes d'acide
       sulfurique (poste_synthese.js), contenu refroidi versé dans un bécher d'eau glacée où l'aspirine cristallise ;
       (2) filtration sous vide des cristaux (buchner_poste.js). Les pesées sont dans pesees_aspirine.js.
Reçoit : le groupe SVG de chaque paillasse.
Produit : Labo.poste_reflux_aspirine, Labo.poste_filtration_aspirine (groupe) -> { pense_bete } ; faits « reflux_aspirine »
          (poste_synthese.js ; recu : mL de suspension de cristaux), « filtration_aspirine » (buchner_poste.js).
Utilisé par : simulation.js.
*/
(function (L) {
  const SOL = 576, A = L.ASPIRINE, S = A.somme;

  L.poste_reflux_aspirine = L.poste_synthese({
    refrigerant_derriere: true,
    fait: "reflux_aspirine", T_eb: 140, T_consigne: 65, duree: 20, ballon_initial: { acide_salicylique: 3 / 1.44 }, reagir: A.acetyler, suivis: ["acide_salicylique", "anhydride_acetique", "ox_sulfurique", "brut_aspirine"],
    reactifs: [
      { id: "anhydride", x: 520, contenu: { anhydride_acetique: 6 }, texte: "anhydride 6,0 mL", pictos: ["SGH05", "SGH02"] },
    ],
    gouttes: { liquide: "ox_sulfurique", texte: "Acide\nsulfurique" },
    recepteur: { profil: "becher_250", contenu: { eau_glacee: 60 }, etiquette: "eau glacée" },
    evoluer_recepteur: (c, dt) => A.cristalliser(c, dt),
    mesure: (r) => S(r.c, "suspension_aspirine"),
  });

  L.poste_filtration_aspirine = function (g) {
    // Les cristaux d'aspirine dans l'eau glacée ; ils restent sur le papier, l'eau mère passe.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230), ctx = L.paillasse_chimie(g);
    L.ecoulement(ctx, { sol: SOL, e: 1.6 });
    L.filtration_buchner(ctx, { fait: "filtration_aspirine", melange: { contenu: { suspension_aspirine: 25 }, etiquette: "cristaux + eau" }, retenu: { suspension_aspirine: "eau_mere_aspirine" }, residu_rgb: [250, 250, 246] });
    return { pense_bete };
  };

})(window.Labo);
