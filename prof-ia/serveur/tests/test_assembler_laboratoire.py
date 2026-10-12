"""
Rôle : vérifier que outils/assembler_laboratoire.py produit des pages autonomes (aucun fichier externe).
Reçoit : une petite simulation d'essai dans un dossier temporaire, puis les vraies simulations du projet.
Produit : des tests pytest (réussis ou échoués).
Utilisé par : la commande « python -m pytest ».
"""
import re

from outils.assembler_laboratoire import assembler, ecrire_tout
from serveur.configuration import chemin_projet

EXTERNE = re.compile(r'<script src=|<link rel="stylesheet"|url\("(?!data:)')


def fabriquer_essai(racine):
    """Crée laboratoires/commun et une simulation « essai » minimale."""
    (racine / "commun" / "polices").mkdir(parents=True)
    (racine / "commun" / "polices" / "p.woff2").write_bytes(b"police")
    (racine / "commun" / "s.css").write_text('@font-face { src: url("polices/p.woff2"); }', encoding="utf-8")
    (racine / "commun" / "a.js").write_text("const t = '</script>';", encoding="utf-8")
    dossier = racine / "sources" / "essai"
    dossier.mkdir(parents=True)
    page = '<link rel="stylesheet" href="../../commun/s.css">\n<script src="../../commun/a.js"></script>'
    (dossier / "page.html").write_text(page, encoding="utf-8")
    return dossier


def test_page_autonome(tmp_path):
    """Styles, scripts et polices sont intégrés ; « </script> » dans le code ne casse pas la page."""
    page = assembler(fabriquer_essai(tmp_path))
    assert not EXTERNE.search(page)
    assert "data:font/woff2;base64," in page
    assert "<\\/script>" in page


def test_ecrire_tout(tmp_path):
    """Sans nom, toutes les simulations sont écrites à côté du dossier sources."""
    fabriquer_essai(tmp_path)
    resultats = ecrire_tout(tmp_path, [])
    assert [sortie.name for sortie, _ in resultats] == ["essai.html"]


def test_vraies_simulations():
    """Chaque simulation du projet s'assemble sans laisser de fichier externe."""
    sources = chemin_projet("laboratoires") / "sources"
    dossiers = [d for d in sources.iterdir() if (d / "page.html").exists()]
    assert dossiers
    for dossier in dossiers:
        assert not EXTERNE.search(assembler(dossier)), dossier.name
