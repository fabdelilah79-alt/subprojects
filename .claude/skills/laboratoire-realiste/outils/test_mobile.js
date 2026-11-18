/*
Rôle : test de la proposition « confort sur téléphone et relief » (options mobile=1 et relief=1) sur un téléphone simulé :
       sans les options rien ne change ; avec elles : boîtiers en relief, doigt aimanté (toucher à côté du bouton de
       l'agitateur le tourne), double-toucher (zoom puis « Vue entière »), menu des missions (Y aller, Recommencer),
       mode cours (une seule mission : seulement « Recommencer »).
Reçoit : rien (pages b2_chim5_a1_ph_courants et b2_chim5_a2_titrage_ph) ; un dossier de captures facultatif en argument.
Produit : une ligne OK ou ÉCHEC par vérification, et les captures téléphone_*.png.
Utilisé par : l'enseignant et Claude : node test_mobile.js [dossier_captures] (depuis ce dossier).
*/
const { chromium, devices } = require("playwright");
const path = require("path");
const LABOS = path.resolve(__dirname, "../../../../prof-ia/contenu/ressources/laboratoires/sources");
const SORTIE = process.argv[2] || ".";
let echecs = 0;

function verifier(nom, ok, detail = "") {
  // Affiche le résultat d'une vérification.
  if (!ok) echecs += 1;
  console.log(`${ok ? "OK    " : "ÉCHEC "} ${nom}${detail ? " : " + detail : ""}`);
}

async function ouvrir(ctx, labo, options) {
  // Ouvre une page de laboratoire avec ses options et attend le dessin.
  const p = await ctx.newPage();
  p.erreurs = [];
  p.on("pageerror", (e) => p.erreurs.push(e.message));
  await p.goto(`file://${LABOS}/${labo}/page.html${options}`);
  await p.waitForTimeout(1500);
  return p;
}

async function centre(p, selecteur) {
  // Centre à l'écran d'un élément visible.
  return p.evaluate((s) => {
    const el = [...document.querySelectorAll(s)].find((x) => x.getBoundingClientRect().width > 0), r = el.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
  }, selecteur);
}

async function gestes(ctx) {
  // Aimant, double-toucher, menu des missions sur la page à deux missions.
  const p = await ouvrir(ctx, "b2_chim5_a1_ph_courants", "#mobile=1&relief=1");
  verifier("options actives", await p.evaluate(() => Labo.mobile && Labo.relief && !!document.querySelector(".mobile-barre")));
  const b = await centre(p, '[aria-label="Vitesse de l\'agitateur"]');
  await p.touchscreen.tap(b.x - 16, b.y + 4);
  await p.waitForTimeout(200);
  const texte = await p.evaluate(() => document.querySelector(".agitateur-magnetique").textContent);
  verifier("doigt aimanté : toucher à 16 px du bouton de l'agitateur le met en marche", texte.includes("lent"), texte);
  await p.screenshot({ path: `${SORTIE}/telephone_paysage.png` });
  for (let i = 0; i < 2; i++) { await p.touchscreen.tap(420, 60); await p.waitForTimeout(120); }
  verifier("double-toucher sur le mur : zoom × 2,5", await p.evaluate(() => Math.abs(Labo.scene.zoom() - 2.5) < 0.01));
  await p.screenshot({ path: `${SORTIE}/telephone_zoom.png` });
  await p.click(".vue-entiere");
  verifier("« Vue entière » : retour au zoom 1", await p.evaluate(() => Labo.scene.zoom() === 1));
  await p.click("text=Missions");
  verifier("menu : deux missions", (await p.locator(".menu-missions li").count()) === 2);
  await p.screenshot({ path: `${SORTIE}/telephone_menu.png` });
  await p.click(".menu-missions li:nth-child(2) >> text=Y aller");
  verifier("« Y aller » : mission 2 ouverte sans finir la 1", await p.evaluate(() => Labo.missions.etat().vue === 1));
  await p.click("text=Missions");
  await p.click(".menu-missions li:nth-child(2) >> text=Recommencer");
  await p.waitForTimeout(1500);
  const e = await p.evaluate(() => ({ h: location.hash, vue: Labo.missions.etat().vue, v: document.querySelector(".agitateur-magnetique").textContent }));
  verifier("« Recommencer » : page remise à zéro, reprise à la mission 2", e.vue === 1 && e.v.includes("arrêt") && /depart=/.test(e.h), JSON.stringify(e));
  verifier("aucune erreur dans la page", p.erreurs.length === 0, p.erreurs.join(" | "));
}

async function sans_options_et_cours(ctx) {
  // Sans option : rien de nouveau ; mode cours : une seule mission, seulement « Recommencer ».
  const p = await ouvrir(ctx, "b2_chim5_a2_titrage_ph", "#mission=titrage&prof=1");
  verifier("sans option : ni barre ni relief", await p.evaluate(() => !Labo.mobile && !Labo.relief && !document.querySelector(".mobile-barre")));
  const q = await ouvrir(ctx, "b2_chim5_a2_titrage_ph", "#mission=titrage&prof=1&mobile=1&relief=1");
  await q.click("text=Missions");
  const n = await q.locator(".menu-missions li").count(), aller = await q.locator(".menu-missions >> text=Y aller").count();
  verifier("mode cours : une mission, pas de « Y aller »", n === 1 && aller === 0);
  await q.click(".menu-missions >> text=Fermer");
  await q.screenshot({ path: `${SORTIE}/telephone_cours.png` });
}

(async () => {
  const navigateur = await chromium.launch();
  const ctx = await navigateur.newContext({ ...devices["iPhone 13 landscape"] });
  await gestes(ctx);
  await sans_options_et_cours(ctx);
  await navigateur.close();
  console.log(echecs ? `${echecs} vérification(s) en échec` : "Toutes les vérifications sont réussies.");
  process.exit(echecs ? 1 : 0);
})();
