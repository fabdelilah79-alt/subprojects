/*
Rôle : plateau d'accessoires posé devant le banc à ressort : deux surcharges de 100 g, palette en carton, aimant de freinage
       et ressort de rechange. Toucher un accessoire du plateau le monte sur le mobile (ou échange le ressort) ; toucher sa
       place vide le remet sur le plateau. Chaque changement arrête le mobile à l'équilibre.
Reçoit : le groupe SVG, le banc (banc_ressort.js) et { amortisseurs: ["palette", "aimant"], rechange (raideur du ressort de
         rechange en N/m, ou null), surcharges (0 à 2) }.
Produit : Labo.accessoires_ressort(g, banc, reglage) -> { noter() } ; fait « montage » = { m (kg), k (N/m), amortisseur }.
Utilisé par : les simulations des oscillateurs mécaniques (2e année du bac).
*/
(function (L) {
  const Y = 566;

  function place(g, x, l, nom, plein, dessin, action) {
    // Une place du plateau : l'objet s'il y est, sinon son contour en pointillés ; touchable dans les deux cas.
    const p = L.svg("g", { class: `accessoire-${nom.replace(/ /g, "-")}`, role: "button", "aria-label": nom }, g);
    if (plein) dessin(p, x); else L.svg("rect", { x: x - l / 2, y: Y - 4, width: l, height: 10, rx: 2, fill: "none", stroke: "#e8d9b5", "stroke-dasharray": "2 2", "stroke-width": 0.7 }, p);
    L.svg("rect", { x: x - l / 2 - 3, y: Y - 10, width: l + 6, height: 22, fill: "#000", opacity: 0.001 }, p);
    L.glissable(p, { soulever: false, debut: () => ({ x: 0, y: 0 }), toucher: action });
  }

  const surcharge = (p, x) => L.pieces_banc.surcharge(p, x, Y + 4);
  const palette = (p, x) => L.pieces_banc.palette(p, x, Y, true);
  const aimant = (p, x) => L.pieces_banc.aimant(p, x, Y - 6);

  function ressort(p, x, k) {
    // Ressort de rechange couché sur le plateau, avec son étiquette de raideur.
    L.svg("path", { d: `M${x - 26} ${Y} ` + Array.from({ length: 10 }, () => "c1.7 -5 3.4 -5 5.2 0 c-1.7 5 1.7 5 0 0").join(" "), fill: "none", stroke: k > 15 ? "#2e8b57" : "#2f6db3", "stroke-width": 1.2 }, p);
    L.texte(p, x, Y + 13, `${k} N/m`, { "font-size": 5.5, fill: "#f4f1e6" });
  }

  L.accessoires_ressort = function (g, banc, { amortisseurs = ["palette", "aimant"], rechange = null, surcharges = 2 } = {}) {
    // Plateau en bois, places des accessoires ; redessin à chaque changement.
    const e = banc.e, gp = L.svg("g", {}, g), r = { k: rechange };
    const noter = () => L.missions.noter("montage", { m: Math.round(banc.masse() * 1000) / 1000, k: e.k, amortisseur: e.amortisseur });
    const dessiner = () => {
      gp.replaceChildren();
      L.ombre_sol(gp, 470, Y + 16, 140, 5, 0.35);
      L.svg("path", { d: `M330 ${Y - 12} h280 l6 22 h-292 Z`, fill: "url(#bois-face)", stroke: "#6b4a2a" }, gp);
      for (let i = 0; i < surcharges; i++) place(gp, 354 + i * 24, 16, `surcharge ${i + 1}`, e.n <= i, surcharge, () => changer({ n: e.n <= i ? i + 1 : i }));
      amortisseurs.forEach((a, i) => place(gp, 424 + i * 52, a === "palette" ? 38 : 22, a, e.amortisseur !== a, a === "palette" ? palette : aimant, () => changer({ amortisseur: e.amortisseur === a ? "aucun" : a })));
      if (r.k) place(gp, 560, 56, "ressort de rechange", true, (p, x) => ressort(p, x, r.k), () => { const k = e.k; changer({ k: r.k }); r.k = k; });
    };
    const changer = (c) => { banc.regler(c); dessiner(); noter(); };
    dessiner(); noter();
    return { noter };
  };
})(window.Labo);
