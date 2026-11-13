// Régression du montage à reflux (poste_synthese.js) : réactifs, reflux, réfrigérant rangé DERRIÈRE le récepteur, versement.
// Lancer : PAILLASSE=1 XS=500,570,640 FAIT=reflux_savon PONCE=700 node lancer.js <page> ./regression_reflux.js capture.png
// Variables : PAILLASSE (numéro), XS (abscisses des béchers de réactifs, séparées par des virgules), FAIT, PONCE (x du flacon).
const O = __dirname + '/';
const { attendre, glisser } = require(O + 'outils_test.js');
const { verser, aller } = require(O + 'outils_verser.js');
const S = process.env.SORTIE || require('os').tmpdir(), N = Number(process.env.PAILLASSE), F = process.env.FAIT;
const note = (page) => page.evaluate((c) => window.notes[c] ?? null, F);
const ordre = (page) => page.evaluate(() => { const vis = (e) => { const r = e.getBoundingClientRect(); return r.x > -50 && r.x < 1024; }; const ref = [...document.querySelectorAll('.refrigerant')].find(vis), rec = [...document.querySelectorAll('.recipient-recepteur')].find(vis); return ref && rec && ref.parentNode === rec.parentNode ? ([...ref.parentNode.children].indexOf(ref) < [...ref.parentNode.children].indexOf(rec) ? 'derriere' : 'devant') : 'inconnu'; });
module.exports = async (page) => {
  await page.evaluate(() => { const n = Labo.missions.noter; window.notes = {}; Labo.missions.noter = (c, v) => { window.notes[c] = v; return n(c, v); }; });
  await aller(page, N); await attendre(page, 600);
  await page.mouse.click(300, 94); await attendre(page, 300); await page.mouse.click(389, 108); await attendre(page, 300);
  for (const x of process.env.XS.split(',').map(Number)) { await verser(page, glisser, [x, 545], [360, 215], 7000); await page.mouse.click(360, 215); await attendre(page, 800); }
  await glisser(page, Number(process.env.PONCE), 546, 330, 250, 30); await attendre(page, 800);
  await glisser(page, 330, 262, 175, 352, 30); await attendre(page, 500);
  console.log('avant', await ordre(page));
  await glisser(page, 600, 440, 100, 307, 30); await attendre(page, 500);
  await page.mouse.click(616, 369); await attendre(page, 300); await page.mouse.click(348, 531); await attendre(page, 300); await page.mouse.click(594, 195);
  for (let k = 0; k < 60 && (await note(page)).avance < 1; k++) await attendre(page, 1000);
  console.log('reflux', JSON.stringify(await note(page)));
  await page.mouse.click(348, 531); await attendre(page, 14000);
  await glisser(page, 330, 160, 830, 290, 30); await attendre(page, 600);
  console.log('range', JSON.stringify((await note(page)).refrigerant), await ordre(page));
  await verser(page, glisser, [345, 395], [770, 468], 8000, 1, { dx: 19, dy: 16, angle: 165 }); await attendre(page, 3000);
  await page.screenshot({ path: `${S}/reg_${F}.png` });
  console.log('verse', JSON.stringify(await note(page)));
};
