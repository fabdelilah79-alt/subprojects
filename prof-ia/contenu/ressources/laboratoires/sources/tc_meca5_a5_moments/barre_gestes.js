/*
Rôle : glisser-déposer des masses marquées sur la barre à trous : une masse lâchée près d'un trou libre y est accrochée ;
       reprise, elle se décroche ; lâchée ailleurs, elle retourne dans le coffret.
Reçoit : l'état de la barre (objets, angle) et ses fonctions (position d'un trou, calcul des moments, placement des objets).
Produit : Labo.barre_gestes(etat, fonctions).
Utilisé par : barre_moments.js.
*/
(function (L) {
  L.barre_gestes = function (e, { trou, etat_moments, placer_objets }) {
    // Chaque masse est déplaçable ; on cherche le trou libre le plus proche du crochet lâché.
    for (const o of e.objets) {
      L.glissable(o.g, {
        debut: () => ({ ...o.pos }),
        saisir: () => { if (o.trou !== undefined) { delete o.trou; etat_moments(e); } o.tenu = true; o.pendre(true); },
        deplacer: (p) => o.placer(p.x, p.y),
        lacher: (p) => {
          o.tenu = false;
          let meilleur = null;
          for (let d = -30; d <= 30; d += 5) {
            const q = trou(e.angle, d), libre = !e.objets.some((x) => x.trou === d), dist = Math.hypot(q.x - p.x, q.y + 4 - p.y);
            if (libre && dist < 24 && (!meilleur || dist < meilleur.dist)) meilleur = { d, dist };
          }
          if (meilleur) o.trou = meilleur.d;
          placer_objets(e);
          etat_moments(e);
        },
      });
    }
  };
})(window.Labo);
