/*
Rôle : boucle de calcul de la paillasse Franck et Hertz (20 fois par seconde) : température du four (vers la consigne si
       l'appareil est en marche, vers 25 °C sinon), tension U2 (bouton en MAN, rampe de 0 à 30 V en 6 s en RAMPE), courant IA,
       points de l'acquisition en cours, afficheurs, lueur du tube.
Reçoit : l'état e de l'appareil, l'état a du logiciel et { g_lueur, g_aff, tracer, noter, noter_acq }.
Produit : Labo.fh_boucle(e, a, sorties) ; à la fin d'une rampe, l'acquisition est terminée et ses maximums sont calculés.
Utilisé par : poste_franck_hertz.js.
*/
(function (L) {
  const DT = 0.05, TAU = 6, RAMPE = 6;

  function afficher(g, e) {
    // Afficheurs de la température du four et du courant d'anode.
    const D = L.fh_dessin, f = 470 - D.UNITE.h, x = 180;
    g.replaceChildren();
    L.texte(g, x + 41, f + 82, "ϑ four (°C)", { "font-size": 6, fill: "#dfe6ec" });
    D.afficheur(g, x + 12, f + 86, 58, String(Math.round(e.theta)), e.allume);
    L.texte(g, x + 285, f + 16, "IA (nA)", { "font-size": 6, fill: "#dfe6ec" });
    D.afficheur(g, x + 252, f + 20, 66, e.IA.toFixed(2).replace(".", ","), e.allume);
    if (e.allume) L.svg("circle", { cx: x + 30, cy: f + 15, r: 2.2, fill: "#7dff9a" }, g);
  }

  function rampe(e, a, s) {
    // Mode RAMPE : U2 croît de 0 à 30 V en 6 s puis repart de 0 ; une acquisition dure une rampe.
    e.phase += DT / RAMPE;
    if (e.phase >= 1) {
      e.phase = 0;
      if (a.pts) { const c = a.courbes[a.courbes.length - 1]; c.maximums = L.franck_hertz.maximums(c.theta); a.pts = null; a.etat = "terminée"; a.message = "Acquisition terminée."; s.noter_acq(); }
    }
    return 30 * e.phase;
  }

  L.fh_boucle = function (e, a, s) {
    // Un pas toutes les 50 ms.
    let n = 0;
    setInterval(() => {
      e.theta += ((e.allume ? e.consigne : 25) - e.theta) * (DT / TAU);
      e.U2 = e.allume && e.mode === "RAMPE" ? rampe(e, a, s) : e.U2_man;
      e.IA = e.allume ? L.franck_hertz.courant(e.U2, e.theta) * (1 + 0.004 * (Math.random() - 0.5)) : 0;
      if (e.allume && e.mode === "MAN" && e.theta >= 170) e.U2max_man = Math.max(e.U2max_man, Math.round(e.U2));
      if (a.pts) a.pts.push([e.U2, e.IA]);
      afficher(s.g_aff, e); L.fh_dessin.lueur(s.g_lueur, 30, 470, e);
      a.I = s.tracer(a);
      if (++n % 5 === 0) s.noter();
    }, DT * 1000);
  };
})(window.Labo);
