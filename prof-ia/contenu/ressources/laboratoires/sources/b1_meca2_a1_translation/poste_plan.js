/*
Rôle : paillasse du plan incliné : un chariot de 500 g (frottements négligeables) est tiré à vitesse constante, avec un
       dynamomètre parallèle à la planche, depuis le bas (repère en O) jusqu'au faisceau laser, 20,0 cm plus haut. On règle
       l'inclinaison α (18° à 40°, degré par degré) en faisant glisser la noix. Le dynamomètre indique F = m·g·sin α ;
       le chemin parcouru L = h / sin α s'allonge quand α diminue. Chaque arrivée au faisceau est un essai.
Reçoit : le groupe SVG de la paillasse ; les gestes de l'élève (anneau du dynamomètre, noix de la potence).
Produit : Labo.poste_plan(g) -> { pense_bete } ; fait « plan » = { alpha (°), s_cm (repère sur la planche), F (N),
          au_faisceau, essais: [{ alpha, L (m), F }] }.
Utilisé par : simulation.js (paillasse 3).
*/
(function (L) {
  const G = 9.81, M = 0.5, H_MM = 200, D = L.plan_dessin, REG = { calibre: 4, px_n: 30 }, AVANT = 89;
  const rad = (d) => (d * Math.PI) / 180, LIBRE = L.DYN_TRACTION.corde + L.DYN_TRACTION.corps;

  function placer(e) {
    // Position du chariot pour la position q de l'anneau (le long de la planche) : il recule jusqu'en O si l'on relâche.
    const a = rad(e.alpha), F = M * G * Math.sin(a);
    e.q = Math.max(AVANT + LIBRE - 40, Math.min(D.LONG - 82 + AVANT + L.dynamometre_traction.longueur(F, REG), e.q));
    e.s = Math.max(0, e.q - AVANT - L.dynamometre_traction.longueur(F, REG));
    const h = (e.s / D.MM) * Math.sin(a);
    e.au_faisceau = Math.abs(h - H_MM) < 1.5;
    if (e.au_faisceau) {
      const essai = { alpha: e.alpha, L: Math.round(e.s / D.MM) / 1000, F: Math.round(F * 100) / 100 };
      e.essais = e.essais.filter((k) => k.alpha !== e.alpha).concat([essai]);
    }
  }

  function gestes(calque, e, dessiner) {
    // Tirer l'anneau le long de la planche, ou faire glisser la noix (l'inclinaison change de degré en degré).
    let prise = null;
    calque.addEventListener("pointerdown", (ev) => { prise = ev.target.closest(".anneau-dyn") ? "anneau" : ev.target.closest(".noix") ? "noix" : null; }, { capture: true });
    L.glissable(calque, {
      soulever: false,
      debut: (ev) => (prise ? L.scene.vers_scene(ev) : null),
      deplacer: (p) => {
        const a = rad(e.alpha);
        if (prise === "anneau") e.q = (p.x - D.O.x) * Math.cos(a) - (p.y - D.O.y) * Math.sin(a);
        if (prise === "noix") e.alpha = Math.max(18, Math.min(40, Math.round((Math.atan2(D.O.y - p.y + 20, D.TIGE_X - D.O.x) * 180) / Math.PI)));
        placer(e);
        dessiner();
      },
    });
  }

  L.poste_plan = function (g) {
    // Décor fixe, puis potence, planche, chariot, dynamomètre et faisceau redessinés à chaque geste.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230);
    D.fond(L.svg("g", {}, g));
    const e = { alpha: 20, q: 0, s: 0, au_faisceau: false, essais: [] }, calque = L.svg("g", {}, g);
    let lu = { F: 0 };
    const dessiner = () => {
      calque.replaceChildren();
      const a = rad(e.alpha);
      D.potence(calque, a);
      D.planche(calque, a);
      const H = D.chariot(calque, a, e.s, e.au_faisceau);
      const R = { x: H.x + (e.q - e.s - AVANT) * Math.cos(a), y: H.y - (e.q - e.s - AVANT) * Math.sin(a) };
      lu = L.dynamometre_traction(calque, H, R, REG);
      D.faisceau(calque);
    };
    placer(e);
    gestes(calque, e, dessiner);
    dessiner();
    setInterval(() => L.missions.noter("plan", { alpha: e.alpha, s_cm: Math.round(e.s / D.MM) / 10, F: Math.round(lu.F * 100) / 100, au_faisceau: e.au_faisceau, essais: e.essais.slice() }), 250);
    return { pense_bete };
  };
})(window.Labo);
