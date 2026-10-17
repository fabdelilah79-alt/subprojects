/*
Rôle : gestes du montage à reflux : entonnoir (sur le col du ballon, où il reçoit ce que l'on verse, ou dans son anneau),
       réfrigérant à boules (on le pose sur le col, entonnoir ôté ; on ne le déplace pas pendant la chauffe), pierre
       ponce, robinet d'eau, touche Marche/Arrêt du chauffe-ballon ; tuyaux d'eau qui suivent le réfrigérant.
Reçoit : le contexte de la paillasse et l'état s du montage (montage_reflux.js).
Produit : Labo.gestes_reflux(ctx, s) ; s.maj() redessine entonnoir, réfrigérant et tuyaux, puis appelle s.sur_maj().
Utilisé par : montage_reflux.js.
*/
(function (L) {
  const VERRE = { fill: "rgba(205,228,236,0.5)", stroke: "rgba(120,150,160,0.9)", "stroke-width": 0.8 };
  const pres = (p, q, dx, dy) => Math.abs(p.x - q.x) < dx && Math.abs(p.y - q.y) < dy;

  function entonnoir(ctx, s) {
    // Entonnoir en verre (cône de 6 cm, tige de 6 cm) ; posé sur le col, il fait passer dans le ballon ce qui y tombe.
    const g = L.svg("g", { class: "entonnoir", role: "button", "aria-label": "Entonnoir" }, ctx.objets);
    L.svg("path", { d: "M-48 -80 Q0 -86 48 -80 L5 0 H-5 Z", ...VERRE }, g);
    L.svg("rect", { x: -4, y: 0, width: 8, height: 96, ...VERRE }, g);
    L.svg("path", { d: "M-40 -76 L-6 -6", stroke: "#fff", "stroke-width": 2, opacity: 0.5 }, g);
    s.pos_entonnoir = () => (s.entonnoir === "col" ? { x: s.COL.x, y: s.COL.y - 4 } : s.entonnoir === "tenu" ? s.p_ent : s.ANNEAU);
    ctx.ecoulement.ajouter_cible({
      contient: (p) => { if (s.entonnoir !== "col") return false; const o = s.pos_entonnoir(), ly = p.y - o.y; return ly > -80 && ly < 0 && Math.abs(p.x - o.x) < 5 + (43 * -ly) / 80; },
      recevoir: (gt) => gt.parts.forEach((q) => s.ballon.c.verser(q)),
      bouche: () => (s.entonnoir === "col" ? { x: s.COL.x, y: s.COL.y - 84, r: 48 } : null) || { x: -999, y: -999, r: 0 },
    });
    L.glissable(g, { debut: () => ({ ...s.pos_entonnoir() }), saisir: () => { s.entonnoir = "tenu"; s.p_ent = { ...s.pos_entonnoir() }; ctx.haut.append(g); }, deplacer: (p) => { s.p_ent = p; s.maj(); }, lacher: (p) => {
      if (pres(p, s.COL, 40, 70) && s.refrigerant === "monte") s.dire("Le réfrigérant est déjà posé sur le col.");
      s.entonnoir = pres(p, s.COL, 40, 70) && s.refrigerant !== "monte" ? "col" : "support"; ctx.objets.append(g); s.maj();
    } });
    return g;
  }

  function refrigerant(ctx, s) {
    // Réfrigérant couché sur la paillasse, ou posé (vertical) sur le col du ballon.
    const g = L.svg("g", { class: "refrigerant", role: "button", "aria-label": "Réfrigérant à boules" }, ctx.objets);
    L.glissable(g, {
      debut: () => { if (s.chauffe) { s.dire("Arrêtez d'abord le chauffage."); return null; } return { ...s.ref_pos }; },
      saisir: () => { s.refrigerant = "tenu"; ctx.haut.append(g); },
      deplacer: (p) => { s.ref_pos = p; s.maj(); },
      lacher: (p) => {
        const ok = pres(p, s.COL, 40, 70) && s.entonnoir !== "col";
        if (pres(p, s.COL, 40, 70) && !ok) s.dire("Ôtez d'abord l'entonnoir du col.");
        s.refrigerant = ok ? "monte" : "repos"; s.ref_pos = ok ? { ...s.COL } : { ...s.REPOS }; ctx.objets.append(g); s.maj();
      },
    });
    return g;
  }

  function tuyau(g, de, vers, u) {
    // Tuyau souple qui arrive dans l'axe de l'olive et s'enfile dessus (pas de fuite).
    const st = { stroke: "#c9a96b", "stroke-width": 9, fill: "none", "stroke-linecap": "round" };
    L.svg("path", { d: `M${de.x} ${de.y} C${de.x} ${de.y + 70} ${vers.x + 50 * u.x} ${vers.y + 50 * u.y} ${vers.x + 4 * u.x} ${vers.y + 4 * u.y}`, ...st }, g);
    L.svg("path", { d: `M${vers.x + 4 * u.x} ${vers.y + 4 * u.y} L${vers.x - 10 * u.x} ${vers.y - 10 * u.y}`, ...st, stroke: "#b8955a", "stroke-linecap": "butt" }, g);
  }

  L.gestes_reflux = function (ctx, s) {
    // Branche les gestes et définit s.maj().
    const g_ent = entonnoir(ctx, s), g_ref = refrigerant(ctx, s);
    L.pierre_ponce(ctx, { x: s.PONCE_X || 700, sol: 576, ouverture: () => ({ x: s.COL.x, y: s.entonnoir === "col" ? s.COL.y - 84 : s.COL.y }), quand: () => { s.ponce = true; s.maj(); } });
    L.bouton_rond(ctx.haut, s.ROBINET.x + 16, s.ROBINET.y - 12, "", () => { s.eau = !s.eau; s.maj(); }, 6);
    L.bouton_rond(ctx.haut, s.CH.x + 18, s.CH.haut + 98, "I/O", () => { if (!s.chauffe && s.ballon.c.volume() < 1) return s.dire("Le ballon est vide."); s.chauffe = !s.chauffe; s.maj(); }, 8);
    s.maj = () => {
      const o = s.pos_entonnoir();
      L.placer(g_ent, o.x, o.y);
      const angle = s.refrigerant === "repos" ? -90 : 0, a = (angle * Math.PI) / 180, u = { x: Math.cos(a), y: Math.sin(a) };
      L.refrigerant_boules(g_ref, s.ref_pos, angle, { eau: s.eau, reflux: s.ebullition && s.refrigerant === "monte" && s.eau });
      const em = L.refrigerant_boules.embouts(s.ref_pos, angle);
      s.g_tuyaux.replaceChildren();
      tuyau(s.g_tuyaux, { x: s.ROBINET.x, y: s.ROBINET.y + 8 }, em.entree, u);
      tuyau(s.g_tuyaux, { x: s.EVIER.x - 24, y: s.EVIER.y - 4 }, em.sortie, u);
      s.sur_maj?.();
    };
  };
})(window.Labo);
