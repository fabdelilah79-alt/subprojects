/*
Rôle : paillasse « la bobine en courant continu et en courant variable » : générateur 6 V, interrupteur K, deux lampes
       6 V – 0,1 A, bobine de 1 000 spires (r = 10 Ω ; 50 mH, 0,5 H avec son noyau), résistance R = 10 Ω (égale à r),
       multimètre (ohmmètre). Horloge : pas de 10 µs, temps ralenti 100 fois. À chaque fermeture de K, on mesure le retard
       d'allumage de chaque lampe (éclat > 50 %) ; à chaque ouverture, la durée d'extinction de la lampe 1 (éclat < 5 %).
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_bobine(g) -> { pense_bete } ; faits « ohmmetre_bobine » = valeur lue (Ω) quand le multimètre mesure la
          bobine seule, « montage_lampes » (vrai si les deux branches sont câblées), « allumages » = [{ noyau, retard1, retard2 }]
          (ms), « extinctions » = [{ noyau, duree (ms) }] ; et ceux des appareils.
Utilisé par : simulation.js.
*/
(function (L) {
  function montage(c) {
    // Deux branches en dérivation après K : lampe 1 et bobine, lampe 2 et R ; G+ vers K.1, K.2 vers les lampes, retours au −.
    const n = (a, b) => c.meme_noeud(a, b), haut = n("generateur.+", "K.1");
    const b1 = n("K.2", "L1.1") && n("L1.2", "L.1") && n("L.2", "generateur.−"), b2 = n("K.2", "L2.1") && n("L2.2", "R.1") && n("R.2", "generateur.−");
    return haut && b1 && b2;
  }

  function surveiller(h, K, l1, l2, bob) {
    // Retards d'allumage après la fermeture de K, durée d'extinction après son ouverture (en ms, temps du circuit).
    const allumages = [], extinctions = [];
    let avant = K.ferme, t0 = 0, e = null;
    h.sur_pas((t) => {
      if (K.ferme !== avant) { avant = K.ferme; t0 = t; e = K.ferme ? { noyau: bob.noyau, retard1: null, retard2: null } : { noyau: bob.noyau, duree: null }; }
      if (!e) return;
      const ms = Math.round((t - t0) * 1e4) / 10;
      if (K.ferme) { if (e.retard1 === null && l1.eclat > 0.5) e.retard1 = ms; if (e.retard2 === null && l2.eclat > 0.5) e.retard2 = ms; if (e.retard1 !== null && e.retard2 !== null) { allumages.push(e); e = null; L.missions.noter("allumages", allumages.slice()); } }
      else if (l1.eclat < 0.05) { e.duree = ms; extinctions.push(e); e = null; L.missions.noter("extinctions", extinctions.slice()); }
    });
  }

  L.poste_bobine = function (g) {
    // Matériel, horloge ralentie ; faits du montage, de l'ohmmètre, des allumages et extinctions.
    const { pense_bete } = L.decor_circuit(g, 0), c = L.circuit(g), h = L.horloge_circuit(c, { pas: 1e-5, ralenti: 100 });
    L.texte(g, 520, 470, "Temps ralenti 100 fois", { "font-size": 8, "font-weight": 700, fill: "#f4f1e6" });
    L.generateur(c, { id: "generateur", x: 40, y: 190, E: 6, r: 0.5, I_max: 1, nom: "G" });
    const K = L.interrupteur(c, { id: "K", x: 280, y: 200 });
    const l1 = L.lampe(c, { id: "L1", x: 300, y: 300, U_n: 6, I_n: 0.1, etiquette: "L₁" }), l2 = L.lampe(c, { id: "L2", x: 300, y: 400, U_n: 6, I_n: 0.1, etiquette: "L₂" });
    const bob = L.bobine(c, { id: "L", x: 450, y: 290, L: 0.05, r: 10, noyau: true });
    L.resistance(c, { id: "R", x: 470, y: 400, R: 10, nom: "R" });
    const m = L.multimetre(c, { id: "multimetre", x: 820, y: 230, mode: "200Ω" });
    surveiller(h, K, l1, l2, bob);
    let vu = "";
    c.sur_calcul(() => {
      const seule = (c.meme_noeud("multimetre.VΩ", "L.1") && c.meme_noeud("multimetre.COM", "L.2")) || (c.meme_noeud("multimetre.VΩ", "L.2") && c.meme_noeud("multimetre.COM", "L.1"));
      const isolee = !["generateur.+", "generateur.−", "R.1", "R.2", "L1.2", "L2.2"].some((b) => c.meme_noeud(b, "L.1") || c.meme_noeud(b, "L.2"));
      const v = { ohm: seule && isolee && m.mode === "200Ω" ? Math.round(m.valeur * 10) / 10 : null, lampes: montage(c) }, k = JSON.stringify(v);
      if (k !== vu) { vu = k; L.missions.noter("ohmmetre_bobine", v.ohm); L.missions.noter("montage_lampes", v.lampes); }
    });
    c.calculer();
    return { pense_bete };
  };
})(window.Labo);
