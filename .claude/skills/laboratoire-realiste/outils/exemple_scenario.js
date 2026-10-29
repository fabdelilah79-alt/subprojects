// Exemple de scénario de test (b2_meca1_a1_vecteurs) : enregistrement, flèches sur la feuille, tableur, courbe, réponses du carnet.
const { attendre, etat, tableur, repondre, mission_suivante } = require('./outils_test.js');
const note = (page, c) => page.evaluate((c) => window.notes[c] ?? null, c);
const d = (a, b) => Math.hypot(b.x - a.x, b.y - a.y), vg = (x, n = 3) => String(Math.round(x * 10 ** n) / 10 ** n).replace('.', ',');
async function fleche(page, pts, i, tau) {
  const l = d(pts[i - 1], pts[i + 1]), u = { x: (pts[i + 1].x - pts[i - 1].x) / l, y: (pts[i + 1].y - pts[i - 1].y) / l }, v = l / 1000 / (2 * tau);
  const o = { x: 152 + pts[i].x * 1.2, y: 22 + pts[i].y * 1.2 }, depart = { x: o.x + 12 * 1.2, y: o.y };
  const arrivee = { x: o.x + u.x * v * 100 * 1.2, y: o.y + u.y * v * 100 * 1.2 };
  await page.mouse.move(depart.x, depart.y); await page.mouse.down();
  for (let k = 1; k <= 10; k++) await page.mouse.move(depart.x + (arrivee.x - depart.x) * k / 10, depart.y + (arrivee.y - depart.y) * k / 10);
  await page.mouse.up(); await attendre(page, 200);
}
module.exports = async (page) => {
  await page.evaluate(() => { const n = Labo.missions.noter; window.notes = {}; Labo.missions.noter = (c, v) => { window.notes[c] = v; return n(c, v); }; });
  await require('./coussin_monter.js')(page);
  let e = await note(page, 'enregistrement'); const pts = e.points, tau = e.tau_s, s = pts.reduce((k, q, i) => (q.y < pts[k].y ? i : k), 0);
  console.log('points', pts.length, 'sommet', s, 'tau', tau, await etat(page)); await page.screenshot({ path: 'n1_table.png' });
  await page.mouse.click(300, 500); await attendre(page, 500);
  for (const i of [2, 4]) await fleche(page, pts, i, tau);
  await page.screenshot({ path: 'n1_feuille.png' });
  await page.click('.reposer-feuille >> visible=true'); await attendre(page, 300); console.log(await etat(page));
  await repondre(page, '#0');
  const v = (i) => d(pts[i - 1], pts[i + 1]) / 1000 / (2 * tau), lignes = [];
  [1, 2, 3, 4, 5, 6].filter((i) => i < s).forEach((i, k) => lignes.push(['A' + (k + 2), vg(i * tau)], ['B' + (k + 2), vg(v(i))]));
  await tableur(page, lignes);
  await page.evaluate(() => Labo.tablette.lever()); await attendre(page, 650);
  await page.click('.tablette-onglet[data-app="courbe"]');
  await page.selectOption('.courbe-barre select[aria-label="Abscisse"]', 'A'); await page.selectOption('.courbe-barre select[aria-label="Ordonnée"]', 'B');
  await page.click('.courbe-barre button:has-text("y = a·x + b")'); await attendre(page, 800); await page.screenshot({ path: 'n1_courbe.png' });
  const c = await note(page, 'courbe'); console.log(JSON.stringify(c));
  await page.evaluate(() => Labo.tablette.poser()); await attendre(page, 650); console.log(await etat(page));
  for (const r of ['0,49', '#0', '#0', '#0']) await repondre(page, r); console.log('FIN1', await etat(page));
  await mission_suivante(page);
  await require('./coussin_fil.js')(page);
  e = await note(page, 'enregistrement'); const c2 = e.points; console.log('mcu', c2.length, e.fil, await etat(page));
  await page.mouse.click(300, 500); await attendre(page, 500);
  for (const i of [4, 6]) await fleche(page, c2, i, e.tau_s);
  await page.screenshot({ path: 'n1_cercle.png' });
  await page.click('.reposer-feuille >> visible=true'); await attendre(page, 300); console.log(await etat(page));
  const R = d(c2[5], { x: 300, y: 200 }) / 1000, v5 = d(c2[4], c2[6]) / 1000 / (2 * e.tau_s);
  for (const r of ['#0', vg(R), vg(v5), vg(v5 * v5 / R), '#0']) await repondre(page, r); console.log('FIN2', await etat(page));
};
