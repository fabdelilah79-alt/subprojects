/*
Rôle : table à coussin d'air (60 cm × 40 cm) vue en perspective, et son mobile autoporteur : on le lance d'un
       geste du doigt ; il glisse sans frottement (mouvement rectiligne uniforme), descend si la table est inclinée,
       ou tourne autour du clou central s'il est retenu par un fil (mouvement circulaire uniforme).
Reçoit : le groupe SVG, les réglages { inclinaison_mm_s2, fil } ; les gestes de l'élève.
Produit : new Labo.CoussinAir(parent, reglages) : pos (mm), vitesse (mm/s), sur_image(fonction(dt)), vers_table(p),
          vers_ecran(x, y) ; constantes Labo.CoussinAir.TABLE. Avec un fil : l'élève accroche lui-même l'anneau
          du fil au mobile (fait noté « fil_accroche »).
Utilisé par : enregistrement.js et les simulations de mouvement (tronc commun, « Le mouvement »).
*/
(function (L) {
  const T = { l: 600, h: 400, loin: 338, pres: 540, l_loin: 480, l_pres: 620, cx: 512, rayon: 38 };
  const CLOU = { x: 300, y: 200 };

  function vers_ecran(x, y) {
    // Point de la table (mm) -> point de l'écran (perspective : le bord lointain paraît plus étroit).
    const v = y / T.h, w = T.l_loin + (T.l_pres - T.l_loin) * v;
    return { x: T.cx + (x / T.l - 0.5) * w, y: T.loin + (T.pres - T.loin) * v, k: w / T.l };
  }

  function vers_table(p) {
    // Point de l'écran -> point de la table (mm).
    const v = (p.y - T.loin) / (T.pres - T.loin), w = T.l_loin + (T.l_pres - T.l_loin) * v;
    return { x: ((p.x - T.cx) / w + 0.5) * T.l, y: v * T.h };
  }

  function dessiner_table(g, fil) {
    // Pieds réglables, cadre en aluminium, plateau recouvert de la feuille d'enregistrement, clou central.
    const c = [vers_ecran(0, 0), vers_ecran(T.l, 0), vers_ecran(T.l, T.h), vers_ecran(0, T.h)];
    L.ombre_sol(g, T.cx + 10, T.pres + 26, 330, 12, 0.5);
    for (const x of [c[3].x + 14, c[2].x - 14]) L.svg("rect", { x: x - 5, y: T.pres + 8, width: 10, height: 18, fill: "url(#acier)" }, g);
    L.svg("path", { d: `M${c[0].x - 12} ${c[0].y - 8} L${c[1].x + 12} ${c[1].y - 8} L${c[2].x + 16} ${c[2].y + 6} L${c[3].x - 16} ${c[3].y + 6} Z`, fill: "url(#metal-h)", stroke: "#6c747a" }, g);
    L.svg("rect", { x: c[3].x - 16, y: c[3].y + 6, width: c[2].x - c[3].x + 32, height: 10, fill: "url(#acier)" }, g);
    const feuille = L.svg("path", { d: `M${c[0].x} ${c[0].y} L${c[1].x} ${c[1].y} L${c[2].x} ${c[2].y} L${c[3].x} ${c[3].y} Z`, fill: "#fbfbf6", stroke: "#c9cdc6", class: "feuille-table" }, g);
    if (fil) {
      const p = vers_ecran(CLOU.x, CLOU.y);
      L.svg("ellipse", { cx: p.x, cy: p.y + 2, rx: 7, ry: 3.5, fill: "#3b3f44" }, g);
      L.tige(g, `M${p.x} ${p.y} V${p.y - 14}`, 3);
    }
    return feuille;
  }

  function CoussinAir(parent, { inclinaison_mm_s2 = 0, fil = false } = {}) {
    // Construit la table et le mobile ; le mobile part du coin bas gauche, immobile.
    this.g = L.svg("g", { class: "coussin-air" }, parent);
    this.feuille = dessiner_table(this.g, fil);
    this.traces = L.svg("g", {}, this.g);
    this.fil_svg = L.svg("path", { fill: "none", stroke: "#e9e2cf", "stroke-width": 1.4 }, this.g);
    this.mobile = L.svg("g", { class: "mobile-autoporteur" }, this.g);
    Object.assign(this, { pos: { x: 90, y: inclinaison_mm_s2 ? L.CoussinAir.TABLE.h - L.CoussinAir.TABLE.rayon : 330 }, vitesse: { x: 0, y: 0 }, a: inclinaison_mm_s2, fil, rayon_fil: 0, ecouteurs: [] });
    this.dessiner_mobile();
    this.rendre_lancable();
    if (fil) this.poignee_fil();
    this.tourner();
  }

  const C = CoussinAir.prototype;

  C.dessiner_mobile = function () {
    // Mobile autoporteur : disque lourd en acier, anneau de caoutchouc, tube porte-électrode, câble.
    const p = vers_ecran(this.pos.x, this.pos.y), rx = T.rayon * p.k, ry = rx * 0.52;
    this.mobile.replaceChildren();
    L.svg("ellipse", { cx: p.x + 4, cy: p.y + 4, rx: rx * 1.05, ry: ry * 1.05, fill: "#000", opacity: 0.25, filter: "url(#flou)" }, this.mobile);
    L.svg("path", { d: `M${p.x - rx} ${p.y - 6} V${p.y} A${rx} ${ry} 0 0 0 ${p.x + rx} ${p.y} V${p.y - 6}`, fill: "url(#acier)" }, this.mobile);
    L.svg("ellipse", { cx: p.x, cy: p.y - 6, rx, ry, fill: "url(#metal-h)", stroke: "#2a2e33", "stroke-width": 1.5 }, this.mobile);
    L.svg("ellipse", { cx: p.x, cy: p.y - 6, rx: rx * 0.45, ry: ry * 0.45, fill: "#3b3f44" }, this.mobile);
    L.tige(this.mobile, `M${p.x} ${p.y - 6} V${p.y - 44}`, 5);
    L.svg("path", { d: `M${p.x} ${p.y - 44} C${p.x} ${p.y - 130} 740 300 810 440`, fill: "none", stroke: "#222", "stroke-width": 2.5 }, this.mobile);
    const c = vers_ecran(CLOU.x, CLOU.y);
    if (this.fil_accroche) this.fil_svg.setAttribute("d", `M${c.x} ${c.y - 12} L${p.x} ${p.y - 8}`);
    else if (this.bout_fil) this.fil_svg.setAttribute("d", `M${c.x} ${c.y - 12} Q${(c.x + this.bout_fil.x) / 2} ${Math.max(c.y, this.bout_fil.y) + 14} ${this.bout_fil.x} ${this.bout_fil.y}`);
    if (this.anneau) this.anneau.setAttribute("pointer-events", this.fil_accroche ? "none" : "auto");
    if (this.anneau) this.anneau.setAttribute("transform", `translate(${this.fil_accroche ? p.x : this.bout_fil.x} ${this.fil_accroche ? p.y - 8 : this.bout_fil.y})`);
  };

  C.rendre_lancable = function () {
    // Le mobile suit le doigt ; au lâcher, il part avec la vitesse du geste (et se retient au fil s'il y en a un).
    const historique = [];
    L.glissable(this.mobile, {
      soulever: false,
      debut: () => { this.tenu = true; this.vitesse = { x: 0, y: 0 }; this.rayon_fil = 0; historique.length = 0; L.annoncer("mobile_pris"); return vers_ecran(this.pos.x, this.pos.y); },
      deplacer: (p) => {
        const q = vers_table(p);
        this.pos = { x: Math.max(T.rayon, Math.min(T.l - T.rayon, q.x)), y: Math.max(T.rayon, Math.min(T.h - T.rayon, q.y)) };
        historique.push({ t: performance.now(), ...this.pos });
        this.dessiner_mobile();
      },
      lacher: () => this.lancer(historique),
      fin: () => { this.tenu = false; },
    });
  };

  C.lancer = function (historique) {
    // Vitesse du geste (sur les 100 dernières millisecondes), bornée entre 0 et 900 mm/s.
    const recents = historique.filter((h) => h.t > performance.now() - 100);
    if (recents.length < 2) return;
    const a = recents[0], b = recents[recents.length - 1], dt = Math.max(0.016, (b.t - a.t) / 1000);
    let v = { x: (b.x - a.x) / dt, y: (b.y - a.y) / dt };
    const n = Math.hypot(v.x, v.y);
    if (n > 900) v = { x: (v.x * 900) / n, y: (v.y * 900) / n };
    if (this.fil_accroche) this.accrocher(v);
    else this.vitesse = v;
  };

  C.accrocher = function (v) {
    // Retenu par le fil : la vitesse devient perpendiculaire au fil, sa valeur ne change plus (MCU).
    const r = { x: this.pos.x - CLOU.x, y: this.pos.y - CLOU.y }, d = Math.hypot(r.x, r.y) || 1;
    this.rayon_fil = Math.max(80, Math.min(170, d));
    this.pos = { x: CLOU.x + (r.x * this.rayon_fil) / d, y: CLOU.y + (r.y * this.rayon_fil) / d };
    const t = { x: -r.y / d, y: r.x / d }, vt = v.x * t.x + v.y * t.y;
    const valeur = Math.max(150, Math.abs(vt)) * (vt < 0 ? -1 : 1);
    this.vitesse = { x: t.x * valeur, y: t.y * valeur };
  };

  L.CoussinAir = CoussinAir;
  L.CoussinAir.TABLE = T;
  L.CoussinAir.CLOU = CLOU;
  L.CoussinAir.vers_ecran = vers_ecran;
})(window.Labo);

