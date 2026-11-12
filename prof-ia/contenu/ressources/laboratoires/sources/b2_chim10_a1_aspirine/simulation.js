/*
Rôle : simulation de l'activité 1 du chapitre « Contrôle de l'évolution des systèmes chimiques » (2e année du bac) : synthèse
       de l'aspirine par l'anhydride éthanoïque (réaction rapide et totale) avec l'acide sulfurique comme catalyseur,
       cristallisation dans l'eau glacée, filtration sous vide, pesée et rendement ; titrage direct d'un comprimé d'aspirine
       à froid (on favorise la réaction acide-base, on évite la saponification). Objectifs O1, O4.
Reçoit : rien (les vérifications lisent les faits des paillasses).
Produit : la simulation démarrée.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const nombre = (unite, attendu, tolerance, aide, bravo) => ({ type: "nombre", unite, attendu, tolerance, aide, bravo });
  const R = (f) => f.reflux_aspirine || {}, F = (f) => f.filtration_aspirine || {}, P = (f) => f.pesee_aspirine || {}, T = (f) => f.titrage_comprime || {};
  const M_OBT = L.ASPIRINE.M_OBTENUE, N_AS = (3.0 / 138) * 1000, VE_TH = (L.ASPIRINE.N_COMPRIME / 0.2);
  const RECOMMENCER = "Touchez « Bécher neuf », remplissez la burette et recommencez.";

  function chauffe({ faits }) {
    // 15 min de reflux ; sans catalyseur, peu d'aspirine formée.
    const r = R(faits);
    if (r.fuite) return "Des vapeurs s'échappent : le réfrigérant doit être posé et l'eau ouverte.";
    if (r.avance < 1) return false;
    return r.brut_aspirine >= 7 || "Après 15 min, il reste beaucoup d'acide salicylique : avez-vous ajouté l'acide sulfurique (catalyseur) ?";
  }

  function peser({ faits }) {
    // Tout le produit dans une coupelle tarée posée sur la balance.
    const p = P(faits);
    if (!p.tout) return false;
    if (p.sur_balance < M_OBT - 0.01) return "Tout le produit doit être dans la coupelle posée sur la balance.";
    if (p.lecture !== null && Math.abs(p.lecture - M_OBT) > 0.02) return "Tarez la balance avec la coupelle vide (touche T) avant de verser.";
    return p.lecture !== null || false;
  }

  function titre({ faits }) {
    // Teinte rose persistante lue au bon volume.
    const t = T(faits);
    if (t.VE === null || t.VE === undefined) return t.sur && !t.phenol ? "Ajoutez d'abord deux gouttes de phénolphtaléine." : false;
    if (t.VE > VE_TH + 0.3) return `Équivalence dépassée (${String(t.VE.toFixed(2)).replace(".", ",")} mL). ${RECOMMENCER}`;
    return t.VE < VE_TH - 0.3 ? `Le rose est apparu trop tôt : agitez bien. ${RECOMMENCER}` : true;
  }

  const REFLUX = {
    id: "reflux", paillasse: 0, titre: "Synthèse de l'aspirine",
    conclusion: "L'acide salicylique réagit avec l'anhydride éthanoïque : C₇H₆O₃ + C₄H₆O₃ → C₉H₈O₄ + C₂H₄O₂ (aspirine + acide éthanoïque). Avec un anhydride, la réaction est rapide et totale : elle ne forme pas d'eau, donc pas d'hydrolyse inverse, contrairement à l'estérification par un acide. L'acide sulfurique est un catalyseur : il accélère la transformation, n'apparaît pas dans le bilan et ne change pas l'état final. Dans l'eau glacée, l'aspirine, peu soluble à froid, cristallise et l'anhydride restant est détruit.",
    objectif: "Synthétiser un ester avec un anhydride d'acide et un catalyseur (O1, O4).",
    entetes: [], donnees: ["Acide salicylique : 3,00 g ; anhydride éthanoïque : 6,0 mL (en excès)", "Acide sulfurique : quelques gouttes", "L'anhydride est corrosif et inflammable : gants, lunettes"],
    conclusion_courte: "Anhydride : rapide et totale ; H₂SO₄ : catalyseur.",
    etapes: [
      { consigne: "Mettez les lunettes et les gants (touchez-les sur leurs crochets).", court: "Lunettes et gants.", verifier: ({ faits }) => R(faits).epi || false },
      { consigne: "Par l'entonnoir, versez dans le ballon l'acide salicylique, puis l'anhydride éthanoïque.", court: "Réactifs dans le ballon.", aide_geste: "Portez chaque bécher au-dessus de l'entonnoir, puis inclinez-le avec la poignée.", verifier: ({ faits }) => ((R(faits).acide_salicylique >= 1.8 || R(faits).brut_aspirine > 1) && (R(faits).anhydride_acetique >= 5 || R(faits).brut_aspirine > 5)) || false },
      { consigne: "Ajoutez trois gouttes d'acide sulfurique avec le compte-gouttes, puis quelques grains de pierre ponce.", court: "Catalyseur et pierre ponce.", aide_geste: "Sortez la pipette du flacon, tenez-la au-dessus de l'entonnoir et appuyez sur la poire.", verifier: ({ faits }) => (R(faits).ox_sulfurique >= 0.1 && R(faits).ponce) || false },
      { consigne: "Rangez l'entonnoir, posez le réfrigérant, ouvrez l'eau et chauffez à reflux pendant 15 minutes (chronomètre).", court: "Reflux pendant 15 min.", verifier: chauffe },
      { consigne: "L'équation de la synthèse est…", court: "Répondez dans le carnet.", question: choix(["C₇H₆O₃ + C₄H₆O₃ → C₉H₈O₄ + C₂H₄O₂ (aspirine + acide éthanoïque)", "C₇H₆O₃ + C₂H₄O₂ ⇌ C₉H₈O₄ + H₂O", "C₇H₆O₃ + C₄H₆O₃ → C₉H₈O₄ + H₂O"], "Un anhydride réagit avec le groupe –OH en donnant un ester et un acide carboxylique.", "Exact.") },
      { consigne: "On utilise l'anhydride éthanoïque plutôt que l'acide éthanoïque, car la réaction est…", court: "Répondez dans le carnet.", question: choix(["rapide et totale : il ne se forme pas d'eau, donc pas d'hydrolyse de l'ester", "plus lente mais moins chère", "limitée à 67 %, comme toute estérification"], "Comparez avec l'estérification du chapitre précédent.", "Exact.") },
      { consigne: "L'acide sulfurique…", court: "Répondez dans le carnet.", question: choix(["est un catalyseur : il accélère la transformation sans figurer dans le bilan ni changer l'état final", "est un réactif consommé", "augmente le rendement final"], "On l'a mis en très petite quantité ; on le retrouve à la fin.", "Exact.") },
      { consigne: "Arrêtez le chauffage, laissez refroidir, ôtez le réfrigérant, puis versez le contenu du ballon dans l'eau glacée.", court: "Versez dans l'eau glacée.", aide_geste: "Prenez le ballon par son col et inclinez-le au-dessus du bécher.", verifier: ({ faits }) => R(faits).recu >= 15 || false },
    ],
  };

  const FILTRATION = {
    id: "filtration", paillasse: 1, titre: "Recueillir les cristaux",
    conclusion: "Les cristaux d'aspirine restent sur le papier filtre ; l'eau mère (eau et acide éthanoïque) traverse. On les rince à l'eau glacée, où l'aspirine est très peu soluble, puis on les sèche à l'étuve avant de les peser.",
    objectif: "Séparer les cristaux d'aspirine par filtration sous vide (O1).",
    entetes: [], donnees: ["Büchner, fiole à vide, trompe à eau"],
    conclusion_courte: "Cristaux sur le papier, eau mère dans la fiole.",
    etapes: [
      { consigne: "Posez un papier filtre dans le Büchner et mouillez-le avec la pissette.", court: "Papier posé et mouillé.", verifier: ({ faits }) => (F(faits).papier && F(faits).mouille) || false },
      { consigne: "Ouvrez le robinet de la trompe à eau, puis versez tout le mélange dans le Büchner.", court: "Vide, mélange versé.", verifier: ({ faits }) => (F(faits).vide && F(faits).residu && F(faits).filtrat >= 15) || false },
      { consigne: "Arrêtez : débranchez d'abord le tuyau de la fiole, puis fermez le robinet.", court: "Tuyau débranché, robinet fermé.", verifier: ({ faits }) => { const f = F(faits); if (f.retour) return "Retour d'eau : il fallait débrancher le tuyau avant de fermer le robinet."; return (!f.vide && !f.branche) || false; } },
      { consigne: "On rince les cristaux à l'eau glacée, car…", court: "Répondez dans le carnet.", question: choix(["l'aspirine est très peu soluble à froid : on en perd moins", "l'eau glacée sèche plus vite", "l'eau chaude la décolorerait"], "Pensez à la solubilité.", "Exact.") },
    ],
  };

  const RENDEMENT = {
    id: "rendement", paillasse: 2, titre: "Peser l'aspirine, calculer le rendement",
    conclusion: "n(acide salicylique) = 3,00 / 138 = 21,7 mmol ; n(anhydride) = 6,0 × 1,08 / 102 = 63,5 mmol : l'anhydride est en excès, n(max) = 21,7 mmol. On obtient 3,20 g, soit 17,8 mmol : r ≈ 82 %. La réaction étant totale, les pertes viennent des transferts, de la filtration et de l'aspirine restée dissoute.",
    objectif: "Peser le produit sec et calculer le rendement (O1).",
    entetes: [], donnees: ["n = m / M ; m = d × V (g, avec V en mL)", "Les coefficients de l'équation valent tous 1"],
    conclusion_courte: "r = n(obtenu) / n(max) ≈ 82 %.",
    etapes: [
      { consigne: "Allumez la balance, posez une coupelle vide sur le plateau et tarez (touche T).", court: "Coupelle tarée.", verifier: ({ faits }) => (P(faits).coupelle && P(faits).lecture === 0) || false },
      { consigne: "Avec la spatule, versez tout le produit sec dans la coupelle, puis lisez la masse.", court: "Pesez tout le produit.", aide_geste: "Sortez la spatule du pot et tenez-la au-dessus de la coupelle ; retournez au pot pour la recharger.", verifier: peser },
      { consigne: "Quantité de matière d'acide salicylique (mmol) ?", court: "n(acide salicylique) ?", question: nombre("mmol", N_AS, 0.4, "n = 3,00 / 138.", "Exact : 21,7 mmol.") },
      { consigne: "Le réactif limitant est…", court: "Répondez dans le carnet.", question: choix(["l'acide salicylique : n(anhydride) = 6,0 × 1,08 / 102 ≈ 63,5 mmol est plus grand", "l'anhydride éthanoïque", "l'acide sulfurique"], "Calculez n(anhydride).", "Exact.") },
      { consigne: "Rendement de la synthèse (%) ?", court: "Rendement (%) ?", question: nombre("%", (f) => ((P(f).lecture || M_OBT) / 180 * 1000 / N_AS) * 100, 2, "r = (m/180) / n(acide salicylique) × 100.", "Exact : environ 82 %.") },
    ],
  };

  const TITRAGE = {
    id: "titrage", paillasse: 3, titre: "Contrôler un comprimé",
    conclusion: "À l'équivalence, n(aspirine) = C·VE = 0,20 × 13,9 × 10⁻³ = 2,78 mmol, soit 500 mg : le comprimé est conforme. On titre à froid et vite pour ne faire réagir que le groupe acide –COOH : à chaud, la soude saponifierait aussi le groupe ester. Parmi plusieurs réactions possibles, les conditions (température, durée, catalyseur sélectif) permettent d'en favoriser une.",
    objectif: "Doser l'aspirine d'un comprimé en favorisant une seule réaction (O4).",
    entetes: [], donnees: ["Soude à 0,20 mol/L ; phénolphtaléine", "Aspirine C₉H₈O₄ : M = 180 g/mol ; un groupe –COOH et un groupe ester"],
    conclusion_courte: "500 mg ; à froid : seule la réaction acide-base.",
    etapes: [
      { consigne: "Posez le bécher sur l'agitateur, mettez l'agitation, ajoutez deux gouttes de phénolphtaléine, remplissez la burette et titrez jusqu'à la première teinte rose qui persiste.", court: "Titrage du comprimé.", aide_geste: "Touchez la clé du robinet : goutte à goutte ou fermé ; glissez-la vers le haut pour un filet.", verifier: titre },
      { consigne: "Masse d'aspirine dans le comprimé (mg) ?", court: "m (mg) ?", question: nombre("mg", (f) => 0.2 * (T(f).VE || VE_TH) * 180, 12, "n = C·VE ; m = n × 180.", "Exact : le comprimé contient bien 500 mg.") },
      { consigne: "On titre à froid et rapidement, car…", court: "Répondez dans le carnet.", question: choix(["à chaud, la soude réagirait aussi avec le groupe ester (saponification) : on favorise une seule réaction", "le froid accélère le titrage", "la phénolphtaléine ne vire qu'à froid"], "L'aspirine porte un groupe –COOH et un groupe ester.", "Exact.") },
      { consigne: "Dans l'industrie, un catalyseur sélectif…", court: "Répondez dans le carnet.", question: choix(["accélère une seule des réactions possibles : il oriente le système vers le produit voulu", "rend toutes les réactions totales", "déplace l'équilibre"], "Un catalyseur agit sur la vitesse, pas sur l'état final.", "Exact.") },
    ],
  };

  L.demarrer({ id: "b2_chim10_a1_aspirine", titre: "Laboratoire : synthèse de l'aspirine", paillasses: [L.poste_reflux_aspirine, L.poste_filtration_aspirine, L.poste_pesee_aspirine, L.poste_comprime], missions: [REFLUX, FILTRATION, RENDEMENT, TITRAGE] });
})(window.Labo);
