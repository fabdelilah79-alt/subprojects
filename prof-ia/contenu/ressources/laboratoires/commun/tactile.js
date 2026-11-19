/*
Rôle : commande au doigt plus facile sur téléphone et tablette : doigt « aimanté » (un toucher un peu à côté d'un petit
       objet manipulable le saisit quand même) ; double-toucher sur le fond : la scène s'approche ×2 ou revient
       (Labo.scene.basculer : la scène garde sa taille fixe de 1024 × 640 et ses proportions). Rien ne change à la souris.
Reçoit : les gestes du doigt sur l'écran (#ecran) ; Labo.scene (zoom).
Produit : les deux gestes, branchés au chargement de la page.
Utilisé par : la page de chaque simulation (après scene.js et glisser.js).
*/
(function (L) {
  const PORTEES_PX = [8, 16, 24], DIRECTIONS = 12, ZOOM_SANS_AIMANT = 1.5, DOUBLE_MS = 350, DOUBLE_PX = 30;
  let dernier = null;

  function objet_proche(x, y) {
    // Cherche, en cercles de plus en plus grands autour du doigt, un point qui tombe sur un objet manipulable.
    for (const r of PORTEES_PX) for (let k = 0; k < DIRECTIONS; k++) {
      const a = (k * 2 * Math.PI) / DIRECTIONS, el = document.elementFromPoint(x + r * Math.cos(a), y + r * Math.sin(a));
      if (el instanceof SVGElement && el.closest(".glissable")) return el;
    }
    return null;
  }

  function aimanter(e) {
    // Doigt posé sur le fond tout près d'un objet (scène peu agrandie) : le geste est donné à cet objet.
    if (!e.isTrusted || e.pointerType !== "touch" || !(e.target instanceof SVGElement) || e.target.closest(".glissable")) return;
    if (L.scene.zoom() > ZOOM_SANS_AIMANT || L.scene.pince_active()) return;
    const el = objet_proche(e.clientX, e.clientY);
    if (!el) return;
    e.stopImmediatePropagation();
    e.preventDefault();
    const champs = ["pointerId", "pointerType", "isPrimary", "clientX", "clientY", "screenX", "screenY", "width", "height", "pressure"];
    const copie = Object.fromEntries(champs.map((c) => [c, e[c]]));
    el.dispatchEvent(new PointerEvent("pointerdown", { ...copie, bubbles: true, cancelable: true, composed: true, button: 0, buttons: 1 }));
  }

  function double_toucher(e) {
    // Deux touchers rapides au même endroit du fond (aucun objet saisi) : la scène s'approche, ou revient.
    if (e.pointerType !== "touch" || e.labo_pris || !(e.target instanceof SVGElement)) return;
    const t = performance.now();
    if (dernier && t - dernier.t < DOUBLE_MS && Math.hypot(e.clientX - dernier.x, e.clientY - dernier.y) < DOUBLE_PX) {
      L.scene.basculer(e);
      dernier = null;
    } else dernier = { t, x: e.clientX, y: e.clientY };
  }

  window.addEventListener("pointerdown", aimanter, true);
  window.addEventListener("load", () => document.getElementById("ecran")?.addEventListener("pointerdown", double_toucher));
})(window.Labo);
