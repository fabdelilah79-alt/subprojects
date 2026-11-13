/*
Rôle : vélo et cycliste dessinés de profil : roues à rayons qui tournent (roulement sans glissement), pédalier,
       jambes qui pédalent, casque ; catadioptre jaune sur la valve de la roue arrière, petite caméra sur le porte-bagages.
Reçoit : le groupe SVG ; à chaque image, la position du moyeu arrière à l'écran et l'angle de rotation des roues.
Produit : new Labo.Velo(parent) avec dessiner(x, y, angle) ; Labo.Velo.R (rayon de roue, en m) ;
          valve(angle) et tete() : positions relatives au moyeu arrière (en m, y vers le haut).
Utilisé par : poste_rue.js.
*/
(function (L) {
  const R = 0.34, EMPATTEMENT = 1.05, PX = 100;

  function roue(g, cx, angle) {
    // Pneu, jante, 16 rayons, moyeu ; les rayons tournent avec la roue.
    L.svg("circle", { cx, cy: 0, r: R * PX, fill: "none", stroke: "#1b1b1b", "stroke-width": 5 }, g);
    L.svg("circle", { cx, cy: 0, r: R * PX - 4, fill: "none", stroke: "#b9c0c5", "stroke-width": 1.6 }, g);
    for (let i = 0; i < 16; i++) {
      const a = angle + (i * Math.PI) / 8;
      L.svg("line", { x1: cx, y1: 0, x2: cx + Math.cos(a) * (R * PX - 4), y2: Math.sin(a) * (R * PX - 4), stroke: "#9aa1a7", "stroke-width": 0.6 }, g);
    }
    L.svg("circle", { cx, cy: 0, r: 4, fill: "url(#metal)" }, g);
  }

  function cadre(g, pedale) {
    // Cadre rouge en losange, selle, guidon, pédalier et camera sur le porte-bagages.
    const av = EMPATTEMENT * PX, pedalier = { x: 40, y: 4 };
    L.svg("path", { d: `M0 0 L${pedalier.x} ${pedalier.y} L${av - 20} -52 L22 -52 Z M22 -52 L${pedalier.x} ${pedalier.y} M${av - 20} -52 L${av} 0`, fill: "none", stroke: "#b3261e", "stroke-width": 4.5, "stroke-linejoin": "round" }, g);
    L.svg("path", { d: "M18 -60 L22 -52 M8 -62 H32", stroke: "#1b1b1b", "stroke-width": 4, "stroke-linecap": "round" }, g);
    L.svg("path", { d: `M${av - 20} -52 L${av - 24} -70 H${av - 6}`, fill: "none", stroke: "#2a2e33", "stroke-width": 3.5, "stroke-linecap": "round" }, g);
    L.svg("path", { d: "M-6 -38 H14 L22 -52", fill: "none", stroke: "#4a5056", "stroke-width": 2.5 }, g);
    const camera = L.svg("g", { class: "camera-embarquee", role: "button", "aria-label": "Regarder avec la caméra embarquée" }, g);
    L.svg("rect", { x: -34, y: -66, width: 50, height: 40, fill: "#000", opacity: 0.001 }, camera);
    L.svg("rect", { x: -16, y: -50, width: 18, height: 12, rx: 2, fill: "#111" }, camera);
    L.svg("circle", { cx: -18, cy: -44, r: 3.5, fill: "#3f6ea8", stroke: "#111" }, camera);
    const p1 = { x: pedalier.x + 15 * Math.cos(pedale), y: pedalier.y + 15 * Math.sin(pedale) };
    const p2 = { x: pedalier.x - 15 * Math.cos(pedale), y: pedalier.y - 15 * Math.sin(pedale) };
    L.svg("circle", { cx: pedalier.x, cy: pedalier.y, r: 7, fill: "none", stroke: "#8a9297", "stroke-width": 2.5 }, g);
    return { p1, p2 };
  }

  function jambe(g, hanche, pied, couleur) {
    // Jambe en deux segments (cuisse, mollet), genou vers l'avant.
    const d = Math.hypot(pied.x - hanche.x, pied.y - hanche.y), l = 44, m = { x: (hanche.x + pied.x) / 2, y: (hanche.y + pied.y) / 2 };
    const h = Math.sqrt(Math.max(0, l * l - (d / 2) * (d / 2))), ux = (pied.x - hanche.x) / d, uy = (pied.y - hanche.y) / d;
    const genou = { x: m.x + uy * h, y: m.y - ux * h };
    L.svg("path", { d: `M${hanche.x} ${hanche.y} L${genou.x} ${genou.y} L${pied.x} ${pied.y}`, fill: "none", stroke: couleur, "stroke-width": 9, "stroke-linecap": "round", "stroke-linejoin": "round" }, g);
  }

  function cycliste(g, pieds) {
    // Cycliste penché vers le guidon : jambes, buste, bras, tête et casque.
    const hanche = { x: 20, y: -66 }, epaule = { x: 62, y: -118 };
    jambe(g, hanche, pieds.p2, "#2b3a55");
    L.svg("path", { d: `M${hanche.x} ${hanche.y} L${epaule.x} ${epaule.y}`, stroke: "#1f6f4a", "stroke-width": 16, "stroke-linecap": "round" }, g);
    L.svg("path", { d: `M${epaule.x} ${epaule.y} L${EMPATTEMENT * PX - 16} -70`, stroke: "#c98f6b", "stroke-width": 6, "stroke-linecap": "round" }, g);
    jambe(g, hanche, pieds.p1, "#33476b");
    L.svg("circle", { cx: 72, cy: -136, r: 10, fill: "#c98f6b" }, g);
    L.svg("path", { d: "M60 -138 A13 12 0 0 1 86 -140 L84 -134 H62 Z", fill: "#f1b434", stroke: "#8a6516", "stroke-width": 0.8 }, g);
  }

  function Velo(parent) {
    // Groupe du vélo, redessiné à chaque image.
    this.g = L.svg("g", { class: "velo" }, parent);
  }

  Velo.prototype.dessiner = function (x, y, angle) {
    // Dessine le vélo, moyeu arrière en (x, y) à l'écran ; angle : rotation des roues (rad).
    this.g.replaceChildren();
    this.g.setAttribute("transform", `translate(${x} ${y})`);
    L.svg("ellipse", { cx: EMPATTEMENT * 50, cy: R * PX + 3, rx: 90, ry: 5, fill: "#000", opacity: 0.25, filter: "url(#flou)" }, this.g);
    roue(this.g, 0, angle);
    roue(this.g, EMPATTEMENT * PX, angle);
    const pieds = cadre(this.g, angle * 0.42);
    cycliste(this.g, pieds);
    const v = this.valve(angle);
    L.svg("circle", { cx: v.x * PX, cy: -v.y * PX, r: 4.5, fill: "#ffd60a", stroke: "#7a5b00" }, this.g);
  };

  Velo.prototype.valve = function (angle) {
    // Position de la valve par rapport au moyeu arrière (m, y vers le haut) : en bas quand l'angle est nul.
    return { x: -(R - 0.02) * Math.sin(angle), y: -(R - 0.02) * Math.cos(angle) };
  };

  Velo.prototype.tete = function () {
    // Position du casque par rapport au moyeu arrière (m, y vers le haut).
    return { x: 0.72, y: 1.38 };
  };

  L.Velo = Velo;
  L.Velo.R = R;
})(window.Labo);
