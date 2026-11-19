// Table à coussin d'air avec fil : accroche l'anneau au mobile visible, enregistre, lance : mouvement circulaire uniforme.
module.exports = async (page) => {
  if (await page.isVisible('.carnet-fermer')) { await page.click('.carnet-fermer'); await page.waitForTimeout(600); }
  const ecran = (x, y) => page.evaluate(([x, y]) => Labo.CoussinAir.vers_ecran(x, y), [x, y]);
  const anneau = await page.evaluate(() => { const r = [...document.querySelectorAll('.anneau-fil')].find((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.x > 0 && r.x < innerWidth; }).getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
  const mobile = await page.evaluate(() => { const r = [...document.querySelectorAll('.mobile-autoporteur ellipse:nth-of-type(2)')].find((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.x > 0 && r.x < innerWidth; }).getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
  await page.mouse.move(anneau.x, anneau.y); await page.mouse.down();
  for (let i = 1; i <= 12; i++) await page.mouse.move(anneau.x + (mobile.x - anneau.x) * i / 12, anneau.y + (mobile.y - 8 - anneau.y) * i / 12);
  await page.mouse.up(); await page.waitForTimeout(300);
  await page.screenshot({ path: 'm4_fil.png' });
  await page.mouse.click(938, 448); await page.waitForTimeout(150);
  const depart = await ecran(300, 330);
  const m2 = await page.evaluate(() => { const r = [...document.querySelectorAll('.mobile-autoporteur ellipse:nth-of-type(2)')].find((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.x > 0 && r.x < innerWidth; }).getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
  await page.mouse.move(m2.x, m2.y); await page.mouse.down();
  for (let i = 1; i <= 10; i++) await page.mouse.move(m2.x + (depart.x - m2.x) * i / 10, m2.y + (depart.y - 6 - m2.y) * i / 10);
  await page.waitForTimeout(200);
  for (let i = 1; i <= 6; i++) { await page.mouse.move(depart.x + i * 9, depart.y - 6); await page.waitForTimeout(16); }
  await page.mouse.up(); await page.waitForTimeout(2300);
  await page.screenshot({ path: 'm4_mcu.png' });
};
