/*
Rôle : physique de la diffraction de la lumière par une fente ou par un réseau, et image de l'écran vu de face.
       Réseau de n traits par mm (pas a = 1/n) ; traits transparents de largeur b = 0,15·a. Incidence i (angle entre le
       faisceau et la normale au réseau) : maximums dans les directions θk telles que sin θk − sin i = k·λ / a (ils
       n'existent que si |sin θk| ≤ 1) ; déviation par rapport au faisceau δk = θk − i ; éclat relatif sinc²(π·k·b/a).
       Fente de largeur b : intensité sinc²(π·b·sin δ / λ). Lumière blanche : somme de radiations de 400 à 700 nm.
Reçoit : un état { objet (indice dans OBJETS), source (rouge, vert, blanche), D (m), i (°) }.
Produit : Labo.RESEAUX (liste des objets) ; Labo.raies_source(source) ; Labo.ordres_reseau(objet, λ, i) -> [{ k, delta (rad),
          eclat }] ; Labo.peindre_reseau(s, toile, image) (écran de ±350 mm, 1 px par mm) ; Labo.couleur_css(λ).
Utilisé par : ecran_reseau.js, banc_reseau.js.
*/
(function (L) {
  L.RESEAUX = [
    { nom: "fente 100 µm", type: "fente", b: 100 }, { nom: "fente 50 µm", type: "fente", b: 50 },
    { nom: "réseau 100 traits/mm", type: "reseau", n: 100 }, { nom: "réseau 300 traits/mm", type: "reseau", n: 300 },
    { nom: "réseau 600 traits/mm", type: "reseau", n: 600 }, { nom: "CD sans couche réfléchissante", type: "reseau", n: 625 },
    { nom: "DVD sans couche réfléchissante", type: "reseau", n: 1350 },
  ];
  const DEMI = 350, sinc2 = (u) => (Math.abs(u) < 1e-9 ? 1 : (Math.sin(u) / u) ** 2);
  L.raies_source = (s) => (s === "rouge" ? [650] : s === "vert" ? [532] : Array.from({ length: 31 }, (_, k) => 400 + 10 * k));
  L.couleur_css = (l) => { const [r, v, b] = L.couleur_onde(l); return `rgb(${Math.round(255 * r)},${Math.round(255 * v)},${Math.round(255 * b)})`; };

  L.ordres_reseau = function (o, l, i) {
    // Ordres qui existent pour un réseau (λ en nm, i en degrés) : déviation δ par rapport au faisceau incident et éclat.
    const a = 1e6 / o.n, si = Math.sin((i * Math.PI) / 180), liste = [];
    for (let k = -Math.ceil(2 * a / l); k <= Math.ceil(2 * a / l); k++) {
      const s = si + (k * l) / a;
      if (Math.abs(s) < 1) liste.push({ k, delta: Math.asin(s) - (i * Math.PI) / 180, eclat: sinc2(Math.PI * k * 0.15) });
    }
    return liste;
  };

  function profil(s) {
    // Intensité (rouge, vert, bleu) de chaque millimètre de l'écran, de −350 à +350 mm.
    const o = L.RESEAUX[s.objet], raies = L.raies_source(s.source), D = s.D * 1000, P = Array.from({ length: 2 * DEMI }, () => [0, 0, 0]);
    const poids = s.source === "blanche" ? 2.2 / raies.length : 1, sigma = s.source === "blanche" ? 2.2 : 1.6;
    for (const l of raies) {
      const c = L.couleur_onde(l), ajouter = (m, I) => { for (let q = 0; q < 3; q++) P[m][q] += I * c[q] * poids; };
      if (o.type === "fente") { for (let m = 0; m < 2 * DEMI; m++) { const x = m + 0.5 - DEMI; ajouter(m, sinc2((Math.PI * o.b * 1000 * x) / (l * Math.hypot(x, D)))); } continue; }
      for (const r of L.ordres_reseau(o, l, s.i)) {
        if (Math.abs(r.delta) >= Math.PI / 2) continue;
        const x0 = D * Math.tan(r.delta);
        for (let m = Math.max(0, Math.floor(x0 + DEMI - 12)); m < Math.min(2 * DEMI, x0 + DEMI + 12); m++) { const d = m + 0.5 - DEMI - x0; ajouter(m, r.eclat * (Math.exp(-((d / sigma) ** 2)) + 0.2 * Math.exp(-((d / (4 * sigma)) ** 2)))); }
      }
    }
    return P;
  }

  L.peindre_reseau = function (s, toile, image) {
    // Écran dans la salle obscure : taches (laser) ou spectres (lampe et fente source, taches hautes).
    const c = toile.getContext("2d"), W = toile.width, H = toile.height, d = c.createImageData(W, H), P = profil(s);
    const haut = s.source === "blanche" ? H / 3 : H / 9;
    for (let j = 0; j < H; j++) {
      const v = Math.exp(-(((j - H / 2) / haut) ** 2)) + 0.15 * Math.exp(-(((j - H / 2) / (2.5 * haut)) ** 2));
      for (let m = 0; m < W; m++) { const p = 4 * (j * W + m); for (let q = 0; q < 3; q++) d.data[p + q] = Math.min(255, 26 + 229 * Math.sqrt(Math.min(1, P[m][q] * v))); d.data[p + 3] = 255; }
    }
    c.putImageData(d, 0, 0); image.setAttribute("href", toile.toDataURL());
  };
})(window.Labo);
