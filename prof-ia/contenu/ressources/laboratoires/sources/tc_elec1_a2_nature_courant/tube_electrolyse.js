/*
Rôle : tube en U tenu par une potence : au fond, une solution de dichromate de cuivre (vert-brun), au-dessus, une solution
       acide incolore ; deux électrodes de graphite plongent dans les branches. Quand le courant passe, les ions cuivre
       Cu²⁺ (bleus) montent vers l'électrode reliée à la borne −, les ions dichromate (orange) vers celle reliée à la borne +.
       Le temps est accéléré. Si l'on inverse le générateur, les couleurs redescendent puis repartent dans l'autre sens.
Reçoit : le circuit (circuit.js) et le réglage { id, x, y }.
Produit : Labo.tube_electrolyse(c, reglage) -> composant { i (A, de l'électrode gauche vers la droite), zone(x, y), cote(x) } ;
          faits notés « migration » = { hauteur_mm } (dès 25 px de couleur), « migration_inversee » = oui.
Utilisé par : postes_courant.js.
*/
(function (L) {
  const R_TUBE = 150, K = 75, H_MAX = 92, JAUNE = "#e0a800";

  function u_tube(xg, xd, y, haut, bas) {
    // Tracé d'une colonne du tube en U entre deux hauteurs (haut : surface ; bas : fond des branches).
    return `M${xg} ${y + haut} V${y + bas} A${(xd - xg) / 2} ${(xd - xg) / 2} 0 0 0 ${xd} ${y + bas} V${y + haut}`;
  }

  function dessiner_fixe(g, x, y, xg, xd) {
    // Potence, pince, verre du tube, bouchons et électrodes de graphite qui les traversent.
    L.svg("rect", { x: x + 20, y: y + 286, width: 190, height: 18, rx: 3, fill: "url(#acier)", filter: "url(#ombre)" }, g);
    L.tige(g, `M${x + 188} ${y - 40} V${y + 288}`, 8);
    L.svg("rect", { x: xd + 10, y: y + 40, width: x + 186 - xd - 10, height: 7, fill: "url(#metal-h)" }, g);
    L.svg("rect", { x: x + 179, y: y + 34, width: 18, height: 19, rx: 2, fill: "url(#acier)" }, g);
    L.svg("path", { d: u_tube(xg, xd, y, 0, 200), fill: "none", stroke: "#cfe3ea", "stroke-width": 26, opacity: 0.35 }, g);
    L.svg("rect", { x: xd - 16, y: y + 36, width: 32, height: 15, rx: 4, fill: "none", stroke: "#3a3f44", "stroke-width": 4 }, g);
    L.svg("rect", { x: xd - 16, y: y + 36, width: 32, height: 15, rx: 4, fill: "none", stroke: "#8a3b2a", "stroke-width": 1.5, opacity: 0.8 }, g);
    for (const xe of [xg, xd]) {
      L.svg("path", { d: `M${xe - 13} ${y - 8} h26 l-2 16 h-22 Z`, fill: "#a0703f", stroke: "#6d4a26" }, g);
      L.svg("rect", { x: xe - 4, y: y - 34, width: 8, height: 150, rx: 2, fill: "#2b2d2f", stroke: "#111" }, g);
    }
  }

  function dessiner_liquides(g, y, xg, xd, h) {
    // Solution acide incolore, mélange vert-brun au fond, colonnes bleue (côté −) et orange (côté +) selon h (px signés).
    g.replaceChildren();
    L.svg("path", { d: u_tube(xg, xd, y, 60, 200), fill: "none", stroke: "#e4f1f4", "stroke-width": 20, opacity: 0.85 }, g);
    L.svg("path", { d: u_tube(xg, xd, y, 168, 200), fill: "none", stroke: "#6d7a3c", "stroke-width": 20 }, g);
    const bleu = h > 0 ? xd : xg, orange = h > 0 ? xg : xd, a = Math.abs(h);
    if (a > 0.5) {
      L.svg("line", { x1: bleu, y1: y + 168 - a, x2: bleu, y2: y + 170, stroke: "#2f7fd8", "stroke-width": 20, opacity: 0.85 }, g);
      L.svg("line", { x1: orange, y1: y + 168 - a, x2: orange, y2: y + 170, stroke: "#e8891c", "stroke-width": 20, opacity: 0.85 }, g);
    }
    L.svg("path", { d: u_tube(xg, xd, y, 0, 200), fill: "none", stroke: "#9fb6be", "stroke-width": 1.4, transform: "translate(-11 0)" }, g);
    L.svg("path", { d: u_tube(xg, xd, y, 0, 200), fill: "none", stroke: "#ffffff", "stroke-width": 2, opacity: 0.5, transform: "translate(-7 0)" }, g);
  }

  L.tube_electrolyse = function (c, { id = "tube", x, y }) {
    // Construit le tube, ses deux bornes (au sommet des électrodes) et la migration des ions.
    const comp = { id, i: 0, s: 0, s_max: 0, g: L.svg("g", { class: "tube-electrolyse" }, c.calque_composants) };
    const xg = x + 60, xd = x + 140;
    dessiner_fixe(comp.g, x, y, xg, xd);
    const liquides = L.svg("g", {}, comp.g);
    c.borne(comp, "gauche", xg, y - 40, JAUNE);
    c.borne(comp, "droite", xd, y - 40, JAUNE);
    L.texte(comp.g, x + 100, y + 318, "Temps accéléré × 60", { "font-size": 9, fill: "#d8dcd6" });
    comp.dipoles = () => [{ a: "gauche", b: "droite", g: 1 / R_TUBE, j: 0 }];
    comp.mettre_a_jour = ({ i }) => { comp.i = i[0]; };
    comp.zone = (px, py) => px > xg - 12 && px < xd + 12 && py > y + 60 && py < y + 245 && (Math.abs(px - xg) < 12 || Math.abs(px - xd) < 12 || py > y + 200);
    comp.cote = (px) => (Math.abs(px - xg) < Math.abs(px - xd) ? "gauche" : "droite");
    let avant = null;
    const image = (t) => {
      const dt = avant === null ? 0 : Math.min(0.05, (t - avant) / 1000);
      avant = t;
      comp.s = Math.max(-H_MAX / K, Math.min(H_MAX / K, comp.s + comp.i * dt));
      if (Math.abs(comp.s) > Math.abs(comp.s_max)) comp.s_max = comp.s;
      const h = K * comp.s;
      const mm = Math.round(Math.abs(h) / 4);
      if (Math.abs(h) >= 25 && mm !== comp.mm) { comp.mm = mm; L.missions.noter("migration", { hauteur_mm: mm }); }
      if (!comp.inversee && K * Math.abs(comp.s_max) > 25 && Math.sign(comp.i) === -Math.sign(comp.s_max) && Math.abs(comp.s) < 0.6 * Math.abs(comp.s_max)) {
        comp.inversee = true;
        L.missions.noter("migration_inversee", true);
      }
      dessiner_liquides(liquides, y, xg, xd, h);
      requestAnimationFrame(image);
    };
    requestAnimationFrame(image);
    return c.ajouter(comp);
  };
})(window.Labo);
