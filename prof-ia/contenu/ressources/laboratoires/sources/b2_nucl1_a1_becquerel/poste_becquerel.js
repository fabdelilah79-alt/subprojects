/*
Rôle : paillasse « expérience de Becquerel (1896) » : plaque photographique enveloppée de papier noir sur un plateau,
       croix de cuivre, trois pots (sel d'uranium, uranium métal, sulfate de sodium). On pose la croix sur la plaque, on
       y verse un sel, on porte le plateau sur le rebord de la fenêtre (au soleil) ou dans le tiroir (à l'obscurité), on
       laisse passer trois jours, puis on développe : la plaque n'est noircie que sous un composé d'uranium, au soleil
       comme à l'obscurité, et la croix, qui arrête le rayonnement, apparaît en clair.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_becquerel(g) -> { pense_bete } ; fait « becquerel » = { sel, croix, lieu, jours, essais [{ sel, croix,
          lieu, jours, image }] }.
Utilisé par : simulation.js.
*/
(function (L) {
  const SELS = { uranium: ["sel d'uranium", "#d4dc3c", true], metal: ["uranium métal", "#8a8f94", true], sodium: ["sulfate de sodium", "#f4f4ef", false] };
  const LIEUX = { paillasse: { x: 610, y: 482 }, fenetre: { x: 385, y: 262 }, tiroir: null }, POTS = { uranium: 300, metal: 370, sodium: 440 };
  const croix = (g, x, y, k) => L.svg("path", { d: `M${x - 3 * k} ${y - 12 * k} h${6 * k} v${9 * k} h${12 * k} v${6 * k} h${-12 * k} v${9 * k} h${-6 * k} v${-9 * k} h${-12 * k} v${-6 * k} h${12 * k} Z`, fill: "#b86b35", stroke: "#6e3b17", "stroke-width": 0.6 }, g);

  function decor(g) {
    // Fenêtre ensoleillée et son rebord ; commode à tiroir posée sur la paillasse.
    L.svg("rect", { x: 300, y: 44, width: 170, height: 206, fill: "#cfe6f5", stroke: "#e8e4da", "stroke-width": 8 }, g);
    L.svg("path", { d: "M385 48 V246 M304 150 H466", stroke: "#e8e4da", "stroke-width": 5 }, g);
    L.svg("circle", { cx: 430, cy: 84, r: 16, fill: "#ffe680" }, g);
    L.svg("rect", { x: 290, y: 250, width: 190, height: 12, fill: "#e0dbcf", stroke: "#a9a395" }, g);
    L.svg("path", { d: "M330 250 L300 400 H470 L440 250 Z", fill: "#fff3b0", opacity: 0.18 }, g);
    L.boitier(g, 830, 350, 150, 16, 86, { dessus: "#8b5e34", face: "#6d4a26" });
    L.svg("rect", { x: 842, y: 384, width: 126, height: 40, rx: 2, fill: "#7a5330", stroke: "#4e331a" }, g);
    L.svg("rect", { x: 890, y: 400, width: 30, height: 6, rx: 3, fill: "url(#metal)" }, g);
    L.texte(g, 905, 448, "commode (tiroir fermé : obscurité)", { "font-size": 7, "font-weight": 700, fill: "#e8e2d4" });
  }

  function plateau(g, e) {
    // Plateau de bois, plaque dans son papier noir (9 × 12 cm), croix et tas de sel s'ils y sont.
    g.replaceChildren();
    const p = LIEUX[e.lieu];
    if (!p) return void L.texte(g, 905, 376, "plaque dans le tiroir", { "font-size": 7.5, "font-weight": 700, fill: "#f4f1e6" });
    const k = e.lieu === "fenetre" ? 0.6 : 1;
    L.ombre_sol(g, p.x, p.y + 30 * k, 80 * k, 6 * k, 0.4);
    L.svg("path", { d: `M${p.x - 78 * k} ${p.y - 26 * k} h${156 * k} l${8 * k} ${52 * k} h${-172 * k} Z`, fill: "url(#bois)", stroke: "#6d4a26" }, g);
    L.svg("path", { d: `M${p.x - 54 * k} ${p.y - 20 * k} h${108 * k} l${5 * k} ${40 * k} h${-118 * k} Z`, fill: "#16181b", stroke: "#000" }, g);
    if (e.croix) croix(g, p.x, p.y, k);
    if (e.sel) { L.svg("ellipse", { cx: p.x, cy: p.y, rx: 30 * k, ry: 12 * k, fill: SELS[e.sel][1], stroke: "#555", "stroke-width": 0.4, opacity: e.croix ? 0.85 : 1 }, g); for (let i = 0; i < 14; i++) L.svg("circle", { cx: p.x + Math.cos(i * 2.4) * 24 * k * (i % 3) / 2, cy: p.y + Math.sin(i * 2.4) * 9 * k * (i % 3) / 2, r: 1.6 * k, fill: "#fff", opacity: 0.5 }, g); }
  }

  function negatif(g, essai) {
    // Plaque développée (négatif) : voile noir sous un composé d'uranium, croix en clair ; rien sinon.
    g.replaceChildren();
    L.svg("rect", { x: 520, y: 40, width: 220, height: 210, rx: 3, fill: "#f3f2ec", stroke: "#9a9a90", filter: "url(#ombre)" }, g);
    L.texte(g, 630, 56, "Plaque développée", { "font-size": 8.5, "font-weight": 700, fill: "#23315a" });
    L.svg("rect", { x: 550, y: 66, width: 160, height: 120, fill: "#e9e7e0", stroke: "#888" }, g);
    if (!essai) return void L.texte(g, 630, 130, "aucune plaque développée", { "font-size": 7.5, fill: "#777" });
    if (essai.image) { L.svg("ellipse", { cx: 630, cy: 126, rx: 52, ry: 36, fill: "#1b1b1b", opacity: 0.9, filter: "url(#flou)" }, g); if (essai.croix) { const c = croix(g, 630, 126, 2); c.setAttribute("fill", "#e1ded5"); c.setAttribute("stroke", "none"); } }
    const t = [SELS[essai.sel] ? SELS[essai.sel][0] : "sans sel", essai.lieu === "fenetre" ? "au soleil" : "à l'obscurité", `${essai.jours} jours`, essai.croix ? "croix" : "sans croix"].join(" · ");
    L.texte(g, 630, 204, t, { "font-size": 7, fill: "#333" });
    L.texte(g, 630, 222, essai.image ? "plaque noircie" : "plaque intacte", { "font-size": 8, "font-weight": 700, fill: essai.image ? "#b71c1c" : "#2e7d32" });
  }

  function objets(g, e, maj) {
    // Pots de sel et croix que l'on fait glisser sur la plaque (plateau sur la paillasse) ; le plateau, que l'on porte.
    const sur_plaque = (p) => e.lieu === "paillasse" && Math.abs(p.x - LIEUX.paillasse.x) < 80 && Math.abs(p.y - LIEUX.paillasse.y) < 50;
    for (const cle in POTS) {
      const b = L.svg("g", { class: `pot-${cle}`, role: "button", "aria-label": SELS[cle][0] }, g), pos = { x: POTS[cle], y: 500 };
      const dessiner = () => { b.replaceChildren(); L.ombre_sol(b, pos.x, pos.y + 22, 22, 4, 0.4); L.svg("rect", { x: pos.x - 18, y: pos.y - 18, width: 36, height: 40, rx: 4, fill: "rgba(225,236,240,0.6)", stroke: "#7d98a2" }, b); L.svg("rect", { x: pos.x - 16, y: pos.y + 2, width: 32, height: 18, rx: 2, fill: SELS[cle][1] }, b); L.svg("rect", { x: pos.x - 19, y: pos.y - 24, width: 38, height: 8, rx: 2, fill: "#2f3438" }, b); L.texte(b, pos.x, pos.y + 34, SELS[cle][0], { "font-size": 6.5, "font-weight": 700, fill: "#f4f1e6" }); };
      L.glissable(b, { soulever: false, debut: () => ({ ...pos }), deplacer: (p) => { Object.assign(pos, p); dessiner(); }, lacher: (p) => { if (sur_plaque(p) && !e.developpee) e.sel = cle; Object.assign(pos, { x: POTS[cle], y: 500 }); dessiner(); maj(); } });
      dessiner();
    }
    const bc = L.svg("g", { class: "croix", role: "button", "aria-label": "Croix de cuivre" }, g), pc = { x: 750, y: 520 };
    const dc = () => { bc.replaceChildren(); if (!e.croix) { croix(bc, pc.x, pc.y, 1.2); L.svg("rect", { x: pc.x - 20, y: pc.y - 20, width: 40, height: 40, fill: "#000", opacity: 0 }, bc); } };
    L.glissable(bc, { soulever: false, debut: () => ({ ...pc }), deplacer: (p) => { Object.assign(pc, p); dc(); }, lacher: (p) => { if (sur_plaque(p) && !e.sel) e.croix = true; Object.assign(pc, { x: 750, y: 520 }); dc(); maj(); } });
    dc();
  }

  function porter(g, e, maj) {
    // Zone de prise du plateau : on le lâche sur le rebord de la fenêtre, sur la commode (tiroir) ou sur la paillasse.
    const b = L.svg("g", { class: "plateau", role: "button", "aria-label": "Plateau" }, g), poignee = () => { b.replaceChildren(); const p = LIEUX[e.lieu] || { x: 905, y: 400 }; L.svg("rect", { x: p.x - 86, y: p.y - 34, width: 172, height: 70, fill: "#000", opacity: 0 }, b); };
    L.glissable(b, { soulever: false, debut: () => ({ ...(LIEUX[e.lieu] || { x: 905, y: 400 }) }), deplacer: () => {}, lacher: (p) => { e.lieu = p.y < 320 && p.x < 500 ? "fenetre" : p.x > 820 && p.y < 470 ? "tiroir" : "paillasse"; poignee(); maj(); } });
    poignee();
    return poignee;
  }

  L.poste_becquerel = function (g) {
    // Décor, documents, plateau, objets, boutons (attendre, développer, nouvelle plaque) ; fait noté à chaque geste.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230), e = { sel: null, croix: false, lieu: "paillasse", jours: 0, developpee: null, essais: [] };
    decor(g); L.documents_becquerel(g);
    const gp = L.svg("g", { "pointer-events": "none" }, g), gn = L.svg("g", {}, g);
    const maj = () => { plateau(gp, e); negatif(gn, e.developpee); L.missions.noter("becquerel", JSON.parse(JSON.stringify({ sel: e.sel, croix: e.croix, lieu: e.lieu, jours: e.jours, essais: e.essais }))); };
    const poignee = porter(g, e, maj); objets(g, e, maj);
    L.bouton_texte(g, 520, 570, "3 jours plus tard", () => { e.jours += 3; maj(); });
    L.bouton_texte(g, 610, 570, "Développer", () => { if (e.developpee) return; e.developpee = { sel: e.sel, croix: e.croix, lieu: e.lieu, jours: e.jours, image: !!e.sel && SELS[e.sel][2] && e.jours >= 3 }; e.essais.push(e.developpee); maj(); });
    L.bouton_texte(g, 700, 570, "Nouvelle plaque", () => { Object.assign(e, { sel: null, croix: false, lieu: "paillasse", jours: 0, developpee: null }); poignee(); maj(); });
    maj();
    return { pense_bete };
  };
})(window.Labo);
