/*
Rôle : paillasse « suivi par la mesure d'une pression » : erlenmeyer de 250 mL contenant 50,0 mL d'acide chlorhydrique à
       0,50 mol/L ; ruban de magnésium de 0,024 g sur un verre de montre ; bouchon relié au pressiomètre (un toucher le pose
       sur le col ou le retire) ; horloge murale (t = 0 quand le ruban touche l'acide) ; feuille de relevés au mur (« Relever »
       y écrit t et P) ; lunettes et gants. Mg + 2 H⁺ → Mg²⁺ + H₂ après 3 s (couche d'oxyde) ; vitesse k·n(Mg)·[H⁺] (le ruban,
       très mince, a une surface proportionnelle à sa masse ; k = 0,055 L·mol⁻¹·s⁻¹ : t1/2 ≈ 25 s) ; le dihydrogène reste
       dans l'erlenmeyer s'il est bouché : P = P0 + n(H₂)·R·T / V, V = 225 mL de gaz, T = 293 K, P0 = 1 013 hPa.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_pression(g) -> { pense_bete } ; fait « pression » = { epi, ferme, dans (ruban dans l'acide), perdu (mmol de H₂
          échappé), t (s), P (hPa), fini, releves [[t (s), P (hPa)]] }.
Utilisé par : simulation.js.
*/
(function (L) {
  const SOL = 576, E = 1.6, X = 520, P0 = 1013, HPA_MMOL = (8.314 * 293.15) / 225e-6 / 1e5, M_MG = 0.024, K = 0.055;
  L.LIQUIDES.acide_chlorhydrique ??= { nom: "acide chlorhydrique", d: 1.0, rgb: [236, 243, 246], alpha: 0.3, classe: "aqueuse", pH: 0.3 };
  const col = () => ({ x: X, y: SOL - 118 * E }), POSE = { x: 300, y: SOL - 9 };

  function ruban(g, p, reste) {
    // Ruban de magnésium (gris brillant) : 23 mm quand il est entier, plus court à mesure qu'il réagit.
    const l = Math.max(2, 23 * E * reste);
    L.svg("rect", { x: p.x - l / 2, y: p.y - 2, width: l, height: 3.5, rx: 1, fill: "url(#metal-h)", stroke: "#666", "stroke-width": 0.5 }, g);
  }

  function bouchon(g, ferme, embout) {
    // Bouchon de caoutchouc (sur le col ou posé sur la paillasse) et tuyau souple jusqu'à l'embout du pressiomètre.
    g.replaceChildren();
    const b = ferme ? col() : { x: 620, y: SOL - 10 };
    L.svg("path", { d: `M${b.x} ${b.y - 12} C${b.x} ${b.y - 70} ${embout.x} ${embout.y - 60} ${embout.x} ${embout.y}`, fill: "none", stroke: "#cfd8d4", "stroke-width": 6 }, g);
    L.svg("path", { d: `M${b.x - 18} ${b.y + 10} L${b.x - 21} ${b.y - 12} H${b.x + 21} L${b.x + 18} ${b.y + 10} Z`, fill: "#7a3b2a", stroke: "#4a2016" }, g);
    L.svg("rect", { x: b.x - 26, y: b.y - 20, width: 52, height: 36, fill: "#fff", opacity: 0.01 }, g);
  }

  function bulles(g, e, t) {
    // Bulles de dihydrogène qui montent du ruban pendant la réaction.
    g.replaceChildren();
    if (!e.dans || e.attente > 0 || e.v < 2e-4) return;
    for (let k = 0; k < Math.min(16, 3 + e.v * 400); k++) { const y = SOL - 6 - ((t * 60 + k * 23) % 40); L.svg("circle", { cx: X - 10 + ((k * 7) % 20), cy: y, r: 1.6, fill: "none", stroke: "#fff", "stroke-width": 0.7 }, g); }
  }

  function pas(e, dt) {
    // Un pas de la réaction (mmol) ; le gaz s'accumule si l'erlenmeyer est bouché, sinon il s'échappe.
    if (!e.dans || e.fini) return;
    if (e.attente > 0) { e.attente -= dt; return; }
    const dn = Math.min(e.nMg, K * e.nMg * (e.nH / 50) * dt);
    e.nMg -= dn; e.nH -= 2 * dn; e.v = dn / dt;
    if (e.ferme) e.gaz += dn; else e.perdu += dn;
    if (e.nMg < 0.01 * e.n0) { e.fini = true; e.v = 0; }
  }

  L.poste_pression = function (g) {
    // Matériel, gestes, réaction pas à pas, relevés.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230), ctx = L.paillasse_chimie(g);
    L.ecoulement(ctx, { sol: SOL, e: E });
    const epi = L.equipement(g, { x: 300, y: 70 }), afficher = L.horloge_murale(g, { x: 800, y: 52, legende: "HORLOGE — depuis le contact" });
    const feuille = L.feuille_releves(g, { x: 580, y: 46, titre: "Relevés", colonnes: ["t (s)", "P (hPa)"] });
    const capteur = L.pressiometre(ctx.fond, { x: 700, y: 470 });
    L.recipient(ctx, { id: "erlen", profil: "erlenmeyer_250", x: X, y: SOL, e: E, contenu: { acide_chlorhydrique: 50 }, etiquette: "HCl 0,50 mol/L" }).g.setAttribute("pointer-events", "none");
    L.verre_montre(ctx, { id: "vm", x: POSE.x, sol: SOL, e: E });
    const e = { ferme: false, dans: false, nMg: (M_MG / 24.3) * 1000, nH: 25, gaz: 0, perdu: 0, attente: 3, v: 0, fini: false, t0: null, releves: [], p: null };
    const gb = L.svg("g", { class: "bouchon", role: "button", "aria-label": "Bouchon relié au pressiomètre" }, ctx.haut), gu = L.svg("g", { "pointer-events": "none" }, ctx.haut);
    const gr = L.svg("g", { class: "ruban", role: "button", "aria-label": "Ruban de magnésium" }, ctx.haut), gm = L.svg("g", { "pointer-events": "none" }, ctx.objets);
    const n0 = (e.n0 = e.nMg), dessiner = () => { bouchon(gb, e.ferme, capteur.embout); gr.replaceChildren(); gm.replaceChildren(); if (!e.dans) { ruban(gr, e.p || POSE, 1); if (!e.p) L.texte(gr, POSE.x, SOL - 30, "Mg : 0,024 g", { "font-size": 7.5, "font-weight": 700, fill: "#e8e2cc" }); } else if (e.nMg > 2e-3) ruban(gm, { x: X, y: SOL - 6 }, Math.max(0.08, e.nMg / n0)); };
    L.glissable(gr, { soulever: false, debut: () => (e.dans ? null : { ...(e.p || POSE) }), deplacer: (p) => { e.p = p; dessiner(); },
      lacher: () => { const c = col(); if (epi.protege() && !e.ferme && Math.abs(e.p.x - c.x) < 25 && e.p.y < c.y + 30 && e.p.y > c.y - 120) { e.dans = true; e.t0 = performance.now() / 1000; } e.p = null; dessiner(); } });
    L.glissable(gb, { soulever: false, debut: () => ({ x: 0, y: 0 }), toucher: () => { e.ferme = !e.ferme; if (!e.ferme) { e.perdu += e.gaz; e.gaz = 0; } dessiner(); } });
    const t = () => (e.t0 === null ? null : performance.now() / 1000 - e.t0), P = () => Math.round(P0 + (e.ferme ? e.gaz * HPA_MMOL : 0));
    L.bouton_texte(g, 140, 250, "Relever", () => { if (t() === null) return; const r = [Math.round(t()), P()]; if (feuille.ajouter([String(r[0]), String(r[1])])) e.releves.push(r); });
    L.bouton_texte(g, 140, 285, "Nouvel essai", () => { Object.assign(e, { ferme: false, dans: false, nMg: n0, nH: 25, gaz: 0, perdu: 0, attente: 3, v: 0, fini: false, t0: null, releves: [] }); feuille.vider(); dessiner(); });
    let horloge = 0, n = 0;
    setInterval(() => {
      horloge += 0.1; pas(e, 0.1);
      capteur.afficher(P()); afficher(t()); bulles(gu, e, horloge); if (e.dans && n++ % 5 === 0) dessiner();
      L.missions.noter("pression", { epi: epi.protege(), ferme: e.ferme, dans: e.dans, perdu: Math.round(e.perdu * 1000) / 1000, t: t() === null ? null : Math.round(t()), P: P(), fini: e.fini, releves: e.releves.map((r) => [...r]) });
    }, 100);
    dessiner();
    return { pense_bete };
  };
})(window.Labo);
