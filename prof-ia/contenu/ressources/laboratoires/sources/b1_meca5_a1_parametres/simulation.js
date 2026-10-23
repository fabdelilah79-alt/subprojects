/*
Rôle : simulation de l'activité 1 du chapitre « Énergie thermique, transfert thermique » (1re année du bac) : expériences
       simples pour trouver les paramètres dont dépend la quantité de chaleur Q reçue par un liquide (masse, variation de
       température, nature) ; Q = P·t est fournie par un thermoplongeur de 100 W ; Q = m·c·Δθ. Objectifs O1 et O2.
Reçoit : rien (les vérifications lisent le fait « chauffage » et la feuille de calcul).
Produit : la simulation démarrée : gobelet, thermoplongeur, béchers d'eau et d'huile.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const P = 100, es = (f) => (f.chauffage || {}).essais || [];
  const trouve = (f, nom, m, t) => es(f).find((e) => e.nom === nom && e.m === m && Math.abs(e.t - t) <= 2);
  const dth = (e) => e.theta1 - e.theta0;

  function tableau({ faits, feuille }) {
    // Quatre essais : m, Q = P·t, Δθ, Q/(m·Δθ).
    const l = feuille.lignes(["A", "B", "C", "D"]);
    if (l.length < 4) return false;
    for (const [k, r] of l.entries()) {
      const e = es(faits).find((x) => Math.abs(x.m / 1000 - r.A) < 0.001 && Math.abs(P * x.t - r.B) <= 2 * P && Math.abs(dth(x) - r.C) <= 0.15);
      if (!e) return `Ligne ${k + 2} : m (kg), Q = 100 × t (J) et Δθ = θ1 − θ0 d'un de vos essais.`;
      if (Math.abs(r.D - r.B / (r.A * r.C)) > 0.01 * r.D) return `Ligne ${k + 2} : Q / (m·Δθ), par exemple =B${k + 2}/(A${k + 2}*C${k + 2}).`;
    }
    return true;
  }

  const PARAMETRES = {
    id: "parametres", paillasse: 0, titre: "De quoi dépend la chaleur reçue ?",
    objectif: "Chauffer de l'eau et de l'huile avec un thermoplongeur ; relier la chaleur reçue Q = P·t à la masse, à la variation de température et à la nature du liquide.",
    entetes: ["m (kg)", "Q (J)", "Δθ (°C)", "Q/(m·Δθ)"],
    donnees: ["Thermoplongeur : P = 100 W ; Q = P·t", "Gobelet : capacité thermique négligeable", "Béchers : 200 g de liquide à 20,0 °C"],
    conclusion: "La chaleur est un mode de transfert d'énergie. La quantité de chaleur Q reçue par un corps qui ne change pas d'état est proportionnelle à sa masse m et à sa variation de température Δθ, et dépend de sa nature : Q = m·c·Δθ, où c est la chaleur massique (J·kg⁻¹·K⁻¹ ou J·kg⁻¹·°C⁻¹) ; c(eau) ≈ 4,18×10³, c(huile) ≈ 2,0×10³. Q > 0 : le corps reçoit de la chaleur (il s'échauffe) ; Q < 0 : il en cède.",
    conclusion_courte: "Q = m·c·Δθ.",
    etapes: [
      { consigne: "Versez un bécher d'eau (200 g) dans le gobelet, lisez θ0, mettez le thermoplongeur en marche pendant 60 s, arrêtez-le, agitez et lisez θ1.", court: "200 g d'eau, 60 s.", aide_geste: "Glissez le bécher au-dessus du gobelet ; faites monter et descendre l'agitateur.", verifier: ({ faits }) => !!trouve(faits, "eau", 200, 60) },
      { consigne: "Quelle chaleur Q l'eau a-t-elle reçue pendant ces 60 s ?", court: "Q (J) ?", question: { type: "nombre", unite: "J", attendu: 6000, tolerance: 150, aide: "Q = P × t.", bravo: "Exact : 6,0 kJ." } },
      { consigne: "Videz le gobelet. Recommencez avec 400 g d'eau (deux béchers) pendant 60 s, puis avec 200 g pendant 120 s.", court: "400 g / 60 s ; 200 g / 120 s.", verifier: ({ faits }) => !!(trouve(faits, "eau", 400, 60) && trouve(faits, "eau", 200, 120)) },
      { consigne: "Avec la même chaleur reçue, deux fois plus d'eau s'échauffe…", court: "Répondez dans le carnet.", question: choix(["deux fois moins", "deux fois plus", "autant"], "Comparez Δθ pour 200 g et 400 g.", "Exact : Q est proportionnelle à m.") },
      { consigne: "Videz le gobelet et chauffez 200 g d'huile pendant 60 s.", court: "200 g d'huile, 60 s.", verifier: ({ faits }) => !!trouve(faits, "huile", 200, 60) },
      { consigne: "Tableur, une ligne par essai : m (kg) en A, Q (J) en B, Δθ en C, Q/(m·Δθ) en D.", court: "Tableur : m, Q, Δθ, Q/(m·Δθ).", verifier: tableau },
      { consigne: "Pour l'eau, Q/(m·Δθ) est le même pour les trois essais ; pour l'huile, il est différent. Cette grandeur…", court: "Répondez dans le carnet.", question: choix(["caractérise le liquide : c'est sa chaleur massique c", "dépend de la durée de chauffage", "est la puissance du thermoplongeur"], "Comparez la colonne D pour l'eau et pour l'huile.", "Exact : Q = m·c·Δθ.") },
      { consigne: "Quelle est la chaleur massique de l'eau, d'après vos mesures ?", court: "c(eau) (J·kg⁻¹·K⁻¹) ?", question: { type: "nombre", unite: "J·kg⁻¹·K⁻¹", attendu: 4180, tolerance_relative: 0.04, aide: "Moyenne de la colonne D pour l'eau.", bravo: "Exact : environ 4,18×10³ J·kg⁻¹·K⁻¹." } },
      { consigne: "Un corps qui se refroidit…", court: "Répondez dans le carnet.", question: choix(["cède de la chaleur : Q < 0", "reçoit de la chaleur : Q > 0", "n'échange pas de chaleur"], "Δθ est alors négative.", "Exact.") },
    ],
  };

  L.demarrer({ id: "b1_meca5_a1_parametres", titre: "Laboratoire : la chaleur reçue", paillasses: [L.poste_chauffage], missions: [PARAMETRES] });
})(window.Labo);
