/*
Rôle : simulation de l'activité 3 du chapitre « Équilibre d'un solide » (tronc commun) : « Vecteurs des trois forces à
       l'équilibre (référentiel terrestre) ». Objectif O3 (première condition d'équilibre : méthode graphique du polygone et
       méthode analytique) ; orientation : système étudié, bilan des forces, conditions d'équilibre.
Reçoit : rien (les vérifications lisent la configuration de la table à forces et le polygone construit).
Produit : la simulation démarrée : table à forces, masses à fente, rapporteur, polygone des forces.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const angle = (cle) => ({ type: "nombre", unite: "°", attendu: (f) => f.config_forces[cle], tolerance: 2, aide: "Centre du rapporteur sur l'anneau, base horizontale ; lisez sur la bonne graduation.", bravo: "Exact." });

  function chargee({ faits }) {
    // Masses différentes sur les fils 1 et 2, l'anneau en équilibre, aucun porte-masses posé sur la paillasse.
    const c = faits.config_forces;
    if (!c || c.masses.every((m) => m === 0.05)) return false;
    if (c.pose >= 0) return `Le porte-masses ${c.pose + 1} touche la paillasse : la force de son fil est trop grande. Retirez-lui une masse.`;
    return c.masses[0] !== c.masses[1] || "Mettez des masses différentes sur les fils 1 et 2.";
  }

  const EQUILIBRE = {
    id: "equilibre", paillasse: 0, titre: "L'anneau en équilibre",
    objectif: "Système étudié : l'anneau (sa masse est négligeable). Bilan : trois forces, les tensions des trois fils. Quelles sont les conditions de son équilibre ?",
    entetes: [],
    conclusion: "À l'équilibre, les trois forces sont dans un même plan, concourantes en O, et la somme de leurs projections sur deux axes est nulle (méthode analytique).",
    conclusion_courte: "Projections : somme nulle sur chaque axe.",
    etapes: [
      { consigne: "Faites glisser des masses à fente sur les porte-masses (50 g chacun, à vide) : des masses différentes sur les fils 1 et 2. Chaque fil tire sur l'anneau avec une force égale au poids de son porte-masses.", court: "Chargez les porte-masses.", verifier: chargee },
      { consigne: "Les trois fils…", court: "Répondez dans le carnet.", question: choix(["sont dans un même plan et passent par O : les forces sont coplanaires et concourantes", "sont parallèles", "ne passent pas par le même point"], "Regardez l'anneau.", "Exact.") },
      { consigne: "Posez le rapporteur sur l'anneau. Mesurez l'angle β1 entre le fil 1 et l'horizontale (en degrés).", court: "Angle β1 (°) ?", question: angle("beta1") },
      { consigne: "Mesurez l'angle β2 entre le fil 2 et l'horizontale (en degrés).", court: "Angle β2 (°) ?", question: angle("beta2") },
      { consigne: "Avec F = m·g pour chaque fil, calculez F1·cos β1 et F2·cos β2 (projections sur l'horizontale). Elles sont…", court: "Répondez dans le carnet.", question: choix(["égales : la somme des projections horizontales est nulle", "très différentes", "nulles"], "g = 9,81 N/kg ; m en kg.", "Exact.") },
      { consigne: "Calculez F1·sin β1 + F2·sin β2 (projections sur la verticale). Le résultat est…", court: "Répondez dans le carnet.", question: choix(["égal à F3 : la somme des projections verticales est nulle", "égal à zéro", "égal à F1 + F2"], "F3 est verticale, vers le bas.", "Exact.") },
    ],
  };

  const POLYGONE = {
    id: "polygone", paillasse: 0, titre: "Le polygone des forces",
    objectif: "Méthode graphique : mettre les trois vecteurs forces bout à bout.",
    entetes: [],
    conclusion: "Première condition d'équilibre : F1 + F2 + F3 = 0 ; le polygone (ici un triangle) des forces est fermé.",
    conclusion_courte: "Équilibre : polygone fermé.",
    etapes: [
      { consigne: "Touchez « Représenter les forces ». Faites glisser F2, puis F3, pour mettre leur origine à l'extrémité du vecteur précédent.", court: "Mettez les vecteurs bout à bout.", verifier: ({ faits }) => !!faits.polygone, aide_geste: "Prenez un vecteur par son origine (le disque coloré)." },
      { consigne: "La ligne polygonale formée par F1, F2 et F3 est…", court: "Répondez dans le carnet.", question: choix(["fermée : F1 + F2 + F3 = 0", "ouverte", "une droite"], "L'extrémité de F3 revient-elle à l'origine de F1 ?", "Exact.") },
      { consigne: "Un solide soumis à trois forces non parallèles est en équilibre si…", court: "Répondez dans le carnet.", question: choix(["les forces sont coplanaires, concourantes et de somme vectorielle nulle", "les trois forces ont la même valeur", "deux des forces sont verticales"], "Rassemblez les deux méthodes.", "Exact.") },
      { consigne: "Un lustre de 2 kg est suspendu par deux câbles qui font chacun 60° avec la verticale. Quelle est la tension de chaque câble (en N) ?", court: "Tension d'un câble (N) ?", question: { type: "nombre", unite: "N", attendu: 19.62, tolerance: 0.3, aide: "2·T·cos 60° = m·g.", bravo: "Exact : T = m·g, ici 19,6 N." } },
    ],
  };

  L.demarrer({ id: "tc_meca5_a3_trois_forces", titre: "Laboratoire : trois forces à l'équilibre", paillasses: [L.poste_trois_forces], missions: [EQUILIBRE, POLYGONE] });
})(window.Labo);
