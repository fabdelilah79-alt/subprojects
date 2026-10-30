// Tableau de tri dans les tests : fait glisser chaque étiquette, repérée par le début de son texte, vers le haut de sa colonne.
// colonnes : { "début du texte": numéro de colonne } ; r : { x, y, largeur, n (nombre de colonnes) } du tableau.
module.exports = async (page, colonnes, r) => {
  for (const [texte, c] of Object.entries(colonnes)) {
    const b = await page.evaluate((t) => { const e = [...document.querySelectorAll('.etiquette-tri')].find((q) => q.getBoundingClientRect().width > 0 && [...q.querySelectorAll('text')].map((x) => x.textContent).join(' ').startsWith(t)); const q = e.getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2 }; }, texte);
    const cx = r.x + (r.largeur / r.n) * (c + 0.5), cy = r.y + 80;
    await page.mouse.move(b.x, b.y); await page.mouse.down();
    for (let k = 1; k <= 8; k++) await page.mouse.move(b.x + (cx - b.x) * k / 8, b.y + (cy - b.y) * k / 8);
    await page.mouse.up(); await page.waitForTimeout(150);
  }
};
