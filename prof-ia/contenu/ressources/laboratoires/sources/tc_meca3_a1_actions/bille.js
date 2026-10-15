/*
Rôle : bille d'acier lâchée en haut de la gouttière : elle descend, roule sur le plateau (léger frottement), est attirée
       par l'aimant (action à distance, en 1/d²), rebondit sur la cale (action de contact), s'arrête sur le feutre du bord.
       Une photographie à pose multiple garde une image de la bille toutes les 0,06 s.
Reçoit : le groupe SVG, l'aimant et la cale (Labo.ObjetPlateau) ; un toucher (ou un petit glissé) sur la bille : la lâcher, ou la remettre en haut.
Produit : new Labo.Bille(parent, aimant, cale) ; fait noté à la fin de chaque lancer :
          lancer_bille = { aimant, cale (posés ?), deviation_mm, rebond, collee }.
Utilisé par : poste_bille.js.
*/
(function (L) {
  const R = 9, V0 = 680, FROTTEMENT = 80, K_AIMANT = 1.6e7, PHOTO_S = 0.06, DESCENTE_S = 0.45, REBOND = 0.6;

  function Bille(parent, aimant, cale) {
    // La bille attend en haut de la gouttière.
    Object.assign(this, { aimant, cale, etat: "haut", s: 0 });
    this.photos = L.svg("g", { "pointer-events": "none" }, parent);
    this.g = L.svg("g", { class: "bille", role: "button", "aria-label": "Bille d'acier" }, parent);
    // Le geste est suivi sur le groupe (qui reste en place) : la bille est redessinée à chaque image.
    const ici = () => this.ecran || { x: 0, y: 0 };
    L.glissable(this.g, { soulever: false, debut: ici, fin: () => this.toucher() });
    this.dessiner();
    this.tourner();
  }

  const B = Bille.prototype;

  B.toucher = function () {
    // En haut : la bille est lâchée. Arrêtée sur le plateau : on la remet en haut de la gouttière.
    if (this.etat === "haut") Object.assign(this, { etat: "descente", s: 0, temps: 0 });
    else if (this.etat === "arret") { this.etat = "haut"; this.dessiner(); }
  };

  B.partir = function () {
    // Arrivée sur le plateau : nouveau lancer, nouvelle photographie.
    this.photos.replaceChildren();
    Object.assign(this, { etat: "roule", pos: { x: R + 6, y: L.Plateau.P.ligne }, v: { x: V0, y: 0 }, photo: 0, deviation: 0, rebond: false, collee: false });
    this.avec = { aimant: this.aimant.sur_plateau(), cale: this.cale.sur_plateau() };
  };

  B.attirer = function (dt) {
    // Action de l'aimant (à distance) : vers son centre, d'autant plus forte que la bille est proche.
    if (!this.avec.aimant) return;
    const d = { x: this.aimant.pos.x - this.pos.x, y: this.aimant.pos.y - this.pos.y }, n = Math.hypot(d.x, d.y);
    if (n < 24) { this.collee = true; this.v = { x: 0, y: 0 }; return; }
    const a = Math.min(9000, K_AIMANT / (n * n));
    this.v.x += (a * d.x / n) * dt;
    this.v.y += (a * d.y / n) * dt;
  };

  B.heurter = function () {
    // Action de la cale (de contact) : la bille rebondit sur sa face, en perdant de la vitesse.
    if (!this.avec.cale) return;
    const { a, b, demi_epaisseur } = this.cale.segment(), u = { x: b.x - a.x, y: b.y - a.y }, l2 = u.x * u.x + u.y * u.y;
    const t = Math.max(0, Math.min(1, ((this.pos.x - a.x) * u.x + (this.pos.y - a.y) * u.y) / l2));
    const q = { x: a.x + u.x * t, y: a.y + u.y * t }, e = { x: this.pos.x - q.x, y: this.pos.y - q.y }, d = Math.hypot(e.x, e.y) || 1;
    const n = { x: e.x / d, y: e.y / d }, vn = this.v.x * n.x + this.v.y * n.y;
    if (d > R + demi_epaisseur || vn >= 0) return;
    this.v = { x: this.v.x - (1 + REBOND) * vn * n.x, y: this.v.y - (1 + REBOND) * vn * n.y };
    this.rebond = true;
  };

  B.rouler = function (dt) {
    // Un petit pas de 2 ms : frottement, aimant, cale, déplacement ; arrêt sur le feutre ou faute de vitesse.
    const P = L.Plateau.P, v = Math.hypot(this.v.x, this.v.y), reste = Math.max(0, v - FROTTEMENT * dt);
    if (v) this.v = { x: (this.v.x * reste) / v, y: (this.v.y * reste) / v };
    this.attirer(dt);
    this.heurter();
    this.pos.x += this.v.x * dt;
    this.pos.y += this.v.y * dt;
    if (!this.rebond) this.deviation = Math.max(this.deviation, Math.abs(this.pos.y - P.ligne));
    const bord = this.pos.x > P.l - R || this.pos.x < R || this.pos.y < R || this.pos.y > P.h - R;
    if (bord || this.collee || Math.hypot(this.v.x, this.v.y) < 5) this.arreter();
  };

  B.arreter = function () {
    // Fin du lancer : la bille reste où elle est ; le résultat est noté.
    this.etat = "arret";
    const P = L.Plateau.P;
    this.pos = { x: Math.max(R, Math.min(P.l - R, this.pos.x)), y: Math.max(R, Math.min(P.h - R, this.pos.y)) };
    L.missions.noter("lancer_bille", { ...this.avec, deviation_mm: Math.round(this.deviation), rebond: this.rebond, collee: this.collee });
  };

  B.avancer = function (dt) {
    // Fait avancer la descente sur la gouttière, ou le roulement sur le plateau (photographie comprise).
    if (this.etat === "descente") {
      this.temps += dt;
      this.s = Math.min(1, (this.temps / DESCENTE_S) ** 2);
      if (this.s >= 1) this.partir();
      return;
    }
    if (this.etat !== "roule") return;
    for (let reste = dt; reste > 1e-6 && this.etat === "roule"; reste -= 0.002) {
      // La photographie est prise à l'instant exact (au pas de 2 ms près) : images régulièrement espacées.
      this.rouler(Math.min(0.002, reste));
      this.photo -= Math.min(0.002, reste);
      if (this.photo <= 0) { this.photo += PHOTO_S; this.prendre_photo(); }
    }
  };

  B.prendre_photo = function () {
    // Une image pâle de la bille, laissée sur la photographie à pose multiple.
    const p = L.Plateau.vers_ecran(this.pos.x, this.pos.y), r = R * p.k * 1.25;
    L.svg("circle", { cx: p.x, cy: p.y - r, r, fill: "#8a949b", opacity: 0.5, stroke: "#4a5258", "stroke-width": 0.5 }, this.photos);
  };

  B.dessiner = function () {
    // La bille sur la gouttière ou sur le plateau (posée : son centre est un rayon au-dessus du plateau).
    this.g.replaceChildren();
    const p = this.etat === "haut" || this.etat === "descente" ? { ...L.Plateau.sur_gouttiere(this.s), k: 0.9 } : L.Plateau.vers_ecran(this.pos.x, this.pos.y);
    const r = R * p.k * 1.25;
    this.ecran = { x: p.x, y: p.y - r };
    L.svg("circle", { cx: p.x, cy: p.y - r, r: r + 10, fill: "#000", opacity: 0.001 }, this.g);
    L.Plateau.dessiner_bille(this.g, { x: p.x, y: p.y - r }, r);
  };

  B.tourner = function () {
    // Boucle d'animation.
    let avant = null;
    const image = (instant) => {
      const dt = avant === null ? 0 : Math.min(0.05, (instant - avant) / 1000);
      avant = instant;
      this.avancer(dt);
      this.dessiner();
      requestAnimationFrame(image);
    };
    requestAnimationFrame(image);
  };

  L.Bille = Bille;
})(window.Labo);
