/*
Rôle : le circuit électrique d'une paillasse : il réunit les composants, leurs bornes et les fils posés par l'élève,
       calcule les courants et les tensions à chaque changement et les donne aux composants.
Reçoit : le groupe SVG de la paillasse ; des composants { id, dipoles(mode) -> [{ a, b (noms de bornes), g, j, ctrl, ajuster }],
         mettre_a_jour({ u(a, b), onde(a, b), i: [courant de chaque dipôle] }) } ; mode « continu » ou « instant » (s'il y a
         un GBF, c.alternatif = { forme, f, Umax } : le circuit est calculé à 72 instants d'une période, et onde(a, b)
         donne la tension u_ab à chacun de ces instants ; sinon onde renvoie null).
Produit : Labo.circuit(groupe) -> { calque_composants, ajouter(c), borne(c, nom, x, y, couleur), calculer(), sur_calcul(f),
          fils: [{ a, b (clés « composant.borne »), couleur, i (A, de a vers b) }], relies(cle1, cle2), meme_noeud(cle1, cle2),
          prise() (prise murale libre pour un appareil branché sur le secteur) } ;
          Labo.ROUGE_BORNE, Labo.NOIR_BORNE (couleurs des bornes + et −).
Utilisé par : les postes des simulations d'électricité ; circuit_fils.js (fils), circuit_*.js (composants).
*/
(function (L) {
  const G_FIL = 1000, ECHANTILLONS = 72;
  L.ROUGE_BORNE = "#c62828";
  L.NOIR_BORNE = "#1d1f22";

  function dessiner_borne(g, x, y, couleur) {
    // Borne vue d'en haut : écrou métallique, capuchon isolant de couleur, trou pour la fiche.
    L.svg("ellipse", { cx: x + 1, cy: y + 3, rx: 10, ry: 7, fill: "#000", opacity: 0.3 }, g);
    L.svg("circle", { cx: x, cy: y, r: 9, fill: "url(#metal)", stroke: "#3b4045", "stroke-width": 0.8 }, g);
    L.svg("circle", { cx: x, cy: y - 1, r: 6.5, fill: couleur, stroke: "#00000060" }, g);
    L.svg("circle", { cx: x, cy: y - 1, r: 2.3, fill: "#151719" }, g);
  }

  function distribuer(c, cles, r, ondes, pris) {
    // Donne à chaque composant ses courants, ses tensions u et, s'il y a un GBF, l'onde de ses tensions ; à chaque fil son courant.
    const V = (cle) => r.potentiels[cles[cle]];
    let k = 0;
    for (const comp of c.composants) {
      const n = pris[comp.id], cle = (x) => `${comp.id}.${x}`;
      const onde = (a, b) => (ondes ? ondes.map((P) => P[cles[cle(a)]] - P[cles[cle(b)]]) : null);
      comp.mettre_a_jour?.({ u: (a, b) => V(cle(a)) - V(cle(b)), onde, i: r.courants.slice(k, k + n) });
      k += n;
    }
    c.fils.forEach((f) => { f.i = r.courants[k++]; });
  }

  function reajuster(d, u, i, V) {
    // Le dipôle non linéaire se réajuste (il reçoit aussi les tensions qui le commandent) ; on recopie g, j et ctrl.
    const ch = d.source.ajuster(u, i, d.ctrl ? d.ctrl.map((k) => V[k.c] - V[k.d]) : null);
    Object.assign(d, { g: d.source.g, j: d.source.j });
    if (d.ctrl) d.ctrl.forEach((k, n) => { k.g = d.source.ctrl[n].g; });
    return ch;
  }

  function assembler(c, cles, mode) {
    // Dipôles des composants (mode « continu », ou « instant » : GBF à sa valeur c.instant) et des fils.
    const dipoles = [], pris = {};
    for (const comp of c.composants) {
      const liste = comp.dipoles ? comp.dipoles(mode) : [];
      pris[comp.id] = liste.length;
      const cle = (x) => cles[`${comp.id}.${x}`];
      for (const d of liste) dipoles.push({ ...d, a: cle(d.a), b: cle(d.b), ctrl: d.ctrl ? d.ctrl.map((k) => ({ c: cle(k.c), d: cle(k.d), g: k.g })) : null, source: d, ajuster: undefined });
    }
    for (const f of c.fils) dipoles.push({ a: cles[f.a], b: cles[f.b], g: G_FIL, j: 0 });
    for (const d of dipoles) if (d.source && d.source.ajuster) d.ajuster = (u, i, V) => reajuster(d, u, i, V);
    return { dipoles, pris };
  }

  function echantillonner(c, cles, n) {
    // Tension variable : le circuit est recalculé à ÉCHANTILLONS instants d'une période du GBF ; renvoie les potentiels.
    const { forme, Umax } = c.alternatif, ondes = [];
    for (let k = 0; k < ECHANTILLONS; k++) {
      c.instant = Umax * L.forme_tension(forme, (2 * Math.PI * k) / ECHANTILLONS);
      ondes.push(L.resoudre_circuit(n, assembler(c, cles, "instant").dipoles).potentiels);
    }
    c.instant = 0;
    return ondes;
  }

  L.circuit = function (parent) {
    // Crée le circuit vide : calques des composants, des fils et des bornes (au-dessus, pour tirer un fil).
    const c = { composants: [], fils: [], bornes: {}, ecouteurs: [] };
    c.calque_composants = L.svg("g", { class: "composants" }, parent);
    c.calque_fils = L.svg("g", { class: "fils" }, parent);
    c.calque_bornes = L.svg("g", { class: "bornes" }, parent);
    c.ajouter = (comp) => { c.composants.push(comp); return comp; };
    c.prise = () => (parent.prises_libres || []).shift() || L.PRISES_MUR[L.PRISES_MUR.length - 1];
    c.borne = (comp, nom, x, y, couleur) => {
      // Dessine une borne du composant et la rend « tirable » (un fil part de là).
      const b = { cle: `${comp.id}.${nom}`, comp, nom, x, y, couleur };
      c.bornes[b.cle] = b;
      dessiner_borne(comp.g, x, y, couleur);
      L.fils.brancher_borne(c, b);
      return b;
    };
    c.calculer = () => {
      // Numérote les bornes (un nœud chacune), résout (instant par instant s'il y a un GBF, puis GBF à 0 V), puis prévient.
      const cles = {};
      Object.keys(c.bornes).forEach((cle, n) => { cles[cle] = n; });
      const n = Object.keys(cles).length, ondes = c.alternatif ? echantillonner(c, cles, n) : null, dc = assembler(c, cles, "continu");
      distribuer(c, cles, L.resoudre_circuit(n, dc.dipoles), ondes, dc.pris);
      L.fils.dessiner(c);
      for (const f of c.ecouteurs) f(c);
    };
    c.meme_noeud = (x, y) => {
      // Vrai si deux bornes sont reliées par des fils (directement ou de fil en fil).
      const vues = new Set([x]), file = [x];
      while (file.length) {
        const k = file.shift();
        if (k === y) return true;
        for (const f of c.fils) for (const [p, q] of [[f.a, f.b], [f.b, f.a]]) if (p === k && !vues.has(q)) { vues.add(q); file.push(q); }
      }
      return false;
    };
    c.sur_calcul = (f) => c.ecouteurs.push(f);
    c.relies = (x, y) => c.fils.some((f) => (f.a === x && f.b === y) || (f.a === y && f.b === x));
    return c;
  };
})(window.Labo);
