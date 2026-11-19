/*
Rôle : recul d'une « arme » au laboratoire : un petit canon à ressort fixé sur un chariot, qui roule sans frottement
       sur un rail gradué posé sur la paillasse. Au tir, la bille part vers la gauche (une barrière lumineuse affiche
       sa vitesse) et tombe dans un bac de sable ; le chariot recule vers la droite.
Reçoit : le groupe SVG de la paillasse ; { m_bille, m_chariot, v_bille } (kg, m/s).
Produit : Labo.poste_canon(groupe, reglages) -> { pense_bete } ; fait « recul_canon » (photographie terminée).
Utilisé par : simulation.js.
*/
(function (L) {
  const ECH = 400, O = 40, RAIL = 470, CANON_Y = 378;

  function rail(g) {
    // Rail d'aluminium sur ses pieds, graduation en centimètres (un nombre tous les 10 cm).
    L.ombre_sol(g, 512, RAIL + 34, 480, 8, 0.4);
    for (const x of [70, 954]) L.svg("rect", { x: x - 8, y: RAIL + 10, width: 16, height: 22, fill: "url(#acier)" }, g);
    L.svg("rect", { x: 30, y: RAIL, width: 964, height: 12, fill: "url(#metal-h)", stroke: "#5d666d", "stroke-width": 0.6 }, g);
    for (let cm = 0; cm <= 235; cm++) {
      const x = O + (cm / 100) * ECH, l = cm % 10 === 0 ? 8 : cm % 5 === 0 ? 5 : 3;
      L.svg("line", { x1: x, y1: RAIL + 12, x2: x, y2: RAIL + 12 + l, stroke: "#1b1f22", "stroke-width": cm % 10 === 0 ? 0.9 : 0.5 }, g);
      if (cm % 10 === 0) L.texte(g, x, RAIL + 27, String(cm), { "font-size": 8, fill: "#e9edf0" });
    }
    L.texte(g, 990, RAIL + 27, "cm", { "font-size": 8, fill: "#e9edf0" });
  }

  function chariot(g, x) {
    // Chariot sur quatre roues, potence qui porte le tube du canon (tourné vers la gauche), plot repère bleu.
    L.svg("rect", { x: x - 50, y: RAIL - 30, width: 100, height: 24, rx: 3, fill: "url(#facade)", stroke: "#3c4a57" }, g);
    for (const dx of [-34, 34]) L.svg("circle", { cx: x + dx, cy: RAIL - 4, r: 7, fill: "#2a2e33", stroke: "#8a9297", "stroke-width": 2 }, g);
    L.tige(g, `M${x + 4} ${RAIL - 30} V${CANON_Y}`, 6);
    L.tige(g, `M${x + 14} ${CANON_Y} H${x - 62}`, 12);
    L.svg("rect", { x: x - 2, y: CANON_Y - 12, width: 26, height: 22, rx: 2, fill: "#3b3f44" }, g);
    L.svg("circle", { cx: x - 24, cy: RAIL - 34, r: 4, fill: "#2f80ed", stroke: "#111" }, g);
  }

  function bac_et_barriere(g, x_bouche) {
    // Bac de réception rempli de sable à gauche ; barrière lumineuse fixe devant la bouche du canon, avec son afficheur.
    L.svg("path", { d: `M40 ${RAIL - 36} H190 V${RAIL} H40 Z`, fill: "url(#bois-face)", stroke: "#6b4a2a" }, g);
    L.svg("rect", { x: 44, y: RAIL - 32, width: 142, height: 8, fill: "#d9c08a" }, g);
    const x = x_bouche - 34;
    L.svg("path", { d: `M${x - 7} ${CANON_Y - 30} V${CANON_Y + 22} M${x + 7} ${CANON_Y - 30} V${CANON_Y + 22}`, stroke: "#2a2e33", "stroke-width": 5 }, g);
    L.tige(g, `M${x} ${CANON_Y + 22} V${RAIL}`, 4);
    L.svg("rect", { x: x - 46, y: CANON_Y - 70, width: 92, height: 30, rx: 3, fill: "#20262b", stroke: "#555" }, g);
    return L.texte(g, x, CANON_Y - 54, "— m/s", { "font-size": 14, "font-weight": 700, fill: "#7dff9a", "font-family": "monospace" });
  }

  function bille(g, x, etat) {
    // La bille d'acier : en vol après le tir (elle tombe en avançant), puis posée dans le sable du bac.
    if (!etat.parti) return;
    const y = Math.min(RAIL - 36, CANON_Y + 0.5 * 9.8 * etat.t * etat.t * ECH);
    L.svg("circle", { cx: x, cy: y - 3, r: 7, fill: "url(#bille-canon)", stroke: "#1b1f22", "stroke-width": 0.6 }, g);
  }

  L.poste_canon = function (g, { m_bille, m_chariot, v_bille }) {
    // Construit le rail et branche la scène de recul (photo toutes les 0,1 s).
    const d = L.svg("radialGradient", { id: "bille-canon", cx: 0.35, cy: 0.3, r: 0.8 }, g.ownerSVGElement.querySelector("defs"));
    for (const [o, c] of [[0, "#ffffff"], [0.3, "#c9d0d5"], [0.75, "#5d666d"], [1, "#22282d"]]) L.svg("stop", { offset: o, "stop-color": c }, d);
    rail(g);
    L.svg("rect", { x: 30, y: 300, width: 220, height: 44, rx: 3, fill: "#f7f5ee", stroke: "#c9c3b0" }, g);
    L.texte(g, 140, 315, `Bille : ${Math.round(m_bille * 1000)} g`, { class: "etiquette-carton", "font-size": 15 });
    L.texte(g, 140, 333, `Chariot et canon : ${Math.round(m_chariot * 1000)} g`, { class: "etiquette-carton", "font-size": 15 });
    const X_CHARIOT = 1.05, X_BILLE = X_CHARIOT - 62 / ECH, afficheur = bac_et_barriere(g, O + X_BILLE * ECH);
    const t_vol = Math.sqrt((2 * (RAIL - 36 - CANON_Y)) / ECH / 9.8);
    L.scene_recul(g, {
      nom: "recul_canon", photo_s: 0.1, duree_s: 1.2, echelle: ECH, origine_px: O, sol_y: RAIL + 12, bouton: { x: 600, y: 548, texte: "Tirer" },
      corps: [
        { masse: m_bille, x0: X_BILLE, v: -v_bille, arret: (x) => x <= X_BILLE - v_bille * t_vol, couleur: null, dessiner: (h, x, e) => { bille(h, x, e); afficheur.textContent = e.parti ? `${L.nombre(v_bille, 2)} m/s` : "— m/s"; } },
        { masse: m_chariot, x0: X_CHARIOT, arret: (x) => x >= 2.2, couleur: "#2f80ed", repere_y: RAIL - 34, dessiner: (h, x) => chariot(h, x) },
      ],
    });
    L.texte(g, 512, 290, "Photographie à pose multiple : une image toutes les 0,1 s", { class: "etiquette-carton", "font-size": 15, fill: "#3b2a05" });
    return { pense_bete: L.decor.pense_bete(g, 24, 40, 230) };
  };
})(window.Labo);
