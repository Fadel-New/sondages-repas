# Production Database Setup

This project uses SQLite for development but requires a different database for production deployment on Vercel.

## Options for Production Deployment

1. **Use Vercel Postgres**:
   - Create a Postgres database in your Vercel project settings
   - Vercel will automatically add the `DATABASE_URL` environment variable

2. **Use another hosted database service** (PlanetScale, Supabase, Neon, etc.):
   - Create a database account and database
   - Add the connection string as `DATABASE_URL` in your Vercel environment variables
   - Make sure the connection string is in the correct format for your database type

## Important Notes

- Update the `schema.prisma` file to use the correct provider if needed:
  ```prisma
  datasource db {
    provider = "postgresql" // Change from "sqlite" to "postgresql" for postgres
    url      = env("DATABASE_URL")
  }
  ```

- Make sure to run migrations or deploy your schema to the production database before the first deployment
