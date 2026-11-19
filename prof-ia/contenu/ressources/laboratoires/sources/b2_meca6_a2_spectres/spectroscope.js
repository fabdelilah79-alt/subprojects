/*
Rôle : spectroscope de poche à réseau et à échelle graduée (tube noir de 12 cm : fente réglable du côté de la source, oculaire
       à bonnette de caoutchouc), tenu par une pince sur un support (socle, tige, noix) ; toucher l'oculaire montre ce que l'on
       voit dedans : le spectre de la lumière qui entre par la fente (raies, spectre continu, ou spectre continu avec raies
       noires d'absorption) au-dessus de l'échelle éclairée graduée de 400 à 700 nm (lecture à 2 nm près).
Reçoit : le groupe SVG et { x, y (axe du tube), sol (pied du support), sens (1 : fente à droite ; −1 : fente à gauche),
         lumiere() -> { raies [[λ, I]], continu (vrai/faux), absorption [λ] }, vu(lumiere) (appelé à chaque ouverture) }.
Produit : Labo.spectroscope(g, reglage) -> { devant() } (remet la vue au-dessus de tout, à appeler en dernier).
Utilisé par : poste_tubes.js, poste_sodium.js.
*/
(function (L) {
  const V = { x: 132, y: 110, l: 760, h: 300 }, X = (l) => V.x + 40 + ((l - 390) / 330) * (V.l - 80), BANDE = { y: V.y + 70, h: 90 };

  function support(g, x, y, sol) {
    // Socle en fonte, tige verticale, noix, pince à deux mâchoires autour du tube.
    L.ombre_sol(g, x, sol + 4, 46, 6, 0.4);
    L.svg("path", { d: `M${x - 40} ${sol} h80 l-6 -10 h-68 Z`, fill: "#3a3f45", stroke: "#24282c" }, g);
    L.svg("rect", { x: x - 2.5, y: y + 8, width: 5, height: sol - y - 16, fill: "url(#metal)" }, g);
    L.svg("rect", { x: x - 8, y: y + 18, width: 16, height: 13, rx: 2, fill: "#2b3036", stroke: "#111" }, g);
    L.svg("circle", { cx: x + 10, cy: y + 24.5, r: 3, fill: "url(#acier)", stroke: "#333", "stroke-width": 0.5 }, g);
    L.svg("rect", { x: x - 2, y: y + 7, width: 4, height: 12, fill: "url(#metal)" }, g);
    for (const dy of [-11, 8]) L.svg("rect", { x: x - 9, y: y + dy, width: 18, height: 4, rx: 1.5, fill: "#8a9196", stroke: "#4b5258", "stroke-width": 0.5 }, g);
  }

  function tube(g, x, y, sens) {
    // Corps noir, bagues, fente côté source, oculaire et bonnette côté élève ; l'oculaire se touche.
    L.svg("rect", { x: x - 60, y: y - 7, width: 120, height: 14, rx: 3, fill: "#1d2226", stroke: "#000" }, g);
    L.svg("rect", { x: x - 58, y: y - 6, width: 116, height: 3, rx: 1.5, fill: "#fff", opacity: 0.12 }, g);
    for (const dx of [-30, 26]) L.svg("rect", { x: x + dx, y: y - 7.5, width: 4, height: 15, fill: "url(#metal)" }, g);
    L.svg("rect", { x: x + sens * 60 - (sens > 0 ? 0 : 8), y: y - 8, width: 8, height: 16, rx: 2, fill: "url(#acier)", stroke: "#333", "stroke-width": 0.5 }, g);
    L.svg("rect", { x: x + sens * 64 - 0.6, y: y - 4, width: 1.2, height: 8, fill: "#111" }, g);
    L.texte(g, x, y + 2.3, "SPECTROSCOPE", { "font-size": 5, fill: "#c9ced2" });
    const oc = L.svg("g", { class: "oculaire", role: "button", "aria-label": "Regarder dans le spectroscope" }, g), xo = x - sens * 60;
    L.svg("rect", { x: sens > 0 ? xo - 14 : xo, y: y - 9, width: 14, height: 18, rx: 2, fill: "#2b2f33", stroke: "#000" }, oc);
    L.svg("rect", { x: sens > 0 ? xo - 22 : xo + 14, y: y - 11, width: 8, height: 22, rx: 4, fill: "#111" }, oc);
    return oc;
  }

  function spectre(g, lum) {
    // Bande du spectre : continu (dégradé de 2 nm en 2 nm), raies brillantes, raies sombres d'absorption.
    L.svg("rect", { x: V.x + 30, y: BANDE.y, width: V.l - 60, height: BANDE.h, fill: "#050505" }, g);
    if (lum.continu) for (let l = 400; l < 700; l += 2) L.svg("rect", { x: X(l), y: BANDE.y, width: X(l + 2) - X(l) + 0.4, height: BANDE.h, fill: L.couleur_css(l + 1) }, g);
    for (const [l, I] of lum.raies || []) {
      L.svg("rect", { x: X(l) - 4, y: BANDE.y, width: 8, height: BANDE.h, fill: L.couleur_css(l), opacity: 0.25 * I }, g);
      L.svg("rect", { x: X(l) - 1.6, y: BANDE.y, width: 3.2, height: BANDE.h, fill: L.couleur_css(l), opacity: 0.35 + 0.65 * I }, g);
    }
    for (const l of lum.absorption || []) L.svg("rect", { x: X(l) - 1.8, y: BANDE.y, width: 3.6, height: BANDE.h, fill: "#0a0a0a", opacity: 0.88 }, g);
    if (!lum.continu && !(lum.raies || []).length) L.texte(g, V.x + V.l / 2, BANDE.y + 50, "Aucune lumière n'entre par la fente.", { "font-size": 14, fill: "#888" });
  }

  function echelle(g) {
    // Échelle éclairée sous le spectre : traits tous les 5 nm, chiffres tous les 50 nm.
    const y = BANDE.y + BANDE.h + 8;
    for (let l = 400; l <= 700; l += 5) L.svg("line", { x1: X(l), y1: y, x2: X(l), y2: y + (l % 50 ? (l % 10 ? 6 : 10) : 16), stroke: "#e8e2c8", "stroke-width": 1 }, g);
    for (let l = 400; l <= 700; l += 50) L.texte(g, X(l), y + 30, String(l), { "font-size": 13, fill: "#e8e2c8" });
    L.texte(g, X(700) + 22, y + 30, "nm", { "font-size": 12, fill: "#e8e2c8" });
  }

  function ouvrir(grand, lum) {
    // Champ de l'oculaire : fond noir, spectre, échelle ; un toucher referme.
    grand.replaceChildren();
    L.svg("rect", { x: V.x - 6, y: V.y - 6, width: V.l + 12, height: V.h + 12, rx: 30, fill: "#2b2f33" }, grand);
    L.svg("rect", { x: V.x, y: V.y, width: V.l, height: V.h, rx: 26, fill: "#000" }, grand);
    L.texte(grand, V.x + V.l / 2, V.y + 34, "Vu dans l'oculaire du spectroscope", { "font-size": 14, "font-weight": 700, fill: "#cfd3d6" });
    spectre(grand, lum); echelle(grand);
    L.texte(grand, V.x + V.l / 2, V.y + V.h - 14, "Touchez pour refermer.", { "font-size": 10, fill: "#888" });
  }

  L.spectroscope = function (g, { x, y, sol, sens = 1, lumiere, vu = () => {} }) {
    // Support, tube ; l'oculaire ouvre la vue, la vue se referme d'un toucher.
    support(g, x, y, sol);
    const oc = tube(g, x, y, sens), grand = L.svg("g", { class: "vue-spectroscope" }, g);
    L.glissable(oc, { soulever: false, debut: () => ({ x: 0, y: 0 }), toucher: () => { const lum = lumiere(); ouvrir(grand, lum); vu(lum); } });
    L.glissable(grand, { soulever: false, debut: () => ({ x: 0, y: 0 }), toucher: () => grand.replaceChildren() });
    return { devant: () => g.append(grand), X };
  };
})(window.Labo);
