# Véro Esthétique

Ce dépôt permet de prévisualiser, modifier et déployer le site vitrine français de Véro Esthétique. Le site fonctionne en HTML, CSS et JavaScript, sans dépendance à installer, serveur applicatif, base de données ou secret. La prise de rendez-vous ouvre le téléphone ou l’application SMS du visiteur.

## Prévisualiser le site

Vous avez besoin de Python 3 pour la prévisualisation et de Node.js 22 pour les contrôles et la génération du dossier de déploiement.

1. Depuis la racine du dépôt, démarrez un serveur local :

   ```sh
   python3 -m http.server 4173 --bind 127.0.0.1
   ```

2. Ouvrez [la prévisualisation locale](http://127.0.0.1:4173).
3. Vérifiez que la page d’accueil, les photos et la page Confidentialité s’affichent.

## Vérifier et préparer le déploiement

1. Contrôlez les pages, les liens, les ressources et l’intégrité des originaux :

   ```sh
   npm run check
   ```

   Le résultat attendu commence par `OK : 2 pages françaises` et confirme les neuf originaux intacts.

2. Générez le dossier à publier :

   ```sh
   npm run build
   ```

   La commande crée `dist/` avec les deux pages, les styles, le script et les médias. Elle remplace uniquement ce dossier généré.

3. Publiez le contenu de `dist/` sur votre hébergement statique. Pour un hébergeur avec génération automatique, utilisez `npm run build` comme commande et `dist` comme dossier de sortie.
4. Vérifiez sur l’URL publique les photos, la vidéo, le menu mobile et les liens téléphone/SMS.

Les chemins sont relatifs : vous pouvez servir le site à la racine d’un domaine ou dans un sous-dossier. Le dépôt contient aussi `.nojekyll` pour un hébergement statique sans traitement Jekyll. Le workflow GitHub Actions vérifie le site et sa génération à chaque push et pull request ; il ne publie pas le site.

Pour les URL absolues (adresse canonique, image de partage, plan du site), la construction utilise la variable `SITE_URL` si elle est définie, sinon le domaine de production fourni par Vercel. Sans domaine, ces balises sont simplement omises.

Pour Vercel, `vercel.json` sélectionne le préréglage « Other », exécute `npm run build` et publie `dist/`. Cette configuration remplace le dossier de sortie par défaut `public`. Importez le dépôt avec son répertoire racine ; les pushes sur la branche de production déclenchent le déploiement si l’intégration Git est activée.

## Modifier le contenu

Les fichiers principaux sont :

| Fichier | Contenu |
| --- | --- |
| `index.html` | Accueil, soins et tarifs, Véro, l’institut (photos et vidéo), questions et contact |
| `confidentialite.html` | Fonctionnement du site et confidentialité |
| `styles.css` | Couleurs, typographie et mises en page responsive |
| `script.js` | Menu mobile, visionneuse de photos, apparitions au défilement |
| `assets/images/` | Versions WebP allégées et affiche de la vidéo |
| `assets/fonts/` | Fraunces, Source Sans 3 et Great Vibes (« Véro » du logo) auto-hébergées et allégées, avec leurs licences OFL |
| `epilation-frejus.html`, `soin-visage-frejus.html`, `massage-frejus.html`, `rehaussement-cils-maquillage-frejus.html` | Pages par soin pour le référencement local (« soin + Fréjus »), avec tarifs, conseils, un avis client et réservation |
| `404.html` | Page d’erreur aux couleurs de l’institut |
| `vercel.json` | Construction, en-têtes de sécurité et de cache |
| `docs/LANCEMENT.md` | Audit avant mise en ligne et liste de contrôle |
| `docs/DIRECTION.md` | Direction visuelle : palette, typographie, principes de mise en page |
| `assets/originals-ajouts/` | Photos ajoutées en novembre 2026 (cabine lumineuse, entrée, citation) et carte des tarifs officielle (`carte-tarifs.webp`), fichiers d’origine |
| `assets/video/` | Sous-titres français (`vero.fr.vtt`, transcrits avec Whisper puis corrigés), aperçu muet de 4 s (`vero-apercu.mp4`) et vidéo de l’offre de novembre (`offre-novembre.mp4`). L’offre s’affiche jusqu’à la date `data-fin` de la section `#offre`, puis disparaît d’elle-même. |
| `assets/originals/` | Les huit photos JPG et la vidéo MP4 fournies, conservées sans modification |
| `assets/originals/manifest.json` | Taille et empreinte SHA-256 de chaque original |

Le numéro `07 82 77 29 46` et la signature « Votre beauté, vos envies, votre moment » proviennent de la carte de visite fournie. Les prestations et les quatre tarifs affichés en texte proviennent de la photo de la carte des soins. La carte originale reste consultable en grand. Les liens de réservation utilisent `tel:+33782772946` et `sms:+33782772946` ; ils ne confirment pas de rendez-vous automatiquement.

## Informations à compléter avant la mise en ligne publique

Le dépôt est prêt pour un déploiement technique. Les éléments fournis ne permettent pas de confirmer tous les renseignements pratiques et administratifs. Vérifiez les points suivants avec Véro :

- Confirmer les tarifs, les prestations et le numéro de téléphone.
- L’adresse, l’accès, les horaires et la réservation en ligne proviennent de la page Planity ; les tarifs, de la carte officielle de l’institut (novembre 2026). Mettre à jour le site à chaque nouvelle carte.
- Fournir l’identité légale de l’exploitant et les renseignements nécessaires à ses mentions légales, ainsi que l’identité de l’hébergeur une fois choisi. Ajouter la page correspondante et compléter la confidentialité avec les informations de cet hébergement.
- Confirmer que les médias fournis peuvent être utilisés publiquement.
- La vidéo est sous-titrée et transcrite (transcription vérifiée à l’écoute).
- Une fois le domaine choisi, ajouter l’URL canonique et une image de partage avec son URL publique absolue. Ces URL ne sont pas devinées.

Le site n’utilise ni traceur, ni cookie, ni stockage local, ni formulaire de collecte. Les polices sont hébergées avec le site et le lecteur vidéo est natif. Si vous ajoutez une mesure d’audience, un formulaire ou un service externe, adaptez les informations de confidentialité au fonctionnement réel.
