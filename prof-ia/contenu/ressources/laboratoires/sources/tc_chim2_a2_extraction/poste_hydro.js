/*
Rôle : paillasse de l'hydrodistillation de la lavande, aux vraies dimensions : on ajoute de la pierre ponce, on branche
       l'arrivée d'eau sur un embout du réfrigérant (l'eau doit entrer par le bas), on ouvre le robinet, on allume le
       chauffe-ballon. L'eau bout, les vapeurs se condensent et le distillat tombe goutte à goutte dans l'éprouvette, où
       l'huile essentielle (moins dense, non miscible) forme une couche au-dessus de l'eau. Sans eau dans le réfrigérant,
       des vapeurs s'échappent ; sans pierre ponce, l'ébullition se fait par soubresauts (grosses bulles).
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_hydro(groupe) -> { pense_bete } ; fait « hydro » = { ponce, tuyau, eau, chauffe, T, ebullition, volume, essence,
          perte, soubresauts, noms } ; on peut débrancher le tuyau (le tirer) pour le rebrancher ailleurs.
Utilisé par : simulation.js.
*/
(function (L) {
  const H = L.hydro, SOL = 576, E = H.E;
  L.LIQUIDES.huile_lavande = { nom: "huile essentielle de lavande", d: 0.88, rgb: [238, 206, 96], alpha: 0.8, classe: "organique" };
  const NOMS = [["ballon", 300, 214, 80, 120], ["chauffe-ballon", 228, 360, 224, 110], ["support élévateur", 228, 482, 224, 90], ["réfrigérant droit", 470, 180, 220, 70], ["allonge", 772, 252, 30, 40], ["éprouvette graduée", 772, 320, 36, 250], ["support (potence)", 206, 160, 28, 380]];

  function pierre_ponce(g, x, bas) {
    // Petit flacon de grains de pierre ponce (40 mm).
    L.svg("rect", { x: x - 20, y: bas - 56, width: 40, height: 56, rx: 5, fill: "rgba(205,228,236,0.5)", stroke: "#9fb6be" }, g);
    for (let i = 0; i < 24; i++) L.svg("circle", { cx: x - 15 + ((i * 7) % 30), cy: bas - 5 - Math.floor(i / 5) * 5, r: 2.6, fill: "#9a968c" }, g);
    L.svg("rect", { x: x - 17, y: bas - 48, width: 34, height: 14, fill: "#fbfaf3" }, g);
    L.texte(g, x, bas - 41, "pierre ponce", { "font-size": 5.4, "font-weight": 700, fill: "#23315a" });
  }

  function tuyau(g, de, vers, u) {
    // Tuyau souple jusqu'à un embout : il arrive dans l'axe et s'enfile sur l'olive sur 10 px (pas de fuite).
    const style = { stroke: "#c9a96b", "stroke-width": 9, fill: "none", "stroke-linecap": "round" };
    const dedans = { x: vers.x - 10 * u.x, y: vers.y - 10 * u.y }, avant = { x: vers.x + 50 * u.x, y: vers.y + 50 * u.y };
    L.svg("path", { d: `M${de.x} ${de.y} C${de.x} ${de.y + 80} ${avant.x} ${avant.y} ${vers.x + 4 * u.x} ${vers.y + 4 * u.y}`, ...style }, g);
    L.svg("path", { d: `M${vers.x + 4 * u.x} ${vers.y + 4 * u.y} L${dedans.x} ${dedans.y}`, ...style, stroke: "#b8955a", "stroke-linecap": "butt" }, g);
  }

  function tuyaux(g, e) {
    // Arrivée d'eau (du robinet) et évacuation (vers l'évier) ; un tuyau non branché pend sous le robinet.
    g.replaceChildren();
    const R = H.ROBINET, depart = { x: R.x, y: R.y + 8 };
    if (!e.tuyau) {
      const f = e.bout_libre;
      L.svg("path", { d: `M${depart.x} ${depart.y} C${depart.x} ${depart.y + 70} ${f.x} ${f.y + 40} ${f.x} ${f.y}`, stroke: "#c9a96b", "stroke-width": 9, fill: "none", "stroke-linecap": "round" }, g);
      return void L.svg("circle", { cx: f.x, cy: f.y, r: 3, fill: "#3a2c14" }, g);
    }
    const n = H.EMBOUTS[e.tuyau], autre = H.EMBOUTS[e.tuyau === "bas" ? "haut" : "bas"];
    tuyau(g, depart, n, { x: n.ux, y: n.uy });
    tuyau(g, { x: H.EVIER.x - 24, y: H.EVIER.y - 4 }, autre, { x: autre.ux, y: autre.uy });
  }

  function noms(g, etat, noter) {
    // Zones invisibles : toucher une pièce affiche son nom.
    const bulle = L.svg("g", { "pointer-events": "none" }, g);
    for (const [nom, x, y, l, h] of NOMS) {
      const z = L.svg("rect", { x, y, width: l, height: h, fill: "#000", opacity: 0 }, g);
      L.glissable(z, { soulever: false, debut: () => ({ x: 0, y: 0 }), toucher: () => {
        bulle.replaceChildren();
        L.svg("rect", { x: x + l / 2 - 60, y: y - 24, width: 120, height: 18, rx: 4, fill: "#fff", stroke: "#8a96a0" }, bulle);
        L.texte(bulle, x + l / 2, y - 15, nom, { "font-size": 8.5, "font-weight": 700, fill: "#23315a" });
        etat.noms.add(nom); noter();
      } });
    }
  }

  function evoluer(e, ctx, ballon, source) {
    // Un pas de 0,2 s : température, ébullition, condensation ; le distillat tombe de l'allonge (2 % d'huile essentielle).
    e.T = e.chauffe ? Math.min(100, e.T + 4) : Math.max(20, e.T - 1);
    e.ebullition = e.T >= 100;
    e.soubresauts = e.ebullition && !e.ponce;
    if (!e.ebullition || e.volume >= 45 || ballon.c.volume() < 40) return void (e.perte = false);
    const refroidi = e.eau && e.tuyau === "bas" ? 1 : e.eau && e.tuyau ? 0.35 : 0.1, V = 0.25 * refroidi;
    e.perte = refroidi < 1;
    ballon.c.retirer(0.25, "haut");
    ctx.ecoulement.emettre(source, { x: H.POINTE.x, y: H.POINTE.y + 2 }, { x: 0, y: 30 }, [{ classe: "aqueuse", liquides: { eau: V * 0.98 }, dissous: {} }, { classe: "organique", liquides: { huile_lavande: V * 0.02 }, dissous: {} }], V);
  }

  function bulles(g, e, ballon) {
    // Bulles dans l'eau qui bout (petites et nombreuses avec la pierre ponce, grosses sans), vapeurs perdues, fleurs.
    g.replaceChildren();
    const y_eau = ballon.pose.y - ballon.pr.hauteur_de(ballon.c.volume()) * E, x = H.BALLON.x;
    for (let i = 0; i < 14; i++) L.svg("ellipse", { cx: x - 36 + ((i * 13) % 72), cy: y_eau + 4 + ((i * 5) % 9), rx: 3.4, ry: 1.8, fill: "#7b5aa6", opacity: 0.9 }, g);
    if (e.ponce) for (let i = 0; i < 5; i++) L.svg("circle", { cx: x - 10 + i * 5, cy: y_eau + 14, r: 2.4, fill: "#9a968c" }, g);
    if (e.ebullition) for (let i = 0; i < (e.ponce ? 10 : 2); i++) L.svg("circle", { cx: x + Math.random() * 60 - 30, cy: y_eau + 2 + Math.random() * 10, r: e.ponce ? 1.8 : 5 + Math.random() * 5, fill: "none", stroke: "#fff", opacity: 0.85 }, g);
    if (e.perte) for (let i = 0; i < 3; i++) L.svg("path", { d: `M${H.POINTE.x - 8 + i * 8} 292 q-5 -12 2 -24 q7 -12 0 -24`, stroke: "#fff", "stroke-width": 4, opacity: 0.4, fill: "none" }, g);
  }

  L.poste_hydro = function (g) {
    // Construit la paillasse et ses gestes.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230), ctx = L.paillasse_chimie(g);
    L.affiche_securite(g, 780, 56);
    L.ecoulement(ctx, { sol: SOL, e: E });
    const e = { ponce: false, tuyau: null, eau: false, chauffe: false, T: 20, ebullition: false, volume: 0, essence: 0, perte: false, soubresauts: false, noms: new Set(), bout_libre: { x: 836, y: 420 } };
    const g_tuyaux = L.svg("g", { "pointer-events": "none" }, ctx.fond), g_eau = L.svg("g", {}, ctx.objets);
    H.fixe(ctx);
    const ballon = L.recipient(ctx, { id: "ballon", profil: "ballon_250", x: H.BALLON.x, y: H.BALLON.y, contenu: { eau: 150 } });
    const ep = L.recipient(ctx, { id: "eprouvette", profil: "eprouvette_50", x: H.EPROUVETTE.x, y: H.EPROUVETTE.sol - 6 * E });
    const g_var = L.svg("g", { "pointer-events": "none" }, ctx.objets), source = { c: L.contenu({ eau: 1 }), interieur_monde: () => [] };
    const noter = () => {
      const org = ep.c.phases.find((p) => p.classe === "organique");
      Object.assign(e, { volume: Math.round(ep.c.volume() * 100) / 100, essence: Math.round((org?.V || 0) * 100) / 100 });
      L.missions.noter("hydro", { ...e, bout_libre: undefined, noms: [...e.noms] });
    };
    noms(ctx.devant, e, noter);
    const redessiner = () => { bulles(g_var, e, ballon); tuyaux(g_tuyaux, e); H.eau_manchon(g_eau, e); };
    pierre_ponce(ctx.fond, 520, SOL);
    L.gestes_hydro(ctx, e, { redessiner, noter, tuyaux: (f) => tuyaux(g_tuyaux, { ...e, bout_libre: f }) });
    setInterval(() => { evoluer(e, ctx, ballon, source); redessiner(); noter(); }, 200);
    redessiner(); noter();
    return { pense_bete };
  };
})(window.Labo);
