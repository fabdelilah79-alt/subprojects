/*
Rôle : soufflerie de la table à coussin d'air : un bouton met ou coupe l'air sous le mobile. Sans air, le mobile frotte
       sur la table et s'arrête vite ; avec l'air, il glisse sans frottement. Elle observe aussi ce que fait le mobile.
Reçoit : le groupe SVG, la table (Labo.CoussinAir), la position du boîtier ; les gestes de l'élève.
Produit : Labo.soufflerie(groupe, table, x, y) -> { air() } ; faits notés : « air » (oui / non),
          « glissade » = { air, distance_mm } à chaque lancer (arrêt sans air, ou 30 cm parcourus avec l'air),
          « immobile_avec_air » quand le mobile, posé avec l'air, reste immobile 2 s.
Utilisé par : poste_coussin_air.js (réglage soufflerie: true).
*/
(function (L) {
  function boitier(g, x, y) {
    // Boîtier bleu de la soufflerie, tuyau d'air vers la table, plaque, grille d'aération et voyant.
    L.svg("path", { d: `M${x + 170} ${y + 52} C${x + 196} ${y + 56} ${x + 200} ${y + 66} ${x + 208} ${y + 70}`, fill: "none", stroke: "#3a3f44", "stroke-width": 7, "stroke-linecap": "round" }, g);
    L.svg("rect", { x, y, width: 176, height: 74, rx: 5, fill: "url(#facade)", stroke: "#3c4a57", filter: "url(#ombre)" }, g);
    L.svg("rect", { x: x + 8, y: y + 6, width: 120, height: 14, fill: "#1f3550" }, g);
    L.texte(g, x + 68, y + 13.5, "SOUFFLERIE", { "font-size": 8.5, fill: "#cfe3f5", "font-weight": 700, "letter-spacing": 1 });
    for (let i = 0; i < 5; i++) L.svg("rect", { x: x + 140, y: y + 28 + i * 7, width: 26, height: 3, rx: 1.5, fill: "#2a2f33" }, g);
    return L.svg("circle", { cx: x + 162, cy: y + 13, r: 3.5, fill: "#1d3a24" }, g);
  }

  function observer_glissade(table) {
    // À chaque lancer : distance parcourue jusqu'à l'arrêt (sans air) ou jusqu'à 30 cm (avec l'air).
    const lancer = { distance: 0, air: false, fini: true };
    L.ecouter("mobile_pris", (e) => { if (e.mobile === table) Object.assign(lancer, { distance: 0, air: !table.sans_air, fini: false }); });
    table.sur_image((dt, m) => {
      if (lancer.fini) return;
      const v = Math.hypot(m.vitesse.x, m.vitesse.y);
      lancer.distance += v * dt;
      if ((lancer.air && lancer.distance > 300) || (!lancer.air && v < 2)) {
        lancer.fini = true;
        L.missions.noter("glissade", { air: lancer.air, distance_mm: Math.round(lancer.distance) });
      }
    });
  }

  function observer_repos(table) {
    // Mobile posé, air en marche : s'il reste immobile 2 s, le fait est noté.
    let calme = 0;
    setInterval(() => {
      calme = !table.sans_air && !table.tenu && table.immobile() ? calme + 0.25 : 0;
      if (calme === 2) L.missions.noter("immobile_avec_air", true);
    }, 250);
  }

  L.soufflerie = function (g, table, x, y) {
    // Construit la soufflerie (air coupé au départ) et branche son bouton.
    const voyant = boitier(g, x, y);
    table.sans_air = true;
    L.bouton_poussoir(g, x + 70, y + 46, {
      textes: ["Mettre l'air", "Couper l'air"],
      sur_changement: (marche) => {
        table.sans_air = !marche;
        voyant.setAttribute("fill", marche ? "#3fdc6a" : "#1d3a24");
        L.missions.noter("air", marche);
      },
    });
    observer_glissade(table);
    observer_repos(table);
    return { air: () => !table.sans_air };
  };
})(window.Labo);
