## 2024-07-30 - [Stored XSS Mitigation]
**Vulnerability:** Found Stored Cross-Site Scripting (XSS) via `.innerHTML` directly interpolating user input (`titulo` and `descricao`) in `public/app.js` without any output sanitization.
**Learning:** The project relies on vanilla JavaScript without a modern framework (like React or Vue) to handle automatic output encoding. This means that anytime data is inserted into the DOM using `.innerHTML`, it creates a potential XSS vector.
**Prevention:** `escapeHTML` was added and applied to user data before `.innerHTML` insertion. This manual HTML escaping must be adopted as a mandatory, reusable security pattern across the vanilla JS architecture to sanitize any raw text sourced from the backend database prior to rendering.
