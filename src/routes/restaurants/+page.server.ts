import type { PageServerLoad } from "./$types";
import { API } from "$env/static/private"; //api route

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
