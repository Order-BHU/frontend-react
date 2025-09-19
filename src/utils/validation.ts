// Input validation utilities for enhanced security

// Email validation
export const validateEmail = (email: string): { valid: boolean; error?: string } => {
  if (!email || email.trim().length === 0) {
    return { valid: false, error: "Email is required" };
  }
  
  if (email.length > 255) {
    return { valid: false, error: "Email is too long" };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: "Please enter a valid email address" };
  }
  
  return { valid: true };
};

// Password validation
export const validatePassword = (password: string): { valid: boolean; error?: string } => {
  if (!password || password.length < 8) {
    return { valid: false, error: "Password must be at least 8 characters" };
  }
  
  if (password.length > 128) {
    return { valid: false, error: "Password is too long" };
  }
  
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
  if (!passwordRegex.test(password)) {
    return { valid: false, error: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character" };
  }
  
  return { valid: true };
};

// Phone number validation (Nigerian format)
export const validatePhone = (phone: string): { valid: boolean; error?: string } => {
  if (!phone || phone.trim().length === 0) {
    return { valid: false, error: "Phone number is required" };
  }
  
  const phoneRegex = /^(\+234|234|0)?[789][01]\d{8}$/;
  if (!phoneRegex.test(phone)) {
    return { valid: false, error: "Please enter a valid Nigerian phone number" };
  }
  
  return { valid: true };
};

// Name validation
export const validateName = (name: string): { valid: boolean; error?: string } => {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: "Name is required" };
  }
  
  if (name.length > 100) {
    return { valid: false, error: "Name is too long" };
  }
  
  const nameRegex = /^[a-zA-Z\s'-]+$/;
  if (!nameRegex.test(name)) {
    return { valid: false, error: "Name can only contain letters, spaces, hyphens, and apostrophes" };
  }
  
  return { valid: true };
};

// Sanitization functions
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, "") // Remove potential HTML tags
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+=/gi, ""); // Remove event handlers
};

export const sanitizeHtml = (html: string): string => {
  // Basic HTML sanitization - in production, use a library like DOMPurify
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/on\w+="[^"]*"/gi, "")
    .replace(/on\w+='[^']*'/gi, "");
};

// Form validation functions
export const validateLogin = (data: { email: string; password: string }) => {
  const errors: Record<string, string> = {};
  
  const emailValidation = validateEmail(data.email);
  if (!emailValidation.valid) {
    errors.email = emailValidation.error!;
  }
  
  if (!data.password || data.password.trim().length === 0) {
    errors.password = "Password is required";
  }
  
  return { valid: Object.keys(errors).length === 0, errors };
};

export const validateSignup = (data: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone_number: string;
  phone_number_type: string;
  "g-recaptcha-response": string;
}) => {
  const errors: Record<string, string> = {};
  
  const nameValidation = validateName(data.name);
  if (!nameValidation.valid) {
    errors.name = nameValidation.error!;
  }
  
  const emailValidation = validateEmail(data.email);
  if (!emailValidation.valid) {
    errors.email = emailValidation.error!;
  }
  
  const passwordValidation = validatePassword(data.password);
  if (!passwordValidation.valid) {
    errors.password = passwordValidation.error!;
  }
  
  if (data.password !== data.confirmPassword) {
    errors.confirmPassword = "Passwords don't match";
  }
  
  const phoneValidation = validatePhone(data.phone_number);
  if (!phoneValidation.valid) {
    errors.phone_number = phoneValidation.error!;
  }
  
  if (!["whatsapp", "sms", "both"].includes(data.phone_number_type)) {
    errors.phone_number_type = "Please select a valid phone number type";
  }
  
  if (!data["g-recaptcha-response"] || data["g-recaptcha-response"].trim().length === 0) {
    errors["g-recaptcha-response"] = "Please complete the captcha";
  }
  
  return { valid: Object.keys(errors).length === 0, errors };
};