(function (L) {
  const C = L.CoussinAir.prototype;

  C.poignee_fil = function () {
    // Fil attaché au clou, terminé par un anneau : on le fait glisser jusqu'au mobile pour l'y accrocher.
    const c = L.CoussinAir.vers_ecran(L.CoussinAir.CLOU.x, L.CoussinAir.CLOU.y);
    this.bout_fil = { x: c.x + 46, y: c.y + 6 };
    this.anneau = L.svg("g", { class: "anneau-fil" }, this.g);
    L.svg("circle", { r: 12, fill: "#000", opacity: 0.001 }, this.anneau);
    L.svg("circle", { r: 5, fill: "none", stroke: "url(#metal)", "stroke-width": 2.4 }, this.anneau);
    L.glissable(this.anneau, {
      soulever: false,
      debut: () => (this.fil_accroche ? null : { ...this.bout_fil }),
      deplacer: (p) => { this.bout_fil = p; this.dessiner_mobile(); },
      lacher: (p) => {
        const m = L.CoussinAir.vers_ecran(this.pos.x, this.pos.y);
        if (Math.hypot(p.x - m.x, p.y - m.y) < 34) { this.fil_accroche = true; L.missions.noter("fil_accroche", true); }
        this.dessiner_mobile();
      },
    });
    this.dessiner_mobile();
  };
})(window.Labo);
