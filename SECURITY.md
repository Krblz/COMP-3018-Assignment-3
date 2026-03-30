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

## CORS Configuration

### Configuration Applied

// Development
{
    origin: true,
    credentials: true,
}

// Production
{
    origin: process.env.ALLOWED_ORIGINS?.split(",") || [],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}

### Justification

## Development

1. **origin: true** - Allows all origins during development to simplify testing in local environments.

2. **credentials: true** - Enabled cookies and authentication headers to be sent with requests.

## Production

1. **origin: ALLOWED_ORIGINS (whitelist)** - Restricts access to only the whitelisted domains defined in
    environment variables. This prevents unauthorized third-party from making requests to the API.

2. **credentials: true** - Required for APIs that use authentication.

3. **methods: ["GET", "POST", "PUT", "DELETE"]e** - Limits allowed HTTP methods to only those supported by
    the API, reducing the attack surface.

4. **allowedHeaders: ["Content-Type", "Authorization"]** - Restricts header to only those necessary for API
    functionality, preventing abuse by unexpected or malicious headers. 


### Sources

1. MDN Web Docs CORS - https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
2. OWASP Cross-Origin Resource Sharing (CORS) Guidelines - https://owasp.org/www-community/attacks/CORS_OriginHeaderScrutiny
3. Express CORS Middleware Documentation - https://expressjs.com/en/resources/middleware/cors.html