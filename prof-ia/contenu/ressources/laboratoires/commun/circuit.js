/*
Rôle : le circuit électrique d'une paillasse : il réunit les composants, leurs bornes et les fils posés par l'élève,
       calcule les courants et les tensions à chaque changement et les donne aux composants.
Reçoit : le groupe SVG de la paillasse ; des composants { id, dipoles() -> [{ a, b (noms de bornes), g, j, ajuster }],
         mettre_a_jour({ u(a, b), i: [courant de chaque dipôle] }) }.
Produit : Labo.circuit(groupe) -> { calque_composants, ajouter(c), borne(c, nom, x, y, couleur), calculer(), sur_calcul(f),
          fils: [{ a, b (clés « composant.borne »), couleur, i (A, de a vers b) }], relies(cle1, cle2) } ;
          Labo.ROUGE_BORNE, Labo.NOIR_BORNE (couleurs des bornes + et −).
Utilisé par : les postes des simulations d'électricité ; circuit_fils.js (fils), circuit_*.js (composants).
*/
(function (L) {
  const G_FIL = 1000;
  L.ROUGE_BORNE = "#c62828";
  L.NOIR_BORNE = "#1d1f22";

  function dessiner_borne(g, x, y, couleur) {
    // Borne vue d'en haut : écrou métallique, capuchon isolant de couleur, trou pour la fiche.
    L.svg("ellipse", { cx: x + 1, cy: y + 3, rx: 10, ry: 7, fill: "#000", opacity: 0.3 }, g);
    L.svg("circle", { cx: x, cy: y, r: 9, fill: "url(#metal)", stroke: "#3b4045", "stroke-width": 0.8 }, g);
    L.svg("circle", { cx: x, cy: y - 1, r: 6.5, fill: couleur, stroke: "#00000060" }, g);
    L.svg("circle", { cx: x, cy: y - 1, r: 2.3, fill: "#151719" }, g);
  }

  function distribuer(c, cles, r, pris) {
    // Donne à chaque composant ses courants et ses tensions ; à chaque fil son courant.
    const V = (cle) => r.potentiels[cles[cle]];
    let k = 0;
    for (const comp of c.composants) {
      const n = pris[comp.id];
      comp.mettre_a_jour?.({ u: (a, b) => V(`${comp.id}.${a}`) - V(`${comp.id}.${b}`), i: r.courants.slice(k, k + n) });
      k += n;
    }
    c.fils.forEach((f) => { f.i = r.courants[k++]; });
  }

  L.circuit = function (parent) {
    // Crée le circuit vide : calques des composants, des fils et des bornes (au-dessus, pour tirer un fil).
    const c = { composants: [], fils: [], bornes: {}, ecouteurs: [] };
    c.calque_composants = L.svg("g", { class: "composants" }, parent);
    c.calque_fils = L.svg("g", { class: "fils" }, parent);
    c.calque_bornes = L.svg("g", { class: "bornes" }, parent);
    c.ajouter = (comp) => { c.composants.push(comp); return comp; };
    c.borne = (comp, nom, x, y, couleur) => {
      // Dessine une borne du composant et la rend « tirable » (un fil part de là).
      const b = { cle: `${comp.id}.${nom}`, comp, nom, x, y, couleur };
      c.bornes[b.cle] = b;
      dessiner_borne(comp.g, x, y, couleur);
      L.fils.brancher_borne(c, b);
      return b;
    };
    c.calculer = () => {
      // Numérote les bornes (un nœud chacune), assemble composants et fils, résout, puis prévient.
      const cles = {};
      Object.keys(c.bornes).forEach((cle, n) => { cles[cle] = n; });
      const dipoles = [], pris = {};
      for (const comp of c.composants) {
        const liste = comp.dipoles ? comp.dipoles() : [];
        pris[comp.id] = liste.length;
        for (const d of liste) dipoles.push({ ...d, a: cles[`${comp.id}.${d.a}`], b: cles[`${comp.id}.${d.b}`], source: d });
      }
      for (const f of c.fils) dipoles.push({ a: cles[f.a], b: cles[f.b], g: G_FIL, j: 0 });
      for (const d of dipoles) if (d.source && d.source.ajuster) d.ajuster = (u, i) => { const ch = d.source.ajuster(u, i); Object.assign(d, { g: d.source.g, j: d.source.j }); return ch; };
      distribuer(c, cles, L.resoudre_circuit(Object.keys(cles).length, dipoles), pris);
      L.fils.dessiner(c);
      for (const f of c.ecouteurs) f(c);
    };
    c.sur_calcul = (f) => c.ecouteurs.push(f);
    c.relies = (x, y) => c.fils.some((f) => (f.a === x && f.b === y) || (f.a === y && f.b === x));
    return c;
  };
})(window.Labo);
