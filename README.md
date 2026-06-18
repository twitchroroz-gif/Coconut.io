# 🌴 CoconutClash

Jeu de Battle Royale 2D en vue du dessus, jouable directement dans le navigateur.
Développé avec **Colyseus** (Node.js) pour le backend et **Phaser 3** (Vite) pour le client.

## Structure du Projet

- `client/` : Application Web Vite + Phaser (UI, rendu, interpolation).
- `server/` : Serveur Node.js autoritaire avec Colyseus (logique, physique, état partagé).
- `shared/` : Constantes, types et schémas partagés entre le client et le serveur.
- `deploy/` : Scripts et configurations pour la mise en production sur VPS.

## 🚀 Développement Local

### Prérequis
- Node.js (v18+ recommandé)
- npm

### Installation
À la racine du projet :
```bash
npm install
```
Cela installera les dépendances pour la racine, le client, le serveur et le module partagé grâce aux **npm workspaces**.

### Lancement
Pour lancer le serveur de développement et le client simultanément avec Hot-Reload :
```bash
npm run dev
```

- **Client** : accessible sur `http://localhost:3000`
- **Serveur WebSocket** : écoute sur `ws://localhost:2567`

---

## 🌍 Déploiement en Production (VPS Ubuntu)

### 1. Préparation du VPS
Connectez-vous à votre VPS et installez les outils nécessaires :
```bash
sudo apt update
sudo apt install nodejs npm nginx certbot python3-certbot-nginx
sudo npm install -g pm2
```

### 2. Cloner le projet
Placez le projet (par exemple dans `/var/www/coconutclash`) :
```bash
git clone <votre-repo> /var/www/coconutclash
cd /var/www/coconutclash
chmod +x deploy/deploy.sh
```

### 3. Exécuter le script de déploiement
Le script installera les dépendances et compilera le code :
```bash
./deploy/deploy.sh
```
*(Le serveur démarrera automatiquement avec PM2).*

### 4. Configuration Nginx & HTTPS
Copiez la configuration Nginx :
```bash
sudo cp deploy/nginx.conf /etc/nginx/sites-available/coconutclash
sudo ln -s /etc/nginx/sites-available/coconutclash /etc/nginx/sites-enabled/
```
Éditez `/etc/nginx/sites-available/coconutclash` pour remplacer `yourdomain.com` par votre vrai nom de domaine.

Relancez Nginx :
```bash
sudo nginx -t
sudo systemctl reload nginx
```

Obtenez un certificat SSL gratuit avec Let's Encrypt :
```bash
sudo certbot --nginx -d votre-domaine.com
```

### Note sur Colyseus et WSS (WebSocket Secure)
Si vous utilisez HTTPS, le client doit se connecter en `wss://`. Le code client détecte automatiquement le protocole (`window.location.protocol`) dans `NetworkManager.ts` et utilisera la connexion sécurisée si le site est chargé en HTTPS.

---

## 🎮 Mécaniques de jeu

- **Zone** : Se rétrécit progressivement. Inflige des dégâts si vous êtes en dehors.
- **Armes** : Machette (mêlée), Fronde (distance lente), Sarbacane (distance rapide).
- **Consommables** : Noix de coco (soin), Bouclier en feuilles (protection temporaire).
- **Déplacements** : ZQSD / WASD / Flèches.
- **Viser/Tirer** : Clic gauche de la souris (le tir part dans la direction du curseur).
