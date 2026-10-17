/*
Rôle : accessoires mobiles d'une fiole jaugée, aux vraies dimensions : un entonnoir à solide en verre (cône de 60 mm, tige
       large de 9 mm), posé dans le col de la fiole ou rangé dans un erlenmeyer ; ce qui tombe dans son cône (poudre, eau)
       descend dans la fiole. Le bouchon en polypropylène, posé à l'envers sur la paillasse : glissé sur le col, il
       bouche la fiole (impossible tant que l'entonnoir est en place) ; touché sur la fiole, il retourne sur la paillasse.
       On ne déplace pas la fiole tant que l'entonnoir y est posé.
Reçoit : le contexte de la paillasse (avec ctx.ecoulement), la fiole (recipient_physique.js) et { x (place de repos), sol, e, dire }.
Produit : Labo.entonnoir_fiole(ctx, fiole, reglage) -> { sur_fiole } ; Labo.bouchon_fiole(ctx, fiole, reglage).
Utilisé par : les simulations de chimie (préparation de solutions).
*/
(function (L) {
  const CONE = [[-4.5, 0], [-5, -30], [-30, -70], [30, -70], [5, -30], [4.5, 0]];
  const verre = { fill: "rgba(214,233,240,0.45)", stroke: "rgba(110,140,150,0.9)", "stroke-width": 0.45 };

  function entonnoir(g) {
    // Entonnoir, bout de la tige en (0, 0) (repère en mm) : cône, bord épais, tige, reflet.
    L.svg("path", { d: "M" + CONE.map((p) => p.join(" ")).join(" L") + " Z", ...verre }, g);
    L.svg("ellipse", { cx: 0, cy: -70, rx: 30, ry: 3.6, fill: "none", stroke: "rgba(235,246,250,0.9)", "stroke-width": 1.4 }, g);
    L.svg("ellipse", { cx: 0, cy: -70, rx: 30.8, ry: 4.2, fill: "none", stroke: "rgba(110,140,150,0.9)", "stroke-width": 0.35 }, g);
    L.svg("path", { d: "M-22 -64 L-4 -33", stroke: "#fff", "stroke-width": 1.2, opacity: 0.4 }, g);
  }

  L.entonnoir_fiole = function (ctx, f, { x, sol, e = 1.6, dire = () => {} }) {
    // Erlenmeyer de rangement, entonnoir déplaçable ; posé sur la fiole, il est une cible qui conduit tout dans la fiole.
    const erl = L.recipient(ctx, { id: "erlen-entonnoir", profil: "erlenmeyer_250", x, y: sol, e });
    erl.g.setAttribute("pointer-events", "none");
    const k = { sur_fiole: true, pos: null }, g = L.svg("g", { class: "entonnoir", role: "button", "aria-label": "Entonnoir" }, ctx.objets);
    entonnoir(g); L.svg("rect", { x: -32, y: -76, width: 64, height: 80, fill: "#000", opacity: 0 }, g);
    const assis = () => f.monde({ x: 0, y: -(f.pr.H - 33.7) }), range = { x, y: sol - 71 * e };
    const cone = () => CONE.map(([u, v]) => ({ x: k.pos.x + u * e, y: k.pos.y + v * e }));
    const cible = {
      contient: (gt) => k.sur_fiole && L.dans_polygone(cone(), gt),
      recevoir: (gt) => { gt.parts.forEach((p) => f.c.verser(p)); f.sig = null; ctx.signaler?.(); },
    };
    ctx.ecoulement.ajouter_cible(cible);
    const poser = (sur) => {
      // Sur la fiole (fiole fermée par l'entonnoir : on verse dans le cône) ou rangé dans l'erlenmeyer.
      k.sur_fiole = sur; f.ferme = sur; k.pos = sur ? assis() : { ...range };
      if (sur) cible.bouche = () => ({ x: k.pos.x, y: k.pos.y - 70 * e, r: 30 * e }); else delete cible.bouche;
      ctx.objets.append(g); L.placer(g, k.pos.x, k.pos.y, e); ctx.signaler?.();
    };
    const peut = () => !f.bouchon && !f.tenu;
    L.glissable(g, {
      debut: () => ({ ...k.pos }), saisir: () => { poser(false); ctx.haut.append(g); }, deplacer: (q) => { k.pos = q; L.placer(g, q.x, q.y, e); },
      lacher: (q) => { const a = assis(); poser(peut() && Math.abs(q.x - a.x) < 26 && Math.abs(q.y - a.y) < 60); if (f.bouchon && Math.abs(q.x - a.x) < 26) dire("Ôtez d'abord le bouchon de la fiole."); },
      toucher: () => { if (k.sur_fiole) return poser(false); if (peut()) poser(true); else dire("Ôtez d'abord le bouchon de la fiole."); },
    });
    poser(true);
    return k;
  };

  L.bouchon_fiole = function (ctx, f, { x, sol, e = 1.6, dire = () => {}, entonnoir = null }) {
    // Bouchon posé à l'envers sur la paillasse ; glissé sur le col, il bouche la fiole ; touché sur la fiole, il revient.
    const r = f.pr.r(f.pr.H), g = L.svg("g", { class: "bouchon-fiole", role: "button", "aria-label": "Bouchon de la fiole" }, ctx.objets);
    L.svg("rect", { x: -r - 3, y: -5, width: 2 * r + 6, height: 5, rx: 1.5, fill: "#2f6fb8", stroke: "#1d3f6b", "stroke-width": 0.4 }, g);
    L.svg("path", { d: `M${-r - 1.5} -5 L${-r + 0.6} -17 H${r - 0.6} L${r + 1.5} -5 Z`, fill: "#3b7cc4", stroke: "#1d3f6b", "stroke-width": 0.4 }, g);
    L.svg("rect", { x: -r - 8, y: -22, width: 2 * r + 16, height: 26, fill: "#000", opacity: 0 }, g);
    const zone = L.svg("circle", { r: 16, fill: "#000", opacity: 0, class: "bouchon-pose", role: "button", "aria-label": "Ôter le bouchon" }, ctx.haut);
    const repos = { x, y: sol };
    const montrer = () => { g.style.display = f.bouchon ? "none" : ""; zone.style.display = f.bouchon ? "" : "none"; L.placer(g, repos.x, repos.y, e); ctx.signaler?.(); };
    L.glissable(g, {
      debut: () => ({ ...repos }), saisir: () => ctx.haut.append(g), deplacer: (q) => L.placer(g, q.x, q.y, e),
      lacher: (q) => {
        const b = f.monde({ x: 0, y: -f.pr.H });
        ctx.objets.append(g);
        if (Math.hypot(q.x - b.x, q.y - b.y) < 34) { if (entonnoir?.sur_fiole) dire("Retirez d'abord l'entonnoir."); else { f.bouchon = true; f.sig = null; } }
        montrer();
      },
    });
    L.glissable(zone, { soulever: false, debut: () => ({ x: 0, y: 0 }), toucher: () => { f.bouchon = false; f.sig = null; montrer(); } });
    ctx.ecoulement.sur_pas(() => { if (f.bouchon) { const b = f.monde({ x: 0, y: -f.pr.H - 3 }); L.placer(zone, b.x, b.y); } });
    montrer();
  };
})(window.Labo);
