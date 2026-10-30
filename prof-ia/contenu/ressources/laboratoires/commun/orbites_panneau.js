/*
Rôle : panneau de commande du simulateur d'orbites (à gauche de la fenêtre) : deux onglets (les modes choisis : « Terre –
       satellite », « Soleil – planète », « Proton – électron »), deux glissières (distance de lancement r0, vitesse de lancement
       v0 perpendiculaire au rayon) avec leurs touches − et + pour le réglage fin, case à cocher du mode (rayonnement de
       l'électron, ou aires de Kepler), touches « Lancer » et « Effacer », résultats du calcul (altitude pour un satellite).
Reçoit : le groupe SVG, la dalle { x, y, l, h } du portable, l'état s du logiciel (s.modes : les deux modes des onglets) et les
         actions { mode(m), regler(cle, valeur), lancer(), effacer(), option() }.
Produit : Labo.orbites_panneau(g, dalle, s, actions) -> maj() (redessine valeurs, curseurs et résultats).
Utilisé par : logiciel_orbites.js.
*/
(function (L) {
  const LG = 140, fr = (v, n = 4) => L.nombre_court(v, n);

  function touche(g, x, y, l, texte, action, classe) {
    // Petit bouton gris du logiciel.
    const b = L.svg("g", { class: classe, role: "button", "aria-label": texte }, g);
    L.svg("rect", { x, y, width: l, height: 14, rx: 2.5, fill: "#e4e8ec", stroke: "#8a96a0" }, b);
    const t = L.texte(b, x + l / 2, y + 10, texte, { "font-size": 7.5, "font-weight": 700, fill: "#23315a" });
    L.glissable(b, { soulever: false, debut: () => ({ x: 0, y: 0 }), toucher: action });
    return { b, t };
  }

  function glissiere(g, x, y, cle, s, a) {
    // Rail gradué, curseur que l'on fait glisser, touches − et + (un pas).
    L.svg("rect", { x, y: y - 1.5, width: LG, height: 3, rx: 1.5, fill: "#b0bec5" }, g);
    for (let k = 0; k <= 10; k++) L.svg("line", { x1: x + (k * LG) / 10, y1: y + 3, x2: x + (k * LG) / 10, y2: y + 6, stroke: "#90a4ae", "stroke-width": 0.6 }, g);
    const curseur = L.svg("g", { class: `glissiere-${cle}`, role: "slider", "aria-label": cle }, g);
    L.svg("rect", { x: -4, y: y - 7, width: 8, height: 14, rx: 2, fill: "#2f4a6b", stroke: "#1b2a3d" }, curseur);
    const M = () => L.orbites.MODES[s.mode], bornes = () => [M()[cle === "r0" ? "rmin" : "vmin"], M()[cle === "r0" ? "rmax" : "vmax"]];
    const vers_x = () => { const [b0, b1] = bornes(); return x + ((s[cle] - b0) / (b1 - b0)) * LG; };
    L.glissable(curseur, { soulever: false, debut: () => ({ x: vers_x(), y }), deplacer: (p) => { const [b0, b1] = bornes(); a.regler(cle, b0 + (Math.max(0, Math.min(LG, p.x - x)) / LG) * (b1 - b0)); } });
    const pas = () => M()[cle === "r0" ? "pas_r" : "pas_v"];
    touche(g, x + LG + 6, y - 7, 13, "−", () => a.regler(cle, s[cle] - pas()), `moins-${cle}`);
    touche(g, x + LG + 22, y - 7, 13, "+", () => a.regler(cle, s[cle] + pas()), `plus-${cle}`);
    return () => curseur.setAttribute("transform", `translate(${vers_x()} 0)`);
  }

  function resultats(g, s, x, y) {
    // Résultats du dernier lancement.
    g.replaceChildren();
    const M = L.orbites.MODES[s.mode], o = s.o, r = (v) => `${fr(v / M.ur)} ${M.nom_r}`;
    const lignes = !o ? ["Réglez r0 et v0, puis « Lancer »."] : o.issue === "echappe" ? ["Trajectoire ouverte : pas d'orbite.", `Énergie mécanique E = ${fr(o.E, 3)} J`] : [
      ...(s.mode === "terre" ? [`Altitude de lancement h = ${fr((s.r0 - M.R) / 1000)} km`] : []),
      `Distance minimale rmin = ${r(o.rmin)}`, `Distance maximale rmax = ${r(o.rmax)}`, `Période T = ${fr(o.T)} s`, ...(s.mode === "soleil" ? [`soit T = ${fr(o.T / 86400, 4)} jours`] : []),
      `Énergie mécanique E = ${fr(o.E, 3)} J`, ...(s.mode === "atome" ? [`soit E = ${fr(o.eV, 3)} eV`] : []), `Temps simulé t = ${fr(s.t, 3)} s`];
    L.texte(g, x, y, "Résultats du calcul", { "font-size": 7.5, "font-weight": 700, fill: "#23315a", "text-anchor": "start" });
    lignes.forEach((t, i) => L.texte(g, x, y + 13 + i * 11, t, { "font-size": 7.2, fill: "#222", "text-anchor": "start" }));
  }

  L.orbites_panneau = function (g, d, s, a) {
    // Partie fixe (onglets, glissières, touches) et partie redessinée (valeurs, curseurs, résultats).
    const x = d.x + 8, y = d.y + 22, onglets = s.modes.map((m, k) => touche(g, x + 96 * k, y, 92, L.orbites.MODES[m].onglet, () => a.mode(m), `onglet-${m}`));
    const titres = L.svg("g", {}, g), vals = L.svg("g", {}, g), res = L.svg("g", {}, g);
    const maj_r = glissiere(g, x + 4, y + 46, "r0", s, a), maj_v = glissiere(g, x + 4, y + 84, "v0", s, a);
    const coche = L.svg("g", { class: "case-option", role: "checkbox", "aria-label": "Option" }, g);
    L.svg("rect", { x, y: y + 102, width: 9, height: 9, fill: "#fff", stroke: "#546e7a" }, coche);
    const croix = L.texte(coche, x + 4.5, y + 110, "", { "font-size": 9, "font-weight": 700, fill: "#c62828" });
    const libelle = L.texte(coche, x + 14, y + 109.5, "", { "font-size": 6.8, fill: "#222", "text-anchor": "start" });
    L.glissable(coche, { soulever: false, debut: () => ({ x: 0, y: 0 }), toucher: a.option });
    touche(g, x, y + 120, 92, "Lancer", a.lancer, "touche-lancer"); touche(g, x + 96, y + 120, 92, "Effacer", a.effacer, "touche-effacer");
    return () => {
      const M = L.orbites.MODES[s.mode];
      onglets.forEach((o, k) => o.b.firstChild.setAttribute("fill", s.modes[k] === s.mode ? "#bcd3ea" : "#e4e8ec"));
      titres.replaceChildren(); vals.replaceChildren();
      L.texte(titres, x, y + 32, "Distance de lancement r0", { "font-size": 7.2, fill: "#333", "text-anchor": "start" });
      L.texte(titres, x, y + 70, "Vitesse de lancement v0 (⊥ au rayon)", { "font-size": 7.2, fill: "#333", "text-anchor": "start" });
      L.texte(vals, x + 188, y + 32, `${fr(s.r0 / M.ur, 5)} ${M.nom_r}`, { "font-size": 7.5, "font-weight": 700, fill: "#0d47a1", "text-anchor": "end" });
      L.texte(vals, x + 188, y + 70, `${fr(s.v0 / 1000, 5)} km/s`, { "font-size": 7.5, "font-weight": 700, fill: "#0d47a1", "text-anchor": "end" });
      maj_r(); maj_v();
      coche.setAttribute("display", M.option ? "inline" : "none"); libelle.textContent = M.option || ""; croix.textContent = s.option ? "✓" : "";
      resultats(res, s, x, y + 152);
    };
  };
})(window.Labo);
