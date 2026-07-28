# C4 Container Diagram

## Diagram

```mermaid
C4Container
    title Container diagram for TicketFlow API

    Person(user, "User / Support Analyst", "A support analyst or regular user managing internal IT operations.")

    System_Boundary(c1, "TicketFlow API System") {
        Container(api, "API Application", "Node.js, Express", "Handles HTTP requests, validation, and executes core business logic.")
        ContainerDb(db, "Database", "SQLite", "Stores tickets data locally in a file-based SQL database.")
    }

    Rel(user, api, "Makes API calls to", "JSON/HTTP")
    Rel(api, db, "Reads from and writes to", "SQL via sqlite3")
```

## Explanation

The Container Diagram breaks down the TicketFlow system into two main structural containers:
1. **API Application (Node.js/Express):** This is the executable process where all business logic, routing, and validations reside. It serves as the gateway for users.
2. **Database Container (SQLite):** This represents the active storage layer where ticket data is persisted, recently upgraded from a legacy JSON file to leverage relational SQL querying capabilities.

In the future, we could introduce new containers such as a Single Page Application (SPA Frontend) or integrate a third-party Container like Auth0 for authentication.
