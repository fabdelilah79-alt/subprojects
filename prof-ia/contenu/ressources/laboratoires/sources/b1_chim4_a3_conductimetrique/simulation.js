/*
Rôle : simulation de l'activité 3 du chapitre « Titrages » (1re année du bac) : titrage conductimétrique d'un déboucheur
       (solution d'hydroxyde de sodium diluée 50 fois ; 10,0 mL + 140 mL d'eau distillée) par l'acide chlorhydrique à
       0,100 mol/L : réaction support H₃O⁺ + HO⁻ → 2 H₂O, mesures σ = f(V), équivalence à l'intersection des deux droites
       (VE = 8,45 mL), concentration du déboucheur, chiffres significatifs. Objectifs O2, O5, O6.
Reçoit : rien (les vérifications lisent le fait « titrage », la feuille du tableur et la courbe).
Produit : la simulation démarrée.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const nombre = (unite, attendu, tolerance, aide, bravo) => ({ type: "nombre", unite, attendu, tolerance, aide, bravo });
  L.LIQUIDES.tit_deboucheur = { nom: "déboucheur dilué 50 fois", d: 1.0, rgb: [230, 240, 246], alpha: 0.3, classe: "aqueuse", pH: null, dissous: { "Na+": 0.0845, "HO-": 0.0845 } };
  const t = (f) => f.titrage || {}, me = (f) => t(f).mesures || [];

  function poste(g) {
    // Burette d'acide chlorhydrique, bécher du déboucheur dilué, agitateur, conductimètre ; mesures notées quand l'affichage est stable.
    const p = L.poste_titrage(g, { titrant: "ab_hcl", texte: "HCl 0,100 mol/L", becher: { id: "becher", contenu: { tit_deboucheur: 10, eau: 140 }, etiquette: "déboucheur + eau" }, conductimetre: true, places: [250, 335] });
    const mesures = [];
    setInterval(() => {
      const b = p.burette.etat(), c = p.conductimetre.etat(), sur = p.sur_plateau(), agite = !!sur && p.agitateur.agite(sur), s = Number(c.affiche.replace(",", "."));
      if (b.robinet === "ferme" && c.plonge && agite && c.stable && sur === p.becher) {
        const der = mesures[mesures.length - 1];
        if (der && Math.abs(der.V - b.verse) < 0.02) der.s = s; else mesures.push({ V: b.verse, s });
      }
      L.missions.noter("titrage", { ...b, vitesse: p.agitateur.vitesse(), sur: sur && sur.id, plonge: c.plonge, sigma: s, mesures: mesures.map((m) => ({ ...m })) });
    }, 300);
    return { pense_bete: p.pense_bete };
  }

  function tableau({ faits, feuille }) {
    // Lignes (V, σ) lues sur la burette et le conductimètre : au moins 10 volumes, jusqu'à 14 mL ou plus.
    const l = feuille.lignes(["A", "B"]);
    if (l.length < 10) return false;
    for (const [k, x] of l.entries()) if (!me(faits).some((m) => Math.abs(m.V - x.A) <= 0.06 && Math.abs(m.s - x.B) <= 0.01 * m.s + 0.003)) return `Ligne ${k + 2} : V (mL) lu sur la burette (bas du ménisque, à la loupe) et σ (mS/cm) lue quand l'affichage est stable.`;
    return Math.max(...l.map((x) => x.A)) >= 14 || "Continuez au-delà de l'équivalence, jusqu'à 14 mL au moins.";
  }

  const MONTAGE = {
    id: "montage", paillasse: 0, titre: "Le montage du titrage",
    objectif: "Installer le bécher sur l'agitateur magnétique, plonger la sonde du conductimètre ; identifier la réaction support.",
    entetes: [],
    donnees: ["Bécher : 10,0 mL de déboucheur dilué 50 fois (pipette jaugée) + 140 mL d'eau distillée ; barreau aimanté au fond", "Burette : acide chlorhydrique, [H₃O⁺] = [Cl⁻] = 0,100 mol/L ; elle est remplie et ajustée au zéro", "Lunettes et gants : le déboucheur est corrosif"],
    conclusion: "La réaction support du titrage est la réaction acide-base totale H₃O⁺ + HO⁻ → 2 H₂O : chaque ion H₃O⁺ versé cède un proton à un ion HO⁻. L'agitation rend la solution homogène ; l'eau ajoutée immerge la sonde et rend la dilution due à l'acide versé presque négligeable.",
    conclusion_courte: "Réaction support : H₃O⁺ + HO⁻ → 2 H₂O.",
    etapes: [
      { consigne: "Posez le bécher sur l'agitateur, mettez l'agitation en marche (bouton), puis faites descendre la sonde du conductimètre dans la solution.", court: "Bécher, agitation, sonde.", aide_geste: "Faites glisser le bécher sur le plateau blanc ; touchez le bouton de l'agitateur ; faites glisser la sonde vers le bas.", verifier: ({ faits }) => t(faits).sur === "becher" && t(faits).vitesse > 0 && t(faits).plonge },
      { consigne: "La réaction support de ce titrage est…", court: "Répondez dans le carnet.", question: choix(["H₃O⁺ + HO⁻ → 2 H₂O", "Na⁺ + Cl⁻ → NaCl", "H₂O + HO⁻ → H₃O⁺"], "Quels ions réagissent ? Na⁺ et Cl⁻ sont spectateurs.", "Exact : un transfert de proton de H₃O⁺ vers HO⁻.") },
      { consigne: "On ajoute 140 mL d'eau distillée au déboucheur parce que…", court: "Répondez dans le carnet.", question: choix(["la sonde doit être immergée, et la dilution par l'acide versé devient presque négligeable", "l'eau réagit avec la soude", "cela change la quantité d'ions HO⁻ à titrer"], "n(HO⁻) ne change pas quand on ajoute de l'eau.", "Exact.") },
    ],
  };

  const MESURES = {
    id: "mesures", paillasse: 0, titre: "La courbe σ = f(V)",
    objectif: "Verser l'acide par petites portions et mesurer la conductivité ; tracer σ = f(V).",
    entetes: ["V (mL)", "σ (mS/cm)"],
    conclusion: "Avant l'équivalence, σ diminue : les ions HO⁻, très conducteurs, sont remplacés par des ions Cl⁻, moins conducteurs (λ(HO⁻) = 19,9 contre λ(Cl⁻) = 7,6 mS·m²/mol). Après l'équivalence, σ augmente : les ions H₃O⁺ et Cl⁻ versés s'accumulent sans réagir, et H₃O⁺ est l'ion le plus conducteur. La courbe est formée de deux droites.",
    conclusion_courte: "Deux droites ; minimum à l'équivalence.",
    etapes: [
      { consigne: "Versez l'acide par portions d'environ 1,5 mL, de 0 à 15 mL (11 mesures). À chaque fois : fermez le robinet, attendez que l'affichage soit stable, lisez V sur la burette et σ. Tableur : en A, V (mL) ; en B, σ (mS/cm).", court: "Tableur : A, B.", aide_geste: "Touchez la clé du robinet : goutte à goutte ou fermé ; glissez-la vers le haut pour un filet. Lisez le bas du ménisque dans la loupe, à côté de la burette.", verifier: tableau },
      { consigne: "Tracez σ (B) en fonction de V (A).", court: "Courbe σ = f(V).", verifier: ({ courbe }) => (courbe.x === "A" && courbe.y === "B" && courbe.n >= 10) || "Abscisse : A (V) ; ordonnée : B (σ)." },
      { consigne: "Avant l'équivalence, σ diminue parce que…", court: "Répondez dans le carnet.", question: choix(["les ions HO⁻ sont remplacés par des ions Cl⁻, moins conducteurs", "on dilue la solution", "les ions Na⁺ disparaissent"], "Comparez λ(HO⁻) et λ(Cl⁻) ; Na⁺ est spectateur.", "Exact.") },
      { consigne: "Après l'équivalence, σ augmente parce que…", court: "Répondez dans le carnet.", question: choix(["les ions H₃O⁺ et Cl⁻ versés ne réagissent plus et s'accumulent", "les ions HO⁻ se reforment", "la température monte"], "Il n'y a plus d'ions HO⁻ pour réagir.", "Exact : H₃O⁺ est l'ion le plus conducteur.") },
    ],
  };

  const EQUIVALENCE = {
    id: "equivalence", paillasse: 0, titre: "L'équivalence",
    objectif: "Repérer l'équivalence sur la courbe, en déduire la concentration du déboucheur ; précision du résultat.",
    entetes: [],
    donnees: ["Volume titré : Vb = 10,0 mL ; acide : Ca = 0,100 mol/L", "Le déboucheur a été dilué 50 fois"],
    conclusion: "À l'équivalence, les réactifs ont été introduits dans les proportions stœchiométriques : n(HO⁻) initiale = n(H₃O⁺) versée, soit Cb·Vb = Ca·VE. Avec VE ≈ 8,45 mL : Cb ≈ 8,45 × 10⁻² mol/L ; le déboucheur commercial contient environ 4,2 mol/L d'hydroxyde de sodium. Le résultat n'a pas plus de chiffres significatifs que la donnée la moins précise (trois).",
    conclusion_courte: "Cb·Vb = Ca·VE ; Cb ≈ 0,0845 mol/L.",
    etapes: [
      { consigne: "Volume équivalent VE (mL), à l'intersection des deux droites ?", court: "VE (mL) ?", question: nombre("mL", 8.45, 0.3, "Tracez à la règle les deux droites (avant et après le minimum) ; VE est l'abscisse de leur point commun.", "Exact.") },
      { consigne: "À l'équivalence…", court: "Répondez dans le carnet.", question: choix(["les réactifs ont été introduits dans les proportions stœchiométriques : n(HO⁻) initiale = n(H₃O⁺) versée", "la solution est neutre parce que σ = 0", "tous les ions ont disparu"], "Pensez au tableau d'avancement : les deux réactifs sont épuisés.", "Exact.") },
      { consigne: "Concentration Cb du déboucheur dilué (mol/L) ?", court: "Cb (mol/L) ?", question: nombre("mol/L", 0.0845, 0.003, "Cb = Ca × VE / Vb.", "Exact.") },
      { consigne: "Concentration du déboucheur commercial (mol/L) ?", court: "C₀ (mol/L) ?", question: nombre("mol/L", 4.22, 0.15, "Il a été dilué 50 fois.", "Exact : environ 4,2 mol/L.") },
      { consigne: "Le résultat Cb s'écrit avec…", court: "Répondez dans le carnet.", question: choix(["trois chiffres significatifs, comme les données (10,0 mL ; 0,100 mol/L ; 8,45 mL)", "autant de chiffres que la calculatrice en affiche", "un seul chiffre"], "Le résultat n'est pas plus précis que la donnée la moins précise.", "Exact : Cb = 8,45 × 10⁻² mol/L.") },
    ],
  };

  L.demarrer({ id: "b1_chim4_a3_conductimetrique", titre: "Laboratoire : titrage conductimétrique", paillasses: [poste], missions: [MONTAGE, MESURES, EQUIVALENCE] });
})(window.Labo);
