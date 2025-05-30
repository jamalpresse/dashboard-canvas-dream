
#!/bin/bash

# Script de déploiement pour dash.ihata.ma
# Exécuter depuis le répertoire de votre projet

APP_DIR="/var/www/dash-ihata"
DOMAIN="dash.ihata.ma"

echo "🚀 Déploiement de SNRTnews Dashboard"

# Copier les fichiers du projet
echo "📋 Copie des fichiers..."
sudo cp -r . $APP_DIR/
cd $APP_DIR

# Installation des dépendances
echo "📦 Installation des dépendances..."
npm install

# Build de production
echo "🔨 Build de production..."
npm run build

# Configuration nginx
echo "⚙️ Configuration de Nginx..."
sudo cp deploy/nginx.conf /etc/nginx/sites-available/$DOMAIN
sudo ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test de la configuration nginx
sudo nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Configuration Nginx valide"
    sudo systemctl reload nginx
else
    echo "❌ Erreur dans la configuration Nginx"
    exit 1
fi

# Démarrage avec PM2
echo "🔄 Démarrage de l'application avec PM2..."
pm2 stop dash-ihata 2>/dev/null || true
pm2 delete dash-ihata 2>/dev/null || true
pm2 start deploy/ecosystem.config.js
pm2 save
pm2 startup

echo "✅ Déploiement terminé!"
echo "🌐 Votre application est accessible sur: https://$DOMAIN"
echo ""
echo "Commandes utiles:"
echo "- Voir les logs: pm2 logs dash-ihata"
echo "- Redémarrer: pm2 restart dash-ihata"
echo "- Statut: pm2 status"
