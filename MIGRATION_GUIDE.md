# Migration Guide

This document outlines how database migrations are handled in the **TicketFlow API** and details the historical transition from JSON to SQLite. It also provides instructions for future migrations (e.g., to PostgreSQL).

## 1. Current Migration System (SQLite)

We use custom native scripts to handle SQLite migrations to keep dependencies low.

### Running Migrations
To create the tables in your local SQLite database, run:
```bash
npm run db:migrate
```
*Note: This script (`src/db/migrate.js`) connects to the database specified by `DATABASE_URL` in your `.env` file and creates the `tickets` table if it does not exist.*

### Seeding Data
To populate the database with initial dummy data (originally ported from our legacy JSON file), run:
```bash
npm run db:seed
```

## 2. Historical Context: JSON to SQLite Migration
In version `1.0.0`, the system originally used `src/data/chamados.json` for persistence.
The migration to SQLite was performed by:
1. Creating `src/repositories/ticketRepository.js` to handle all SQL statements.
2. Refactoring `src/services/ticketService.js` to call the repository instead of the `fs` module.
3. Using `src/db/seed.js` to read the legacy JSON data and insert it into the SQLite table.

## 3. Future Migrations: Migrating to PostgreSQL
As the application grows, moving to a production-ready database like PostgreSQL is planned for TicketFlow v2.

### Expected Steps:
1. **Adopt an ORM:** We recommend migrating from raw SQL scripts to an ORM like **Prisma** or **Sequelize**. This will standardise migrations across environments.
2. **Update Environment Variable:** Change `DATABASE_URL` in production to point to the PostgreSQL connection string.
3. **Refactor Repository Layer:** Update `src/repositories/ticketRepository.js` to use the ORM client instead of the `sqlite3` driver. Because of our strict Layered Architecture, **no changes will be required in the Controllers or Services layers**.
