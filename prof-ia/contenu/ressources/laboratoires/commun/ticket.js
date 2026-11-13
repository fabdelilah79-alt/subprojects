/*
Rôle : ticket jaune du laboratoire en mode cours (le carnet est retiré) : il montre la consigne complète de l'étape
       en cours, l'astuce de geste et le message de vérification (ce qu'il faut corriger) ; un toucher le plie ou le déplie,
       un glissé le déplace (s'il cache du matériel).
       Les étapes « question » ne sont pas comptées : c'est le professeur IA qui les pose.
Reçoit : l'étage de la scène ; les annonces « missions » (Labo.missions.etat()).
Produit : Labo.ticket.creer(etage) : le ticket posé en haut à gauche de la scène, au-dessus du décor.
Utilisé par : demarrage.js (à la place du carnet et des pense-bêtes du mur, quand Labo.mode_prof est vrai).
*/
(function (L) {
  const tk = { element: null, contenu: null, plie: false, signature: "", pos: { x: 22, y: 46 } };

  function gestes(m) {
    // Les étapes de manipulation (sans les questions) et le rang de l'étape en cours parmi elles.
    const faites = m.etapes.slice(0, m.etape).filter((e) => !e.question).length;
    return { total: m.etapes.filter((e) => !e.question).length, rang: faites + 1 };
  }

  function fin(e, m) {
    // Mission accomplie : retour au cours, ou passage à la mission suivante (laboratoire complet).
    L.html("p", { class: "ticket-titre" }, tk.contenu, "Mission accomplie");
    L.html("p", { class: "ticket-texte" }, tk.contenu, "Revenez au cours : le professeur va exploiter vos mesures.");
    if (e.seule !== null || e.vue + 1 >= e.missions.length) return;
    const suite = L.html("button", { type: "button", class: "ticket-bouton" }, tk.contenu, "Mission suivante");
    suite.addEventListener("click", (ev) => { ev.stopPropagation(); L.missions.aller(e.vue + 1); });
  }

  function etape(e, m) {
    // Étape en cours : consigne, astuce de geste, message de vérification.
    const { total, rang } = gestes(m), en_cours = m.etapes[m.etape], message = e.messages[m.id];
    L.html("p", { class: "ticket-titre" }, tk.contenu, `${m.titre} · étape ${rang} sur ${total}`);
    L.ecrire_riche(L.html("p", { class: "ticket-texte" }, tk.contenu), en_cours.consigne);
    if (en_cours.aide_geste) L.ecrire_riche(L.html("p", { class: "ticket-astuce" }, tk.contenu), en_cours.aide_geste);
    if (message && !message.juste) L.ecrire_riche(L.html("p", { class: "ticket-message", role: "status" }, tk.contenu), message.texte);
  }

  function ecrire(e) {
    // Réécrit le ticket quand la mission affichée change d'étape ou reçoit un message.
    const m = e.missions[e.vue], message = e.messages[m.id];
    const signature = JSON.stringify([e.vue, m.etape, m.accomplie, message, tk.plie]);
    if (signature === tk.signature) return;
    tk.signature = signature;
    tk.contenu.replaceChildren();
    tk.element.classList.toggle("plie", tk.plie);
    if (m.accomplie) fin(e, m);
    else etape(e, m);
  }

  L.ticket = {
    creer(etage) {
      // Colle le ticket en haut à gauche de la scène ; un toucher le plie (pour voir dessous), un glissé le déplace.
      tk.element = L.html("section", { class: "ticket", "aria-label": "Consignes de l'expérience", "aria-live": "polite" }, etage);
      L.html("div", { class: "ticket-scotch" }, tk.element);
      tk.contenu = L.html("div", { class: "ticket-contenu" }, tk.element);
      L.glissable(tk.element, {
        debut: (e) => (e.target.closest("button") ? null : { ...tk.pos }),
        deplacer: (p) => {
          tk.pos = { x: Math.max(0, Math.min(760, p.x)), y: Math.max(24, Math.min(560, p.y)) };
          Object.assign(tk.element.style, { left: `${tk.pos.x}px`, top: `${tk.pos.y}px` });
        },
        toucher: () => { tk.plie = !tk.plie; ecrire(L.missions.etat()); },
      });
      L.ecouter("missions", ecrire);
    },
  };
})(window.Labo);
