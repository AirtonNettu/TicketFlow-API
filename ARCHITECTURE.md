# Architecture Document

Welcome to the architectural overview of the **TicketFlow API**. This document is designed for both beginners who want to understand how a professional REST API is built and experienced engineers evaluating the system's design.

## Overview
TicketFlow is a backend REST API developed in **Node.js** with **Express**. It provides endpoints to manage technical support tickets (Help Desk).

To maintain clean code, testability, and scalability, we adopted a **Layered Architecture**. This means the code is divided into specific layers, each with a single, clear responsibility.

## The Layers

### 1. Routes (`src/routes/`)
- **What it does:** It acts as the traffic controller. It receives incoming HTTP requests (like `GET /tickets` or `POST /tickets`) and decides which function should handle it.
- **Rules:** Routes do not contain business logic. They merely map URLs to Controllers.

### 2. Controllers (`src/controllers/`)
- **What it does:** It handles the HTTP request and response cycle. It extracts parameters (from the body, URL, or query strings), validates the syntax of the input, and then passes the data to the Service layer.
- **Rules:** Controllers only care about "HTTP stuff" (status codes, JSON formatting). They should not know how data is saved.

### 3. Services (`src/services/`)
- **What it does:** This is the heart of the application. It contains the **business logic**. For example, it checks if a ticket exists before updating it, or applies a default status of "Aberto" to a newly created ticket.
- **Rules:** Services don't know about HTTP or the database directly. They receive plain JavaScript objects and rely on Repositories to fetch or save data.

### 4. Repositories (`src/repositories/`)
- **What it does:** It isolates the database communication. All raw SQL queries (using SQLite) live here.
- **Rules:** By keeping SQL queries in the Repository, if we decide to change the database from SQLite to PostgreSQL in the future, we only need to rewrite this layer. The rest of the app (Services, Controllers) remains untouched.

### 5. Middlewares (`src/middlewares/`)
- **What it does:** These are functions that run *before* or *after* the main logic.
- **Usage:** Currently, we use a centralized `errorHandler` to catch any errors thrown by the application and format them into a standard JSON error response, avoiding application crashes.

## Data Persistence
We use **SQLite**. It's a lightweight, file-based SQL database. It is perfect for this portfolio project because it doesn't require setting up a separate database server, yet it allows us to write professional SQL queries (including pagination and filtering) just like we would in a large-scale system.

## Future Plans (Docker)
Although not currently implemented, the architecture is completely decoupled and stateless, making it extremely easy to dockerize. Packaging this into a Docker container will guarantee that the application runs identically on any environment.

For visual diagrams of this architecture, please refer to the `docs/diagrams/` folder!
