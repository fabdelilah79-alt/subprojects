/*
Rôle : paillasse de l'hydrodistillation de la lavande : on ajoute de la pierre ponce, on branche l'arrivée d'eau sur un
       embout du réfrigérant (l'eau doit entrer par le bas), on ouvre le robinet, on allume le chauffe-ballon. L'eau bout,
       les vapeurs se condensent et le distillat tombe dans l'éprouvette (huile essentielle au-dessus de l'eau). Sans eau
       dans le réfrigérant, des vapeurs s'échappent ; sans pierre ponce, l'ébullition se fait par soubresauts.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_hydro(groupe) -> { pense_bete } ; fait « hydro » = { ponce, tuyau, eau, chauffe, ebullition, volume, essence,
          perte, soubresauts, noms } ;
          on peut débrancher le tuyau (le tirer) pour le rebrancher ailleurs.
Utilisé par : simulation.js.
*/
(function (L) {
  const H = L.hydro, NOMS = [["ballon", 296, 466, 68, 66], ["chauffe-ballon", 284, 520, 92, 42], ["réfrigérant droit", 400, 418, 150, 40], ["allonge", 588, 460, 22, 16], ["éprouvette graduée", 602, 486, 24, 76], ["support (potence)", 236, 290, 28, 260]];

  function pierre_ponce(g, x, bas) {
    // Petit flacon de grains de pierre ponce.
    L.svg("rect", { x: x - 14, y: bas - 34, width: 28, height: 34, rx: 4, fill: "url(#verre)", stroke: "#9fb6be" }, g);
    for (let i = 0; i < 14; i++) L.svg("circle", { cx: x - 10 + ((i * 5) % 20), cy: bas - 4 - Math.floor(i / 4) * 4, r: 2, fill: "#9a968c" }, g);
    L.svg("rect", { x: x - 12, y: bas - 30, width: 24, height: 10, fill: "#fbfaf3" }, g);
    L.texte(g, x, bas - 25, "pierre ponce", { "font-size": 4.2, "font-weight": 700, fill: "#23315a" });
  }

  function tuyau(g, de, vers, u) {
    // Tuyau souple de « de » jusqu'à un embout (extrémité vers, direction u) : il arrive dans l'axe de l'embout et
    // s'enfile dessus sur 8 px (le bout du tuyau recouvre l'olive : pas de fuite).
    const style = { stroke: "#c9a96b", "stroke-width": 7, fill: "none", "stroke-linecap": "round" };
    const dedans = { x: vers.x - 8 * u.x, y: vers.y - 8 * u.y }, avant = { x: vers.x + 40 * u.x, y: vers.y + 40 * u.y };
    L.svg("path", { d: `M${de.x} ${de.y} C${de.x} ${de.y + 70} ${avant.x} ${avant.y} ${vers.x + 4 * u.x} ${vers.y + 4 * u.y}`, ...style }, g);
    L.svg("path", { d: `M${vers.x + 4 * u.x} ${vers.y + 4 * u.y} L${dedans.x} ${dedans.y}`, ...style, stroke: "#b8955a", "stroke-linecap": "butt" }, g);
  }

  function tuyaux(g, e) {
    // Arrivée d'eau (du robinet) et évacuation (vers l'évier) ; un tuyau non branché pend sous le robinet.
    g.replaceChildren();
    const R = H.ROBINET, depart = { x: R.x, y: R.y + 8 };
    if (!e.tuyau) {
      const f = e.bout_libre;
      L.svg("path", { d: `M${depart.x} ${depart.y} C${depart.x} ${depart.y + 70} ${f.x} ${f.y + 40} ${f.x} ${f.y}`, stroke: "#c9a96b", "stroke-width": 7, fill: "none", "stroke-linecap": "round" }, g);
      return void L.svg("circle", { cx: f.x, cy: f.y, r: 2.5, fill: "#3a2c14" }, g);
    }
    const n = H.EMBOUTS[e.tuyau], autre = H.EMBOUTS[e.tuyau === "bas" ? "haut" : "bas"];
    tuyau(g, depart, n, { x: n.ux, y: n.uy });
    tuyau(g, { x: H.EVIER.x - 20, y: H.EVIER.y - 4 }, autre, { x: autre.ux, y: autre.uy });
  }

  function noms(g, etat, noter) {
    // Zones invisibles : toucher une pièce affiche son nom.
    const bulle = L.svg("g", { "pointer-events": "none" }, g);
    for (const [nom, x, y, l, h] of NOMS) {
      const z = L.svg("rect", { x, y, width: l, height: h, fill: "#000", opacity: 0 }, g);
      L.glissable(z, { soulever: false, debut: () => ({ x: 0, y: 0 }), toucher: () => {
        bulle.replaceChildren();
        L.svg("rect", { x: x + l / 2 - 55, y: y - 24, width: 110, height: 18, rx: 4, fill: "#fff", stroke: "#8a96a0" }, bulle);
        L.texte(bulle, x + l / 2, y - 15, nom, { "font-size": 8.5, "font-weight": 700, fill: "#23315a" });
        etat.noms.add(nom); noter();
      } });
    }
    return bulle;
  }

  function evoluer(e) {
    // Un pas de 0,2 s : température, ébullition, condensation dans le réfrigérant.
    e.T = e.chauffe ? Math.min(100, e.T + 4) : Math.max(20, e.T - 1);
    e.ebullition = e.T >= 100;
    e.soubresauts = e.ebullition && !e.ponce;
    e.bulles = e.ebullition ? Array.from({ length: e.ponce ? 8 : 2 }, () => ({ dx: Math.random() * 40 - 20, dy: Math.random() * 22 + 2, r: e.ponce ? 1.5 : 4 + Math.random() * 4 })) : [];
    if (!e.ebullition || e.volume >= 45) return void (e.perte = false);
    const refroidi = e.eau && e.tuyau === "bas" ? 1 : e.eau && e.tuyau ? 0.35 : 0.1;
    e.perte = refroidi < 1;
    e.volume = Math.min(45, e.volume + 0.25 * refroidi);
    e.essence = Math.round(e.volume * 0.02 * 100) / 100;
  }

  L.poste_hydro = function (g) {
    // Construit la paillasse et ses gestes.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230);
    L.affiche_securite(g, 780, 56);
    const e = { ponce: false, tuyau: null, eau: false, chauffe: false, T: 20, ebullition: false, volume: 0, essence: 0, perte: false, soubresauts: false, bulles: [], noms: new Set(), bout_libre: { x: 760, y: 420 } };
    const g_fixe = L.svg("g", {}, g), g_tuyaux = L.svg("g", {}, g), g_var = L.svg("g", {}, g);
    H.fixe(g_fixe);
    const noter = () => L.missions.noter("hydro", { ...e, bulles: undefined, bout_libre: undefined, noms: [...e.noms] });
    noms(g, e, noter);
    const redessiner = () => { H.variable(g_var, e); tuyaux(g_tuyaux, e); };
    pierre_ponce(L.svg("g", { class: "pierre-ponce", role: "button", "aria-label": "Pierre ponce" }, g), 460, 562);
    const pincee = L.svg("g", { class: "pincee" }, g);
    L.svg("rect", { x: 446, y: 520, width: 28, height: 42, fill: "#000", opacity: 0 }, pincee);
    for (const dx of [-3, 1, 4]) L.svg("circle", { cx: 460 + dx, cy: 524 + Math.abs(dx), r: 1.8, fill: "#9a968c" }, pincee);
    L.glissable(pincee, { debut: () => ({ x: 0, y: 0 }), deplacer: (p) => L.placer(pincee, p.x, p.y), lacher: (p) => { L.placer(pincee, 0, 0); if (Math.hypot(460 + p.x - 330, 541 + p.y - 420) < 35) { e.ponce = true; redessiner(); noter(); } } });
    const extremite = L.svg("circle", { cx: 0, cy: 0, r: 9, fill: "#000", opacity: 0, class: "bout-tuyau" }, g);
    L.placer(extremite, e.bout_libre.x, e.bout_libre.y);
    const detacher = () => { const b = H.EMBOUTS[e.tuyau]; e.tuyau = null; return { x: b.x, y: b.y }; };
    L.glissable(extremite, { debut: () => (e.tuyau ? detacher() : { ...e.bout_libre }), deplacer: (p) => { L.placer(extremite, p.x, p.y); tuyaux(g_tuyaux, { ...e, bout_libre: p }); }, lacher: (p) => {
      const n = ["bas", "haut"].find((k) => Math.hypot(p.x - H.EMBOUTS[k].x, p.y - H.EMBOUTS[k].y) < 22);
      if (n) { e.tuyau = n; L.placer(extremite, H.EMBOUTS[n].x, H.EMBOUTS[n].y); } else L.placer(extremite, e.bout_libre.x, e.bout_libre.y);
      redessiner(); noter();
    } });
    L.bouton_rond(g, H.ROBINET.x + 16, H.ROBINET.y - 12, "", () => { e.eau = !e.eau; noter(); }, 6);
    L.bouton_rond(g, 362, 535, "I/O", () => { e.chauffe = !e.chauffe; noter(); }, 7);
    setInterval(() => { evoluer(e); redessiner(); noter(); }, 200);
    redessiner(); noter();
    return { pense_bete };
  };
})(window.Labo);
