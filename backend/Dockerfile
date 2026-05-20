# --- Étape de Build ---
FROM node:18-alpine AS builder

WORKDIR /usr/src/app

# Copie des fichiers de package
COPY package*.json ./
COPY prisma ./prisma/

# Installation de toutes les dépendances (y compris les devDependencies pour TypeScript)
RUN npm ci

# Copie du reste du code source
COPY . .

# Génération du client Prisma et compilation TypeScript
RUN npx prisma generate
RUN npm run build

# --- Étape de Production ---
FROM node:18-alpine AS runner

WORKDIR /usr/src/app

# Définition de l'environnement de production
ENV NODE_ENV=production

# Copie des fichiers de package pour l'installation des dépendances de prod uniquement
COPY package*.json ./
COPY prisma ./prisma/

# Installation uniquement des dépendances de production
RUN npm ci --only=production && npx prisma generate

# Copie du code compilé depuis l'étape de build
COPY --from=builder /usr/src/app/dist ./dist

# Dossier pour les uploads de fichiers
RUN mkdir -p uploads && chown -R node:node uploads

# Exposer le port de l'API
EXPOSE 3000

# Utiliser un utilisateur non-root pour la sécurité
USER node

# Commande de démarrage (qui applique également les migrations)
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]
