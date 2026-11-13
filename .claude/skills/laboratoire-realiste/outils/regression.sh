# Rejoue des scénarios de test : bash regression.sh "<id> <scenario sans .js>" ... ; affiche les missions accomplies et les erreurs.
cd "$(dirname "$0")"
for p in "$@"; do set -- $p; node lancer.js sources/$1/page.html ./$2.js /tmp/$2_fin.png > /tmp/sortie_$2.txt 2>&1
  echo "$1 : $(grep -o '[a-z_0-9]*:\(OK\|étape [0-9]*\)' /tmp/sortie_$2.txt | tail -3 | tr '\n' ' ') | $(grep -E 'ERREURS|Error' /tmp/sortie_$2.txt | head -1)"; done
