# DOCUMENT D'ARCHITECTURE TECHNIQUE
## Projet : KAROCHEBAMA (GTK) — Solution SaaS Enterprise-Grade

Ce document définit les fondations architecturales globales, les conventions, les structures et les stratégies de développement et déploiement pour la plateforme KAROCHEBAMA.

---

## 1. Architecture Globale

La plateforme KAROCHEBAMA repose sur une architecture découplée de type **Client-Serveur**, conçue pour la scalabilité horizontale et la haute disponibilité.

```mermaid
graph TD
    Client[Frontend Client Web - React/Vite] -->|HTTPS - REST API| Proxy[Reverse Proxy Apache]
    Admin[Admin Panel - React/MUI] -->|HTTPS - REST API| Proxy
    Proxy -->|Local Forward| Node[Backend Node.js - Express Cluster]
    Node -->|ORM| Prisma[Prisma ORM]
    Prisma -->|Read/Write| MySQL[(MySQL Database)]
    Node -->|Caching/PubSub/Limiter| Redis[(Redis Server)]
    Node -->|Storage S3 API| ObjectStorage[Object Storage / AWS S3]
    Github[GitHub Repository] -->|Actions CI/CD| Proxy
```

### Principes Directeurs
- **Isolation logique (Multi-Tenancy) :** Colocation des données dans une seule base de données MySQL avec filtrage obligatoire par identifiant d'organisation/locataire (`organizationId` / `tenantId`).
- **Découplage strict :** L'Admin, le Frontend Client et le Backend sont hébergés et gérés séparément pour optimiser les performances et la sécurité.
- **Performance par défaut :** Utilisation de Redis pour le cache d'accès rapide et la limitation de débit (rate limiting), ainsi que pour la gestion des sessions/blacklists.

---

## 2. Arborescence Complète

Voici la structure de dossiers globale du projet à la racine :

```text
/karochebama
├── /backend                    # Serveur API Node.js / Express
│   ├── /prisma                 # Schéma de base de données et migrations
│   ├── /src                    # Code source TypeScript
│   │   ├── /config             # Configuration (DB, Redis, Winston, etc.)
│   │   ├── /core               # Utilitaires globaux, middlewares de sécurité, erreurs
│   │   └── /modules            # Modules métiers (Auth, Users, Products, etc.)
│   ├── Dockerfile
│   ├── ecosystem.config.js     # Configuration de PM2
│   ├── package.json
│   └── tsconfig.json
├── /frontend                   # Application client principal (React/Vite/Tailwind)
│   ├── /src
│   │   ├── /components         # Composants globaux réutilisables (UI, Layouts)
│   │   ├── /features           # Modules métier (Products, Orders, Billing, etc.)
│   │   ├── /hooks              # Hooks personnalisés globaux
│   │   ├── /routes             # Routage (React Router v6)
│   │   ├── /services           # Appels API (Axios / React Query)
│   │   ├── /store              # Gestion d'état globale client (Zustand)
│   │   └── /styles             # Fichiers CSS globaux & Tailwind
│   ├── Dockerfile
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
├── /admin                      # Application d'administration interne (React/MUI)
│   ├── /src
│   │   ├── /components         # Composants globaux UI Material-UI
│   │   ├── /features           # Gestion administrative (Users, Subscriptions, System)
│   │   ├── /hooks              # Hooks personnalisés
│   │   ├── /routes             # Routage admin
│   │   ├── /services           # Appels API
│   │   ├── /store              # État global (Zustand)
│   │   └── /theme              # Configuration du thème MUI (Dark/Light)
│   ├── Dockerfile
│   ├── package.json
│   └── vite.config.ts
├── /devops                     # Scripts et configurations de déploiement
│   └── /apache                 # Configuration du VirtualHost Apache
└── .github
    └── workflows               # CI/CD (GitHub Actions)
```

---

## 3. Conventions de Nommage

