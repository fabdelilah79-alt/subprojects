/*
Rôle : interface d'acquisition reliée à l'ordinateur (ecran_acquisition.js) : deux entrées EA0 et EA1 et une masse
       (résistance d'entrée 10 MΩ). « Lancer » arme l'acquisition : elle démarre dès que EA0 change de plus de 0,2 V (montée
       ou descente), et l'instant t = 0 est le dernier instant où EA0 était encore stable : on bascule l'interrupteur après
       avoir lancé. 400 points sur la durée choisie (0,5 à 20 s). Les trois dernières acquisitions restent affichées.
Reçoit : le circuit (avec son horloge, circuit_temps.js) et { id, x, y (boîtier), ecran { x, y } (ordinateur), etiquette(),
         sur_fin(derniere) (appelée à la fin de chaque acquisition) }.
Produit : Labo.interface_acquisition(c, reglage) -> comp { u0, u1, s } ; bornes « EA0 », « EA1 », « GND » ; fait « acquisition »
          = { duree, etat, n, derniere { duree, u_debut, u_fin, tau (s, instant où EA0 a fait 63 % de sa variation), ... },
          curseur { t, u0, u1 } }.
Utilisé par : les simulations du dipôle RC.
*/
(function (L) {
  const DUREES = [0.5, 1, 2, 5, 10, 20];

  function resume(s, etiquette) {
    // Ce que l'on retient de la dernière acquisition : début, fin, instant des 63 % de la variation de EA0.
    const p = s.courbes[s.courbes.length - 1].pts, a = p[0][1], b = p[p.length - 1][1], cible = a + 0.632 * (b - a);
    const k = p.findIndex((q) => (b > a ? q[1] >= cible : q[1] <= cible));
    const tau = k > 0 ? p[k - 1][0] + ((cible - p[k - 1][1]) / (p[k][1] - p[k - 1][1])) * (p[k][0] - p[k - 1][0]) : null;
    return { duree: s.duree, u_debut: Math.round(a * 1000) / 1000, u_fin: Math.round(b * 1000) / 1000, u1_fin: Math.round(p[p.length - 1][2] * 1000) / 1000, tau: tau && Math.round(tau * 10000) / 10000, ...etiquette() };
  }

  function enregistrer(s, comp, t) {
    // Attente du déclenchement (avec la mémoire des instants qui précèdent), puis un point tous les durée / 400.
    const p = [t, comp.u0, comp.u1];
    if (s.etat === "en attente") {
      s.memoire.push(p); if (s.memoire.length > 800) s.memoire.shift();
      if (Math.abs(comp.u0 - s.base) < 0.01) s.calme = t;
      if (Math.abs(comp.u0 - s.base) > 0.2) { s.t0 = s.calme; s.dernier = t; s.etat = "en cours"; s.courbes.push({ pts: s.memoire.filter((q) => q[0] >= s.calme).map((q) => [q[0] - s.calme, q[1], q[2]]) }); if (s.courbes.length > 3) s.courbes.shift(); }
      return false;
    }
    if (s.etat !== "en cours" || t - s.dernier < s.duree / 400) return false;
    s.dernier = t; s.courbes[s.courbes.length - 1].pts.push([t - s.t0, comp.u0, comp.u1]);
    if (t - s.t0 >= s.duree) s.etat = "terminée";
    return s.etat === "terminée";
  }

  L.interface_acquisition = function (c, { id = "interface", x, y, ecran, etiquette = () => ({}), sur_fin = () => {} }) {
    // Boîtier, entrées, câble USB, ordinateur ; enregistrement à chaque pas de l'horloge ; dessin une fois par image.
    const comp = { id, u0: 0, u1: 0, g: L.svg("g", { class: "interface-acquisition" }, c.calque_composants) };
    const s = comp.s = { duree: 5, etat: "prête", courbes: [], curseur: 0, tangente: false, memoire: [], n: 0 };
    L.svg("path", { d: `M${x + 150} ${y + 20} C${x + 190} ${y + 20} ${ecran.x - 40} ${ecran.y + 290} ${ecran.x} ${ecran.y + 290}`, fill: "none", stroke: "#2b2b2b", "stroke-width": 3 }, comp.g);
    L.boitier(comp.g, x, y, 150, 64, 18, { dessus: "#d9dcd8", face: "#3b4248" });
    L.texte(comp.g, x + 75, y + 12, "INTERFACE D'ACQUISITION", { "font-size": 6.5, "font-weight": 700, fill: "#23315a" });
    [["EA0", 30, "#c62828"], ["EA1", 75, "#f2a20b"], ["GND", 120, L.NOIR_BORNE]].forEach(([n, dx, col]) => { L.texte(comp.g, x + dx, y + 26, n, { "font-size": 7, "font-weight": 700, fill: "#333" }); c.borne(comp, n, x + dx, y + 46, col); });
    let lecture = null;
    const noter = () => L.missions.noter("acquisition", { duree: s.duree, etat: s.etat, n: s.n, derniere: s.derniere || null, curseur: lecture ? { t: lecture[0], u0: Math.round(lecture[1] * 1000) / 1000, u1: Math.round(lecture[2] * 1000) / 1000 } : null });
    const tracer = L.ecran_acquisition(L.svg("g", {}, c.calque_composants), ecran, {
      duree: () => { if (s.etat !== "en cours") s.duree = DUREES[(DUREES.indexOf(s.duree) + 1) % DUREES.length]; maj(); },
      lancer: () => { if (s.etat === "en cours") return; s.etat = "en attente"; s.base = comp.u0; s.calme = c.horloge.t; s.memoire = []; maj(); },
      effacer: () => { if (s.etat !== "en cours") { s.courbes = []; s.etat = "prête"; } maj(); },
      tangente: () => { s.tangente = !s.tangente; maj(); },
      curseur: (t) => { s.curseur = t; maj(); },
    });
    const maj = () => { lecture = tracer(s); noter(); };
    comp.dipoles = () => [{ a: "EA0", b: "GND", g: 1e-7, j: 0 }, { a: "EA1", b: "GND", g: 1e-7, j: 0 }];
    comp.mettre_a_jour = ({ u }) => { comp.u0 = u("EA0", "GND"); comp.u1 = u("EA1", "GND"); };
    c.horloge.sur_pas((t) => { if (enregistrer(s, comp, t)) { s.n++; s.derniere = resume(s, etiquette); sur_fin(s.derniere); } });
    let vu = "";
    c.sur_calcul(() => { const cle = `${s.etat}:${s.courbes.length}:${s.courbes.length && s.courbes[s.courbes.length - 1].pts.length}`; if (cle !== vu) { vu = cle; maj(); } });
    maj();
    return c.ajouter(comp);
  };
})(window.Labo);
