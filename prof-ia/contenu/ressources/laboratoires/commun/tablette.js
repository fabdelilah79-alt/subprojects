/*
Rôle : tablette numérique posée sur la paillasse : un toucher la prend en main (elle se redresse en 3D),
       le bouton rond la repose ; on la déplace par son bord. Deux applications : Tableur et Graphique.
Reçoit : l'étage de la scène, les missions (une feuille de calcul par mission), où elle est posée.
Produit : Labo.tablette : creer(), feuille(id), lever(), poser().
Utilisé par : la page de chaque simulation, missions.js (feuille de la mission).
*/
(function (L) {
  const TAILLE = { l: 640, h: 420 };
  const t = { element: null, levee: false, pos: { x: 370, y: 90 }, repos: { x: 922, y: 576 }, feuilles: {}, pages: {} };

  function appliquer() {
    // Place la tablette : redressée à sa position, ou couchée sur la paillasse (perspective).
    t.element.style.left = `${t.pos.x}px`;
    t.element.style.top = `${t.pos.y}px`;
    t.element.classList.toggle("posee", !t.levee);
    if (t.levee) { t.element.style.transform = "none"; return; }
    const dx = t.repos.x - t.pos.x - TAILLE.l / 2, dy = t.repos.y - t.pos.y - TAILLE.h;
    t.element.style.transform = `translate(${dx}px, ${dy}px) perspective(700px) rotateX(62deg) scale(0.27)`;
  }

  function changer_application(nom) {
    // Montre le Tableur ou le Graphique.
    for (const [id, page] of Object.entries(t.pages)) page.hidden = id !== nom;
    for (const onglet of t.element.querySelectorAll(".tablette-onglet")) {
      onglet.setAttribute("aria-pressed", String(onglet.dataset.app === nom));
    }
    if (nom === "courbe") t.courbe.dessiner(true);
  }

  function barre_etat(ecran) {
    // Barre du haut : les deux applications et l'heure.
    const barre = L.html("div", { class: "tablette-statut" }, ecran);
    for (const [app, nom] of [["tableur", "Tableur"], ["courbe", "Graphique"]]) {
      const onglet = L.html("button", { type: "button", class: "tablette-onglet", "data-app": app }, barre, nom);
      onglet.addEventListener("click", () => changer_application(app));
    }
    const heure = L.html("span", { class: "tablette-heure" }, barre);
    const montrer = () => { heure.textContent = new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }); };
    montrer();
    setInterval(montrer, 30000);
  }

  function rendre_mobile(cadre) {
    // Le bord de la tablette levée sert de poignée ; toucher la tablette couchée la prend en main.
    L.glissable(cadre, {
      debut: (e) => (t.levee && e.target === cadre ? { ...t.pos } : (!t.levee ? { ...t.pos } : null)),
      saisir: () => cadre.parentNode.parentNode.append(cadre.parentNode),
      deplacer: (p) => { if (t.levee) { t.pos = { x: Math.max(-300, Math.min(700, p.x)), y: Math.max(-200, Math.min(420, p.y)) }; appliquer(); } },
      toucher: () => { if (!t.levee) L.tablette.lever(); },
    });
  }

  function construire(etage) {
    // Construit la tablette : cadre noir, écran, bouton rond pour la poser.
    t.element = L.html("div", { class: "tablette", role: "region", "aria-label": "Tablette : tableur et graphique" }, etage);
    const cadre = L.html("div", { class: "tablette-cadre" }, t.element);
    const ecran = L.html("div", { class: "tablette-ecran" }, cadre);
    barre_etat(ecran);
    t.pages.tableur = L.html("div", { class: "tablette-app" }, ecran);
    t.pages.courbe = L.html("div", { class: "tablette-app" }, ecran);
    t.courbe = new L.Courbe(t.pages.courbe, () => L.tablette.feuille());
    const poser = L.html("button", { type: "button", class: "tablette-poser", "aria-label": "Poser la tablette" }, cadre);
    poser.addEventListener("click", () => L.tablette.poser());
    rendre_mobile(cadre);
  }

  L.tablette = {
    creer(etage, missions, repos = null) {
      // Crée la tablette et une feuille de calcul par mission.
      if (repos) t.repos = repos;
      t.vue = missions[0].id;
      construire(etage);
      for (const m of missions) {
        const page = L.html("div", { class: "tableur-feuille", hidden: "" }, t.pages.tableur);
        t.feuilles[m.id] = { page, feuille: new L.Tableur(page, { entetes: m.entetes || [] }) };
      }
      L.ecouter("missions", (e) => {
        const id = e.missions[e.vue].id;
        for (const [cle, f] of Object.entries(t.feuilles)) f.page.hidden = cle !== id;
        t.vue = id;
      });
      changer_application("tableur");
      appliquer();
    },
    feuille(id = t.vue) {
      // Feuille de calcul d'une mission (par défaut celle de la mission affichée).
      return t.feuilles[id].feuille;
    },
    lever() {
      // Prend la tablette en main.
      t.levee = true;
      t.element.parentNode.append(t.element);
      appliquer();
      L.annoncer("tablette", { levee: true });
    },
    poser() {
      // Repose la tablette sur la paillasse.
      t.levee = false;
      if (document.activeElement && t.element.contains(document.activeElement)) document.activeElement.blur();
      appliquer();
      L.annoncer("tablette", { levee: false });
    },
  };
})(window.Labo);
