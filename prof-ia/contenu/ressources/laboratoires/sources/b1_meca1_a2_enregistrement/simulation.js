/*
Rôle : simulation de l'activité 2 du chapitre « Rotation d'un solide autour d'un axe fixe » (1re année du bac) :
       enregistrement du mouvement de deux points A et B d'un solide qui tourne autour d'un axe fixe ; abscisse angulaire θ
       (rapporteur), abscisse curviligne s = R·θ, vitesse angulaire ω, vitesse v = R·ω, équation horaire θ(t). Objectifs O2 à O6.
Reçoit : rien (les vérifications lisent l'enregistrement et la feuille de calcul).
Produit : la simulation démarrée.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const RA = 60, RB = 120, O = { x: 300, y: 200 }, deg = Math.PI / 180;
  const enr = (faits) => (faits.enregistrement?.points?.[0]?.b ? faits.enregistrement : null);

  function theta(e, i) {
    // Abscisse angulaire de B à l'étincelle i, en radians, comptée depuis B0 (positive dans le sens du mouvement).
    const a = (p) => Math.atan2(p.b.y - O.y, p.b.x - O.x);
    let t = 0;
    for (let k = 1; k <= i; k++) { let d = a(e.points[k]) - a(e.points[k - 1]); if (d > Math.PI) d -= 2 * Math.PI; if (d < -Math.PI) d += 2 * Math.PI; t += d; }
    return Math.abs(t);
  }
  const omega = (e) => theta(e, 16) / (16 * e.tau_s);
  const vB8 = (e) => Math.hypot(e.points[10].b.x - e.points[6].b.x, e.points[10].b.y - e.points[6].b.y) / 1000 / (4 * e.tau_s);

  function enregistrement({ faits }) {
    // Un enregistrement d'au moins 17 points, le solide ayant tourné.
    const e = enr(faits);
    if (!e) return false;
    if (e.points.length < 17) return "Enregistrement trop court : appuyez sur « Enregistrer », puis lancez le solide.";
    return theta(e, 16) > 20 * deg || "Le solide a trop peu tourné : poussez-le d'un geste plus vif.";
  }

  function tableau({ faits, feuille }) {
    // Lignes 2 à 10 : points B0, B2… B16 : t (s), θ (rad), s_A = OA·θ et s_B = OB·θ (mm).
    const e = enr(faits), l = feuille.lignes(["A", "B", "C", "D"]);
    if (!e || l.length < 9) return false;
    for (const [k, r] of l.slice(0, 9).entries()) {
      const i = 2 * k, th = theta(e, i);
      if (Math.abs(r.A - i * e.tau_s) > 1e-4) return `Ligne ${k + 2} : t = ${i} × τ (point B${i}).`;
      if (Math.abs(r.B - th) > 2.5 * deg) return `Ligne ${k + 2} : mesurez l'angle (OB0, OB${i}) au rapporteur, puis convertissez-le en radians.`;
      if (Math.abs(r.C - RA * r.B) > 0.02 * RA * Math.max(r.B, 0.05) || Math.abs(r.D - RB * r.B) > 0.02 * RB * Math.max(r.B, 0.05)) return `Ligne ${k + 2} : s = R × θ (θ en radians, R en mm).`;
    }
    return true;
  }

  const ROTATION = {
    id: "rotation", paillasse: 0, titre: "Enregistrer et exploiter une rotation",
    objectif: "Enregistrer le mouvement de deux points A et B d'un solide en rotation autour d'un axe fixe, puis repérer, mesurer et calculer.",
    entetes: ["t (s)", "θ (rad)", "s_A (mm)", "s_B (mm)"],
    donnees: ["OA = 60 mm ; OB = 120 mm", "θ (rad) = θ (°) × π / 180"],
    conclusion: "Un point M d'un solide en rotation autour d'un axe fixe est repéré par son abscisse angulaire θ (rad) ou par son abscisse curviligne s = R·θ. Tous les points du solide tournent du même angle : ils ont la même vitesse angulaire ω (rad/s). La vitesse d'un point est v = R·ω : elle est d'autant plus grande que le point est loin de l'axe. Ici θ(t) est une droite : la rotation est uniforme, θ = ω·t + θ₀ et s = R·ω·t + s₀.",
    conclusion_courte: "s = R·θ ; v = R·ω ; θ = ω·t + θ₀.",
    etapes: [
      { consigne: "Choisissez τ = 40 ms sur l'éclateur, appuyez sur « Enregistrer », puis lancez le solide : poussez un palet d'un geste vif autour du clou.", court: "Enregistrez la rotation.", aide_geste: "Glissez le doigt sur un palet en tournant autour du clou, puis lâchez.", verifier: enregistrement },
      { consigne: "Relevez la feuille (touchez-la). Les points A et B décrivent…", court: "Répondez dans le carnet.", question: choix(["des arcs de cercles de même centre O", "des droites parallèles", "des arcs de même rayon"], "Où est le centre des arcs ?", "Exact : O est sur l'axe de rotation.") },
      { consigne: "Entre deux étincelles, les points A et B tournent…", court: "Répondez dans le carnet.", question: choix(["du même angle", "A d'un angle plus grand que B", "B d'un angle plus grand que A"], "Les points O, Ai et Bi sont-ils alignés ?", "Exact : O, A et B restent alignés, le solide est indéformable.") },
      { consigne: "Au rapporteur (centre en O, 0 sur la direction OB0), mesurez l'abscisse angulaire θ de B0, B2… B16. Tableur : t en A, θ en radians en B (par exemple =25*PI()/180), s_A = 60 × θ en C, s_B = 120 × θ en D (lignes 2 à 10).", court: "Tableur : t, θ, s_A, s_B.", aide_geste: "Poignée jaune : tourner le rapporteur ; poignée rouge : tourner le fil jusqu'au point.", verifier: tableau },
      { consigne: "Tracez θ (colonne B) en fonction de t (colonne A).", court: "Graphique θ = f(t).", verifier: ({ courbe: c }) => (c.x === "A" && c.y === "B" && c.n >= 6) || false },
      { consigne: "θ(t) est une droite : quelle est la vitesse angulaire ω du solide (coefficient directeur) ?", court: "ω (rad/s) ?", question: { type: "nombre", unite: "rad/s", attendu: (f) => (enr(f) ? omega(enr(f)) : 0), tolerance_relative: 0.05, aide: "Modélisez par une droite : ω = Δθ / Δt.", bravo: "Exact." } },
      { consigne: "La vitesse angulaire est constante : la rotation est…", court: "Répondez dans le carnet.", question: choix(["uniforme", "accélérée", "ralentie"], "Les angles entre deux étincelles sont-ils égaux ?", "Exact : θ = ω·t + θ₀.") },
      { consigne: "À la règle, mesurez B6B10, puis calculez la vitesse de B au point B8 : v = B6B10 / (4τ).", court: "v_B (m/s) ?", question: { type: "nombre", unite: "m/s", attendu: (f) => (enr(f) ? vB8(enr(f)) : 0), tolerance_relative: 0.05, aide: "Distance en mètres, 4τ en secondes.", bravo: "Exact." } },
      { consigne: "Calculez OB × ω (en m/s).", court: "R·ω ?", question: { type: "nombre", unite: "m/s", attendu: (f) => (enr(f) ? 0.12 * omega(enr(f)) : 0), tolerance_relative: 0.05, aide: "OB = 0,12 m.", bravo: "Exact : on retrouve la vitesse mesurée, v = R·ω." } },
      { consigne: "A est deux fois plus près de l'axe que B. Sa vitesse est donc…", court: "Répondez dans le carnet.", question: choix(["deux fois plus petite", "la même", "deux fois plus grande"], "v = R·ω, et ω est le même pour A et B.", "Exact.") },
    ],
  };

  L.demarrer({ id: "b1_meca1_a2_enregistrement", titre: "Laboratoire : enregistrer une rotation", paillasses: [L.poste_rotation], missions: [ROTATION] });
})(window.Labo);
