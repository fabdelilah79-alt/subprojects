/*
Rôle : bouilloire électrique de 0,5 L, aux vraies dimensions, pleine d'eau qui vient de bouillir (95 °C) : on la prend,
       on amène son bec au-dessus d'un bécher et on la lâche : elle s'incline autour de son bec et verse 100 mL (le filet
       tombe en chute libre, ecoulement.js), puis elle revient sur son socle. Mal placée, elle revient sans verser.
Reçoit : le contexte de la paillasse (avec ctx.ecoulement) et { x, sol (y du socle, px), e (px/mm) }.
Produit : Labo.bouilloire(ctx, reglage) -> { V (mL restants), verse (vrai pendant qu'elle verse) }.
Utilisé par : postes_a1.js.
*/
(function (L) {
  const BEC = { x: 80, y: -112 }, T_EAU = 95, DEBIT = 25, DOSE = 100;

  function dessin(g, vapeur) {
    // Bouilloire (repère en mm, milieu du fond en (0, 0)) : socle, corps évasé en inox, couvercle, poignée noire, bec, niveau.
    g.replaceChildren();
    L.svg("path", { d: "M44 -76 L80 -112 L84 -108 L52 -66 Z", fill: "#d4d7d4", stroke: "#8c918a", "stroke-width": 0.6 }, g);
    L.svg("path", { d: "M-46 -6 Q-42 -96 -34 -112 H34 Q42 -96 46 -6 Z", fill: "url(#metal)", stroke: "#7d8288", "stroke-width": 0.8 }, g);
    L.svg("ellipse", { cx: 0, cy: -112, rx: 34, ry: 5, fill: "#dfe1dd", stroke: "#8c918a", "stroke-width": 0.6 }, g);
    L.svg("rect", { x: -6, y: -120, width: 12, height: 7, rx: 2, fill: "#2b2f33" }, g);
    L.svg("path", { d: "M-40 -100 Q-74 -96 -70 -60 Q-68 -30 -44 -24", stroke: "#2b2f33", "stroke-width": 9, fill: "none", "stroke-linecap": "round" }, g);
    L.svg("rect", { x: -30, y: -90, width: 8, height: 70, rx: 3, fill: "#2b2f33" }, g);
    L.svg("rect", { x: -28.5, y: -70, width: 5, height: 48, rx: 2, fill: "#8fd0ee" }, g);
    L.svg("rect", { x: -50, y: -6, width: 100, height: 8, rx: 3, fill: "#2b2f33" }, g);
    if (vapeur) L.svg("path", { d: "M82 -116 q-6 -9 0 -18 q6 -9 0 -18", stroke: "#fff", "stroke-width": 3, opacity: 0.4, fill: "none" }, g);
  }

  function cible_sous(ctx, p) {
    // Bécher ouvert dont l'ouverture est sous le bec (à moins de 15 cm).
    return ctx.ecoulement.recipients.find((q) => {
      const b = q.monde({ x: 0, y: -q.pr.H });
      return !q.bouchon && Math.abs(p.x - b.x) < q.pr.r(q.pr.H) * q.pose.e - 6 && p.y < b.y - 4 && p.y > b.y - 240;
    });
  }

  L.bouilloire = function (ctx, { x, sol, e = 1.6 }) {
    // Construit la bouilloire et le geste « amener le bec au-dessus du bécher, lâcher : elle verse ».
    const k = { V: 500, verse: false, g: L.svg("g", { class: "bouilloire", role: "button", "aria-label": "Bouilloire" }, ctx.objets) };
    const source = { c: L.contenu({ eau: 1 }), interieur_monde: () => [] };
    const placer = (p, angle = 0) => {
      // Position du fond (p) ; inclinée, elle tourne autour de son bec.
      const bec = { x: p.x + BEC.x * e, y: p.y + BEC.y * e };
      k.g.setAttribute("transform", `translate(${bec.x} ${bec.y}) rotate(${angle}) translate(${-BEC.x * e} ${-BEC.y * e}) scale(${e})`);
      return bec;
    };
    const ranger = () => { dessin(k.g, true); placer({ x, y: sol }); ctx.objets.append(k.g); k.verse = false; };
    const verser = (p, bec) => {
      // Inclinaison (0,4 s), écoulement de 100 mL à 25 mL/s, puis retour sur le socle.
      k.verse = true; let t = 0, verse = 0;
      const pas = setInterval(() => {
        t += 0.05;
        placer(p, Math.min(1, t / 0.4) * 42);
        if (t > 0.4 && verse < DOSE && k.V > 0) {
          const v = Math.min(DEBIT * 0.05, DOSE - verse, k.V); verse += v; k.V -= v;
          ctx.ecoulement.emettre(source, bec, { x: 30, y: 30 }, [{ classe: "aqueuse", liquides: { eau: v }, dissous: {}, T: T_EAU }], v);
        }
        if (verse >= DOSE || k.V <= 0) { clearInterval(pas); setTimeout(ranger, 300); }
      }, 50);
    };
    L.glissable(k.g, {
      debut: () => (k.verse ? null : { x, y: sol }),
      saisir: () => { ctx.haut.append(k.g); dessin(k.g, false); },
      deplacer: (p) => placer(p),
      lacher: (p) => {
        // Au-dessus d'un bécher, on la tient assez haut (bec 8 cm au-dessus du bord) pour qu'en s'inclinant elle ne le touche pas.
        const q = cible_sous(ctx, placer(p));
        if (!q) return ranger();
        const haut = { x: p.x, y: p.y - Math.max(0, placer(p).y - (q.monde({ x: 0, y: -q.pr.H }).y - 128)) };
        verser(haut, placer(haut));
      },
    });
    ranger();
    return k;
  };
})(window.Labo);
