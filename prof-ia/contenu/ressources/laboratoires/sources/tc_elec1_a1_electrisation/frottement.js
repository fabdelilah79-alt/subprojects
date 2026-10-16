/*
Rôle : baguettes (PVC, verre) et chiffons (laine, soie) : l'élève fait glisser une baguette plusieurs fois sur un chiffon ;
       le frottement fait passer des électrons, et la baguette se charge (PVC frotté avec la laine : négatif ; verre frotté
       avec la soie : positif). La charge augmente avec le frottement, jusqu'à une limite.
Reçoit : le groupe SVG ; la liste des baguettes et des chiffons (positions de repos) ; les gestes de l'élève.
Produit : Labo.frottement(groupe, { baguettes, chiffons, sur_deplacement }) -> { baguettes (état : q en nC, pos, matiere) } ;
          chaque chiffon reçoit la charge opposée (c.q) ;
          fait noté « charges » = { <id de la baguette> : q (nC) } à chaque lâcher.
Utilisé par : poste_papier.js, poste_etrier.js.
*/
(function (L) {
  const LONGUEUR = 200, Q_MAX = 5, GAIN = 0.012;
  const SIGNE = { pvc: { laine: -1, soie: -0.6 }, verre: { soie: 1, laine: 0.6 } };

  function chiffon(g, c) {
    // Chiffon posé à plat : laine rouge tricotée, ou soie crème brillante, avec son nom.
    const motif = c.matiere === "laine" ? "#b23a2e" : "#efe4c8";
    L.svg("path", { d: `M${c.x} ${c.y} h${c.l} l-12 ${c.h} h${-c.l} Z`, fill: motif, stroke: "#00000040" }, g);
    for (let i = 1; i < 6; i++) L.svg("path", { d: `M${c.x + (i * c.l) / 6} ${c.y} l-12 ${c.h}`, stroke: c.matiere === "laine" ? "#8e2b22" : "#ffffff", "stroke-width": 1, opacity: 0.6 }, g);
    L.texte(g, c.x + c.l / 2 - 6, c.y + c.h + 13, c.matiere, { "font-size": 12, "font-weight": 700, fill: "#e8e2cc" });
  }

  function dessiner_baguette(g, b) {
    // Baguette tenue horizontalement : cylindre gris (PVC) ou de verre ; poignée (le bout tenu) à droite.
    g.replaceChildren();
    const { x, y } = b.pos, verre = b.matiere === "verre";
    L.svg("rect", { x: x - LONGUEUR / 2, y: y - 16, width: LONGUEUR, height: 32, fill: "#000", opacity: 0.001 }, g);
    L.svg("rect", { x: x - LONGUEUR / 2, y: y - 6, width: LONGUEUR, height: 12, rx: 6, fill: verre ? "url(#verre)" : "url(#plastique-pvc)", stroke: verre ? "#9fb6be" : "#3b3f44", "fill-opacity": verre ? 0.8 : 1 }, g);
    L.svg("rect", { x: x - LONGUEUR / 2 + 6, y: y - 4, width: LONGUEUR - 12, height: 3, rx: 1.5, fill: "#fff", opacity: verre ? 0.6 : 0.25 }, g);
    L.texte(g, x + LONGUEUR / 2 - 30, y + 16, verre ? "verre" : "PVC", { "font-size": 9, "font-weight": 700, fill: "#f1ead2" });
  }

  function frotter(b, chiffons, dx) {
    // La baguette glisse sur un chiffon : sa charge augmente avec la distance frottée (signe selon les matières).
    const c = chiffons.find((k) => b.pos.x + LONGUEUR / 2 > k.x && b.pos.x - LONGUEUR / 2 < k.x + k.l && b.pos.y > k.y - 14 && b.pos.y < k.y + k.h + 6);
    if (!c) return;
    const s = SIGNE[b.matiere][c.matiere], avant = b.q;
    b.q = Math.max(-Q_MAX, Math.min(Q_MAX, b.q + s * GAIN * Math.abs(dx) * (1 - Math.abs(b.q) / Q_MAX)));
    if (Math.abs(b.q) > Q_MAX * 0.98) b.q = Math.sign(b.q) * Q_MAX;
    c.q = (c.q || 0) - (b.q - avant);
  }

  function reposer(b) {
    // Lâchée (sauf sur l'étrier), la baguette est reposée à sa place sur la paillasse ; elle garde sa charge.
    if (b.pose_sur_etrier) return;
    b.pos = { ...b.repos };
    dessiner_baguette(b.g, b);
  }

  L.frottement = function (g, { baguettes, chiffons, sur_deplacement = () => {} }) {
    // Dessine les chiffons et les baguettes ; une baguette déplacée sur un chiffon s'électrise.
    if (!g.ownerSVGElement.querySelector("#plastique-pvc")) {
      const d = L.svg("linearGradient", { id: "plastique-pvc", x1: 0, y1: 0, x2: 0, y2: 1 }, g.ownerSVGElement.querySelector("defs"));
      for (const [o, c] of [[0, "#8d969c"], [0.4, "#5c656b"], [1, "#2e3437"]]) L.svg("stop", { offset: o, "stop-color": c }, d);
    }
    for (const c of chiffons) chiffon(g, c);
    const etat = baguettes.map((b) => ({ ...b, q: 0, pos: { ...b.repos }, g: L.svg("g", { class: `baguette baguette-${b.id}`, role: "button", "aria-label": `Baguette de ${b.matiere}` }, g) }));
    for (const b of etat) {
      dessiner_baguette(b.g, b);
      L.glissable(b.g, {
        debut: () => (b.pose_sur_etrier ? null : { ...b.pos }),
        deplacer: (p) => { frotter(b, chiffons, p.x - b.pos.x); b.pos = p; dessiner_baguette(b.g, b); sur_deplacement(b); },
        lacher: () => { L.missions.noter("charges", Object.fromEntries(etat.map((x) => [x.id, Math.round(x.q * 100) / 100]))); sur_deplacement(b, true); reposer(b); },
      });
    }
    return { baguettes: etat, redessiner: (b) => dessiner_baguette(b.g, b), LONGUEUR };
  };
})(window.Labo);
