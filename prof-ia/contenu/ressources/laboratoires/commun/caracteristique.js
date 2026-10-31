/*
Rôle : relevé des points de la caractéristique d'un dipôle : à chaque changement du circuit, si l'ampèremètre est en
       série avec le dipôle et le voltmètre branché à ses bornes, le point (I, U) lu sur les appareils est enregistré
       (convention récepteur : I de la borne a vers la borne b, U = U_ab). Vérification d'une feuille du tableur.
Reçoit : le circuit, l'ampèremètre, le voltmètre, le dipôle { a, b (clés des bornes), courant() (A, de a vers b) } et un nom.
Produit : Labo.suivre_caracteristique(c, reglage) ; fait noté « points_<nom> » = [{ I (A), U (V) }] ;
          Labo.feuille_points(feuille, points, { min, colonnes }) -> vrai ou message (lignes I, U du tableur).
Utilisé par : les postes des simulations de caractéristiques et de point de fonctionnement.
*/
(function (L) {
  const type = (m) => (L.MULTIMETRE_MODES.find((k) => k.nom === m.mode) || {}).type;

  function lecture(c, ampere, volt, d) {
    // Point (I, U) du dipôle, si les deux appareils le mesurent bien ; sinon null.
    if (type(ampere) !== "A" || ampere.depasse || type(volt) !== "V" || volt.depasse) return null;
    const v = `${volt.id}.VΩ`, m = `${volt.id}.COM`, sens = c.meme_noeud(v, d.a) && c.meme_noeud(m, d.b) ? 1 : c.meme_noeud(v, d.b) && c.meme_noeud(m, d.a) ? -1 : 0;
    const i = d.courant();
    if (!sens || Math.abs(Math.abs(ampere.valeur) - Math.abs(i)) > 0.01 * Math.abs(i) + 2e-5) return null;
    const I = Math.sign(i || 1) * Math.abs(ampere.valeur), arrondi = (x, p) => Number((Math.round(x / p) * p).toFixed(6));
    return { I: arrondi(I, 1e-5), U: arrondi(sens * volt.valeur, 1e-3) };
  }

  L.suivre_caracteristique = function (c, { ampere, volt, dipole, nom }) {
    // Enregistre chaque nouveau point (un par valeur de U au centième de volt près).
    const points = {};
    c.sur_calcul(() => {
      const p = lecture(c, ampere, volt, dipole);
      if (!p) return;
      points[p.U.toFixed(2)] = p;
      L.missions.noter(`points_${nom}`, Object.values(points).sort((x, y) => x.I - y.I || x.U - y.U));
    });
  };

  L.feuille_points = function (feuille, points, { min = 6, colonnes = ["A", "B"] } = {}) {
    // Chaque ligne du tableur (I en A, U en V) doit être un point mesuré ; il en faut au moins min.
    const lignes = feuille.lignes(colonnes);
    for (const [k, l] of lignes.entries()) {
      const ok = (points || []).some((p) => Math.abs(l[colonnes[0]] - p.I) <= 6e-4 && Math.abs(l[colonnes[1]] - p.U) <= 0.015);
      if (!ok) return `Ligne ${k + 2} : ce point (I en A, U en V) ne correspond à aucune mesure faite.`;
    }
    return lignes.length >= min || false;
  };
})(window.Labo);