### Dossiers & Fichiers
- **Dossiers :** `kebab-case` (ex: `user-profile`, `order-details`).
- **Fichiers de composants / pages React :** `PascalCase` (ex: `ProductCard.tsx`, `DashboardPage.tsx`).
- **Fichiers de logique / utilitaires / hooks / routes :** `camelCase` (ex: `useAuth.ts`, `apiClient.ts`, `authRoutes.ts`).
- **Fichiers de configuration ou scripts :** `kebab-case` ou `snake_case` (ex: `docker-compose.yml`, `ecosystem.config.js`).

### Code TypeScript
- **Variables et Fonctions :** `camelCase` (ex: `const activeUserCount = 10;`, `function getUserData() {}`).
- **Classes, Interfaces, Types et Enums :** `PascalCase` (ex: `class OrderService`, `interface UserPayload`, `enum OrderStatus`).
- **Constantes globales :** `UPPER_SNAKE_CASE` (ex: `const DEFAULT_CACHE_TTL = 3600;`).

### Base de données (MySQL / Prisma)
- **Tables :** `PascalCase` au singulier (ex: `User`, `Organization`, `ProductOrder`), correspondant aux conventions Prisma.
- **Colonnes / Champs :** `camelCase` (ex: `createdAt`, `tenantId`, `firstName`).

---

## 4. Structure Backend (Clean Architecture)

Le backend adopte une **Clean Architecture modulaire**, séparant la logique technique de la logique métier.

```text
/backend/src
├── /config                     # Fichiers de configuration
│   ├── database.ts             # Instance Prisma Client
│   ├── redis.ts                # Configuration du client Redis
│   ├── logger.ts               # Configuration de Winston
│   └── env.ts                  # Validation des variables d'env (Zod)
├── /core                       # Coeur de l'application (transversal)
│   ├── /errors                 # Gestionnaires d'erreurs (AppError, NotFoundError, etc.)
│   ├── /middlewares            # Middlewares globaux (security, errors, auth, rateLimit)
│   └── /types                  # Types et interfaces globaux
└── /modules                    # Division par module métier (Ex: products)
    └── /products
        ├── controller.ts       # Couche de présentation HTTP (validation, gestion des requêtes)
        ├── repository.ts       # Couche d'infrastructure (accès base de données via Prisma)
        ├── routes.ts           # Définition des routes Express
        ├── types.ts            # Interfaces spécifiques au module
        ├── use-case.ts         # Logique métier pure (Business Logic / Interactor)
        └── validation.ts       # Schémas de validation Zod
```

### Rôles des couches dans un module :
1. **`routes.ts` :** Enregistre les endpoints et attache les middlewares de sécurité/validation.
2. **`controller.ts` :** Extrait les paramètres, appelle le schéma Zod pour valider l'input, délègue le traitement au `use-case.ts` et retourne la réponse HTTP.
3. **`use-case.ts` :** Implémente les règles métier. C'est le seul endroit où la logique métier s'exécute. Il appelle le `repository.ts` pour charger/sauvegarder les données.
4. **`repository.ts` :** Encapsule les appels de base de données. Si l'ORM Prisma change un jour, seul ce fichier est impacté.

---

## 5. Structure Frontend Scalable

Le frontend et l'admin utilisent une architecture **Feature-Oriented** pour éviter les répertoires géants et faciliter le découpage en équipe.

```text
/frontend/src/features
├── /products                   # Module métier Produit
│   ├── /components             # Composants spécifiques à ce module (ProductGrid, ProductCard)
│   ├── /hooks                  # Hooks spécifiques (useProductSearch)
│   ├── /services               # Requêtes API spécifiques (mutations & requêtes React Query)
│   ├── /store                  # Sous-état Zustand éventuel
│   ├── /types                  # Types TypeScript spécifiques au domaine
│   └── /views                  # Pages ou vues principales (ProductListScreen, ProductDetailScreen)
```

