/*
Rôle : démarrer une simulation de laboratoire : scène, matières, paillasses, tablette, carnet, missions ;
       le pense-bête de chaque paillasse montre l'étape en cours de sa mission.
Reçoit : la définition de la simulation : { id, titre, decor ("aucun" : pas de paillasse), repos_carnet et repos_tablette (facultatifs),
         paillasses: [fabrique, ...], missions: [...] }.
         Chaque fabrique reçoit le groupe SVG de sa paillasse et renvoie { pense_bete }.
Produit : Labo.demarrer(simulation) : le laboratoire prêt à manipuler.
Utilisé par : le fichier « simulation.js » de chaque simulation (dernier script chargé).
*/
(function (L) {
  function pense_betes(postes) {
    // Écrit sur le pense-bête de chaque paillasse l'étape en cours de sa mission (la dernière mission ouverte).
    L.ecouter("missions", (e) => {
      e.missions.forEach((m, i) => {
        const feuille = postes[m.paillasse]?.pense_bete;
        const suivante = e.missions.slice(i + 1).some((x, j) => x.paillasse === m.paillasse && i + 1 + j <= e.courante);
        if (!feuille || i > e.courante || suivante) return;
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
    const cadre = L.svg("clipPath", { id: "cadre-paillasse" }, dessin.querySelector("defs"));
    L.svg("rect", { width: L.LARGEUR, height: L.HAUTEUR }, cadre);
    const postes = simulation.paillasses.map((fabrique, numero) => {
      const g = L.svg("g", { transform: `translate(${numero * L.LARGEUR} 0)`, "clip-path": "url(#cadre-paillasse)" }, camera);
      if (simulation.decor !== "aucun") L.decor.paillasse(g, numero);
      return fabrique(g);
    });
    L.tablette.creer(etage, simulation.missions, simulation.repos_tablette);
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
