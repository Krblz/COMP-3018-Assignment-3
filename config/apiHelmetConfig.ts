import helmet from "helmet";

export const apiHelmetConfig = helmet({
    // Disable unnecessary middleware for API-only apps
    contentSecurityPolicy: false, // Not needed for JSON APIs
    crossOriginEmbedderPolicy: false,

    // Keep essential security headers
    hsts: {
        maxAge: 31536000, // 1 year
        includeSubDomains: true,
        preload: true,
    },

    // Remove server information from responses
    hidePoweredBy: true,

    // Prevent MIME type sniffing
    noSniff: true,

    // Prevent clickjacking
    frameguard: { action: "deny" },
});