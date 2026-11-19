/*
Rôle : dessin du pendule de torsion vu un peu d'en haut (600 px/m) : potence et mandrin qui serre le fil d'acier vertical,
       barre horizontale (30 cm) fixée au fil en son milieu, deux masselottes de 100 g à la distance d de l'axe, aiguille au
       bout de la barre devant un cadran horizontal gradué en degrés (sur son pied) ; bobine du fil de rechange. Option :
       capteur de rotation (potentiomètre) sous la barre, sur le cadran, et son câble jusqu'à une prise.
Reçoit : { cx (axe du fil, px), socle (haut du socle de la potence, px), capteur { x, y } (prise où arrive le câble) ou null } ;
         puis l'angle de torsion θ (rad), la distance d (m), le fil monté (A ou B).
Produit : Labo.pendule_torsion_dessin(reglage) -> { fond(g), barre(g, theta, d, fil), rechange(g, fil), C, R_CADRAN, PX, K, BAS }
          (le dernier créé est aussi Labo.torsion_dessin, pour les tests).
Utilisé par : b2_meca4_a2_torsion (poste_torsion.js), b2_meca5_a1_energie (poste_energie_torsion.js).
*/
(function (L) {
  L.pendule_torsion_dessin = function ({ cx = 510, socle = 504, capteur = null } = {}) {
    // Crée le dessin pour un pendule dont l'axe est en cx.
    const C = { x: cx, y: 310 }, PX = 600, K = 0.3, R_CADRAN = 104, HAUT_FIL = 72, BAS = 44;
    const pt = (r, a) => ({ x: C.x + r * Math.cos(a), y: C.y + K * r * Math.sin(a) });

    function fond(g) {
      // Potence et mandrin, pied et cadran gradué (traits tous les 5°, nombres tous les 30°, 0 en face de l'aiguille au repos).
      L.potence(g, { x: C.x - 170, haut: 50, bras: 170, socle });
      L.svg("rect", { x: C.x - 6, y: HAUT_FIL - 2, width: 12, height: 14, rx: 2, fill: "url(#acier)", stroke: "#333" }, g);
      L.ombre_sol(g, C.x, 534, 40, 5, 0.35);
      L.svg("path", { d: `M${C.x - 34} 522 h68 l6 10 h-80 Z`, fill: "#3b4046", stroke: "#1e2226" }, g);
      L.tige(g, `M${C.x} 522 V${C.y + BAS + 5}`, 6);
      L.svg("ellipse", { cx: C.x, cy: C.y + BAS + 3, rx: R_CADRAN + 10, ry: K * (R_CADRAN + 10) + 3, fill: "#5b6268" }, g);
      L.svg("ellipse", { cx: C.x, cy: C.y + BAS, rx: R_CADRAN + 10, ry: K * (R_CADRAN + 10), fill: "#f4f1e8", stroke: "#8d8a80" }, g);
      for (let d = -90; d <= 90; d += 5) {
        const a = (d * Math.PI) / 180, p = { x: C.x + R_CADRAN * Math.cos(a), y: C.y + BAS + K * R_CADRAN * Math.sin(a) }, q = { x: C.x + (R_CADRAN + (d % 30 ? 4 : 8)) * Math.cos(a), y: C.y + BAS + K * (R_CADRAN + (d % 30 ? 4 : 8)) * Math.sin(a) };
        L.svg("line", { x1: p.x, y1: p.y, x2: q.x, y2: q.y, stroke: "#2b2416", "stroke-width": d % 30 ? 0.4 : 0.8 }, g);
        if (d % 30 === 0) L.texte(g, C.x + (R_CADRAN - 10) * Math.cos(a), C.y + BAS + 2 + K * (R_CADRAN - 10) * Math.sin(a), String(Math.abs(d)), { "font-size": 6, fill: "#2b2416" });
      }
      if (capteur) capteur_rotation(g);
    }

    function capteur_rotation(g) {
      // Capteur de rotation : boîtier cylindrique noir posé au centre du cadran, axe relié à la barre, câble vers la prise.
      L.svg("path", { d: `M${C.x + 8} ${C.y + BAS - 4} C${C.x + 40} ${C.y + BAS + 30} ${C.x + 10} 520 ${capteur.x} ${capteur.y}`, fill: "none", stroke: "#222", "stroke-width": 2 }, g);
      L.tige(g, `M${C.x} ${C.y + 2} V${C.y + 16}`, 2.5);
      L.svg("rect", { x: C.x - 10, y: C.y + 16, width: 20, height: BAS - 18, fill: "#24282c", stroke: "#000", "stroke-width": 0.6 }, g);
      L.svg("ellipse", { cx: C.x, cy: C.y + 16, rx: 10, ry: 3, fill: "#3b4046", stroke: "#000", "stroke-width": 0.6 }, g);
      L.texte(g, C.x, C.y + 31, "ROT", { "font-size": 4.5, "font-weight": 700, fill: "#c9ced2" });
    }

    function masselotte(g, p, s) {
      // Masselotte cylindrique en laiton, plus grande quand elle est plus près de l'élève.
      L.svg("rect", { x: p.x - 7 * s, y: p.y - 14 * s, width: 14 * s, height: 19 * s, rx: 2, fill: "url(#laiton)", stroke: "#6d4a0e", "stroke-width": 0.6 }, g);
      L.svg("ellipse", { cx: p.x, cy: p.y - 14 * s, rx: 7 * s, ry: 2.3 * s, fill: "#e2c374", stroke: "#6d4a0e", "stroke-width": 0.5 }, g);
    }

    function barre(g, th, d, fil) {
      // Fil (plus épais pour le fil B), barre, masselottes (la plus lointaine d'abord), aiguille rouge coudée jusqu'au cadran.
      g.replaceChildren();
      L.svg("line", { x1: C.x, y1: HAUT_FIL + 12, x2: C.x, y2: C.y, stroke: "#8d949a", "stroke-width": fil === "B" ? 1.6 : 1 }, g);
      const a = pt(0.15 * PX, th), b = pt(0.15 * PX, th + Math.PI), bout = pt(R_CADRAN, th);
      const m = [pt(d * PX, th), pt(d * PX, th + Math.PI)].sort((u, v) => u.y - v.y);
      masselotte(g, m[0], 1 + (m[0].y - C.y) / 300);
      L.svg("line", { x1: b.x, y1: b.y, x2: a.x, y2: a.y, stroke: "#9aa3a9", "stroke-width": 6, "stroke-linecap": "round" }, g);
      L.svg("path", { d: `M${a.x} ${a.y} L${bout.x} ${bout.y} v${BAS - 3}`, fill: "none", stroke: "#c62828", "stroke-width": 1.2 }, g);
      L.svg("circle", { cx: C.x, cy: C.y, r: 4, fill: "url(#acier)", stroke: "#333" }, g);
      masselotte(g, m[1], 1 + (m[1].y - C.y) / 300);
    }

    function rechange(g, fil) {
      // Bobine du fil de rechange posée sur la paillasse, avec son étiquette.
      g.replaceChildren();
      L.ombre_sol(g, C.x - 40, 572, 24, 4, 0.35);
      L.svg("ellipse", { cx: C.x - 40, cy: 562, rx: 20, ry: 8, fill: "#6b4a2a", stroke: "#3b2a15" }, g);
      for (const r of [15, 11, 7]) L.svg("ellipse", { cx: C.x - 40, cy: 561, rx: r, ry: r * 0.4, fill: "none", stroke: "#a9b0b5", "stroke-width": 0.8 }, g);
      L.texte(g, C.x - 40, 582, `fil ${fil}`, { "font-size": 7, "font-weight": 700, fill: "#f4f1e6" });
    }

    const o = { fond, barre, rechange, C, R_CADRAN, PX, K, BAS };
    L.torsion_dessin = o;
    return o;
  };
})(window.Labo);
