/*
Rôle : simulation de l'activité du chapitre « Réactions d'estérification et d'hydrolyse » (2e année du bac) : groupes
       caractéristiques et noms des esters ; titrage par la soude de l'acide restant dans un tube d'estérification sorti du
       bain-marie à 60 min ; courbe x = f(t) avec les résultats de la classe : lenteur, limite (67 %), K = 4, hydrolyse
       (33 %), rôle de la température et du catalyseur ; mélange avec excès d'alcool à l'équilibre : rendement 90 %, Qr < K.
       Objectifs O1 à O6.
Reçoit : rien (les vérifications lisent les faits « tri_groupes », « titrage_esters » et la feuille).
Produit : la simulation démarrée.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const E = L.ESTERS, choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const relatif = (unite, attendu, tol, aide, bravo) => ({ type: "nombre", unite, attendu, tolerance_relative: tol, aide, bravo });
  const T = (f) => f.titrage_esters || { VE: {} }, VE = (f, k) => T(f).VE?.[k] ?? null;
  const RECOMMENCER = "Remplissez la burette et recommencez avec un bécher neuf.";

  function titre(k, attendu) {
    // Teinte rose persistante lue ; trop tôt ou dépassée : le dire.
    return ({ faits }) => {
      const v = VE(faits, k), t = T(faits);
      if (v === null) return t.sur === k && t.phenol && !t.phenol[k] ? "Ajoutez d'abord deux gouttes de phénolphtaléine dans le bécher." : false;
      if (v > attendu + 0.25) return `Équivalence dépassée (${String(v.toFixed(2)).replace(".", ",")} mL). ${k === "B" ? "Avez-vous rempli la burette (zéro) avant ce titrage ? " : ""}${RECOMMENCER}`;
      return v < attendu - 0.25 ? `Le rose est apparu trop tôt : agitez bien. ${RECOMMENCER}` : true;
    };
  }

  function feuille_x({ faits, feuille }) {
    // A : t (min) ; B : VE (mL) de l'affiche ou du titrage du tube A ; C : x = 20 − B ; huit lignes au moins.
    const v = (c, n) => feuille.valeur_sure(`${c}${n}`), lignes = [...E.RESULTATS, ...(VE(faits, "A") !== null ? [[60, VE(faits, "A")]] : [])];
    let n_ok = 0;
    for (let n = 2; n <= 12; n++) {
      if (v("A", n) === null) continue;
      if (!lignes.some(([t, ve]) => Math.abs(t - v("A", n)) < 0.06 && Math.abs(ve - v("B", n)) < 0.06)) return `Ligne ${n} : en A la date (min), en B le volume équivalent (mL) du même tube.`;
      if (v("C", n) === null || Math.abs(v("C", n) - (20 - v("B", n))) > 0.02) return `Ligne ${n} : en C, x = 20 − B${n} (mmol).`;
      n_ok++;
    }
    return n_ok >= 8 || false;
  }

  function tri({ faits }) {
    // Toutes les étiquettes rangées dans la bonne colonne.
    const t = faits.tri_groupes || {};
    if (L.TRI_GROUPES.some(([id]) => t[id] === undefined || t[id] === null)) return false;
    const faux = L.TRI_GROUPES.filter(([id, , c]) => t[id] !== c);
    return faux.length === 0 || `${faux.length} étiquette(s) mal rangée(s) : –COOH acide, –OH alcool, –COO– ester, –CO–O–CO– anhydride.`;
  }

  const GROUPES = {
    id: "groupes", paillasse: 0, titre: "Acides, alcools, esters et anhydrides",
    conclusion: "Un acide carboxylique porte le groupe –COOH, un alcool le groupe –OH, un ester le groupe –COO–R et un anhydride d'acide le groupe –CO–O–CO–. Un ester R–COO–R' se forme à partir de l'acide R–COOH et de l'alcool R'–OH : R–COOH + R'–OH ⇌ R–COO–R' + H₂O. Il se nomme « alcanoate d'alkyle » : la partie qui vient de l'acide, puis celle qui vient de l'alcool (CH₃–COO–CH₂–CH₃ : éthanoate d'éthyle).",
    objectif: "Reconnaître les groupes caractéristiques, écrire l'équation d'estérification et nommer un ester (O1, O2, O3).",
    entetes: [], donnees: ["Huit formules semi-développées"],
    conclusion_courte: "Acide + alcool ⇌ ester + eau ; « alcanoate d'alkyle ».",
    etapes: [
      { consigne: "Rangez les huit formules selon leur groupe caractéristique.", court: "Rangez les formules.", aide_geste: "Faites glisser chaque étiquette dans une colonne.", verifier: tri },
      { consigne: "L'équation de l'estérification de l'acide éthanoïque par l'éthanol est…", court: "Répondez dans le carnet.", question: choix(["CH₃–COOH + CH₃–CH₂–OH ⇌ CH₃–COO–CH₂–CH₃ + H₂O", "CH₃–COOH + CH₃–CH₂–OH → CH₃–CO–O–CO–CH₃ + H₂", "CH₃–COOH + H₂O ⇌ CH₃–COO⁻ + H₃O⁺"], "Un acide et un alcool donnent un ester et de l'eau.", "Exact.") },
      { consigne: "Le nom de CH₃–COO–CH₂–CH₃ est…", court: "Répondez dans le carnet.", question: choix(["éthanoate d'éthyle", "éthanoate de méthyle", "propanoate de méthyle"], "D'abord la partie qui vient de l'acide (–oate), puis celle qui vient de l'alcool (–yle).", "Exact.") },
      { consigne: "H–COO–CH₃ s'obtient à partir de…", court: "Répondez dans le carnet.", question: choix(["l'acide méthanoïque et le méthanol (c'est le méthanoate de méthyle)", "l'acide éthanoïque et l'eau", "le méthanol seul"], "Coupez l'ester entre C=O–O et la chaîne de l'alcool.", "Exact.") },
      { consigne: "L'ester de l'acide propanoïque et de l'éthanol, à cinq atomes de carbone, s'appelle…", court: "Répondez dans le carnet.", question: choix(["propanoate d'éthyle : CH₃–CH₂–COO–CH₂–CH₃", "éthanoate de propyle", "pentanoate"], "Acide propanoïque : 3 C ; éthanol : 2 C.", "Exact.") },
    ],
  };

  const TITRAGE = {
    id: "titrage", paillasse: 1, titre: "L'estérification est lente",
    conclusion: "Le tube A, chauffé 60 min à 100 °C, puis plongé dans l'eau glacée (trempe), contient encore de l'acide : on le titre par la soude, la phénolphtaléine rosit à l'équivalence. n(acide restant) = C·VE ≈ 9,6 mmol, donc x = 20 − C·VE ≈ 10,4 mmol : après une heure à 100 °C, la transformation n'est pas finie. Elle est lente.",
    objectif: "Doser l'acide restant dans un tube et en déduire l'avancement (O4, O6).",
    entetes: [], donnees: ["n₀(acide) = n₀(éthanol) = 20 mmol", "Soude à 1,0 mol/L ; CH₃COOH + HO⁻ → CH₃COO⁻ + H₂O"],
    conclusion_courte: "Après 60 min, x ≈ 10,4 mmol : lente.",
    etapes: [
      { consigne: "Ajoutez deux gouttes de phénolphtaléine dans le bécher A, posez-le sur l'agitateur, remplissez la burette et titrez jusqu'à la première teinte rose qui persiste.", court: "Titrage du bécher A.", aide_geste: "Touchez la clé du robinet : goutte à goutte ou fermé ; glissez-la vers le haut pour un filet. Lisez le volume dans la loupe.", verifier: titre("A", E.VE_60) },
      { consigne: "Volume équivalent VE (mL) ?", court: "VE (mL) ?", question: { type: "nombre", unite: "mL", attendu: (f) => VE(f, "A") ?? E.VE_60, tolerance: 0.15, aide: "Lisez la burette à la première teinte rose persistante.", bravo: "Exact." } },
      { consigne: "On verse le tube dans l'eau glacée et on titre aussitôt, car…", court: "Répondez dans le carnet.", question: choix(["le froid et la dilution bloquent l'estérification, et la soude ne réagit presque pas avec l'ester à froid", "l'eau glacée dissout l'ester", "le froid accélère le titrage"], "C'est une trempe, comme en cinétique.", "Exact.") },
      { consigne: "Avancement x de l'estérification dans le tube à 60 min (mmol) ?", court: "x (mmol) ?", question: relatif("mmol", (f) => 20 - (VE(f, "A") ?? E.VE_60), 0.02, "n(acide restant) = C·VE ; x = 20 − n(acide restant), en mmol.", "Exact.") },
    ],
  };

  const COURBE = {
    id: "courbe", paillasse: 2, titre: "Lente et limitée : un équilibre",
    conclusion: "x augmente de plus en plus lentement et tend vers 13,3 mmol : le rendement est limité à 67 % pour un mélange équimolaire. L'état final est un équilibre : K = x²/(20 − x)² = 4. L'hydrolyse de l'ester, transformation inverse, est elle aussi lente et limitée (33 %) et conduit au même état d'équilibre. La température et un catalyseur (acide sulfurique) rendent l'équilibre plus vite atteint, sans changer l'état final.",
    objectif: "Tracer x = f(t), déterminer le rendement et la constante d'équilibre (O4, O5, O6).",
    entetes: ["t (min)", "VE (mL)", "x (mmol)"], donnees: ["x = 20 − C·VE = 20 − VE (mmol)", "Ajoutez votre mesure à 60 min", "Rendement : x_final / x_max"],
    conclusion_courte: "Rendement 67 % ; K = 4 ; même équilibre par l'hydrolyse.",
    etapes: [
      { consigne: "Tableur : t (min) en A, VE (mL) en B (affiche et votre mesure à 60 min), x = 20 − B en C.", court: "Tableur : t, VE, x.", verifier: feuille_x },
      { consigne: "Tracez x (C) en fonction de t (A).", court: "Courbe x = f(t).", verifier: ({ courbe: c }) => (c.x === "A" && c.y === "C" && c.n >= 8) || "Abscisse : A ; ordonnée : C." },
      { consigne: "Avancement final x_f (mmol) ?", court: "x_f (mmol) ?", question: relatif("mmol", 13.3, 0.03, "Valeur vers laquelle tend la courbe.", "Exact.") },
      { consigne: "Rendement de l'estérification (%) ?", court: "Rendement (%) ?", question: relatif("%", 66.7, 0.04, "r = x_f / x_max, avec x_max = 20 mmol.", "Exact : 67 %.") },
      { consigne: "Constante d'équilibre K = [ester][eau] / ([acide][alcool]) ?", court: "K ?", question: relatif("", 4, 0.1, "Le volume se simplifie : K = x_f² / (20 − x_f)².", "Exact : K = 4.") },
      { consigne: "D'après l'affiche, l'hydrolyse de 20 mmol d'ester par 20 mmol d'eau…", court: "Répondez dans le carnet.", question: choix(["est lente et limitée à 6,7 mmol (33 %) : elle conduit au même équilibre que l'estérification", "est totale", "est rapide et donne 20 mmol d'acide"], "Comparez 6,7 et 20 − 13,3.", "Exact : ce sont deux transformations inverses.") },
      { consigne: "D'après l'affiche des conditions, chauffer ou ajouter de l'acide sulfurique…", court: "Répondez dans le carnet.", question: choix(["fait atteindre l'équilibre plus vite sans changer l'avancement final", "augmente le rendement final", "n'a aucun effet"], "Comparez les avancements à 60 min et à l'état final.", "Exact : l'acide sulfurique est un catalyseur.") },
    ],
  };

  const EXCES = {
    id: "exces", paillasse: 1, titre: "Déplacer l'équilibre",
    conclusion: "Avec 60 mmol d'éthanol pour 20 mmol d'acide, il ne reste à l'équilibre que 1,9 mmol d'acide : le rendement passe à 90 %. Ajouter un réactif rend Qr < K : le système évolue dans le sens direct. On augmente aussi le rendement en éliminant un produit (l'eau, ou l'ester distillé au fur et à mesure). Le chauffage à reflux accélère la transformation sans perte de matière.",
    objectif: "Montrer qu'un excès de réactif déplace l'équilibre (O5, O6).",
    entetes: [], donnees: ["B : 20 mmol d'acide + 60 mmol d'éthanol, à l'équilibre", "Soude à 1,0 mol/L"],
    conclusion_courte: "Excès d'un réactif : Qr < K, rendement 90 %.",
    etapes: [
      { consigne: "Titrez le bécher B : remplissez la burette, deux gouttes de phénolphtaléine, B sur l'agitateur.", court: "Titrage du bécher B.", verifier: titre("B", E.VE_EXCES) },
      { consigne: "Rendement de l'estérification dans B (%) ?", court: "Rendement (%) ?", question: relatif("%", (f) => (20 - (VE(f, "B") ?? E.VE_EXCES)) / 20 * 100, 0.03, "x_f = 20 − C·VE ; l'acide est le réactif limitant.", "Exact : environ 90 %.") },
      { consigne: "L'excès d'éthanol augmente le rendement, car…", court: "Répondez dans le carnet.", question: choix(["ajouter un réactif diminue Qr : Qr < K, le système évolue dans le sens direct", "l'éthanol est un catalyseur", "K augmente"], "K ne dépend que de la température.", "Exact.") },
      { consigne: "Un autre moyen d'augmenter le rendement est…", court: "Répondez dans le carnet.", question: choix(["éliminer un produit au fur et à mesure (eau, ou ester distillé)", "ajouter de l'eau", "ajouter un catalyseur"], "Que devient Qr si l'on enlève un produit ?", "Exact.") },
      { consigne: "En synthèse, on chauffe à reflux pour…", court: "Répondez dans le carnet.", question: choix(["accélérer la transformation sans perdre de matière : les vapeurs se condensent et retombent dans le ballon", "augmenter K", "rendre la transformation totale"], "La température est un facteur cinétique.", "Exact.") },
    ],
  };

  L.demarrer({ id: "b2_chim9_a1_esterification", titre: "Laboratoire : estérification et hydrolyse", paillasses: [L.poste_groupes, L.poste_titrage_esters, L.poste_resultats_esters], missions: [GROUPES, TITRAGE, COURBE, EXCES] });
})(window.Labo);
