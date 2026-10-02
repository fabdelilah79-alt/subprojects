# Bibliothèques externes

Copiées dans le projet pour que l'application fonctionne sans internet en classe.
Elles ne sont pas vérifiées par outils/verifier_structure.py (ce n'est pas notre code).

| Dossier | Bibliothèque | Version | Licence | Rôle |
|---|---|---|---|---|
| katex/ | KaTeX | 0.19.0 | MIT | Affiche les formules (LaTeX). |
| katex/contrib/mhchem.min.js | mhchem (extension KaTeX) | 0.19.0 | MIT | Formules de chimie avec \ce{...}. |
| polices/ | Caveat (Google Fonts, via Fontsource) | 5.3.0 | SIL OFL 1.1 | Écriture manuscrite au tableau. |

Vara.js a été essayé à l'étape 3 : ses polices ne contiennent pas les lettres accentuées (é, è, à, ç, ô deviennent « ? »). Il n'est donc pas utilisé.
