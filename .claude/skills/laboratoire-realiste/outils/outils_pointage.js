// Pointage vidéo dans les tests : étalonnage sur l'étalon filmé, origine (point donné en mètres), pointage de l'objet sur les images ks, export.
const bouton = (page, i) => page.click(`.pointage-${i} >> visible=true`);
async function cliquer_m(page, nom, p) {
  const e = await page.evaluate(([n, p]) => Labo.pointages[n].m(p.x, p.y), [nom, p]);
  await page.mouse.click(e.x, e.y); await page.waitForTimeout(120);
}
async function pointer(page, ks, { nom = 'pointage', origine = null, exporter = true } = {}) {
  const v = await page.evaluate((n) => { const s = Labo.pointages[n].etat; return { a: s.video.etalon.a, b: s.video.etalon.b }; }, nom);
  await bouton(page, 2); await cliquer_m(page, nom, v.a); await cliquer_m(page, nom, v.b);
  await bouton(page, 3); await cliquer_m(page, nom, origine || await page.evaluate((n) => Labo.pointages[n].etat.video.objet(0), nom));
  for (const k of ks) {
    await page.evaluate(([n, k]) => { Labo.pointages[n].etat.k = k; }, [nom, k]);
    await cliquer_m(page, nom, await page.evaluate(([n, k]) => Labo.pointages[n].etat.video.objet(k), [nom, k]));
  }
  if (exporter) { await bouton(page, 5); await page.waitForTimeout(300); }
}
module.exports = { pointer, cliquer_m };
