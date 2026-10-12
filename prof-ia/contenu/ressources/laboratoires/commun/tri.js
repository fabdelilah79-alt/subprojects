/*
Rôle : tableau blanc magnétique accroché au mur : des étiquettes aimantées à ranger dans des colonnes
       (classer des forces, des espèces, des transformations...). On les fait glisser ; elles se rangent d'elles-mêmes.
Reçoit : le groupe SVG et { x, y, largeur, hauteur, titre, colonnes: [nom ou [ligne 1, ligne 2]], etiquettes: [{ id, texte: [l1, l2], colonne }], fait }.
Produit : Labo.tableau_tri(parent, reglages) ; note le fait reglages.fait = { id_etiquette: numéro de colonne }.
Utilisé par : les simulations qui demandent un classement (par exemple tc_meca1_a3_force_pressante).
*/
(function (L) {
  const ETIQUETTE = { l: 92, h: 30 };

  function cadre(g, r) {
    // Tableau blanc, cadre en aluminium, titre et colonnes tracées au feutre.
    L.svg("rect", { x: r.x - 6, y: r.y - 6, width: r.largeur + 12, height: r.hauteur + 12, rx: 3, fill: "url(#metal-h)", filter: "url(#ombre)" }, g);
    L.svg("rect", { x: r.x, y: r.y, width: r.largeur, height: r.hauteur, fill: "#fbfcfd" }, g);
    L.texte(g, r.x + r.largeur / 2, r.y + 13, r.titre, { class: "etiquette-carton", "font-size": 16 });
    const l = r.largeur / r.colonnes.length;
    r.colonnes.forEach((nom, i) => {
      [].concat(nom).forEach((ligne, j) => L.texte(g, r.x + l * (i + 0.5), r.y + 32 + j * 14, ligne, { class: "etiquette-carton", "font-size": 15, fill: "#1f4f8f" }));
      if (i) L.svg("line", { x1: r.x + l * i, y1: r.y + 26, x2: r.x + l * i, y2: r.bas_colonnes, stroke: "#1f4f8f", "stroke-width": 1.2 }, g);
    });
    L.svg("line", { x1: r.x + 6, y1: r.bas_colonnes, x2: r.x + r.largeur - 6, y2: r.bas_colonnes, stroke: "#1f4f8f", "stroke-width": 1.2 }, g);
    L.texte(g, r.x + 8, r.bas_colonnes + 10, "À classer :", { class: "etiquette-carton", "font-size": 13, "text-anchor": "start", fill: "#6b5300" });
  }

  function etiquette(parent, e) {
    // Étiquette aimantée jaune, texte sur deux lignes.
    const g = L.svg("g", { class: "etiquette-tri", filter: "url(#ombre)" }, parent);
    L.svg("rect", { x: -ETIQUETTE.l / 2, y: -ETIQUETTE.h / 2, width: ETIQUETTE.l, height: ETIQUETTE.h, rx: 2, fill: "#fff3b0", stroke: "#d8c26a", "stroke-width": 0.6 }, g);
    e.texte.forEach((ligne, i) => {
      const ajuste = ligne.length > 17 ? { textLength: ETIQUETTE.l - 8, lengthAdjust: "spacingAndGlyphs" } : {};
      L.texte(g, 0, -6 + i * 12, ligne, { "font-size": 9.5, fill: "#1f2a44", "font-weight": 600, ...ajuste });
    });
    return g;
  }

  L.tableau_tri = function (parent, r) {
    // Construit le tableau et rend chaque étiquette déplaçable.
    r.bas_colonnes = r.y + r.hauteur - 2 * ETIQUETTE.h - 26;
    const g = L.svg("g", {}, parent);
    cadre(g, r);
    const largeur_colonne = r.largeur / r.colonnes.length;
    const place = {};
    const depart = (i) => ({ x: r.x + 6 + ETIQUETTE.l / 2 + (i % 3) * (ETIQUETTE.l + 6), y: r.bas_colonnes + 24 + Math.floor(i / 3) * (ETIQUETTE.h + 4) + ETIQUETTE.h / 2 });

    function ranger() {
      // Range les étiquettes : les unes sous les autres dans leur colonne, ou à leur place de départ.
      const hauteurs = r.colonnes.map(() => 0);
      r.etiquettes.forEach((e, i) => {
        const c = place[e.id];
        const p = c === undefined ? depart(i) : { x: r.x + largeur_colonne * (c + 0.5), y: r.y + 56 + ETIQUETTE.h / 2 + hauteurs[c]++ * (ETIQUETTE.h + 4) };
        e.pos = p;
        L.placer(e.g, p.x, p.y);
      });
      L.missions.noter(r.fait, { ...place });
    }

    r.etiquettes.forEach((e) => {
      e.g = etiquette(g, e);
      L.glissable(e.g, {
        debut: () => ({ ...e.pos }),
        deplacer: (p) => L.placer(e.g, p.x, p.y),
        lacher: (p) => {
          const dans = p.x > r.x && p.x < r.x + r.largeur && p.y > r.y + 20 && p.y < r.bas_colonnes;
          if (dans) place[e.id] = Math.min(r.colonnes.length - 1, Math.floor((p.x - r.x) / largeur_colonne));
          else delete place[e.id];
          ranger();
        },
      });
    });
    ranger();
  };

  L.tableau_tri.verifier = function (etiquettes, place) {
    // true si tout est bien classé ; sinon un message qui dit combien d'étiquettes restent à revoir.
    const fausses = etiquettes.filter((e) => place?.[e.id] !== e.colonne).length;
    if (!place || Object.keys(place).length < etiquettes.length) return false;
    return fausses === 0 || `${fausses} étiquette${fausses > 1 ? "s sont mal classées" : " est mal classée"}. Relisez la définition de chaque catégorie.`;
  };
})(window.Labo);
