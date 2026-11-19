/*
Rôle : construction du polygone des forces : un bouton fait apparaître en O les vecteurs F1, F2, F3 (échelle : 60 px pour 1 N, soit 30 px pour 0,5 N) ;
       l'élève les fait glisser (sans changer leur direction ni leur longueur) pour les mettre bout à bout. Une origine lâchée
       près d'une extrémité s'y accroche. Le polygone se ferme si la somme des forces est nulle.
Reçoit : le groupe SVG ; l'état de la table à forces (O, forces efficaces, angles).
Produit : Labo.polygone(groupe, table) ; fait noté « polygone » (oui quand les trois vecteurs forment une chaîne).
Utilisé par : poste_trois_forces.js.
*/
(function (L) {
  const ECHELLE = 60, COULEURS = ["#c62828", "#1565c0", "#2e7d32"];

  function vecteurs(e) {
    // Les trois vecteurs (en px) : le long des fils 1 et 2 (vers les poulies), et vers le bas pour le fil 3.
    const [F1, F2, F3] = e.efficaces;
    return [{ x: -Math.sin(e.alpha1) * F1, y: -Math.cos(e.alpha1) * F1 }, { x: Math.sin(e.alpha2) * F2, y: -Math.cos(e.alpha2) * F2 }, { x: 0, y: F3 }]
      .map((v) => ({ x: v.x * ECHELLE, y: v.y * ECHELLE }));
  }

  function fleche(g, o, v, i) {
    // Une flèche colorée, son nom, et une poignée à son origine.
    const f = L.svg("g", { class: "vecteur-force", "data-force": i }, g), b = { x: o.x + v.x, y: o.y + v.y };
    L.svg("line", { x1: o.x, y1: o.y, x2: b.x, y2: b.y, stroke: COULEURS[i], "stroke-width": 2.4, "marker-end": "url(#fleche-cote)" }, f);
    L.texte_exposants(f, b.x + 10, b.y, `F_{${i + 1}}`, { "font-size": 11, "font-weight": 700, fill: COULEURS[i] });
    L.svg("circle", { cx: o.x, cy: o.y, r: 8, fill: COULEURS[i], opacity: 0.3 }, f);
  }

  function chaine(v, origines) {
    // Chaque origine (sauf une) est posée sur l'extrémité d'un autre vecteur.
    const bouts = origines.map((o, i) => ({ x: o.x + v[i].x, y: o.y + v[i].y }));
    return origines.filter((o, i) => bouts.some((b, j) => j !== i && Math.hypot(b.x - o.x, b.y - o.y) < 3)).length >= 2;
  }

  L.polygone = function (parent, table) {
    // Bouton « Représenter les forces » ; vecteurs déplaçables par glisser-déposer.
    const g = L.svg("g", {}, parent), etat = { visible: false, origines: [] };
    const dessiner = () => {
      g.replaceChildren();
      if (!etat.visible) return;
      const v = vecteurs(table.etat());
      etat.origines.forEach((o, i) => fleche(g, o, v[i], i));
    };
    const remettre = () => { const O = table.etat().O; etat.origines = [0, 1, 2].map(() => ({ ...O })); dessiner(); L.missions.noter("polygone", false); };
    let prise = -1;
    g.addEventListener("pointerdown", (ev) => { const n = ev.target.closest(".vecteur-force"); prise = n ? +n.dataset.force : -1; }, { capture: true });
    L.glissable(g, {
      soulever: false,
      debut: () => (prise >= 0 ? { ...etat.origines[prise] } : null),
      deplacer: (p) => { etat.origines[prise] = p; dessiner(); },
      lacher: (p) => {
        const v = vecteurs(table.etat()), bout = etat.origines.map((o, i) => ({ x: o.x + v[i].x, y: o.y + v[i].y })).find((b, j) => j !== prise && Math.hypot(b.x - p.x, b.y - p.y) < 12);
        etat.origines[prise] = bout || p;
        dessiner();
        L.missions.noter("polygone", chaine(vecteurs(table.etat()), etat.origines));
      },
    });
    L.bouton_poussoir(parent, 650, 540, { textes: ["Représenter les forces", "Cacher les forces"], sur_changement: (oui) => { etat.visible = oui; remettre(); } });
    table.sur_changement(() => { if (etat.visible) remettre(); });
  };
})(window.Labo);
