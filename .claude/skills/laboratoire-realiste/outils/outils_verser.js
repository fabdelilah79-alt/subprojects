// Gestes de chimie pour les tests : verser un récipient tenu au-dessus d'une ouverture, en tournant sa poignée ;
// aller(page, n) montre la paillasse n sans finir les missions (mise au point des gestes seulement).
// verser(page, glisser, depart, cible, duree, sens, { dx, dy, angle }) : sens -1 si la cible est à gauche ; dx, dy : écart
// poignée -> lèvre (bécher de 50 mL : 52, 26 ; bécher de 250 mL : 85, 26 ; ballon de 250 mL : 19, 16, angle 165).
const attendre = (page, ms) => page.waitForTimeout(ms);
const poignee = (page) => page.evaluate(() => { const c = [...document.querySelectorAll('.poignee circle')].find((q) => { const b = q.getBoundingClientRect(); return b.width > 0 && b.x > 0 && b.x < 1024; }); if (!c) return null; const r = c.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
async function arc(page, h, pivot, delta, pas = 24) {
  // Fait tourner la poignée autour de la lèvre (pivot) de delta degrés.
  const R = Math.hypot(h.x - pivot.x, h.y - pivot.y), a0 = Math.atan2(h.y - pivot.y, h.x - pivot.x);
  await page.mouse.move(h.x, h.y); await page.mouse.down();
  for (let k = 1; k <= pas; k++) { const a = a0 + (delta * Math.PI / 180) * k / pas; await page.mouse.move(pivot.x + R * Math.cos(a), pivot.y + R * Math.sin(a)); await attendre(page, 15); }
  await page.mouse.up();
}
async function verser(page, glisser, depart, cible, duree = 2500, sens = -1, ecart = { dx: 52, dy: 26 }) {
  // Porte le récipient au-dessus de la cible, l'incline, attend, puis le redresse (toucher).
  await glisser(page, depart[0], depart[1], cible[0], cible[1], 30); await attendre(page, 600);
  const h = await poignee(page); if (!h) { console.log('pas de poignée'); return false; }
  const pivot = { x: h.x + sens * ecart.dx, y: h.y + ecart.dy };
  const A = ecart.angle || 110; await arc(page, h, pivot, sens < 0 ? -A : A);
  for (let n = 0; n < 2; n++) { const q = await poignee(page); if (q && Math.hypot(q.x - h.x, q.y - h.y) < 5) { await attendre(page, 500); await arc(page, h, pivot, sens < 0 ? -A : A); } } await attendre(page, duree);
  const h2 = await poignee(page); await arc(page, h2, pivot, sens < 0 ? A : -A); await attendre(page, 400);
  return true;
}
const aller = (page, n) => page.evaluate((n) => { const cam = document.querySelector('[clip-path="url(#cadre-paillasse)"]').parentNode; cam.dataset.x = -1024 * n; cam.setAttribute('transform', `translate(${-1024 * n} 0)`); }, n);
module.exports = { verser, arc, poignee, aller };
