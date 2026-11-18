/*
Rôle : banc d'essai 2,5D (page outils/banc_25d.html) : une paillasse avec une boîte (multimètre), un cylindre (socle),
       un bécher droit dont on règle le volume, un erlenmeyer qu'on penche, une éprouvette qu'on secoue ; curseurs pour
       le rapport des ovales k, le volume et l'angle ; le liquide est géré par le vrai moteur (recipient_physique.js).
Reçoit : les fichiers communs (base, ambiance, materiaux, liquides, verrerie, vue_25d) chargés par la page.
Produit : window.banc = { regler({ k, V, angle }), secouer(), recipients, sorties } ; la scène redessinée 60 fois par seconde.
Utilisé par : outils/banc_25d.html (essai à la main) et outils/test_25d.js (test automatique).
*/
(function (L) {
  L.LIQUIDES.eau_bleue = { nom: "eau colorée", d: 1.0, rgb: [52, 128, 190], alpha: 0.55, classe: "aqueuse" };
  const svg = document.getElementById("scene"), sorties = [];
  L.materiaux(svg);
  const fond = L.svg("g", {}, svg), objets = L.svg("g", {}, svg);
  const ctx = { objets, ecoulement: { ajouter() {}, emettre: (r, p, v, parts, V) => sorties.push({ id: r.id, V, angle: r.pose.angle }) } };

  function decor() {
    // Mur, dessus de la paillasse vu un peu d'en haut (dégradé du fond vers l'avant), bord avant, placards.
    fond.replaceChildren();
    L.svg("rect", { width: 1024, height: 250, fill: "url(#mur)" }, fond);
    L.svg("rect", { y: 250, width: 1024, height: 300, fill: "url(#paillasse)" }, fond);
    L.svg("rect", { y: 250, width: 1024, height: 10, fill: "#000", opacity: 0.25 }, fond);
    L.svg("rect", { y: 550, width: 1024, height: 20, fill: "url(#bord)" }, fond);
    L.svg("rect", { y: 570, width: 1024, height: 70, fill: "url(#placard)" }, fond);
  }

  const recipients = {
    becher: L.recipient(ctx, { id: "becher", profil: "becher_250", x: 470, y: 470, e: 1.9, contenu: { eau_bleue: 120 } }),
    erlen: L.recipient(ctx, { id: "erlen", profil: "erlenmeyer_250", x: 680, y: 470, e: 1.9, contenu: { eau_bleue: 100 } }),
    eprouvette: L.recipient(ctx, { id: "eprouvette", profil: "eprouvette_50", x: 880, y: 470, e: 2.2, contenu: { eau_bleue: 30 } }),
  };
  const statiques = L.svg("g", {}, objets);

  function materiel() {
    // Une boîte (multimètre jaune) et un cylindre (socle d'acier), dessinés par vue_25d.js.
    statiques.replaceChildren();
    L.vue.boite(statiques, 70, 470, { l: 110, h: 150, p: 40, rgb: [242, 194, 48] });
    L.vue.cylindre(statiques, 290, 470, { r: 48, h: 26, rgb: [150, 158, 164] });
  }

  window.banc = {
    recipients, sorties,
    regler({ k, V, angle }) {
      // Change la vue (k), le volume du bécher (mL) et l'angle de l'erlenmeyer (degrés), puis redessine tout.
      if (k !== undefined) { L.VUE.k = k; materiel(); }
      if (V !== undefined) { const b = recipients.becher; b.c.retirer(b.c.volume(), "haut"); b.c.ajouter("eau_bleue", V); }
      if (angle !== undefined) recipients.erlen.pose.angle = angle;
    },
    secouer() {
      // Coup horizontal donné à l'éprouvette : la surface penche, oscille, puis revient à l'horizontale.
      recipients.eprouvette.acc.x = 9000;
    },
  };

  L.VUE.k = 0.26; L.VUE.surface_penchee = true;
  decor(); materiel();
  let avant = performance.now();
  (function boucle(t) {
    const dt = Math.min(0.05, (t - avant) / 1000); avant = t;
    for (const r of Object.values(recipients)) { r.pas(dt); r.dessiner(); }
    requestAnimationFrame(boucle);
  })(avant);
})(window.Labo);
