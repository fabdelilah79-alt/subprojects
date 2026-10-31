// Outils communs des parcours : gestes, tablette, carnet, état des missions.
const attendre = (page, ms) => page.waitForTimeout(ms);
async function glisser(page, x1, y1, x2, y2, pas = 12) {
  await page.mouse.move(x1, y1); await page.mouse.down();
  for (let i = 1; i <= pas; i++) await page.mouse.move(x1 + (x2 - x1) * i / pas, y1 + (y2 - y1) * i / pas);
  await page.mouse.up(); await attendre(page, 350);
}
const etat = (page) => page.evaluate(() => { const e = Labo.missions.etat(); return e.missions.map(m => `${m.id}:${m.accomplie ? 'OK' : 'étape ' + (m.etape + 1)}`).join(' ') + ' ' + JSON.stringify(e.messages); });
async function tableur(page, valeurs) {
  await page.evaluate(() => Labo.tablette.lever()); await attendre(page, 650);
  await page.click('.tablette-onglet[data-app="tableur"]');
  for (const [cle, v] of valeurs) { await page.click(`.tableur-feuille:not([hidden]) input[aria-label="Cellule ${cle}"]`); await page.keyboard.press('Control+A'); await page.keyboard.type(v); await page.keyboard.press('Enter'); }
  await page.click('.tablette-onglet[data-app="courbe"]'); await attendre(page, 500);
  await page.evaluate(() => Labo.tablette.poser()); await attendre(page, 650);
}
async function repondre(page, texte) {
  await page.evaluate(() => Labo.carnet.ouvrir()); await attendre(page, 650);
  if (texte.startsWith('#')) await page.click(`.carnet-etapes li.courante .carnet-choix >> nth=${texte.slice(1)}`);
  else { await page.fill('.carnet-reponse input', texte); await page.click('.carnet-reponse .carnet-bouton'); }
  await attendre(page, 300);
  await page.evaluate(() => Labo.carnet.fermer()); await attendre(page, 650);
}
const v = (x) => String(x).replace('.', ',');
module.exports = { attendre, glisser, etat, tableur, repondre, v };
async function courbe_xy(page, x, y) {
  await page.evaluate(() => Labo.tablette.lever()); await page.waitForTimeout(650);
  await page.click('.tablette-onglet[data-app="courbe"]');
  await page.selectOption('.courbe-barre select[aria-label="Ordonnée"]', y);
  await page.selectOption('.courbe-barre select[aria-label="Abscisse"]', x);
  await page.waitForTimeout(400);
  await page.evaluate(() => Labo.tablette.poser()); await page.waitForTimeout(650);
}
async function recopier(page, cle) {
  await page.evaluate(() => Labo.tablette.lever()); await page.waitForTimeout(650);
  await page.click('.tablette-onglet[data-app="tableur"]');
  await page.click(`.tableur-feuille:not([hidden]) input[aria-label="Cellule ${cle}"]`);
  await page.click('.tableur-feuille:not([hidden]) >> text=Recopier vers le bas');
  await page.click('.tablette-onglet[data-app="courbe"]'); await page.waitForTimeout(400);
  await page.evaluate(() => Labo.tablette.poser()); await page.waitForTimeout(650);
}
async function mission_suivante(page) {
  await page.evaluate(() => Labo.carnet.ouvrir()); await page.waitForTimeout(650);
  await page.click('text=Passer à la mission'); await page.waitForTimeout(1200);
  await page.evaluate(() => Labo.carnet.fermer()); await page.waitForTimeout(650);
}
Object.assign(module.exports, { courbe_xy, recopier, mission_suivante });
