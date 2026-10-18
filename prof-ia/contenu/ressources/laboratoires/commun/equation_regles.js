/*
Rôle : règles d'une équation chimique : composition d'une formule (éléments, parenthèses, charge), écriture avec indices et
       exposants, bilan des éléments et des charges de chaque côté, et vérification d'une équation proposée (bonnes espèces,
       sans les ions spectateurs ; éléments et charges conservés ; plus petits coefficients entiers).
Reçoit : des espèces { f (formule, ex. « Cu(OH)2 »), z (charge) } et une équation proposée { reactifs : { id : coefficient },
         produits : { id : coefficient } } avec l'équation attendue { reactifs [ids], produits [ids] }.
Produit : Labo.EQUATION = { atomes(f), ecrire(f, z), bilan(cotes, especes), verifier(proposee, attendue, especes) -> { juste, erreur, bilan } }.
Utilisé par : tableau_equation.js et les missions des simulations de chimie (transformations).
*/
(function (L) {
  const INDICES = "₀₁₂₃₄₅₆₇₈₉", EXPOSANTS = "⁰¹²³⁴⁵⁶⁷⁸⁹";

  function atomes(f) {
    // Nombre d'atomes de chaque élément dans une formule (avec parenthèses : Cu(OH)2 -> Cu 1, O 2, H 2).
    const pile = [{}];
    for (const m of f.matchAll(/([A-Z][a-z]?|\(|\))(\d*)/g)) {
      const n = Number(m[2] || 1);
      if (m[1] === "(") pile.push({});
      else if (m[1] === ")") { const g = pile.pop(); for (const [e, k] of Object.entries(g)) pile[pile.length - 1][e] = (pile[pile.length - 1][e] || 0) + k * n; }
      else pile[pile.length - 1][m[1]] = (pile[pile.length - 1][m[1]] || 0) + n;
    }
    return pile[0];
  }

  function ecrire(f, z = 0) {
    // Formule avec ses indices et sa charge en exposant : SO4, -2 -> SO₄²⁻.
    const corps = f.replace(/\d/g, (c) => INDICES[c]);
    if (!z) return corps;
    return corps + (Math.abs(z) > 1 ? EXPOSANTS[Math.abs(z)] : "") + (z > 0 ? "⁺" : "⁻");
  }

  function bilan(cotes, especes) {
    // Pour chaque côté : nombre total d'atomes de chaque élément et charge totale.
    const b = {};
    for (const [cote, liste] of Object.entries(cotes)) {
      b[cote] = { charge: 0, atomes: {} };
      for (const [id, c] of Object.entries(liste)) {
        const s = especes[id];
        b[cote].charge += c * s.z;
        for (const [e, k] of Object.entries(atomes(s.f))) b[cote].atomes[e] = (b[cote].atomes[e] || 0) + c * k;
      }
    }
    return b;
  }

  const pgcd = (a, b) => (b ? pgcd(b, a % b) : a);
  const egal = (a, b) => a.length === b.length && a.every((x) => b.includes(x));

  function verifier(p, attendue, especes) {
    // Bonne espèce de chaque côté, conservation des éléments et des charges, coefficients les plus petits.
    const b = bilan(p, especes), R = Object.keys(p.reactifs), P = Object.keys(p.produits), nom = (id) => ecrire(especes[id].f, especes[id].z);
    const intrus = [...R, ...P].find((id) => !attendue.reactifs.includes(id) && !attendue.produits.includes(id));
    const erreur = (t) => ({ juste: false, erreur: t, bilan: b });
    if (intrus) return erreur(`${nom(intrus)} ne réagit pas (ion spectateur ou espèce absente) : retirez-le.`);
    if (!egal(R, attendue.reactifs)) return erreur(R.some((id) => attendue.produits.includes(id)) ? "Un produit est placé avec les réactifs." : "Il manque un réactif.");
    if (!egal(P, attendue.produits)) return erreur(P.some((id) => attendue.reactifs.includes(id)) ? "Un réactif est placé avec les produits." : "Il manque un produit.");
    const elements = new Set([...Object.keys(b.reactifs.atomes), ...Object.keys(b.produits.atomes)]);
    for (const e of elements) if ((b.reactifs.atomes[e] || 0) !== (b.produits.atomes[e] || 0)) return erreur(`L'élément ${e} n'est pas conservé : ajustez les coefficients.`);
    if (b.reactifs.charge !== b.produits.charge) return erreur("La charge électrique n'est pas conservée : ajustez les coefficients.");
    if ([...Object.values(p.reactifs), ...Object.values(p.produits)].reduce(pgcd) > 1) return erreur("Équation juste, mais prenez les plus petits coefficients entiers.");
    return { juste: true, erreur: "", bilan: b };
  }

  L.EQUATION = { atomes, ecrire, bilan, verifier };
})(window.Labo);
