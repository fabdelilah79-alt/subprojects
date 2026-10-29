/*
Rôle : paillasse « charge d'un condensateur à courant constant » : générateur de courant (0,05 à 0,5 mA), deux condensateurs
       C₁ = 100 µF et C₂ = 47 µF (touche « Décharger » : on relie un instant leurs bornes), multimètre en voltmètre,
       fiche de relevés avec chronomètre (Départ/Arrêt, Zéro) et touche « Noter » qui inscrit t et la tension lue.
       Horloge du circuit (pas de 1 ms). L'élève pose les fils.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_courant(g) -> { pense_bete } ; faits « montage_c » = { config (C1, C2, parallele, serie ou null), voltmetre },
          « releves » = [{ t (s), U (V), config, I (A) }], et ceux des appareils.
Utilisé par : simulation.js.
*/
(function (L) {
  const F = { x: 560, y: 330 };

  function config(c) {
    // Ce que le générateur de courant charge : C1 seul, C2 seul, les deux en parallèle ou en série.
    const n = (a, b) => c.meme_noeud(a, b), aux = (k) => (n("source.+", `${k}.1`) && n("source.−", `${k}.2`)) || (n("source.+", `${k}.2`) && n("source.−", `${k}.1`));
    const libre = (k) => !["1", "2"].some((b) => n(`${k}.${b}`, "source.+") || n(`${k}.${b}`, "source.−"));
    if (aux("C1") && aux("C2")) return "parallele";
    if (aux("C1") && libre("C2")) return "C1";
    if (aux("C2") && libre("C1")) return "C2";
    for (const [a, b] of [["C1", "C2"], ["C2", "C1"]]) for (const [p, q] of [["1", "2"], ["2", "1"]]) for (const [r, s] of [["1", "2"], ["2", "1"]]) if (n("source.+", `${a}.${p}`) && n(`${a}.${q}`, `${b}.${r}`) && n(`${b}.${s}`, "source.−") && !n(`${a}.${q}`, "source.+")) return "serie";
    return null;
  }

  function fiche(g, e) {
    // Feuille de relevés : chronomètre et tableau des mesures notées.
    g.replaceChildren();
    L.svg("rect", { x: F.x, y: F.y, width: 250, height: 230, rx: 2, fill: "#fbfbf7", stroke: "#b9b4a6", filter: "url(#ombre)" }, g);
    L.texte(g, F.x + 125, F.y + 16, "Relevés (t, U)", { "font-size": 9, "font-weight": 700, fill: "#23315a" });
    L.svg("rect", { x: F.x + 70, y: F.y + 24, width: 110, height: 22, rx: 3, fill: "#1d2a22" }, g);
    L.texte(g, F.x + 125, F.y + 40, `${e.temps().toFixed(1).replace(".", ",")} s`, { "font-size": 12, "font-weight": 700, fill: "#7dff9a", "font-family": "monospace" });
    e.releves.slice(-12).forEach((r, k) => L.texte(g, F.x + 30 + (k >= 6 ? 115 : 0), F.y + 104 + (k % 6) * 18, `${r.t.toFixed(1).replace(".", ",")} s : ${r.U.toFixed(2).replace(".", ",")} V`, { "font-size": 8.5, fill: "#222", "text-anchor": "start", "font-family": "monospace" }));
  }

  L.poste_courant = function (g) {
    // Matériel, horloge, chronomètre, relevés ; fait du montage noté quand il change.
    const { pense_bete } = L.decor_circuit(g, 0), c = L.circuit(g), h = L.horloge_circuit(c, { pas: 1e-3 });
    const src = L.source_courant(c, { id: "source", x: 40, y: 190 });
    const C1 = L.condensateur(c, { id: "C1", x: 300, y: 210, C: 1e-4, nom: "C₁" }), C2 = L.condensateur(c, { id: "C2", x: 430, y: 210, C: 4.7e-5, nom: "C₂" });
    const m = L.multimetre(c, { id: "multimetre", x: 820, y: 230, mode: "20V" });
    for (const [k, x] of [[C1, 346], [C2, 476]]) L.bouton_texte(g, x, 296, "Décharger", () => { k.u = 0; k.q = 0; c.calculer(); });
    const e = { marche: false, depart: 0, cumul: 0, releves: [], temps: () => e.cumul + (e.marche ? h.t - e.depart : 0) }, gf = L.svg("g", {}, g);
    let vu = "";
    const noter = () => L.missions.noter("releves", e.releves.slice());
    L.bouton_texte(g, F.x + 45, F.y + 66, "Chrono", () => { if (e.marche) e.cumul = e.temps(); else e.depart = h.t; e.marche = !e.marche; });
    L.bouton_texte(g, F.x + 125, F.y + 66, "Zéro", () => { e.cumul = 0; e.depart = h.t; e.releves = []; noter(); });
    L.bouton_texte(g, F.x + 205, F.y + 66, "Noter", () => { e.releves.push({ t: Math.round(e.temps() * 10) / 10, U: Math.round(m.valeur * 100) / 100, config: config(c), I: src.marche ? src.I : 0 }); noter(); });
    c.sur_calcul(() => { fiche(gf, e); const v = { config: config(c), voltmetre: c.meme_noeud("multimetre.VΩ", "source.+") && c.meme_noeud("multimetre.COM", "source.−") }, k = JSON.stringify(v); if (k !== vu) { vu = k; L.missions.noter("montage_c", v); } });
    c.calculer();
    return { pense_bete };
  };
})(window.Labo);
