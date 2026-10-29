import re, os, sys
B = '/home/user/subprojects/prof-ia/contenu/ressources/laboratoires/'
base = re.findall(r'src="(\.\./\.\./commun/[^"]+)"', open(B + 'sources/b1_chim2_a2_electrolytes/page.html').read())
plus = ['documents_mur.js', 'molecule_3d.js', 'modele_dessin.js', 'modele_atelier.js', 'nomenclature.js', 'boite_modeles.js', 'conductimetrie.js', 'ions_metaux.js', 'metal_tube.js', 'reactions_totales.js', 'acide_base.js', 'oxydoreduction.js', 'burette.js', 'agitateur_magnetique.js', 'conductimetre.js', 'poste_titrage.js', 'chimie_organique.js', 'bain_marie_physique.js']
SYNTHESE = ['chimie_decor.js', 'chronometre.js', 'chauffe_ballon.js', 'pierre_ponce.js', 'refrigerant_boules.js', 'reflux_gestes.js', 'montage_reflux.js', 'poste_synthese.js', 'buchner.js', 'buchner_poste.js', 'ccm_materiel.js', 'plaque_ccm.js', 'ccm_gestes.js', 'ccm_poste.js', 'ccm_missions.js']
PHYS = re.findall(r'src="(\.\./\.\./commun/[^"]+)"', open(B + 'sources/b1_meca1_a3_uniforme/page.html').read())
ONDES = ['documents_mur.js', 'tri.js', 'oscilloscope_ecran.js', 'milieu_1d.js', 'ressort_long.js', 'detecteurs_onde.js', 'corde_tendue.js', 'micro_claquoir.js', 'oscilloscope_memoire.js', 'corde_vibreur.js', 'banc_haut_parleur.js', 'cuve_ondes.js', 'banc_ultrasons.js', 'banc_diffraction.js', 'goniometre_prisme.js', 'reseau_lumiere.js', 'ecran_reseau.js', 'banc_reseau.js', 'compteur_geiger.js', 'banc_comptage.js']
ELEC = [s for s in re.findall(r'src="(\.\./\.\./commun/[^"]+)"', open(B + 'sources/b1_elec2_a4_generateur/page.html').read()) if 'electrolyseur' not in s]
RC = ['circuit_temps.js', 'condensateur.js', 'commutateur.js', 'boite_resistances.js', 'source_courant.js', 'ecran_acquisition.js', 'interface_acquisition.js', 'documents_mur.js', 'lewis_dessin.js', 'gbf.js', 'gbf_temps.js', 'bobine.js', 'entretien_rlc.js', 'poste_rlc.js', 'circuit_sinus.js', 'oscilloscope_ecran.js', 'oscilloscope.js', 'poste_rlc_force.js', 'modulation.js']
MECA = [x for x in re.findall(r'src="(\.\./\.\./commun/[^"]+)"', open(B + 'sources/tc_meca4_a1_quantite/page.html').read())] + ['../../commun/documents_mur.js', '../../commun/tri.js']
SIMS = {
 'b2_meca1_a1_vecteurs': ("Laboratoire : vitesse et accélération", "simulation de l'activité 1 du chapitre « Lois de Newton » (2e année du bac) : vecteurs vitesse et accélération à partir d'enregistrements (table inclinée, mouvement circulaire), aG = Δv/Δt, signe de a·v, repère de Frenet."),
 'b2_meca1_a2_newton': ("Laboratoire : deuxième loi de Newton", "simulation de l'activité 2 du chapitre « Lois de Newton » (2e année du bac) : vérification de ΣF = m·ΔvG/Δt en faisant varier la masse et la pente, référentiels galiléens, troisième loi."),
 'b2_elec5_a1_histoire': ("Laboratoire : transmettre l'information", "simulation de l'activité 1 du chapitre « Modulation d'amplitude » (2e année du bac) : histoire de la transmission de l'information (documents, frise), bandes de fréquences, émission et réception par deux antennes."),
 'b2_elec5_a2_modulation': ("Laboratoire : modulation et démodulation", "simulation de l'activité 2 du chapitre « Modulation d'amplitude » (2e année du bac) : modulation par un multiplieur, taux de modulation, surmodulation, détecteur d'enveloppe et filtre passe-haut."),
 'b2_elec5_a3_recepteur': ("Laboratoire : récepteur radio AM", "simulation de l'activité 3 du chapitre « Modulation d'amplitude » (2e année du bac) : antenne, circuit bouchon accordé, détecteur d'enveloppe, écouteur : réaliser un récepteur AM et choisir une station."),
 'b2_elec4_a1_forcees': ("Laboratoire : oscillations forcées", "simulation de l'activité 1 du chapitre « Oscillations forcées d'un circuit RLC série » (2e année du bac) : u et i à l'oscilloscope bicourbe, excitateur et résonateur, impédance, construction de Fresnel, valeur efficace, retard de i sur u."),
 'b2_elec4_a2_resonance': ("Laboratoire : résonance d'intensité", "simulation de l'activité 2 du chapitre « Oscillations forcées d'un circuit RLC série » (2e année du bac) : courbes I = f(N) pour deux résistances, bande passante à −3 dB, facteur de qualité, surtension, puissance et facteur de puissance."),
 'b2_elec3_a1_decharge': ("Laboratoire : décharge oscillante d'un condensateur", "simulation de l'activité 1 du chapitre « Oscillations libres d'un circuit RLC série » (2e année du bac) : décharge d'un condensateur dans une bobine à l'ordinateur, régimes pseudo-périodique, critique et apériodique, pseudo-période et T₀ = 2π√(LC), équation différentielle."),
 'b2_elec3_a2_energies': ("Laboratoire : énergies d'un circuit RLC", "simulation de l'activité 2 du chapitre « Oscillations libres d'un circuit RLC série » (2e année du bac) : énergies électrique ½·C·u² et magnétique ½·L·i² à l'ordinateur, échanges, dissipation par effet Joule dans les trois régimes."),
 'b2_elec3_a3_entretien': ("Laboratoire : entretien des oscillations", "simulation de l'activité 3 du chapitre « Oscillations libres d'un circuit RLC série » (2e année du bac) : dispositif d'entretien à amplificateur opérationnel (résistance négative), oscillations sinusoïdales, production d'une tension de fréquence donnée."),
 'b2_elec2_a1_bobine': ("Laboratoire : la bobine", "simulation de l'activité 1 du chapitre « Dipôle RL » (2e année du bac) : résistance d'une bobine à l'ohmmètre, comportement en courant continu, deux lampes (avec la bobine, avec R = r) : retard à l'allumage et à l'extinction, influence du noyau."),
 'b2_elec2_a3_echelon': ("Laboratoire : réponse d'un dipôle RL", "simulation de l'activité 3 du chapitre « Dipôle RL » (2e année du bac) : établissement et rupture du courant dans un dipôle RL, τ = L/R, influence de R et L, équation différentielle, énergie stockée."),
 'b2_elec2_a2_inductance': ("Laboratoire : inductance d'une bobine", "simulation de l'activité 2 du chapitre « Dipôle RL » (2e année du bac) : bobine et résistance alimentées par une tension triangulaire, uL = L·di/dt, mesure de L avec et sans noyau de fer doux."),
 'b2_elec1_a3_energie': ("Laboratoire : énergie d'un condensateur", "simulation de l'activité 3 du chapitre « Dipôle RC » (2e année du bac) : énergie stockée E = ½·C·u², décharge dans une lampe (modèle de flash), flash et défibrillateur."),
 'b2_elec1_a1_courant': ("Laboratoire : condensateur et courant constant", "simulation de l'activité 1 du chapitre « Dipôle RC » (2e année du bac) : charge d'un condensateur par un générateur de courant, q = I·t, q = C·u, associations en parallèle et en série."),
 'b2_elec1_a2_echelon': ("Laboratoire : réponse d'un dipôle RC", "simulation de l'activité 2 du chapitre « Dipôle RC » (2e année du bac) : charge et décharge d'un condensateur à travers une résistance, enregistrées par une interface d'acquisition ; τ = R·C, influence de R et C, équation différentielle."),
 'b2_nucl2_a1_energie': ("Laboratoire : noyaux, masse et énergie", "simulation de l'activité du chapitre « Noyaux, masse et énergie » (2e année du bac) : défaut de masse et énergie de liaison (balance, modèle), unités et E = m·c², courbe d'Aston, bilans d'énergie (α, β−, β+, fission, fusion), applications et dangers."),
 'b2_nucl1_a2_datation': ("Laboratoire : radioactivité et datation", "simulation de l'activité 2 du chapitre « Décroissance radioactive » (2e année du bac) : radioactivité dans l'environnement, effets biologiques, choix du radioélément, datation au carbone 14 (méthodes graphique et calculatoire)."),
 'b2_nucl1_a3_compteur': ("Laboratoire : le compteur et la décroissance", "simulation de l'activité 3 du chapitre « Décroissance radioactive » (2e année du bac) : compteur de Geiger-Müller, caractère aléatoire (moyenne, écart-type), radioactivité naturelle, rayonnements α, β, γ et écrans, décroissance du baryum 137m (λ, t½, τ)."),
 'b2_nucl1_a1_becquerel': ("Laboratoire : découverte de la radioactivité", "simulation de l'activité 1 du chapitre « Décroissance radioactive » (2e année du bac) : expérience de Becquerel, diagramme (N, Z), isotopes, domaines de stabilité, désintégrations α, β−, β+, γ et équations."),
 'b2_ondes4_a1_reseau': ("Laboratoire : le réseau", "simulation de l'activité 1 du chapitre « Diffraction de la lumière par un réseau » (2e année du bac) : modèles de réseau (diapositives, CD, DVD au microscope), fente et réseau au laser, sin θk = k·λ / a, pas d'un CD, nombre de maximums."),
 'b2_ondes4_a2_incidence': ("Laboratoire : réseau, incidence et lumière blanche", "simulation de l'activité 2 du chapitre « Diffraction de la lumière par un réseau » (2e année du bac) : incidence non normale (sin θk − sin i = k·λ / a), spectres de la lumière blanche, longueur d'onde d'un laser."),
 'b2_ondes3_a1_diffraction': ("Laboratoire : diffraction de la lumière", "simulation de l'activité 1 du chapitre « Propagation d'une onde lumineuse » (2e année du bac) : diffraction d'un laser par des fentes et des fils, θ = λ / a, lumière blanche, épaisseur d'un cheveu."),
 'b2_ondes3_a2_prisme': ("Laboratoire : dispersion par un prisme", "simulation de l'activité 2 du chapitre « Propagation d'une onde lumineuse » (2e année du bac) : goniomètre à prisme, déviation, minimum de déviation, indice du verre pour le rouge et le vert, spectre de la lumière blanche."),
 'b2_ondes2_a2_diffraction': ("Laboratoire : diffraction et dispersion", "simulation de l'activité 2 du chapitre « Ondes mécaniques progressives périodiques » (2e année du bac) : cuve à ondes (fente, obstacle, dispersion), diffraction des ultrasons par une fente, documents sur la diffraction."),
 'b2_ondes2_a1_sinusoidale': ("Laboratoire : ondes sinusoïdales", "simulation de l'activité 1 du chapitre « Ondes mécaniques progressives périodiques » (2e année du bac) : onde sinusoïdale le long d'une corde au stroboscope, onde sonore reçue par deux micros à l'oscilloscope ; période, fréquence, longueur d'onde."),
 'b2_ondes1_a3_milieu': ("Laboratoire : célérité et milieu", "simulation de l'activité 3 du chapitre « Ondes mécaniques progressives » (2e année du bac) : corde tendue par des masses (tension), trois cordes de masses linéiques différentes (inertie), cellules et chronomètre électronique ; célérité du son selon le milieu et la température."),
 'b2_ondes1_a2_retard': ("Laboratoire : retard et célérité", "simulation de l'activité 2 du chapitre « Ondes mécaniques progressives » (2e année du bac) : retard d'une bosse le long d'un ressort (cellules et chronomètre électronique), retard d'un son entre deux microphones (oscilloscope à mémoire), célérité."),
 'b2_ondes1_a1_exemples': ("Laboratoire : des ondes autour de nous", "simulation de l'activité 1 du chapitre « Ondes mécaniques progressives » (2e année du bac) : vague dans une cuve et bouchon, ondes transversale et longitudinale le long d'un ressort, documents sur le son et les séismes."),
 'b2_intro_a1_physicien': ("Laboratoire : les questions du physicien", "simulation de l'activité du chapitre « Les questions que se pose le physicien » (2e année du bac) : article d'une physicienne, questions rangées par partie du programme, démarche de résolution d'un problème (distance d'un satellite GPS)."),
 'b1_chim6_a3_benzoique': ("Laboratoire : synthèse de l'acide benzoïque", "simulation de l'activité 3 du chapitre « Lecture d'une formule chimique » (1re année du bac) : oxydation de l'alcool benzylique par le permanganate en milieu basique à reflux, filtrations sous vide, précipitation, pesée, rendement, chromatographie."),
 'b1_chim6_a2_modeles': ("Laboratoire : isomères, noms et polymères", "simulation de l'activité 2 du chapitre « Lecture d'une formule chimique » (1re année du bac) : modèles moléculaires (isomères, noms, isomérie Z/E), documents sur la pétrochimie et la polymérisation."),
 'b1_chim6_a1_squelette': ("Laboratoire : squelette et groupes caractéristiques", "simulation de l'activité 1 du chapitre « Lecture d'une formule chimique » (1re année du bac) : solubilité, densité et températures d'ébullition des hydrocarbures ; tests des groupes caractéristiques."),
 'b1_chim5_a1_organique': ("Laboratoire : la chimie organique", "simulation de l'activité du chapitre « Expansion de la chimie organique » (1re année du bac) : documents, combustion d'une bougie (éléments carbone et hydrogène), modèles moléculaires à liaisons simple, double et triple."),
 'b1_chim4_a1_protons': ("Laboratoire : transfert de protons", "simulation de l'activité 1 du chapitre « Titrages » (1re année du bac) : indicateurs colorés, acides et bases de la vie courante, transfert de protons, couples acide/base."),
 'b1_chim4_a2_electrons': ("Laboratoire : transfert d'électrons", "simulation de l'activité 2 du chapitre « Titrages » (1re année du bac) : métal et ions métalliques, eau de Javel et iodure, diiode et acide ascorbique, oxydants, réducteurs, couples."),
 'b1_chim4_a3_conductimetrique': ("Laboratoire : titrage conductimétrique", "simulation de l'activité 3 du chapitre « Titrages » (1re année du bac) : titrage conductimétrique d'un déboucheur par l'acide chlorhydrique, équivalence, concentration."),
 'b1_chim4_a4_colorimetrique': ("Laboratoire : titrages colorimétriques", "simulation de l'activité 4 du chapitre « Titrages » (1re année du bac) : titrage des ions fer II par le permanganate en milieu acide, titrage du diiode par le thiosulfate."),
}
for sid, (titre, role) in SIMS.items():
    if len(sys.argv) > 1 and sid not in sys.argv[1:]: continue
    d = B + 'sources/' + sid; os.makedirs(d, exist_ok=True)
    locaux = sorted(f for f in os.listdir(d) if f.endswith('.js') and f != 'simulation.js') + ['simulation.js']
    extra = SYNTHESE if 'benzoique' in sid else ['tri.js'] if sid.startswith('b2_intro') else []
    tri = ['../../commun/tri.js'] if sid == 'b2_elec5_a1_histoire' else []
    scripts = base + ['../../commun/' + f for f in plus + extra if '../../commun/' + f not in base] + locaux
    if sid.startswith('b2_elec'): scripts = ELEC + ['../../commun/' + f for f in RC] + tri + locaux
    if sid.startswith('b2_meca'): scripts = MECA + locaux
    if sid.startswith(('b2_ondes', 'b2_nucl')): scripts = PHYS + ['../../commun/' + f for f in ONDES if os.path.exists(B + 'commun/' + f)] + locaux
    html = f'''<!doctype html>
<!--
Rôle : {role}
Reçoit : les gestes de l'élève (glisser-déposer, toucher, zoom à deux doigts) ; scène fixe de 1024 × 640 px mise à l'échelle.
Produit : mesures, tableur et courbes sur la tablette, missions du carnet ; messages postMessage à la page du professeur.
Utilisé par : outils/assembler_laboratoire.py, qui en fait un seul fichier autonome : laboratoires/{sid}.html.
-->
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
  <title>{titre}</title>
  <link rel="stylesheet" href="../../commun/labo.css">
  <link rel="stylesheet" href="../../commun/tablette.css">
  <link rel="stylesheet" href="../../commun/carnet.css">
</head>
<body>
  <div id="ecran"><div id="etage"></div></div>
''' + ''.join(f'  <script src="{s}"></script>\n' for s in scripts) + '''</body>
</html>
'''
    if sys.argv[1:] and sid not in sys.argv[1:]: continue
    open(d + '/page.html', 'w').write(html); print(sid, len(scripts), 'scripts')
