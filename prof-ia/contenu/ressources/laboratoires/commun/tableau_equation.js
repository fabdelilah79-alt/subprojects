/*
Rôle : tableau magnétique « écrire et ajuster une équation » : une phrase décrit la transformation ; on glisse les aimants
       des espèces (il y a aussi des ions spectateurs et des intrus) dans la case des réactifs ou des produits, puis on
       règle chaque coefficient (flèches ▲ ▼) ; le bilan des éléments et des charges de chaque côté s'affiche en direct.
       Un aimant glissé hors des cases retourne dans la réserve. Des boutons choisissent l'équation.
Reçoit : le groupe SVG, { especes { id : { f, z } }, equations [{ id, titre, texte, cartes [ids], reactifs [ids], produits [ids] }], fait }.
Produit : Labo.tableau_equation(g, reglage) -> { choisir(id) } ; fait « <fait> » = { courante, <id> : { juste, erreur, reactifs, produits } }.
Utilisé par : les simulations de chimie (transformation chimique).
*/
(function (L) {
  const Z = { reactifs: { x: 290, l: 330 }, produits: { x: 670, l: 315 } }, YZ = 150, HZ = 84, YR = 318, W = 78, H = 34;

  function cadre(g) {
    // Tableau blanc à cadre aluminium, cases des réactifs et des produits, flèche, réserve.
    L.svg("rect", { x: 266, y: 30, width: 740, height: 392, rx: 3, fill: "url(#metal-h)", filter: "url(#ombre)" }, g);
    L.svg("rect", { x: 272, y: 36, width: 728, height: 380, fill: "#fbfcfd" }, g);
    for (const [k, z] of Object.entries(Z)) { L.svg("rect", { x: z.x, y: YZ, width: z.l, height: HZ, rx: 6, fill: "#f1f5f8", stroke: "#b9c4cc", "stroke-dasharray": "5 4" }, g); L.texte(g, z.x + z.l / 2, YZ + HZ + 12, k === "reactifs" ? "Réactifs" : "Produits", { "font-size": 9, "font-weight": 700, fill: "#5a6670" }); }
    L.svg("path", { d: `M626 ${YZ + 42} H662 M652 ${YZ + 35} L663 ${YZ + 42} L652 ${YZ + 49}`, stroke: "#1f2a44", "stroke-width": 2.6, fill: "none" }, g);
    L.svg("line", { x1: 290, y1: YR - 28, x2: 985, y2: YR - 28, stroke: "#d6dde2" }, g);
    L.texte(g, 330, YR - 34, "Réserve", { "font-size": 8, "font-weight": 700, fill: "#8a96a0" });
  }

  function aimant(g, s) {
    // Aimant d'une espèce : coefficient (avec ses flèches, visibles quand il est placé) et formule.
    const a = L.svg("g", { class: "aimant-espece", role: "button", "aria-label": L.EQUATION.ecrire(s.f, s.z) }, g);
    L.svg("rect", { x: -W / 2, y: -H / 2, width: W, height: H, rx: 5, fill: "#ffffff", stroke: "#33414b", "stroke-width": 1.2 }, a);
    L.svg("rect", { x: -W / 2, y: -H / 2, width: 6, height: H, rx: 3, fill: s.z > 0 ? "#d0312d" : s.z < 0 ? "#2f5fc4" : "#2f8a3c" }, a);
    L.texte(a, 4, 5.5, L.EQUATION.ecrire(s.f, s.z), { "font-size": 15, "font-weight": 700, fill: "#1f2a44" });
    const coef = L.svg("g", { class: "coefficient" }, a);
    return { a, coef };
  }

  L.tableau_equation = function (g, { especes, equations, fait }) {
    // Construit le tableau ; l'état de chaque équation est gardé ; on n'affiche que l'équation choisie.
    const fond = L.svg("g", {}, g), plan = L.svg("g", {}, g), bilan_g = L.svg("g", { "pointer-events": "none" }, g);
    cadre(fond);
    const phrase = L.svg("g", { "pointer-events": "none" }, fond), etat = {}, resultats = {};
    equations.forEach((q) => { etat[q.id] = { reactifs: [], produits: [], coef: {} }; });
    let q = equations[0], marquer = null;
    const noter = () => L.missions.noter(fait, { courante: q.id, ...resultats });
    const proposee = (e) => ({ reactifs: Object.fromEntries(e.reactifs.map((id) => [id, e.coef[id]])), produits: Object.fromEntries(e.produits.map((id) => [id, e.coef[id]])) });
    function evaluer(eq) {
      // Vérifie l'équation proposée et garde le résultat (pour les missions).
      const e = etat[eq.id], p = proposee(e), v = L.EQUATION.verifier(p, eq, especes);
      resultats[eq.id] = { juste: v.juste, erreur: e.reactifs.length + e.produits.length ? v.erreur : "", ...p };
      return v;
    }
    function bilan(v) {
      // Bilan des éléments et des charges, et message.
      bilan_g.replaceChildren();
      const b = v.bilan, el = [...new Set([...Object.keys(b.reactifs.atomes), ...Object.keys(b.produits.atomes)])];
      const cases = [...el.map((e) => [e, b.reactifs.atomes[e] || 0, b.produits.atomes[e] || 0]), ["charge", b.reactifs.charge, b.produits.charge]];
      const signe = (n, c) => (c === "charge" ? (n > 0 ? `+${n}` : String(n)) : String(n));
      L.texte(bilan_g, 330, 372, "Bilan", { "font-size": 9, "font-weight": 700, fill: "#5a6670" });
      cases.forEach(([e, r, p], i) => {
        const x = 400 + i * 88, ok = r === p;
        L.svg("rect", { x: x - 40, y: 356, width: 80, height: 36, rx: 4, fill: ok ? "#e6f4e8" : "#fbe7e5", stroke: ok ? "#5aa66a" : "#d0675e" }, bilan_g);
        L.texte(bilan_g, x, 369, e === "charge" ? "charge" : e, { "font-size": 9, "font-weight": 700, fill: "#33414b" });
        L.texte(bilan_g, x, 385, `${signe(r, e)}  |  ${signe(p, e)}`, { "font-size": 10, fill: "#1f2a44" });
      });
      const e = etat[q.id], vide = !e.reactifs.length && !e.produits.length;
      L.texte(bilan_g, 636, 262, vide ? "Glissez les aimants dans les cases." : v.juste ? "Équation juste et ajustée." : v.erreur, { "font-size": 9.5, "font-weight": 700, fill: v.juste ? "#2f7a3c" : "#8a3b12" });
    }
    function afficher() {
      // Redessine la phrase, les aimants (dans les cases ou dans la réserve) et le bilan.
      plan.replaceChildren(); phrase.replaceChildren();
      q.texte.split("\n").forEach((t, i) => L.texte(phrase, 636, 108 + i * 15, t, { "font-size": 10, fill: "#222" }));
      const e = etat[q.id];
      for (const cote of ["reactifs", "produits"]) e[cote].forEach((id, i) => { const n = e[cote].length, pas = Z[cote].l / n, x = Z[cote].x + pas * (i + 0.5) + 10; poser_aimant(id, { x, y: YZ + HZ / 2 }, cote); if (i) L.texte(plan, x - pas / 2 - 4, YZ + HZ / 2 + 6, "+", { "font-size": 18, "font-weight": 700, fill: "#1f2a44" }); });
      q.cartes.forEach((id, i) => { if (!e.reactifs.includes(id) && !e.produits.includes(id)) poser_aimant(id, { x: 340 + i * 110, y: YR }, null); });
      bilan(evaluer(q)); noter(); marquer?.();
    }
    function poser_aimant(id, p, cote) {
      // Un aimant à sa place ; glissé, il change de case ; placé, son coefficient se règle avec ▲ ▼.
      const { a, coef } = aimant(plan, especes[id]), e = etat[q.id];
      L.placer(a, p.x, p.y);
      if (cote) {
        const c = e.coef[id];
        L.texte(coef, -W / 2 - 14, 7, String(c), { "font-size": 20, "font-weight": 700, fill: c > 1 ? "#1f2a44" : "#b0b8be" });
        [[-1, "▲", 1], [1, "▼", -1]].forEach(([s, t, d]) => {
          const b = L.svg("g", { class: d > 0 ? "plus" : "moins", role: "button", "aria-label": d > 0 ? "Augmenter" : "Diminuer" }, coef);
          L.svg("rect", { x: -W / 2 - 25, y: s < 0 ? -H / 2 - 18 : H / 2 - 1, width: 22, height: 19, rx: 3, fill: "#e9eef2", stroke: "#8a96a0" }, b);
          L.texte(b, -W / 2 - 14, s < 0 ? -H / 2 - 4 : H / 2 + 13, t, { "font-size": 10, fill: "#23315a" });
          L.glissable(b, { soulever: false, debut: () => ({ x: 0, y: 0 }), toucher: () => { e.coef[id] = Math.max(1, Math.min(9, c + d)); afficher(); } });
        });
      }
      L.glissable(a, { debut: () => ({ ...p }), deplacer: (r) => L.placer(a, r.x, r.y), toucher: () => {},
        lacher: (r) => {
          const vers = Object.keys(Z).find((k) => r.x > Z[k].x - 20 && r.x < Z[k].x + Z[k].l + 20 && r.y > YZ - 30 && r.y < YZ + HZ + 30);
          for (const k of Object.keys(Z)) e[k] = e[k].filter((x) => x !== id);
          if (vers) { e[vers].push(id); e.coef[id] = e.coef[id] || 1; } else delete e.coef[id];
          afficher();
        } });
    }
    const boutons = equations.map((eq, k) => L.bouton_texte(fond, 330 + k * 94, 70, eq.titre, () => { q = eq; afficher(); }));
    marquer = () => boutons.forEach((b, k) => { const r = b.querySelector("rect"); r.setAttribute("fill", equations[k] === q ? "#cfe8d5" : resultats[equations[k].id]?.juste ? "#eef7f0" : "#e9eef2"); r.setAttribute("stroke", equations[k] === q ? "#2f7a3c" : "#8a96a0"); });
    equations.forEach(evaluer);
    afficher();
    return { choisir: (id) => { q = equations.find((x) => x.id === id) || q; afficher(); } };
  };
})(window.Labo);
