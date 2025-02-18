# Use an official Node.js runtime as a base image
FROM node:20.10-bullseye

# Set working directory
WORKDIR /usr/app

# Install PM2 globally
RUN npm install --global pm2

# Copy "package.json" and "package-lock.json" before other files
# Utilise Docker cache to save re-installing dependencies if unchanged
COPY ./package*.json ./

# Install dependencies
RUN npm install

# Copy all files
COPY ./ ./

RUN npx prisma generate

# Change ownership to the non-root user
# RUN chown -R node:node /usr/app

# Build app
RUN npm run build

# Expose the listening port
EXPOSE 3000

# RUN apt-get update && apt-get install -y netcat && rm -rf /var/lib/apt/lists/*

# Run container as non-root (unprivileged) user
# The "node" user is provided in the Node.js Alpine base image
# USER node

# Launch app with PM2
CMD [ "pm2-runtime", "start", "npm", "--", "run", "start" ]

# RUN chmod +x /usr/app/entrypoint.sh

# Exécuter le script d'entrée au démarrage du conteneur
# CMD ["/usr/app/entrypoint.sh"]