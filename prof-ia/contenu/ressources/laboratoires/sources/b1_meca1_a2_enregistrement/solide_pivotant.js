/*
Rôle : solide en rotation autour d'un axe fixe sur la table à coussin d'air : une barre légère pivote autour du clou
       central (axe vertical fixe) et porte deux palets autoporteurs, chacun avec son électrode : A à 60 mm de l'axe, B à
       120 mm. On le pousse d'un geste (glisser autour du clou) ; lâché, il tourne sans frottement à vitesse angulaire
       constante (rotation uniforme). L'éclateur marque A et B ; l'axe O est marqué sur la feuille.
Reçoit : la table à coussin d'air (Labo.CoussinAir) à transformer.
Produit : Labo.solide_pivotant(table) -> { RA, RB } (mm) ; la table reçoit solide { angle, omega }, axe, marques(), immobile(),
          dessiner_mobile() et un nouveau geste (rotation autour du clou).
Utilisé par : poste_rotation.js.
*/
(function (L) {
  const RA = 60, RB = 120, R_PALET = 26;

  L.solide_pivotant = function (table) {
    // Le mobile devient le solide pivotant ; son geste est remplacé (on ne peut pas le déplacer, seulement le faire tourner).
    const O = L.CoussinAir.CLOU, ve = L.CoussinAir.vers_ecran, vt = (p) => L.CoussinAir.vers_table(p);
    Object.assign(table, { solide: { angle: 0.35, omega: 0 }, axe: { ...O }, pos: { ...O }, vitesse: { x: 0, y: 0 }, marge: 0 });
    const point = (r) => ({ x: O.x + r * Math.cos(table.solide.angle), y: O.y + r * Math.sin(table.solide.angle) });
    table.marques = () => ({ a: point(RA), b: point(RB) });
    table.immobile = () => Math.abs(table.solide.omega) < 0.02;
    table.dessiner_mobile = function () {
      // Barre d'aluminium du clou jusqu'au-delà de B, deux palets (le plus lointain d'abord), étiquettes A et B.
      const o = ve(O.x, O.y), a = ve(point(RA).x, point(RA).y), b = ve(point(RB).x, point(RB).y), bout = ve(point(RB + 20).x, point(RB + 20).y);
      this.mobile.replaceChildren();
      L.tige(this.mobile, `M${o.x} ${o.y - 12} L${bout.x} ${bout.y - 12}`, 5);
      L.svg("circle", { cx: o.x, cy: o.y - 12, r: 6, fill: "url(#metal)", stroke: "#444" }, this.mobile);
      [[a, "A"], [b, "B"]].sort((x, y) => x[0].y - y[0].y).forEach(([p, t]) => L.dessiner_palet(this.mobile, p, R_PALET, { etiquette: t }));
    };
    const neuf = table.mobile.cloneNode(false);
    table.mobile.replaceWith(neuf); table.mobile = neuf;
    let prise = null;
    const angle = (p) => { const q = vt(p); return Math.atan2(q.y - O.y, q.x - O.x); };
    L.glissable(neuf, {
      soulever: false,
      debut: (ev) => { const p = L.scene.vers_scene(ev); table.tenu = true; table.solide.omega = 0; prise = { a: angle(p), t: performance.now(), w: 0 }; L.annoncer("mobile_pris", { mobile: table }); return { x: 0, y: 0 }; },
      deplacer: (d, ev) => {
        const p = L.scene.vers_scene(ev), a = angle(p), t = performance.now();
        let da = a - prise.a; if (da > Math.PI) da -= 2 * Math.PI; if (da < -Math.PI) da += 2 * Math.PI;
        table.solide.angle += da; prise.w = 0.5 * prise.w + 0.5 * (da / Math.max(0.008, (t - prise.t) / 1000)); prise.a = a; prise.t = t;
        table.dessiner_mobile();
      },
      lacher: () => { const w = prise?.w || 0; table.solide.omega = Math.abs(w) < 0.3 ? 0 : Math.sign(w) * Math.min(5, Math.max(1, Math.abs(w))); table.tenu = false; prise = null; },
      fin: () => { table.tenu = false; },
    });
    table.dessiner_mobile();
    return { RA, RB };
  };
})(window.Labo);
