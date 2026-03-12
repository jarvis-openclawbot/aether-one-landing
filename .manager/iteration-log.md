# Journal d’itérations QA — Jarvis

## Cycle 1
**Évaluation**: base solide, style premium présent mais hiérarchie visuelle irrégulière entre pages.
**Défauts**:
- Moyen: rythmes de sections incohérents (espacements variables).
- Moyen: accessibilité clavier discrète (focus peu visible).
- Faible: absence de lien d’évitement.
**Correctifs appliqués**:
- Harmonisation des espacements (`.section + .section`).
- Ajout de styles `:focus-visible`.
- Préparation insertion skip-link sur toutes les pages.
**Ré-évaluation**: navigation clavier plus claire, lecture plus structurée.

## Cycle 2
**Évaluation**: navigation globale cohérente mais manque d’accessibilité structurelle.
**Défauts**:
- Haut: pas de skip-link.
- Moyen: cible principale non identifiée pour navigation assistive.
**Correctifs appliqués**:
- Ajout `Aller au contenu` sur les 7 pages.
- Ajout `id="main-content"` à chaque `<main>`.
**Ré-évaluation**: parcours lecteur d’écran/ clavier nettement amélioré.

## Cycle 3
**Évaluation**: cartes premium bonnes, interactions survol limitées.
**Défauts**:
- Moyen: cartes statiques, sensation premium incomplète.
**Correctifs appliqués**:
- Hover card: bordure lumineuse + ombre enrichie.
- Ajustement transitions (transform, border-color).
**Ré-évaluation**: micro-interactions plus vivantes sans agressivité.

## Cycle 4
**Évaluation**: page Produit sous-nav visuelle mais pas assez intelligente.
**Défauts**:
- Moyen: sous-navigation sans indication active au scroll.
- Faible: ancrages abrupts.
**Correctifs appliqués**:
- JS: activation dynamique `aria-current` sur sous-nav.
- Scroll ancré avec offset header + smooth conditionnel.
- CSS: style actif sous-nav.
**Ré-évaluation**: lecture Produit plus guidée, meilleure continuité narrative.

## Cycle 5
**Évaluation**: page Caméra visuelle forte mais script couplé à un sélecteur non utilisé.
**Défauts**:
- Haut: animation lentille potentiellement inactive (`.camera-lens` absent).
- Moyen: changement d’image sans préchargement.
**Correctifs appliqués**:
- Sélecteur lens élargi (`.camera-lens, .lens-stack`).
- Préchargement image avant swap galerie.
**Ré-évaluation**: interactions caméra plus fiables, transitions plus propres.

## Cycle 6
**Évaluation**: formulaire fonctionnel mais UX de validation perfectible.
**Défauts**:
- Haut: focus non guidé vers premier champ invalide.
- Moyen: pas de feedback d’envoi.
- Moyen: état visuel invalide insuffisant.
**Correctifs appliqués**:
- Focus auto premier champ invalide.
- États visuels d’erreur et focus renforcés.
- Bouton désactivé + message “Envoi en cours…”, confirmation temporisée.
**Ré-évaluation**: UX formulaire plus cohérente, perception de qualité supérieure.

## Cycle 7
**Évaluation**: homepage premium mais storytelling commercial un peu court.
**Défauts**:
- Moyen: manque d’argumentaire intermédiaire avant bloc métriques.
**Correctifs appliqués**:
- Ajout d’une section “Livraison / Engagement” sur l’accueil.
**Ré-évaluation**: meilleur rythme, bénéfices concrets plus tôt dans le parcours.

## Cycle 8
**Évaluation**: page Offres claire, mais comparatif détaillé absent.
**Défauts**:
- Moyen: arbitrage entre offres peu immédiat.
**Correctifs appliqués**:
- Ajout tableau comparatif accessible (`compare-table`).
**Ré-évaluation**: décision facilitée, cohérence commerciale renforcée.

## Cycle 9
**Évaluation**: page Caméra immersive, CTA final manquant.
**Défauts**:
- Moyen: absence de conversion directe depuis la page caméra.
**Correctifs appliqués**:
- Ajout bloc CTA “Réserver une démo caméra” avec lien contact.
**Ré-évaluation**: entonnoir plus fluide vers conversion.

## Cycle 10
**Évaluation**: page Contact efficace, manque d’alternative contact rapide visible.
**Défauts**:
- Faible: canal email direct non mis en avant.
**Correctifs appliqués**:
- Ajout bloc support commercial avec adresse mail et SLA indicatif.
**Ré-évaluation**: crédibilité service + clarté du point de contact améliorées.

## Cycle 11
**Évaluation**: cohérence inter-pages bonne, détails de finition restants.
**Défauts**:
- Faible: états disabled/hovers inégaux.
- Faible: lisibilité message statut formulaire.
**Correctifs appliqués**:
- Style bouton désactivé.
- `min-height` et poids typographique pour zone statut.
- Hover liens footer.
**Ré-évaluation**: interface plus uniforme, finition premium renforcée.

## Cycle 12
**Évaluation finale globale**:
- Structure Apple-like: nette (hero fort, sections respirantes, storytelling progressif).
- Animation: plus riche mais contrôlée (reveal, depth, tilt, galerie).
- FR only: conforme.
- Cohérence nav/header/footer: conforme.
- Accessibilité de base: améliorée (skip-link, focus, invalid states, aria-current).
**Défauts restants (faibles)**:
- Faible: certains styles inline dans HTML à externaliser.
- Faible: optimisation perf image encore possible (formats modernes/tailles dédiées).
**Actions finales**:
- Relecture complète liens internes sur les 7 pages.
- Préparation validation technique (JS check + smoke test + grep placeholders).
**Ré-évaluation**: niveau prêt livraison interne QA, rendu premium significativement renforcé.