- **Règle d'or :** Si un composant est utilisé par plusieurs fonctionnalités, il va dans `/src/components/ui/` (ex: `Button.tsx`, `Modal.tsx`). S'il est propre au module `products`, il reste dans `/features/products/components/`.

---

## 6. Stratégie API REST

### Versioning
L'API est versionnée directement dans l'URL : `/api/v1/...`

### Formats de Réponse Standardisés

- **Succès (200 OK, 201 Created) :**
```json
{
  "success": true,
  "data": { ... }
}
```

- **Erreur (400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Internal Error) :**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Les données fournies sont invalides.",
    "details": [
      { "field": "email", "message": "Email invalide" }
    ]
  }
}
```

### Pagination & Filtrage
Les endpoints retournant des listes implémentent obligatoirement une pagination par curseur ou par offset :
`GET /api/v1/products?page=1&limit=20&sort=createdAt:desc&search=clavier`

Le format de réponse paginée :
```json
{
  "success": true,
  "data": [...],
  "meta": {
    "currentPage": 1,
    "limit": 20,
    "totalPages": 5,
    "totalItems": 98
  }
}
```

---

## 7. Stratégie Sécurité

Pour assurer une sécurité optimale, la plateforme implémente les mesures suivantes :

- **Sécurisation des En-têtes :** Utilisation de `helmet` dans Express pour activer les protections XSS, Clickjacking, CSP et masquer la signature du serveur (`X-Powered-By`).
- **CORS Stricte :** Configuration de la politique CORS pour autoriser uniquement les domaines du frontend et de l'admin.
- **Authentification JWT Double Token :**
  - `AccessToken` : Durée de vie courte (15 minutes), stocké en mémoire dans le client (ou état React) pour éviter les attaques XSS.
  - `RefreshToken` : Durée de vie longue (7 jours), stocké dans un cookie HTTP-Only, Secure, SameSite=Strict.
  - Blacklist des Refresh Tokens dans **Redis** lors de la déconnexion ou du changement de mot de passe.
- **Protection par force brute (Rate Limiting) :** Middleware global de limitation via Redis (`express-rate-limit` + `rate-limit-redis`) limitant à 100 requêtes par 15 minutes par IP pour les routes standards, et 10 requêtes par 15 minutes pour les routes d'authentification (`/auth/login`, `/auth/register`).
- **Validation stricte des inputs :** Utilisation systématique de schémas **Zod** sur toutes les entrées HTTP (body, query, params) pour empêcher l'injection de données invalides ou malveillantes.
- **Injection SQL :** Sécurisation assurée par l'utilisation de requêtes paramétrées natives via l'ORM Prisma.

---

## 8. Stratégie Upload

La gestion des fichiers et images suit les règles de sécurité et de performance suivantes :

1. **Validation en amont :** Contrôle obligatoire du type MIME (ex: `image/jpeg`, `image/png`, `application/pdf`) et de la taille maximale (ex: 5 Mo pour les images) via un middleware basé sur `multer`.
2. **Stockage hybride :**
   - **Local (Développement) :** Stockage dans un répertoire `/uploads` isolé.
   - **Production :** Stockage sur un Object Storage compatible S3 (AWS, Scaleway, OVH). Le backend génère des **URLs présignées** (Presigned URLs) pour permettre aux clients d'uploader ou de télécharger directement sans surcharger la bande passante du serveur d'API Node.js.
3. **Nettoyage :** Suppression asynchrone des fichiers inutilisés en base de données via un worker de nettoyage périodique.

---

## 9. Stratégie Cache Redis

Redis sert de couche de cache haute performance (Cache-Aside Pattern) et de gestionnaire de sessions.

### Clés de Cache
Les clés Redis suivent un schéma de nommage strict pour éviter les collisions :
`[projet]:[environnement]:[tenant_id]:[ressource]:[id]`
Exemple : `gtk:prod:org_1234:product:prod_5678`

### TTL (Time To Live)
- Données statiques / Configuration : 24 heures.
- Listes de produits / Données métier fréquemment lues : 1 heure.
- Sessions / Blacklist de jetons : Alignés sur la durée de vie du Refresh Token (7 jours).

### Invalidation
Le cache est invalidé lors de toute mutation (écriture, mise à jour, suppression) sur la ressource correspondante.
Exemple : Une mise à jour du produit `prod_5678` supprime la clé de cache `gtk:prod:org_1234:product:prod_5678` et la liste associée.

---

## 10. Stratégie de Logs

Les logs sont standardisés à l'aide de **Winston** et configurés de manière asynchrone pour éviter tout blocage de boucle d'événement.

### Niveaux de Log
- `error` : Erreurs critiques du système nécessitant une intervention immédiate.
- `warn` : Avertissements sur des anomalies non bloquantes (ex: échec d'authentification répété).
- `info` : Suivi global du cycle de vie du serveur (ex: démarrage de serveurs, jobs terminés).
- `debug` : Logs d'exécution détaillée pour le diagnostic en développement.

### Format des Logs
Toutes les entrées de log sont générées au format JSON standard pour simplifier l'indexation future dans des outils comme Elasticsearch ou Loki :

```json
{
  "timestamp": "2026-05-23T17:41:37.000Z",
  "level": "error",
  "message": "Database query failed",
  "correlationId": "req-abc-12345",
  "context": "ProductRepository",
  "error": {
    "message": "PrismaClientKnownRequestError",
    "stack": "..."
  }
}
```

Un middleware d'injection de `correlationId` (UUID unique généré à chaque requête) permet de suivre le parcours complet d'une requête à travers tous les logs.

---

## 11. Stratégie CI/CD

Le pipeline d'intégration et déploiement continu est orchestré via **GitHub Actions** pour assurer un déploiement sécurisé sans interruption de service.

```mermaid
graph TD
    Push[Git Push / PR] --> Test[Lancer tests unitaires & Linters]
    Test --> Build[Créer Builds de Production]
    Build --> Deploy[Déployer sur le VPS via SSH/PM2]
    Deploy --> Migration[Exécuter Migrations Prisma]
    Migration --> Reload[Recharger PM2 sans interruption]
