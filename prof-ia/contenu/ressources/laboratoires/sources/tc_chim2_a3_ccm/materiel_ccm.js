/*
Rôle : petit matériel de la chromatographie, aux vraies dimensions (1,6 px par mm) : crayon à papier, tubes d'échantillons
       sur leur portoir avec un tube capillaire dans chacun, règle graduée en mm, couvercle de la cuve, lampe UV portative à
       254 nm (au-dessus de la plaque), bocal de diiode, bidon de récupération. Dessins seulement, sauf les gestes du crayon et des capillaires.
Reçoit : le contexte de la paillasse et les réglages de chaque objet.
Produit : Labo.ccm = { crayon(ctx, repos, lacher), capillaires(ctx, echantillons, lacher), regle(g, x, bas, zero),
          couvercle(g, x, y, ferme), lampe_uv(g, x, y, allumee), bocal_iode(g, x, sol), bidon(g, x, sol) }.
Utilisé par : poste_ccm.js.
*/
(function (L) {
  const E = 1.6;

  function crayon(ctx, repos, lacher) {
    // Crayon à papier de 15 cm couché sur la paillasse, mine en (0, 0) ; on le prend par le corps et l'on vise avec la mine.
    const g = L.svg("g", { class: "crayon", role: "button", "aria-label": "Crayon à papier" }, ctx.objets);
    L.svg("path", { d: "M0 0 L12 -3 V3 Z", fill: "#e8c99a" }, g); L.svg("path", { d: "M0 0 L4 -1 V1 Z", fill: "#3a3a3a" }, g);
    L.svg("rect", { x: 12, y: -3.5, width: 128, height: 7, fill: "#e0b628", stroke: "#a8851a", "stroke-width": 0.4 }, g);
    L.svg("rect", { x: 140, y: -3.5, width: 8, height: 7, fill: "#b9bfc3" }, g); L.svg("rect", { x: 148, y: -3.5, width: 6, height: 7, rx: 2, fill: "#e98a9a" }, g);
    const placer = (p) => L.placer(g, p.x, p.y, E);
    placer(repos);
    L.glissable(g, { debut: () => ({ ...repos }), saisir: () => ctx.haut.append(g), deplacer: placer, lacher: (p) => { lacher(p); ctx.objets.append(g); placer(repos); } });
  }

  function tube_echantillon(g, x, bas, rgb, n, texte) {
    // Tube à hémolyse (12 mm × 75 mm) contenant 1 cm d'échantillon, étiquette collée dessus (numéro et nom).
    L.svg("rect", { x: x - 9.6, y: bas - 120, width: 19.2, height: 120, rx: 9, fill: "rgba(205,228,236,0.4)", stroke: "rgba(120,150,160,0.9)", "stroke-width": 0.8 }, g);
    L.svg("rect", { x: x - 8, y: bas - 18, width: 16, height: 16, rx: 7, fill: rgb ? L.rgb(rgb) : "rgba(226,239,246,0.7)", opacity: 0.85 }, g);
    L.svg("rect", { x: x - 15, y: bas - 76, width: 30, height: 20, rx: 1, fill: "#fbfaf3", stroke: "#cfcab8", "stroke-width": 0.4 }, g);
    L.texte(g, x, bas - 70, String(n), { "font-size": 7.5, "font-weight": 700, fill: "#23315a" });
    L.texte(g, x, bas - 61, texte, { "font-size": 5.2, fill: "#23315a" });
  }

  function capillaires(ctx, liste, lacher) {
    // Portoir de tubes ; dans chaque tube, un capillaire (90 mm) que l'on sort et dont on pose la pointe sur la plaque.
    const g = ctx.fond, bas = 548;
    L.svg("rect", { x: liste[0].x - 22, y: bas - 4, width: liste[liste.length - 1].x - liste[0].x + 44, height: 12, rx: 2, fill: "#e8e9e4", stroke: "#a7aba3" }, g);
    for (const s of liste) {
      tube_echantillon(g, s.x, bas, s.rgb, s.n, s.texte);
      const c = L.svg("g", { class: `capillaire capillaire-${s.n}`, role: "button", "aria-label": `Capillaire ${s.n}` }, ctx.objets), repos = { x: s.x + 3, y: bas - 6 };
      L.svg("rect", { x: -1.2, y: -144, width: 2.4, height: 144, fill: "rgba(220,238,244,0.9)", stroke: "rgba(120,150,160,0.9)", "stroke-width": 0.4 }, c);
      L.svg("rect", { x: -0.5, y: -30, width: 1, height: 28, fill: s.rgb ? L.rgb(s.rgb) : "#cfe3ec" }, c);
      L.svg("rect", { x: -8, y: -150, width: 16, height: 120, fill: "#000", opacity: 0 }, c);
      L.placer(c, repos.x, repos.y);
      L.glissable(c, { debut: () => ({ ...repos }), saisir: () => ctx.haut.append(c), deplacer: (p) => L.placer(c, p.x, p.y), lacher: (p) => { lacher(s, p); ctx.objets.append(c); L.placer(c, repos.x, repos.y); } });
    }
  }

  function regle(g, x, bas, zero) {
    // Règle transparente graduée en mm, posée contre la plaque ; son zéro est aligné sur la ligne de dépôt (zero, en px).
    g.replaceChildren();
    L.svg("rect", { x: x - 16, y: bas - 176, width: 16, height: 180, fill: "rgba(240,246,248,0.9)", stroke: "#9fb0b6", "stroke-width": 0.6 }, g);
    for (let mm = -10; mm <= 100; mm++) {
      const y = zero - mm * E;
      if (y < bas - 174 || y > bas + 2) continue;
      L.svg("line", { x1: x, x2: x - (mm % 10 === 0 ? 8 : mm % 5 === 0 ? 5.5 : 3.5), y1: y, y2: y, stroke: "#222", "stroke-width": 0.4 }, g);
      if (mm % 10 === 0) L.svg("text", { x: x - 9, y: y + 2, "font-size": 5, "text-anchor": "end", fill: "#222", "font-family": "sans-serif" }, g).textContent = String(mm / 10);
    }
    L.svg("text", { x: x - 10, y: bas - 168, "font-size": 4.4, "text-anchor": "end", fill: "#222", "font-family": "sans-serif" }, g).textContent = "cm";
  }

  function couvercle(g, x, y, ferme) {
    // Plaque de verre (12 cm) : posée sur la cuve, ou debout contre le mur derrière elle.
    g.replaceChildren();
    if (ferme) return void L.svg("rect", { x: x - 96, y: y - 6, width: 192, height: 6, rx: 1, fill: "rgba(205,228,236,0.7)", stroke: "rgba(120,150,160,0.9)", "stroke-width": 0.8 }, g);
    L.svg("rect", { x: x - 96, y: y - 70, width: 192, height: 62, rx: 2, fill: "rgba(205,228,236,0.35)", stroke: "rgba(120,150,160,0.8)", "stroke-width": 0.8 }, g);
  }

  function lampe_uv(g, x, y, allumee) {
    // Lampe UV portative (254 nm) fixée au-dessus du support de la plaque ; allumée, elle éclaire la plaque en violet.
    g.replaceChildren();
    L.tige(g, `M${x + 6} 556 V${y + 10}`, 5);
    if (allumee) L.svg("path", { d: `M${x + 14} ${y + 22} L${x + 132} ${y + 22} L${x + 126} ${y + 200} L${x + 20} ${y + 200} Z`, fill: "rgb(150,110,255)", opacity: 0.14, "pointer-events": "none" }, g);
    L.svg("rect", { x, y, width: 140, height: 22, rx: 4, fill: "#26292c", stroke: "#111" }, g);
    L.svg("rect", { x: x + 12, y: y + 18, width: 104, height: 4, rx: 2, fill: allumee ? "#c9b8ff" : "#4a4f55" }, g);
    L.texte(g, x + 56, y + 10, "UV 254 nm", { "font-size": 7, "font-weight": 700, fill: "#d9dde0" });
    L.svg("circle", { cx: x + 120, cy: y + 11, r: 6, fill: allumee ? "#7a5cff" : "#555b61", stroke: "#111" }, g);
  }

  function bocal_iode(g, x, sol) {
    // Bocal fermé contenant des cristaux de diiode (vapeurs violettes), pictogramme de danger.
    L.svg("ellipse", { cx: x + 3, cy: sol + 1, rx: 58, ry: 5, fill: "#000", opacity: 0.3 }, g);
    L.svg("rect", { x: x - 56, y: sol - 190, width: 112, height: 190, rx: 10, fill: "rgba(205,228,236,0.4)", stroke: "rgba(120,150,160,0.9)" }, g);
    L.svg("rect", { x: x - 54, y: sol - 188, width: 108, height: 186, rx: 9, fill: "rgb(170,110,190)", opacity: 0.18 }, g);
    for (let k = 0; k < 14; k++) L.svg("rect", { x: x - 40 + ((k * 13) % 80), y: sol - 8 - (k % 3) * 3, width: 4, height: 3, fill: "#3a2a3e" }, g);
    L.svg("rect", { x: x - 60, y: sol - 202, width: 120, height: 14, rx: 3, fill: "#3a3f44" }, g);
    L.svg("rect", { x: x - 30, y: sol - 40, width: 60, height: 20, fill: "#fbfaf3" }, g);
    L.texte(g, x, sol - 30, "diiode", { "font-size": 8, "font-weight": 700, fill: "#23315a" });
  }

  function bidon(g, x, sol) {
    // Bidon jaune de récupération des solvants.
    L.svg("path", { d: `M${x - 26} ${sol} V${sol - 78} Q${x - 26} ${sol - 88} ${x - 16} ${sol - 88} H${x + 4} V${sol - 96} H${x + 16} V${sol - 88} Q${x + 26} ${sol - 88} ${x + 26} ${sol - 78} V${sol} Z`, fill: "#e7c22a", stroke: "#a3850f" }, g);
    L.texte(g, x, sol - 50, "Récupération", { "font-size": 5.4, "font-weight": 700, fill: "#3b2f00" });
  }

  L.ccm = { crayon, capillaires, regle, couvercle, lampe_uv, bocal_iode, bidon, E };
})(window.Labo);
