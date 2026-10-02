"""
Rôle : vérifier que outils/verifier_structure.py repère bien les dépassements.
Reçoit : de petits fichiers d'essai créés dans un dossier temporaire.
Produit : des tests pytest (réussis ou échoués).
Utilisé par : la commande « python -m pytest ».
"""
from outils.verifier_structure import verifier

REGLES = {
    "lignes_max_fichier": 150,
    "lignes_max_fonction": 30,
    "extensions_code": [".py", ".js"],
    "dossiers_ignores": ["ignore"],
}


def fonction_python(nb_lignes):
    """Fabrique le texte d'une fonction Python de nb_lignes lignes."""
    return "def longue():\n" + "    x = 1\n" * (nb_lignes - 1)


def fonction_js(nb_lignes):
    """Fabrique le texte d'une fonction JavaScript de nb_lignes lignes."""
    return "function longue() {\n" + "  x = 1;\n" * (nb_lignes - 2) + "}\n"


def test_projet_conforme(tmp_path):
    """Des fonctions courtes ne donnent aucun dépassement."""
    (tmp_path / "court.py").write_text(fonction_python(10), encoding="utf-8")
    (tmp_path / "court.js").write_text(fonction_js(10), encoding="utf-8")
    assert verifier(tmp_path, REGLES) == []


def test_fonctions_trop_longues(tmp_path):
    """Une fonction de 35 lignes est signalée, en Python comme en JavaScript."""
    (tmp_path / "long.py").write_text(fonction_python(35), encoding="utf-8")
    (tmp_path / "long.js").write_text(fonction_js(35), encoding="utf-8")
    problemes = verifier(tmp_path, REGLES)
    assert len(problemes) == 2
    assert all("fonction longue, 35 lignes" in p for p in problemes)


def test_fichier_trop_long_et_dossier_ignore(tmp_path):
    """Un fichier de 160 lignes est signalé, sauf s'il est dans un dossier ignoré."""
    texte = "x = 1\n" * 160
    (tmp_path / "gros.py").write_text(texte, encoding="utf-8")
    (tmp_path / "ignore").mkdir()
    (tmp_path / "ignore" / "gros.py").write_text(texte, encoding="utf-8")
    assert verifier(tmp_path, REGLES) == ["gros.py : 160 lignes (maximum 150)"]