```

### Clés du Pipeline
1. **Qualité de code :** Validation systématique du typage TypeScript (`tsc --noEmit`), exécution d'ESLint/Prettier et tests unitaires Jest/Vitest.
2. **Stratégie de Déploiement :**
   - Le code est poussé sur le VPS via un protocole SSH sécurisé.
   - Les dépendances de production sont installées.
   - Exécution sécurisée des migrations Prisma : `npx prisma migrate deploy` avant le redémarrage.
   - Rechargement de l'application via PM2 : `pm2 reload ecosystem.config.js --env production` (permet un rechargement *Zero-Downtime*).

---

## 12. Structure Prisma (Modèle de Données SaaS)

Pour répondre aux contraintes d'une plateforme SaaS multi-tenant, le schéma de base de données comprend une isolation logique solide.

```prisma
// Fichier : backend/prisma/schema.prisma

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  SUPER_ADMIN
  ADMIN
  USER
}

model Organization {
  id        String    @id @default(uuid())
  name      String
  slug      String    @unique
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  users     User[]
  
  // Relations avec les autres entités métier futures (filtrage logique)
  // Ex: products Product[]
}

model User {
  id             String        @id @default(uuid())
  email          String        @unique
  passwordHash   String
  firstName      String?
  lastName       String?
  role           Role          @default(USER)
  organizationId String
  organization   Organization  @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  createdAt      DateTime      @default(now())
  updatedAt      DateTime      @updatedAt
  sessions       Session[]

  @@index([organizationId])
}

