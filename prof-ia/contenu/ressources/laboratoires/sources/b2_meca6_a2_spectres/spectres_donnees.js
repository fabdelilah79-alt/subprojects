/*
Rôle : raies visibles (longueur d'onde en nm, intensité relative) des gaz des tubes spectraux et du sodium, d'après les tables
       du NIST (raies principales seulement), et couleur de la lueur de chaque tube. Le tube « X » sans étiquette contient
       de l'hélium.
Reçoit : rien.
Produit : Labo.SPECTRES = { hydrogene, helium, mercure, neon, sodium : { nom, symbole, lueur, raies [[λ, I]] } } et
          Labo.TUBES (ordre du coffret : H₂, He, Hg, Ne, X).
Utilisé par : spectroscope.js, poste_tubes.js, poste_sodium.js, missions_spectres.js.
*/
(function (L) {
  L.SPECTRES = {
    hydrogene: { nom: "hydrogène", symbole: "H₂", lueur: "#d873d6", raies: [[656.3, 1], [486.1, 0.6], [434.0, 0.35], [410.2, 0.22]] },
    helium: { nom: "hélium", symbole: "He", lueur: "#ffd2a8", raies: [[706.5, 0.45], [667.8, 0.6], [587.6, 1], [501.6, 0.45], [492.2, 0.25], [471.3, 0.3], [447.1, 0.6]] },
    mercure: { nom: "mercure", symbole: "Hg", lueur: "#a9bcff", raies: [[404.7, 0.6], [435.8, 1], [491.6, 0.15], [546.1, 1], [577.0, 0.6], [579.1, 0.6]] },
    neon: { nom: "néon", symbole: "Ne", lueur: "#ff5a2c", raies: [[540.1, 0.3], [585.2, 1], [588.2, 0.5], [594.5, 0.6], [597.6, 0.3], [603.0, 0.5], [607.4, 0.6], [609.6, 0.6], [614.3, 0.8], [616.4, 0.5], [621.7, 0.5], [626.6, 0.6], [633.4, 0.7], [638.3, 0.7], [640.2, 0.9], [650.7, 0.7], [659.9, 0.5], [667.8, 0.4], [671.7, 0.3], [692.9, 0.5], [703.2, 0.6]] },
    sodium: { nom: "sodium", symbole: "Na", lueur: "#ffb21f", raies: [[589.0, 1], [589.6, 0.6]] },
  };
  L.TUBES = [
    { id: "hydrogene", etiquette: "H₂" }, { id: "helium", etiquette: "He" }, { id: "mercure", etiquette: "Hg" },
    { id: "neon", etiquette: "Ne" }, { id: "helium", etiquette: "X", inconnu: true },
  ];
})(window.Labo);
