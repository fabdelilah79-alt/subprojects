/*
Rôle : paillasses de l'activité « vie courante » des transformations lentes : (1) l'autocuiseur : documents au mur (principe,
       durées de cuisson à 100 °C et dans l'autocuiseur, à 120 °C) ; (2) le réfrigérateur : bain de glace à 2 °C (bécher de
       600 mL, eau et glaçons, thermomètre électronique), porte-tubes à 20 °C, deux tubes d'iodure acidifié, eau oxygénée,
       document sur la conservation des aliments.
Reçoit : le groupe SVG de chaque paillasse.
Produit : Labo.poste_autocuiseur, Labo.poste_refrigerateur (groupe) -> { pense_bete } ; faits « docs_autocuiseur »,
          « docs_froid » (documents lus) et « tubes_froid » = { t1, t2 : { T, glace, peroxyde (mL), I2 (mmol/L) } } ;
          Labo.CUISSON = [[aliment, durée à 100 °C, durée à 120 °C] (min)].
Utilisé par : simulation.js.
*/
(function (L) {
  const SOL = 576, E = 1.6, r2 = (v) => Math.round(v * 100) / 100;
  const CUISSON = [["pois chiches trempés", 90, 25], ["pommes de terre", 24, 7], ["riz", 18, 5], ["bœuf en morceaux", 120, 35]];
  L.CUISSON = CUISSON;
  const doc = (k, n, titre, chaine, texte) => ({ x: 262 + k * (740 / n), y: 40, l: 740 / n - 8, h: 190, taille: 4, titre, chaine, texte });

  L.poste_autocuiseur = function (g) {
    // Pense-bête et documents sur l'autocuiseur.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230);
    L.documents_mur(g, [
      doc(0, 2, "L'autocuiseur", ["couvercle étanche", "+ soupape", "pression ≈ 2 bar", "eau bouillante à 120 °C"], "Dans une casserole ouverte, l'eau bout à 100 °C : la température de cuisson ne peut pas dépasser 100 °C. Le couvercle de l'autocuiseur est étanche ; la vapeur ne s'échappe que par la soupape, quand la pression atteint environ 2 bar. Sous cette pression, l'eau ne bout qu'à 120 °C environ. La cuisson est une suite de transformations chimiques lentes (l'amidon et les protéines des aliments se transforment)."),
      doc(1, 2, "Durées de cuisson", ["100 °C", "(casserole)", "120 °C", "(autocuiseur)"], CUISSON.map(([a, t1, t2]) => `${a} : ${t1} min à 100 °C ; ${t2} min à 120 °C.`).join(" ")),
    ], "docs_autocuiseur");
    return { pense_bete };
  };

  function bain_glace(ctx, x) {
    // Bécher de 600 mL posé sur la paillasse : eau et glaçons, trois places pour des tubes ; un tube plongé refroidit vers 2 °C.
    const fond = SOL - 1.4 * E, bain = L.recipient(ctx, { id: "bain_glace", profil: "becher_600", x, y: fond, contenu: { eau: 300 } });
    bain.g.setAttribute("pointer-events", "none");
    const gl = L.svg("g", { "pointer-events": "none" }, ctx.devant);
    [[-34, -78, 8], [-12, -80, -10], [22, -79, 14], [40, -77, -4]].forEach(([dx, dy, a]) => {
      L.svg("rect", { x: x + dx - 9, y: fond + dy - 7, width: 18, height: 14, rx: 3, fill: "#e8f6fb", opacity: 0.75, stroke: "#a9cfdc", "stroke-width": 0.7, transform: `rotate(${a} ${x + dx} ${fond + dy})` }, gl);
    });
    const places = [-12, 8, 28].map((dx) => ({ x: x + dx * E, y: fond - 1 * E, glace: true }));
    ctx.ecoulement.sur_pas((dt) => { for (const r of ctx.ecoulement.recipients) if (r !== bain && (r.place?.glace || (r.c.T ?? 20) < 19.5)) L.chauffer_contenu(r.c, r.place?.glace ? 2 : 20, dt); });
    return { bain, places };
  }

  L.poste_refrigerateur = function (g) {
    // Porte-tubes (salle à 20 °C), bain de glace, thermomètre, deux tubes d'iodure acidifié, eau oxygénée, document.
    L.affiche_securite(g, 780, 56);
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230), ctx = L.paillasse_chimie(g);
    L.documents_mur(g, [{ x: 270, y: 34, l: 330, h: 110, taille: 4, titre: "Conserver les aliments", chaine: ["aliment", "(microbes, air)", "transformations lentes", "altération"], texte: "Un aliment s'altère par des transformations chimiques lentes : oxydation par l'air, action des enzymes et des microbes. Au réfrigérateur (4 °C), elles sont ralenties : un aliment se conserve quelques jours de plus. Au congélateur (−18 °C), elles deviennent si lentes qu'il se conserve des mois." }], "docs_froid");
    L.ecoulement(ctx, { sol: SOL, e: E });
    const rack = L.porte_tubes(ctx, { x: 300, sol: SOL, e: E, n: 2, pas: 30 }), froid = bain_glace(ctx, 690);
    const tubes = ["1 I⁻ + H⁺", "2 I⁻ + H⁺"].map((etiquette, k) => { const t = L.recipient(ctx, { id: `t${k + 1}`, profil: "tube", x: rack[k].x, y: rack[k].y, contenu: { cin_ki_acide: 3 }, etiquette }); t.place = rack[k]; L.manipuler(ctx, t, { sol: SOL, supports: [...rack, ...froid.places], pose_libre: false }); return t; });
    L.flacon_gouttes(ctx, { id: "cin_peroxyde", x: 450, sol: SOL, e: E, liquide: "cin_peroxyde", texte: "Eau oxygénée\n0,10 mol/L" });
    const th = L.thermometre_numerique(g, { x: 820, y: 440, sonde: [{ x: 820, y: 470 }, { x: 760, y: 440 }, { x: 735, y: 470 }, { x: 728, y: 520 }] });
    const ph = (t) => t.c.phases.find((p) => p.classe === "aqueuse") || { liquides: {}, dissous: {}, V: 1 };
    let avant = "", n = 0;
    ctx.ecoulement.sur_pas((dt) => {
      tubes.forEach((t) => { if (L.avancer_lent(t.c, dt)) t.sig = null; });
      if (n++ % 30 === 0) th.afficher(2);
      const f = Object.fromEntries(tubes.map((t, k) => [`t${k + 1}`, { T: Math.round(t.c.T ?? 20), glace: !!t.place?.glace, peroxyde: r2(ph(t).liquides.cin_peroxyde || 0), I2: r2((1000 * (ph(t).dissous.I2 || 0)) / ph(t).V) }]));
      const s = JSON.stringify(f); if (s !== avant) { avant = s; L.missions.noter("tubes_froid", f); }
    });
    g.append(g.querySelector(".document-ouvert"));
    return { pense_bete };
  };
})(window.Labo);
