## 2024-08-03 - [High] Cross-Site Scripting (XSS) via .innerHTML
**Vulnerability:** The vanilla JavaScript frontend uses `.innerHTML` to render user-supplied content (`titulo` and `descricao`) directly without encoding, leading to Stored XSS vulnerabilities.
**Learning:** In applications not using modern frontend frameworks (which usually auto-escape by default), relying on template literals injected directly via `.innerHTML` requires manual HTML escaping.
**Prevention:** Always escape user input when generating HTML on the frontend before injecting it into the DOM, or use text-only manipulation APIs like `textContent` when possible.
