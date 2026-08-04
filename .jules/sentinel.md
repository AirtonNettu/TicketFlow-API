## 2024-08-03 - [High] Cross-Site Scripting (XSS) via .innerHTML
**Vulnerability:** The vanilla JavaScript frontend uses `.innerHTML` to render user-supplied content (`titulo` and `descricao`) directly without encoding, leading to Stored XSS vulnerabilities.
**Learning:** In applications not using modern frontend frameworks (which usually auto-escape by default), relying on template literals injected directly via `.innerHTML` requires manual HTML escaping.
**Prevention:** Always escape user input when generating HTML on the frontend before injecting it into the DOM, or use text-only manipulation APIs like `textContent` when possible.

## 2026-08-04 - [Medium] Information Disclosure via Error Handler
**Vulnerability:** The global error handler in `src/middlewares/errorHandler.js` returns the raw `err.message` to the client for all errors. For unhandled exceptions (like file system `ENOENT` errors), this leaks internal file paths or stack traces.
**Learning:** Defaulting to passing the error message directly to the client can accidentally expose infrastructure details if an unexpected error occurs.
**Prevention:** Mask all internal errors (HTTP 500+) with a generic message like "Erro interno do servidor" and only return specific error messages for explicitly controlled client errors (e.g. `ApiError` instances with 4xx status codes).
