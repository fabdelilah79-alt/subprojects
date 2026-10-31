/*
Rôle : paillasse « spectres d'émission » : alimentation haute tension avec son tube spectral, coffret de tubes (hydrogène,
       hélium, mercure, néon, et un tube X sans étiquette), spectroscope pointé sur le capillaire ; documents au mur (niveaux
       d'énergie de l'hydrogène, données). On coupe la haute tension avant de changer de tube.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_tubes(g) -> { pense_bete } ; faits « tubes » = { tube (gaz), etiquette, allume }, « vus_tubes » [étiquettes
          des tubes allumés regardés au spectroscope], « documents_tubes ».
Utilisé par : simulation.js (paillasse 2).
*/
(function (L) {
  const T = L.tubes_dessin, SOL = 470;

  function documents(g) {
    // Niveaux d'énergie de l'hydrogène (diagramme) et données.
    const niveaux = (h, x, y, k) => L.niveaux_energie(h, x, y, k, { titre: "Niveaux de l'atome H", niveaux: [["n = 1", -13.6], ["n = 2", -3.4], ["n = 3", -1.51], ["n = 4", -0.85], ["n = ∞", 0]] });
    L.documents_mur(g, [
      { x: 270, y: 40, l: 260, h: 150, titre: "Niveaux d'énergie de l'atome d'hydrogène", dessin: niveaux, texte: "En = −13,6 / n² (eV). E1 = −13,6 ; E2 = −3,40 ; E3 = −1,51 ; E4 = −0,85 ; E5 = −0,54 ; E6 = −0,38 eV. En passant d'un niveau p à un niveau n plus bas, l'atome émet un photon d'énergie h·ν = Ep − En." },
      { x: 540, y: 40, l: 200, h: 112, titre: "Données", texte: "h = 6,63 × 10⁻³⁴ J·s ; c = 3,00 × 10⁸ m/s ; 1 eV = 1,60 × 10⁻¹⁹ J. Photon : E = h·ν = h·c / λ. 1 nm = 10⁻⁹ m." },
    ], "documents_tubes");
  }

  function interrupteur(g, e, maj) {
    // Interrupteur à bascule et voyant rouge de la haute tension.
    const f = SOL - 46, x = 700, b = L.svg("g", { class: "ht-marche", role: "switch", "aria-label": "Haute tension" }, g);
    L.svg("rect", { x: x + 14, y: f + 8, width: 18, height: 24, rx: 3, fill: "#111" }, b);
    const bascule = L.svg("rect", { x: x + 17, y: f + 11, width: 12, height: 9, rx: 2, fill: "#c62828" }, b);
    const voyant = L.svg("circle", { cx: x + 46, cy: f + 14, r: 3, fill: "#5a1a1a", stroke: "#111" }, g);
    L.texte(g, x + 46, f + 28, "HT", { "font-size": 6, fill: "#dfe6ec" });
    L.glissable(b, { soulever: false, debut: () => ({ x: 0, y: 0 }), toucher: () => { e.allume = !e.allume; bascule.setAttribute("y", e.allume ? f + 20 : f + 11); voyant.setAttribute("fill", e.allume ? "#ff3b30" : "#5a1a1a"); maj(); } });
  }

  function dessiner(gc, gt, e, changer) {
    // Tubes du coffret (touchables) et tube monté sur l'alimentation (lueur si la haute tension est en marche).
    gc.replaceChildren(); gt.replaceChildren();
    L.TUBES.forEach((d, k) => {
      if (e.monte === k) return;
      const p = T.place(k), el = L.svg("g", { class: `tube-${d.etiquette === "H₂" ? "H2" : d.etiquette}`, role: "button", "aria-label": `Tube ${d.etiquette}` }, gc);
      T.tube(el, p.x, p.y, 90, null, d.etiquette);
      L.svg("rect", { x: p.x - 88, y: p.y - 8, width: 176, height: 16, fill: "#000", opacity: 0.001 }, el);
      L.glissable(el, { soulever: false, debut: () => ({ x: 0, y: 0 }), toucher: () => changer(k) });
    });
    if (e.monte !== null) { const d = L.TUBES[e.monte]; T.tube(gt, T.AXE.x, (T.AXE.haut + T.AXE.bas) / 2, 0, e.allume ? L.SPECTRES[d.id].lueur : null, d.etiquette); }
  }

  L.poste_tubes = function (g) {
    // Décor, alimentation, coffret, spectroscope ; changer de tube exige d'avoir coupé la haute tension.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230), e = { monte: 0, allume: false }, vus = new Set();
    documents(g);
    L.cordon_secteur(g, { x: 870, y: SOL - 60 }, { x: 962, y: 322 });
    T.alimentation(g, 700, SOL); T.coffret(g);
    const gc = L.svg("g", {}, g), gt = L.svg("g", {}, g), alerte = L.texte(g, 790, 182, "", { "font-size": 8, "font-weight": 700, fill: "#c62828" });
    const noter = () => { const d = e.monte === null ? null : L.TUBES[e.monte]; L.missions.noter("tubes", { tube: d ? d.id : null, etiquette: d ? d.etiquette : null, allume: e.allume }); };
    const maj = () => { dessiner(gc, gt, e, changer); noter(); };
    function changer(k) {
      // Monte le tube k (le tube monté retourne dans le coffret), haute tension coupée.
      if (e.allume) { alerte.textContent = "Coupez la haute tension avant de changer de tube !"; return; }
      alerte.textContent = ""; e.monte = k; maj();
    }
    interrupteur(g, e, () => { alerte.textContent = ""; maj(); });
    const sp = L.spectroscope(g, { x: 600, y: 299, sol: SOL, sens: 1,
      lumiere: () => (e.allume && e.monte !== null ? { raies: L.SPECTRES[L.TUBES[e.monte].id].raies } : {}),
      vu: () => { if (e.allume && e.monte !== null) { vus.add(L.TUBES[e.monte].etiquette); L.missions.noter("vus_tubes", [...vus]); } } });
    maj(); L.missions.noter("vus_tubes", []); L.missions.noter("documents_tubes", []);
    g.append(g.querySelector(".document-ouvert")); sp.devant();
    return { pense_bete };
  };
})(window.Labo);
