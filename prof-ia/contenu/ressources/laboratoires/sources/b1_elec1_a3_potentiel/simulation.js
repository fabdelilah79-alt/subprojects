/*
Rôle : simulation de l'activité 3 du chapitre « Énergie potentielle électrostatique » (1re année du bac, SM) : cuve
       rhéographique entre deux plaques parallèles : potentiel V(x), champ uniforme E = U/d, équipotentielles ; travail de
       la force électrostatique W = q·(VA − VB), énergie potentielle électrostatique Epe = q·V + C, conservation de
       l'énergie totale. Objectifs O3 et O4.
Reçoit : rien (les vérifications lisent le fait « cuve », la feuille de calcul et le graphique).
Produit : la simulation démarrée : cuve rhéographique.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const rel = (f) => (f.cuve || {}).releves || [], Q = 2e-9;
  const pres = (f, x, y, t = 0.15) => rel(f).filter((r) => Math.abs(r.x - x) <= t && Math.abs(r.y - y) <= t).slice(-1)[0];
  const VA = (f) => (pres(f, 13, 3, 0.25) || { V: 0 }).V, VB = (f) => (pres(f, 7, 11, 0.25) || { V: 0 }).V;

  function tableau({ faits, feuille }) {
    // Cinq points de la ligne y = 7 cm : x (m), V (V).
    const l = feuille.lignes(["A", "B"]);
    if (l.length < 5) return false;
    for (const [k, r] of l.entries()) if (!rel(faits).some((m) => Math.abs(m.y - 7) <= 0.2 && Math.abs(m.x / 100 - r.A) <= 0.002 && Math.abs(m.V - r.B) <= 0.05)) return `Ligne ${k + 2} : x en mètres (colonne A) et V lue au voltmètre (colonne B) pour un de vos points de la ligne y = 7 cm.`;
    return new Set(l.map((r) => Math.round(r.A * 100))).size >= 5 || "Cinq abscisses différentes.";
  }

  const POTENTIEL = {
    id: "potentiel", paillasse: 0, titre: "Potentiel et champ uniforme",
    objectif: "Mesurer le potentiel en différents points entre deux plaques parallèles ; en déduire le champ et les équipotentielles.",
    entetes: ["x (m)", "V (V)"],
    donnees: ["Plaques à x = 5 cm (0 V) et x = 15 cm (12,0 V)", "d = 10 cm ; U = 12,0 V", "Quadrillage : 1 cm"],
    conclusion: "Entre deux plaques parallèles soumises à la tension U, le potentiel varie régulièrement de la plaque − à la plaque + : le champ électrostatique est uniforme, perpendiculaire aux plaques, orienté vers les potentiels décroissants, de valeur E = U/d (en V/m, comme en N/C). Les équipotentielles sont des plans parallèles aux plaques, perpendiculaires aux lignes de champ.",
    conclusion_courte: "Champ uniforme : E = U/d ; équipotentielles parallèles aux plaques.",
    etapes: [
      { consigne: "Placez la pointe de touche sur la ligne y = 7 cm, aux abscisses x = 6, 8, 10, 12 et 14 cm, et lisez le potentiel V à chaque fois.", court: "Cinq points sur y = 7 cm.", aide_geste: "Glissez la pointe dans l'eau ; zoomez pour la placer au millimètre.", verifier: ({ faits }) => [6, 8, 10, 12, 14].every((x) => !!pres(faits, x, 7)) },
      { consigne: "Tableur : x (m) en A, V (V) en B, pour vos cinq points.", court: "Tableur : x, V.", verifier: tableau },
      { consigne: "Tracez V (colonne B) en fonction de x (colonne A).", court: "Graphique V = f(x).", verifier: ({ courbe: c }) => (c.x === "A" && c.y === "B" && c.n >= 5) || false },
      { consigne: "Le graphique est une droite. Son coefficient directeur est la valeur du champ E. Combien vaut-il ?", court: "E (V/m) ?", question: { type: "nombre", unite: "V/m", attendu: 120, tolerance: 4, aide: "E = ΔV / Δx, Δx en mètres.", bravo: "Exact : 120 V/m." } },
      { consigne: "Comparez avec U/d (U = 12,0 V, d = 0,10 m). Entre les plaques, le champ…", court: "Répondez dans le carnet.", question: choix(["est uniforme et vaut E = U/d", "est nul", "est plus fort près de la plaque +"], "La pente est la même partout.", "Exact.") },
      { consigne: "Trouvez trois points où le voltmètre indique 6,00 V, à des hauteurs y bien différentes.", court: "Trois points à 6,00 V.", verifier: ({ faits }) => { const s = rel(faits).filter((r) => Math.abs(r.V - 6) < 0.08).map((r) => r.y); return s.length >= 3 && Math.max(...s) - Math.min(...s) >= 6; } },
      { consigne: "Ces points de même potentiel (une équipotentielle) forment…", court: "Répondez dans le carnet.", question: choix(["une droite parallèle aux plaques, perpendiculaire aux lignes de champ", "un cercle autour d'une plaque", "une droite perpendiculaire aux plaques"], "Ils ont tous la même abscisse x.", "Exact.") },
      { consigne: "Le champ électrostatique est orienté…", court: "Répondez dans le carnet.", question: choix(["vers les potentiels décroissants : de la plaque à 12 V vers la plaque à 0 V", "vers les potentiels croissants", "parallèlement aux plaques"], "E = −dV/dx.", "Exact.") },
    ],
  };

  const TRAVAIL = {
    id: "travail", paillasse: 0, titre: "Travail et énergie potentielle électrostatique",
    objectif: "Calculer le travail de la force électrostatique entre deux points à partir de leurs potentiels ; relier ce travail à l'énergie potentielle.",
    entetes: [],
    donnees: ["q = 2,0 nC = 2,0×10⁻⁹ C", "e = 1,60×10⁻¹⁹ C", "Référence des potentiels : plaque à 0 V"],
    conclusion: "Le travail de la force électrostatique F = q·E qui s'exerce sur une charge q allant de A à B ne dépend pas du chemin suivi : W(A→B) = q·(VA − VB). L'énergie potentielle électrostatique de la charge est Epe = q·V + C (la constante dépend du choix de l'origine des potentiels) : W(A→B) = −ΔEpe. Si seule la force électrostatique travaille, l'énergie totale Ec + Epe se conserve : une charge accélérée gagne en énergie cinétique ce qu'elle perd en énergie potentielle.",
    conclusion_courte: "W = q·(VA − VB) ; Epe = q·V + C ; Ec + Epe = constante.",
    etapes: [
      { consigne: "Mesurez le potentiel au point A (x = 13 cm, y = 3 cm), puis au point B (x = 7 cm, y = 11 cm).", court: "Potentiels en A et en B.", verifier: ({ faits }) => !!(pres(faits, 13, 3, 0.25) && pres(faits, 7, 11, 0.25)) },
      { consigne: "Une petite charge q = 2,0 nC va de A à B. Quel est le travail de la force électrostatique ?", court: "W(A→B) (J) ?", question: { type: "nombre", unite: "J", attendu: (f) => Q * (VA(f) - VB(f)), tolerance_relative: 0.03, aide: "W = q·(VA − VB).", bravo: "Exact : environ 1,4×10⁻⁸ J." } },
      { consigne: "Si la charge va de A à B par un autre chemin, le travail de la force électrostatique…", court: "Répondez dans le carnet.", question: choix(["est le même : il ne dépend que des potentiels de A et de B", "dépend de la longueur du chemin", "est nul"], "Comme le travail du poids, il ne dépend pas du chemin.", "Exact.") },
      { consigne: "Avec la référence Epe = 0 sur la plaque à 0 V, quelle est l'énergie potentielle électrostatique de la charge en A ?", court: "Epe(A) (J) ?", question: { type: "nombre", unite: "J", attendu: (f) => Q * VA(f), tolerance_relative: 0.03, aide: "Epe = q·V.", bravo: "Exact." } },
      { consigne: "Le travail W(A→B) est égal à…", court: "Répondez dans le carnet.", question: choix(["Epe(A) − Epe(B) = −ΔEpe", "Epe(B) − Epe(A)", "Epe(A) + Epe(B)"], "W = q·VA − q·VB.", "Exact.") },
      { consigne: "Un électron (q = −e) part sans vitesse de la plaque à 0 V et arrive sur la plaque à 12,0 V (seule la force électrostatique travaille). Quelle est son énergie cinétique à l'arrivée ?", court: "Ec (J) ?", question: { type: "nombre", unite: "J", attendu: 1.6e-19 * 12, tolerance_relative: 0.02, aide: "Conservation de Ec + Epe : Ec = (−e)·(0 − 12,0).", bravo: "Exact : 1,92×10⁻¹⁸ J." } },
      { consigne: "Pendant ce trajet, l'énergie totale Ec + Epe de l'électron…", court: "Répondez dans le carnet.", question: choix(["se conserve : l'énergie potentielle perdue devient énergie cinétique", "augmente", "diminue"], "Seule la force électrostatique travaille.", "Exact.") },
    ],
  };

  L.demarrer({ id: "b1_elec1_a3_potentiel", titre: "Laboratoire : potentiel électrostatique", paillasses: [L.poste_cuve], missions: [POTENTIEL, TRAVAIL] });
})(window.Labo);
