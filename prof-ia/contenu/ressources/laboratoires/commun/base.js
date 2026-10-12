/*
Rôle : espace de noms commun des laboratoires virtuels (Labo) : création d'éléments, nombres à la française,
       petit bus d'événements, animations.
Reçoit : rien.
Produit : window.Labo avec svg(), texte(), texte_exposants(), html(), nombre(), lire_nombre(), ecouter(), annoncer(), animer().
Utilisé par : tous les fichiers de laboratoires/commun/ et des simulations.
*/
window.Labo = window.Labo || {};

(function (L) {
  const NS = "http://www.w3.org/2000/svg";
  const abonnes = {};

  L.LARGEUR = 1024;
  L.HAUTEUR = 640;

  L.svg = function (nom, attributs = {}, parent = null) {
    // Crée un élément SVG avec ses attributs et l'ajoute au parent s'il est donné.
    const element = document.createElementNS(NS, nom);
    for (const [cle, valeur] of Object.entries(attributs)) element.setAttribute(cle, valeur);
    if (parent) parent.append(element);
    return element;
  };

  L.texte = function (parent, x, y, contenu, attributs = {}) {
    // Écrit un texte SVG (centré par défaut) et le renvoie.
    const t = L.svg("text", { x, y, "text-anchor": "middle", "dominant-baseline": "middle", ...attributs }, parent);
    t.textContent = contenu;
    return t;
  };

  L.texte_exposants = function (parent, x, y, contenu, attributs = {}) {
    // Écrit un texte où « ^{...} » est en exposant et « _{...} » en indice (F_{S/T}, 10^{n+1}).
    const t = L.svg("text", { x, y, "dominant-baseline": "middle", ...attributs }, parent);
    contenu.split(/([\^_]\{[^}]*\})/).forEach((morceau) => {
      const decale = { "^": "super", _: "sub" }[morceau[0]];
      const special = decale && morceau[1] === "{";
      const s = L.svg("tspan", special ? { "baseline-shift": decale, "font-size": "70%" } : {}, t);
      s.textContent = special ? morceau.slice(2, -1) : morceau;
    });
    return t;
  };

  L.html = function (nom, attributs = {}, parent = null, texte = "") {
    // Crée un élément HTML avec ses attributs et son texte, et l'ajoute au parent s'il est donné.
    const element = document.createElement(nom);
    for (const [cle, valeur] of Object.entries(attributs)) element.setAttribute(cle, valeur);
    if (texte) element.textContent = texte;
    if (parent) parent.append(element);
    return element;
  };

  L.ecrire_riche = function (element, texte) {
    // Remplit un élément HTML : « _{...} » devient un indice, « ^{...} » un exposant (F_{S/T}, 10^{8}).
    element.replaceChildren();
    String(texte).split(/([\^_]\{[^}]*\})/).forEach((morceau) => {
      const balise = { "^": "sup", _: "sub" }[morceau[0]];
      if (balise && morceau[1] === "{") L.html(balise, {}, element, morceau.slice(2, -1));
      else if (morceau) element.append(morceau);
    });
    return element;
  };

  L.nombre = function (valeur, decimales = 2) {
    // Écrit un nombre à la française (virgule), avec un nombre de décimales fixé.
    return valeur.toLocaleString("fr-FR", { minimumFractionDigits: decimales, maximumFractionDigits: decimales });
  };

  L.nombre_court = function (v, chiffres = 4) {
    // Écrit un nombre avec quelques chiffres significatifs ; très petit ou très grand : écriture scientifique (2,5E-9).
    if (v === 0 || !Number.isFinite(v)) return String(v).replace(".", ",");
    const a = Math.abs(v);
    if (a < 1e-3 || a >= 1e7) return v.toExponential(chiffres - 1).replace(/\.?0+e/, "e").replace("e+", "E").replace("e", "E").replace(".", ",");
    return Number(v.toPrecision(chiffres)).toLocaleString("fr-FR", { maximumFractionDigits: 10 });
  };

  L.lire_nombre = function (texte) {
    // Lit un nombre écrit par l'élève (virgule ou point ; 1,98E20 ou 1,98×10^20) ; renvoie null sinon.
    const propre = String(texte ?? "").trim().replace(/\s/g, "").replace(",", ".")
      .replace(/^([-+]?\d*\.?\d+)(?:[x×*·]|\.(?=10\^))10\^?\(?([-+]?\d+)\)?$/i, "$1e$2");
    if (propre === "") return null;
    const valeur = Number(propre);
    return Number.isFinite(valeur) ? valeur : null;
  };

  L.proche = function (valeur, cible, tolerance) {
    // Dit si une valeur est assez proche de la cible (tolérance absolue).
    return valeur !== null && Math.abs(valeur - cible) <= tolerance;
  };

  L.ecouter = function (type, fonction) {
    // Abonne une fonction aux annonces d'un type donné.
    (abonnes[type] = abonnes[type] || []).push(fonction);
  };

  L.annoncer = function (type, donnees = {}) {
    // Prévient tous les abonnés d'un type d'annonce.
    for (const fonction of abonnes[type] || []) fonction(donnees);
  };

  L.animer = function (duree_s, image, fin = null) {
    // Appelle image(t) avec t de 0 à 1 pendant duree_s secondes, puis fin() ; renvoie une fonction d'arrêt.
    let debut = null;
    let arrete = false;
    const tourner = (instant) => {
      if (arrete) return;
      if (debut === null) debut = instant;
      const t = Math.min(1, (instant - debut) / (duree_s * 1000));
      image(t);
      if (t < 1) requestAnimationFrame(tourner);
      else if (fin) fin();
    };
    requestAnimationFrame(tourner);
    return () => { arrete = true; };
  };

  L.adoucir = (t) => 1 - Math.pow(1 - t, 3);

  L.chute = function (t) {
    // Courbe d'une chute avec un petit rebond à la fin (t de 0 à 1 -> position de 0 à 1).
    if (t < 0.7) return Math.pow(t / 0.7, 2);
    const r = (t - 0.7) / 0.3;
    return 1 - 0.06 * Math.sin(Math.PI * r) * (1 - r);
  };

  L.placer = function (element, x, y, echelle = 1) {
    // Place un groupe SVG en (x, y), avec une échelle facultative.
    element.setAttribute("transform", `translate(${x} ${y})` + (echelle !== 1 ? ` scale(${echelle})` : ""));
  };
})(window.Labo);
