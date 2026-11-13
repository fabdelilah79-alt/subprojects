/*
Rôle : oscilloscope à une ou deux voies : écran 10 × 8 divisions, sensibilités verticales Sv (V/div) et balayage b (ms/div)
       réglés par des touches −/+, entrées par un adaptateur BNC-bananes (Y1 rouge, Y2 jaune, masse noire commune aux deux
       voies). Résistance d'entrée 1 MΩ. On lit U = Sv·y (y en divisions verticales) et t = b·x (x en divisions horizontales).
Reçoit : le circuit (circuit.js) et le réglage { id, x, y, Sv, Sv2, b, voies (1 ou 2), balayages [ms/div], lire (facultatif :
         { onde(nom de la voie) -> tensions sur une période ou null, f() -> fréquence de cette période }, pour des tensions
         calculées par le poste, comme en modulation d'amplitude) }.
Produit : Labo.oscilloscope(c, reglage) -> composant { Sv, Sv2, b, u_dc, onde } ; fait noté « <id> » (« oscillo » par défaut)
          = { Sv, b, u_dc (moyenne), u_max, u_min, gbf, ch2 : { Sv, u_dc, u_max, u_min } ou null }.
Utilisé par : les postes des simulations de tensions variables.
*/
(function (L) {
  const SV = [0.1, 0.2, 0.5, 1, 2, 5, 10], B = [0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10];
  const ecrire = (v, unite) => (unite === "ms" && v < 0.1 ? `${String(Math.round(v * 1e4) / 10).replace(".", ",")} µs/div` : `${String(v).replace(".", ",")} ${unite}/div`);

  function corps(g, x, y, cadres) {
    // Boîtier gris clair, nom de l'appareil, cadres des réglages.
    L.boitier(g, x, y, 350, 236, 34, { dessus: "#dfe3e6", face: "#8d979e" });
    L.texte(g, x + 18, y + 14, "OSCILLOSCOPE", { "text-anchor": "start", "font-size": 9, "font-weight": 700, fill: "#37474f", "letter-spacing": 1.2 });
    for (const [dy, t] of cadres) {
      L.svg("rect", { x: x + 238, y: y + dy, width: 102, height: 48, rx: 4, fill: "none", stroke: "#9aa5ad" }, g);
      L.texte(g, x + 289, y + dy + 8, t, { "font-size": 6.5, "font-weight": 700, fill: "#37474f" });
    }
  }

  function reglage(g, x, y, liste, valeur, unite, changer) {
    // Afficheur d'un réglage (cadre commençant en y) et ses deux touches.
    L.svg("rect", { x: x + 246, y: y + 13, width: 86, height: 14, rx: 2, fill: "#0b1f17" }, g);
    const t = L.texte(g, x + 289, y + 20.5, ecrire(valeur(), unite), { "font-size": 8.5, "font-family": "monospace", "font-weight": 700, fill: "#7cff9a" });
    const pas = (s) => { const v = liste[Math.max(0, Math.min(liste.length - 1, liste.indexOf(valeur()) + s))]; changer(v); t.textContent = ecrire(v, unite); };
    L.bouton_rond(g, x + 268, y + 37, "−", () => pas(-1));
    L.bouton_rond(g, x + 310, y + 37, "+", () => pas(1));
  }

  function entree(c, comp, x, y, voies) {
    // Prises BNC (CH1, et CH2 s'il y a deux voies) et adaptateur à bornes de 4 mm ; la masse est commune aux deux voies.
    const prises = voies === 1 ? [["CH1", 289]] : [["CH1", 266], ["CH2", 312]];
    for (const [t, dx] of prises) {
      L.svg("circle", { cx: x + dx, cy: y + 168, r: 8, fill: "url(#metal)", stroke: "#444" }, comp.g);
      // Une voie : nom au-dessus de la prise ; deux voies : à sa gauche (les trois cadres de réglage occupent le dessus).
      if (voies === 1) L.texte(comp.g, x + dx, y + 156, t, { "font-size": 7, "font-weight": 700, fill: "#37474f" });
      else L.texte(comp.g, x + dx - 17, y + 169, t, { "font-size": 6.5, "font-weight": 700, fill: "#37474f" });
    }
    const bornes = voies === 1 ? [["Y1", 270, L.ROUGE_BORNE], ["masse", 308, L.NOIR_BORNE]] : [["Y1", 258, L.ROUGE_BORNE], ["Y2", 290, "#e0a800"], ["masse", 322, L.NOIR_BORNE]];
    L.svg("rect", { x: x + 244, y: y + 180, width: 96, height: 42, rx: 4, fill: "#2b2f33" }, comp.g);
    for (const [nom, dx, couleur] of bornes) {
      L.texte(comp.g, x + dx, y + 215, nom === "masse" ? "⏚" : nom, { "font-size": nom === "masse" ? 9 : 7, "font-weight": 700, fill: "#e8e8e2" });
      c.borne(comp, nom, x + dx, y + 198, couleur);
    }
  }

  function voie(comp, onde, u, nom) {
    // Tension d'une voie : onde (s'il y a un GBF, ou donnée par lire), et valeur moyenne.
    const o = comp.lire ? comp.lire.onde(nom) : onde(nom, "masse");
    return { onde: o, u_dc: o ? o.reduce((s, v) => s + v, 0) / o.length : u(nom, "masse") };
  }

  function resume(v, Sv) {
    // Ce que l'élève peut lire sur une voie : moyenne, maximum, minimum (arrondis au mV) et sensibilité.
    const a = (x) => Math.round(x * 1000) / 1000, o = v.onde || [v.u_dc];
    return { Sv, u_dc: a(v.u_dc), u_max: a(Math.max(...o)), u_min: a(Math.min(...o)) };
  }

  L.oscilloscope = function (c, { id = "oscillo", x, y, Sv = 1, Sv2 = 1, b = 0.5, voies = 1, lire = null, balayages = B }) {
    // Construit l'oscilloscope ; à chaque calcul du circuit, il retrace les tensions entre Y1 (et Y2) et la masse.
    const comp = { id, Sv, Sv2, b, voies, lire, v1: { onde: null, u_dc: 0 }, v2: { onde: null, u_dc: 0 }, g: L.svg("g", { class: "oscilloscope" }, c.calque_composants) };
    L.cordon_secteur(comp.g, { x: x + 330, y: y + 24 }, c.prise());
    const deux = voies === 2, rangs = deux ? [12, 58, 104] : [24, 86];
    corps(comp.g, x, y, deux ? [[12, "VOLTS/DIV  CH1"], [58, "VOLTS/DIV  CH2"], [104, "TIME/DIV"]] : [[24, "VOLTS/DIV  CH1"], [86, "TIME/DIV"]]);
    const tracer = L.ecran_oscillo(comp.g, x + 18, y + 34, deux);
    const retracer = () => {
      const traces = [{ ...comp.v1, Sv: comp.Sv, couleur: "#b8ffc8" }, ...(deux ? [{ ...comp.v2, Sv: comp.Sv2, couleur: "#ffe27a" }] : [])];
      tracer({ traces, f: lire ? lire.f() : c.alternatif ? c.alternatif.f : 0, b: comp.b });
      L.missions.noter(id, { ...resume(comp.v1, comp.Sv), b: comp.b, gbf: c.alternatif && !lire ? { ...c.alternatif } : null, ch2: deux ? resume(comp.v2, comp.Sv2) : null });
    };
    reglage(comp.g, x, y + rangs[0], SV, () => comp.Sv, "V", (v) => { comp.Sv = v; retracer(); });
    if (deux) reglage(comp.g, x, y + rangs[1], SV, () => comp.Sv2, "V", (v) => { comp.Sv2 = v; retracer(); });
    reglage(comp.g, x, y + rangs[rangs.length - 1], balayages, () => comp.b, "ms", (v) => { comp.b = v; retracer(); });
    entree(c, comp, x, y, voies);
    comp.dipoles = () => [{ a: "Y1", b: "masse", g: 1e-6, j: 0 }, ...(deux ? [{ a: "Y2", b: "masse", g: 1e-6, j: 0 }] : [])];
    comp.mettre_a_jour = ({ u, onde }) => {
      comp.v1 = voie(comp, onde, u, "Y1");
      if (deux) comp.v2 = voie(comp, onde, u, "Y2");
      Object.assign(comp, { u_dc: comp.v1.u_dc, onde: comp.v1.onde });
      retracer();
    };
    return c.ajouter(comp);
  };
})(window.Labo);
