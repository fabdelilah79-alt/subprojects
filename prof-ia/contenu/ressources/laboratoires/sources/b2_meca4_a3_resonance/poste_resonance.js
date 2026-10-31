/*
Rôle : paillasse « résonance mécanique » : le résonateur est le mobile (200 g) du banc à coussin d'air, entre deux ressorts
       de 10 N/m (f0 = 1,59 Hz) ; l'excitateur est un moteur à excentrique (a = 1,5 cm) qui déplace l'extrémité du ressort de
       droite, à la fréquence f réglée sur son alimentation (0,5 à 3,0 Hz, pas de 0,1 Hz). Témoins d'amplitude sur une règle,
       palette et aimant de freinage, chronomètre à main. Frottements du montage : h = 0,15 kg/s.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_resonance(g) -> { pense_bete } ; faits « excitateur » = { f, marche }, « lachers_resonance » (lâchers moteur
          arrêté), « amplitudes » = [{ f, marche, amortisseur, X (m) }] (témoins remis par l'élève en régime établi, 8 s après le réglage),
          « montage », « chronometre ».
Utilisé par : simulation.js.
*/
(function (L) {
  const fr = (v, n) => v.toFixed(n).replace(".", ",");

  function fiche(g) {
    // Fiche des données collée au mur.
    L.svg("rect", { x: 560, y: 44, width: 420, height: 64, rx: 3, fill: "#fdfdf8", stroke: "#c9c4b0", filter: "url(#ombre)" }, g);
    L.texte(g, 770, 60, "Excitateur et résonateur", { "font-size": 9.5, "font-weight": 700, fill: "#23315a" });
    ["Résonateur : mobile de 200 g entre deux ressorts de 10 N/m", "Excitateur : moteur à excentrique (1,5 cm), fréquence f réglable de 0,5 à 3,0 Hz"].forEach((t, i) => L.texte(g, 770, 77 + i * 15, t, { "font-size": 8.5, fill: "#222" }));
  }

  function alimentation(g, banc, changer) {
    // Alimentation du moteur : cordon secteur, câble vers le moteur, afficheur de f, touches − et +, marche/arrêt.
    L.svg("path", { d: "M700 470 C676 470 660 500 646 480", fill: "none", stroke: "#222", "stroke-width": 2 }, g);
    L.cordon_secteur(g, { x: 880, y: 440 }, { x: 962, y: 322 });
    L.svg("rect", { x: 700, y: 430, width: 180, height: 80, rx: 4, fill: "url(#facade)", stroke: "#4a5254", filter: "url(#ombre)" }, g);
    L.texte(g, 790, 443, "ALIMENTATION DU MOTEUR", { "font-size": 7, "font-weight": 700, fill: "#23315a" });
    L.svg("rect", { x: 712, y: 450, width: 92, height: 22, rx: 3, fill: "#1d2a22" }, g);
    const ecran = L.texte(g, 758, 465, "", { "font-size": 12, "font-weight": 700, fill: "#7dff9a", "font-family": "monospace" });
    const afficher = () => { ecran.textContent = `f = ${fr(banc.e.f, 1)} Hz`; };
    L.bouton_rond(g, 826, 461, "−", () => { banc.e.f = Math.max(0.5, Math.round(banc.e.f * 10 - 1) / 10); afficher(); changer(); }, 10);
    L.bouton_rond(g, 856, 461, "+", () => { banc.e.f = Math.min(3, Math.round(banc.e.f * 10 + 1) / 10); afficher(); changer(); }, 10);
    L.bouton_poussoir(g, 772, 492, { textes: ["Marche", "Arrêt"], sur_changement: (oui) => { banc.e.marche = oui; changer(); } });
    afficher();
  }

  L.poste_resonance = function (g) {
    // Banc avec excitateur, témoins, alimentation, accessoires, chronomètre ; mesure des amplitudes établies.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230), lachers = [], amplitudes = [];
    fiche(g);
    let depuis = 0, remis = -1, t_banc = 0, temoins = null;
    const changer = () => { depuis = t_banc; remis = -1; temoins && temoins.remettre(banc.e.x); L.missions.noter("excitateur", { f: banc.e.f, marche: banc.e.marche }); };
    const banc = L.banc_ressort(g, { k: 10, k2: 10, h_base: 0.15, a_exc: 0.015, capteur: false,
      sur_lacher: (x0) => { lachers.push({ x0: Math.round(x0 * 1000) / 1000, marche: banc.e.marche, T0: Math.round(banc.T0() * 10000) / 10000 }); L.missions.noter("lachers_resonance", lachers.slice()); changer(); },
      sur_pas: (t, x) => { t_banc = t; temoins.suivre(x); } });
    temoins = L.temoins(L.svg("g", {}, g));
    temoins.sur_main = () => { remis = t_banc; };
    alimentation(g, banc, changer);
    const accessoires = L.accessoires_ressort(g, banc, { surcharges: 0 });
    L.chronometre_manuel(g, { x: 720, y: 518, fait: "chronometre" });
    let vu = null;
    const image = () => { temoins.dessiner(banc.e.x); requestAnimationFrame(image); };
    requestAnimationFrame(image);
    setInterval(() => {
      // Amplitude établie : témoins remis par l'élève 8 s au moins après le réglage, lus 3 s plus tard (une fois par remise).
      const cle = `${banc.e.f}|${banc.e.marche}|${banc.e.amortisseur}|${remis}`;
      if (remis - depuis >= 8 && t_banc - remis >= 3 && cle !== vu) { vu = cle; amplitudes.push({ f: banc.e.f, marche: banc.e.marche, amortisseur: banc.e.amortisseur, X: Math.round(((temoins.xmax - temoins.xmin) / 2) * 1000) / 1000 }); L.missions.noter("amplitudes", amplitudes.slice()); }
    }, 50);
    const regler = banc.regler; banc.regler = (c) => { regler(c); changer(); };
    accessoires.noter(); changer(); L.missions.noter("lachers_resonance", []); L.missions.noter("amplitudes", []);
    return { pense_bete };
  };
})(window.Labo);
