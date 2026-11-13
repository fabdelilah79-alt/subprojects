/*
Rôle : surcharge en laiton (disque marqué de sa masse) que l'élève pose sur un mobile autoporteur, ou retire, par
       glisser-déposer. Posée, elle suit le mobile ; lâchée loin d'un mobile, elle retourne à sa place sur la paillasse.
Reçoit : le groupe SVG ; { masse_kg, repos (point de l'écran), cibles() -> [{ nom, x, y, libre }] (dessus des mobiles,
         libre : la surcharge peut y être posée), sur_changement(nom ou null), toucher() (toucher bref, facultatif) }.
Produit : Labo.surcharge(groupe, reglages) -> { placer() (à appeler quand les mobiles bougent), sur() (nom ou null) }.
Utilisé par : les simulations de quantité de mouvement (poste_p.js, explosion.js).
*/
(function (L) {
  function dessiner(g, masse_kg) {
    // Disque de laiton en perspective, avec sa masse gravée.
    L.svg("ellipse", { cx: 3, cy: 5, rx: 23, ry: 10, fill: "#000", opacity: 0.25, filter: "url(#flou)" }, g);
    L.svg("path", { d: "M-22 -6 V0 A22 10 0 0 0 22 0 V-6", fill: "url(#laiton)" }, g);
    L.svg("ellipse", { cx: 0, cy: -6, rx: 22, ry: 10, fill: "url(#laiton-haut)", stroke: "#7a5b14", "stroke-width": 0.8 }, g);
    L.svg("circle", { cx: 0, cy: -6, r: 3, fill: "#5a4310" }, g);
    L.texte(g, 0, -6 + 0.5, `${Math.round(masse_kg * 1000)} g`, { "font-size": 6.5, "font-weight": 700, fill: "#4a370b", transform: "translate(0 5)" });
  }

  L.surcharge = function (parent, { masse_kg, repos, cibles, sur_changement, toucher = null }) {
    // Crée la surcharge à sa place de repos et la rend déplaçable.
    const g = L.svg("g", { class: "surcharge", role: "button", "aria-label": `Surcharge de ${Math.round(masse_kg * 1000)} g` }, parent);
    dessiner(g, masse_kg);
    const etat = { sur: null, p: { ...repos } };
    const placer = () => {
      // Sur un mobile : au-dessus de son tube ; sinon à sa place (ou sous le doigt).
      const c = etat.sur && cibles().find((x) => x.nom === etat.sur);
      if (c) etat.p = { x: c.x, y: c.y };
      L.placer(g, etat.p.x, etat.p.y);
    };
    L.glissable(g, {
      debut: () => ({ ...etat.p }),
      toucher: () => toucher?.(),
      saisir: () => { if (etat.sur) { etat.sur = null; sur_changement(null); } },
      deplacer: (p) => { etat.p = p; L.placer(g, p.x, p.y); },
      lacher: (p) => {
        const c = cibles().find((x) => x.libre && Math.hypot(x.x - p.x, x.y - p.y) < 34);
        etat.sur = c ? c.nom : null;
        if (!c) etat.p = { ...repos };
        placer();
        sur_changement(etat.sur);
      },
    });
    placer();
    return { placer, sur: () => etat.sur };
  };
})(window.Labo);
