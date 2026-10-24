/*
Rôle : simulation de l'activité 2 du chapitre « Énergie potentielle électrostatique » (1re année du bac, SM) : loi de
       Coulomb (balance de Coulomb : F en fonction de d et des charges), champ électrostatique et lignes de champ (semoule
       dans l'huile de ricin : deux pointes, deux plaques parallèles), E = F/q, champ uniforme. Objectifs O1 et O2.
Reçoit : rien (les vérifications lisent les faits « coulomb » et « champ », la feuille de calcul et le graphique).
Produit : la simulation démarrée : balance de Coulomb ; cuve d'huile et de semoule.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const Q0 = 5.56, G = 9.81, co = (f) => f.coulomb || { releves: [] }, ch = (f) => f.champ || { vu: {} };
  const pleins = (f) => (co(f).releves || []).filter((r) => r.qA === Q0 && r.qB === Q0);

  function tableau({ faits, feuille }) {
    // Cinq distances, sphères chargées par la sonde : d, F = Δm·g, 1/d², F·d².
    const l = feuille.lignes(["A", "B", "C", "D"]);
    if (l.length < 5) return false;
    for (const [k, r] of l.entries()) {
      const m = pleins(faits).find((x) => Math.abs(x.d / 100 - r.A) < 1e-4);
      if (!m) return `Ligne ${k + 2} : d en mètres (colonne A), une distance où vous avez lu Δm, sphères A et B chargées par la sonde.`;
      if (Math.abs(r.B - m.dm * 1e-6 * G) > 0.02 * r.B + 2e-7) return `Ligne ${k + 2} : F = Δm × g, avec Δm en kg (1 mg = 10⁻⁶ kg).`;
      if (Math.abs(r.C - 1 / (r.A * r.A)) > 0.01 * r.C) return `Ligne ${k + 2} : 1/d², par exemple =1/A${k + 2}^2.`;
      if (Math.abs(r.D - r.B * r.A * r.A) > 0.02 * r.D) return `Ligne ${k + 2} : F × d².`;
    }
    return new Set(l.map((r) => r.A)).size >= 5 || "Cinq distances différentes.";
  }

  const COULOMB = {
    id: "coulomb", paillasse: 0, titre: "La loi de Coulomb",
    objectif: "Mesurer la force entre deux sphères chargées en fonction de leur distance, puis de leurs charges.",
    entetes: ["d (m)", "F (N)", "1/d² (m⁻²)", "F·d² (N·m²)"],
    donnees: ["Rayon des sphères : 1,0 cm ; q = 5,56 nC après la sonde", "F = Δm × g (g = 9,81 N/kg)", "1 mg = 10⁻⁶ kg ; 1 nC = 10⁻⁹ C"],
    conclusion: "Loi de Coulomb : deux charges ponctuelles q1 et q2 séparées par la distance d exercent l'une sur l'autre des forces opposées, portées par la droite qui les joint, de valeur F = k·|q1·q2| / d², avec k = 1/(4πε0) ≈ 9,0×10⁹ N·m²·C⁻². Elles sont répulsives si les charges sont de même signe, attractives sinon.",
    conclusion_courte: "F = k·|q1·q2| / d² ; k ≈ 9×10⁹ SI.",
    etapes: [
      { consigne: "Chargez les sphères A et B avec la sonde (touchez chacune), placez B à 5 cm de A (distance des centres) et lisez Δm sur la balance.", court: "A et B chargées, d = 5 cm.", aide_geste: "Glissez la sonde jusqu'à une sphère ; glissez la noix de B le long du statif.", verifier: ({ faits }) => pleins(faits).some((r) => r.d === 5) },
      { consigne: "Quelle est la valeur de la force électrostatique entre A et B à 5 cm ?", court: "F (N) à 5 cm ?", question: { type: "nombre", unite: "N", attendu: (f) => (pleins(f).find((r) => r.d === 5) || { dm: 0 }).dm * 1e-6 * G, tolerance_relative: 0.03, aide: "F = Δm × g, Δm en kg.", bravo: "Exact : environ 1,1×10⁻⁴ N." } },
      { consigne: "Mesurez Δm pour cinq distances entre 4 et 10 cm (sans toucher aux charges).", court: "Cinq distances.", verifier: ({ faits }) => new Set(pleins(faits).map((r) => r.d)).size >= 5 },
      { consigne: "Tableur, une ligne par distance : d (m) en A, F (N) en B, 1/d² en C, F·d² en D.", court: "Tableur : d, F, 1/d², F·d².", verifier: tableau },
      { consigne: "Tracez F (colonne B) en fonction de 1/d² (colonne C).", court: "Graphique F = f(1/d²).", verifier: ({ courbe: c }) => (c.x === "C" && c.y === "B" && c.n >= 5) || false },
      { consigne: "F·d² est constant : F est inversement proportionnelle à d². Sachant que F·d² = k·q², calculez k.", court: "k (N·m²·C⁻²) ?", question: { type: "nombre", unite: "N·m²·C⁻²", attendu: 8.99e9, tolerance_relative: 0.03, aide: "k = (F·d²) / q², avec q = 5,56×10⁻⁹ C.", bravo: "Exact : k ≈ 9,0×10⁹ N·m²·C⁻²." } },
      { consigne: "Touchez la sphère B avec la sphère C neutre (identique) : B garde la moitié de sa charge. Lisez Δm à la même distance.", court: "B touchée par C.", aide_geste: "Glissez la sphère C jusqu'à B.", verifier: ({ faits }) => (co(faits).releves || []).some((r) => r.qA === Q0 && Math.abs(r.qB - Q0 / 2) < 0.02) },
      { consigne: "Quand la charge de B est divisée par 2, la force…", court: "Répondez dans le carnet.", question: choix(["est divisée par 2 : F est proportionnelle à qA·qB", "est divisée par 4", "ne change pas"], "Comparez Δm avant et après.", "Exact.") },
    ],
  };

  const CHAMP = {
    id: "champ", paillasse: 1, titre: "Lignes de champ électrostatique",
    objectif: "Visualiser les lignes de champ entre deux pointes, puis entre deux plaques parallèles, avec des grains de semoule.",
    entetes: [],
    conclusion: "Une charge q placée en un point où règne un champ électrostatique E subit la force F = q·E (E en N/C, ou V/m). Les lignes de champ sont tangentes en chaque point au vecteur champ et orientées dans son sens : elles partent des charges positives et vont vers les charges négatives. Le champ de deux charges est la somme vectorielle de leurs champs. Entre deux plaques parallèles de charges opposées, les lignes de champ sont parallèles : le champ est uniforme.",
    conclusion_courte: "F = q·E ; lignes de champ du + vers le − ; champ uniforme entre deux plaques.",
    etapes: [
      { consigne: "Posez les électrodes « 2 pointes » dans la cuve et mettez la haute tension en marche : observez les grains de semoule.", court: "Deux pointes sous tension.", aide_geste: "Glissez la boîte d'électrodes jusqu'à la cuve.", verifier: ({ faits }) => !!ch(faits).vu.pointes },
      { consigne: "Les grains dessinent les lignes de champ. Elles…", court: "Répondez dans le carnet.", question: choix(["partent de la pointe + et arrivent à la pointe −", "sont des cercles autour de chaque pointe", "sont toutes parallèles"], "Le champ est orienté du + vers le −.", "Exact.") },
      { consigne: "Au milieu du segment qui joint les deux pointes, le champ électrostatique est…", court: "Répondez dans le carnet.", question: choix(["la somme des champs des deux pointes, dirigé de + vers −", "nul", "dirigé de − vers +"], "Superposition : E = E1 + E2.", "Exact.") },
      { consigne: "Remplacez les pointes par les électrodes « 2 plaques », remuez et remettez la tension : observez entre les plaques.", court: "Deux plaques sous tension.", verifier: ({ faits }) => !!ch(faits).vu.plaques },
      { consigne: "Entre les deux plaques, les lignes de champ sont parallèles et équidistantes. Le champ y est…", court: "Répondez dans le carnet.", question: choix(["uniforme : même direction, même sens, même valeur partout", "nul", "plus fort près de chaque plaque"], "Regardez l'orientation des grains entre les plaques.", "Exact : champ uniforme.") },
      { consigne: "Une petite boule portant q = 2,0 nC, placée entre les plaques, subit une force F = 4,0×10⁻⁵ N. Quelle est la valeur du champ E ?", court: "E (N/C) ?", question: { type: "nombre", unite: "N/C", attendu: 2.0e4, tolerance_relative: 0.02, aide: "E = F / q.", bravo: "Exact : 2,0×10⁴ N/C." } },
    ],
  };

  L.demarrer({ id: "b1_elec1_a2_champ", titre: "Laboratoire : loi de Coulomb et champ", paillasses: [L.poste_coulomb, L.poste_champ], missions: [COULOMB, CHAMP] });
})(window.Labo);
