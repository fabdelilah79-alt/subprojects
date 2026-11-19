/*
Rôle : ce que contient un récipient de chimie et ce qu'on en voit : produits (jus d'orange, vinaigre, eau distillée...),
       réactifs (phénolphtaléine, eau iodée, liqueur de Fehling), solides (papier, pomme de terre...). Règles des tests :
       phénolphtaléine incolore si pH < 8,2, rose au-delà ; eau iodée bleu-noir avec l'amidon, sinon jaune-brun ;
       liqueur de Fehling bleue, précipité rouge brique avec le glucose quand on chauffe (au-dessus de 60 °C) ;
       sulfate de cuivre anhydre blanc, bleu au contact de l'eau ; teinte du papier pH selon le pH.
Reçoit : les volumes (mL) des produits versés, les réactifs ajoutés, la température du bain.
Produit : Labo.CHIMIE = { produits, reactifs, solides } ; Labo.melange(volumes) -> { volumes, T, avance, ajouter(nom, mL),
          volume(), contient(propriete), pH(), chauffer(T_bain, dt), aspect() -> { rgb, alpha, precipite } } ;
          Labo.couleur_ph(pH) -> "rgb(...)" ; Labo.rgb([r, v, b]) -> "rgb(...)".
Utilisé par : chimie_objets.js, chimie_chauffage.js et les simulations de chimie.
*/
(function (L) {
  const produits = {
    jus_orange: { nom: "jus d'orange", rgb: [245, 158, 40], trouble: 0.6, pH: 4, eau: true, glucose: true },
    vinaigre: { nom: "vinaigre blanc", rgb: [246, 243, 228], trouble: 0, pH: 3, eau: true },
    eau: { nom: "eau distillée", rgb: [228, 240, 247], trouble: 0, pH: 7, eau: true },
    eau_savonneuse: { nom: "eau savonneuse", rgb: [238, 238, 232], trouble: 0.45, pH: 10, eau: true },
    eau_chaux: { nom: "eau de chaux", rgb: [234, 242, 246], trouble: 0.06, pH: 12, eau: true },
    glucose: { nom: "solution de glucose", rgb: [232, 241, 246], trouble: 0, pH: 7, eau: true, glucose: true },
    huile: { nom: "huile de table", rgb: [232, 194, 66], trouble: 0, pH: null, eau: false },
  };
  const reactifs = {
    phenolphtaleine: { nom: "phénolphtaléine", rgb: [240, 245, 248], trouble: 0, eau: true },
    eau_iodee: { nom: "eau iodée", rgb: [176, 96, 18], trouble: 0, eau: true },
    fehling: { nom: "liqueur de Fehling", rgb: [22, 82, 200], trouble: 0, eau: true, pH: 13 },
  };
  const solides = {
    papier: { nom: "morceau de papier", rgb: [246, 246, 240], amidon: true, eau: false },
    papier_filtre: { nom: "papier filtre", rgb: [250, 250, 247], amidon: false, eau: false },
    pomme_de_terre: { nom: "rondelle de pomme de terre", rgb: [236, 224, 172], amidon: true, eau: true },
    pulpe_orange: { nom: "pulpe d'orange", rgb: [244, 148, 38], amidon: false, eau: true, glucose: true },
  };
  const tout = { ...produits, ...reactifs };
  L.CHIMIE = { produits, reactifs, solides };

  const melanger = (a, b, k) => a.map((v, i) => v + (b[i] - v) * Math.max(0, Math.min(1, k)));
  L.rgb = (c) => `rgb(${c.map((v) => Math.round(v)).join(",")})`;

  const TEINTES_PH = [[226, 32, 32], [232, 64, 28], [240, 104, 27], [247, 148, 29], [251, 185, 23], [244, 220, 26], [140, 198, 63],
    [63, 174, 73], [24, 163, 160], [30, 115, 190], [43, 79, 162], [75, 46, 131], [92, 42, 126], [59, 31, 92]];
  L.couleur_ph = function (pH) {
    // Teinte du papier pH (échelle de 1 à 14) ; papier sec ou liquide non aqueux : jaune orangé du papier neuf.
    if (pH === null || pH === undefined) return "rgb(236,196,110)";
    const k = Math.max(1, Math.min(14, pH)) - 1, i = Math.floor(k);
    return L.rgb(melanger(TEINTES_PH[i], TEINTES_PH[Math.min(13, i + 1)], k - i));
  };

  function aspect(m) {
    // Couleur moyenne des liquides (pondérée par les volumes), puis effet de chaque réactif.
    const V = m.volume() || 1, v = (n) => m.volumes[n] || 0;
    let rgb = [0, 0, 0], trouble = 0;
    for (const [n, x] of Object.entries(m.volumes)) { rgb = rgb.map((c, i) => c + (tout[n].rgb[i] * x) / V); trouble += ((tout[n].trouble || 0) * x) / V; }
    const pH = m.pH();
    if (v("phenolphtaleine") > 0 && pH >= 8.2) rgb = melanger(rgb, [222, 30, 128], 0.85 * Math.min(1, (pH - 8.2) / 1.5));
    if (v("eau_iodee") > 0) rgb = m.contient("amidon") ? melanger(rgb, [30, 18, 70], 0.9) : melanger(rgb, [176, 96, 18], Math.min(0.6, (6 * v("eau_iodee")) / V));
    if (v("fehling") > 0) rgb = melanger(rgb, [22, 82, 200], Math.min(0.9, (4 * v("fehling")) / V) * (1 - 0.75 * m.avance));
    const precipite = m.avance > 0 ? { rgb: melanger([226, 170, 40], [168, 48, 26], m.avance), q: m.avance } : null;
    return { rgb, alpha: 0.42 + 0.45 * Math.min(1, trouble + 0.5 * m.avance), precipite };
  }

  L.melange = function (volumes = {}) {
    // Contenu d'un récipient : volumes en mL, température (°C), avancement du précipité de Fehling (0 à 1).
    const m = { volumes: { ...volumes }, T: 20, avance: 0, amidon: false };
    m.ajouter = (nom, mL) => { m.volumes[nom] = (m.volumes[nom] || 0) + mL; };
    m.volume = () => Object.values(m.volumes).reduce((s, x) => s + x, 0);
    m.contient = (p) => (p === "amidon" && m.amidon) || Object.entries(m.volumes).some(([n, x]) => x > 0 && tout[n][p]);
    m.pH = () => {
      // pH du produit majoritaire ; la liqueur de Fehling (très basique) l'emporte si on en a versé assez.
      if ((m.volumes.fehling || 0) > 0.2 * m.volume()) return 13;
      const p = Object.entries(m.volumes).filter(([n]) => produits[n]).sort((a, b) => b[1] - a[1])[0];
      return p ? produits[p[0]].pH : null;
    };
    m.chauffer = (T_bain, dt) => {
      // Le tube prend la température du bain (constante de temps 6 s) ; au-dessus de 60 °C, le glucose réduit la liqueur.
      m.T += (T_bain - m.T) * (1 - Math.exp(-dt / 6));
      if (m.T > 60 && m.contient("glucose") && (m.volumes.fehling || 0) > 0) m.avance = Math.min(1, m.avance + (dt * (m.T - 60)) / 400);
    };
    m.aspect = () => aspect(m);
    return m;
  };
})(window.Labo);
