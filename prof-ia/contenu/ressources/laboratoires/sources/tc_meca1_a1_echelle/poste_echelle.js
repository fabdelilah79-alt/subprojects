/*
Rôle : paillasse « Échelle des distances » : document mural (longueurs de l'atome aux galaxies), frise murale
       des puissances de dix (de 10⁻¹⁵ m à 10²¹ m), deux présentoirs d'étiquettes aimantées à placer sur la frise.
Reçoit : le groupe SVG de la paillasse (décor déjà dessiné).
Produit : Labo.poste_echelle(groupe) -> { pense_bete } ; fait noté : etiquettes_placees = { id: exposant }.
Utilisé par : simulation.js.
*/
(function (L) {
  const FRISE = { x: 24, y: 232, largeur: 976, hauteur: 160, axe: 312, n_min: -15, n_max: 21, x0: 72, pas: 25 };
  const PRESENTOIRS = [470, 548];
  const PLACES_X = [300, 434, 568, 702];
  const REDUIT = 0.7;
  const CHIFFRES = { "-": "⁻", 0: "⁰", 1: "¹", 2: "²", 3: "³", 4: "⁴", 5: "⁵", 6: "⁶", 7: "⁷", 8: "⁸", 9: "⁹" };
  const puissance = (n) => "10" + [...String(n)].map((c) => CHIFFRES[c]).join("");
  const x_de = (n) => FRISE.x0 + (n - FRISE.n_min) * FRISE.pas;

  const LIGNES = [
    "• Diamètre du noyau d'un atome d'hydrogène : 1,7 × 10⁻¹⁵ m",
    "• Diamètre de l'atome d'hydrogène : 0,1 nm (1 nm = 10⁻⁹ m)",
    "• Diamètre d'un globule rouge : 7 µm (1 µm = 10⁻⁶ m)",
    "• Taille d'un élève : 1,70 m",
    "• Rayon de la Terre : 6 400 km",
    "• Distance Terre – Lune : 384 000 km",
    "• Distance Terre – Soleil : 150 millions de km",
    "• Diamètre de la Voie lactée : 100 000 années-lumière (1 année-lumière = 9,46 × 10¹⁵ m)",
  ];

  function documents(g) {
    // Document punaisé au mur, puis la frise graduée en puissances de dix.
    L.svg("rect", { x: 272, y: 18, width: 728, height: 202, fill: "#fdfcf6", stroke: "#cfcab8", filter: "url(#ombre)" }, g);
    L.svg("circle", { cx: 636, cy: 26, r: 4, fill: "#c0392b" }, g);
    L.texte(g, 290, 42, "Document : quelques longueurs dans l'Univers", { class: "titre-document", "text-anchor": "start" });
    LIGNES.forEach((t, i) => L.texte(g, 296, 64 + i * 17.5, t, { class: "texte-document", "text-anchor": "start" }));
    L.texte_exposants(g, 290, 207, "Ordre de grandeur : on écrit L = a × 10^{n} avec 1 ≤ a < 10 ; si a < 5, c'est 10^{n} ; si a ≥ 5, c'est 10^{n+1}.", { class: "texte-document", "font-weight": 700 });
    L.svg("rect", { x: FRISE.x, y: FRISE.y, width: FRISE.largeur, height: FRISE.hauteur, fill: "#f7f9fb", stroke: "#b9c3cc", filter: "url(#ombre)" }, g);
    L.texte(g, FRISE.x + 12, FRISE.y + 14, "Frise des longueurs (en mètre) : d'une graduation à la suivante, la longueur est multipliée par 10", { class: "texte-document", "text-anchor": "start", "font-size": 12 });
    L.svg("path", { d: `M${x_de(FRISE.n_min) - 14} ${FRISE.axe} H${x_de(FRISE.n_max) + 14}`, stroke: "#1d1d1d", "stroke-width": 1.6, "marker-end": "url(#fleche-cote)" }, g);
    for (let n = FRISE.n_min; n <= FRISE.n_max; n++) {
      L.svg("line", { x1: x_de(n), y1: FRISE.axe - 5, x2: x_de(n), y2: FRISE.axe + 5, stroke: "#1d1d1d", "stroke-width": 1 }, g);
      L.texte(g, x_de(n), FRISE.axe + 13, puissance(n), { class: "graduation", "font-size": 8 });
    }
  }

  function presentoir(g, base) {
    // Présentoir en bois : une rainure où les étiquettes tiennent debout.
    L.ombre_sol(g, 502, base + 9, 290, 6, 0.45);
    L.svg("path", { d: `M232 ${base - 6} H772 L778 ${base} H226 Z`, fill: "url(#bois)" }, g);
    L.svg("rect", { x: 226, y: base, width: 552, height: 10, fill: "url(#bois-face)" }, g);
  }

  function place_depart(i) {
    // Position d'une étiquette debout sur son présentoir.
    return { x: PLACES_X[i % 4], y: PRESENTOIRS[Math.floor(i / 4)] - 30 };
  }

  function sur_frise(p) {
    // Exposant visé si le point est sur la frise, sinon null.
    if (p.x < FRISE.x || p.x > FRISE.x + FRISE.largeur || p.y < FRISE.y - 10 || p.y > FRISE.y + FRISE.hauteur + 10) return null;
    return Math.max(FRISE.n_min, Math.min(FRISE.n_max, Math.round((p.x - FRISE.x0) / FRISE.pas) + FRISE.n_min));
  }

  L.poste_echelle = function (g) {
    // Construit la paillasse et branche le glisser-déposer des étiquettes.
    documents(g);
    PRESENTOIRS.forEach((base) => presentoir(g, base));
    const epingles = L.svg("g", {}, g), calque = L.svg("g", {}, g), repere = L.svg("circle", { r: 7, class: "zone-depot" }, g);
    const placees = {};
    const etiquettes = L.ETIQUETTES_UNIVERS.map((o, i) => ({ ...o, i, g: L.dessiner_etiquette(calque, o), n: null }));

    function poser(e) {
      // Place l'étiquette : sur la frise (réduite, au-dessus ou au-dessous de l'axe), ou sur son présentoir.
      if (e.n === null) { e.pos = place_depart(e.i); return L.placer(e.g, e.pos.x, e.pos.y); }
      e.pos = { x: x_de(e.n), y: e.n % 2 ? FRISE.axe - 34 : FRISE.axe + 44 };
      L.placer(e.g, e.pos.x, e.pos.y, REDUIT);
    }

    function epingler() {
      // Trace le petit trait qui relie chaque étiquette posée à sa graduation, puis note le placement.
      epingles.replaceChildren();
      for (const e of etiquettes.filter((x) => x.n !== null)) {
        const y = e.n % 2 ? FRISE.axe - 14 : FRISE.axe + 24;
        L.svg("line", { x1: x_de(e.n), y1: FRISE.axe, x2: x_de(e.n), y2: y, stroke: "#1f6f4a", "stroke-width": 1.2 }, epingles);
        placees[e.id] = e.n;
      }
      for (const id of Object.keys(placees)) if (etiquettes.find((e) => e.id === id).n === null) delete placees[id];
      L.missions.noter("etiquettes_placees", { ...placees });
    }

    etiquettes.forEach((e) => {
      poser(e);
      L.glissable(e.g, {
        debut: () => ({ ...e.pos }),
        saisir: () => { e.n = null; epingler(); },
        deplacer: (p) => {
          const n = sur_frise(p);
          L.placer(e.g, p.x, p.y, n === null ? 1 : REDUIT);
          repere.classList.toggle("active", n !== null);
          if (n !== null) L.placer(repere, x_de(n), FRISE.axe);
        },
        lacher: (p) => {
          repere.classList.remove("active");
          const n = sur_frise(p);
          const occupante = etiquettes.find((x) => x !== e && x.n === n && n !== null);
          if (occupante) { occupante.n = null; poser(occupante); }
          e.n = n;
          if (n === null) L.tomber(e.g, p, place_depart(e.i), () => poser(e));
          else poser(e);
          epingler();
        },
      });
    });
    return { pense_bete: L.decor.pense_bete(g, 24, 40, 230) };
  };
})(window.Labo);
