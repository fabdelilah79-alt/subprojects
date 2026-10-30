/*
Rôle : simulation de l'activité du chapitre « Transformations chimiques qui se produisent dans les deux sens » (2e année
       du bac) : pH-mètre étalonné avec deux tampons ; pH de trois acides à 1,0 × 10⁻² mol/L ; [H₃O⁺]f = 10⁻ᵖᴴ, xf < xmax,
       taux d'avancement final τ = xf / xmax, comparaison des acides ; ajouts d'acide éthanoïque pur et d'éthanoate de sodium
       à une solution d'acide éthanoïque : la réaction avance dans un sens ou dans l'autre (⇌) ; couples acide/base.
       Objectifs O1, O2, O3, O4.
Reçoit : rien (les vérifications lisent les faits « ph_acides », « deux_sens » et la feuille).
Produit : la simulation démarrée.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const relatif = (unite, attendu, tol, aide, bravo) => ({ type: "nombre", unite, attendu, tolerance_relative: tol, aide, bravo });
  const PA = (f) => f.ph_acides || {}, M = (f) => PA(f).mesures || {}, DS = (f) => (f.deux_sens || {}).mesures || {};
  const mesure = (id, nom) => ({ faits }) => (M(faits)[id] !== undefined) || `Posez le bécher ${nom} sur l'agitateur, mettez-le en marche, plongez l'électrode et attendez que l'affichage soit stable.`;

  function tableau({ faits, feuille }) {
    // A : pH lu ; B : [H₃O⁺] = 10^(−A) ; C : τ = B / 0,010 ; une ligne par acide (trois).
    const v = (c, n) => feuille.valeur_sure(`${c}${n}`), lus = ["hcl", "methanoique", "ethanoique"].map((k) => M(faits)[k]).filter((x) => x !== undefined), vus = new Set();
    for (let n = 2; n <= 12; n++) {
      if (v("A", n) === null) continue;
      const k = lus.findIndex((p) => Math.abs(p - v("A", n)) < 0.025);
      if (k < 0) return `Ligne ${n} : en A, le pH lu pour l'un des trois acides.`;
      const h = 10 ** -v("A", n);
      if (v("B", n) === null || Math.abs(v("B", n) - h) > 0.02 * h) return `Ligne ${n} : en B, [H₃O⁺] = 10^(−A${n}) (mol/L).`;
      if (v("C", n) === null || Math.abs(v("C", n) - h / 0.01) > 0.02 * (h / 0.01)) return `Ligne ${n} : en C, τ = B${n} / 0,010.`;
      vus.add(k);
    }
    return vus.size >= 3 || false;
  }

  const TAUX = {
    id: "taux", paillasse: 0, titre: "pH et taux d'avancement final",
    conclusion: "Pour l'acide éthanoïque à C = 1,0 × 10⁻² mol/L, pH = 3,39 : [H₃O⁺]f = 10⁻ᵖᴴ = 4,1 × 10⁻⁴ mol/L, bien plus petit que C. L'avancement final xf = [H₃O⁺]f·V est plus petit que xmax = C·V : la transformation n'est pas totale ; τ = xf / xmax ≈ 4 %. Pour l'acide méthanoïque, τ ≈ 13 % ; pour l'acide chlorhydrique, τ = 1 (transformation totale). À même concentration, le taux d'avancement final permet de comparer les acides.",
    objectif: "Mesurer un pH, calculer xf et τ, comparer trois acides.",
    entetes: ["pH", "[H₃O⁺] (mol/L)", "τ"], donnees: ["Trois acides à C = 1,0 × 10⁻² mol/L ; V = 40,0 mL", "pH = −log[H₃O⁺] ; [H₃O⁺] = 10^(−pH)", "τ = xf / xmax"],
    conclusion_courte: "xf < xmax : τ < 1 ; τ compare les acides.",
    etapes: [
      { consigne: "Étalonnez le pH-mètre : électrode dans le tampon pH 7, touche « CAL 7 » ; puis dans le tampon pH 4, touche « CAL 4 ».", court: "Étalonnage (pH 7, puis pH 4).", aide_geste: "Posez le bécher de tampon sur l'agitateur, faites glisser l'électrode vers le bas, attendez, puis touchez la touche.", verifier: ({ faits }) => (PA(faits).cal7 && PA(faits).cal4) || false },
      { consigne: "Mesurez le pH de la solution d'acide éthanoïque.", court: "pH de CH₃COOH.", aide_geste: "Bécher sur l'agitateur, agitation, électrode plongée ; arrêtez l'agitateur et remontez l'électrode avant d'enlever le bécher.", verifier: mesure("ethanoique", "d'acide éthanoïque") },
      { consigne: "Concentration finale [H₃O⁺]f (mol/L) ?", court: "[H₃O⁺]f (mol/L) ?", question: relatif("mol/L", (f) => 10 ** -(M(f).ethanoique || 3.39), 0.05, "[H₃O⁺]f = 10^(−pH).", "Exact.") },
      { consigne: "Avancement final xf (mmol) dans V = 40,0 mL ?", court: "xf (mmol) ?", question: relatif("mmol", (f) => 40 * 10 ** -(M(f).ethanoique || 3.39), 0.05, "Une mole de H₃O⁺ par mole d'avancement : xf = [H₃O⁺]f·V.", "Exact.") },
      { consigne: "Avec xmax = C·V = 0,40 mmol, on conclut que…", court: "Répondez dans le carnet.", question: choix(["xf < xmax : la transformation n'est pas totale ; l'acide éthanoïque ne réagit pas entièrement avec l'eau", "xf = xmax : la transformation est totale", "l'acide est le réactif en excès"], "Comparez xf et xmax.", "Exact.") },
      { consigne: "Mesurez le pH de l'acide chlorhydrique et de l'acide méthanoïque.", court: "pH de HCl et de HCOOH.", verifier: ({ faits }) => (M(faits).hcl !== undefined && M(faits).methanoique !== undefined) || false },
      { consigne: "Tableur : pour les trois acides, pH en A, [H₃O⁺] = 10^(−pH) en B, τ en C.", court: "Tableur : pH, [H₃O⁺], τ.", aide_geste: "En B : =10^(-A2) ; en C : =B2/0,010.", verifier: tableau },
      { consigne: "À la même concentration, ces acides…", court: "Répondez dans le carnet.", question: choix(["ne réagissent pas autant avec l'eau : τ(HCl) = 1 > τ(HCOOH) > τ(CH₃COOH)", "réagissent tous de la même façon", "ont tous un pH de 2"], "Comparez les valeurs de τ.", "Exact.") },
    ],
  };

  const SENS = {
    id: "sens", paillasse: 1, titre: "Une réaction dans les deux sens",
    conclusion: "Une goutte d'acide éthanoïque pur fait baisser le pH : [H₃O⁺] augmente, la réaction CH₃CO₂H + H₂O → CH₃CO₂⁻ + H₃O⁺ avance dans le sens direct. Une pointe d'éthanoate de sodium fait monter le pH : des ions H₃O⁺ disparaissent, la réaction CH₃CO₂⁻ + H₃O⁺ → CH₃CO₂H + H₂O a lieu, c'est le sens inverse. La transformation est modélisée par deux réactions inverses simultanées : CH₃CO₂H + H₂O ⇌ CH₃CO₂⁻ + H₃O⁺ ; couples CH₃CO₂H / CH₃CO₂⁻ et H₃O⁺ / H₂O.",
    objectif: "Montrer, par des ajouts, que la réaction peut avoir lieu dans les deux sens.",
    entetes: [], donnees: ["Bécher : 50,0 mL d'acide éthanoïque à 1,0 × 10⁻² mol/L", "Acide éthanoïque pur : 17,4 mol/L", "Éthanoate de sodium : CH₃CO₂⁻ + Na⁺"],
    conclusion_courte: "CH₃CO₂H + H₂O ⇌ CH₃CO₂⁻ + H₃O⁺.",
    etapes: [
      { consigne: "Mettez l'agitateur en marche, plongez l'électrode et lisez le pH de la solution.", court: "pH de départ.", verifier: ({ faits }) => (DS(faits).initial !== undefined) || false },
      { consigne: "Ajoutez deux gouttes d'acide éthanoïque pur et lisez le pH quand il est stable.", court: "Acide pur ; pH ?", aide_geste: "Prenez la pipette du flacon, tenez-la au-dessus du bécher et appuyez sur la poire.", verifier: ({ faits }) => { const d = DS(faits).acide; return (d !== undefined && d < 3.3) || false; } },
      { consigne: "Le pH diminue, car…", court: "Répondez dans le carnet.", question: choix(["[H₃O⁺] augmente : la réaction CH₃CO₂H + H₂O → CH₃CO₂⁻ + H₃O⁺ avance dans le sens direct", "l'acide pur dilue la solution", "des ions H₃O⁺ sont consommés"], "pH = −log[H₃O⁺].", "Exact.") },
      { consigne: "Touchez « Bécher neuf », puis versez une pointe de spatule d'éthanoate de sodium ; lisez le pH.", court: "Bécher neuf ; éthanoate ; pH ?", aide_geste: "Sortez la spatule du pot et lâchez-la au-dessus du bécher.", verifier: ({ faits }) => { const d = DS(faits).base; return (d !== undefined && d > 4) || false; } },
      { consigne: "Le pH augmente, car…", court: "Répondez dans le carnet.", question: choix(["des ions H₃O⁺ sont consommés : CH₃CO₂⁻ + H₃O⁺ → CH₃CO₂H + H₂O, c'est la réaction dans le sens inverse", "l'éthanoate de sodium est un acide", "la transformation devient totale"], "Les ions éthanoate captent des protons.", "Exact.") },
      { consigne: "On écrit donc l'équation de la réaction…", court: "Répondez dans le carnet.", question: choix(["CH₃CO₂H + H₂O ⇌ CH₃CO₂⁻ + H₃O⁺ : deux réactions inverses ont lieu en même temps", "CH₃CO₂H + H₂O → CH₃CO₂⁻ + H₃O⁺ seulement", "CH₃CO₂⁻ + H₃O⁺ → CH₃CO₂H + H₂O seulement"], "Les deux ajouts font avancer la réaction dans les deux sens.", "Exact.") },
      { consigne: "Les deux couples acide/base mis en jeu sont…", court: "Répondez dans le carnet.", question: choix(["CH₃CO₂H / CH₃CO₂⁻ et H₃O⁺ / H₂O", "CH₃CO₂H / H₂O et H₃O⁺ / CH₃CO₂⁻", "CH₃CO₂⁻ / CH₃CO₂H et H₂O / H₃O⁺"], "Un acide de Brønsted cède un proton ; on écrit acide / base.", "Exact.") },
    ],
  };

  L.demarrer({ id: "b2_chim3_a1_ph_deux_sens", titre: "Laboratoire : le pH et les deux sens d'une réaction", paillasses: [L.poste_acides, L.poste_deux_sens], missions: [TAUX, SENS] });
})(window.Labo);
