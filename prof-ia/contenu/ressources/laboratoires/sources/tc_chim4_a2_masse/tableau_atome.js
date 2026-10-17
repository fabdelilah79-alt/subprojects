/*
Rôle : tableau magnétique « modèle de l'atome » accroché au mur : un noyau et les couches K, L, M tracés au feutre, trois
       réserves d'aimants (protons rouges +, neutrons gris, électrons bleus −). On prend un aimant dans une réserve et on le
       pose dans le noyau (protons, neutrons) ou sur une couche (électrons) ; un aimant posé se reprend, et retourne à sa
       réserve si on le lâche hors de l'atome. Une couche pleine refuse un électron de plus (K : 2, L : 8, M : 8 pour Z ≤ 18).
Reçoit : le groupe SVG de la paillasse et le nom du fait à noter.
Produit : Labo.tableau_atome(g, fait) -> { etat : { p, n, K, L, M } } ; fait « <fait> » = { p, n, e, K, L, M }.
Utilisé par : poste_atome.js.
*/
(function (L) {
  const O = { x: 600, y: 214 }, RN = 44, COUCHES = { K: [66, 2, 90], L: [104, 8, 90], M: [142, 8, 112.5] };
  const RESERVES = { p: { x: 330, y: 112, nom: "protons" }, n: { x: 330, y: 196, nom: "neutrons" }, e: { x: 330, y: 280, nom: "électrons" } };
  const COULEUR = { p: "#d23a2e", n: "#8a9096", e: "#2f6fc0" }, SIGNE = { p: "+", n: "", e: "−" };

  function aimant(parent, type) {
    // Aimant rond et bombé, couleur de la particule, signe de sa charge.
    const g = L.svg("g", { class: `aimant aimant-${type}`, role: "button", "aria-label": RESERVES[type].nom }, parent);
    const r = type === "e" ? 5 : 5.5;
    L.svg("circle", { r, fill: COULEUR[type], stroke: "#222", "stroke-width": 0.5 }, g);
    L.svg("circle", { cx: -1.6, cy: -1.8, r: r * 0.38, fill: "#fff", opacity: 0.35 }, g);
    if (SIGNE[type]) L.texte(g, 0, 2.6, SIGNE[type], { "font-size": 8, "font-weight": 700, fill: "#fff" });
    return g;
  }

  function places_noyau(n) {
    // Points d'un réseau serré (hexagonal), du centre vers le bord du noyau.
    const pts = [];
    for (let i = -5; i <= 5; i++) for (let j = -5; j <= 5; j++) { const x = 11 * (i + j / 2), y = 11 * j * 0.866; pts.push({ x, y, d: Math.hypot(x, y + 0.01 * x) }); }
    return pts.sort((a, b) => a.d - b.d).slice(0, n).map((q) => ({ x: O.x + q.x, y: O.y + q.y }));
  }

  function cadre(g) {
    // Tableau blanc, cadre aluminium, noyau et couches au feutre, réserves, règle de remplissage.
    L.svg("rect", { x: 244, y: 30, width: 562, height: 368, rx: 3, fill: "url(#metal-h)", filter: "url(#ombre)" }, g);
    L.svg("rect", { x: 250, y: 36, width: 550, height: 356, fill: "#fbfcfd" }, g);
    L.texte(g, 600, 52, "Modèle de l'atome", { class: "etiquette-carton", "font-size": 16 });
    L.svg("circle", { cx: O.x, cy: O.y, r: RN, fill: "#fdf1e6", stroke: "#9a5a2a", "stroke-width": 1.2, "stroke-dasharray": "4 3" }, g);
    L.texte(g, O.x, O.y + RN + 12, "noyau", { "font-size": 9, fill: "#9a5a2a" });
    for (const [nom, [r]] of Object.entries(COUCHES)) {
      L.svg("circle", { cx: O.x, cy: O.y, r, fill: "none", stroke: "#1f4f8f", "stroke-width": 1.2 }, g);
      L.texte(g, O.x + r * 0.71 + 6, O.y - r * 0.71 - 2, nom, { class: "etiquette-carton", "font-size": 15, fill: "#1f4f8f" });
    }
    for (const [type, r] of Object.entries(RESERVES)) {
      L.svg("rect", { x: r.x - 54, y: r.y - 26, width: 108, height: 58, rx: 4, fill: "#eef1f3", stroke: "#b9c1c6" }, g);
      L.texte(g, r.x, r.y + 26, r.nom, { "font-size": 9, "font-weight": 700, fill: "#33414b" });
      for (const [dx, dy] of [[-16, 2], [0, -6], [16, 2], [-8, 10], [8, 10]]) L.placer(aimant(g, type), r.x + dx, r.y - 4 + dy);
    }
    L.svg("rect", { x: 272, y: 330, width: 116, height: 52, rx: 3, fill: "#fff8d0", stroke: "#d8c26a" }, g);
    ["Au plus :", "K : 2 électrons", "L : 8 électrons", "M : 8 (si Z ≤ 18)"].forEach((t, i) => L.texte(g, 280, 342 + i * 11, t, { "font-size": 8, "text-anchor": "start", fill: "#3a3000", "font-weight": i ? 400 : 700 }));
  }

  function poser_aimant(etat, type, q, dire) {
    // Règles de pose : nucléons dans le noyau, électrons sur une couche non pleine ; ailleurs, l'aimant retourne à sa réserve.
    const d = Math.hypot(q.x - O.x, q.y - O.y);
    dire("");
    if (d > COUCHES.M[0] + 22) return;
    if (type !== "e") { if (d <= RN + 6) ajouter(etat, type, dire); else dire(`Les ${RESERVES[type].nom} sont dans le noyau.`); return; }
    if (d <= RN + 6) return dire("Les électrons ne sont pas dans le noyau : ils sont autour, sur les couches.");
    const [nom, [, max]] = Object.entries(COUCHES).sort((a, b) => Math.abs(a[1][0] - d) - Math.abs(b[1][0] - d))[0];
    ajouter(etat, nom, dire);
  }

  function ajouter(etat, ou, dire) {
    // Ajoute un nucléon au noyau (40 au plus sur ce tableau) ou un électron sur une couche qui n'est pas pleine.
    if (COUCHES[ou] && etat[ou] >= COUCHES[ou][1]) return dire(`La couche ${ou} est pleine : ${COUCHES[ou][1]} électrons au plus.`);
    if (!COUCHES[ou] && etat.p + etat.n >= 40) return dire("Le noyau de ce tableau ne peut pas recevoir plus de 40 nucléons.");
    etat[ou]++;
  }

  function raccourcis(g, etat, dire, maj) {
    // Toucher une couche y ajoute un électron ; « Tout ranger » remet tous les aimants dans leurs réserves.
    for (const [nom, [r]] of Object.entries(COUCHES)) {
      const anneau = L.svg("circle", { cx: O.x, cy: O.y, r, fill: "none", stroke: "#000", "stroke-opacity": 0, "stroke-width": 14, "pointer-events": "stroke", class: `couche-${nom}` }, g);
      L.glissable(anneau, { soulever: false, debut: () => ({ x: 0, y: 0 }), toucher: () => { dire(""); ajouter(etat, nom, dire); maj(); } });
    }
    const b = L.svg("g", { class: "tout-ranger", role: "button", "aria-label": "Tout ranger" }, g);
    L.svg("rect", { x: 716, y: 362, width: 76, height: 22, rx: 11, fill: "#e9eef2", stroke: "#8a96a0" }, b);
    L.texte(b, 754, 376, "Tout ranger", { "font-size": 9, "font-weight": 700, fill: "#23315a" });
    L.glissable(b, { soulever: false, debut: () => ({ x: 0, y: 0 }), toucher: () => { Object.keys(etat).forEach((k) => { etat[k] = 0; }); dire(""); maj(); } });
  }

  L.tableau_atome = function (g, fait) {
    // Construit le tableau ; chaque geste met à jour l'état et le fait noté.
    const etat = { p: 0, n: 0, K: 0, L: 0, M: 0 };
    cadre(g);
    const anneaux = L.svg("g", {}, g), poses = L.svg("g", {}, g), main = L.svg("g", {}, g), bulle = L.svg("g", { "pointer-events": "none" }, g);
    const dire = (t) => { bulle.replaceChildren(); if (t) { L.svg("rect", { x: 430, y: 62, width: 340, height: 20, rx: 4, fill: "#fff6e0", stroke: "#d08a1a" }, bulle); L.texte(bulle, 600, 72, t, { "font-size": 8, "font-weight": 700, fill: "#6b3d00" }); } };
    const noter = () => L.missions.noter(fait, { ...etat, e: etat.K + etat.L + etat.M });
    const poser = (type, q) => poser_aimant(etat, type, q, dire);
    const prendre = (type, depart) => {
      // Un aimant saisi suit le doigt, puis se pose (ou retourne à sa réserve).
      const a = aimant(main, type); L.placer(a, depart.x, depart.y);
      return { a, deplacer: (q) => L.placer(a, q.x, q.y), lacher: (q) => { a.remove(); poser(type, q); dessiner(); noter(); } };
    };
    let en_main = null;
    const glissable = (el, type, depart, avant, toucher) => L.glissable(el, { soulever: false, toucher, debut: () => ({ ...depart }), saisir: () => { avant?.(); en_main = prendre(type, depart); if (avant) dessiner(); }, deplacer: (q) => en_main.deplacer(q), lacher: (q) => en_main.lacher(q), annuler: () => en_main.lacher({ x: -999, y: 0 }) });
    function dessiner() {
      // Redessine les aimants posés : nucléons mêlés dans le noyau, électrons sur leurs couches.
      poses.replaceChildren();
      const A = etat.p + etat.n, places = places_noyau(A);
      let k_p = 0;
      places.forEach((q, i) => {
        const type = k_p < etat.p && (i - k_p >= etat.n || (k_p + 0.5) / etat.p <= (i + 0.5) / A) ? "p" : "n";
        if (type === "p") k_p++;
        const el = aimant(poses, type); L.placer(el, q.x, q.y); glissable(el, type, q, () => etat[type]--);
      });
      for (const [nom, [r, , a0]] of Object.entries(COUCHES)) for (let i = 0; i < etat[nom]; i++) {
        const a = ((a0 + (i * 360) / COUCHES[nom][1]) * Math.PI) / 180, q = { x: O.x + r * Math.cos(a), y: O.y - r * Math.sin(a) };
        const el = aimant(poses, "e"); L.placer(el, q.x, q.y); glissable(el, "e", q, () => etat[nom]--);
      }
    }
    for (const [type, r] of Object.entries(RESERVES)) {
      const zone = L.svg("rect", { x: r.x - 54, y: r.y - 26, width: 108, height: 46, fill: "#000", opacity: 0, class: `reserve-${type}` }, g);
      glissable(zone, type, { x: r.x, y: r.y - 4 }, null, () => { if (type === "e") return dire("Faites glisser l'électron sur une couche, ou touchez la couche."); dire(""); ajouter(etat, type, dire); dessiner(); noter(); });
    }
    raccourcis(anneaux, etat, dire, () => { dessiner(); noter(); });
    g.append(main, bulle);
    dessiner(); noter();
    return { etat };
  };
})(window.Labo);
