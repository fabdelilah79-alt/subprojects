/*
Rôle : nom officiel (IUPAC) d'un modèle moléculaire d'hydrocarbure, dans les limites du programme : alcanes jusqu'à six
       atomes de carbone (chaîne principale la plus longue, ramifications méthyle ou éthyle, numérotation donnant les plus
       petits indices) et alcènes à une seule liaison double (la chaîne principale la contient et lui donne le plus petit
       indice) ; isomérie Z/E d'un alcène CHA=CHB, lue sur la géométrie du modèle (Z : les deux groupes du même côté).
Reçoit : les atomes placés du modèle (molecule_3d.js : { el, parent, ordre, pos, dirs }).
Produit : Labo.nommer(atomes) -> { nom, famille (« alcane » ou « alcène »), ramifie, ze (« Z », « E » ou null) } ou null
          (modèle incomplet, autre élément que C et H, autre famille).
Utilisé par : modele_atelier.js (bilan du modèle).
*/
(function (L) {
  const RACINES = ["", "méth", "éth", "prop", "but", "pent", "hex"], MULT = ["", "", "di", "tri", "tétra"];

  function graphe(atomes) {
    // Voisins carbonés de chaque atome de carbone, avec l'ordre de la liaison.
    const v = atomes.map(() => []);
    atomes.forEach((a, i) => { if (a.parent !== null && a.el === "C" && atomes[a.parent].el === "C") { v[i].push([a.parent, a.ordre]); v[a.parent].push([i, a.ordre]); } });
    return v;
  }

  function chemin(v, a, b, vu = new Set()) {
    // Chemin (unique : le modèle est un arbre) de l'atome a à l'atome b.
    if (a === b) return [a];
    vu.add(a);
    for (const [c] of v[a]) if (!vu.has(c)) { const p = chemin(v, c, b, vu); if (p) return [a, ...p]; }
    return null;
  }

  function branche(v, depart, chaine) {
    // Nombre d'atomes de carbone d'une ramification qui part de depart (hors de la chaîne).
    let n = 0; const file = [depart], vu = new Set(chaine);
    while (file.length) { const c = file.pop(); if (vu.has(c)) continue; vu.add(c); n++; v[c].forEach(([d]) => file.push(d)); }
    return n;
  }

  function lire(v, ch) {
    // Indices de la liaison double et des ramifications pour une chaîne numérotée dans ce sens.
    let db = 0; const sub = [];
    ch.forEach((c, k) => { v[c].forEach(([d, o]) => { if (ch[k + 1] === d && o === 2) db = k + 1; if (!ch.includes(d)) sub.push([k + 1, branche(v, d, ch)]); }); });
    return { db, sub: sub.sort((x, y) => x[0] - y[0]) };
  }

  function avant(x, y) {
    // Vrai si la liste x vient avant la liste y (premier terme différent plus petit).
    const k = x.findIndex((v, i) => v !== y[i]);
    return k >= 0 && (y[k] === undefined || x[k] < y[k]);
  }

  function nom_de(n, l, alcene) {
    // Nom : préfixes des ramifications, racine, terminaison (avec l'indice de la double liaison si n ≥ 4).
    const groupes = {};
    l.sub.forEach(([i, t]) => (groupes[t] ??= []).push(i));
    const prefixe = Object.keys(groupes).sort((a, b) => (a > b ? -1 : 1)).map((t) => `${groupes[t].join(",")}-${MULT[groupes[t].length]}${RACINES[t]}yl`).join("-");
    const fin = alcene ? (n >= 4 ? `-${l.db}-ène` : "ène") : "ane";
    return prefixe + RACINES[n] + fin;
  }

  function cote(atomes, v, a, b) {
    // Z ou E pour la liaison double a=b portant chacun un seul groupe carboné (CHA=CHB) ; sinon null.
    const ga = v[a].filter(([d]) => d !== b), gb = v[b].filter(([d]) => d !== a);
    if (ga.length !== 1 || gb.length !== 1) return null;
    const V = L.V3, u = V.norm(V.sub(atomes[b].pos, atomes[a].pos)), perp = (w) => V.sub(w, V.mul(u, V.dot(w, u)));
    return V.dot(perp(V.sub(atomes[ga[0][0]].pos, atomes[a].pos)), perp(V.sub(atomes[gb[0][0]].pos, atomes[b].pos))) > 0 ? "Z" : "E";
  }

  L.nommer = function (atomes) {
    // Chaîne principale parmi les chemins les plus longs (avec la liaison double pour un alcène), meilleure numérotation.
    if (!atomes.length || atomes.some((a) => (a.el !== "C" && a.el !== "H") || a.dirs.length)) return null;
    const v = graphe(atomes), C = atomes.map((a, i) => i).filter((i) => atomes[i].el === "C"), liaisons = atomes.filter((a, i) => a.parent !== null && a.el === "C" && atomes[a.parent].el === "C");
    const doubles = liaisons.filter((a) => a.ordre === 2).length;
    if (C.length > 6 || doubles > 1 || liaisons.some((a) => a.ordre === 3)) return null;
    let mieux = null;
    for (const a of C) for (const b of C) {
      const ch = chemin(v, a, b), l = ch && lire(v, ch);
      if (!ch || (doubles && !l.db)) continue;
      const cle = [-ch.length, l.db, ...l.sub.map((s) => s[0])];
      if (!mieux || avant(cle, mieux.cle)) mieux = { ch, l, cle };
    }
    if (!mieux) return null;
    const ze = doubles ? cote(atomes, v, mieux.ch[mieux.l.db - 1], mieux.ch[mieux.l.db]) : null, nom = nom_de(mieux.ch.length, mieux.l, doubles > 0);
    return { nom: (ze ? `(${ze})-` : "") + nom, famille: doubles ? "alcène" : "alcane", ramifie: mieux.l.sub.length > 0, ze };
  };
})(window.Labo);
