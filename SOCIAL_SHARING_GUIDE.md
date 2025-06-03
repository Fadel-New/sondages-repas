# Guide pour tester le partage social sans OpenGraph.xyz

Ce guide explique comment tester que votre site s'affiche correctement lorsqu'il est partagé sur les réseaux sociaux, notamment WhatsApp, sans dépendre d'outils externes comme OpenGraph.xyz.

## Outils intégrés disponibles

Notre site dispose désormais d'outils intégrés pour valider les partages sociaux :

1. **Validateur de Meta Tags** : `/api/debug-social-meta`
   - Affiche toutes les méta-données Open Graph et Twitter Card
   - Vérifie l'accessibilité de l'image de partage
   - Simule l'aperçu sur WhatsApp

2. **Vérificateur d'image** : `/api/check-social-image`
   - Vérifie le statut technique de l'image de partage
   - Confirme l'accessibilité publique de l'image
   - Vérifie la taille du fichier

3. **Validateur HTML statique** : `/og-validator.html`
   - Interface utilisateur pour tester les méta-données
   - Simulation visuelle de l'aperçu WhatsApp
   - Test d'accessibilité de l'image intégré

4. **Aperçu de partage** : `/preview-sharing`
   - Visualisation détaillée du partage
   - Liens vers tous les outils de validation
   - Conseils pour le débogage

## Comment tester le partage social

### 1. Depuis le tableau de bord d'administration

1. Connectez-vous au tableau de bord d'administration
2. Utilisez les boutons de vérification du partage social
3. Examinez les résultats dans les fenêtres ouvertes

### 2. Utilisation du script de validation

Exécutez le script de validation depuis le terminal :

```bash
# Pour une URL locale (en développement)
./scripts/validate-social-sharing.sh http://localhost:3000

# Pour votre URL de production
./scripts/validate-social-sharing.sh https://sondages-repas.vercel.app
```

Le script vérifiera :
- L'accessibilité du site principal
- L'accessibilité de l'image de partage
- Générera des liens pour les outils de test

### 3. Test manuel sur WhatsApp

Pour tester réellement le partage sur WhatsApp :

1. Utilisez une URL avec un paramètre de cache-busting :
   ```
   https://sondages-repas.vercel.app/?v=123456789
   ```
   (changez le nombre à chaque test)

2. Partagez cette URL sur WhatsApp (avec vous-même ou un groupe test)

3. Vérifiez que l'image et la description apparaissent correctement

## Résolution des problèmes courants

### L'image n'apparaît pas dans la prévisualisation

- **Vérifiez l'accessibilité** : Confirmez que l'URL de l'image est accessible publiquement
- **Vérifiez les dimensions** : L'image doit être au format 1200x630 pixels
- **Problème de cache** : WhatsApp met en cache les aperçus, utilisez toujours un paramètre URL unique
- **Problèmes CORS** : Vérifiez les en-têtes de votre serveur pour les restrictions CORS

### Mauvaise description ou titre

- Vérifiez les balises meta dans le composant Layout.tsx
- Confirmez que les balises sont correctement générées avec l'outil `/api/debug-social-meta`

## Alternatives à OpenGraph.xyz

Si vous souhaitez utiliser des validateurs externes, voici des alternatives à OpenGraph.xyz :

1. **Validateur Facebook** : [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
2. **Validateur Twitter** : [Twitter Card Validator](https://cards-dev.twitter.com/validator)
3. **LinkedIn Post Inspector** : [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)

Ces outils officiels sont généralement plus fiables et à jour que les services tiers.
