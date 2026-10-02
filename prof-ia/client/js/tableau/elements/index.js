/*
Rôle : liste de tous les éléments de schéma disponibles, par leur nom.
Reçoit : rien.
Produit : ELEMENTS, un objet { nom : module } ; chaque module a exemple et dessiner(crayon, parametres).
Utilisé par : client/js/tableau/dessin.js et client/js/tableau/catalogue.js.
Pour ajouter un élément : créer son fichier ici, puis l'ajouter à la liste ci-dessous.
*/
import * as angle from "./angle.js";
import * as axe_rotation from "./axe_rotation.js";
import * as cercle from "./cercle.js";
import * as disque_points from "./disque_points.js";
import * as fleche from "./fleche.js";
import * as point from "./point.js";
import * as repere_cercle from "./repere_cercle.js";
import * as segment from "./segment.js";

export const ELEMENTS = { point, segment, fleche, cercle, angle, axe_rotation, repere_cercle, disque_points };
