/*
Rôle : paillasse de la loi de Joule : alimentation réglable, interrupteur, ampèremètre, résistance chauffante (R = 4,0 Ω)
       plongée dans un calorimètre (C = 150 J/K) contenant 200 g d'eau, thermomètre électronique, agitateur ;
       chronomètre de chauffe (il compte tant que le courant passe ; temps accéléré × 10) ; « Eau neuve » remet de l'eau à
       20,0 °C. Chaque chauffe note un essai : I (lu sur l'ampèremètre en série, s'il est resté constant), durée, θ0, θ1.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_joule(g) -> { pense_bete } ; fait « joule » = { chauffe, t (s), theta (°C), essais: [{ I, t, theta0, theta1 }] }.
Utilisé par : simulation.js.
*/
(function (L) {
  const VITE = 10, X = 700, BASE = 556, R = 4, arrondi = (x) => Math.round(x * 10) / 10;
  const mode = (m) => L.MULTIMETRE_MODES.find((k) => k.nom === m.mode) || {};

  function courant_lu(ampere, rc) {
    // Intensité lue sur l'ampèremètre s'il mesure bien le courant de la résistance ; sinon null.
    if (mode(ampere).type !== "A" || ampere.depasse) return null;
    const I = Number(Math.abs(parseFloat(ampere.lecture) / mode(ampere).facteur).toFixed(6));
    return Math.abs(I - Math.abs(rc.i)) <= 0.01 * Math.abs(rc.i) + 0.006 ? I : null;
  }

  function chronometre(g) {
    // Boîtier du chronomètre de chauffe ; renvoie le texte de son afficheur.
    L.svg("rect", { x: 800, y: 410, width: 160, height: 62, rx: 6, fill: "#2c3e50", stroke: "#111" }, g);
    L.texte(g, 880, 422, "CHRONOMÈTRE DE CHAUFFE", { "font-size": 7.5, "font-weight": 700, fill: "#e8ecef" });
    L.svg("rect", { x: 815, y: 430, width: 130, height: 24, rx: 3, fill: "#1d2a22" }, g);
    L.texte(g, 880, 465, "temps accéléré × 10", { "font-size": 6.5, fill: "#cfd6db" });
    return L.texte(g, 880, 447, "0 s", { "font-size": 12, "font-weight": 700, fill: "#7dff9a", "font-family": "monospace" });
  }

  function suivre(e, v, rc, ampere) {
    // Début de chauffe quand le courant passe, fin quand il est coupé : l'essai est noté.
    if (Math.abs(rc.i) > 0.05) {
      if (!e.chauffe) Object.assign(e, { chauffe: true, t: 0, theta0: arrondi(v.theta), lus: [] });
      e.lus.push(courant_lu(ampere, rc));
    } else if (e.chauffe) {
      e.chauffe = false;
      const ok = e.lus.every((I) => I !== null && Math.abs(I - e.lus[0]) < 0.006);
      e.essais.push({ I: ok ? e.lus[0] : null, t: Math.round(e.t), theta0: e.theta0, theta1: arrondi(v.theta) });
    }
  }

  L.poste_joule = function (g) {
    // Décor, calorimètre (sous les câbles), circuit, chronomètre ; boucle d'animation ; faits notés 4 fois par seconde.
    const { pense_bete } = L.decor_circuit(g, 0), fond = L.svg("g", {}, g), v = L.vase_modele({ C: 150, pertes_s: 20000 });
    v.verser(200, L.vase_modele.C_EAU, 20, "eau");
    const vase = L.vase_dessin(fond, v, { x: X, base: BASE, type: "calorimetre", afficheur: { x: 880, y: 320 } });
    const c = L.circuit(g);
    L.generateur(c, { x: 40, y: 196, E: 6, I_max: 3, lettres: ["N", "P"], reglable: true });
    L.interrupteur(c, { id: "k", x: 250, y: 230 });
    const ampere = L.multimetre(c, { id: "A", x: 350, y: 60, etiquette: "A" });
    const rc = L.resistance_chauffante(c, { x: 560, y: 268, R, sol: BASE, xd: 652, haut: vase.haut });
    const ecran = chronometre(g), e = { chauffe: false, t: 0, theta0: 20, lus: [], essais: [] };
    L.bouton_texte(g, 880, 510, "Eau neuve", () => { if (e.chauffe) return; v.vider(20); v.verser(200, L.vase_modele.C_EAU, 20, "eau"); });
    let avant = null;
    const image = (t) => {
      const dt = avant === null ? 0 : Math.min(0.05, (t - avant) / 1000) * VITE; avant = t;
      v.P = rc.P; v.tic(dt); suivre(e, v, rc, ampere); if (e.chauffe) e.t += dt;
      vase.dessiner(); ecran.textContent = `${Math.floor(e.t)} s`;
      requestAnimationFrame(image);
    };
    requestAnimationFrame(image);
    setInterval(() => L.missions.noter("joule", { chauffe: e.chauffe, t: Math.round(e.t), theta: arrondi(v.theta), essais: e.essais.map((x) => ({ ...x })) }), 250);
    c.calculer();
    return { pense_bete };
  };
})(window.Labo);
