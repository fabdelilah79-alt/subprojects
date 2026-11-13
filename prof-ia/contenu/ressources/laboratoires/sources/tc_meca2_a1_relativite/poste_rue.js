/*
Rôle : scène de la rue : un cycliste passe à vitesse constante (3 m/s). Deux caméras filment avec un stroboscope :
       la caméra fixe sur trépied (référentiel terrestre) et la caméra embarquée sur le porte-bagages (référentiel
       du vélo). Toucher une caméra fait regarder par elle ; les positions successives de la valve (jaune) et du casque
       (bleu) s'impriment toutes les 0,05 s dans la vue choisie. Un muret au premier plan porte le matériel.
Reçoit : le groupe SVG de la scène.
Produit : Labo.poste_rue(groupe) -> {} ; fait noté : passages = { fixe, embarquee } (passages complets observés).
Utilisé par : simulation.js.
*/
(function (L) {
  const V_MS = 3, DEBUT = -1.6, FIN = 11, PAS_S = 0.05, X_ECRAN = 4.2, MURET = 548;
  const NOMS = { fixe: "la caméra fixe (référentiel terrestre)", embarquee: "la caméra embarquée sur le vélo (référentiel du vélo)" };

  function ciel(g) {
    // Ciel du matin.
    const d = L.svg("linearGradient", { id: "ciel", x1: 0, y1: 0, x2: 0, y2: 1 }, g.ownerSVGElement.querySelector("defs"));
    L.svg("stop", { offset: 0, "stop-color": "#8fc1e8" }, d);
    L.svg("stop", { offset: 1, "stop-color": "#d9ecf7" }, d);
    L.svg("rect", { width: L.LARGEUR, height: L.HAUTEUR, fill: "url(#ciel)" }, g);
  }

  function muret(g) {
    // Muret en pierre où sont posés la tablette, le carnet et le bouton « Pause ».
    L.svg("rect", { x: 0, y: MURET, width: L.LARGEUR, height: L.HAUTEUR - MURET, fill: "#b8ad98" }, g);
    L.svg("rect", { x: 0, y: MURET, width: L.LARGEUR, height: 7, fill: "#d3c9b5" }, g);
    for (let y = MURET + 7; y < L.HAUTEUR; y += 30) L.svg("line", { x1: 0, y1: y, x2: L.LARGEUR, y2: y, stroke: "#9d927d", "stroke-width": 1 }, g);
    for (let y = MURET + 7, k = 0; y < L.HAUTEUR; y += 30, k++) {
      for (let x = (k % 2) * 40; x < L.LARGEUR; x += 80) L.svg("line", { x1: x, y1: y, x2: x, y2: y + 30, stroke: "#9d927d", "stroke-width": 1 }, g);
    }
  }

  function dessiner(s) {
    // Place le monde, le vélo et les traces selon la caméra choisie (la caméra embarquée garde le vélo en X_ECRAN).
    const e = s.etat, cam = e.vue === "fixe" ? 0 : e.xb - X_ECRAN, PX = L.RUE.PX, sol = L.RUE.SOL + 30;
    s.monde.setAttribute("transform", `translate(${-cam * PX} 0)`);
    s.velo.dessiner((e.xb - cam) * PX, sol - L.Velo.R * PX, e.xb / L.Velo.R);
    s.traces.replaceChildren();
    for (const p of e.points) {
      const o = e.vue === "fixe" ? 0 : p.xb - X_ECRAN;
      L.svg("circle", { cx: (p.vx - o) * PX, cy: sol - p.vy * PX, r: 3.2, fill: "#ffd60a", stroke: "#7a5b00", "stroke-width": 0.8 }, s.traces);
      L.svg("circle", { cx: (p.tx - o) * PX, cy: sol - p.ty * PX, r: 3.2, fill: "#2f80ed", stroke: "#123", "stroke-width": 0.8 }, s.traces);
    }
    s.legende.textContent = `Vous regardez avec ${NOMS[e.vue]}`;
  }

  function avancer(s, dt) {
    // Le vélo roule ; à chaque éclair (toutes les 0,05 s), on garde la valve et le casque (référentiel terrestre).
    const e = s.etat;
    e.xb += V_MS * dt;
    e.prochain -= dt;
    while (e.prochain <= 0) {
      // Position exacte à l'instant de l'éclair (entre deux images) : des points régulièrement espacés.
      const xb = e.xb + V_MS * e.prochain, v = s.velo.valve(xb / L.Velo.R), t = s.velo.tete();
      e.points.push({ xb, vx: xb + v.x, vy: L.Velo.R + v.y, tx: xb + t.x, ty: L.Velo.R + t.y });
      e.prochain += PAS_S;
    }
    if (e.xb > FIN) {
      if (e.vue_constante) { e.passages[e.vue]++; L.missions.noter("passages", { ...e.passages }); }
      Object.assign(e, { xb: DEBUT, points: [], vue_constante: true });
    }
  }

  function tourner(s) {
    // Boucle d'animation ; le bouton « Pause » fige l'image.
    let avant = null;
    const image = (instant) => {
      const dt = avant === null ? 0 : Math.min(0.05, (instant - avant) / 1000);
      avant = instant;
      if (!s.etat.pause) avancer(s, dt);
      dessiner(s);
      requestAnimationFrame(image);
    };
    requestAnimationFrame(image);
  }

  function changer(etat, vue) {
    // Regarder par une autre caméra : la trace repart de zéro, ce passage ne compte pas.
    if (etat.vue !== vue) Object.assign(etat, { vue, points: [], vue_constante: false });
  }

  L.poste_rue = function (g) {
    // Construit la scène, branche les deux caméras et fait rouler le vélo.
    ciel(g);
    const monde = L.svg("g", {}, g);
    const { camera_fixe } = L.decor_rue(monde);
    const velo = new L.Velo(g), traces = L.svg("g", { "pointer-events": "none" }, g);
    muret(g);
    const legende = L.texte(g, 512, 22, "", { "font-size": 15, "font-weight": 700, fill: "#14324f" });
    const etat = { xb: DEBUT, vue: "fixe", pause: false, points: [], prochain: 0, passages: { fixe: 0, embarquee: 0 }, vue_constante: true };
    tourner({ etat, monde, velo, traces, legende });
    camera_fixe.addEventListener("pointerdown", (e) => { e.labo_pris = true; changer(etat, "fixe"); });
    velo.g.addEventListener("pointerdown", (e) => { e.labo_pris = true; if (e.target.closest(".camera-embarquee")) changer(etat, "embarquee"); });
    L.bouton_poussoir(g, 512, 612, { textes: ["Pause", "Lecture"], sur_changement: (arret) => { etat.pause = arret; } });
    return {};
  };
})(window.Labo);
