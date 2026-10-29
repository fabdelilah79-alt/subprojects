/*
Rôle : simulation de l'activité 1 du chapitre « Relation entre la somme des moments et l'accélération angulaire »
       (2e année du bac) : disque entraîné par une masse, filmé et pointé en mode polaire ; abscisse angulaire θ, vitesse
       angulaire θ̇ et accélération angulaire θ̈ par encadrement ; rotation uniformément variée et équations horaires ;
       aT = R·θ̈ et aN = R·θ̇² ; rotation uniforme (fil décroché) et uniformément retardée (patin). Objectifs O1, O2, O4.
Reçoit : rien (les vérifications lisent « films », « pointage », la feuille de calcul et le graphique).
Produit : la simulation démarrée.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const OM = 0.08, AXE = { x: 0.2, y: 0.15 };
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const nombre = (unite, attendu, tolerance, aide, bravo) => ({ type: "nombre", unite, attendu, tolerance, aide, bravo });
  const relatif = (unite, attendu, aide, bravo) => ({ type: "nombre", unite, attendu, tolerance_relative: 0.07, aide, bravo });
  const P = (f) => f.pointage || {}, film = (f, type) => (f.films || []).filter((e) => e.type === type).pop() || {};

  function pointe(f, type, n) {
    // Le dernier film de ce type est étalonné, l'origine est sur l'axe, M est pointé sur les images 0 à n − 1.
    const p = P(f), o = p.origine_m;
    if (!film(f, type).id || p.video !== film(f, type).id || !p.echelle_ok) return false;
    if (o && Math.hypot(o.x - AXE.x, o.y - AXE.y) > 0.004) return "Placez l'origine au centre de l'axe du disque : θ est un angle autour de l'axe.";
    const k = new Set((p.points || []).map((q) => q.k));
    return (!!o && [...Array(n).keys()].every((i) => k.has(i))) || false;
  }

  function tableau(n_c, n_d) {
    // A, B : t, θ exportés ; C : θ̇ par encadrement (n_c lignes au moins) ; D : θ̈ par encadrement de θ̇ (n_d lignes au moins).
    return ({ faits, feuille }) => {
      const v = (c, n) => feuille.valeur_sure(`${c}${n}`), pts = P(faits).points || [], compte = { A: 0, C: 0, D: 0 };
      const derivee = (c, n) => (v(c, n + 1) - v(c, n - 1)) / (v("A", n + 1) - v("A", n - 1));
      for (let n = 2; n <= 12; n++) {
        if (v("A", n) === null) continue;
        const q = pts.find((p) => Math.abs(p.t - v("A", n)) < 1e-3);
        if (!q || Math.abs(v("B", n) - q.theta) > 1e-3) return `Ligne ${n} : touchez « Exporter » dans le logiciel pour copier t et θ.`;
        compte.A++;
        for (const [c, s, nom] of [["C", "B", "θ̇"], ["D", "C", "θ̈"]]) {
          if (v(c, n) === null) continue;
          if (v(s, n - 1) === null || v(s, n + 1) === null) return `Ligne ${n} : ${nom} demande les lignes voisines de la colonne ${s}.`;
          if (Math.abs(v(c, n) - derivee(s, n)) > 0.01 * Math.abs(derivee(s, n)) + 0.01) return `Ligne ${n} : en ${c}, ${nom} = (${s}${n + 1} − ${s}${n - 1}) / (A${n + 1} − A${n - 1}).`;
          compte[c]++;
        }
      }
      return (compte.A >= 9 && compte.C >= n_c && compte.D >= n_d) || false;
    };
  }

  const graphique = ({ courbe: c }) => (c.x === "A" && c.y === "C" && c.n >= 7 && c.modele === "affine") || "Abscisse : A ; ordonnée : C ; modèle y = a·x + b.";
  const POINTER = "Logiciel : « Échelle » (traits 0 et 20 cm de la règle filmée), « Origine » au centre de l'axe, puis pointez le repère M";

  const ACCELERE = {
    id: "accelere", paillasse: 0, titre: "Rotation entraînée par la masse",
    objectif: "Filmer le disque lâché, repérer M par son abscisse angulaire θ, calculer θ̇ et θ̈ par encadrement.",
    entetes: ["t (s)", "θ (rad)", "θ̇ (rad/s)", "θ̈ (rad/s²)"],
    donnees: ["Caméra : 25 images/s (Δt = 0,04 s)", "Encadrement : θ̇i = (θi+1 − θi−1) / (2Δt) ; θ̈i = (θ̇i+1 − θ̇i−1) / (2Δt)", "OM = 0,080 m ; v = OM·θ̇"],
    conclusion: "Un point M d'un solide en rotation autour d'un axe fixe est repéré par son abscisse angulaire θ (rad). Par analogie avec la translation, la vitesse angulaire est θ̇ = dθ/dt (rad/s) et l'accélération angulaire θ̈ = d²θ/dt² (rad/s²) ; on les calcule par encadrement. Entraîné par la masse, le disque a une accélération angulaire constante : la rotation est uniformément variée, θ̇ = θ̈·t + θ̇0 et θ = ½·θ̈·t² + θ̇0·t + θ0. Le point M a une accélération tangentielle aT = R·θ̈ et une accélération normale aN = R·θ̇².",
    conclusion_courte: "θ̈ = cte : θ = ½·θ̈·t² + θ̇0·t + θ0 ; aT = R·θ̈, aN = R·θ̇².",
    etapes: [
      { consigne: "Appuyez sur « Lâcher » : le frein se desserre, la masse descend et la caméra filme le disque pendant 1,6 s.", court: "Lâchez le disque.", verifier: ({ faits }) => !!film(faits, "lacher").id || false },
      { consigne: `${POINTER} sur les images 0 à 10.`, court: "Étalonnez, origine, pointez M.", aide_geste: "Le logiciel est réglé en mode polaire : il donne θ = (Ox, OM).", verifier: ({ faits }) => pointe(faits, "lacher", 11) },
      { consigne: "L'abscisse angulaire θ donnée par le logiciel est…", court: "Répondez dans le carnet.", question: choix(["l'angle (Ox, OM) en radians, compté dans le sens de rotation", "la distance OM en mètres", "le nombre de tours"], "Regardez la colonne θ du logiciel.", "Exact : s = OM·θ est l'abscisse curviligne de M.") },
      { consigne: "« Exporter » ; en C (à partir de C3), calculez θ̇ par encadrement : θ̇ = (θ suivant − θ précédent) / (2 × 0,04).", court: "Tableur : θ̇ en C.", verifier: tableau(8, 0) },
      { consigne: "En D (à partir de D4), calculez de même θ̈ = (θ̇ suivant − θ̇ précédent) / (2 × 0,04).", court: "Tableur : θ̈ en D.", verifier: tableau(8, 6) },
      { consigne: "Les valeurs de θ̈ (colonne D) sont…", court: "Répondez dans le carnet.", question: choix(["à peu près constantes", "nulles", "de plus en plus grandes"], "Comparez-les (les écarts viennent du pointage).", "Exact : la rotation est uniformément variée.") },
      { consigne: "Tracez θ̇ (C) en fonction de t (A), modèle y = a·x + b.", court: "Courbe θ̇ = f(t).", verifier: graphique },
      { consigne: "Accélération angulaire θ̈ du disque (coefficient directeur) ?", court: "θ̈ (rad/s²) ?", question: relatif("rad/s²", (f) => film(f, "lacher").alpha, "Coefficient directeur de θ̇(t).", "Exact.") },
      { consigne: "θ̇(0) ≈ 0 (disque lâché sans vitesse) et θ0 est en B2. Les équations horaires sont…", court: "Répondez dans le carnet.", question: choix(["θ̇ = θ̈·t et θ = ½·θ̈·t² + θ0", "θ = θ̈·t + θ0", "θ̇ = ½·θ̈·t²"], "Analogie avec x = ½·a·t² + x0.", "Exact.") },
      { consigne: "Avec ces équations, calculez θ à t = 0,40 s (θ0 = 0,50 rad), puis comparez à B12.", court: "θ (0,40 s) en rad ?", question: nombre("rad", (f) => 0.5 + 0.5 * film(f, "lacher").alpha * 0.16, 0.06, "θ = ½·θ̈·t² + θ0.", "Exact : l'équation horaire prévoit bien la mesure.") },
      { consigne: "À t = 0,20 s, accélération tangentielle du point M : aT = OM·θ̈ (m/s²) ?", court: "aT (m/s²) ?", question: relatif("m/s²", (f) => OM * film(f, "lacher").alpha, "OM = 0,080 m.", "Exact : aT ne change pas, θ̈ est constante.") },
      { consigne: "À t = 0,20 s, accélération normale de M : aN = OM·θ̇² (m/s²) ?", court: "aN (m/s²) ?", question: relatif("m/s²", (f) => OM * (film(f, "lacher").alpha * 0.2) ** 2, "θ̇ = θ̈·t à t = 0,20 s.", "Exact : aN = v²/R augmente avec la vitesse.") },
    ],
  };

  const TYPES = {
    id: "types", paillasse: 0, titre: "Rotation uniforme, rotation freinée",
    objectif: "Filmer le disque quand le fil s'est décroché, puis pendant le freinage ; reconnaître le type de rotation par θ̈.",
    entetes: ["t (s)", "θ (rad)", "θ̇ (rad/s)", ""],
    donnees: ["Fil décroché : aucun moment moteur ; frottements de l'axe négligeables", "Patin du frein : moment de freinage constant", "θ̇ = (θi+1 − θi−1) / (2 × 0,04)"],
    conclusion: "Le type de rotation se lit sur θ̈ : si θ̈ = 0, θ̇ est constante et la rotation est uniforme (θ = θ̇·t + θ0) ; si θ̈ est constante et non nulle, la rotation est uniformément variée, accélérée si θ̇·θ̈ > 0, retardée si θ̇·θ̈ < 0.",
    conclusion_courte: "θ̈ = 0 : uniforme ; θ̈ = cte ≠ 0 : uniformément variée.",
    etapes: [
      { consigne: "Attendez que la masse se pose sur la mousse (le fil se décroche), puis touchez « REC » sur la caméra : elle filme le disque qui tourne seul.", court: "Filmez la rotation libre.", aide_geste: "Si le disque est arrêté, « Remonter » puis « Lâcher ».", verifier: ({ faits }) => !!film(faits, "libre").id || false },
      { consigne: `${POINTER} sur les images 0 à 8.`, court: "Pointez M (images 0 à 8).", verifier: ({ faits }) => pointe(faits, "libre", 9) },
      { consigne: "« Exporter » ; en C (à partir de C3), calculez θ̇ par encadrement.", court: "Tableur : θ̇ en C.", verifier: tableau(7, 0) },
      { consigne: "Tracez θ̇ (C) en fonction de t (A), modèle y = a·x + b.", court: "Courbe θ̇ = f(t).", verifier: graphique },
      { consigne: "θ̇ ne varie pas : θ̈ = 0. La rotation est…", court: "Répondez dans le carnet.", question: choix(["uniforme : θ = θ̇·t + θ0", "uniformément accélérée", "uniformément retardée"], "Coefficient directeur de θ̇(t) ?", "Exact : plus rien n'entraîne ni ne freine le disque.") },
      { consigne: "Vitesse angulaire du disque (rad/s) ?", court: "θ̇ (rad/s) ?", question: relatif("rad/s", (f) => film(f, "libre").omega0, "Ordonnée à l'origine (ou moyenne de la colonne C).", "Exact.") },
      { consigne: "Appuyez sur « Freiner » : le patin serre le disque et la caméra filme 1,2 s.", court: "Freinez le disque.", verifier: ({ faits }) => !!film(faits, "frein").id || false },
      { consigne: `${POINTER} sur les images 0 à 8 du nouveau film.`, court: "Pointez M (freinage).", verifier: ({ faits }) => pointe(faits, "frein", 9) },
      { consigne: "« Exporter » ; recalculez θ̇ en C (à partir de C3).", court: "Tableur : θ̇ en C.", verifier: tableau(7, 0) },
      { consigne: "Accélération angulaire pendant le freinage (coefficient directeur de θ̇(t), avec son signe) ?", court: "θ̈ (rad/s²) ?", question: nombre("rad/s²", (f) => film(f, "frein").alpha, 0.8, "Le graphique s'est mis à jour.", "Exact : θ̈ est constante et négative.") },
      { consigne: "Pendant le freinage, la rotation est…", court: "Répondez dans le carnet.", question: choix(["uniformément retardée : θ̈ constante, de signe contraire à θ̇", "uniforme", "uniformément accélérée"], "Signe de θ̇·θ̈ ?", "Exact.") },
    ],
  };

  L.demarrer({ id: "b2_meca3_a1_angulaire", titre: "Laboratoire : abscisse et accélération angulaires", paillasses: [L.poste_disque], missions: [ACCELERE, TYPES] });
})(window.Labo);
