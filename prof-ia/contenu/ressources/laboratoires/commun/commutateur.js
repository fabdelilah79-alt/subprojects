/*
Rôle : commutateur (inverseur) K à deux positions sur son support : une borne commune « 0 » au milieu, deux bornes « 1 » et
       « 2 » ; la lame relie la borne commune à la position 1 ou à la position 2 ; un toucher la fait basculer.
       Sert à charger un condensateur (position 1) puis à le décharger (position 2).
Reçoit : le circuit et { id, x, y, position (1 ou 2), nom }.
Produit : Labo.commutateur(c, reglage) -> comp { position } ; bornes « 0 », « 1 », « 2 » ; fait « <id> » = position.
Utilisé par : les simulations du dipôle RC.
*/
(function (L) {
  L.commutateur = function (c, { id = "K", x, y, position = 2, nom = "K" }) {
    // Support à trois bornes, plots de contact, lame et poignée ; toucher : changement de position.
    const comp = { id, position, g: L.svg("g", { class: `commutateur commutateur-${id}`, role: "button", "aria-label": `Commutateur ${nom}` }, c.calque_composants) };
    L.boitier(comp.g, x, y, 120, 50, 12, { dessus: "#e3e1da", face: "#a8a59b" });
    L.texte(comp.g, x + 60, y + 54, `${nom} (positions 1 et 2)`, { "font-size": 8, "font-weight": 700, fill: "#2a2a28" });
    const P = { 0: { x: x + 60, y: y + 40 }, 1: { x: x + 16, y: y + 14 }, 2: { x: x + 104, y: y + 14 } };
    for (const k of ["1", "2"]) { L.svg("rect", { x: P[k].x - 5, y: P[k].y + 6, width: 10, height: 8, fill: "url(#laiton)" }, comp.g); L.texte(comp.g, P[k].x + (k === "1" ? 14 : -14), P[k].y + 3, k, { "font-size": 10, "font-weight": 700, fill: "#1a3d7c" }); }
    const lame = L.svg("g", {}, comp.g);
    const dessiner = () => {
      lame.replaceChildren(); const b = P[comp.position], dx = comp.position === 1 ? 8 : -8;
      L.svg("line", { x1: P[0].x, y1: P[0].y - 10, x2: b.x + dx, y2: b.y + 10, stroke: "url(#laiton)", "stroke-width": 4, "stroke-linecap": "round" }, lame);
      L.svg("circle", { cx: (P[0].x + b.x) / 2, cy: (P[0].y + b.y) / 2, r: 5, fill: "#b71c1c", stroke: "#5e0d0d" }, lame);
    };
    for (const k of ["0", "1", "2"]) c.borne(comp, k, P[k].x, k === "0" ? P[k].y : P[k].y + 22, "#4a4f55");
    dessiner();
    L.glissable(comp.g, { soulever: false, debut: () => ({ x, y }), toucher: () => { comp.position = comp.position === 1 ? 2 : 1; dessiner(); L.missions.noter(id, comp.position); c.calculer(); } });
    comp.dipoles = () => [{ a: "0", b: String(comp.position), g: 1000, j: 0 }];
    L.missions.noter(id, comp.position);
    return c.ajouter(comp);
  };
})(window.Labo);
