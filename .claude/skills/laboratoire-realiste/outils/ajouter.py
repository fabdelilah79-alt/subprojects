# Ajoute les laboratoires virtuels au manifeste, une ressource par mission (titres et conclusions lus dans chaque simulation.js).
import json, re, sys
from pathlib import Path
RACINE = Path("/home/user/subprojects/prof-ia")
LABO = RACINE / "contenu/ressources/laboratoires"
GESTES = "Glisser-déposer le matériel, toucher les appareils, zoomer à deux doigts ; tableur et graphique sur la tablette ; répondre aux questions du carnet de laboratoire."
LABOS = json.loads(Path(sys.argv[1]).read_text())
# Fiches du programme : celles des chapitres présents dans la liste des laboratoires.
FICHES = {c: json.loads((RACINE / f"contenu/orientations/{c}.json").read_text()) for c in sorted({l["chapitre"] for l in LABOS})}

def missions(dossier, faire):
    # Missions dans l'ordre : id, titre, conclusion, phrase « faire », nombre d'étapes (consignes jusqu'à la mission suivante).
    texte = "".join(f.read_text() for f in sorted((LABO / "sources" / dossier).glob("*.js")))
    titres = list(re.finditer(r'id: "([a-z_]+)",(?: paillasse: \d,)? titre: "([^"]+)"', texte))
    conclusions = re.findall(r'\n    conclusion: "([^"]+)"', texte)
    assert len(titres) == len(conclusions) == len(faire), (dossier, [t.group(2) for t in titres], conclusions)
    bornes = [t.start() for t in titres] + [len(texte)]
    etapes = [max(1, texte.count("{ consigne:", bornes[k], bornes[k + 1])) for k in range(len(titres))]
    return [{"id": t.group(1), "titre": t.group(2), "ce_que_fait_l_eleve": f, "conclusion": c, "etapes": n} for t, c, f, n in zip(titres, conclusions, faire, etapes)]

def fiches(l):
    # Une ressource par mission : le laboratoire s'ouvre sur cette mission seule (observation courte dans une partie du cours).
    activite = FICHES[l["chapitre"]]["activites"][l["activite"] - 1] if l["activite"] else None
    if l.get("activite_specifique"):  # activité d'une partie propre à certaines filières (bloc « specifique » de la fiche)
        bloc = next(b for b in FICHES[l["chapitre"]]["specifique"] if b.get("activites"))
        activite = f"({'/'.join(bloc['filieres'])}) " + bloc["activites"][l["activite_specifique"] - 1]
    assert (LABO / f"{l['id']}.html").exists()
    ms = missions(l["id"], l["faire"]); total = sum(m["etapes"] for m in ms)
    for m in ms:
        r = {"id": f"{l['id']}__{m['id']}", "type": "simulation", "fichier": f"laboratoires/{l['id']}.html#mission={m['id']}",
             "description": f"Mission « {m['titre']} » : {m['ce_que_fait_l_eleve']} Laboratoire complet : {l['description']}",
             "phase_poe": "observation", "manipulable": GESTES, "chapitre": l["chapitre"], "activite": activite,
             "objectifs": l["objectifs"], "laboratoire": l["id"],
             "missions": [{k: m[k] for k in ("titre", "ce_que_fait_l_eleve", "conclusion")}],
             "duree_min": max(3, round(l["duree_min"] * m["etapes"] / total))}
        if l.get("conceptions"): r["conceptions"] = l["conceptions"]
        yield r

p = RACINE / "contenu/manifeste.json"
m = json.loads(p.read_text())
m["ressources"] = [dict(r, chapitre=r.get("chapitre", "1bac/meca1_rotation")) for r in m["ressources"] if not r["id"].startswith(("tc_", "b1_", "b2_"))]
m["ressources"] += [r for l in LABOS for r in fiches(l)]
p.write_text(json.dumps(m, ensure_ascii=False, indent=2) + "\n")
print(len(m["ressources"]), "ressources")
