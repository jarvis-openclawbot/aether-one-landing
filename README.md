# Jarvis — Site premium multi-pages (Apple-inspired, branding Jarvis)

Refonte complète orientée **storytelling visuel**, **rythme de sections premium** et **parcours d'achat clair**.

## Pages

- `/index.html` — Accueil cinématique
- `/produit.html` — Design, puce, écran, durabilité
- `/camera.html` — Système caméra + galerie interactive
- `/offres.html` — Tableau comparatif + CTA achat/conseil
- `/a-propos.html` — Vision et méthode Jarvis
- `/contact.html` — Formulaire démo (validation front-end)
- `/mentions-legales.html` — Informations légales

## Stack

- HTML/CSS/JS statique
- Animations: reveal on-scroll, progress bar, tilt produit, effets caméra
- Déploiement automatique via GitHub Pages (`.github/workflows/deploy-pages.yml`)

## Vérifications locales

```bash
node --check assets/js/main.js
node --check assets/js/page-camera.js
node --check assets/js/page-contact.js
python3 -m http.server 8080
```

Puis ouvrir `http://localhost:8080`.
