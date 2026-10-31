/*
Rôle : simulation de l'activité 2 du chapitre « Le travail, mode de transfert d'énergie » (1re année du bac) :
       glissement sans frottement d'un mobile autoporteur (600 g) sur la table à coussin d'air inclinée (sin α = 0,050) ;
       à partir de l'enregistrement, comparer la variation d'énergie cinétique ΔEc entre M1 et Mi au travail du poids :
       théorème de l'énergie cinétique, puis généralisation (rotation). Objectif O2.
Reçoit : rien (les vérifications lisent l'enregistrement, la feuille de calcul et le graphique).
Produit : la simulation démarrée : table à coussin d'air inclinée, éclateur, règle transparente.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const V = L.VERIF_ENR, M = 0.6, G = 9.81, SIN = 0.05;
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const enr = (f) => V.dernier(f);

  function enregistrement({ faits }) {
    // Au moins 14 points, presque en ligne droite le long de la pente (mobile lâché sans élan).
    const e = enr(faits);
    if (!e) return false;
    if (e.points.length < 14) return "L'enregistrement est trop court : lâchez le mobile depuis le haut de la table, pendant l'enregistrement.";
    const xs = e.points.slice(0, 14).map((p) => p.x);
    return Math.max(...xs) - Math.min(...xs) < 6 || "Le mobile doit descendre la pente en ligne droite : posez-le en haut et lâchez-le sans le lancer.";
  }

  function tableau({ feuille, faits }) {
    // Cinq points Mi (i ≥ 2) : M1Mi (m), vi (m/s), ΔEc = ½m(vi² − v1²), W(P) = m·g·sin α·M1Mi.
    const e = enr(faits);
    if (!e) return false;
    const l = feuille.lignes(["A", "B", "C", "D"]), p = e.points, v1 = V.vitesse(p, 1, e.tau_s);
    if (l.length < 5) return false;
    for (const [k, r] of l.entries()) {
      const i = p.findIndex((q, j) => j >= 2 && j < p.length - 1 && Math.abs(V.distance(p[1], q) / 1000 - r.A) <= 0.0015);
      if (i < 0) return `Ligne ${k + 2} : M1Mi en mètres (colonne A), mesuré à la règle au millimètre près.`;
      const vi = V.vitesse(p, i, e.tau_s);
      if (Math.abs(r.B - vi) > Math.max(0.04 * vi, 0.015)) return `Ligne ${k + 2} (M${i}) : vi = M${i - 1}M${i + 1} / (2τ), en m/s.`;
      if (Math.abs(r.C - 0.5 * M * (r.B * r.B - v1 * v1)) > 0.004 + 0.04 * Math.abs(r.C)) return `Ligne ${k + 2} : ΔEc = ½ × 0,600 × (vi² − v1²).`;
      if (Math.abs(r.D - M * G * SIN * r.A) > 0.01 * Math.abs(r.D) + 0.0005) return `Ligne ${k + 2} : W(P) = m·g·sin α × M1Mi.`;
    }
    return true;
  }

  const THEOREME = {
    id: "theoreme", paillasse: 0, titre: "Théorème de l'énergie cinétique",
    objectif: "Enregistrer le glissement sans frottement d'un mobile sur une table inclinée ; comparer ΔEc entre deux positions et le travail du poids.",
    entetes: ["M1Mi (m)", "vi (m/s)", "ΔEc (J)", "W(P) (J)"],
    donnees: ["Mobile : m = 600 g ; g = 9,81 N/kg", "Table : sin α = 0,050", "vi = Mi-1Mi+1 / (2τ)"],
    conclusion: "Dans un repère galiléen, la variation de l'énergie cinétique d'un solide entre deux instants est égale à la somme des travaux des forces qui s'exercent sur lui entre ces instants : ΔEc = ΣW. Ici, la réaction de la table (perpendiculaire au déplacement, sans frottement) ne travaille pas : ΔEc = W(P) = m·g·sin α·M1Mi. Le théorème reste valable si les forces ne sont pas constantes, et en rotation autour d'un axe fixe (½·J·ω2² − ½·J·ω1² = ΣW).",
    conclusion_courte: "ΔEc = ΣW (théorème de l'énergie cinétique).",
    etapes: [
      { consigne: "Appuyez sur « Enregistrer » ; posez le mobile en haut de la table et lâchez-le sans élan : il glisse le long de la pente.", court: "Enregistrez la descente.", aide_geste: "Glissez le mobile vers le fond de la table, attendez un instant, puis lâchez.", verifier: enregistrement },
      { consigne: "Prenez la feuille. Mesurez M0M2 à la règle et calculez la vitesse v1 = M0M2 / (2τ).", court: "v1 (m/s) ?", question: { type: "nombre", unite: "m/s", attendu: (f) => V.vitesse(enr(f).points, 1, enr(f).tau_s), tolerance: 0.008, aide: "Mesurez M0M2 en mètre ; 2τ = 0,080 s.", bravo: "Exact." } },
      { consigne: "Pendant la descente, la réaction de la table, perpendiculaire au déplacement (pas de frottement), a un travail…", court: "Répondez dans le carnet.", question: choix(["nul", "moteur", "résistant"], "cos 90° = 0.", "Exact : seul le poids travaille.") },
      { consigne: "Tableur, pour cinq points Mi (par exemple i = 5, 10, 15, 20 et 25) : M1Mi (m) en A, vi en B, ΔEc = ½·m·(vi² − v1²) en C, W(P) = m·g·sin α·M1Mi en D.", court: "Tableur : M1Mi, vi, ΔEc, W(P).", aide_geste: "Faites pivoter la règle par sa poignée ronde ; zoomez pour lire au millimètre.", verifier: tableau },
      { consigne: "Tracez ΔEc (colonne C) en fonction de W(P) (colonne D).", court: "Graphique ΔEc = f(W(P)).", verifier: ({ courbe: c }) => (c.x === "D" && c.y === "C" && c.n >= 5) || false },
      { consigne: "Le graphique est une droite qui passe par l'origine, de coefficient directeur 1 environ : …", court: "Répondez dans le carnet.", question: choix(["ΔEc = W(P) : la variation d'énergie cinétique est égale au travail des forces", "ΔEc = 2·W(P)", "ΔEc ne dépend pas de W(P)"], "Comparez les colonnes C et D.", "Exact : c'est le théorème de l'énergie cinétique.") },
      { consigne: "Le théorème de l'énergie cinétique reste valable…", court: "Répondez dans le carnet.", question: choix(["même si les forces ne sont pas constantes", "seulement pour le poids", "seulement sur une table horizontale"], "Il se démontre pour des forces quelconques.", "Exact.") },
      { consigne: "Généralisation en rotation : un volant (J = 5,0×10⁻³ kg·m²) passe du repos à 20 rad/s sous l'action d'un moteur. Quel travail le couple moteur a-t-il fourni (frottements négligés) ?", court: "W (J) ?", question: { type: "nombre", unite: "J", attendu: 0.5 * 0.005 * 400, tolerance: 0.02, aide: "ΔEc = ½·J·ω² − 0 = ΣW.", bravo: "Exact : 1,0 J." } },
    ],
  };

  const paillasse = (g) => { const p = L.poste_coussin_air(g, { inclinaison_mm_s2: G * 1000 * SIN, outils: ["regle"] }); p.table.masse_kg = M; return p; };
  L.demarrer({ id: "b1_meca3_a2_theoreme", titre: "Laboratoire : théorème de l'énergie cinétique", paillasses: [paillasse], missions: [THEOREME] });
})(window.Labo);
