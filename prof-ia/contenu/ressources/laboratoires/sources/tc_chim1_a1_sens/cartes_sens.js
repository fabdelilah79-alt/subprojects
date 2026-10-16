/*
Rôle : les cinq cartes des sens (vue, odorat, toucher, ouïe, goût) et la loupe : on pose une carte sur un objet et une
       bulle dit ce que l'on perçoit ; la carte du goût est refusée (on ne goûte jamais au laboratoire) ; la loupe montre
       une vue agrandie. Chaque observation est notée.
Reçoit : le groupe SVG de la paillasse et { cibles : [{ nom, zone() -> { x, y, r }, obs : { sens : texte }, loupe, action }],
         x (début de la rangée de cartes), y, loupe : { x, y } (repos), fait (nom du fait noté) }.
Produit : Labo.cartes_sens(g, reglage) -> { vus : { objet : [sens] } } ; fait « <fait> » = { objet : [sens ou « loupe »] }.
Utilisé par : postes_sens.js.
*/
(function (L) {
  const SENS = [["vue", "Vue"], ["odorat", "Odorat"], ["toucher", "Toucher"], ["ouie", "Ouïe"], ["gout", "Goût"]];
  const ICONES = {
    vue: "M-11 0 Q0 -9 11 0 Q0 9 -11 0 Z M-3.5 0 a3.5 3.5 0 1 0 7 0 a3.5 3.5 0 1 0 -7 0",
    odorat: "M-2 -10 Q-3 0 -7 5 Q-4 8 0 6 Q4 8 7 5 Q3 0 2 -10",
    toucher: "M-7 9 V-2 M-7 -2 V-8 M-3 -2 V-11 M1 -2 V-10 M5 -1 V-7 M-7 9 H5 Q9 4 9 -3 M-7 -2 H5",
    ouie: "M-4 9 Q2 9 3 2 Q8 -2 6 -7 Q3 -12 -3 -10 Q-8 -8 -7 -2 M-2 -4 Q1 -7 3 -4 Q3 -1 0 1",
    gout: "M-10 0 Q-5 -6 0 -3 Q5 -6 10 0 Q5 8 0 6 Q-5 8 -10 0 Z M-10 0 H10",
  };

  function carte(g, sens, texte) {
    // Carte en carton : pictogramme et nom du sens ; la carte du goût est barrée de rouge.
    L.svg("rect", { x: -26, y: -19, width: 52, height: 38, rx: 3, fill: "#fdfbf2", stroke: "#cbbf95" }, g);
    L.svg("path", { d: ICONES[sens], transform: "translate(0 -5)", fill: "none", stroke: "#23315a", "stroke-width": 1.5, "stroke-linejoin": "round" }, g);
    if (sens === "gout") L.svg("path", { d: "M-12 -15 L12 5", stroke: "#d31f26", "stroke-width": 2 }, g);
    L.texte(g, 0, 12, texte, { "font-size": 8, "font-weight": 700, fill: "#23315a" });
  }

  function bulle(calque, cible, titre, texte, interdit) {
    // Bulle d'observation au-dessus de l'objet, reliée à lui par un trait.
    calque.replaceChildren();
    const z = cible.zone(), x = Math.max(140, Math.min(880, z.x)), y = z.y - z.r - 92;
    const lignes = []; let l = "";
    for (const mot of texte.split(" ")) { if ((l + " " + mot).length > 42 && l) { lignes.push(l); l = mot; } else l = (l + " " + mot).trim(); }
    lignes.push(l);
    L.svg("line", { x1: z.x, y1: z.y - z.r, x2: x, y2: y + 26 + lignes.length * 11, stroke: "#55606a", "stroke-width": 1, "stroke-dasharray": "3 2" }, calque);
    L.svg("rect", { x: x - 120, y, width: 240, height: 28 + lignes.length * 11, rx: 6, fill: interdit ? "#fde8e6" : "#ffffff", stroke: interdit ? "#d31f26" : "#8a96a0", filter: "url(#ombre)" }, calque);
    L.texte(calque, x, y + 12, titre, { "font-size": 8.5, "font-weight": 700, fill: interdit ? "#b3161c" : "#23315a" });
    lignes.forEach((t, i) => L.texte(calque, x, y + 25 + i * 11, t, { "font-size": 8, fill: "#222" }));
  }

  function loupe(g) {
    // Loupe à main : lentille dans un cerclage noir, manche ; le centre de la lentille est en (0, 0).
    L.svg("path", { d: "M14 14 L40 40", stroke: "#1c1d1f", "stroke-width": 7, "stroke-linecap": "round" }, g);
    L.svg("circle", { r: 19, fill: "#dff2fa", opacity: 0.45, stroke: "#1c1d1f", "stroke-width": 4 }, g);
    L.svg("path", { d: "M-10 -8 Q-6 -13 0 -14", stroke: "#fff", "stroke-width": 2, fill: "none", opacity: 0.8 }, g);
  }

  L.cartes_sens = function (g, { cibles, x, y, loupe: repos_loupe, fait }) {
    // Cartes posées en rangée, loupe ; poser une carte ou la loupe sur un objet donne l'observation.
    const calque = L.svg("g", { class: "bulle-sens", "pointer-events": "none" }, g), vus = {};
    const viser = (p) => cibles.find((c) => { const z = c.zone && c.zone(); return z && Math.hypot(p.x - z.x, p.y - z.y) < z.r + 18; });
    const noter = (c, sens) => { (vus[c.nom] = vus[c.nom] || new Set()).add(sens); L.missions.noter(fait, Object.fromEntries(Object.entries(vus).map(([k, v]) => [k, [...v]]))); };
    SENS.forEach(([sens, texte], k) => {
      const depart = { x: x + k * 60, y }, e = L.svg("g", { class: `carte-sens carte-${sens}`, role: "button", "aria-label": `Carte ${texte}`, filter: "url(#ombre)" }, g);
      carte(e, sens, texte); L.placer(e, depart.x, depart.y);
      L.glissable(e, {
        debut: () => ({ ...depart }), deplacer: (p) => L.placer(e, p.x, p.y),
        lacher: (p) => {
          L.placer(e, depart.x, depart.y);
          const c = viser(p);
          if (!c) return;
          if (sens === "gout") return void (bulle(calque, c, "Goût : INTERDIT", "Au laboratoire, on ne goûte jamais un produit, même un aliment : il peut être souillé par les réactifs.", true), noter(c, "gout"));
          bulle(calque, c, `${texte} — ${c.titre}`, c.obs[sens]);
          noter(c, sens); c.action?.[sens]?.();
        },
      });
    });
    const l = L.svg("g", { class: "loupe", role: "button", "aria-label": "Loupe", filter: "url(#ombre)" }, g);
    loupe(l); L.placer(l, repos_loupe.x, repos_loupe.y);
    L.glissable(l, {
      debut: () => ({ ...repos_loupe }), deplacer: (p) => L.placer(l, p.x, p.y),
      lacher: (p) => {
        L.placer(l, repos_loupe.x, repos_loupe.y);
        const c = viser(p);
        if (!c || !c.loupe) return;
        calque.replaceChildren();
        L.vue_loupe(calque, c, c.loupe);
        noter(c, "loupe");
      },
    });
    return { vus };
  };
})(window.Labo);