model Session {
  id           String   @id @default(uuid())
  userId       String
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  refreshToken String   @unique
  expiresAt    DateTime
  createdAt    DateTime @default(now())

  @@index([userId])
}
```

### Règles Prisma SaaS
- **Indexation :** Indexation systématique de la colonne `organizationId` pour optimiser les requêtes filtrées par locataire.
- **Cascade Delete :** Suppression en cascade des utilisateurs et sessions associés à une organisation supprimée pour garantir la propreté de la base de données.

---

## 13. Structure Apache VPS (Reverse Proxy)

Sur le VPS de production, **Apache** gère la sécurité SSL, sert les applications statiques compilées (Frontend et Admin) et agit comme un reverse proxy haute performance pour le backend Node.js.

### Configuration du VirtualHost (`/devops/apache/vhost.conf`)
```apache
<VirtualHost *:80>
    ServerName api.karochebama.local
    Redirect permanent / https://api.karochebama.local/
</VirtualHost>

<VirtualHost *:443>
    ServerName api.karochebama.local
    
    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/api.karochebama.local/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/api.karochebama.local/privkey.pem
    
    # Sécurisation TLS
    SSLProtocol all -SSLv3 -TLSv1 -TLSv1.1
    SSLCipherSuite ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384
    SSLHonorCipherOrder off
    SSLSessionTickets off

    # Compression des réponses
    AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json

    # Headers de Sécurité
    Header always set Strict-Transport-Security "max-age=63072000; includeSubDomains; preload"
    Header always set X-Frame-Options "DENY"
    Header always set X-Content-Type-Options "nosniff"
    Header always set X-XSS-Protection "1; mode=block"

    # Configuration Proxy vers le Backend Node.js (PM2 port 5000)
    ProxyPreserveHost On
    ProxyPass / http://127.0.0.1:5000/
    ProxyPassReverse / http://127.0.0.1:5000/
    
    ErrorLog ${APACHE_LOG_DIR}/karochebama-api-error.log
    CustomLog ${APACHE_LOG_DIR}/karochebama-api-access.log combined
</VirtualHost>
```

---

## 14. Structure PM2

Pour garantir la résilience du backend sur le VPS, nous utilisons **PM2** en mode cluster.

### Fichier `ecosystem.config.js`
```javascript
module.exports = {
  apps: [
    {
      name: 'karochebama-backend',
      script: './dist/server.js',
      instances: 'max', // Lance un processus par coeur CPU disponible
      exec_mode: 'cluster', // Active la répartition de charge native de PM2
      watch: false,
      max_memory_restart: '1G', // Redémarre automatiquement en cas de fuite de mémoire
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      combine_logs: true
    }
  ]
};
```

---

## 15. Organisation des Modules Métier

Chaque besoin fonctionnel est isolé au sein d'un répertoire autonome sous `/backend/src/modules/`.

### Modules requis pour la fondation :
- **`auth` :** Authentification, enregistrement, token refresh et blacklist de session.
- **`organizations` :** Gestion des comptes clients SaaS, abonnements et isolation des locataires.
- **`users` :** Profils utilisateurs, attributions de rôles (`Role`).
- **`products` (exemple) :** Exemple de module métier typique montrant l'application du filtre `organizationId`.

---

## 16. Organisation des Composants React

Pour le Frontend et l'Admin, l'arborescence des composants respecte la structure suivante :

```text
/frontend/src/components
├── /ui                         # Composants atomiques "dummy" sans état global (Design System)
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Card.tsx
│   └── Badge.tsx
└── /layout                     # Composants de structure d'application
    ├── Header.tsx
    ├── Sidebar.tsx
    ├── Footer.tsx
    └── AuthLayout.tsx
```

### Règles d'architecture React :
- **Composants UI (`/ui`) :** Strictement typés, sans dépendances vers l'état de l'application (Zustand) ou l'API (React Query).
- **Vues / Écrans (`/views`) :** Responsables du chargement des données via les services/hooks et de l'orchestration des composants UI.

---

## 17. Organisation Zustand / React Query

La répartition des responsabilités de gestion d'état est clairement définie :

### React Query (Server State)
Gère l'intégralité de l'état asynchrone provenant du serveur (requêtes HTTP, cache réseau, mutations).
- Fichier racine : `/src/services/queryClient.ts`
- Exemple d'utilisation dans une feature :
```typescript
// features/products/services/useProducts.ts
import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from './api';

