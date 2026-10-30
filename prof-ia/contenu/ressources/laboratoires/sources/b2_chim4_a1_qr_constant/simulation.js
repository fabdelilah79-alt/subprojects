/*
Rôle : simulation de l'activité 1 du chapitre « État d'équilibre d'un système chimique » (2e année du bac) : conductimétrie
       de solutions d'acide éthanoïque à 1,0 × 10⁻², 5,0 × 10⁻³, 2,0 × 10⁻³ et 1,0 × 10⁻³ mol/L (banc_conductimetrie.js) ;
       [H₃O⁺]éq = [CH₃CO₂⁻]éq = σ / (λ(H₃O⁺) + λ(CH₃CO₂⁻)) ; Qr,éq = [CH₃CO₂⁻]·[H₃O⁺] / [CH₃CO₂H] est le même pour tous
       les états initiaux : c'est K ; le taux d'avancement final dépend de l'état initial. Objectifs O1 à O5.
Reçoit : rien (les vérifications lisent le fait « qr_acides » et la feuille).
Produit : la simulation démarrée.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const relatif = (unite, attendu, tol, aide, bravo) => ({ type: "nombre", unite, attendu, tolerance_relative: tol, aide, bravo });
  const SOLUTIONS = [["c10", 0.01], ["c5", 0.005], ["c2", 0.002], ["c1", 0.001]], LAMBDA = 39.07;
  const M = (f) => (f.qr_acides || {}).mesures || {}, h = (s) => (s * 1e-4) / LAMBDA, qr = (s, C) => h(s) ** 2 / (C - h(s));
  const K_moyen = (f) => { const q = SOLUTIONS.filter(([id]) => M(f)[id]).map(([id, C]) => qr(M(f)[id], C)); return q.reduce((a, b) => a + b, 0) / Math.max(1, q.length); };

  function tableau({ faits, feuille }) {
    // A : C (mol/L) ; B : σ (µS/cm) mesurée ; C : [H₃O⁺]éq (mol/L) ; D : Qr,éq ; les quatre solutions.
    const v = (c, n) => feuille.valeur_sure(`${c}${n}`), vus = new Set();
    for (let n = 2; n <= 12; n++) {
      if (v("A", n) === null) continue;
      const s = SOLUTIONS.find(([, C]) => Math.abs(C - v("A", n)) < 1e-6);
      if (!s || M(faits)[s[0]] === undefined) return `Ligne ${n} : en A, la concentration (mol/L) d'une solution dont vous avez mesuré σ.`;
      if (Math.abs(v("B", n) - M(faits)[s[0]]) > 0.15) return `Ligne ${n} : en B, la conductivité mesurée (µS/cm) de cette solution.`;
      if (v("C", n) === null || Math.abs(v("C", n) - h(v("B", n))) > 0.02 * h(v("B", n))) return `Ligne ${n} : en C, [H₃O⁺] = B${n} × 10⁻⁴ / 39,1 (mol/L).`;
      const q = v("C", n) ** 2 / (v("A", n) - v("C", n));
      if (v("D", n) === null || Math.abs(v("D", n) - q) > 0.03 * q) return `Ligne ${n} : en D, Qr,éq = C${n}^2 / (A${n} − C${n}).`;
      vus.add(s[0]);
    }
    return vus.size >= 4 || false;
  }

  const QR = {
    id: "qr", paillasse: 0, titre: "Qr,éq pour différents états initiaux",
    conclusion: "Dans chaque solution, l'équilibre CH₃CO₂H + H₂O ⇌ CH₃CO₂⁻ + H₃O⁺ est atteint. La conductivité donne [H₃O⁺]éq = [CH₃CO₂⁻]éq = σ / (λ(H₃O⁺) + λ(CH₃CO₂⁻)). Le quotient de réaction à l'équilibre, Qr,éq = [CH₃CO₂⁻]éq·[H₃O⁺]éq / [CH₃CO₂H]éq ≈ 1,8 × 10⁻⁵, est le même pour les quatre concentrations initiales : c'est la constante d'équilibre K (à 25 °C). Le taux d'avancement final, lui, dépend de l'état initial : 4 % à 1,0 × 10⁻² mol/L, 12 % à 1,0 × 10⁻³ mol/L. À l'équilibre, les deux réactions inverses continuent à la même vitesse (équilibre dynamique).",
    objectif: "Mesurer σ, calculer Qr,éq et constater qu'il ne dépend pas de l'état initial.",
    entetes: ["C (mol/L)", "σ (µS/cm)", "[H₃O⁺] (mol/L)", "Qr,éq"], donnees: ["CH₃CO₂H + H₂O ⇌ CH₃CO₂⁻ + H₃O⁺", "λ(H₃O⁺) = 35,0 ; λ(CH₃CO₂⁻) = 4,1 (mS·m²/mol)", "1 µS/cm = 10⁻⁴ S/m", "[H₃O⁺] (mol/L) = σ (µS/cm) × 10⁻⁴ / 39,1"],
    conclusion_courte: "Qr,éq = K, quel que soit l'état initial ; τ en dépend.",
    etapes: [
      { consigne: "Mesurez la conductivité des quatre solutions d'acide éthanoïque.", court: "σ des quatre solutions.", aide_geste: "Bécher sur l'agitateur, agitation, sonde plongée, valeur stable ; arrêtez l'agitateur, remontez la sonde, puis déplacez le bécher doucement (il déborde s'il est secoué).", verifier: ({ faits }) => SOLUTIONS.every(([id]) => M(faits)[id] !== undefined) || false },
      { consigne: "La conductivité de la solution est σ = λ(H₃O⁺)·[H₃O⁺] + λ(CH₃CO₂⁻)·[CH₃CO₂⁻] ; on en déduit [H₃O⁺], car…", court: "Répondez dans le carnet.", question: choix(["la réaction forme autant d'ions H₃O⁺ que d'ions CH₃CO₂⁻ : [H₃O⁺] = [CH₃CO₂⁻] = σ / (λ(H₃O⁺) + λ(CH₃CO₂⁻))", "[H₃O⁺] est égale à la concentration C de l'acide", "les molécules CH₃CO₂H conduisent aussi le courant"], "Tableau d'avancement.", "Exact.") },
      { consigne: "Le quotient de réaction de CH₃CO₂H + H₂O ⇌ CH₃CO₂⁻ + H₃O⁺ s'écrit…", court: "Répondez dans le carnet.", question: choix(["Qr = [CH₃CO₂⁻]·[H₃O⁺] / [CH₃CO₂H] (l'eau, solvant, n'y figure pas)", "Qr = [CH₃CO₂H]·[H₂O] / ([CH₃CO₂⁻]·[H₃O⁺])", "Qr = [CH₃CO₂⁻] + [H₃O⁺] − [CH₃CO₂H]"], "Produits au numérateur, réactifs au dénominateur ; seules les espèces dissoutes.", "Exact.") },
      { consigne: "Tableur : C en A, σ en B, [H₃O⁺]éq en C, Qr,éq en D, pour les quatre solutions.", court: "Tableur : C, σ, [H₃O⁺], Qr,éq.", aide_geste: "En C : =B2*0,0001/39,07 ; en D : =C2^2/(A2-C2).", verifier: tableau },
      { consigne: "Valeur moyenne de Qr,éq ?", court: "Qr,éq moyen ?", question: relatif("", K_moyen, 0.08, "Moyenne de la colonne D.", "Exact : environ 1,8 × 10⁻⁵.") },
      { consigne: "D'une solution à l'autre, Qr,éq…", court: "Répondez dans le carnet.", question: choix(["reste le même : c'est la constante d'équilibre K, qui ne dépend pas de l'état initial (à température donnée)", "augmente avec la concentration de l'acide", "diminue avec la concentration de l'acide"], "Comparez les valeurs de la colonne D.", "Exact.") },
      { consigne: "Taux d'avancement final τ de la solution à 1,0 × 10⁻³ mol/L ?", court: "τ (1,0 × 10⁻³ mol/L) ?", question: relatif("", (f) => h(M(f).c1 || 49.2) / 0.001, 0.05, "τ = xf / xmax = [H₃O⁺]éq / C.", "Exact : environ 0,12.") },
      { consigne: "Quand l'acide est plus dilué, le taux d'avancement final…", court: "Répondez dans le carnet.", question: choix(["augmente : τ dépend de l'état initial, alors que K n'en dépend pas", "diminue", "ne change pas"], "Comparez τ à 1,0 × 10⁻² et à 1,0 × 10⁻³ mol/L.", "Exact.") },
      { consigne: "Quand σ ne change plus, dans la solution…", court: "Répondez dans le carnet.", question: choix(["les deux réactions inverses continuent, à la même vitesse : équilibre dynamique", "plus aucune réaction n'a lieu", "seule la réaction inverse continue"], "Pensez aux chocs efficaces dans les deux sens.", "Exact.") },
    ],
  };

  const poste = (g) => L.banc_conductimetrie(g, { fait: "qr_acides", bechers: [{ id: "c10", liquide: "eq_ethanoique", etiquette: "1,0·10⁻² M" }, { id: "c5", liquide: "eq_ethanoique_5", etiquette: "5,0·10⁻³ M" }, { id: "c2", liquide: "eq_ethanoique_2", etiquette: "2,0·10⁻³ M" }, { id: "c1", liquide: "eq_ethanoique_1", etiquette: "1,0·10⁻³ M" }] });
  L.demarrer({ id: "b2_chim4_a1_qr_constant", titre: "Laboratoire : quotient de réaction à l'équilibre", paillasses: [poste], missions: [QR] });
})(window.Labo);
