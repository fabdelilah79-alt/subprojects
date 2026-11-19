// Table à coussin d'air : appuie sur « Enregistrer », monte le mobile en haut à gauche, attend, puis le lance (vx, vy en px par image ;
// 0, 0 : lâché sans élan) ; bord : décalage de la prise (px) pour saisir le mobile et non la surcharge posée dessus.
module.exports = async (page, vx = 9, vy = 0, bord = 0) => {
  if (await page.isVisible('.carnet-fermer')) { await page.click('.carnet-fermer'); await page.waitForTimeout(600); }
  await page.mouse.click(938, 448); await page.waitForTimeout(150);
  const ecran = (x, y) => page.evaluate(([x, y]) => Labo.CoussinAir.vers_ecran(x, y), [x, y]);
  const mobile = await page.evaluate(() => { const r = document.querySelector('.mobile-autoporteur ellipse:nth-of-type(2)').getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
  mobile.x += bord;
  const haut = await ecran(70, 60);
  await page.mouse.move(mobile.x, mobile.y); await page.mouse.down();
  for (let i = 1; i <= 12; i++) await page.mouse.move(mobile.x + (haut.x - mobile.x) * i / 12, mobile.y + (haut.y - 6 - mobile.y) * i / 12);
  await page.waitForTimeout(200);
  for (let i = 1; i <= 6; i++) { await page.mouse.move(haut.x + i * vx, haut.y - 6 + i * vy); await page.waitForTimeout(16); }
  await page.mouse.up();
  await page.waitForTimeout(2200);
};
