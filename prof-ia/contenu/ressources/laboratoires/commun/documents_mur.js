/*
Rôle : documents affichés au mur du laboratoire (titre, petite chaîne de trois cases reliées par des flèches, texte) :
       un toucher ouvre le document en grand au centre de la scène ; un second toucher le referme.
Reçoit : le groupe SVG de la paillasse, la liste des documents { x, y, l, h, titre, chaine (4 textes, facultatif), texte }
         et le nom du fait à noter ; un document peut avoir un dessin(g, x, y, k) (illustration à droite du texte, échelle k).
Produit : Labo.documents_mur(g, documents, fait) ; fait « <fait> » = [numéros des documents lus].
Utilisé par : les simulations de chimie (industrie chimique, techniques traditionnelles d'extraction).
*/
(function (L) {
  function lignes(texte, n) {
    // Coupe un texte en lignes d'au plus n caractères.
    const r = [""];
    for (const m of texte.split(" ")) { if ((r[r.length - 1] + " " + m).length > n) r.push(m); else r[r.length - 1] = (r[r.length - 1] + " " + m).trim(); }
    return r;
  }

  function chaine(g, d, x, y, l, taille) {
    // Trois cases reliées par des flèches (la deuxième ligne de la première case est facultative).
    const pas = l / 3, c = d.chaine;
    [[c[0], c[1]], [c[2], ""], [c[3], ""]].forEach(([a, b], k) => {
      L.svg("rect", { x: x + 8 + k * pas, y: y - taille, width: pas - 24, height: taille * 2.6, rx: 3, fill: "#e8f0f7", stroke: "#8fb0cf" }, g);
      L.texte(g, x + 8 + k * pas + (pas - 24) / 2, y, a, { "font-size": taille * 0.85, fill: "#1f3f66", "font-weight": 700 });
      if (b) L.texte(g, x + 8 + k * pas + (pas - 24) / 2, y + taille, b, { "font-size": taille * 0.8, fill: "#1f3f66" });
      if (k < 2) L.svg("path", { d: `M${x + k * pas + pas - 14} ${y + 2} h12 m-4 -3 l4 3 l-4 3`, stroke: "#23315a", fill: "none", "stroke-width": 1.2 }, g);
    });
  }

  function page(g, d, x, y, l, h, taille) {
    // Une page de document : titre, chaîne éventuelle, texte.
    L.svg("rect", { x: x + 4, y: y + 5, width: l, height: h, fill: "#000", opacity: 0.18, filter: "url(#flou)" }, g);
    L.svg("rect", { x, y, width: l, height: h, fill: "#fdfdf8", stroke: "#c9c4b0" }, g);
    L.texte(g, x + l / 2, y + taille * 1.6, d.titre, { "font-size": taille * 1.25, "font-weight": 700, fill: "#23315a" });
    if (d.chaine) chaine(g, d, x, y + taille * 4, l, taille);
    const debut = y + taille * (d.chaine ? 7.2 : 3.6), place = d.dessin ? 0.6 : 1;
    if (d.dessin) d.dessin(g, x + l * 0.8, y + h * 0.5, taille / 6.2);
    lignes(d.texte, Math.floor((l * place - 20) / (taille * 0.52))).forEach((t, i) => L.texte(g, x + 10, debut + i * taille * 1.35, t, { "text-anchor": "start", "font-size": taille, fill: "#222" }));
  }

  L.documents_mur = function (g, documents, fait) {
    // Affiches ; toucher l'une l'ouvre en grand ; le document ouvert passe devant tout le reste.
    const lus = new Set(), grand = L.svg("g", { class: "document-ouvert" }, g);
    documents.forEach((d, k) => {
      const e = L.svg("g", { class: `document document-${k + 1}`, role: "button", "aria-label": d.titre }, g);
      page(e, d, d.x, d.y, d.l, d.h, d.taille || 6.2);
      L.glissable(e, { soulever: false, debut: () => ({ x: 0, y: 0 }), toucher: () => {
        grand.replaceChildren();
        page(grand, d, 112, 60, 800, 380, 16);
        L.texte(grand, 512, 428, "Touchez le document pour le refermer.", { "font-size": 10, fill: "#666" });
        lus.add(k + 1); L.missions.noter(fait, [...lus]);
      } });
    });
    L.glissable(grand, { soulever: false, debut: () => ({ x: 0, y: 0 }), toucher: () => grand.replaceChildren() });
    g.append(grand);
  };
})(window.Labo);
