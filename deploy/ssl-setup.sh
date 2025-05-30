
#!/bin/bash

# Configuration SSL avec Let's Encrypt pour dash.ihata.ma

DOMAIN="dash.ihata.ma"
EMAIL="admin@ihata.ma"  # Changez cette adresse email

echo "🔒 Configuration SSL pour $DOMAIN"

# Installer Certbot
if ! command -v certbot &> /dev/null; then
    echo "📦 Installation de Certbot..."
    sudo apt-get update
    sudo apt-get install -y certbot python3-certbot-nginx
fi

# Obtenir le certificat SSL
echo "🔐 Obtention du certificat SSL..."
sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN --email $EMAIL --agree-tos --non-interactive

# Configuration du renouvellement automatique
echo "⏰ Configuration du renouvellement automatique..."
(crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab -

echo "✅ SSL configuré avec succès!"
echo "🔒 Votre site est maintenant sécurisé avec HTTPS"
