/*
Rôle : pendule électrostatique : petite boule de polystyrène recouverte d'aluminium (masse 0,2 g), pendue à un fil isolant
       de 30 cm sous une potence. Une baguette électrisée approchée attire la boule neutre (influence) ; au contact, une
       partie de la charge passe sur la boule, qui se charge du même signe et est alors repoussée ; une baguette de signe
       opposé l'attire. Toucher la boule avec le doigt la décharge. Mouvement de pendule amorti.
Reçoit : le groupe SVG, le point d'attache (potence) et la liste des baguettes (état de frottement.js).
Produit : Labo.pendule(g, attache, baguettes) -> p { q (nC), decharger(), tic(dt) } ; fait « pendule » = { q, contacts,
          vu : { attire_neutre, repousse_contact, attire_oppose } }.
Utilisé par : postes_electrisation.js.
*/
(function (L) {
  const LF = 300, R = 9, K = 190, KI = 2100, W0 = 2.6, AMORT = 0.9, DEMI = 100;

  function point_proche(b, B) {
    // Point de la baguette (segment horizontal de 20 cm) le plus proche de la boule.
    return { x: Math.max(b.pos.x - DEMI, Math.min(b.pos.x + DEMI, B.x)), y: b.pos.y };
  }

  function force(p, B, b) {
    // Force de la baguette sur la boule (unités du poids) : Coulomb entre charges, plus l'attraction par influence (bornée de près).
    const P = point_proche(b, B), dx = B.x - P.x, dy = B.y - P.y, d = Math.max(R + 6, Math.hypot(dx, dy));
    const di = Math.max(d, 35), f = (K * b.q * p.q) / (d * d) - (KI * b.q * b.q) / (di * di * di);
    return { x: (f * dx) / d, y: (f * dy) / d, d, f, P };
  }

  function contact(p, b, P) {
    // Au contact, la boule (conductrice) prend une partie de la charge de la baguette (isolante, charge locale).
    const dq = 0.3 * (b.q - p.q);
    if (Math.abs(dq) < 0.05) return;
    p.q += dq; b.q -= dq; p.contacts++; p.charge_par = Math.sign(b.q);
  }

  L.pendule = function (g, A, baguettes) {
    // Fil et boule redessinés à chaque image ; observations notées.
    const p = { phi: 0, w: 0, q: 0, contacts: 0, vu: { attire_neutre: false, repousse_contact: false, attire_oppose: false } }, c = L.svg("g", {}, g);
    const boule = () => ({ x: A.x + LF * Math.sin(p.phi), y: A.y + LF * Math.cos(p.phi) });
    p.decharger = () => { p.q = 0; };
    p.tic = (dt) => {
      // Somme des forces des baguettes tenues ou posées, équation du pendule amorti, contacts, observations.
      const B = boule(), t = { x: Math.cos(p.phi), y: -Math.sin(p.phi) };
      let ft = 0;
      for (const b of baguettes) {
        if ((!b.tenue && !b.pose_sur_etrier) || Math.abs(b.q) < 0.2) continue;
        const F = force(p, B, b);
        ft += F.x * t.x + F.y * t.y;
        if (F.d <= R + 7) contact(p, b, F.P);
        const vers = Math.sign(F.P.x - B.x) * Math.sign(p.phi);
        if (Math.abs(p.phi) > 0.08 && Math.abs(p.q) < 0.1 && vers > 0) p.vu.attire_neutre = true;
        if (Math.abs(p.phi) > 0.08 && p.q * b.q > 0 && vers < 0 && p.contacts) p.vu.repousse_contact = true;
        if (Math.abs(p.phi) > 0.08 && p.q * b.q < 0 && vers > 0) p.vu.attire_oppose = true;
      }
      p.w += ((ft - Math.sin(p.phi)) * W0 * W0 - 2 * AMORT * W0 * p.w) * dt;
      p.phi = Math.max(-1.2, Math.min(1.2, p.phi + p.w * dt));
      c.replaceChildren();
      const N = boule();
      L.svg("line", { x1: A.x, y1: A.y, x2: N.x, y2: N.y, stroke: "#e9e4d2", "stroke-width": 1 }, c);
      L.svg("circle", { cx: N.x, cy: N.y, r: R, fill: "url(#metal)", stroke: "#666" }, c);
    };
    setInterval(() => L.missions.noter("pendule", { q: Math.round(p.q * 100) / 100, contacts: p.contacts, vu: { ...p.vu } }), 250);
    return p;
  };
})(window.Labo);
