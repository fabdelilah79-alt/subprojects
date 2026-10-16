/*
Rôle : multimètre numérique : commutateur rotatif (OFF ; V⎓ 2 à 200 V ; V~ 20 V ; A⎓ 20 mA, 200 mA, 10 A ; Ω 200 Ω à
       200 kΩ), quatre bornes (10A, mA, COM, VΩ). En voltmètre, il mesure U = V(VΩ) − V(COM) (résistance d'entrée 10 MΩ) ;
       en ohmmètre, il envoie un courant de test par VΩ (le dipôle mesuré doit être isolé du circuit) ;
       en ampèremètre, le courant qui entre par 10A ou mA et sort par COM. La borne mA est protégée par un fusible
       (0,25 A) : branché en dérivation sur un générateur, il grille ; un toucher sur l'étiquette le remplace.
Reçoit : le circuit (circuit.js) et le réglage { id, x, y, mode (nom d'un mode de multimetre_mesure.js), etiquette }.
Produit : Labo.multimetre(c, reglage) -> composant { mode, valeur (V ou A, signée), lecture (texte affiché), depasse, fusible } ;
          faits notés « calibre » = { <id> : mode }, « fusible_grille » = id.
Utilisé par : les postes des simulations d'électricité.
*/
(function (L) {
  const LARGEUR = 150, PROFONDEUR = 232, FUSIBLE_A = 0.25, BORNES = [["10A", 22, L.ROUGE_BORNE], ["mA", 57, L.ROUGE_BORNE], ["COM", 93, L.NOIR_BORNE], ["VΩ", 128, L.ROUGE_BORNE]];
  const groupe = (type) => L.MULTIMETRE_GROUPES.find((k) => k.type === type);

  function corps(g, x, y) {
    // Gaine jaune, façade sombre, écran à cristaux liquides, légende des bornes.
    L.boitier(g, x, y, LARGEUR, PROFONDEUR, 12, { dessus: "#f0bf2a", face: "#b98d14" });
    L.svg("rect", { x: x + 8, y: y + 8, width: LARGEUR - 16, height: PROFONDEUR - 16, rx: 8, fill: "#2f3337" }, g);
    L.svg("rect", { x: x + 18, y: y + 16, width: LARGEUR - 36, height: 44, rx: 3, fill: "#b7c3a6", stroke: "#1b1e1a" }, g);
    L.texte(g, x + 26, y + 71, "TRUE RMS", { "text-anchor": "start", "font-size": 6.5, "font-weight": 700, fill: "#cfd2cf" });
    for (const [nom, dx] of BORNES) L.texte(g, x + dx, y + 227, nom, { "font-size": 7.5, "font-weight": 700, fill: "#e8e8e2" });
  }

  function commutateur(g, x, y, comp, choisir) {
    // Bouton rotatif, ses repères (touchables) et les symboles des groupes de calibres.
    const c = { x: x + LARGEUR / 2, y: y + 128 }, aiguille = L.svg("g", {}, g);
    const polaire = (a, r) => ({ x: c.x + r * Math.sin((a * Math.PI) / 180), y: c.y - r * Math.cos((a * Math.PI) / 180) });
    L.svg("circle", { cx: c.x, cy: c.y, r: 24, fill: "url(#acier)", stroke: "#111" }, g);
    for (const k of L.MULTIMETRE_GROUPES) { const p = polaire(k.angle, 58); L.texte(g, p.x, p.y, k.texte, { "font-size": 8.5, "font-weight": 700, fill: k.couleur }); }
    for (const m of L.MULTIMETRE_MODES) {
      const p = polaire(m.angle, 42);
      L.texte(g, p.x, p.y, m.texte, { "font-size": 7.5, "font-weight": 700, fill: m.type ? groupe(m.type).couleur : "#cfd2cf" });
      const zone = L.svg("circle", { cx: p.x, cy: p.y, r: 10, fill: "#000", opacity: 0.001, class: `repere repere-${m.nom}`, role: "button", "aria-label": `Calibre ${m.nom}` }, g);
      L.glissable(zone, { soulever: false, debut: () => p, toucher: () => choisir(m.nom) });
    }
    g.append(aiguille);
    return () => {
      // Tourne le bouton vers le mode choisi.
      const a = L.MULTIMETRE_MODES.find((m) => m.nom === comp.mode).angle;
      aiguille.replaceChildren();
      L.svg("rect", { x: c.x - 4, y: c.y - 22, width: 8, height: 44, rx: 3, fill: "#1a1c1e", transform: `rotate(${a} ${c.x} ${c.y})` }, aiguille);
      L.svg("path", { d: `M${c.x} ${c.y - 22} l-3 7 h6 Z`, fill: "#fff", transform: `rotate(${a} ${c.x} ${c.y})` }, aiguille);
    };
  }

  function afficheur(g, x, y) {
    // Chiffres, unité et type de mesure (DC, AC) ; renvoie une fonction qui écrit la mesure.
    const ecran = L.texte(g, x + 126, y + 38, "", { "text-anchor": "end", "font-size": 26, "font-family": "monospace", "font-weight": 700, fill: "#1b1f17" });
    const unite = L.texte(g, x + 128, y + 54, "", { "text-anchor": "end", "font-size": 8, "font-weight": 700, fill: "#1b1f17" });
    const type = L.texte(g, x + 24, y + 54, "", { "text-anchor": "start", "font-size": 7.5, "font-weight": 700, fill: "#1b1f17" });
    return (comp) => {
      const r = L.multimetre_lire(comp), m = L.MULTIMETRE_MODES.find((k) => k.nom === comp.mode);
      Object.assign(comp, { valeur: r.valeur, lecture: r.lecture, depasse: r.depasse });
      ecran.setAttribute("x", r.depasse ? x + 26 : x + 126);
      ecran.setAttribute("text-anchor", r.depasse ? "start" : "end");
      ecran.textContent = r.lecture;
      unite.textContent = r.unite;
      type.textContent = { V: "DC", A: "DC", VAC: "AC" }[m.type] || "";
    };
  }

  function fusible(c, comp, x, y) {
    // Étiquette « fusible grillé » sous l'écran ; un toucher remplace le fusible.
    const g = L.svg("g", { class: "fusible", style: "display:none", role: "button", "aria-label": "Changer le fusible" }, comp.g);
    L.svg("rect", { x: x + 22, y: y + 63, width: 106, height: 14, rx: 2, fill: "#b71c1c" }, g);
    L.texte(g, x + 75, y + 70.5, "fusible mA grillé : toucher", { "font-size": 7, "font-weight": 700, fill: "#fff" });
    L.glissable(g, { soulever: false, debut: () => ({ x, y }), toucher: () => { comp.fusible = true; g.style.display = "none"; c.calculer(); } });
    return () => {
      // Courant trop fort dans la borne mA : le fusible fond, la borne mA ne conduit plus.
      if (!comp.fusible || Math.abs(comp.courants.mA) <= FUSIBLE_A) return;
      comp.fusible = false;
      g.style.display = "";
      L.missions.noter("fusible_grille", comp.id);
      setTimeout(() => c.calculer(), 0);
    };
  }

  L.multimetre = function (c, { id = "multimetre", x, y, mode = "OFF", etiquette = "" }) {
    // Construit l'appareil : bornes (shunts 0,01 Ω sur 10A, 1 Ω sur mA ; 10 MΩ entre VΩ et COM) et commutateur.
    const comp = { id, mode, valeur: 0, lecture: "", depasse: false, fusible: true, courants: { "10A": 0, mA: 0 }, u_continue: 0, onde: null, g: L.svg("g", { class: `multimetre multimetre-${id}` }, c.calque_composants) };
    corps(comp.g, x, y);
    if (etiquette) L.texte(comp.g, x + 118, y + 71, etiquette, { "font-size": 11, "font-weight": 700, fill: "#ffd54f" });
    const ecrire = afficheur(comp.g, x, y);
    const tourner = commutateur(comp.g, x, y, comp, (nom) => { comp.mode = nom; tourner(); L.missions.noter("calibre", { [id]: nom }); c.calculer(); });
    tourner();
    const surveiller = fusible(c, comp, x, y);
    for (const [nom, dx, couleur] of BORNES) c.borne(comp, nom, x + dx, y + 212, couleur);
    const test = () => (L.MULTIMETRE_MODES.find((m) => m.nom === comp.mode).test || 0);
    comp.dipoles = () => [{ a: "10A", b: "COM", g: 100, j: 0 }, { a: "mA", b: "COM", g: comp.fusible ? 1 : 1e-9, j: 0 }, { a: "COM", b: "VΩ", g: 1e-7, j: test() }];
    comp.mettre_a_jour = ({ u, i, onde }) => {
      Object.assign(comp, { courants: { "10A": i[0], mA: i[1] }, u_continue: u("VΩ", "COM"), onde: onde("VΩ", "COM") });
      surveiller();
      ecrire(comp);
    };
    return c.ajouter(comp);
  };
})(window.Labo);
