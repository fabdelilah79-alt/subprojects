/*
Rôle : dissolution d'un solide moléculaire dans un liquide (saccharose, glucose, diiode) : les cristaux, posés au fond,
       passent peu à peu dans la solution (loi de Noyes-Whitney : la vitesse est proportionnelle à la surface des cristaux
       et à l'écart entre la solubilité et la concentration) ; agiter (agitateur, récipient secoué) accélère beaucoup la
       dissolution. La solubilité dépend du solvant (le diiode est très peu soluble dans l'eau, très soluble dans
       l'éthanol). Une solution saturée ne dissout plus rien. Les cristaux non dissous sont dessinés au fond.
Reçoit : le contexte de la paillasse (ctx.ecoulement) ; chaque récipient peut porter r.agitation (0 à 1, donnée par l'agitateur).
Produit : de nouveaux solides dans Labo.LIQUIDES (sucre_cristaux, glucose_cristaux, diiode_cristaux) ; Labo.DISSOLUTION ;
          Labo.dissolution(ctx) ; Labo.dissous_g(contenu, solide) (masse dissoute, g) ; Labo.solide_g(contenu, solide).
Utilisé par : les simulations de chimie (solutions).
*/
(function (L) {
  const solide = (nom, d, rgb) => ({ nom, d, rgb, alpha: 0.97, classe: "solide" });
  Object.assign(L.LIQUIDES, {
    sucre_cristaux: solide("saccharose", 1.59, [250, 250, 246]),
    glucose_cristaux: solide("glucose", 1.54, [252, 252, 250]),
    diiode_cristaux: solide("diiode", 4.93, [62, 48, 74]),
  });
  // Espèce dissoute, quantité notée par gramme dissous (mol/g ; pour le diiode, unités de teinte de liquide_contenu.js),
  // solubilité (g/mL) dans chaque solvant, constante de vitesse K ; taille (mm) et nombre de cristaux dessinés (n × √masse).
  L.DISSOLUTION = {
    sucre_cristaux: { espece: "saccharose", par_g: 1 / 342, sol: { eau: 2.0, ethanol: 0.006 }, K: 0.09, grain: 1.5, n: 40 },
    glucose_cristaux: { espece: "glucose", par_g: 1 / 180, sol: { eau: 0.9, ethanol: 0.003 }, K: 0.3, grain: 1.4, n: 40 },
    diiode_cristaux: { espece: "I2", par_g: 6e4 / 254, sol: { eau: 0.0003, ethanol: 0.21 }, K: 5, grain: 2.4, n: 25 },
  };
  const D = L.DISSOLUTION;

  L.solide_g = (c, nom) => c.phases.reduce((s, p) => s + (p.liquides[nom] || 0), 0) * L.LIQUIDES[nom].d;
  L.dissous_g = (c, nom) => c.phases.reduce((s, p) => s + (p.dissous[D[nom].espece] || 0), 0) / D[nom].par_g;

  function agitation(r) {
    // Agitation du récipient : agitateur, récipient bouché secoué, ou récipient tenu que l'on fait tourner.
    const a = Math.hypot(r.acc.x, r.acc.y);
    return Math.max(r.agitation || 0, r.bouchon && a > 2500 ? 1 : 0, r.tenu && a > 400 ? 0.5 : 0);
  }

  function dissoudre(r, dt) {
    // Une partie de chaque solide passe dans la phase liquide ; vrai si quelque chose a changé.
    const liq = r.c.phases.find((p) => p.classe === "aqueuse"), sol = r.c.phases.find((p) => p.classe === "solide");
    if (!liq || !sol || liq.V < 0.05) return false;
    const ag = 0.04 + agitation(r);
    let change = false;
    for (const [nom, V] of Object.entries(sol.liquides)) {
      const d = D[nom];
      if (!d || V <= 0) continue;
      const m = V * L.LIQUIDES[nom].d, s = Object.entries(liq.liquides).reduce((t, [n, v]) => t + (v / liq.V) * (d.sol[n] || 0), 0);
      const c = (liq.dissous[d.espece] || 0) / d.par_g / liq.V;
      if (c >= s) continue;
      let dm = Math.min(m, d.K * ag * (Math.cbrt(m * m) + 0.02) * (s - c) * dt, (s - c) * liq.V);
      if (m - dm < 2e-5) dm = m;
      sol.liquides[nom] -= dm / L.LIQUIDES[nom].d; sol.V -= dm / L.LIQUIDES[nom].d;
      liq.dissous[d.espece] = (liq.dissous[d.espece] || 0) + dm * d.par_g; change = true;
    }
    if (sol.V < 1e-7) r.c.phases.splice(r.c.phases.indexOf(sol), 1);
    return change;
  }

  function hasard(k) {
    // Nombre pseudo-aléatoire fixe pour le grain k (les cristaux ne bougent pas d'une image à l'autre).
    const x = Math.sin(k * 127.1 + 311.7) * 43758.5453;
    return x - Math.floor(x);
  }

  function cristaux(l, r) {
    // Cristaux non dissous : au fond, ou en suspension dans le liquide quand on agite.
    const sol = r.c.phases.find((p) => p.classe === "solide"), liq = r.c.phases.find((p) => p.classe === "aqueuse");
    if (!sol) return;
    const pr = r.pr, ag = agitation(r), haut = liq ? pr.hauteur_de(r.c.volume()) - pr.h0 : 0;
    let k = 0;
    for (const [nom, V] of Object.entries(sol.liquides)) {
      const d = D[nom], m = V * L.LIQUIDES[nom].d, n = Math.min(90, Math.ceil(d.n * Math.sqrt(m) + (m > 1e-4 ? 3 : 0))), w = Math.min(pr.r(pr.h0) - 2, 5 + 12 * Math.sqrt(m));
      if (!d) continue;
      for (let i = 0; i < n; i++, k++) {
        // Au repos, un petit tas au milieu du fond ; en suspension, n'importe où dans le liquide.
        const suspendu = liq && hasard(k + 0.5) < ag * 0.8, u = hasard(k) * 2 - 1, t = d.grain * (0.6 + 0.6 * hasard(k + 0.7));
        const h = pr.h0 + (suspendu ? Math.random() * haut * 0.9 : 0.3 + hasard(k + 0.3) * (0.8 + 2.5 * Math.sqrt(m)) * (1 - Math.abs(u)));
        const x = suspendu ? (Math.random() * 2 - 1) * (pr.r(h) - 1.5) : u * w;
        L.svg("rect", { x: x - t / 2, y: -h - t / 2, width: t, height: t * 0.75, transform: `rotate(${hasard(k + 0.9) * 90} ${x} ${-h})`, fill: L.rgb(L.LIQUIDES[nom].rgb), stroke: "rgba(80,90,100,0.6)", "stroke-width": 0.12 }, l);
      }
    }
  }

  L.dissolution = function (ctx) {
    // À chaque pas : dissolution dans chaque récipient ; les récipients sont redessinés avec leurs cristaux.
    const E = ctx.ecoulement;
    const habiller = (r) => { if (r.cristaux) return; r.cristaux = true; r.dessiner = () => cristaux(L.dessiner_verrerie(r.g, r.pr, r.pose, r.etat()), r); };
    E.recipients.forEach(habiller);
    let attente = false, t = 0;
    E.sur_pas((dt) => {
      // Les missions sont prévenues au plus cinq fois par seconde (et une fois après le dernier changement).
      for (const r of E.recipients) {
        habiller(r);
        if (dissoudre(r, dt)) { attente = true; r.sig = null; }
        if (r.agitation) { r.agitation *= Math.exp(-dt / 0.3); if (r.agitation < 0.02) { r.agitation = 0; r.sig = null; } }
      }
      t += dt;
      if (attente && t > 0.2) { attente = false; t = 0; ctx.signaler?.(); }
    });
  };
})(window.Labo);
