# C4 Context Diagram

## Diagram

```mermaid
C4Context
    title System Context diagram for TicketFlow API

    Person(user, "User / Support Analyst", "A support analyst or regular user managing internal IT operations.")
    System(ticketflow, "TicketFlow API", "Allows users to create, manage, track, and filter technical support tickets.")

    Rel(user, ticketflow, "Manages tickets using", "HTTP/REST")
```

## Explanation

The Context Diagram provides the big-picture view of the system.
In this case, the **User or Support Analyst** interacts directly with the **TicketFlow API** through HTTP REST endpoints. Currently, the system operates standalone, maintaining its state independently without relying on external services (like a separate authentication provider or email service, which could be future enhancements).
