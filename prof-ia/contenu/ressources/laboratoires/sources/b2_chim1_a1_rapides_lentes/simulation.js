/*
Rôle : simulation de l'activité 1 du chapitre « Transformations rapides et transformations lentes » (2e année du bac) :
       observer des transformations rapides (Fe²⁺ + MnO₄⁻ ; I₂ + S₂O₃²⁻) et lentes (H₂O₂ + I⁻ ; S₂O₃²⁻ + H⁺), écrire l'équation
       d'oxydoréduction et identifier les couples ; facteurs cinétiques : température (bain-marie à 70 °C, liqueur de
       Fehling) et concentration (disparition d'une croix derrière des tubes de thiosulfate). Objectifs O1, O2, O3.
Reçoit : rien (les vérifications lisent « tubes_rapides », « tubes_temperature », « tubes_croix » et la feuille).
Produit : la simulation démarrée.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const F = (f, cle) => f[cle] || {}, TR = (f) => F(f, "tubes_rapides"), TT = (f) => F(f, "tubes_temperature"), TC = (f) => F(f, "tubes_croix");
  const tous = (f) => ["t1", "t2", "t3"].every((k) => (TC(f)[k] || {}).t_croix > 0);

  function tableau({ faits, feuille }) {
    // A : concentration initiale du thiosulfate (mol/L) ; B : durée de disparition de la croix (à 25 % près, temps de réaction).
    const v = (c, n) => feuille.valeur_sure(`${c}${n}`), vus = new Set();
    for (let n = 2; n <= 12; n++) {
      if (v("A", n) === null) continue;
      const t = Object.values(TC(faits)).find((x) => Math.abs(x.c0 - v("A", n)) < 1e-6);
      if (!t) return `Ligne ${n} : en A, la concentration écrite sur un tube (0,10 ; 0,05 ou 0,025 mol/L).`;
      if (!(t.t_croix > 0)) return `Ligne ${n} : la croix de ce tube n'a pas encore disparu.`;
      if (!(v("B", n) > 0) || Math.abs(v("B", n) - t.t_croix) > 0.25 * t.t_croix + 2) return `Ligne ${n} : en B, la durée (s) entre l'ajout de l'acide et la disparition de la croix.`;
      vus.add(t.c0);
    }
    return vus.size >= 3 || false;
  }

  const RAPIDES = {
    id: "rapides", paillasse: 0, titre: "Transformations rapides et lentes",
    conclusion: "Les ions permanganate sont décolorés dès qu'ils tombent dans la solution d'ions fer II, et le diiode dès qu'on ajoute le thiosulfate : ces transformations sont rapides (elles semblent achevées dès le mélange). L'eau oxygénée oxyde les ions iodure en quelques minutes (H₂O₂ + 2 I⁻ + 2 H⁺ → I₂ + 2 H₂O : la solution jaunit puis brunit) et l'acide transforme le thiosulfate en soufre en une demi-minute : ces transformations sont lentes, on suit leur évolution à l'œil.",
    objectif: "Mélanger les réactifs de quatre tubes et classer les transformations.",
    entetes: [], donnees: ["Couples : MnO₄⁻/Mn²⁺ ; Fe³⁺/Fe²⁺ ; I₂/I⁻ ; S₄O₆²⁻/S₂O₃²⁻ ; H₂O₂/H₂O", "Diiode : jaune puis brun en solution", "Soufre : solide jaune très fin"],
    conclusion_courte: "Rapide : achevée au mélange ; lente : on la voit évoluer.",
    etapes: [
      { consigne: "Versez quelques gouttes de permanganate dans le tube 1, puis du thiosulfate dans le tube 2 jusqu'à ce qu'il soit incolore.", court: "Tubes 1 et 2.", aide_geste: "Sortez la pipette du flacon, lâchez-la au-dessus du tube, appuyez sur la poire ; remettez-la dans son flacon.", verifier: ({ faits }) => ((TR(faits).t1 || {}).permanganate >= 0.1 && (TR(faits).t2 || {}).thiosulfate > 0 && (TR(faits).t2 || {}).I2 < 0.05) || false },
      { consigne: "Versez 10 gouttes d'eau oxygénée dans le tube 3 et 20 gouttes d'acide chlorhydrique dans le tube 4 ; observez pendant deux minutes.", court: "Tubes 3 et 4 ; observez.", verifier: ({ faits }) => ((TR(faits).t3 || {}).I2 >= 2 && (TR(faits).t4 || {}).S >= 1.7) || false },
      { consigne: "Les transformations des tubes 1 et 2 sont…", court: "Répondez dans le carnet.", question: choix(["rapides : elles semblent achevées dès que les réactifs sont mélangés", "lentes : on les voit évoluer pendant des minutes", "impossibles"], "Chaque goutte est décolorée aussitôt.", "Exact.") },
      { consigne: "Les transformations des tubes 3 et 4 sont…", court: "Répondez dans le carnet.", question: choix(["lentes : leur évolution se voit à l'œil pendant des secondes ou des minutes", "rapides", "totales et instantanées"], "La couleur et le trouble apparaissent peu à peu.", "Exact.") },
      { consigne: "Équation de la transformation du tube 3 :", court: "Répondez dans le carnet.", question: choix(["H₂O₂ + 2 I⁻ + 2 H⁺ → I₂ + 2 H₂O", "H₂O₂ + I⁻ → I₂ + H₂O", "I₂ + 2 H₂O → H₂O₂ + 2 I⁻"], "Demi-équations : H₂O₂ + 2 H⁺ + 2 e⁻ = 2 H₂O ; 2 I⁻ = I₂ + 2 e⁻.", "Exact.") },
      { consigne: "Dans cette transformation…", court: "Répondez dans le carnet.", question: choix(["l'oxydant H₂O₂ (couple H₂O₂/H₂O) capte des électrons ; le réducteur I⁻ (couple I₂/I⁻) en cède", "l'oxydant est I⁻ ; le réducteur est H₂O₂", "il n'y a pas de transfert d'électrons"], "Un oxydant capte des électrons.", "Exact.") },
    ],
  };

  const TEMPERATURE = {
    id: "temperature", paillasse: 1, titre: "La température, facteur cinétique",
    conclusion: "À 70 °C, l'eau oxygénée oxyde les ions iodure beaucoup plus vite qu'à 20 °C : la solution brunit en quelques secondes. À 20 °C, la liqueur de Fehling ne réagit pas visiblement avec le glucose ; à 70 °C, le précipité rouge brique apparaît en une minute. Plus la température est élevée, plus une transformation est rapide : la température est un facteur cinétique.",
    objectif: "Comparer la même transformation à 20 °C et à 70 °C.",
    entetes: [], donnees: ["Bain-marie : 70 °C", "Tubes 1 et 2 : même contenu (iodure acidifié)", "Liqueur de Fehling + glucose → précipité rouge brique"],
    conclusion_courte: "Température plus élevée : transformation plus rapide.",
    etapes: [
      { consigne: "Placez le tube 2 dans le bain-marie et attendez qu'il soit chaud (laissez le tube 1 dans le porte-tubes).", court: "Tube 2 au bain-marie.", aide_geste: "Faites glisser le tube jusqu'à une place du bain-marie.", verifier: ({ faits }) => ((TT(faits).t2 || {}).bain && (TT(faits).t2 || {}).T >= 60 && !(TT(faits).t1 || {}).bain) || false },
      { consigne: "Versez 10 gouttes d'eau oxygénée dans le tube 1, puis 10 gouttes dans le tube 2 ; comparez leurs couleurs.", court: "Eau oxygénée dans 1 et 2.", verifier: ({ faits }) => { const a = TT(faits).t1 || {}, b = TT(faits).t2 || {}; return (a.peroxyde >= 0.4 && b.peroxyde >= 0.4 && b.I2 >= 8 && b.I2 > 3 * a.I2) || false; } },
      { consigne: "La transformation est la plus rapide…", court: "Répondez dans le carnet.", question: choix(["dans le tube chaud : la température est un facteur cinétique", "dans le tube froid", "de la même façon dans les deux tubes"], "Le tube 2 brunit bien plus vite.", "Exact.") },
      { consigne: "Versez 20 gouttes de liqueur de Fehling dans le tube 3 (glucose), laissé dans le porte-tubes, et observez.", court: "Fehling dans le tube 3.", verifier: ({ faits }) => ((TT(faits).t3 || {}).fehling >= 0.8 && !(TT(faits).t3 || {}).bain) || false },
      { consigne: "Placez maintenant le tube 3 dans le bain-marie et observez.", court: "Tube 3 au bain-marie.", verifier: ({ faits }) => ((TT(faits).t3 || {}).avance >= 0.5) || false },
      { consigne: "À 20 °C, rien ne se voit ; à 70 °C, le précipité rouge brique apparaît :", court: "Répondez dans le carnet.", question: choix(["à 20 °C, la transformation est si lente qu'on ne la voit pas ; la chaleur l'accélère", "le glucose n'existe qu'à chaud", "la liqueur de Fehling ne réagit jamais à 20 °C, même en des années"], "Une transformation très lente semble ne pas avoir lieu.", "Exact.") },
    ],
  };

  const CONCENTRATION = {
    id: "concentration", paillasse: 2, titre: "La concentration, facteur cinétique",
    conclusion: "L'acide transforme le thiosulfate en soufre (S₂O₃²⁻ + 2 H⁺ → S + SO₂ + H₂O) ; le soufre, très fin, trouble la solution et cache la croix. La croix disparaît d'autant plus tôt que la solution de thiosulfate est concentrée (environ 35 s, 70 s et 140 s pour 0,10, 0,050 et 0,025 mol/L) : la concentration des réactifs est un facteur cinétique.",
    objectif: "Mesurer la durée de disparition de la croix pour trois concentrations.",
    entetes: ["c (mol/L)", "t (s)"], donnees: ["Même volume d'acide dans chaque tube : 20 gouttes (1 mL)", "Chronomètre : départ à la première goutte d'acide", "t : la croix n'est plus visible"],
    conclusion_courte: "Plus concentré : transformation plus rapide.",
    etapes: [
      { consigne: "Mettez le chronomètre à zéro. Versez 20 gouttes d'acide chlorhydrique dans le tube 1 en déclenchant le chronomètre ; arrêtez-le quand la croix n'est plus visible.", court: "Tube 1 : acide, chronomètre.", verifier: ({ faits }) => ((TC(faits).t1 || {}).t_croix > 0) || false },
      { consigne: "Recommencez avec le tube 2, puis le tube 3.", court: "Tubes 2 et 3.", verifier: ({ faits }) => tous(faits) || false },
      { consigne: "Tableur : concentration c en A, durée t en B (une ligne par tube).", court: "Tableur : c, t.", verifier: tableau },
      { consigne: "Plus la solution de thiosulfate est concentrée…", court: "Répondez dans le carnet.", question: choix(["plus la croix disparaît tôt : la concentration des réactifs est un facteur cinétique", "plus la croix disparaît tard", "la durée ne dépend pas de la concentration"], "Comparez les durées du tableur.", "Exact.") },
      { consigne: "La croix disparaît, car…", court: "Répondez dans le carnet.", question: choix(["du soufre solide très fin se forme peu à peu et trouble la solution", "l'acide dissout l'encre de la croix", "le tube se couvre de buée"], "S₂O₃²⁻ + 2 H⁺ → S + SO₂ + H₂O.", "Exact.") },
    ],
  };

  L.demarrer({ id: "b2_chim1_a1_rapides_lentes", titre: "Laboratoire : transformations rapides et lentes", paillasses: [L.poste_rapides, L.poste_temperature, L.poste_concentration], missions: [RAPIDES, TEMPERATURE, CONCENTRATION] });
})(window.Labo);
