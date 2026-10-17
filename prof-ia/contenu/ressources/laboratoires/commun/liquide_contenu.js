/*
Rôle : contenu liquide d'un récipient, en phases : les liquides miscibles (eau, éthanol, solutions aqueuses) forment une
       même phase ; un liquide non miscible (cyclohexane, huile, dichlorométhane) forme une autre phase. Les phases se
       rangent par densité (la moins dense au-dessus). Une agitation crée une émulsion qui se sépare peu à peu (décantation).
       Des espèces dissoutes (diiode...) colorent la phase qui les contient.
Reçoit : les liquides versés (nom, volume en mL) et les espèces dissoutes ajoutées.
Produit : Labo.LIQUIDES (catalogue, complété par chimie_reactions.js) ; Labo.TEINTES (teinte des espèces dissoutes, que l'on peut compléter) ; Labo.REGLES_COULEUR (règles des tests, facultatives) ; Labo.contenu(volumes) -> { phases, emulsion, ajouter(nom, V, dissous), retirer(V, ou),
          volume(), couleur(phase), agiter(force), decanter(dt) }.
Utilisé par : recipient_physique.js, ecoulement.js et les simulations de chimie.
*/
(function (L) {
  const LIQUIDES = {
    eau: { nom: "eau", d: 1.0, rgb: [226, 239, 246], alpha: 0.32, classe: "aqueuse" },
    eau_iodee: { nom: "eau iodée", d: 1.0, rgb: [226, 239, 246], alpha: 0.32, classe: "aqueuse", dissous: { I2: 0.06 } },
    ethanol: { nom: "éthanol", d: 0.79, rgb: [232, 241, 246], alpha: 0.3, classe: "aqueuse" },
    cyclohexane: { nom: "cyclohexane", d: 0.78, rgb: [238, 242, 244], alpha: 0.3, classe: "organique" },
    dichloromethane: { nom: "dichlorométhane", d: 1.33, rgb: [236, 240, 242], alpha: 0.3, classe: "organique" },
    huile: { nom: "huile", d: 0.92, rgb: [226, 186, 60], alpha: 0.75, classe: "organique" },
  };
  // Teinte d'une espèce dissoute selon la phase : le diiode est jaune-brun dans l'eau, violet dans un solvant organique.
  const TEINTES = { I2: { aqueuse: [150, 68, 8], organique: [156, 44, 150] } };
  // Coefficient de partage (concentration dans le solvant organique / concentration dans l'eau) à l'équilibre.
  const PARTAGE = { I2: 90 };
  L.LIQUIDES = LIQUIDES;
  L.TEINTES = TEINTES;
  L.rgb = L.rgb || ((c) => `rgb(${c.map((v) => Math.round(v)).join(",")})`);

  function densite(ph) {
    // Densité moyenne d'une phase (pondérée par les volumes).
    let V = 0, m = 0;
    for (const [n, v] of Object.entries(ph.liquides)) { V += v; m += v * LIQUIDES[n].d; }
    return V ? m / V : 1;
  }

  L.contenu = function (volumes = {}) {
    // Contenu vide, puis remplissage avec les volumes donnés.
    const c = { phases: [], emulsion: 0 };
    c.volume = () => c.phases.reduce((s, p) => s + p.V, 0);
    c.ranger = () => c.phases.sort((a, b) => densite(b) - densite(a));
    c.ajouter = (nom, V, dissous = null) => {
      // Ajoute V mL d'un liquide (et ses espèces dissoutes, en quantité proportionnelle au volume).
      if (V <= 0) return;
      const classe = LIQUIDES[nom].classe;
      let ph = c.phases.find((p) => p.classe === classe);
      if (!ph) { ph = { classe, liquides: {}, dissous: {}, V: 0 }; c.phases.push(ph); }
      ph.liquides[nom] = (ph.liquides[nom] || 0) + V; ph.V += V;
      for (const [s, q] of Object.entries(dissous || LIQUIDES[nom].dissous || {})) ph.dissous[s] = (ph.dissous[s] || 0) + q * (dissous ? 1 : V);
      c.ranger();
    };
    c.retirer = (V, ou = "haut") => {
      // Retire V mL de la phase du haut (débordement) ou du bas (robinet) ; renvoie ce qui est retiré, phase par phase.
      const sortie = [];
      while (V > 1e-9 && c.phases.length) {
        const ph = ou === "haut" ? c.phases[c.phases.length - 1] : c.phases[0], v = Math.min(V, ph.V), k = v / ph.V;
        const part = { classe: ph.classe, liquides: {}, dissous: {}, T: c.T ?? 20 };
        for (const n of Object.keys(ph.liquides)) { part.liquides[n] = ph.liquides[n] * k; ph.liquides[n] -= part.liquides[n]; }
        for (const s of Object.keys(ph.dissous)) { part.dissous[s] = ph.dissous[s] * k; ph.dissous[s] -= part.dissous[s]; }
        ph.V -= v; V -= v; sortie.push(part);
        if (ph.V < 1e-6) c.phases.splice(c.phases.indexOf(ph), 1);
      }
      return sortie;
    };
    c.verser = (part) => {
      // Reçoit une portion venue d'un autre récipient (liquides, espèces dissoutes, température du mélange).
      const V0 = c.volume(), Vp = Object.values(part.liquides).reduce((s, v) => s + v, 0);
      if (part.T !== undefined && V0 + Vp > 0) c.T = ((c.T ?? 20) * V0 + part.T * Vp) / (V0 + Vp);
      for (const [n, V] of Object.entries(part.liquides)) if (V > 0) c.ajouter(n, V, {});
      const ph = c.phases.find((p) => p.classe === part.classe) || c.phases[0];
      if (ph) for (const [s, q] of Object.entries(part.dissous)) ph.dissous[s] = (ph.dissous[s] || 0) + q;
    };
    c.couleur = (ph) => {
      // Couleur et opacité d'une phase : un liquide très coloré garde sa teinte quand on le dilue (comme une solution réelle :
      // poids de chaque liquide = volume × opacité³) ; puis teinte des espèces dissoutes (concentration = quantité / volume).
      let rgb = [0, 0, 0], alpha = 0, poids = 0;
      const L_ph = Object.entries(ph.liquides).filter(([, v]) => v > 0);
      for (const [n, v] of L_ph) poids += v * LIQUIDES[n].alpha ** 3;
      for (const [n, v] of L_ph) { const l = LIQUIDES[n], k = (v * l.alpha ** 3) / poids; rgb = rgb.map((x, i) => x + l.rgb[i] * k); alpha = Math.max(alpha, l.alpha * Math.pow(v / ph.V, 0.3)); }
      for (const [s, q] of Object.entries(ph.dissous)) {
        if (!TEINTES[s]) continue;
        const k = Math.min(0.95, (12 * q) / Math.max(ph.V, 0.1)), t = TEINTES[s][ph.classe];
        rgb = rgb.map((x, i) => x + (t[i] - x) * k); alpha = Math.min(0.9, alpha + 0.55 * k);
      }
      for (const regle of L.REGLES_COULEUR || []) ({ rgb, alpha } = regle(ph, rgb, alpha, c));
      return { rgb, alpha };
    };
    c.agiter = (force) => {
      // Émulsion ; les espèces dissoutes passent d'une phase à l'autre vers l'équilibre de partage, d'autant plus vite qu'on agite.
      const aq = c.phases.find((p) => p.classe === "aqueuse"), org = c.phases.find((p) => p.classe === "organique");
      if (!aq || !org) return;
      c.emulsion = Math.min(1, c.emulsion + force);
      for (const [s, K] of Object.entries(PARTAGE)) {
        const n = (aq.dissous[s] || 0) + (org.dissous[s] || 0), n_org = (n * K * org.V) / (K * org.V + aq.V), k = Math.min(1, force * 3);
        org.dissous[s] = (org.dissous[s] || 0) + (n_org - (org.dissous[s] || 0)) * k; aq.dissous[s] = n - org.dissous[s];
      }
    };
    c.decanter = (dt) => { c.emulsion = Math.max(0, c.emulsion - dt / 5); };
    for (const [n, v] of Object.entries(volumes)) c.ajouter(n, v);
    return c;
  };
})(window.Labo);
