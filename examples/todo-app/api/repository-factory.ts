/**
 * Repository Factory
 * Creates and manages repository instances
 */

import { err, ok, type Result } from "../../../lib/result.ts";
import type { DatabaseError } from "./types.ts";
import type { TodoRepository } from "./repository.ts";
import { createInMemoryTodoRepository } from "./repository.ts";
import { createKvTodoRepository } from "./kv-repository.ts";

// Repository configuration
type RepositoryType = "memory" | "kv";

const errorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : String(error);

// Global repository instance
let repositoryInstance: TodoRepository | null = null;
let repositoryType: RepositoryType = "kv"; // Default to KV

// Initialize repository based on configuration
export const initializeRepository = async (
  type: RepositoryType = "kv",
): Promise<Result<TodoRepository, DatabaseError>> => {
  repositoryType = type;

  try {
    if (type === "memory") {
      repositoryInstance = createInMemoryTodoRepository();
      return ok(repositoryInstance);
    } else {
      const kvResult = await createKvTodoRepository();
      if (!kvResult.ok) {
        console.warn(
          "Failed to initialize KV repository, falling back to in-memory:",
          kvResult.error,
        );
        repositoryInstance = createInMemoryTodoRepository();
        repositoryType = "memory";
        return ok(repositoryInstance);
      }
      repositoryInstance = kvResult.value;
      return ok(repositoryInstance);
    }
  } catch (error) {
    return err({
      type: "kv_connection_error",
      message: `Failed to initialize repository: ${errorMessage(error)}`,
    });
  }
};

// Get the current repository instance
export const getRepository = (): TodoRepository => {
  if (!repositoryInstance) {
    throw new Error(
      "Repository not initialized. Call initializeRepository() first.",
    );
  }
  return repositoryInstance;
};

// Get repository type
export const getRepositoryType = (): RepositoryType => repositoryType;

// Helper to ensure repository is initialized
export const ensureRepository = async (): Promise<
  Result<TodoRepository, DatabaseError>
> => {
  if (repositoryInstance) {
    return ok(repositoryInstance);
  }
  return await initializeRepository();
};
