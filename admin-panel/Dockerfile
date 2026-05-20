# --- Étape de Build ---
FROM node:18-alpine AS builder

WORKDIR /usr/src/app

# Copie des fichiers de package
COPY package*.json ./

# Installation des dépendances
RUN npm ci

# Copie de tout le code source
COPY . .

# Construction du dashboard statique
RUN npm run build

# --- Étape de Serveur Apache ---
FROM httpd:alpine

# Activation de mod_rewrite et autorisation d'AllowOverride dans Apache
RUN sed -i '/LoadModule rewrite_module/s/^#//g' /usr/local/apache2/conf/httpd.conf && \
    sed -i 's/AllowOverride None/AllowOverride All/g' /usr/local/apache2/conf/httpd.conf

# Copie des fichiers buildés vers le dossier public d'Apache
COPY --from=builder /usr/src/app/dist /usr/local/apache2/htdocs/

# Copie du fichier .htaccess pour gérer les redirections de route React
COPY .htaccess /usr/local/apache2/htdocs/

# Exposer le port HTTP par défaut
EXPOSE 80
