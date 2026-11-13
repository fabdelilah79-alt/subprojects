/*
Rôle : vérifications des missions « énergie mécanique du pendule pesant » : lâcher et acquisition en vue « Énergies »,
       tableau t, Ec, Epp, Em lu au curseur, énergie mécanique au lâcher et vitesses maximales.
Reçoit : les faits (« lachers_pesant », « acquisition ») et la feuille du tableur.
Produit : Labo.verif_energie_pendule = { vue_energies(test, duree), em0(f) (mJ), omega_max(f) (rad/s), echanges }.
Utilisé par : simulation.js.
*/
(function (L) {
  const LP = (f) => f.lachers_pesant || [], M = () => L.pendule_pesant_modele, R = Math.PI / 180;
  const dernier = (f, test) => LP(f).filter(test).slice(-1)[0];

  const vue_energies = (test, duree) => ({ faits }) => {
    // Dernier lâcher conforme au test, acquisition de la durée demandée terminée, vue « Énergies » affichée.
    const q = faits.acquisition || {}, l = LP(faits).slice(-1)[0], der = (q.courbes || []).slice(-1)[0];
    if (!l || !test(l) || q.etat !== "terminée") return false;
    if (q.duree !== duree) return `Choisissez la durée ${duree} s avant « Acquérir ».`;
    if (!der || der.etiquette.includes("palette") !== !!l.palette) return false;
    return q.vue === "energies" || "Touchez « Énergies » dans le logiciel.";
  };

  function em0(f) {
    // Énergie mécanique au lâcher (mJ) du dernier lâcher sans palette : M·g·a·(1 − cos θ0), Epp = 0 à l'équilibre.
    const l = dernier(f, (x) => !x.palette) || { d: 0.4, theta0: 30 };
    return M().Ma(l.d, false) * L.pendule.G * (1 - Math.cos(l.theta0 * R)) * 1000;
  }

  function omega_max(f) {
    // Vitesse angulaire au passage par l'équilibre : θ̇max = √(2·Em / J).
    const l = dernier(f, (x) => !x.palette) || { d: 0.4 };
    return Math.sqrt((2 * em0(f)) / 1000 / M().J(l.d, false));
  }

  function echanges({ faits, feuille }) {
    // A : t ; B : Ec ; C : Epp ; D : Em (mJ, lus au curseur) ; D = B + C, Em ≈ Em au lâcher (3 %) ; cinq instants, Ec et Epp
    // tour à tour plus grande.
    const v = (c, n) => feuille.valeur_sure(`${c}${n}`), e0 = em0(faits), instants = new Set();
    let ec = false, ep = false;
    for (let n = 2; n <= 12; n++) {
      if (v("A", n) === null) continue;
      if ([v("B", n), v("C", n), v("D", n)].some((x) => x === null || x < 0)) return `Ligne ${n} : Ec en B, Epp en C, Em en D (mJ), lues au curseur.`;
      if (Math.abs(v("D", n) - v("B", n) - v("C", n)) > 0.05) return `Ligne ${n} : Em = Ec + Epp.`;
      if (Math.abs(v("D", n) - e0) > 0.03 * e0) return `Ligne ${n} : ces valeurs ne sont pas celles de la dernière acquisition sans palette.`;
      instants.add(v("A", n)); ec ||= v("B", n) > v("C", n); ep ||= v("C", n) > v("B", n);
    }
    return (instants.size >= 5 && ec && ep) || (instants.size >= 5 ? "Choisissez des instants où Ec est la plus grande, et d'autres où c'est Epp." : false);
  }

  L.verif_energie_pendule = { vue_energies, em0, omega_max, echanges };
})(window.Labo);
