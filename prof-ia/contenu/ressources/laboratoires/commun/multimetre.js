/*
Rôle : multimètre numérique utilisé en ampèremètre : un commutateur rotatif (OFF, 10 A, 200 mA, 20 mA), trois bornes
       (10A, mA, COM). Le courant qui entre par la borne 10A ou mA et sort par COM s'affiche positif, négatif dans l'autre
       sens ; au-delà du calibre, l'afficheur montre « 1 » (dépassement). Un toucher sur un repère du commutateur le tourne.
Reçoit : le circuit (circuit.js) et le réglage { id, x, y, mode (« OFF », « 10A », « 200mA », « 20mA »), etiquette (nom écrit sur l'appareil) }.
Produit : Labo.multimetre(c, reglage) -> composant { mode, valeur (A, signée), lecture (texte affiché), depasse } ;
          fait noté « calibre » = { <id> : mode } à chaque changement de calibre.
Utilisé par : les postes des simulations d'électricité.
*/
(function (L) {
  const MODES = [
    { nom: "OFF", angle: -76 },
    { nom: "10A", angle: -30, borne: "10A", calibre: 10, unite: "A", facteur: 1, decimales: 2 },
    { nom: "200mA", angle: 30, borne: "mA", calibre: 0.2, unite: "mA", facteur: 1000, decimales: 1 },
    { nom: "20mA", angle: 76, borne: "mA", calibre: 0.02, unite: "mA", facteur: 1000, decimales: 2 },
  ];
  const ETIQUETTES = { OFF: "OFF", "10A": "10 A", "200mA": "200m", "20mA": "20m" };

  function corps(g, x, y) {
    // Gaine jaune, façade sombre, écran à cristaux liquides, légende des bornes.
    L.boitier(g, x, y, 128, 200, 12, { dessus: "#f0bf2a", face: "#b98d14" });
    L.svg("rect", { x: x + 8, y: y + 8, width: 112, height: 184, rx: 8, fill: "#2f3337" }, g);
    L.svg("rect", { x: x + 16, y: y + 16, width: 96, height: 40, rx: 3, fill: "#b7c3a6", stroke: "#1b1e1a" }, g);
    for (const [dx, t] of [[22, "10A"], [64, "mA"], [106, "COM"]]) L.texte(g, x + dx, y + 192, t, { "font-size": 7.5, "font-weight": 700, fill: "#e8e8e2" });
    L.texte(g, x + 64, y + 152, "A ⎓", { "font-size": 8, fill: "#e8e8e2", "font-weight": 700 });
  }

  function commutateur(g, x, y, comp, choisir) {
    // Bouton rotatif et ses repères ; chaque repère est une zone touchable.
    const c = { x: x + 64, y: y + 124 }, aiguille = L.svg("g", {}, g);
    L.svg("circle", { cx: c.x, cy: c.y, r: 24, fill: "url(#acier)", stroke: "#111" }, g);
    for (const m of MODES) {
      const a = (m.angle * Math.PI) / 180, p = { x: c.x + 42 * Math.sin(a), y: c.y - 40 * Math.cos(a) };
      L.texte(g, p.x, p.y, ETIQUETTES[m.nom], { "font-size": 8, "font-weight": 700, fill: m.nom === "OFF" ? "#cfd2cf" : "#ffd54f" });
      const zone = L.svg("circle", { cx: p.x, cy: p.y, r: 13, fill: "#000", opacity: 0.001, class: `repere repere-${m.nom}`, role: "button", "aria-label": `Calibre ${ETIQUETTES[m.nom]}` }, g);
      L.glissable(zone, { soulever: false, debut: () => p, toucher: () => choisir(m.nom) });
    }
    g.append(aiguille);
    return () => {
      // Tourne le bouton vers le mode choisi.
      const a = MODES.find((m) => m.nom === comp.mode).angle;
      aiguille.replaceChildren();
      L.svg("rect", { x: c.x - 4, y: c.y - 22, width: 8, height: 44, rx: 3, fill: "#1a1c1e", transform: `rotate(${a} ${c.x} ${c.y})` }, aiguille);
      L.svg("path", { d: `M${c.x} ${c.y - 22} l-3 7 h6 Z`, fill: "#fff", transform: `rotate(${a} ${c.x} ${c.y})` }, aiguille);
    };
  }

  function afficher(comp, ecran, unite) {
    // Écrit la mesure (point décimal, comme sur l'appareil) ; « 1 » à gauche si le calibre est dépassé.
    const m = MODES.find((k) => k.nom === comp.mode);
    if (!m.calibre) { comp.lecture = ""; ecran.textContent = ""; unite.textContent = ""; return; }
    const v = comp.courants[m.borne];
    comp.valeur = v;
    comp.depasse = Math.abs(v) > m.calibre;
    comp.lecture = comp.depasse ? "1" : (v * m.facteur).toFixed(m.decimales);
    ecran.setAttribute("x", comp.depasse ? comp.x + 22 : comp.x + 106);
    ecran.setAttribute("text-anchor", comp.depasse ? "start" : "end");
    ecran.textContent = comp.lecture;
    unite.textContent = m.unite;
  }

  L.multimetre = function (c, { id = "multimetre", x, y, mode = "OFF", etiquette = "" }) {
    // Construit l'appareil, ses bornes (shunts : 0,01 Ω sur 10A, 1 Ω sur mA) et son commutateur.
    const comp = { id, x, mode, valeur: 0, lecture: "", depasse: false, courants: { "10A": 0, mA: 0 }, g: L.svg("g", { class: `multimetre multimetre-${id}` }, c.calque_composants) };
    corps(comp.g, x, y);
    if (etiquette) L.texte(comp.g, x + 64, y + 68, etiquette, { "font-size": 11, "font-weight": 700, fill: "#ffd54f" });
    const ecran = L.texte(comp.g, x + 102, y + 34, "", { "text-anchor": "end", "font-size": 24, "font-family": "monospace", "font-weight": 700, fill: "#1b1f17" });
    const unite = L.texte(comp.g, x + 108, y + 51, "", { "text-anchor": "end", "font-size": 7.5, "font-weight": 700, fill: "#1b1f17" });
    const tourner = commutateur(comp.g, x, y, comp, (nom) => {
      comp.mode = nom;
      tourner();
      L.missions.noter("calibre", { [id]: nom });
      c.calculer();
    });
    tourner();
    c.borne(comp, "10A", x + 22, y + 172, L.ROUGE_BORNE);
    c.borne(comp, "mA", x + 64, y + 172, L.ROUGE_BORNE);
    c.borne(comp, "COM", x + 106, y + 172, L.NOIR_BORNE);
    comp.dipoles = () => [{ a: "10A", b: "COM", g: 100, j: 0 }, { a: "mA", b: "COM", g: 1, j: 0 }];
    comp.mettre_a_jour = ({ i }) => { comp.courants = { "10A": i[0], mA: i[1] }; afficher(comp, ecran, unite); };
    return c.ajouter(comp);
  };
})(window.Labo);
