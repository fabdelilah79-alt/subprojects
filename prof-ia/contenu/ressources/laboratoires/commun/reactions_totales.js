/*
Rôle : réactions totales entre espèces dissoutes d'un récipient (acide-base, oxydoréduction) : dès que les réactifs d'une
       réaction sont réunis, elle avance jusqu'à épuisement du réactif limitant (une seule réaction à la fois, flèche
       simple, comme le demandent les orientations). Quantités en mmol (concentration en mol/L × volume en mL).
Reçoit : les réactions déclarées par acide_base.js et oxydoreduction.js ; le contenu d'un récipient (liquide_contenu.js).
Produit : Labo.reaction({ equation, reactifs { espèce: coefficient }, produits { espèce: coefficient } }) (déclare une
          réaction) ; Labo.reagir(contenu) -> vrai si une réaction a eu lieu (contenu.reactions : équations déjà observées) ;
          Labo.concentration(phase, espèce) (mol/L).
Utilisé par : les postes des simulations de titrage, d'acide-base et d'oxydoréduction.
*/
(function (L) {
  const REACTIONS = [];
  L.reaction = (r) => REACTIONS.push(r);
  L.concentration = (ph, s) => (ph && ph.V > 0 ? (ph.dissous[s] || 0) / ph.V : 0);

  function avancer(ph, r) {
    // Avancement maximal x = min(n / coefficient) des réactifs ; les quantités deviennent n − a·x et n + b·x.
    const x = Math.min(...Object.entries(r.reactifs).map(([s, a]) => (ph.dissous[s] || 0) / a));
    if (!(x > 1e-9)) return false;
    for (const [s, a] of Object.entries(r.reactifs)) ph.dissous[s] = Math.max(0, ph.dissous[s] - a * x);
    for (const [s, b] of Object.entries(r.produits)) ph.dissous[s] = (ph.dissous[s] || 0) + b * x;
    return true;
  }

  L.reagir = function (c) {
    // Fait avancer chaque réaction possible, jusqu'à ce qu'aucune ne puisse plus avoir lieu.
    const ph = c.phases.find((p) => p.classe === "aqueuse");
    let change = false;
    if (!ph) return false;
    for (let tour = 0; tour < 6; tour++) {
      let encore = false;
      for (const r of REACTIONS) if (avancer(ph, r)) { encore = change = true; (c.reactions ??= new Set()).add(r.equation); }
      if (!encore) break;
    }
    return change;
  };
})(window.Labo);
