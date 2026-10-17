/*
Rôle : ampoule à décanter de 125 mL (matériel physique) posée sur l'anneau de son support, et ses gestes : toucher le
       robinet (l'ouvrir, le fermer ; bouchée et sous pression, on la retourne et on dégaze), toucher le haut (ôter le
       bouchon), toucher le bouchon posé sur la paillasse (boucher). On la prend pour l'agiter : bouchée, le mélange
       devient une émulsion et le diiode passe dans le solvant ; sans bouchon, le liquide ballotte et peut déborder.
       Après agitation d'un solvant volatil, la pression monte dans l'ampoule bouchée.
Reçoit : le contexte de la paillasse (avec ctx.ecoulement), { x, y (pointe de la tige, px), sol, e } et dire(texte).
Produit : Labo.ampoule_support(ctx, reglage, dire) -> { r (récipient), pression, agitee, degaze }.
Utilisé par : poste_solvant.js.
*/
(function (L) {
  const ANNEAU = 128;

  function support(ctx, A, sol, e) {
    // Tige et socle, noix et anneau (moitié arrière derrière l'ampoule, moitié avant devant).
    const xt = A.x - 110, ya = A.y - e * ANNEAU;
    L.tige(ctx.fond, `M${xt} ${sol - 4} V${A.y - 260}`, 6); L.svg("rect", { x: xt - 60, y: sol - 8, width: 120, height: 10, rx: 2, fill: "#3a3f44" }, ctx.fond);
    L.tige(ctx.fond, `M${xt} ${ya} H${A.x - 46}`, 4);
    L.svg("rect", { x: xt - 7, y: ya - 7, width: 14, height: 14, rx: 2, fill: "#5d646a" }, ctx.fond);
    L.svg("path", { d: `M${A.x - 44} ${ya} A44 6 0 0 1 ${A.x + 44} ${ya}`, fill: "none", stroke: "#4d545a", "stroke-width": 4 }, ctx.fond);
    L.svg("path", { d: `M${A.x - 44} ${ya} A44 6 0 0 0 ${A.x + 44} ${ya}`, fill: "none", stroke: "#6d757b", "stroke-width": 4, "pointer-events": "none" }, ctx.devant);
    ctx.obstacles = [[xt - 60, xt + 60]];
  }

  function bouchon_pose(ctx, x, sol, quand) {
    // Bouchon en PTFE posé sur la paillasse (on le touche pour boucher l'ampoule).
    const g = L.svg("g", { class: "bouchon-pose", role: "button", "aria-label": "Bouchon" }, ctx.objets);
    L.svg("ellipse", { cx: x + 2, cy: sol, rx: 11, ry: 2.5, fill: "#000", opacity: 0.3 }, g);
    L.svg("path", { d: `M${x - 9} ${sol - 1} V${sol - 9} H${x + 9} V${sol - 1} Z`, fill: "#2f6fb8", stroke: "#1d3f6b", "stroke-width": 0.6 }, g);
    L.svg("path", { d: `M${x - 6} ${sol - 9} L${x - 5} ${sol - 24} H${x + 5} L${x + 6} ${sol - 9} Z`, fill: "#3b7cc4", stroke: "#1d3f6b", "stroke-width": 0.6 }, g);
    L.glissable(g, { soulever: false, debut: () => ({ x: 0, y: 0 }), toucher: quand });
    ctx.obstacles.push([x - 12, x + 12]);
    return g;
  }

  function zone(ctx, position, toucher) {
    // Zone invisible qui suit l'ampoule (robinet, haut du col).
    const z = L.svg("circle", { r: 15, fill: "#000", opacity: 0 }, ctx.haut);
    ctx.ecoulement.sur_pas(() => { const q = position(); z.setAttribute("cx", q.x); z.setAttribute("cy", q.y); });
    L.glissable(z, { soulever: false, debut: () => ({ x: 0, y: 0 }), toucher });
  }

  function degazer(ctx, a, dire) {
    // L'ampoule bouchée est soulevée, retournée (robinet vers le haut), on ouvre le robinet un instant : le gaz s'échappe.
    const r = a.r, e = r.pose.e, C0 = r.monde({ x: 0, y: -120 }), depart = { ...r.pose };
    r.tenu = true; ctx.haut.append(r.g);
    const placer = (lev, ang) => {
      const s = Math.sin((ang * Math.PI) / 180), c = Math.cos((ang * Math.PI) / 180);
      Object.assign(r.pose, { angle: ang, x: C0.x - 120 * e * s, y: C0.y - lev + 120 * e * c });
    };
    L.animer(1.6, (t) => {
      const k = t < 0.3 ? t / 0.3 : t > 0.7 ? (1 - t) / 0.3 : 1, ang = 180 * Math.min(1, Math.max(0, (t < 0.5 ? t - 0.1 : 0.9 - t) / 0.25));
      placer(110 * k, ang);
      if (t >= 0.5 && !a.degaze_vu) { a.degaze_vu = true; dire("Pschitt : le gaz s'échappe par le robinet, loin du visage."); }
    }, () => { Object.assign(r.pose, depart); r.tenu = false; ctx.objets.append(r.g); Object.assign(a, { pression: false, degaze: true, degaze_vu: false }); });
  }

  L.ampoule_support = function (ctx, { x, y, sol, e }, dire) {
    // Construit le support, l'ampoule (robinet ouvert au départ : il faut penser à le fermer) et ses gestes.
    support(ctx, { x, y }, sol, e);
    const r = L.recipient(ctx, { id: "ampoule", profil: "ampoule_125", x, y, robinet: true });
    r.robinet.ouvert = true;
    const a = { r, pression: false, agitee: false, degaze: false };
    L.manipuler(ctx, r, { sol, supports: [{ x, y, anneau: true }], pose_libre: false });
    const g_b = bouchon_pose(ctx, x + 70, sol, () => { if (r.tenu) return; r.bouchon = true; dire(""); });
    zone(ctx, () => r.monde({ x: 16, y: -r.pr.extras.robinet }), () => {
      if (r.tenu) return;
      if (r.bouchon && a.pression) return degazer(ctx, a, dire);
      r.robinet.ouvert = !r.robinet.ouvert; r.robinet.air = 0.4;
    });
    zone(ctx, () => r.monde({ x: 0, y: -r.pr.H - 4 }), () => {
      if (!r.bouchon || r.tenu) return;
      if (a.pression) return dire("Dégazez d'abord : le bouchon pourrait sauter et projeter du liquide !");
      r.bouchon = false; dire("");
    });
    ctx.ecoulement.sur_pas(() => {
      // Agitation bouchée : émulsion, et la vapeur du solvant fait monter la pression.
      g_b.style.display = r.bouchon ? "none" : "";
      if (r.bouchon && r.c.emulsion > (a.emulsion ?? 0) + 1e-4 && r.c.phases.some((p) => p.classe === "organique")) a.pression = true;
      if (r.c.emulsion > 0.9) a.agitee = true;
      a.emulsion = r.c.emulsion;
    });
    return a;
  };
})(window.Labo);
