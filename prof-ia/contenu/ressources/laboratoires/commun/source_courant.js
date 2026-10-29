/*
Rôle : générateur de courant (sans étude de son fonctionnement) : il débite une intensité constante I réglable (0,05 à
       0,5 mA), quelle que soit la tension à ses bornes, jusqu'à 24 V ; au-delà, il ne peut plus monter (voyant « U max »).
       Touche « I » pour choisir l'intensité, touche Marche/Arrêt ; cordon secteur branché au mur ; bornes + (rouge) et −.
Reçoit : le circuit et { id, x, y, valeurs [A], I (A) }.
Produit : Labo.source_courant(c, reglage) -> comp { I, marche, sature } ; bornes « + », « − » ; fait « <id> » = { I, marche }.
Utilisé par : les simulations du dipôle RC (charge à courant constant).
*/
(function (L) {
  const U_MAX = 24;

  function boitier(g, x, y) {
    // Boîtier, plaque du nom, afficheur de l'intensité, voyant « U max ».
    L.boitier(g, x, y, 190, 78, 34, { dessus: "#d7cfc0", face: "#7a6e5a" });
    L.svg("rect", { x: x + 10, y: y + 9, width: 96, height: 13, rx: 2, fill: "#4a3f2f" }, g);
    L.texte(g, x + 58, y + 16, "GÉNÉRATEUR DE COURANT", { "font-size": 6.5, fill: "#f4eedd", "font-weight": 700 });
    L.svg("rect", { x: x + 112, y: y + 6, width: 70, height: 24, rx: 2, fill: "#10251a", stroke: "#071209" }, g);
    L.texte(g, x + 132, y + 66, "U max", { "font-size": 6.5, fill: "#3a3226", "font-weight": 700 });
    L.texte(g, x + 166, y + 46, "+", { "font-size": 13, "font-weight": 700, fill: L.ROUGE_BORNE });
    L.texte(g, x + 24, y + 46, "−", { "font-size": 15, "font-weight": 700, fill: "#222" });
    return { ecran: L.svg("g", {}, g), voyant: L.svg("circle", { cx: x + 132, cy: y + 54, r: 4, fill: "#4a1712" }, g) };
  }

  L.source_courant = function (c, { id = "source", x, y, valeurs = [5e-5, 1e-4, 2e-4, 5e-4], I = 1e-4 }) {
    // Dessin, touches, bornes ; modèle : source de courant I (de − vers + à l'intérieur), tension limitée à 24 V.
    const comp = { id, I, marche: false, sature: false, g: L.svg("g", { class: "source-courant" }, c.calque_composants) };
    L.cordon_secteur(comp.g, { x: x + 172, y: y + 24 }, c.prise());
    const vue = boitier(comp.g, x, y), dipole = { a: "−", b: "+", g: 1e-9, j: I };
    const afficher = () => { vue.ecran.replaceChildren(); L.texte(vue.ecran, x + 147, y + 23, comp.marche ? `${String(comp.I * 1000).replace(".", ",")} mA` : "", { "font-size": 12, "font-weight": 700, fill: "#5cf08a", "font-family": "monospace" }); vue.voyant.setAttribute("fill", comp.sature ? "#ff5a3c" : "#4a1712"); L.missions.noter(id, { I: comp.I, marche: comp.marche }); };
    const regler = () => { comp.sature = false; Object.assign(dipole, { g: 1e-9, j: comp.I }); afficher(); c.calculer(); };
    L.bouton_rond(comp.g, x + 70, y + 46, "I", () => { comp.I = valeurs[(valeurs.indexOf(comp.I) + 1) % valeurs.length]; regler(); }, 10);
    L.bouton_rond(comp.g, x + 100, y + 46, "I/O", () => { comp.marche = !comp.marche; regler(); }, 10);
    dipole.ajuster = (u, i) => {
      // Tension trop grande : le générateur la limite à 24 V ; tension redescendue sous 23,5 V : il redevient source de courant.
      if (!comp.sature && -u > U_MAX) { comp.sature = true; Object.assign(dipole, { g: 0.1, j: U_MAX * 0.1 }); return true; }
      if (comp.sature && -u < U_MAX - 0.5) { comp.sature = false; Object.assign(dipole, { g: 1e-9, j: comp.I }); return true; }
      return false;
    };
    c.borne(comp, "−", x + 24, y + 62, L.NOIR_BORNE); c.borne(comp, "+", x + 166, y + 62, L.ROUGE_BORNE);
    comp.dipoles = () => (comp.marche ? [dipole] : []);
    comp.mettre_a_jour = () => vue.voyant.setAttribute("fill", comp.sature ? "#ff5a3c" : "#4a1712");
    afficher();
    return c.ajouter(comp);
  };
})(window.Labo);
