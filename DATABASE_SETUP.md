# Database Setup Guide

## Prerequisites
Make sure you have PostgreSQL installed and running.

## Step 1: Configure Database Connection

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/prima_husada?schema=public"
```

Replace `username` and `password` with your PostgreSQL credentials.

## Step 2: Install Dependencies

```bash
npm install
```

This will install `tsx` and other required dependencies.

## Step 3: Generate Prisma Client

```bash
npx prisma generate
```

This creates the typed Prisma Client based on your schema.

## Step 4: Create Database and Tables

```bash
npx prisma migrate dev --name init
```

This will:
- Create the database if it doesn't exist
- Create all tables from the schema
- Generate migration files

## Step 5: Seed Sample Data

```bash
npm run db:seed
```

This populates your database with sample data including:
- Admin user (email: `admin@primahusada.com`, password: `admin123`)
- Sample doctors, patients, medicines, polyclinics, etc.

## Step 6: Verify Data (Optional)

```bash
npx prisma studio
```

Opens Prisma Studio in your browser to view and edit database records.

## Default Credentials

After seeding, you can login with:
- **Admin**: admin@primahusada.com / admin123
- **Receptionist**: receptionist@primahusada.com / receptionist123  
- **Pharmacist**: pharmacist@primahusada.com / pharmacist123

## Useful Commands

- `npm run db:migrate` - Run migrations
- `npm run db:studio` - Open Prisma Studio
- `npm run db:seed` - Reseed database
- `npx prisma migrate reset` - Reset database (⚠️ deletes all data)
