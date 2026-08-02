## 2026-08-02 - [Fix] Information disclosure in Express Error Handler
**Vulnerability:** Unhandled errors (500) were returning the raw `err.message` to the client response, which could potentially leak internal paths (like `fs.readFile` failure paths) or other sensitive internal information.
**Learning:** The default error handler implementation was passing all error messages without filtering.
**Prevention:** Mask all unhandled server errors (status 500) with a generic 'Erro interno do servidor' message, only passing raw messages for known `ApiError` exceptions or explicitly marked operational client errors (status < 500). Internal real errors should be securely logged server-side via `console.error`.
