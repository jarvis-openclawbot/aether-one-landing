# Jarvis — Site marketing multi-pages (version finale)

Site statique premium en français, inspiré d'un design minimal type Apple (original), avec storytelling smartphone + caméra, animations fluides et navigation complète.

## Pages

- `/index.html` — Accueil
- `/produit.html` — Produit
- `/camera.html` — Caméra
- `/offres.html` — Offres
- `/a-propos.html` — À propos
- `/contact.html` — Contact (formulaire démo front-end)
- `/mentions-legales.html` — Mentions légales

## Structure

- `assets/css/main.css` — design system + composants + responsive + animations
- `assets/js/main.js` — navigation active, reveal scroll, tilt 3D, parallax
- `assets/js/page-camera.js` — transitions de galerie caméra
- `assets/js/page-contact.js` — validation UX formulaire démo

## Lancer en local

```bash
python3 -m http.server 8080
# ouvrir http://localhost:8080
```

## Vérifications rapides

```bash
node --check assets/js/main.js
node --check assets/js/page-camera.js
node --check assets/js/page-contact.js
```

## Déploiement

Le repo inclut un workflow GitHub Pages (`.github/workflows/deploy-pages.yml`).
Après `git push` sur la branche principale, le site est publié automatiquement.
