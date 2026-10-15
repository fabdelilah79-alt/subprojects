/*
Rôle : feuille d'enregistrement de la table à coussin d'air : les étincelles y marquent des points (vus en
       perspective sur la table) ; un toucher sur la feuille la prend en main, à l'échelle (1 mm = 1,2 px, au-dessus des objets posés),
       points numérotés au crayon M0, M1, M2... ; on y pose les outils de mesure (transparent, règle).
Reçoit : le groupe de la table, le calque du dessus, le mobile ; les annonces « etincelle » et « enregistrement ».
Produit : new Labo.Feuille(table, dessus, mobile) : ouvrir(), fermer(), points, outils, mobile ; vers_feuille(x, y) (mm -> px) ;
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
    const id = `bord-feuille-${mobile.nom}`, bord = L.svg("clipPath", { id }, dessus.ownerSVGElement.querySelector("defs"));
    L.svg("rect", { x: ORIGINE.x, y: ORIGINE.y, width: T.l * ECHELLE, height: T.h * ECHELLE }, bord);
    this.outils = L.svg("g", { "clip-path": `url(#${id})` }, this.vue);
    this.languette(T);
    this.mobile = mobile;
    L.ecouter("etincelle", (e) => { if (e.mobile === mobile) this.marquer(e.point, mobile); });
    L.ecouter("enregistrement", (e) => { if (e.mobile === mobile && e.nouveau) { this.points = []; this.marques.replaceChildren(); } });
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

  // Les séries de marques : M (un mobile) ou A et B (deux palets solidaires, une électrode chacun).
  const series = (points) => (points.length && points[0].a ? [["A", points.map((p) => p.a)], ["B", points.map((p) => p.b)]] : [["M", points]]);

  F.marquer = function (point, mobile) {
    // Étincelle : un petit point noir sur la feuille sous chaque électrode, et un éclair bref sous le mobile.
    this.points.push(point);
    for (const q of point.a ? [point.a, point.b] : [point]) {
      const p = L.CoussinAir.vers_ecran(q.x, q.y);
      L.svg("ellipse", { cx: p.x, cy: p.y, rx: 1.6, ry: 1.1, fill: "#111" }, this.marques);
      const eclair = L.svg("circle", { cx: p.x, cy: p.y - 3, r: 9, fill: "#cfe8ff", opacity: 0.9 }, mobile.mobile);
      L.animer(0.12, (t) => eclair.setAttribute("opacity", 0.9 * (1 - t)), () => eclair.remove());
    }
  };

  function place_numero(points, i, p, cote) {
    // Numéro Mi à côté du point, perpendiculairement à la trajectoire, du côté demandé (1 ou -1).
    const a = points[Math.max(0, i - 1)], b = points[Math.min(points.length - 1, i + 1)];
    const l = Math.hypot(b.x - a.x, b.y - a.y), n = l ? { x: -(b.y - a.y) / l, y: (b.x - a.x) / l } : { x: 0, y: -1 };
    return { x: p.x + n.x * cote * 10, y: p.y + n.y * cote * 10 + 2.6 };
  }

  F.ouvrir = function () {
    // Prend la feuille en main : points à l'échelle, numérotés M0, M1... (ou A0, B0...) dans l'ordre des étincelles.
    this.dessin.replaceChildren();
    for (const [nom, points] of series(this.points)) {
      const pas = nom === "M" ? 1 : 2;
      let dernier = null;
      points.forEach((pt, i) => {
        // Deux séries (A et B) : un numéro sur deux ; pas de numéro à moins de 9 mm du précédent (points serrés).
        const p = vers_feuille(pt.x, pt.y);
        L.svg("circle", { cx: p.x, cy: p.y, r: 1.6, fill: "#111" }, this.dessin);
        if (i % pas || (dernier && Math.hypot(pt.x - dernier.x, pt.y - dernier.y) < 9)) return;
        dernier = pt;
        const e = place_numero(points, i, p, (i / pas) % 2 ? 1 : -1);
        L.texte(this.dessin, e.x, e.y, `${nom}${i}`, { class: "etiquette-carton", "font-size": 7.5, fill: "#666" });
      });
    }
    if (!this.points.length) L.texte(this.dessin, 512, 320, "Pas encore d'enregistrement sur cette feuille.", { class: "etiquette-carton", "font-size": 22 });
    this.vue.style.display = "";
    this.vue.parentNode.append(this.vue);
    L.annoncer("feuille", { feuille: this, ouverte: true });
  };

  F.fermer = function () {
    // Repose la feuille sur la table.
    this.vue.style.display = "none";
    L.annoncer("feuille", { feuille: this, ouverte: false });
  };

  L.Feuille = Feuille;
  L.Feuille.ECHELLE = ECHELLE;
  L.Feuille.vers_feuille = vers_feuille;
})(window.Labo);
