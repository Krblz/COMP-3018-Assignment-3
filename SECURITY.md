## Helmet.js Configuration

### Configuration Applied

helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,

    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
    },

    hidePoweredBy: true,
    noSniff: true,
    frameguard: { action: "deny" },
});

### Justification

1. **contentSecurityPolicy: false** - Disabled because this API returns only
    JSON data and does not serve HTML content. CSP is designed to prevent XSS in
    browsers rendering HTML.

2. **hsts** - Enabled with 1-year max-age to enforce HTTPS connections...

3. **hidePoweredBy: true** - Removes information about the technology attack used to build the API.
    It helps prevents attackers from targeting known vulnerabilities.
4. **noSniff: true** - Mitigates MIME type sniffing which can cause security issues. This also
    prevents browsers from incorrectly interpreting data types returned by the API which makes it
    avoid potential exploits based on file or content type misidentification.

5. **frameguard: { action: "deny" }** - Mitigates clickjacking attacks.

### Sources

1. Helmet.js Official Documentation - https://helmetjs.github.io/
2. OWASP Secure Headers Project - https://owasp.org/www-project-secure-headers/