/*
Rôle : relevé des mesures d'une mission pour le professeur IA (mode cours) : faits notés par la paillasse,
       tableau de la tablette (valeurs et formules de l'élève), courbe (points, modèle, équation) et figure (SVG autonome) ;
       bouton « Envoyer au professeur » sur la tablette.
Reçoit : la mission ; la feuille et la courbe de la tablette (Labo.tablette).
Produit : Labo.releve(mission) -> { mission, titre, faits, tableau, courbe, figure } (données JSON, sans objet de la page) ;
          Labo.releve.bouton() : ajoute le bouton à la barre de la tablette.
Utilisé par : missions.js (message « releve » en fin de mission), demarrage.js (bouton, en mode cours).
*/
(function (L) {
  const LIMITE_TEXTE = 12000, LIMITE_LISTE = 60;
  const STYLES = ["fill", "stroke", "stroke-width", "stroke-dasharray", "opacity", "font-family", "font-size", "font-weight", "text-anchor"];

  function propre(valeur, profondeur = 0) {
    // Copie JSON d'un fait : nombres à 4 chiffres significatifs, listes et profondeur limitées, ni fonction ni élément.
    if (typeof valeur === "number") return Number.isFinite(valeur) ? Number(valeur.toPrecision(4)) : null;
    if (valeur === null || ["string", "boolean"].includes(typeof valeur)) return valeur;
    if (typeof valeur !== "object" || profondeur > 4 || valeur instanceof Node) return undefined;
    if (Array.isArray(valeur)) return valeur.slice(0, LIMITE_LISTE).map((v) => propre(v, profondeur + 1) ?? null);
    const copie = {};
    for (const [cle, v] of Object.entries(valeur)) { const p = propre(v, profondeur + 1); if (p !== undefined) copie[cle] = p; }
    return copie;
  }

  function faits() {
    // Les faits notés par les paillasses, réduits si le texte est trop long.
    const tous = propre(L.missions.faits?.() || {});
    return JSON.stringify(tous).length <= LIMITE_TEXTE ? tous : { note: "relevé réduit", cles: Object.keys(tous) };
  }

  function tableau(feuille) {
    // Les entêtes et les lignes remplies de la feuille : valeur calculée et, s'il y en a, formule de l'élève.
    const entetes = Object.fromEntries([...L.Tableur.LETTRES].map((c) => [c, feuille.entete(c)]));
    const lignes = [], formules = {};
    for (let n = 2; n <= feuille.nb_lignes; n++) {
      const ligne = {};
      for (const c of [...L.Tableur.LETTRES]) {
        const brut = (feuille.brut[c + n] || "").trim();
        if (!brut) continue;
        ligne[c] = feuille.valeur_sure(c + n) ?? brut;
        if (brut.startsWith("=")) formules[c + n] = brut;
      }
      if (Object.keys(ligne).length) lignes.push({ ligne: n, ...propre(ligne) });
    }
    return { entetes, lignes, formules };
  }

  function figure(conteneur) {
    // Le graphique de la tablette en SVG autonome (styles recopiés), ou null s'il n'y a pas de point.
    const original = conteneur.querySelector("svg");
    if (!original || !original.querySelector(".courbe-point")) return null;
    const copie = original.cloneNode(true), sources = original.querySelectorAll("*"), cibles = copie.querySelectorAll("*");
    sources.forEach((el, i) => {
      const style = getComputedStyle(el);
      cibles[i].setAttribute("style", STYLES.map((p) => `${p}:${style.getPropertyValue(p)}`).join(";"));
      cibles[i].removeAttribute("class");
    });
    copie.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    return new XMLSerializer().serializeToString(copie);
  }

  function courbe() {
    // Ce que l'élève a tracé : grandeurs choisies, points, modèle et équation affichée.
    const c = L.tablette.courbe();
    if (!c) return null;
    c.dessiner(false);
    const f = L.tablette.feuille(), e = c.etat;
    if (!e.n) return null;
    const points = f.lignes([e.x, e.y]).map((l) => [l[e.x], l[e.y]]);
    return propre({ abscisse: f.entete(e.x), ordonnee: f.entete(e.y), seconde: e.y2 ? f.entete(e.y2) : null, points,
      modele: e.modele, a: e.a, b: e.b, equation: c.equation.textContent || null });
  }

  L.releve = function (m) {
    // Relevé complet de la mission m ; en cas de problème, un relevé réduit (la fin de mission ne doit jamais bloquer).
    try {
      const c = courbe();
      return { mission: m.id, titre: m.titre, faits: faits(), tableau: tableau(L.tablette.feuille(m.id)),
        courbe: c, figure: c ? figure(L.tablette.page_courbe()) : null };
    } catch (erreur) {
      return { mission: m.id, titre: m.titre, erreur: String(erreur.message || erreur) };
    }
  };

  L.releve.bouton = function () {
    // Bouton de la tablette : l'élève envoie lui-même ses mesures et sa figure au professeur.
    const barre = document.querySelector(".tablette-statut");
    const b = L.html("button", { type: "button", class: "tablette-envoyer" }, barre, "Envoyer au professeur");
    b.addEventListener("click", () => {
      L.missions.envoyer_releve();
      b.textContent = "Envoyé";
      setTimeout(() => { b.textContent = "Envoyer au professeur"; }, 2500);
    });
  };
})(window.Labo);
