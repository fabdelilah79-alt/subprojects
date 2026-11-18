/*
Rôle : scène fixe de 1024 × 640 px mise à l'échelle de l'écran (même mise en page sur téléphone, portable, TBI),
       avec zoom à deux doigts jusqu'à 5×, molette, déplacement de la vue zoomée et double-tap pour revenir.
Reçoit : l'écran (#ecran, tout l'espace disponible) et l'étage (#etage, la scène de 1024 × 640).
Produit : Labo.scene : vers_scene(evenement) -> coordonnées dans la scène ; annonce « pince » au début d'un zoom.
Utilisé par : glisser.js, tablette.js, carnet.js et toutes les simulations.
*/
(function (L) {
  const ZOOM_MAX = 5;
  const vue = { base: 1, zoom: 1, gauche: 0, haut: 0 };
  const doigts = new Map();
  let pince = null;
  let glisse_vue = null;
  let ecran = null;
  let etage = null;

  function borner() {
    // Garde la scène zoomée dans l'écran : pas de bord vide visible.
    for (const [axe, taille, cote] of [["gauche", L.LARGEUR, "clientWidth"], ["haut", L.HAUTEUR, "clientHeight"]]) {
      const visible = ecran[cote];
      const reelle = taille * vue.base * vue.zoom;
      vue[axe] = reelle <= visible ? (visible - reelle) / 2 : Math.min(0, Math.max(visible - reelle, vue[axe]));
    }
  }

  function appliquer() {
    // Applique la position et l'échelle de la scène.
    borner();
    etage.style.transform = `translate(${vue.gauche}px, ${vue.haut}px) scale(${vue.base * vue.zoom})`;
    ecran.classList.toggle("zoomee", vue.zoom > 1.01);
  }

  function ajuster() {
    // Recalcule l'échelle de base quand la fenêtre change de taille (la scène tient toujours en entier).
    vue.base = Math.min(ecran.clientWidth / L.LARGEUR, ecran.clientHeight / L.HAUTEUR);
    appliquer();
  }

  function zoomer_autour(nouveau_zoom, ecran_x, ecran_y) {
    // Change le zoom en gardant immobile le point de l'écran (ecran_x, ecran_y).
    const zoom = Math.min(ZOOM_MAX, Math.max(1, nouveau_zoom));
    const echelle_avant = vue.base * vue.zoom;
    const sx = (ecran_x - vue.gauche) / echelle_avant;
    const sy = (ecran_y - vue.haut) / echelle_avant;
    vue.zoom = zoom;
    vue.gauche = ecran_x - sx * vue.base * zoom;
    vue.haut = ecran_y - sy * vue.base * zoom;
    appliquer();
  }

  function position_ecran(e) {
    // Position du pointeur dans l'écran (en px).
    const r = ecran.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  function mesure_pince() {
    // Distance et milieu des deux doigts posés.
    const [a, b] = [...doigts.values()];
    return { d: Math.hypot(a.x - b.x, a.y - b.y) || 1, x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
  }

  function doigt_pose(e) {
    // Compte les doigts ; deux doigts = début d'un zoom (le glisser en cours est annulé).
    if (e.pointerType !== "touch") return;
    doigts.set(e.pointerId, position_ecran(e));
    if (doigts.size === 2) {
      const m = mesure_pince();
      pince = { d0: m.d, zoom0: vue.zoom, x: m.x, y: m.y };
      glisse_vue = null;
      L.annoncer("pince");
    }
  }

  function doigt_bouge(e) {
    // Suit le zoom à deux doigts, ou le déplacement de la vue zoomée à un doigt.
    if (doigts.has(e.pointerId)) doigts.set(e.pointerId, position_ecran(e));
    if (pince && doigts.size === 2) {
      const m = mesure_pince();
      vue.gauche += m.x - pince.x;
      vue.haut += m.y - pince.y;
      pince.x = m.x;
      pince.y = m.y;
      zoomer_autour(pince.zoom0 * (m.d / pince.d0), m.x, m.y);
    } else if (glisse_vue) {
      const p = position_ecran(e);
      vue.gauche = glisse_vue.gauche + p.x - glisse_vue.x;
      vue.haut = glisse_vue.haut + p.y - glisse_vue.y;
      appliquer();
    }
  }

  function doigt_leve(e) {
    // Termine le zoom ou le déplacement de la vue.
    doigts.delete(e.pointerId);
    if (doigts.size < 2) pince = null;
    glisse_vue = null;
  }

  function fond_touche(e) {
    // Sur le fond (aucun objet saisi), un doigt déplace la vue quand elle est zoomée.
    if (e.labo_pris || pince || vue.zoom <= 1.01) return;
    const p = position_ecran(e);
    glisse_vue = { x: p.x, y: p.y, gauche: vue.gauche, haut: vue.haut };
  }

  function molette(e) {
    // La molette (ou le pincement du pavé tactile) zoome autour du pointeur.
    e.preventDefault();
    const p = position_ecran(e);
    zoomer_autour(vue.zoom * Math.exp(-e.deltaY * 0.0025), p.x, p.y);
  }

  L.scene = {
    initialiser(element_ecran, element_etage) {
      // Branche la mise à l'échelle et les gestes de zoom.
      ecran = element_ecran;
      etage = element_etage;
      ecran.addEventListener("pointerdown", doigt_pose, true);
      ecran.addEventListener("pointerdown", fond_touche);
      window.addEventListener("pointermove", doigt_bouge);
      window.addEventListener("pointerup", doigt_leve);
      window.addEventListener("pointercancel", doigt_leve);
      ecran.addEventListener("wheel", molette, { passive: false });
      ecran.addEventListener("dblclick", (e) => { if (!e.labo_pris) { vue.zoom = 1; appliquer(); } });
      document.addEventListener("gesturestart", (e) => e.preventDefault());
      window.addEventListener("resize", ajuster);
      ajuster();
    },
    vers_scene(e) {
      // Convertit la position du pointeur en coordonnées de la scène (0 à 1024, 0 à 640).
      const p = position_ecran(e);
      const echelle = vue.base * vue.zoom;
      return { x: (p.x - vue.gauche) / echelle, y: (p.y - vue.haut) / echelle };
    },
    pince_active: () => pince !== null,
  };
})(window.Labo);
