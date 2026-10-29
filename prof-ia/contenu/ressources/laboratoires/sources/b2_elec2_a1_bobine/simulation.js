/*
Rôle : simulation de l'activité 1 du chapitre « Dipôle RL » (2e année du bac) : la bobine en courant continu (ohmmètre :
       résistance r ; en régime permanent, elle se comporte comme un conducteur ohmique) puis en courant variable (deux
       lampes identiques, l'une en série avec la bobine, l'autre avec R = r : la bobine retarde l'allumage et l'extinction).
       Convention récepteur, u = r·i + L·di/dt. Objectifs O1, O4.
Reçoit : rien (les vérifications lisent les faits « ohmmetre_bobine », « montage_lampes », « allumages », « extinctions »).
Produit : la simulation démarrée.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const nombre = (unite, attendu, tolerance, aide, bravo) => ({ type: "nombre", unite, attendu, tolerance, aide, bravo });
  const A = (f, noyau) => (f.allumages || []).filter((a) => a.noyau === noyau), X = (f) => f.extinctions || [];

  const CONTINU = {
    id: "continu", paillasse: 0, titre: "La bobine en courant continu",
    objectif: "Mesurer la résistance de la bobine ; comprendre son comportement en régime permanent.",
    entetes: [],
    donnees: ["Bobine de 1 000 spires, fil de cuivre enroulé", "Convention récepteur : u et i fléchés en sens opposés", "u = r·i + L·di/dt"],
    conclusion: "Une bobine est un fil enroulé : elle a une résistance r (ici 10 Ω) et une inductance L. En convention récepteur, u = r·i + L·di/dt. En courant continu (régime permanent), di/dt = 0 : u = r·i, la bobine se comporte comme un conducteur ohmique de résistance r.",
    conclusion_courte: "En continu, la bobine se comporte comme sa résistance r.",
    etapes: [
      { consigne: "Multimètre en ohmmètre (200 Ω) : branchez VΩ et COM aux deux bornes de la bobine, seule (aucun autre fil sur elle).", court: "Mesurez la résistance de la bobine.", verifier: ({ faits }) => (faits.ohmmetre_bobine > 0 && faits.ohmmetre_bobine < 50) || false },
      { consigne: "Résistance r de la bobine (Ω) ?", court: "r (Ω) ?", question: nombre("Ω", (f) => f.ohmmetre_bobine || 10, 0.3, "Lisez l'afficheur du multimètre.", "Exact : r ≈ 10 Ω.") },
      { consigne: "En convention récepteur, la tension aux bornes de la bobine s'écrit…", court: "Répondez dans le carnet.", question: choix(["u = r·i + L·di/dt", "u = L·i", "u = r·i − L·di/dt"], "Le terme résistif plus le terme lié à la variation de i.", "Exact.") },
      { consigne: "En courant continu (régime permanent), la bobine se comporte comme…", court: "Répondez dans le carnet.", question: choix(["un conducteur ohmique de résistance r, car di/dt = 0", "un interrupteur ouvert", "un fil sans résistance, toujours"], "Que vaut di/dt si i est constante ?", "Exact : u = r·i.") },
    ],
  };

  const VARIABLE = {
    id: "variable", paillasse: 0, titre: "La bobine en courant variable",
    objectif: "Comparer l'allumage et l'extinction de deux lampes, l'une en série avec la bobine, l'autre avec R = r.",
    entetes: [],
    donnees: ["Lampes identiques 6 V – 0,1 A", "R = 10 Ω = r : en régime permanent, les deux branches sont identiques", "Touchez la bobine pour enfoncer ou retirer le noyau de fer doux"],
    conclusion: "À la fermeture, L₂ (avec R) s'allume aussitôt, L₁ (avec la bobine) en retard : la bobine retarde l'établissement du courant. À l'ouverture, L₁ ne s'éteint pas aussitôt : la bobine retarde la rupture du courant. L'intensité qui traverse une bobine est une fonction continue du temps. Le retard est plus grand quand l'inductance L est grande (noyau de fer doux).",
    conclusion_courte: "La bobine retarde l'établissement et la rupture du courant.",
    etapes: [
      { consigne: "Câblez : G+ vers K ; après K, deux branches en dérivation vers G− : L₁ puis la bobine ; L₂ puis R.", court: "Câblez les deux branches.", verifier: ({ faits }) => faits.montage_lampes || false },
      { consigne: "Noyau enfoncé : fermez K et observez les deux lampes.", court: "Fermez K (avec noyau).", verifier: ({ faits }) => A(faits, true).some((a) => a.retard1 > a.retard2 + 3) || false },
      { consigne: "À la fermeture de K…", court: "Répondez dans le carnet.", question: choix(["L₂ s'allume aussitôt, L₁ en retard : la bobine retarde l'établissement du courant", "les deux lampes s'allument en même temps", "L₁ s'allume avant L₂"], "Regardez L₁, en série avec la bobine.", "Exact.") },
      { consigne: "En régime permanent, les deux lampes brillent de la même façon. Pourquoi ?", court: "Répondez dans le carnet.", question: choix(["di/dt = 0 : la bobine agit comme r = R, les branches sont identiques", "la bobine ne laisse plus passer le courant", "L₁ est plus puissante"], "u = r·i + L·di/dt.", "Exact.") },
      { consigne: "Ouvrez K, retirez le noyau (touchez la bobine), puis fermez K à nouveau.", court: "Fermez K (sans noyau).", verifier: ({ faits }) => A(faits, false).length > 0 || false },
      { consigne: "Sans le noyau (L dix fois plus petite), le retard de L₁…", court: "Répondez dans le carnet.", question: choix(["est plus court : le retard augmente avec L", "est plus long", "ne change pas"], "Comparez les deux fermetures.", "Exact.") },
      { consigne: "Remettez le noyau, attendez le régime permanent, puis ouvrez K en regardant L₁.", court: "Ouvrez K (avec noyau).", verifier: ({ faits }) => X(faits).some((x) => x.noyau && x.duree > 2) || false },
      { consigne: "À l'ouverture de K, L₁…", court: "Répondez dans le carnet.", question: choix(["s'éteint progressivement : la bobine retarde la rupture du courant", "s'éteint aussitôt", "reste allumée"], "Le courant de la bobine passe encore par L₁, L₂ et R.", "Exact : i est continue.") },
    ],
  };

  L.demarrer({ id: "b2_elec2_a1_bobine", titre: "Laboratoire : la bobine", decor: "aucun", paillasses: [L.poste_bobine], missions: [CONTINU, VARIABLE] });
})(window.Labo);
