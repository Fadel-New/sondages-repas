#!/bin/bash
# This script resets Prisma's cache and regenerates the client

echo "Cleaning up Prisma cache and regenerating the client..."

# Step 1: Remove Prisma's cache directory
rm -rf node_modules/.prisma

# Step 2: Remove the generated client
rm -rf node_modules/@prisma/client

# Step 3: Regenerate the Prisma client
npx prisma generate

echo "Prisma client regenerated successfully!"
