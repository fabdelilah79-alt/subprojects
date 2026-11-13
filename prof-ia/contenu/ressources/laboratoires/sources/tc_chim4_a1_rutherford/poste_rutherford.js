/*
Rôle : paillasse de l'expérience de Rutherford (reconstituée avec le matériel d'un laboratoire d'enseignement) : chambre
       de diffusion (source alpha, feuille d'or, détecteur tournant), pompe à vide et manomètre, compteur d'impulsions.
       On fait le vide, on place le détecteur à un angle θ, on compte pendant 1 min ; chaque comptage est gardé.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_rutherford(groupe) -> { pense_bete } ; fait « rutherford » = { theta, feuille, p (hPa), pompe,
          mesures : [{ theta, N, feuille, p }] (comptages terminés, du premier au dernier) }.
Utilisé par : simulation.js.
*/
(function (L) {
  const SOL = 576;

  function bulle(calque, t) {
    // Message court au-dessus de la paillasse (vide : rien).
    calque.replaceChildren();
    if (!t) return;
    L.svg("rect", { x: 560, y: 180, width: 300, height: 28, rx: 5, fill: "#fff6e0", stroke: "#d08a1a" }, calque);
    L.texte(calque, 710, 194, t, { "font-size": 7.4, "font-weight": 700, fill: "#6b3d00" });
  }

  function etiquette_source(g) {
    // Fiche de la source scellée, posée au mur : activité, particules émises, consignes.
    L.svg("rect", { x: 40, y: 290, width: 150, height: 92, rx: 3, fill: "#fdfdf8", stroke: "#c9c4b0" }, g);
    L.texte(g, 115, 304, "Source scellée ²⁴¹Am", { "font-size": 8, "font-weight": 700, fill: "#23315a" });
    ["particules alpha (noyaux d'hélium,", "charge +2e), énergie 5,5 MeV", "parcours dans l'air : 4 cm environ", "feuille d'or : épaisseur 2 µm", "(environ 7 000 atomes d'or)"].forEach((t, i) => L.texte(g, 48, 320 + i * 12, t, { "font-size": 6.6, "text-anchor": "start", fill: "#222" }));
  }

  L.poste_rutherford = function (g) {
    // Chambre, pompe, compteur ; les comptages terminés sont notés avec l'angle, la feuille et la pression.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230), ctx = L.paillasse_chimie(g), calque = L.svg("g", { "pointer-events": "none" }, g);
    etiquette_source(ctx.fond);
    const e = { mesures: [] };
    let ch = null, pompe = null, compteur = null, theta = 0;
    const noter = () => {
      if (!ch || !pompe) return;
      L.missions.noter("rutherford", { theta: ch.theta, feuille: ch.feuille, p: Math.round(pompe.p * 10) / 10, pompe: pompe.marche, mesures: [...e.mesures] });
    };
    ch = L.chambre_rutherford(ctx, { changer: (c) => {
      if (compteur?.actif && c.theta !== theta) { compteur.arreter(); bulle(calque, "Comptage interrompu : ne tournez pas le bras pendant le comptage."); }
      theta = c.theta; noter();
    } });
    pompe = L.pompe_vide(ctx, { x: 900, sol: 470, embout: { x: ch.couvercle.x + 8, y: ch.couvercle.y }, manometre: { x: ch.C.x + 20, y: 290 }, changer: noter });
    compteur = L.compteur_impulsions(ctx, { x: 668, sol: SOL, taux: () => L.RUTHERFORD.taux(ch.theta, ch.feuille, pompe.p), fin: (N) => {
      e.mesures.push({ theta: ch.theta, N, feuille: ch.feuille, p: Math.round(pompe.p) });
      bulle(calque, ""); noter();
    } });
    L.svg("path", { d: `M${ch.C.x + 150} ${ch.C.y + 22} C${ch.C.x + 190} ${ch.C.y + 70} 560 556 594 ${SOL - 40}`, stroke: "#222", "stroke-width": 2.4, fill: "none" }, ctx.fond);
    noter();
    return { pense_bete };
  };
})(window.Labo);
