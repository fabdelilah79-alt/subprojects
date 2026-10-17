/*
Rôle : vérifications des missions de l'activité « masse des atomes » : atome construit sur le tableau (Z, N, électrons,
       répartition sur les couches), tableur des masses d'atomes, pesée du cylindre de cuivre.
Reçoit : les faits « atome » et « pesee », la feuille de calcul.
Produit : Labo.VERIF_ATOME = { construit(Z, A, couches), masses, pesee_cuivre, N_cuivre } ; Labo.MASSES_PARTICULES.
Utilisé par : simulation.js.
*/
(function (L) {
  const mp = 1.673e-27, mn = 1.675e-27, me = 9.11e-31;
  const ATOMES = { "1/1": "hydrogène", "6/12": "carbone", "13/27": "aluminium", "29/63": "cuivre" };
  const masse = (Z, A) => Z * mp + (A - Z) * mn + Z * me;

  function repartition(e) {
    // Répartition attendue des électrons sur K, L, M (Z ≤ 18) : on remplit les couches dans l'ordre.
    const K = Math.min(2, e), Lc = Math.min(8, e - K);
    return { K, L: Lc, M: e - K - Lc };
  }

  function construit(Z, A, e = Z, verifier_couches = false) {
    // L'atome (ou l'ion) du tableau a Z protons, A − Z neutrons, e électrons (et, si demandé, les couches remplies dans l'ordre).
    return ({ faits }) => {
      const a = faits.atome || {};
      if (a.p !== Z || a.n !== A - Z || a.e !== e) {
        if (a.p + a.n === A && a.p !== Z) return `Le noyau a bien ${A} nucléons, mais il faut Z = ${Z} protons.`;
        return false;
      }
      const r = repartition(e);
      if (verifier_couches && (a.K !== r.K || a.L !== r.L || a.M !== r.M)) return "Le nombre d'électrons est juste, mais remplissez les couches dans l'ordre : d'abord K (2 au plus), puis L (8 au plus), puis M.";
      return true;
    };
  }

  function masses({ feuille }) {
    // Quatre atomes du tableau ; m atome à 0,5 % près ; rapport m noyau / m atome à 0,0003 près.
    const lignes = feuille.lignes(["A", "B", "C", "D"]);
    for (const [k, l] of lignes.entries()) {
      if (!ATOMES[`${l.A}/${l.B}`]) return `Ligne ${k + 2} : Z (colonne A) et A (colonne B) doivent être ceux d'un atome de la liste (¹H, ¹²C, ²⁷Al, ⁶³Cu).`;
      const m = masse(l.A, l.B);
      if (Math.abs(l.C - m) > 0.005 * m) return `Ligne ${k + 2} : m = Z × m(proton) + (A − Z) × m(neutron) + Z × m(électron), en kg.`;
      if (Math.abs(l.D - (m - l.A * me) / m) > 0.0003) return `Ligne ${k + 2} : la masse du noyau est Z × m(proton) + (A − Z) × m(neutron) ; divisez-la par la masse de l'atome.`;
    }
    return new Set(lignes.map((l) => `${l.A}/${l.B}`)).size >= 4 || false;
  }

  function pesee_cuivre({ faits }) {
    // Le cylindre de cuivre est seul sur le plateau d'une balance allumée et la lecture est stable.
    const p = faits.pesee || {};
    if (p.sur_balance?.length > 1) return "Posez le cylindre de cuivre seul sur le plateau.";
    return (p.sur_balance?.[0] === "cuivre" && p.lecture > 1) || false;
  }

  const N_cuivre = (faits) => (faits.pesee_cuivre || 54.05) * 1e-3 / masse(29, 63);
  L.VERIF_ATOME = { construit, masses, pesee_cuivre, N_cuivre };
  L.MASSES_PARTICULES = { mp, mn, me };
})(window.Labo);
