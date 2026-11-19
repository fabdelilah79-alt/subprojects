/*
Rôle : glisser-déposer des masses à fente du pendule de torsion : lâchée près d'un porte-masses, une masse s'empile sur sa tige ;
       reprise, elle s'en retire ; lâchée ailleurs, elle retourne sur le plateau de rangement.
Reçoit : le calque du pendule, la liste des masses à fente, la fonction de mise à jour, l'état et la fonction de dessin.
Produit : Labo.torsion_gestes(calque, fentes, maj, etat, dessiner).
Utilisé par : torsion.js.
*/
(function (L) {
  L.torsion_gestes = function (calque, fentes, maj, e, dessiner) {
    // La masse saisie est repérée au moment de l'appui ; elle est redessinée sous le doigt pendant le geste.
    let prise = null;
    calque.addEventListener("pointerdown", (ev) => { const n = ev.target.closest(".masse-fente"); prise = n ? fentes[+n.dataset.fente] : null; }, { capture: true });
    L.glissable(calque, {
      soulever: false,
      debut: (ev) => (prise ? L.scene.vers_scene(ev) : null),
      saisir: () => { Object.assign(prise, { sur: null, en_main: true }); e.prise = prise; maj(); },
      deplacer: (p) => { dessiner(calque, e); L.torsion.fente(calque, p.x, p.y, prise); },
      lacher: (p) => {
        const cibles = [...calque.querySelectorAll(".porte-masses")].map((n) => { const r = n.getBBox(); return { n: +n.dataset.fil, x: r.x + r.width / 2, y: r.y }; });
        const c = cibles.find((q) => Math.abs(q.x - p.x) < 26 && p.y > q.y - 30 && p.y < q.y + 60);
        Object.assign(prise, { sur: c ? c.n : null, en_main: false });
        e.prise = null;
        maj();
        dessiner(calque, e);
      },
    });
  };
})(window.Labo);
