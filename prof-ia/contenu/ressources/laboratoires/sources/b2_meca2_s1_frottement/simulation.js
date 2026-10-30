/*
Rôle : simulation de la partie « Chute verticale avec frottement » du chapitre « Applications des lois de Newton » (2e année du bac,
       filières PC, SMA, SMB) : chute d'une balle dans l'eau filmée et pointée ; v = f(t), régime initial et régime permanent,
       vitesse limite, temps caractéristique (tangente à l'origine et asymptote) ; influence de la masse et du liquide ; modèle
       de la force de frottement (F = k·v² dans l'eau) ; méthode d'Euler au tableur et importance du pas. Objectif O5.
Reçoit : rien (les vérifications sont dans verifications_frottement.js).
Produit : la simulation démarrée.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const V = L.verif_frottement, { choix, nombre, relatif } = V;
  const eau40 = (c) => c.liquide === "eau" && c.balle === "b40" && c.fps === 10, vl = (f, l, b) => (f.chutes_fluide || []).find((c) => c.liquide === l && c.balle === b)?.vlim;

  const VITESSE = {
    id: "vitesse", paillasse: 0, titre: "Vitesse limite et temps caractéristique",
    conclusion: "Lâchée sans vitesse dans l'eau, la balle accélère (régime initial), puis sa vitesse tend vers une vitesse limite vlim (régime permanent : mouvement rectiligne uniforme). La force de frottement du liquide augmente avec la vitesse jusqu'à compenser le poids diminué de la poussée d'Archimède. Le temps caractéristique τ est l'abscisse du point où la tangente à l'origine de v = f(t) coupe l'asymptote v = vlim (environ 0,43 s pour la balle de 40 g).",
    objectif: "Filmer la chute de la balle de 40 g dans l'eau, tracer v = f(t), lire vlim et τ.",
    entetes: ["t (s)", "x (m)", "y (m)", "v (m/s)"],
    donnees: ["Caméra : 10 images par seconde (Δt = 0,1 s)", "v(ti) = |y(ti−1) − y(ti+1)| / (2Δt)", "τ : la tangente à l'origine coupe l'asymptote v = vlim"],
    conclusion_courte: "Régime initial puis permanent ; vlim ; τ par la tangente à l'origine.",
    etapes: [
      { consigne: "Balle de 40 g dans la colonne d'eau, caméra à 10 images/s : lâchez-la.", court: "Lâchez la balle de 40 g dans l'eau.", aide_geste: "Touchez la balle de 40 g, puis la colonne d'eau, puis « Lâcher ».", verifier: ({ faits }) => V.chute(faits, eau40) || false },
      { consigne: "Logiciel : étalonnez sur la règle (0 et 100 cm), placez l'origine, pointez la balle sur les 11 premières images, puis « Exporter ».", court: "Pointez 11 images, exportez.", verifier: ({ faits }) => V.pointee(faits, 11) || false },
      { consigne: "Tableur : en D, la vitesse v (m/s) de la ligne 3 à la ligne 11 : =(C2-C4)/(A4-A2), puis recopiez vers le bas.", court: "Tableur : v en D.", verifier: V.vitesses },
      { consigne: "Tracez v (D) en fonction de t (A).", court: "Courbe v = f(t).", verifier: ({ courbe: c }) => (c.x === "A" && c.y === "D" && c.n >= 7) || "Abscisse : A ; ordonnée : D." },
      { consigne: "Au cours de la chute, la vitesse de la balle…", court: "Répondez dans le carnet.", question: choix(["augmente, puis tend vers une valeur limite", "augmente sans cesse", "est constante dès le départ"], "Regardez la forme de la courbe.", "Exact.") },
      { consigne: "Vitesse limite vlim (m/s) ?", court: "vlim (m/s) ?", question: relatif("m/s", (f) => vl(f, "eau", "b40") ?? 0.48, 0.08, "Valeur vers laquelle tend v (derniers points).", "Exact : environ 0,48 m/s.") },
      { consigne: "Temps caractéristique τ (s) : tracez la tangente à l'origine (pente ≈ v(0,1 s) / 0,1 s) ; τ est l'abscisse de son intersection avec la droite v = vlim.", court: "τ (s) ?", question: relatif("s", 0.43, 0.25, "τ = vlim / (pente de la tangente à l'origine).", "Exact : τ ≈ 0,43 s.") },
      { consigne: "On distingue deux régimes…", court: "Répondez dans le carnet.", question: choix(["le régime initial (v augmente) et le régime permanent (v = vlim, mouvement uniforme)", "le régime libre et le régime forcé", "un seul régime : v augmente toujours"], "Avant et après environ 3τ.", "Exact.") },
      { consigne: "La vitesse tend vers une limite parce que…", court: "Répondez dans le carnet.", question: choix(["le frottement du liquide augmente avec v jusqu'à compenser le poids diminué de la poussée d'Archimède", "le poids de la balle diminue", "la poussée d'Archimède augmente avec la vitesse"], "En régime permanent, ΣF = 0.", "Exact.") },
    ],
  };

  const MODELE = {
    id: "modele", paillasse: 0, titre: "Masse, liquide et modèle du frottement",
    conclusion: "La vitesse limite augmente avec la masse de la balle. Dans l'eau, (P − Π)/vlim² a la même valeur pour les trois balles : la force de frottement est de la forme F = k·v² (k ≈ 0,28 kg/m). Dans la glycérine, très visqueuse, la balle de 40 g flotte (elle est moins dense que le liquide) et la balle de 60 g atteint presque aussitôt une vitesse limite bien plus petite (0,21 m/s) ; à faible vitesse, le frottement d'un liquide visqueux est plutôt de la forme F = k·v.",
    objectif: "Mesurer vlim pour trois masses dans l'eau ; choisir le modèle du frottement ; comparer avec la glycérine.",
    entetes: ["m (kg)", "vlim (m/s)", "P − Π (N)", "(P − Π)/vlim²"],
    donnees: ["Volume d'une balle : V = 3,35 × 10⁻⁵ m³ ; ρ(eau) = 1 000 kg/m³", "Régime permanent : P − Π = F (mouvement uniforme)", "vlim = distance / durée entre deux images éloignées"],
    conclusion_courte: "Dans l'eau, F = k·v² ; vlim augmente avec m.",
    etapes: [
      { consigne: "Lâchez la balle de 50 g, puis celle de 60 g dans l'eau ; pour chacune, pointez deux images éloignées vers la fin de la chute et calculez vlim = distance / durée.", court: "Balles de 50 g et 60 g dans l'eau.", verifier: ({ faits }) => (V.chute(faits, (c) => c.liquide === "eau" && c.balle === "b50") && V.chute(faits, (c) => c.liquide === "eau" && c.balle === "b60")) || false },
      { consigne: "Tableur : m (kg) en A, vlim en B, P − Π = (m − 1000·V)·g en C, (P − Π)/vlim² en D, pour les trois balles.", court: "Tableur : m, vlim, P − Π, (P − Π)/vlim².", verifier: V.modele },
      { consigne: "Quand la masse de la balle augmente, la vitesse limite…", court: "Répondez dans le carnet.", question: choix(["augmente", "diminue", "ne change pas"], "Colonne B.", "Exact.") },
      { consigne: "(P − Π)/vlim² a presque la même valeur pour les trois balles. Dans l'eau, la force de frottement est donc…", court: "Répondez dans le carnet.", question: choix(["proportionnelle à v² : F = k·v²", "proportionnelle à v : F = k·v", "constante"], "En régime permanent, F = P − Π.", "Exact.") },
      { consigne: "Valeur de k (kg/m) ?", court: "k (kg/m) ?", question: relatif("kg/m", 0.277, 0.08, "Moyenne de la colonne D.", "Exact : k ≈ 0,28 kg/m.") },
      { consigne: "Placez la balle de 40 g dans la colonne de glycérine et lâchez-la.", court: "40 g dans la glycérine.", verifier: ({ faits }) => V.chute(faits, (c) => c.liquide === "glycerine" && c.balle === "b40") || false },
      { consigne: "La balle de 40 g reste à la surface de la glycérine, car…", court: "Répondez dans le carnet.", question: choix(["elle est moins dense que la glycérine : la poussée d'Archimède est plus grande que son poids", "la glycérine est trop visqueuse", "elle est trop légère pour tomber"], "Masse volumique de la balle : 40 g / 33,5 cm³ ; glycérine : 1,26 g/cm³.", "Exact : 1,19 g/cm³ < 1,26 g/cm³.") },
      { consigne: "Lâchez la balle de 60 g dans la glycérine, caméra à 2 images/s ; mesurez sa vitesse limite avec deux images éloignées.", court: "60 g dans la glycérine.", aide_geste: "Touchez l'afficheur de la caméra pour passer à 2 im/s.", verifier: ({ faits }) => V.chute(faits, (c) => c.liquide === "glycerine" && c.balle === "b60" && c.fps === 2) || false },
      { consigne: "Vitesse limite de la balle de 60 g dans la glycérine (m/s) ?", court: "vlim (m/s) ?", question: relatif("m/s", (f) => vl(f, "glycerine", "b60") ?? 0.206, 0.08, "Distance entre deux images / durée.", "Exact : environ 0,21 m/s, quatre fois et demie moins que dans l'eau.") },
      { consigne: "Dans la glycérine, beaucoup plus visqueuse que l'eau…", court: "Répondez dans le carnet.", question: choix(["la vitesse limite est bien plus petite et elle est atteinte presque aussitôt", "la vitesse limite est plus grande", "il n'y a pas de vitesse limite"], "Comparez les deux chutes de la balle de 60 g.", "Exact : τ ≈ 0,1 s.") },
    ],
  };

  const EULER = {
    id: "euler", paillasse: 0, titre: "Méthode d'Euler",
    conclusion: "La deuxième loi de Newton donne l'équation différentielle dv/dt = A − B·v² (modèle F = k·v²), avec A l'accélération initiale et B = A/vlim². La méthode d'Euler la résout pas à pas : a(t) = A − B·v(t)², puis v(t + Δt) = v(t) + a(t)·Δt. Avec un pas petit devant τ (Δt = 0,1 s), la solution approchée suit les mesures ; avec un pas trop grand (0,5 s), elle s'en écarte et oscille : le pas doit être choisi petit devant le temps caractéristique.",
    objectif: "Résoudre l'équation différentielle de la chute par la méthode d'Euler ; discuter le pas de calcul.",
    entetes: ["t (s)", "v (m/s)", "a (m/s²)", "v mesurée (m/s)"],
    donnees: ["dv/dt = A − B·v² ; A = vlim / τ ; B = A / vlim²", "a(t) = A − B·v(t)²", "v(t + Δt) = v(t) + a(t)·Δt ; v(0) = 0"],
    conclusion_courte: "Euler : v(t + Δt) = v(t) + a(t)·Δt ; pas petit devant τ.",
    etapes: [
      { consigne: "D'après la mission 1, constante A = vlim / τ (m/s²) ?", court: "A (m/s²) ?", question: relatif("m/s²", (f) => V.eau40(f).a0, 0.3, "A est la pente de la tangente à l'origine de v = f(t).", "Exact : A ≈ 1,1 m/s².") },
      { consigne: "Constante B = A / vlim² (m⁻¹) ?", court: "B (m⁻¹) ?", question: relatif("m⁻¹", (f) => V.eau40(f).a0 / V.eau40(f).vlim ** 2, 0.35, "Avec vlim ≈ 0,48 m/s.", "Exact : B ≈ 4,9 m⁻¹.") },
      { consigne: "Tableur, pas Δt = 0,1 s : t en A (0 ; 0,1 ; 0,2…), v en B (0 à la ligne 2, puis =B2+C2*0,1), a = A − B·v² en C (vos valeurs de A et B), sur 9 lignes au moins ; recopiez vers le bas.", court: "Euler, pas de 0,1 s.", verifier: V.euler(0.1) },
      { consigne: "Recopiez en D la vitesse mesurée à la mission 1 (mêmes instants), puis tracez B et D en fonction de A.", court: "Courbes Euler et mesures.", verifier: ({ courbe: c }) => (c.x === "A" && c.y === "B" && c.n >= 8) || "Abscisse : A ; ordonnée : B (et D en deuxième série)." },
      { consigne: "Avec un pas de 0,1 s, la solution d'Euler…", court: "Répondez dans le carnet.", question: choix(["est proche des mesures : le modèle F = k·v² convient", "s'éloigne beaucoup des mesures", "n'atteint jamais de vitesse limite"], "Comparez les deux courbes.", "Exact.") },
      { consigne: "Refaites le calcul avec un pas Δt = 0,5 s (A : 0 ; 0,5 ; 1… ; =B2+C2*0,5).", court: "Euler, pas de 0,5 s.", verifier: V.euler(0.5) },
      { consigne: "Avec un pas trop grand…", court: "Répondez dans le carnet.", question: choix(["la solution approchée s'écarte de la solution exacte et oscille : il faut un pas petit devant τ", "la solution est plus précise", "rien ne change"], "Comparez les deux tableaux.", "Exact.") },
    ],
  };

  L.demarrer({ id: "b2_meca2_s1_frottement", titre: "Laboratoire : chute verticale avec frottement", paillasses: [L.poste_frottement], missions: [VITESSE, MODELE, EULER] });
})(window.Labo);
