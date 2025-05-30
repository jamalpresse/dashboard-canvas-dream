
#!/bin/bash

# Script d'installation pour dash.ihata.ma
# Exécuter avec: chmod +x install.sh && ./install.sh

echo "🚀 Installation de SNRTnews Dashboard sur dash.ihata.ma"

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Installation..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Vérifier si nginx est installé
if ! command -v nginx &> /dev/null; then
    echo "❌ Nginx n'est pas installé. Installation..."
    sudo apt-get update
    sudo apt-get install -y nginx
fi

# Installer PM2 globalement
if ! command -v pm2 &> /dev/null; then
    echo "📦 Installation de PM2..."
    sudo npm install -g pm2
fi

# Créer le répertoire de l'application
APP_DIR="/var/www/dash-ihata"
sudo mkdir -p $APP_DIR
sudo chown -R $USER:$USER $APP_DIR

echo "✅ Prérequis installés avec succès!"
echo "📁 Répertoire de l'application: $APP_DIR"
echo ""
echo "Prochaines étapes:"
echo "1. Copiez les fichiers de votre projet dans $APP_DIR"
echo "2. Exécutez le script de déploiement: ./deploy.sh"
