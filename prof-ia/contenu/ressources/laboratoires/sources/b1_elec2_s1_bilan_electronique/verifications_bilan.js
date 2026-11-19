/*
Rôle : vérifications des missions « bilan énergétique d'un circuit à transistor ou à AO » : tableau U, I, P des six dipôles
       du circuit à transistor (tensions lues au voltmètre, intensités aux ampèremètres), puissances attendues, mesures du
       montage à AO.
Reçoit : les faits (« bilan_transistor », « thermique », « bilan_ao ») et la feuille du tableur.
Produit : Labo.verif_bilan = { tableau, fournie(f), transistor(f) (mW), alim(f), charge(f), ao(f) (mW), gain(f) }.
Utilisé par : simulation.js.
*/
(function (L) {
  const ORDRE = ["g1", "rb", "be", "g2", "rc", "ce"], NOMS = { g1: "G1", rb: "RB", be: "la jonction B-E", g2: "G2", rc: "RC", ce: "C-E" };
  const BT = (f) => f.bilan_transistor || { tensions: {} }, BA = (f) => f.bilan_ao || {};
  const pres = (a, b, t) => b !== null && a !== null && a !== undefined && Math.abs(a - b) <= t * Math.abs(a) + 1e-9;
  const I = (b, k) => (k < 3 ? b.IB : b.IC), P = (b, nom) => (b.tensions[nom] || 0) * I(b, ORDRE.indexOf(nom));

  function tableau({ faits, feuille }) {
    // Lignes 2 à 7 : U (A) lue au voltmètre aux bornes du dipôle, I (B) en mA (IB puis IC), P = A·B (C) en mW.
    const v = (c, n) => feuille.valeur_sure(`${c}${n}`), b = BT(faits);
    if (b.E1 !== 5 || !b.IB || !b.IC) return "Réglez G1 à 5,0 V ; les ampèremètres doivent indiquer IB et IC.";
    for (let k = 0; k < 6; k++) {
      const n = k + 2, nom = ORDRE[k], u = b.tensions[nom];
      if (v("A", n) === null) return false;
      if (u === undefined) return `Mesurez la tension aux bornes de ${NOMS[nom]} avec le voltmètre (ligne ${n}).`;
      if (!pres(u, v("A", n), 0.015)) return `Ligne ${n} : en A, la tension (V) lue aux bornes de ${NOMS[nom]}.`;
      if (!pres(I(b, k), v("B", n), 0.015)) return `Ligne ${n} : en B, ${k < 3 ? "IB" : "IC"} en mA.`;
      if (!pres(v("A", n) * v("B", n), v("C", n), 0.005)) return `Ligne ${n} : en C, =A${n}*B${n} (mW).`;
    }
    return true;
  }

  const fournie = (f) => P(BT(f), "g1") + P(BT(f), "g2"), transistor = (f) => P(BT(f), "be") + P(BT(f), "ce");
  const alim = (f) => 15 * ((BA(f).ip || 0) + (BA(f).im || 0)), charge = (f) => (BA(f).us || 0) ** 2 / 0.998;
  const ao = (f) => alim(f) - charge(f) - (BA(f).us || 0) ** 2 / 31.95, gain = (f) => (BA(f).us || 0) / (BA(f).ue || 1);

  L.verif_bilan = { tableau, fournie, transistor, alim, charge, ao, gain };
})(window.Labo);
