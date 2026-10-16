/*
Rôle : paillasse de l'extraction du diiode par un solvant : eau iodée, flacons de cyclohexane et d'éthanol, ampoule à
       décanter sur son support, bouchon, bécher récepteur, bidon de récupération. Gestes : fermer le robinet, verser,
       boucher, agiter (aller-retour), dégazer (toucher le robinet : l'ampoule est retournée), reposer, ôter le bouchon,
       ouvrir puis fermer le robinet pour recueillir la phase inférieure.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_solvant(groupe) -> { pense_bete } ; fait « ampoule » (voir noter()).
Utilisé par : simulation.js.
*/
(function (L) {
  const A = { x: 520, y: 300 }, BAS = A.y + L.ampoule.BAS, REC = { x: 520, bas: 562 }, BIDON = { x: 820, bas: 562 };

  function etat_initial() {
    // Ampoule vide, robinet ouvert (l'élève doit penser à le fermer), bouchon posé sur la paillasse.
    return { aq: 0, org: 0, miscible: false, I2_aq: 0, I2_org: 0, melange: 0, bouchon: false, robinet: true, angle: 0, pression: false, agitee: 0, degaze: false, solvant: null, recu_aq: 0, recu_org: 0 };
  }

  function message(calque, texte) {
    // Bulle d'avertissement à côté de l'ampoule (disparaît au message suivant).
    calque.replaceChildren();
    if (!texte) return;
    L.svg("rect", { x: 580, y: 312, width: 190, height: 30, rx: 5, fill: "#fff6e0", stroke: "#d08a1a" }, calque);
    L.texte(calque, 675, 327, texte, { "font-size": 8, fill: "#6b3d00", "font-weight": 700 });
  }

  function verser(e, quoi, dire) {
    // Verse 20 mL d'eau iodée ou 10 mL de solvant ; refusé si le robinet est ouvert.
    if (e.robinet) return dire("Fermez d'abord le robinet !"), false;
    if (e.bouchon) return dire("Ôtez le bouchon pour verser."), false;
    if (quoi === "eau_iodee") Object.assign(e, { aq: e.aq + 20, I2_aq: 1 });
    else { e.org += 10; e.solvant = quoi; e.miscible = quoi === "ethanol"; }
    return dire(""), true;
  }

  function agiter(e, dire) {
    // Un aller-retour de l'ampoule bouchée : émulsion, le diiode passe dans le cyclohexane, la pression monte.
    if (!e.bouchon) return dire("Bouchez l'ampoule avant d'agiter !");
    if (e.aq + e.org === 0) return;
    e.agitee++; e.melange = 1; e.pression = true;
    if (!e.miscible && e.org > 0) { e.I2_org = Math.min(1, e.I2_org + 0.3); e.I2_aq = Math.max(0.03, 1 - e.I2_org * 0.97); }
  }

  function couler(e, dire) {
    // Robinet ouvert, ampoule sur l'anneau : la phase inférieure s'écoule (1 mL par pas) dans le bécher.
    if (!e.robinet || e.angle || e.aq + e.org === 0 || e.melange > 0.1) return;
    if (e.bouchon) return dire("Ça ne coule plus : ôtez le bouchon.");
    if (e.aq > 0) { const v = Math.min(1, e.aq); e.aq -= v; e.recu_aq += v; }
    else { const v = Math.min(1, e.org); e.org -= v; e.recu_org += v; }
  }

  function sources(g, e, dire, maj) {
    // Bécher d'eau iodée et flacons de solvant : on les porte au-dessus de l'ampoule pour verser.
    const iodee = L.melange({ eau_iodee: 40 });
    const items = [["eau_iodee", 300, (s) => L.verrerie.becher(s, 300, 562, iodee, "eau iodée", { l: 50, h: 62, capacite: 50 })],
      ["cyclohexane", 650, (s) => L.verrerie.flacon(s, 650, 562, "Cyclo-\nhexane", { verre: "#d7e2e6", bouchon: "capsule" })],
      ["ethanol", 715, (s) => L.verrerie.flacon(s, 715, 562, "Éthanol", { verre: "#d7e2e6", bouchon: "capsule" })]];
    for (const [quoi, x, dessin] of items) {
      const s = L.svg("g", { class: `source source-${quoi}`, role: "button" }, g);
      dessin(s);
      L.glissable(s, { debut: () => ({ x: 0, y: 0 }), deplacer: (p) => L.placer(s, p.x, p.y), lacher: (p) => {
        L.placer(s, 0, 0);
        if (Math.hypot(x + p.x - A.x, 500 + p.y - A.y) > 60) return;
        if (quoi === "eau_iodee" && iodee.volumes.eau_iodee < 20) return dire("Le bécher d'eau iodée est vide.");
        if (verser(e, quoi, dire) && quoi === "eau_iodee") { iodee.volumes.eau_iodee -= 20; dessin(s); }
        maj();
      } });
    }
  }

  function decor(g) {
    // Affiche des données, support avec anneau, bidon de récupération des solvants.
    L.affiche_solvants(g, 270, 30);
    L.tige(g, "M450 556 V280", 5); L.svg("rect", { x: 400, y: 552, width: 110, height: 10, rx: 2, fill: "#3a3f44" }, g);
    L.tige(g, `M450 378 H${A.x - 24}`, 3); L.svg("ellipse", { cx: A.x, cy: 378, rx: 24, ry: 5, fill: "none", stroke: "#5d646a", "stroke-width": 3 }, g);
    L.svg("rect", { x: BIDON.x - 26, y: BIDON.bas - 66, width: 52, height: 66, rx: 6, fill: "#e7c22a", stroke: "#a3850f" }, g);
    L.texte(g, BIDON.x, BIDON.bas - 40, "Récupération", { "font-size": 6.5, "font-weight": 700, fill: "#3b2f00" });
    L.texte(g, BIDON.x, BIDON.bas - 31, "des solvants", { "font-size": 6.5, "font-weight": 700, fill: "#3b2f00" });
  }

  function recu(e) {
    // Contenu du bécher récepteur : phase aqueuse pâle, et phase organique violette si l'on a trop ouvert.
    const C = L.ampoule.COULEURS, V = e.recu_aq + e.recu_org, k = V ? e.recu_org / V : 0;
    const aq = C.aq_pale.map((v, i) => v + (C.iode[i] - v) * e.I2_aq), org = C.solvant.map((v, i) => v + (C.org[i] - v) * e.I2_org);
    return { volume: () => V, aspect: () => ({ rgb: aq.map((v, i) => v + (org[i] - v) * k), alpha: 0.75 }) };
  }

  function zone(g, x, y, l, h, toucher) {
    // Petite zone invisible que l'on touche (robinet, bouchon de l'ampoule).
    const z = L.svg("rect", { x, y, width: l, height: h, fill: "#000", opacity: 0 }, g);
    L.glissable(z, { soulever: false, debut: () => ({ x: 0, y: 0 }), toucher });
  }

  function gestes_ampoule(g_amp, e, dire, maj) {
    // Agiter (aller-retour de l'ampoule tenue), la vider dans le bidon ; elle revient toujours sur l'anneau.
    let sens = 0, avant = null;
    L.glissable(g_amp, {
      debut: () => ({ x: 0, y: 0 }),
      deplacer: (p) => { L.placer(g_amp, p.x, p.y); const s = Math.sign(p.x - (avant ?? p.x)); if (s && s !== sens) { sens = s; agiter(e, dire); maj(); } avant = p.x; },
      lacher: (p) => {
        L.placer(g_amp, 0, 0); avant = null;
        g_amp.parentNode.insertBefore(g_amp, g_amp.parentNode.querySelector(".bouchon"));
        if (Math.hypot(A.x + p.x - BIDON.x, A.y + 100 + p.y - (BIDON.bas - 60)) < 60) { Object.assign(e, etat_initial()); dire("Ampoule vidée dans le bidon de récupération."); }
        maj();
      },
    });
  }

  function degazer(e, dire, maj) {
    // L'ampoule bouchée est retournée, on ouvre le robinet un instant : le gaz s'échappe.
    e.angle = 180; maj();
    setTimeout(() => { Object.assign(e, { angle: 0, pression: false, degaze: true }); dire("Pschitt : le gaz s'échappe par le robinet."); maj(); }, 700);
  }

  L.poste_solvant = function (g) {
    // Construit la paillasse, les gestes et l'évolution (décantation, écoulement) toutes les 0,2 s.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230), e = etat_initial(), calque = L.svg("g", { "pointer-events": "none" }, g);
    decor(g);
    const g_rec = L.svg("g", {}, g), g_amp = L.svg("g", { class: "ampoule", role: "button", "aria-label": "Ampoule à décanter" }, g), g_bouchon = L.svg("g", { class: "bouchon", role: "button" }, g);
    const dire = (t) => message(calque, t);
    const maj = () => {
      L.ampoule.dessiner(g_amp, A.x, A.y, e);
      L.verrerie.becher(g_rec, REC.x, REC.bas, recu(e), "", { l: 50, h: 62, capacite: 100 });
      g_bouchon.replaceChildren(); if (!e.bouchon) L.svg("path", { d: "M594 552 H606 L605 564 H595 Z", fill: "#2f6fb8", stroke: "#1d3f6b" }, g_bouchon);
      L.missions.noter("ampoule", { ...e, decante: e.melange < 0.05, recu_aq: Math.round(e.recu_aq), recu_org: Math.round(e.recu_org) });
    };
    sources(g, e, dire, maj);
    gestes_ampoule(g_amp, e, dire, maj);
    L.glissable(g_bouchon, { soulever: false, debut: () => ({ x: 0, y: 0 }), toucher: () => { e.bouchon = true; dire(""); maj(); } });
    zone(g, A.x - 12, A.y - 12, 24, 16, () => { if (!e.bouchon) return; if (e.pression) return dire("Dégazez d'abord (projections) !"); e.bouchon = false; maj(); });
    zone(g, A.x - 14, BAS + 2, 28, 18, () => { if (e.pression && e.bouchon) return degazer(e, dire, maj); e.robinet = !e.robinet; maj(); });
    setInterval(() => { if (e.melange > 0 && !e.angle) e.melange = Math.max(0, e.melange - 0.04); couler(e, dire); maj(); }, 200);
    maj();
    return { pense_bete };
  };
})(window.Labo);
