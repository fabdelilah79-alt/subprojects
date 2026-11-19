// Usage : node sans_geste.js. Liste les missions sans aucune étape de manipulation (elles finiraient dès l'ouverture en mode
// cours) dans missions_sans_geste.json, lu par ajouter.py, qui ne les met pas au manifeste.
const { chromium } = require('playwright'); const fs = require('fs');
const D = '/home/user/subprojects/prof-ia/contenu/ressources/laboratoires/';
(async () => {
  const b = await chromium.launch(); const sortie = [];
  for (const f of fs.readdirSync(D).filter((x) => x.endsWith('.html'))) {
    const p = await b.newPage(); await p.goto('file://' + D + f); await p.waitForTimeout(300);
    const r = await p.evaluate(() => Labo.missions.etat().missions.filter((m) => m.etapes.every((e) => e.question)).map((m) => m.id));
    for (const id of r) sortie.push(f.replace('.html', '') + '__' + id); await p.close();
  }
  fs.writeFileSync(__dirname + '/missions_sans_geste.json', JSON.stringify(sortie, null, 1) + '\n'); console.log(sortie.length, 'missions sans geste'); await b.close();
})();
