/*
Rôle : paillasse « caractéristiques d'une lentille convergente » : banc d'optique, lentille L1 (+10 δ) ou L2 (+5 δ) et écran
       sur leurs cavaliers (on les fait glisser, au millimètre) ; objet : maison très éloignée vue par la fenêtre (objet à
       l'infini) ou lanterne avec le « F » à 10 cm ; diaphragme. Chaque image nette obtenue (cavalier lâché) est notée.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_focale(g) -> { pense_bete } ; fait « focale » = { essais: [{ objet, lentille, xL, xE, OA, OAp, gamma, diaphragme }],
          virtuelle (objet entre le foyer et la lentille, aucune image sur l'écran) }.
Utilisé par : simulation.js.
*/
(function (L) {
  const XO = 10, LENTILLES = { L1: { f: 10, nom: "L1 : +10 δ" }, L2: { f: 20, nom: "L2 : +5 δ" } };

  function fenetre(g, visible) {
    // Fenêtre au mur, maison lointaine ; flèche « vers l'objet très éloigné ».
    g.replaceChildren();
    if (!visible) return;
    L.svg("rect", { x: 40, y: 190, width: 110, height: 90, fill: "#bfe0f5", stroke: "#e8e8e8", "stroke-width": 6 }, g);
    L.svg("path", { d: "M80 260 h30 v-20 h-30 z M76 240 l19 -14 l19 14 z", fill: "#8a6a44" }, g);
    L.texte(g, 95, 298, "objet très éloigné", { "font-size": 8, "font-weight": 700, fill: "#e8e2d4" });
    L.svg("path", { d: "M160 320 H190 M182 314 L190 320 L182 326", fill: "none", stroke: "#ffd54f", "stroke-width": 2 }, g);
  }

  L.poste_focale = function (g) {
    // Banc, objet, lentille et écran saisissables, image ; touches ; essais notés quand l'image est nette.
    const { pense_bete } = L.decor_circuit(g, 0), fond = L.svg("g", {}, g), b = L.banc_optique(fond, {});
    const e = { objet: "lointain", lentille: "L1", diaphragme: false, xL: 40, xE: 70, essais: [], virtuelle: false };
    const gf = L.svg("g", {}, g), go = L.svg("g", {}, g), gb = L.svg("g", { "pointer-events": "none" }, g), gl = L.svg("g", { class: "lentille", role: "slider", "aria-label": "Lentille" }, g), ge = L.svg("g", { class: "ecran", role: "slider", "aria-label": "Écran" }, g), gi = L.svg("g", { "pointer-events": "none" }, g);
    let res = {};
    const dessiner = () => {
      // Objet, lentille, écran, image ; aucune image réelle quand l'objet est entre le foyer et la lentille.
      fenetre(gf, e.objet === "lointain"); go.replaceChildren(); gl.replaceChildren(); ge.replaceChildren();
      if (e.objet === "lanterne") L.lanterne_banc(go, b, { x: XO });
      L.faisceau_banc(gb, b, { xO: XO, xL: e.xL, xE: e.xE, f: LENTILLES[e.lentille].f, infini: e.objet === "lointain", diaphragme: e.diaphragme });
      L.lentille_banc(gl, b, { x: e.xL, nom: LENTILLES[e.lentille].nom, diaphragme: e.diaphragme });
      const T = L.ecran_banc(ge, b, { x: e.xE });
      res = L.image_banc(gi, T, { xE: e.xE, xL: e.xL, xO: XO, f: LENTILLES[e.lentille].f, infini: e.objet === "lointain", D: e.diaphragme ? 12 : 40 });
      if (e.objet === "lanterne" && res.OAp === null) e.virtuelle = true;
    };
    const noter = () => { if (res.nette) e.essais.push({ objet: e.objet, lentille: e.lentille, xL: e.xL, xE: e.xE, OA: res.OA === -Infinity ? null : Math.round(res.OA * 10) / 10, OAp: Math.round((e.xE - e.xL) * 10) / 10, gamma: res.gamma, diaphragme: e.diaphragme }); };
    const glisser = (gr, k, min, max) => L.glissable(gr, { soulever: false, debut: () => ({ x: b.px(e[k]), y: b.axe }), deplacer: (p) => { e[k] = Math.round(Math.max(min(), Math.min(max(), b.cm(p.x))) * 10) / 10; dessiner(); }, lacher: noter });
    glisser(gl, "xL", () => (e.objet === "lanterne" ? XO + 3 : 12), () => e.xE - 4); glisser(ge, "xE", () => e.xL + 4, () => 96);
    [["Objet", () => { e.objet = e.objet === "lointain" ? "lanterne" : "lointain"; }], ["Lentille", () => { e.lentille = e.lentille === "L1" ? "L2" : "L1"; }], ["Diaphragme", () => { e.diaphragme = !e.diaphragme; }]]
      .forEach(([t, f], k) => L.bouton_texte(g, 400 + k * 92, 560, t, () => { f(); dessiner(); }));
    dessiner();
    setInterval(() => L.missions.noter("focale", JSON.parse(JSON.stringify({ essais: e.essais, virtuelle: e.virtuelle }))), 250);
    return { pense_bete };
  };
})(window.Labo);
