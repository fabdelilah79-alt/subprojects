// Usage : node extraire_questions.js <préfixe> [sortie.json]. Extrait les questions à choix des laboratoires (préfixe donné) où la bonne réponse est la plus longue.
const { chromium } = require('playwright'); const fs = require('fs');
const D = '/home/user/subprojects/prof-ia/contenu/ressources/laboratoires/', PREFIXE = process.argv[2] || 'b2_';
(async () => {
  const b = await chromium.launch(); const sortie = [];
  for (const f of fs.readdirSync(D).filter((x) => x.startsWith(PREFIXE) && x.endsWith('.html'))) {
    const page = await b.newPage(); await page.goto('file://' + D + f); await page.waitForTimeout(500);
    const qs = await page.evaluate(() => Labo.missions.etat().missions.flatMap((m) => m.etapes.filter((e) => e.question && e.question.type === 'choix').map((e) => ({ mission: m.id, consigne: e.consigne, options: e.question.options, bonne: e.question.bonne }))));
    for (const q of qs) { const L0 = q.options.map((o) => o.length); q.longue = L0[q.bonne] > Math.max(...L0.filter((_, i) => i !== q.bonne)); q.labo = f.replace('.html', ''); sortie.push(q); }
    await page.close();
  }
  fs.writeFileSync(process.argv[3] || `questions_${PREFIXE}.json`, JSON.stringify(sortie, null, 1));
  const par = {}; for (const q of sortie) { const k = q.labo.split('_').slice(0, 2).join('_'); par[k] = par[k] || [0, 0]; par[k][0]++; if (q.longue) par[k][1]++; }
  console.log(JSON.stringify(par)); await b.close();
})();
