/*
Rôle : paillasse « deuxième loi de Newton » : table à coussin d'air dont on choisit la pente avec trois cales en bois
       (1,5 cm, 2,5 cm ou 4 cm sous les pieds du fond, distants de 50 cm : sin α = 0,030, 0,050 ou 0,080), mobile de 600 g et
       surcharge de 300 g, éclateur, règle. Sans frottement, ΣF = P + R = m·g·sin α le long de la pente. Chaque
       enregistrement terminé est gardé avec la masse et la pente.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_newton(g) -> le poste de la table ; faits « pente » = sin α, « surcharge », « essais » = [{ m (kg),
          sin, n (points) }].
Utilisé par : simulation.js.
*/
(function (L) {
  const M = 0.6, SUR = 0.3, G = 9.81, CALES = [[1.5, 0.03], [2.5, 0.05], [4, 0.08]];

  function cales(g, table) {
    // Trois cales sur la paillasse ; un toucher en glisse une sous les pieds du fond (un second toucher la retire).
    const sous = L.svg("g", {}, g), etiquette = L.svg("g", {}, g);
    let choisie = null;
    const pieces = [];
    const poser = (k) => {
      choisie = choisie === k ? null : k; sous.replaceChildren(); etiquette.replaceChildren();
      pieces.forEach((b, j) => b.setAttribute("opacity", j === choisie ? 0.2 : 1));
      const sin = choisie === null ? 0 : CALES[choisie][1];
      table.a = G * 1000 * sin; L.missions.noter("pente", sin);
      if (choisie === null) return;
      const h = 6 + 5 * choisie;
      for (const x of [262, 742]) L.svg("path", { d: `M${x - 18} ${358 - h} H${x + 18} L${x + 22} 366 H${x - 22} Z`, fill: "url(#bois)", stroke: "#8d6337", "stroke-width": 0.6 }, sous);
      L.texte(etiquette, 512, 326, `Table inclinée : cale de ${String(CALES[choisie][0]).replace(".", ",")} cm (sin α = ${String(sin.toFixed(3)).replace(".", ",")})`, { class: "etiquette-carton", "font-size": 15, fill: "#3b2a05" });
    };
    CALES.forEach(([cm], k) => {
      const b = L.svg("g", { role: "button", "aria-label": `Cale de ${cm} cm`, class: `cale-${k}` }, g), x = 38 + k * 62, h = 10 + 8 * k;
      pieces.push(b);
      L.svg("rect", { x, y: 400 - h, width: 46, height: h, rx: 2, fill: "url(#bois)", stroke: "#8d6337" }, b);
      L.texte(b, x + 23, 412, `${String(cm).replace(".", ",")} cm`, { class: "etiquette-carton", "font-size": 12 });
      L.glissable(b, { soulever: false, debut: () => ({ x: 0, y: 0 }), toucher: () => poser(k) });
    });
    return () => (choisie === null ? 0 : CALES[choisie][1]);
  }

  L.poste_newton = function (g) {
    // Table horizontale au départ, cales, surcharge sur le mobile ; essais notés à la fin de chaque enregistrement.
    const poste = L.poste_coussin_air(g, { nom: "newton", outils: ["regle"] }), table = poste.table, ve = L.CoussinAir.vers_ecran;
    table.masse_kg = M;
    const sin = cales(g, table), sous = L.svg("g", {}, g), essais = [];
    g.insertBefore(sous, g.querySelector(".calque-dessus"));
    L.svg("rect", { x: 30, y: 430, width: 150, height: 34, rx: 3, fill: "#f7f5ee", stroke: "#c9c3b0", transform: "rotate(-2 105 447)" }, sous);
    L.texte(sous, 105, 448, `Mobile : ${Math.round(M * 1000)} g`, { class: "etiquette-carton", "font-size": 15 });
    poste.surcharge = L.surcharge(sous, {
      masse_kg: SUR, repos: { x: 104, y: 492 },
      cibles: () => { const p = ve(table.pos.x, table.pos.y); return [{ nom: "mobile", x: p.x, y: p.y - 6, libre: table.immobile() }]; },
      sur_changement: (nom) => { table.masse_kg = M + (nom ? SUR : 0); L.missions.noter("surcharge", !!nom); },
    });
    const dessiner = table.dessiner_mobile.bind(table);
    table.dessiner_mobile = () => { dessiner(); poste.surcharge.placer(); };
    L.ecouter("enregistrement", (e) => { if (e.fini && e.mobile === table && sin() > 0) { essais.push({ m: Math.round(table.masse_kg * 10) / 10, sin: sin(), n: e.points.length }); L.missions.noter("essais", essais.slice()); } });
    L.missions.noter("pente", 0);
    return poste;
  };
})(window.Labo);
