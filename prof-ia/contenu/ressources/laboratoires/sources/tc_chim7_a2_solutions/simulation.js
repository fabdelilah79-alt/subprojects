/*
Rôle : simulation de l'activité 2 du chapitre « La mole et la concentration » (tronc commun) : dissolution d'espèces
       moléculaires (saccharose, diiode, éthanol) ; préparation de 100,0 mL de solution de glucose à 0,100 mol/L par
       dissolution en fiole jaugée ; dilution dix fois d'une eau iodée. Objectifs O4, O5.
Reçoit : rien (les vérifications lisent les faits « dissolution », « preparation » et « dilution »).
Produit : la simulation démarrée : dissolution ; préparation ; dilution.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const b = (faits, id) => faits.dissolution?.[id] || {};

  const DISSOUDRE = {
    id: "dissoudre", paillasse: 0, titre: "Dissoudre des espèces moléculaires",
    objectif: "Dissoudre du saccharose et du diiode dans l'eau et dans l'éthanol ; mélanger l'éthanol et l'eau.",
    entetes: [],
    conclusion: "Une solution est obtenue en dissolvant une espèce chimique, le soluté, dans un solvant ; si le solvant est l'eau, c'est une solution aqueuse. Agiter accélère la dissolution. La solubilité dépend du solvant : le diiode est très peu soluble dans l'eau, très soluble dans l'éthanol. L'éthanol et l'eau sont miscibles. Un soluté formé de molécules (saccharose, diiode) donne une solution moléculaire ; un solide ionique comme NaCl donne une solution ionique.",
    conclusion_courte: "Soluté + solvant → solution ; la solubilité dépend du solvant.",
    etapes: [
      { consigne: "Le diiode est nocif : mettez vos lunettes et vos gants.", court: "Lunettes et gants.", verifier: ({ faits }) => !!faits.dissolution?.protege },
      { consigne: "Avec la microspatule, ajoutez une pointe de saccharose dans le bécher 1 (eau). N'agitez pas : observez.", court: "Saccharose dans le bécher 1.", aide_geste: "Sortez la spatule du pot et lâchez-la au-dessus du bécher 1.", verifier: ({ faits }) => { const x = b(faits, "b1"); if (["b2", "b3", "b5"].some((k) => b(faits, k).sucre_s > 0)) return "Le saccharose doit aller dans le bécher 1."; return x.sucre_s + x.sucre_d > 0.4; } },
      { consigne: "Sans agitation, après quelques secondes, le saccharose…", court: "Répondez dans le carnet.", question: choix(["se dissout très lentement : des cristaux restent au fond", "a disparu tout de suite", "flotte à la surface"], "Regardez le fond du bécher 1.", "Exact : sans agitation, la dissolution est lente.") },
      { consigne: "Agitez avec l'agitateur en verre (pointe dans le liquide, remuez) jusqu'à ce qu'il ne reste plus de cristaux.", court: "Agitez le bécher 1.", aide_geste: "Prenez l'agitateur par le haut et remuez-le vite dans le bécher 1.", verifier: ({ faits }) => { const x = b(faits, "b1"); return x.sucre_d > 0.4 && x.sucre_s < 0.001; } },
      { consigne: "Dans l'eau sucrée, le soluté est…", court: "Répondez dans le carnet.", question: choix(["le saccharose", "l'eau", "l'eau sucrée"], "Le solvant est le liquide dans lequel on dissout.", "Exact : l'eau est le solvant, l'eau sucrée est la solution.") },
      { consigne: "Ajoutez une pointe de diiode dans le bécher 2 (eau) et agitez longtemps.", court: "Diiode dans le bécher 2, agitez.", verifier: ({ faits }) => { const x = b(faits, "b2"); return x.iode_s + x.iode_d > 0.03 && x.iode_d > 0.001; } },
      { consigne: "Dans l'eau, le diiode…", court: "Répondez dans le carnet.", question: choix(["est très peu soluble : l'eau est à peine colorée et des cristaux restent", "est très soluble", "ne se dissout pas du tout"], "Regardez la couleur et le fond du bécher 2.", "Exact : environ 0,3 g par litre d'eau seulement.") },
      { consigne: "Ajoutez une pointe de diiode dans le bécher 3 (éthanol) et agitez.", court: "Diiode dans le bécher 3, agitez.", verifier: ({ faits }) => { const x = b(faits, "b3"); return x.iode_d > 0.03 && x.iode_s < 0.002; } },
      { consigne: "La solubilité d'une espèce chimique dépend…", court: "Répondez dans le carnet.", question: choix(["du solvant", "de la forme du bécher", "de la couleur de l'agitateur"], "Comparez les béchers 2 et 3.", "Exact : le diiode est bien plus soluble dans l'éthanol que dans l'eau.") },
      { consigne: "Versez l'éthanol du bécher 4 dans l'eau du bécher 5. Observez.", court: "Bécher 4 dans le bécher 5.", aide_geste: "Tenez le bécher 4 au-dessus du bécher 5, puis tournez la poignée pour l'incliner.", verifier: ({ faits }) => { const x = b(faits, "b5"); return x.ethanol > 15 && x.phases === 1; } },
      { consigne: "L'éthanol et l'eau…", court: "Répondez dans le carnet.", question: choix(["sont miscibles : on obtient une seule phase", "forment deux couches", "réagissent en donnant un gaz"], "Combien de couches voyez-vous dans le bécher 5 ?", "Exact : l'éthanol se dissout dans l'eau en toutes proportions.") },
      { consigne: "Le saccharose est formé de molécules. L'eau sucrée est donc…", court: "Répondez dans le carnet.", question: choix(["une solution moléculaire : le soluté y est dispersé en molécules", "une solution ionique", "un mélange hétérogène"], "Lisez la fiche au mur.", "Exact.") },
      { consigne: "Le chlorure de sodium NaCl est formé d'ions Na⁺ et Cl⁻. L'eau salée est…", court: "Répondez dans le carnet.", question: choix(["une solution ionique", "une solution moléculaire", "un solvant pur"], "Que contient le cristal de NaCl ?", "Exact : sa concentration ionique sera étudiée en 1re année du bac.") },
    ],
  };

  const p = (faits) => faits.preparation || { fiole: {} };
  const PREPARER = {
    id: "preparer", paillasse: 1, titre: "Préparer une solution par dissolution",
    objectif: "Préparer V = 100,0 mL de solution de glucose de concentration C = 0,100 mol/L.",
    entetes: [],
    conclusion: "La concentration molaire d'une espèce dissoute est C = n / V (mol/L). Pour préparer par dissolution un volume V de solution de concentration C : m = C × V × M ; on pèse m, on l'introduit dans une fiole jaugée (en rinçant la coupelle et l'entonnoir), on dissout dans de l'eau distillée (fiole aux deux tiers), on complète jusqu'au trait de jauge, puis on bouche et on homogénéise.",
    conclusion_courte: "C = n / V ; m = C × V × M.",
    etapes: [
      { consigne: "Quelle masse de glucose (M = 180 g/mol) faut-il pour V = 100,0 mL de solution à C = 0,100 mol/L ?", court: "Masse à peser ?", question: { type: "nombre", unite: "g", attendu: 1.8, tolerance: 0.01, aide: "n = C × V = 0,0100 mol (V en litres), puis m = n × M.", bravo: "Exact : m = 1,80 g." } },
      { consigne: "Pesez 1,80 g de glucose : coupelle sur la balance, tare (T), puis spatule au-dessus de la coupelle.", court: "Pesez 1,80 g.", verifier: ({ faits }) => { const m = p(faits).pesee; return (m >= 1.77 && m <= 1.83) || (m > 1.83 && "Trop de glucose : touchez la coupelle hors de la balance pour la vider, puis recommencez.") || false; } },
      { consigne: "Lâchez la coupelle au-dessus de l'entonnoir : le glucose tombe dans la fiole. Rincez la coupelle inclinée avec la pissette pour entraîner les derniers grains.", court: "Glucose dans la fiole, rincez.", aide_geste: "Pissette : lâchez-la, le bec au-dessus de la coupelle, puis appuyez sur son corps.", verifier: ({ faits }) => { const x = p(faits); if (x.pesee < 1.7) return false; if (x.reste > 0.002) return x.glucose > 1.5 && "Il reste des grains sur la coupelle : rincez-la avec la pissette."; return x.glucose >= 0.98 * x.pesee || "Une partie du glucose est tombée à côté : touchez « Nouvelle fiole » et recommencez."; } },
      { consigne: "Ajoutez de l'eau distillée jusqu'aux deux tiers de la fiole, retirez l'entonnoir, puis agitez la fiole (sans la boucher) jusqu'à la dissolution complète.", court: "Dissolvez (fiole aux 2/3).", aide_geste: "Touchez l'entonnoir pour le ranger ; prenez la fiole et faites-la aller et venir.", verifier: ({ faits }) => { const f = p(faits).fiole; return f.V > 40 && f.solide < 0.001; } },
      { consigne: "Complétez à la pissette jusqu'à 1 cm sous le trait, puis à la pipette Pasteur, goutte à goutte, jusqu'à ce que le bas du ménisque soit sur le trait (loupe).", court: "Ajustez au trait de jauge.", verifier: ({ faits }) => { const x = p(faits), f = x.fiole; if (x.glucose < 1.7) return "La fiole ne contient pas le glucose pesé : touchez « Nouvelle fiole »."; if (f.entonnoir) return f.V > 60 && "Retirez d'abord l'entonnoir."; if (f.ecart > 0.2) return "Le trait est dépassé : la solution est trop diluée. Touchez « Nouvelle fiole » et recommencez."; return Math.abs(f.ecart) <= 0.2; } },
      { consigne: "Bouchez la fiole, puis secouez-la (retournez-la plusieurs fois) pour homogénéiser.", court: "Bouchez, homogénéisez.", aide_geste: "Glissez le bouchon sur le col ; prenez la fiole et secouez-la.", verifier: ({ faits }) => { const f = p(faits).fiole; return f.bouchon && f.homogene && Math.abs(f.ecart) <= 0.2; } },
      { consigne: "Calculez la concentration de votre solution à partir de la masse réellement dissoute.", court: "C = n / V ?", question: { type: "nombre", unite: "mol/L", attendu: (f) => (f.preparation?.glucose || 1.8) / 180 / 0.1, tolerance: 0.002, aide: "C = n / V = m / (M × V), avec V = 0,1000 L.", bravo: "Exact." } },
      { consigne: "Si l'on avait dépassé le trait de jauge, la concentration aurait été…", court: "Répondez dans le carnet.", question: choix(["plus petite que prévu", "plus grande que prévu", "la même"], "Même quantité de glucose, volume plus grand.", "Exact : C = n / V diminue quand V augmente.") },
    ],
  };

  const d = (faits) => faits.dilution || { fiole: {} };
  const DILUER = {
    id: "diluer", paillasse: 2, titre: "Diluer une solution",
    objectif: "Préparer V₁ = 50,0 mL d'eau iodée de concentration C₁ = 1,0 × 10⁻⁴ mol/L à partir de la solution mère (C₀ = 1,0 × 10⁻³ mol/L).",
    entetes: [],
    conclusion: "Diluer, c'est ajouter du solvant : la quantité de soluté ne change pas, donc C₀ × V₀ = C₁ × V₁. Le facteur de dilution est F = C₀ / C₁ = V₁ / V₀. On prélève V₀ de solution mère à la pipette, on l'introduit dans une fiole jaugée de volume V₁, on complète au trait avec de l'eau distillée et on homogénéise.",
    conclusion_courte: "C₀ × V₀ = C₁ × V₁ ; F = C₀ / C₁.",
    etapes: [
      { consigne: "Quel volume V₀ de solution mère faut-il prélever ?", court: "V₀ ?", question: { type: "nombre", unite: "mL", attendu: 5, tolerance: 0.05, aide: "La quantité de diiode se conserve : C₀ × V₀ = C₁ × V₁.", bravo: "Exact : V₀ = 5,0 mL." } },
      { consigne: "Prélevez la solution mère à la pipette graduée, puis faites-en couler 5,0 mL dans la fiole (pointe dans le col).", court: "5,0 mL dans la fiole.", aide_geste: "Pointe dans la solution mère, molette vers le haut jusqu'au trait 0 ; pointe dans le col de la fiole, molette vers le bas jusqu'à la lecture 5,0.", verifier: ({ faits }) => { const v = d(faits).I2 / 0.06; return (v >= 4.9 && v <= 5.1) || (v > 5.1 && `Vous avez versé ${String(Math.round(v * 10) / 10).replace(".", ",")} mL : c'est trop. Touchez « Nouvelle fiole ».`) || false; } },
      { consigne: "Complétez avec de l'eau distillée jusqu'au trait de jauge (pissette, puis pipette Pasteur).", court: "Complétez au trait.", verifier: ({ faits }) => { const f = d(faits).fiole; if (d(faits).I2 < 0.29) return "La fiole doit contenir les 5,0 mL de solution mère : touchez « Nouvelle fiole »."; if (f.ecart > 0.12) return "Le trait est dépassé : touchez « Nouvelle fiole » et recommencez."; return Math.abs(f.ecart) <= 0.12; } },
      { consigne: "Bouchez la fiole et homogénéisez.", court: "Bouchez, homogénéisez.", verifier: ({ faits }) => { const f = d(faits).fiole; return f.bouchon && f.homogene && Math.abs(f.ecart) <= 0.12; } },
      { consigne: "Avec le volume réellement prélevé, calculez la concentration C₁ de la solution fille.", court: "C₁ ?", question: { type: "nombre", unite: "mol/L", attendu: (f) => (1e-3 * ((f.dilution?.I2 || 0.3) / 0.06)) / 50, tolerance_relative: 0.03, aide: "C₁ = C₀ × V₀ / V₁ (écrivez par exemple 1,0E-4).", bravo: "Exact." } },
      { consigne: "Quel est le facteur de dilution F = C₀ / C₁ ?", court: "F ?", question: { type: "nombre", unite: "", attendu: 10, tolerance: 0.3, aide: "F = C₀ / C₁ = V₁ / V₀.", bravo: "Exact : la solution a été diluée dix fois." } },
      { consigne: "La solution fille est moins colorée que la solution mère car…", court: "Répondez dans le carnet.", question: choix(["le diiode des 5 mL prélevés occupe un volume dix fois plus grand", "on a retiré du diiode", "l'eau distillée détruit le diiode"], "La quantité de diiode a-t-elle changé ?", "Exact : même quantité, volume dix fois plus grand.") },
    ],
  };

  L.demarrer({ id: "tc_chim7_a2_solutions", titre: "Laboratoire : solutions", paillasses: [L.poste_dissolution, L.poste_preparation, L.poste_dilution], missions: [DISSOUDRE, PREPARER, DILUER] });
})(window.Labo);
