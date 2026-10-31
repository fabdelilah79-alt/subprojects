/*
Rôle : paillasse « énergie fournie par un générateur » : deux piles plates 4,5 V (r = 1,5 Ω), interrupteur, résistances
       22 Ω et 47 Ω, ampèremètre et voltmètre (au fond de la paillasse). À chaque calcul du circuit, la mesure est rangée
       selon les piles et les résistances traversées par le courant (ex. « p1:r22 », « p1+p2:r47 »), avec la tension aux
       bornes du générateur si le voltmètre y est branché ; à vide, le voltmètre branché sur la pile 1 donne E.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_generateur(g) -> { pense_bete } ; fait « generateur » = { E_lu (V ou null), points: { <clé>: { I (A), U (V ou null) } } }.
Utilisé par : simulation.js.
*/
(function (L) {
  const mode = (m) => L.MULTIMETRE_MODES.find((k) => k.nom === m.mode) || {};
  const lu = (m) => Number(Math.abs(parseFloat(m.lecture) / mode(m).facteur).toFixed(6));
  const proche = (a, I) => Math.abs(Math.abs(a) - I) < 0.01 * I + 1e-5;

  function tension(c, volt, piles) {
    // Tension lue aux bornes du générateur (une pile, ou deux piles en série) ; null si le voltmètre n'y est pas branché.
    if (mode(volt).type !== "V" || volt.depasse) return null;
    const n = (a, b) => c.meme_noeud(`${volt.id}.${a}`, b);
    const bornes = piles.length === 1 ? [[`${piles[0].id}.+`, `${piles[0].id}.−`]] : [[`${piles[0].id}.+`, `${piles[1].id}.−`], [`${piles[1].id}.+`, `${piles[0].id}.−`]];
    return bornes.some(([p, m]) => (n("VΩ", p) && n("COM", m)) || (n("VΩ", m) && n("COM", p))) ? lu(volt) : null;
  }

  function ranger(c, e, { piles, resistances, ampere, volt }) {
    // Mesure à vide (E) ou en charge (I, U) selon les dipôles parcourus par le courant de la pile 1.
    const I = Math.abs(piles[0].i);
    if (I < 1e-5) { const U = tension(c, volt, [piles[0]]); if (U !== null) e.E_lu = U; return; }
    if (mode(ampere).type !== "A" || ampere.depasse || Math.abs(lu(ampere) - I) > 0.01 * I + 2e-4) return;
    const p = piles.filter((x) => proche(x.i, I)), r = resistances.filter((x) => proche(x.i, I));
    const cle = `${p.map((x) => x.id).join("+")}:${r.map((x) => x.id).join("+")}`, U = tension(c, volt, p);
    e.points[cle] = { I: lu(ampere), U: U ?? (e.points[cle] || {}).U ?? null };
  }

  L.poste_generateur = function (g) {
    // Matériel ; la mesure est rangée à chaque calcul du circuit.
    const { pense_bete } = L.decor_circuit(g, 0), c = L.circuit(g);
    const piles = [L.pile(c, { id: "p1", x: 40, y: 230, E: 4.5, r: 1.5, lettres: ["N", "P"] }), L.pile(c, { id: "p2", x: 190, y: 200, E: 4.5, r: 1.5, lettres: ["N'", "P'"] })];
    L.interrupteur(c, { id: "k", x: 340, y: 230 });
    const ampere = L.multimetre(c, { id: "A", x: 440, y: 60, etiquette: "A" }), volt = L.multimetre(c, { id: "V", x: 600, y: 60, etiquette: "V" });
    const resistances = [L.resistance(c, { id: "r22", x: 770, y: 230, R: 22, R_reelle: 22.1, nom: "R1" }), L.resistance(c, { id: "r47", x: 880, y: 230, R: 47, R_reelle: 46.8, nom: "R2" })];
    const e = { E_lu: null, points: {} };
    c.sur_calcul(() => { ranger(c, e, { piles, resistances, ampere, volt }); L.missions.noter("generateur", { E_lu: e.E_lu, points: JSON.parse(JSON.stringify(e.points)) }); });
    c.calculer();
    return { pense_bete };
  };
})(window.Labo);
