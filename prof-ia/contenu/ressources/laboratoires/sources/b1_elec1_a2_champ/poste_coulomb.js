/*
Rôle : paillasse de la balance de Coulomb : la sonde (5 kV) donne à la sphère qu'elle touche la charge q0 = 5,56 nC ; la
       sphère C neutre partage sa charge avec la sphère qu'elle touche (sphères identiques : moitié chacune) ; « Décharger »
       relie les trois sphères à la Terre. La force entre A et B, F = k·qA·qB/d², est lue sur la balance (Δm = F/g, en mg,
       au dixième près) ; chaque mesure stable est relevée (d, Δm, charges).
Reçoit : le groupe SVG de la paillasse ; les gestes de l'élève.
Produit : Labo.poste_coulomb(g) -> { pense_bete } ; fait « coulomb » = { d (cm), qA, qB, qC (nC), dm (mg), releves: [{ d, dm, qA, qB }] }.
Utilisé par : simulation.js (paillasse 1).
*/
(function (L) {
  const D = L.coulomb_dessin, K = 8.99e9, Q0 = 5.56, G = 9.81, REPOS_S = { x: 700, y: 380 }, REPOS_C = { x: 240, y: 470 };
  const dm = (e) => (K * e.qA * e.qB * 1e-18) / ((e.d / 100) ** 2) / G * 1e6;

  function toucher(e, p, cle) {
    // Sphère touchée (A ou B) par la sonde ou par la sphère C.
    const B = { x: D.A.x, y: D.y_b(e.d) }, prs = (s) => Math.hypot(p.x - s.x, p.y - s.y) < D.R + 14;
    const s = prs(D.A) ? "qA" : prs(B) ? "qB" : null;
    if (!s) return;
    if (cle === "sonde") e[s] = Q0;
    else { const m = (e[s] + e.qC) / 2; e[s] = m; e.qC = m; }
    relever(e);
  }

  function relever(e) {
    // Relevé de la mesure (une par couple distance-charges).
    const r = { d: e.d, dm: Math.round(dm(e) * 10) / 10, qA: Math.round(e.qA * 100) / 100, qB: Math.round(e.qB * 100) / 100 };
    e.releves = e.releves.filter((x) => !(x.d === r.d && x.qA === r.qA && x.qB === r.qB)).concat([r]);
  }

  function gestes(c, e) {
    // Noix de la sphère B (distance au demi-centimètre), sonde et sphère C (touchent une sphère quand on les lâche).
    let prise = null;
    c.addEventListener("pointerdown", (ev) => { const t = ev.target; prise = t.closest(".noix-b") ? "noix" : t.closest(".sonde-ht") ? "sonde" : t.closest(".sphere-c") ? "c" : null; }, { capture: true });
    L.glissable(c, {
      soulever: false,
      debut: () => (prise === "noix" ? { x: D.X_STATIF, y: D.y_b(e.d) } : prise === "sonde" ? { ...e.sonde } : prise ? { ...e.c } : null),
      deplacer: (p) => { if (prise === "noix") e.d = Math.max(4, Math.min(10, Math.round(((D.A.y - p.y) / 25) * 2) / 2)); else e[prise === "sonde" ? "sonde" : "c"] = p; },
      lacher: (p) => { if (prise === "noix") relever(e); else { toucher(e, p, prise === "sonde" ? "sonde" : "c"); if (prise === "sonde") e.sonde = { ...REPOS_S }; else e.c = { ...REPOS_C }; } },
    });
  }

  L.poste_coulomb = function (g) {
    // Décor, bouton Décharger, calque redessiné à chaque image ; faits notés 4 fois par seconde.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230);
    D.fond(L.svg("g", {}, g));
    const e = { d: 6, qA: 0, qB: 0, qC: 0, sonde: { ...REPOS_S }, c: { ...REPOS_C }, releves: [] }, c = L.svg("g", {}, g);
    L.bouton_texte(g, 830, 492, "Décharger", () => { e.qA = e.qB = e.qC = 0; });
    gestes(c, e);
    const image = () => { c.replaceChildren(); D.sphere_b(c, e.d); D.sphere_c(c, e.c); D.sonde(c, e.sonde); D.afficheur(c, dm(e) + (e.qA * e.qB ? (Math.random() - 0.5) * 0.08 : 0)); requestAnimationFrame(image); };
    requestAnimationFrame(image);
    setInterval(() => L.missions.noter("coulomb", { d: e.d, qA: Math.round(e.qA * 100) / 100, qB: Math.round(e.qB * 100) / 100, qC: Math.round(e.qC * 100) / 100, dm: Math.round(dm(e) * 10) / 10, releves: e.releves.slice() }), 250);
    return { pense_bete };
  };
})(window.Labo);
