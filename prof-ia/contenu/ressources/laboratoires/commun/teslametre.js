/*
Rôle : teslamètre à sonde à effet Hall : boîtier (afficheur en mT, commutateur « H / V ») relié par un câble à une sonde
       en forme de stylo posée sur la feuille ; la mesure se fait à la pointe de la sonde. En « H », il mesure la valeur de
       la composante horizontale du champ (dans le plan de la feuille) ; en « V », la valeur de la composante verticale.
       Résolution : 0,001 mT sous 2 mT, 0,01 mT sous 20 mT, 0,1 mT au-delà. La touche « zéro » retranche le champ présent
       à cet instant (en pratique, le champ terrestre).
Reçoit : le groupe SVG, le plan (plan_magnetique.js) et { x, y (coin du boîtier, écran), sonde { x, y } (m), champ(p) -> B,
         sur_zero() (appelé quand on fait le zéro) }.
Produit : Labo.teslametre(g, plan, reglage) -> t { mode, sonde, zero (vecteur retranché), valeur (T, arrondie à la résolution),
          lecture, tic() }.
Utilisé par : les postes des simulations de magnétisme.
*/
(function (L) {
  const lire = (B) => { const mT = B * 1000, d = mT < 2 ? 3 : mT < 20 ? 2 : 1; return { mT: Number(mT.toFixed(d)), texte: mT.toFixed(d).replace(".", ",") }; };

  L.teslametre = function (g, plan, { x, y, sonde, champ, sur_zero = () => {} }) {
    // Boîtier, commutateur, sonde saisissable ; tic() relit le champ à la pointe et met l'afficheur à jour.
    const t = { mode: "H", sonde: { ...sonde }, valeur: 0, lecture: "", zero: { x: 0, y: 0, z: 0 } };
    L.svg("rect", { x, y, width: 130, height: 74, rx: 6, fill: "#2f5d8a", stroke: "#123" }, g);
    L.texte(g, x + 65, y + 11, "TESLAMÈTRE (sonde à effet Hall)", { "font-size": 6.5, "font-weight": 700, fill: "#e6eef4" });
    L.svg("rect", { x: x + 10, y: y + 18, width: 110, height: 26, rx: 3, fill: "#1d2a22" }, g);
    const ecran = L.texte(g, x + 65, y + 32, "", { "font-size": 13, "font-weight": 700, fill: "#7dff9a", "font-family": "monospace" });
    const bouton = L.svg("g", { class: "teslametre-mode", role: "button", "aria-label": "Composante mesurée" }, g);
    const dessiner_mode = () => { bouton.replaceChildren(); L.svg("rect", { x: x + 8, y: y + 50, width: 78, height: 18, rx: 9, fill: "#e8eef2", stroke: "#123" }, bouton); L.texte(bouton, x + 47, y + 59, t.mode === "H" ? "horizontale" : "verticale", { "font-size": 7.5, "font-weight": 700, fill: "#123" }); };
    L.glissable(bouton, { soulever: false, debut: () => ({ x, y }), toucher: () => { t.mode = t.mode === "H" ? "V" : "H"; dessiner_mode(); } });
    const zero = L.svg("g", { class: "teslametre-zero", role: "button", "aria-label": "Zéro du teslamètre" }, g);
    L.svg("rect", { x: x + 90, y: y + 50, width: 32, height: 18, rx: 9, fill: "#ffd54f", stroke: "#123" }, zero);
    L.texte(zero, x + 106, y + 59, "zéro", { "font-size": 7.5, "font-weight": 700, fill: "#123" });
    L.glissable(zero, { soulever: false, debut: () => ({ x, y }), toucher: () => { t.zero = champ({ x: t.sonde.x, y: t.sonde.y, z: 0 }); sur_zero(); } });
    dessiner_mode();
    const cable = L.svg("path", { fill: "none", stroke: "#1b1e21", "stroke-width": 2.2 }, g), stylo = L.svg("g", { class: "sonde-hall", role: "button", "aria-label": "Sonde du teslamètre" }, g);
    const dessiner_sonde = () => {
      // Stylo noir couché sur la feuille, pointe à gauche (point de mesure), câble vers le boîtier.
      const p = plan.ecran(t.sonde);
      stylo.replaceChildren();
      L.svg("path", { d: `M${p.x} ${p.y} l10 -3 h46 v6 h-46 z`, fill: "#22272b", stroke: "#000", "stroke-width": 0.6 }, stylo);
      L.svg("circle", { cx: p.x, cy: p.y, r: 1.8, fill: "#ffd54f" }, stylo);
      L.svg("rect", { x: p.x - 6, y: p.y - 14, width: 76, height: 28, fill: "#000", opacity: 0.001 }, stylo);
      cable.setAttribute("d", `M${p.x + 56} ${p.y} C${p.x + 110} ${p.y + 10} ${x + 40} ${y + 110} ${x + 65} ${y + 74}`);
    };
    L.glissable(stylo, { soulever: false, debut: () => plan.ecran(t.sonde), deplacer: (p) => { t.sonde = plan.borner(plan.plan(p), 0.002); dessiner_sonde(); } });
    t.tic = () => {
      // Composante choisie du champ à la pointe de la sonde.
      const C = champ({ x: t.sonde.x, y: t.sonde.y, z: 0 }), B = { x: C.x - t.zero.x, y: C.y - t.zero.y, z: C.z - t.zero.z }, l = lire(t.mode === "H" ? Math.hypot(B.x, B.y) : Math.abs(B.z));
      t.valeur = Number((l.mT / 1000).toFixed(9)); t.lecture = l.texte;
      ecran.textContent = `${l.texte} mT`;
    };
    t.dessiner_sonde = dessiner_sonde;
    dessiner_sonde(); t.tic();
    return t;
  };
})(window.Labo);
