/*
Rôle : paillasse « raie du sodium » : lanterne (lumière blanche) sur son support élévateur, bec Bunsen sur l'axe du faisceau,
       anse en nichrome trempée dans l'eau salée (on la fixe dans la pince : sa boucle entre dans la flamme, qui devient jaune),
       spectroscope pointé vers la lanterne à travers la flamme. Flamme salée seule : raie jaune d'émission (589 nm) ; lampe
       seule : spectre continu ; lampe et flamme salée : spectre continu barré d'une raie noire à 589 nm (absorption).
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_sodium(g) -> { pense_bete } ; faits « sodium » = { flamme, anse, sel, lampe }, « vus_sodium » [« emission »,
          « continu », « absorption »].
Utilisé par : simulation.js (paillasse 3).
*/
(function (L) {
  const D = L.sodium_dessin, XB = D.XB;

  function interrupteur(g, e, maj) {
    // Interrupteur et voyant de l'alimentation 12 V de la lanterne.
    const y = D.SOL - 36, b = L.svg("g", { class: "lampe-marche", role: "switch", "aria-label": "Lampe" }, g);
    L.svg("rect", { x: 52, y, width: 16, height: 20, rx: 3, fill: "#111" }, b);
    const bascule = L.svg("rect", { x: 55, y: y + 3, width: 10, height: 7, rx: 2, fill: "#c62828" }, b);
    const voyant = L.svg("circle", { cx: 82, cy: y + 6, r: 2.6, fill: "#1b3d22", stroke: "#111" }, g);
    L.glissable(b, { soulever: false, debut: () => ({ x: 0, y: 0 }), toucher: () => { e.lampe = !e.lampe; bascule.setAttribute("y", e.lampe ? y + 10 : y + 3); voyant.setAttribute("fill", e.lampe ? "#7dff9a" : "#1b3d22"); maj(); } });
  }

  function lumiere(e, bec) {
    // Ce qui entre par la fente du spectroscope.
    const sel = e.anse === "flamme" && bec.allume;
    if (e.lampe) return { continu: true, absorption: sel ? [589.3] : [] };
    return sel ? { raies: L.SPECTRES.sodium.raies } : {};
  }

  L.poste_sodium = function (g) {
    // Matériel fixe, bec Bunsen, lanterne, anse ; flamme du sodium redessinée 10 fois par seconde.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230), e = { lampe: false, anse: "becher" }, vus = new Set();
    D.fixe(g);
    const g_lant = L.svg("g", {}, g), g_fais = L.svg("g", { "pointer-events": "none" }, g), message = L.texte(g, 520, 176, "", { "font-size": 8, "font-weight": 700, fill: "#c62828" });
    const fond = L.svg("g", {}, g), objets = L.svg("g", {}, g), g_na = L.svg("g", { "pointer-events": "none" }, g);
    const bec = L.bec_bunsen({ fond, objets }, { x: XB, sol: D.SOL, e: 1.6, dire: (t) => { message.textContent = t; } });
    const g_anse = L.svg("g", { class: "anse", role: "button", "aria-label": "Anse en nichrome" }, g);
    const noter = () => L.missions.noter("sodium", { flamme: bec.allume, anse: e.anse, sel: e.anse === "flamme" && bec.allume, lampe: e.lampe });
    const maj = () => { D.lanterne(g_lant, e.lampe); D.faisceau(g_fais, e.lampe); D.anse(g_anse, e.anse); noter(); };
    L.glissable(g_anse, { soulever: false, debut: () => ({ x: 0, y: 0 }), toucher: () => { e.anse = e.anse === "flamme" ? "becher" : "flamme"; maj(); } });
    interrupteur(g, e, maj);
    let avant = null;
    setInterval(() => {
      const sel = e.anse === "flamme" && bec.allume;
      if (sel) D.flamme_sodium(g_na, XB, D.SOL - 208, bec.air); else g_na.replaceChildren();
      if (sel !== avant) { avant = sel; noter(); }
    }, 100);
    const sp = L.spectroscope(g, { x: 790, y: D.AXE.y, sol: D.SOL, sens: -1, lumiere: () => lumiere(e, bec),
      vu: (l) => { const k = l.continu ? (l.absorption.length ? "absorption" : "continu") : l.raies ? "emission" : null; if (k) { vus.add(k); L.missions.noter("vus_sodium", [...vus]); } } });
    maj(); L.missions.noter("vus_sodium", []);
    sp.devant();
    return { pense_bete };
  };
})(window.Labo);
