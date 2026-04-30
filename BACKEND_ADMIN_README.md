# Karochebama Platform - Backend & Admin Panel

Ce dépôt contient le backend scalable et le panneau d'administration professionnel pour la plateforme Karochebama.

## Structure du Projet

- `/backend` : API REST Express.js + Prisma + MySQL.
- `/admin-panel` : Interface d'administration React + Material UI (Isolée du frontend principal).
- `/src` : Frontend principal (React + Tailwind).

---

## 🛠️ Installation du Backend

### Prérequis
- Node.js (v18+)
- Serveur MySQL (Local ou distant)

### Étapes
1. Entrez dans le dossier backend :
   ```bash
   cd backend
   ```
2. Installez les dépendances :
   ```bash
   npm install
   ```
3. Configurez votre base de données dans le fichier `.env` :
   ```env
   DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/karochebama_db"
   ```
4. Exécutez les migrations Prisma pour créer les tables :
   ```bash
   npx prisma migrate dev --name init
   ```
5. Lancez le serveur de développement :
   ```bash
   npm run dev
   ```

---

## 📊 Installation du Panneau Admin

### Étapes
1. Entrez dans le dossier admin-panel :
   ```bash
   cd admin-panel
   ```
2. Installez les dépendances :
   ```bash
   npm install
   ```
3. Lancez l'interface d'administration :
   ```bash
   npm run dev
   ```
4. Accédez à l'interface via : `http://localhost:5174` (ou le port indiqué par Vite).

---

## 🔐 Architecture Backend (Clean Architecture)

- **Modules** : Chaque fonctionnalité (Auth, Products, Users) est isolée dans son propre dossier avec Controller, Service, Routes et Validation.
- **Sécurité** : JWT (Access/Refresh Tokens), RBAC (Rôles), Hachage Argon2/Bcrypt, Middlewares de sécurité (Helmet, Cors).
- **Validation** : Schémas Zod pour une intégrité totale des données.

## 🎨 Design Admin Panel

- **Framework** : React + Material UI.
- **Thème** : Personnalisé aux couleurs de Karochebama.
- **Composants** : DataTables réutilisables, Layout responsive, Cartes statistiques.

---

### Prochaines étapes suggérées :
1. Connecter les formulaires de l'Admin Panel aux API réelles.
2. Implémenter le système d'upload d'images (S3 ou Local).
3. Ajouter la documentation Swagger pour les API.
