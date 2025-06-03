#!/bin/bash
# scripts/validate-social-sharing.sh

# Script pour valider les méta-données de partage social sans dépendance externe

echo "🧪 Validation du partage social sans OpenGraph.xyz"

# Configuration
BASE_URL=${1:-https://sondages-repas.vercel.app}
IMAGE_PATH="/images/repas-social.jpeg"
CACHE_BUSTER=$(date +%s)
TEST_URL="${BASE_URL}/?v=${CACHE_BUSTER}"
IMAGE_URL="${BASE_URL}${IMAGE_PATH}"

echo "🌐 Site URL: $BASE_URL"
echo "🔄 Test URL (avec cache-busting): $TEST_URL"
echo "🖼️ Image URL: $IMAGE_URL"

# Fonction pour faire une requête HTTP HEAD
check_url() {
  local url="$1"
  local description="$2"
  
  echo -n "📝 Vérification de $description... "
  
  if command -v curl &> /dev/null; then
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -I "$url")
    if [ "$HTTP_CODE" == "200" ]; then
      echo "✅ Accessible (HTTP 200)"
    else
      echo "❌ Non accessible (HTTP $HTTP_CODE)"
    fi
  else
    echo "⚠️ Impossible de vérifier (curl non disponible)"
  fi
}

# Vérifier l'accessibilité des ressources
check_url "$BASE_URL" "l'URL principale"
check_url "$IMAGE_URL" "l'image de partage social"

# Générer les liens pour les tests
DEBUG_META_URL="${BASE_URL}/api/debug-social-meta"
CHECK_IMAGE_URL="${BASE_URL}/api/check-social-image"
VALIDATOR_URL="${BASE_URL}/og-validator.html"

# Encodage URL pour WhatsApp (avec ou sans jq)
if command -v jq &> /dev/null; then
  # Si jq est disponible, l'utiliser pour un encodage correct
  WHATSAPP_SHARE="https://api.whatsapp.com/send?text=$(printf "%s" "$TEST_URL" | jq -sRr @uri)"
else
  # Solution de secours si jq n'est pas installé
  # Encodage URL basique (pas parfait mais fonctionne pour la plupart des cas)
  ENCODED_URL=$(echo "$TEST_URL" | sed 's/:/%3A/g' | sed 's/\//%2F/g' | sed 's/?/%3F/g' | sed 's/=/%3D/g' | sed 's/&/%26/g')
  WHATSAPP_SHARE="https://api.whatsapp.com/send?text=$ENCODED_URL"
fi

echo
echo "🛠 Outils de validation disponibles:"
echo "  -> Validateur de meta tags: $DEBUG_META_URL"
echo "  -> Vérificateur d'image: $CHECK_IMAGE_URL" 
echo "  -> Simulateur d'aperçu: $VALIDATOR_URL"
echo
echo "📱 Lien de partage WhatsApp:"
echo "  -> $WHATSAPP_SHARE"
echo

# Vérifier le déploiement local (en développement)
if [[ "$BASE_URL" == *"localhost"* ]]; then
  echo "🔍 Environnement de développement détecté"
  echo "  -> Vérifiez que le serveur Next.js est en cours d'exécution"
  echo "  -> Utilisez 'npm run build && npm run start' pour tester en mode production locale"
else
  echo "🌍 URL de production détectée"
  echo "  -> Assurez-vous que votre déploiement est à jour"
  echo "  -> Vérifiez les autorisations CORS si nécessaire"
fi

echo
echo "📝 Conseils pour le partage sur WhatsApp:"
echo "1. Assurez-vous que l'image est accessible publiquement"
echo "2. L'image doit avoir une taille de 1200x630 pixels"
echo "3. WhatsApp met en cache les aperçus, utilisez toujours un paramètre unique (?v=...)"
echo "4. En cas de problème, vérifiez la console développeur pour les erreurs CORS ou 404"
echo
echo "👉 Pour tester de manière approfondie, visitez le tableau de bord d'administration"
