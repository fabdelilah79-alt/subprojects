/*
Rôle : verre de montre (60 ou 80 mm) aux vraies dimensions, posé sur la paillasse (vu un peu d'en haut) ; il peut contenir un
       échantillon solide (papier, papier filtre, rondelle de pomme de terre, pulpe d'orange), une bande de papier pH, une
       pointe de sulfate de cuivre anhydre. Les gouttes qui y tombent (ecoulement.js) font une tache à l'endroit où elles
       tombent : teinte du papier pH selon le pH, eau iodée bleu-noir sur l'amidon, sulfate de cuivre bleu avec l'eau.
Reçoit : le contexte de la paillasse et { id, x, sol, e (px/mm), diametre (mm, 80 par défaut), solide, bande_ph }.
Produit : Labo.verre_montre(ctx, reglage) -> { id, c : { solide, poudre, taches, bande_ph, recus }, poudre_bleue() } ;
          il s'inscrit comme cible des gouttes et de la spatule (ctx.cibles : bouche(), recevoir_poudre()).
Utilisé par : les simulations de chimie (tests de détection).
*/
(function (L) {
  const BLEU = "#2f86d6", BLANC = "#f1f1ea";

  function solide(g, nom) {
    // Échantillon posé au centre du verre (mm).
    const c = L.rgb(L.CHIMIE.solides[nom].rgb);
    if (nom === "papier") L.svg("path", { d: "M-20 -4 L6 -9 L22 -2 L-4 4 Z", fill: c, stroke: "#c8c8c0", "stroke-width": 0.3 }, g);
    if (nom === "papier_filtre") L.svg("path", { d: "M-26 -1 A28 8 0 0 1 26 -1 L0 2 Z", fill: c, stroke: "#d4d4cc", "stroke-width": 0.3 }, g);
    if (nom === "pomme_de_terre") { L.svg("ellipse", { cx: 0, cy: -2, rx: 22, ry: 6, fill: "#9b7a45" }, g); L.svg("ellipse", { cx: 0, cy: -2.6, rx: 20.5, ry: 5.2, fill: c }, g); }
    if (nom === "pulpe_orange") {
      L.svg("path", { d: "M-22 0 Q0 -12 22 0 Q0 5 -22 0 Z", fill: c, stroke: "#c96f12", "stroke-width": 0.4 }, g);
      for (const dx of [-10, -4, 2, 8]) L.svg("path", { d: `M${dx} 1 l${dx / 4} -6`, stroke: "#ffd08a", "stroke-width": 0.6 }, g);
    }
  }

  function dessiner(g, v) {
    // Verre : ombre, coupelle bombée, reflets ; puis le contenu ; le bord passe devant.
    g.replaceChildren();
    L.svg("ellipse", { cx: 2, cy: 3, rx: 41, ry: 8, fill: "#000", opacity: 0.25 }, g);
    L.svg("path", { d: "M-40 -4 Q0 12 40 -4 A40 9 0 0 1 -40 -4 Z", fill: "rgba(200,225,233,0.35)", stroke: "rgba(120,150,160,0.8)", "stroke-width": 0.4 }, g);
    L.svg("ellipse", { cx: 0, cy: -4, rx: 40, ry: 9, fill: "rgba(214,233,240,0.18)" }, g);
    if (v.solide) solide(g, v.solide);
    if (v.bande_ph) {
      L.svg("path", { d: "M-30 -6 L30 -6 L28 0 L-32 0 Z", fill: L.couleur_ph(null), stroke: "#c9a35a", "stroke-width": 0.3 }, g);
      for (const t of v.taches) L.svg("ellipse", { cx: t.x, cy: -3, rx: 5, ry: 2.4, fill: t.couleur }, g);
    } else for (const t of v.taches) L.svg("ellipse", { cx: t.x, cy: -3 + t.dy, rx: t.r, ry: t.r * 0.42, fill: t.couleur, opacity: t.alpha }, g);
    if (v.poudre) L.svg("path", { d: "M-12 -2 Q0 -12 12 -2 Z", fill: v.poudre, stroke: "#00000022", "stroke-width": 0.3 }, g);
    L.svg("ellipse", { cx: 0, cy: -4, rx: 40, ry: 9, fill: "none", stroke: "rgba(235,246,250,0.9)", "stroke-width": 0.9 }, g);
    L.svg("path", { d: "M-30 -9 Q-10 -12 10 -12", stroke: "#fff", "stroke-width": 0.8, opacity: 0.5, fill: "none" }, g);
  }

  function goutte(v, gt, x_local) {
    // Effet d'une goutte : liquide majoritaire, puis teinte de la tache.
    const nom = Object.entries(gt.parts[0]?.liquides || {}).sort((a, b) => b[1] - a[1])[0]?.[0];
    if (!nom) return;
    const l = L.LIQUIDES[nom], s = v.solide && L.CHIMIE.solides[v.solide], iode = nom === "eau_iodee";
    v.recus.push(nom);
    if (v.poudre && l.classe === "aqueuse") v.poudre = BLEU;
    const x = Math.max(-26, Math.min(26, x_local));
    if (v.bande_ph) return void v.taches.push({ x, couleur: L.couleur_ph(l.pH ?? null) });
    const couleur = iode && s ? (s.amidon ? "#1e1446" : "#a85a16") : iode ? "#b8661c" : L.rgb(l.rgb);
    const proche = v.taches.find((t) => Math.abs(t.x - x) < 5);
    if (proche) { proche.r = Math.min(14, proche.r + 1.2); proche.couleur = couleur; } else v.taches.push({ x, dy: 0, r: 4.5, couleur, alpha: iode || l.alpha > 0.5 ? 0.9 : 0.55 });
  }

  L.verre_montre = function (ctx, { id, x, sol, e: e_reel = 1.6, diametre = 80, solide = null, bande_ph = false }) {
    // Construit le verre de montre et l'inscrit comme cible (le dessin, prévu pour 80 mm, est mis à l'échelle).
    const e = (e_reel * diametre) / 80;
    const v = { id, c: null, g: L.svg("g", { class: `verre-montre verre-${id}` }, ctx.fond) };
    v.c = { solide, poudre: null, taches: [], bande_ph, recus: [] };
    const maj = () => { dessiner(v.g, v.c); L.placer(v.g, x, sol, e); ctx.signaler?.(); };
    ctx.ecoulement.ajouter_cible({
      contient: (p) => ((p.x - x) / (38 * e)) ** 2 + ((p.y - (sol - 4 * e)) / (8 * e)) ** 2 <= 1,
      recevoir: (gt) => { goutte(v.c, gt, (gt.x - x) / e); maj(); },
    });
    v.bouche = () => ({ x, y: sol - 6 * e });
    v.recevoir_poudre = () => { v.c.poudre = (solide && L.CHIMIE.solides[solide].eau) || v.c.recus.some((n) => L.LIQUIDES[n].classe === "aqueuse") ? BLEU : BLANC; maj(); };
    v.poudre_bleue = () => v.c.poudre === BLEU;
    (ctx.cibles = ctx.cibles || []).push(v);
    maj();
    return v;
  };
})(window.Labo);
