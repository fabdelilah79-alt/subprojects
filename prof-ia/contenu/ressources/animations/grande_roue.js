/*
Rôle : animer la grande roue : les bras tournent autour de l'axe, les nacelles restent droites.
Reçoit : les commandes de grande_roue.html.
Produit : le dessin de la roue à chaque image, les trajectoires et les positions marquées.
Utilisé par : grande_roue.html.
Physique : chaque bras est en rotation autour de l'axe (Δ) ; chaque nacelle est en translation circulaire.
*/
import { bascule, boucle, curseur, el } from "./commun/outils.js";

const svg = document.querySelector("svg");
const O = { x: 320, y: 185 };
const RAYON = 140;
const NACELLES = 8;
const MAX_POINTS = 900;
const etat = { phi: 0.3, omega: 0, traces: { nacelle: [], bras: [] }, fantomes: [] };
const calques = ["support", "traces", "fantomes", "roue"].reduce((c, nom) => ({ ...c, [nom]: el("g", {}, svg) }), {});

const sur_roue = (angle, r = RAYON) => ({ x: O.x + r * Math.cos(angle), y: O.y - r * Math.sin(angle) });
const plancher = (accroche) => ({ x: accroche.x, y: accroche.y + 44 });

function dessiner_support() {
  // Dessine ce qui ne bouge pas : le pied, le sol, la jante et l'axe.
  const g = calques.support;
  el("line", { x1: O.x, y1: O.y, x2: O.x - 80, y2: 410, stroke: "var(--craie-douce)", "stroke-width": 4 }, g);
  el("line", { x1: O.x, y1: O.y, x2: O.x + 80, y2: 410, stroke: "var(--craie-douce)", "stroke-width": 4 }, g);
  el("line", { x1: 40, y1: 410, x2: 600, y2: 410, stroke: "var(--trait)", "stroke-width": 2 }, g);
  el("circle", { cx: O.x, cy: O.y, r: RAYON, fill: "none", stroke: "var(--craie)", "stroke-width": 2 }, g);
  const texte = el("text", { x: O.x + 14, y: O.y + 28, fill: "var(--craie-douce)", "font-size": 15 }, g);
  texte.textContent = "axe (Δ)";
}

function nacelle(parent, accroche, couleur, opacite, repere) {
  // Dessine une nacelle suspendue, toujours droite ; repere = segment jaune plancher-plafond.
  const g = el("g", { opacity: opacite }, parent);
  const { x, y } = accroche;
  el("line", { x1: x, y1: y, x2: x, y2: y + 14, stroke: couleur, "stroke-width": 2 }, g);
  el("rect", { x: x - 18, y: y + 14, width: 36, height: 30, fill: "none", stroke: couleur, "stroke-width": 2, rx: 3 }, g);
  if (repere) el("line", { x1: x, y1: y + 16, x2: x, y2: y + 42, stroke: "var(--jaune)", "stroke-width": 4 }, g);
}

function bras(parent, phi, opacite) {
  // Dessine le bras numéro 0 et son point rouge.
  const g = el("g", { opacity: opacite }, parent);
  const bout = sur_roue(phi);
  const point = sur_roue(phi, 0.55 * RAYON);
  el("line", { x1: O.x, y1: O.y, x2: bout.x, y2: bout.y, stroke: "var(--rouge)", "stroke-width": 3 }, g);
  el("circle", { cx: point.x, cy: point.y, r: 6, fill: "var(--rouge)" }, g);
}

function dessiner_roue() {
  // Redessine les bras et les nacelles à l'angle actuel de la roue.
  const g = calques.roue;
  g.replaceChildren();
  for (let k = 1; k < NACELLES; k += 1) {
    const bout = sur_roue(etat.phi + (2 * Math.PI * k) / NACELLES);
    el("line", { x1: O.x, y1: O.y, x2: bout.x, y2: bout.y, stroke: "var(--craie-douce)", "stroke-width": 2 }, g);
    nacelle(g, bout, "var(--craie-douce)", 1, false);
  }
  bras(g, etat.phi, 1);
  nacelle(g, sur_roue(etat.phi), "var(--craie)", 1, true);
  el("circle", { cx: O.x, cy: O.y, r: 7, fill: "var(--craie)" }, g);
}

function dessiner_traces() {
  // Dessine les trajectoires enregistrées : plancher de nacelle (jaune), point du bras (rouge).
  calques.traces.replaceChildren();
  const couleurs = { nacelle: "var(--jaune)", bras: "var(--rouge)" };
  for (const [nom, points] of Object.entries(etat.traces)) {
    const liste = points.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
    el("polyline", { points: liste, fill: "none", stroke: couleurs[nom], "stroke-width": 2, "stroke-dasharray": "4 5" }, calques.traces);
  }
}

function enregistrer_traces() {
  // Ajoute la position actuelle aux trajectoires cochées.
  const actives = { nacelle: document.getElementById("trace-nacelle").checked, bras: document.getElementById("trace-bras").checked };
  const positions = { nacelle: plancher(sur_roue(etat.phi)), bras: sur_roue(etat.phi, 0.55 * RAYON) };
  for (const nom of ["nacelle", "bras"]) {
    if (!actives[nom]) continue;
    etat.traces[nom].push(positions[nom]);
    if (etat.traces[nom].length > MAX_POINTS) etat.traces[nom].shift();
  }
}

function marquer_position() {
  // Garde une copie pâle du bras et de la nacelle à leur position actuelle.
  bras(calques.fantomes, etat.phi, 0.35);
  nacelle(calques.fantomes, sur_roue(etat.phi), "var(--craie)", 0.35, true);
}

function effacer() {
  // Efface les trajectoires et les positions marquées.
  etat.traces = { nacelle: [], bras: [] };
  calques.fantomes.replaceChildren();
  dessiner_traces();
}

const animation = boucle((dt) => {
  etat.phi += etat.omega * dt;
  enregistrer_traces();
  dessiner_traces();
  dessiner_roue();
});

dessiner_support();
dessiner_roue();
curseur("vitesse", (v) => `${v}`, (v) => { etat.omega = 0.12 * v; });
bascule(document.getElementById("lancer"), "Arrêter", "Lancer", (actif) => (actif ? animation.lancer() : animation.arreter()));
document.getElementById("marquer").addEventListener("click", marquer_position);
document.getElementById("effacer").addEventListener("click", effacer);
