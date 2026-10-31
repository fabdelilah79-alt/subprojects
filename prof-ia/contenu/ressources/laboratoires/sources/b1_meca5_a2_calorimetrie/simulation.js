/*
Rôle : simulation de l'activité 2 du chapitre « Énergie thermique, transfert thermique » (1re année du bac) :
       calorimétrie : capacité thermique d'un calorimètre (mélange d'eau froide et d'eau chaude), chaleur massique d'un
       métal (cylindre sorti de l'eau bouillante), chaleur latente de fusion de la glace. Objectifs O3, O4 et O5.
Reçoit : rien (les vérifications lisent les faits « calo_capacite », « calo_metal », « calo_glace »).
Produit : la simulation démarrée : trois paillasses de calorimétrie.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const CE = 4180, ME = 0.2, CC = 150;
  const der = (f, cle) => ((f[cle] || {}).essais || []).slice(-1)[0];
  const capacite = (f) => { const e = der(f, "calo_capacite"); return e ? (ME * CE * (e.theta2 - e.thetae) - ME * CE * (e.thetae - e.theta1)) / (e.thetae - e.theta1) : 0; };
  const c_metal = (f) => { const e = der(f, "calo_metal"); return e ? ((ME * CE + CC) * (e.thetae - e.theta1)) / (0.1 * (100 - e.thetae)) : 0; };
  const lf = (f) => { const e = der(f, "calo_glace"); if (!e) return 0; const m = e.m_glace / 1000; return ((ME * CE + CC) * (e.theta1 - e.thetae) - m * CE * e.thetae) / m; };
  const AGITER = "Faites monter et descendre l'agitateur ; « Recommencer » remet tout en place.";

  const CAPACITE = {
    id: "capacite", paillasse: 0, titre: "Capacité thermique du calorimètre",
    objectif: "Mélanger de l'eau chaude à l'eau froide d'un calorimètre ; écrire l'équilibre thermique et calculer la capacité thermique du calorimètre.",
    entetes: [],
    donnees: ["Eau froide (dans le calorimètre) : m1 = 200 g", "Eau chaude (bécher) : m2 = 200 g", "c(eau) = 4180 J·kg⁻¹·K⁻¹"],
    conclusion: "Quand des corps à des températures différentes sont mis en contact dans une enceinte isolée, ils échangent de la chaleur jusqu'à l'équilibre thermique : ils ont alors la même température θe, et la somme des chaleurs échangées est nulle : Q1 + Q2 + Qcal = 0. La capacité thermique du calorimètre (C, en J/K) est la chaleur qu'il reçoit quand sa température augmente de 1 °C : Qcal = C·(θe − θ1).",
    conclusion_courte: "Équilibre thermique : Σ Q = 0 ; Qcal = C·Δθ.",
    etapes: [
      { consigne: "Agitez et lisez θ1 (eau froide du calorimètre). Lisez θ2 (eau chaude), versez le bécher dans le calorimètre, agitez jusqu'à ce que la température ne change plus : lisez θe.", court: "Mélange eau froide + eau chaude.", aide_geste: AGITER, verifier: ({ faits }) => !!der(faits, "calo_capacite") },
      { consigne: "À l'équilibre thermique, l'eau froide, l'eau chaude et le calorimètre…", court: "Répondez dans le carnet.", question: choix(["ont la même température θe", "gardent chacun leur température", "sont à la température de la salle"], "Le thermomètre ne bouge plus.", "Exact.") },
      { consigne: "Le système {calorimètre, eau froide, eau chaude} n'échange pas de chaleur avec l'extérieur. On écrit donc…", court: "Répondez dans le carnet.", question: choix(["Q1 + Q2 + Qcal = 0", "Q1 = Q2", "Q1 + Q2 = Qcal"], "L'eau chaude cède de la chaleur (Q2 < 0) ; l'eau froide et le calorimètre en reçoivent.", "Exact : c'est l'équation calorimétrique.") },
      { consigne: "Calculez la capacité thermique C du calorimètre : m1·c·(θe − θ1) + m2·c·(θe − θ2) + C·(θe − θ1) = 0.", court: "C (J/K) ?", question: { type: "nombre", unite: "J/K", attendu: capacite, tolerance: 8, aide: "C = [m2·c·(θ2 − θe) − m1·c·(θe − θ1)] / (θe − θ1), masses en kg.", bravo: "Exact : environ 150 J/K." } },
    ],
  };

  const METAL = {
    id: "metal", paillasse: 1, titre: "Chaleur massique d'un métal",
    objectif: "Plonger un cylindre de métal chaud dans l'eau du calorimètre ; calculer la chaleur massique du métal et l'identifier.",
    entetes: [],
    donnees: ["Calorimètre : C = 150 J/K ; eau : 200 g", "Cylindre : m = 100,0 g, à 100 °C (eau bouillante)", "c (J·kg⁻¹·K⁻¹) : Al 900 ; Fe 450 ; Cu 385 ; Pb 129"],
    conclusion: "Le métal chaud cède de la chaleur à l'eau et au calorimètre jusqu'à l'équilibre : m·c·(θe − 100) + (m_eau·c_eau + C)·(θe − θ1) = 0. On en déduit la chaleur massique c du métal, qui permet de l'identifier. Le bilan ne dépend que des états initial et final.",
    conclusion_courte: "c = (m_eau·c_eau + C)(θe − θ1) / (m·(θ0 − θe)).",
    etapes: [
      { consigne: "Lisez θ1. Prenez le cylindre par son fil, plongez-le dans le calorimètre, agitez jusqu'à l'équilibre et lisez θe.", court: "Cylindre chaud dans l'eau.", aide_geste: AGITER, verifier: ({ faits }) => !!der(faits, "calo_metal") },
      { consigne: "Calculez la chaleur massique c du métal.", court: "c (J·kg⁻¹·K⁻¹) ?", question: { type: "nombre", unite: "J·kg⁻¹·K⁻¹", attendu: c_metal, tolerance_relative: 0.05, aide: "m·c·(100 − θe) = (0,200 × 4180 + 150) × (θe − θ1).", bravo: "Exact." } },
      { consigne: "Le cylindre est en…", court: "Répondez dans le carnet.", question: choix(["aluminium", "fer", "cuivre", "plomb"], "Comparez avec les valeurs données.", "Exact : c(Al) = 900 J·kg⁻¹·K⁻¹.") },
      { consigne: "Pour écrire le bilan calorimétrique, il suffit de connaître…", court: "Répondez dans le carnet.", question: choix(["l'état initial et l'état final de chaque corps", "la durée de l'expérience", "la vitesse d'agitation"], "Les échanges intermédiaires s'annulent dans la somme.", "Exact.") },
    ],
  };

  const GLACE = {
    id: "glace", paillasse: 2, titre: "Chaleur latente de fusion de la glace",
    objectif: "Faire fondre des glaçons dans l'eau tiède du calorimètre ; calculer la chaleur latente de fusion de la glace.",
    entetes: [],
    donnees: ["Calorimètre : C = 150 J/K ; eau : 200 g", "Glace fondante : 0 °C (glaçons essuyés)", "c(eau) = 4180 J·kg⁻¹·K⁻¹"],
    conclusion: "Un corps pur change d'état à température constante. La chaleur latente de fusion Lf (J/kg) est la chaleur qu'il faut fournir à 1 kg du corps solide, à sa température de fusion, pour le faire fondre : Q = m·Lf. Pour la glace, Lf ≈ 3,34×10⁵ J/kg. Bilan : m_g·Lf + m_g·c_eau·(θe − 0) + (m_eau·c_eau + C)·(θe − θ1) = 0.",
    conclusion_courte: "Q = m·Lf ; Lf(glace) ≈ 334 kJ/kg.",
    etapes: [
      { consigne: "Lisez θ1 et la masse de glace sur la balance. Videz la coupelle dans le calorimètre, agitez jusqu'à ce que toute la glace ait fondu et que la température ne change plus : lisez θe.", court: "Glaçons dans l'eau tiède.", aide_geste: AGITER, verifier: ({ faits }) => !!der(faits, "calo_glace") },
      { consigne: "Pendant sa fusion, la glace…", court: "Répondez dans le carnet.", question: choix(["reçoit de la chaleur sans que sa température change (0 °C)", "cède de la chaleur", "se réchauffe jusqu'à θe en restant solide"], "Un corps pur fond à température constante.", "Exact.") },
      { consigne: "Calculez la chaleur latente de fusion Lf de la glace.", court: "Lf (J/kg) ?", question: { type: "nombre", unite: "J/kg", attendu: lf, tolerance_relative: 0.05, aide: "m_g·Lf + m_g·c·θe + (0,200 × 4180 + 150)(θe − θ1) = 0, m_g en kg.", bravo: "Exact : environ 3,3×10⁵ J/kg." } },
      { consigne: "La chaleur latente de fusion s'exprime en…", court: "Répondez dans le carnet.", question: choix(["J/kg", "J·kg⁻¹·K⁻¹", "J/K"], "Q = m·Lf.", "Exact.") },
    ],
  };

  L.demarrer({ id: "b1_meca5_a2_calorimetrie", titre: "Laboratoire : calorimétrie", paillasses: [L.poste_calo_capacite, L.poste_calo_metal, L.poste_calo_glace], missions: [CAPACITE, METAL, GLACE] });
})(window.Labo);
