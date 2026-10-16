/*
Rôle : générateur de tension continue (alimentation de laboratoire) : tension E fixe, petite résistance interne ;
       il limite son courant (voyant « LIMIT ») en cas de court-circuit. Son afficheur montre la tension à ses bornes.
       Un bouton Marche/Arrêt (en marche au départ) ; son cordon secteur est branché dans la prise du mur par une fiche.
Reçoit : le circuit (circuit.js) et le réglage { id, x, y, E (V), r (Ω), I_max (A), lettres (noms des bornes − et +, ex. ["N", "P"]) }.
Produit : Labo.generateur(circuit, reglage) -> composant { id, E, i (courant débité, A) } ; bornes « + » (rouge) et « − » (noire) ;
          fait noté « court_circuit » quand le courant est limité.
Utilisé par : les postes des simulations d'électricité.
*/
(function (L) {
  function interrupteur_secteur(g, x, y, comp, basculer) {
    // Bouton Marche/Arrêt à bascule sur la face avant, avec son voyant vert ; un toucher le bascule.
    const b = L.svg("g", { class: "marche-arret", role: "button", "aria-label": "Marche / Arrêt" }, g);
    const dessiner = () => {
      b.replaceChildren();
      L.svg("rect", { x: x + 146, y: y + 84, width: 30, height: 20, rx: 2, fill: "#1c1f22" }, b);
      L.svg("rect", { x: x + 149, y: y + 86, width: 24, height: 16, rx: 1.5, fill: comp.marche ? "#c9302c" : "#7a1d1a" }, b);
      L.svg("rect", { x: x + 149, y: comp.marche ? y + 86 : y + 94, width: 24, height: 8, fill: "#fff", opacity: 0.18 }, b);
      L.texte(b, x + 161, y + 94, comp.marche ? "I" : "O", { "font-size": 9, "font-weight": 700, fill: "#fff" });
      L.svg("circle", { cx: x + 136, cy: y + 94, r: 3, fill: comp.marche ? "#5cf08a" : "#1d3a24" }, b);
    };
    L.glissable(b, { soulever: false, debut: () => ({ x, y }), toucher: () => { basculer(); dessiner(); } });
    dessiner();
  }

  function dessiner(g, x, y) {
    // Boîtier bleu-gris : plaque, afficheur vert, voyant de limitation, grille d'aération.
    L.boitier(g, x, y, 190, 78, 34, { dessus: "#c9d3da", face: "#5f7383" });
    L.svg("rect", { x: x + 10, y: y + 9, width: 84, height: 13, rx: 2, fill: "#2c3e50" }, g);
    L.texte(g, x + 52, y + 16, "GÉNÉRATEUR =", { "font-size": 7.5, fill: "#e6eef4", "font-weight": 700, "letter-spacing": 0.6 });
    L.svg("rect", { x: x + 104, y: y + 6, width: 76, height: 24, rx: 2, fill: "#10251a", stroke: "#071209" }, g);
    const afficheur = L.texte(g, x + 160, y + 19, "", { "text-anchor": "end", "font-size": 15, "font-family": "monospace", "font-weight": 700, fill: "#5cf08a" });
    L.texte(g, x + 171, y + 19, "V", { "font-size": 10, "font-weight": 700, fill: "#5cf08a" });
    const voyant = L.svg("circle", { cx: x + 95, cy: y + 50, r: 4, fill: "#4a1712" }, g);
    L.texte(g, x + 95, y + 62, "LIMIT", { "font-size": 6.5, fill: "#2c3e50", "font-weight": 700 });
    for (let k = 0; k < 6; k++) L.svg("rect", { x: x + 20 + k * 17, y: y + 92, width: 10, height: 3, rx: 1.5, fill: "#3b4a56" }, g);
    L.texte(g, x + 150, y + 38, "+", { "font-size": 13, "font-weight": 700, fill: L.ROUGE_BORNE });
    L.texte(g, x + 40, y + 38, "−", { "font-size": 15, "font-weight": 700, fill: "#222" });
    return { afficheur, voyant };
  }

  L.generateur = function (c, { id = "generateur", x, y, E = 6, r = 0.5, I_max = 1, lettres = null }) {
    // Construit le générateur, ses deux bornes et son modèle électrique (E, r, limitation de courant).
    const comp = { id, E, i: 0, limite: false, marche: true, g: L.svg("g", { class: "generateur" }, c.calque_composants) };
    L.cordon_secteur(comp.g, { x: x + 168, y: y + 24 }, c.prise());
    const vue = dessiner(comp.g, x, y);
    interrupteur_secteur(comp.g, x, y, comp, () => { comp.marche = !comp.marche; c.calculer(); });
    c.borne(comp, "−", x + 40, y + 58, L.NOIR_BORNE);
    c.borne(comp, "+", x + 150, y + 58, L.ROUGE_BORNE);
    if (lettres) [[18, lettres[0]], [172, lettres[1]]].forEach(([dx, t]) => L.texte(comp.g, x + dx, y + 58, t, { "font-size": 12, "font-weight": 700, fill: "#1a3d7c" }));
    const dipole = { a: "−", b: "+", g: 1 / r, j: E / r };
    dipole.ajuster = (u, i) => {
      // Courant trop fort : le générateur passe en limitation ; tension revenue sous E : il repasse en tension.
      if (!comp.limite && i > I_max) { comp.limite = true; Object.assign(dipole, { g: 1e-6, j: I_max }); return true; }
      if (comp.limite && -u > E) { comp.limite = false; Object.assign(dipole, { g: 1 / r, j: E / r }); return true; }
      return false;
    };
    comp.dipoles = () => (comp.marche ? [dipole] : []);
    comp.mettre_a_jour = ({ u, i }) => {
      comp.i = i[0] || 0;
      vue.afficheur.textContent = comp.marche ? L.nombre(Math.max(0, u("+", "−")), 1) : "";
      vue.voyant.setAttribute("fill", comp.limite ? "#ff5a3c" : "#4a1712");
      if (comp.limite) L.missions.noter("court_circuit", id);
    };
    return c.ajouter(comp);
  };
})(window.Labo);
