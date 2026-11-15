
#!/bin/sh
set -e

echo "Starting Booking App Backend..."

if [ -z "$DATABASE_URL" ]; then
  echo "ERROR: DATABASE_URL is not configured"
  exit 1
fi

echo "Running Prisma migrations..."
npx prisma migrate deploy --schema=prisma/schema.prisma

echo "Starting application..."
exec npm start
