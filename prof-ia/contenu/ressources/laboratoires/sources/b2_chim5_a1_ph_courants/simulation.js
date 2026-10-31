/*
Rôle : simulation de l'activité 1 du chapitre « Transformations associées aux réactions acide-base en solution aqueuse »
       (2e année du bac) : pH de produits de la vie courante (banc_ph.js) ; [H₃O⁺] = 10⁻ᵖᴴ et [HO⁻] = Ke / [H₃O⁺] au
       tableur ; solutions acides, neutres, basiques ; produit ionique de l'eau à partir de solutions d'acide chlorhydrique
       et d'hydroxyde de sodium ; pH des milieux biologiques (document), KA et espèce prédominante. Objectifs O1 à O4.
Reçoit : rien (les vérifications lisent les faits « ph_produits », « ph_eau », « docs_bio » et la feuille).
Produit : la simulation démarrée.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const relatif = (unite, attendu, tol, aide, bravo) => ({ type: "nombre", unite, attendu, tolerance_relative: tol, aide, bravo });
  const PRODUITS = [["citron", "ph_citron", "citron"], ["vinaigre", "ph_vinaigre", "vinaigre"], ["lait", "ph_lait", "lait"], ["bicarbonate", "ph_bicarbonate", "bicarbonate"], ["javel", "ph_javel", "Javel diluée"]];
  const MP = (f) => (f.ph_produits || {}).mesures || {}, ME = (f) => (f.ph_eau || {}).mesures || {};

  function tableau({ faits, feuille }) {
    // A : pH lu d'un produit ; B : [H₃O⁺] = 10^(−A) ; C : [HO⁻] = 10⁻¹⁴ / B ; les cinq produits.
    const v = (c, n) => feuille.valeur_sure(`${c}${n}`), lus = Object.values(MP(faits)), vus = new Set();
    for (let n = 2; n <= 12; n++) {
      if (v("A", n) === null) continue;
      const k = lus.findIndex((p) => Math.abs(p - v("A", n)) < 0.025);
      if (k < 0) return `Ligne ${n} : en A, le pH lu pour l'un des produits.`;
      const h = 10 ** -v("A", n);
      if (v("B", n) === null || Math.abs(v("B", n) - h) > 0.02 * h) return `Ligne ${n} : en B, [H₃O⁺] = 10^(−A${n}) (mol/L).`;
      if (v("C", n) === null || Math.abs(v("C", n) - 1e-14 / h) > 0.02 * (1e-14 / h)) return `Ligne ${n} : en C, [HO⁻] = 10^(−14) / B${n} (mol/L).`;
      vus.add(k);
    }
    return vus.size >= 5 || false;
  }

  const PRODUITS_COURANTS = {
    id: "produits", paillasse: 0, titre: "pH de produits de la vie courante",
    conclusion: "À 25 °C, une solution est acide si pH < 7 ([H₃O⁺] > [HO⁻]), neutre si pH = 7, basique si pH > 7. Jus de citron (2,3), vinaigre (2,9) et lait (6,6) sont acides ; la solution de bicarbonate de sodium (8,3) et l'eau de Javel diluée (11,5) sont basiques. Dans toute solution aqueuse, [H₃O⁺]·[HO⁻] = Ke = 1,0 × 10⁻¹⁴ : connaître le pH, c'est connaître [H₃O⁺] et [HO⁻].",
    objectif: "Mesurer le pH de produits courants ; calculer [H₃O⁺] et [HO⁻].",
    entetes: ["pH", "[H₃O⁺] (mol/L)", "[HO⁻] (mol/L)"], donnees: ["pH = −log[H₃O⁺]", "Ke = [H₃O⁺]·[HO⁻] = 1,0 × 10⁻¹⁴ à 25 °C", "pH-mètre étalonné"],
    conclusion_courte: "pH < 7 acide ; pH > 7 basique (25 °C).",
    etapes: [
      { consigne: "Mesurez le pH des cinq produits.", court: "pH des cinq produits.", aide_geste: "Bécher sur l'agitateur, agitation, électrode plongée, valeur stable ; arrêtez l'agitateur, remontez l'électrode, puis déplacez le bécher doucement.", verifier: ({ faits }) => PRODUITS.every(([id]) => MP(faits)[id] !== undefined) || false },
      { consigne: "Tableur : pH en A, [H₃O⁺] en B, [HO⁻] en C, pour les cinq produits.", court: "Tableur : pH, [H₃O⁺], [HO⁻].", aide_geste: "En B : =10^(-A2) ; en C : =10^(-14)/B2.", verifier: tableau },
      { consigne: "À 25 °C, les produits basiques sont…", court: "Répondez dans le carnet.", question: choix(["la solution de bicarbonate de sodium et l'eau de Javel diluée : pH > 7, [HO⁻] > [H₃O⁺]", "le jus de citron et le vinaigre", "le lait seulement"], "Comparez le pH à 7.", "Exact.") },
      { consigne: "[HO⁻] dans le jus de citron (mol/L) ?", court: "[HO⁻] (citron) ?", question: relatif("mol/L", (f) => 1e-14 / 10 ** -(MP(f).citron || 2.3), 0.05, "[HO⁻] = Ke / [H₃O⁺].", "Exact : il y a des ions HO⁻ même dans une solution acide.") },
    ],
  };

  const EAU = {
    id: "eau", paillasse: 1, titre: "Produit ionique de l'eau, milieux biologiques",
    conclusion: "Dans l'hydroxyde de sodium à 1,0 × 10⁻³ mol/L, [HO⁻] = 1,0 × 10⁻³ mol/L et pH = 11,0 : [H₃O⁺]·[HO⁻] = 1,0 × 10⁻¹⁴ ; on retrouve la même valeur avec les autres solutions : c'est le produit ionique de l'eau Ke (pKe = 14 à 25 °C), constante de l'autoprotolyse 2 H₂O ⇌ H₃O⁺ + HO⁻. Le sang (pH 7,4) est légèrement basique ; pour le couple CO₂,H₂O / HCO₃⁻ (pKA = 6,4), pH > pKA : l'ion HCO₃⁻ prédomine ([HCO₃⁻] / [CO₂,H₂O] = 10^(pH − pKA) = 10).",
    objectif: "Retrouver Ke ; lire le pH des milieux biologiques ; espèce prédominante.",
    entetes: [], donnees: ["HCl 1,0 × 10⁻² mol/L ; NaOH 1,0 × 10⁻² et 1,0 × 10⁻³ mol/L", "Dans NaOH à C : [HO⁻] = C", "pH = pKA + log([base] / [acide])"],
    conclusion_courte: "Ke = 10⁻¹⁴ ; pH > pKA : la base prédomine.",
    etapes: [
      { consigne: "Mesurez le pH des trois solutions.", court: "pH des trois solutions.", verifier: ({ faits }) => ["hcl", "soude2", "soude3"].every((k) => ME(faits)[k] !== undefined) || false },
      { consigne: "Pour l'hydroxyde de sodium à 1,0 × 10⁻³ mol/L, calculez [H₃O⁺]·[HO⁻].", court: "[H₃O⁺]·[HO⁻] ?", question: relatif("", (f) => 10 ** -(ME(f).soude3 || 11) * 1e-3, 0.1, "[H₃O⁺] = 10^(−pH) ; [HO⁻] = 1,0 × 10⁻³ mol/L.", "Exact : 1,0 × 10⁻¹⁴.") },
      { consigne: "Le produit [H₃O⁺]·[HO⁻]…", court: "Répondez dans le carnet.", question: choix(["est le même dans toutes les solutions aqueuses à 25 °C : c'est Ke = 1,0 × 10⁻¹⁴, constante de 2 H₂O ⇌ H₃O⁺ + HO⁻", "dépend de la concentration de la soude", "vaut 14"], "Faites le calcul avec les trois solutions.", "Exact.") },
      { consigne: "Lisez le document « Le pH dans le corps humain ». Le sang est…", court: "Lisez le document ; répondez.", aide_geste: "Touchez le document pour l'ouvrir.", question: choix(["légèrement basique (pH 7,35 à 7,45)", "acide", "neutre"], "Comparez à 7.", "Exact.") },
      { consigne: "La constante d'acidité du couple CO₂,H₂O / HCO₃⁻ s'écrit…", court: "Répondez dans le carnet.", question: choix(["KA = [HCO₃⁻]·[H₃O⁺] / [CO₂,H₂O]", "KA = [CO₂,H₂O] / ([HCO₃⁻]·[H₃O⁺])", "KA = [HCO₃⁻] + [H₃O⁺]"], "KA est Qr,éq de la réaction de l'acide avec l'eau.", "Exact.") },
      { consigne: "Dans le sang (pH = 7,4 ; pKA = 6,4), l'espèce qui prédomine est…", court: "Répondez dans le carnet.", question: choix(["HCO₃⁻ : pH > pKA, et [HCO₃⁻] / [CO₂,H₂O] = 10", "CO₂,H₂O", "aucune : elles sont en même quantité"], "pH = pKA + log([HCO₃⁻] / [CO₂,H₂O]).", "Exact.") },
    ],
  };

  const produits = (g) => L.banc_ph(g, { fait: "ph_produits", bechers: PRODUITS.map(([id, liquide, etiquette]) => ({ id, liquide, etiquette })) });
  L.demarrer({ id: "b2_chim5_a1_ph_courants", titre: "Laboratoire : pH de produits courants et Ke", paillasses: [produits, L.paillasse_eau_corps], missions: [PRODUITS_COURANTS, EAU] });
})(window.Labo);
