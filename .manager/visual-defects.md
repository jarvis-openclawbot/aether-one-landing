# Backlog défauts visuels — Audit complet Jarvis (2026-03-12)

## P0 (bloquant perception premium)

1. **[Résolu] Anti-pattern critique hero (Accueil)**  
   iPhone photo placée dans une maquette de téléphone (effet “photo cheap dans cadre”).  
   **Correction :** remplacement total par un visuel local `hero-interface-premium.svg` (composition UI premium, pseudo-3D).

2. **[Résolu] Identité visuelle photo-stock incohérente entre pages**  
   Mélange de visuels Unsplash au style variable, ressenti template non-curé.  
   **Correction :** remplacement des visuels principaux par un set premium cohérent local SVG (hero/produit/narration/studio/caméra).

3. **[Résolu] Système de boutons trop générique**  
   Bord arrondi “pill” banal, faible hiérarchie tactile, hover peu qualitatif.  
   **Correction :** refonte globale `.btn` (shape 16px, gradient premium, border + inner highlight, hover/active/focus plus précis, contraste renforcé).

4. **[Résolu] Manque de rythme visuel section à section**  
   Transitions abruptes et densité perçue irrégulière.  
   **Correction :** re-travail des espacements, overlays subtils sur panels, ombres et profondeur harmonisées.

## P1 (important)

5. **[Résolu] Page Produit : visuel principal faible**  
   Image lifestyle non distinctive pour un discours “précision matériaux”.  
   **Correction :** `product-chassis-premium.svg` orienté design industriel/lumière studio.

6. **[Résolu] Page À propos trop textuelle**  
   Bloc narratif sans ancrage visuel premium.  
   **Correction :** ajout d’un showcase “studio Jarvis” (`studio-premium.svg`).

7. **[Résolu] Page Offres peu aspirante**  
   Entrée directe en pricing cards, manque de “premium framing”.  
   **Correction :** ajout d’un hero visuel de gamme avant la grille tarifaire.

8. **[Résolu] Galerie Caméra dépendante de photos externes**  
   Cohérence de rendu incertaine + chargement tiers.  
   **Correction :** 3 scènes premium locales (`camera-scene-*.svg`) pilotées par le JS existant.

9. **[Résolu] Contraste/finition des composants secondaires**  
   Cards/form/table un peu plats sur certaines sections.  
   **Correction :** ajustement global surfaces, borders, ombres, couleurs muted.

## P2 (améliorations non bloquantes)

10. **[Ouvert] Uniformiser les styles inline restants (h2 / marges)**  
    Plusieurs styles inline persistent dans le HTML.  
    **Proposition :** migrer vers utilitaires CSS dédiés pour maintenance long terme.

11. **[Ouvert] Enrichir micro-interactions section CTA finale**  
    Possibilité d’ajouter light sweep subtil sur CTA panels desktop.  
    **Proposition :** animation non intrusive conditionnée à `prefers-reduced-motion`.

12. **[Ouvert] Ajouter variantes light/dark d’actifs premium**  
    Préparer déclinaisons visuelles pour futures pages marketing.  
    **Proposition :** pack d’assets design system Jarvis.

---

## Audit couverture
Pages auditées entièrement (sections + CTA + boutons + liens de nav/footer):
- `index.html`
- `produit.html`
- `camera.html`
- `offres.html`
- `a-propos.html`
- `contact.html`
- `mentions-legales.html`
