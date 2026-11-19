/*
Rôle : paillasse « puissance reçue par un moteur » : alimentation réglable, interrupteur, ampèremètre et voltmètre
       (multimètres posés au fond de la paillasse), moteur à treuil qui monte une masse de 200 g. À chaque montée
       chronométrée (40 cm), si l'ampèremètre est en série avec le moteur et le voltmètre branché à ses bornes, l'essai
       { U, I (lus sur les appareils), Δt (lu sur le chronomètre) } est enregistré.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_puissance(g) -> { pense_bete } ; fait « moteur » = { essais: [{ U (V), I (A), dt (s) }], mal_branche }.
Utilisé par : simulation.js.
*/
(function (L) {
  const mode = (m) => L.MULTIMETRE_MODES.find((k) => k.nom === m.mode) || {};
  const lu = (m) => Number(Math.abs(parseFloat(m.lecture) / mode(m).facteur).toFixed(6));

  function lecture(c, ampere, volt, moteur) {
    // U et I du moteur lus sur les appareils, s'ils sont bien branchés et sur un bon calibre ; sinon null.
    if (mode(ampere).type !== "A" || ampere.depasse || mode(volt).type !== "V" || volt.depasse) return null;
    const n = (a, b) => c.meme_noeud(`V.${a}`, `moteur.${b}`);
    if (!((n("VΩ", "1") && n("COM", "2")) || (n("VΩ", "2") && n("COM", "1")))) return null;
    if (Math.abs(lu(ampere) - Math.abs(moteur.i)) > 0.01 * Math.abs(moteur.i) + 2e-4) return null;
    return { U: lu(volt), I: lu(ampere) };
  }

  L.poste_puissance = function (g) {
    // Matériel ; un essai est noté à la fin de chaque montée chronométrée.
    const { pense_bete } = L.decor_circuit(g, 0), c = L.circuit(g);
    L.generateur(c, { x: 40, y: 196, E: 6, lettres: ["N", "P"], reglable: true });
    L.interrupteur(c, { id: "k", x: 250, y: 230 });
    const ampere = L.multimetre(c, { id: "A", x: 350, y: 60, etiquette: "A" }), volt = L.multimetre(c, { id: "V", x: 510, y: 60, etiquette: "V" });
    const m = L.moteur_treuil(c, { id: "moteur", x: 680, y: 470 });
    const essais = [];
    let vues = 0;
    setInterval(() => {
      if (m.montees === vues) return;
      vues = m.montees;
      const p = lecture(c, ampere, volt, m);
      if (p) essais.push({ ...p, dt: Number(m.dt.toFixed(2)) });
      L.missions.noter("moteur", { essais: essais.map((e) => ({ ...e })), mal_branche: !p });
    }, 100);
    c.calculer();
    return { pense_bete };
  };
})(window.Labo);
