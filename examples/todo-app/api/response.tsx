/** @jsx h */
import { h } from "jsx";
import { render } from "../../../mod.ts";
import { Alert } from "../../../index.ts";
import type { DatabaseError } from "./types.ts";

export function jsonResponse(data: any, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export function htmlResponse(
  html: string | JSX.Element,
  status = 200,
): Response {
  const htmlString = typeof html === "string" ? html : String(html);
  return new Response(htmlString, {
    status,
    headers: { "Content-Type": "text/html" },
  });
}

export const errorResponse = (message: string, status = 400): Response =>
  htmlResponse(
    render(
      <Alert variant="error" title="Error">
        {message}
      </Alert>,
    ),
    status,
  );

export const handleDatabaseError = (error: DatabaseError): Response => {
  switch (error.type) {
    case "not_found":
      return errorResponse(
        `${error.entity} with ID ${error.id} not found`,
        404,
      );
    case "validation_error":
      return errorResponse(`${error.field}: ${error.message}`, 400);
    case "duplicate_key":
      return errorResponse(
        `${error.field} '${error.value}' already exists`,
        409,
      );
    default:
      return errorResponse("An unexpected error occurred", 500);
  }
};
