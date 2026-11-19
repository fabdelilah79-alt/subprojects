/*
Rôle : modèle thermique d'un vase (calorimètre ou gobelet) et de son contenu, sans dessin : le liquide principal et le vase
       (capacité thermique C) sont à la même température θ ; chaque corps ajouté (liquide versé, solide plongé) échange de
       la chaleur avec lui jusqu'à l'équilibre (échange conservatif : Σ Q = 0), plus vite si l'on agite ; la glace fond à
       0 °C en prenant Lf = 334 kJ/kg puis se mélange ; un chauffage électrique apporte P·dt ; pertes très lentes vers
       l'air (constante de temps réglable).
Reçoit : { C (J/K), pertes_s (constante de temps des pertes, s), ambiante (°C) } ; puis les ajouts et le temps qui passe.
Produit : Labo.vase_modele(reglage) -> v { m (g), c, theta, glace (g), corps, P (W), verser(m, c, theta, nom),
          plonger(m, c, theta, nom), ajouter_glace(m), agiter(), tic(dt), vider(theta), equilibre() }.
Utilisé par : vase_dessin.js et les simulations du chapitre « Énergie thermique, transfert thermique ».
*/
(function (L) {
  const LF = 334000, C_EAU = 4180, FONTE = 0.06;

  L.vase_modele = function ({ C = 0, pertes_s = 20000, ambiante = 20 } = {}) {
    // État du vase ; les masses sont en grammes, les capacités en J/K.
    const v = { C, m: 0, c: C_EAU, nom: null, theta: ambiante, glace: 0, corps: [], P: 0, agite: 0 };
    const K = () => (v.m / 1000) * v.c + v.C;
    v.verser = (m, c, theta, nom) => { if (!v.m && !v.corps.length) { v.m = m; v.c = c; v.nom = nom; v.theta = v.C ? (m * c * theta / 1000 + v.C * v.theta) / K() : theta; } else v.corps.push({ K: (m / 1000) * c, theta, tau: 1.5, liquide: { m, c, nom } }); };
    v.plonger = (m, c, theta, nom) => v.corps.push({ K: (m / 1000) * c, theta, tau: 7, nom });
    v.ajouter_glace = (m) => { v.glace += m; };
    v.agiter = () => { v.agite = 1.2; };
    v.vider = (theta = ambiante) => { Object.assign(v, { m: 0, nom: null, glace: 0, corps: [], theta }); };
    v.equilibre = () => !v.glace && v.corps.every((k) => Math.abs(k.theta - v.theta) < 0.05);

    function echanger(k, dt, f) {
      // Échange entre un corps et le liquide principal : la chaleur cédée par l'un est reçue par l'autre.
      const Kp = K(), q = ((k.K * Kp) / (k.K + Kp)) * (k.theta - v.theta) * (1 - Math.exp(-dt / (k.tau * f)));
      k.theta -= q / k.K;
      v.theta += q / Kp;
    }

    function fondre(dt, f) {
      // La glace (à 0 °C) fond en prenant Lf au liquide ; l'eau de fusion (à 0 °C) se mélange au liquide.
      const dm = Math.min(v.glace, (FONTE / f) * Math.max(0, v.theta) * dt);
      if (!dm) return;
      v.glace -= dm;
      v.theta -= ((dm / 1000) * LF) / K();
      v.theta = (K() * v.theta) / (K() + (dm / 1000) * C_EAU);
      v.m += dm;
    }

    v.tic = (dt) => {
      // Un pas de temps : chauffage, échanges, fusion, fusion des liquides à l'équilibre, pertes vers l'air.
      const f = v.agite > 0 ? 0.35 : 1;
      v.agite = Math.max(0, v.agite - dt);
      if (K() > 0) v.theta += (v.P * dt) / K();
      v.corps.forEach((k) => echanger(k, dt, f));
      v.corps = v.corps.filter((k) => { if (k.liquide && Math.abs(k.theta - v.theta) < 0.02) { v.m += k.liquide.m; return false; } return true; });
      fondre(dt, f);
      v.theta += ((ambiante - v.theta) * dt) / v.pertes;
    };
    v.pertes = pertes_s;
    return v;
  };
  L.vase_modele.LF = LF;
  L.vase_modele.C_EAU = C_EAU;
})(window.Labo);
