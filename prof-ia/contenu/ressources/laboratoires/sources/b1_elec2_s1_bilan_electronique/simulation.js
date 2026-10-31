/*
Rôle : simulation de la partie propre à la filière SM du chapitre « Transfert d'énergie dans un circuit électrique, puissance
       électrique » (1re année du bac) : bilan énergétique d'un circuit à transistor (puissances fournies par G1 et G2, reçues
       par RB, RC et le transistor), échauffement du transistor et rôle du radiateur ; rôle de l'alimentation d'un montage à
       AO (sans elle, rien n'est fourni à la charge ; bilan alimentation → charge + AO). Objectif O7.
Reçoit : rien (les vérifications lisent les faits des postes et la feuille).
Produit : la simulation démarrée.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const V = L.verif_bilan, choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const relatif = (unite, attendu, tol, aide, bravo) => ({ type: "nombre", unite, attendu, tolerance_relative: tol, aide, bravo });
  const BT = (f) => f.bilan_transistor || {}, TH = (f) => f.thermique || {}, BA = (f) => f.bilan_ao || {};

  const TRANSISTOR = {
    id: "transistor", paillasse: 0, titre: "Bilan énergétique d'un circuit à transistor",
    conclusion: "Les générateurs G1 et G2 fournissent de l'énergie ; RB, RC et le transistor en reçoivent. La puissance fournie (P = U·I pour chaque générateur) est égale à la somme des puissances reçues. Le transistor reçoit surtout de l'énergie par le circuit du collecteur (UCE·IC) ; l'énergie reçue par la base (UBE·IB) est très faible.",
    objectif: "Mesurer U et I pour chaque dipôle et faire le bilan des puissances.",
    entetes: ["U (V)", "I (mA)", "P (mW)"], donnees: ["Ligne 2 : G1 ; ligne 3 : RB ; ligne 4 : jonction B-E", "Ligne 5 : G2 ; ligne 6 : RC ; ligne 7 : C-E", "I = IB (lignes 2 à 4), IC (lignes 5 à 7) ; P = U·I"],
    conclusion_courte: "Puissance fournie = puissances reçues.",
    etapes: [
      { consigne: "Réglez G1 à 5,0 V et lisez IB (ampèremètre A1) et IC (ampèremètre A2).", court: "G1 = 5,0 V ; IB et IC.", verifier: ({ faits }) => (BT(faits).E1 === 5 && BT(faits).IB > 0 && BT(faits).IC > 0) || false },
      { consigne: "Le transistor fonctionne en régime…", court: "Répondez dans le carnet.", question: choix(["linéaire : IC ≈ β·IB, et UCE reste nettement supérieure à 0", "saturé", "bloqué"], "Comparez IC et IB.", "Exact.") },
      { consigne: "Branchez le voltmètre (calibre 20 V) aux bornes de chaque dipôle. Tableur : U en A, I en B, P = A·B en C, lignes 2 à 7.", court: "Tableur : U, I, P (6 dipôles).", aide_geste: "Tirez un fil depuis la borne VΩ (puis COM) du voltmètre jusqu'à une borne du dipôle.", verifier: V.tableau },
      { consigne: "Puissance fournie par les deux générateurs (mW) ?", court: "P fournie (mW) ?", question: relatif("mW", V.fournie, 0.02, "Additionnez les puissances de G1 et de G2.", "Exact.") },
      { consigne: "Puissance reçue par le transistor : P = UBE·IB + UCE·IC (mW) ?", court: "P du transistor (mW) ?", question: relatif("mW", V.transistor, 0.02, "Additionnez les lignes 4 et 7.", "Exact.") },
      { consigne: "Comparez la puissance fournie par les générateurs à la somme des puissances reçues par RB, RC et le transistor :", court: "Répondez dans le carnet.", question: choix(["elles sont égales : l'énergie fournie par les générateurs est reçue par les autres dipôles", "la puissance fournie est deux fois plus grande", "le transistor fournit lui aussi de l'énergie"], "Additionnez les lignes 3, 4, 6 et 7.", "Exact.") },
      { consigne: "Le transistor reçoit surtout de l'énergie…", court: "Répondez dans le carnet.", question: choix(["par le circuit du collecteur (UCE·IC) : la commande par la base (UBE·IB) demande très peu d'énergie", "par la base", "il n'en reçoit pas : il amplifie seulement"], "Comparez les lignes 4 et 7.", "Exact.") },
    ],
  };

  const CHALEUR = {
    id: "chaleur", paillasse: 0, titre: "Échauffement et refroidissement",
    conclusion: "L'énergie électrique reçue par le transistor est transférée en chaleur : sa température augmente (vers 65 °C sans radiateur). Le radiateur ne change pas la puissance reçue, mais il facilite le transfert thermique vers l'air : la température reste plus basse (vers 38 °C), ce qui protège le composant. Les composants qui dissipent beaucoup d'énergie sont munis de radiateurs ou de ventilateurs.",
    objectif: "Suivre la température du transistor, avec et sans radiateur.",
    entetes: [], donnees: ["Thermomètre : sonde sur le boîtier du transistor", "Température de la salle : 25 °C", "Radiateur en aluminium à clipser"],
    conclusion_courte: "Le transistor chauffe ; le radiateur le refroidit.",
    etapes: [
      { consigne: "G1 à 5,0 V : observez le thermomètre pendant une minute environ.", court: "Observez le thermomètre.", verifier: ({ faits }) => (!TH(faits).radiateur && TH(faits).T >= 55) || false },
      { consigne: "La température du transistor augmente, car…", court: "Répondez dans le carnet.", question: choix(["l'énergie électrique qu'il reçoit est transférée en chaleur", "le thermomètre chauffe tout seul", "le courant qui le traverse est trop faible"], "Pensez au bilan de la mission 1.", "Exact.") },
      { consigne: "Clipsez le radiateur sur le transistor (touchez-le) et attendez que la température baisse et se stabilise.", court: "Radiateur ; attendez.", verifier: ({ faits }) => (TH(faits).radiateur && TH(faits).T <= 45) || false },
      { consigne: "Avec le radiateur, le transistor est moins chaud, car…", court: "Répondez dans le carnet.", question: choix(["le radiateur facilite le transfert thermique vers l'air ; la puissance reçue ne change pas", "le radiateur diminue la puissance reçue par le transistor", "le radiateur produit du froid"], "IC et UCE ont-ils changé ?", "Exact.") },
      { consigne: "Le microprocesseur d'un ordinateur porte un radiateur et un ventilateur, parce que…", court: "Répondez dans le carnet.", question: choix(["il reçoit beaucoup d'énergie électrique transférée en chaleur : sans refroidissement, sa température deviendrait trop élevée", "il produit de l'énergie", "il doit rester froid pour calculer"], "Comme le transistor.", "Exact.") },
    ],
  };

  const ALIMENTATION = {
    id: "alimentation", paillasse: 1, titre: "Rôle de l'alimentation d'un AO",
    conclusion: "Sans alimentation, la sortie de l'AO reste à 0 V : la charge RL ne reçoit rien. Alimenté, l'AO amplifie (Us = 3,2·Ue). Le courant d'entrée de l'AO est presque nul : le générateur G ne fournit presque rien ; l'énergie reçue par la charge vient de l'alimentation ±15 V.",
    objectif: "Comparer le montage sans et avec alimentation.",
    entetes: [], donnees: ["Montage non inverseur : Us = (1 + R2/R1)·Ue", "R1 = 10 kΩ ; R2 = 22 kΩ ; RL = 1 kΩ", "Courant d'entrée de l'AO : presque nul"],
    conclusion_courte: "L'énergie reçue par la charge vient de l'alimentation.",
    etapes: [
      { consigne: "Réglez G à 2,5 V. Sans relier l'alimentation, branchez le voltmètre (20 V) entre la sortie s et le 0 : lisez Us.", court: "G = 2,5 V ; Us sans alimentation.", verifier: ({ faits }) => (BA(faits).E === 2.5 && BA(faits).us_sans !== null && Math.abs(BA(faits).us_sans) < 0.05) || false },
      { consigne: "Sans alimentation, Us est nulle :", court: "Répondez dans le carnet.", question: choix(["l'AO ne peut rien fournir à la charge RL sans alimentation", "le générateur G est en panne", "la résistance RL est coupée"], "Le générateur G est bien réglé à 2,5 V.", "Exact.") },
      { consigne: "Reliez l'alimentation : +15 V à la borne mA de A+, la borne COM de A− au −15 V, 0 V au 0 du montage.", court: "Reliez l'alimentation.", aide_geste: "Tirez un fil depuis chaque borne de l'alimentation.", verifier: ({ faits }) => BA(faits).alimente || false },
      { consigne: "Mesurez Ue (voltmètre entre e+ et 0) puis Us (entre s et 0).", court: "Ue et Us.", verifier: ({ faits }) => (BA(faits).alimente && BA(faits).E === 2.5 && BA(faits).ue > 0 && BA(faits).us > 0) || false },
      { consigne: "Rapport Us / Ue ?", court: "Us / Ue ?", question: relatif("", V.gain, 0.02, "Divisez les deux tensions.", "Exact : 1 + R2/R1 ≈ 3,2.") },
      { consigne: "Le courant d'entrée de l'AO étant presque nul, le générateur G fournit…", court: "Répondez dans le carnet.", question: choix(["une puissance presque nulle : l'énergie reçue par RL vient de l'alimentation", "toute l'énergie reçue par RL", "la moitié de l'énergie reçue par RL"], "P = Ue·I, avec I presque nul.", "Exact.") },
    ],
  };

  const BILAN_AO = {
    id: "bilan_ao", paillasse: 1, titre: "Bilan énergétique du montage à AO",
    conclusion: "L'alimentation fournit P = 15·I+ + 15·I− (≈ 175 mW). La charge RL en reçoit Us²/RL (≈ 64 mW), les résistances R1 et R2 environ 2 mW ; le reste (≈ 109 mW) est reçu par l'AO et transféré en chaleur. Une partie (le courant de repos) est consommée même sans charge.",
    objectif: "Mesurer les courants de l'alimentation et faire le bilan des puissances.",
    entetes: [], donnees: ["P alimentation = 15·I+ + 15·I−", "P charge = Us² / RL ; RL = 1 kΩ (V² / kΩ = mW)", "P(R1 + R2) = Us² / (R1 + R2) ≈ 2 mW"],
    conclusion_courte: "Alimentation → charge + AO (chaleur).",
    etapes: [
      { consigne: "Lisez I+ (ampèremètre A+) et I− (ampèremètre A−).", court: "I+ et I−.", verifier: ({ faits }) => (BA(faits).alimente && BA(faits).E === 2.5 && BA(faits).ip > 0 && BA(faits).im > 0) || false },
      { consigne: "Puissance fournie par l'alimentation P = 15·I+ + 15·I− (mW) ?", court: "P alimentation (mW) ?", question: relatif("mW", V.alim, 0.02, "I en mA donne P en mW.", "Exact.") },
      { consigne: "Puissance reçue par la charge P = Us² / RL (mW) ?", court: "P charge (mW) ?", question: relatif("mW", V.charge, 0.03, "RL = 1 kΩ.", "Exact.") },
      { consigne: "Puissance reçue par l'AO (mW) : P alimentation − P charge − P(R1 + R2) ?", court: "P de l'AO (mW) ?", question: relatif("mW", V.ao, 0.05, "P(R1 + R2) ≈ 2 mW.", "Exact.") },
      { consigne: "L'énergie reçue par l'AO…", court: "Répondez dans le carnet.", question: choix(["est transférée en chaleur : l'AO chauffe ; les AO de puissance portent un radiateur", "est stockée dans l'AO", "retourne au générateur G"], "Comme pour le transistor.", "Exact.") },
      { consigne: "Dans un montage électronique, l'alimentation…", court: "Répondez dans le carnet.", question: choix(["fournit l'énergie reçue par la charge et par les composants ; le signal d'entrée ne fait que commander", "ne sert qu'à allumer un voyant", "fournit le signal d'entrée"], "Résumez les deux missions.", "Exact.") },
    ],
  };

  L.demarrer({ id: "b1_elec2_s1_bilan_electronique", titre: "Laboratoire : bilan énergétique d'un circuit électronique", paillasses: [L.poste_bilan_transistor, L.poste_bilan_ao], missions: [TRANSISTOR, CHALEUR, ALIMENTATION, BILAN_AO] });
})(window.Labo);
