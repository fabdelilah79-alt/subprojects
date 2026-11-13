/*
Rôle : électrolyse d'une solution de chlorure de sodium dans un tube en U, composant du circuit : tube en U sur son support en
       bois (planchette, colliers), deux électrodes de graphite tenues par des pinces crocodiles ; la solution contient de la
       phénolphtaléine. Récepteur de tension seuil E' et de résistance r' ; quand le courant passe, des bulles montent des deux
       électrodes ; à la cathode (où sort le courant), 2 H₂O + 2 e⁻ → H₂ + 2 HO⁻ : la solution rosit ; à l'anode (où entre le
       courant), 2 Cl⁻ → Cl₂ + 2 e⁻ : léger jaunissement. Deux bandes de papier imbibé d'iodure de potassium et d'empois
       d'amidon (facultatives) : posées sur l'ouverture d'une branche où se dégage du dichlore, elles bleuissent.
       Modèle simplifié : couleurs proportionnelles à la charge passée, sans diffusion ni dégagement d'oxygène.
Reçoit : le circuit (circuit.js) et { id, x, y (haut de la branche de gauche), E (V), r (Ω), papiers (faux par défaut), etiquette }.
Produit : Labo.tube_electrolyse(c, reglage) -> composant { i (A, de la borne 1 vers la borne 2), etat() -> { Q (C), anode_Q, cathode_Q
          ({ "1", "2" } en C), papiers : [{ branche ("1", "2" ou null), bleu (0 à 1) }] } } ; bornes « 1 » (gauche) et « 2 » (droite).
Utilisé par : les simulations de l'électrolyse (2e année du bac).
*/
(function (L) {
  const ECART = 90, NIVEAU = 40, POINTE = 150, ARRONDI = 0.04;
  const courant = (u, E, r) => { const v = Math.abs(u) - E, l = v > 20 * ARRONDI ? v : ARRONDI * Math.log1p(Math.exp(v / ARRONDI)); return (Math.sign(u) * l) / r; };
  const branche = (x, y, haut) => `M${x} ${y + haut} V${y + 155} A45 45 0 0 0 ${x + ECART} ${y + 155} V${y + haut}`;

  function support(g, x, y) {
    // Socle et planchette de bois, colliers métalliques autour des deux branches.
    L.svg("ellipse", { cx: x + 45, cy: y + 226, rx: 92, ry: 9, fill: "#000", opacity: 0.3 }, g);
    L.svg("rect", { x: x - 25, y: y + 12, width: 140, height: 200, rx: 3, fill: "#a8794a", stroke: "#6e4a28" }, g);
    L.svg("rect", { x: x - 25, y: y + 12, width: 140, height: 6, fill: "#c49565" }, g);
    L.svg("path", { d: `M${x - 60} ${y + 204} h210 l-12 -10 h-186 z`, fill: "#c49565", stroke: "#6e4a28" }, g);
    L.svg("rect", { x: x - 60, y: y + 204, width: 210, height: 16, fill: "#946638", stroke: "#6e4a28" }, g);
  }

  function colliers(g, x, y) {
    // Deux colliers devant les branches, vissés sur la planchette.
    for (const bx of [x, x + ECART]) {
      L.svg("rect", { x: bx - 15, y: y + 92, width: 30, height: 8, rx: 2, fill: "url(#acier)", stroke: "#555" }, g);
      L.svg("circle", { cx: bx - 11, cy: y + 96, r: 1.6, fill: "#333" }, g);
      L.svg("circle", { cx: bx + 11, cy: y + 96, r: 1.6, fill: "#333" }, g);
    }
  }

  function tube(g, x, y) {
    // Verre du tube en U, solution incolore, bords des ouvertures.
    L.svg("path", { d: branche(x, y, 0), fill: "none", stroke: "#9fb6be", "stroke-width": 25 }, g);
    L.svg("path", { d: branche(x, y, 0), fill: "none", stroke: "#e9f3f6", "stroke-width": 22 }, g);
    L.svg("path", { d: branche(x, y, NIVEAU), fill: "none", stroke: "#d6ecf3", "stroke-width": 20 }, g);
    for (const bx of [x, x + ECART]) L.svg("ellipse", { cx: bx, cy: y, rx: 12.5, ry: 3, fill: "#f4fafc", stroke: "#9fb6be" }, g);
  }

  function electrode(g, bx, y) {
    // Baguette de graphite et pince crocodile.
    L.svg("rect", { x: bx - 3, y: y - 40, width: 6, height: POINTE + 40, rx: 1.5, fill: "#3a3d41", stroke: "#1f2124" }, g);
    L.svg("rect", { x: bx - 2, y: y - 38, width: 1.6, height: POINTE + 36, fill: "#fff", opacity: 0.18 }, g);
    L.svg("path", { d: `M${bx - 5} ${y - 34} l-2 -12 h14 l-2 12 z`, fill: "#2b2f33", stroke: "#111" }, g);
  }

  function couleurs(g, x, y, s) {
    // Rose de la phénolphtaléine à la cathode, léger jaune du dichlore à l'anode ; teinte selon la charge passée.
    g.replaceChildren();
    for (const [k, bx] of [["1", x], ["2", x + ECART]]) {
      const rose = Math.min(0.85, s.cathode_Q[k] / 10), jaune = Math.min(0.3, s.anode_Q[k] / 40);
      const d = `M${bx} ${y + NIVEAU} V${y + POINTE + 8}`;
      if (rose > 0.01) L.svg("path", { d, stroke: "#e0399a", "stroke-width": 20, opacity: rose }, g);
      if (rose > 0.01) L.svg("path", { d: `M${bx} ${y + POINTE} V${y + 172}`, stroke: "#e0399a", "stroke-width": 20, opacity: rose * 0.5 }, g);
      if (jaune > 0.01) L.svg("path", { d, stroke: "#c8d23c", "stroke-width": 20, opacity: jaune }, g);
    }
  }

  function bulles(g, x, y, comp) {
    // Bulles de gaz qui montent des deux électrodes quand le courant passe.
    const liste = [];
    let avant = null;
    const image = (t) => {
      const dt = avant === null ? 0 : Math.min(0.05, (t - avant) / 1000);
      avant = t;
      if (Math.random() < Math.abs(comp.i) * 120 * dt * 60) liste.push({ x: x + (Math.random() < 0.5 ? 0 : ECART) + (Math.random() - 0.5) * 12, y: y + POINTE - 4, r: 0.8 + Math.random() * 1.4 });
      g.replaceChildren();
      for (const b of liste) { b.y -= 45 * dt; L.svg("circle", { cx: b.x, cy: b.y, r: b.r, fill: "#fff", opacity: 0.85 }, g); }
      while (liste.length && liste[0].y < y + NIVEAU + 2) liste.shift();
      requestAnimationFrame(image);
    };
    requestAnimationFrame(image);
  }

  function papier(g, x, y, s, k) {
    // Bande de papier humide sur la table ; posée sur l'ouverture d'une branche, elle y reste et bleuit s'il s'y dégage du dichlore.
    const repos = { x: x + 175, y: y + 150 + k * 26 }, p = { branche: null, bleu: 0 }, el = L.svg("g", { class: "papier-ki", role: "button", "aria-label": "Papier à l'iodure de potassium" }, g);
    const bande = L.svg("rect", { x: -4, y: -20, width: 8, height: 40, rx: 1, fill: "#f2efe2", stroke: "#b9b39b" }, el);
    L.svg("rect", { x: -22, y: -24, width: 44, height: 48, fill: "#fff", opacity: 0.001 }, el);
    const poser = (q, angle) => el.setAttribute("transform", `translate(${q.x} ${q.y}) rotate(${angle})`);
    const ouverture = (k2) => ({ x: (k2 === "1" ? x : x + ECART) + 8, y: y - 12 });
    poser(repos, 90);
    L.glissable(el, {
      debut: () => (p.branche ? ouverture(p.branche) : repos),
      deplacer: (q) => poser(q, 30),
      lacher: (q) => {
        p.branche = ["1", "2"].find((k2) => Math.hypot(q.x - ouverture(k2).x, q.y - ouverture(k2).y) < 30) || null;
        poser(p.branche ? ouverture(p.branche) : repos, p.branche ? 20 : 90);
      },
    });
    setInterval(() => {
      if (p.branche && s.anode_Q[p.branche] > 0.3) p.bleu = Math.min(1, p.bleu + 0.05);
      bande.setAttribute("fill", `rgb(${242 - 200 * p.bleu},${239 - 205 * p.bleu},${226 - 150 * p.bleu})`);
    }, 100);
    return p;
  }

  L.tube_electrolyse = function (c, { id = "tube_u", x, y, E = 2.2, r = 18, papiers = false, etiquette = "NaCl (1 mol/L) + phénolphtaléine" }) {
    // Support, tube, électrodes, bornes, modèle électrique, couleurs et bulles ; charge comptée dix fois par seconde.
    const comp = { id, i: 0, u: 0, g: L.svg("g", { class: "tube-electrolyse" }, c.calque_composants) };
    const s = { Q: 0, anode_Q: { 1: 0, 2: 0 }, cathode_Q: { 1: 0, 2: 0 }, papiers: [] };
    support(comp.g, x, y); tube(comp.g, x, y);
    const gc = L.svg("g", { "pointer-events": "none" }, comp.g), gb = L.svg("g", { "pointer-events": "none" }, comp.g);
    electrode(comp.g, x, y); electrode(comp.g, x + ECART, y); colliers(comp.g, x, y);
    L.texte(comp.g, x + 45, y + 238, etiquette, { "font-size": 8.5, "font-weight": 700, fill: "#e8e2cc" });
    c.borne(comp, "1", x, y - 50, "#c9a227"); c.borne(comp, "2", x + ECART, y - 50, "#c9a227");
    const dipole = L.dipole_non_lineaire("1", "2", (u) => courant(u, E, r), 0.3);
    comp.dipoles = () => [dipole];
    comp.mettre_a_jour = ({ u, i }) => { comp.i = i[0]; comp.u = u("1", "2"); };
    bulles(gb, x, y, comp);
    if (papiers) s.papiers = [0, 1].map((k) => papier(comp.g, x, y, s, k));
    setInterval(() => {
      const dq = Math.abs(comp.i) * 0.1;
      if (dq < 1e-9) return;
      const an = comp.i > 0 ? "1" : "2", ca = an === "1" ? "2" : "1";
      s.Q += dq; s.anode_Q[an] += dq; s.cathode_Q[ca] += dq;
      couleurs(gc, x, y, s);
    }, 100);
    comp.etat = () => ({ Q: s.Q, anode_Q: { ...s.anode_Q }, cathode_Q: { ...s.cathode_Q }, papiers: s.papiers.map((p) => ({ ...p })) });
    return c.ajouter(comp);
  };
})(window.Labo);
