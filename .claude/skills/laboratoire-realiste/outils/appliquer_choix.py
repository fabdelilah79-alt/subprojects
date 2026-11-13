# Applique de nouvelles options à des questions à choix : remplace la liste complète « "a", "b", "c" » dans les fichiers
# du laboratoire (et ceux qu'il charge hors de commun/). Usage : python3 appliquer_choix.py corrections.json questions.json (liste de extraire_questions.js)
import json, re, sys
from pathlib import Path
B = Path('/home/user/subprojects/prof-ia/contenu/ressources/laboratoires/sources')
Q = json.load(open(sys.argv[2] if len(sys.argv) > 2 else 'questions.json'))
corr = json.load(open(sys.argv[1]))
faits, manques = 0, []
for c in corr:
    q = next(x for x in Q if x['labo'] == c['l'] and x['consigne'] == c['c'])
    labo, anciennes, nouvelles = q['labo'], q['options'], c['options']
    assert len(nouvelles) == len(anciennes), c
    page = (B / labo / 'page.html').read_text()
    fichiers = [B / labo / f for f in re.findall(r'src="([^"]+\.js)"', page) if not f.startswith('../../commun/')]
    motif = re.compile(r'\s*,\s*'.join(re.escape(json.dumps(o, ensure_ascii=False)) for o in anciennes))
    trouve = False
    for f in fichiers:
        f = f.resolve(); t = f.read_text()
        if motif.search(t):
            t = motif.sub(lambda m: ', '.join(json.dumps(o, ensure_ascii=False) for o in nouvelles), t, count=1)
            f.write_text(t); trouve = True; faits += 1; break
    if not trouve: manques.append((labo, q['consigne']))
print('appliquées', faits, 'manquées', len(manques))
for m in manques: print('  ', m)
