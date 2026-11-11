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

Pour Vercel, `vercel.json` sélectionne le préréglage « Other », exécute `npm run build` et publie `dist/`. Cette configuration remplace le dossier de sortie par défaut `public`. Importez le dépôt avec son répertoire racine ; les pushes sur la branche de production déclenchent le déploiement si l’intégration Git est activée.

## Modifier le contenu

Les fichiers principaux sont :

| Fichier | Contenu |
| --- | --- |
| `index.html` | Accueil, soins, tarifs sélectionnés, Véro, galerie, vidéo, FAQ et contact |
| `confidentialite.html` | Fonctionnement du site et confidentialité |
| `styles.css` | Couleurs, typographie et mises en page responsive |
| `script.js` | Menu mobile, visionneuse de photos et année du pied de page |
| `assets/images/` | Versions WebP allégées et affiche de la vidéo |
| `assets/originals/` | Les huit photos JPG et la vidéo MP4 fournies, conservées sans modification |
| `assets/originals/manifest.json` | Taille et empreinte SHA-256 de chaque original |

Le numéro `07 82 77 29 46` et la signature « Votre beauté, vos envies, votre moment » proviennent de la carte de visite fournie. Les prestations et les quatre tarifs affichés en texte proviennent de la photo de la carte des soins. La carte originale reste consultable en grand. Les liens de réservation utilisent `tel:+33782772946` et `sms:+33782772946` ; ils ne confirment pas de rendez-vous automatiquement.

## Informations à compléter avant la mise en ligne publique

Le dépôt est prêt pour un déploiement technique. Les éléments fournis ne permettent pas de confirmer tous les renseignements pratiques et administratifs. Vérifiez les points suivants avec Véro :

- Confirmer les tarifs, les prestations et le numéro de téléphone.
- Fournir une adresse lisible et validée, les indications d’accès et les horaires si vous souhaitez les afficher. Aucune adresse ou aucun horaire n’a été inventé.
- Fournir l’identité légale de l’exploitant et les renseignements nécessaires à ses mentions légales, ainsi que l’identité de l’hébergeur une fois choisi. Ajouter la page correspondante et compléter la confidentialité avec les informations de cet hébergement.
- Confirmer que les médias fournis peuvent être utilisés publiquement.
- Écouter la vidéo et fournir une transcription ou des sous-titres si elle comporte des paroles. Le lecteur permet le son, la lecture en ligne sur mobile et le plein écran, sans lecture automatique.
- Une fois le domaine choisi, ajouter l’URL canonique et une image de partage avec son URL publique absolue. Ces URL ne sont pas devinées.

Le site n’utilise ni traceur, ni cookie, ni stockage local, ni formulaire de collecte. Les polices sont celles de l’appareil et le lecteur vidéo est natif. Si vous ajoutez une mesure d’audience, un formulaire ou un service externe, adaptez les informations de confidentialité au fonctionnement réel.
