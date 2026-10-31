/*
Rôle : simulation de l'activité 1 du chapitre « Lois de Newton » (2e année du bac) : vecteurs vitesse et accélération à
       partir d'enregistrements de la table à coussin d'air. Paillasse 1 : table inclinée (sin α = 0,050), mobile lancé
       vers le haut : il ralentit, s'arrête, redescend ; v(t) au tableur, aG = Δv/Δt (m/s²), sens de a, signe de a·v.
       Paillasse 2 : table horizontale, mobile retenu par un fil (mouvement circulaire uniforme) : vecteurs vitesse, Δv
       vers le centre, repère de Frenet, aN = v²/R. Objectifs O1, O2, O3.
Reçoit : rien (les vérifications lisent l'enregistrement, les flèches, la feuille de calcul et le graphique).
Produit : la simulation démarrée.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const V = L.VERIF_ENR, G = 9.81, SIN = 0.05, ECHELLE = 100, CLOU = L.CoussinAir.CLOU;
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const nombre = (unite, attendu, tolerance, aide, bravo) => ({ type: "nombre", unite, attendu, tolerance, aide, bravo });
  const enr = (f) => V.dernier(f), sommet = (p) => p.reduce((k, q, i) => (q.y < p[k].y ? i : k), 0);
  const montee = (f) => { const e = enr(f); return e && !e.fil ? e : null; }, cercle = (f) => { const e = enr(f); return e && e.fil ? e : null; };

  function lancer({ faits }) {
    // Mobile lancé vers le fond de la table : au moins 20 points, sommet (arrêt) après M5 et avant les 4 derniers points.
    const e = montee(faits);
    if (!e) return false;
    const s = sommet(e.points);
    if (e.points.length < 20) return "Enregistrement trop court : choisissez τ = 60 ms ou lancez un peu moins fort.";
    return (s >= 6 && s <= e.points.length - 5) || "Lancez le mobile depuis le bas, vers le fond de la table : il doit monter, s'arrêter, puis redescendre pendant l'enregistrement.";
  }

  function tableau({ faits, feuille }) {
    // Au moins six points de la montée : t = i·τ (s) en A, vi (m/s) en B.
    const e = montee(faits);
    if (!e) return false;
    const l = feuille.lignes(["A", "B"]), s = sommet(e.points);
    if (l.length < 6) return false;
    for (const [k, r] of l.entries()) {
      const i = Math.round(r.A / e.tau_s);
      if (Math.abs(r.A - i * e.tau_s) > 0.0005 || i < 1 || i >= s) return `Ligne ${k + 2} : en A, t = i × τ pour un point Mi de la montée (avant l'arrêt, M${s}).`;
      const v = V.vitesse(e.points, i, e.tau_s);
      if (Math.abs(r.B - v) > Math.max(0.04 * v, 0.01)) return `Ligne ${k + 2} (M${i}) : vi = M${i - 1}M${i + 1} / (2τ), en m/s.`;
    }
    return true;
  }

  function vecteurs({ faits }) {
    // Flèches v2 et v4 correctes sur l'enregistrement en cours (montée ou cercle).
    const e = enr(faits), v = faits.vecteurs || {};
    if (!e) return false;
    for (const i of e.fil ? [4, 6] : [2, 4]) { const r = L.vecteurs_vitesse.verifier(v[i], e.points, i, e.tau_s, ECHELLE); if (r !== true) return r; }
    return true;
  }

  const R5 = (f) => V.distance(cercle(f).points[5], CLOU) / 1000, v5 = (f) => V.vitesse(cercle(f).points, 5, cercle(f).tau_s);

  const PENTE = {
    id: "pente", paillasse: 0, titre: "Vitesse et accélération sur une pente",
    objectif: "Enregistrer un mobile lancé vers le haut d'une table inclinée ; tracer v(t) ; déterminer et représenter l'accélération.",
    entetes: ["t (s)", "v (m/s)"],
    donnees: ["Table inclinée : sin α = 0,050 ; g = 9,81 m/s²", "vi = Mi−1Mi+1 / (2τ) ; aG ≈ Δv / Δt", "Échelle des flèches : 1 cm ↔ 0,1 m/s"],
    conclusion: "Le vecteur vitesse est tangent à la trajectoire, dans le sens du mouvement. Le vecteur accélération aG = dvG/dt s'exprime en m/s² ; ici, il est constant, parallèle à la pente et dirigé vers le bas : aG = g·sin α ≈ 0,49 m/s², à la montée comme à la descente. À la montée, aG et vG sont de sens contraires (aG·vG < 0) : le mouvement est ralenti ; à la descente, ils ont le même sens (aG·vG > 0) : le mouvement est accéléré. Dans un repère cartésien, ax = dvx/dt = d²x/dt².",
    conclusion_courte: "aG = ΔvG/Δt (m/s²) ; a·v < 0 : ralenti ; a·v > 0 : accéléré.",
    etapes: [
      { consigne: "Appuyez sur « Enregistrer », puis lancez le mobile depuis le bas vers le fond de la table : il monte, s'arrête, redescend.", court: "Enregistrez une montée et une descente.", aide_geste: "Un geste vif, droit vers le fond de la table.", verifier: lancer },
      { consigne: "Prenez la feuille ; tracez les vecteurs vitesse v₂ et v₄ (échelle 1 cm ↔ 0,1 m/s).", court: "Tracez v₂ et v₄.", aide_geste: "Faites glisser la pointe de chaque flèche ; mesurez à la règle.", verifier: vecteurs },
      { consigne: "Le vecteur Δv = v₄ − v₂ est…", court: "Répondez dans le carnet.", question: choix(["parallèle à la pente, dirigé vers le bas : de sens contraire à la vitesse", "dans le sens de la vitesse", "nul"], "Placez v₄ et −v₂ bout à bout.", "Exact.") },
      { consigne: "Tableur, pour au moins six points de la montée : en A, t = i·τ (s) ; en B, vi (m/s).", court: "Tableur : t, v (montée).", verifier: tableau },
      { consigne: "Tracez v (B) en fonction de t (A) et modélisez par une droite y = a·x + b.", court: "Courbe v = f(t).", verifier: ({ courbe }) => (courbe.x === "A" && courbe.y === "B" && courbe.n >= 6 && courbe.modele === "affine") || "Abscisse : A ; ordonnée : B ; modèle y = a·x + b." },
      { consigne: "Valeur de l'accélération aG = |Δv/Δt| (m/s²) ?", court: "aG (m/s²) ?", question: nombre("m/s²", G * SIN, 0.05, "Valeur absolue du coefficient directeur de la droite.", "Exact : aG = g·sin α ≈ 0,49 m/s².") },
      { consigne: "L'unité de l'accélération est…", court: "Répondez dans le carnet.", question: choix(["le m/s² : une variation de vitesse (m/s) par unité de temps (s)", "le m/s", "le N"], "Équation aux dimensions : [v]/[t].", "Exact.") },
      { consigne: "Pendant la montée aG·vG < 0, pendant la descente aG·vG > 0. Donc le mouvement est…", court: "Répondez dans le carnet.", question: choix(["ralenti à la montée, accéléré à la descente", "accéléré à la montée, ralenti à la descente", "uniforme"], "Comparez les sens de aG et de vG.", "Exact.") },
      { consigne: "Dans un repère cartésien (O, i, j), les coordonnées de l'accélération sont…", court: "Répondez dans le carnet.", question: choix(["ax = dvx/dt = d²x/dt² et ay = dvy/dt = d²y/dt²", "ax = x/t² et ay = y/t²", "ax = vx·t et ay = vy·t"], "L'accélération est la dérivée de la vitesse.", "Exact.") },
    ],
  };

  const VIRAGE = {
    id: "virage", paillasse: 1, titre: "Accélération d'un mouvement circulaire",
    objectif: "Enregistrer un mouvement circulaire uniforme ; vecteurs vitesse ; accélération dans le repère de Frenet.",
    entetes: [],
    donnees: ["Le fil retient le mobile au clou O (marqué sur la feuille)", "Repère de Frenet : u tangent, dans le sens du mouvement ; n vers le centre", "aG = (dv/dt)·u + (v²/R)·n"],
    conclusion: "Dans un mouvement circulaire uniforme, la valeur de la vitesse ne change pas mais sa direction tourne : Δv est dirigé vers le centre. Dans le repère de Frenet, aG = (dv/dt)·u + (v²/R)·n ; ici dv/dt = 0, donc aG = (v²/R)·n : l'accélération est centripète, de valeur v²/R.",
    conclusion_courte: "MCU : aG = v²/R, centripète.",
    etapes: [
      { consigne: "Accrochez le fil au mobile ; appuyez sur « Enregistrer » et lancez le mobile : il tourne autour du clou.", court: "Enregistrez un mouvement circulaire.", aide_geste: "Faites glisser l'anneau du fil jusqu'au mobile.", verifier: ({ faits }) => (faits.fil_accroche && cercle(faits) && cercle(faits).points.length >= 12) || false },
      { consigne: "Sur la feuille, tracez les vecteurs vitesse v₄ et v₆.", court: "Tracez v₄ et v₆.", verifier: vecteurs },
      { consigne: "Le vecteur Δv = v₆ − v₄ (donc aG en M₅) est dirigé…", court: "Répondez dans le carnet.", question: choix(["vers le centre O du cercle", "dans le sens du mouvement", "vers l'extérieur du cercle"], "Placez v₆ et −v₄ bout à bout, au point M₅.", "Exact : l'accélération est centripète.") },
      { consigne: "Mesurez le rayon R = OM₅ (m) à la règle.", court: "R (m) ?", question: nombre("m", R5, 0.003, "Du centre de la croix O au point M₅.", "Exact.") },
      { consigne: "Vitesse v₅ = M₄M₆ / (2τ) (m/s) ?", court: "v₅ (m/s) ?", question: { ...nombre("m/s", v5, null, "Mesurez M₄M₆ en mètre.", "Exact."), tolerance_relative: 0.04 } },
      { consigne: "Accélération normale aN = v₅² / R (m/s²) ?", court: "aN (m/s²) ?", question: { ...nombre("m/s²", (f) => v5(f) ** 2 / R5(f), null, "aN = v² / R.", "Exact."), tolerance_relative: 0.1 } },
      { consigne: "Dans le repère de Frenet, l'accélération de ce mouvement s'écrit…", court: "Répondez dans le carnet.", question: choix(["aG = (v²/R)·n, car dv/dt = 0", "aG = (dv/dt)·u, car v²/R = 0", "aG = 0, car la vitesse est constante"], "aG = (dv/dt)·u + (v²/R)·n.", "Exact : un mouvement uniforme peut avoir une accélération.") },
    ],
  };

  const pente = (g) => L.poste_coussin_air(g, { nom: "pente", inclinaison_mm_s2: G * 1000 * SIN, outils: ["regle"], vecteurs: { indices: [2, 4], echelle_mm_par_ms: ECHELLE } });
  const virage = (g) => { const p = L.poste_coussin_air(g, { nom: "virage", fil: true, outils: ["regle"], vecteurs: { indices: [4, 6], echelle_mm_par_ms: ECHELLE } }); p.table.axe = CLOU; return p; };
  L.demarrer({ id: "b2_meca1_a1_vecteurs", titre: "Laboratoire : vitesse et accélération", paillasses: [pente, virage], missions: [PENTE, VIRAGE] });
})(window.Labo);
