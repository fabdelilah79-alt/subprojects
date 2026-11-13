/*
Rôle : physique du comptage et compteur d'impulsions. Le faisceau de particules alpha (5,5 MeV) arrive sur le détecteur à
       0° (1,2 million par minute) ; la feuille d'or n'en arrête presque aucune (99,99 % passent tout droit) et en dévie
       quelques-unes selon la loi de Rutherford N(θ) = K / sin⁴(θ/2) : de moins en moins quand θ grandit, mais certaines
       repartent en arrière (θ > 90°). Dans l'air, les alpha ne parcourent que 4 cm environ : il faut faire le vide.
       Les comptages suivent la loi du hasard (loi de Poisson). Le compteur compte pendant 1 min (temps accéléré : 3 s).
Reçoit : pour le taux, l'angle θ (°), la présence de la feuille et la pression (hPa) ; pour le compteur, le contexte de la
         paillasse, sa place { x, sol } et { taux() (par minute), fin(N) }.
Produit : Labo.RUTHERFORD = { taux(theta, feuille, p), tirage(lambda) } ; Labo.compteur_impulsions(ctx, reglage) -> { compte, actif, arreter() }.
Utilisé par : poste_rutherford.js.
*/
(function (L) {
  const N0 = 1.2e6, K = 3, LARGEUR = 3, DISTANCE_MM = 135, PARCOURS_MM = 41;

  function taux(theta, feuille, p) {
    // Particules reçues par minute : faisceau direct (étroit) + particules déviées par les noyaux d'or ; l'air les arrête.
    const t = (Math.max(theta, 10) * Math.PI) / 360;
    const direct = N0 * Math.exp(-((theta / LARGEUR) ** 2)) * (feuille ? 0.9999 : 1);
    const devie = feuille ? (K / Math.sin(t) ** 4) * (theta < 10 ? (theta / 10) ** 2 : 1) : 0;
    const parcours = (PARCOURS_MM * 1013) / Math.max(p, 0.1), air = Math.max(0, Math.min(1, (parcours - DISTANCE_MM) / 60));
    return (direct + devie) * air;
  }

  function tirage(lambda) {
    // Nombre aléatoire de la loi de Poisson de moyenne lambda (approximation normale au-delà de 30).
    if (lambda > 30) { const u = Math.random() || 1e-9, v = Math.random(); return Math.max(0, Math.round(lambda + Math.sqrt(lambda) * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v))); }
    let k = 0, q = Math.random();
    const s = Math.exp(-lambda);
    while (q > s) { k++; q *= Math.random(); }
    return k;
  }
  L.RUTHERFORD = { taux, tirage };

  function boitier(g, x, sol) {
    // Boîtier gris du compteur, afficheur à 7 chiffres, temps de comptage, voyant d'impulsion.
    L.svg("rect", { x: x - 72, y: sol - 2, width: 150, height: 6, rx: 3, fill: "#000", opacity: 0.25, filter: "url(#flou)" }, g);
    L.svg("rect", { x: x - 75, y: sol - 86, width: 150, height: 86, rx: 5, fill: "#d6dadc", stroke: "#8f989e" }, g);
    L.svg("rect", { x: x - 66, y: sol - 76, width: 132, height: 30, rx: 2, fill: "#1d2a22", stroke: "#4d5a52" }, g);
    L.texte(g, x - 40, sol - 8, "COMPTEUR", { "font-size": 7, "font-weight": 700, fill: "#3d464c" });
    L.texte(g, x - 40, sol - 18, "durée : 1 min", { "font-size": 6.5, fill: "#3d464c" });
  }

  L.compteur_impulsions = function (ctx, { x, sol, taux: lire, fin }) {
    // Touche « Compter » : compte pendant 1 min de temps simulé ; « 0 » remet à zéro ; le voyant clignote à chaque impulsion.
    const c = { compte: 0, actif: false, t: 0 };
    boitier(ctx.fond, x, sol);
    const afficheur = L.svg("g", { "pointer-events": "none" }, ctx.objets);
    const voyant = L.svg("circle", { cx: x + 58, cy: sol - 36, r: 3.5, fill: "#4a1a14" }, ctx.objets);
    const dessiner = () => {
      afficheur.replaceChildren();
      L.texte(afficheur, x + 60, sol - 58, String(c.compte), { "font-size": 19, "font-family": "monospace", "text-anchor": "end", fill: "#7dff9a" });
      L.texte(afficheur, x - 60, sol - 51, c.actif ? `${Math.floor(c.t)} s` : "", { "font-size": 6.5, "text-anchor": "start", fill: "#7dff9a" });
    };
    let minuterie = null;
    c.arreter = () => { clearInterval(minuterie); c.actif = false; dessiner(); };
    L.bouton_rond(ctx.haut, x + 22, sol - 22, "▶", () => {
      if (c.actif) return;
      Object.assign(c, { compte: 0, actif: true, t: 0 });
      minuterie = setInterval(() => {
        const n = tirage((lire() * 1) / 60);
        c.compte += n; c.t += 1;
        voyant.setAttribute("fill", n ? "#ff4a2f" : "#4a1a14");
        if (c.t >= 60) { c.arreter(); fin(c.compte); } else dessiner();
      }, 50);
      dessiner();
    }, 9);
    L.bouton_rond(ctx.haut, x + 52, sol - 22, "0", () => { if (!c.actif) { c.compte = 0; dessiner(); } }, 9);
    dessiner();
    return c;
  };
})(window.Labo);
