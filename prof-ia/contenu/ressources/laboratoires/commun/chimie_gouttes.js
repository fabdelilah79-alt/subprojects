/*
Rôle : paillasse de chimie (plans de dessin et récipients qui peuvent recevoir des gouttes) et pipette compte-gouttes :
       on la sort de son flacon ou de son bécher, on la tient au-dessus d'un tube ou d'un verre de montre, les gouttes
       tombent une à une, puis la pipette retourne dans son flacon (une pipette par produit : on ne mélange rien).
Reçoit : le groupe SVG de la paillasse ; pour une pipette : sa place de repos, le produit, la dose (mL) et le nombre de gouttes.
Produit : Labo.paillasse_chimie(g) -> ctx { fond, objets, devant, haut, cibles, ajouter_cible(c), signaler(), sur_changement(f) } ;
          Labo.compte_gouttes(ctx, reglage) -> pipette ; une cible est { bouche() -> { x, y }, surface() -> y, recevoir(nom, mL) }.
Utilisé par : chimie_objets.js et les simulations de chimie.
*/
(function (L) {
  L.paillasse_chimie = function (g) {
    // Quatre plans : fond (supports), objets (récipients), devant (bord des supports), haut (objet tenu, gouttes).
    const ctx = { cibles: [], ecouteurs: [] };
    for (const nom of ["fond", "objets", "devant", "haut"]) ctx[nom] = L.svg("g", { class: `chimie-${nom}` }, g);
    ctx.ajouter_cible = (c) => { ctx.cibles.push(c); return c; };
    ctx.sur_changement = (f) => ctx.ecouteurs.push(f);
    ctx.signaler = () => ctx.ecouteurs.forEach((f) => f());
    return ctx;
  };

  function gouttes(ctx, de, cible, n, couleur, fin) {
    // Fait tomber n gouttes, l'une après l'autre, de la pointe de la pipette jusqu'à la surface du contenu.
    const y_fin = cible.surface();
    let k = 0;
    const suivante = () => {
      if (k++ >= n) return fin();
      const goutte = L.svg("ellipse", { cx: de.x, cy: de.y, rx: 2.2, ry: 2.8, fill: couleur, opacity: 0.9, stroke: "#ffffff88", "stroke-width": 0.5 }, ctx.haut);
      L.animer(Math.sqrt(Math.max(4, y_fin - de.y)) * 0.022, (t) => goutte.setAttribute("cy", de.y + (y_fin - de.y) * t * t), () => { goutte.remove(); suivante(); });
    };
    suivante();
  }

  L.compte_gouttes = function (ctx, { repos, produit, rgb, poire = "#1d1d1f", bague = true, dose = 0.05, n = 3, source = null, cachee = false, quand_rangee = null }) {
    // Pipette déplaçable ; repos = { x, y } : pointe quand elle est rangée ; cachee : seule la poire dépasse du flacon.
    const p = { produit, rgb, g: L.svg("g", { class: "pipette", role: "button", "aria-label": `Pipette : ${produit}` }, ctx.objets), sortie: false };
    const dessiner = (entiere) => { L.verrerie.pipette(p.g, 0, 0, { rgb, poire, bague }); if (!entiere) [...p.g.children].slice(0, rgb ? 2 : 1).forEach((e) => e.remove()); };
    const ranger = () => { ctx.objets.append(p.g); L.placer(p.g, repos.x, repos.y); dessiner(!cachee); p.sortie = false; quand_rangee?.(false); };
    const viser = (pos) => ctx.cibles.find((c) => { const b = c.bouche(); return c !== source && Math.abs(pos.x - b.x) < 22 && pos.y > b.y - 70 && pos.y < b.y + 12; });
    ranger();
    L.glissable(p.g, {
      debut: () => ({ ...repos }),
      saisir: () => { ctx.haut.append(p.g); dessiner(true); p.sortie = true; quand_rangee?.(true); },
      deplacer: (pos) => L.placer(p.g, pos.x, pos.y),
      lacher: (pos) => {
        const c = viser(pos);
        if (!c) return ranger();
        const b = c.bouche(), tenue = { x: b.x, y: Math.min(pos.y, b.y - 6) };
        L.placer(p.g, tenue.x, tenue.y);
        gouttes(ctx, tenue, c, n, L.rgb(rgb), () => { c.recevoir(produit, dose); ctx.signaler(); ranger(); });
      },
    });
    return p;
  };
})(window.Labo);