export function useProducts(tenantId: string) {
  return useQuery({
    queryKey: ['products', tenantId],
    queryFn: () => fetchProducts(tenantId),
    staleTime: 5 * 60 * 1000, // Les données sont considérées fraîches pendant 5 minutes
  });
}
```

### Zustand (Client State)
Gère uniquement l'état local éphémère de l'interface utilisateur.
- Fichiers sous : `/src/store/`
- Cas d'usage : Thème (clair/sombre), état d'ouverture de la barre latérale (Sidebar), données de session utilisateur après connexion (User Session cache local).
- Exemple d'utilisation :
```typescript
// store/useUiStore.ts
import { create } from 'zustand';

interface UiState {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));
```

---

## 18. Structure des Variables d'Environnement

Chaque module (backend, frontend, admin) possède ses propres variables d'environnement validées.

### Backend (`/backend/.env.example`)
```bash
# General
PORT=5000
NODE_ENV=development

# Database (MySQL)
DATABASE_URL="mysql://user:password@localhost:3306/karochebama"

# Redis
REDIS_URL="redis://localhost:6379"

# JWT Secret Keys
JWT_ACCESS_SECRET="generate-a-secure-long-string-for-access-token"
JWT_REFRESH_SECRET="generate-a-secure-long-string-for-refresh-token"

# AWS S3 Storage
S3_ENDPOINT="https://s3.region.amazonaws.com"
S3_ACCESS_KEY_ID="your-access-key-id"
S3_SECRET_ACCESS_KEY="your-secret-access-key"
S3_BUCKET_NAME="karochebama-uploads"
```

### Frontend (`/frontend/.env.example`)
```bash
VITE_API_URL="http://localhost:5000/api/v1"
```

### Validation TypeScript
Le backend valide automatiquement les variables d'environnement au démarrage à l'aide d'un schéma Zod (`backend/src/config/env.ts`) pour éviter de lancer l'application avec des configurations manquantes.

---

## 19. Structure Docker Ready

La conteneurisation est prête pour le développement local et la production.

### Docker Compose Local (`/docker-compose.yml`)
```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    container_name: gtk_mysql
    restart: always
    environment:
      MYSQL_DATABASE: karochebama
      MYSQL_ROOT_PASSWORD: root
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

  redis:
    image: redis:7-alpine
    container_name: gtk_redis
    restart: always
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  mysql_data:
  redis_data:
```

### Dockerfile Backend (Multi-stage build)
```dockerfile
# backend/Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
RUN npx prisma generate

EXPOSE 5000
CMD ["node", "dist/server.js"]
```

---

## 20. Stratégie de Performance

### Optimisation des requêtes MySQL / Prisma
- **Sélectivité :** Utiliser systématiquement l'option `select` de Prisma pour ne récupérer que les champs nécessaires et éviter les requêtes `SELECT *`.
- **Indexation :** Indexation obligatoire des clés étrangères, en particulier `organizationId` et les colonnes fréquemment utilisées dans les clauses `WHERE`.

### Optimisations Réseau & API
- **Compression :** Activation de Gzip/Brotli via Apache pour réduire le poids des payloads JSON de l'API.
- **Mise en cache intelligente :** Headers HTTP `Cache-Control` appropriés pour les ressources statiques et utilisation de Redis pour les données d'API chaudes fréquemment consultées.

### Optimisation Frontend (Vite)
- **Code-Splitting :** Chargement différé (Lazy loading) des vues à l'aide de `React.lazy()` et de la séparation dynamique des fichiers générée par Vite.
- **Optimisation des Bundles :** Utilisation de formats modernes pour les images (WebP/Avif) et purge Tailwind intégrée dans la compilation de production.
