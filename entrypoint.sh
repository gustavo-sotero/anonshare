#!/bin/sh

set -e

# Run Prisma migrations
npx prisma migrate deploy

# Start the Next.js application
exec npm start
