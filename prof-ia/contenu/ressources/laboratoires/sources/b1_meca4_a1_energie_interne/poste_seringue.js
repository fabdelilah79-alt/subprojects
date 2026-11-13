/*
Rôle : paillasse de la seringue à gaz : on pose des masses de 1 kg sur le plateau du piston (ou on les retire). La pression
       du gaz devient p = p0 + m·g/S. Le gaz, comprimé brusquement, s'échauffe (environ 30 K × (p/p_avant − 1)), puis
       revient à 20,0 °C en cédant de la chaleur (constante de temps 5 s) ; son volume suit V = V1·(p0/p)·(T/T0).
       Chaque retour à 20,0 °C est noté comme un essai.
Reçoit : le groupe SVG de la paillasse ; les gestes de l'élève (masses).
Produit : Labo.poste_seringue(g) -> { pense_bete } ; fait « seringue » = { m (kg), p (Pa), V (mL), T (°C), essais: [{ m, p, V }] }.
Utilisé par : simulation.js (paillasse 3).
*/
(function (L) {
  const D = L.seringue_dessin, P0 = 101300, V1 = 50, S = 4e-4, G = 9.81, T0 = 293.15, TAU = 5;
  const pression = (n) => P0 + (n * G) / S;

  function avancer(e, dt) {
    // Refroidissement (ou réchauffement) du gaz vers 20,0 °C ; volume à pression constante ; essai noté à l'équilibre.
    e.dT -= (e.dT * dt) / TAU;
    e.V = V1 * (P0 / e.p) * ((T0 + e.dT) / T0);
    if (!e.note && Math.abs(e.dT) < 0.05) { e.note = true; e.essais = e.essais.filter((x) => x.m !== e.n).concat([{ m: e.n, p: Math.round(e.p), V: Math.round(e.V * 10) / 10 }]); }
  }

  function changer(e, n) {
    // Nouvelle charge : saut de pression, échauffement (compression) ou refroidissement (détente) brusque.
    const p = pression(n);
    e.dT += 30 * (p / e.p - 1);
    e.p = p; e.n = n; e.note = false;
  }

  function gestes(c, e) {
    // Prendre une masse sur la paillasse et la poser sur le plateau, ou reprendre la masse du dessus.
    let prise = null;
    L.glissable(c, {
      soulever: false,
      debut: (ev) => { const t = ev.target.closest(".masse-table, .masse-plateau"); prise = t ? t.classList.contains("masse-plateau") : null; if (prise === null) return null; if (prise) changer(e, e.n - 1); return L.scene.vers_scene(ev); },
      deplacer: (p) => { e.tenue = p; },
      lacher: (p) => { e.tenue = null; if (Math.abs(p.x - D.X) < 50 && p.y < e.plateau + 20 && e.n < 3) changer(e, e.n + 1); },
    });
  }

  L.poste_seringue = function (g) {
    // Décor, calque animé (seringue, masses, afficheurs) ; faits notés 4 fois par seconde.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230);
    D.fond(L.svg("g", {}, g));
    const e = { n: 0, p: P0, dT: 0, V: V1, note: true, tenue: null, plateau: 0, essais: [{ m: 0, p: P0, V: V1 }] }, c = L.svg("g", {}, g);
    gestes(c, e);
    let avant = null;
    const image = (t) => {
      avancer(e, avant === null ? 0 : Math.min(0.05, (t - avant) / 1000)); avant = t;
      c.replaceChildren();
      e.plateau = D.seringue(c, e.V, e.n);
      D.PLACES.slice(e.n).forEach((x, k) => { const q = e.tenue && k === 0 ? e.tenue : { x, y: D.TABLE }; D.masse(c, q.x, q.y, false); });
      D.afficheurs(c, e.p, 20 + e.dT);
      requestAnimationFrame(image);
    };
    requestAnimationFrame(image);
    setInterval(() => L.missions.noter("seringue", { m: e.n, p: Math.round(e.p), V: Math.round(e.V * 10) / 10, T: Math.round((20 + e.dT) * 10) / 10, essais: e.essais.slice() }), 250);
    return { pense_bete };
  };
})(window.Labo);
