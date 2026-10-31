/*
Rôle : simulation de l'activité 1 du chapitre « Classification périodique des éléments » (tronc commun) : histoire de la
       classification et méthode de Mendeleïev (cartes à ranger) ; deux familles chimiques observées au laboratoire : les
       métaux alcalins avec l'eau, les halogénures avec les ions argent. Objectifs O1, O3.
Reçoit : rien (les vérifications lisent les faits des paillasses).
Produit : la simulation démarrée : Mendeleïev ; alcalins ; halogènes.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const F = (faits, k) => faits[k] || {};

  function cartes({ faits }) {
    // Les 16 cartes sont rangées, chacune dans la case de Mendeleïev.
    const m = F(faits, "mendeleiev"), attendu = L.CARTES_MENDELEIEV, ids = Object.keys(attendu);
    if (Object.keys(m).length < ids.length) return false;
    const faux = ids.filter((s) => m[s] !== attendu[s]);
    return !faux.length || `${faux.length} carte${faux.length > 1 ? "s ne sont pas" : " n'est pas"} à sa place : masses croissantes sur une ligne, nouvelle ligne quand le type de formule se répète.`;
  }

  const MENDELEIEV = {
    id: "mendeleiev", paillasse: 0, titre: "La méthode de Mendeleïev",
    objectif: "Lire l'histoire de la classification, puis ranger des éléments comme Mendeleïev : par masse croissante et par propriétés.",
    entetes: [],
    conclusion: "Mendeleïev a rangé les éléments par masse atomique croissante en plaçant dans une même colonne ceux qui ont les mêmes propriétés chimiques ; il a laissé des cases vides et prévu des éléments inconnus (le germanium). Aujourd'hui, on range les éléments par numéro atomique Z croissant : une ligne correspond au remplissage d'une couche, une colonne rassemble les éléments qui ont le même nombre d'électrons externes (une famille).",
    conclusion_courte: "Mendeleïev : masses et propriétés ; aujourd'hui : Z.",
    etapes: [
      { consigne: "Lisez les trois documents affichés au mur.", court: "Lisez les 3 documents.", verifier: ({ faits }) => [1, 2, 3].every((k) => (faits.docs_classification || []).includes(k)) || false },
      { consigne: "Rangez les 16 cartes comme Mendeleïev : par masse croissante, de gauche à droite ; commencez une nouvelle ligne quand le type de formule recommence (Li₂O, puis Na₂O…).", court: "Rangez les 16 cartes.", aide_geste: "Faites glisser chaque carte dans une case.", verifier: cartes },
      { consigne: "Pour ranger les éléments, Mendeleïev a utilisé…", court: "Répondez dans le carnet.", question: choix(["leur masse atomique et leurs propriétés chimiques", "leur numéro atomique Z", "leur couleur"], "Relisez le document 2 ; Z n'était pas connu en 1869.", "Exact.") },
      { consigne: "Quelle masse Mendeleïev avait-il prévue pour l'éka-silicium (le futur germanium) ?", court: "Masse prévue de l'éka-silicium ?", question: { type: "nombre", unite: "", attendu: 72, tolerance: 1, aide: "Relisez le document 2.", bravo: "Exact : le germanium, découvert en 1886, a une masse de 72,6." } },
      { consigne: "Aujourd'hui, les éléments sont rangés…", court: "Répondez dans le carnet.", question: choix(["par numéro atomique Z croissant ; une colonne regroupe les éléments qui ont le même nombre d'électrons externes", "par masse croissante seulement", "par ordre alphabétique"], "Relisez le document 3.", "Exact.") },
    ],
  };

  const ALCALINS = {
    id: "alcalins", paillasse: 1, titre: "Une famille : les métaux alcalins",
    objectif: "Comparer les réactions du lithium, du sodium et du potassium avec l'eau.",
    entetes: [],
    conclusion: "Le lithium, le sodium et le potassium réagissent tous avec l'eau : il se forme du dihydrogène et une solution basique (la phénolphtaléine rosit), qui contient les ions Li⁺, Na⁺, K⁺. Ces métaux de la première colonne forment la famille des alcalins ; leur réaction est de plus en plus vive en descendant la colonne.",
    conclusion_courte: "Alcalins : même réaction, ions M⁺.",
    etapes: [
      { consigne: "Mettez les lunettes. Avec la pince, déposez un grain de lithium dans un cristallisoir, un grain de sodium dans un autre, un grain de potassium dans le troisième. Observez.", court: "Li, Na, K dans l'eau.", aide_geste: "Saisissez la pince au-dessus d'un flacon et lâchez-la au-dessus d'un cristallisoir.", verifier: ({ faits }) => { const a = F(faits, "alcalins"); return ["Li", "Na", "K"].every((m) => a[m] === "fini") || false; } },
      { consigne: "La phénolphtaléine devient rose : la solution est devenue…", court: "Répondez dans le carnet.", question: choix(["basique (elle contient des ions hydroxyde HO⁻)", "acide", "neutre"], "La phénolphtaléine est rose en milieu basique.", "Exact. Le gaz qui se dégage est du dihydrogène.") },
      { consigne: "Les trois métaux réagissent de la même façon, de plus en plus vivement du lithium au potassium. On dit qu'ils forment…", court: "Répondez dans le carnet.", question: choix(["une famille chimique : les alcalins (première colonne)", "un seul élément", "des gaz nobles"], "Ils sont dans la même colonne.", "Exact.") },
      { consigne: "Un atome alcalin a 1 électron sur sa couche externe. Il donne l'ion…", court: "Répondez dans le carnet.", question: choix(["M⁺ (Li⁺, Na⁺, K⁺) : il perd cet électron", "M⁻", "M²⁺"], "Pensez à la règle du duet ou de l'octet.", "Exact.") },
    ],
  };

  const HALOGENES = {
    id: "halogenes", paillasse: 2, titre: "Une famille : les halogènes",
    objectif: "Comparer les réactions des ions chlorure, bromure et iodure avec les ions argent.",
    entetes: [],
    conclusion: "Les ions chlorure Cl⁻, bromure Br⁻ et iodure I⁻ donnent tous un précipité avec les ions argent Ag⁺ (blanc, blanc jaunâtre, jaune). Le chlore, le brome et l'iode ont 7 électrons externes : ils forment la famille des halogènes (avant-dernière colonne) et donnent des ions X⁻.",
    conclusion_courte: "Halogènes : même réaction, ions X⁻.",
    etapes: [
      { consigne: "Mettez lunettes et gants. Versez quelques gouttes de nitrate d'argent dans chacun des trois tubes.", court: "Nitrate d'argent dans les 3 tubes.", verifier: ({ faits }) => { const h = F(faits, "halogenures"); return ["Cl", "Br", "I"].every((x) => h[x] > 0.05) || false; } },
      { consigne: "Dans les trois tubes, il se forme…", court: "Répondez dans le carnet.", question: choix(["un précipité (blanc, blanc jaunâtre, jaune) : même réaction avec les ions argent", "aucun changement", "un gaz"], "Regardez les tubes.", "Exact : chlorure, bromure et iodure d'argent.") },
      { consigne: "Le chlore, le brome et l'iode ont 7 électrons sur leur couche externe. Ils forment la famille des…", court: "Répondez dans le carnet.", question: choix(["halogènes : ils donnent des ions X⁻ (Cl⁻, Br⁻, I⁻)", "alcalins", "gaz nobles"], "Il leur manque un électron pour avoir 8 électrons externes.", "Exact.") },
    ],
  };

  L.demarrer({ id: "tc_chim6_a1_familles", titre: "Laboratoire : Mendeleïev et les familles chimiques", paillasses: [L.poste_mendeleiev, L.poste_alcalins, L.poste_halogenures], missions: [MENDELEIEV, ALCALINS, HALOGENES] });
})(window.Labo);
