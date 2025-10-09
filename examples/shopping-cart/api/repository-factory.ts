/**
 * Repository Factory
 * Creates and manages repository instances
 */

import { err, ok, type Result } from "../../../lib/result.ts";
import type { ApiError } from "./types.ts";
import type { ShoppingRepository } from "./repository.ts";
import { createKvShoppingRepository } from "./repository.ts";

// Safe error message extraction
const errorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : String(error);

// Global repository instance
let repositoryInstance: ShoppingRepository | null = null;

// Initialize repository (with KV, falling back to error)
export const initializeRepository = async (): Promise<
  Result<ShoppingRepository, ApiError>
> => {
  try {
    const kv = await Deno.openKv();
    const kvResult = await createKvShoppingRepository(kv);
    if (!kvResult.ok) {
      console.error(
        "Failed to initialize KV repository:",
        kvResult.error,
      );
      return err(kvResult.error);
    }
    repositoryInstance = kvResult.value;
    return ok(repositoryInstance);
  } catch (error) {
    return err({
      type: "kv_connection_error",
      message: `Failed to initialize repository: ${errorMessage(error)}`,
    });
  }
};

// Get the current repository instance
export const getRepository = (): ShoppingRepository => {
  if (!repositoryInstance) {
    throw new Error(
      "Repository not initialized. Call initializeRepository() first.",
    );
  }
  return repositoryInstance;
};

// Helper to ensure repository is initialized
export const ensureRepository = async (): Promise<
  Result<ShoppingRepository, ApiError>
> => {
  if (repositoryInstance) {
    return ok(repositoryInstance);
  }
  return await initializeRepository();
};

// For testing: inject a mock repository
export const setRepositoryForTesting = (
  instance: ShoppingRepository | null,
): void => {
  repositoryInstance = instance;
};
