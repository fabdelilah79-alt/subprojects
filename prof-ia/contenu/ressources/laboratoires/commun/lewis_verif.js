/*
Rôle : vérifications des missions « ions et représentation de Lewis » : ion construit sur le tableau de l'atome (protons,
       nucléons, électrons, couches remplies dans l'ordre), molécule construite sur le tableau de Lewis (formule brute,
       règles du duet et de l'octet, ou seulement les liaisons pour une formule développée), deux isomères différents.
Reçoit : les faits « atome » et « lewis ».
Produit : Labo.VERIF_LEWIS = { ion(Z, A, e), molecule(brute, avec_doublets), isomere(brute, cle) } ; Labo.indice(texte) (chiffres en indice).
Utilisé par : les simulations sur les molécules (tc_chim5_a1_lewis, tc_chim6_a2_tableau).
*/
(function (L) {
  const signatures = {};
  L.indice = (t) => t.replace(/\d/g, (c) => "₀₁₂₃₄₅₆₇₈₉"[c]);
  // Formule ramenée au nombre d'atomes de chaque élément (NH3 et H3N sont la même formule brute).
  const atomes = (f) => [...f.matchAll(/([A-Z][a-z]?)(\d*)/g)].map(([, e, n]) => e + (n || 1)).sort().join(" ");

  function ion(Z, A, e) {
    // Z protons, A − Z neutrons, e électrons rangés dans l'ordre K (2), L (8), M.
    return ({ faits }) => {
      const a = faits.atome || {}, K = Math.min(2, e), Lc = Math.min(8, e - K);
      if (a.p !== Z || a.n !== A - Z || a.e !== e) return false;
      return (a.K === K && a.L === Lc && a.M === e - K - Lc) || "Le nombre d'électrons est juste : remplissez les couches dans l'ordre K, L, M.";
    };
  }

  function molecule(brute, avec_doublets = true) {
    // La molécule du tableau a la formule brute demandée et respecte les règles (doublets non liants compris, ou non).
    return ({ faits }) => {
      const m = faits.lewis || {};
      if (!m.n) return false;
      if (atomes(m.brute) !== atomes(brute)) return m.connexe && m.n >= brute.replace(/\d/g, "").length ? `Votre molécule est ${L.indice(m.brute)} : il faut ${L.indice(brute)}.` : false;
      if (avec_doublets) return m.lewis || m.erreur || false;
      return m.developpee || m.erreur_developpee || (!m.connexe && "Tous les atomes doivent être reliés : une seule molécule.") || false;
    };
  }

  function isomere(brute, cle) {
    // Retient la première molécule juste ; la suivante doit avoir la même formule brute et une autre formule développée.
    const f = molecule(brute, false);
    return (ctx) => {
      const r = f(ctx), sig = ctx.faits.lewis?.signature;
      if (r !== true) return r;
      if (!signatures[cle]) { signatures[cle] = sig; return true; }
      return sig !== signatures[cle] || "C'est la même molécule que la première : reliez les atomes autrement.";
    };
  }

  L.VERIF_LEWIS = { ion, molecule, isomere };
})(window.Labo);
