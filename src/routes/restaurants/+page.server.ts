import type { PageServerLoad } from "./$types";
import { API } from "$env/static/private"; //api route

export const load: PageServerLoad = async ({ fetch }) => {
  try {
    const responseres = await fetch(`${API}/restaurants`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    });
    const responsefil = await fetch(`${API}/fr?restaurantId=${restaurant.id}`);

    if (!responseres.ok || !responsefil.ok) {
      console.log(responseres, responsefil);
      return {
        restaurants: [],
        filters [],
        error: "Could not load restaurants",
      };
    }
    const restaurants = await responseres.json();
    const filters = await responsefil.json();
    return {
      restaurants: restaurants,
      filters: filters
    };
  } catch {
    return {
      error: "backend not runnin",
    };
  }
};
