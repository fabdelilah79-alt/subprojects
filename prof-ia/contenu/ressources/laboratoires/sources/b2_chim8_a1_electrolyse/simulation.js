/*
Rôle : simulation de l'activité 1 du chapitre « Exemples de transformations forcées : l'électrolyse » (2e année du bac, PC et SM) :
       pile cuivre-argent forcée par un générateur (courant inverse, Qr s'éloigne de K) ; électrolyse d'une solution de chlorure
       de sodium (phénolphtaléine, papier à l'iodure de potassium, tension seuil, volume de dihydrogène) ; charge et décharge d'un
       accumulateur au plomb. Objectifs O1, O2.
Reçoit : rien (les vérifications lisent les faits « pile_forcee », « electrolyse_nacl », « accumulateur »).
Produit : la simulation démarrée.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const P = (f) => f.pile_forcee || {}, N = (f) => f.electrolyse_nacl || {}, A = (f) => f.accumulateur || {};

  function force({ faits }) {
    // Courant inverse vu à l'ampèremètre ; sinon, dire quoi corriger.
    const p = P(faits);
    if (p.force) return true;
    if (p.U_G > 1 && p.I > 0) return "Le courant n'a pas changé de sens : la borne + de G doit être du côté de la lame d'argent (pôle + de la pile).";
    return false;
  }

  function papier({ faits }) {
    // Un papier a bleui au-dessus de l'anode.
    const n = N(faits);
    if (n.papier_bleu) return true;
    return n.Q > 3 ? "Posez une bande de papier sur l'ouverture de chaque branche, l'une après l'autre si besoin." : false;
  }

  const FORCEE = {
    id: "forcee", paillasse: 0, titre: "Forcer une pile à fonctionner à l'envers",
    conclusion: "Seule, la pile Cu | Cu²⁺ || Ag⁺ | Ag débite un courant qui sort par la lame d'argent : Cu + 2 Ag⁺ → Cu²⁺ + 2 Ag, sens spontané (Qr < K). Un générateur branché en opposition, de tension supérieure à la f.é.m. E ≈ 0,43 V, impose un courant inverse : 2 Ag + Cu²⁺ → 2 Ag⁺ + Cu. Qr = [Cu²⁺]/[Ag⁺]² diminue : le système s'éloigne de l'équilibre ; c'est une transformation forcée. La lame d'argent, reliée à la borne + du générateur, est l'anode (oxydation Ag → Ag⁺ + e⁻) ; la lame de cuivre, reliée à la borne −, est la cathode (réduction Cu²⁺ + 2 e⁻ → Cu).",
    objectif: "Imposer un courant inverse à une pile et reconnaître une transformation forcée (O1, O2).",
    entetes: [], donnees: ["Cu | Cu²⁺ (0,10 mol/L) || Ag⁺ (0,10 mol/L) | Ag, pont salin posé", "R = 100 Ω ; G réglable de 0 à 12 V"],
    conclusion_courte: "Courant imposé inverse : transformation forcée.",
    etapes: [
      { consigne: "Montez en série la pile, R, l'ampèremètre (A⎓, calibre 20 mA) et le générateur G réglé à 0 V.", court: "Pile + R + ampèremètre + G (0 V).", verifier: ({ faits }) => P(faits).spontane || false },
      { consigne: "Avec G à 0 V, la pile fonctionne seule. Dans les fils, le courant…", court: "Répondez dans le carnet.", question: choix(["sort par la lame d'argent (pôle +) : Cu + 2 Ag⁺ → Cu²⁺ + 2 Ag, sens spontané", "sort par la lame de cuivre", "est nul"], "Revoyez la pile cuivre-argent du chapitre précédent.", "Exact.") },
      { consigne: "La borne + de G du côté de la lame d'argent, augmentez sa tension jusqu'à 1,5 V en regardant l'ampèremètre.", court: "G en opposition : 0 → 1,5 V.", aide_geste: "Touches +0,1 et +1 du générateur.", verifier: force },
      { consigne: "À partir de quelle tension U_G (V) le courant change-t-il de sens ?", court: "U_G d'inversion (V) ?", question: { type: "nombre", unite: "V", attendu: (f) => P(f).E || 0.43, tolerance: 0.1, aide: "Le courant s'annule quand U_G égale la f.é.m. de la pile.", bravo: "Exact : U_G doit dépasser la f.é.m. E de la pile." } },
      { consigne: "Quand le courant est inversé…", court: "Répondez dans le carnet.", question: choix(["2 Ag + Cu²⁺ → 2 Ag⁺ + Cu : Qr = [Cu²⁺]/[Ag⁺]² diminue et s'éloigne de K : la transformation est forcée", "le système évolue toujours vers l'équilibre", "la pile se recharge sans aucune transformation chimique"], "Le générateur impose le sens du courant, donc des réactions aux électrodes.", "Exact.") },
      { consigne: "La lame d'argent, reliée à la borne + du générateur, est maintenant…", court: "Répondez dans le carnet.", question: choix(["l'anode : siège de l'oxydation Ag → Ag⁺ + e⁻ ; la lame de cuivre est la cathode (Cu²⁺ + 2 e⁻ → Cu)", "la cathode : siège d'une réduction", "ni anode ni cathode"], "Le courant entre dans la pile par la lame d'argent ; l'anode est l'électrode où a lieu l'oxydation.", "Exact.") },
    ],
  };

  const NACL = {
    id: "nacl", paillasse: 1, titre: "Électrolyse d'une solution de chlorure de sodium",
    conclusion: "Sous 6 V, un courant de l'ordre de 0,2 A traverse le tube en U et des gaz se dégagent aux deux électrodes. À la cathode, reliée à la borne − du générateur, la phénolphtaléine rosit : 2 H₂O + 2 e⁻ → H₂ + 2 HO⁻ (réduction). À l'anode, reliée à la borne +, le papier à l'iodure de potassium bleuit : 2 Cl⁻ → Cl₂ + 2 e⁻ (oxydation). Bilan : 2 Cl⁻ + 2 H₂O → Cl₂ + H₂ + 2 HO⁻. Sous 2 V environ, rien ne se passe : cette transformation forcée exige que le générateur lui fournisse de l'énergie. n(H₂) = I·Δt / (2F).",
    objectif: "Réaliser une électrolyse, identifier l'anode et la cathode et les produits formés (O1, O2).",
    entetes: [], donnees: ["Solution de NaCl à 1 mol/L + phénolphtaléine ; électrodes de graphite", "Papier imbibé d'iodure de potassium et d'empois d'amidon : bleuit avec le dichlore", "F = 96 500 C/mol ; Vm = 24 L/mol"],
    conclusion_courte: "Anode (+) : oxydation ; cathode (−) : réduction.",
    etapes: [
      { consigne: "Branchez le tube en U au générateur G (6,0 V), avec l'ampèremètre en série (calibre 200 mA).", court: "G + ampèremètre + tube en U.", verifier: ({ faits }) => (N(faits).I_lu > 50) || false },
      { consigne: "La solution rosit autour de l'électrode reliée à…", court: "Répondez dans le carnet.", question: choix(["la borne − du générateur : il s'y forme des ions HO⁻ (2 H₂O + 2 e⁻ → H₂ + 2 HO⁻), c'est la cathode", "la borne + du générateur", "aux deux électrodes à la fois"], "La phénolphtaléine rosit en milieu basique ; regardez quel fil arrive à cette électrode.", "Exact.") },
      { consigne: "Posez une bande de papier à l'iodure de potassium sur l'ouverture de chaque branche.", court: "Papier KI sur chaque branche.", aide_geste: "Faites glisser la bande jusqu'à l'ouverture du tube et lâchez-la.", verifier: papier },
      { consigne: "Les réactions aux électrodes sont…", court: "Répondez dans le carnet.", question: choix(["anode (+) : 2 Cl⁻ → Cl₂ + 2 e⁻ (oxydation) ; cathode (−) : 2 H₂O + 2 e⁻ → H₂ + 2 HO⁻ (réduction)", "anode : 2 H₂O + 2 e⁻ → H₂ + 2 HO⁻ ; cathode : 2 Cl⁻ → Cl₂ + 2 e⁻", "Na⁺ + e⁻ → Na à la cathode"], "Le papier a bleui au-dessus de l'électrode reliée à la borne +.", "Exact.") },
      { consigne: "Volume de dihydrogène (mL) dégagé en 10 min sous 6,0 V, avec le courant mesuré ?", court: "V(H₂) en 10 min (mL) ?", question: { type: "nombre", unite: "mL", attendu: (f) => ((N(f).I_6V || 190) * 1e-3 * 600 * 24000) / (2 * 96500), tolerance_relative: 0.05, aide: "n(e⁻) = I·Δt / F ; n(H₂) = n(e⁻) / 2 ; V = n·Vm.", bravo: "Exact." } },
      { consigne: "Réglez G à 1,5 V et regardez l'ampèremètre.", court: "G à 1,5 V.", verifier: ({ faits }) => N(faits).sous_seuil || false },
      { consigne: "Sous 2 V environ, aucun courant ne passe ; on en conclut que…", court: "Répondez dans le carnet.", question: choix(["2 Cl⁻ + 2 H₂O → Cl₂ + H₂ + 2 HO⁻ est une transformation forcée : elle n'a lieu que si le générateur lui fournit assez d'énergie", "la solution ne conduit plus le courant", "l'électrolyse est spontanée"], "Une pile n'a pas besoin de générateur pour fonctionner ; l'électrolyse, si.", "Exact.") },
    ],
  };

  const ACCU = {
    id: "accu", paillasse: 2, titre: "Charge et décharge d'un accumulateur au plomb",
    conclusion: "Neuf, l'accumulateur (deux plaques de plomb dans l'acide sulfurique) ne donne aucune tension. Pendant la charge, le générateur impose une transformation forcée : la plaque reliée à sa borne + (anode) s'oxyde et se couvre de dioxyde de plomb brun : PbSO₄ + 2 H₂O → PbO₂ + SO₄²⁻ + 4 H⁺ + 2 e⁻ ; à la cathode, PbSO₄ + 2 e⁻ → Pb + SO₄²⁻. Chargé, il fonctionne comme une pile de f.é.m. 2 V environ : sa décharge dans la lampe est spontanée, inverse de la charge ; la plaque de dioxyde de plomb est son pôle +.",
    objectif: "Charger un accumulateur (transformation forcée) puis le faire débiter (transformation spontanée) (O1, O2).",
    entetes: [], donnees: ["Plaques de plomb dans H₂SO₄ à 0,5 mol/L", "G = 3,0 V ; lampe 2,5 V – 0,1 A", "K : position 1 vers G, position 2 vers la lampe"],
    conclusion_courte: "Charge forcée ; décharge spontanée.",
    etapes: [
      { consigne: "Avant la charge, mesurez la tension entre les deux plaques de plomb (V⎓, calibre 20 V).", court: "Tension avant la charge.", verifier: ({ faits }) => A(faits).neuf_mesure || false },
      { consigne: "Câblez : une plaque à la borne commune 0 de K ; borne 1 de K vers + de G ; borne 2 vers la lampe ; − de G et la lampe à l'autre plaque. K sur 1 : chargez environ une minute.", court: "K sur 1 : charge.", aide_geste: "Touchez K pour le basculer.", verifier: ({ faits }) => A(faits).charge || false },
      { consigne: "Pendant la charge, la plaque reliée à la borne + du générateur…", court: "Répondez dans le carnet.", question: choix(["se couvre de dioxyde de plomb brun : c'est l'anode, siège d'une oxydation ; elle devient le pôle + de l'accumulateur", "se couvre de plomb : c'est la cathode", "ne change pas"], "Regardez les plaques ; l'oxydation a lieu là où le courant entre.", "Exact.") },
      { consigne: "Basculez K sur la position 2 et mesurez la tension aux bornes de l'accumulateur pendant que la lampe brille.", court: "K sur 2 : décharge.", verifier: ({ faits }) => (A(faits).allumee && A(faits).U_decharge !== null) || false },
      { consigne: "Tension (V) aux bornes de l'accumulateur pendant la décharge ?", court: "U (V) ?", question: { type: "nombre", unite: "V", attendu: (f) => A(f).U_decharge || 1.8, tolerance: 0.06, aide: "Lisez le voltmètre pendant que la lampe brille.", bravo: "Exact : un peu moins que sa f.é.m. (2 V environ)." } },
      { consigne: "Pour l'accumulateur, la charge et la décharge sont…", court: "Répondez dans le carnet.", question: choix(["la charge une transformation forcée (imposée par le générateur), la décharge une transformation spontanée, inverse de la charge", "deux transformations spontanées", "deux transformations forcées"], "Pendant la décharge, aucun générateur n'est branché.", "Exact.") },
      { consigne: "Pendant la décharge, le pôle + de l'accumulateur est…", court: "Répondez dans le carnet.", question: choix(["la plaque couverte de dioxyde de plomb, qui était l'anode pendant la charge", "la plaque de plomb restée grise", "n'importe laquelle des deux"], "Regardez la couleur des plaques.", "Exact.") },
    ],
  };

  L.demarrer({ id: "b2_chim8_a1_electrolyse", titre: "Laboratoire : l'électrolyse, une transformation forcée", paillasses: [L.poste_forcee, L.poste_nacl, L.poste_accumulateur], missions: [FORCEE, NACL, ACCU] });
})(window.Labo);
