## 2024-08-03 - [High] Cross-Site Scripting (XSS) via .innerHTML
**Vulnerability:** The vanilla JavaScript frontend uses `.innerHTML` to render user-supplied content (`titulo` and `descricao`) directly without encoding, leading to Stored XSS vulnerabilities.
**Learning:** In applications not using modern frontend frameworks (which usually auto-escape by default), relying on template literals injected directly via `.innerHTML` requires manual HTML escaping.
**Prevention:** Always escape user input when generating HTML on the frontend before injecting it into the DOM, or use text-only manipulation APIs like `textContent` when possible.

## 2024-08-07 - [High] Overly permissive CORS configuration
**Vulnerability:** The application was configured with `app.use(cors())` which defaults to allowing all origins (`*`). This is a security risk as it allows unauthorized cross-origin data leakage and can lead to CSRF-like attacks.
**Learning:** By default, the `cors` package in Express allows any origin. It is crucial to explicitly restrict allowed origins, especially for APIs that handle sensitive data or perform actions on behalf of the user.
**Prevention:** Always specify allowed origins when configuring CORS. Use environment variables (e.g., `ALLOWED_ORIGINS`) to easily manage different origins across environments without hardcoding them in the source.
