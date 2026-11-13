/*
Rôle : loupe « modèle » du courant : posée sur un fil, elle montre le cuivre (ions + fixes) et ses électrons libres, qui
       s'agitent et, si le courant passe, avancent ensemble en sens inverse de la flèche I (sens conventionnel) ;
       posée dans la solution du tube en U, elle montre les ions Cu²⁺ et dichromate qui migrent en sens contraires.
Reçoit : le groupe SVG ; le circuit (ses fils et leur courant) ; le tube (zone, courant) ; la position de départ.
Produit : Labo.loupe_courant(groupe, circuit, tube, depart) ; faits notés « loupe_fil » = { courant: oui/non },
          « loupe_solution » = { courant: oui/non }.
Utilisé par : postes_courant.js.
*/
(function (L) {
  const R = 50, N = 12;
  const hasard = (k) => ((Math.sin(k * 12.9898) * 43758.5453) % 1 + 1) % 1;

  function fil_sous(circuit, p) {
    // Fil le plus proche du centre de la loupe (à moins de 14 px) : courant et direction du câble (de a vers b).
    let meilleur = null;
    for (const f of circuit.fils) for (let t = 0.02; t < 0.99; t += 0.02) {
      const q = L.fils.point(f, t), d = Math.hypot(q.x - p.x, q.y - p.y);
      if (d < 14 && (!meilleur || d < meilleur.d)) {
        const a = L.fils.point(f, t - 0.02), b = L.fils.point(f, t + 0.02);
        meilleur = { d, i: f.i, angle: (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI };
      }
    }
    return meilleur;
  }

  function metal(g, c, fil, temps) {
    // Bande de cuivre tournée comme le câble ; ions + fixes ; électrons agités, qui dérivent contre le courant.
    const b = L.svg("g", { transform: `rotate(${fil.angle} ${c.x} ${c.y})` }, g), passe = Math.abs(fil.i) > 0.001;
    L.svg("rect", { x: c.x - R, y: c.y - 22, width: 2 * R, height: 44, fill: "#e6a067" }, b);
    for (let k = 0; k < 8; k++) for (const dy of [-11, 11]) L.texte(b, c.x - 42 + k * 12 + (dy > 0 ? 6 : 0), c.y + dy, "+", { "font-size": 10, "font-weight": 700, fill: "#8a3b12" });
    const v = passe ? -Math.sign(fil.i) * (14 + 30 * Math.min(1, Math.abs(fil.i) / 0.1)) : 0;
    for (let k = 0; k < N; k++) {
      const u = ((((hasard(k) * 2 * R + v * temps) % (2 * R)) + 2 * R) % (2 * R)) - R;
      const w = (hasard(k + 50) - 0.5) * 34 + Math.sin(temps * 9 + k) * 3;
      L.svg("circle", { cx: c.x + u + Math.cos(temps * 11 + k) * 2, cy: c.y + w, r: 3.6, fill: "#cfe3f7", stroke: "#0d47a1", "stroke-width": 0.7 }, b);
    }
    if (passe) {
      const s = Math.sign(fil.i);
      L.svg("path", { d: `M${c.x - 26 * s} ${c.y - 30} H${c.x + 22 * s} l${-7 * s} -4 v8 l${7 * s} -4`, stroke: "#c62828", "stroke-width": 2.4, fill: "#c62828" }, b);
      L.texte(b, c.x, c.y - 37, "I", { "font-size": 10, "font-weight": 700, fill: "#c62828" });
    }
    return passe ? "fil de cuivre : les électrons libres avancent" : "fil de cuivre : électrons agités, sans avancer";
  }

  function solution(g, c, i, temps) {
    // Eau, ions cuivre (bleus, vers la droite = électrode −) et dichromate (orange, vers la gauche = électrode +).
    L.svg("circle", { cx: c.x, cy: c.y, r: R - 3, fill: "#e4f1f4" }, g);
    const v = Math.abs(i) > 0.001 ? 10 + 25 * Math.min(1, Math.abs(i) / 0.1) : 0;
    for (let k = 0; k < 10; k++) {
      const cation = k % 2 === 0, u = ((((hasard(k) * 80 + (cation ? v : -v) * temps) % 80) + 80) % 80) - 40;
      const y = c.y - 30 + hasard(k + 20) * 60 + Math.sin(temps * 7 + k) * 2;
      L.svg("circle", { cx: c.x + u, cy: y, r: cation ? 5 : 7, fill: cation ? "#2f7fd8" : "#e8891c", stroke: "#0006", "stroke-width": 0.6 }, g);
    }
    L.texte(g, c.x - R + 9, c.y, "+", { "font-size": 13, "font-weight": 700, fill: "#c62828" });
    L.texte(g, c.x + R - 9, c.y, "−", { "font-size": 15, "font-weight": 700, fill: "#222" });
    return v ? "Cu²⁺ (bleu) vers −, dichromate (orange) vers +" : "solution : ions agités, sans migrer";
  }

  function legende(g, p, texte) {
    // Étiquette sombre sous la loupe.
    const l = texte.length * 5.9 + 14;
    L.svg("rect", { x: p.x - l / 2, y: p.y + R + 7, width: l, height: 18, rx: 3, fill: "#1e2326", opacity: 0.92 }, g);
    L.texte(g, p.x, p.y + R + 16.5, texte, { "font-size": 10.5, "font-weight": 700, fill: "#f1ead2" });
  }

  L.loupe_courant = function (parent, circuit, tube, depart) {
    // Loupe déplaçable, redessinée à chaque image tant qu'elle montre quelque chose.
    const g = L.svg("g", { class: "loupe", role: "button", "aria-label": "Loupe : modèle du courant" }, parent);
    let p = { ...depart }, vu = "";
    const image = (t) => {
      g.replaceChildren();
      const fil = fil_sous(circuit, p), dans = !fil && tube && tube.zone(p.x, p.y), clip = `loupe-${Math.round(depart.x)}`;
      L.svg("line", { x1: p.x + R * 0.7, y1: p.y + R * 0.7, x2: p.x + R * 1.5, y2: p.y + R * 1.5, stroke: "#4e342e", "stroke-width": 10, "stroke-linecap": "round" }, g);
      L.svg("circle", { cx: p.x, cy: p.y, r: R, fill: fil || dans ? "#fbfbf6" : "#dbeeff", "fill-opacity": fil || dans ? 1 : 0.35 }, g);
      if (fil || dans) {
        const cp = L.svg("clipPath", { id: clip }, g);
        L.svg("circle", { cx: p.x, cy: p.y, r: R - 3 }, cp);
        const vue = L.svg("g", { "clip-path": `url(#${clip})` }, g);
        const texte = fil ? metal(vue, p, fil, t / 1000) : solution(vue, p, tube.i, t / 1000);
        legende(g, p, texte);
        const fait = [fil ? "loupe_fil" : "loupe_solution", Math.abs(fil ? fil.i : tube.i) > 0.001];
        if (fait.join() !== vu) { vu = fait.join(); L.missions.noter(fait[0], { courant: fait[1] }); }
      }
      L.svg("circle", { cx: p.x, cy: p.y, r: R, fill: "none", stroke: "#5d4037", "stroke-width": 6 }, g);
      requestAnimationFrame(image);
    };
    L.glissable(g, { soulever: false, debut: () => ({ ...p }), deplacer: (q) => { p = q; } });
    requestAnimationFrame(image);
  };
})(window.Labo);
