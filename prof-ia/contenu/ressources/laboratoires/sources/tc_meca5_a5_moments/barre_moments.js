/*
Rôle : barre à trous (60 cm, un trou tous les 5 cm) mobile autour d'un axe horizontal fixe passant par son milieu, sur un
       panneau du mur. L'élève accroche des masses marquées aux trous ; la barre tourne jusqu'à une butée si la somme des
       moments n'est pas nulle, et reste horizontale à l'équilibre.
Reçoit : le groupe SVG de la paillasse ; les gestes de l'élève.
Produit : Labo.barre_moments(groupe) ; faits notés : « barre » = { masses: [{ m (kg), d (cm, positif à droite) }], equilibre,
          tourne } à chaque changement ; « equilibres_barre » = liste des configurations équilibrées (au moins une masse de chaque côté).
Utilisé par : simulation.js.
*/
(function (L) {
  const O = { x: 512, y: 190 }, PX_CM = 6, BUTEE = (12 * Math.PI) / 180, PLACES = [170, 198, 228, 262, 298, 342];

  function dessiner_barre(g, angle) {
    // Barre d'aluminium percée, graduée en cm de part et d'autre de l'axe, tournée de « angle ».
    const b = L.svg("g", { transform: `rotate(${(angle * 180) / Math.PI} ${O.x} ${O.y})` }, g);
    L.svg("rect", { x: O.x - 31 * PX_CM, y: O.y - 7, width: 62 * PX_CM, height: 14, rx: 3, fill: "url(#metal-h)", stroke: "#5d666d" }, b);
    for (let d = -30; d <= 30; d += 5) {
      L.svg("circle", { cx: O.x + d * PX_CM, cy: O.y, r: 2.6, fill: "#2a2e33" }, b);
      if (d) L.texte(b, O.x + d * PX_CM, O.y - 12, String(Math.abs(d)), { "font-size": 7, fill: "#1b1f22" });
    }
    L.svg("circle", { cx: O.x, cy: O.y, r: 6, fill: "url(#acier)", stroke: "#1b1f22" }, b);
  }

  function trou(angle, d) {
    // Position à l'écran du trou situé à d cm de l'axe (barre tournée).
    return { x: O.x + d * PX_CM * Math.cos(angle), y: O.y + d * PX_CM * Math.sin(angle) };
  }

  function etat_moments(e) {
    // Somme des moments (en N·m, positive dans le sens des aiguilles d'une montre) et faits notés.
    const masses = e.objets.filter((o) => o.trou !== undefined).map((o) => ({ m: o.masse_kg, d: o.trou }));
    const somme = masses.reduce((s, x) => s + x.m * 9.81 * (x.d / 100), 0), equilibre = Math.abs(somme) < 1e-6;
    e.cible = equilibre ? 0 : Math.sign(somme) * BUTEE;
    L.missions.noter("barre", { masses, equilibre, tourne: !equilibre });
    const cle = JSON.stringify([...masses].sort((a, b) => a.d - b.d));
    if (equilibre && masses.some((x) => x.d < 0) && masses.some((x) => x.d > 0) && !e.equilibres.some((c) => JSON.stringify([...c].sort((a, b) => a.d - b.d)) === cle)) {
      e.equilibres.push(masses);
      L.missions.noter("equilibres_barre", e.equilibres.map((c) => c.map((x) => ({ ...x }))));
    }
  }

  function placer_objets(e) {
    // Les masses accrochées pendent sous leur trou ; les autres sont dans le coffret ou dans la main.
    for (const o of e.objets) {
      if (o.trou !== undefined) { const p = trou(e.angle, o.trou); o.pendre(true); o.placer(p.x, p.y + 4); }
      else if (!o.tenu) { o.pendre(false); o.placer(PLACES[o.place], 490 - o.hauteur_debout); }
    }
  }

  L.barre_moments = function (g) {
    // Panneau, axe, barre ; coffret de masses ; animation de la rotation vers la butée ou vers l'horizontale.
    L.svg("rect", { x: 280, y: 60, width: 464, height: 330, rx: 4, fill: "#f3ead6", stroke: "#b09a6d", filter: "url(#ombre)" }, g);
    for (const s of [-1, 1]) L.svg("path", { d: `M${O.x + s * 150} ${O.y - 46} l${s * 14} 6 v12 l${-s * 14} -6 Z`, fill: "#3b3f44" }, g);
    L.coffret_masses(g, PLACES, 150, 372, 490);
    const barre = L.svg("g", {}, g), calque = L.svg("g", {}, g);
    const e = { angle: 0, cible: 0, equilibres: [], objets: L.MASSES_MARQUEES.map((d, i) => new L.ObjetSuspendu(calque, { ...d, type: "masse", place: i })) };
    L.barre_gestes(e, { trou, etat_moments, placer_objets });
    let avant = null;
    const image = (t) => {
      const dt = avant === null ? 0 : Math.min(0.05, (t - avant) / 1000);
      avant = t;
      e.angle += (e.cible - e.angle) * Math.min(1, dt * 4);
      barre.replaceChildren();
      dessiner_barre(barre, e.angle);
      placer_objets(e);
      requestAnimationFrame(image);
    };
    requestAnimationFrame(image);
    etat_moments(e);
  };
})(window.Labo);
