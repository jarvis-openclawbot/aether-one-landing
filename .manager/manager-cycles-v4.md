# Manager Cycles v4 — Strict 15-Cycle Quality Loop

Scope applied on every cycle: `index.html`, `produit.html`, `camera.html`, `offres.html`, `a-propos.html`, `contact.html`, `mentions-legales.html` + shared `assets/css/main.css`, `assets/js/main.js`, `assets/js/page-camera.js`, `assets/js/page-contact.js`.

Method repeated each cycle: desktop + mobile assumption review, defect list with severity, implementation, quick verify.

---

## Cycle 1
- Inspection: global header/nav consistency, CTA hierarchy, above-the-fold clarity.
- Defects:
  - **Moyen**: duplication du CTA « Précommander » dans le header (dans la nav + à droite), bruit visuel et ambiguïté conversion.
- Fixes:
  - Retiré le CTA du bloc `.nav-links` sur les 7 pages.
  - Conservé un CTA principal unique en header (`.header-cta`).
- Quick verify:
  - Header plus net, conversion plus claire, pas de régression de navigation.

## Cycle 2
- Inspection: menu mobile, états ARIA, cohérence action ouverte/fermée.
- Defects:
  - **Moyen**: bouton menu mobile ne reflète pas l’état dans son `aria-label`.
- Fixes:
  - Ajout `syncMenuA11y()` dans `assets/js/main.js`.
  - `aria-label` dynamique: « Ouvrir le menu » / « Fermer le menu ».
- Quick verify:
  - Toggle menu mobile + ESC + fermeture par clic lien OK avec attributs accessibles cohérents.

## Cycle 3
- Inspection: association bouton/menu mobile.
- Defects:
  - **Faible**: manque de relation explicite bouton->menu dans le DOM.
- Fixes:
  - Ajout `aria-controls="site-nav"` au bouton menu.
  - Ajout `id="site-nav"` sur la nav principale (7 pages).
- Quick verify:
  - Association ARIA valide, comportement inchangé.

## Cycle 4
- Inspection: mobile UX en bas d’écran (sticky CTA) sur pages longues (Offres/Contact/Mentions).
- Defects:
  - **Moyen**: risque de chevauchement visuel entre contenu final/footer et CTA sticky mobile.
- Fixes:
  - Ajout `main { padding-bottom: 5.8rem; }` sous breakpoint mobile.
- Quick verify:
  - Zone de respiration rétablie avant footer sur mobile.

## Cycle 5
- Inspection: cohérence style CTA header.
- Defects:
  - **Faible**: absence de classe dédiée pour le CTA header unique (maintenabilité/style drift).
- Fixes:
  - Ajout classe `.header-cta` et règle CSS dédiée.
  - Règle mobile ciblée: `.site-header .header-cta { display: none; }`.
- Quick verify:
  - Header desktop propre; mobile garde menu + sticky CTA sans doublons.

## Cycle 6
- Inspection: lisibilité FR, ton premium Apple-minimal, branding Jarvis sur toutes pages.
- Defects:
  - **Faible**: aucun défaut bloquant détecté après correctifs.
- Fixes:
  - Aucun code supplémentaire requis.
- Quick verify:
  - Cohérence éditoriale FR + marque Jarvis maintenue.

## Cycle 7
- Inspection: composants boutons (`.btn`, `.btn-primary`, `.btn-secondary`, `.btn-link`) desktop/mobile.
- Defects:
  - **Faible**: aucun écart d’état (hover/active/focus) critique.
- Fixes:
  - Aucun.
- Quick verify:
  - Consistance CTA validée (header, sections, sticky mobile, formulaires).

## Cycle 8
- Inspection: sections produit + subnav (anchors, scroll offset, état actif).
- Defects:
  - **Faible**: aucun problème d’offset observé avec variables `--header-height` / `--subnav-height`.
- Fixes:
  - Aucun.
- Quick verify:
  - Navigation interne Produit fluide et lisible.

## Cycle 9
- Inspection: page Caméra (rig, galerie, contrôles scènes, lisibilité mobile).
- Defects:
  - **Faible**: aucun défaut de conversion/lecture majeur détecté.
- Fixes:
  - Aucun.
- Quick verify:
  - Changement de scène et états `aria-pressed` OK.

## Cycle 10
- Inspection: page Contact (formulaire, messages, erreurs, conversion).
- Defects:
  - **Faible**: aucun défaut bloquant; validation et guidance cohérentes.
- Fixes:
  - Aucun.
- Quick verify:
  - Messages d’erreur champ par champ + statut global corrects.

## Cycle 11
- Inspection: page Offres (pricing cards, tableau comparatif, CTA).
- Defects:
  - **Faible**: aucun défaut sévère; hiérarchie des offres claire.
- Fixes:
  - Aucun.
- Quick verify:
  - Parcours comparaison -> contact/commande cohérent.

## Cycle 12
- Inspection: pages À propos + Mentions (lisibilité, densité info, structure).
- Defects:
  - **Faible**: aucun défaut critique.
- Fixes:
  - Aucun.
- Quick verify:
  - Lecture claire desktop/mobile, ton premium conservé.

## Cycle 13
- Inspection: anti-pattern visuel (phone-in-frame nested visuals) + assets.
- Defects:
  - **Faible**: anti-pattern non réintroduit dans les pages.
- Fixes:
  - Aucun.
- Quick verify:
  - Hero et sections visuelles restent sans faux cadre device imbriqué.

## Cycle 14
- Inspection: robustesse scripts + états motion/reduced-motion + sticky metrics.
- Defects:
  - **Faible**: pas d’erreur syntaxique ni défaut de comportement critique.
- Fixes:
  - Aucun.
- Quick verify:
  - Logique motion/sticky stable après retouches header/nav.

## Cycle 15
- Inspection finale complète: 7 pages + composants partagés + liens internes + smoke HTTP.
- Defects:
  - **Aucun défaut critique/majeur** restant.
- Fixes:
  - Aucun.
- Quick verify final:
  - `node --check assets/js/main.js assets/js/page-camera.js assets/js/page-contact.js` ✅
  - Smoke local (7/7 pages) HTTP 200 ✅
  - Vérification liens internes (href locaux) ✅

---

## Résultat global du loop v4
- 15 cycles exécutés **strictement**.
- Priorités traitées: polish premium, UX mobile, cohérence CTA/boutons, lisibilité, clarté conversion.
- FR + branding Jarvis + style Apple-minimal conservés.
- Anti-pattern « phone-in-frame nested visuals » toujours absent.
