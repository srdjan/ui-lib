/**
 * Response Helpers
 * Consistent response utilities for API handlers
 */

import type { ApiError } from "./types.ts";

// HTML response helper
export const htmlResponse = (
  html: string,
  options: { status?: number } = {},
): Response => {
  return new Response(html, {
    status: options.status || 200,
    headers: { "Content-Type": "text/html" },
  });
};

// JSON response helper
export const jsonResponse = (
  data: unknown,
  options: { status?: number } = {},
): Response => {
  return new Response(JSON.stringify(data), {
    status: options.status || 200,
    headers: { "Content-Type": "application/json" },
  });
};

// Error response helper (generic text)
export const errorResponse = (
  message: string,
  status = 500,
): Response => {
  return new Response(message, { status });
};

// Typed API error response helper
export const apiErrorResponse = (error: ApiError, status = 400): Response => {
  // Map error types to appropriate HTTP status codes
  const statusCode = (() => {
    switch (error.type) {
      case "not_found":
        return 404;
      case "validation_error":
        return 400;
      case "out_of_stock":
        return 409;
      case "empty_cart":
        return 400;
      case "kv_connection_error":
      case "kv_operation_error":
        return 500;
      case "generic_error":
        return status;
      default:
        return 500;
    }
  })();

  return jsonResponse(error, { status: statusCode });
};

// Handle database errors consistently
export const handleDatabaseError = (error: ApiError): Response => {
  console.error("Database error:", error);
  return apiErrorResponse(error);
};
