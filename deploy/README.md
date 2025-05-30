
# Déploiement SNRTnews Dashboard sur dash.ihata.ma

## Prérequis
- Serveur Ubuntu/Debian avec accès root
- Nom de domaine pointant vers votre serveur
- Accès SSH au serveur

## Installation étape par étape

### 1. Préparation du serveur
```bash
# Connectez-vous à votre serveur
ssh root@votre-serveur-ip

# Exécutez le script d'installation
chmod +x deploy/install.sh
./deploy/install.sh
```

### 2. Déploiement de l'application
```bash
# Copiez les fichiers sur le serveur (depuis votre machine locale)
scp -r . root@votre-serveur-ip:/var/www/dash-ihata/

# Sur le serveur, exécutez le déploiement
cd /var/www/dash-ihata
chmod +x deploy/deploy.sh
./deploy/deploy.sh
```

### 3. Configuration SSL
```bash
# Configurez SSL avec Let's Encrypt
chmod +x deploy/ssl-setup.sh
./deploy/ssl-setup.sh
```

### 4. Configuration du firewall
```bash
# Ouvrir les ports nécessaires
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable
```

## Gestion de l'application

### Commandes PM2 utiles
```bash
pm2 status              # Voir le statut
pm2 logs dash-ihata     # Voir les logs
pm2 restart dash-ihata  # Redémarrer
pm2 stop dash-ihata     # Arrêter
pm2 reload dash-ihata   # Recharger sans downtime
```

### Logs
- Application: `/var/log/pm2/dash-ihata-*.log`
- Nginx: `/var/log/nginx/dash-ihata-*.log`

### Sauvegarde
```bash
# Créer une sauvegarde
./deploy/backup.sh

# Programmer une sauvegarde quotidienne
(crontab -l; echo "0 2 * * * /var/www/dash-ihata/deploy/backup.sh") | crontab -
```

## Mise à jour de l'application

1. Sauvegardez l'application actuelle
2. Copiez les nouveaux fichiers
3. Relancez le build et redémarrez PM2

```bash
./deploy/backup.sh
npm run build
pm2 reload dash-ihata
```

## Surveillance

### Monitoring avec PM2
```bash
pm2 monit               # Interface de monitoring
pm2 plus                # Monitoring web (optionnel)
```

### Vérification de santé
```bash
curl -I https://dash.ihata.ma  # Test de connectivité
```

## Résolution de problèmes

1. **Erreur 502 Bad Gateway**: Vérifiez que PM2 fonctionne
2. **Erreur SSL**: Vérifiez les certificats Let's Encrypt
3. **Performance lente**: Vérifiez les ressources du serveur

## Contact
Pour toute question technique, consultez les logs ou contactez l'équipe technique.
