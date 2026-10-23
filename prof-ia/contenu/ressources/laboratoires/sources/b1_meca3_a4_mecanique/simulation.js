/*
Rôle : simulation de l'activité 4 du chapitre « Le travail, mode de transfert d'énergie » (1re année du bac) :
       conservation de l'énergie mécanique quand seul le poids travaille (chute libre d'une bille), non-conservation avec
       frottement (mobile sur un rail à coussin d'air incliné, débit d'air faible) : ΔEm = −Q. Objectifs O4 et O5.
Reçoit : rien (les vérifications lisent les faits « chute » et « rail » et la feuille de calcul).
Produit : la simulation démarrée : appareil de chute libre ; rail incliné.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const MB = 0.033, D = 0.02, G = 9.81, MR = 0.2, ELL = 0.02, SIN = 0.1;
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const ch = (f) => (f.chute || {}).essais || [], ra = (f, d) => ((f.rail || {}).essais || []).filter((e) => e.debit === d);
  const mesures = (f) => ch(f).flatMap((e) => [{ z: e.z1, dt: e.dt1 }, { z: e.z2, dt: e.dt2 }]);

  function tableau_chute({ faits, feuille }) {
    // Six hauteurs : z, Ec = ½m(d/Δt)², Epp = m·g·z, Em = Ec + Epp.
    const l = feuille.lignes(["A", "B", "C", "D"]);
    if (l.length < 6) return false;
    for (const [k, r] of l.entries()) {
      const m = mesures(faits).find((x) => Math.abs(x.z - r.A) < 0.001 && Math.abs(r.B - 0.5 * MB * (D / x.dt) ** 2) <= 0.02 * r.B);
      if (!m) return `Ligne ${k + 2} : z (m) d'une cellule et Ec = ½ × 0,033 × (0,0200 / Δt)² mesurée à cette hauteur.`;
      if (Math.abs(r.C - MB * G * r.A) > 0.01 * r.C) return `Ligne ${k + 2} : Epp = m·g·z (référence : la paillasse).`;
      if (Math.abs(r.D - r.B - r.C) > 0.002) return `Ligne ${k + 2} : Em = Ec + Epp.`;
    }
    return new Set(l.map((r) => r.A)).size >= 6 || "Six hauteurs différentes.";
  }

  const CONSERVATION = {
    id: "conservation", paillasse: 0, titre: "Conservation de l'énergie mécanique",
    objectif: "Calculer Ec, Epp et Em d'une bille en chute libre à plusieurs hauteurs.",
    entetes: ["z (m)", "Ec (J)", "Epp (J)", "Em (J)"],
    donnees: ["Bille : m = 33,0 g ; d = 2,00 cm ; g = 9,81 N/kg", "Epp = 0 au niveau de la paillasse (z = 0)", "Ec = ½·m·(d/Δt)²"],
    conclusion: "L'énergie mécanique d'un solide est la somme de son énergie cinétique et de son énergie potentielle de pesanteur : Em = Ec + Epp. Quand seul le poids travaille (chute libre, glissement sans frottement), Em se conserve : l'énergie potentielle se transforme en énergie cinétique, et inversement.",
    conclusion_courte: "Em = Ec + Epp = constante si seul le poids travaille.",
    etapes: [
      { consigne: "Placez les deux cellules où vous voulez et appuyez sur « Lâcher ».", court: "Premier lâcher.", aide_geste: "Glissez une cellule le long de la tige ; « Remonter » replace la bille.", verifier: ({ faits }) => ch(faits).length >= 1 },
      { consigne: "Quelle est l'énergie mécanique de la bille immobile contre l'électroaimant (z = 1,100 m) ?", court: "Em (J) au départ ?", question: { type: "nombre", unite: "J", attendu: MB * G * 1.1, tolerance: 0.003, aide: "v = 0 : Em = Epp = m·g·z.", bravo: "Exact." } },
      { consigne: "Faites trois lâchers en déplaçant les cellules entre chacun : vous aurez six hauteurs différentes.", court: "Six hauteurs.", verifier: ({ faits }) => new Set(mesures(faits).map((m) => m.z)).size >= 6 },
      { consigne: "Tableur, une ligne par hauteur : z en A, Ec en B, Epp en C, Em = Ec + Epp en D.", court: "Tableur : z, Ec, Epp, Em.", verifier: tableau_chute },
      { consigne: "Pendant la chute, l'énergie mécanique de la bille…", court: "Répondez dans le carnet.", question: choix(["reste constante : seul le poids travaille", "augmente", "diminue"], "Comparez la colonne D à l'énergie de départ.", "Exact : Em se conserve.") },
      { consigne: "Pendant la chute…", court: "Répondez dans le carnet.", question: choix(["l'énergie potentielle se transforme en énergie cinétique", "l'énergie cinétique se transforme en énergie potentielle", "Ec et Epp augmentent toutes les deux"], "Comparez les colonnes B et C.", "Exact.") },
    ],
  };

  function tableau_rail({ faits, feuille }) {
    // Les deux cellules, débit faible : x, Ec, Epp, Em.
    const e = ra(faits, "faible").slice(-1)[0], l = feuille.lignes(["A", "B", "C", "D"]);
    if (!e || l.length < 2) return false;
    for (const [k, [x, dt]] of [[0.2, e.dt1], [0.8, e.dt2]].entries()) {
      const r = l[k];
      if (Math.abs(r.A - x) > 0.001) return `Ligne ${k + 2} : x = ${x === 0.2 ? "0,20" : "0,80"} m (cellule ${k + 1}).`;
      if (Math.abs(r.B - 0.5 * MR * (ELL / dt) ** 2) > 0.02 * r.B) return `Ligne ${k + 2} : Ec = ½ × 0,200 × (0,020 / Δt${k + 1})².`;
      if (Math.abs(r.C - MR * G * (1 - x) * SIN) > 0.01 * r.C) return `Ligne ${k + 2} : Epp = m·g·z, avec z = (1,00 − x)·sin α.`;
      if (Math.abs(r.D - r.B - r.C) > 0.002) return `Ligne ${k + 2} : Em = Ec + Epp.`;
    }
    return true;
  }
  const dEm = (f) => { const e = ra(f, "faible").slice(-1)[0] || { dt1: 1, dt2: 1 }, ec = (dt) => 0.5 * MR * (ELL / dt) ** 2; return ec(e.dt2) + MR * G * 0.02 - ec(e.dt1) - MR * G * 0.08; };

  const FROTTEMENT = {
    id: "frottement", paillasse: 1, titre: "Non-conservation de l'énergie mécanique",
    objectif: "Comparer l'énergie mécanique d'un mobile en deux points d'un rail incliné, sans puis avec frottement.",
    entetes: ["x (m)", "Ec (J)", "Epp (J)", "Em (J)"],
    donnees: ["Mobile : m = 200 g ; ℓ = 2,0 cm", "sin α = 0,100 ; z = (1,00 − x)·sin α", "Ec = ½·m·(ℓ/Δt)²"],
    conclusion: "Quand des frottements s'exercent, l'énergie mécanique diminue : ΔEm = W(f) < 0. L'énergie perdue n'a pas disparu : elle est transférée au milieu extérieur (rail, air) sous forme de chaleur Q = −W(f) : ΔEm = −Q.",
    conclusion_courte: "Avec frottement : ΔEm = W(f) = −Q.",
    etapes: [
      { consigne: "Débit normal : appuyez sur « Lâcher ». Lisez les durées Δt1 et Δt2.", court: "Lâcher, débit normal.", verifier: ({ faits }) => ra(faits, "normal").length >= 1 },
      { consigne: "Calculez Em aux deux cellules (z1 = 0,080 m, z2 = 0,020 m). Avec le débit normal, l'énergie mécanique…", court: "Répondez dans le carnet.", question: choix(["est la même aux deux cellules : elle se conserve", "augmente", "diminue nettement"], "Ec = ½·m·(ℓ/Δt)², Epp = m·g·z.", "Exact : sans frottement, Em se conserve.") },
      { consigne: "Appuyez sur « Remonter », choisissez le débit faible (le mobile frotte sur le rail), puis lâchez-le.", court: "Lâcher, débit faible.", verifier: ({ faits }) => ra(faits, "faible").length >= 1 },
      { consigne: "Tableur, avec ce dernier lâcher : une ligne par cellule (x = 0,20 m puis 0,80 m) : x en A, Ec en B, Epp en C, Em = Ec + Epp en D.", court: "Tableur : x, Ec, Epp, Em.", verifier: tableau_rail },
      { consigne: "Quelle est la variation ΔEm = Em2 − Em1 entre les deux cellules ?", court: "ΔEm (J) ?", question: { type: "nombre", unite: "J", attendu: dEm, tolerance: 0.005, aide: "Différence des deux valeurs de la colonne D.", bravo: "Exact : Em a diminué." } },
      { consigne: "ΔEm est égale au travail de la force de frottement f, constante, sur 60 cm. Quelle est la valeur de f ?", court: "f (N) ?", question: { type: "nombre", unite: "N", attendu: (f) => -dEm(f) / 0.6, tolerance: 0.01, aide: "W(f) = −f × 0,60 m = ΔEm.", bravo: "Exact." } },
      { consigne: "L'énergie mécanique perdue…", court: "Répondez dans le carnet.", question: choix(["est transférée au rail et à l'air sous forme de chaleur : ΔEm = −Q", "disparaît", "se transforme en énergie potentielle"], "Le frottement échauffe le rail.", "Exact : Q = −W(f).") },
    ],
  };

  const chute = (g) => { L.chute_libre(g); return { pense_bete: L.decor.pense_bete(g, 24, 52, 230) }; };
  L.demarrer({ id: "b1_meca3_a4_mecanique", titre: "Laboratoire : énergie mécanique", paillasses: [chute, L.poste_rail], missions: [CONSERVATION, FROTTEMENT] });
})(window.Labo);
