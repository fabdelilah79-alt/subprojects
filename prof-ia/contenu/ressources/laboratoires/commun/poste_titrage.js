/*
Rôle : paillasse de titrage à l'échelle 1 px/mm (la burette entière tient dans la scène) : burette de 25 mL sur son pied,
       agitateur magnétique dessous, bécher de 250 mL de la solution à titrer (posé à côté : on le met sur le plateau),
       autres récipients et flacons compte-gouttes de la simulation, conductimètre à sonde (facultatif), touches « Remplir
       la burette » (rincée, remplie, ajustée au zéro) et « Bécher neuf » (même prise d'essai, pour recommencer). Les
       réactions ont lieu dans chaque récipient : tout de suite si la solution est agitée, toutes les 2 s sinon (une goutte
       de réactif colore d'abord le liquide là où elle tombe).
Reçoit : le groupe SVG et { titrant, texte (étiquette de la burette), becher { id, contenu, etiquette }, autres [{ id, profil,
         contenu, etiquette }] (posés sur la paillasse), gouttes [{ liquide, texte }] (flacons compte-gouttes), conductimetre, places (x des places sur la
         paillasse ; par défaut 180, 270, 360 et 620) }.
Produit : Labo.poste_titrage(g, reglage) -> { pense_bete, ctx, burette, agitateur, conductimetre, becher, recipients,
          sur_plateau() (récipient posé sur l'agitateur, ou null) }.
Utilisé par : les simulations de titrage.
*/
(function (L) {
  const SOL = 576, E = 1, X = 510, PLACES = [180, 270, 360, 620].map((x) => ({ x, y: SOL }));

  function reactions(ctx, recipients, agit) {
    // À chaque pas d'animation : réaction immédiate si le récipient est agité, sinon au plus toutes les 2 s.
    const dernier = new Map();
    ctx.ecoulement.sur_pas(() => {
      const t = performance.now();
      for (const r of recipients) {
        if (!agit.agite(r) && t - (dernier.get(r) || 0) < 2000) continue;
        dernier.set(r, t);
        if (L.reagir(r.c)) r.dessiner();
      }
    });
  }

  L.poste_titrage = function (g, { titrant, texte, becher, autres = [], gouttes = [], conductimetre = false, places = null }) {
    // Matériel ; le bécher à titrer et les autres récipients se posent sur la paillasse ou sur le plateau de l'agitateur.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230), ctx = L.paillasse_chimie(g);
    L.ecoulement(ctx, { sol: SOL, e: E });
    const agit = L.agitateur_magnetique(ctx, { x: X, sol: SOL, e: E });
    const burette = L.burette(ctx, { x: X, bas: 418, e: E, titrant, texte, tige: 430, sol: SOL });
    const P = places ? places.map((x) => ({ x, y: SOL })) : PLACES, supports = [...P, agit.station], cree = (k, i) => {
      const r = L.recipient(ctx, { id: k.id, profil: k.profil || "becher_250", x: P[i].x, y: SOL, e: E, contenu: k.contenu, etiquette: k.etiquette });
      L.manipuler(ctx, r, { sol: SOL, supports, pose_libre: false, autoriser: () => !(cond && r.place === agit.station && cond.etat().plonge) });
      return r;
    };
    let cond = null;
    const b = cree(becher, 0), recipients = [b, ...autres.map((k, i) => cree(k, i + 1))];
    agit.suivre(b);
    gouttes.forEach((k, i) => L.flacon_gouttes(ctx, { id: k.liquide, x: 700 + i * 70, sol: SOL, e: E, liquide: k.liquide, texte: k.texte }));
    if (conductimetre) cond = L.conductimetre(ctx, { x: 760, sol: SOL, e: E, tige: 610, sonde_x: 535, haut: 360, bas: 506, recipients: () => recipients, agite: agit.agite });
    if (conductimetre) L.pied_support(ctx.fond, 610, SOL, 200);
    L.bouton_texte(g, 140, 250, "Remplir la burette", burette.remplir);
    L.bouton_texte(g, 140, 285, "Bécher neuf", () => { b.c = L.contenu(becher.contenu); b.sig = null; b.dessiner(); });
    reactions(ctx, recipients, agit);
    return { pense_bete, ctx, burette, agitateur: agit, conductimetre: cond, becher: b, recipients, sur_plateau: () => recipients.find((r) => r.place === agit.station && !r.tenu) || null };
  };
})(window.Labo);
