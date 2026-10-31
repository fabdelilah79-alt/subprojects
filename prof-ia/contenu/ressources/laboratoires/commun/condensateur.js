/*
Rôle : condensateur (non polarisé) sur son support à deux bornes : boîtier bleu où sont imprimés son nom et sa capacité ;
       si plusieurs valeurs sont données, c'est une boîte de condensateurs : un toucher sur le boîtier passe à la valeur
       suivante (le condensateur choisi est neuf : déchargé). Il évolue avec l'horloge du circuit (circuit_temps.js) :
       pendant un pas dt, i = C·du/dt devient i = (C/dt)·(u − u précédente) ; avec la méthode des trapèzes (c.trapeze),
       i + i précédent = (2C/dt)·(u − u précédente). Les charges +q et −q des armatures sont
       écrites près des bornes quand il est chargé. Sans horloge, il se comporte comme un circuit ouvert en continu ; avec un GBF,
       son admittance j·C·ω sert au calcul du régime sinusoïdal forcé (circuit_sinus.js).
Reçoit : le circuit et { id, x, y, C (F), valeurs [F] (facultatif), nom, lettres }.
Produit : Labo.condensateur(c, reglage) -> comp { C, u (V, borne 1 − borne 2), i (A, de 1 vers 2), q (C) } ; bornes « 1 », « 2 ».
Utilisé par : les simulations des dipôles RC, du circuit RLC (libre et forcé).
*/
(function (L) {
  const ecrire_C = (C) => (C >= 1e-3 ? `${String(C * 1e3).replace(".", ",")} mF` : `${String(Math.round(C * 1e7) / 10).replace(".", ",")} µF`);
  L.ecrire_capacite = ecrire_C;

  function corps(g, x, y, comp) {
    // Boîtier du condensateur, capacité imprimée, charges des armatures si |u| > 0,1 V.
    g.replaceChildren();
    for (const dx of [14, 78]) L.svg("line", { x1: x + dx, y1: y + 18, x2: x + dx, y2: y + 26, stroke: "#9aa0a6", "stroke-width": 1.6 }, g);
    L.svg("line", { x1: x + 14, y1: y + 18, x2: x + 78, y2: y + 18, stroke: "#9aa0a6", "stroke-width": 1.6 }, g);
    L.svg("rect", { x: x + 24, y: y + 6, width: 44, height: 22, rx: 5, fill: "#2d5fa8", stroke: "#173a6c" }, g);
    L.svg("rect", { x: x + 26, y: y + 8, width: 40, height: 4, rx: 2, fill: "#fff", opacity: 0.25 }, g);
    L.texte(g, x + 46, y + 22, ecrire_C(comp.C), { "font-size": 8, "font-weight": 700, fill: "#f4f1e6" });
    if (Math.abs(comp.u) > 0.1) [["1", 6], ["2", 86]].forEach(([b, dx]) => { const s = (b === "1") === comp.u > 0 ? "+q" : "−q"; L.texte(g, x + dx, y + 2, s, { "font-size": 8, "font-weight": 700, fill: s === "+q" ? "#c62828" : "#1565c0" }); });
  }

  L.condensateur = function (c, { id = "condensateur", x, y, C = 1e-4, valeurs = null, nom = "C", lettres = null }) {
    // Support, boîtier ; dipôle « compagnon » pour l'horloge ; toucher : valeur suivante (boîte de condensateurs).
    const comp = { id, C, u: 0, u_calc: 0, i: 0, i_prec: 0, q: 0, g: L.svg("g", { class: `condensateur condensateur-${id}`, role: valeurs ? "button" : null, "aria-label": "Condensateur" }, c.calque_composants) };
    L.support_dipole(c, comp, x, y, valeurs ? `${nom} (boîte : touchez)` : nom, ["1", "2"], ["#4a4f55", "#4a4f55"], lettres);
    const gc = L.svg("g", {}, comp.g), dessiner = () => corps(gc, x, y, comp);
    if (valeurs) L.glissable(comp.g, { soulever: false, debut: () => ({ x: 0, y: 0 }), toucher: () => { comp.C = valeurs[(valeurs.indexOf(comp.C) + 1) % valeurs.length]; comp.u = 0; comp.q = 0; comp.i_prec = 0; dessiner(); c.calculer(); } });
    comp.dipoles = () => {
      if (!c.pas) return [];
      const g = ((c.trapeze ? 2 : 1) * comp.C) / c.pas;
      return [{ a: "1", b: "2", g, j: -g * comp.u - (c.trapeze ? comp.i_prec : 0) }];
    };
    comp.admittance = (w) => [{ a: "1", b: "2", y: [0, comp.C * w] }];
    comp.mettre_a_jour = ({ u, i }) => { comp.u_calc = u("1", "2"); comp.i = i[0] || 0; };
    comp.valider = () => { const avant = Math.abs(comp.u) > 0.1; comp.u = comp.u_calc; comp.i_prec = comp.i; comp.q = comp.C * comp.u; if (avant !== Math.abs(comp.u) > 0.1) dessiner(); };
    dessiner();
    return c.ajouter(comp);
  };
})(window.Labo);
