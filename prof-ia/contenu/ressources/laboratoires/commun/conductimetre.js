/*
Rôle : conductimètre de paillasse aux vraies dimensions : boîtier (140 mm × 90 mm) à afficheur (σ en mS/cm) et sonde (tube
       noir de 12 mm × 150 mm, fenêtre et plaques de platine en bas, câble) tenue par une pince sur une tige ; on fait
       glisser la sonde vers le haut ou le bas pour la plonger dans le récipient placé dessous ; elle est dessinée derrière
       la paroi avant de ce récipient (on la voit à travers le verre et le liquide). σ = Σ λi·[Xi] (λ des tables,
       conductimetrie.js, complétées ici) + 5 × 10⁻⁴ S/m pour l'eau ; 1 S/m = 10 mS/cm. L'affichage rejoint la valeur vraie
       en environ 1 s si la solution est agitée, en plus de 10 s sinon (il faut agiter pour lire une valeur juste).
Reçoit : le contexte de la paillasse et { x (milieu du boîtier), sol, e, tige (x de la tige), sonde_x, haut, bas (y de la
         pointe de la sonde, levée et plongée), recipients() (récipients où plonger), agite(r) }.
Produit : Labo.conductimetre(ctx, reglage) -> { etat() -> { plonge, dans (id du récipient), sigma (mS/cm, valeur vraie),
          affiche (texte de l'afficheur), stable } } ; Labo.sigma_phase(phase) (S/m).
Utilisé par : les postes de titrage conductimétrique.
*/
(function (L) {
  Object.entries({ "CH3CO2-": 4.09, "SO4--": 16.0, "Fe2+": 10.7, "Fe3+": 20.4, "Mn2+": 10.7, "MnO4-": 6.1, "I-": 7.7, "S2O3--": 17.0 }).forEach(([s, v]) => { L.LAMBDA[s] ??= v; });
  L.sigma_phase = (ph) => Object.entries(ph.dissous).reduce((s, [ion, q]) => s + (L.LAMBDA[ion] || 0) * (q / ph.V), 5e-4);
  const LONG = 150, FENETRE = 25;

  function boitier(g, x, sol, e) {
    // Boîtier gris clair posé sur la paillasse, afficheur à cristaux liquides, inscriptions ; renvoie le texte de l'écran.
    const l = 140 * e, h = 90 * e, y = sol - h;
    L.ombre_sol(g, x, sol + 2, l * 0.55, 5, 0.4);
    L.svg("rect", { x: x - l / 2, y, width: l, height: h, rx: 5, fill: "#d9dcd8", stroke: "#7f8784" }, g);
    L.svg("rect", { x: x - l / 2 + 10, y: y + 10, width: l - 20, height: 34, rx: 3, fill: "#b7c3a6", stroke: "#1b1e1a" }, g);
    L.texte(g, x, y + 56, "CONDUCTIMÈTRE", { "font-size": 7.5, "font-weight": 700, fill: "#37474f" });
    L.texte(g, x + l / 2 - 14, y + 38, "mS/cm", { "font-size": 6.5, "font-weight": 700, fill: "#1b1f17", "text-anchor": "end" });
    L.svg("circle", { cx: x + l / 2 - 14, cy: y + h - 14, r: 5, fill: "#2b3035" }, g);
    return L.texte(g, x + l / 2 - 16, y + 25, "", { "font-size": 20, "font-family": "monospace", "font-weight": 700, fill: "#1b1f17", "text-anchor": "end" });
  }

  function sonde(g, sx, y, e, tige, boite) {
    // Pince sur la tige, sonde noire (pointe en y), fenêtre et plaques de platine, câble jusqu'au boîtier.
    g.replaceChildren();
    const haut = y - LONG * e, r = 6 * e;
    L.svg("path", { d: `M${sx} ${haut} C${sx} ${haut - 40} ${boite.x} ${boite.y - 60} ${boite.x} ${boite.y}`, fill: "none", stroke: "#1d1f22", "stroke-width": 2.5 }, g);
    const bras = tige < sx ? [tige, sx - r] : [sx + r, tige];
    L.svg("rect", { x: bras[0], y: haut + 20 * e - 3, width: bras[1] - bras[0], height: 6, fill: "url(#metal)" }, g); L.noix(g, tige, haut + 20 * e);
    L.svg("rect", { x: sx - r, y: haut, width: 2 * r, height: LONG * e, rx: 3, fill: "#24272b", stroke: "#000" }, g);
    L.svg("rect", { x: sx - r + 1.5, y: y - FENETRE * e, width: 2 * r - 3, height: (FENETRE - 3) * e, rx: 1, fill: "#8b9096", opacity: 0.85 }, g);
    for (const dx of [-2, 2]) L.svg("rect", { x: sx + dx * e - 0.8, y: y - (FENETRE - 3) * e, width: 1.6, height: (FENETRE - 8) * e, fill: "#d8dade" }, g);
    L.svg("rect", { x: sx - r - 2, y: haut + 16 * e, width: 2 * r + 4, height: 8 * e, rx: 2, fill: "#c8302c" }, g);
  }

  function plongee(r, p, e) {
    // Vrai si la fenêtre de la sonde (pointe en p) est sous la surface du liquide de r.
    if (!L.dans_polygone(r.interieur_monde(), p)) return false;
    return r.pose.y - r.pr.hauteur_de(r.c.volume()) * e < p.y - FENETRE * e;
  }

  L.conductimetre = function (ctx, { x, sol, e = 1, tige, sonde_x, haut, bas, recipients, agite }) {
    // Boîtier, sonde à glisser ; mesure 10 fois par seconde, avec le temps de réponse.
    const ecran = boitier(L.svg("g", { class: "conductimetre" }, ctx.fond), x, sol, e), s = { y: haut, aff: 0, vrai: 0, dans: null, plonge: false };
    const gs = L.svg("g", { class: "sonde", role: "slider", "aria-label": "Sonde du conductimètre" }, ctx.objets), boite = { x: x - 40 * e, y: sol - 90 * e };
    const dessiner = () => { sonde(gs, sonde_x, s.y, e, tige, boite); L.svg("rect", { x: sonde_x - 14, y: s.y - LONG * e, width: 28, height: LONG * e, fill: "#fff", opacity: 0.01 }, gs); };
    L.glissable(gs, { soulever: false, debut: () => ({ x: sonde_x, y: s.y }), deplacer: (p) => { s.y = Math.max(haut, Math.min(bas, p.y)); dessiner(); } });
    dessiner();
    const derriere = () => {
      // La sonde est vue à travers la paroi avant du récipient placé dessous (perspective) : on la dessine juste derrière lui.
      const r = (recipients() || []).find((k) => !k.tenu && Math.abs(k.pose.x - sonde_x) < k.pr.r(k.pr.H) * e);
      if (r && gs.nextSibling !== r.g) ctx.objets.insertBefore(gs, r.g);
    };
    const ecrire = (v) => { ecran.textContent = (v < 2 ? v.toFixed(3) : v < 20 ? v.toFixed(2) : v.toFixed(1)).replace(".", ","); };
    setInterval(() => {
      derriere();
      const p = { x: sonde_x, y: s.y }, r = (recipients() || []).find((k) => plongee(k, p, e)), ph = r && r.c.phases.find((q) => q.classe === "aqueuse");
      s.vrai = ph ? 10 * L.sigma_phase(ph) : 0; s.dans = r ? r.id : null; s.plonge = !!ph;
      s.aff += (s.vrai - s.aff) * (1 - Math.exp(-0.1 / (r && agite(r) ? 0.35 : 9)));
      ecrire(s.aff * (1 + (Math.random() - 0.5) * 0.002));
    }, 100);
    return { etat: () => ({ plonge: s.plonge, dans: s.dans, sigma: s.vrai, affiche: ecran.textContent, stable: Math.abs(s.aff - s.vrai) <= 0.003 * s.vrai + 1e-4 }) };
  };
})(window.Labo);
