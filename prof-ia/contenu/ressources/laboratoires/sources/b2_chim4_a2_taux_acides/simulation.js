/*
Rôle : simulation de l'activité 2 du chapitre « État d'équilibre d'un système chimique » (2e année du bac) : taux d'avancement
       final de quatre acides carboxyliques de même concentration (1,0 × 10⁻² mol/L : méthanoïque, benzoïque, éthanoïque,
       propanoïque), mesurés par conductimétrie (banc_conductimetrie.js) ; τ dépend de la constante d'équilibre K de la
       réaction de l'acide avec l'eau ; K de l'acide éthanoïque retrouvé à partir de τ. Objectifs O1, O3, O5.
Reçoit : rien (les vérifications lisent le fait « taux_acides » et la feuille).
Produit : la simulation démarrée.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const ACIDES = [["methanoique", "eq_methanoique", "HCOOH", 5.46], ["benzoique", "eq_benzoique", "C₆H₅COOH", 3.23], ["ethanoique", "eq_ethanoique", "CH₃COOH", 4.09], ["propanoique", "eq_propanoique", "C₂H₅COOH", 3.58]];
  const M = (f) => (f.taux_acides || {}).mesures || {}, h = (s, l) => (s * 1e-4) / (34.98 + l);

  function tableau({ faits, feuille }) {
    // A : λ(A⁻) ; B : σ (µS/cm) de cet acide ; C : [H₃O⁺]éq ; D : τ = C / 0,010 ; les quatre acides.
    const v = (c, n) => feuille.valeur_sure(`${c}${n}`), vus = new Set();
    for (let n = 2; n <= 12; n++) {
      if (v("A", n) === null) continue;
      const a = ACIDES.find(([, , , l]) => Math.abs(l - v("A", n)) < 0.02);
      if (!a || M(faits)[a[0]] === undefined) return `Ligne ${n} : en A, λ de l'ion carboxylate d'un acide dont vous avez mesuré σ (données).`;
      if (Math.abs(v("B", n) - M(faits)[a[0]]) > 0.15) return `Ligne ${n} : en B, la conductivité mesurée (µS/cm) de l'acide ${a[2]}.`;
      const x = h(v("B", n), v("A", n));
      if (v("C", n) === null || Math.abs(v("C", n) - x) > 0.02 * x) return `Ligne ${n} : en C, [H₃O⁺] = B${n} × 10⁻⁴ / (35,0 + A${n}) (mol/L).`;
      if (v("D", n) === null || Math.abs(v("D", n) - x / 0.01) > 0.02 * (x / 0.01)) return `Ligne ${n} : en D, τ = C${n} / 0,010.`;
      vus.add(a[0]);
    }
    return vus.size >= 4 || false;
  }

  const TAUX = {
    id: "taux", paillasse: 0, titre: "Taux d'avancement final et constante d'équilibre",
    conclusion: "À la même concentration (1,0 × 10⁻² mol/L), les quatre acides ne réagissent pas autant avec l'eau : τ ≈ 0,12 (méthanoïque), 0,08 (benzoïque), 0,04 (éthanoïque), 0,04 (propanoïque). Le classement est celui des constantes d'équilibre K : plus K est grande, plus le taux d'avancement final est grand. Le taux d'avancement final dépend donc de K (et de l'état initial) ; à partir de τ, on retrouve K = C·τ² / (1 − τ).",
    objectif: "Comparer le taux d'avancement final de quatre acides de même concentration.",
    entetes: ["λ(A⁻)", "σ (µS/cm)", "[H₃O⁺] (mol/L)", "τ"], donnees: ["C = 1,0 × 10⁻² mol/L pour chaque acide ; λ(H₃O⁺) = 35,0 mS·m²/mol", "λ(A⁻) (mS·m²/mol) : HCOO⁻ 5,46 ; C₆H₅COO⁻ 3,23 ; CH₃COO⁻ 4,09 ; C₂H₅COO⁻ 3,58", "K : HCOOH 1,8 × 10⁻⁴ ; C₆H₅COOH 6,3 × 10⁻⁵ ; CH₃COOH 1,7 × 10⁻⁵ ; C₂H₅COOH 1,3 × 10⁻⁵"],
    conclusion_courte: "Même C : plus K est grande, plus τ est grand.",
    etapes: [
      { consigne: "Mesurez la conductivité des quatre solutions d'acides.", court: "σ des quatre acides.", aide_geste: "Arrêtez l'agitateur et remontez la sonde avant d'enlever un bécher ; déplacez-le doucement (il déborde s'il est secoué).", verifier: ({ faits }) => ACIDES.every(([id]) => M(faits)[id] !== undefined) || false },
      { consigne: "Tableur : λ(A⁻) en A, σ en B, [H₃O⁺]éq en C, τ en D, pour les quatre acides.", court: "Tableur : λ, σ, [H₃O⁺], τ.", aide_geste: "En C : =B2*0,0001/(35+A2) ; en D : =C2/0,010.", verifier: tableau },
      { consigne: "Classez les acides selon leur taux d'avancement final.", court: "Répondez dans le carnet.", question: choix(["τ(HCOOH) > τ(C₆H₅COOH) > τ(CH₃COOH) > τ(C₂H₅COOH)", "τ(CH₃COOH) > τ(HCOOH) > τ(C₂H₅COOH) > τ(C₆H₅COOH)", "les quatre taux sont égaux"], "Colonne D.", "Exact.") },
      { consigne: "Comparez avec les constantes d'équilibre K (données) : à la même concentration…", court: "Répondez dans le carnet.", question: choix(["plus K est grande, plus τ est grand : τ dépend de K", "τ ne dépend pas de K", "plus K est grande, plus τ est petit"], "Rangez aussi les valeurs de K.", "Exact.") },
      { consigne: "À partir de τ, valeur de K pour l'acide éthanoïque : K = C·τ² / (1 − τ) ?", court: "K (CH₃COOH) ?", question: { type: "nombre", unite: "", attendu: (f) => { const t = h(M(f).ethanoique || 160.5, 4.09) / 0.01; return (0.01 * t * t) / (1 - t); }, tolerance_relative: 0.08, aide: "Utilisez votre valeur de τ (colonne D).", bravo: "Exact : environ 1,8 × 10⁻⁵." } },
    ],
  };

  const poste = (g) => L.banc_conductimetrie(g, { fait: "taux_acides", bechers: ACIDES.map(([id, liquide, etiquette]) => ({ id, liquide, etiquette })) });
  L.demarrer({ id: "b2_chim4_a2_taux_acides", titre: "Laboratoire : taux d'avancement final de quatre acides", paillasses: [poste], missions: [TAUX] });
})(window.Labo);
