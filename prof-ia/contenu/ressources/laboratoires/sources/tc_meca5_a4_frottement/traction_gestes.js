/*
Rôle : gestes du poste de traction : tirer l'anneau du dynamomètre (l'index du maximum repart de zéro à chaque nouvelle
       traction), ramener le pavé à gauche, poser sur le pavé (ou retirer) la masse marquée de 200 g.
Reçoit : le calque du poste, son état, ses réglages et fonctions (avancer, dessiner).
Produit : Labo.traction_gestes(calque, etat, reglages) ; Labo.traction_masse(calque, etat, y) (dessin de la masse) ;
          fait noté « charge_pave » (masse posée sur le pavé, en kg).
Utilisé par : traction.js.
*/
(function (L) {
  const REPOS = { x: 760, y: 520 };

  L.traction_masse = function (g, e, y) {
    // Masse de 200 g : sur le pavé, dans la main, ou posée à droite sur la paillasse.
    const p = e.masse_tenue || (e.charge ? { x: e.xb, y: y - 36 } : REPOS), gr = L.svg("g", { class: "masse-traction" }, g);
    L.svg("rect", { x: p.x - 13, y: p.y - 24, width: 26, height: 24, fill: "url(#laiton)" }, gr);
    L.svg("ellipse", { cx: p.x, cy: p.y - 24, rx: 13, ry: 3.5, fill: "url(#laiton-haut)", stroke: "#a77d24", "stroke-width": 0.5 }, gr);
    L.texte(gr, p.x, p.y - 11, "200 g", { "font-size": 7, fill: "#4a370b" });
  };

  L.traction_gestes = function (calque, e, { X0, VIDE, avancer, dessiner }) {
    // Un seul glisser-déposer sur le calque ; ce que l'on a saisi est décidé au moment de l'appui.
    let prise = null;
    calque.addEventListener("pointerdown", (ev) => {
      const t = ev.target;
      prise = t.closest(".anneau-traction") ? "anneau" : t.closest(".masse-traction") ? "masse" : t.closest(".pave") ? "pave" : null;
    }, { capture: true });
    L.glissable(calque, {
      soulever: false,
      debut: (ev) => (prise === "anneau" ? { x: e.xh, y: 0 } : prise ? L.scene.vers_scene(ev) : null),
      saisir: () => { if (prise === "anneau") e.f_max = 0; },
      deplacer: (p) => {
        if (prise === "anneau") { e.xh = Math.max(e.xb + VIDE, Math.min(980, p.x)); avancer(e); }
        if (prise === "pave") { e.xb = Math.max(X0 - 100, Math.min(e.xh - VIDE, p.x)); e.xh = e.xb + VIDE; }
        if (prise === "masse") e.masse_tenue = p;
        dessiner();
      },
      lacher: (p) => {
        if (prise === "anneau") e.xh = e.xb + VIDE;
        if (prise === "masse") { e.charge = Math.abs(p.x - e.xb) < 45 && p.y > 440 && p.y < 520 ? 0.2 : 0; e.masse_tenue = null; L.missions.noter("charge_pave", e.charge); }
        dessiner();
      },
    });
    const boucle = () => { if (e.glisse) { avancer(e); dessiner(); } requestAnimationFrame(boucle); };
    requestAnimationFrame(boucle);
  };
})(window.Labo);
