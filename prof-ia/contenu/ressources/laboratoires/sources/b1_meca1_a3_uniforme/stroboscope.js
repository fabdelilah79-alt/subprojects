/*
Rôle : stroboscope de laboratoire : lampe à éclairs brefs, interrupteur, bouton de réglage de la fréquence des éclairs fe
       (1 à 50 Hz, réglage fin au dixième). Allumé, la salle est dans le noir (rideaux tirés) : on ne voit le disque qu'aux
       instants des éclairs (l'œil garde les images d'un tour, au moins 1/10 s). Si fe = f (ou f/2, f/3…), le disque paraît
       immobile ; si fe = 2f, on voit deux traits ; si fe est un peu plus petite que f, le trait semble tourner lentement
       dans le sens de la rotation.
Reçoit : le groupe SVG, le disque (disque_moteur.js), le voile de la salle obscure et { x, y }.
Produit : Labo.stroboscope(g, disque, voile, reglage) -> s { allume, fe, images } (images : nombre de traits vus).
Utilisé par : postes_uniforme.js.
*/
(function (L) {
  // L'œil garde les images au moins 0,1 s ; pendant un tour du disque, il voit toutes les positions éclairées (au moins le dernier éclair).
  const GARDE = 0.1;

  function lampe(g, x, y) {
    // Boîtier, réflecteur et tube à éclats tournés vers le disque.
    L.svg("rect", { x: x - 70, y: y - 46, width: 140, height: 104, rx: 6, fill: "#3b4248", stroke: "#111" }, g);
    L.svg("path", { d: `M${x - 70} ${y - 34} L${x - 102} ${y - 48} V${y + 48} L${x - 70} ${y + 34} Z`, fill: "#b9bec3", stroke: "#555" }, g);
    const tube = L.svg("rect", { x: x - 100, y: y - 28, width: 8, height: 56, rx: 4, fill: "#f4f6f8", stroke: "#888" }, g);
    L.texte(g, x, y - 34, "STROBOSCOPE", { "font-size": 8, "font-weight": 700, fill: "#e8ecef" });
    return tube;
  }

  L.stroboscope = function (g, m, voile, { x, y }) {
    // Lampe, interrupteur, réglage ; à chaque image, angles du disque aux instants des éclairs récents.
    const s = { allume: false, fe: 50, images: 0, prochain: 0, liste: [] }, tube = lampe(g, x, y);
    const reg = L.bouton_reglage(g, { x: x + 20, y: y + 24, min: 1, max: 50, pas: 0.1, valeur: 50, unite: "Hz", titre: "fréquence des éclairs", sur_changement: (v) => { s.fe = v; } });
    L.bouton_rond(g, x - 44, y + 24, "I/O", () => { s.allume = !s.allume; s.prochain = m.t; s.liste = []; voile.style.display = s.allume ? "" : "none"; if (!s.allume) m.eclairs = null; }, 11);
    m.surveillants.push(() => {
      if (!s.allume) return;
      while (s.prochain <= m.t) { s.liste.push({ t: s.prochain, a: m.theta - m.omega * (m.t - s.prochain) }); s.prochain += 1 / s.fe; }
      const garde = Math.max(GARDE, 1.02 / s.fe, Math.abs(m.omega) > 0.5 ? (1.02 * 2 * Math.PI) / Math.abs(m.omega) : 0);
      s.liste = s.liste.filter((k) => m.t - k.t <= garde);
      const angles = [];
      for (const k of s.liste) { const a = ((k.a % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI); if (!angles.some((b) => Math.abs(Math.atan2(Math.sin(a - b), Math.cos(a - b))) < 0.08)) angles.push(a); }
      m.eclairs = angles; s.images = angles.length;
      tube.setAttribute("fill", s.liste.some((k) => m.t - k.t < 0.02) ? "#ffffff" : "#c9d3dc");
    });
    s.reglage = reg;
    return s;
  };
})(window.Labo);
