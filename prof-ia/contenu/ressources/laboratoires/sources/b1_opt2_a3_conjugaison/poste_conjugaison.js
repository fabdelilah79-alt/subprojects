/*
Rôle : paillasse « relation de conjugaison et grandissement » : banc d'optique, lanterne (objet « F » de 2,0 cm à 10 cm sur
       le rail), lentille L1 (f' = 10 cm, diaphragmée) et écran que l'on fait glisser ; caméra fixée au mur qui montre l'écran
       de face, quadrillé au centimètre, pour mesurer A'B'. Chaque image nette obtenue (cavalier lâché) est notée.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_conjugaison(g) -> { pense_bete } ; fait « conjugaison » = { essais: [{ xL, xE, OA, OAp, gamma, ApBp }] }.
Utilisé par : simulation.js.
*/
(function (L) {
  const XO = 10, F = 10, D = 20, CAM = { x: 675, y: 84, k: 1.2 };

  function camera(g) {
    // Boîtier de la vue rapprochée (écran de contrôle au mur), légende.
    L.svg("rect", { x: CAM.x - 84, y: 4, width: 168, height: 160, rx: 6, fill: "#20262b", stroke: "#000" }, g);
    L.svg("circle", { cx: CAM.x + 74, cy: 12, r: 2.5, fill: "#ff3b2a" }, g);
    L.texte(g, CAM.x, 159, "vue rapprochée de l'écran (1 carreau = 1 cm)", { "font-size": 6.5, "font-weight": 700, fill: "#e8e2d4" });
  }

  function face(g) {
    // Écran vu de face : fond, quadrillage, axe ; renvoie la transformation mm -> écran.
    g.replaceChildren();
    const T = (u, v) => ({ x: CAM.x + CAM.k * u, y: CAM.y + CAM.k * v });
    L.svg("rect", { x: T(-60, -60).x, y: T(-60, -60).y, width: 144, height: 144, fill: "#f7f6f0" }, g);
    for (let c = -60; c <= 60; c += 10) {
      L.svg("line", { x1: T(c, -60).x, y1: T(c, -60).y, x2: T(c, 60).x, y2: T(c, 60).y, stroke: c ? "#dcd8cc" : "#b9b3a0", "stroke-width": 0.6 }, g);
      L.svg("line", { x1: T(-60, c).x, y1: T(-60, c).y, x2: T(60, c).x, y2: T(60, c).y, stroke: c ? "#dcd8cc" : "#b9b3a0", "stroke-width": 0.6 }, g);
    }
    return T;
  }

  L.poste_conjugaison = function (g) {
    // Banc, lanterne, lentille et écran saisissables, image sur l'écran et dans la vue rapprochée ; essais notés.
    const { pense_bete } = L.decor_circuit(g, 0), fond = L.svg("g", {}, g), b = L.banc_optique(fond, {});
    camera(fond); L.lanterne_banc(fond, b, { x: XO });
    const e = { xL: 35, xE: 60, essais: [] };
    const gb = L.svg("g", { "pointer-events": "none" }, g), gl = L.svg("g", { class: "lentille", role: "slider", "aria-label": "Lentille" }, g), ge = L.svg("g", { class: "ecran", role: "slider", "aria-label": "Écran" }, g);
    const gi = L.svg("g", { "pointer-events": "none" }, g), gf = L.svg("g", { "pointer-events": "none" }, g), gv = L.svg("g", { "pointer-events": "none" }, g);
    let res = {};
    const dessiner = () => {
      // Faisceau, lentille, écran, images (sur l'écran du banc et dans la vue rapprochée).
      gl.replaceChildren(); ge.replaceChildren();
      L.faisceau_banc(gb, b, { xO: XO, xL: e.xL, xE: e.xE, f: F, diaphragme: true });
      L.lentille_banc(gl, b, { x: e.xL, nom: "L1 : f' = 10 cm", diaphragme: true });
      const reglage = { xE: e.xE, xL: e.xL, xO: XO, f: F, D };
      res = L.image_banc(gi, L.ecran_banc(ge, b, { x: e.xE }), reglage); L.image_banc(gv, face(gf), reglage);
    };
    const noter = () => {
      // Image nette : position de la lentille et de l'écran, OA, OA' (lus sur le rail), A'B' (cm).
      if (!res.nette) return;
      const r1 = (x) => Math.round(x * 10) / 10;
      e.essais.push({ xL: e.xL, xE: e.xE, OA: r1(XO - e.xL), OAp: r1(e.xE - e.xL), gamma: res.gamma, ApBp: Math.round(2 * res.gamma * 100) / 100 });
    };
    const glisser = (gr, k, min, max) => L.glissable(gr, { soulever: false, debut: () => ({ x: b.px(e[k]), y: b.axe }), deplacer: (p) => { e[k] = Math.round(Math.max(min(), Math.min(max(), b.cm(p.x))) * 10) / 10; dessiner(); }, lacher: noter });
    glisser(gl, "xL", () => XO + 3, () => e.xE - 4); glisser(ge, "xE", () => e.xL + 4, () => 96);
    dessiner();
    setInterval(() => L.missions.noter("conjugaison", JSON.parse(JSON.stringify({ essais: e.essais }))), 250);
    return { pense_bete };
  };
})(window.Labo);
