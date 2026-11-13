/*
Rôle : paillasse « quantité de mouvement » : table à coussin d'air, mobile de 300 g, surcharge de 300 g posée à côté,
       règle, flèche du vecteur quantité de mouvement (montrée seulement pour le mobile sans surcharge).
Reçoit : le groupe SVG de la paillasse ; { masse_kg, surcharge_kg, indice, mm_par_kgms } (échelle des flèches p).
Produit : Labo.poste_p(groupe, reglages) -> le poste de la table (pense_bete, table, feuille...) ; fait « surcharge ».
Utilisé par : simulation.js.
*/
(function (L) {
  L.poste_p = function (g, { masse_kg, surcharge_kg, indice, mm_par_kgms }) {
    // Construit la table, puis branche la surcharge sur le mobile.
    const sans_surcharge = () => !poste.surcharge || !poste.surcharge.sur();
    const poste = L.poste_coussin_air(g, {
      nom: "p", outils: ["regle"],
      vecteurs: { indices: [indice], echelle_mm_par_ms: masse_kg * mm_par_kgms, lettre: "p", quand: sans_surcharge, legende: { mm: 10, texte: `1 cm ↔ ${L.nombre(10 / mm_par_kgms, 2)} kg·m/s` } },
    });
    const table = poste.table, vers_ecran = L.CoussinAir.vers_ecran;
    table.masse_kg = masse_kg;
    const sous = L.svg("g", {}, g);
    g.insertBefore(sous, g.querySelector(".calque-dessus"));
    L.svg("rect", { x: 30, y: 418, width: 150, height: 34, rx: 3, fill: "#f7f5ee", stroke: "#c9c3b0", transform: "rotate(-2 105 435)" }, sous);
    L.texte(sous, 105, 436, `Mobile : ${Math.round(masse_kg * 1000)} g`, { class: "etiquette-carton", "font-size": 15 });
    poste.surcharge = L.surcharge(sous, {
      masse_kg: surcharge_kg, repos: { x: 104, y: 486 },
      cibles: () => { const p = vers_ecran(table.pos.x, table.pos.y); return [{ nom: "mobile", x: p.x, y: p.y - 6, libre: table.immobile() }]; },
      sur_changement: (nom) => { table.masse_kg = masse_kg + (nom ? surcharge_kg : 0); L.missions.noter("surcharge", !!nom); },
    });
    const dessiner = table.dessiner_mobile.bind(table);
    table.dessiner_mobile = () => { dessiner(); poste.surcharge.placer(); };
    return poste;
  };
})(window.Labo);
