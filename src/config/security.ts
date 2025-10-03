// Security configuration and constants
export const SECURITY_CONFIG = {
  // Token settings
  TOKEN_STORAGE_KEY: "BHUO-token",
  TOKEN_EXPIRY_CHECK_INTERVAL: 5 * 60 * 1000, // 5 minutes

  // Rate limiting
  RATE_LIMIT: {
    LOGIN_ATTEMPTS: 5,
    LOGIN_WINDOW: 15 * 60 * 1000, // 15 minutes
    API_REQUESTS: 100,
    API_WINDOW: 60 * 1000, // 1 minute
  },

  // File upload limits
  FILE_UPLOAD: {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/webp", "image/gif"],
    ALLOWED_DOCUMENT_TYPES: ["application/pdf", "text/plain"],
  },

  // Input validation limits
  INPUT_LIMITS: {
    EMAIL_MAX_LENGTH: 255,
    PASSWORD_MIN_LENGTH: 8,
    PASSWORD_MAX_LENGTH: 128,
    NAME_MAX_LENGTH: 100,
    PHONE_MAX_LENGTH: 15,
    MESSAGE_MAX_LENGTH: 2000,
    SUBJECT_MAX_LENGTH: 255,
  },

  // Security headers
  SECURITY_HEADERS: {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "geolocation=(), microphone=(), camera=()",
  },

  // CORS settings
  CORS_ORIGINS: [
    "https://bhuorder.com.ng",
    "https://www.bhuorder.com.ng",
    "http://localhost:3000",
    "http://localhost:5173",
  ],

  // Session settings
  SESSION: {
    TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
    REFRESH_THRESHOLD: 60 * 60 * 1000, // 1 hour before expiry
  },

  // Encryption settings
  ENCRYPTION: {
    ALGORITHM: "AES-GCM",
    KEY_LENGTH: 256,
    IV_LENGTH: 12,
  },
};

// CSP (Content Security Policy) configuration
export const CSP_POLICY = {
  "default-src": ["'self'"],
  "script-src": [
    "'self'",
    "'unsafe-inline'",
    "https://www.google.com",
    "https://www.gstatic.com",
    "https://www.googletagmanager.com",
    "https://www.google-analytics.com",
  ],
  "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
  "font-src": ["'self'", "https://fonts.gstatic.com"],
  "img-src": ["'self'", "data:", "https:", "blob:"],
  "connect-src": [
    "'self'",
    "https://api.paystack.co",
    "https://bhuorder.com.ng",
  ],
  "frame-src": ["https://www.google.com"],
  "object-src": ["'none'"],
  "base-uri": ["'self'"],
  "form-action": ["'self'"],
};

// Environment-specific security settings
export const getSecurityConfig = () => {
  const isDevelopment = process.env.NODE_ENV === "development";
  const isProduction = process.env.NODE_ENV === "production";

  return {
    ...SECURITY_CONFIG,
    // Stricter settings for production
    ...(isProduction && {
      CORS_ORIGINS: SECURITY_CONFIG.CORS_ORIGINS.filter(
        (origin) => !origin.includes("localhost")
      ),
      // Disable debug features in production
      DEBUG_MODE: false,
      CONSOLE_LOGS: false,
    }),
    // More relaxed settings for development
    ...(isDevelopment && {
      DEBUG_MODE: true,
      CONSOLE_LOGS: true,
      // Allow localhost origins in development
      CORS_ORIGINS: [
        ...SECURITY_CONFIG.CORS_ORIGINS,
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
      ],
    }),
  };
};

// Security utilities
export const SecurityUtils = {
  // Generate secure random string
  generateSecureToken: (length: number = 32): string => {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
      ""
    );
  },

  // Hash sensitive data (basic implementation)
  hashData: async (data: string): Promise<string> => {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  },

  // Check if token is expired
  isTokenExpired: (token: string): boolean => {
    try {
      // Basic JWT expiry check (in production, use a proper JWT library)
      const payload = JSON.parse(atob(token.split(".")[1]));
      const now = Math.floor(Date.now() / 1000);
      return payload.exp < now;
    } catch {
      return true; // Consider invalid tokens as expired
    }
  },

  // Validate origin for CORS
  isValidOrigin: (origin: string): boolean => {
    const config = getSecurityConfig();
    return config.CORS_ORIGINS.includes(origin);
  },

  // Sanitize URL parameters
  sanitizeUrl: (url: string): string => {
    try {
      const urlObj = new URL(url);
      // Remove potentially dangerous parameters
      const dangerousParams = ["javascript:", "data:", "vbscript:"];

      urlObj.searchParams.forEach((value, key) => {
        if (
          dangerousParams.some((dangerous) =>
            value.toLowerCase().includes(dangerous)
          )
        ) {
          urlObj.searchParams.delete(key);
        }
      });

      return urlObj.toString();
    } catch {
      return ""; // Return empty string for invalid URLs
    }
  },
};

// Security middleware for API calls
export const SecurityMiddleware = {
  // Add security headers to requests
  addSecurityHeaders: (
    headers: Record<string, string> = {}
  ): Record<string, string> => {
    return {
      ...headers,
      ...SECURITY_CONFIG.SECURITY_HEADERS,
    };
  },

  // Validate file upload
  validateFileUpload: (file: File): { valid: boolean; error?: string } => {
    const { MAX_SIZE, ALLOWED_IMAGE_TYPES } = SECURITY_CONFIG.FILE_UPLOAD;

    if (file.size > MAX_SIZE) {
      return {
        valid: false,
        error: `File size must be less than ${MAX_SIZE / 1024 / 1024}MB`,
      };
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return { valid: false, error: "File type not allowed" };
    }

    return { valid: true };
  },

  // Rate limiting check
  // checkRateLimit: (key: string, attempts: number, window: number): boolean => {
  //   // This is a basic implementation - in production, use Redis or similar
  //   const now = Date.now();
  //   //const windowStart = now - window;

  //   // In a real implementation, you'd store this in a persistent store
  //   // For now, we'll just check against the configured limits
  //   return attempts < SECURITY_CONFIG.RATE_LIMIT.LOGIN_ATTEMPTS;
  // },
};

export default SECURITY_CONFIG;
