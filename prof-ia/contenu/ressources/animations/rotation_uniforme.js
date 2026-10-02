/*
Rôle : animer une rotation uniforme et tracer θ(t) en direct.
Reçoit : ω (rad/s) et θ0 (degrés) des curseurs ; les boutons Lancer et Recommencer.
Produit : le disque et le point M, la courbe θ(t) sur 4 s, et (sur demande) θ(t) = ω·t + θ0, s(t), T et f.
Utilisé par : rotation_uniforme.html.
*/
import { bascule, boucle, curseur, el, nombre } from "./commun/outils.js";

const svg = document.querySelector("svg");
const DISQUE = { x: 160, y: 200, r: 120 };
const GRAPHE = { x: 340, y: 360, largeur: 390, hauteur: 320, duree: 4 };
const R_M = 0.1;
const etat = { omega: 1.5, theta0: Math.PI / 4, t: 0, points: [] };
const calque_disque = el("g", {}, svg);
const calque_axes = el("g", {}, svg);
const courbe = el("polyline", { fill: "none", stroke: "var(--jaune)", "stroke-width": 3 }, svg);

const theta = (t) => etat.omega * t + etat.theta0;
const theta_max = () => etat.theta0 + etat.omega * GRAPHE.duree;
const vers_graphe = (t, th) => [GRAPHE.x + (t / GRAPHE.duree) * GRAPHE.largeur, GRAPHE.y - (th / theta_max()) * GRAPHE.hauteur];

function texte(parent, x, y, contenu, couleur = "var(--craie-douce)", ancre = "middle") {
  // Écrit une étiquette dans le dessin.
  const t = el("text", { x, y, fill: couleur, "font-size": 14, "text-anchor": ancre, "dominant-baseline": "middle" }, parent);
  t.textContent = contenu;
}

function dessiner_disque() {
  // Dessine le disque, la direction de θ0 (pointillés), le rayon OM et le point M.
  calque_disque.replaceChildren();
  const { x, y, r } = DISQUE;
  el("circle", { cx: x, cy: y, r, fill: "none", stroke: "var(--craie)", "stroke-width": 2 }, calque_disque);
  el("line", { x1: x - r - 10, y1: y, x2: x + r + 20, y2: y, stroke: "var(--craie-douce)" }, calque_disque);
  const debut = [x + r * Math.cos(etat.theta0), y - r * Math.sin(etat.theta0)];
  el("line", { x1: x, y1: y, x2: debut[0], y2: debut[1], stroke: "var(--craie-douce)", "stroke-dasharray": "5 5" }, calque_disque);
  const angle = theta(etat.t);
  const m = [x + 0.85 * r * Math.cos(angle), y - 0.85 * r * Math.sin(angle)];
  el("line", { x1: x, y1: y, x2: m[0], y2: m[1], stroke: "var(--craie)", "stroke-width": 2 }, calque_disque);
  el("circle", { cx: m[0], cy: m[1], r: 7, fill: "var(--jaune)" }, calque_disque);
  texte(calque_disque, m[0] + 14, m[1] - 12, "M", "var(--jaune)");
  el("circle", { cx: x, cy: y, r: 5, fill: "var(--craie)" }, calque_disque);
  texte(calque_disque, x - 12, y + 16, "O");
}

function dessiner_axes() {
  // Dessine les axes du graphe : t de 0 à 4 s, θ graduée en multiples de π.
  calque_axes.replaceChildren();
  const { x, y, largeur, hauteur } = GRAPHE;
  el("line", { x1: x, y1: y, x2: x + largeur + 10, y2: y, stroke: "var(--craie-douce)", "stroke-width": 2 }, calque_axes);
  el("line", { x1: x, y1: y, x2: x, y2: y - hauteur - 10, stroke: "var(--craie-douce)", "stroke-width": 2 }, calque_axes);
  texte(calque_axes, x + largeur + 18, y - 14, "t (s)");
  texte(calque_axes, x - 4, y - hauteur - 24, "θ (rad)");
  for (let s = 1; s <= GRAPHE.duree; s += 1) texte(calque_axes, vers_graphe(s, 0)[0], y + 16, String(s));
  const pas = Math.PI * Math.max(1, Math.ceil(theta_max() / Math.PI / 8));
  for (let v = pas; v <= theta_max(); v += pas) {
    const py = vers_graphe(0, v)[1];
    el("line", { x1: x, y1: py, x2: x + largeur, y2: py, stroke: "var(--trait)" }, calque_axes);
    const k = Math.round(v / Math.PI);
    texte(calque_axes, x - 8, py, k === 1 ? "π" : `${k}π`, "var(--craie-douce)", "end");
  }
}

function afficher_mesures() {
  // Écrit t et θ actuels ; ajoute l'équation horaire, s(t), T et f si la case est cochée.
  const th = theta(etat.t);
  let html = `t = <strong>${nombre(etat.t, 2)} s</strong> ; θ = <strong>${nombre(th, 2)} rad</strong> ; tours effectués : ${nombre((th - etat.theta0) / (2 * Math.PI), 2)}`;
  if (document.getElementById("voir-equations").checked) {
    const periode = (2 * Math.PI) / etat.omega;
    html += `<br>θ(t) = ${nombre(etat.omega, 2)}·t + ${nombre(etat.theta0, 2)} (rad) ; ` +
      `s(t) = ${nombre(R_M * etat.omega, 3)}·t + ${nombre(R_M * etat.theta0, 3)} (m) ; ` +
      `T = 2π/ω = <strong>${nombre(periode, 2)} s</strong> ; f = 1/T = <strong>${nombre(1 / periode, 2)} Hz</strong>`;
  }
  document.getElementById("mesures").innerHTML = html;
}

function dessiner() {
  // Redessine le disque, la courbe et les mesures.
  dessiner_disque();
  courbe.setAttribute("points", etat.points.map((p) => p.join(",")).join(" "));
  afficher_mesures();
}

function recommencer() {
  // Remet le chronomètre à zéro et efface la courbe.
  etat.t = 0;
  etat.points = [vers_graphe(0, etat.theta0)];
  dessiner_axes();
  dessiner();
}

const animation = boucle((dt) => {
  etat.t = Math.min(etat.t + dt, GRAPHE.duree);
  etat.points.push(vers_graphe(etat.t, theta(etat.t)));
  dessiner();
  if (etat.t >= GRAPHE.duree) arreter_a_la_fin();
});

function arreter_a_la_fin() {
  // Arrête l'animation au bout de 4 s et remet le bouton sur « Lancer ».
  animation.arreter();
  const bouton = document.getElementById("lancer");
  bouton.setAttribute("aria-pressed", "false");
  bouton.textContent = "Lancer";
}

curseur("omega", (v) => `${nombre(v, 1)} rad/s`, (v) => { etat.omega = v; recommencer(); });
curseur("theta0", (v) => `${v}°`, (v) => { etat.theta0 = (v * Math.PI) / 180; recommencer(); });
bascule(document.getElementById("lancer"), "Pause", "Lancer", (actif) => (actif ? animation.lancer() : animation.arreter()));
document.getElementById("recommencer").addEventListener("click", recommencer);
document.getElementById("voir-equations").addEventListener("change", afficher_mesures);
