# Product Roadmap

This document outlines the short-term and long-term vision for the **TicketFlow API**.

## Phase 1: MVP (Completed)
- [x] Basic CRUD operations for Tickets.
- [x] Layered Architecture (Routes, Controllers, Services).
- [x] Data persistence using JSON file.
- [x] Input validation.
- [x] Pagination and basic filtering.

## Phase 1.5: Stabilization (Completed)
- [x] Migrate data persistence from JSON to SQLite.
- [x] Implement Repository pattern.
- [x] Introduce Environment variables via `dotenv`.
- [x] Create comprehensive architectural documentation and C4 diagrams.

## Phase 2: TicketFlow v2 (Upcoming)
TicketFlow v2 will be a major rewrite focused on transforming this portfolio API into a fully production-ready SaaS backend.

- [ ] **TypeScript Migration:** Convert the entire codebase to TypeScript for strict type safety.
- [ ] **Database Upgrade:** Migrate from SQLite to PostgreSQL using an ORM like **Prisma**.
- [ ] **Authentication & Authorization:**
  - Implement JWT-based Auth.
  - Introduce Role-Based Access Control (RBAC): Users, Technicians, and Admins.
- [ ] **Microservices/Service-Based Architecture:** Split logic into separate domains (Auth Service, User Service, Ticket Service, Notification Service).
- [ ] **Dockerization:** Containerize the application and database via `docker-compose`.
- [ ] **CI/CD:** Setup GitHub actions for automated testing and linting.

## Phase 3: Advanced Features
- [ ] **Asynchronous Background Jobs:** Integrate Redis and BullMQ for email notifications and SLA tracking.
- [ ] **Web Dashboard Integration:** Build a React.js frontend that consumes this API directly.
- [ ] **Analytics Endpoints:** Create dedicated `/reports` endpoints to calculate SLA breaches, average resolution times, and technician workloads.
