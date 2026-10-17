/*
Rôle : gestes de la paillasse de chromatographie : le crayon trace la ligne de dépôt (on peut la retracer tant qu'il
       n'y a pas de dépôt), marque le front, entoure les taches
       vues sous UV ; la pointe d'un capillaire dépose une goutte ; la plaque se porte dans la cuve (couvercle ôté), dans
       le bocal de diiode, ou revient sur son support ; toucher le haut de la cuve pose ou ôte le couvercle ; toucher le
       bidon vide la cuve.
Reçoit : le contexte de la paillasse et l'état partagé de la paillasse (s) construit par poste_ccm.js.
Produit : Labo.gestes_ccm(ctx, s).
Utilisé par : poste_ccm.js.
*/
(function (L) {
  const E = 1.6;
  const sur_plaque = (s, p) => s.lieu === "support" && p.x >= s.SUPPORT.x - 4 && p.x <= s.SUPPORT.x + 84 && p.y <= s.SUPPORT.y + 4 && p.y >= s.SUPPORT.y - 164;
  const mm = (s, p) => ({ x: (p.x - s.SUPPORT.x) / E, y: (s.SUPPORT.y - p.y) / E });

  function crayon(s, p) {
    // Le crayon trace la ligne de dépôt, puis marque le front ; sous UV, il entoure les taches.
    if (s.lieu === "cuve") return s.dire("Sortez d'abord la plaque de la cuve.");
    if (!sur_plaque(s, p)) return;
    const q = mm(s, p), e = s.plaque.etat;
    if (s.uv) s.plaque.entourer(q.x, q.y);
    else if (!e.depots.length && !e.front) { if (q.y < 4 || q.y > 25) return s.dire("Tracez la ligne en bas de la plaque, à environ 1 cm du bord."); s.plaque.tracer_ligne(q.y); s.dire(""); }
    else if (e.front && !e.front_marque) { s.plaque.marquer_front(q.y); if (!e.front_marque) s.dire("Visez la limite de la partie mouillée (le front de l'éluant)."); }
    s.maj();
  }

  function capillaire(s, ech, p) {
    // Une goutte de l'échantillon là où la pointe touche la plaque (sur la ligne de dépôt).
    if (!sur_plaque(s, p)) return;
    const e = s.plaque.etat, q = mm(s, p);
    if (!e.ligne) return s.dire("Tracez d'abord la ligne de dépôt au crayon.");
    if (e.front) return s.dire("La plaque a déjà servi.");
    s.plaque.deposer(ech.n, ech.especes, q.x, q.y);
    s.dire(Math.abs(q.y - e.ligne) > 2 ? "Le dépôt doit être fait sur la ligne." : ""); s.maj();
  }

  function lacher_plaque(s, p) {
    // Plaque lâchée : dans la cuve (si elle est ouverte), dans le bocal de diiode, ou retour sur le support.
    const cx = p.x + 40, bouche = s.cuve.pose.y - s.cuve.pr.H * E;
    if (Math.abs(cx - s.cuve.pose.x) < 70 && p.y < s.cuve.pose.y && p.y > bouche - 240) {
      if (s.couvercle) { s.dire("Ôtez d'abord le couvercle de la cuve."); return s.placer("support"); }
      return s.placer("cuve");
    }
    if (s.IODE && Math.abs(cx - s.IODE.x) < 70 && p.y > s.IODE.sol - 260) return s.placer("iode");
    s.placer("support");
  }

  L.gestes_ccm = function (ctx, s) {
    // Branche les gestes ; l'état s est modifié, puis s.maj() redessine et note les faits.
    L.ccm.crayon(ctx, { x: 352, y: 566 }, (p) => crayon(s, p));
    L.ccm.capillaires(ctx, s.echantillons, (ech, p) => capillaire(s, ech, p));
    L.glissable(s.g_plaque, {
      debut: () => { if (s.lieu === "tenue") return null; if (s.lieu === "cuve" && s.couvercle) { s.dire("Ôtez d'abord le couvercle de la cuve."); return null; } return { ...s.pos }; },
      saisir: () => { s.lieu = "tenue"; ctx.haut.append(s.g_plaque); s.maj(); },
      deplacer: (p) => { s.pos = p; s.maj(); },
      lacher: (p) => lacher_plaque(s, p),
    });
    const zone = (x, y, r, f) => { const z = L.svg("circle", { cx: x, cy: y, r, fill: "#000", opacity: 0, role: "button" }, ctx.haut); L.glissable(z, { soulever: false, debut: () => ({ x: 0, y: 0 }), toucher: f }); };
    const bouche = s.cuve.pose.y - s.cuve.pr.H * E;
    zone(s.cuve.pose.x + 60, bouche - 4, 16, () => { s.couvercle = !s.couvercle; s.maj(); });
    zone(s.BIDON.x, s.BIDON.sol - 50, 28, () => { if (s.lieu === "cuve") return s.dire("Sortez d'abord la plaque."); s.cuve.c = L.contenu({}); s.dire("Éluant versé dans le bidon de récupération."); s.maj(); });
    if (s.LAMPE) zone(s.LAMPE.x + 120, s.LAMPE.y + 11, 12, () => { s.lampe = !s.lampe; s.maj(); });
  };
})(window.Labo);
