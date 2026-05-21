#!/bin/sh
set -e

echo "Parsing DATABASE_URL to find database host and port..."
DB_HOST=$(node -e "try { console.log(new URL(process.env.DATABASE_URL).hostname) } catch(e) { console.log('db') }")
DB_PORT=$(node -e "try { console.log(new URL(process.env.DATABASE_URL).port || '5432') } catch(e) { console.log('5432') }")

echo "Waiting for database to be ready at $DB_HOST:$DB_PORT..."
while ! nc -z "$DB_HOST" "$DB_PORT"; do
  echo "Database is unavailable - sleeping"
  sleep 1
done

echo "Database is ready!"
echo "Attempting to run Prisma migrations..."
#npx prisma db push --accept-data-loss
npx prisma migrate deploy
echo "Starting application..."
exec npm start
