/*
Rôle : test, sur un téléphone simulé, de la commande au doigt et des missions : doigt aimanté (toucher à côté du bouton de
       l'agitateur), double-toucher (la scène s'approche ×2 puis revient, proportions gardées), double-clic dans le carnet
       sans effet, « Passer à la mission 2 » sans finir la 1, marque-page de la mission 2 ouvert, « Recommencer » (carnet
       et ticket du mode cours).
Reçoit : rien (laboratoire assemblé b2_chim5_a1_ph_courants : deux missions) ; un dossier de captures facultatif en argument.
Produit : une ligne OK ou ÉCHEC par vérification, et des captures tactile_*.png.
Utilisé par : l'enseignant et Claude : node test_tactile_missions.js [dossier_captures] (depuis ce dossier).
*/
const { chromium, devices } = require("playwright");
const path = require("path");
const PAGE = "file://" + path.resolve(__dirname, "../../../../prof-ia/contenu/ressources/laboratoires/b2_chim5_a1_ph_courants.html");
const SORTIE = process.argv[2] || ".";
let echecs = 0;

function verifier(nom, ok, detail = "") {
  // Affiche le résultat d'une vérification.
  if (!ok) echecs += 1;
  console.log(`${ok ? "OK    " : "ÉCHEC "} ${nom}${detail ? " : " + detail : ""}`);
}

async function ouvrir(ctx, reglages) {
  // Ouvre le laboratoire avec ses réglages d'adresse et garde les erreurs de la page.
  const p = await ctx.newPage();
  p.erreurs = [];
  p.on("pageerror", (e) => p.erreurs.push(e.message));
  await p.goto(PAGE + reglages);
  await p.waitForTimeout(1500);
  return p;
}

async function gestes(p) {
  // Doigt aimanté, double-toucher, double-clic dans le carnet.
  const b = await p.evaluate(() => { const r = document.querySelector('[aria-label="Vitesse de l\'agitateur"]').getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2, l: r.width }; });
  await p.touchscreen.tap(b.x - 14, b.y + 4);
  await p.waitForTimeout(200);
  const texte = await p.evaluate(() => document.querySelector(".agitateur-magnetique").textContent);
  verifier(`doigt aimanté : un toucher à 14 px du bouton (large de ${Math.round(b.l)} px) met l'agitateur en marche`, texte.includes("lent"));
  const mur = await p.evaluate(() => { const r = document.querySelector("#ecran").getBoundingClientRect(); return { x: r.x + r.width * 0.62, y: r.y + r.height * 0.1 }; });
  for (let i = 0; i < 2; i++) { await p.touchscreen.tap(mur.x, mur.y); await p.waitForTimeout(120); }
  const t = await p.evaluate(() => { const m = document.querySelector("#etage").style.transform.match(/scale\(([\d.]+)\)/); return { zoom: Labo.scene.zoom(), echelle: m && Number(m[1]) }; });
  verifier("double-toucher sur le mur : la scène s'approche ×2", Math.abs(t.zoom - 2) < 0.01, JSON.stringify(t));
  const r = await p.evaluate(() => { const e = document.querySelector("#etage").getBoundingClientRect(); return e.width / e.height; });
  verifier("proportions gardées (1024 × 640 : rapport 1,6)", Math.abs(r - 1.6) < 0.01, r.toFixed(3));
  await p.screenshot({ path: `${SORTIE}/tactile_approche.png` });
  await p.waitForTimeout(600);
  for (let i = 0; i < 2; i++) { await p.touchscreen.tap(mur.x, mur.y); await p.waitForTimeout(120); }
  verifier("double-toucher de nouveau : retour à la scène entière", await p.evaluate(() => Labo.scene.zoom() === 1));
  await p.waitForTimeout(600);
  await p.dblclick(".carnet-titre");
  verifier("double-clic dans le carnet : pas de zoom", await p.evaluate(() => Labo.scene.zoom() === 1));
}

async function missions(p) {
  // Mission suivante sans finir, marque-page, Recommencer depuis le carnet.
  verifier("marque-page « Mission 2 » ouvert avant la fin de la mission 1", !(await p.locator(".carnet-marque").nth(1).isDisabled()));
  await p.screenshot({ path: `${SORTIE}/tactile_carnet.png` });
  await p.click(".carnet-commandes >> text=Passer à la mission 2");
  await p.waitForTimeout(1200);
  verifier("« Passer à la mission 2 » sans avoir fini la 1", await p.evaluate(() => Labo.missions.etat().vue === 1));
  await p.click(".carnet-commandes >> text=Recommencer");
  await p.waitForTimeout(1800);
  const e = await p.evaluate(() => ({ h: location.hash, vue: Labo.missions.etat().vue, agit: document.querySelector(".agitateur-magnetique").textContent }));
  verifier("« Recommencer » : laboratoire remis à zéro, reprise à la mission 2", e.vue === 1 && /depart=eau/.test(e.h) && e.agit.includes("arrêt"), JSON.stringify(e));
  await p.click(".carnet-marque >> nth=0");
  await p.waitForTimeout(1200);
  verifier("marque-page « Mission 1 » : retour à la mission 1", await p.evaluate(() => Labo.missions.etat().vue === 0));
}

async function cours(ctx) {
  // Mode cours : le ticket jaune porte « Recommencer », qui recharge la même mission.
  const p = await ouvrir(ctx, "#mission=produits&prof=1");
  const boutons = await p.locator(".ticket-pied button").allTextContents();
  verifier("ticket du mode cours : « Recommencer » (pas d'autre mission)", boutons.join() === "Recommencer", boutons.join(", "));
  await p.screenshot({ path: `${SORTIE}/tactile_ticket.png` });
  await p.click(".ticket-pied >> text=Recommencer");
  await p.waitForTimeout(1800);
  verifier("« Recommencer » du ticket : même mission, adresse inchangée", await p.evaluate(() => location.hash === "#mission=produits&prof=1" && Labo.missions.etat().seule === 0));
  verifier("aucune erreur dans la page (mode cours)", p.erreurs.length === 0, p.erreurs.join(" | "));
}

(async () => {
  const navigateur = await chromium.launch();
  const ctx = await navigateur.newContext({ ...devices["iPhone 13 landscape"] });
  const p = await ouvrir(ctx, "");
  await p.evaluate(() => Labo.carnet.ouvrir());
  await gestes(p);
  await missions(p);
  verifier("aucune erreur dans la page (mode élève)", p.erreurs.length === 0, p.erreurs.join(" | "));
  await cours(ctx);
  await navigateur.close();
  console.log(echecs ? `${echecs} vérification(s) en échec` : "Toutes les vérifications sont réussies.");
  process.exit(echecs ? 1 : 0);
})();
