/*
Rôle : simulation de l'activité du chapitre « Noyaux, masse et énergie » (2e année du bac) : défaut de masse et énergie de
       liaison (balance de précision, modèle) ; unités (u, eV, J), E = m·c², équation aux dimensions ; courbe d'Aston au
       tableur ; bilans d'énergie avec les masses des noyaux (α, β−, β+, fission, fusion) ; applications et dangers
       (documents, tableau de tri). Objectifs O1 à O5.
Reçoit : rien (les vérifications lisent les faits « balance », « docs_applications », « tri_applications », la feuille et la courbe).
Produit : la simulation démarrée.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const nombre = (unite, attendu, tolerance, aide, bravo) => ({ type: "nombre", unite, attendu, tolerance, aide, bravo });
  const B = (f) => f.balance || {}, compose = (f, id) => B(f).noyau === id && B(f).p === L.NOYAUX[id].z && B(f).n === L.NOYAUX[id].a - L.NOYAUX[id].z;
  const Q = (avant, apres, electrons = 0) => (avant.reduce((s, k) => s + (L.NOYAUX[k] ? L.NOYAUX[k].m : L.NUCLEONS.mn), 0) - apres.reduce((s, k) => s + (L.NOYAUX[k] ? L.NOYAUX[k].m : L.NUCLEONS.mn), 0) - electrons * L.NUCLEONS.me) * L.NUCLEONS.u_MeV;

  function tableau({ feuille }) {
    // Au moins dix noyaux de l'affiche : A, Z, Δm = Z·mp + (A − Z)·mn − m(noyau) (u), El/A (MeV/nucléon).
    const l = feuille.lignes(["A", "B", "C", "D"]);
    if (l.length < 10) return false;
    for (const [k, x] of l.entries()) {
      const id = Object.keys(L.NOYAUX).find((c) => L.NOYAUX[c].a === x.A && L.NOYAUX[c].z === x.B);
      if (!id) return `Ligne ${k + 2} : en A le nombre de nucléons A, en B le numéro atomique Z d'un noyau de l'affiche.`;
      if (Math.abs(x.C - L.liaison(id).dm) > 3e-6) return `Ligne ${k + 2} : en C, Δm = Z·mp + (A − Z)·mn − m(noyau) : =B${k + 2}*1,007276+(A${k + 2}-B${k + 2})*1,008665-${String(L.NOYAUX[id].m).replace(".", ",")}.`;
      if (Math.abs(x.D - (x.C * L.NUCLEONS.u_MeV) / x.A) > 0.005) return `Ligne ${k + 2} : en D, El/A = Δm × 931,5 / A (MeV par nucléon) : =C${k + 2}*931,5/A${k + 2}.`;
    }
    const A = l.map((x) => x.A);
    return (Math.min(...A) < 20 && Math.max(...A) > 200 && new Set(A).size >= 8) || "Prenez des noyaux légers (A < 20), moyens et lourds (A > 200).";
  }

  const LIAISON = {
    id: "liaison", paillasse: 0, titre: "Défaut de masse et énergie de liaison",
    objectif: "Comparer la masse d'un noyau à celle de ses nucléons séparés ; calculer le défaut de masse et l'énergie de liaison ; convertir les unités.",
    entetes: [],
    donnees: ["1 u = 1,66054 × 10⁻²⁷ kg = 931,5 MeV/c²", "1 eV = 1,602 × 10⁻¹⁹ J ; c = 2,998 × 10⁸ m/s"],
    conclusion: "La masse d'un noyau est plus petite que la somme des masses de ses nucléons séparés : c'est le défaut de masse Δm = Z·mp + (A − Z)·mn − m(noyau) > 0. L'énergie de liaison El = Δm·c² est l'énergie qu'il faut fournir à un noyau au repos pour le séparer en nucléons isolés au repos : 28,3 MeV pour ⁴He. L'énergie de liaison par nucléon El/A mesure la stabilité : 7,07 MeV pour ⁴He, 8,79 MeV pour ⁵⁶Fe, plus stable. Avec 1 eV = 1,602 × 10⁻¹⁹ J, 1 u correspond à 931,5 MeV.",
    conclusion_courte: "Δm·c² = El ; El/A mesure la stabilité.",
    etapes: [
      { consigne: "Noyau ⁴₂He sur le plateau de droite. Mettez à gauche ses nucléons séparés : 2 protons et 2 neutrons.", court: "⁴He : 2 p + 2 n.", aide_geste: "Touchez « +1 p » deux fois et « +1 n » deux fois.", verifier: ({ faits }) => compose(faits, "He4") || false },
      { consigne: "Les nucléons séparés sont plus lourds que le noyau. Défaut de masse Δm (u) ?", court: "Δm (u) ?", question: nombre("u", 0.030377, 0.00003, "Lisez « gauche − droite » sur l'écran.", "Exact : Δm ≈ 0,030377 u.") },
      { consigne: "Énergie de liaison El = Δm·c² (MeV) ?", court: "El (MeV) ?", question: nombre("MeV", 28.30, 0.08, "1 u = 931,5 MeV/c².", "Exact : environ 28,3 MeV.") },
      { consigne: "La même énergie en joules (en unités de 10⁻¹² J) ?", court: "El (10⁻¹² J) ?", question: nombre("× 10⁻¹² J", 4.533, 0.02, "1 MeV = 10⁶ × 1,602 × 10⁻¹⁹ J.", "Exact : environ 4,53 × 10⁻¹² J.") },
      { consigne: "L'énergie de liaison d'un noyau est…", court: "Répondez dans le carnet.", question: choix(["l'énergie à fournir à un noyau au repos pour le séparer en nucléons isolés au repos", "l'énergie d'un nucléon", "l'énergie libérée par une désintégration"], "Pensez à la balance.", "Exact.") },
      { consigne: "Énergie équivalente à une masse de 1 u : E = m·c² (en unités de 10⁻¹⁰ J) ?", court: "1 u (10⁻¹⁰ J) ?", question: nombre("× 10⁻¹⁰ J", 1.4925, 0.004, "m = 1,66054 × 10⁻²⁷ kg ; c = 2,998 × 10⁸ m/s.", "Exact : 1,4925 × 10⁻¹⁰ J, soit 931,5 MeV.") },
      { consigne: "L'équation aux dimensions de E = m·c² donne pour le joule…", court: "Répondez dans le carnet.", question: choix(["1 J = 1 kg·m²·s⁻²", "1 J = 1 kg·m·s⁻¹", "1 J = 1 kg·m²·s⁻¹"], "[c] = L·T⁻¹.", "Exact : [E] = M·L²·T⁻².") },
      { consigne: "Touchez « Noyau » jusqu'au fer 56 et mettez à gauche ses nucléons séparés.", court: "⁵⁶Fe : 26 p + 30 n.", verifier: ({ faits }) => compose(faits, "Fe56") || false },
      { consigne: "Énergie de liaison par nucléon du fer 56, El/A (MeV/nucléon) ?", court: "El/A (fer) ?", question: nombre("MeV", 8.79, 0.02, "El = Δm × 931,5 ; divisez par A = 56.", "Exact : 8,79 MeV par nucléon, plus que ⁴He : le fer est plus stable.") },
    ],
  };

  const ASTON = {
    id: "aston", paillasse: 1, titre: "La courbe d'Aston",
    objectif: "Calculer l'énergie de liaison par nucléon de nombreux noyaux ; tracer El/A en fonction de A ; repérer les noyaux les plus stables.",
    entetes: ["A", "Z", "Δm (u)", "El/A (MeV)"],
    donnees: ["Δm = Z·mp + (A − Z)·mn − m(noyau) ; mp = 1,007276 u ; mn = 1,008665 u", "El/A = Δm × 931,5 / A (MeV par nucléon)"],
    conclusion: "El/A augmente rapidement pour les noyaux légers, atteint un maximum d'environ 8,8 MeV par nucléon vers A ≈ 60 (fer, nickel), les noyaux les plus stables, puis diminue lentement jusqu'à 7,6 MeV pour l'uranium. La courbe d'Aston (−El/A en fonction de A) montre donc deux façons de libérer de l'énergie : la fission d'un noyau lourd en deux noyaux moyens et la fusion de deux noyaux légers ; dans les deux cas, les noyaux formés sont plus liés.",
    conclusion_courte: "Maximum de El/A vers A ≈ 60 ; fission et fusion libèrent de l'énergie.",
    etapes: [
      { consigne: "Tableur : au moins dix noyaux de l'affiche, légers, moyens et lourds. En A : A ; en B : Z ; en C : Δm (u) ; en D : El/A (MeV).", court: "Tableur : A, Z, Δm, El/A.", aide_geste: "Pour ⁴He, en C : =B2*1,007276+(A2-B2)*1,008665-4,001505 (la masse du noyau lue sur l'affiche) ; en D2 : =C2*931,5/A2.", verifier: tableau },
      { consigne: "Tracez El/A (D) en fonction de A (A).", court: "Courbe El/A = f(A).", verifier: ({ courbe }) => (courbe.x === "A" && courbe.y === "D" && courbe.n >= 10) || "Abscisse : A ; ordonnée : D (El/A)." },
      { consigne: "Quand A augmente, El/A…", court: "Répondez dans le carnet.", question: choix(["augmente vite, passe par un maximum vers A ≈ 60, puis diminue lentement", "augmente toujours", "reste constante"], "Regardez la forme de la courbe.", "Exact.") },
      { consigne: "Plus grande valeur de El/A dans votre tableau (MeV par nucléon) ?", court: "El/A maximale ?", question: nombre("MeV", 8.79, 0.02, "Le noyau de fer 56.", "Exact : les noyaux vers A ≈ 60 sont les plus stables.") },
      { consigne: "Un noyau lourd (A > 200) se casse en deux noyaux moyens. Les noyaux formés…", court: "Répondez dans le carnet.", question: choix(["sont plus liés (El/A plus grande) : de l'énergie est libérée, c'est la fission", "sont moins liés : il faut fournir de l'énergie", "ont la même énergie de liaison"], "Comparez El/A pour A = 235 et A ≈ 120.", "Exact.") },
      { consigne: "Deux noyaux très légers s'unissent en un noyau plus lourd. C'est…", court: "Répondez dans le carnet.", question: choix(["la fusion : le noyau formé est plus lié, de l'énergie est libérée", "la fission", "une désintégration α"], "Comparez El/A de ²H, ³H et ⁴He.", "Exact.") },
      { consigne: "La courbe d'Aston représente −El/A en fonction de A. Les noyaux les plus stables sont…", court: "Répondez dans le carnet.", question: choix(["au fond du creux, vers A ≈ 60", "aux deux extrémités", "en haut de la courbe"], "−El/A est le plus petit quand El/A est le plus grand.", "Exact.") },
    ],
  };

  const BILANS = {
    id: "bilans", paillasse: 1, titre: "Bilans d'énergie",
    objectif: "Calculer l'énergie libérée par des transformations nucléaires, avec les masses des noyaux.",
    entetes: [],
    donnees: ["E libérée = [m(réactifs) − m(produits)]·c², avec les masses des NOYAUX", "Particules : ⁰₋₁e et ⁰₊₁e de masse me ; ¹₀n de masse mn", "Fission : ²³⁵₉₂U + ¹₀n → ⁹⁴₃₈Sr + ¹⁴⁰₅₄Xe + 2 ¹₀n ; fusion : ²₁H + ³₁H → ⁴₂He + ¹₀n"],
    conclusion: "Dans une transformation nucléaire spontanée ou provoquée, la masse des produits est plus petite que celle des réactifs : la différence Δm donne l'énergie libérée E = |Δm|·c². Désintégration α du radium 226 : 4,87 MeV ; β− du carbone 14 : 0,157 MeV ; β+ du fluor 18 : 0,635 MeV ; fission d'un noyau d'uranium 235 : environ 185 MeV ; fusion deutérium-tritium : 17,6 MeV, soit plus d'énergie par nucléon que la fission. Un gramme d'uranium 235 libère environ 7,6 × 10¹⁰ J.",
    conclusion_courte: "E = |Δm|·c² ; fission ≈ 185 MeV, fusion ≈ 17,6 MeV.",
    etapes: [
      { consigne: "²²⁶₈₈Ra → ²²²₈₆Rn + ⁴₂He. Énergie libérée (MeV) ?", court: "E (α, Ra 226) ?", question: nombre("MeV", Q(["Ra226"], ["Rn222", "He4"]), 0.03, "m(Ra) − m(Rn) − m(He), puis × 931,5.", "Exact : environ 4,87 MeV.") },
      { consigne: "¹⁴₆C → ¹⁴₇N + ⁰₋₁e. Énergie libérée (MeV) ?", court: "E (β−, C 14) ?", question: nombre("MeV", Q(["C14"], ["N14"], 1), 0.004, "N'oubliez pas la masse de l'électron.", "Exact : environ 0,157 MeV.") },
      { consigne: "¹⁸₉F → ¹⁸₈O + ⁰₊₁e. Énergie libérée (MeV) ?", court: "E (β+, F 18) ?", question: nombre("MeV", Q(["F18"], ["O18"], 1), 0.004, "Le positon a la masse d'un électron.", "Exact : environ 0,635 MeV.") },
      { consigne: "Fission : ²³⁵₉₂U + ¹₀n → ⁹⁴₃₈Sr + ¹⁴⁰₅₄Xe + 2 ¹₀n. Énergie libérée (MeV) ?", court: "E (fission) ?", question: nombre("MeV", Q(["U235", "n"], ["Sr94", "Xe140", "n", "n"]), 1, "Réactifs : U + n ; produits : Sr + Xe + 2 n.", "Exact : environ 185 MeV.") },
      { consigne: "Fusion : ²₁H + ³₁H → ⁴₂He + ¹₀n. Énergie libérée (MeV) ?", court: "E (fusion) ?", question: nombre("MeV", Q(["H2", "H3"], ["He4", "n"]), 0.05, "Réactifs : ²H + ³H ; produits : ⁴He + n.", "Exact : environ 17,6 MeV.") },
      { consigne: "Par nucléon des réactifs, quelle réaction libère le plus d'énergie ?", court: "Répondez dans le carnet.", question: choix(["la fusion : 17,6 / 5 ≈ 3,5 MeV contre 185 / 236 ≈ 0,78 MeV pour la fission", "la fission", "elles libèrent autant"], "Divisez par le nombre de nucléons.", "Exact.") },
      { consigne: "Énergie libérée par la fission de 1,00 g d'uranium 235 (en unités de 10¹⁰ J) ?", court: "E (1 g, 10¹⁰ J) ?", question: nombre("× 10¹⁰ J", 7.58, 0.12, "Nombre de noyaux : 6,022 × 10²³ / 235 ; 1 MeV = 1,602 × 10⁻¹³ J.", "Exact : environ 7,6 × 10¹⁰ J, l'énergie de 2 tonnes de pétrole.") },
    ],
  };

  const APPLICATIONS = {
    id: "applications", paillasse: 2, titre: "Applications et dangers",
    objectif: "Lire des documents sur les applications des réactions nucléaires ; les classer ; connaître leurs dangers.",
    entetes: [],
    donnees: [],
    conclusion: "Les centrales nucléaires et la bombe A utilisent la fission ; le Soleil, ITER et la bombe H, la fusion ; la médecine (imagerie, radiothérapie) et la datation utilisent des désintégrations radioactives. Les rayonnements sont dangereux : irradiation par une source extérieure, contamination par une substance radioactive absorbée. Les déchets à vie longue doivent être stockés et surveillés pendant des milliers d'années.",
    conclusion_courte: "Fission, fusion, désintégrations : applications et dangers.",
    etapes: [
      { consigne: "Lisez les quatre documents au mur.", court: "Lisez les documents.", aide_geste: "Touchez un document pour l'ouvrir, touchez-le de nouveau pour le refermer.", verifier: ({ faits }) => (faits.docs_applications || []).length >= 4 || false },
      { consigne: "Rangez chaque application selon la transformation nucléaire qu'elle utilise.", court: "Tableau : fission, fusion, désintégration.", verifier: ({ faits }) => L.tableau_tri.verifier(L.TRI_APPLICATIONS, faits.tri_applications) },
      { consigne: "Dans une centrale, la réaction en chaîne est…", court: "Répondez dans le carnet.", question: choix(["contrôlée par des barres qui absorbent une partie des neutrons", "impossible à arrêter", "une fusion"], "Document « La centrale nucléaire ».", "Exact.") },
      { consigne: "Avaler ou respirer une substance radioactive, c'est…", court: "Répondez dans le carnet.", question: choix(["une contamination, plus grave qu'une irradiation de même durée", "une irradiation", "sans danger"], "Document « Dangers et déchets ».", "Exact.") },
      { consigne: "En imagerie médicale, on injecte un radioélément de courte demi-vie parce que…", court: "Répondez dans le carnet.", question: choix(["son activité devient vite négligeable : le patient est peu exposé", "il est moins cher", "il émet de la lumière visible"], "Fluor 18 : 110 min.", "Exact.") },
    ],
  };

  L.poste_aston = function (g) {
    // Pense-bête et affiche des masses des noyaux.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230);
    L.affiche_masses(g);
    return { pense_bete };
  };

  L.demarrer({ id: "b2_nucl2_a1_energie", titre: "Laboratoire : noyaux, masse et énergie", paillasses: [L.poste_balance, L.poste_aston, L.poste_applications], missions: [LIAISON, ASTON, BILANS, APPLICATIONS] });
})(window.Labo);
