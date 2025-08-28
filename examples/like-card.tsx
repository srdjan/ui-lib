/** @jsx h */
/// <reference path="../src/lib/jsx.d.ts" />
import {
  boolean,
  defineComponent,
  del,
  h,
  patch,
  renderComponent,
  string,
} from "../src/index.ts";
import type { GeneratedApiMap } from "../src/index.ts";

// Like Card – function-style props + API usage
defineComponent("like-card", {
  api: {
    // JSON in, HTML out: request body is JSON (via json-enc), response is HTML swapped by htmx
    // The API generator also injects default hx-headers (Accept, X-Requested-With)
    toggleLike: patch("/api/items/:id/like", async (req, params) => {
      let nextLiked = false;
      let note: string | undefined;
      try {
        const body = await req.json() as { liked?: boolean; note?: string };
        nextLiked = Boolean(body.liked);
        note = body.note;
      } catch {
        // Malformed JSON: treat as not liked, without note
      }

      return new Response(
        renderComponent("like-card", {
          id: params.id,
          title: note ? `Note: ${note}` : "Item updated!",
          liked: nextLiked,
        }),
        { headers: { "content-type": "text/html; charset=utf-8" } },
      );
    }),
    remove: del("/api/items/:id", () => new Response(null, { status: 200 })),
  },
  styles: {
    card:
      `{ border: 1px solid #ddd; border-radius: 6px; padding: 1rem; background: #fff; display: grid; gap: .5rem; }`,
    title: `{ font-size: 1rem; font-weight: 600; color: #333; }`,
    actions: `{ display: inline-flex; gap: .5rem; }`,
    likeBtn:
      `{ padding: .25rem .5rem; border-radius: 4px; border: 1px solid #e0245e; color: #e0245e; background: #fff0f3; cursor: pointer; }`,
    likeBtnActive: `{ background: #ffe4ea; }`,
    deleteBtn:
      `{ padding: .25rem .5rem; border-radius: 4px; border: 1px solid #6c757d; color: #6c757d; background: #f8f9fa; cursor: pointer; }`,
  },
  render: (
    {
      id = string("1") as unknown as string,
      title = string("My Item") as unknown as string,
      liked = boolean(false) as unknown as boolean,
    },
    api: GeneratedApiMap,
    classes?: Record<string, string>,
  ) => (
    <div class={classes!.card} data-id={id}>
      <h3 class={classes!.title}>{title}</h3>
      <div class={classes!.actions}>
        <button
          type="button"
          class={`${classes!.likeBtn} ${liked ? classes!.likeBtnActive : ""}`}
          {
            // Sends JSON payload; defaults include hx-ext=json-enc, hx-encoding=json, Accept header, and X-Requested-With
            ...api.toggleLike(id, { liked: !liked, note: "from-card" })
          }
        >
          {liked ? "❤️ Liked" : "♡ Like"}
        </button>
        <button type="button" class={classes!.deleteBtn} {...api.remove(id)}>
          Delete
        </button>
      </div>
    </div>
  ),
});

console.log("✅ like-card registered");
