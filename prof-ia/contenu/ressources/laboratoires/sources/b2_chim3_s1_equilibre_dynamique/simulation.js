/*
Rôle : simulation de la partie propre aux filières PC, SMA et SMB du chapitre « Transformations chimiques qui se produisent
       dans les deux sens » (2e année du bac) : interprétation microscopique de l'état d'équilibre, avec un logiciel de
       simulation de A + B ⇌ C + D ; chocs efficaces entre réactifs (sens direct) et entre produits (sens inverse) ; même
       état final à partir des réactifs ou des produits ; équilibre dynamique. Objectifs O3, O4 (avancement final, τ).
Reçoit : rien (les vérifications lisent « essais_equilibre »).
Produit : la simulation démarrée.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const essai = (depart) => (f) => (f.essais_equilibre || []).filter((e) => e.depart === depart).slice(-1)[0];
  const fait = (depart, message) => ({ faits }) => !!essai(depart)(faits) || message;

  const EQUILIBRE = {
    id: "equilibre", paillasse: 0, titre: "L'équilibre dynamique",
    conclusion: "Partie des réactifs (30 A et 30 B), la simulation s'arrête d'évoluer avec environ 19 particules C : il reste des réactifs, la transformation n'est pas totale (τ ≈ 0,6). Pourtant, les chocs efficaces continuent dans les deux sens : A + B → C + D et C + D → A + B se produisent autant de fois par seconde ; les nombres de particules ne changent plus en moyenne. C'est un équilibre dynamique. Partie des produits (30 C et 30 D), la simulation atteint le même état : la réaction a lieu dans les deux sens.",
    objectif: "Interpréter l'état d'équilibre par les chocs efficaces dans les deux sens.",
    entetes: [], donnees: ["A + B → C + D : choc A–B assez énergique", "C + D → A + B : choc C–D assez énergique", "Essai : 60 s à 300 K"],
    conclusion_courte: "Équilibre : deux sens, même vitesse.",
    etapes: [
      { consigne: "Touchez « 30 A + 30 B » et observez l'essai jusqu'au bout (60 s).", court: "Essai depuis 30 A + 30 B.", verifier: fait("AB", false) },
      { consigne: "À la fin de l'essai…", court: "Répondez dans le carnet.", question: choix(["il reste des particules A et B : la transformation n'est pas totale", "toutes les particules A et B ont disparu", "il n'y a aucune particule C"], "Lisez les compteurs de particules.", "Exact.") },
      { consigne: "Taux d'avancement final τ = (nombre moyen de C à la fin) / 30 ?", court: "τ ?", question: { type: "nombre", unite: "", attendu: (f) => (essai("AB")(f) || { C_fin: 19 }).C_fin / 30, tolerance: 0.07, aide: "Lisez la courbe sur les 30 dernières secondes : x_max correspondrait à 30 C.", bravo: "Exact : τ ≈ 0,6." } },
      { consigne: "Quand le nombre de C ne change plus, les chocs efficaces…", court: "Répondez dans le carnet.", question: choix(["continuent dans les deux sens, autant par seconde dans chaque sens", "s'arrêtent : plus rien ne se passe", "ne se produisent plus que dans le sens direct"], "Comparez les deux compteurs de chocs efficaces.", "Exact : c'est un équilibre dynamique.") },
      { consigne: "Touchez « 30 C + 30 D » et observez l'essai jusqu'au bout.", court: "Essai depuis 30 C + 30 D.", verifier: fait("CD", false) },
      { consigne: "Partie des produits, la simulation…", court: "Répondez dans le carnet.", question: choix(["atteint le même état final : la réaction se produit aussi dans le sens inverse", "garde ses 30 C et 30 D", "forme uniquement des particules A et B"], "Comparez les deux courbes.", "Exact.") },
      { consigne: "Les chocs C–D efficaces sont plus rares que les chocs A–B efficaces au départ, car…", court: "Répondez dans le carnet.", question: choix(["ils demandent une énergie plus grande (énergie seuil plus élevée)", "les particules C et D sont immobiles", "les particules C et D ne se rencontrent jamais"], "Comparez les énergies seuils des deux réactions.", "Exact : à l'équilibre, il y a donc plus de C et D que de A et B.") },
    ],
  };

  L.demarrer({ id: "b2_chim3_s1_equilibre_dynamique", titre: "Laboratoire : l'équilibre dynamique", paillasses: [L.poste_equilibre], missions: [EQUILIBRE] });
})(window.Labo);
