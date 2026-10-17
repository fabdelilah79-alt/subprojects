/*
Rôle : missions « la sécurité d'abord » (objectif O1) et « chauffage à reflux » de l'activité 1 du chapitre « Synthèse
       d'espèces chimiques » (synthèse d'un savon).
Reçoit : rien (les vérifications lisent les faits des paillasses).
Produit : Labo.MISSIONS_SAVON = { securite, reflux, choix }.
Utilisé par : simulation.js.
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const R = (faits) => faits.reflux_savon || {};

  const SECURITE = {
    id: "securite", paillasse: 0, titre: "La sécurité d'abord",
    objectif: "Avant une synthèse, on lit l'étiquette et la fiche de sécurité de chaque produit.",
    entetes: [],
    conclusion: "Les pictogrammes de danger renseignent sur les risques : corrosif (soude), inflammable (éthanol). On porte blouse, lunettes et gants ; on chauffe sans flamme (chauffe-ballon) dans un montage à reflux qui ne laisse pas sortir les vapeurs ; les restes vont dans le bidon de récupération, jamais dans l'évier.",
    conclusion_courte: "Lire les pictogrammes ; se protéger ; trier les déchets.",
    etapes: [
      { consigne: "Touchez chaque flacon pour lire sa fiche de sécurité.", court: "Lisez les trois fiches.", verifier: ({ faits }) => (faits.fiches_lues || []).length >= 3 || false },
      { consigne: "Le pictogramme de la soude (un liquide qui ronge une main et une surface) signifie…", court: "Répondez dans le carnet.", question: choix(["corrosif : la soude brûle la peau et les yeux", "inflammable", "dangereux pour l'environnement"], "Relisez la fiche de la soude.", "Exact.") },
      { consigne: "Avant de prendre le bécher de soude, on met…", court: "Répondez dans le carnet.", question: choix(["des lunettes de protection et des gants, en plus de la blouse", "seulement la blouse", "rien : il suffit de faire attention"], "Que dit la fiche ?", "Exact.") },
      { consigne: "L'éthanol est inflammable. Pour chauffer le mélange, on utilise…", court: "Répondez dans le carnet.", question: choix(["un chauffe-ballon et un réfrigérant à reflux : pas de flamme, et les vapeurs ne sortent pas", "un bec Bunsen", "une plaque chauffante, sans réfrigérant"], "Que se passerait-il si les vapeurs d'éthanol rencontraient une flamme ?", "Exact.") },
      { consigne: "À la fin, les restes de soude et d'éthanol…", court: "Répondez dans le carnet.", question: choix(["vont dans le bidon de récupération", "vont dans l'évier, avec beaucoup d'eau", "vont à la poubelle"], "Pensez à l'environnement.", "Exact : ils seront traités.") },
    ],
  };

  const REFLUX = {
    id: "reflux", paillasse: 1, titre: "Le chauffage à reflux",
    objectif: "Faire réagir l'huile avec la soude, à chaud, sans perdre de matière : c'est la synthèse du savon.",
    entetes: [],
    conclusion: "Huile + soude → savon + glycérol. Le chauffage accélère la transformation ; le réfrigérant à boules condense les vapeurs, qui retombent dans le ballon : on chauffe longtemps sans perte de matière et sans laisser sortir les vapeurs inflammables. Dans l'eau salée, le savon, peu soluble, se rassemble en grains : c'est le relargage.",
    conclusion_courte: "Huile + soude → savon + glycérol (à reflux).",
    etapes: [
      { consigne: "Mettez les lunettes et les gants (touchez-les sur leurs crochets).", court: "Lunettes et gants.", verifier: ({ faits }) => R(faits).epi || false },
      { consigne: "Par l'entonnoir posé sur le col, versez dans le ballon l'huile, la soude puis l'éthanol (environ 20 mL de chaque).", court: "Huile, soude, éthanol dans le ballon.", verifier: ({ faits }) => { const r = R(faits); return (r.huile >= 15 && r.soude >= 15 && r.ethanol >= 15) || false; }, aide_geste: "Portez chaque bécher au-dessus de l'entonnoir, puis inclinez-le avec la poignée." },
      { consigne: "Ajoutez quelques grains de pierre ponce (par l'entonnoir).", court: "Pierre ponce.", verifier: ({ faits }) => R(faits).ponce || false },
      { consigne: "Rangez l'entonnoir dans son anneau, posez le réfrigérant sur le col du ballon, puis ouvrez l'eau (elle entre par le bas).", court: "Réfrigérant posé, eau ouverte.", verifier: ({ faits }) => (R(faits).refrigerant === "monte" && R(faits).eau) || false },
      { consigne: "Allumez le chauffe-ballon (touche I/O) et chauffez à reflux pendant 30 minutes (lisez le chronomètre).", court: "Reflux pendant 30 min.", verifier: ({ faits }) => { const r = R(faits); if (r.fuite) return "Des vapeurs s'échappent : le réfrigérant doit être posé et l'eau ouverte."; return r.avance >= 1 || false; } },
      { consigne: "Le réfrigérant à boules sert à…", court: "Répondez dans le carnet.", question: choix(["condenser les vapeurs, qui retombent dans le ballon : on chauffe longtemps sans perdre de matière", "refroidir le ballon", "faire entrer de l'air"], "Regardez les gouttes dans le réfrigérant.", "Exact.") },
      { consigne: "Arrêtez le chauffage, laissez refroidir, ôtez le réfrigérant, puis versez le contenu du ballon dans le bécher d'eau salée.", court: "Versez dans l'eau salée.", verifier: ({ faits }) => R(faits).grains >= 10 || false, aide_geste: "Prenez le ballon par son col et inclinez-le au-dessus du bécher." },
      { consigne: "Dans l'eau salée, le savon…", court: "Répondez dans le carnet.", question: choix(["est peu soluble : il se rassemble en grains qui flottent (relargage)", "se dissout complètement", "se transforme en huile"], "Que voyez-vous à la surface ?", "Exact.") },
      { consigne: "L'écriture de la transformation est…", court: "Répondez dans le carnet.", question: choix(["huile + soude → savon + glycérol", "savon → huile + soude", "huile + eau → savon"], "Quels produits avez-vous mis dans le ballon ?", "Exact.") },
    ],
  };

  L.MISSIONS_SAVON = { securite: SECURITE, reflux: REFLUX, choix };
})(window.Labo);
