/*
Rôle : GBF piloté par l'horloge du circuit (circuit_temps.js) : le même appareil que gbf.js (touches de forme, de fréquence,
       d'amplitude ; sortie de résistance 50 Ω), mais sa tension suit le temps du circuit, pas à pas :
       u(t) = Umax·forme(2π·f·t). Le circuit n'est donc plus calculé « période par période » : les bobines et les
       condensateurs réagissent à la tension du moment, et l'interface d'acquisition enregistre les tensions.
Reçoit : le circuit (avec son horloge) et le réglage de gbf.js { id, x, y, forme, f (Hz), Umax (V) }.
Produit : Labo.gbf_temps(c, reglage) -> composant { forme, f, Umax } ; bornes « sortie », « masse » ; fait « gbf ».
Utilisé par : les simulations du dipôle RL (inductance avec une tension triangulaire).
*/
(function (L) {
  L.gbf_temps = function (c, reglage) {
    // Le GBF ordinaire, sans calcul période par période (c.alternatif reste vide), et sa tension à l'instant du pas.
    Object.defineProperty(c, "alternatif", { get: () => undefined, set: () => {}, configurable: true });
    const comp = L.gbf(c, reglage);
    comp.dipoles = () => [{ a: "masse", b: "sortie", g: 1 / 50, j: (comp.Umax * L.forme_tension(comp.forme, 2 * Math.PI * comp.f * c.horloge.t)) / 50 }];
    return comp;
  };
})(window.Labo);
