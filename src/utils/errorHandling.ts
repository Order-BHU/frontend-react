// Centralized error handling utilities
import { useToast } from "@/hooks/use-toast";

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status?: number;
}

// Error types for better categorization
export enum ErrorType {
  NETWORK = "NETWORK",
  VALIDATION = "VALIDATION",
  AUTHENTICATION = "AUTHENTICATION",
  AUTHORIZATION = "AUTHORIZATION",
  NOT_FOUND = "NOT_FOUND",
  SERVER = "SERVER",
  UNKNOWN = "UNKNOWN",
}

// Parse error to extract meaningful information
export const parseError = (
  error: any
): { type: ErrorType; message: string; details?: any } => {
  // Network errors
  if (error.code === "ERR_NETWORK" || !error.response) {
    return {
      type: ErrorType.NETWORK,
      message:
        "Unable to connect to the server. Please check your internet connection.",
    };
  }

  const status = error.response?.status;
  const data = error.response?.data;

  switch (status) {
    case 401:
      return {
        type: ErrorType.AUTHENTICATION,
        message: "Your session has expired. Please log in again.",
        details: data,
      };

    case 403:
      return {
        type: ErrorType.AUTHORIZATION,
        message: "You don't have permission to perform this action.",
        details: data,
      };

    case 404:
      return {
        type: ErrorType.NOT_FOUND,
        message: "The requested resource was not found.",
        details: data,
      };

    case 422:
      return {
        type: ErrorType.VALIDATION,
        message: data?.message || "Please check your input and try again.",
        details: data,
      };

    case 500:
    case 502:
    case 503:
    case 504:
      return {
        type: ErrorType.SERVER,
        message: "Server error occurred. Please try again later.",
        details: data,
      };

    default:
      return {
        type: ErrorType.UNKNOWN,
        message:
          data?.message || "An unexpected error occurred. Please try again.",
        details: data,
      };
  }
};

// Standardized error handler for API calls
export const handleApiError = (error: any): never => {
  const parsedError = parseError(error);

  // Log error for debugging (in development)
  if (process.env.NODE_ENV === "development") {
    console.error("API Error:", {
      type: parsedError.type,
      message: parsedError.message,
      details: parsedError.details,
      originalError: error,
    });
  }

  // Throw standardized error
  throw {
    type: parsedError.type,
    message: parsedError.message,
    details: parsedError.details,
  };
};

// Hook for standardized error handling with toast notifications
export const useErrorHandler = () => {
  const { toast } = useToast();

  const handleError = (error: any, customMessage?: string) => {
    const parsedError = parseError(error);

    // Use custom message if provided, otherwise use parsed message
    const message = customMessage || parsedError.message;

    // Show appropriate toast based on error type
    switch (parsedError.type) {
      case ErrorType.NETWORK:
        toast({
          title: "Connection Error",
          description: message,
          variant: "destructive",
        });
        break;

      case ErrorType.AUTHENTICATION:
        toast({
          title: "Authentication Required",
          description: message,
          variant: "destructive",
        });
        // Could trigger logout here
        break;

      case ErrorType.AUTHORIZATION:
        toast({
          title: "Access Denied",
          description: message,
          variant: "destructive",
        });
        break;

      case ErrorType.VALIDATION:
        toast({
          title: "Validation Error",
          description: message,
          variant: "destructive",
        });
        break;

      case ErrorType.SERVER:
        toast({
          title: "Server Error",
          description: message,
          variant: "destructive",
        });
        break;

      default:
        toast({
          title: "Error",
          description: message,
          variant: "destructive",
        });
    }
  };

  const handleSuccess = (message: string) => {
    toast({
      title: "Success",
      description: message,
    });
  };

  return { handleError, handleSuccess };
};

// Validation error formatter
export const formatValidationErrors = (
  errors: Record<string, string[]>
): string => {
  const errorMessages = Object.entries(errors)
    .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
    .join("; ");

  return errorMessages || "Please check your input and try again.";
};

// Retry utility for failed requests
export const withRetry = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: any;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Don't retry certain error types
      const parsedError = parseError(error);
      if (
        [
          ErrorType.AUTHENTICATION,
          ErrorType.AUTHORIZATION,
          ErrorType.VALIDATION,
        ].includes(parsedError.type)
      ) {
        throw error;
      }

      // Wait before retrying
      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, delay * attempt));
      }
    }
  }

  throw lastError;
};

// Error boundary helper for React components
// export const getErrorBoundaryMessage = (error: Error, errorInfo: any): string => {
//   return `Something went wrong: ${error.message}`;
// };
