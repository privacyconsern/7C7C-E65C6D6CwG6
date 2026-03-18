import type { PageServerLoad } from "./$types";
import { API } from "$env/static/private"; //api route
import type { Actions } from "./$types";

export const load: PageServerLoad = async ({ fetch }) => {
  try {
    const response = await fetch(`${API}/restaurants`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    });
    const restaurants = await response.json();
    return {
      restaurants: restaurants,
    };
  } catch {
    return {
      error: "backend not runnin",
    };
  }
};

export const actions: Actions = {
  search: async ({ request }) => {
    const formData = await request.formData();
    const query = formData.get("query");

    const response = await fetch(`${API}/search?query=${query}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    console.log(`called resp: ${response}`);

    if (!response.ok) {
      const err = await response.json();
      console.log(err); //.net errors
      return fail(400, "how");
    }
    const restaurants = await response.json();
    return restaurants;
  },
};
