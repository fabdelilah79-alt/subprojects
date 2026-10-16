/*
Rôle : petits appareils du circuit, chacun sur son support à deux bornes : lampe à incandescence (elle brille selon la
       puissance reçue), diode électroluminescente avec sa résistance de protection (elle ne laisse passer le courant
       que dans un sens : de sa borne + vers sa borne −), interrupteur à couteau (un toucher l'ouvre ou le ferme).
Reçoit : le circuit (circuit.js) et le réglage de chaque appareil { id, x, y, ... }.
Produit : Labo.lampe(c, { id, x, y, U_n, I_n, etiquette, lettres }) -> { i, u, eclat } ; Labo.support_dipole(...) ; Labo.del(c, { id, x, y }) -> { i, u, allumee } ;
          Labo.interrupteur(c, { id, x, y, lettres }) -> { ferme } ; bornes « 1 » et « 2 » (DEL : « + » et « − »).
Utilisé par : les postes des simulations d'électricité.
*/
(function (L) {
  const L_SUPPORT = 92, P_SUPPORT = 46, SEUIL_DEL = 1.9, R_DEL = 100, GRIS_BORNE = "#4a4f55";

  function support(c, comp, x, y, etiquette, bornes = ["1", "2"], couleurs = [GRIS_BORNE, GRIS_BORNE], lettres = null) {
    // Support en plastique gris, son étiquette sur la face avant, deux bornes (avec leur lettre, si elle est donnée).
    L.boitier(comp.g, x, y, L_SUPPORT, P_SUPPORT, 12, { dessus: "#e3e1da", face: "#a8a59b" });
    L.texte(comp.g, x + L_SUPPORT / 2, y + P_SUPPORT + 4, etiquette, { "font-size": 8, "font-weight": 700, fill: "#2a2a28" });
    c.borne(comp, bornes[0], x + 14, y + 33, couleurs[0]);
    c.borne(comp, bornes[1], x + L_SUPPORT - 14, y + 33, couleurs[1]);
    if (lettres) [5, L_SUPPORT - 5].forEach((dx, k) => L.texte(comp.g, x + dx, y + 14, lettres[k], { "font-size": 11, "font-weight": 700, fill: "#1a3d7c" }));
  }

  L.support_dipole = support;

  function symbole_del(g, cx, cy) {
    // Symbole normalisé de la DEL : triangle (sens passant de + vers −), barre, deux flèches de lumière qui sortent.
    const trait = { stroke: "#222", "stroke-width": 1.3, fill: "none" };
    L.svg("path", { d: `M${cx - 21} ${cy} H${cx - 6} M${cx + 6} ${cy} H${cx + 21} M${cx + 6} ${cy - 7} V${cy + 7}`, ...trait }, g);
    L.svg("path", { d: `M${cx - 6} ${cy - 7} V${cy + 7} L${cx + 6} ${cy} Z`, fill: "#222" }, g);
    for (const dx of [-2, 4]) {
      L.svg("path", { d: `M${cx + dx} ${cy - 9} l6 -7`, ...trait, "stroke-width": 1 }, g);
      L.svg("path", { d: `M${cx + dx + 6} ${cy - 16} l-4.2 1.2 l2.6 2.2 Z`, fill: "#222" }, g);
    }
  }

  L.lampe = function (c, { id = "lampe", x, y, U_n = 6, I_n = 0.1, etiquette = "", lettres = null }) {
    // Lampe sur douille : verre, filament, halo dont l'éclat suit la puissance reçue (P / P nominale) ; R du filament variable.
    const comp = { id, i: 0, eclat: 0, g: L.svg("g", { class: `lampe lampe-${id}` }, c.calque_composants) };
    support(c, comp, x, y, `${etiquette ? etiquette + " : " : ""}${String(U_n).replace(".", ",")} V – ${String(I_n).replace(".", ",")} A`, ["1", "2"], [GRIS_BORNE, GRIS_BORNE], lettres);
    const cx = x + L_SUPPORT / 2, R = U_n / I_n;
    L.svg("ellipse", { cx, cy: y + 18, rx: 14, ry: 6, fill: "url(#metal-h)", stroke: "#555" }, comp.g);
    const halo = L.svg("circle", { cx, cy: y - 2, r: 46, fill: "url(#halo)", opacity: 0 }, comp.g);
    const ampoule = L.svg("circle", { cx, cy: y - 2, r: 17, fill: "#ffe9a0", opacity: 0 }, comp.g);
    L.svg("circle", { cx, cy: y - 2, r: 17, fill: "url(#verre)", stroke: "#9fb6be" }, comp.g);
    const filament = L.svg("path", { d: `M${cx - 7} ${y + 6} L${cx - 5} ${y - 4} l2 -3 l2 3 l2 -3 l2 3 l2 -3 L${cx + 7} ${y + 6}`, fill: "none", stroke: "#6b5b45", "stroke-width": 1 }, comp.g);
    // Filament de tungstène : sa résistance croît avec la température ; à froid, elle vaut environ 12 % de R à chaud.
    const dipole = L.dipole_non_lineaire("1", "2", (u) => u / (R * (0.12 + 0.88 * Math.sqrt(Math.abs(u) / U_n))), 1);
    comp.dipoles = () => [dipole];
    comp.mettre_a_jour = ({ u, i }) => {
      comp.i = i[0];
      comp.u = u("1", "2");
      comp.eclat = Math.min(1.4, Math.abs(comp.u * comp.i) / (U_n * I_n));
      const e = Math.pow(comp.eclat, 0.6);
      halo.setAttribute("opacity", Math.min(1, e));
      ampoule.setAttribute("opacity", Math.min(0.9, e));
      filament.setAttribute("stroke", comp.eclat > 0.03 ? `rgb(255 ${Math.round(120 + 120 * Math.min(1, e))} ${Math.round(60 * e)})` : "#6b5b45");
    };
    return c.ajouter(comp);
  };

  L.del = function (c, { id = "del", x, y }) {
    // DEL rouge (seuil 1,9 V, résistance de protection 100 Ω) ; bloquée dans le sens inverse.
    const comp = { id, i: 0, allumee: false, g: L.svg("g", { class: `del del-${id}` }, c.calque_composants) };
    support(c, comp, x, y, "DEL + 100 Ω", ["+", "−"], [L.ROUGE_BORNE, L.NOIR_BORNE]);
    const cx = x + L_SUPPORT / 2;
    L.texte(comp.g, x + 14, y + 13, "+", { "font-size": 12, "font-weight": 700, fill: L.ROUGE_BORNE });
    symbole_del(comp.g, cx, y + 33);
    const halo = L.svg("circle", { cx, cy: y + 9, r: 24, fill: "#ff3b30", opacity: 0, filter: "url(#flou)" }, comp.g);
    const dome = L.svg("circle", { cx, cy: y + 9, r: 6, fill: "#8e1b14", stroke: "#5a0f0a" }, comp.g);
    L.svg("circle", { cx: cx - 2, cy: y + 7, r: 1.8, fill: "#fff", opacity: 0.6 }, comp.g);
    const dipole = { a: "+", b: "−", g: 1e-9, j: 0, passante: false };
    dipole.ajuster = (u, i) => {
      // Passante au-delà du seuil ; bloquée si le courant voudrait la traverser à l'envers.
      if (!dipole.passante && u > SEUIL_DEL) { Object.assign(dipole, { passante: true, g: 1 / R_DEL, j: -SEUIL_DEL / R_DEL }); return true; }
      if (dipole.passante && i < 0) { Object.assign(dipole, { passante: false, g: 1e-9, j: 0 }); return true; }
      return false;
    };
    comp.dipoles = () => [dipole];
    comp.mettre_a_jour = ({ u, i }) => {
      comp.i = i[0];
      comp.u = u("+", "−");
      comp.allumee = comp.i > 0.001;
      const e = Math.min(1, comp.i / 0.02);
      halo.setAttribute("opacity", comp.allumee ? 0.25 + 0.6 * e : 0);
      dome.setAttribute("fill", comp.allumee ? "#ff4b3a" : "#8e1b14");
    };
    return c.ajouter(comp);
  };

  L.interrupteur = function (c, { id = "interrupteur", x, y, lettres = null }) {
    // Interrupteur à couteau : lame métallique et poignée rouge ; un toucher l'ouvre ou le ferme.
    const comp = { id, ferme: false, g: L.svg("g", { class: `interrupteur interrupteur-${id}`, role: "button", "aria-label": "Interrupteur" }, c.calque_composants) };
    support(c, comp, x, y, "K", ["1", "2"], [GRIS_BORNE, GRIS_BORNE], lettres);
    const lame = L.svg("g", {}, comp.g), pivot = { x: x + 24, y: y + 18 }, pince = { x: x + 70, y: y + 18 };
    for (const p of [pivot, pince]) L.svg("rect", { x: p.x - 4, y: p.y - 6, width: 8, height: 10, fill: "url(#laiton)" }, comp.g);
    const dessiner = () => {
      lame.replaceChildren();
      const bout = comp.ferme ? { x: pince.x + 6, y: pince.y } : { x: pivot.x + 36, y: pivot.y - 30 };
      L.svg("line", { x1: pivot.x, y1: pivot.y, x2: bout.x, y2: bout.y, stroke: "url(#laiton)", "stroke-width": 4, "stroke-linecap": "round" }, lame);
      L.svg("circle", { cx: bout.x + (comp.ferme ? 4 : 2), cy: bout.y - (comp.ferme ? 0 : 3), r: 6, fill: "#b71c1c", stroke: "#5e0d0d" }, lame);
    };
    comp.g.append(lame);
    dessiner();
    L.glissable(comp.g, { soulever: false, debut: () => ({ x, y }), toucher: () => { comp.ferme = !comp.ferme; dessiner(); c.calculer(); } });
    comp.dipoles = () => (comp.ferme ? [{ a: "1", b: "2", g: 1000, j: 0 }] : []);
    return c.ajouter(comp);
  };
})(window.Labo);
