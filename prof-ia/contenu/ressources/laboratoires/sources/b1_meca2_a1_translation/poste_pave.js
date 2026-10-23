/*
Rôle : paillasse du pavé tiré : on tire un pavé de bois de 500 g de A à B (AB = 40 cm), à vitesse constante, avec un
       dynamomètre tenu par son anneau ; on choisit la direction du fil (angle α avec l'horizontale, de 0° à 70°). Le pavé
       démarre quand la force atteint le frottement statique, puis glisse : F = μ·m·g / (cos α + μ·sin α) (μ = 0,40).
       Chaque traversée complète de A à B est un essai (angle moyen, force moyenne). Lâché, l'anneau reste tenu en place.
Reçoit : le groupe SVG de la paillasse ; les gestes de l'élève (anneau du dynamomètre, pavé à ramener avant A).
Produit : Labo.poste_pave(g) -> { pense_bete } ; fait « pave » = { x_cm, alpha (°), F (N), glisse, essais: [{ alpha, F, ecart }] }.
Utilisé par : simulation.js (paillasse 1).
*/
(function (L) {
  const G = 9.81, M = 0.5, MU_S = 0.48, MU_D = 0.4, TABLE = 548, XA = 310, XB = 590, XMAX = 660, REG = { calibre: 3, px_n: 35, corps: 130 };
  const crochet = (x) => ({ x: x + 6, y: TABLE - 16 }), deg = (a) => (a * 180) / Math.PI;
  const frottement = (mu, a) => (mu * M * G) / (Math.cos(a) + mu * Math.sin(a));
  const LIBRE = L.DYN_TRACTION.corde + REG.corps;

  function borner(H, p) {
    // L'anneau reste devant le pavé, au-dessus de la paillasse : angle du fil entre 0° et 70°.
    const d = Math.max(LIBRE - 30, Math.hypot(p.x - H.x, p.y - H.y));
    const a = Math.max(0, Math.min((70 * Math.PI) / 180, Math.atan2(H.y - p.y, Math.max(1, p.x - H.x))));
    return { x: H.x + d * Math.cos(a), y: H.y - d * Math.sin(a) };
  }

  function tirer(e, p) {
    // Le pavé démarre quand F atteint le frottement statique, puis suit l'anneau en gardant F = frottement de glissement.
    for (let k = 0; k < 4; k++) {
      const H = crochet(e.x); e.R = borner(H, p);
      const a = Math.atan2(H.y - e.R.y, e.R.x - H.x), F = (Math.hypot(e.R.x - H.x, e.R.y - H.y) - LIBRE) / REG.px_n;
      if (!e.glisse && F >= frottement(MU_S, a)) e.glisse = true;
      if (e.glisse && F < frottement(MU_D, a) - 0.03) e.glisse = false;
      if (!e.glisse) return;
      const D = L.dynamometre_traction.longueur(frottement(MU_D, a), REG), dy = e.R.y - H.y;
      const x = Math.min(XMAX, e.R.x - Math.sqrt(Math.max(0, D * D - dy * dy)) - 6);
      if (x <= e.x + 0.01) return;
      mesurer(e, x, Math.atan2(H.y - e.R.y, e.R.x - crochet(x).x));
      e.x = x;
    }
  }

  function mesurer(e, x, a) {
    // Sur le trajet de A à B, moyenne de l'angle et de la force pondérée par le chemin parcouru ; l'essai est noté en B.
    const s = e.essai, dx = Math.max(0, Math.min(x, XB) - Math.max(e.x, XA));
    if (!s || dx <= 0) return;
    s.l += dx; s.a += a * dx; s.f += frottement(MU_D, a) * dx; s.min = Math.min(s.min, a); s.max = Math.max(s.max, a);
    if (x >= XB && s.l > 0.95 * (XB - XA)) {
      e.essais.push({ alpha: Math.round(deg(s.a / s.l) * 10) / 10, F: Math.round((s.f / s.l) * 100) / 100, ecart: Math.round(deg(s.max - s.min)) });
      e.essai = null;
    }
  }

  function gestes(calque, e, dessiner) {
    // Saisir l'anneau (tirer) ou le pavé (le ramener : le dynamomètre est reposé, un nouvel essai commence avant A).
    let prise = null;
    calque.addEventListener("pointerdown", (ev) => { prise = ev.target.closest(".anneau-dyn") ? "anneau" : ev.target.closest(".pave-tire") ? "pave" : null; }, { capture: true });
    L.glissable(calque, {
      soulever: false,
      debut: (ev) => (prise === "anneau" ? { ...e.R } : prise ? L.scene.vers_scene(ev) : null),
      deplacer: (p) => {
        if (prise === "anneau") tirer(e, p);
        if (prise === "pave") { e.x = Math.max(270, Math.min(XMAX, p.x)); e.glisse = false; e.R = repos(e.x); if (e.x < XA - 1) e.essai = nouvel_essai(); }
        dessiner();
      },
    });
  }

  const repos = (x) => ({ x: crochet(x).x + LIBRE - 12, y: TABLE - 10 });
  const nouvel_essai = () => ({ l: 0, a: 0, f: 0, min: 9, max: -9 });

  L.poste_pave = function (g) {
    // Règle et repères (fond), puis pavé, rapporteur et dynamomètre redessinés à chaque geste ; faits notés 4 fois par seconde.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230);
    L.pave_dessin.regle(L.svg("g", {}, g), { table: TABLE, xa: XA, xb: XB });
    const e = { x: 290, R: repos(290), glisse: false, essai: nouvel_essai(), essais: [] }, calque = L.svg("g", {}, g);
    let lu = { F: 0, angle: 0 };
    const dessiner = () => {
      calque.replaceChildren();
      L.pave_dessin.pave(calque, e.x, TABLE);
      L.pave_dessin.rapporteur(calque, crochet(e.x));
      lu = L.dynamometre_traction(calque, crochet(e.x), e.R, REG);
    };
    gestes(calque, e, dessiner);
    dessiner();
    setInterval(() => L.missions.noter("pave", { x_cm: Math.round((e.x - 240) / 0.7) / 10, alpha: Math.round(deg(lu.angle)), F: Math.round(lu.F * 100) / 100, glisse: e.glisse, essais: e.essais.slice() }), 250);
    return { pense_bete };
  };
})(window.Labo);
