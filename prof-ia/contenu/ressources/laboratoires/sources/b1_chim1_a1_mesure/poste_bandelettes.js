/*
Rôle : paillasse « des nitrates dans l'eau ? » : trois béchers (eau du robinet, eau d'un puits, eau minérale), boîte de
       bandelettes réactives ; on trempe une bandelette dans une eau, sa zone réactive rosit d'autant plus qu'il y a de
       nitrates, puis elle se range sur le présentoir de lecture, sous l'échelle colorée (0 à 250 mg/L). Vraies dimensions.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_bandelettes(g) -> { pense_bete } ; fait « bandelettes » = { 1, 2, 3 : nitrates de l'eau (mg/L) ou null }.
Utilisé par : simulation.js.
*/
(function (L) {
  const SOL = 560, E = 1.6, ECHELLE = [0, 10, 25, 50, 100, 250], EAUX = [["eau_robinet", "eau du robinet", 25], ["eau_puits", "eau d'un puits", 100], ["eau_minerale", "eau minérale", 0]];
  for (const [id, nom, nitrates] of EAUX) L.LIQUIDES[id] = { nom, d: 1.0, rgb: [226, 239, 246], alpha: 0.32, classe: "aqueuse", nitrates };
  const teinte = (N) => { const k = Math.log(1 + N / 10) / Math.log(26); return L.rgb([250 - 72 * k, 248 - 218 * k, 244 - 134 * k]); };

  function affiche(g) {
    // Échelle colorée de la boîte, agrandie au mur ; présentoir de lecture.
    L.svg("rect", { x: 772, y: 214, width: 196, height: 92, rx: 4, fill: "#fdfdf8", stroke: "#b9b3a0" }, g);
    L.texte(g, 870, 230, "Bandelettes « nitrates » : échelle colorée", { "font-size": 8, "font-weight": 700, fill: "#23315a" });
    ECHELLE.forEach((N, k) => { L.svg("rect", { x: 784 + k * 30, y: 242, width: 24, height: 24, rx: 2, fill: teinte(N), stroke: "#999" }, g); L.texte(g, 796 + k * 30, 280, String(N), { "font-size": 8, "font-weight": 700, fill: "#222" }); });
    L.texte(g, 870, 296, "ions nitrate (mg/L)", { "font-size": 7.5, fill: "#444" });
    L.ombre_sol(g, 760, SOL + 2, 70, 5, 0.4);
    L.svg("rect", { x: 696, y: SOL - 22, width: 128, height: 22, rx: 3, fill: "#f2f3f0", stroke: "#a7aba3" }, g);
    for (let k = 0; k < 3; k++) L.svg("rect", { x: 712 + k * 42, y: SOL - 24, width: 12, height: 4, fill: "#8d918a" }, g);
    L.texte(g, 760, SOL + 12, "présentoir de lecture", { "font-size": 7, "font-weight": 700, fill: "#e8e2cc" });
  }

  function boite(g) {
    // Tube de bandelettes (corps de plastique, couvercle) posé sur la paillasse.
    L.ombre_sol(g, 214, SOL + 2, 26, 5, 0.4);
    L.svg("rect", { x: 194, y: SOL - 112, width: 40, height: 112, rx: 4, fill: "#e8eef2", stroke: "#9aa5ad" }, g);
    L.svg("rect", { x: 198, y: SOL - 80, width: 32, height: 46, fill: "#fff", stroke: "#c33", "stroke-width": 0.8 }, g);
    L.texte(g, 214, SOL - 62, "NO₃⁻", { "font-size": 8, "font-weight": 700, fill: "#c33" }); L.texte(g, 214, SOL - 48, "test", { "font-size": 7, fill: "#333" });
  }

  function bandelette(g, s) {
    // Bandelette de 6 mm × 65 mm (le point s.p est le bas de la zone réactive), zone réactive à sa teinte.
    g.replaceChildren();
    const { x, y } = s.p;
    L.svg("rect", { x: x - 5, y: y - 104, width: 10, height: 104, rx: 1, fill: "#fbfbf6", stroke: "#b8b8ad", "stroke-width": 0.6 }, g);
    L.svg("rect", { x: x - 5, y: y - 12, width: 10, height: 11, fill: s.couleur, stroke: "#b8b8ad", "stroke-width": 0.5 }, g);
  }

  L.poste_bandelettes = function (g) {
    // Décor, béchers, boîte, bandelettes saisissables ; trempage, réaction, rangement ; fait.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230), ctx = L.paillasse_chimie(g);
    L.ecoulement(ctx, { sol: SOL, e: E }); affiche(ctx.fond); boite(ctx.fond);
    const bechers = EAUX.map(([id, nom], k) => L.recipient(ctx, { id: `b${k + 1}`, profil: "becher_100", x: 330 + k * 130, y: SOL, contenu: { [id]: 70 }, etiquette: `${k + 1} ${nom}` }));
    const lu = { 1: null, 2: null, 3: null }, couche = L.svg("g", {}, ctx.haut);
    const strips = [0, 1, 2].map((k) => ({ k, p: { x: 206 + k * 8, y: SOL - 40 }, couleur: teinte(0), trempee: false, g: L.svg("g", { class: "bandelette", role: "button", "aria-label": `Bandelette ${k + 1}` }, couche) }));
    const tremper = (s, n, b) => {
      // La bandelette reste 1 s dans l'eau ; la zone rosit peu à peu ; puis elle se range sur le présentoir.
      s.trempee = true; s.p = { x: b.pose.x + 6, y: b.pose.y - 14 }; bandelette(s.g, s);
      let t = 0; const N = L.LIQUIDES[EAUX[n][0]].nitrates;
      const pas = setInterval(() => { t += 0.1; s.couleur = teinte(N * Math.min(1, t / 1.5)); if (t > 1) s.p = { x: 718 + s.k * 42, y: SOL - 22 }; bandelette(s.g, s); if (t >= 1.5) { clearInterval(pas); lu[n + 1] = N; L.missions.noter("bandelettes", { ...lu }); } }, 100);
    };
    for (const s of strips) L.glissable(s.g, { soulever: false, debut: () => ({ ...s.p }), deplacer: (p) => { if (!s.trempee) { s.p = p; bandelette(s.g, s); } },
      lacher: () => {
        if (s.trempee) return;
        const n = bechers.findIndex((b) => Math.abs(s.p.x - b.pose.x) < 32 && s.p.y > b.pose.y - b.pr.hauteur_de(b.c.volume()) * E + 4 && s.p.y < b.pose.y + 4);
        if (n >= 0) tremper(s, n, bechers[n]); else { s.p = { x: 206 + s.k * 8, y: SOL - 40 }; bandelette(s.g, s); }
      } });
    strips.forEach((s) => bandelette(s.g, s));
    L.missions.noter("bandelettes", { ...lu });
    return { pense_bete };
  };
})(window.Labo);
