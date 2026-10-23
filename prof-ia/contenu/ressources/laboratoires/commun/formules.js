/*
Rôle : calculer les formules du tableur de la tablette (=B2/A2, =9,81*A3, =(B2-B3)^2, =COS(A2*PI()/180)...) sans jamais
       exécuter de code. Fonctions : RACINE, ABS, PI, COS et SIN (angle en radians, comme dans un tableur ordinaire).
Reçoit : le texte d'une formule et une fonction qui lit la valeur d'une cellule (« A2 » -> nombre).
Produit : Labo.formules.calculer(texte, lire) -> nombre (ou lève une erreur « #ERREUR ») ;
         Labo.formules.decaler(texte, lignes) -> la formule recopiée plus bas (A2 -> A3).
Utilisé par : tableur.js.
*/
(function (L) {
  const JETON = /\s*(?:(\d+(?:[.,]\d+)?(?:e[+-]?\d+)?)|([A-Za-z]+\d+)|(RACINE|ABS|PI|COS|SIN)|([-+*/^();]))/iy;

  function decouper(texte) {
    // Découpe la formule en jetons : nombres, cellules, fonctions, opérateurs.
    const jetons = [];
    JETON.lastIndex = 0;
    while (JETON.lastIndex < texte.length) {
      if (/^\s*$/.test(texte.slice(JETON.lastIndex))) break;
      const m = JETON.exec(texte);
      if (!m) throw new Error("#ERREUR");
      if (m[1]) jetons.push({ nombre: Number(m[1].replace(",", ".")) });
      else if (m[3]) jetons.push({ fonction: m[3].toUpperCase() });
      else if (m[2]) jetons.push({ cellule: m[2].toUpperCase() });
      else jetons.push({ signe: m[4] });
    }
    return jetons;
  }

  function analyseur(jetons, lire) {
    // Analyse descendante : somme > produit > puissance > signe > terme.
    let i = 0;
    const voir = () => jetons[i] || {};
    const prendre = (signe) => (voir().signe === signe ? (i++, true) : false);
    function terme() {
      // Un nombre, une cellule, une fonction ou une parenthèse.
      const j = jetons[i++] || {};
      if (j.nombre !== undefined) return j.nombre;
      if (j.cellule) return lire(j.cellule);
      if (j.fonction === "PI") { if (voir().signe === "(" && (jetons[i + 1] || {}).signe === ")") i += 2; return Math.PI; }
      if (j.fonction) {
        if (!prendre("(")) throw new Error("#ERREUR");
        const v = somme();
        if (!prendre(")")) throw new Error("#ERREUR");
        return { RACINE: Math.sqrt, ABS: Math.abs, COS: Math.cos, SIN: Math.sin }[j.fonction](v);
      }
      if (j.signe === "(") { const v = somme(); if (!prendre(")")) throw new Error("#ERREUR"); return v; }
      throw new Error("#ERREUR");
    }
    function signe() { return prendre("-") ? -signe() : (prendre("+") ? signe() : puissance()); }
    function puissance() { const b = terme(); return prendre("^") ? Math.pow(b, signe()) : b; }
    function produit() {
      let v = signe();
      for (;;) {
        if (prendre("*")) v *= signe();
        else if (prendre("/")) v /= signe();
        else return v;
      }
    }
    function somme() {
      let v = produit();
      for (;;) {
        if (prendre("+")) v += produit();
        else if (prendre("-")) v -= produit();
        else return v;
      }
    }
    const resultat = somme();
    if (i !== jetons.length) throw new Error("#ERREUR");
    return resultat;
  }

  L.formules = {
    calculer(texte, lire) {
      // Calcule une formule (sans le signe « = ») ; une division par zéro donne « #DIV/0 ».
      const valeur = analyseur(decouper(texte), lire);
      if (!Number.isFinite(valeur)) throw new Error("#DIV/0");
      return valeur;
    },
    decaler(texte, lignes) {
      // Recopie une formule plus bas : chaque numéro de ligne augmente de « lignes » (A2 -> A3).
      return texte.replace(/\b([A-Za-z])(\d+)\b/g, (_, colonne, ligne) => colonne + (Number(ligne) + lignes));
    },
  };
})(window.Labo);
