/*
Rôle : paillasse de la combustion du carbone : lunettes, bec Bunsen et allume-gaz, têt à combustion avec son morceau de
       charbon de bois, flacon de 600 mL rempli de dioxygène et fermé par une plaque de verre (toucher le haut du flacon
       pose ou ôte la plaque), bécher d'eau de chaux. Après la combustion, on verse l'eau de chaux dans le flacon, on le
       ferme et on l'agite : l'eau de chaux se trouble (le dioxyde de carbone formé contient l'élément carbone).
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_carbone(groupe) -> { pense_bete } ; fait « carbone » = { lunettes, allume, air, m (g), T (°C), lieu, O2 (fraction
          restante), CO2 (g), plaque, chaux (mL dans le flacon), trouble (part troublée) }.
Utilisé par : simulation.js.
*/
(function (L) {
  const SOL = 576, E = 1.6, JX = 620, O2_0 = 0.8;
  L.LIQUIDES.eau_chaux_trouble = { nom: "eau de chaux troublée", d: 1.0, rgb: [244, 244, 238], alpha: 0.88, classe: "aqueuse", pH: 12 };

  function support(g, x, sol) {
    // Support du têt : socle lourd, tige, pince en fourche ; carreau de céramique sous la coupelle.
    L.svg("rect", { x: x - 22, y: sol - 6, width: 44, height: 6, rx: 1, fill: "#e9e4d8", stroke: "#b8b09c" }, g);
    L.svg("rect", { x: x - 70, y: sol - 8, width: 26, height: 8, rx: 2, fill: "#3a3f44" }, g);
    L.tige(g, `M${x - 57} ${sol - 8} V${sol - 230}`, 5);
    L.tige(g, `M${x - 57} ${sol - 220} H${x - 4}`, 3);
    L.svg("path", { d: `M${x - 6} ${sol - 226} h-6 v12 h6`, fill: "none", stroke: "#5d646a", "stroke-width": 2 }, g);
  }

  function chaux(c, dt, agite) {
    // L'eau de chaux se trouble au contact du dioxyde de carbone (carbonate de calcium), bien plus vite si l'on agite.
    const v = c.phases.reduce((s, p) => s + (p.liquides.eau_chaux || 0), 0);
    if (v > 0) L.convertir_liquide(c, "eau_chaux", "eau_chaux_trouble", Math.min(v, (agite ? 0.6 : 0.002) * dt * (v + 5)));
  }

  L.poste_carbone = function (g) {
    // Matériel et gestes ; un pas toutes les 0,1 s pour le charbon, à chaque pas de l'écoulement pour le flacon.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230), ctx = L.paillasse_chimie(g), calque = L.svg("g", { "pointer-events": "none" }, g);
    L.affiche_securite(g, 780, 56);
    L.ecoulement(ctx, { sol: SOL, e: E });
    const dire = (t) => { calque.replaceChildren(); if (t) { L.svg("rect", { x: 380, y: 200, width: 330, height: 28, rx: 5, fill: "#fff6e0", stroke: "#d08a1a" }, calque); L.texte(calque, 545, 214, t, { "font-size": 7.4, "font-weight": 700, fill: "#6b3d00" }); } };
    const epi = L.equipement(g, { x: 300, y: 70, changer: () => dire("") });
    support(ctx.fond, 250, SOL);
    const bec = L.bec_bunsen(ctx, { x: 400, sol: SOL, e: E, dire });
    const flacon = L.recipient(ctx, { id: "flacon", profil: "flacon_gaz", x: JX, y: SOL, bouchon: true, etiquette: "dioxygène" });
    const becher = L.recipient(ctx, { id: "chaux", profil: "becher_100", x: 775, y: SOL, contenu: { eau_chaux: 30 }, etiquette: "eau de chaux" });
    L.manipuler(ctx, becher, { sol: SOL });
    const t = L.tet_combustion(ctx, bec, { support: { x: 250, sol: SOL }, flacon, O2_initial: O2_0, dire, plaque: () => flacon.bouchon, autoriser: () => epi.porte.lunettes || (dire("Mettez vos lunettes : la combustion dans le dioxygène est très vive."), false) });
    L.manipuler(ctx, flacon, { sol: SOL, supports: [{ x: JX, y: SOL }], pose_libre: false, autoriser: () => { if (t.lieu === "flacon") { dire("Retirez d'abord le têt du flacon."); return false; } return true; } });
    ctx.obstacles = (ctx.obstacles || []).concat([[JX - 70, JX + 70], [170, 470]]);
    const posee = L.svg("path", { d: `M${JX - 150} ${SOL + 8} l8 -5 h56 l-8 5 Z`, fill: "rgba(200,230,236,0.8)", stroke: "rgba(110,150,160,0.9)", "stroke-width": 0.6, "pointer-events": "none" }, ctx.fond);
    const zone = L.svg("rect", { width: 110, height: 34, fill: "#000", opacity: 0, class: "plaque-verre", role: "button", "aria-label": "Plaque de verre" }, ctx.haut);
    L.glissable(zone, { soulever: false, debut: () => ({ x: 0, y: 0 }), toucher: () => {
      if (t.lieu === "flacon") return dire("Le disque du têt ferme déjà le flacon.");
      flacon.bouchon = !flacon.bouchon; flacon.sig = null; posee.style.display = flacon.bouchon ? "none" : ""; dire("");
    } });
    posee.style.display = "none";
    const arrondi = (v, k = 100) => Math.round(v * k) / k;
    const noter = () => {
      const V = (n) => flacon.c.phases.reduce((s, p) => s + (p.liquides[n] || 0), 0), total = V("eau_chaux") + V("eau_chaux_trouble");
      const v = { lunettes: epi.porte.lunettes, allume: bec.allume, air: bec.air, m: arrondi(t.m), T: Math.round(t.T), lieu: t.lieu, O2: arrondi(t.O2 / O2_0), CO2: arrondi(t.CO2), plaque: flacon.bouchon, chaux: Math.round(total), trouble: total ? arrondi(V("eau_chaux_trouble") / total) : 0 };
      const s = JSON.stringify(v);
      if (s !== noter.avant) { noter.avant = s; L.missions.noter("carbone", v); }
    };
    setInterval(() => { t.pas(0.1); noter(); }, 100);
    ctx.ecoulement.sur_pas((dt) => {
      const h = flacon.monde(flacon.pr.levres.g);
      zone.setAttribute("x", flacon.pose.x - 55); zone.setAttribute("y", h.y - 22);
      if (!flacon.bouchon && t.lieu !== "flacon") { t.O2 *= Math.exp(-dt / 300); t.CO2 *= Math.exp(-dt / 300); }
      if (t.CO2 > 0.05) { chaux(flacon.c, dt, flacon.bouchon && Math.hypot(flacon.acc.x, flacon.acc.y) > 2500); flacon.sig = null; }
    });
    return { pense_bete };
  };
})(window.Labo);