export const validateMenuItem = (data: {
  name: string;
  description: string;
  price: number;
  category_id: number;
}) => {
  const errors: Record<string, string> = {};
  
  if (!data.name || data.name.trim().length === 0) {
    errors.name = "Item name is required";
  } else if (data.name.length > 100) {
    errors.name = "Name is too long";
  }
  
  if (data.description && data.description.length > 500) {
    errors.description = "Description is too long";
  }
  
  if (data.price < 0) {
    errors.price = "Price must be positive";
  } else if (data.price > 1000000) {
    errors.price = "Price is too high";
  }
  
  if (!data.category_id || data.category_id < 1) {
    errors.category_id = "Category is required";
  }
  
  return { valid: Object.keys(errors).length === 0, errors };
};

export const validateContact = (data: { subject: string; message: string }) => {
  const errors: Record<string, string> = {};
  
  if (!data.subject || data.subject.trim().length === 0) {
    errors.subject = "Subject is required";
  } else if (data.subject.length > 255) {
    errors.subject = "Subject is too long";
  }
  
  if (!data.message || data.message.trim().length < 10) {
    errors.message = "Message must be at least 10 characters";
  } else if (data.message.length > 2000) {
    errors.message = "Message is too long";
  }
  
  return { valid: Object.keys(errors).length === 0, errors };
};

export const validateOrderUpdate = (data: {
  status: string;
  code?: string;
}) => {
  const errors: Record<string, string> = {};
  
  const validStatuses = ["pending", "accepted", "ready", "delivering", "completed", "cancelled"];
  if (!validStatuses.includes(data.status)) {
    errors.status = "Invalid status";
  }
  
  if (data.code && data.code.length !== 4) {
    errors.code = "Code must be 4 digits";
  }
  
  return { valid: Object.keys(errors).length === 0, errors };
};

// File validation
export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  
  if (file.size > maxSize) {
    return { valid: false, error: "File size must be less than 5MB" };
  }
  
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: "Only JPEG, PNG, WebP, and GIF images are allowed" };
  }
  
  return { valid: true };
};

// XSS prevention
export const escapeHtml = (text: string): string => {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  
  return text.replace(/[&<>"']/g, (m) => map[m]);
};

// CSRF token validation
export const generateCSRFToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

export const validateCSRFToken = (token: string, storedToken: string): boolean => {
  return token === storedToken && token.length === 64;
};

// Rate limiting simulation (client-side)
export class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  
  isAllowed(key: string, maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];
    
    // Remove old attempts outside the window
    const validAttempts = attempts.filter(time => now - time < windowMs);
    
    if (validAttempts.length >= maxAttempts) {
      return false;
    }
    
    validAttempts.push(now);
    this.attempts.set(key, validAttempts);
    
    return true;
  }
  
  reset(key: string): void {
    this.attempts.delete(key);
  }
}

// Secure storage utilities
export const secureStorage = {
  setItem: (key: string, value: string): void => {
    try {
      // In production, consider encrypting sensitive data
      localStorage.setItem(key, value);
    } catch (error) {
      console.error("Failed to store data:", error);
    }
  },
  
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error("Failed to retrieve data:", error);
      return null;
    }
  },
  
  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error("Failed to remove data:", error);
    }
  },
  
  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error("Failed to clear storage:", error);
    }
  }
};

// Custom hook for form validation
export const useFormValidation = () => {
  const validateField = (field: string, value: any, validationFn: (value: any) => { valid: boolean; error?: string }) => {
    const result = validationFn(value);
    return { field, valid: result.valid, error: result.error };
  };
  
  const validateForm = (fields: Record<string, any>, validators: Record<string, (value: any) => { valid: boolean; error?: string }>) => {
    const errors: Record<string, string> = {};
    let isValid = true;
    
    Object.entries(fields).forEach(([field, value]) => {
      const validator = validators[field];
      if (validator) {
        const result = validator(value);
        if (!result.valid) {
          errors[field] = result.error!;
          isValid = false;
        }
      }
    });
    
    return { valid: isValid, errors };
  };
  
  return { validateField, validateForm };
};
