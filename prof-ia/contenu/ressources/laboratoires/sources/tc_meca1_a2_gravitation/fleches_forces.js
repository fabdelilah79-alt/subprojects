/*
Rôle : flèches-forces aimantées posées sur le bord du poste d'observation : F_{S/T}, F_{T/S}, F_{T/L}.
       L'élève pose chaque flèche sur l'astre qui SUBIT l'action ; elle devient alors un vecteur, d'origine le centre
       de cet astre, dirigé vers l'astre qui l'attire, et elle suit le mouvement. Sur un mauvais astre, elle revient.
Reçoit : le groupe de la scène, le calque des vecteurs ; les positions des astres (annonce « astres »).
Produit : Labo.fleches_forces(groupe, calque) ; Labo.FLECHES_FORCES ; faits : fleches_placees, fleche_erreur.
Utilisé par : poste_systeme_solaire.js, simulation.js.
*/
(function (L) {
  const COULEURS = { rouge: "#e8513f", bleue: "#4d9bff" };
  const FLECHES = [
    { id: "s_t", nom: "F_{S/T}", sur: "terre", vers: "soleil", longueur: 112, couleur: "rouge", explication: "F_{S/T} est l'action du Soleil sur la Terre." },
    { id: "t_s", nom: "F_{T/S}", sur: "soleil", vers: "terre", longueur: 112, couleur: "rouge", explication: "F_{T/S} est l'action de la Terre sur le Soleil." },
    { id: "t_l", nom: "F_{T/L}", sur: "lune", vers: "terre", longueur: 30, couleur: "bleue", explication: "F_{T/L} est l'action de la Terre sur la Lune." },
  ];

  function carte(parent, f) {
    // Flèche aimantée : plaquette blanche, flèche colorée et son nom.
    const g = L.svg("g", { class: "fleche-aimantee", filter: "url(#ombre)" }, parent);
    L.svg("rect", { x: -38, y: -15, width: 76, height: 30, rx: 3, fill: "#fdfdf8", stroke: "#b9bdb5", "stroke-width": 0.8 }, g);
    L.svg("line", { x1: -30, y1: 3, x2: -2, y2: 3, stroke: COULEURS[f.couleur], "stroke-width": 3, "marker-end": `url(#fleche-${f.couleur})` }, g);
    L.texte_exposants(g, 4, 0, f.nom, { "font-size": 14, "font-weight": 700, fill: "#1f2a44" });
    return g;
  }

  function vecteur(calque, f, a) {
    // Vecteur force : origine au centre de l'astre qui subit l'action, vers l'astre qui l'exerce.
    const de = a[f.sur], vers = a[f.vers];
    const d = Math.hypot(vers.x - de.x, vers.y - de.y) || 1, ux = (vers.x - de.x) / d, uy = (vers.y - de.y) / d;
    const bout = { x: de.x + ux * f.longueur, y: de.y + uy * f.longueur };
    L.svg("line", { x1: de.x, y1: de.y, x2: bout.x, y2: bout.y, stroke: COULEURS[f.couleur], "stroke-width": 2.6, "marker-end": `url(#fleche-${f.couleur})` }, calque);
    L.svg("circle", { cx: de.x, cy: de.y, r: 2.2, fill: COULEURS[f.couleur] }, calque);
    L.texte_exposants(calque, bout.x - uy * 16 - 14, bout.y + ux * 16, f.nom, { "font-size": 14, "font-weight": 700, fill: "#ffffff" });
  }

  L.fleches_forces = function (g, calque) {
    // Plateau des flèches et règles du dépôt.
    const plateau = L.svg("g", {}, g);
    L.svg("path", { d: "M236 574 H498 L504 586 H230 Z", fill: "url(#bois)" }, plateau);
    L.svg("rect", { x: 230, y: 586, width: 274, height: 12, fill: "url(#bois-face)" }, plateau);
    const placees = {};
    let derniers = null;
    const redessiner = (a) => { derniers = a; calque.replaceChildren(); FLECHES.filter((f) => placees[f.id]).forEach((f) => vecteur(calque, f, a)); };
    L.ecouter("astres", redessiner);
    FLECHES.forEach((f, i) => {
      const depart = { x: 280 + i * 86, y: 572 };
      const c = carte(g, f);
      L.placer(c, depart.x, depart.y);
      L.glissable(c, {
        debut: () => (placees[f.id] ? null : { ...depart }),
        deplacer: (p) => L.placer(c, p.x, p.y),
        lacher: (p) => {
          const ecart = (n) => Math.hypot(p.x - derniers[n].x, p.y - derniers[n].y) - derniers[n].r;
          const touche = ["soleil", "terre", "lune"].filter((n) => ecart(n) < 14).sort((a, b) => ecart(a) - ecart(b))[0];
          if (touche === f.sur) { placees[f.id] = true; c.style.display = "none"; redessiner(derniers); L.missions.noter("fleche_erreur", null); }
          else {
            L.tomber(c, p, depart);
            if (touche) L.missions.noter("fleche_erreur", `${f.explication} Posez-la sur l'astre qui subit cette action.`);
          }
          L.missions.noter("fleches_placees", { ...placees });
        },
      });
    });
  };

  L.FLECHES_FORCES = FLECHES;
})(window.Labo);
