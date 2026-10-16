/*
Rôle : bécher de 150 mL contenant 3 g de feuilles de thé, dans lequel on verse 100 mL d'eau : l'eau se colore peu à peu
       (extraction). Plus l'eau est chaude, plus l'extraction est rapide et plus le liquide devient foncé. L'eau chauffée
       sur la plaque finit par bouillir (bulles, vapeur) ; hors de la plaque, elle refroidit lentement.
Reçoit : le groupe SVG et { id, x, bas, lettre, texte }.
Produit : Labo.becher_the(g, reglage) -> { id, eau, T, c (0 à 1 : avancement de l'extraction), remplir(T), avancer(dt_min, chauffe) }.
Utilisé par : postes_a1.js.
*/
(function (L) {
  const EAU = [228, 240, 247], THE = [150, 82, 18];
  const k = (T) => 0.002 * Math.exp((T - 20) / 14);
  const c_max = (T) => 0.35 + (0.65 * Math.max(0, T - 20)) / 80;

  function feuilles(g, x, bas, c) {
    // Feuilles de thé vert roulées au fond ; elles se déroulent à mesure que l'extraction avance.
    const e = 0.6 + 0.9 * c;
    for (let i = 0; i < 9; i++) {
      const fx = x - 20 + ((i * 13) % 40), fy = bas - 6 - ((i * 7) % 9);
      L.svg("ellipse", { cx: fx, cy: fy, rx: 3.2 * e, ry: 1.6 * e, transform: `rotate(${(i * 53) % 180} ${fx} ${fy})`, fill: c > 0.3 ? "#5f7d2e" : "#3f5622", stroke: "#2c3c16", "stroke-width": 0.4 }, g);
    }
  }

  function bulles(g, x, bas, haut) {
    // Bouillonnement : bulles qui montent et un panache de vapeur au-dessus du bécher.
    for (let i = 0; i < 10; i++) L.svg("circle", { cx: x - 20 + ((i * 17 + Date.now() / 40) % 40), cy: bas - 6 - ((i * 23 + Date.now() / 25) % (bas - haut - 8)), r: 1.4 + (i % 3) * 0.6, fill: "none", stroke: "#fff", opacity: 0.7 }, g);
    for (let i = 0; i < 3; i++) L.svg("path", { d: `M${x - 10 + i * 10} ${haut - 4} q-6 -10 0 -20 q6 -10 0 -20`, stroke: "#ffffff", "stroke-width": 3, opacity: 0.35, fill: "none" }, g);
  }

  L.becher_the = function (g, { id, x, bas, lettre, texte }) {
    // Dessin redessiné à chaque pas de temps ; avancer() fait évoluer la température et l'extraction.
    const b = { id, eau: false, T: 20, T0: null, c: 0, bout: false, g: L.svg("g", { class: `becher-the becher-${id}` }, g) };
    const dessiner = () => {
      const rgb = EAU.map((v, i) => v + (THE[i] - v) * b.c), m = { volume: () => (b.eau ? 100 : 0), aspect: () => ({ rgb, alpha: 0.4 + 0.45 * b.c }) };
      L.verrerie.becher(b.g, x, bas, m, "", { l: 56, h: 72, capacite: 150 });
      feuilles(b.g, x, bas, b.c);
      if (b.bout) bulles(b.g, x, bas, bas - 3 - (100 / 150) * 64);
      L.texte(b.g, x, bas - 84, `${lettre} : ${texte}`, { "font-size": 7.5, "font-weight": 700, fill: "#e8e2cc" });
    };
    b.remplir = (T) => { if (b.eau) return false; Object.assign(b, { eau: true, T, T0: T }); dessiner(); return true; };
    b.avancer = (dt, chauffe) => {
      if (!b.eau) return;
      b.T = chauffe ? Math.min(100, b.T + (110 - b.T) * (1 - Math.exp(-dt / 2.5))) : 20 + (b.T - 20) * Math.exp(-dt / 25);
      b.bout = chauffe && b.T >= 99.5;
      b.c = Math.max(b.c, b.c + k(b.T) * (c_max(b.T) - b.c) * dt);
      dessiner();
    };
    b.bouche = () => ({ x, y: bas - 72 });
    dessiner();
    return b;
  };
})(window.Labo);
