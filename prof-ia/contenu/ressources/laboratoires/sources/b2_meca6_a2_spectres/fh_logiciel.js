/*
Rôle : logiciel d'acquisition de l'expérience de Franck et Hertz sur le portable : touches « Acquérir » (enregistre une rampe
       complète de U2, 0 à 30 V) et « Effacer », graphique IA (nA) en fonction de U2 (V), les deux courbes précédentes restent
       en clair avec leur température, curseur vertical que l'on fait glisser sur le graphique et qui affiche U2 et IA.
Reçoit : le groupe SVG, la dalle { x, y, l, h } du portable et les actions { acquerir(), effacer(), curseur(U) }.
Produit : Labo.fh_logiciel(g, dalle, actions) -> tracer(s), avec s = { courbes [{ theta, pts [[U, I]] }], curseur (V), etat, message }.
Utilisé par : poste_franck_hertz.js.
*/
(function (L) {
  const COULEURS = ["#90a4ae", "#f29d0b", "#d32f2f"], fr = (v, n) => v.toFixed(n).replace(".", ",");

  function touches(g, d, a) {
    // Deux touches grises sous la barre de titre.
    [["Acquérir", a.acquerir], ["Effacer", a.effacer]].forEach(([t, f], k) => {
      const b = L.svg("g", { class: `fh-${k ? "effacer" : "acquerir"}`, role: "button", "aria-label": t }, g);
      L.svg("rect", { x: d.x + 8 + k * 70, y: d.y + 20, width: 62, height: 16, rx: 3, fill: "#e4e8ec", stroke: "#8a96a0" }, b);
      L.texte(b, d.x + 39 + k * 70, d.y + 31, t, { "font-size": 8, "font-weight": 700, fill: "#23315a" });
      L.glissable(b, { soulever: false, debut: () => ({ x: 0, y: 0 }), toucher: f });
    });
  }

  function axes(g, P, imax) {
    // Quadrillage, graduations de U2 (tous les 5 V) et de IA, noms des axes.
    for (let U = 0; U <= 30; U += 2.5) {
      L.svg("line", { x1: P.X(U), y1: P.y, x2: P.X(U), y2: P.y + P.h, stroke: U % 5 ? "#eef0ea" : "#dcdfd6", "stroke-width": 0.6 }, g);
      if (U % 5 === 0) L.texte(g, P.X(U), P.y + P.h + 10, String(U), { "font-size": 6.5, fill: "#333" });
    }
    for (let k = 0; k <= 4; k++) {
      const I = (k * imax) / 4;
      L.svg("line", { x1: P.x, y1: P.Y(I), x2: P.x + P.l, y2: P.Y(I), stroke: "#dcdfd6", "stroke-width": 0.6 }, g);
      L.texte(g, P.x - 4, P.Y(I) + 2.5, fr(I, 1), { "font-size": 6.5, fill: "#333", "text-anchor": "end" });
    }
    L.texte(g, P.x - 4, P.y - 5, "IA (nA)", { "font-size": 7, "font-weight": 700, fill: "#333", "text-anchor": "start" });
    L.texte(g, P.x + P.l, P.y + P.h + 20, "U2 (V)", { "font-size": 7, "font-weight": 700, fill: "#333", "text-anchor": "end" });
  }

  function lecture(c, U) {
    // IA lue sur la courbe c à la tension U (point le plus proche).
    if (!c || !c.pts.length) return null;
    return c.pts.reduce((m, p) => (Math.abs(p[0] - U) < Math.abs(m[0] - U) ? p : m))[1];
  }

  L.fh_logiciel = function (g, d, a) {
    // Partie fixe (touches, zone sensible du curseur) et partie redessinée (axes, courbes, curseur, lectures).
    const P = { x: d.x + 40, y: d.y + 52, l: d.l - 56, h: d.h - 82 };
    touches(g, d, a);
    const dyn = L.svg("g", { "pointer-events": "none" }, g), zone = L.svg("rect", { class: "fh-graphique", x: P.x, y: P.y, width: P.l, height: P.h, fill: "#000", opacity: 0.001 }, g);
    const vers_U = (px) => Math.max(0, Math.min(30, ((px - P.x) / P.l) * 30));
    L.glissable(zone, { soulever: false, debut: (e) => { const p = L.scene.vers_scene(e); a.curseur(vers_U(p.x)); return p; }, deplacer: (p) => a.curseur(vers_U(p.x)) });
    return (s) => {
      dyn.replaceChildren();
      const imax = Math.max(2, 2 * Math.ceil(Math.max(0, ...s.courbes.flatMap((c) => c.pts.map((p) => p[1]))) / 2));
      Object.assign(P, { X: (U) => P.x + (U / 30) * P.l, Y: (I) => P.y + P.h - (I / imax) * P.h });
      axes(dyn, P, imax);
      s.courbes.forEach((c, n) => {
        const der = n === s.courbes.length - 1, col = COULEURS[n + 3 - s.courbes.length];
        if (c.pts.length > 1) L.svg("path", { d: c.pts.map((p, k) => `${k ? "L" : "M"}${P.X(p[0]).toFixed(1)} ${P.Y(p[1]).toFixed(1)}`).join(" "), fill: "none", stroke: col, "stroke-width": der ? 1.4 : 0.9, opacity: der ? 1 : 0.7 }, dyn);
        L.texte(dyn, P.x + 6, P.y + 9 + n * 9, `ϑ = ${Math.round(c.theta)} °C`, { "font-size": 6.5, "font-weight": 700, fill: col, "text-anchor": "start" });
      });
      L.svg("line", { x1: P.X(s.curseur), y1: P.y, x2: P.X(s.curseur), y2: P.y + P.h, stroke: "#2e7d32", "stroke-width": 1 }, dyn);
      const I = lecture(s.courbes[s.courbes.length - 1], s.curseur);
      L.texte(dyn, d.x + d.l - 8, d.y + 31, `U2 = ${fr(s.curseur, 2)} V   IA = ${I === null ? "—" : fr(I, 2) + " nA"}`, { "font-size": 8, "font-weight": 700, fill: "#2e7d32", "text-anchor": "end" });
      L.texte(dyn, d.x + 156, d.y + 31, s.message, { "font-size": 7, fill: "#555", "text-anchor": "start" });
      return I;
    };
  };
})(window.Labo);
