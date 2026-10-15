/*
Rôle : flèches-vecteurs vitesse à tracer sur la feuille d'enregistrement relevée : chaque flèche part d'un point Mi ;
       l'élève fait glisser sa pointe pour lui donner la direction et la longueur voulues (échelle imprimée sur la feuille).
Reçoit : la feuille (Labo.Feuille) et { indices: [3, 7], echelle_mm_par_ms (longueur en mm pour 1 m/s), quand (flèches à montrer ?),
         lettre (« v », ou « p » pour la quantité de mouvement), legende ({ mm, texte } du cartouche d'échelle) }.
Produit : Labo.vecteurs_vitesse(feuille, reglages) ; fait noté « vecteurs » = { i: { dx, dy } en mm sur la feuille }.
Utilisé par : poste_coussin_air.js (simulations « vitesse instantanée » et « MRU et MCU »).
*/
(function (L) {
  const E = () => L.Feuille.ECHELLE, vf = (x, y) => L.Feuille.vers_feuille(x, y);
  const COULEUR = "#1e6b3a";

  function echelle(g, mm_par_ms, legende) {
    // Cartouche de l'échelle, en bas à gauche de la feuille (par défaut : vitesses, 0,1 m/s).
    const p = vf(8, 382), l = legende ? legende.mm * E() : (mm_par_ms / 10) * E();
    L.svg("line", { x1: p.x, y1: p.y, x2: p.x + l, y2: p.y, stroke: COULEUR, "stroke-width": 2, "marker-end": "url(#fleche-cote)" }, g);
    const texte = legende ? legende.texte : `${L.nombre(mm_par_ms / 100, 0)} cm ↔ 0,1 m/s`;
    L.texte(g, p.x + l + 6, p.y, `Échelle : ${texte}`, { "text-anchor": "start", "font-size": 10, fill: COULEUR, "font-weight": 700 });
  }

  function fleche(g, i, point, etat, lettre) {
    // Une flèche : trait vert, pointe déplaçable (poignée ronde), nom v_i (ou p_i) près de la pointe.
    const groupe = L.svg("g", { class: "vecteur-vitesse" }, g);
    const trait = L.svg("line", { stroke: COULEUR, "stroke-width": 1.8, "marker-end": "url(#fleche-cote)" }, groupe);
    const nom = L.texte_exposants(groupe, 0, 0, `${lettre}_{${i}}`, { "font-size": 11, "font-weight": 700, fill: COULEUR });
    const poignee = L.svg("circle", { r: 7, fill: COULEUR, opacity: 0.35, class: "poignee" }, groupe);
    const o = vf(point.x, point.y);
    const placer = () => {
      const v = etat[i], b = { x: o.x + v.dx * E(), y: o.y + v.dy * E() };
      Object.entries({ x1: o.x, y1: o.y, x2: b.x, y2: b.y }).forEach(([k, val]) => trait.setAttribute(k, val));
      poignee.setAttribute("cx", b.x); poignee.setAttribute("cy", b.y);
      nom.setAttribute("x", b.x + 6); nom.setAttribute("y", b.y - 8);
    };
    L.glissable(poignee, {
      soulever: false,
      debut: () => ({ x: o.x + etat[i].dx * E(), y: o.y + etat[i].dy * E() }),
      deplacer: (p) => { etat[i] = { dx: (p.x - o.x) / E(), dy: (p.y - o.y) / E() }; placer(); },
      lacher: () => L.missions.noter("vecteurs", JSON.parse(JSON.stringify(etat))),
    });
    placer();
  }

  L.vecteurs_vitesse = function (feuille, { indices, echelle_mm_par_ms = 100, quand = () => true, lettre = "v", legende = null }) {
    // À chaque ouverture de la feuille : une flèche courte au départ de chaque point demandé.
    const g = L.svg("g", {}, feuille.outils);
    let etat = {}, enregistrement = null;
    L.ecouter("enregistrement", (e) => {
      if (e.mobile !== feuille.mobile) return;
      if (e.nouveau) { etat = {}; L.missions.noter("vecteurs", {}); }
      enregistrement = e.points;
    });
    L.ecouter("feuille", (e) => {
      if (!e.ouverte || e.feuille !== feuille) return;
      g.replaceChildren();
      if (!quand()) return;
      echelle(g, echelle_mm_par_ms, legende);
      for (const i of indices) {
        if (!enregistrement || !enregistrement[i]) continue;
        etat[i] ??= { dx: 12, dy: 0 };
        fleche(g, i, enregistrement[i], etat, lettre);
      }
    });
    return { etat: () => etat };
  };

  L.vecteurs_vitesse.verifier = function (vecteur, points, i, tau, mm_par_ms, lettre = "v") {
    // true si la flèche en Mi a la bonne direction (± 8°) et la bonne longueur (± 10 %) ; sinon un conseil.
    if (!vecteur) return false;
    const a = points[i - 1], b = points[i + 1], v = L.VERIF_ENR.vitesse(points, i, tau);
    const attendu = Math.atan2(b.y - a.y, b.x - a.x), angle = Math.atan2(vecteur.dy, vecteur.dx);
    const ecart = Math.abs(((angle - attendu + 3 * Math.PI) % (2 * Math.PI)) - Math.PI);
    if (ecart > (8 * Math.PI) / 180) return `La flèche ${lettre}_{${i}} doit être parallèle à M_{${i - 1}}M_{${i + 1}}, dans le sens du mouvement.`;
    const longueur = Math.hypot(vecteur.dx, vecteur.dy), voulue = v * mm_par_ms;
    return Math.abs(longueur - voulue) <= 0.1 * voulue || `Longueur de ${lettre}_{${i}} : calculez ${lettre}_{${i}}, puis appliquez l'échelle imprimée sur la feuille.`;
  };
})(window.Labo);
