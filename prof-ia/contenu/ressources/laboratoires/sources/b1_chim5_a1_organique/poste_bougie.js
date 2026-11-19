/*
Rôle : paillasse « de quoi est faite une espèce organique ? » : bougie allumée (paraffine, espèce organique) sur sa
       soucoupe, bécher de 250 mL sec et froid posé à l'envers, bécher d'eau de chaux. On tient le bécher retourné au-dessus
       de la flamme : de la buée se dépose sur la paroi froide (de l'eau s'est formée : élément hydrogène) et du dioxyde de
       carbone s'accumule ; la flamme faiblit et s'éteint si l'on attend trop (le dioxygène s'épuise). Lâché ailleurs, le
       bécher est remis à l'endroit : on y verse l'eau de chaux, qui se trouble s'il contient du dioxyde de carbone
       (élément carbone). Le gaz carbonique est un peu plus dense que l'air : il reste dans le bécher retourné vivement.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_bougie(g) -> { pense_bete } ; fait « bougie » = { couvert, buee (0 à 1), allumee, o2 (0 à 1), phase
          (« retourne » ou « pose »), co2 (mmol), chaux (mL d'eau de chaux dans le bécher), trouble (part troublée) }.
Utilisé par : simulation.js.
*/
(function (L) {
  const SOL = 576, E = 1.6, BX = 430, HAUT_BOUGIE = SOL - 76 * E, PR = () => L.profil("becher_250");
  L.LIQUIDES.eau_chaux_trouble ??= { nom: "eau de chaux troublée", d: 1.0, rgb: [244, 244, 238], alpha: 0.88, classe: "aqueuse", pH: 12 };
  const GOUTTES = Array.from({ length: 140 }, (_, k) => [Math.sin(k * 12.9898) * 0.92, ((Math.sin(k * 78.233) * 43758.5453) % 1 + 1) % 1]);

  function bougie(g, s) {
    // Soucoupe, bougie blanche, mèche, flamme (taille selon le dioxygène disponible, petit vacillement).
    g.replaceChildren();
    L.svg("ellipse", { cx: BX, cy: SOL - 3, rx: 30 * E, ry: 6, fill: "#d8d4c8", stroke: "#a8a294" }, g);
    L.svg("rect", { x: BX - 11 * E, y: HAUT_BOUGIE, width: 22 * E, height: SOL - 6 - HAUT_BOUGIE, rx: 2, fill: "#f4f1e6", stroke: "#c9c3b0" }, g);
    L.svg("ellipse", { cx: BX, cy: HAUT_BOUGIE, rx: 11 * E, ry: 3, fill: "#e8e3d2", stroke: "#c9c3b0" }, g);
    L.svg("line", { x1: BX, y1: HAUT_BOUGIE, x2: BX + 1, y2: HAUT_BOUGIE - 8 * E, stroke: "#222", "stroke-width": 1.6 }, g);
    if (!s.allumee) return;
    const h = 30 * E * (0.35 + 0.65 * s.o2) * (1 + 0.05 * Math.sin(performance.now() / 90)), y = HAUT_BOUGIE - 6 * E;
    L.svg("path", { d: `M${BX} ${y - h} C${BX + 9} ${y - h * 0.45} ${BX + 8} ${y} ${BX} ${y + 3} C${BX - 8} ${y} ${BX - 9} ${y - h * 0.45} ${BX} ${y - h} Z`, fill: "#ffcf4a", opacity: 0.92 }, g);
    L.svg("ellipse", { cx: BX, cy: y - h * 0.18, rx: 3.2, ry: h * 0.2, fill: "#5b8cff", opacity: 0.6 }, g);
  }

  function buee(g, pose, angle, k) {
    // Fines gouttelettes sur la paroi intérieure, d'autant plus nombreuses que k est grand.
    const pr = PR(), r = pr.r(pr.H) * E, H = pr.H * E, s = angle ? 1 : -1;
    GOUTTES.slice(0, Math.round(GOUTTES.length * k)).forEach(([u, v]) => L.svg("circle", { cx: pose.x + u * r, cy: pose.y + s * v * H, r: 1.1, fill: "#fff", opacity: 0.75 }, g));
  }

  L.poste_bougie = function (g) {
    // Matériel, gestes, combustion pas à pas (10 fois par seconde).
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230), ctx = L.paillasse_chimie(g);
    L.ecoulement(ctx, { sol: SOL, e: E });
    const s = { allumee: true, o2: 1, buee: 0, co2: 0, phase: "retourne", couvert: false, pose: { x: 650, y: SOL - PR().H * E } };
    const gb = L.svg("g", { "pointer-events": "none" }, ctx.fond), gv = L.svg("g", { class: "becher-retourne", role: "button", "aria-label": "Bécher retourné" }, ctx.haut), gd = L.svg("g", { "pointer-events": "none" }, ctx.haut);
    const chaux = L.recipient(ctx, { id: "chaux", profil: "becher_100", x: 800, y: SOL, e: E, contenu: { eau_chaux: 30 }, etiquette: "eau de chaux" });
    L.manipuler(ctx, chaux, { sol: SOL });
    let becher = null;
    const retourne = () => { L.dessiner_verrerie(gv, PR(), { ...s.pose, angle: 180, e: E }, { regions: [], surface: null }); gd.replaceChildren(); buee(gd, s.pose, 180, s.buee); };
    const couvre = () => Math.abs(s.pose.x - BX) < PR().r(PR().H) * E - 12 && s.pose.y + PR().H * E > HAUT_BOUGIE - 36 * E;
    L.glissable(gv, {
      debut: () => (s.phase === "retourne" ? { ...s.pose } : null),
      deplacer: (p) => { const bas = Math.abs(p.x - BX) < 70 ? HAUT_BOUGIE - 4 - PR().H * E : SOL - PR().H * E; s.pose = { x: p.x, y: Math.min(p.y, bas) }; retourne(); },
      lacher: () => {
        if (couvre()) return;
        // Remis à l'endroit sur la paillasse : il devient un récipient où l'on peut verser.
        s.phase = "pose"; gv.replaceChildren();
        becher = L.recipient(ctx, { id: "becher", profil: "becher_250", x: Math.max(560, Math.min(700, s.pose.x)), y: SOL, e: E, contenu: {}, etiquette: "" });
        L.manipuler(ctx, becher, { sol: SOL });
      },
    });
    L.bouton_texte(g, 140, 250, "Rallumer la bougie", () => { s.allumee = true; s.o2 = Math.max(s.o2, 0.6); });
    retourne();
    setInterval(() => {
      const dt = 0.1;
      s.couvert = s.phase === "retourne" && couvre();
      if (s.couvert && s.allumee) { s.buee = Math.min(1, s.buee + dt / 6); s.co2 += 0.004; s.o2 -= dt / 16; if (s.o2 < 0.2) s.allumee = false; }
      if (!s.couvert) s.o2 = Math.min(1, s.o2 + dt / 3);
      bougie(gb, s);
      if (becher) { gd.replaceChildren(); buee(gd, becher.pose, 0, s.buee * 0.6); trouble(becher, s); }
      const ph = becher && becher.c.phases.find((p) => p.classe === "aqueuse"), v = (n) => (ph ? ph.liquides[n] || 0 : 0), total = v("eau_chaux") + v("eau_chaux_trouble");
      L.missions.noter("bougie", { couvert: s.couvert, buee: Math.round(s.buee * 100) / 100, allumee: s.allumee, o2: Math.round(s.o2 * 100) / 100, phase: s.phase, co2: Math.round(s.co2 * 1000) / 1000, chaux: Math.round(total * 10) / 10, trouble: total ? Math.round((v("eau_chaux_trouble") / total) * 100) / 100 : 0 });
    }, 100);
    return { pense_bete };
  };

  function trouble(b, s) {
    // L'eau de chaux versée réagit avec le dioxyde de carbone du bécher (carbonate de calcium) : elle se trouble.
    const ph = b.c.phases.find((p) => p.classe === "aqueuse"), v = ph ? ph.liquides.eau_chaux || 0 : 0;
    if (v <= 0 || s.co2 <= 0) return;
    const dv = Math.min(v, 0.5, s.co2 / 0.004);
    L.convertir_liquide(b.c, "eau_chaux", "eau_chaux_trouble", dv); s.co2 = Math.max(0, s.co2 - dv * 0.004); b.sig = null;
  }
})(window.Labo);
