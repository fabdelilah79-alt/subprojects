// Gestes du kit circuit : tirer un fil d'une borne à une autre ; déplacer le bout d'un fil posé ; toucher un appareil.
const attendre = (page, ms) => page.waitForTimeout(ms);
async function tirer(page, x1, y1, x2, y2, pas = 14) {
  await page.mouse.move(x1, y1); await page.mouse.down();
  for (let i = 1; i <= pas; i++) await page.mouse.move(x1 + (x2 - x1) * i / pas, y1 + (y2 - y1) * i / pas);
  await page.mouse.up(); await attendre(page, 250);
}
const brancher = (page, A, B) => tirer(page, A[0], A[1] - 6, B[0], B[1] - 6);
async function bout_de_fil(page, A) {
  // Point du câble (à l'écran) à environ 26 px de la borne A, sur un fil visible branché en A.
  return page.evaluate(([ax, ay]) => {
    for (const p of document.querySelectorAll('path.fil')) {
      const m = p.getScreenCTM(), L = p.getTotalLength(), ecran = (q) => ({ x: m.a * q.x + m.c * q.y + m.e, y: m.b * q.x + m.d * q.y + m.f });
      const debut = ecran(p.getPointAtLength(0)), fin = ecran(p.getPointAtLength(L));
      if (debut.x < 0 || debut.x > innerWidth) continue;
      for (const [b, sens] of [[debut, 1], [fin, -1]]) if (Math.abs(b.x - ax) < 3 && b.y < ay && ay - b.y < 60) {
        for (let l = 10; l < L / 2; l += 2) { const q = ecran(p.getPointAtLength(sens > 0 ? l : L - l)); if (Math.hypot(q.x - ax, q.y - (ay - 6)) > 16) return { q, b }; }
      }
    }
    return null;
  }, A);
}
async function deplacer_fil(page, A, B) {
  // Débranche de A le fil le plus proche et rebranche ce bout en B (B nul : le fil est rangé).
  const r = await bout_de_fil(page, A);
  if (!r) throw new Error('aucun fil en ' + A);
  const d = B ? { x: B[0] + (r.q.x - A[0]), y: B[1] + (r.q.y - A[1]) } : { x: r.q.x + 60, y: 560 };
  await tirer(page, r.q.x, r.q.y, d.x, d.y, 16);
}
const toucher = async (page, x, y) => { await page.mouse.click(x, y); await attendre(page, 250); };
const milieu_fil = (page, A) => page.evaluate(([ax, ay]) => {
  // Milieu (à l'écran) d'un fil visible branché en A.
  for (const p of document.querySelectorAll('path.fil')) {
    const m = p.getScreenCTM(), L = p.getTotalLength(), ecran = (q) => ({ x: m.a * q.x + m.c * q.y + m.e, y: m.b * q.x + m.d * q.y + m.f });
    const d = ecran(p.getPointAtLength(0)), f = ecran(p.getPointAtLength(L));
    if (d.x < 0 || d.x > innerWidth) continue;
    if ([d, f].some((b) => Math.abs(b.x - ax) < 3 && b.y < ay && ay - b.y < 60)) return ecran(p.getPointAtLength(L / 2));
  }
  return null;
}, A);
const NOMS = ['OFF', '2V', '20V', '200V', '2V~', '20V~', '20mA~', '200mA~', '2mA', '20mA', '200mA', '10A', '200Ω', '2kΩ', '20kΩ', '200kΩ'];
const ANGLES = Object.fromEntries(NOMS.map((n, k) => [n, k * 360 / 16]));
function multimetre(x, y) {
  // Bornes et repères du commutateur d'un multimètre posé en (x, y).
  const r = { '10A': [x + 22, y + 212], mA: [x + 57, y + 212], COM: [x + 93, y + 212], V: [x + 128, y + 212], calibre: {} };
  for (const [k, a] of Object.entries(ANGLES)) r.calibre[k] = [x + 75 + 46 * Math.sin(a * Math.PI / 180), y + 128 - 46 * Math.cos(a * Math.PI / 180)];
  return r;
}
module.exports = { brancher, deplacer_fil, toucher, tirer, milieu_fil, multimetre };
