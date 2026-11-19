/*
Rôle : paillasse du volant d'inertie : on règle la vitesse du moteur (0 à 300 tr/min), on lance le disque (« Lancer » :
       le moteur l'entraîne), puis on freine (« Freiner » : le moteur est débrayé et le patin exerce un couple de frottement
       de moment constant Mf = 0,020 N·m). Le disque s'arrête après n tours : ½·J·ω² = Mf·2π·n. On change de disque
       (A ou B) quand il est arrêté, en posant l'autre sur l'axe.
Reçoit : le groupe SVG de la paillasse ; les gestes de l'élève (bouton de réglage, boutons, disque de rechange).
Produit : Labo.poste_volant(g) -> { pense_bete } ; fait « volant » = { disque, J, N (tr/min), n (tours), mode,
          essais: [{ disque, J, N (tr/min au début du freinage), n (tours) }] }.
Utilisé par : simulation.js (paillasse 2).
*/
(function (L) {
  const V = L.volant_dessin, MF = 0.02, REPOS = { x: 705, y: 548 }, TOUR = 2 * Math.PI;

  function avancer(e, dt) {
    // Moteur : ω tend vers la consigne ; frein : décélération Mf/J et comptage des tours jusqu'à l'arrêt.
    const J = V.DISQUES[e.monte].J;
    if (e.mode === "moteur") e.omega += ((e.consigne * TOUR) / 60 - e.omega) * (1 - Math.exp(-dt / 0.6));
    if (e.mode === "frein") {
      const t0 = Math.min(dt, (e.omega * J) / MF), w = t0 < dt ? 0 : e.omega - (MF / J) * dt;
      e.n += (((e.omega + w) / 2) * t0) / TOUR;
      e.omega = w;
      if (!w) { e.mode = "arret"; e.essais.push({ disque: e.monte, J, N: e.N0, n: Math.round(e.n * 10) / 10 }); }
    }
    e.theta += e.omega * dt;
  }

  function commandes(g, e) {
    // Boîtier : consigne de vitesse, boutons Lancer et Freiner.
    L.svg("rect", { x: 690, y: 284, width: 200, height: 112, rx: 6, fill: "#2c3e50", stroke: "#111" }, g);
    L.texte(g, 790, 296, "COMMANDE DU MOTEUR", { "font-size": 7, "font-weight": 700, fill: "#e8ecef" });
    L.bouton_reglage(g, { x: 745, y: 356, min: 0, max: 300, pas: 5, valeur: 0, unite: "tr/min", titre: "consigne", decimales: 0, sur_changement: (v) => { e.consigne = v; } });
    L.bouton_texte(g, 840, 330, "Lancer", () => { if (e.mode !== "frein") e.mode = "moteur"; });
    L.bouton_texte(g, 840, 362, "Freiner", () => { if (e.mode === "moteur" && e.omega > 0.5) { e.mode = "frein"; e.n = 0; e.N0 = Math.round((e.omega * 60) / TOUR); } });
  }

  function gestes(c, e) {
    // Poser le disque de rechange sur l'axe (disque arrêté) : les deux disques sont échangés.
    L.glissable(c, {
      soulever: false,
      debut: (ev) => (ev.target.closest(".disque-rechange") && !e.omega && e.mode !== "moteur" ? { ...REPOS } : null),
      deplacer: (p) => { e.tenu = p; },
      lacher: (p) => { e.tenu = null; if (Math.hypot(p.x - V.C.x, p.y - V.C.y) < 120) { [e.monte, e.rechange] = [e.rechange, e.monte]; e.n = 0; } },
    });
  }

  L.poste_volant = function (g) {
    // Décor, commandes, calque animé (disque, patin, rechange, afficheurs) ; faits notés 4 fois par seconde.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230);
    V.fond(L.svg("g", {}, g));
    const e = { monte: "A", rechange: "B", theta: 0, omega: 0, consigne: 0, mode: "arret", n: 0, N0: 0, tenu: null, essais: [] };
    commandes(g, e);
    const c = L.svg("g", {}, g);
    gestes(c, e);
    let avant = null;
    const image = (t) => {
      avancer(e, avant === null ? 0 : Math.min(0.04, (t - avant) / 1000)); avant = t;
      c.replaceChildren();
      V.disque(c, e.monte, e.theta, e.omega);
      V.patin(c, V.DISQUES[e.monte].R, e.mode === "frein");
      V.rechange(c, e.rechange, e.tenu || REPOS);
      V.afficheurs(c, (e.omega * 60) / TOUR, e.n);
      requestAnimationFrame(image);
    };
    requestAnimationFrame(image);
    setInterval(() => L.missions.noter("volant", { disque: e.monte, J: V.DISQUES[e.monte].J, N: Math.round((e.omega * 60) / TOUR), n: Math.round(e.n * 10) / 10, mode: e.mode, essais: e.essais.slice() }), 250);
    return { pense_bete };
  };
})(window.Labo);
