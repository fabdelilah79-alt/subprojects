/*
Rôle : feuille de calcul de la tablette : cellules A1 à D12, nombres à la française, formules (=B2/A2),
       barre de formule et bouton « Recopier vers le bas ».
Reçoit : le conteneur HTML et la mise en forme de départ (entêtes de la ligne 1).
Produit : new Labo.Tableur(conteneur, reglages) avec valeur(), lignes(), entete() ; annonce « tableur » à chaque saisie.
Utilisé par : tablette.js (une feuille par mission), courbe.js, missions.js.
*/
(function (L) {
  const LETTRES = "ABCD";

  L.Tableur = function (conteneur, { lignes = 12, entetes = [] } = {}) {
    // Construit la feuille et ses cellules.
    this.brut = {};
    this.champs = {};
    this.nb_lignes = lignes;
    this.selection = "A2";
    entetes.forEach((texte, i) => { this.brut[LETTRES[i] + "1"] = texte; });
    this.construire(conteneur);
    this.afficher();
  };

  const T = L.Tableur.prototype;

  T.construire = function (conteneur) {
    // Barre de formule, puis la grille (lettres en haut, numéros à gauche).
    const barre = L.html("div", { class: "tableur-barre" }, conteneur);
    this.nom_cellule = L.html("span", { class: "tableur-nom" }, barre, "A2");
    this.formule = L.html("span", { class: "tableur-formule" }, barre);
    const recopier = L.html("button", { type: "button", class: "tablette-bouton" }, barre, "Recopier vers le bas");
    recopier.addEventListener("click", () => this.recopier_vers_le_bas());
    const table = L.html("table", { class: "tableur" }, conteneur);
    const tete = L.html("tr", {}, table);
    L.html("th", {}, tete);
    for (const lettre of LETTRES) L.html("th", { scope: "col" }, tete, lettre);
    for (let n = 1; n <= this.nb_lignes; n++) {
      const tr = L.html("tr", {}, table);
      L.html("th", { scope: "row" }, tr, String(n));
      for (const lettre of LETTRES) this.creer_champ(L.html("td", {}, tr), lettre + n, n === 1);
    }
  };

  T.creer_champ = function (td, cle, entete) {
    // Une cellule : montre la formule quand on écrit dedans, son résultat sinon.
    const champ = L.html("input", { type: "text", "aria-label": `Cellule ${cle}`, inputmode: entete ? "text" : "decimal", autocomplete: "off" }, td);
    if (entete) champ.classList.add("entete");
    this.champs[cle] = champ;
    champ.addEventListener("focus", () => { champ.value = this.brut[cle] || ""; this.choisir(cle); });
    champ.addEventListener("input", () => { this.brut[cle] = champ.value; this.formule.textContent = champ.value; });
    champ.addEventListener("blur", () => { this.afficher(); L.annoncer("tableur", { feuille: this }); });
    champ.addEventListener("keydown", (e) => this.touche(e, cle));
  };

  T.choisir = function (cle) {
    // Sélectionne une cellule : son nom et son contenu brut s'affichent dans la barre.
    this.selection = cle;
    this.nom_cellule.textContent = cle;
    this.formule.textContent = this.brut[cle] || "";
  };

  T.touche = function (e, cle) {
    // Entrée ou flèches haut/bas : passer à la cellule du dessous ou du dessus.
    const pas = { Enter: 1, ArrowDown: 1, ArrowUp: -1 }[e.key];
    if (!pas) return;
    e.preventDefault();
    const n = Number(cle.slice(1)) + pas;
    if (n >= 1 && n <= this.nb_lignes) this.champs[cle[0] + n].focus();
    else this.champs[cle].blur();
  };

  T.valeur = function (cle, chemin = []) {
    // Valeur numérique d'une cellule (formule calculée), null si vide ou texte ; lève une erreur si la formule est fausse.
    const brut = (this.brut[cle] || "").trim();
    if (brut.startsWith("=")) {
      if (chemin.includes(cle)) throw new Error("#CYCLE");
      return L.formules.calculer(brut.slice(1), (autre) => this.valeur(autre, [...chemin, cle]) ?? 0);
    }
    return L.lire_nombre(brut);
  };

  T.valeur_sure = function (cle) {
    // Valeur d'une cellule, ou null si sa formule est fausse.
    try { return this.valeur(cle); } catch { return null; }
  };

  T.afficher = function () {
    // Réécrit toutes les cellules (sauf celle où l'élève écrit) avec leur résultat.
    for (const [cle, champ] of Object.entries(this.champs)) {
      if (document.activeElement === champ) continue;
      const brut = this.brut[cle] || "";
      champ.classList.toggle("calculee", brut.startsWith("="));
      if (!brut.startsWith("=")) { champ.value = brut; continue; }
      try { champ.value = this.ecrire(this.valeur(cle)); } catch (erreur) { champ.value = erreur.message; }
    }
  };

  T.ecrire = function (v) {
    // Écrit un résultat avec 4 chiffres significatifs, à la française (écriture scientifique si besoin).
    return L.nombre_court(v, 4);
  };

  T.recopier_vers_le_bas = function () {
    // Recopie la formule de la cellule choisie sur les lignes du dessous qui ont déjà des mesures.
    const cle = this.selection;
    const brut = this.brut[cle] || "";
    if (!brut.startsWith("=")) return;
    const ligne = Number(cle.slice(1));
    for (let n = ligne + 1; n <= this.nb_lignes; n++) {
      const occupee = [...LETTRES].some((c) => c !== cle[0] && (this.brut[c + n] || "").trim() !== "");
      if (occupee) this.brut[cle[0] + n] = L.formules.decaler(brut, n - ligne);
    }
    this.afficher();
    L.annoncer("tableur", { feuille: this });
  };

  T.entete = function (lettre) {
    // Texte de l'entête d'une colonne (ligne 1).
    return (this.brut[lettre + "1"] || "").trim() || `Colonne ${lettre}`;
  };

  T.lignes = function (lettres) {
    // Lignes 2 et suivantes où toutes les colonnes demandées ont une valeur : [{ A: 0,1, B: 0,98 }, ...].
    const resultat = [];
    for (let n = 2; n <= this.nb_lignes; n++) {
      const ligne = {};
      for (const c of lettres) ligne[c] = this.valeur_sure(c + n);
      if (lettres.every((c) => ligne[c] !== null)) resultat.push(ligne);
    }
    return resultat;
  };

  L.Tableur.LETTRES = LETTRES;
})(window.Labo);
