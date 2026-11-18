# Guide 2,5D des laboratoires — à suivre pour tout dessin nouveau ou refait

Demande de l'enseignant (18/11/2026) : des laboratoires en **2,5D**, plus réalistes, avec une attention particulière à la
**physique des liquides et de leur surface**, des liaisons et des interactions bien établies, utilisables au téléphone.
Ce guide complète `SKILL.md` (§ 2 et 2 bis). **Statut : proposition, en attente de validation par l'enseignant.**
Les laboratoires ne sont pas modifiés : la proposition vit dans `outils/proposition_25d/` (`vue_25d.js`,
`verrerie_rendu_25d.js`), se voit sur `outils/banc_25d.html` et se vérifie par `node outils/test_25d.js`. Après
validation seulement : copier `vue_25d.js` dans `commun/`, reporter les ovales `L.VUE.k` dans `commun/verrerie_rendu.js`,
puis refaire les laboratoires un par un selon le § 7.

## 1. La vue (une seule pour tout le laboratoire)

- On regarde la paillasse **de trois quarts, un peu d'en haut**. Une seule constante : `Labo.VUE.k`, le rapport des
  ovales (demi-hauteur / demi-largeur d'un cercle horizontal). **Cible 2,5D : k = 0,26** (regard environ 15° au-dessus
  de l'horizontale). Ancienne vue presque de face : 0,12 (valeur par défaut tant qu'un laboratoire n'est pas refait).
- **Tout cercle horizontal** a ce rapport : bord d'un bécher, fond, surface d'un liquide, socle rond, bouton vu de dessus,
  ombre posée (× 1,3). Jamais un ovale « à l'œil » : `L.vue.ry(rx)`.
- **Boîtes** (appareils, socles, boîtiers) : trois faces visibles, face avant, dessus et côté droit, avec
  `L.vue.boite` ; profondeur fuyante vers le haut à droite (`VUE.recul`).
- **Profondeur** : un objet plus au fond a son pied plus haut sur l'écran ; il est dessiné **avant** les objets de devant
  (tri par l'ordonnée du pied). Deux objets ne se traversent jamais.
- **Échelle réelle commune** (px/mm de la scène, comme `verrerie_profils.js`) : un bécher de 250 mL, une potence, un
  multimètre ont leurs vraies proportions les uns par rapport aux autres.

## 2. La lumière et les ombres

- Lumière venant **d'en haut à gauche**, la même partout (`VUE.lumiere`) : dessus le plus clair, face avant moyenne,
  côté droit le plus sombre (`L.vue.teinte`) ; cylindres : dégradé clair à gauche, sombre à droite ; reflet vertical
  blanc à gauche sur le verre et le métal poli.
- **Chaque objet posé a une ombre posée** (`L.vue.ombre`) : ovale flou, décalé vers le bas à droite, opacité 0,25 à 0,35.
  Un objet tenu en l'air a une ombre plus petite et plus pâle ; un objet sans ombre « flotte » : interdit.
- Pas de contour noir épais : les bords viennent des différences de teinte entre faces (un trait fin plus sombre au plus).

## 3. Le réalisme du matériel (« un professeur doit le reconnaître au premier coup d'œil »)

- Partir d'une photo de catalogue de matériel scolaire ; garder les **proportions** et les **détails qui identifient**
  l'objet : graduations émaillées blanches, bec verseur, bourrelet du tube, noix et vis de serrage, bornes de couleur
  (rouge, noir), afficheur en creux avec chiffres à 7 segments, molette crantée, câble et fiche, plaque signalétique.
- **Matières** : métal (dégradé brillant + reflet), verre (transparent, bords plus sombres, reflets), plastique mat
  (aplat légèrement dégradé), bois (veines), émail, caoutchouc noir mat. Pas d'aplat vif sans relief.
- **Usure légère** permise (rayure, étiquette) ; pas de surcharge : un objet = 5 à 15 formes bien choisies.
- **Gros plan obligatoire** (× 3) de chaque objet nouveau sur `banc_25d.html` avant de l'utiliser.

## 4. Les liquides (à soigner particulièrement)

Le moteur existe déjà et doit être utilisé, jamais contourné : `verrerie_profils.js` (profil intérieur réel en mm,
volume ↔ hauteur), `liquide_geometrie.js` (découpe du profil par la surface, niveau pour une aire), `recipient_physique.js`
(surface, ballottement, débordement, robinet), `liquide_contenu.js` (phases, densités, couleurs, émulsion, décantation).

**Physique — ce qui doit toujours être vrai (vérifié par le test) :**
1. **Volume → niveau** par le vrai profil : la surface d'un récipient droit est à `hauteur_de(V)` (± 0,5 mm) ; un
   récipient évasé (erlenmeyer, ballon) monte plus vite là où il est étroit.
2. **Surface horizontale** (perpendiculaire à la pesanteur apparente) quel que soit l'angle du récipient ; elle penche
   seulement quand on accélère le récipient, puis **oscille et s'amortit** (ballottement).
3. **Conservation du volume** quand on penche le récipient (± 1 %) : le liquide ne disparaît pas, il se déplace.
4. **Débordement** dès que la surface atteint la lèvre la plus basse (le bec d'abord) ; le filet qui tombe s'amincit
   en accélérant ; **robinet** : débit de Torricelli (v = √(2gh)), arrêt si le récipient est bouché.
5. **Phases** rangées par densité (la moins dense au-dessus), interface nette ; émulsion trouble après agitation, qui se
   sépare peu à peu ; une espèce dissoute colore **sa** phase seulement.
6. **Mélange et dissolution progressifs** (couleur qui diffuse, pas qui saute), **bulles** qui montent en accélérant et
   éclatent à la surface, **gouttes** qui tombent en ligne droite et font une petite onde à la surface.

**Rendu de la surface en 2,5D :**
- Surface d'un récipient droit : **ovale de rapport k**, un peu plus clair que le liquide, bord avant légèrement plus
  sombre ; c'est le même rapport que le bord du verre (le liquide « tient » dans le verre).
- **Ménisque** : l'eau remonte le long du verre (bande plus claire de 0,5 à 1 mm au bord) ; dans un col étroit (burette,
  pipette, fiole jaugée), le ménisque se voit comme une courbe sombre dont le **point le plus bas** est le niveau mesuré
  (c'est lui qu'on amène sur le trait de jauge).
- Récipient penché : la surface reste horizontale ; option `VUE.surface_penchee` : elle reste un ovale horizontal.
- **Couleur selon l'épaisseur** : plus de liquide = teinte plus soutenue (opacité qui croît avec la hauteur) ; un liquide
  incolore reste légèrement bleuté et transparent (on voit le fond et les objets derrière).
- **Réfraction** (si un objet plonge : agitateur, électrode, tige) : la partie immergée paraît décalée et un peu plus
  large à la surface (« bâton brisé »).
- Le liquide ne sort jamais du verre dessiné (découpe par le profil intérieur), même au ballottement.

## 5. Liaisons et interactions

- Chaque objet a des **points d'accroche** nommés (borne, crochet, noix, col, bec, fiche) aux mêmes coordonnées pour le
  dessin et pour le geste. Pendant un geste, les points compatibles **s'éclairent** ; à moins de 12 px, l'objet
  **s'aimante** (il se colle, la borne devient verte) ; lâché ailleurs, il **revient** à sa place, avec un message court
  sur le ticket.
- Un objet lâché **tombe sur la paillasse** (jamais suspendu dans le vide) ; un objet porté suit son support ; un fil
  part exactement du centre de la borne et entre dans la fiche ; il pend légèrement (courbe) et passe derrière ou devant
  les appareils selon leur profondeur.

## 6. Téléphone

- Toute cible tactile mesure au moins **44 px à l'écran** (zone invisible `opacity: 0.001` autour des petits objets).
- Chaque étape peut indiquer une **zone utile** : la vue y zoome toute seule, puis revient.
- Préférer « toucher l'objet, puis toucher sa destination » au long glissé pour les fils et les petits objets.
- Tester à 390 × 844 (portrait) et 844 × 390 (paysage).

## 7. Procédure pour un laboratoire en 2,5D

1. Régler `L.VUE.k = 0.26` (et `VUE.surface_penchee = true`) en tête de la simulation.
2. Décor : paillasse vue un peu d'en haut (dessus visible, dégradé du fond vers l'avant), mur, ambiance (zellige).
3. Matériel : boîtes et cylindres par `L.vue` ; verrerie par `verrerie_rendu.js` ; gros plan de chaque objet nouveau.
4. Liquides : uniquement par le moteur (§ 4). Interactions : points d'accroche, aimantation, refus clair (§ 5).
5. **Tests** : `node test_25d.js` (règles de vue, lumière, ombres, liquides) ; scénario complet de la simulation ;
   captures 1024 × 640 et téléphone ; relecture des captures avec les listes du § 2 de SKILL.md et de ce guide.

## 8. Ce que vérifie `test_25d.js` (seuils)

| Règle | Seuil |
|---|---|
| Ovales d'un même objet (bord, fond, surface, ombre) | même rapport k (± 3 %) ; ombre : k × 1,3 |
| Ordre des teintes d'une boîte | dessus plus clair que face, face plus claire que côté |
| Ombre posée sous chaque boîte et chaque cylindre | présente, sous le pied, décalée vers le bas à droite |
| Volume → niveau (récipients droits, 10 à 90 % de la capacité) | écart à `hauteur_de(V)` ≤ 0,5 mm |
| Surface d'un récipient penché (0 à 40°) | horizontale à 0,5° près |
| Volume conservé quand on penche (0 à 40°) | ± 1 % |
| Débordement | commence quand la surface atteint la lèvre la plus basse |
