/*
Rôle : récipients de chimie qu'on manipule : tube à essai (déplaçable d'une place à l'autre : porte-tubes, bain-marie),
       verre de montre (reçoit des gouttes, de la poudre ; son contenu change de couleur selon les tests), bécher
       d'échantillon avec sa pipette, flacon de réactif compte-gouttes.
Reçoit : la paillasse de chimie (chimie_gouttes.js) et le réglage de chaque objet.
Produit : Labo.places_tubes(ctx, places) ; Labo.tube_essai(ctx, r) -> { id, m, place } ; Labo.coupelle_chimie(ctx, r) -> { id, c } ;
          Labo.becher_echantillon(ctx, r) -> { id, m } ; Labo.flacon_reactif(ctx, r).
Utilisé par : les simulations de chimie.
*/
(function (L) {
  const { produits, reactifs, solides } = L.CHIMIE;
  const BLEU_CUSO4 = "#2f86d6", BLANC_CUSO4 = "#f1f1ea";

  L.places_tubes = function (ctx, places) {
    // Ajoute des places où l'on peut poser un tube (x, bas, et facultativement T() : température d'un bain).
    ctx.places = (ctx.places || []).concat(places.map((p) => ({ ...p, tube: null })));
    return ctx.places;
  };

  L.tube_essai = function (ctx, { id, place, volumes, texte = "" }) {
    // Tube à essai : contenu, dessin, cible pour les gouttes ; on le porte d'une place libre à une autre.
    const t = { id, m: L.melange(volumes), place: ctx.places[place], g: L.svg("g", { class: `tube tube-${id}`, role: "button", "aria-label": `Tube ${texte}` }, ctx.objets) };
    t.place.tube = t;
    const dessiner = () => L.verrerie.tube(t.g, 0, 0, t.m, texte);
    const poser = () => { ctx.objets.append(t.g); L.placer(t.g, t.place.x, t.place.bas); };
    t.bouche = () => ({ x: t.place.x, y: t.place.bas - 130 });
    t.surface = () => t.place.bas - 2 - t.m.volume() * 4.4;
    t.recevoir = (nom, mL) => { t.m.ajouter(nom, mL); dessiner(); };
    t.redessiner = dessiner;
    dessiner(); poser();
    ctx.ajouter_cible(t);
    L.glissable(t.g, {
      debut: () => ({ x: t.place.x, y: t.place.bas }),
      saisir: () => ctx.haut.append(t.g),
      deplacer: (p) => L.placer(t.g, p.x, p.y),
      lacher: (p) => {
        const libre = ctx.places.filter((q) => !q.tube || q.tube === t).sort((a, b) => Math.hypot(a.x - p.x, a.bas - p.y) - Math.hypot(b.x - p.x, b.bas - p.y))[0];
        if (libre && Math.hypot(libre.x - p.x, libre.bas - p.y) < 60) { t.place.tube = null; t.place = libre; libre.tube = t; }
        poser(); ctx.signaler();
      },
    });
    return t;
  };

  function goutte_sur(c, nom) {
    // Ce que devient une goutte posée dans le verre de montre (papier pH, eau iodée sur un solide, sulfate de cuivre).
    const p = produits[nom] || reactifs[nom], s = c.solide && solides[c.solide];
    c.recus.push(nom);
    if (c.poudre && p.eau) c.poudre = BLEU_CUSO4;
    if (c.bande_ph) return void (c.bande_ph.tache = L.couleur_ph(p.pH ?? null));
    const couleur = nom === "eau_iodee" && s ? (s.amidon ? "#1e1446" : "#a85a16") : L.rgb(p.rgb);
    c.taches.push({ dx: c.poudre ? 0 : ((c.taches.length * 9) % 19) - 9, dy: ((c.taches.length * 3) % 5) - 2, r: c.poudre ? 13 : 6 + Math.random(), couleur, alpha: p.trouble > 0.3 || nom === "eau_iodee" ? 0.9 : 0.55 });
  }

  L.coupelle_chimie = function (ctx, { id, x, y, solide = null, bande_ph = false }) {
    // Verre de montre ; c = { solide, poudre (couleur du sulfate de cuivre), taches, bande_ph, recus }.
    const k = { id, c: { solide, poudre: null, taches: [], bande_ph: bande_ph ? { tache: null } : null, recus: [] }, g: L.svg("g", { class: `coupelle coupelle-${id}` }, ctx.fond) };
    const dessiner = () => L.verrerie.coupelle(k.g, x, y, k.c);
    k.bouche = () => ({ x, y: y - 4 });
    k.surface = () => y - 2;
    k.recevoir = (nom) => { goutte_sur(k.c, nom); dessiner(); };
    k.recevoir_poudre = () => { k.c.poudre = (solide && solides[solide].eau) || k.c.recus.some((n) => (produits[n] || reactifs[n]).eau) ? BLEU_CUSO4 : BLANC_CUSO4; dessiner(); };
    k.poudre_bleue = () => k.c.poudre === BLEU_CUSO4;
    dessiner();
    ctx.ajouter_cible(k);
    return k;
  };

  L.becher_echantillon = function (ctx, { id, x, bas, produit, volume = 20, texte }) {
    // Petit bécher de l'échantillon et sa pipette (une pipette par produit) ; il reçoit aussi des gouttes de réactif.
    const b = { id, m: L.melange({ [produit]: volume }), g: L.svg("g", { class: `becher becher-${id}` }, ctx.fond) };
    const dessiner = () => L.verrerie.becher(b.g, x, bas, b.m, texte);
    b.bouche = () => ({ x, y: bas - 60 });
    b.surface = () => bas - 3 - (b.m.volume() / 50) * 50;
    b.recevoir = (nom, mL) => { b.m.ajouter(nom, mL); dessiner(); };
    dessiner();
    ctx.ajouter_cible(b);
    b.pipette = L.compte_gouttes(ctx, { repos: { x: x + 12, y: bas - 6 }, produit, rgb: produits[produit].rgb, poire: "#c4472b", bague: false, n: 2, source: b });
    return b;
  };

  L.flacon_reactif = function (ctx, { id, x, bas, reactif, texte, dose = 0.1, n = 3 }) {
    // Flacon compte-gouttes de réactif : on en sort la pipette ; le flacon reste ouvert tant qu'elle est sortie.
    const g = L.svg("g", { class: `flacon flacon-${id}` }, ctx.fond), r = reactifs[reactif];
    const dessiner = (ouvert) => L.verrerie.flacon(g, x, bas, texte, { liquide: L.rgb(r.rgb), ouvert });
    dessiner(false);
    return L.compte_gouttes(ctx, { repos: { x, y: bas + 12 }, produit: reactif, rgb: r.rgb, dose, n, cachee: true, quand_rangee: dessiner });
  };
})(window.Labo);
