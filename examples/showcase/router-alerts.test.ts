import { assertStringIncludes } from "https://deno.land/std@0.224.0/assert/assert_string_includes.ts";
import { router } from "./router.ts";

const makeFormRequest = (url: string, form: FormData) =>
  new Request(url, { method: "POST", body: form });

Deno.test("register endpoint returns error alert for missing fields", async () => {
  const form = new FormData();
  form.set("firstName", "");
  form.set("lastName", "");
  form.set("email", "");
  form.set("password", "");
  const req = makeFormRequest("http://localhost/api/forms/register", form);
  const matched = router.match(req);
  if (!matched) throw new Error("route not matched");
  const res = await matched.handler(req, matched.params);
  const html = await res.text();
  assertStringIncludes(html, "Please fill in all required fields.");
});

Deno.test("register endpoint returns success alert with name on valid input", async () => {
  const form = new FormData();
  form.set("firstName", "Jane");
  form.set("lastName", "Doe");
  form.set("email", "jane@example.com");
  form.set("password", "12345678");
  const req = makeFormRequest("http://localhost/api/forms/register", form);
  const matched = router.match(req);
  if (!matched) throw new Error("route not matched");
  const res = await matched.handler(req, matched.params);
  const html = await res.text();
  assertStringIncludes(html, "Account created successfully!");
  assertStringIncludes(html, "Jane Doe");
});
