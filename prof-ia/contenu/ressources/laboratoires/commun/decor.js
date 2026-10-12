/*
Rôle : décor d'une paillasse de laboratoire en 2,5D : mur peint, crédence carrelée, plan de travail sombre,
       placards, prise électrique ; et le pense-bête collé au mur, qui montre la consigne en cours.
Reçoit : le groupe SVG de la paillasse et son numéro.
Produit : Labo.decor.paillasse(groupe, numero) ; Labo.decor.pense_bete(groupe, x, y) -> { ecrire(titre, texte) }.
         Labo.PAILLASSE : hauteurs du plan de travail (fond, bord avant, placards).
Utilisé par : toutes les simulations.
*/
(function (L) {
  L.PAILLASSE = { fond: 405, avant: 585, placard: 598 };
  const P = L.PAILLASSE;

  function mur(g) {
    // Mur peint, plinthe de carrelage blanc derrière le plan de travail, prise électrique.
    L.svg("rect", { x: 0, y: 0, width: L.LARGEUR, height: P.fond, fill: "url(#mur)" }, g);
    L.svg("rect", { x: 0, y: 250, width: L.LARGEUR, height: P.fond - 250, fill: "url(#carrelage)" }, g);
    L.svg("rect", { x: 0, y: 246, width: L.LARGEUR, height: 5, fill: "#b9bdb5" }, g);
    const prise = L.svg("g", { transform: "translate(940 300)" }, g);
    L.svg("rect", { x: 0, y: 0, width: 44, height: 44, rx: 4, fill: "#f7f7f4", stroke: "#b8bbb4" }, prise);
    L.svg("circle", { cx: 22, cy: 22, r: 13, fill: "#e6e7e2", stroke: "#c4c7c0" }, prise);
    L.svg("circle", { cx: 17, cy: 22, r: 2.2, fill: "#555" }, prise);
    L.svg("circle", { cx: 27, cy: 22, r: 2.2, fill: "#555" }, prise);
  }

  function plan_de_travail(g) {
    // Plan de travail vu un peu d'en haut : surface sombre, reflet, bord avant épais.
    L.svg("rect", { x: 0, y: P.fond, width: L.LARGEUR, height: P.avant - P.fond, fill: "url(#paillasse)" }, g);
    L.svg("rect", { x: 0, y: P.fond, width: L.LARGEUR, height: 8, fill: "#000", opacity: 0.25 }, g);
    L.svg("rect", { x: 0, y: P.fond + 20, width: L.LARGEUR, height: 90, fill: "url(#reflet)", opacity: 0.8 }, g);
    L.svg("rect", { x: 0, y: P.avant, width: L.LARGEUR, height: P.placard - P.avant, fill: "url(#bord)" }, g);
    L.svg("rect", { x: 0, y: P.placard, width: L.LARGEUR, height: L.HAUTEUR - P.placard, fill: "url(#facade)" }, g);
    for (let x = 0; x < L.LARGEUR; x += 256) {
      L.svg("rect", { x: x + 6, y: P.placard + 6, width: 244, height: 40, fill: "none", stroke: "#5d6567", "stroke-width": 1.5 }, g);
      L.svg("rect", { x: x + 108, y: P.placard + 14, width: 40, height: 6, rx: 3, fill: "url(#metal-h)" }, g);
    }
  }


  function lignes(texte, largeur_car) {
    // Coupe un texte en lignes d'au plus largeur_car caractères, sans couper les mots.
    const resultat = [];
    let ligne = "";
    for (const mot of texte.split(/\s+/)) {
      if ((ligne + " " + mot).trim().length > largeur_car && ligne) { resultat.push(ligne); ligne = mot; }
      else ligne = (ligne + " " + mot).trim();
    }
    if (ligne) resultat.push(ligne);
    return resultat;
  }

  function verrerie(g, x, base) {
    // Quelques objets de verrerie rangés sur l'étagère : erlenmeyer, bécher, flacons bruns étiquetés, ballon.
    L.svg("path", { d: `M${x} ${base} L${x + 10} ${base - 34} V${base - 52} H${x + 20} V${base - 34} L${x + 30} ${base} Z`, fill: "url(#verre)", stroke: "#9fb6be" }, g);
    L.svg("path", { d: `M${x + 3} ${base - 2} L${x + 9} ${base - 18} H${x + 21} L${x + 27} ${base - 2} Z`, fill: "#7cc4a4", opacity: 0.6 }, g);
    L.svg("rect", { x: x + 44, y: base - 40, width: 34, height: 40, fill: "url(#verre)", stroke: "#9fb6be" }, g);
    for (const [dx, h, etiquette] of [[96, 52, "NaCl"], [124, 60, "CuSO₄"]]) {
      L.svg("rect", { x: x + dx, y: base - h, width: 24, height: h, rx: 3, fill: "#6b3a12", opacity: 0.9 }, g);
      L.svg("rect", { x: x + dx + 6, y: base - h - 8, width: 12, height: 9, fill: "#222" }, g);
      L.svg("rect", { x: x + dx + 3, y: base - h + 16, width: 18, height: 16, fill: "#f6f2e4" }, g);
      L.texte(g, x + dx + 12, base - h + 24, etiquette, { "font-size": 5.5, fill: "#333" });
    }
    L.svg("circle", { cx: x + 176, cy: base - 18, r: 18, fill: "url(#verre)", stroke: "#9fb6be" }, g);
    L.svg("rect", { x: x + 170, y: base - 52, width: 12, height: 18, fill: "url(#verre)", stroke: "#9fb6be" }, g);
  }

  L.decor = {
    etagere(g, x, y, largeur = 230) {
      // Étagère murale en bois (consoles métalliques) avec de la verrerie rangée.
      L.svg("rect", { x: x + 3, y: y + 6, width: largeur, height: 10, fill: "#000", opacity: 0.2, filter: "url(#flou)" }, g);
      verrerie(g, x + 14, y);
      L.svg("rect", { x, y, width: largeur, height: 8, fill: "url(#bois)" }, g);
      L.svg("rect", { x, y: y + 8, width: largeur, height: 3, fill: "url(#bois-face)" }, g);
      for (const dx of [20, largeur - 26]) L.svg("path", { d: `M${x + dx} ${y + 11} v26 h6 v-6 l-6 -20 Z`, fill: "#6c747a" }, g);
    },
    paillasse(g, numero) {
      // Dessine le décor complet d'une paillasse.
      mur(g);
      plan_de_travail(g);
      L.svg("text", { x: 1000, y: 30, "text-anchor": "end", class: "numero-paillasse" }, g).textContent = `Paillasse ${numero + 1}`;
    },
    pense_bete(g, x, y, largeur = 250, hauteur = 175) {
      // Colle au mur une feuille jaune ; ecrire(titre, texte) y écrit la consigne à la main.
      const feuille = L.svg("g", { transform: `translate(${x} ${y}) rotate(-1.5)`, class: "pense-bete" }, g);
      L.svg("rect", { x: 3, y: 4, width: largeur, height: hauteur, fill: "#000", opacity: 0.18, filter: "url(#flou)" }, feuille);
      L.svg("rect", { width: largeur, height: hauteur, fill: "#fbe98a" }, feuille);
      L.svg("rect", { width: largeur, height: 22, fill: "#f3dc6b" }, feuille);
      L.svg("rect", { x: largeur / 2 - 30, y: -8, width: 60, height: 18, fill: "#ffffff", opacity: 0.55, transform: "rotate(2)" }, feuille);
      const zone = L.svg("g", {}, feuille);
      return {
        ecrire(titre, texte) {
          // Remplace le contenu de la feuille par un titre et une consigne manuscrits.
          zone.replaceChildren();
          L.svg("text", { x: 12, y: 16, class: "pense-bete-titre" }, zone).textContent = titre;
          lignes(texte, Math.floor(largeur / 10.2)).slice(0, 6).forEach((ligne, i) => {
            L.svg("text", { x: 12, y: 48 + i * 24, class: "pense-bete-texte" }, zone).textContent = ligne;
          });
        },
      };
    },
  };
})(window.Labo);
