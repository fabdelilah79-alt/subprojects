/*
Rôle : lentilles « profil » (demi-disques épais de plexiglas ou de verre, posés à plat sur un tableau magnétique) :
       géométrie (faces sphériques de rayon R, épaisseur), tracé exact d'un rayon (lois de Descartes sur chaque face),
       foyer image (rayon proche de l'axe), dessin du profil. Coordonnées en mm : x vers la droite, y vers le bas, axe y = 0.
Reçoit : une lentille { type ("conv" ou "div"), R (mm), n, h (demi-hauteur, mm), x (centre, mm) }.
Produit : Labo.LENTILLES ; Labo.traverser(lentille, y0) -> { points: [{ x, y }] (entrée, sortie), sortie: { p, d } } ;
          Labo.foyer(lentille) (abscisse du foyer image, mm) ; Labo.dessin_lentille(g, lentille, versEcran, K).
Utilisé par : poste_tableau.js.
*/
(function (L) {
  L.LENTILLES = [
    { id: "L1", nom: "L1", type: "conv", R: 40, n: 1.5, matiere: "plexiglas" }, { id: "L2", nom: "L2", type: "conv", R: 25, n: 1.5, matiere: "plexiglas" },
    { id: "L3", nom: "L3", type: "conv", R: 40, n: 1.7, matiere: "verre flint" }, { id: "L4", nom: "L4", type: "div", R: 40, n: 1.5, matiere: "plexiglas" },
  ].map((l) => ({ ...l, h: 15 }));

  const fleche = (l) => l.R - Math.sqrt(l.R * l.R - l.h * l.h);
  const epaisseur = (l) => (l.type === "conv" ? 2 * fleche(l) + 1 : 2);
  const centres = (l) => { const e = epaisseur(l) / 2; return l.type === "conv" ? [l.x - e + l.R, l.x + e - l.R] : [l.x - e - l.R, l.x + e + l.R]; };

  function couper(p, d, cx, R) {
    // Plus petit t > 0 tel que p + t·d soit sur le cercle de centre (cx, 0) et de rayon R ; null sinon.
    const ox = p.x - cx, b = ox * d.x + p.y * d.y, c = ox * ox + p.y * p.y - R * R, D = b * b - c;
    if (D < 0) return null;
    const t = [-b - Math.sqrt(D), -b + Math.sqrt(D)].filter((v) => v > 1e-6).sort((u, v) => u - v)[0];
    return t === undefined ? null : t;
  }

  function refracter(d, nrm, n1, n2) {
    // Loi de Descartes en vecteurs : nrm normale unitaire tournée vers le milieu d'où vient la lumière.
    const eta = n1 / n2, ci = -(nrm.x * d.x + nrm.y * d.y), k = 1 - eta * eta * (1 - ci * ci);
    if (k < 0) return null;
    const a = eta * ci - Math.sqrt(k);
    return { x: eta * d.x + a * nrm.x, y: eta * d.y + a * nrm.y };
  }

  L.traverser = function (l, y0) {
    // Rayon horizontal d'ordonnée y0 venant de la gauche : entrée et sortie par les deux faces ; ignoré hors de la lentille.
    if (Math.abs(y0) >= l.h - 0.5) return null;
    let p = { x: l.x - 40, y: y0 }, d = { x: 1, y: 0 };
    const pts = [], [c1, c2] = centres(l);
    for (const [cx, n1, n2] of [[c1, 1, l.n], [c2, l.n, 1]]) {
      const t = couper(p, d, cx, l.R);
      if (t === null) return null;
      p = { x: p.x + t * d.x, y: p.y + t * d.y };
      let nrm = { x: (p.x - cx) / l.R, y: p.y / l.R };
      if (nrm.x * d.x + nrm.y * d.y > 0) nrm = { x: -nrm.x, y: -nrm.y };
      d = refracter(d, nrm, n1, n2);
      if (!d) return null;
      pts.push({ ...p });
    }
    return { points: pts, sortie: { p, d } };
  };

  L.foyer = function (l) {
    // Abscisse où le rayon de 1 mm (après la lentille, ou son prolongement vers l'arrière) recoupe l'axe.
    const r = L.traverser(l, 1);
    return r.sortie.p.x - (r.sortie.p.y / r.sortie.d.y) * r.sortie.d.x;
  };

  L.dessin_lentille = function (g, l, E, K) {
    // Profil plein (plexiglas bleuté ou verre jaunâtre), reflet, tranche épaisse vue de biais, nom.
    const [c1, c2] = centres(l), e = epaisseur(l) / 2, s = fleche(l), haut = E(l.x, -l.h), bas = E(l.x, l.h), R = l.R * K, teinte = l.n > 1.6 ? "#f3e7b5" : "#cfe8ef";
    const d = l.type === "conv"
      ? `M${E(l.x - e + s, -l.h).x} ${haut.y} A${R} ${R} 0 0 0 ${E(l.x - e + s, l.h).x} ${bas.y} L${E(l.x + e - s, l.h).x} ${bas.y} A${R} ${R} 0 0 0 ${E(l.x + e - s, -l.h).x} ${haut.y} Z`
      : `M${E(l.x - e - s, -l.h).x} ${haut.y} A${R} ${R} 0 0 1 ${E(l.x - e - s, l.h).x} ${bas.y} L${E(l.x + e + s, l.h).x} ${bas.y} A${R} ${R} 0 0 1 ${E(l.x + e + s, -l.h).x} ${haut.y} Z`;
    L.svg("path", { d, fill: "#000", opacity: 0.18, transform: "translate(4 5)" }, g);
    L.svg("path", { d, fill: teinte, opacity: 0.78, stroke: "#6f9aa6", "stroke-width": 1.4 }, g);
    L.svg("path", { d, fill: "url(#reflet)" }, g);
    L.texte(g, haut.x, haut.y - 9, l.nom, { "font-size": 9, "font-weight": 700, fill: "#1a3d7c" });
    return { c1, c2 };
  };
})(window.Labo);
