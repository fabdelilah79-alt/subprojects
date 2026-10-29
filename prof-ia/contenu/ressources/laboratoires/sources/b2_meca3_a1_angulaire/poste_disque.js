/*
Rôle : paillasse « disque en rotation filmé » : un disque d'aluminium (J = 2,0 × 10⁻³ kg·m²) tourne sans frottement autour
       d'un axe horizontal fixe ; un fil enroulé sur son tambour (r = 2 cm) porte une masse de 200 g. Boîtier de commande :
       « Lâcher » (frein desserré : rotation uniformément accélérée, θ̈ = m·g·r / (J + m·r²) ≈ 18,9 rad/s²), puis la masse se
       pose sur la mousse après 40 cm et le fil se décroche (rotation uniforme) ; « Freiner » (patin : couple constant,
       θ̈ = −10 rad/s²) ; « Remonter » (on réenroule le fil). Le boîtier déclenche la caméra (25 images/s) au lâcher et au
       freinage ; la touche REC de la caméra filme le mouvement en cours. Les vidéos vont au portable (pointage en mode polaire).
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_disque(g) -> { pense_bete } ; faits « films » = [{ id, type (lacher, libre, frein, repos), alpha (rad/s²),
          omega0 (rad/s) }], « disque » = { etat }, « pointage ».
Utilisé par : simulation.js.
*/
(function (L) {
  const G = 9.81, J = 0.002, RT = 0.02, M = 0.2, CHUTE = 0.4, TH0 = 0.5, FREIN = -10, FPS = 25;
  const ALPHA = (M * G * RT) / (J + M * RT * RT), T_POSE = Math.sqrt((2 * CHUTE) / RT / ALPHA), W_POSE = ALPHA * T_POSE;

  function etat_a(seg, dt) {
    // État du disque dt secondes après le début du segment (chute puis rotation libre, freinage puis arrêt).
    if (seg.mode === "chute") return dt < T_POSE ? { mode: "chute", th: seg.th + 0.5 * ALPHA * dt * dt, w: ALPHA * dt } : { mode: "libre", th: seg.th + CHUTE / RT + W_POSE * (dt - T_POSE), w: W_POSE };
    if (seg.mode === "libre") return { mode: "libre", th: seg.th + seg.w * dt, w: seg.w };
    if (seg.mode === "frein") { const t = Math.min(dt, -seg.w / FREIN); return { mode: t < dt ? "arret" : "frein", th: seg.th + seg.w * t + 0.5 * FREIN * t * t, w: seg.w + FREIN * t }; }
    return { mode: seg.mode, th: seg.th, w: 0 };
  }

  function cables(g, x, y) {
    // Câbles du boîtier (derrière le matériel) : vers le frein du palier, et le long du trépied jusqu'à la prise de la caméra.
    const C = L.disque_dessin.C;
    L.svg("path", { d: `M${x + 196} ${y + 20} C${x + 260} ${y - 60} ${C.x - 120} ${C.y - 150} ${C.x - 24} ${C.y - 70}`, fill: "none", stroke: "#222", "stroke-width": 2 }, g);
    L.svg("path", { d: `M${x + 200} ${y + 70} C${x + 250} ${y + 110} 440 566 486 556 C496 540 497 420 498 398`, fill: "none", stroke: "#222", "stroke-width": 2 }, g);
  }

  function boitier(g, x, y) {
    // Boîtier de commande du frein (à piles) et son voyant.
    L.svg("rect", { x, y, width: 200, height: 80, rx: 4, fill: "url(#facade)", stroke: "#4a5254", filter: "url(#ombre)" }, g);
    L.texte(g, x + 100, y + 13, "COMMANDE DU FREIN", { "font-size": 7, "font-weight": 700, fill: "#23315a" });
    L.texte(g, x + 100, y + 76, "à piles · déclenche la caméra", { "font-size": 5.5, fill: "#23315a" });
    return L.svg("circle", { cx: x + 188, cy: y + 11, r: 3.5, fill: "#5a1d1d" }, g);
  }

  function camera(g) {
    // Caméra sur trépied tournée vers le disque, touche REC, câble USB jusqu'au portable.
    L.ombre_sol(g, 492, 548, 36, 6, 0.35);
    for (const dx of [-22, 0, 22]) L.tige(g, `M492 400 L${492 + dx} 544`, 3);
    L.svg("rect", { x: 472, y: 370, width: 40, height: 28, rx: 4, fill: "#24282c", stroke: "#000" }, g);
    L.svg("rect", { x: 494, y: 396, width: 8, height: 5, rx: 1, fill: "#555c63" }, g);
    L.svg("circle", { cx: 472, cy: 384, r: 9, fill: "#111", stroke: "#666" }, g);
    L.svg("path", { d: "M512 386 C530 386 528 455 548 470", fill: "none", stroke: "#222", "stroke-width": 2.5 }, g);
    return L.svg("circle", { cx: 506, cy: 375, r: 2.5, fill: "#5a1d1d" }, g);
  }

  function touches(g, { lacher, remonter, freiner, filmer }) {
    // Touches du boîtier (« Lâcher/Remonter », « Freiner ») et touche REC posée sur la caméra.
    L.bouton_poussoir(g, 95, 466, { textes: ["Lâcher", "Remonter"], sur_changement: (oui) => (oui ? lacher() : remonter()) });
    L.bouton_rond(g, 192, 466, "Freiner", freiner, 17);
    const rec = L.svg("g", { class: "camera-rec", role: "button", "aria-label": "REC" }, g);
    L.svg("rect", { x: 474, y: 356, width: 36, height: 13, rx: 3, fill: "#24282c", stroke: "#000" }, rec);
    L.svg("circle", { cx: 482, cy: 362.5, r: 3.5, fill: "#d32f2f" }, rec);
    L.texte(rec, 496, 365, "REC", { "font-size": 6.5, "font-weight": 700, fill: "#eef" });
    L.glissable(rec, { soulever: false, debut: () => ({ x: 0, y: 0 }), toucher: filmer });
  }

  function fiche(g) {
    // Fiche des données collée au mur.
    L.svg("rect", { x: 600, y: 44, width: 330, height: 62, rx: 3, fill: "#fdfdf8", stroke: "#c9c4b0", filter: "url(#ombre)" }, g);
    L.texte(g, 765, 60, "Disque en rotation autour d'un axe fixe", { "font-size": 9.5, "font-weight": 700, fill: "#23315a" });
    L.texte(g, 765, 76, "Repère M à OM = 8,0 cm de l'axe ; tambour r = 2,0 cm", { "font-size": 8.5, fill: "#222" });
    L.texte(g, 765, 92, "Masse : 200 g ; chute de 40 cm, puis le fil se décroche", { "font-size": 8.5, fill: "#222" });
  }

  L.poste_disque = function (g) {
    // Matériel, mouvement image par image, commandes ; chaque film part au logiciel de pointage.
    const D = L.disque_dessin, pense_bete = L.decor.pense_bete(g, 24, 52, 230);
    fiche(g); cables(g, 30, 418); D.fond(g);
    const voyant_frein = boitier(g, 30, 418), voyant = camera(g), logiciel = L.pointage_video(g, { nom: "pointage", x: 540, y: 180, polaire: true });
    const gm = L.svg("g", {}, g), gd = L.svg("g", {}, g), films = [];
    let seg = { mode: "tenu", th: TH0, w: 0, t0: 0 }, n = 0;
    const maintenant = () => performance.now() / 1000, actuel = () => etat_a(seg, maintenant() - seg.t0);
    const noter = (e) => L.missions.noter("disque", { etat: e.mode });
    const filmer = (duree) => {
      // Film du mouvement à partir de maintenant (le segment en cours, avec ses changements) ; il part au portable à la fin.
      const s = { ...seg }, debut = maintenant() - seg.t0, e = etat_a(s, debut), nb = Math.round(duree * FPS) + 1;
      const type = { chute: "lacher", libre: "libre", frein: "frein" }[e.mode] || "repos", id = `${type}${++n}`;
      films.push({ id, type, alpha: { chute: ALPHA, frein: FREIN }[e.mode] || 0, omega0: Math.round(e.w * 1000) / 1000 }); L.missions.noter("films", films.slice());
      voyant.setAttribute("fill", "#ff3b30"); setTimeout(() => { voyant.setAttribute("fill", "#5a1d1d"); logiciel.charger(D.video(id, (k) => etat_a(s, debut + k / FPS).th, nb, TH0)); }, duree * 1000);
    };
    const changer = (mode) => { const e = actuel(); seg = { mode, th: mode === "tenu" ? TH0 : e.th, w: mode === "tenu" ? 0 : e.w, t0: maintenant() }; voyant_frein.setAttribute("fill", mode === "tenu" || mode === "frein" ? "#ff3b30" : "#5a1d1d"); noter(seg); };
    touches(g, { lacher: () => { changer("chute"); filmer(1.6); }, remonter: () => changer("tenu"), freiner: () => { if (actuel().mode === "libre") { changer("frein"); filmer(1.2); } }, filmer: () => filmer(1.2) });
    const image = () => {
      // Image suivante : passage chute -> libre et frein -> arrêt, disque et masse redessinés.
      const e = actuel();
      if (e.mode !== seg.mode && e.mode !== "chute") { seg = { mode: e.mode, th: e.th, w: e.w, t0: maintenant() }; voyant_frein.setAttribute("fill", "#5a1d1d"); noter(seg); }
      D.disque(gd, e.th); D.masse(gm, RT * (e.th - TH0), seg.mode !== "tenu" && seg.mode !== "chute");
      requestAnimationFrame(image);
    };
    noter(seg); L.missions.noter("films", []); image();
    return { pense_bete };
  };
})(window.Labo);
