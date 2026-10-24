/*
Rôle : petit moteur électrique à courant continu monté en treuil sur une potence : il enroule un fil (tambour de rayon
       1,0 cm, après réducteur) et monte une masse de 200 g le long d'une règle. Récepteur : U = E' + r'·I, avec
       E' = k·ω (force contre-électromotrice, k = 0,30 V·s/rad) et r' = 25 Ω (au démarrage, I = U/r' reste sous 0,25 A jusqu'à 6 V) ; mécanique : J·dω/dt = k·I − m·g·r − Γf.
       Deux cellules (10 cm et 50 cm) et un chronomètre (boîtier fixé à la tige) mesurent la durée de montée sur 40 cm ; un contact de fin de course
       coupe le moteur en haut ; « Redescendre » ramène la masse en bas.
Reçoit : le circuit (circuit.js) et le réglage { id, x, y (coin du socle) }.
Produit : Labo.moteur_treuil(c, reglage) -> composant { i (A), u (V), omega (rad/s), h (m), dt (s, montée de 40 cm),
          montees (nombre) } ; bornes « 1 » et « 2 ».
Utilisé par : les simulations du chapitre « Transfert d'énergie dans un circuit électrique ».
*/
(function (L) {
  const K = 0.3, RM = 25, J = 0.0005, GF = 0.005, B = 0.0002, RT = 0.01, M = 0.2, G = 9.81, H_MAX = 0.6, PX = 500;

  function dessiner(g, x, y, e) {
    // Potence, moteur et tambour en haut, fil, masse, règle graduée, cellules, afficheur du chronomètre.
    g.replaceChildren();
    const xm = x + 40, bas = y - 6 - e.h * PX;
    L.tige(g, `M${x + 95} ${y} V${y - 370}`, 6);
    L.svg("rect", { x: x + 14, y: y - 396, width: 92, height: 32, rx: 5, fill: "#2b3035", stroke: "#000" }, g);
    L.texte(g, x + 60, y - 376, "moteur M + réducteur", { "font-size": 7, "font-weight": 700, fill: "#e4e9ec" });
    L.svg("circle", { cx: xm + 10, cy: y - 356, r: 10, fill: "url(#metal)", stroke: "#333", transform: `rotate(${(e.angle * 180) / Math.PI} ${xm + 10} ${y - 356})` }, g);
    const cellules = [0.1, 0.5].map((h) => y - 6 - h * PX - 12);
    for (const yc of cellules) L.svg("rect", { x: xm - 20, y: yc - 6, width: x + 98 - xm, height: 3, fill: "#3a4046" }, g);
    L.svg("line", { x1: xm, y1: y - 356, x2: xm, y2: bas - 30, stroke: "#e9e4d2", "stroke-width": 1.2 }, g);
    L.svg("rect", { x: xm - 13, y: bas - 30, width: 26, height: 24, fill: "url(#laiton)", stroke: "#8a6a1e" }, g);
    L.texte(g, xm, bas - 16, "200 g", { "font-size": 6.5, "font-weight": 700, fill: "#4a370b" });
    for (const yb of [y - 320, y - 30]) L.svg("rect", { x: x + 74, y: yb, width: 24, height: 6, rx: 1, fill: "#3a4046" }, g);
    L.svg("rect", { x: x + 60, y: y - 6 - 0.65 * PX, width: 16, height: 0.65 * PX, fill: "#f3efe2", stroke: "#8a8270" }, g);
    for (let cm = 0; cm <= 65; cm += 5) L.svg("line", { x1: x + 60, y1: y - 6 - cm * 5, x2: x + 60 + (cm % 10 ? 4 : 8), y2: y - 6 - cm * 5, stroke: "#333", "stroke-width": 0.6 }, g);
    for (const yc of cellules) for (const xc of [xm - 22, xm + 16]) L.svg("rect", { x: xc, y: yc - 6, width: 6, height: 12, rx: 1, fill: "#20262b" }, g);
    L.svg("path", { d: `M${xm - 13} ${bas - 6} H${x + 60}`, stroke: "#e0251b", "stroke-width": 1.2 }, g);
  }

  L.moteur_treuil = function (c, { id = "moteur", x, y }) {
    // Socle à bornes, potence, modèle électrique et mécanique ; animation et recalcul du circuit à chaque image.
    const comp = { id, i: 0, u: 0, omega: 0, h: 0, angle: 0, dt: null, depart: null, t: 0, montees: 0, en_haut: false, sens: 1, g: L.svg("g", { class: "moteur-treuil" }, c.calque_composants) };
    const dessin = L.svg("g", {}, comp.g);
    L.boitier(comp.g, x, y, 130, 46, 14, { dessus: "#e3e1da", face: "#a8a59b" });
    L.texte(comp.g, x + 65, y + 18, "MOTEUR M", { "font-size": 8, "font-weight": 700, fill: "#2a2a28" });
    L.svg("rect", { x: x + 97, y: y - 250, width: 82, height: 40, rx: 4, fill: "#2b3035", stroke: "#000" }, comp.g);
    L.texte(comp.g, x + 138, y - 241, "CHRONOMÈTRE", { "font-size": 6.5, "font-weight": 700, fill: "#e4e9ec" });
    L.svg("rect", { x: x + 104, y: y - 234, width: 68, height: 18, rx: 2, fill: "#1d2a22" }, comp.g);
    c.borne(comp, "1", x + 16, y + 33, "#4a4f55");
    c.borne(comp, "2", x + 114, y + 33, "#4a4f55");
    const ecran = L.texte(comp.g, x + 138, y - 222, "", { "font-size": 8.5, "font-weight": 700, fill: "#7dff9a", "font-family": "monospace" });
    L.bouton_rond(comp.g, x + 140, y + 20, "↓", () => { Object.assign(comp, { h: 0, en_haut: false, omega: 0, dt: null, depart: null }); c.calculer(); }, 9);
    const dipole = { a: "1", b: "2", g: 1 / RM, j: 0 };
    comp.dipoles = () => (comp.en_haut ? [] : [dipole]);
    comp.mettre_a_jour = ({ u, i }) => { comp.i = comp.en_haut ? 0 : i[0] || 0; comp.u = u("1", "2"); };
    let avant = null;
    const image = (t) => {
      const dt = avant === null ? 0 : Math.min(0.03, (t - avant) / 1000); avant = t;
      avancer(comp, dt, c, dipole);
      dessiner(dessin, x, y, comp);
      ecran.textContent = comp.dt === null ? "Δt = - - -" : `Δt = ${comp.dt.toFixed(2).replace(".", ",")} s`;
      requestAnimationFrame(image);
    };
    requestAnimationFrame(image);
    return c.ajouter(comp);
  };

  function avancer(e, dt, c, dipole) {
    // Sens de rotation fixé par le sens du courant au démarrage ; couple moteur k·I contre la charge et les frottements ; montée ; chronomètre entre 10 et 50 cm ; fin de course.
    if (e.en_haut) return;
    if (e.omega < 1e-3) e.sens = Math.sign(e.u) || 1;
    const charge = M * G * RT + GF, moteur = K * e.i * e.sens;
    if (e.omega > 0 || moteur > charge) e.omega = Math.max(0, e.omega + ((moteur - charge - B * e.omega) / J) * dt);
    const h0 = e.h;
    e.h = Math.min(H_MAX, e.h + e.omega * RT * dt); e.angle += e.omega * dt; e.t += dt;
    if (h0 < 0.1 && e.h >= 0.1) e.depart = e.t;
    if (h0 < 0.5 && e.h >= 0.5 && e.depart !== null) { e.dt = e.t - e.depart; e.montees++; }
    if (e.h >= H_MAX) { e.en_haut = true; e.omega = 0; c.calculer(); return; }
    const j = (-e.sens * K * e.omega) / RM;
    if (Math.abs(j - dipole.j) > 1e-5) { dipole.j = j; c.calculer(); }
  }
  L.moteur_treuil.M = M;
})(window.Labo);
