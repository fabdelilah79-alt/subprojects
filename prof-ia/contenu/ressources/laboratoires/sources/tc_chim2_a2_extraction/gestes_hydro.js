/*
Rôle : gestes de la paillasse d'hydrodistillation : pierre ponce (pierre_ponce.js) à glisser jusqu'au col du ballon, bout du
       tuyau d'arrivée d'eau à enfiler sur un embout du réfrigérant (ou à tirer pour le débrancher), bouton du robinet
       d'eau, touche Marche/Arrêt du chauffe-ballon.
Reçoit : le contexte de la paillasse, l'état de l'hydrodistillation et { redessiner(), noter(), tuyaux(bout) }.
Produit : Labo.gestes_hydro(ctx, etat, fonctions).
Utilisé par : poste_hydro.js.
*/
(function (L) {
  const H = L.hydro;

  function bout_tuyau(ctx, e, f) {
    // Bout libre du tuyau d'arrivée d'eau : on le tire jusqu'à un embout ; tiré depuis un embout, il se débranche.
    const g = L.svg("circle", { cx: 0, cy: 0, r: 11, fill: "#000", opacity: 0, class: "bout-tuyau" }, ctx.haut);
    L.placer(g, e.bout_libre.x, e.bout_libre.y);
    const detacher = () => { const b = H.EMBOUTS[e.tuyau]; e.tuyau = null; return { x: b.x, y: b.y }; };
    L.glissable(g, { debut: () => (e.tuyau ? detacher() : { ...e.bout_libre }), deplacer: (p) => { L.placer(g, p.x, p.y); f.tuyaux(p); }, lacher: (p) => {
      const n = ["bas", "haut"].find((k) => Math.hypot(p.x - H.EMBOUTS[k].x, p.y - H.EMBOUTS[k].y) < 24);
      if (n) { e.tuyau = n; L.placer(g, H.EMBOUTS[n].x, H.EMBOUTS[n].y); } else L.placer(g, e.bout_libre.x, e.bout_libre.y);
      f.redessiner(); f.noter();
    } });
  }

  L.gestes_hydro = function (ctx, e, f) {
    // Branche tous les gestes de la paillasse.
    L.pierre_ponce(ctx, { x: 520, sol: 576, ouverture: () => ({ x: H.BALLON.x, y: H.BALLON.y - 118 * H.E }), quand: () => { e.ponce = true; f.redessiner(); f.noter(); } });
    bout_tuyau(ctx, e, f);
    L.bouton_rond(ctx.haut, H.ROBINET.x + 16, H.ROBINET.y - 12, "", () => { e.eau = !e.eau; f.noter(); }, 6);
    L.bouton_rond(ctx.haut, H.CHAUFFE.x + 18, H.CHAUFFE.haut + 98, "I/O", () => { e.chauffe = !e.chauffe; f.noter(); }, 8);
  };
})(window.Labo);
