#!/bin/sh

echo "🟡 Attente que MySQL soit prêt..."
until nc -z -v -w30 mysql 3306
do
  echo "🔄 MySQL n'est pas encore prêt, en attente..."
  sleep 2
done
echo "✅ MySQL est prêt !"

# Générer Prisma Client
echo "🔧 Génération du client Prisma..."
npx prisma generate

# Exécuter les migrations Prisma
echo "🚀 Exécution des migrations..."
npx prisma migrate deploy

# Exécuter les seeds Prisma
echo "🌱 Exécution des seeds..."
npx prisma db seed

# Démarrer l'application avec PM2
echo "🎬 Démarrage de l'application avec PM2..."
exec pm2-runtime start npm -- start
