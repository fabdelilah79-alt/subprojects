# Ajoute les laboratoires virtuels au manifeste (titres et conclusions lus dans chaque simulation.js).
import json, re, sys
from pathlib import Path
RACINE = Path("/home/user/subprojects/prof-ia")
LABO = RACINE / "contenu/ressources/laboratoires"
GESTES = "Glisser-déposer le matériel, toucher les appareils, zoomer à deux doigts ; tableur et graphique sur la tablette ; répondre aux questions du carnet de laboratoire."
LABOS = json.loads(Path(sys.argv[1]).read_text())
# Fiches du programme : celles des chapitres présents dans la liste des laboratoires.
FICHES = {c: json.loads((RACINE / f"contenu/orientations/{c}.json").read_text()) for c in sorted({l["chapitre"] for l in LABOS})}

def missions(dossier, faire):
    texte = "".join(f.read_text() for f in sorted((LABO / "sources" / dossier).glob("*.js")))
    titres = re.findall(r'id: "([a-z_]+)",(?: paillasse: \d,)? titre: "([^"]+)"', texte)
    conclusions = re.findall(r'\n    conclusion: "([^"]+)"', texte)
    assert len(titres) == len(conclusions) == len(faire), (dossier, titres, conclusions)
    return [{"titre": t, "ce_que_fait_l_eleve": f, "conclusion": c} for (_, t), c, f in zip(titres, conclusions, faire)]

def fiche(l):
    activite = FICHES[l["chapitre"]]["activites"][l["activite"] - 1] if l["activite"] else None
    if l.get("activite_specifique"):  # activité d'une partie propre à certaines filières (bloc « specifique » de la fiche)
        bloc = next(b for b in FICHES[l["chapitre"]]["specifique"] if b.get("activites"))
        activite = f"({'/'.join(bloc['filieres'])}) " + bloc["activites"][l["activite_specifique"] - 1]
    r = {"id": l["id"], "type": "simulation", "fichier": f"laboratoires/{l['id']}.html", "description": l["description"],
         "phase_poe": "observation", "manipulable": GESTES, "chapitre": l["chapitre"], "activite": activite,
         "objectifs": l["objectifs"], "missions": missions(l["id"], l["faire"]), "duree_min": l["duree_min"]}
    if l.get("conceptions"): r["conceptions"] = l["conceptions"]
    assert (LABO / f"{l['id']}.html").exists()
    return r

p = RACINE / "contenu/manifeste.json"
m = json.loads(p.read_text())
m["ressources"] = [dict(r, chapitre=r.get("chapitre", "1bac/meca1_rotation")) for r in m["ressources"] if not r["id"].startswith(("tc_", "b1_", "b2_"))]
m["ressources"] += [fiche(l) for l in LABOS]
p.write_text(json.dumps(m, ensure_ascii=False, indent=2) + "\n")
print(len(m["ressources"]), "ressources")
