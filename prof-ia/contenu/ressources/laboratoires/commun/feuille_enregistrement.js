/*
Rôle : feuille d'enregistrement de la table à coussin d'air : les étincelles y marquent des points (vus en
       perspective sur la table) ; un toucher sur la feuille la prend en main, à l'échelle (1 mm = 1,2 px, au-dessus des objets posés),
       points numérotés au crayon M0, M1, M2... ; on y pose les outils de mesure (transparent, règle).
Reçoit : le groupe de la table, le calque du dessus, le mobile ; les annonces « etincelle » et « enregistrement ».
Produit : new Labo.Feuille(table, dessus, mobile) : ouvrir(), fermer(), points ; vers_feuille(x, y) (mm -> px) ;
          Labo.Feuille.ECHELLE (px par mm).
Utilisé par : outils_mesure.js et les simulations de mouvement.
*/
(function (L) {
  const ECHELLE = 1.2, ORIGINE = { x: 152, y: 22 };
  const vers_feuille = (x, y) => ({ x: ORIGINE.x + x * ECHELLE, y: ORIGINE.y + y * ECHELLE });

  function Feuille(table, dessus, mobile) {
    // Prépare les points sur la table et la feuille relevée (cachée tant qu'on ne la prend pas).
    this.points = [];
    this.marques = L.svg("g", {}, table.traces);
    this.vue = L.svg("g", { class: "feuille-relevee", style: "display:none" }, dessus);
    L.svg("rect", { width: L.LARGEUR, height: L.HAUTEUR, fill: "#000", opacity: 0.35 }, this.vue);
    const T = L.CoussinAir.TABLE;
    L.svg("rect", { x: ORIGINE.x, y: ORIGINE.y, width: T.l * ECHELLE, height: T.h * ECHELLE, fill: "#fdfdf8", stroke: "#bdb8a6", filter: "url(#ombre-levee)" }, this.vue);
    this.dessin = L.svg("g", {}, this.vue);
    const bord = L.svg("clipPath", { id: "bord-feuille" }, dessus.ownerSVGElement.querySelector("defs"));
    L.svg("rect", { x: ORIGINE.x, y: ORIGINE.y, width: T.l * ECHELLE, height: T.h * ECHELLE }, bord);
    this.outils = L.svg("g", { "clip-path": "url(#bord-feuille)" }, this.vue);
    this.languette(T);
    L.ecouter("etincelle", (e) => this.marquer(e.point, mobile));
    L.ecouter("enregistrement", (e) => { if (e.nouveau) { this.points = []; this.marques.replaceChildren(); } });
    L.glissable(table.feuille, { soulever: false, debut: () => ({ x: 0, y: 0 }), toucher: () => this.ouvrir() });
  }

  const F = Feuille.prototype;

  F.languette = function (T) {
    // Languette « Reposer la feuille », au milieu du bas de la feuille.
    const g = L.svg("g", { class: "reposer-feuille", role: "button", tabindex: 0, "aria-label": "Reposer la feuille" }, this.vue);
    const x = ORIGINE.x + (T.l * ECHELLE) / 2 + 75, y = ORIGINE.y + T.h * ECHELLE;
    L.svg("path", { d: `M${x - 150} ${y} H${x} V${y + 34} H${x - 150} Z`, fill: "#efe7cf", stroke: "#b9b19a" }, g);
    L.texte(g, x - 75, y + 17, "Reposer la feuille", { class: "etiquette-carton", "font-size": 17 });
    g.addEventListener("pointerdown", (e) => { e.labo_pris = true; });
    g.addEventListener("click", () => this.fermer());
    g.addEventListener("keydown", (e) => { if (e.key === "Enter") this.fermer(); });
  };

  F.marquer = function (point, mobile) {
    // Étincelle : un petit point noir sur la feuille, et un éclair bref sous le mobile.
    this.points.push(point);
    const p = L.CoussinAir.vers_ecran(point.x, point.y);
    L.svg("ellipse", { cx: p.x, cy: p.y, rx: 1.6, ry: 1.1, fill: "#111" }, this.marques);
    const eclair = L.svg("circle", { cx: p.x, cy: p.y - 3, r: 9, fill: "#cfe8ff", opacity: 0.9 }, mobile.mobile);
    L.animer(0.12, (t) => eclair.setAttribute("opacity", 0.9 * (1 - t)), () => eclair.remove());
  };

  function place_numero(points, i, p) {
    // Numéro Mi à côté du point, perpendiculairement à la trajectoire, d'un côté puis de l'autre.
    const a = points[Math.max(0, i - 1)], b = points[Math.min(points.length - 1, i + 1)];
    const l = Math.hypot(b.x - a.x, b.y - a.y), n = l ? { x: -(b.y - a.y) / l, y: (b.x - a.x) / l } : { x: 0, y: -1 };
    const cote = i % 2 ? 1 : -1;
    return { x: p.x + n.x * cote * 10, y: p.y + n.y * cote * 10 + 2.6 };
  }

  F.ouvrir = function () {
    // Prend la feuille en main : points à l'échelle, numérotés M0, M1... dans l'ordre des étincelles.
    this.dessin.replaceChildren();
    this.points.forEach((pt, i) => {
      const p = vers_feuille(pt.x, pt.y);
      L.svg("circle", { cx: p.x, cy: p.y, r: 1.6, fill: "#111" }, this.dessin);
      const e = place_numero(this.points, i, p);
      L.texte(this.dessin, e.x, e.y, `M${i}`, { class: "etiquette-carton", "font-size": 7.5, fill: "#666" });
    });
    if (!this.points.length) L.texte(this.dessin, 512, 320, "Pas encore d'enregistrement sur cette feuille.", { class: "etiquette-carton", "font-size": 22 });
    this.vue.style.display = "";
    this.vue.parentNode.append(this.vue);
    L.annoncer("feuille", { ouverte: true });
  };

  F.fermer = function () {
    // Repose la feuille sur la table.
    this.vue.style.display = "none";
    L.annoncer("feuille", { ouverte: false });
  };

  L.Feuille = Feuille;
  L.Feuille.ECHELLE = ECHELLE;
  L.Feuille.vers_feuille = vers_feuille;
})(window.Labo);
