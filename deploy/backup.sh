
#!/bin/bash

# Script de sauvegarde pour dash.ihata.ma

BACKUP_DIR="/var/backups/dash-ihata"
APP_DIR="/var/www/dash-ihata"
DATE=$(date +%Y%m%d_%H%M%S)

echo "💾 Sauvegarde de l'application..."

# Créer le répertoire de sauvegarde
sudo mkdir -p $BACKUP_DIR

# Sauvegarder l'application
sudo tar -czf "$BACKUP_DIR/app-backup-$DATE.tar.gz" -C $APP_DIR .

# Sauvegarder la configuration nginx
sudo cp /etc/nginx/sites-available/dash.ihata.ma "$BACKUP_DIR/nginx-config-$DATE.conf"

# Nettoyer les anciennes sauvegardes (garder les 7 dernières)
sudo find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
sudo find $BACKUP_DIR -name "*.conf" -mtime +7 -delete

echo "✅ Sauvegarde terminée: $BACKUP_DIR/app-backup-$DATE.tar.gz"
