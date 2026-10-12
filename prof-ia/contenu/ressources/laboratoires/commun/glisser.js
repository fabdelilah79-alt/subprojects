/*
Rôle : glisser-déposer réaliste des objets du laboratoire (souris, doigt, stylet) : l'objet se soulève,
       son ombre s'éloigne, il suit le pointeur, puis l'objet décide où il se pose ; un appui bref = « toucher ».
Reçoit : l'élément à rendre déplaçable et ses réactions : debut(), saisir(), deplacer(p), lacher(p), toucher(), annuler(),
         fin() (appelée à la fin de chaque geste, quel qu'il soit).
Produit : Labo.glissable(element, reactions) ; Labo.soulever(element, oui).
Utilisé par : les objets de toutes les simulations, tablette.js, carnet.js.
*/
(function (L) {
  const SEUIL_PX = 6;
  const DUREE_TOUCHER_MS = 400;
  let en_cours = null;

  L.soulever = function (element, oui) {
    // Donne l'impression que l'objet est soulevé : ombre plus loin, plus floue ; il passe devant les autres.
    element.classList.toggle("souleve", oui);
    if (element instanceof SVGElement) {
      element.setAttribute("filter", oui ? "url(#ombre-levee)" : "url(#ombre)");
      if (oui) element.parentNode.append(element);
    }
  };

  function finir(e, annule) {
    // Termine le geste : toucher bref, dépôt, ou annulation (zoom à deux doigts).
    const g = en_cours;
    en_cours = null;
    window.removeEventListener("pointermove", suivre);
    window.removeEventListener("pointerup", relacher);
    window.removeEventListener("pointercancel", relacher);
    g.reactions.fin?.();
    if (!g.bouge) {
      if (!annule && performance.now() - g.temps < DUREE_TOUCHER_MS) g.reactions.toucher?.();
      return;
    }
    if (g.reactions.soulever !== false) L.soulever(g.element, false);
    if (annule && g.reactions.annuler) g.reactions.annuler();
    else g.reactions.lacher?.(g.position, e);
  }

  function suivre(e) {
    // Déplace l'objet avec le pointeur, dès que le geste dépasse quelques pixels.
    if (!en_cours || e.pointerId !== en_cours.pointeur) return;
    const p = L.scene.vers_scene(e);
    if (!en_cours.bouge) {
      if (Math.hypot(p.x - en_cours.depart.x, p.y - en_cours.depart.y) < SEUIL_PX) return;
      en_cours.bouge = true;
      if (en_cours.reactions.soulever !== false) L.soulever(en_cours.element, true);
      en_cours.reactions.saisir?.();
    }
    en_cours.position = { x: p.x - en_cours.ecart.x, y: p.y - en_cours.ecart.y };
    en_cours.reactions.deplacer?.(en_cours.position, e);
  }

  function relacher(e) {
    // Fin du geste avec le pointeur qui l'a commencé.
    if (en_cours && e.pointerId === en_cours.pointeur) finir(e, false);
  }

  L.glissable = function (element, reactions) {
    // Rend un élément déplaçable ; reactions.debut() renvoie sa position actuelle, ou null pour refuser.
    element.classList.add("glissable");
    element.addEventListener("dblclick", (e) => { e.labo_pris = true; });
    element.addEventListener("pointerdown", (e) => {
      if (en_cours || L.scene.pince_active() || e.button > 0) return;
      const origine = reactions.debut ? reactions.debut(e) : { x: 0, y: 0 };
      if (!origine) return;
      e.labo_pris = true;
      e.preventDefault();
      const p = L.scene.vers_scene(e);
      en_cours = {
        element, reactions, pointeur: e.pointerId, depart: p, temps: performance.now(),
        ecart: { x: p.x - origine.x, y: p.y - origine.y }, position: origine, bouge: false,
      };
      window.addEventListener("pointermove", suivre);
      window.addEventListener("pointerup", relacher);
      window.addEventListener("pointercancel", relacher);
    });
  };

  L.ecouter("pince", () => { if (en_cours) finir(null, true); });

  L.tomber = function (element, de, vers, fin = null, duree_s = 0.35) {
    // Fait tomber un objet de « de » vers « vers » (accélération puis petit rebond).
    return L.animer(duree_s, (t) => {
      const k = L.chute(t);
      L.placer(element, de.x + (vers.x - de.x) * k, de.y + (vers.y - de.y) * k);
    }, fin);
  };
})(window.Labo);
