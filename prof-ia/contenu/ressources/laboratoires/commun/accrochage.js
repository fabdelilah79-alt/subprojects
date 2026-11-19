/*
Rôle : règles du glisser-déposer de la paillasse du poids : on accroche les objets en chaîne sous le dynamomètre
       (seul le dernier se décroche), on les repose sur la paillasse ou dans le coffret ; on note les mesures faites.
Reçoit : le dynamomètre (ou tout objet qui a crochet(), charger(N), sur_mouvement(), calibre), les objets, les calques SVG,
         les places du coffret et sa zone { x1, x2, base }, le préfixe des faits notés (plusieurs paillasses).
Produit : Labo.accrochage(reglages) ; faits notés : poids_accroche, poids_mesures (masses en kg), poids_surcharge, caillou_pese.
Utilisé par : poste_poids.js (tc_meca1_o3_poids), le poste du ressort (tc_meca5_a1_ressort).
*/
(function (L) {
  const G = 9.81;
  const PRISE_PX = 34;

  L.accrochage = function ({ dyn, objets, calques, places, cible, coffret = { x1: 140, x2: 380, base: 490 }, prefixe = "" }) {
    // Branche le glisser-déposer de chaque objet et la mise à jour de la chaîne suspendue.
    const chaine = [];
    const mesures = new Set();

    function point_libre() {
      // Où accrocher l'objet suivant : au crochet, ou sous le dernier objet s'il a un anneau.
      if (!chaine.length) return dyn.crochet();
      const dernier = chaine[chaine.length - 1];
      return dernier.accroche_dessous ? dernier.dessous() : null;
    }

    function suivre_ressort() {
      // Les objets suspendus suivent le crochet qui oscille.
      let p = dyn.crochet();
      for (const o of chaine) { o.placer(p.x, p.y); p = o.dessous(); }
    }

    function noter_mesure() {
      // Ressort immobile : on note ce qui a été pesé.
      const poids = chaine.reduce((s, o) => s + o.masse_kg * G, 0);
      L.missions.noter(prefixe + "poids_surcharge", poids > dyn.calibre);
      if (!chaine.length) return;
      L.missions.noter(prefixe + "poids_accroche", true);
      if (chaine.some((o) => o.type === "caillou")) L.missions.noter(prefixe + "caillou_pese", true);
      else if (poids <= dyn.calibre) {
        mesures.add(Math.round(chaine.reduce((s, o) => s + o.masse_kg, 0) * 1000) / 1000);
        L.missions.noter(prefixe + "poids_mesures", [...mesures]);
      }
    }

    function recharger() {
      // Le poids accroché a changé : le ressort oscille vers sa nouvelle position.
      dyn.charger(chaine.reduce((s, o) => s + o.masse_kg * G, 0));
    }

    function ranger_posees() {
      // Les objets posés plus en avant passent devant les autres.
      [...calques.poses.children].sort((a, b) => a.objet.base - b.objet.base).forEach((g) => calques.poses.append(g));
    }

    function poser(o, x, base, anime) {
      // Pose l'objet debout sur la paillasse (ou dans le coffret), base au niveau « base ».
      o.pendre(false);
      o.lieu = "pose";
      o.base = base;
      calques.poses.append(o.g);
      const arrivee = { x, y: base - o.hauteur_debout };
      if (anime) L.tomber(o.g, { ...o.pos }, arrivee, () => o.placer(arrivee.x, arrivee.y));
      else o.placer(arrivee.x, arrivee.y);
      ranger_posees();
    }

    function lacher(o, p) {
      // Décide où va l'objet lâché : au crochet, dans le coffret, sur la paillasse, ou il tombe.
      cible.classList.remove("active");
      const libre = point_libre();
      if (libre && Math.hypot(p.x - libre.x, p.y - libre.y) < PRISE_PX) {
        chaine.push(o);
        o.lieu = "chaine";
        calques.suspendus.append(o.g);
        suivre_ressort();
        return recharger();
      }
      const base = p.y + o.hauteur_debout;
      if (o.place !== undefined && p.x > coffret.x1 && p.x < coffret.x2 && base > coffret.base - 60 && base < coffret.base + 55) return poser(o, places[o.place], coffret.base, true);
      if (base > 440 && base < 578) return poser(o, p.x, base, false);
      poser(o, Math.max(30, Math.min(1000, p.x)), 545, true);
    }

    function rendre_mobile(o) {
      // Réactions de l'objet au glisser-déposer.
      L.glissable(o.g, {
        debut: () => (o.lieu === "chaine" && chaine[chaine.length - 1] !== o ? null : { ...o.pos }),
        saisir: () => {
          if (o.lieu === "chaine") { chaine.pop(); recharger(); }
          o.lieu = "main";
          o.pendre(true);
          calques.main.append(o.g);
        },
        deplacer: (p) => {
          o.placer(p.x, p.y);
          const libre = point_libre();
          if (libre) { L.placer(cible, libre.x, libre.y); cible.classList.toggle("active", Math.hypot(p.x - libre.x, p.y - libre.y) < PRISE_PX * 1.6); }
        },
        lacher: (p) => lacher(o, p),
      });
    }

    objets.forEach((o) => {
      if (o.place !== undefined) poser(o, places[o.place], coffret.base, false);
      rendre_mobile(o);
    });
    dyn.sur_mouvement((repos) => { suivre_ressort(); if (repos) noter_mesure(); });
    return { poser };
  };
})(window.Labo);
