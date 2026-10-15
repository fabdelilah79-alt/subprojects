/*
Rôle : moteur des missions du laboratoire : étape en cours, vérification automatique (gestes, tableur, courbe),
       questions du carnet, passage d'une paillasse à l'autre, messages envoyés à la page du professeur.
Reçoit : la définition des missions (titre, objectif, paillasse, entêtes du tableur, étapes) et le groupe caméra.
Produit : Labo.missions : demarrer(), noter(cle, valeur), repondre(valeur), aller(numero), etat() ;
         annonce « missions » à chaque changement ; postMessage { source: "laboratoire", type, ... } au parent.
Utilisé par : la page de chaque simulation, carnet.js, tablette.js.
*/
(function (L) {
  const etat = { labo: null, missions: [], courante: 0, vue: 0, faits: {}, courbes: {}, messages: {}, debut: {} };
  let camera = null;

  function prevenir_parent(type, donnees = {}) {
    // Envoie un événement à la page qui contient la simulation (journal de recherche).
    if (window.parent === window) return;
    window.parent.postMessage({ source: "laboratoire", laboratoire: etat.labo.id, type, ...donnees }, "*");
  }

  function mission(numero = etat.vue) { return etat.missions[numero]; }

  function contexte(m) {
    // Ce qu'une étape peut vérifier : les faits notés par la paillasse, la feuille et la courbe de la mission.
    return { faits: etat.faits, feuille: L.tablette.feuille(m.id), courbe: etat.courbes[m.id] || { n: 0 } };
  }

  function terminer_mission(m, numero) {
    // La dernière étape est réussie : la mission est accomplie, la suivante s'ouvre.
    m.accomplie = true;
    prevenir_parent("mission_terminee", { mission: m.id, duree_s: Math.round((performance.now() - etat.debut[m.id]) / 1000) });
    if (numero === etat.courante && numero + 1 < etat.missions.length) etat.courante = numero + 1;
    if (etat.missions.every((x) => x.accomplie)) prevenir_parent("laboratoire_termine");
  }

  function avancer(m, numero) {
    // Passe à l'étape suivante de la mission ; termine la mission après la dernière.
    prevenir_parent("etape_reussie", { mission: m.id, etape: m.etape + 1 });
    m.etape += 1;
    etat.messages[m.id] = null;
    if (m.etape >= m.etapes.length) terminer_mission(m, numero);
  }

  function verifier() {
    // Vérifie l'étape en cours de chaque mission ouverte, tant que les étapes automatiques sont réussies.
    etat.missions.forEach((m, numero) => {
      if (numero > etat.courante) return;
      while (!m.accomplie && m.etapes[m.etape].verifier) {
        const resultat = m.etapes[m.etape].verifier(contexte(m));
        if (resultat !== true) { etat.messages[m.id] = typeof resultat === "string" ? { texte: resultat, juste: false } : etat.messages[m.id]; break; }
        avancer(m, numero);
      }
    });
    L.annoncer("missions", L.missions.etat());
  }

  function deplacer_camera(numero) {
    // Glisse la vue jusqu'à la paillasse de la mission (on « marche » vers elle).
    const depart = Number(camera.dataset.x || 0), arrivee = -L.LARGEUR * mission(numero).paillasse;
    camera.dataset.x = arrivee;
    L.animer(0.9, (t) => {
      const k = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      camera.setAttribute("transform", `translate(${depart + (arrivee - depart) * k} 0)`);
    });
  }

  L.missions = {
    demarrer(labo, groupe_camera) {
      // Prépare les missions et place la vue sur la première paillasse.
      etat.labo = labo;
      camera = groupe_camera;
      etat.missions = labo.missions.map((m) => ({ ...m, etape: 0, accomplie: false }));
      etat.debut[etat.missions[0].id] = performance.now();
      L.ecouter("tableur", verifier);
      L.ecouter("courbe", (c) => { etat.courbes[mission().id] = c; verifier(); });
      prevenir_parent("laboratoire_ouvert");
      verifier();
    },
    noter(cle, valeur) {
      // Enregistre un fait observé sur une paillasse (masse accrochée, face posée...) puis revérifie.
      etat.faits[cle] = valeur;
      verifier();
    },
    repondre(valeur) {
      // Corrige la réponse donnée dans le carnet à la question de l'étape en cours.
      const m = mission();
      const q = m.etapes[m.etape]?.question;
      if (!q || m.accomplie) return;
      const attendu = typeof q.attendu === "function" ? q.attendu(etat.faits) : q.attendu;
      const tolerance = q.tolerance_relative ? q.tolerance_relative * Math.abs(attendu) : q.tolerance;
      const juste = q.type === "choix" ? valeur === q.bonne : L.proche(L.lire_nombre(valeur), attendu, tolerance);
      prevenir_parent("reponse", { mission: m.id, etape: m.etape + 1, reponse: String(valeur), juste });
      if (juste) avancer(m, etat.vue);
      etat.messages[m.id] = { texte: juste ? q.bravo || "Exact." : q.aide, juste };
      verifier();
    },
    aller(numero) {
      // Ouvre une mission déjà accessible et va à sa paillasse.
      if (numero > etat.courante) return;
      etat.vue = numero;
      etat.debut[mission(numero).id] ??= performance.now();
      deplacer_camera(numero);
      L.annoncer("missions", L.missions.etat());
    },
    etat() {
      // Résumé pour le carnet, la tablette et les pense-bêtes.
      return { missions: etat.missions, courante: etat.courante, vue: etat.vue, messages: etat.messages };
    },
  };
})(window.Labo);
