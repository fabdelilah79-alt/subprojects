/*
Rôle : boîte de résistances à décades, vue d'en haut : afficheur de la valeur, touches − et + qui passent d'une valeur à
       la suivante de la série (1 kΩ à 100 kΩ), deux bornes.
Reçoit : le circuit et { id, x, y, valeurs [Ω], R (Ω), nom }.
Produit : Labo.boite_resistances(c, reglage) -> comp { R, i } ; bornes « 1 », « 2 » ; fait « <id> » = R (Ω).
Utilisé par : les simulations du dipôle RC.
*/
(function (L) {
  const SERIE = [1000, 2200, 4700, 10000, 22000, 47000, 100000];
  const ecrire = (R) => (R >= 1000 ? `${String(R / 1000).replace(".", ",")} kΩ` : `${R} Ω`);

  L.boite_resistances = function (c, { id = "R", x, y, valeurs = SERIE, R = 10000, nom = "R" }) {
    // Boîtier noir, afficheur, touches de réglage (au-dessus des fils, comme les bornes), bornes ; chaque changement recalcule le circuit.
    const comp = { id, R, i: 0, g: L.svg("g", { class: `boite-resistances boite-${id}` }, c.calque_composants) };
    L.boitier(comp.g, x, y, 130, 56, 14, { dessus: "#2f3438", face: "#1e2226" });
    L.texte(comp.g, x + 65, y + 11, `${nom} : boîte de résistances`, { "font-size": 7, "font-weight": 700, fill: "#d8d2c0" });
    L.svg("rect", { x: x + 34, y: y + 16, width: 62, height: 18, rx: 2, fill: "#1d2a22", stroke: "#000" }, comp.g);
    const ecran = L.svg("g", {}, comp.g), afficher = () => { ecran.replaceChildren(); L.texte(ecran, x + 65, y + 29, ecrire(comp.R), { "font-size": 10, "font-weight": 700, fill: "#7dff9a", "font-family": "monospace" }); L.missions.noter(id, comp.R); };
    [[-1, "−", x + 20], [1, "+", x + 110]].forEach(([s, t, bx]) => {
      const b = L.svg("g", { class: s > 0 ? "plus" : "moins", role: "button", "aria-label": s > 0 ? "Augmenter R" : "Diminuer R" }, c.calque_bornes);
      L.svg("rect", { x: bx - 9, y: y + 16, width: 18, height: 18, rx: 3, fill: "#e9eef2", stroke: "#8a96a0" }, b);
      L.texte(b, bx, y + 30, t, { "font-size": 12, "font-weight": 700, fill: "#23315a" });
      L.glissable(b, { soulever: false, debut: () => ({ x: 0, y: 0 }), toucher: () => { const k = valeurs.indexOf(comp.R) + s; comp.R = valeurs[Math.max(0, Math.min(valeurs.length - 1, k))]; afficher(); c.calculer(); } });
    });
    c.borne(comp, "1", x + 20, y + 46, "#c9a227"); c.borne(comp, "2", x + 110, y + 46, "#c9a227");
    comp.dipoles = () => [{ a: "1", b: "2", g: 1 / comp.R, j: 0 }];
    comp.mettre_a_jour = ({ i }) => { comp.i = i[0]; };
    afficher();
    return c.ajouter(comp);
  };
})(window.Labo);
