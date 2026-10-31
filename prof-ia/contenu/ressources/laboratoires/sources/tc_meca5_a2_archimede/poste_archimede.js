/*
Rôle : paillasse « poussée d'Archimède » : potence et dynamomètre fin (2 N), deux cylindres de même volume (aluminium,
       plastique), deux béchers (eau, eau salée), support élévateur. Le cylindre accroché, l'élève fait monter le plateau :
       la partie immergée subit la poussée F = ρ·V_immergé·g, le dynamomètre indique P − F ; le liquide monte dans le bécher.
Reçoit : le groupe SVG de la paillasse ; { solides, liquides } (masses volumiques en kg/m³, volume en cm³).
Produit : Labo.poste_archimede(groupe, reglages) -> { pense_bete } ; fait noté « mesures_archimede » = liste de
          { solide, liquide, immersion } lues ressort immobile (immersion 0 à 1, au vingtième).
Utilisé par : simulation.js.
*/
(function (L) {
  const G = 9.81, S = 8, X = 604, PLATEAU_BAS = 462, NIVEAU = 64, DIAMETRE_CM = 3.4;
  const HAUTEUR = (v) => (v / (Math.PI * (DIAMETRE_CM / 2) ** 2)) * S;

  function geometrie(e, ext = e.dyn.ext) {
    // Haut et bas du cylindre accroché (ressort allongé de ext px), surface du liquide (montée comprise), fraction immergée.
    if (!e.accroche) return { f: 0, montee: 0 };
    const c = e.dyn.crochet(), haut = c.y - e.dyn.ext + ext + 10, h = HAUTEUR(e.accroche.v_cm3), bas = haut + h;
    const aire = Math.PI * ((L.BECHER.l - 6) / 2 / S) ** 2, surface0 = e.plateau() - 3 - NIVEAU;
    let f = Math.max(0, Math.min(1, (bas - surface0) / h));
    const montee = ((f * e.accroche.v_cm3) / aire) * S;
    f = Math.max(0, Math.min(1, (bas - (surface0 - montee)) / h));
    return { f, montee, bas, x: c.x };
  }

  function dessiner(e) {
    // Cylindre accroché (derrière le verre et le liquide), béchers, puis cylindres posés.
    const { montee, f } = geometrie(e), q = e.calque;
    q.replaceChildren();
    const cylindre = (s) => {
      const p = s === e.accroche ? e.dyn.crochet() : s.tenu || { x: s.repos, y: 524 - HAUTEUR(s.v_cm3) - 10 };
      L.dessiner_cylindre(L.svg("g", { class: `solide-${s.id}`, "data-solide": s.id }, q), p.x, p.y, { largeur: DIAMETRE_CM * S, hauteur: HAUTEUR(s.v_cm3), metal: s.couleur, nom: s.nom });
    };
    if (e.accroche) cylindre(e.accroche);
    for (const b of e.liquides) {
      const sur = b === e.becher, p = b.tenu || (sur ? { x: X, y: e.plateau() } : { x: b.repos, y: 524 });
      L.dessiner_becher(L.svg("g", { class: `becher-${b.id}` }, q), p.x, p.y, { niveau: NIVEAU + (sur ? montee : 0), liquide: b.couleur, etiquette: b.nom });
    }
    for (const s of e.solides) if (s !== e.accroche) cylindre(s);
    return f;
  }

  function equilibre(e, plateau = e.plateau()) {
    // Position d'équilibre : la force dépend de l'immersion, qui dépend de l'allongement du ressort (point fixe).
    const s = e.accroche, ee = { ...e, plateau: () => plateau };
    if (!s) return { force: 0, f: 0, bas: 0 };
    let force = (s.masse_g / 1000) * G, r = geometrie(ee, force * e.dyn.px_par_n);
    for (let i = 0; i < 12; i++) {
      force = (s.masse_g / 1000) * G - e.becher.rho * s.v_cm3 * 1e-6 * r.f * G;
      r = geometrie(ee, force * e.dyn.px_par_n);
    }
    return { force, f: r.f, bas: r.bas };
  }

  function mettre_a_jour(e) {
    // Force indiquée par le dynamomètre à l'équilibre : poids du solide moins la poussée du liquide.
    dessiner(e);
    const q = equilibre(e);
    e.f = q.f;
    e.dyn.charger(q.force);
  }

  function noter(e) {
    // Ressort immobile : la mesure (solide, liquide, immersion) est notée.
    if (!e.accroche) return;
    const m = { solide: e.accroche.id, liquide: e.becher.id, immersion: Math.round(e.f * 20) / 20 };
    if (!e.mesures.some((x) => x.solide === m.solide && x.liquide === m.liquide && x.immersion === m.immersion)) e.mesures.push(m);
    L.missions.noter("mesures_archimede", e.mesures.map((x) => ({ ...x })));
  }

  function depart(e) {
    // D'où part l'objet saisi : crochet, place sur la paillasse, ou plateau.
    const { type, objet: o } = e.prise;
    if (type === "solide") return o === e.accroche ? e.dyn.crochet() : { x: o.repos, y: 524 - HAUTEUR(o.v_cm3) - 10 };
    return o === e.becher ? { x: X, y: e.plateau() } : { x: o.repos, y: 524 };
  }

  function deposer(e, p) {
    // Cylindre lâché près du crochet : il y est accroché. Bécher lâché sur le plateau baissé : il remplace l'autre.
    const { type, objet: o } = e.prise, c = e.dyn.crochet();
    if (type === "solide" && !e.accroche && Math.hypot(p.x - c.x, p.y - c.y) < 34) e.accroche = o;
    const plateau_libre = e.plateau() >= PLATEAU_BAS - 2 && Math.abs(p.x - X) < 70 && Math.abs(p.y - e.plateau()) < 70;
    if (type === "becher" && o !== e.becher && plateau_libre) e.becher = o;
  }

  function gestes(e, g) {
    // Glisser un cylindre jusqu'au crochet (ou le reprendre) ; glisser un bécher sur le plateau baissé.
    g.addEventListener("pointerdown", (ev) => {
      const s = e.solides.find((x) => ev.target.closest(`[data-solide="${x.id}"]`)), b = e.liquides.find((x) => ev.target.closest(`.becher-${x.id}`));
      e.prise = s ? { type: "solide", objet: s } : b && b !== e.becher ? { type: "becher", objet: b } : null;
    }, { capture: true });
    L.glissable(g, {
      debut: () => (e.prise ? depart(e) : null),
      saisir: () => { if (e.prise.objet === e.accroche) e.accroche = null; },
      deplacer: (p) => { e.prise.objet.tenu = p; mettre_a_jour(e); },
      lacher: (p) => { deposer(e, p); e.prise.objet.tenu = null; e.prise = null; mettre_a_jour(e); },
      annuler: () => { e.prise.objet.tenu = null; e.prise = null; mettre_a_jour(e); },
    });
  }

  L.poste_archimede = function (g, { solides, liquides }) {
    // Construit la paillasse et branche le calcul de la poussée.
    const fond = L.svg("g", {}, g), attache = L.potence(fond, { haut: 14 });
    const dyn = new L.Dynamometre(L.svg("g", { filter: "url(#ombre)" }, g), attache.x, attache.y + 6, { calibre: 2, px_par_n: 60, pas: 0.05, nombres: 0.5 });
    const elevateur = new L.Elevateur(g, X, { bas: PLATEAU_BAS, haut: 300 });
    const e = { dyn, solides, liquides, becher: liquides[0], accroche: null, prise: null, mesures: [], f: 0, plateau: () => elevateur.plateau };
    e.calque = L.svg("g", {}, g);
    elevateur.limite((y) => {
      // Le plateau ne monte pas au point que le cylindre touche le fond du bécher.
      for (let p = y; p < PLATEAU_BAS; p += 1) if (!e.accroche || equilibre(e, p).bas <= p - 8) return p;
      return PLATEAU_BAS;
    });
    elevateur.sur_changement(() => mettre_a_jour(e));
    dyn.sur_mouvement((repos) => { dessiner(e); if (repos) noter(e); });
    gestes(e, e.calque);
    mettre_a_jour(e);
    return { pense_bete: L.decor.pense_bete(g, 24, 52, 230) };
  };
})(window.Labo);
