/*
Rôle : règles de la représentation de Lewis pour les molécules faites de H, C, N, O, F, Si, P, S, Cl : chaque doublet (liant ou non liant)
       compte 2 électrons ; l'hydrogène doit en avoir 2 autour de lui (règle du duet), les autres atomes 8 (règle de l'octet) ;
       chaque atome forme autant de liaisons qu'il lui manque d'électrons sur sa couche externe (H : 1, C : 4, N : 3, O : 2,
       Cl : 1). Calcule aussi la formule brute (C, puis H, puis les autres) et une signature qui distingue les isomères.
Reçoit : l'état d'un tableau de Lewis : { atomes : { "i,j" : élément }, liaisons : { "i,j|k,l" : 1 à 3 }, paires : { "i,j|côté" : vrai } }.
Produit : Labo.LEWIS = { analyser(etat) -> { brute, n, connexe, lewis (règles respectées, doublets non liants compris),
          developpee (liaisons justes, sans regarder les doublets non liants), erreur (première phrase d'explication),
          signature } , EXTERNES, LIAISONS }.
Utilisé par : tableau_lewis.js et les missions des simulations de chimie (molécules).
*/
(function (L) {
  const EXTERNES = { H: 1, C: 4, N: 5, O: 6, F: 7, Si: 4, P: 5, S: 6, Cl: 7 }, LIAISONS = { H: 1, C: 4, N: 3, O: 2, F: 1, Si: 4, P: 3, S: 2, Cl: 1 };
  const NOM = { H: "d'hydrogène", C: "de carbone", N: "d'azote", O: "d'oxygène", F: "de fluor", Si: "de silicium", P: "de phosphore", S: "de soufre", Cl: "de chlore" };

  function decrire(etat) {
    // Pour chaque atome : élément, somme des ordres de ses liaisons, doublets non liants, voisins (avec l'ordre de liaison).
    const A = {};
    for (const [cle, el] of Object.entries(etat.atomes)) A[cle] = { cle, el, l: 0, p: 0, voisins: [] };
    for (const [cle, n] of Object.entries(etat.liaisons)) {
      const [a, b] = cle.split("|");
      if (!A[a] || !A[b] || !n) continue;
      A[a].l += n; A[b].l += n; A[a].voisins.push([b, n]); A[b].voisins.push([a, n]);
    }
    for (const cle of Object.keys(etat.paires)) { const a = A[cle.split("|")[0]]; if (a && etat.paires[cle]) a.p++; }
    return A;
  }

  function connexe(A) {
    // Tous les atomes sont-ils reliés entre eux (une seule molécule) ?
    const cles = Object.keys(A);
    if (!cles.length) return false;
    const vus = new Set([cles[0]]), pile = [cles[0]];
    while (pile.length) for (const [v] of A[pile.pop()].voisins) if (!vus.has(v)) { vus.add(v); pile.push(v); }
    return vus.size === cles.length;
  }

  function brute(A) {
    // Formule brute : C d'abord, puis H, puis les autres éléments par ordre alphabétique.
    const n = {};
    for (const a of Object.values(A)) n[a.el] = (n[a.el] || 0) + 1;
    const ordre = Object.keys(n).sort((x, y) => (x === "C" ? -1 : y === "C" ? 1 : x === "H" ? -1 : y === "H" ? 1 : x.localeCompare(y)));
    return ordre.map((e) => e + (n[e] > 1 ? n[e] : "")).join("");
  }

  function erreur(a, avec_paires) {
    // Première règle non respectée par un atome, dite simplement (ou "" si tout va bien).
    const nom = `L'atome ${NOM[a.el]}`, cible = a.el === "H" ? 2 : 8, e = 2 * (a.l + (avec_paires ? a.p : 0)), regle = a.el === "H" ? "du duet" : "de l'octet";
    if (a.l !== LIAISONS[a.el]) return `${nom} doit former ${LIAISONS[a.el]} liaison${LIAISONS[a.el] > 1 ? "s" : ""} (il a ${EXTERNES[a.el]} électron${EXTERNES[a.el] > 1 ? "s" : ""} externe${EXTERNES[a.el] > 1 ? "s" : ""}) : il en a ${a.l}.`;
    if (avec_paires && e !== cible) return `${nom} est entouré de ${e} électrons : la règle ${regle} demande ${cible} électrons (ajoutez ou retirez des doublets non liants).`;
    return "";
  }

  function analyser(etat) {
    // Bilan du tableau : formule brute, une seule molécule ou non, règles respectées, signature d'isomère.
    const A = decrire(etat), liste = Object.values(A), c = connexe(A);
    const err = (p) => liste.map((a) => erreur(a, p)).find((t) => t) || "";
    const sig = liste.map((a) => a.el + "(" + a.voisins.map(([v, n]) => ["", "", "=", "≡"][n] + A[v].el).sort().join(",") + ")").sort().join(" ");
    const e_l = err(true), e_d = err(false);
    return { brute: brute(A), n: liste.length, connexe: c, lewis: c && !e_l, developpee: c && !e_d, erreur: !c && liste.length > 1 ? "Tous les atomes doivent être reliés : une seule molécule." : e_l, erreur_developpee: e_d, signature: sig };
  }

  L.LEWIS = { analyser, EXTERNES, LIAISONS };
})(window.Labo);
