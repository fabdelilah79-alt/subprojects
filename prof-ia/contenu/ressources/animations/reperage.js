/*
Rôle : faire fonctionner la simulation de repérage : G se déplace sur le cercle, θ et s se mettent à jour.
Reçoit : le rayon R (curseur), la position de G (glisser ou clavier), les cases à cocher.
Produit : le dessin (axe, cercle, angle θ, arc s) et les mesures : θ en ° et en rad, s = R·θ.
Utilisé par : reperage.html.
*/
import { curseur, el, nombre, position_svg } from "./commun/outils.js";

const svg = document.querySelector("svg");
const O = { x: 250, y: 205 };
const PIXELS_PAR_CM = 20;
const etat = { theta: (50 * Math.PI) / 180, rayon_cm: 6, glisse: false };
const dessin = el("g", {}, svg);
const poignee = el("circle", { r: 13, fill: "var(--jaune)", tabindex: 0, role: "slider", "aria-label": "Point G" }, svg);

const sur_cercle = (r, angle) => ({ x: O.x + r * Math.cos(angle), y: O.y - r * Math.sin(angle) });

function chemin_arc(r, debut, fin) {
  // Chemin SVG d'un arc de cercle de centre O, parcouru dans le sens trigonométrique.
  const a = sur_cercle(r, debut);
  const b = sur_cercle(r, fin);
  const grand = fin - debut > Math.PI ? 1 : 0;
  return `M ${a.x} ${a.y} A ${r} ${r} 0 ${grand} 0 ${b.x} ${b.y}`;
}

function texte(x, y, contenu, couleur = "var(--craie)") {
  // Écrit une étiquette dans le dessin.
  const t = el("text", { x, y, fill: couleur, "font-size": 20, "text-anchor": "middle", "dominant-baseline": "middle" }, dessin);
  t.textContent = contenu;
}

function dessiner_base(r) {
  // Dessine l'axe Ox, le cercle, les points O et A.
  el("line", { x1: 20, y1: O.y, x2: 620, y2: O.y, stroke: "var(--craie-douce)", "stroke-width": 2 }, dessin);
  el("path", { d: `M 620 ${O.y} l -12 -6 l 0 12 z`, fill: "var(--craie-douce)" }, dessin);
  texte(612, O.y + 22, "x", "var(--craie-douce)");
  el("circle", { cx: O.x, cy: O.y, r, fill: "none", stroke: "var(--craie)", "stroke-width": 2 }, dessin);
  el("circle", { cx: O.x, cy: O.y, r: 5, fill: "var(--craie)" }, dessin);
  texte(O.x - 14, O.y + 20, "O");
  el("circle", { cx: O.x + r, cy: O.y, r: 5, fill: "var(--craie)" }, dessin);
  texte(O.x + r + 14, O.y + 20, "A");
}

function dessiner_mesures_graphiques(r) {
  // Dessine l'angle θ (bleu) et l'arc s (jaune), si leurs cases sont cochées.
  if (document.getElementById("voir-angle").checked) {
    el("path", { d: chemin_arc(34, 0, etat.theta), fill: "none", stroke: "var(--bleu)", "stroke-width": 3 }, dessin);
    const t = sur_cercle(52, etat.theta / 2);
    texte(t.x, t.y, "θ", "var(--bleu)");
  }
  if (document.getElementById("voir-arc").checked) {
    el("path", { d: chemin_arc(r, 0, etat.theta), fill: "none", stroke: "var(--jaune)", "stroke-width": 6 }, dessin);
    const t = sur_cercle(r + 24, etat.theta / 2);
    texte(t.x, t.y, "s", "var(--jaune)");
  }
}

function afficher_mesures() {
  // Écrit θ en degrés et en radians, puis s = R × θ.
  const degres = (etat.theta * 180) / Math.PI;
  const s = etat.rayon_cm * etat.theta;
  document.getElementById("mesures").innerHTML =
    `θ = <strong>${nombre(degres, 0)}°</strong> = <strong>${nombre(etat.theta, 2)} rad</strong>` +
    ` &nbsp;·&nbsp; s = R × θ = ${nombre(etat.rayon_cm, 1)} cm × ${nombre(etat.theta, 2)} rad = <strong>${nombre(s, 2)} cm</strong>`;
  poignee.setAttribute("aria-valuetext", `θ = ${nombre(degres, 0)} degrés`);
}

function dessiner() {
  // Redessine tout à partir de θ et de R.
  const r = etat.rayon_cm * PIXELS_PAR_CM;
  dessin.replaceChildren();
  dessiner_base(r);
  dessiner_mesures_graphiques(r);
  const g = sur_cercle(r, etat.theta);
  el("line", { x1: O.x, y1: O.y, x2: g.x, y2: g.y, stroke: "var(--craie)", "stroke-width": 2 }, dessin);
  poignee.setAttribute("cx", g.x);
  poignee.setAttribute("cy", g.y);
  texte(sur_cercle(r + 30, etat.theta).x, sur_cercle(r + 30, etat.theta).y, "G", "var(--jaune)");
  afficher_mesures();
}

function placer_g(evenement) {
  // Place G sur le cercle, dans la direction du pointeur ; θ reste entre 0 et 2π.
  const p = position_svg(svg, evenement);
  const angle = Math.atan2(O.y - p.y, p.x - O.x);
  etat.theta = angle < 0 ? angle + 2 * Math.PI : angle;
  dessiner();
}

function deplacer_au_clavier(evenement) {
  // Flèches : G avance ou recule d'un degré.
  const pas = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1 }[evenement.key];
  if (!pas) return;
  evenement.preventDefault();
  const tour = 2 * Math.PI;
  etat.theta = (((etat.theta + (pas * Math.PI) / 180) % tour) + tour) % tour;
  dessiner();
}

svg.addEventListener("pointerdown", (e) => { etat.glisse = true; svg.setPointerCapture(e.pointerId); placer_g(e); });
svg.addEventListener("pointermove", (e) => { if (etat.glisse) placer_g(e); });
svg.addEventListener("pointerup", () => { etat.glisse = false; });
poignee.addEventListener("keydown", deplacer_au_clavier);
document.getElementById("voir-angle").addEventListener("change", dessiner);
document.getElementById("voir-arc").addEventListener("change", dessiner);
curseur("rayon", (v) => `${nombre(v, 1)} cm`, (v) => { etat.rayon_cm = v; dessiner(); });
