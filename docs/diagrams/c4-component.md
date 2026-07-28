# C4 Component Diagram

## Diagram

```mermaid
C4Component
    title Component diagram for the API Application

    Container_Boundary(api, "API Application") {
        Component(router, "Router", "Express Router", "Routes HTTP requests to the proper Controller.")
        Component(middlewares, "Middlewares", "Express Middleware", "Centralizes error handling and payload parsing.")
        Component(controller, "Controllers", "JavaScript", "Parses HTTP params, handles validation, and formats responses.")
        Component(service, "Services", "JavaScript", "Contains core business rules and logic.")
        Component(repository, "Repositories", "JavaScript", "Manages raw SQL operations.")
        Component(utils, "Utils / Validation", "JavaScript", "Provides shared validation schemas and error classes.")
    }

    ContainerDb(db, "Database", "SQLite", "Stores tickets data locally.")

    Rel(router, controller, "Delegates requests to")
    Rel(middlewares, router, "Filters/Catches errors from")
    Rel(controller, service, "Calls business logic in")
    Rel(controller, utils, "Uses for validation")
    Rel(service, repository, "Persists or fetches data via")
    Rel(repository, db, "Executes SQL against", "sqlite3")
```

## Explanation

The Component Diagram zooms deeply into the Node.js API application structure.
It highlights the strict Layered Architecture being followed:
- Incoming requests hit the **Router** (guarded by **Middlewares**).
- The Router calls a specific **Controller** action.
- The Controller validates user payload through **Utils** and invokes the **Service**.
- The Service runs business rules and uses the **Repository** pattern to decouple SQL query logic from business behaviors.
- The Repository finally speaks to the external **Database**.
