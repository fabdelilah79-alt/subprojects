/*
Rôle : pH-mètre de paillasse aux vraies dimensions : boîtier (110 mm × 95 mm), afficheur à deux décimales, touches « CAL 7 »
       et « CAL 4 », prise de l'électrode ; électrode combinée en verre (130 mm : tête noire et câble, tige transparente,
       fil de référence, jonction, bulbe de verre sensible) tenue par une pince sur une tige ; on la fait glisser vers le bas
       pour la plonger dans le récipient placé dessous. Mesure : pH exact (equilibre_acide.js). Non étalonné, l'appareil se
       trompe (pente 0,94, décalage + 0,23) ; « CAL 7 » dans le tampon pH 7 corrige le décalage, puis « CAL 4 » dans le tampon
       pH 4 corrige la pente. L'affichage rejoint la valeur en 1,5 s si l'on agite, en 5 s sinon.
Reçoit : le contexte de la paillasse et { x (milieu du boîtier), sol, e, tige (x de la tige), sonde_x, haut, bas (y du bas
         de l'électrode, levée et plongée), recipients(), agite(r), etalonne (vrai : déjà étalonné) }.
Produit : Labo.ph_metre(ctx, reglage) -> { etat() -> { plonge, dans (id), pH (vrai), affiche (nombre), stable, cal7, cal4 } }.
Utilisé par : les simulations acide-base (2e année du bac).
*/
(function (L) {
  const LONG = 130, BULBE = 14, R = 6;

  function boitier(g, x, sol, e) {
    // Boîtier bleu-gris, afficheur, touches et prise BNC ; renvoie l'écran, la zone de message et la prise.
    const l = 110 * e, h = 95 * e, y = sol - h;
    L.ombre_sol(g, x, sol + 2, l * 0.55, 5, 0.4);
    L.svg("rect", { x: x - l / 2, y, width: l, height: h, rx: 6, fill: "#cfd8de", stroke: "#6f7d86" }, g);
    L.svg("rect", { x: x - l / 2 + 9, y: y + 9, width: l - 18, height: 32, rx: 3, fill: "#b7c3a6", stroke: "#1b1e1a" }, g);
    L.texte(g, x - l / 2 + 18, y + 22, "pH", { "font-size": 8, "font-weight": 700, fill: "#1b1f17" });
    L.texte(g, x, y + h - 6, "pH-MÈTRE", { "font-size": 7.5, "font-weight": 700, fill: "#37474f" });
    L.svg("rect", { x: x + l / 2 - 22, y: y - 6, width: 12, height: 8, rx: 2, fill: "url(#metal)", stroke: "#444" }, g);
    const ecran = L.texte(g, x + l / 2 - 14, y + 34, "", { "font-size": 20, "font-family": "monospace", "font-weight": 700, fill: "#1b1f17", "text-anchor": "end" });
    const message = L.texte(g, x, y + 52, "", { "font-size": 6.5, "font-weight": 700, fill: "#37474f" });
    return { ecran, message, prise: { x: x + l / 2 - 16, y: y - 6 }, y };
  }

  function touche(ctx, x, y, texte, action) {
    // Touche en caoutchouc gris foncé, au-dessus des câbles.
    const t = L.svg("g", { class: "touche-ph", role: "button", "aria-label": texte }, ctx.haut);
    L.svg("rect", { x: x - 16, y: y - 7, width: 32, height: 14, rx: 4, fill: "#3b4147", stroke: "#1d2125" }, t);
    L.texte(t, x, y + 3, texte, { "font-size": 6.5, "font-weight": 700, fill: "#eef2f4" });
    L.glissable(t, { soulever: false, debut: () => ({ x, y }), toucher: action });
  }

  function electrode(g, sx, y, e, tige, prise) {
    // Pince et noix sur la tige ; tête noire et câble jusqu'à la prise ; tige de verre, fil de référence, jonction, bulbe.
    g.replaceChildren();
    const haut = y - LONG * e, r = R * e;
    L.svg("path", { d: `M${sx} ${haut} C${sx} ${haut - 50} ${prise.x} ${prise.y - 70} ${prise.x} ${prise.y}`, fill: "none", stroke: "#1d1f22", "stroke-width": 2.5 }, g);
    const bras = tige < sx ? [tige, sx - r] : [sx + r, tige];
    L.svg("rect", { x: bras[0], y: haut + 14 * e - 3, width: bras[1] - bras[0], height: 6, fill: "url(#metal)" }, g); L.noix(g, tige, haut + 14 * e);
    L.svg("rect", { x: sx - r, y: haut + 26 * e, width: 2 * r, height: (LONG - 26 - BULBE * 0.75) * e, fill: "rgba(214,233,240,0.55)", stroke: "rgba(110,140,150,0.9)", "stroke-width": 0.6 }, g);
    L.svg("ellipse", { cx: sx, cy: y - BULBE * 0.45 * e, rx: r * 1.08, ry: BULBE * 0.5 * e, fill: "rgba(205,228,236,0.8)", stroke: "rgba(110,140,150,0.9)", "stroke-width": 0.6 }, g);
    L.svg("line", { x1: sx, y1: haut + 28 * e, x2: sx, y2: y - BULBE * 0.6 * e, stroke: "#8a8f94", "stroke-width": 0.9 }, g);
    L.svg("circle", { cx: sx + r * 0.55, cy: y - 22 * e, r: 1.3, fill: "#4a4f55" }, g);
    L.svg("rect", { x: sx - r - 1, y: haut, width: 2 * r + 2, height: 27 * e, rx: 2, fill: "#24272b", stroke: "#000" }, g);
    L.svg("rect", { x: sx - r - 2, y: haut + 11 * e, width: 2 * r + 4, height: 6 * e, rx: 2, fill: "#2f6fb0" }, g);
  }

  function plongee(r, p, e) {
    // Vrai si le bulbe et la jonction (18 mm du bas) sont sous la surface du liquide de r.
    if (!L.dans_polygone(r.interieur_monde(), p)) return false;
    return r.pose.y - r.pr.hauteur_de(r.c.volume()) * e < p.y - 18 * e;
  }

  L.ph_metre = function (ctx, { x, sol, e = 1, tige, sonde_x, haut, bas, recipients, agite, etalonne = false }) {
    // Boîtier, touches, électrode à glisser ; mesure 10 fois par seconde avec le temps de réponse.
    const b = boitier(L.svg("g", { class: "ph-metre" }, ctx.fond), x, sol, e);
    const s = { y: haut, aff: 7 + Math.random() * 0.4, vrai: 7, dans: null, plonge: false, o: etalonne ? 0 : 0.23, p: etalonne ? 1 : 0.94, cal7: etalonne, cal4: etalonne };
    const lu = (pH) => 7 + (pH - 7) * s.p + s.o;
    const ge = L.svg("g", { class: "electrode-ph", role: "slider", "aria-label": "Électrode du pH-mètre" }, ctx.objets);
    const dessiner = () => { electrode(ge, sonde_x, s.y, e, tige, b.prise); L.svg("rect", { x: sonde_x - 14, y: s.y - LONG * e, width: 28, height: LONG * e, fill: "#fff", opacity: 0.01 }, ge); };
    L.glissable(ge, { soulever: false, debut: () => ({ x: sonde_x, y: s.y }), deplacer: (p) => { s.y = Math.max(haut, Math.min(bas, p.y)); dessiner(); } });
    const dire = (t) => { b.message.textContent = t; };
    const cal = (v) => () => {
      // Étalonnage : l'électrode doit être dans le tampon v ; CAL 4 seulement après CAL 7.
      if (!s.plonge || Math.abs(s.vrai - v) > 0.3) return dire(`Électrode dans le tampon pH ${v} ?`);
      if (v === 7) { s.o = 0; s.cal7 = true; } else if (!s.cal7) return dire("Étalonnez d'abord à pH 7."); else { s.p = 1; s.cal4 = true; }
      s.aff = lu(s.vrai); dire(s.cal4 ? "Étalonné (pH 7 et pH 4)" : "CAL 7 fait ; puis tampon pH 4");
    };
    touche(ctx, x - 26 * e, b.y + 70 * e, "CAL 7", cal(7)); touche(ctx, x + 26 * e, b.y + 70 * e, "CAL 4", cal(4));
    dire(etalonne ? "Étalonné" : "À étalonner"); dessiner();
    setInterval(() => {
      const p = { x: sonde_x, y: s.y }, r = (recipients() || []).find((k) => plongee(k, p, e)), ph = r && r.c.phases.find((q) => q.classe === "aqueuse");
      s.plonge = !!ph; s.dans = r ? r.id : null;
      if (ph) { s.vrai = L.pH_exact(ph); s.aff += (lu(s.vrai) - s.aff) * (1 - Math.exp(-0.1 / (agite(r) ? 0.5 : 1.7))); } else s.aff += (Math.random() - 0.5) * 0.06;
      const r_ = (recipients() || []).find((k) => !k.tenu && Math.abs(k.pose.x - sonde_x) < k.pr.r(k.pr.H) * e);
      if (r_ && ge.nextSibling !== r_.g) ctx.objets.insertBefore(ge, r_.g);
      b.ecran.textContent = (s.aff + (Math.random() - 0.5) * 0.008).toFixed(2).replace(".", ",");
    }, 100);
    return { etat: () => ({ plonge: s.plonge, dans: s.dans, pH: s.vrai, affiche: Number(b.ecran.textContent.replace(",", ".")), stable: s.plonge && Math.abs(s.aff - lu(s.vrai)) < 0.006, cal7: s.cal7, cal4: s.cal4 }) };
  };
})(window.Labo);
