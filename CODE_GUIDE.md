# Code & Style Guide

To maintain a healthy, readable, and professional codebase, we follow strict coding guidelines. When contributing to **TicketFlow**, please adhere to these rules.

## 1. General Principles
- **Readability over cleverness:** Write code that your future self and junior developers can understand.
- **Fail fast:** Validate inputs early in the Controllers or Utilities and throw predictable `ApiError` instances.
- **DRY (Don't Repeat Yourself):** Re-use validation logic and constants (e.g., categories, priorities).

## 2. Naming Conventions
- **Files and Folders:** camelCase (e.g., `ticketController.js`, `ticketRepository.js`).
- **Variables and Functions:** camelCase (e.g., `createTicket`, `getAllTickets`).
- **Classes:** PascalCase (e.g., `ApiError`).
- **Constants:** uppercase snake_case for hardcoded config constants (if any), but regular camelCase for exported arrays like `categories` or `statuses`.

## 3. Error Handling
Never use `res.status(500).send(error.message)` scattered across the code.
- Always wrap asynchronous controller logic in `try/catch` blocks.
- Pass caught errors to Express via `next(error)`.
- Use the custom `ApiError` class (located in `src/utils/validation.js`) to throw intentional business or validation errors (e.g., `throw new ApiError('Chamado não encontrado', 404)`).
- Let the centralized `errorHandler` middleware (in `src/middlewares/errorHandler.js`) format the final JSON response.

## 4. Asynchronous Code
- Use `async/await` instead of `.then()/.catch()` callbacks.
- When working with the database (SQLite), ensure connections or statements are properly handled or awaited.

## 5. Layer Separation (Strict Rule)
- **Do not** write SQL queries in Controllers or Services. Only Repositories should interact with the database.
- **Do not** process `req` or `res` objects inside Services or Repositories. Pass only the primitive values or plain JS objects needed.

## 6. Formatting
- Use 2 spaces for indentation.
- Always use single quotes for strings (`'...'`) unless double quotes are required (e.g., JSON).
- Ensure a blank line at the end of every file.
