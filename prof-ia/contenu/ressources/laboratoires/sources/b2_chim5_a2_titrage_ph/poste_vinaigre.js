/*
Rôle : paillasse du titrage pH-métrique d'un vinaigre (poste_titrage.js avec pH-mètre) : bécher de 250 mL contenant 10,0 mL de
       vinaigre dilué dix fois (acide éthanoïque, 0,080 mol/L) et 90 mL d'eau distillée ; burette d'hydroxyde de sodium à
       0,100 mol/L ; électrode combinée tenue sur la tige de la burette ; pH-mètre étalonné relié par un câble USB à un
       ordinateur portable (logiciel_ph.js : « Mesurer » enregistre le volume lu sur la burette, au 0,05 mL près, et le pH
       affiché) ; document mural : zones de virage de trois indicateurs colorés.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_vinaigre(g) -> { pense_bete } ; fait « banc_titrage_ph » = { sur_plateau, plonge, agite, verse (mL) } ;
          faits « titrage_ph » (logiciel) et « docs_indicateurs ».
Utilisé par : simulation.js.
*/
(function (L) {
  function cable_usb(g, a, b) {
    // Câble USB gris du pH-mètre à l'ordinateur, fiches enfoncées aux deux bouts.
    L.svg("path", { d: `M${a.x} ${a.y} C${a.x + 20} ${a.y} ${b.x - 10} ${b.y + 30} ${b.x} ${b.y}`, fill: "none", stroke: "#5b6168", "stroke-width": 2.4 }, g);
    for (const p of [a, b]) L.svg("rect", { x: p.x - 4, y: p.y - 3, width: 8, height: 6, rx: 1, fill: "#2b2f33", stroke: "#111" }, g);
  }

  L.poste_vinaigre = function (g) {
    // Banc de titrage avec pH-mètre, document des indicateurs, ordinateur et logiciel d'acquisition.
    L.documents_mur(g, [{ x: 715, y: 34, l: 280, h: 150, taille: 4, titre: "Indicateurs colorés", chaine: ["hélianthine", "3,1 – 4,4", "bleu de bromothymol 6,0 – 7,6", "phénolphtaléine 8,2 – 10,0"],
      texte: "Zones de virage : hélianthine, rouge pour pH < 3,1, jaune pour pH > 4,4 ; bleu de bromothymol, jaune pour pH < 6,0, bleu pour pH > 7,6 ; phénolphtaléine, incolore pour pH < 8,2, rose pour pH > 10,0. Pour un titrage colorimétrique, on choisit l'indicateur dont la zone de virage contient le pH à l'équivalence." }], "docs_indicateurs");
    const p = L.poste_titrage(g, { titrant: "ab_soude", texte: "NaOH 0,100 mol/L", becher: { id: "becher", contenu: { ab_vinaigre: 10, eau: 90 }, etiquette: "vinaigre dilué" }, places: [250], ph_metre: { x: 650, sonde_x: 490 } });
    cable_usb(p.ctx.fond, { x: 707, y: 540 }, { x: 718, y: 452 });
    const mesurer = () => {
      // Point enregistré : volume lu sur la burette et pH affiché, si l'électrode est dans la solution.
      const m = p.ph_metre.etat();
      return m.plonge ? { V: Math.round(p.burette.etat().verse * 20) / 20, pH: m.affiche } : null;
    };
    L.logiciel_ph(g, { x: 715, y: 210, l: 280, h: 205, mesurer });
    p.ctx.ecoulement.sur_pas(() => {
      const m = p.ph_metre.etat(), b = p.sur_plateau();
      L.missions.noter("banc_titrage_ph", { sur_plateau: !!b, plonge: m.plonge, agite: !!b && p.agitateur.agite(b), verse: Math.round(p.burette.etat().verse * 100) / 100 });
    });
    g.append(g.querySelector(".document-ouvert"));
    return { pense_bete: p.pense_bete };
  };
})(window.Labo);
