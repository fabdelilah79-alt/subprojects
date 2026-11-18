// Règles du guide 2,5D, chacune exécutée dans la page du banc d'essai (window.Labo, window.banc) ; renvoie { ok, detail }.
// Utilisé par test_25d.js. Seuils : GUIDE_25D.md, § 8.
module.exports = {
  'ovales : même rapport k': () => {
    // Pour trois hauteurs de regard : dessus du cylindre et surface du liquide ont ry/rx = k (± 3 %), ombres k × 1,1 à 1,4.
    const ecarts = [];
    for (const k of [0.12, 0.26, 0.35]) {
      banc.regler({ k }); banc.recipients.becher.dessiner();
      const r = (el) => +el.getAttribute('ry') / +el.getAttribute('rx');
      const dessus = r(document.querySelector('.cylindre-25d .face-dessus')), surface = r(document.querySelector('.recipient-becher .surface-liquide'));
      const ombres = [...document.querySelectorAll('.ombre-posee')].map(r);
      ecarts.push(Math.abs(dessus / k - 1), Math.abs(surface / k - 1), ...ombres.map((o) => (o / k >= 1.1 && o / k <= 1.4 ? 0 : 1)));
    }
    banc.regler({ k: 0.26 });
    const pire = Math.max(...ecarts);
    return { ok: pire <= 0.03, detail: `écart le plus grand : ${(pire * 100).toFixed(1)} % (k = 0,12 ; 0,26 ; 0,35)` };
  },

  'lumière : dessus > face > côté': () => {
    // Clarté des trois faces de la boîte (lumière venant d'en haut à gauche).
    const clarte = (c) => { const [r, g, b] = c.match(/\d+/g).map(Number); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
    const f = (cl) => clarte(document.querySelector(`.boite-25d .${cl}`).getAttribute('fill'));
    const [d, a, c] = [f('face-dessus'), f('face-avant'), f('face-cote')];
    return { ok: d > a && a > c, detail: `clarté dessus ${d.toFixed(0)}, face ${a.toFixed(0)}, côté ${c.toFixed(0)}` };
  },

  'ombres posées': () => {
    // Chaque boîte et chaque cylindre a son ombre, sous son pied (dernier quart de sa hauteur), décalée vers la droite.
    const objets = [...document.querySelectorAll('.boite-25d, .cylindre-25d')], manque = [];
    for (const o of objets) {
      const om = o.querySelector('.ombre-posee'), corps = o.querySelector('.face-avant, .corps')?.getBBox();
      if (!om || !corps || +om.getAttribute('cx') <= corps.x + corps.width / 2 || +om.getAttribute('cy') < corps.y + 0.75 * corps.height) manque.push(o.getAttribute('class'));
    }
    return { ok: objets.length > 0 && !manque.length, detail: `${objets.length} objets, sans ombre correcte : ${manque.join(', ') || 'aucun'}` };
  },

  'liquide : volume → niveau': () => {
    // Récipients droits, 10 à 90 % de la plus grande graduation : niveau du moteur = hauteur_de(V) à 0,5 mm près.
    const G = Labo.geometrie; let pire = 0, n = 0;
    for (const nom of ['becher_250', 'erlenmeyer_250', 'eprouvette_50', 'ballon_250', 'fiole_jaugee_100']) {
      const pr = Labo.profil(nom), Vmax = pr.graduations.length ? pr.graduations[pr.graduations.length - 1].v : pr.volume_de(G.aire(pr.interieur)) * 0.8;
      for (let f = 0.1; f < 0.95; f += 0.2) {
        const V = Vmax * f, s = G.niveau(pr.interieur, { x: 0, y: -1 }, pr.aire_de(V)).s;
        pire = Math.max(pire, Math.abs(s - pr.hauteur_de(V))); n++;
      }
    }
    return { ok: pire <= 0.5, detail: `${n} mesures, écart le plus grand ${pire.toFixed(2)} mm` };
  },

  'liquide : surface et volume penchés': () => {
    // Erlenmeyer penché de 0 à 40° (liquide au repos) : surface horizontale (± 0,5°) et aire conservée (± 1 %).
    const r = banc.recipients.erlen, G = Labo.geometrie; let angle_max = 0, ecart_max = 0;
    for (let a = 0; a <= 40; a += 10) {
      banc.regler({ angle: a }); for (let i = 0; i < 300; i++) r.pas(0.02);
      const e = r.etat(), s = e.surface.map((q) => G.transformer([{ x: q.x, y: -q.y }], r.pose)[0]);
      angle_max = Math.max(angle_max, Math.abs((Math.atan2(s[1].y - s[0].y, s[1].x - s[0].x) * 180) / Math.PI));
      const aire = e.regions.reduce((t, ph) => t + G.aire(ph.poly), 0);
      ecart_max = Math.max(ecart_max, Math.abs(aire / r.pr.aire_de(r.c.volume()) - 1));
    }
    banc.regler({ angle: 0 });
    return { ok: angle_max <= 0.5 && ecart_max <= 0.01, detail: `surface penchée au plus de ${angle_max.toFixed(2)}°, aire à ${(ecart_max * 100).toFixed(2)} %` };
  },

  'liquide : débordement à la lèvre': () => {
    // On penche peu à peu le bécher : il commence à couler quand la surface atteint la lèvre la plus basse (± 1,5°).
    const r = banc.recipients.becher, G = Labo.geometrie; banc.regler({ V: 150 }); banc.sorties.length = 0;
    let prevu = null, observe = null;
    for (let a = 0; a <= 80 && observe === null; a += 0.5) {
      r.pose.angle = -a;
      // Prévision géométrique avant le pas (ensuite le liquide en trop est déjà parti) : surface au-dessus de la lèvre.
      const u = r.normale(), lev = [r.pr.levres.g, r.pr.levres.d].sort((p, q) => G.pv(u, p) - G.pv(u, q))[0];
      const s = G.niveau(r.pr.interieur, u, r.pr.aire_de(r.c.volume())).s;
      if (prevu === null && s - G.pv(u, lev) > 0.05) prevu = a;
      for (let i = 0; i < 40; i++) r.pas(0.02);
      if (banc.sorties.some((x) => x.id === 'becher')) observe = a;
    }
    r.pose.angle = 0; banc.regler({ V: 120 });
    return { ok: prevu !== null && observe !== null && Math.abs(observe - prevu) <= 1.5, detail: `prévu à ${prevu}°, observé à ${observe}°` };
  },

  'liquide : ballottement amorti': async () => {
    // Coup horizontal sur l'éprouvette : la surface penche (> 3°), puis revient à l'horizontale (< 0,5° après 2 s).
    const r = banc.recipients.eprouvette; banc.secouer(); let maxi = 0;
    for (let i = 0; i < 100; i++) { r.pas(0.02); maxi = Math.max(maxi, Math.abs(r.phi) * 57.3); }
    const fin = Math.abs(r.phi) * 57.3;
    return { ok: maxi > 3 && fin < 0.5, detail: `inclinaison maximale ${maxi.toFixed(1)}°, après 2 s ${fin.toFixed(2)}°` };
  },
};
