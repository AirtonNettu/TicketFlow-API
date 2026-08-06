## 2024-08-03 - [High] Cross-Site Scripting (XSS) via .innerHTML
**Vulnerability:** The vanilla JavaScript frontend uses `.innerHTML` to render user-supplied content (`titulo` and `descricao`) directly without encoding, leading to Stored XSS vulnerabilities.
**Learning:** In applications not using modern frontend frameworks (which usually auto-escape by default), relying on template literals injected directly via `.innerHTML` requires manual HTML escaping.
**Prevention:** Always escape user input when generating HTML on the frontend before injecting it into the DOM, or use text-only manipulation APIs like `textContent` when possible.

## 2024-08-06 - [Critical] Information Leakage via Express Error Handler & Permissive CORS
**Vulnerability:** The default error handler in Express was exposing potentially sensitive details (like stack traces or local filesystem paths via `err.message` and `err.details`) on HTTP 500 errors. Also, CORS was configured permissively (`app.use(cors())`) without restricting allowed origins, exposing the API to cross-origin data leakage.
**Learning:** Returning unmasked error messages from internal modules (like `fs`) can lead to information disclosure. An open CORS policy increases the attack surface for unauthorized cross-origin requests.
**Prevention:** Implement a secure error handler that masks 500-level errors with generic messages (e.g., "Erro interno do servidor") and explicitly configure CORS to restrict allowed origins via environment variables (e.g., `ALLOWED_ORIGINS`).
