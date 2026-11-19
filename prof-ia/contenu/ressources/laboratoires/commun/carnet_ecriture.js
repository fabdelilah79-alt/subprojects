/*
Rôle : écriture des textes du carnet de laboratoire comme dans un cahier de physique-chimie : indices et exposants
       (x_max, U_G, F_{S/T}, 10^{8}, VE, Vm, Qr,i, t1/2, pKA, KA, Ke), fractions posées (« a / b » quand une égalité les
       précède dans la même proposition, « (1/V) » et « dx/dt », mais pas les unités comme « (m/s) ») ; ordre des choix d'une question mélangé, le même à chaque
       affichage, pour que la bonne réponse ne soit pas toujours la première.
Reçoit : un élément HTML et un texte ; une question à choix { options }.
Produit : Labo.ecrire_riche(element, texte) (remplace celle de base.js) ; Labo.ordre_choix(question) -> indices des options
          dans l'ordre d'affichage.
Utilisé par : carnet.js.
*/
(function (L) {
  const MOTS = [[/^VE$/, "V", "E"], [/^Vm$/, "V", "m"], [/^Qr,(i|éq)$/, "Q", "r,$1"], [/^Qr$/, "Q", "r"], [/^t1\/2$/, "t", "1/2"], [/^pKA$/, "pK", "A"], [/^KA$/, "K", "A"], [/^Ke$/, "K", "e"]];
  const JETON = /([\^_]\{[^}]*\})|\b([A-Za-zΔ])_([A-Za-z0-9]+(?:,[a-zé]+)?)\b|(?<![\w])(VE|Vm|Qr,(?:i|éq)|Qr|t1\/2|pKA|KA|Ke)(?![\w/])/u;

  function morceaux(parent, texte) {
    // Texte simple : indices, exposants et grandeurs usuelles (VE -> V indice E).
    let reste = String(texte);
    while (reste) {
      const m = reste.match(JETON);
      if (!m) { parent.append(reste); return; }
      if (m.index > 0) parent.append(reste.slice(0, m.index));
      if (m[1]) L.html(m[1][0] === "^" ? "sup" : "sub", {}, parent, m[1].slice(2, -1));
      else if (m[2]) { parent.append(m[2]); L.html("sub", {}, parent, m[3]); }
      else { const [re, base, indice] = MOTS.find(([r]) => r.test(m[4])); parent.append(base); L.html("sub", {}, parent, m[4].replace(re, indice)); }
      reste = reste.slice(m.index + m[0].length);
    }
  }

  function operande(t, i, sens) {
    // Bornes de l'opérande à gauche (sens -1) ou à droite (sens 1) d'une barre de fraction en i, parenthèses comprises.
    const ouvre = sens > 0 ? "([" : ")]", ferme = sens > 0 ? ")]" : "([";
    let j = i, prof = 0;
    while (j >= 0 && j < t.length) {
      const ch = t[j];
      if (ouvre.includes(ch)) prof++;
      else if (ferme.includes(ch)) { if (prof === 0) break; prof--; } else if (ch === " " && prof === 0) break;
      j += sens;
    }
    return j;
  }

  // Parenthèses qui entourent tout l'opérande : on les ôte, sauf autour d'un petit quotient « (m/180) », écrit lui aussi posé.
  function gauche(t, i) {
    // Début du numérateur d'une fraction « … / » : juste après le signe =, ou après la parenthèse ouvrante qui la contient.
    let j = i, prof = 0;
    while (j >= 0) {
      const ch = t[j];
      if (")]".includes(ch)) prof++;
      else if ("([".includes(ch)) { if (prof === 0) break; prof--; } else if (prof === 0 && "=;:".includes(ch)) break;
      j--;
    }
    j++;
    while (t[j] === " ") j++;
    return j;
  }

  // Unité (m/s, mol/L, mS·m²/mol, rad/s...) : écrite en ligne, jamais posée en fraction.
  const UNITE = /^(?:[µmkcdn]?(?:mol|rad|div|min|Hz|m|g|s|L|V|A|N|J|W|Ω|S|C|T|h)[²³]?(?:·(?!$)|$))+$/u;
  const sans_parentheses = (s) => (/^\([^()\s/]{1,12}\/[^()\s/]{1,12}\)$/.test(s) ? s : /^\(.*\)$/.test(s) && operande(s, 1, 1) === s.length - 1 ? s.slice(1, -1) : s);

  function fraction(parent, haut, bas) {
    // Fraction posée : numérateur, trait, dénominateur.
    const f = L.html("span", { class: "frac" }, parent);
    ecrire(L.html("span", { class: "frac-haut" }, f), sans_parentheses(haut));
    ecrire(L.html("span", { class: "frac-bas" }, f), sans_parentheses(bas));
  }

  function ecrire(parent, texte) {
    // Cherche la première fraction « a / b » précédée d'une égalité dans sa proposition (ou « (a/b) ») et l'écrit posée.
    const t = String(texte);
    for (let i = t.indexOf(" / "); i >= 0; i = t.indexOf(" / ", i + 1)) {
      const debut = Math.max(t.lastIndexOf(";", i), t.lastIndexOf(":", i), 0);
      if (!t.slice(debut, i).includes("=")) continue;
      const g = gauche(t, i - 1);
      let d = operande(t, i + 3, 1);
      while (d > i + 3 && ".,;?!".includes(t[d - 1])) d--;
      if (g >= i || d <= i + 3) continue;
      ecrire(parent, t.slice(0, g)); fraction(parent, t.slice(g, i), t.slice(i + 3, d)); ecrire(parent, t.slice(d));
      return;
    }
    const m = t.match(/\(([^()\s/]{1,12})\/([^()\s/]{1,12})\)|\b(d[A-Za-zθ]{1,2})\/(d[a-z]{1,2})\b/);
    if (m && !(UNITE.test(m[1] || "") && UNITE.test(m[2] || ""))) {
      ecrire(parent, t.slice(0, m.index)); fraction(parent, m[1] || m[3], m[2] || m[4]); ecrire(parent, t.slice(m.index + m[0].length));
      return;
    }
    morceaux(parent, t);
  }

  L.ecrire_riche = function (element, texte) {
    // Remplit un élément HTML avec un texte écrit comme une formule de cahier.
    element.replaceChildren();
    ecrire(element, texte);
    return element;
  };

  L.ordre_choix = function (q) {
    // Ordre d'affichage des options, tiré d'après leur texte : le même à chaque fois, différent d'une question à l'autre.
    let h = 2166136261;
    for (const ch of q.options.join("|")) h = Math.imul(h ^ ch.codePointAt(0), 16777619) >>> 0;
    const ordre = q.options.map((_, i) => i);
    for (let i = ordre.length - 1; i > 0; i--) { h = Math.imul(h ^ (h >>> 15), 2246822507) >>> 0; const j = h % (i + 1); [ordre[i], ordre[j]] = [ordre[j], ordre[i]]; }
    return ordre;
  };
})(window.Labo);
