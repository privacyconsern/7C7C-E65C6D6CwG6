import { form, getRequestEvent, query } from "$app/server";
import { redirect } from "@sveltejs/kit";
import { error } from "console";
import { API } from "$env/static/private";
// import * as v from "valibot";

// doing db stuff here
export const get_all_restaurants = query(
  async () =>
    await fetch(`${API}/restaurants`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    }),
);
console.log(get_all_restaurants);

export const get_post_by_id = query(v.string(), async (id) =>
  db.query.post.findFirst({
    where: (p, { eq }) => eq(p.id, id),
  }),
);

export const get_post_by_slug = query(v.string(), async (slug) =>
  db.query.post.findFirst({
    where: (p, { eq }) => eq(p.slug, slug),
  }),
);

export const create_post = form(
  v.object({
    title: v.pipe(v.string(), v.nonEmpty("Title required")),
    body: v.pipe(v.string(), v.nonEmpty()),
  }),
  async ({ title, body }) => {
    const event = getRequestEvent();
    const session = await auth.api.getSession({
      headers: event.request.headers,
    });
    if (session?.user?.role != "admin") {
      error(401, "Unautharized");
    }
    const slug = title.toLowerCase().replace(/ /g, "-");
    await db.insert(post).values({
      title,
      slug,
      body,
      authorId: session?.user.id,
    });
    redirect(303, "/admin");
  },
);

export const edit_post = form(
  v.object({
    id: v.pipe(v.string(), v.nonEmpty("ID required")),
    title: v.pipe(v.string(), v.nonEmpty("Title required")),
    body: v.pipe(v.string(), v.nonEmpty()),
  }),
  async ({ id, title, body }) => {
    const event = getRequestEvent();
    const session = await auth.api.getSession({
      headers: event.request.headers,
    });
    if (session?.user?.role != "admin") {
      error(401, "Unautharized");
    }
    const slug = title.toLowerCase().replace(/ /g, "-");
    await db
      .update(post)
      .set({
        title,
        slug,
        body,
        authorId: session?.user.id,
      })
      .where(eq(post.id, id));
    redirect(303, "/admin");
  },
);
