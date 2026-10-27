/*
Rôle : chimie acide-base des simulations : solutions de la vie courante et du laboratoire (vinaigre dilué, déboucheur dilué,
       ammoniaque, acide chlorhydrique, soude), réactions totales de transfert de protons (H₃O⁺ + HO⁻ → 2 H₂O ;
       CH₃CO₂H + HO⁻ → CH₃CO₂⁻ + H₂O ; NH₃ + H₃O⁺ → NH₄⁺ + H₂O...), pH calculé à partir des espèces présentes, et couleurs
       des indicateurs : bleu de bromothymol (jaune / vert / bleu, zone de virage 6,0 – 7,6), hélianthine (rouge / jaune,
       3,1 – 4,4) ; la phénolphtaléine (chimie_reactions.js) suit ce pH.
Reçoit : le contenu des récipients (liquide_contenu.js) ; reactions_totales.js.
Produit : de nouvelles entrées dans Labo.LIQUIDES (ab_*) ; Labo.pH_phase complété (pH des espèces dissoutes) ;
          Labo.pH_especes(phase) (null s'il n'y a pas d'espèce acide ou basique) ; règles de couleur des indicateurs.
Utilisé par : les simulations d'acide-base et de titrage.
*/
(function (L) {
  const aq = (nom, dissous, pH = null, rgb = [230, 240, 246], alpha = 0.3) => ({ nom, d: 1.0, rgb, alpha, classe: "aqueuse", pH, dissous });
  Object.assign(L.LIQUIDES, {
    ab_vinaigre: aq("vinaigre dilué", { CH3CO2H: 0.08 }), ab_citron: aq("jus de citron", null, 2.4, [246, 238, 190], 0.45),
    ab_deboucheur: aq("déboucheur dilué", { "Na+": 0.1, "HO-": 0.1 }), ab_ammoniaque: aq("ammoniaque diluée", { NH3: 0.1 }),
    ab_hcl: aq("acide chlorhydrique", { "H3O+": 0.1, "Cl-": 0.1 }), ab_soude: aq("soude", { "Na+": 0.1, "HO-": 0.1 }),
    ab_bbt: aq("bleu de bromothymol", null, null, [70, 150, 90], 0.7), ab_helianthine: aq("hélianthine", null, null, [238, 140, 40], 0.7),
  });
  const R = (equation, reactifs, produits) => L.reaction({ equation, reactifs, produits });
  R("H₃O⁺ + HO⁻ → 2 H₂O", { "H3O+": 1, "HO-": 1 }, {});
  R("CH₃CO₂H + HO⁻ → CH₃CO₂⁻ + H₂O", { CH3CO2H: 1, "HO-": 1 }, { "CH3CO2-": 1 });
  R("NH₃ + H₃O⁺ → NH₄⁺ + H₂O", { NH3: 1, "H3O+": 1 }, { "NH4+": 1 });
  R("NH₄⁺ + HO⁻ → NH₃ + H₂O", { "NH4+": 1, "HO-": 1 }, { NH3: 1 });
  R("CH₃CO₂⁻ + H₃O⁺ → CH₃CO₂H + H₂O", { "CH3CO2-": 1, "H3O+": 1 }, { CH3CO2H: 1 });
  R("CH₃CO₂H + NH₃ → CH₃CO₂⁻ + NH₄⁺", { CH3CO2H: 1, NH3: 1 }, { "CH3CO2-": 1, "NH4+": 1 });
  const COUPLES = [["CH3CO2H", "CH3CO2-", 4.8], ["NH4+", "NH3", 9.2]];

  L.pH_especes = function (ph) {
    // Acide ou base forte en excès ; sinon couple faible (mélange acide + base : pKa + log(b/a)) ; sinon null.
    const c = (s) => L.concentration(ph, s), lg = Math.log10;
    if (c("H3O+") > 1e-6) return -lg(c("H3O+"));
    if (c("HO-") > 1e-6) return 14 + lg(c("HO-"));
    for (const [a, b, pKa] of COUPLES) {
      if (c(a) > 1e-7 && c(b) > 1e-7) return pKa + lg(c(b) / c(a));
      if (c(a) > 1e-7 && a === "CH3CO2H") return 0.5 * (pKa - lg(c(a)));
      if (c(b) > 1e-7 && b === "NH3") return 7 + 0.5 * (pKa + lg(c(b)));
    }
    if (c("CH3CO2-") > 1e-7 && !(c("NH4+") > 1e-7)) return 7 + 0.5 * (4.8 + lg(c("CH3CO2-")));
    if (c("NH4+") > 1e-7 && !(c("CH3CO2-") > 1e-7)) return 0.5 * (9.2 - lg(c("NH4+")));
    return ["Na+", "Cl-", "CH3CO2-", "NH4+"].some((s) => c(s) > 1e-7) ? 7 : null;
  };
  const avant = L.pH_phase;
  L.pH_phase = (ph) => L.pH_especes(ph) ?? avant(ph);

  const vers = (a, b, k) => a.map((v, i) => v + (b[i] - v) * Math.max(0, Math.min(1, k)));
  const INDICATEURS = [
    ["ab_bbt", (pH) => (pH < 6.8 ? vers([232, 196, 40], [70, 160, 80], (pH - 6) / 0.8) : vers([70, 160, 80], [36, 76, 196], (pH - 6.8) / 0.8))],
    ["ab_helianthine", (pH) => vers([214, 40, 48], [240, 172, 40], (pH - 3.1) / 1.3)],
  ];
  L.REGLES_COULEUR.push((ph, rgb, alpha) => {
    // Indicateur coloré : sa teinte (selon le pH) l'emporte d'autant plus qu'il y en a ; pH inconnu : eau (7).
    for (const [nom, teinte] of INDICATEURS) {
      const v = ph.liquides[nom] || 0;
      if (v <= 0) continue;
      const k = Math.min(0.85, 4.5 * Math.sqrt(v / ph.V));
      rgb = vers(rgb, teinte(L.pH_phase(ph) ?? 7), k); alpha = Math.max(alpha, 0.3 + 0.5 * k);
    }
    return { rgb, alpha };
  });
})(window.Labo);
