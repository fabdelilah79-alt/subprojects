/*
Rôle : éclateur (générateur d'étincelles) relié au mobile : bouton rotatif de la durée τ (20, 40 ou 60 ms) et
       bouton « Enregistrer ». Pendant l'enregistrement, une étincelle marque un point sur la feuille toutes les τ.
       Un nouvel enregistrement se fait sur une feuille neuve ; il s'arrête seul après 30 points ou à l'arrêt du mobile.
Reçoit : le groupe SVG, le mobile (Labo.CoussinAir), la position du boîtier.
Produit : new Labo.Eclateur(parent, mobile, x, y) : points (liste { t, x, y } en s et mm), tau_s ;
          fait noté « enregistrement » = { tau_s, points, fil, table, air, masse_kg } à la fin de chaque enregistrement.
Utilisé par : les simulations de mouvement avec la table à coussin d'air.
*/
(function (L) {
  const DUREES_MS = [20, 40, 60], MAX_POINTS = 30;

  function boitier(g, x, y) {
    // Boîtier gris de l'éclateur, plaque signalétique, voyant de tension.
    L.svg("rect", { x, y, width: 196, height: 80, rx: 4, fill: "url(#facade)", stroke: "#4a5254", filter: "url(#ombre)" }, g);
    L.svg("rect", { x: x + 8, y: y + 6, width: 166, height: 14, fill: "#2a2f33" }, g);
    L.texte(g, x + 91, y + 13.5, "ÉCLATEUR — haute tension", { "font-size": 8.5, fill: "#e3d07a", "font-weight": 700, "letter-spacing": 0.5 });
    return L.svg("circle", { cx: x + 184, cy: y + 13, r: 3.5, fill: "#5a1d1d" }, g);
  }

  function Eclateur(parent, mobile, x, y) {
    // Construit l'éclateur et branche ses deux boutons.
    this.g = L.svg("g", { class: "eclateur" }, parent);
    this.mobile = mobile;
    this.voyant = boitier(this.g, x, y);
    this.duree = 1;
    this.points = [];
    this.actif = false;
    this.molette(x + 36, y + 50);
    this.bouton = L.bouton_poussoir(this.g, x + 130, y + 50, { textes: ["Enregistrer", "Arrêter"], sur_changement: (oui) => (oui ? this.commencer() : this.finir()) });
    mobile.sur_image((dt, m) => this.suivre(dt, m));
    // Mobile repris en main pendant l'enregistrement : feuille neuve, pour un relevé d'un seul lancer.
    L.ecouter("mobile_pris", (e) => { if (e.mobile === mobile && this.actif && this.points.length) this.commencer(); });
  }

  const E = Eclateur.prototype;

  E.molette = function (x, y) {
    // Bouton rotatif de τ : un toucher passe à la durée suivante ; l'index montre la durée choisie.
    const g = L.svg("g", { class: "molette", role: "button", tabindex: 0 }, this.g);
    DUREES_MS.forEach((d, i) => {
      const a = (-70 + i * 70) * (Math.PI / 180);
      L.texte(g, x + 20 * Math.sin(a), y - 20 * Math.cos(a), String(d), { "font-size": 7.5, fill: "#f1f1ec", "font-weight": 700 });
    });
    L.texte(g, x, y + 21, "τ (ms)", { "font-size": 7.5, fill: "#f1f1ec" });
    L.svg("circle", { cx: x, cy: y, r: 12, fill: "url(#acier)", stroke: "#111" }, g);
    const index = L.svg("line", { x1: x, y1: y, x2: x, y2: y - 10, stroke: "#f1d58a", "stroke-width": 2.4, "stroke-linecap": "round" }, g);
    const montrer = () => {
      index.setAttribute("transform", `rotate(${-70 + this.duree * 70} ${x} ${y})`);
      g.setAttribute("aria-label", `Durée entre deux étincelles : ${DUREES_MS[this.duree]} ms`);
    };
    const tourner = () => { if (!this.actif) { this.duree = (this.duree + 1) % DUREES_MS.length; montrer(); } };
    g.addEventListener("pointerdown", (e) => { e.labo_pris = true; });
    g.addEventListener("click", tourner);
    g.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); tourner(); } });
    montrer();
  };

  E.commencer = function () {
    // Feuille neuve, compteur à zéro, voyant allumé.
    this.tau_s = DUREES_MS[this.duree] / 1000;
    this.points = [];
    this.temps = 0;
    this.prochain = 0;
    this.repos = 0;
    this.actif = true;
    this.voyant.setAttribute("fill", "#ff3b30");
    L.annoncer("enregistrement", { mobile: this.mobile, points: this.points, nouveau: true });
  };

  E.suivre = function (dt, m) {
    // Une étincelle toutes les τ : le point est marqué sous le centre du mobile.
    if (!this.actif) return;
    this.temps += dt;
    if (this.temps + 1e-9 >= this.prochain) {
      // Deux palets solidaires : chacun a son électrode (marques A et B) ; x, y reste le centre d'inertie.
      this.points.push({ t: Math.round(this.prochain * 1000) / 1000, x: m.pos.x, y: m.pos.y, ...(m.marques ? m.marques() : {}) });
      this.prochain += this.tau_s;
      L.annoncer("etincelle", { mobile: this.mobile, point: this.points[this.points.length - 1], points: this.points });
      if (this.points.length >= MAX_POINTS) this.finir();
    }
    if (this.points.length > 1 && m.immobile()) this.finir();
  };

  E.finir = function () {
    // Fin de l'enregistrement : le voyant s'éteint, le relevé est noté pour les missions.
    if (!this.actif) return;
    this.actif = false;
    this.bouton.regler(false);
    this.voyant.setAttribute("fill", "#5a1d1d");
    L.missions.noter("enregistrement", { tau_s: this.tau_s, points: this.points.map((p) => ({ ...p })), fil: !!this.mobile.rayon_fil, table: this.mobile.nom, air: !this.mobile.sans_air, masse_kg: this.mobile.masse_kg ?? null });
    L.annoncer("enregistrement", { mobile: this.mobile, points: this.points, fini: true });
  };

  L.Eclateur = Eclateur;
})(window.Labo);
