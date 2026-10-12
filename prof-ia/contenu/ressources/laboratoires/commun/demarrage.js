/*
Rôle : démarrer une simulation de laboratoire : scène, matières, paillasses, tablette, carnet, missions ;
       le pense-bête de chaque paillasse montre l'étape en cours de sa mission.
Reçoit : la définition de la simulation : { id, titre, decor ("aucun" : pas de paillasse), repos_carnet (facultatif),
         paillasses: [fabrique, ...], missions: [...] }.
         Chaque fabrique reçoit le groupe SVG de sa paillasse et renvoie { pense_bete }.
Produit : Labo.demarrer(simulation) : le laboratoire prêt à manipuler.
Utilisé par : le fichier « simulation.js » de chaque simulation (dernier script chargé).
*/
(function (L) {
  function pense_betes(postes) {
    // Écrit sur le pense-bête de chaque paillasse l'étape en cours de sa mission.
    L.ecouter("missions", (e) => {
      e.missions.forEach((m) => {
        const feuille = postes[m.paillasse]?.pense_bete;
        if (!feuille) return;
        if (m.accomplie) return feuille.ecrire("Mission accomplie", m.conclusion_courte || "Ouvrez le carnet pour la suite.");
        const etape = m.etapes[m.etape];
        feuille.ecrire(`Étape ${m.etape + 1} sur ${m.etapes.length}`, etape.court || etape.consigne);
      });
    });
  }

  function construire(simulation) {
    // Construit tout le laboratoire, paillasse par paillasse.
    const etage = document.getElementById("etage");
    L.scene.initialiser(document.getElementById("ecran"), etage);
    const dessin = L.svg("svg", { id: "labo", viewBox: `0 0 ${L.LARGEUR} ${L.HAUTEUR}`, role: "img", "aria-label": simulation.titre });
    etage.prepend(dessin);
    L.materiaux(dessin);
    const camera = L.svg("g", {}, dessin);
    const postes = simulation.paillasses.map((fabrique, numero) => {
      const g = L.svg("g", { transform: `translate(${numero * L.LARGEUR} 0)` }, camera);
      if (simulation.decor !== "aucun") L.decor.paillasse(g, numero);
      return fabrique(g);
    });
    L.tablette.creer(etage, simulation.missions);
    L.carnet.creer(etage, simulation.repos_carnet);
    pense_betes(postes);
    L.missions.demarrer(simulation, camera);
  }

  L.demarrer = function (simulation) {
    // Lance la construction dès que la page est prête.
    document.title = simulation.titre;
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => construire(simulation));
    else construire(simulation);
  };
})(window.Labo);
