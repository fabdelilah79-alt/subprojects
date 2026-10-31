/*
Rôle : missions « Franck et Hertz » (paillasse 1) et « spectres d'émission » (paillasse 2) de l'activité 2 du chapitre
       « L'atome et la mécanique de Newton », avec leurs vérifications (tableaux des maximums et des énergies des photons).
Reçoit : les faits notés par les postes (« franck_hertz », « acquisition_fh », « tubes », « vus_tubes ») et la feuille.
Produit : Labo.MISSIONS_SPECTRES = [FRANCK_HERTZ, TUBES] ; Labo.questions_spectres = { choix, nombre, relatif }.
Utilisé par : simulation.js.
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const nombre = (unite, attendu, tolerance, aide, bravo) => ({ type: "nombre", unite, attendu, tolerance, aide, bravo });
  const relatif = (unite, attendu, tol, aide, bravo) => ({ type: "nombre", unite, attendu, tolerance_relative: tol, aide, bravo });
  const FH = (f) => f.franck_hertz || {}, AC = (f) => f.acquisition_fh?.courbes || [], VUS = (f) => f.vus_tubes || [];
  const proche = (a, b, t) => b !== null && Math.abs(a - b) <= t * Math.abs(a);

  function maximums({ faits, feuille }) {
    // A : rang k du maximum ; B : U2 (V) de ce maximum sur une courbe enregistrée à 170 °C au moins (à 0,3 V près) ; quatre lignes.
    const v = (c, n) => feuille.valeur_sure(`${c}${n}`), chaudes = AC(faits).filter((c) => c.theta >= 170 && c.maximums.length);
    let lignes = 0;
    for (let n = 2; n <= 12; n++) {
      if (v("A", n) === null) continue;
      const k = v("A", n);
      if (!Number.isInteger(k) || k < 1 || k > 5) return `Ligne ${n} : en A, le rang du maximum (1, 2, 3…).`;
      if (!chaudes.some((c) => c.maximums[k - 1] !== undefined && Math.abs(c.maximums[k - 1] - v("B", n)) <= 0.3)) return `Ligne ${n} : en B, la tension U2 (V) du maximum n° ${k}, lue au curseur sur une courbe enregistrée à 180 °C.`;
      lignes++;
    }
    return lignes >= 4 || false;
  }

  function photons({ feuille }) {
    // A : λ (nm) d'une raie de l'hydrogène (à 3 nm près) ; B : ν = c/λ ; C : E = h·ν (J) ; D : E (eV) ; les quatre raies.
    const v = (c, n) => feuille.valeur_sure(`${c}${n}`), vues = new Set();
    for (let n = 2; n <= 12; n++) {
      if (v("A", n) === null) continue;
      const l = v("A", n), raie = L.SPECTRES.hydrogene.raies.find(([x]) => Math.abs(x - l) <= 3);
      if (!raie) return `Ligne ${n} : en A, la longueur d'onde (nm) d'une raie de l'hydrogène, lue sur l'échelle du spectroscope.`;
      if (!proche(3e8 / (l * 1e-9), v("B", n), 0.01)) return `Ligne ${n} : en B, ν = c / λ, λ en mètres : =3E8/(A${n}*1E-9).`;
      if (!proche(6.63e-34 * v("B", n), v("C", n), 0.01)) return `Ligne ${n} : en C, E = h·ν : =6,63E-34*B${n}.`;
      if (!proche(v("C", n) / 1.6e-19, v("D", n), 0.01)) return `Ligne ${n} : en D, E en eV : =C${n}/1,6E-19.`;
      vues.add(raie[0]);
    }
    return vues.size >= 4 || (vues.size ? "Les quatre raies visibles de l'hydrogène." : false);
  }

  const FRANCK_HERTZ = {
    id: "franck_hertz", paillasse: 0, titre: "Chocs entre électrons et atomes de mercure",
    conclusion: "Dans l'expérience de Franck et Hertz, des électrons de même énergie cinétique traversent une vapeur de mercure. Le courant IA chute chaque fois que la tension accélératrice augmente de 4,9 V : un électron ne peut céder à un atome de mercure qu'une énergie bien déterminée, 4,9 eV (7,8 × 10⁻¹⁹ J). L'énergie de l'atome est quantifiée. C'est aussi l'énergie h·ν des photons de la raie ultraviolette du mercure (253,7 nm) : l'atome échange l'énergie par quanta, avec les électrons comme avec la lumière.",
    objectif: "Enregistrer IA en fonction de U2, mesurer l'écart entre deux maximums, interpréter.",
    entetes: ["k (rang)", "U2 max (V)"],
    donnees: ["Four à 180 °C : vapeur de mercure", "1 eV = 1,60 × 10⁻¹⁹ J ; h = 6,63 × 10⁻³⁴ J·s", "Énergie d'un électron accéléré sous U : e·U"],
    conclusion_courte: "Un atome de mercure ne reçoit que 4,9 eV : son énergie est quantifiée.",
    etapes: [
      { consigne: "Mettez l'appareil en marche, réglez la consigne du four à 180 °C et attendez que le four atteigne au moins 175 °C.", court: "Four à 180 °C.", aide_geste: "Interrupteur I / O, puis bouton « ϑ consigne » (ou touches +).", verifier: ({ faits }) => (FH(faits).allume && FH(faits).theta >= 175) || false },
      { consigne: "Mode MAN : tournez lentement le bouton U2 de 0 à 30 V en regardant l'afficheur IA.", court: "Tournez U2 de 0 à 30 V.", aide_geste: "Glissez le doigt vers le haut sur le bouton U2.", verifier: ({ faits }) => (FH(faits).U2max_man >= 28) || false },
      { consigne: "Quand U2 augmente, le courant IA…", court: "Répondez dans le carnet.", question: choix(["augmente, puis chute, plusieurs fois, à intervalles réguliers", "augmente régulièrement", "diminue régulièrement"], "Regardez l'afficheur IA en tournant lentement U2.", "Exact.") },
      { consigne: "Passez en mode RAMPE, puis touchez « Acquérir » dans le logiciel.", court: "RAMPE, puis « Acquérir ».", verifier: ({ faits }) => (faits.acquisition_fh?.etat === "terminée" && AC(faits).some((c) => c.theta >= 170)) || false },
      { consigne: "Placez le curseur sur chaque maximum ; tableur : rang k en A (1, 2, 3…), U2 du maximum en B (au moins quatre maximums).", court: "Tableur : k, U2 des maximums.", aide_geste: "Glissez le doigt sur le graphique : le curseur vert suit.", verifier: maximums },
      { consigne: "Tracez B en fonction de A, modèle y = a·x + b.", court: "Courbe U2 max = f(k).", verifier: ({ courbe: c }) => (c.x === "A" && c.y === "B" && c.n >= 4 && c.modele === "affine") || "Abscisse : A ; ordonnée : B ; modèle y = a·x + b." },
      { consigne: "Le coefficient directeur est l'écart ΔU entre deux maximums voisins. ΔU (V) ?", court: "ΔU (V) ?", question: nombre("V", 4.9, 0.15, "Lisez a dans l'équation de la droite.", "Exact : ΔU ≈ 4,9 V.") },
      { consigne: "À chaque chute de IA, des électrons ont cédé à des atomes de mercure…", court: "Répondez dans le carnet.", question: choix(["une énergie bien déterminée : e·ΔU ≈ 4,9 eV", "n'importe quelle quantité d'énergie", "toute leur énergie cinétique, quelle qu'elle soit"], "Les chutes sont régulièrement espacées.", "Exact : l'atome de mercure ne peut recevoir que 4,9 eV.") },
      { consigne: "Cette énergie de 4,9 eV, en joules ?", court: "4,9 eV en J ?", question: relatif("J", 4.9 * 1.6e-19, 0.04, "1 eV = 1,60 × 10⁻¹⁹ J.", "Exact : 7,8 × 10⁻¹⁹ J.") },
      { consigne: "Réglez la consigne à 140 °C ; quand le four y est, refaites une acquisition et comparez les deux courbes.", court: "Acquisition à 140 °C.", verifier: ({ faits }) => { const c = AC(faits).slice(-1)[0]; return (c && c.theta >= 130 && c.theta <= 150 && faits.acquisition_fh.etat === "terminée") || false; } },
      { consigne: "À 140 °C, les chutes de IA sont moins marquées, car…", court: "Répondez dans le carnet.", question: choix(["la vapeur de mercure est moins dense : il y a moins de chocs", "les électrons vont moins vite", "les niveaux d'énergie du mercure ont changé"], "Pourquoi chauffe-t-on le tube ?", "Exact : le mercure, liquide à froid, ne se vaporise qu'en partie.") },
      { consigne: "Énergie (eV) d'un photon de la raie ultraviolette du mercure (λ = 253,7 nm) : E = h·c / λ ?", court: "E du photon (eV) ?", question: nombre("eV", (6.63e-34 * 3e8) / 253.7e-9 / 1.6e-19, 0.1, "E = h·c/λ en J, puis divisez par 1,60 × 10⁻¹⁹.", "Exact : 4,9 eV, comme dans l'expérience de Franck et Hertz.") },
      { consigne: "Conclusion : l'atome de mercure…", court: "Répondez dans le carnet.", question: choix(["n'échange que des quantités d'énergie déterminées : son énergie est quantifiée", "peut absorber n'importe quelle énergie", "n'échange pas d'énergie avec les électrons"], "Électrons et photons donnent le même quantum.", "Exact.") },
    ],
  };

  const TUBES = {
    id: "tubes", paillasse: 1, titre: "Spectres de raies des gaz",
    conclusion: "Un gaz excité par une décharge électrique émet un spectre de raies : quelques radiations de longueurs d'onde bien précises. Chaque raie correspond à des photons d'énergie E = h·ν = h·c/λ, égale à la différence entre deux niveaux d'énergie de l'atome (raie rouge de l'hydrogène : E3 − E2 = 1,89 eV). L'énergie de l'atome est quantifiée. Chaque élément a son propre spectre, qui permet de l'identifier.",
    objectif: "Observer le spectre de l'hydrogène, calculer l'énergie des photons, interpréter ; reconnaître un gaz par son spectre.",
    entetes: ["λ (nm)", "ν (Hz)", "E (J)", "E (eV)"],
    donnees: ["h = 6,63 × 10⁻³⁴ J·s ; c = 3,00 × 10⁸ m/s", "1 eV = 1,60 × 10⁻¹⁹ J ; 1 nm = 10⁻⁹ m", "Hydrogène : En = −13,6 / n² eV"],
    conclusion_courte: "Spectre de raies : photons d'énergie h·ν = Ep − En.",
    etapes: [
      { consigne: "Le tube d'hydrogène est en place : mettez la haute tension, puis regardez dans le spectroscope (touchez l'oculaire).", court: "Hydrogène au spectroscope.", verifier: ({ faits }) => VUS(faits).includes("H₂") || false },
      { consigne: "La lumière émise par l'hydrogène donne…", court: "Répondez dans le carnet.", question: choix(["un spectre de raies : quelques radiations bien précises", "un spectre continu", "une seule radiation"], "Combien de raies voyez-vous ?", "Exact : quatre raies visibles.") },
      { consigne: "Tableur : λ (nm) des quatre raies en A, ν = c/λ (Hz) en B, E = h·ν (J) en C, E (eV) en D.", court: "Tableur : λ, ν, E (J), E (eV).", aide_geste: "Lisez chaque raie sur l'échelle graduée (à 2 nm près).", verifier: photons },
      { consigne: "Énergie (eV) d'un photon de la raie rouge ?", court: "E raie rouge (eV) ?", question: nombre("eV", 1.89, 0.04, "Colonne D, ligne de la raie à 656 nm.", "Exact : 1,89 eV.") },
      { consigne: "La raie rouge correspond au passage de l'atome…", court: "Répondez dans le carnet.", question: choix(["du niveau n = 3 au niveau n = 2 (E3 − E2 = 1,89 eV)", "du niveau n = 2 au niveau n = 1", "du niveau n = 4 au niveau n = 3"], "Lisez le document des niveaux d'énergie.", "Exact.") },
      { consigne: "La raie bleu-vert (486 nm, 2,55 eV) correspond au passage…", court: "Répondez dans le carnet.", question: choix(["du niveau n = 4 au niveau n = 2", "du niveau n = 3 au niveau n = 2", "du niveau n = 5 au niveau n = 2"], "E4 − E2 = ?", "Exact : −0,85 − (−3,40) = 2,55 eV.") },
      { consigne: "Le spectre de l'hydrogène est un spectre de raies parce que…", court: "Répondez dans le carnet.", question: choix(["l'énergie de l'atome est quantifiée : il n'émet que des photons d'énergie Ep − En", "le tube filtre les autres couleurs", "le spectroscope est mal réglé"], "Reliez raies et niveaux.", "Exact.") },
      { consigne: "Coupez la haute tension, changez de tube : observez les spectres de l'hélium, du mercure et du néon.", court: "He, Hg, Ne au spectroscope.", aide_geste: "Touchez un tube du coffret : il prend la place du tube monté.", verifier: ({ faits }) => ["He", "Hg", "Ne"].every((t) => VUS(faits).includes(t)) || false },
      { consigne: "Chaque élément chimique…", court: "Répondez dans le carnet.", question: choix(["émet un spectre de raies qui lui est propre : on peut le reconnaître", "émet les mêmes raies que l'hydrogène", "émet un spectre continu"], "Comparez les quatre spectres.", "Exact : le spectre est la « signature » de l'élément.") },
      { consigne: "Le tube X n'a pas d'étiquette : observez son spectre.", court: "Tube X au spectroscope.", verifier: ({ faits }) => VUS(faits).includes("X") || false },
      { consigne: "Le tube X contient…", court: "Répondez dans le carnet.", question: choix(["de l'hélium", "de l'hydrogène", "du mercure", "du néon"], "Cherchez le spectre qui a les mêmes raies.", "Exact : on reconnaît la raie jaune intense à 588 nm de l'hélium.") },
    ],
  };

  L.MISSIONS_SPECTRES = [FRANCK_HERTZ, TUBES];
  L.questions_spectres = { choix, nombre, relatif };
})(window.Labo);
