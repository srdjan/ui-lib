import {
  assertEquals,
  assertStringIncludes,
} from "https://deno.land/std@0.224.0/assert/mod.ts";
import { todoAPI } from "./handlers.tsx";
import { getRepository, initializeRepository } from "./repository-factory.ts";
import type { DatabaseError } from "./types.ts";
import type { Result } from "../../../lib/result.ts";

async function unwrapResult<T>(
  resultOrPromise: Result<T, DatabaseError> | Promise<Result<T, DatabaseError>>,
): Promise<T> {
  const result = await resultOrPromise;
  if (!result.ok) {
    throw new Error(
      `Expected ok result, received error type: ${result.error.type}`,
    );
  }
  return result.value;
}

Deno.test("todo handlers accept JSON payloads", async (t) => {
  await t.step("createTodo persists JSON body", async () => {
    const init = await initializeRepository("memory");
    if (!init.ok) {
      throw new Error(`Failed to initialize repository: ${init.error.type}`);
    }

    const request = new Request("http://localhost/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user: "alice",
        text: "Write JSON contract docs",
        priority: "high",
      }),
    });

    const response = await todoAPI.createTodo(request);
    assertEquals(response.status, 200);
    const html = await response.text();
    assertStringIncludes(html, "todo-list");
    assertStringIncludes(html, "Write JSON contract docs");

    const repo = getRepository();
    const todos = await unwrapResult(repo.getAll("alice"));
    assertEquals(todos.length > 0, true);
  });

  await t.step("updateTodo consumes JSON body", async () => {
    const init = await initializeRepository("memory");
    if (!init.ok) {
      throw new Error(`Failed to initialize repository: ${init.error.type}`);
    }

    const repo = getRepository();
    const seed = await unwrapResult(repo.create({
      userId: "alice",
      text: "Seed item",
      priority: "low",
      completed: false,
    }));

    const request = new Request(
      `http://localhost/api/todos/${seed.id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: "Updated text",
          priority: "medium",
        }),
      },
    );

    const response = await todoAPI.updateTodo(request, { id: seed.id });
    assertEquals(response.status, 200);
    const html = await response.text();
    assertStringIncludes(html, "Updated text");

    const updated = await unwrapResult(repo.getById(seed.id));
    if (!updated) {
      throw new Error("Expected updated todo");
    }
    assertEquals(updated.text, "Updated text");
    assertEquals(updated.priority, "medium");
  });
});
