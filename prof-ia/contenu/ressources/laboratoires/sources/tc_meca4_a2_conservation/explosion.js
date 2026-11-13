/*
Rôle : « explosion » de deux mobiles autoporteurs A et B sur la table à coussin d'air : un ressort comprimé entre eux,
       retenu par un fil. Toucher le fil le coupe : le ressort détend les mobiles, qui partent en sens opposés
       (même énergie libérée à chaque essai ; quantité de mouvement totale nulle). Une surcharge peut être posée sur A ou B.
Reçoit : la table (Labo.CoussinAir) ; le groupe où poser la surcharge ; { masse_kg, surcharge_kg, energie_j }.
Produit : Labo.explosion(table, groupe, reglages) ; la table reçoit masse_kg = { a, b }, marques(), immobile() propres ;
          faits notés : « surcharge_sur » (« A », « B » ou null).
Utilisé par : simulation.js.
*/
(function (L) {
  const ECART = 10;

  function ressort(g, pa, pb, comprime) {
    // Ressort à spires entre les deux mobiles (serré s'il est comprimé), et le fil qui les retient.
    const de = pa.x + 30 * pa.k, a = comprime ? pb.x - 30 * pb.k : de + 24, n = 7, y = pa.y - 4, d = [`M${de} ${y}`];
    for (let i = 1; i <= n; i++) d.push(`L${de + ((a - de) * (i - 0.5)) / n} ${y + (i % 2 ? -6 : 6)}`);
    d.push(`L${a} ${y}`);
    L.svg("path", { d: d.join(" "), fill: "none", stroke: "#8a9297", "stroke-width": 1.6 }, g);
  }

  function dessiner(table, etat) {
    // Les deux mobiles (lettres A et B), le ressort, et le fil tant qu'il n'est pas coupé.
    const ve = L.CoussinAir.vers_ecran, pa = ve(etat.xa, etat.y), pb = ve(etat.xb, etat.y);
    table.mobile.replaceChildren();
    L.dessiner_palet(table.mobile, pa, L.CoussinAir.TABLE.rayon, { etiquette: "A" });
    L.dessiner_palet(table.mobile, pb, L.CoussinAir.TABLE.rayon, { etiquette: "B" });
    ressort(table.mobile, pa, pb, !etat.parti);
    if (etat.parti) return;
    const fil = L.svg("g", { class: "fil-explosion", role: "button", "aria-label": "Couper le fil" }, table.mobile);
    L.svg("line", { x1: pa.x, y1: pa.y - 30, x2: pb.x, y2: pb.y - 30, stroke: "#000", "stroke-width": 16, opacity: 0.001 }, fil);
    L.svg("path", { d: `M${pa.x} ${pa.y - 30} Q${(pa.x + pb.x) / 2} ${pa.y - 26} ${pb.x} ${pb.y - 30}`, fill: "none", stroke: "#d8cba4", "stroke-width": 2.2 }, fil);
  }

  function couper(table, etat, energie_j) {
    // Le ressort se détend : |pA| = |pB| = p, avec E = p²/2 · (1/mA + 1/mB).
    const { a, b } = table.masse_kg, p = Math.sqrt((2 * energie_j) / (1 / a + 1 / b));
    Object.assign(etat, { parti: true, va: (-p / a) * 1000, vb: (p / b) * 1000 });
  }

  function avancer(etat, dt) {
    // Chaque mobile glisse sans frottement ; il s'arrête sur la bande de mousse du bord de la table.
    const R = L.CoussinAir.TABLE.rayon, l = L.CoussinAir.TABLE.l;
    etat.xa += etat.va * dt;
    etat.xb += etat.vb * dt;
    if (etat.xa < R) { etat.xa = R; etat.va = 0; }
    if (etat.xb > l - R) { etat.xb = l - R; etat.vb = 0; }
  }

  L.explosion = function (table, groupe, { masse_kg, surcharge_kg, energie_j }) {
    // Remplace le mobile unique de la table par le système {A, B}.
    const R = L.CoussinAir.TABLE.rayon, depart = () => ({ xa: 300 - R - ECART, xb: 300 + R + ECART, y: 200, va: 0, vb: 0, parti: false });
    const etat = depart(), ve = L.CoussinAir.vers_ecran;
    Object.assign(table, { pos: { x: 300, y: 200 }, masse_kg: { a: masse_kg, b: masse_kg } });
    table.marques = () => ({ a: { x: etat.xa, y: etat.y }, b: { x: etat.xb, y: etat.y } });
    table.immobile = () => !etat.parti || (etat.va === 0 && etat.vb === 0);
    table.ecouteurs.unshift((dt) => avancer(etat, dt));
    const surcharge = L.surcharge(groupe, {
      masse_kg: surcharge_kg, repos: { x: 104, y: 486 },
      cibles: () => [["A", etat.xa], ["B", etat.xb]].map(([nom, x]) => { const p = ve(x, etat.y); return { nom, x: p.x, y: p.y - 6, libre: !etat.parti }; }),
      sur_changement: (nom) => {
        table.masse_kg = { a: masse_kg + (nom === "A" ? surcharge_kg : 0), b: masse_kg + (nom === "B" ? surcharge_kg : 0) };
        L.missions.noter("surcharge_sur", nom);
      },
      toucher: () => remettre(),
    });
    table.dessiner_mobile = () => { dessiner(table, etat); surcharge.placer(); };
    const remettre = () => { if (etat.parti && table.immobile()) Object.assign(etat, depart()); table.dessiner_mobile(); };
    table.mobile.addEventListener("pointerdown", (e) => {
      // Le système ne se lance pas à la main : un toucher coupe le fil, ou remet les mobiles en place une fois arrêtés.
      e.stopImmediatePropagation();
      e.labo_pris = true;
      if (!etat.parti && e.target.closest(".fil-explosion")) couper(table, etat, energie_j);
      remettre();
    }, { capture: true });
    table.dessiner_mobile();
  };
})(window.Labo);
