#!/bin/bash
set -e

echo "🌴 Déploiement de CoconutClash..."

# 1. Pull les derniers changements (si utilisé avec Git)
# git pull origin main

# 2. Installer les dépendances (npm workspaces s'occupe de tout)
echo "📦 Installation des dépendances..."
npm install

# 3. Build partagé et serveur
echo "🔨 Compilation du serveur..."
npm run build:shared
npm run build:server

# 4. Build client (Vite)
echo "🎨 Compilation du client..."
npm run build:client

# 5. Redémarrer le serveur avec PM2
echo "🚀 Redémarrage du serveur Node (PM2)..."
pm2 restart deploy/ecosystem.config.js --update-env || pm2 start deploy/ecosystem.config.js

echo "✅ Déploiement terminé !"
