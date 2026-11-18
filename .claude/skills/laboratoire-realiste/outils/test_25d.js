// Test automatique du guide 2,5D (GUIDE_25D.md, § 8) sur le banc d'essai : vue, lumière, ombres, physique des liquides.
// Usage (depuis outils/) : node test_25d.js [capture.png]. Affiche une ligne par règle (RÉUSSI / ÉCHEC) ; code de sortie 1 si un échec.
let chromium;
try { ({ chromium } = require('playwright')); } catch (e) { ({ chromium } = require('/opt/node22/lib/node_modules/playwright')); }
const regles = require('./test_25d_regles.js');

(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1024, height: 700 } }); const erreurs = [];
  p.on('pageerror', (e) => erreurs.push(e.message));
  await p.goto('file://' + __dirname + '/banc_25d.html'); await p.waitForTimeout(700);
  const resultats = [];
  for (const [nom, regle] of Object.entries(regles)) {
    try { resultats.push({ nom, ...(await p.evaluate(regle)) }); } catch (e) { resultats.push({ nom, ok: false, detail: e.message.split('\n')[0] }); }
  }
  if (process.argv[2]) await p.screenshot({ path: process.argv[2] });
  for (const r of resultats) console.log(`${r.ok ? 'RÉUSSI' : 'ÉCHEC '}  ${r.nom.padEnd(30)} ${r.detail}`);
  if (erreurs.length) console.log('ERREURS DE LA PAGE :', erreurs);
  const echecs = resultats.filter((r) => !r.ok).length + erreurs.length;
  console.log(echecs ? `${echecs} échec(s)` : 'Tout est conforme au guide 2,5D.');
  await b.close();
  process.exit(echecs ? 1 : 0);
})();
