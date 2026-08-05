## 2024-08-03 - [High] Cross-Site Scripting (XSS) via .innerHTML
**Vulnerability:** The vanilla JavaScript frontend uses `.innerHTML` to render user-supplied content (`titulo` and `descricao`) directly without encoding, leading to Stored XSS vulnerabilities.
**Learning:** In applications not using modern frontend frameworks (which usually auto-escape by default), relying on template literals injected directly via `.innerHTML` requires manual HTML escaping.
**Prevention:** Always escape user input when generating HTML on the frontend before injecting it into the DOM, or use text-only manipulation APIs like `textContent` when possible.

## 2024-08-05 - [High] Overly Permissive CORS Configuration
**Vulnerability:** The application used `app.use(cors())` without options, meaning any website on the internet could make API requests and read responses on behalf of an authenticated user (if auth was added) or access sensitive data.
**Learning:** Default configurations in security middleware like `cors` are often open and designed for convenience rather than security. They must be explicitly configured to restrict access.
**Prevention:** Always specify an `origin` configuration in CORS, validating against an explicit whitelist of allowed origins provided via environment variables.
