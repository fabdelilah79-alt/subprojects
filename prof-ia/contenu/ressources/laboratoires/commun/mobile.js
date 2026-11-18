/*
Rôle : confort sur téléphone et tablette (proposition à valider : option « mobile=1 » dans l'adresse, désactivée par défaut,
       par exemple …html#mobile=1) : bouton « Missions » (menu, plein écran) dans la bande libre de l'écran, et
       « Vue entière » quand la scène est agrandie ;
       double-toucher sur le fond : agrandit la zone touchée, ou revient à la vue entière ; doigt « aimanté » : un toucher
       un peu à côté d'un objet petit le saisit quand même ; en portrait, un message demande de tourner le téléphone.
Reçoit : l'adresse de la page ; l'écran (#ecran) ; Labo.scene (zoom) ; Labo.menu_missions (menu_missions.js).
Produit : Labo.mobile (vrai si l'option est active) ; Labo.plein_ecran() ; la barre, le message « tournez » et les gestes, installés au chargement.
Utilisé par : la page de chaque simulation (après scene.js et glisser.js) ; styles dans mobile.css.
*/
(function (L) {
  L.mobile = /[#&]mobile=1(&|$)/.test(window.location.hash);
  const PORTEES_PX = [10, 20, 30], DIRECTIONS = 12, ZOOM_DOUBLE = 2.5, ZOOM_SANS_AIMANT = 1.6;
  const toucher = { dernier: null, ignorer_jusqua: 0 };

  function element_proche(x, y) {
    // Cherche, en cercles de plus en plus grands autour du doigt, un point qui tombe sur un objet manipulable.
    for (const r of PORTEES_PX) for (let k = 0; k < DIRECTIONS; k++) {
      const a = (k * 2 * Math.PI) / DIRECTIONS, el = document.elementFromPoint(x + r * Math.cos(a), y + r * Math.sin(a));
      if (el instanceof SVGElement && el.closest(".glissable")) return el;
    }
    return null;
  }

  function aimanter(e) {
    // Doigt posé à côté d'un objet (sur le fond de la scène) : le geste est donné à l'objet le plus proche.
    if (!e.isTrusted || e.pointerType === "mouse" || !(e.target instanceof SVGElement) || e.target.closest(".glissable")) return;
    if (L.scene.zoom() > ZOOM_SANS_AIMANT || L.scene.pince_active()) return;
    const el = element_proche(e.clientX, e.clientY);
    if (!el) return;
    e.stopImmediatePropagation();
    e.preventDefault();
    const champs = ["pointerId", "pointerType", "isPrimary", "clientX", "clientY", "screenX", "screenY", "width", "height", "pressure"];
    const copie = Object.fromEntries(champs.map((c) => [c, e[c]]));
    el.dispatchEvent(new PointerEvent("pointerdown", { ...copie, bubbles: true, cancelable: true, composed: true, button: 0, buttons: 1 }));
  }

  function basculer_zoom(x, y) {
    // Agrandit autour du point touché, ou revient à la scène entière si elle est déjà agrandie.
    const r = document.getElementById("ecran").getBoundingClientRect();
    L.scene.zoomer(L.scene.zoom() > 1.01 ? 1 : ZOOM_DOUBLE, x - r.left, y - r.top);
  }

  function double_toucher(e) {
    // Deux touchers rapides sur le fond (sans objet saisi) : bascule du zoom ; le double-clic de la souris fait de même.
    if (e.type === "dblclick") {
      e.stopPropagation();
      if (performance.now() > toucher.ignorer_jusqua && !e.target.closest?.(".glissable") && e.target instanceof SVGElement) basculer_zoom(e.clientX, e.clientY);
      return;
    }
    if (e.pointerType !== "touch" || e.labo_pris || !(e.target instanceof SVGElement)) return;
    const t = performance.now(), d = toucher.dernier;
    if (d && t - d.t < 350 && Math.hypot(e.clientX - d.x, e.clientY - d.y) < 30) {
      basculer_zoom(e.clientX, e.clientY);
      toucher.dernier = null;
      toucher.ignorer_jusqua = t + 600;
    } else toucher.dernier = { t, x: e.clientX, y: e.clientY };
  }

  L.plein_ecran = function () {
    // Passe la page en plein écran puis, si le téléphone l'accepte, la bloque en position horizontale.
    const fin = () => screen.orientation?.lock?.("landscape").catch(() => {});
    if (document.fullscreenElement) return document.exitFullscreen?.();
    const p = document.documentElement.requestFullscreen?.();
    if (p) p.then(fin).catch(() => {});
  };

  function bouton(parent, texte, classe, action) {
    // Gros bouton (44 px de haut au moins) de la barre ou du message.
    const b = L.html("button", { type: "button", class: classe }, parent, texte);
    b.addEventListener("click", action);
    return b;
  }

  function installer() {
    // Barre de boutons, message « tournez le téléphone », gestes (aimant, double-toucher).
    const barre = L.html("nav", { class: "mobile-barre", "aria-label": "Commandes du laboratoire" }, document.body);
    bouton(barre, "Missions", "mobile-bouton", () => L.menu_missions?.ouvrir());
    bouton(barre, "Vue entière", "mobile-bouton vue-entiere", () => L.scene.zoomer(1));
    const tourner = L.html("div", { class: "mobile-tourner", role: "dialog", "aria-label": "Tournez le téléphone" }, document.body);
    L.html("p", {}, tourner, "Tournez le téléphone en position horizontale : le laboratoire sera deux fois plus grand.");
    if (document.fullscreenEnabled) bouton(tourner, "Plein écran horizontal", "mobile-bouton", L.plein_ecran);
    bouton(tourner, "Continuer ainsi", "mobile-bouton secondaire", () => tourner.remove());
    window.addEventListener("pointerdown", aimanter, true);
    document.getElementById("ecran").addEventListener("pointerdown", double_toucher);
    window.addEventListener("dblclick", double_toucher, true);
    document.body.classList.add("mobile");
  }

  if (L.mobile) window.addEventListener("load", installer);
})(window.Labo);
