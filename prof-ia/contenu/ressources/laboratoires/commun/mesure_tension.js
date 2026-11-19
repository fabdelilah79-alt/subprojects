/*
Rôle : reconnaît la tension que mesure un voltmètre : U_XY, où X est le point relié à sa borne VΩ et Y le point relié à
       sa borne COM (points nommés par des lettres : P, N, A, B...). On prend d'abord la borne où arrive le fil de
       mesure ; si elle n'a pas de lettre, un point relié à elle par des fils.
Reçoit : le circuit (circuit.js), le multimètre, les points { lettre : clé de borne « composant.borne » }.
Produit : Labo.tension_mesuree(circuit, multimetre, points) -> { nom: "XY", valeur (V) } ou null (pas en voltmètre continu,
          calibre dépassé, ou fils non branchés sur des points nommés).
Utilisé par : les postes des simulations de tension.
*/
(function (L) {
  function point_de(c, cle_borne, points) {
    // Lettre du point où arrive le fil branché sur cette borne du multimètre.
    const lettre_de = (cle) => Object.keys(points).find((k) => points[k] === cle);
    for (const f of c.fils) {
      const autre = f.a === cle_borne ? f.b : f.b === cle_borne ? f.a : null;
      if (autre && lettre_de(autre)) return lettre_de(autre);
    }
    return Object.keys(points).find((k) => c.meme_noeud(cle_borne, points[k])) || null;
  }

  L.tension_mesuree = function (c, m, points) {
    // Nom et valeur de la tension lue, si le multimètre est un voltmètre continu bien branché.
    const mode = L.MULTIMETRE_MODES.find((k) => k.nom === m.mode);
    if (!mode || mode.type !== "V" || m.depasse) return null;
    const x = point_de(c, `${m.id}.VΩ`, points), y = point_de(c, `${m.id}.COM`, points);
    if (!x || !y || x === y) return null;
    return { nom: x + y, valeur: Math.round(m.valeur * 1000) / 1000 };
  };
})(window.Labo);
