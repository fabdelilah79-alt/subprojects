/*
Rôle : afficher la rangée de liens « Tableau 1, Tableau 2… » au-dessus du tableau.
Reçoit : la barre où placer les liens et la fonction à appeler quand l'élève en choisit un.
Produit : un lien par tableau ; le tableau affiché est marqué comme courant.
Utilisé par : client/js/tableau/tableau.js.
*/

export function creer_onglets(barre, sur_choix) {
  // Prépare la rangée d'onglets, vide au départ.
  const liens = [];

  function activer(numero) {
    // Marque l'onglet affiché ; les autres restent cliquables.
    liens.forEach((lien, i) => lien.setAttribute("aria-current", i === numero ? "page" : "false"));
  }

  function ajouter(titre) {
    // Ajoute l'onglet d'un nouveau tableau et l'affiche.
    const numero = liens.length;
    const lien = document.createElement("button");
    lien.type = "button";
    lien.className = "onglet";
    lien.textContent = `Tableau ${numero + 1}`;
    lien.title = titre;
    lien.addEventListener("click", () => {
      sur_choix(numero);
      activer(numero);
    });
    barre.append(lien);
    liens.push(lien);
    activer(numero);
    return numero;
  }

  return { ajouter, activer };
}
