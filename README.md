
# Pixel Code Test Next.js Template — Tailwind v4 + NextAuth + Prisma

Next.js + Tailwind CSS v4 + NextAuth.js + Prisma
This template provides a robust, type-safe, and modern starting point for a full-stack web application. It combines the performance benefits of Next.js with the utility-first styling of Tailwind CSS, secure authentication via NextAuth.js, and efficient database management using Prisma ORM.

## Quick start

Follow these steps to set up the project locally for development.

1. Installation
First, install all necessary dependencies:

npm i


2. Environment Configuration
Copy the example environment file and then configure your secrets and database connection:

cp .env.example .env


3. Database Setup
These steps use Prisma to generate the client, create the database tables, and populate them with initial data.

# Command

npx prisma generate: Generates the Prisma Client, allowing the application code to interact with the database in a type-safe manner.

npx prisma migrate dev --name init: Runs the first migration (init), which creates all the defined tables and schema in your development database.

npm run seed: Executes the seed script to populate the database with dummy or initial data (e.g., test users, settings).


4. Running the Application
Once the database is ready, start the development server:

npm run dev


# Technology Stack

This project is built using a powerful set of modern tools:

Framework: Next.js

Styling:   Tailwind CSS v4

Database ORM:    Prisma

Authentication:  NextAuth.js


