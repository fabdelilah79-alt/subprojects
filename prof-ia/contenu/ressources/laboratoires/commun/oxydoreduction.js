/*
Rôle : chimie d'oxydoréduction des simulations : solutions (sel de Mohr — ions fer II —, acide sulfurique, permanganate de
       potassium, diiode, thiosulfate de sodium, iodure de potassium, eau de Javel, acide ascorbique, empois d'amidon),
       réactions totales de transfert d'électrons (MnO₄⁻ + 5 Fe²⁺ + 8 H⁺ → Mn²⁺ + 5 Fe³⁺ + 4 H₂O ; I₂ + 2 S₂O₃²⁻ → 2 I⁻ + S₄O₆²⁻ ;
       ClO⁻ + 2 I⁻ + H₂O → I₂ + Cl⁻ + 2 HO⁻ ; I₂ + C₆H₈O₆ → 2 I⁻ + C₆H₆O₆ + 2 H⁺) et couleurs : l'ion permanganate est
       violet, et rose pâle quand il est très dilué (une goutte en excès se voit) ; le diiode est brun ; avec l'empois
       d'amidon, la moindre trace de diiode donne une teinte bleu-noir ; sans amidon, le diiode est brun, jaune pâle très dilué ; les ions fer III sont jaune pâle.
       L'ion H⁺ (ou H₃O⁺) est noté « H3O+ », comme dans acide_base.js.
Reçoit : le contenu des récipients (liquide_contenu.js) ; reactions_totales.js.
Produit : de nouvelles entrées dans Labo.LIQUIDES (ox_*) et Labo.TEINTES ; règles de couleur du permanganate et de l'amidon.
Utilisé par : les simulations d'oxydoréduction et de titrage.
*/
(function (L) {
  const aq = (nom, dissous, pH = null, rgb = [230, 240, 246], alpha = 0.3, autres = {}) => ({ nom, d: 1.0, rgb, alpha, classe: "aqueuse", pH, dissous, ...autres });
  Object.assign(L.LIQUIDES, {
    ox_mohr: aq("sel de Mohr (ions fer II)", { "Fe2+": 0.096, "SO4--": 0.192, "NH4+": 0.192 }, 5), ox_sulfurique: aq("acide sulfurique", { "H3O+": 2, "SO4--": 1 }),
    ox_permanganate: aq("permanganate de potassium", { "K+": 0.02, "MnO4-": 0.02 }), ox_diiode: aq("diiode", { I2: 0.0425, "I-": 0.1, "K+": 0.1 }),
    ox_thiosulfate: aq("thiosulfate de sodium", { "Na+": 0.2, "S2O3--": 0.1 }), ox_iodure: aq("iodure de potassium", { "K+": 0.1, "I-": 0.1 }),
    ox_javel: aq("eau de Javel diluée", { "Na+": 0.1, "ClO-": 0.05, "Cl-": 0.05 }, 11, [236, 242, 222], 0.34),
    ox_ascorbique: aq("acide ascorbique (vitamine C)", { C6H8O6: 0.05 }, 3), ox_amidon: aq("empois d'amidon", null, 7, [238, 238, 232], 0.55),
  });
  L.TEINTES["Fe3+"] ??= { aqueuse: [236, 214, 120], organique: [236, 214, 120] };
  L.TEINTES["Fe2+"] ??= { aqueuse: [168, 200, 150], organique: [168, 200, 150] };
  const R = (equation, reactifs, produits) => L.reaction({ equation, reactifs, produits });
  R("MnO₄⁻ + 5 Fe²⁺ + 8 H⁺ → Mn²⁺ + 5 Fe³⁺ + 4 H₂O", { "MnO4-": 1, "Fe2+": 5, "H3O+": 8 }, { "Mn2+": 1, "Fe3+": 5 });
  R("I₂ + 2 S₂O₃²⁻ → 2 I⁻ + S₄O₆²⁻", { I2: 1, "S2O3--": 2 }, { "I-": 2, "S4O6--": 1 });
  R("ClO⁻ + 2 I⁻ + H₂O → I₂ + Cl⁻ + 2 HO⁻", { "ClO-": 1, "I-": 2 }, { I2: 1, "Cl-": 1, "HO-": 2 });
  R("I₂ + C₆H₈O₆ → 2 I⁻ + C₆H₆O₆ + 2 H⁺", { I2: 1, C6H8O6: 1 }, { "I-": 2, C6H6O6: 1, "H3O+": 2 });

  const vers = (a, b, k) => a.map((v, i) => v + (b[i] - v) * Math.max(0, Math.min(1, k)));
  L.REGLES_COULEUR.push((ph, rgb, alpha) => {
    // Permanganate : rose très dilué, violet foncé concentré ; diiode : jaune à brun ; diiode et empois d'amidon : bleu-noir.
    const mn = L.concentration(ph, "MnO4-"), i2 = L.concentration(ph, "I2");
    if (mn > 1e-7) {
      const k = Math.min(0.95, 0.12 + 15000 * mn);
      rgb = vers(rgb, vers([232, 84, 184], [96, 10, 92], mn / 0.004), k); alpha = Math.max(alpha, 0.35 + 0.6 * k);
    }
    if (i2 > 1e-6 && !((ph.liquides.ox_amidon || 0) > 0)) {
      // Diiode en solution aqueuse : brun foncé concentré, jaune pâle très dilué (fin du titrage).
      const k = Math.min(0.9, 0.1 + 250 * i2);
      rgb = vers(rgb, vers([238, 206, 70], [150, 66, 10], i2 / 0.01), k); alpha = Math.max(alpha, 0.3 + 0.6 * k);
    }
    if ((ph.liquides.ox_amidon || 0) > 0 && i2 > 2e-6) {
      const k = Math.min(0.92, 4e4 * i2);
      rgb = vers(rgb, [28, 30, 86], k); alpha = Math.max(alpha, 0.35 + 0.6 * k);
    }
    return { rgb, alpha };
  });
})(window.Labo);
