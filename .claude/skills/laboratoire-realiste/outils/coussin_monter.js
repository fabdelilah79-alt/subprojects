// Appuie sur « Enregistrer » (τ choisi), prend le mobile, le place en bas au milieu, puis le lance vers le fond (vy < 0).
module.exports = async (page, vy = -7) => {
  if (await page.isVisible('.carnet-fermer')) { await page.click('.carnet-fermer'); await page.waitForTimeout(600); }
  await page.mouse.click(938, 448); await page.waitForTimeout(150);
  const ecran = (x, y) => page.evaluate(([x, y]) => Labo.CoussinAir.vers_ecran(x, y), [x, y]);
  const mobile = await page.evaluate(() => { const r = document.querySelector('.mobile-autoporteur ellipse:nth-of-type(2)').getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
  const bas = await ecran(300, 330);
  await page.mouse.move(mobile.x, mobile.y); await page.mouse.down();
  for (let i = 1; i <= 12; i++) await page.mouse.move(mobile.x + (bas.x - mobile.x) * i / 12, mobile.y + (bas.y - 6 - mobile.y) * i / 12);
  await page.waitForTimeout(200);
  for (let i = 1; i <= 6; i++) { await page.mouse.move(bas.x, bas.y - 6 + i * vy); await page.waitForTimeout(16); }
  await page.mouse.up();
  await page.waitForTimeout(2600);
};
