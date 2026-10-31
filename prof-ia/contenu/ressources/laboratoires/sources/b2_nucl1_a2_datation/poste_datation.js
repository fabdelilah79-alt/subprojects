/*
Rôle : paillasse « datation au carbone 14 » : compteur à scintillation à faible bruit de fond (sans détails techniques), avec
       son puits à échantillon ; portoir de trois fioles de 1,00 g de carbone extrait (charbon de bois actuel, charbon d'une
       grotte ornée, os de mammouth). On glisse une fiole dans le puits et on lance une mesure de 1 000 min : le compteur
       donne le nombre N de désintégrations (tirage aléatoire de moyenne a·m·Δt) et l'activité a = N / (m·Δt) en Bq/g, à 4 chiffres significatifs.
       Les mesures sont reportées sur la fiche au mur. Âges : actuel, 17 000 ans, 28 000 ans (demi-vie 5 730 ans).
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_datation(g) -> { pense_bete } ; fait « datation » = { dans, mesures { fiole : a (Bq/g) } }.
Utilisé par : simulation.js.
*/
(function (L) {
  const A0 = 0.227, DT = 60000, PUITS = { x: 380, y: 392 };
  const FIOLES = { actuel: ["charbon actuel", 0, "#1b1b1b"], grotte: ["charbon (grotte)", 17000, "#1b1b1b"], os: ["os de mammouth", 28000, "#6d6a64"] };
  const activite = (age) => A0 * 2 ** (-age / 5730), place = (k) => ({ x: 650 + k * 76, y: 470 });

  function appareil(g) {
    // Boîtier du compteur à scintillation, puits sur le dessus, écran.
    L.boitier(g, 300, 380, 300, 16, 170, { dessus: "#d9dcd8", face: "#5d6970" });
    L.svg("ellipse", { cx: PUITS.x, cy: PUITS.y - 4, rx: 20, ry: 6, fill: "#111", stroke: "#333" }, g);
    L.texte(g, 520, 392, "compteur à scintillation (bruit de fond soustrait)", { "font-size": 6.5, "font-weight": 700, fill: "#23315a" });
    L.svg("rect", { x: 320, y: 414, width: 260, height: 74, rx: 3, fill: "#1d2a22", stroke: "#000" }, g);
    L.boitier(g, 620, 492, 220, 10, 26, { dessus: "#8b5e34", face: "#6d4a26" });
  }

  function fiche(g, e) {
    // Fiche des mesures au mur.
    g.replaceChildren();
    L.svg("rect", { x: 620, y: 60, width: 380, height: 150, rx: 2, fill: "#fbfbf7", stroke: "#b9b4a6", filter: "url(#ombre)" }, g);
    L.texte(g, 810, 78, "Fiche de mesures (1,00 g de carbone, Δt = 1 000 min)", { "font-size": 8.5, "font-weight": 700, fill: "#23315a" });
    Object.entries(FIOLES).forEach(([id, [nom]], k) => L.texte(g, 640, 108 + k * 30, `${nom} : ${e.mesures[id] ? `a = ${String(e.mesures[id]).replace(".", ",")} Bq/g` : "—"}`, { "font-size": 9, fill: "#222", "text-anchor": "start" }));
  }

  function ecran(g, e, texte) {
    // Écran du compteur : échantillon, durée, N, a (ou un message).
    g.replaceChildren();
    const t = (s, dy, k) => L.texte(g, 450, 414 + dy, s, { "font-size": k, "font-weight": 700, fill: "#7dff9a", "font-family": "monospace" });
    t(e.dans ? FIOLES[e.dans][0] : "puits vide", 16, 8); t(texte || "", 36, 9); t(e.dernier || "", 56, 9);
  }

  function fiole(g, e, id, k, maj) {
    // Fiole de carbone : on la glisse dans le puits, on l'en retire en la faisant glisser.
    const b = L.svg("g", { class: `fiole-${id}`, role: "button", "aria-label": FIOLES[id][0] }, g), p = place(k);
    const dessiner = () => {
      b.replaceChildren(); const q = e.dans === id ? { x: PUITS.x, y: PUITS.y - 20 } : p;
      L.svg("rect", { x: q.x - 9, y: q.y - 24, width: 18, height: 44, rx: 3, fill: "rgba(225,236,240,0.65)", stroke: "#7d98a2" }, b);
      L.svg("rect", { x: q.x - 7, y: q.y + 4, width: 14, height: 14, rx: 2, fill: FIOLES[id][2] }, b);
      L.svg("rect", { x: q.x - 10, y: q.y - 30, width: 20, height: 7, rx: 2, fill: "#2f3438" }, b);
      if (e.dans !== id) L.texte(b, q.x, q.y + 62, FIOLES[id][0], { "font-size": 6.5, "font-weight": 700, fill: "#f4f1e6" });
    };
    L.glissable(b, { soulever: false, debut: () => (e.dans === id ? { x: PUITS.x, y: PUITS.y - 20 } : { ...p }), deplacer: (q) => { if (e.dans === id) e.dans = null; Object.assign(p, q); dessiner(); },
      lacher: (q) => { if (Math.abs(q.x - PUITS.x) < 45 && Math.abs(q.y - PUITS.y) < 50 && !e.dans) e.dans = id; Object.assign(p, place(k)); dessiner(); maj(); } });
    dessiner();
    return dessiner;
  }

  L.poste_datation = function (g) {
    // Appareil, fiche, fioles, touche « Mesurer » (mesure de 2,5 s à l'écran) ; fait noté à chaque geste.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230), e = { dans: null, mesures: {}, dernier: "", occupe: false };
    appareil(g);
    const gf = L.svg("g", {}, g), ge = L.svg("g", {}, g), barre = L.svg("rect", { x: 330, y: 494, width: 0, height: 5, fill: "#7dff9a" }, g);
    const maj = (texte) => { fiche(gf, e); ecran(ge, e, texte); L.missions.noter("datation", { dans: e.dans, mesures: { ...e.mesures } }); };
    Object.keys(FIOLES).forEach((id, k) => fiole(g, e, id, k, () => maj()));
    L.bouton_texte(g, 450, 524, "Mesurer", () => {
      if (!e.dans || e.occupe) return maj(e.dans ? "mesure en cours" : "mettez une fiole");
      const id = e.dans, m = activite(FIOLES[id][1]) * DT, N = Math.round(m + Math.sqrt(m) * Math.sqrt(-2 * Math.log(1 - Math.random())) * Math.cos(2 * Math.PI * Math.random()));
      e.occupe = true; const t0 = performance.now();
      const avancer = () => { const f = Math.min(1, (performance.now() - t0) / 2500); barre.setAttribute("width", 240 * f); if (f < 1) return void requestAnimationFrame(avancer);
        e.occupe = false; e.mesures[id] = Number((N / DT).toPrecision(4)); e.dernier = `N = ${N} ; a = ${String(e.mesures[id]).replace(".", ",")} Bq/g`; maj("mesure terminée"); };
      maj("mesure : 1 000 min…"); requestAnimationFrame(avancer);
    });
    maj("mettez une fiole");
    return { pense_bete };
  };
})(window.Labo);
