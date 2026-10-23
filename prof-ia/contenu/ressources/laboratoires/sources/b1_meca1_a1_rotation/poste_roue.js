/*
Rôle : les deux paillasses de l'activité « rotation autour d'un axe fixe » : (1) maquette de grande roue et appareil
       photo sur trépied : un toucher sur l'appareil fait une chronophotographie (10 images à 0,25 s d'intervalle,
       superposées sur la scène : on voit tourner le segment [AB] de la roue, et le segment [CD] de la nacelle rester
       parallèle à lui-même) ; (2) tableau magnétique : classer des mouvements du vécu.
Reçoit : le groupe SVG de chaque paillasse.
Produit : Labo.poste_roue(groupe), Labo.poste_tri_rotation(groupe) -> { pense_bete } ; fait « roue » = { tourne (degrés),
          photo { n, dphi (degrés), dAB, dCD (rotation des segments entre la première et la dernière image, degrés) } } ;
          fait « tri_mouvements ».
Utilisé par : simulation.js.
*/
(function (L) {
  const SOL = 576, CAM = { x: 790, y: 330 };

  function appareil(g) {
    // Appareil photo sur trépied, objectif tourné vers la roue, bouton de déclenchement.
    for (const dx of [-34, 0, 34]) L.tige(g, `M${CAM.x} ${CAM.y + 26} L${CAM.x + dx} ${SOL - 2}`, 3);
    const a = L.svg("g", { class: "appareil", role: "button", "aria-label": "Appareil photo" }, g);
    L.svg("rect", { x: CAM.x - 34, y: CAM.y - 22, width: 64, height: 44, rx: 6, fill: "#2b2f33", stroke: "#000" }, a);
    L.svg("circle", { cx: CAM.x - 34, cy: CAM.y, r: 17, fill: "#1a1c1e", stroke: "#5d646a", "stroke-width": 3 }, a);
    L.svg("circle", { cx: CAM.x - 34, cy: CAM.y, r: 8, fill: "#24425e" }, a);
    L.svg("rect", { x: CAM.x + 6, y: CAM.y - 30, width: 16, height: 8, rx: 2, fill: "#c0392b" }, a);
    L.texte(g, CAM.x, CAM.y + 40, "chronophotographie", { "font-size": 8, "font-weight": 700, fill: "#33414b" });
    return a;
  }

  function superposer(g, images) {
    // Les images superposées : segments [AB] (rouge) et [CD] (bleu), points numérotés.
    g.replaceChildren();
    images.forEach((s, i) => {
      const o = 0.25 + (0.6 * i) / images.length;
      L.svg("line", { x1: s.A.x, y1: s.A.y, x2: s.B.x, y2: s.B.y, stroke: "#e74c3c", "stroke-width": 2.5, opacity: o }, g);
      L.svg("line", { x1: s.C.x, y1: s.C.y, x2: s.D.x, y2: s.D.y, stroke: "#2f6fb8", "stroke-width": 2.5, opacity: o }, g);
      for (const [P, c] of [[s.A, "#7b1d12"], [s.B, "#7b1d12"], [s.C, "#1f5fa8"], [s.D, "#1f5fa8"]]) L.svg("circle", { cx: P.x, cy: P.y, r: 2.4, fill: c, opacity: o + 0.1 }, g);
      L.texte(g, s.B.x + 8, s.B.y - 6, String(i), { "font-size": 8, fill: "#7b1d12" });
    });
  }

  L.poste_roue = function (g) {
    // Maquette, appareil photo ; la photo se fait en 2,5 s pendant que la roue tourne.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230), calque = L.svg("g", { "pointer-events": "none" }, g);
    const dire = (t) => { calque.replaceChildren(); if (t) { L.svg("rect", { x: 380, y: 60, width: 320, height: 24, rx: 5, fill: "#fff6e0", stroke: "#d08a1a" }, calque); L.texte(calque, 540, 72, t, { "font-size": 7.4, "font-weight": 700, fill: "#6b3d00" }); } };
    const m = L.maquette_roue(g, { x: 520, y: 330, R: 160, sol: SOL });
    const photo = L.svg("g", { "pointer-events": "none" }, g), f = { tourne: 0, photo: null };
    const deg = (a) => (a * 180) / Math.PI, dir = (P, Q) => Math.atan2(Q.y - P.y, Q.x - P.x);
    const ecart = (a, b) => { let d = deg(b - a) % 360; if (d > 180) d -= 360; if (d < -180) d += 360; return Math.abs(Math.round(d)); };
    let prise = null;
    L.glissable(appareil(g), { soulever: false, debut: () => ({ x: 0, y: 0 }), toucher: () => {
      if (prise) return;
      dire("Prise de vue : 10 images en 2,5 s…"); prise = { images: [], phi0: m.phi };
      const t = setInterval(() => {
        prise.images.push(m.segments()); superposer(photo, prise.images);
        if (prise.images.length < 10) return;
        clearInterval(t);
        const I = prise.images, dphi = Math.round(Math.abs(deg(m.phi - prise.phi0)));
        f.photo = { n: 10, dphi, dAB: ecart(dir(I[0].A, I[0].B), dir(I[9].A, I[9].B)), dCD: ecart(dir(I[0].C, I[0].D), dir(I[9].C, I[9].D)) };
        dire(dphi < 40 ? "La roue a peu tourné : lancez-la, puis reprenez la photo." : "Photo prise : comparez les segments rouges et les segments bleus.");
        prise = null; L.missions.noter("roue", { ...f });
      }, 250);
    } });
    setInterval(() => { const t = Math.round(m.tourne_total); if (t !== f.tourne) { f.tourne = t; L.missions.noter("roue", { ...f }); } }, 300);
    L.missions.noter("roue", { ...f });
    return { pense_bete };
  };

  const E = (id, l1, l2, colonne) => ({ id, texte: [l1, l2], colonne });
  L.MOUVEMENTS_VECU = [
    E("porte", "Une porte", "qu'on ouvre", 0), E("aiguille", "L'aiguille", "d'une horloge", 0), E("barriere", "La barrière", "d'un péage", 0), E("lune", "La Lune (même face)", "autour de la Terre", 0),
    E("nacelle", "Une nacelle", "de grande roue", 1), E("pedale", "La pédale d'un vélo", "(qui reste horizontale)", 1), E("teleph", "La cabine", "du téléphérique", 2), E("tiroir", "Un tiroir", "qu'on ouvre", 2),
  ];

  L.poste_tri_rotation = function (g) {
    // Tableau magnétique : rotation autour d'un axe fixe, translation circulaire, translation rectiligne.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230), ordre = [3, 6, 0, 5, 1, 7, 2, 4];
    L.tableau_tri(g, { x: 270, y: 30, largeur: 600, hauteur: 350, titre: "Quel est le mouvement de chaque solide ?", colonnes: [["Rotation autour", "d'un axe fixe"], ["Translation", "circulaire"], ["Translation", "rectiligne"]], etiquettes: ordre.map((k) => L.MOUVEMENTS_VECU[k]), fait: "tri_mouvements", par_ligne: 6 });
    return { pense_bete };
  };
})(window.Labo);
