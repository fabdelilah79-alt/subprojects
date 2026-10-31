/*
Rôle : capteur optique à fourche (le bord du disque passe entre ses deux branches : une diode émet, une photodiode reçoit)
       et son compteur-chronomètre. On glisse la fourche le long de sa règle verticale, sous l'axe, pour la mettre en face
       d'une fente (à 4, 6 ou 8 cm de l'axe) : la lumière ne passe que quand la fente est entre les branches. Le compteur
       mesure, au choix, la période T (durée entre deux passages de la même fente) ou la durée Δt d'un passage
       (Δt = largeur de la fente / vitesse de la fente).
Reçoit : le groupe SVG, le disque (disque_moteur.js) et { x, y } (position du compteur).
Produit : Labo.fourche_optique(g, disque, reglage) -> { r (mm, position de la fourche), mode, T, dt, passages }.
Utilisé par : postes_uniforme.js.
*/
(function (L) {
  const POSITIONS = [40, 50, 60, 70, 80, 90];

  function fourche(g, p, e) {
    // Fourche en U (branches devant et derrière le disque), voyant rouge.
    L.svg("rect", { x: p.x - 16, y: p.y - 6, width: 32, height: 34, rx: 3, fill: "#222a30", stroke: "#000" }, g);
    L.svg("rect", { x: p.x - 16, y: p.y - 22, width: 9, height: 20, fill: "#222a30" }, g);
    L.svg("rect", { x: p.x + 7, y: p.y - 22, width: 9, height: 20, fill: "#222a30" }, g);
    L.svg("circle", { cx: p.x - 11, cy: p.y - 16, r: 2.2, fill: "#ff3b30" }, g);
    L.svg("rect", { x: p.x - 28, y: p.y - 14, width: 56, height: 50, fill: "#000", opacity: 0 }, g);
  }

  L.fourche_optique = function (g, m, { x, y }) {
    // Règle verticale graduée sous l'axe, fourche déplaçable, compteur à deux modes ; un passage est compté à chaque fente vue.
    const e = m.e, s = { r: 80, mode: "periode", T: null, dt: null, passages: 0, dernier: {} };
    const pos = (r) => ({ x: m.c.x, y: m.c.y + r * e });
    L.svg("rect", { x: m.c.x + 22, y: m.c.y + 30 * e, width: 10, height: 66 * e, fill: "#e8e2cc", stroke: "#9a917a" }, g);
    for (const r of POSITIONS) { const p = pos(r); L.svg("line", { x1: m.c.x + 22, y1: p.y, x2: m.c.x + 28, y2: p.y, stroke: "#333" }, g); L.texte(g, m.c.x + 46, p.y + 3, `${r / 10} cm`, { "font-size": 7.5, "font-weight": 700, fill: "#33414b" }); }
    const f = L.svg("g", { class: "fourche", role: "button", "aria-label": "Fourche optique" }, g);
    const placer = () => { f.replaceChildren(); fourche(f, pos(s.r), e); };
    L.glissable(f, { soulever: false, debut: () => pos(s.r), deplacer: (p) => { s.r = Math.max(40, Math.min(90, (p.y - m.c.y) / e)); placer(); },
      lacher: () => { s.r = POSITIONS.reduce((a, b) => (Math.abs(b - s.r) < Math.abs(a - s.r) ? b : a)); s.T = s.dt = null; s.dernier = {}; placer(); } });
    L.svg("rect", { x: x - 70, y: y - 34, width: 140, height: 68, rx: 6, fill: "#c7ccd0", stroke: "#555" }, g);
    L.texte(g, x, y - 22, "COMPTEUR-CHRONOMÈTRE", { "font-size": 7, "font-weight": 700, fill: "#23315a" });
    L.svg("rect", { x: x - 60, y: y - 16, width: 120, height: 22, rx: 3, fill: "#1d2a22" }, g);
    const ecran = L.svg("g", {}, g);
    const afficher = () => {
      ecran.replaceChildren();
      const v = s.mode === "periode" ? s.T : s.dt, t = v === null ? "- - - -" : `${s.mode === "periode" ? "T" : "Δt"} = ${v.toFixed(s.mode === "periode" ? 4 : 5).replace(".", ",")} s`;
      L.texte(ecran, x, y - 1, t, { "font-size": 11, "font-weight": 700, fill: "#7dff9a", "font-family": "monospace" });
    };
    L.bouton_texte(g, x, y + 22, "Période / Passage", () => { s.mode = s.mode === "periode" ? "passage" : "periode"; afficher(); });
    let avant = null;
    m.surveillants.push(() => {
      // Une fente au rayon de la fourche passe-t-elle sous l'axe (angle π/2) pendant ce pas ?
      const fente = m.FENTES.find((k) => Math.abs(k.r - s.r) < 1), a = m.theta;
      if (fente && avant !== null && Math.abs(m.omega) > 0.5) {
        const tours = (b) => Math.floor((b + fente.a - Math.PI / 2) / (2 * Math.PI));
        if (tours(a) !== tours(avant)) {
          const bruit = 1 + (Math.random() - 0.5) * 0.002;
          if (s.dernier.t !== undefined) s.T = ((2 * Math.PI) / Math.abs(m.omega)) * bruit;
          s.dt = (m.LARGEUR / (s.r * Math.abs(m.omega))) * bruit; s.dernier.t = m.t; s.passages++; afficher();
        }
      }
      avant = a;
    });
    placer(); afficher();
    return s;
  };
})(window.Labo);
