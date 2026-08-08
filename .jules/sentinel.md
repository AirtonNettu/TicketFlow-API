## 2024-08-03 - [High] Cross-Site Scripting (XSS) via .innerHTML
**Vulnerability:** The vanilla JavaScript frontend uses `.innerHTML` to render user-supplied content (`titulo` and `descricao`) directly without encoding, leading to Stored XSS vulnerabilities.
**Learning:** In applications not using modern frontend frameworks (which usually auto-escape by default), relying on template literals injected directly via `.innerHTML` requires manual HTML escaping.
**Prevention:** Always escape user input when generating HTML on the frontend before injecting it into the DOM, or use text-only manipulation APIs like `textContent` when possible.

## 2026-08-08 - [High] Overly Permissive CORS Configuration
**Vulnerability:** The application was using the default `cors()` configuration, which acts as a wildcard, allowing any origin to make cross-origin requests to the API. This could lead to Cross-Site Request Forgery (CSRF) or unauthorized data access if sensitive data is involved.
**Learning:** Default configurations of security middlewares like CORS often prioritize ease of use (allowing everything) over security. Explicit configuration is required to restrict access to trusted origins only.
**Prevention:** Always configure `cors` with a specific list of allowed origins, ideally loaded from an environment variable (e.g., `ALLOWED_ORIGINS`), rather than relying on defaults.
