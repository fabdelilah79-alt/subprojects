/*
Rôle : générateur de courant continu réglable (0 à I_max) : bouton de réglage de l'intensité avec son afficheur, touche
       « Fermer / Ouvrir » (interrupteur), touche « Inverser » (sens du courant), deux bornes (rouge et noire) sur le côté
       droit, où arrivent les câbles du montage.
Reçoit : le groupe SVG et { x, y (coin du boîtier), max (A), pas (A), valeur (A) }.
Produit : Labo.generateur_courant(g, reglage) -> gen { I, ferme, sens, intensite() (A, signée, 0 si ouvert),
          bornes: { rouge: { x, y }, noire: { x, y } } }.
Utilisé par : les postes des simulations de magnétisme.
*/
(function (L) {
  L.generateur_courant = function (g, { x, y, max = 5, pas = 0.5, valeur = 3 }) {
    // Boîtier, réglage, interrupteur, inverseur, état du circuit, bornes.
    const gen = { I: valeur, ferme: false, sens: 1, bornes: { rouge: { x: x + 173, y: y + 30 }, noire: { x: x + 173, y: y + 130 } } };
    gen.intensite = () => (gen.ferme ? gen.sens * gen.I : 0);
    L.svg("rect", { x, y, width: 170, height: 150, rx: 6, fill: "#5f7383", stroke: "#222" }, g);
    L.texte(g, x + 85, y + 12, "GÉNÉRATEUR DE COURANT", { "font-size": 7.5, "font-weight": 700, fill: "#e6eef4" });
    L.bouton_reglage(g, { x: x + 50, y: y + 100, min: 0, max, pas, valeur, unite: "A", titre: "intensité", decimales: pas < 1 ? 1 : 0, sur_changement: (v) => { gen.I = v; } });
    const etat = L.texte(g, x + 130, y + 40, "", { "font-size": 8, "font-weight": 700, fill: "#fff" });
    const montrer = () => { etat.textContent = `${gen.ferme ? "fermé" : "ouvert"} · sens ${gen.sens > 0 ? "1" : "2"}`; };
    L.bouton_texte(g, x + 130, y + 62, "Fermer / Ouvrir", () => { gen.ferme = !gen.ferme; montrer(); });
    L.bouton_texte(g, x + 130, y + 90, "Inverser", () => { gen.sens = -gen.sens; montrer(); });
    [[gen.bornes.rouge, L.ROUGE_BORNE], [gen.bornes.noire, L.NOIR_BORNE]].forEach(([p, c]) => L.svg("circle", { cx: p.x - 1, cy: p.y, r: 5, fill: c, stroke: "#111" }, g));
    montrer();
    return gen;
  };
})(window.Labo);
