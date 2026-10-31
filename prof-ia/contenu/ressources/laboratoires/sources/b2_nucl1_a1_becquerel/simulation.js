/*
Rôle : simulation de l'activité 1 du chapitre « Décroissance radioactive » (2e année du bac) : découverte de la
       radioactivité (expérience de Becquerel, documents) ; diagramme (N, Z) : composition des noyaux, isotopes, domaines
       de stabilité ; noyau radioactif, radioactivités α, β−, β+, émission γ, équations et lois de conservation.
       Objectifs O1, O2, O3.
Reçoit : rien (les vérifications lisent les faits « becquerel » et « cartes_nz »).
Produit : la simulation démarrée.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const nombre = (unite, attendu, tolerance, aide, bravo) => ({ type: "nombre", unite, attendu, tolerance, aide, bravo });
  const essai = (f, sel, lieu) => ((f.becquerel || {}).essais || []).some((e) => e.sel === sel && (!lieu || e.lieu === lieu) && e.jours >= 3 && (lieu !== "fenetre" || e.croix));
  const PLACES = { H3: [1, 2, "³₁H"], He4: [2, 2, "⁴₂He"], C11: [6, 5, "¹¹₆C"], C12: [6, 6, "¹²₆C"], C14: [6, 8, "¹⁴₆C"], O16: [8, 8, "¹⁶₈O"] };

  function cartes({ faits }) {
    // Les six cartes dans leur case : ligne Z, colonne N = A − Z.
    const c = faits.cartes_nz || {};
    for (const [id, [z, n, t]] of Object.entries(PLACES)) if (c[id] && c[id] !== `${z},${n}`) return `La carte ${t} : ligne Z = ${z} (protons), colonne N = A − Z = ${n} (neutrons).`;
    return Object.entries(PLACES).every(([id, [z, n]]) => c[id] === `${z},${n}`) || false;
  }

  const BECQUEREL = {
    id: "becquerel", paillasse: 0, titre: "L'expérience de Becquerel",
    objectif: "Refaire l'expérience de Becquerel (1896) : un sel d'uranium noircit-il une plaque photographique protégée de la lumière ?",
    entetes: [],
    donnees: ["La plaque est enveloppée de papier noir : la lumière ne l'atteint pas", "Une plaque photographique noircit là où elle reçoit un rayonnement"],
    conclusion: "Le sel d'uranium noircit la plaque à travers le papier noir, au soleil comme dans le tiroir : il émet spontanément un rayonnement, sans avoir besoin de lumière. La croix de cuivre arrête une partie du rayonnement : elle apparaît en clair. L'uranium métal agit aussi, le sulfate de sodium non : le rayonnement est une propriété de l'élément uranium (de ses noyaux), quel que soit le composé. C'est la radioactivité.",
    conclusion_courte: "L'uranium émet spontanément un rayonnement : radioactivité.",
    etapes: [
      { consigne: "Posez la croix sur la plaque, versez le sel d'uranium, portez le plateau sur le rebord de la fenêtre (au soleil), laissez passer 3 jours, puis développez.", court: "Essai au soleil (sel d'uranium).", aide_geste: "Glissez la croix puis le pot sur la plaque ; glissez le plateau jusqu'à la fenêtre ; touchez « 3 jours plus tard » puis « Développer ».", verifier: ({ faits }) => essai(faits, "uranium", "fenetre") || false },
      { consigne: "La plaque est noircie, sauf sous la croix. Pourquoi ?", court: "Répondez dans le carnet.", question: choix(["le sel émet un rayonnement qui traverse le papier noir mais est arrêté en partie par le cuivre", "la lumière du Soleil a traversé le papier noir", "le sel a coloré le papier"], "Que fait la croix de cuivre ?", "Exact.") },
      { consigne: "Nouvelle plaque : même essai, mais rangez le plateau dans le tiroir (à l'obscurité) pendant 3 jours.", court: "Essai à l'obscurité.", aide_geste: "Glissez le plateau sur la commode.", verifier: ({ faits }) => essai(faits, "uranium", "tiroir") || false },
      { consigne: "La plaque rangée dans le tiroir est aussi noircie. Le rayonnement de l'uranium…", court: "Répondez dans le carnet.", question: choix(["est émis spontanément, sans avoir besoin de lumière", "vient du Soleil", "n'existe qu'au soleil"], "Le tiroir était fermé.", "Exact : c'est ce qu'a compris Becquerel.") },
      { consigne: "Faites deux autres essais (3 jours, à l'obscurité ou au soleil) : avec l'uranium métal, puis avec le sulfate de sodium.", court: "Essais : uranium métal, sulfate de sodium.", verifier: ({ faits }) => (essai(faits, "metal") && essai(faits, "sodium")) || false },
      { consigne: "Le rayonnement vient donc…", court: "Répondez dans le carnet.", question: choix(["de l'élément uranium (de ses noyaux), quel que soit le composé", "de tous les sels", "du papier noir"], "Comparez les trois plaques ; lisez le document « Les Curie ».", "Exact : c'est la radioactivité.") },
    ],
  };

  const CARTES = {
    id: "cartes", paillasse: 1, titre: "Le diagramme (N, Z)",
    objectif: "Placer des noyaux dans le diagramme (N, Z) ; repérer les isotopes et les domaines de stabilité.",
    entetes: [],
    donnees: ["Noyau ᴬ_Z X : Z protons, N = A − Z neutrons, A nucléons", "Isotopes : même Z, N différents"],
    conclusion: "Le noyau ᴬ_Z X contient Z protons et N = A − Z neutrons. Dans le diagramme (N, Z), les isotopes d'un élément (même Z, N différents) sont sur une même ligne. Les noyaux stables forment la vallée de stabilité : près de la droite N = Z pour les noyaux légers, puis avec plus de neutrons que de protons (N > Z). Les noyaux qui ont trop de neutrons (sous la vallée) sont radioactifs β−, ceux qui ont trop de protons (au-dessus) sont radioactifs β+ ; au-delà du plomb, tous sont radioactifs, souvent α.",
    conclusion_courte: "Vallée de stabilité ; β− sous la vallée, β+ au-dessus, α pour Z > 83.",
    etapes: [
      { consigne: "Placez les six cartes dans leur case du tableau de gauche.", court: "Six cartes placées.", aide_geste: "Glissez chaque carte : ligne Z (protons), colonne N = A − Z (neutrons).", verifier: cartes },
      { consigne: "Combien de neutrons dans le noyau ¹⁴₆C ?", court: "N (carbone 14) ?", question: nombre("", 8, 0, "N = A − Z.", "Exact : 6 protons et 8 neutrons.") },
      { consigne: "¹²C, ¹³C et ¹⁴C sont des isotopes. Dans le diagramme, ils sont…", court: "Répondez dans le carnet.", question: choix(["sur une même ligne : même Z (même élément), N différents", "dans une même colonne", "sur la droite N = Z"], "Regardez la ligne Z = 6.", "Exact : ce sont trois nucléides du même élément.") },
      { consigne: "La case du carbone 14 est bleue. Le carbone 14 est…", court: "Répondez dans le carnet.", question: choix(["radioactif β− : il a trop de neutrons pour être stable", "stable", "radioactif α"], "Lisez la légende.", "Exact.") },
      { consigne: "Sur l'affiche de droite, les noyaux lourds stables (comme ²⁰⁸Pb)…", court: "Répondez dans le carnet.", question: choix(["ont plus de neutrons que de protons : la vallée passe sous la droite N = Z", "sont sur la droite N = Z", "ont plus de protons que de neutrons"], "Comparez N et Z pour ²⁰⁸Pb.", "Exact : N = 126, Z = 82.") },
      { consigne: "Les noyaux situés sous la vallée de stabilité (trop de neutrons) sont…", court: "Répondez dans le carnet.", question: choix(["radioactifs β−", "radioactifs β+", "stables"], "Couleur des points sous la vallée.", "Exact ; au-dessus (trop de protons) : β+.") },
      { consigne: "Au-delà du plomb (Z > 83), les noyaux…", court: "Répondez dans le carnet.", question: choix(["sont tous radioactifs, le plus souvent α", "sont tous stables", "n'existent pas"], "Regardez le haut de l'affiche.", "Exact : ²²⁶Ra et ²³⁸U sont radioactifs α.") },
    ],
  };

  const DESINTEGRATIONS = {
    id: "desintegrations", paillasse: 1, titre: "Désintégrations et équations",
    objectif: "Définir un noyau radioactif et les radioactivités α, β−, β+ et γ ; écrire des équations de désintégration.",
    entetes: [],
    donnees: ["Particule α : ⁴₂He ; électron : ⁰₋₁e ; positon : ⁰₊₁e", "Z : 5 B, 6 C, 7 N, 88 Ra, 90 Th, 91 Pa, 92 U"],
    conclusion: "Un noyau radioactif est un noyau instable qui se désintègre spontanément en un noyau fils en émettant une particule. α : émission d'un noyau d'hélium ⁴₂He (²³⁸₉₂U → ²³⁴₉₀Th + ⁴₂He). β− : émission d'un électron (¹⁴₆C → ¹⁴₇N + ⁰₋₁e). β+ : émission d'un positon (¹¹₆C → ¹¹₅B + ⁰₊₁e). Une équation nucléaire conserve le nombre de charge Z et le nombre de nucléons A. Le noyau fils, souvent excité, libère son énergie par un rayonnement électromagnétique γ, sans changer A ni Z.",
    conclusion_courte: "Conservation de A et de Z ; α, β−, β+, γ.",
    etapes: [
      { consigne: "Un noyau radioactif est…", court: "Répondez dans le carnet.", question: choix(["un noyau instable qui se désintègre spontanément en un autre noyau en émettant un rayonnement", "un noyau qui brille", "un noyau qui reste toujours le même"], "Pensez au carbone 14.", "Exact.") },
      { consigne: "²³⁸₉₂U est radioactif α : ²³⁸₉₂U → ⁴₂He + ᴬ_Z X. Nombre de charge Z du noyau fils ?", court: "Z du fils (α) ?", question: nombre("", 90, 0, "Conservation de Z : 92 = 2 + Z.", "Exact.") },
      { consigne: "Nombre de nucléons A du noyau fils ?", court: "A du fils (α) ?", question: nombre("", 234, 0, "Conservation de A : 238 = 4 + A.", "Exact : c'est ²³⁴₉₀Th, du thorium.") },
      { consigne: "¹⁴₆C est radioactif β− : ¹⁴₆C → ᴬ_Z X + ⁰₋₁e. Z du noyau fils ?", court: "Z du fils (β−) ?", question: nombre("", 7, 0, "6 = Z + (−1).", "Exact : ¹⁴₇N, de l'azote.") },
      { consigne: "¹¹₆C est radioactif β+ : ¹¹₆C → ᴬ_Z X + ⁰₊₁e. Z du noyau fils ?", court: "Z du fils (β+) ?", question: nombre("", 5, 0, "6 = Z + 1.", "Exact : ¹¹₅B, du bore.") },
      { consigne: "Ces équations conservent…", court: "Répondez dans le carnet.", question: choix(["le nombre de charge Z et le nombre de nucléons A", "seulement le nombre de neutrons", "l'élément chimique"], "Faites les sommes de chaque côté.", "Exact : ce sont les lois de conservation de Soddy.") },
      { consigne: "Après une désintégration, le noyau fils est souvent dans un état excité. En revenant à son état fondamental, il émet…", court: "Répondez dans le carnet.", question: choix(["un rayonnement γ (électromagnétique) : A et Z ne changent pas", "une particule α", "un électron"], "γ : pas de particule chargée.", "Exact.") },
    ],
  };

  L.poste_noyaux = function (g) {
    // Pense-bête, tableau des noyaux légers et affiche de tous les noyaux.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230);
    L.tableau_nz(g); L.affiche_nz(g);
    return { pense_bete };
  };

  L.demarrer({ id: "b2_nucl1_a1_becquerel", titre: "Laboratoire : découverte de la radioactivité", paillasses: [L.poste_becquerel, L.poste_noyaux], missions: [BECQUEREL, CARTES, DESINTEGRATIONS] });
})(window.Labo);
