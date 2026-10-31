/*
Rôle : paillasse « loi de Boyle-Mariotte » : seringue de 60 mL reliée au pressiomètre par un tuyau court ; robinet à
       trois voies (ouvert : l'air entre ou sort, la pression reste celle de l'air, 1013 hPa ; fermé : la quantité d'air
       enfermée ne change plus) ; on fait glisser le poussoir (le joint frotte : le piston reste où on le lâche). La
       température reste celle de la salle (20 °C) : P = n R T / V. Le pressiomètre mesure jusqu'à 2 500 hPa.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_boyle(g) -> { pense_bete } ; fait « boyle » = { ouvert, V, P, nRT (hPa·mL), mesures: [{ V, P }] }.
Utilisé par : simulation.js.
*/
(function (L) {
  const PATM = 1013, S = () => L.SERINGUE;

  L.poste_boyle = function (g) {
    // Décor, pressiomètre, seringue, robinet, poussoir saisissable ; mesures notées au lâcher (robinet fermé).
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230), e = { V: 40, ouvert: true, nRT: PATM * 40, mesures: [] };
    const capteur = L.pressiometre(L.svg("g", {}, g), { x: 110, y: 400 });
    const gs = L.svg("g", { "pointer-events": "none" }, g), gr = L.svg("g", { class: "robinet", role: "button", "aria-label": "Robinet à trois voies" }, g), gp = L.svg("g", { class: "poussoir", role: "slider", "aria-label": "Poussoir de la seringue" }, g);
    const P = () => (e.ouvert ? PATM : e.nRT / e.V);
    const dessiner = () => {
      // Seringue, robinet, zone de saisie du poussoir, affichage.
      L.seringue_gaz(gs, { V: e.V, embout: capteur.embout }); L.robinet_seringue(gr, e.ouvert);
      gp.replaceChildren(); const p = S().px(e.V);
      L.svg("rect", { x: p + 20, y: S().Y - 40, width: S().K * 60 + 40, height: 80, fill: "#fff", opacity: 0.01 }, gp);
      capteur.afficher(P());
    };
    const regler = (V) => {
      // Volume au mL près, entre 5 et 60 mL ; robinet fermé : le piston ne va pas au-delà de 2 500 hPa (trop dur à pousser).
      const Vmin = e.ouvert ? 5 : Math.max(5, e.nRT / 2500);
      e.V = Math.max(Math.ceil(Vmin), Math.min(60, Math.round(V)));
      if (e.ouvert) e.nRT = PATM * e.V;
      dessiner();
    };
    L.glissable(gp, { soulever: false, debut: () => ({ x: S().px(e.V), y: S().Y }), deplacer: (p) => regler(S().V(p.x)),
      lacher: () => { if (!e.ouvert && !e.mesures.some((m) => m.V === e.V)) e.mesures.push({ V: e.V, P: Math.round(P()) }); } });
    L.glissable(gr, { soulever: false, debut: () => ({ x: 0, y: 0 }), toucher: () => { e.ouvert = !e.ouvert; e.nRT = PATM * e.V; if (e.ouvert) e.mesures = []; dessiner(); } });
    L.texte(g, 170, 494, "tuyau court : son volume est négligeable", { "font-size": 7, fill: "#e8e2cc" });
    dessiner();
    setInterval(() => { capteur.afficher(P()); L.missions.noter("boyle", JSON.parse(JSON.stringify({ ouvert: e.ouvert, V: e.V, P: Math.round(P()), nRT: e.nRT, mesures: e.mesures }))); }, 400);
    return { pense_bete };
  };
})(window.Labo);
