/*
Rôle : paillasse « expérience de Franck et Hertz » : four (chauffe accélérée : constante de temps 6 s au lieu de quelques
       minutes), appareil d'alimentation et de mesure (interrupteur, consigne de température, bouton U2 de 0 à 30 V, afficheurs,
       inverseur MAN / RAMPE : en rampe, U2 va de 0 à 30 V en 6 s), interface et portable avec le logiciel d'acquisition ;
       documents au mur (principe, données).
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_franck_hertz(g) -> { pense_bete } ; faits « franck_hertz » = { allume, consigne, theta, mode, U2, IA, U2max_man },
          « acquisition_fh » = { etat, courbes [{ theta, maximums }], curseur { U, I } }, « documents_fh ».
Utilisé par : simulation.js (paillasse 1).
*/
(function (L) {
  const D = L.fh_dessin, SOL = 470, XF = 30, XU = 180;

  function documents(g) {
    // Principe de l'expérience (avec son schéma) et données.
    const schema = (h, x, y, k) => {
      L.svg("rect", { x: x - 30 * k, y: y - 10 * k, width: 60 * k, height: 20 * k, rx: 10 * k, fill: "none", stroke: "#1f3f66", "stroke-width": 0.7 * k }, h);
      for (const [dx, t] of [[-20, "K"], [10, "G"], [24, "A"]]) { L.svg("line", { x1: x + dx * k, y1: y - 7 * k, x2: x + dx * k, y2: y + 7 * k, stroke: "#1f3f66", "stroke-width": 0.8 * k, "stroke-dasharray": t === "G" ? `${1.2 * k} ${1 * k}` : "none" }, h); L.texte(h, x + dx * k, y - 9 * k, t, { "font-size": 3.6 * k, fill: "#1f3f66" }); }
      L.texte(h, x - 5 * k, y + 16 * k, "U2 : K → G", { "font-size": 3.4 * k, fill: "#555" }); L.texte(h, x + 18 * k, y + 22 * k, "U3 : G → A", { "font-size": 3.4 * k, fill: "#555" });
    };
    L.documents_mur(g, [
      { x: 270, y: 40, l: 250, h: 120, titre: "L'expérience de Franck et Hertz (1914)", dessin: schema, texte: "La cathode chaude K émet des électrons, accélérés par la tension U2 jusqu'à la grille G ; ils traversent la vapeur de mercure. Une faible tension U3 les freine entre G et l'anode A : seuls ceux qui ont encore assez d'énergie y arrivent (courant IA)." },
      { x: 270, y: 168, l: 250, h: 92, titre: "Données", texte: "Charge élémentaire : e = 1,60 × 10⁻¹⁹ C ; 1 eV = 1,60 × 10⁻¹⁹ J. Constante de Planck : h = 6,63 × 10⁻³⁴ J·s. Célérité de la lumière : c = 3,00 × 10⁸ m/s. Une lampe à vapeur de mercure émet une radiation ultraviolette de longueur d'onde λ = 253,7 nm." },
    ], "documents_fh");
  }

  function commandes(g, e, maj) {
    // Interrupteur, consigne du four, bouton U2, inverseur MAN / RAMPE sur la face avant.
    const f = SOL - D.UNITE.h, x = XU;
    const marche = L.svg("g", { class: "fh-marche", role: "switch", "aria-label": "Marche / arrêt" }, g);
    L.svg("rect", { x: x + 20, y: f + 22, width: 20, height: 26, rx: 3, fill: "#111" }, marche);
    const bascule = L.svg("rect", { x: x + 23, y: f + 25, width: 14, height: 10, rx: 2, fill: "#c62828" }, marche);
    L.texte(g, x + 30, f + 60, "I / O", { "font-size": 6, fill: "#dfe6ec" });
    L.glissable(marche, { soulever: false, debut: () => ({ x: 0, y: 0 }), toucher: () => { e.allume = !e.allume; bascule.setAttribute("y", e.allume ? f + 35 : f + 25); maj(); } });
    L.bouton_reglage(g, { x: x + 120, y: f + 72, min: 25, max: 210, pas: 5, valeur: e.consigne, unite: "°C", titre: "ϑ consigne", decimales: 0, sur_changement: (v) => { e.consigne = v; maj(); } });
    L.bouton_reglage(g, { x: x + 205, y: f + 72, min: 0, max: 30, pas: 0.1, valeur: 0, unite: "V", titre: "U2", decimales: 1, sur_changement: (v) => { e.U2_man = v; maj(); } });
    const mode = L.svg("g", { class: "fh-mode", role: "switch", "aria-label": "MAN / RAMPE" }, g);
    L.svg("rect", { x: x + 270, y: f + 62, width: 30, height: 14, rx: 7, fill: "#111" }, mode);
    const levier = L.svg("circle", { cx: x + 277, cy: f + 69, r: 5, fill: "url(#acier)" }, mode);
    L.texte(g, x + 262, f + 90, "MAN", { "font-size": 6, fill: "#dfe6ec" }); L.texte(g, x + 305, f + 90, "RAMPE", { "font-size": 6, fill: "#dfe6ec" });
    L.glissable(mode, { soulever: false, debut: () => ({ x: 0, y: 0 }), toucher: () => { e.mode = e.mode === "MAN" ? "RAMPE" : "MAN"; levier.setAttribute("cx", e.mode === "MAN" ? x + 277 : x + 293); e.phase = 0; maj(); } });
  }

  function cables(g) {
    // Interface, câble USB jusqu'au portable, sorties UA, U2/10 et masse reliées à l'interface, câble de la sonde du four.
    const f = SOL - D.UNITE.h;
    L.svg("path", { d: "M558 452 C540 446 520 430 514 412", fill: "none", stroke: "#2b2b2b", "stroke-width": 3 }, g);
    L.boitier(g, 556, 446, 100, 22, 14, { dessus: "#d9dcd8", face: "#3b4248" });
    L.texte(g, 606, 459, "INTERFACE", { "font-size": 6.5, "font-weight": 700, fill: "#23315a" });
    for (const [xa, xb, c] of [[XU + 262, 572, "#c62828"], [XU + 292, 590, "#c62828"], [XU + 316, 608, "#222"]]) {
      L.svg("circle", { cx: xb, cy: 476, r: 3, fill: "#111", stroke: "#888" }, g);
      L.svg("path", { d: `M${xa} ${f + 118} C${xa} ${f + 150} ${xb} ${f + 150} ${xb} ${476}`, fill: "none", stroke: c, "stroke-width": 2.2 }, g);
    }
    L.svg("path", { d: `M${XF + 61} ${SOL - 202} C${XF + 61} ${SOL - 230} ${XU + 20} ${SOL - 230} ${XU + 24} ${f - 22}`, fill: "none", stroke: "#2b2b2b", "stroke-width": 2 }, g);
  }

  L.poste_franck_hertz = function (g) {
    // Décor, matériel, commandes ; boucle de calcul (température, rampe, courant, acquisition).
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230), e = { allume: false, consigne: 25, theta: 25, mode: "MAN", U2: 0, U2_man: 0, IA: 0, phase: 0, U2max_man: 0 };
    const a = { courbes: [], curseur: 0, etat: "prête", message: "", pts: null };
    documents(g);
    L.cordon_secteur(g, { x: XU + D.UNITE.l - 20, y: SOL - D.UNITE.h - 10 }, { x: 962, y: 322 });
    const dalle = L.portable(g, { x: 530, y: 96, l: 400, h: 280, titre: "Franck et Hertz — acquisition" });
    D.four(g, XF, SOL); const g_lueur = L.svg("g", {}, g); D.unite(g, XU, SOL); D.cable(g, XF, XU, SOL);
    cables(g);
    const g_aff = L.svg("g", { "pointer-events": "none" }, g);
    const noter = () => L.missions.noter("franck_hertz", { allume: e.allume, consigne: e.consigne, theta: Math.round(e.theta), mode: e.mode, U2: Math.round(e.U2 * 10) / 10, IA: Math.round(e.IA * 100) / 100, U2max_man: e.U2max_man });
    const noter_acq = () => L.missions.noter("acquisition_fh", { etat: a.etat, courbes: a.courbes.map((c) => ({ theta: Math.round(c.theta), maximums: c.maximums })), curseur: { U: Math.round(a.curseur * 100) / 100, I: a.I } });
    commandes(g, e, noter);
    const tracer = L.fh_logiciel(g, dalle, {
      acquerir: () => { if (!e.allume || e.mode !== "RAMPE") { a.message = "Mettez l'appareil en marche, en mode RAMPE."; return; } e.phase = 0; a.pts = []; a.etat = "en cours"; a.message = "Acquisition…"; a.courbes.push({ theta: e.theta, pts: a.pts, maximums: [] }); if (a.courbes.length > 3) a.courbes.shift(); },
      effacer: () => { a.courbes = []; a.pts = null; a.etat = "prête"; a.message = ""; noter_acq(); },
      curseur: (U) => { a.curseur = U; a.I = tracer(a); noter_acq(); },
    });
    L.fh_boucle(e, a, { g_lueur, g_aff, tracer, noter, noter_acq });
    g.append(g.querySelector(".document-ouvert")); noter(); noter_acq();
    L.poste_franck_hertz.actif = { e, a };
    return { pense_bete };
  };
})(window.Labo);
