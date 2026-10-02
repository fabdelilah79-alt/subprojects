/*
Rôle : simuler l'enregistrement d'un solide en rotation et mesurer, à la position i, les arcs et l'angle balayé.
Reçoit : ω (rad/s), rotation uniforme ou accélérée, la position étudiée i, l'affichage ou non des calculs.
Produit : les points A0…A8 et B0…B8 ; les mesures (arcs, angle) ; sur demande Vi = arc / 2τ, ωi = Δθ / 2τ, R·ωi.
Utilisé par : coussin_air.html.
*/
import { boucle, curseur, el, nombre } from "./commun/outils.js";

const svg = document.querySelector("svg");
const O = { x: 230, y: 210 };
const PX_CM = 15;
const TAU = 0.04;
const POSITIONS = 9;
const RALENTI = 20;
const RAYONS = { A: 6, B: 12 };
const etat = { omega: 7.5, alpha: 0, t: 0, enregistre: false, i: 1 };
const calque_disque = el("g", {}, svg);
const calque_points = el("g", {}, svg);

const angle_a = (t) => 0.3 + etat.omega * t + 0.5 * etat.alpha * t * t;
const sur_cercle = (r_cm, angle) => ({ x: O.x + r_cm * PX_CM * Math.cos(angle), y: O.y - r_cm * PX_CM * Math.sin(angle) });

function dessiner_disque(angle) {
  // Dessine le disque, son axe et le rayon qui porte A et B, à l'angle donné.
  calque_disque.replaceChildren();
  el("circle", { cx: O.x, cy: O.y, r: 13 * PX_CM, fill: "none", stroke: "var(--craie-douce)", "stroke-width": 2 }, calque_disque);
  el("circle", { cx: O.x, cy: O.y, r: 5, fill: "var(--craie)" }, calque_disque);
  const bout = sur_cercle(13, angle);
  el("line", { x1: O.x, y1: O.y, x2: bout.x, y2: bout.y, stroke: "var(--craie-douce)", "stroke-width": 2 }, calque_disque);
}

function etiquette(r_cm, angle, contenu, couleur) {
  // Écrit le nom d'une position (A3, B5…) un peu à l'extérieur de son point, dans la direction du rayon.
  const p = sur_cercle(r_cm + 1.1, angle);
  const t = el("text", { x: p.x, y: p.y, fill: couleur, "font-size": 13, "text-anchor": "middle", "dominant-baseline": "middle" }, calque_points);
  t.textContent = contenu;
}

function dessiner_points(nombre_points) {
  // Dessine les positions déjà enregistrées de A (bleu) et de B (rouge).
  calque_points.replaceChildren();
  for (let k = 0; k < nombre_points; k += 1) {
    for (const [nom, couleur] of [["A", "var(--bleu)"], ["B", "var(--rouge)"]]) {
      const p = sur_cercle(RAYONS[nom], angle_a(k * TAU));
      el("circle", { cx: p.x, cy: p.y, r: 4, fill: couleur }, calque_points);
      etiquette(RAYONS[nom], angle_a(k * TAU), `${nom}${k}`, couleur);
    }
  }
}

function chemin_arc(r_cm, debut, fin) {
  // Chemin SVG de l'arc parcouru entre deux angles (sens trigonométrique).
  const a = sur_cercle(r_cm, debut);
  const b = sur_cercle(r_cm, fin);
  return `M ${a.x} ${a.y} A ${r_cm * PX_CM} ${r_cm * PX_CM} 0 0 0 ${b.x} ${b.y}`;
}

function surligner(i) {
  // Surligne en jaune les arcs entre les positions i-1 et i+1.
  const [debut, fin] = [angle_a((i - 1) * TAU), angle_a((i + 1) * TAU)];
  for (const r of Object.values(RAYONS)) {
    el("path", { d: chemin_arc(r, debut, fin), fill: "none", stroke: "var(--jaune)", "stroke-width": 4 }, calque_points);
  }
}

function texte_mesures(i) {
  // Écrit les mesures à la position i (arcs, angle), puis les calculs si la case est cochée.
  const delta = angle_a((i + 1) * TAU) - angle_a((i - 1) * TAU);
  const arc_a = RAYONS.A * delta;
  const arc_b = RAYONS.B * delta;
  let html = `Mesures : arc A${i - 1}A${i + 1} = <strong>${nombre(arc_a, 1)} cm</strong> ; arc B${i - 1}B${i + 1} = <strong>${nombre(arc_b, 1)} cm</strong> ; angle balayé = <strong>${nombre((delta * 180) / Math.PI, 0)}°</strong>`;
  if (document.getElementById("calculs").checked) {
    const omega_i = delta / (2 * TAU);
    html += `<br>V<sub>A${i}</sub> = arc / 2τ = ${nombre(arc_a / 100 / (2 * TAU), 2)} m/s ; V<sub>B${i}</sub> = ${nombre(arc_b / 100 / (2 * TAU), 2)} m/s ; ` +
      `ω<sub>${i}</sub> = Δθ / 2τ = ${nombre(delta, 2)} / ${nombre(2 * TAU, 2)} = ${nombre(omega_i, 2)} rad/s ; ` +
      `R<sub>A</sub>·ω = ${nombre(0.06 * omega_i, 2)} m/s ; R<sub>B</sub>·ω = ${nombre(0.12 * omega_i, 2)} m/s`;
  }
  document.getElementById("mesures").innerHTML = html;
}

function afficher_position() {
  // Met à jour le dessin et les mesures pour la position étudiée.
  if (!etat.enregistre) return;
  dessiner_points(POSITIONS);
  surligner(etat.i);
  texte_mesures(etat.i);
}

const animation = boucle((dt) => {
  etat.t = Math.min(etat.t + dt / RALENTI, (POSITIONS - 1) * TAU);
  dessiner_disque(angle_a(etat.t));
  dessiner_points(Math.floor(etat.t / TAU + 1e-9) + 1);
  if (etat.t >= (POSITIONS - 1) * TAU) terminer_enregistrement();
});

function terminer_enregistrement() {
  // Arrête l'animation et permet de choisir la position à étudier.
  animation.arreter();
  etat.enregistre = true;
  document.getElementById("position").disabled = false;
  afficher_position();
}

function enregistrer() {
  // Recommence l'enregistrement depuis le début, au ralenti.
  etat.t = 0;
  etat.enregistre = false;
  etat.alpha = document.getElementById("accelere").checked ? 40 : 0;
  document.getElementById("mesures").textContent = "Enregistrement en cours (au ralenti)…";
  animation.lancer();
}

dessiner_disque(angle_a(0));
curseur("omega", (v) => `${nombre(v, 1)} rad/s`, (v) => { etat.omega = v; });
curseur("position", (v) => `${v}`, (v) => { etat.i = v; afficher_position(); });
document.getElementById("enregistrer").addEventListener("click", enregistrer);
document.getElementById("calculs").addEventListener("change", afficher_position);
