/*
Rôle : agitateur en verre (baguette de 20 cm, 6 mm de diamètre), couché sur un papier absorbant : on le prend, on plonge
       sa pointe dans un récipient et on le déplace pour agiter. Plus on le remue vite, plus l'agitation est forte (elle
       accélère la dissolution, dissolution.js) ; le liquide est mis en mouvement (il ballotte, et déborde si l'on remue
       trop fort). La pointe ne traverse pas le fond. Lâché dans un récipient, il y reste appuyé ; ailleurs, il retourne sur le papier.
Reçoit : le contexte de la paillasse (avec ctx.ecoulement) et { x, sol, e (px/mm) }.
Produit : Labo.agitateur(ctx, reglage) -> a { pos (pointe, px), dans (récipient où est la pointe, ou null) } ; r.agitation (0 à 1).
Utilisé par : les simulations de chimie (dissolution, solutions).
*/
(function (L) {
  const LONG = 200, ANGLE = 12;

  function baguette(g) {
    // Baguette de verre, pointe en (0, 0), vers le haut (repère en mm) : verre plein, bouts arrondis, reflet.
    L.svg("rect", { x: -3, y: -LONG, width: 6, height: LONG, rx: 3, fill: "rgba(214,234,241,0.62)", stroke: "rgba(110,140,150,0.9)", "stroke-width": 0.45 }, g);
    L.svg("rect", { x: -1.6, y: -LONG + 4, width: 1.1, height: LONG - 8, fill: "#fff", opacity: 0.55 }, g);
    L.svg("rect", { x: -10, y: -LONG, width: 20, height: LONG, fill: "#000", opacity: 0 }, g);
  }

  L.agitateur = function (ctx, { x, sol, e = 1.6 }) {
    // Papier et baguette ; pendant qu'on la tient, sa vitesse dans un liquide donne l'agitation du récipient.
    const repos = { x: x - (LONG / 2) * e, y: sol - 3 * e }, a = { pos: { ...repos }, dans: null, tenu: false, mvt: null };
    L.svg("path", { d: `M${x - 118 * e} ${sol} l${10 * e} ${-6 * e} h${216 * e} l${-10 * e} ${6 * e} Z`, fill: "#f6f6f2", stroke: "#cfd2cc" }, ctx.fond);
    const g = L.svg("g", { class: "agitateur", role: "button", "aria-label": "Agitateur en verre" }, ctx.objets), corps = L.svg("g", {}, g);
    baguette(corps);
    const dessiner = () => {
      const couche = !a.tenu && !a.dans;
      g.setAttribute("transform", `translate(${a.pos.x} ${a.pos.y}) rotate(${couche ? 90 : ANGLE}) scale(${e})`);
    };
    const dans = (p) => ctx.ecoulement.recipients.find((r) => L.dans_polygone(r.interieur_monde(), p));
    const fond = (r) => r.pose.y - (r.pr.h0 + 1.5) * r.pose.e;
    function remuer(p) {
      // Nouvelle position de la pointe ; si elle est dans un liquide, sa vitesse agite le récipient.
      const t = performance.now() / 1000, m = a.mvt, r = dans(p) || (a.dans && Math.abs(p.x - a.pos.x) < 30 ? a.dans : null);
      if (r && p.y > fond(r)) p = { x: p.x, y: fond(r) };
      if (m && r) {
        const dt = Math.max(0.008, t - m.t), vx = (p.x - m.x) / dt, vy = (p.y - m.y) / dt, surface = r.pose.y - r.pr.hauteur_de(r.c.volume()) * r.pose.e;
        if (p.y > surface) { r.agitation = Math.max(r.agitation || 0, Math.min(1, Math.hypot(vx, vy) / 350)); r.acc.x += 0.25 * (vx - (m.vx || 0)); }
        a.mvt = { t, x: p.x, y: p.y, vx };
      } else a.mvt = { t, x: p.x, y: p.y, vx: 0 };
      a.pos = p; a.dans = r && L.dans_polygone(r.interieur_monde(), p) ? r : null; dessiner();
    }
    const ranger = () => { a.tenu = false; a.dans = null; a.pos = { ...repos }; ctx.objets.append(g); dessiner(); ctx.signaler?.(); };
    L.glissable(g, {
      soulever: false,
      // Couchée, on la saisit par le haut : la pointe est 15 cm sous la main.
      debut: (ev) => { if (!a.tenu && !a.dans) { const q = L.scene.vers_scene(ev), s = Math.sin((ANGLE * Math.PI) / 180), c = Math.cos((ANGLE * Math.PI) / 180); a.pos = { x: q.x - 150 * e * s, y: q.y + 150 * e * c }; } return { ...a.pos }; },
      saisir: () => { a.tenu = true; a.mvt = null; ctx.haut.append(g); dessiner(); },
      deplacer: remuer,
      lacher: () => { a.tenu = false; if (!a.dans) return ranger(); ctx.objets.append(g); dessiner(); ctx.signaler?.(); },
      toucher: ranger,
    });
    ctx.ecoulement.sur_pas(() => { if (a.dans && !a.tenu && (a.dans.tenu || !L.dans_polygone(a.dans.interieur_monde(), a.pos))) ranger(); });
    dessiner();
    return a;
  };
})(window.Labo);
