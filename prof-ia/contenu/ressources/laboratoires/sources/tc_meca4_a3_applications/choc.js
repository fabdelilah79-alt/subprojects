/*
Rôle : choc de deux mobiles autoporteurs sur la table à coussin d'air : l'élève lance A vers B, immobile ; des bandes
       auto-agrippantes les collent l'un à l'autre au choc, et ils repartent ensemble (choc « mou »). Reprendre A en main
       sépare les mobiles et remet B à sa place.
Reçoit : la table (Labo.CoussinAir) ; { m_a, m_b (kg), place_b (mm) }.
Produit : Labo.choc(table, reglages) ; la table reçoit masse_kg = { a, b }, marques() (A et B) ; fait « choc » = oui
          au moment où les mobiles se collent.
Utilisé par : simulation.js.
*/
(function (L) {
  const R = () => L.CoussinAir.TABLE.rayon;

  function heurter(table, etat) {
    // Au contact, les mobiles se collent : même vitesse ensuite, v' = mA·vA / (mA + mB).
    const { a, b } = table.masse_kg, d = Math.hypot(etat.b.x - table.pos.x, etat.b.y - table.pos.y);
    if (etat.colle || d > 2 * R()) return;
    etat.colle = true;
    etat.decalage = { x: etat.b.x - table.pos.x, y: etat.b.y - table.pos.y };
    table.vitesse = { x: (table.vitesse.x * a) / (a + b), y: (table.vitesse.y * a) / (a + b) };
    L.missions.noter("choc", true);
  }

  function suivre(table, etat) {
    // Collés, B suit A ; si B touche le bord, l'ensemble s'arrête (bande de mousse).
    if (!etat.colle) return;
    etat.b = { x: table.pos.x + etat.decalage.x, y: table.pos.y + etat.decalage.y };
    const T = L.CoussinAir.TABLE, r = R();
    if (etat.b.x < r || etat.b.x > T.l - r || etat.b.y < r || etat.b.y > T.h - r) table.vitesse = { x: 0, y: 0 };
  }

  L.choc = function (table, { m_a = 0.2, m_b = 0.4, place_b = { x: 400, y: 200 } } = {}) {
    // Ajoute le mobile B (avec sa surcharge) à la table ; A est le mobile habituel, lancé à la main.
    const etat = { b: { ...place_b }, colle: false, decalage: null };
    Object.assign(table, { masse_kg: { a: m_a, b: m_b }, pos: { x: 110, y: 200 } });
    table.marques = () => ({ a: { x: table.pos.x, y: table.pos.y }, b: { ...etat.b } });
    table.ecouteurs.unshift(() => { heurter(table, etat); suivre(table, etat); });
    L.ecouter("mobile_pris", (e) => { if (e.mobile === table) Object.assign(etat, { b: { ...place_b }, colle: false }); });
    const ve = L.CoussinAir.vers_ecran;
    table.dessiner_mobile = function () {
      // A puis B (le plus lointain d'abord), lettres sur les flancs, surcharge sur B.
      this.mobile.replaceChildren();
      const pa = ve(this.pos.x, this.pos.y), pb = ve(etat.b.x, etat.b.y);
      const ordre = [[pa, { etiquette: "A" }], [pb, { etiquette: "B", surcharge: true }]].sort((x, y) => x[0].y - y[0].y);
      for (const [p, options] of ordre) L.dessiner_palet(L.svg("g", { class: options.surcharge ? "mobile-b" : "mobile-a" }, this.mobile), p, R(), options);
    };
    // On ne lance que A : un geste commencé sur B est ignoré.
    table.mobile.addEventListener("pointerdown", (e) => { if (e.target.closest(".mobile-b")) { e.stopImmediatePropagation(); e.labo_pris = true; } }, { capture: true });
    table.dessiner_mobile();
    return etat;
  };
})(window.Labo);
