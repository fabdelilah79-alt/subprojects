/*
Rôle : bécher de 250 mL (matériel physique, vraies dimensions) contenant 3 g de feuilles de thé, dans lequel on verse
       de l'eau : l'eau se colore peu à peu (extraction ; les espèces extraites colorent la phase aqueuse). Plus l'eau est
       chaude, plus l'extraction est rapide et plus le liquide devient foncé. Sur la plaque, l'eau finit par bouillir
       (bulles, vapeur) ; hors de la plaque, elle refroidit lentement. La température vient de l'eau versée.
Reçoit : le contexte de la paillasse (avec ctx.ecoulement) et { id, x, y (fond intérieur, px), lettre, texte }.
Produit : Labo.becher_the(ctx, reglage) -> { id, r (récipient), eau, T, c (0 à 1 : avancement), bout, avancer(dt_min, chauffe) }.
Utilisé par : postes_a1.js.
*/
(function (L) {
  const E = 1.6;
  L.TEINTES.the = { aqueuse: [150, 82, 18], organique: [150, 82, 18] };
  const k = (T) => 0.002 * Math.exp((T - 20) / 14);
  const c_max = (T) => 0.35 + (0.65 * Math.max(0, T - 20)) / 80;

  function feuilles(g, x, y, c) {
    // Feuilles de thé vert roulées au fond ; elles se déroulent à mesure que l'extraction avance.
    g.replaceChildren();
    const e = 0.7 + 0.9 * c;
    for (let i = 0; i < 14; i++) {
      const fx = x - 40 + ((i * 23) % 80), fy = y - 3 - ((i * 7) % 8);
      L.svg("ellipse", { cx: fx, cy: fy, rx: 4.2 * e, ry: 1.9 * e, transform: `rotate(${(i * 53) % 180} ${fx} ${fy})`, fill: c > 0.3 ? "#5f7d2e" : "#3f5622", stroke: "#2c3c16", "stroke-width": 0.4 }, g);
    }
  }

  function bulles(g, b) {
    // Bouillonnement : bulles dans l'eau et panache de vapeur au-dessus du bécher.
    g.replaceChildren();
    if (!b.bout) return;
    const r = b.r, haut = r.pose.y - r.pr.hauteur_de(r.c.volume()) * E, x = r.pose.x;
    for (let i = 0; i < 12; i++) L.svg("circle", { cx: x - 40 + ((i * 17 + Date.now() / 40) % 80), cy: r.pose.y - 4 - ((i * 23 + Date.now() / 25) % Math.max(4, r.pose.y - haut - 6)), r: 1.4 + (i % 3) * 0.7, fill: "none", stroke: "#fff", opacity: 0.7 }, g);
    for (let i = 0; i < 3; i++) L.svg("path", { d: `M${x - 18 + i * 18} ${r.pose.y - r.pr.H * E - 6} q-7 -12 0 -24 q7 -12 0 -24`, stroke: "#ffffff", "stroke-width": 4, opacity: 0.35, fill: "none" }, g);
  }

  L.becher_the = function (ctx, { id, x, y, lettre, texte }) {
    // Bécher fixe, feuilles et étiquette ; avancer() fait évoluer la température et l'extraction (temps en minutes).
    const r = L.recipient(ctx, { id, profil: "becher_250", x, y, etiquette: `${lettre} : ${texte}` });
    r.g.setAttribute("pointer-events", "none");
    const g_f = L.svg("g", { "pointer-events": "none" }, ctx.objets), g_b = L.svg("g", { "pointer-events": "none" }, ctx.objets);
    const b = { id, r, eau: false, T: 20, c: 0, bout: false };
    feuilles(g_f, x, y, 0);
    b.avancer = (dt, chauffe) => {
      const ph = r.c.phases.find((p) => p.classe === "aqueuse");
      b.eau = r.c.volume() >= 70;
      if (!ph) return;
      const T = r.c.T ?? 20;
      r.c.T = chauffe ? Math.min(100, T + (110 - T) * (1 - Math.exp(-dt / 2.5))) : 20 + (T - 20) * Math.exp(-dt / 25);
      b.T = r.c.T; b.bout = chauffe && b.T >= 99.5;
      b.c = Math.max(b.c, b.c + k(b.T) * (c_max(b.T) - b.c) * dt);
      ph.dissous.the = 0.075 * ph.V * b.c;
      r.sig = null; feuilles(g_f, x, y, b.c); bulles(g_b, b);
    };
    return b;
  };
})(window.Labo);
