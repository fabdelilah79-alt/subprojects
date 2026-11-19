/*
Rôle : bouton de réglage rotatif d'un appareil (alimentation, stroboscope...) avec son afficheur : on le fait tourner en
       glissant le doigt vers le haut (la valeur augmente) ou vers le bas ; deux petites touches + et − donnent le réglage
       fin, d'un pas. L'index du bouton tourne de −135° à +135° entre le minimum et le maximum.
Reçoit : le groupe SVG et { x, y, min, max, pas, valeur, unite, titre, decimales, sur_changement(valeur) }.
Produit : Labo.bouton_reglage(g, reglage) -> { valeur(), regler(v) }.
Utilisé par : les simulations où l'on règle un appareil (moteur, stroboscope).
*/
(function (L) {
  L.bouton_reglage = function (g, { x, y, min, max, pas, valeur, unite = "", titre = "", decimales = 1, sur_changement = () => {} }) {
    // Afficheur, bouton cranté, index, touches fines ; la valeur reste entre min et max, arrondie au pas.
    L.svg("rect", { x: x - 34, y: y - 52, width: 68, height: 20, rx: 3, fill: "#1d2a22", stroke: "#000" }, g);
    const b = { v: valeur }, ecran = L.svg("g", {}, g), corps = L.svg("g", { class: "bouton-reglage", role: "slider", "aria-label": titre }, g);
    L.texte(g, x, y + 36, titre, { "font-size": 7.5, "font-weight": 700, fill: "#e8ecef" });
    L.svg("circle", { cx: x, cy: y, r: 19, fill: "url(#acier)", stroke: "#111" }, corps);
    for (let k = 0; k < 24; k++) { const a = (k * Math.PI) / 12; L.svg("line", { x1: x + 17 * Math.cos(a), y1: y + 17 * Math.sin(a), x2: x + 19 * Math.cos(a), y2: y + 19 * Math.sin(a), stroke: "#333" }, corps); }
    const index = L.svg("line", { x1: x, y1: y, x2: x, y2: y - 14, stroke: "#f2b705", "stroke-width": 3, "stroke-linecap": "round" }, corps);
    const maj = () => {
      const a = -135 + (270 * (b.v - min)) / (max - min);
      index.setAttribute("transform", `rotate(${a} ${x} ${y})`);
      ecran.replaceChildren(); L.texte(ecran, x, y - 38, `${b.v.toFixed(decimales).replace(".", ",")} ${unite}`, { "font-size": 10, "font-weight": 700, fill: "#7dff9a", "font-family": "monospace" });
    };
    b.regler = (v) => { b.v = Math.max(min, Math.min(max, Math.round(v / pas) * pas)); maj(); sur_changement(b.v); };
    let y0 = null, v0 = 0;
    L.glissable(corps, { soulever: false, debut: () => { y0 = null; return { x: 0, y: 0 }; }, deplacer: (d) => { if (y0 === null) { y0 = d.y; v0 = b.v; } b.regler(v0 - ((d.y - y0) / 140) * (max - min)); } });
    [[-1, "−"], [1, "+"]].forEach(([s, t]) => {
      const k = L.svg("g", { class: s > 0 ? "plus" : "moins", role: "button", "aria-label": s > 0 ? "Augmenter" : "Diminuer" }, g);
      L.svg("rect", { x: x + s * 30 - 9, y: y - 9, width: 18, height: 18, rx: 3, fill: "#e9eef2", stroke: "#8a96a0" }, k);
      L.texte(k, x + s * 30, y + 4, t, { "font-size": 12, "font-weight": 700, fill: "#23315a" });
      L.glissable(k, { soulever: false, debut: () => ({ x: 0, y: 0 }), toucher: () => b.regler(b.v + s * pas) });
    });
    b.valeur = () => b.v;
    maj();
    return b;
  };
})(window.Labo);
