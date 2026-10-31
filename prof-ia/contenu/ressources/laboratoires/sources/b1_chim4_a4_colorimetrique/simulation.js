/*
Rôle : simulation de l'activité 4 du chapitre « Titrages » (1re année du bac) : titrage des ions fer II par le permanganate
       de potassium en milieu acide (VE = 9,60 mL ; [Fe²⁺] = 0,0960 mol/L) et titrage du diiode par le thiosulfate de
       sodium avec l'empois d'amidon (VE = 8,50 mL ; [I₂] = 0,0425 mol/L) : réaction support, couples, équivalence repérée par
       un changement de couleur, relation à l'équivalence. Objectifs O3, O4, O5, O6.
Reçoit : rien (les vérifications lisent les faits « fer » et « iode »).
Produit : la simulation démarrée.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const nombre = (unite, attendu, tolerance, aide, bravo) => ({ type: "nombre", unite, attendu, tolerance, aide, bravo });
  const RECOMMENCER = "Touchez « Bécher neuf » et « Remplir la burette », puis recommencez en finissant goutte à goutte.";

  function fin(nom, VE, sans) {
    // Fin repérée à 0,25 mL près du volume équivalent ; sinon, la raison.
    return ({ faits }) => {
      const f = faits[nom] || {};
      if (f.VE_lu === null || f.VE_lu === undefined) return sans(f);
      if (f.VE_lu > VE + 0.25) return `Équivalence dépassée (${String(f.VE_lu.toFixed(2)).replace(".", ",")} mL versés). ${RECOMMENCER}`;
      if (f.VE_lu < VE - 0.25) return `La teinte de fin est apparue trop tôt. ${RECOMMENCER}`;
      return true;
    };
  }

  const FER = {
    id: "fer", paillasse: 0, titre: "Ions fer II et permanganate",
    objectif: "Titrer 10,0 mL d'une solution d'ions fer II par une solution de permanganate de potassium, en milieu acide.",
    entetes: [],
    donnees: ["Burette : [MnO₄⁻] = 0,020 mol/L, remplie et ajustée au zéro", "Bécher : V₁ = 10,0 mL de solution d'ions fer II (pipette jaugée) + 20 mL d'eau", "Couples : MnO₄⁻/Mn²⁺ et Fe³⁺/Fe²⁺ ; l'ion MnO₄⁻ est violet, les ions Mn²⁺ sont incolores", "Lunettes et gants : l'acide sulfurique est corrosif"],
    conclusion: "La réaction support MnO₄⁻ + 5 Fe²⁺ + 8 H⁺ → Mn²⁺ + 5 Fe³⁺ + 4 H₂O est totale et rapide ; elle consomme des ions H⁺ : il faut acidifier. Tant qu'il reste des ions Fe²⁺, le permanganate versé est réduit et la teinte violette disparaît ; la première goutte en excès donne une teinte rose qui persiste : c'est l'équivalence. Alors n(MnO₄⁻) versée = n(Fe²⁺) initiale / 5, d'où [Fe²⁺] = 5 × 0,020 × 9,60 / 10,0 = 0,0960 mol/L.",
    conclusion_courte: "Équivalence : n(Fe²⁺) = 5 n(MnO₄⁻).",
    etapes: [
      { consigne: "Versez environ 10 mL d'acide sulfurique dans le bécher d'ions fer II, posez ce bécher sur l'agitateur et mettez l'agitation en marche.", court: "Acide, agitateur.", aide_geste: "Prenez le bécher d'acide, tenez-le au-dessus du bécher d'ions fer II et inclinez-le avec la poignée ; touchez-le pour le reposer.", verifier: ({ faits }) => { const f = faits.fer || {}; return f.sur === "becher" && f.vitesse > 0 && (f.H >= 10 || "Il faut environ 10 mL d'acide sulfurique (au moins 5 mL)."); } },
      { consigne: "Versez le permanganate : la teinte violette disparaît. Près de la fin, passez au goutte à goutte ; arrêtez à la première teinte rose qui persiste.", court: "Jusqu'au rose persistant.", aide_geste: "Touchez la clé du robinet : goutte à goutte ou fermé ; glissez-la vers le haut pour un filet. Lisez le volume dans la loupe.", verifier: fin("fer", 9.6, (f) => (f.verse > 12 ? `Pas de teinte persistante lue robinet fermé, solution agitée. ${RECOMMENCER}` : false)) },
      { consigne: "Volume équivalent VE (mL) ?", court: "VE (mL) ?", question: nombre("mL", 9.6, 0.15, "Lisez la burette (bas du ménisque) à la première teinte rose persistante.", "Exact.") },
      { consigne: "L'équation de la réaction support est…", court: "Répondez dans le carnet.", question: choix(["MnO₄⁻ + 5 Fe²⁺ + 8 H⁺ → Mn²⁺ + 5 Fe³⁺ + 4 H₂O", "MnO₄⁻ + Fe²⁺ → Mn²⁺ + Fe³⁺", "Fe²⁺ + 2 HO⁻ → Fe(OH)₂"], "Combinez MnO₄⁻ + 8 H⁺ + 5 e⁻ ⇌ Mn²⁺ + 4 H₂O et Fe³⁺ + e⁻ ⇌ Fe²⁺ (autant d'électrons cédés que captés).", "Exact : 5 électrons sont transférés.") },
      { consigne: "Dans cette réaction, l'oxydant est…", court: "Répondez dans le carnet.", question: choix(["l'ion permanganate MnO₄⁻ : il capte des électrons", "l'ion fer II Fe²⁺", "l'ion H⁺"], "Un oxydant capte des électrons.", "Exact : Fe²⁺ est le réducteur, il cède un électron.") },
      { consigne: "On acidifie la solution parce que…", court: "Répondez dans le carnet.", question: choix(["la réaction consomme des ions H⁺", "l'acide colore la solution", "l'acide titre les ions fer"], "Regardez les réactifs de l'équation.", "Exact.") },
      { consigne: "Concentration des ions fer II [Fe²⁺] (mol/L) ?", court: "[Fe²⁺] (mol/L) ?", question: nombre("mol/L", 0.096, 0.002, "À l'équivalence, n(Fe²⁺) = 5 × [MnO₄⁻] × VE ; puis divisez par V₁.", "Exact : 9,60 × 10⁻² mol/L (trois chiffres significatifs).") },
      { consigne: "On n'ajoute pas d'indicateur coloré parce que…", court: "Répondez dans le carnet.", question: choix(["l'ion permanganate, violet, est la seule espèce colorée : il signale lui-même l'équivalence", "les ions fer II sont roses", "l'agitateur montre la fin"], "Quelle espèce colorée apparaît après l'équivalence ?", "Exact.") },
    ],
  };

  const IODE = {
    id: "iode", paillasse: 1, titre: "Diiode et thiosulfate",
    objectif: "Titrer 10,0 mL d'une solution de diiode par une solution de thiosulfate de sodium, avec l'empois d'amidon.",
    entetes: [],
    donnees: ["Burette : [S₂O₃²⁻] = 0,100 mol/L, remplie et ajustée au zéro", "Bécher : V = 10,0 mL de solution de diiode + 20 mL d'eau", "Couples : I₂/I⁻ et S₄O₆²⁻/S₂O₃²⁻ ; seul le diiode est coloré (brun-jaune)", "L'empois d'amidon donne avec le diiode une teinte bleu-noir intense"],
    conclusion: "La réaction support I₂ + 2 S₂O₃²⁻ → 2 I⁻ + S₄O₆²⁻ est totale. La teinte du diiode pâlit ; quand elle est jaune pâle, quelques gouttes d'empois d'amidon donnent une teinte bleu-noir, beaucoup plus visible : sa disparition marque l'équivalence. Alors n(I₂) initiale = n(S₂O₃²⁻) versée / 2, d'où [I₂] = 0,100 × 8,50 / (2 × 10,0) = 0,0425 mol/L.",
    conclusion_courte: "Équivalence : n(I₂) = n(S₂O₃²⁻) / 2.",
    etapes: [
      { consigne: "Posez le bécher de diiode sur l'agitateur et mettez l'agitation en marche.", court: "Agitateur.", verifier: ({ faits }) => (faits.iode || {}).sur === "becher" && (faits.iode || {}).vitesse > 0 },
      { consigne: "Versez le thiosulfate jusqu'à une teinte jaune pâle ; ajoutez quelques gouttes d'empois d'amidon (bleu-noir) ; continuez goutte à goutte jusqu'à la décoloration.", court: "Jusqu'à la décoloration.", aide_geste: "Sortez la pipette du flacon d'empois, tenez-la au-dessus du bécher et appuyez sur la poire.", verifier: fin("iode", 8.5, (f) => (f.verse > 10 && !f.amidon ? "Ajoutez l'empois d'amidon : la fin de la décoloration du diiode se voit mal." : f.verse > 11 ? RECOMMENCER : false)) },
      { consigne: "Volume équivalent VE (mL) ?", court: "VE (mL) ?", question: nombre("mL", 8.5, 0.15, "Lisez la burette quand la teinte bleu-noir vient de disparaître.", "Exact.") },
      { consigne: "L'équation de la réaction support est…", court: "Répondez dans le carnet.", question: choix(["I₂ + 2 S₂O₃²⁻ → 2 I⁻ + S₄O₆²⁻", "I₂ + S₂O₃²⁻ → I⁻ + S₂O₃⁻", "2 I⁻ + S₄O₆²⁻ → I₂ + 2 S₂O₃²⁻"], "I₂ + 2 e⁻ ⇌ 2 I⁻ et S₄O₆²⁻ + 2 e⁻ ⇌ 2 S₂O₃²⁻ ; le thiosulfate est le réducteur.", "Exact.") },
      { consigne: "L'empois d'amidon sert à…", court: "Répondez dans le carnet.", question: choix(["rendre visibles les dernières traces de diiode (teinte bleu-noir)", "réagir avec le thiosulfate", "acidifier la solution"], "Comparez la teinte jaune pâle et la teinte bleu-noir.", "Exact : c'est un indicateur de fin de réaction.") },
      { consigne: "Concentration du diiode [I₂] (mol/L) ?", court: "[I₂] (mol/L) ?", question: nombre("mol/L", 0.0425, 0.001, "n(I₂) = [S₂O₃²⁻] × VE / 2 ; puis divisez par V.", "Exact : 4,25 × 10⁻² mol/L.") },
    ],
  };

  L.demarrer({ id: "b1_chim4_a4_colorimetrique", titre: "Laboratoire : titrages colorimétriques", paillasses: [L.poste_fer, L.poste_iode], missions: [FER, IODE] });
})(window.Labo);
