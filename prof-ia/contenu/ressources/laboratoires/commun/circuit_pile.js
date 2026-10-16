/*
Rôle : pile plate de 4,5 V dans un boîtier à bornes (borne + rouge, borne − noire) : source de tension continue
       (résistance interne 1 Ω).
Reçoit : le circuit (circuit.js) et le réglage { id, x, y, E (V) }.
Produit : Labo.pile(c, reglage) -> composant ; bornes « + » et « − ».
Utilisé par : les postes des simulations de tension.
*/
(function (L) {
  const R_INTERNE = 1;

  L.pile = function (c, { id = "pile", x, y, E = 4.5 }) {
    // Boîtier noir, pile plate rouge et jaune visible par la fenêtre, inscription, deux bornes.
    const comp = { id, E, g: L.svg("g", { class: "pile" }, c.calque_composants) };
    L.boitier(comp.g, x, y, 130, 60, 14, { dessus: "#3a3f45", face: "#24282c" });
    L.svg("rect", { x: x + 34, y: y + 8, width: 62, height: 22, rx: 2, fill: "#c62828", stroke: "#7a1515" }, comp.g);
    L.svg("rect", { x: x + 34, y: y + 22, width: 62, height: 8, fill: "#f2c230" }, comp.g);
    L.texte(comp.g, x + 65, y + 16, `${String(E).replace(".", ",")} V`, { "font-size": 9, "font-weight": 700, fill: "#fff" });
    L.texte(comp.g, x + 18, y + 18, "−", { "font-size": 14, "font-weight": 700, fill: "#e8e8e2" });
    L.texte(comp.g, x + 112, y + 18, "+", { "font-size": 13, "font-weight": 700, fill: "#ff6b5b" });
    c.borne(comp, "−", x + 18, y + 42, L.NOIR_BORNE);
    c.borne(comp, "+", x + 112, y + 42, L.ROUGE_BORNE);
    comp.dipoles = () => [{ a: "−", b: "+", g: 1 / R_INTERNE, j: E / R_INTERNE }];
    return c.ajouter(comp);
  };
})(window.Labo);
