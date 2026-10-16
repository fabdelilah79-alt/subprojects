/*
Rôle : paillasse de la filtration sous vide : fiole à vide, entonnoir Büchner, papier filtre, pissette, trompe à eau sur le
       robinet, mélange (fleurs de lavande et eau, résidu du ballon). Avec le vide, le liquide traverse vite le papier ;
       sans vide, il coule lentement. Il faut débrancher le tuyau AVANT de fermer le robinet, sinon l'eau de la trompe
       remonte dans la fiole (retour d'eau).
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_buchner(groupe) -> { pense_bete } ; fait « buchner » = { papier, mouille, vide, branche, verse, filtrat, retour, trouble }.
Utilisé par : simulation.js.
*/
(function (L) {
  const F = { x: 520, bas: 560 }, B = { x: 520, haut: 396 }, T = { x: 720, y: 330 }, BRAS = { x: 552, y: 452 };
  const VERRE = { fill: "url(#verre)", stroke: "#9fb6be" };

  function fiole(g, e) {
    // Fiole à vide (verre épais, tubulure latérale), filtrat, Büchner en porcelaine et son joint, papier, contenu.
    const h_f = Math.min(70, e.filtrat * 0.5);
    if (e.filtrat > 0) L.svg("path", { d: `M${F.x - 42 + h_f * 0.38} ${F.bas - 3 - h_f} L${F.x - 42} ${F.bas - 3} H${F.x + 42} L${F.x + 42 - h_f * 0.38} ${F.bas - 3 - h_f} Z`, fill: e.retour ? "#b9d8e6" : e.trouble ? "#c9b48a" : "#efe2b8", opacity: 0.85 }, g);
    L.svg("path", { d: `M${F.x - 12} ${F.bas - 120} V${F.bas - 98} L${F.x - 46} ${F.bas - 4} Q${F.x - 46} ${F.bas} ${F.x - 40} ${F.bas} H${F.x + 40} Q${F.x + 46} ${F.bas} ${F.x + 46} ${F.bas - 4} L${F.x + 12} ${F.bas - 98} V${F.bas - 120}`, ...VERRE, "stroke-width": 2 }, g);
    L.svg("path", { d: `M${F.x + 12} ${BRAS.y - 3} H${BRAS.x + 8} V${BRAS.y + 3} H${F.x + 12}`, ...VERRE, "stroke-width": 1.6 }, g);
    L.svg("path", { d: `M${F.x - 14} ${B.haut + 30} L${F.x - 10} ${B.haut + 52} H${F.x + 10} L${F.x + 14} ${B.haut + 30} Z`, fill: "#55595d" }, g);
    L.svg("path", { d: `M${F.x - 4} ${B.haut + 30} V${B.haut + 76} H${F.x + 4} V${B.haut + 30}`, fill: "#f4f2ec", stroke: "#bdb8ab" }, g);
    L.svg("path", { d: `M${B.x - 34} ${B.haut} V${B.haut + 22} Q${B.x - 32} ${B.haut + 32} ${B.x - 6} ${B.haut + 32} H${B.x + 6} Q${B.x + 32} ${B.haut + 32} ${B.x + 34} ${B.haut + 22} V${B.haut} Z`, fill: "#f4f2ec", stroke: "#bdb8ab" }, g);
    L.svg("ellipse", { cx: B.x, cy: B.haut, rx: 34, ry: 7, fill: e.papier ? "#ffffff" : "#e3dfd4", stroke: "#bdb8ab" }, g);
    if (!e.papier) for (let i = 0; i < 14; i++) L.svg("circle", { cx: B.x - 24 + (i % 7) * 8, cy: B.haut - 2 + Math.floor(i / 7) * 4, r: 0.9, fill: "#8d897e" }, g);
    if (e.verse > 0) L.svg("ellipse", { cx: B.x, cy: B.haut, rx: 30, ry: 5.5, fill: "#d9c99a", opacity: 0.85 }, g);
    if (e.residu) for (let i = 0; i < 16; i++) L.svg("ellipse", { cx: B.x - 24 + ((i * 13) % 48), cy: B.haut - 3 + ((i * 7) % 6), rx: 2.4, ry: 1.3, fill: "#7b5aa6" }, g);
  }

  function trompe(g, e) {
    // Robinet, trompe à eau et tuyau à vide (branché sur la tubulure, ou pendant à côté).
    L.svg("rect", { x: T.x - 8, y: T.y - 18, width: 16, height: 12, rx: 2, fill: "url(#metal)" }, g);
    L.svg("rect", { x: T.x - 4, y: T.y - 6, width: 8, height: 46, rx: 2, fill: "url(#metal)", stroke: "#7d868c" }, g);
    L.svg("rect", { x: T.x + 4, y: T.y + 12, width: 10, height: 5, fill: "url(#metal)" }, g);
    if (e.vide) L.svg("rect", { x: T.x - 2, y: T.y + 40, width: 4, height: 70, fill: "#8fd0ee", opacity: 0.7 }, g);
    // Tuyau à vide enfilé sur l'embout de la trompe et sur la tubulure de la fiole (il les recouvre de 8 px) ; débranché, il pend.
    const style = { stroke: "#2b2b2b", "stroke-width": 8, fill: "none" };
    if (!e.branche) return void L.svg("path", { d: `M${T.x + 6} ${T.y + 15} H${T.x + 20} C${T.x + 60} ${T.y + 15} ${BRAS.x + 70} ${BRAS.y} ${BRAS.x + 34} ${BRAS.y + 44}`, ...style, "stroke-linecap": "round" }, g);
    L.svg("path", { d: `M${T.x + 6} ${T.y + 15} H${T.x + 20} C${T.x + 60} ${T.y + 15} ${BRAS.x + 60} ${BRAS.y} ${BRAS.x + 20} ${BRAS.y} H${BRAS.x}`, ...style }, g);
  }

  function papiers(g) {
    // Boîte de papiers filtres ronds.
    L.svg("rect", { x: 236, y: 540, width: 56, height: 20, rx: 2, fill: "#3f6fb0" }, g);
    L.svg("ellipse", { cx: 264, cy: 540, rx: 26, ry: 6, fill: "#fff", stroke: "#c8c8c0" }, g);
    L.texte(g, 264, 553, "papier filtre", { "font-size": 5.5, "font-weight": 700, fill: "#fff" });
  }

  function deplacable(g, dessin, cible, action) {
    // Objet que l'on porte au-dessus du Büchner ; action() si on le lâche assez près.
    const o = L.svg("g", { role: "button" }, g); dessin(o);
    L.glissable(o, { debut: () => ({ x: 0, y: 0 }), deplacer: (p) => L.placer(o, p.x, p.y), lacher: (p) => { L.placer(o, 0, 0); if (Math.hypot(cible.x + p.x - B.x, cible.y + p.y - B.haut) < 45) action(o); } });
    return o;
  }

  function evoluer(e) {
    // Le liquide du Büchner passe dans la fiole : vite avec le vide, lentement sans.
    if (e.verse > 0) { const v = Math.min(e.verse, e.vide && e.branche ? 3 : 0.3); e.verse -= v; e.filtrat += v; }
  }

  L.poste_buchner = function (g) {
    // Construit la paillasse et ses gestes.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230);
    const e = { papier: false, mouille: false, vide: false, branche: true, verse: 0, filtrat: 0, residu: false, retour: false, trouble: false };
    L.svg("rect", { x: T.x - 40, y: T.y + 104, width: 110, height: 34, rx: 6, fill: "#7f8a90", stroke: "#8f989e" }, g);
    const g_trompe = L.svg("g", {}, g), g_fiole = L.svg("g", {}, g);
    const maj = () => { g_trompe.replaceChildren(); trompe(g_trompe, e); g_fiole.replaceChildren(); fiole(g_fiole, e); L.missions.noter("buchner", { ...e, verse: Math.round(e.verse), filtrat: Math.round(e.filtrat) }); };
    papiers(g);
    deplacable(g, (o) => L.svg("ellipse", { cx: 264, cy: 536, rx: 22, ry: 5, fill: "#fff", stroke: "#c8c8c0" }, o), { x: 264, y: 536 }, () => { e.papier = true; maj(); });
    deplacable(g, (o) => { L.svg("path", { d: "M386 560 V516 Q386 506 400 506 Q414 506 414 516 V560 Z", fill: "#e6f3f8", stroke: "#9fb6be" }, o); L.svg("path", { d: "M400 506 V496 L428 480", stroke: "#e0e6e8", "stroke-width": 3, fill: "none" }, o); L.texte(o, 400, 540, "eau", { "font-size": 6, fill: "#23315a" }); }, { x: 428, y: 480 }, () => { if (e.papier) { e.mouille = true; maj(); } });
    const melange = L.melange({ eau: 100 });
    deplacable(g, (o) => { L.verrerie.becher(o, 340, 560, melange, "fleurs + eau", { l: 56, h: 72, capacite: 150 }); for (let i = 0; i < 10; i++) L.svg("ellipse", { cx: 322 + ((i * 7) % 36), cy: 540 - ((i * 5) % 30), rx: 2.4, ry: 1.3, fill: "#7b5aa6" }, o); }, { x: 340, y: 488 }, (o) => {
      if (e.verse || e.residu) return;
      Object.assign(e, { verse: 100, residu: e.papier, trouble: !e.papier || !e.mouille }); o.style.display = "none"; maj();
    });
    const robinet = L.svg("circle", { cx: T.x + 16, cy: T.y - 12, r: 6, fill: "url(#acier)", stroke: "#111", role: "button" }, g);
    L.glissable(robinet, { soulever: false, debut: () => ({ x: 0, y: 0 }), toucher: () => { if (e.vide && e.branche) { e.retour = true; e.filtrat += 30; } e.vide = !e.vide; maj(); } });
    const raccord = L.svg("circle", { cx: BRAS.x + 14, cy: BRAS.y + 8, r: 12, fill: "#000", opacity: 0 }, g);
    L.glissable(raccord, { soulever: false, debut: () => ({ x: 0, y: 0 }), toucher: () => { e.branche = !e.branche; maj(); } });
    setInterval(() => { evoluer(e); maj(); }, 200);
    maj();
    return { pense_bete };
  };
})(window.Labo);
