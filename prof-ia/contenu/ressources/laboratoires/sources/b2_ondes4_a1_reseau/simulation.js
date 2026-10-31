/*
Rôle : simulation de l'activité 1 du chapitre « Diffraction de la lumière par un réseau » (2e année du bac) : modèles de
       réseau (diapositives, CD, DVD au microscope : pas a, traits par mm) ; diffraction d'un laser par une fente qui
       rétrécit puis par des réseaux (banc_reseau.js, vu de dessus) : directions des maximums, sin θk = k·λ / a, pas d'un CD,
       influence du nombre de traits par mm, nombre de maximums. Objectifs O1, O2, O3, O4.
Reçoit : rien (les vérifications lisent les faits « modeles » et « reseau », la feuille et la courbe).
Produit : la simulation démarrée.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const nombre = (unite, attendu, tolerance, aide, bravo) => ({ type: "nombre", unite, attendu, tolerance, aide, bravo });
  const M = (f) => f.modeles || {}, R = (f) => f.reseau || {};
  const intervalles = (f, cle) => { const m = M(f), k = Math.round(m.ecart / m.a); return m.objet === cle && k >= 5 && Math.abs(m.ecart - k * m.a) <= 0.12 * m.a; };
  const sur_ordre = (f, k) => (R(f).ordres || []).some((o) => o.k === k && o.ecran && [R(f).c1, R(f).c2].some((c) => Math.abs(c - o.x) <= 2));

  function tableau({ feuille }) {
    // Réseau de 100 traits/mm, laser rouge, D = 1,00 m : k en A, x_k (mm) en B, sin θk = x / √(x² + D²) en C ; quatre ordres.
    const l = feuille.lignes(["A", "B", "C"]);
    if (l.length < 4) return false;
    for (const [n, x] of l.entries()) {
      const vrai = 1000 * Math.tan(Math.asin((x.A * 650) / 10000));
      if (!Number.isInteger(x.A) || x.A < 1 || Math.abs(x.B - vrai) > 2) return `Ligne ${n + 2} : en A l'ordre k (1, 2, 3…), en B la position x de la tache d'ordre k sur l'écran (mm), mesurée à D = 1,00 m avec le réseau de 100 traits/mm.`;
      if (Math.abs(x.C - x.B / Math.hypot(x.B, 1000)) > 0.002) return `Ligne ${n + 2} : en C, sin θ = x / √(x² + D²), x et D en mm : =B${n + 2}/RACINE(B${n + 2}^2+1000^2).`;
    }
    return new Set(l.map((x) => x.A)).size >= 4 || "Quatre ordres différents.";
  }

  const MODELES = {
    id: "modeles", paillasse: 0, titre: "Modèles de réseau",
    objectif: "Observer des réseaux au microscope ; mesurer leur pas a ; relier a au nombre de traits par millimètre.",
    entetes: [],
    donnees: ["Pas du réseau a : distance entre deux traits voisins", "n traits par mm : a = 1 / n (a en mm)", "1 mm = 1 000 µm"],
    conclusion: "Un réseau est un ensemble d'un très grand nombre de fentes (traits) fines, parallèles, identiques et équidistantes. Il est caractérisé par son pas a, distance entre deux traits voisins, ou par son nombre n de traits par unité de longueur : a = 1 / n. Le réseau de 100 traits/mm a un pas de 10 µm ; les sillons d'un CD sont espacés de 1,6 µm (625 traits/mm environ), ceux d'un DVD de 0,74 µm : ce sont des réseaux, d'où leurs couleurs.",
    conclusion_courte: "Réseau : n traits par mm, pas a = 1/n.",
    etapes: [
      { consigne: "Touchez la diapositive « 100 traits/mm ». Placez les deux curseurs au milieu de deux fentes claires séparées d'au moins cinq intervalles.", court: "Curseurs : au moins 5 intervalles.", aide_geste: "Glissez les traits rouges ; comptez les intervalles entre eux.", verifier: ({ faits }) => intervalles(faits, "r100") || false },
      { consigne: "Pas a de ce réseau (µm) ?", court: "a (µm) ?", question: nombre("µm", 10, 0.3, "Écart entre les curseurs divisé par le nombre d'intervalles.", "Exact : a = 10 µm = 0,010 mm, donc 1 / a = 100 traits par mm.") },
      { consigne: "Pas d'un réseau de 600 traits par mm (µm) ?", court: "a (600 traits/mm) ?", question: nombre("µm", 1000 / 600, 0.03, "a = 1 / n = 1/600 mm.", "Exact : environ 1,67 µm (vérifiez sur la photographie).") },
      { consigne: "Touchez le CD. Mesurez l'écart entre deux sillons séparés d'au moins cinq intervalles.", court: "CD : au moins 5 intervalles.", verifier: ({ faits }) => intervalles(faits, "cd") || false },
      { consigne: "Pas des sillons du CD (µm) ?", court: "a (CD, µm) ?", question: nombre("µm", 1.6, 0.06, "Écart divisé par le nombre d'intervalles.", "Exact : 1,6 µm.") },
      { consigne: "Nombre de sillons par millimètre du CD ?", court: "n (CD) ?", question: nombre("traits/mm", 625, 20, "n = 1 / a, avec a en mm.", "Exact : environ 625 par mm.") },
      { consigne: "Un réseau est…", court: "Répondez dans le carnet.", question: choix(["un grand nombre de fentes fines, parallèles, identiques et équidistantes", "une seule fente très fine", "un ensemble de traits placés au hasard"], "Regardez les photographies.", "Exact.") },
      { consigne: "Sous une lampe, un CD se couvre de couleurs parce que…", court: "Répondez dans le carnet.", question: choix(["ses sillons très serrés forment un réseau qui diffracte la lumière, chaque radiation dans une direction différente", "il contient des pigments colorés", "il absorbe le blanc"], "Pensez à la diffraction.", "Exact : c'est un réseau (par réflexion).") },
    ],
  };

  const DIRECTIONS = {
    id: "directions", paillasse: 1, titre: "Fente, réseau, directions des maximums",
    objectif: "Comparer une fente et un réseau ; repérer les directions des maximums ; vérifier sin θk = k·λ / a.",
    entetes: ["k", "x (mm)", "sin θ"],
    donnees: ["Laser rouge : λ = 650 nm", "x : position d'une tache sur l'écran ; D : distance réseau-écran", "sin θ = x / √(x² + D²)"],
    conclusion: "Quand la fente rétrécit, la lumière est plus diffractée (θ = λ / a). Un réseau donne des taches fines et brillantes, régulièrement espacées : la lumière ne repart que dans des directions précises θk (ordres k = 0, ±1, ±2…), symétriques par rapport au faisceau incident, qui n'est pas dévié (k = 0). sin θk est proportionnel à k : sin θk = k·λ / a. Avec la pente λ / a = 0,065, on retrouve n = 1 / a = 100 traits par mm.",
    conclusion_courte: "sin θk = k·λ / a.",
    etapes: [
      { consigne: "Laser rouge, fente de 100 µm, écran à 1,00 m. Passez à la fente de 50 µm (touche Diapositive). Quand la fente rétrécit, la tache centrale…", court: "Répondez dans le carnet.", question: choix(["s'élargit : la lumière est plus diffractée", "rétrécit", "ne change pas"], "Comparez les deux figures sur l'écran.", "Exact : θ = λ / a augmente quand a diminue.") },
      { consigne: "Passez au réseau de 100 traits/mm. Sur l'écran, on voit…", court: "Répondez dans le carnet.", question: choix(["des taches fines et brillantes, régulièrement espacées de part et d'autre de la tache centrale", "une seule tache centrale très large", "un éclairement uniforme"], "Regardez l'écran vu de face.", "Exact.") },
      { consigne: "Sur la table (vue de dessus), après le réseau, la lumière…", court: "Répondez dans le carnet.", question: choix(["repart dans quelques directions précises θk (k = 0, ±1, ±2…), symétriques par rapport au faisceau incident", "continue en ligne droite seulement", "s'étale dans toutes les directions"], "Suivez les faisceaux sur la table.", "Exact : chaque direction correspond à un ordre k ; k = 0 n'est pas dévié.") },
      { consigne: "Tableur : écran à 1,00 m, réseau de 100 traits/mm. Mesurez x pour les ordres 1 à 4 avec un curseur. En A : k ; en B : x (mm) ; en C : sin θ.", court: "Tableur : k, x, sin θ.", aide_geste: "Placez un curseur au milieu de chaque tache, à droite de la tache centrale.", verifier: tableau },
      { consigne: "Tracez sin θ (C) en fonction de k (A).", court: "Courbe sin θ = f(k).", verifier: ({ courbe }) => (courbe.x === "A" && courbe.y === "C" && courbe.n >= 4) || "Abscisse : A (k) ; ordonnée : C (sin θ)." },
      { consigne: "La droite passe par l'origine : sin θk = k·λ / a. Coefficient directeur ?", court: "Pente ?", question: nombre("", 0.065, 0.002, "Pente de la droite.", "Exact : λ / a = 0,065.") },
      { consigne: "Nombre de traits par mm du réseau, n = 1 / a = pente / λ (λ en mm) ?", court: "n (traits/mm) ?", question: nombre("traits/mm", 100, 4, "λ = 650 nm = 6,50 × 10⁻⁴ mm.", "Exact : on retrouve l'indication de la diapositive.") },
    ],
  };

  const PAS = {
    id: "pas", paillasse: 1, titre: "Pas d'un CD, nombre de maximums",
    objectif: "Mesurer le pas d'un CD par diffraction ; voir l'influence du nombre de traits par mm ; compter les maximums.",
    entetes: [],
    donnees: ["sin θk = k·λ / a ; |sin θk| ≤ 1", "Laser rouge : λ = 650 nm"],
    conclusion: "Plus le réseau a de traits par mm (pas a petit), plus les maximums sont écartés : sin θ1 = λ / a. Le CD sans couche réfléchissante est un réseau de pas 1,6 µm, comme au microscope. Comme |sin θk| ≤ 1, |k| ≤ a / λ : le nombre de maximums est limité. Avec 600 traits/mm (a / λ ≈ 2,6), on voit 5 maximums (k = 0, ±1, ±2) ; avec un DVD (a / λ ≈ 1,1), 3 seulement.",
    conclusion_courte: "|k| ≤ a / λ ; pas a = λ / sin θ1.",
    etapes: [
      { consigne: "Passez du réseau de 100 au réseau de 300 traits/mm. Les taches…", court: "Répondez dans le carnet.", question: choix(["s'écartent : sin θ1 = λ / a augmente quand le pas a diminue", "se rapprochent", "ne bougent pas"], "Comparez les deux figures.", "Exact.") },
      { consigne: "Prenez le CD, écran à 0,25 m. Placez un curseur sur une tache d'ordre 1.", court: "CD : curseur sur l'ordre 1.", aide_geste: "Rapprochez l'écran en le faisant glisser vers le réseau.", verifier: ({ faits }) => (R(faits).n === 625 && R(faits).source === "rouge" && R(faits).D === 0.25 && (sur_ordre(faits, 1) || sur_ordre(faits, -1))) || false },
      { consigne: "Pas du CD : a = λ / sin θ1, avec sin θ1 = x / √(x² + D²) (µm) ?", court: "a (CD, µm) ?", question: nombre("µm", 1.6, 0.05, "x et D dans la même unité ; λ = 0,650 µm.", "Exact : 1,6 µm, comme au microscope.") },
      { consigne: "Réseau de 600 traits/mm, écran à 0,25 m. Combien de maximums (taches) en tout ?", court: "Nombre de maximums ?", question: nombre("", (f) => (R(f).n === 600 ? R(f).maximums : 5), 0, "Comptez les taches sur l'écran et les faisceaux sur la table.", "Exact : k = 0, ±1, ±2.") },
      { consigne: "Le nombre de maximums est limité parce que…", court: "Répondez dans le carnet.", question: choix(["|sin θk| ≤ 1, donc |k| ≤ a / λ", "l'écran est trop petit", "le laser n'est pas assez puissant"], "sin θk = k·λ / a.", "Exact.") },
      { consigne: "Avec le DVD (1 350 traits/mm), combien de maximums ?", court: "Nombre de maximums (DVD) ?", question: nombre("", 3, 0, "a / λ = 0,74 / 0,65 ; suivez les faisceaux sur la table.", "Exact : k = 0 et ±1 ; les ordres ±1 sont si déviés qu'ils manquent l'écran.") },
    ],
  };

  L.poste_banc_reseau = function (g) {
    // Pense-bête et banc à réseau (incidence normale).
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230);
    L.banc_reseau(g, { fait: "reseau", objets: [0, 1, 2, 3, 4, 5, 6], D: 1 });
    return { pense_bete };
  };

  L.demarrer({ id: "b2_ondes4_a1_reseau", titre: "Laboratoire : le réseau", paillasses: [L.poste_modeles, L.poste_banc_reseau], missions: [MODELES, DIRECTIONS, PAS] });
})(window.Labo);
