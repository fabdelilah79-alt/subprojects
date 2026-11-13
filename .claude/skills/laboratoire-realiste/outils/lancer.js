// Lance une page de laboratoire dans Chromium (1024 × 640), joue un scénario de test, fait une capture, liste les erreurs.
// Usage : node lancer.js <fichier .html ou sources/<id>/page.html> <scenario.js> <capture.png>
let chromium;
try { ({ chromium } = require('playwright')); } catch (e) { ({ chromium } = require('/opt/node22/lib/node_modules/playwright')); }
(async () => {
  const [fichier, scenario, sortie] = process.argv.slice(2);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1024, height: 640 } });
  const erreurs = [];
  page.on('pageerror', e => erreurs.push(e.message));
  page.on('console', m => { if (m.type() === 'error') erreurs.push(m.text()); });
  const messages = [];
  await page.exposeFunction('noterMessage', (m) => messages.push(m.type));
  await page.addInitScript(() => { window.addEventListener('message', (e) => window.noterMessage(e.data)); });
  await page.goto(fichier.startsWith('file:') ? fichier : 'file:///home/user/subprojects/prof-ia/contenu/ressources/laboratoires/' + fichier);
  await page.waitForTimeout(700);
  // Appuis réalistes : le bouton reste enfoncé 150 ms (comme un vrai doigt ou une vraie souris).
  const cliquer = page.mouse.click.bind(page.mouse);
  page.mouse.click = (x, y, o = {}) => cliquer(x, y, { delay: 150, ...o });
  const cliquer_element = page.click.bind(page);
  page.click = (sel, o = {}) => cliquer_element(sel, { delay: 150, ...o });
  await page.click('.carnet-fermer'); await page.waitForTimeout(650);
  await require(require('path').resolve(scenario))(page);
  await page.screenshot({ path: sortie });
  console.log('ERREURS :', erreurs.length ? erreurs : 'aucune');
  await browser.close();
})();
