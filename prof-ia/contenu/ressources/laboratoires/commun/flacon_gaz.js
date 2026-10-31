/*
Rôle : flacon de 600 mL rempli d'un gaz (dioxygène incolore ou dichlore jaune-vert), fermé par une plaque de verre (un
       toucher sur le haut du flacon l'ôte ou la remet ; ôtée, elle est posée devant lui). Le flacon garde la trace de ce qui
       s'y passe : gaz restant, produits formés, fumée blanche qui retombe peu à peu en dépôt, grains d'oxyde au fond.
       Ouvert, il perd lentement son gaz (sauf si le disque d'un têt le ferme).
Reçoit : le contexte de la paillasse et { id, x, sol, e, gaz (« O2 » ou « Cl2 »), m0 (g de gaz), etiquette, contenu, dire }.
Produit : Labo.flacon_gaz(ctx, reglage) -> r (récipient) avec r.atmosphere = { gaz, m, m0, produits { nom : g }, fumee (0 à 1) }.
Utilisé par : cuillere_combustion.js et les simulations de chimie (combustions).
*/
(function (L) {
  const TEINTE = { O2: null, Cl2: [176, 198, 58] }, FUITE = { O2: 200, Cl2: 600 };
  const hasard = (k) => { const x = Math.sin(k * 91.7 + 17.3) * 43758.5453; return x - Math.floor(x); };

  function atmosphere(l, r) {
    // Gaz coloré, fumée blanche, dépôts (repère du flacon, mm).
    const a = r.atmosphere, pr = r.pr, d = "M" + pr.interieur.map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" L") + " Z";
    if (TEINTE[a.gaz] && a.m > 0) L.svg("path", { d, fill: L.rgb(TEINTE[a.gaz]), opacity: 0.28 * Math.min(1, a.m / a.m0), "pointer-events": "none" }, l);
    if (a.fumee > 0.01) L.svg("path", { d, fill: "#f4f4f0", opacity: Math.min(0.85, a.fumee), "pointer-events": "none" }, l);
    const R = pr.r(pr.h0 + 2) - 2, N = Math.min(60, Math.round(400 * (a.produits.Fe3O4 || 0)));
    for (let i = 0; i < N; i++) L.svg("circle", { cx: (hasard(i) * 2 - 1) * R, cy: -pr.h0 - 1.2 - hasard(i + 0.4) * 1.5, r: 0.7 + hasard(i + 0.7) * 0.9, fill: "#1d1d1f" }, l);
    const sel = Math.min(1, (a.depot || 0) / 0.1);
    if (sel > 0.02) L.svg("path", { d: `M${-R} ${-pr.h0 - 1} Q0 ${-pr.h0 - 4} ${R} ${-pr.h0 - 1} Z`, fill: "#fbfbf6", opacity: 0.9 * sel }, l);
  }

  L.flacon_gaz = function (ctx, { id, x, sol, e = 1.6, gaz, m0, etiquette, contenu = {}, dire = () => {} }) {
    // Flacon, plaque de verre (toucher le haut), fuite du gaz, fumée qui retombe.
    const r = L.recipient(ctx, { id, profil: "flacon_gaz", x, y: sol, e, bouchon: true, etiquette, contenu });
    r.atmosphere = { gaz, m: m0, m0, produits: {}, fumee: 0, depot: 0 };
    r.dessiner = () => atmosphere(L.dessiner_verrerie(r.g, r.pr, r.pose, r.etat()), r);
    r.g.setAttribute("pointer-events", "none");
    const posee = L.svg("path", { d: `M${x - 56} ${sol + 8} l8 -5 h96 l-8 5 Z`, fill: "rgba(200,230,236,0.8)", stroke: "rgba(110,150,160,0.9)", "stroke-width": 0.6, "pointer-events": "none" }, ctx.devant);
    posee.style.display = "none";
    const zone = L.svg("rect", { x: x - 55, y: sol - r.pr.H * e - 22, width: 110, height: 34, fill: "#000", opacity: 0, class: `plaque-${id}`, role: "button", "aria-label": "Plaque de verre" }, ctx.haut);
    L.glissable(zone, { soulever: false, debut: () => ({ x: 0, y: 0 }), toucher: () => {
      if (r.ferme) return dire("Le disque du têt ferme déjà le flacon.");
      r.bouchon = !r.bouchon; r.sig = null; posee.style.display = r.bouchon ? "none" : ""; dire(""); ctx.signaler?.();
    } });
    let avant = "";
    ctx.ecoulement.sur_pas((dt) => {
      // Fuite par l'ouverture ; la fumée retombe (dépôt blanc) en une trentaine de secondes.
      const a = r.atmosphere;
      zone.style.display = r.ferme ? "none" : "";
      if (!r.bouchon && !r.ferme) a.m *= Math.exp(-dt / FUITE[gaz]);
      if (a.fumee > 0.005) { const f = a.fumee * (1 - Math.exp(-dt / 25)); a.fumee -= f; a.depot += f * 0.05; }
      const cle = `${a.m.toFixed(3)} ${a.fumee.toFixed(2)} ${JSON.stringify(a.produits)}`;
      if (cle !== avant) { avant = cle; r.sig = null; }
    });
    return r;
  };
})(window.Labo);
