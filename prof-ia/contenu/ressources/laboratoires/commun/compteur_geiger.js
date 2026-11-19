/*
Rôle : compteur d'impulsions relié à un tube de Geiger-Müller (sans détails techniques) : on choisit la durée de comptage
       (10, 30 ou 60 s), on lance un comptage ; en mode « série », les comptages s'enchaînent et sont tous gardés en
       mémoire ; une horloge accélérée (× 20) fait passer le temps du laboratoire plus vite. Chaque impulsion allume le
       voyant ; le câble du tube se branche sur la prise « entrée tube ». Les désintégrations sont aléatoires : pendant un petit intervalle dt, le nombre d'impulsions suit une loi de
       Poisson de moyenne taux(t)·dt (taux en impulsions par seconde, donné par le banc de comptage). La mémoire est
       imprimée sur un relevé affiché au mur (numéro, début du comptage compté depuis « Effacer », N) ; chaque mesure garde
       aussi ce qui était posé sur le banc.
Reçoit : le groupe SVG et { x, y (coin du boîtier), taux(t) (t : temps du laboratoire, s), etiquette() (ce qui est posé),
         releve { x, y }, fait }.
Produit : Labo.compteur_geiger(g, reglage) -> c { t (s), duree, serie [{ t, N, duree, ... }] } ; fait « <fait> » = { duree,
          en_cours, N, ecoule, serie, acceleration }.
Utilisé par : banc_comptage.js.
*/
(function (L) {
  const DUREES = [10, 30, 60];

  function poisson(m) {
    // Tirage d'un nombre aléatoire de moyenne m (loi de Poisson ; approximation normale pour m grand).
    if (m > 30) return Math.max(0, Math.round(m + Math.sqrt(m) * Math.sqrt(-2 * Math.log(1 - Math.random())) * Math.cos(2 * Math.PI * Math.random())));
    let k = 0, p = Math.random();
    const e = Math.exp(-m);
    while (p > e) { k++; p *= Math.random(); }
    return k;
  }

  function boitier(g, x, y) {
    // Boîtier gris, écran à cristaux liquides, voyant, câble vers le tube ; renvoie l'écran et le voyant.
    L.boitier(g, x, y, 250, 14, 146, { dessus: "#cfd5d9", face: "#46525a" });
    L.texte(g, x + 125, y + 8, "COMPTEUR", { "font-size": 7, "font-weight": 700, fill: "#23315a" });
    L.svg("rect", { x: x + 14, y: y + 24, width: 192, height: 50, rx: 3, fill: "#1d2a22", stroke: "#000" }, g);
    const voyant = L.svg("circle", { cx: x + 226, cy: y + 40, r: 6, fill: "#5a1a1a", stroke: "#111" }, g);
    L.texte(g, x + 226, y + 58, "impulsion", { "font-size": 6, fill: "#e8ecef" });
    L.svg("circle", { cx: x + 222, cy: y + 124, r: 7, fill: "url(#metal)", stroke: "#111" }, g);
    L.svg("circle", { cx: x + 222, cy: y + 124, r: 2.5, fill: "#111" }, g);
    L.texte(g, x + 222, y + 141, "entrée tube", { "font-size": 6, fill: "#e8ecef" });
    return { ecran: L.svg("g", {}, g), voyant };
  }

  function afficher(ecran, c, x, y) {
    // Lecture : nombre d'impulsions, temps écoulé, mode série, horloge.
    ecran.replaceChildren();
    const t = (texte, dy, taille) => L.texte(ecran, x + 110, y + dy, texte, { "font-size": taille, "font-weight": 700, fill: "#7dff9a", "font-family": "monospace" });
    t(`N = ${c.N}`, 22, 13);
    t(`${c.ecoule.toFixed(1).replace(".", ",")} s / ${c.duree} s${c.en_cours ? "" : " (arrêt)"}`, 36, 8);
    t(`${c.repeter ? `série : ${c.serie.length} mesures` : "comptage unique"}  ·  horloge × ${c.acceleration}`, 47, 7);
  }

  function releve(g, c, r) {
    // Relevé de la mémoire : les 20 dernières mesures, en deux colonnes (n°, début t en s, durée, N).
    g.replaceChildren();
    L.svg("rect", { x: r.x, y: r.y, width: 420, height: 196, rx: 2, fill: "#fbfbf7", stroke: "#b9b4a6", filter: "url(#ombre)" }, g);
    L.texte(g, r.x + 210, r.y + 16, "Relevé du compteur (t compté depuis « Effacer »)", { "font-size": 8.5, "font-weight": 700, fill: "#23315a" });
    const debut = Math.max(0, c.serie.length - 20);
    for (let col = 0; col < 2; col++) {
      const x = r.x + 20 + col * 205;
      ["n°", "t (s)", "durée (s)", "N"].forEach((e, k) => L.texte(g, x + k * 48, r.y + 34, e, { "font-size": 7.5, "font-weight": 700, fill: "#333", "text-anchor": "start" }));
      for (let i = 0; i < 10; i++) { const m = c.serie[debut + col * 10 + i]; if (m) [debut + col * 10 + i + 1, m.t, m.duree, m.N].forEach((v, k) => L.texte(g, x + k * 48, r.y + 50 + i * 14, String(v).replace(".", ","), { "font-size": 8, fill: "#222", "font-family": "monospace", "text-anchor": "start" })); }
    }
  }

  function boutons(g, c, x, y, maj) {
    // Durée, départ/arrêt, série, horloge, effacer la mémoire.
    const b = (k, ligne, texte, action) => L.bouton_texte(g, x + 48 + k * 78, y + 94 + ligne * 28, texte, () => { action(); maj(); });
    b(0, 0, "Durée", () => { if (!c.en_cours) c.duree = DUREES[(DUREES.indexOf(c.duree) + 1) % 3]; });
    b(1, 0, "Départ", () => { c.en_cours = !c.en_cours; if (c.en_cours) { c.N = 0; c.ecoule = 0; c.debut = c.t; } });
    b(2, 0, "Série", () => { c.repeter = !c.repeter; });
    b(0, 1, "Horloge", () => { c.acceleration = c.acceleration === 1 ? 20 : 1; });
    b(1, 1, "Effacer", () => { c.serie = []; c.zero = c.t; });
  }

  L.compteur_geiger = function (g, { x, y, taux, etiquette = () => ({}), releve: r = { x: 290, y: 30 }, fait = "compteur" }) {
    // Boîtier, boutons, relevé, boucle de comptage, fait noté quatre fois par seconde.
    const c = { t: 0, zero: 0, duree: 10, en_cours: false, repeter: false, acceleration: 1, N: 0, ecoule: 0, debut: 0, serie: [] }, { ecran, voyant } = boitier(g, x, y), gr = L.svg("g", {}, g);
    const noter = () => L.missions.noter(fait, { duree: c.duree, en_cours: c.en_cours, N: c.N, ecoule: Math.round(c.ecoule * 10) / 10, serie: c.serie.slice(-40), acceleration: c.acceleration });
    const maj = () => { afficher(ecran, c, x, y + 24); if (gr.n !== c.serie.length + c.zero) { gr.n = c.serie.length + c.zero; releve(gr, c, r); } noter(); };
    boutons(g, c, x, y, maj);
    let avant = performance.now(), dernier = 0, eclair = 0;
    const pas = (maintenant) => {
      const dt = Math.min(0.1, (maintenant - avant) / 1000) * c.acceleration; avant = maintenant; c.t += dt;
      if (c.en_cours) {
        const reste = Math.min(dt, c.duree - c.ecoule), k = poisson(taux(c.t) * reste);
        c.N += k; c.ecoule += reste; if (k) eclair = maintenant;
        if (c.ecoule >= c.duree - 1e-9) { c.serie.push({ t: Math.round((c.debut - c.zero) * 10) / 10, N: c.N, duree: c.duree, ...etiquette() }); if (c.repeter) { c.N = 0; c.ecoule = 0; c.debut = c.t; } else c.en_cours = false; }
      }
      voyant.setAttribute("fill", maintenant - eclair < 60 ? "#ff3b30" : "#5a1a1a");
      if (maintenant - dernier > 250) { dernier = maintenant; maj(); }
      requestAnimationFrame(pas);
    };
    requestAnimationFrame(pas); maj();
    return c;
  };
})(window.Labo);
