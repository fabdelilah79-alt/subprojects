/*
Rôle : réactifs et échantillons des tests de chimie, ajoutés au catalogue des liquides, et règles des tests : pH d'une phase,
       phénolphtaléine (incolore sous pH 8,2, rose au-delà), liqueur de Fehling (bleue ; chauffée au-dessus de 60 °C avec du
       glucose, elle donne un précipité qui passe du jaune-orangé au rouge brique, et la solution perd son bleu).
Reçoit : le contenu d'un récipient (liquide_contenu.js) ; pour le chauffage, la température du bain et la durée.
Produit : de nouvelles entrées dans Labo.LIQUIDES ; Labo.REGLES_COULEUR ; Labo.pH_phase(phase) ; Labo.pH_liquide(nom) ;
          Labo.chauffer_contenu(contenu, T_bain, dt) (contenu.T, contenu.avance) ; Labo.convertir_liquide(contenu, de, vers, V).
Utilisé par : les simulations de chimie (tests de détection).
*/
(function (L) {
  const aq = (nom, rgb, alpha, pH, autres = {}) => ({ nom, d: 1.0, rgb, alpha, classe: "aqueuse", pH, ...autres });
  Object.assign(L.LIQUIDES, {
    jus_orange: aq("jus d'orange", [245, 158, 40], 0.82, 4, { d: 1.04, glucose: true }),
    vinaigre: aq("vinaigre blanc", [246, 243, 228], 0.3, 3),
    eau_savonneuse: aq("eau savonneuse", [238, 238, 232], 0.6, 10),
    eau_chaux: aq("eau de chaux", [234, 242, 246], 0.34, 12),
    solution_glucose: aq("solution de glucose", [232, 241, 246], 0.3, 7, { glucose: true }),
    phenolphtaleine: aq("phénolphtaléine", [240, 245, 248], 0.3, null),
    fehling: aq("liqueur de Fehling", [22, 82, 200], 0.85, 13, { d: 1.1 }),
    oxyde_cuivre: { nom: "précipité", d: 6, rgb: [168, 48, 26], alpha: 0.95, classe: "precipite" },
    eau_salee: { nom: "eau salée", d: 1.2, rgb: [230, 240, 246], alpha: 0.32, classe: "aqueuse", pH: 7 },
  });
  L.LIQUIDES.eau.pH = 7;
  L.LIQUIDES.eau_iodee.pH = 7;

  L.pH_liquide = (nom) => L.LIQUIDES[nom].pH ?? null;
  L.pH_phase = function (ph) {
    // pH du liquide majoritaire ; assez de liqueur de Fehling (très basique) l'emporte.
    if ((ph.liquides.fehling || 0) > 0.15 * ph.V) return 13;
    const p = Object.entries(ph.liquides).filter(([n]) => L.LIQUIDES[n].pH !== null && L.LIQUIDES[n].pH !== undefined).sort((a, b) => b[1] - a[1])[0];
    return p ? L.LIQUIDES[p[0]].pH : null;
  };

  const vers = (a, b, k) => a.map((v, i) => v + (b[i] - v) * Math.max(0, Math.min(1, k)));
  L.REGLES_COULEUR = [
    (ph, rgb, alpha) => {
      // Phénolphtaléine : rose dans une solution basique (pH ≥ 8,2).
      const pH = L.pH_phase(ph);
      if (!(ph.liquides.phenolphtaleine > 0) || pH === null || pH < 8.2) return { rgb, alpha };
      const k = 0.85 * Math.min(1, (pH - 8.2) / 1.5);
      return { rgb: vers(rgb, [222, 30, 128], k), alpha: Math.max(alpha, 0.35 + 0.45 * k) };
    },
    (ph, rgb, alpha, c) => {
      // Liqueur de Fehling réduite : la solution perd son bleu ; le précipité vire du jaune-orangé au rouge brique.
      if (ph.classe === "precipite") return { rgb: vers([226, 170, 40], [168, 48, 26], c.avance || 0), alpha };
      if (!(ph.liquides.fehling > 0) || !c.avance) return { rgb, alpha };
      return { rgb: vers(rgb, [222, 146, 92], 0.9 * c.avance), alpha };
    },
  ];

  L.convertir_liquide = function (c, de, vers, V) {
    // Une transformation : remplace V mL du liquide « de » par V mL du liquide « vers » ; renvoie le volume transformé.
    const ph = c.phases.find((p) => p.liquides[de] > 0);
    if (!ph) return 0;
    const v = Math.min(V, ph.liquides[de]);
    ph.liquides[de] -= v; ph.V -= v;
    if (ph.V < 1e-6) c.phases.splice(c.phases.indexOf(ph), 1);
    c.ajouter(vers, v);
    return v;
  };

  L.chauffer_contenu = function (c, T_bain, dt) {
    // Le contenu prend la température du bain (constante de temps 6 s) ; au-dessus de 60 °C, le glucose réduit la liqueur de Fehling.
    c.T = (c.T ?? 20) + (T_bain - (c.T ?? 20)) * (1 - Math.exp(-dt / 6));
    const ph = c.phases.find((p) => p.classe === "aqueuse");
    if (!ph || !(ph.liquides.fehling > 0) || c.T <= 60 || !Object.keys(ph.liquides).some((n) => L.LIQUIDES[n].glucose)) return;
    const avant = c.avance || 0;
    c.avance = Math.min(1, avant + (dt * (c.T - 60)) / 400);
    c.ajouter("oxyde_cuivre", 0.5 * (c.avance - avant));
  };
})(window.Labo);
