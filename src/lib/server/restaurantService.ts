import { API } from "$env/static/private";
//create restaurant
//
export async function checkRestaurantCodeExists(code: string) {
  console.log(code);
  const normalizedCode = code.trim().toUpperCase();

  try {
    const response = await fetch(
      `${API}/check-restaurant-code?code=${normalizedCode}`,
      {
        method: "GET",
        headers: {
          //no need for json since response only OK()
          "content-type": "application/json",
        },
      },
    );

    if (response.ok) {
      //code exists

      return {
        exists: true,
        code: normalizedCode, //for REDIRECT TO [code]
        //restaurants: [] // Placeholder, as the API doesn't return them here
      };
    } else if (response.status === 404) {
      return {
        exists: false,
        //restaurants: []
      };
    } else {
      const errorText = await response.text();
      console.error("Fetch error:", response.status, errorText);
      throw new Error(
        `Failed to check restaurant code. Status: ${response.status}`,
      );
    }
  } catch (error) {
    console.error("Network or other error:", error);
    throw error;
  }
}
export async function get_restaurant_by_id(id: string) {
  console.log(`${API}/r/${id}`);
  const response = await fetch(`${API}/r/${id}`, {
    method: "GET",
    headers: {
      //no need for json since response only OK()
      "content-type": "application/json",
    },
  });
  const restaurant = await response.json();
  if (!response.ok) {
    return "no";
  } else {
    return restaurant;
  }
}
export async function get_res_by_id(id: string) {
  try {
    const response = await fetch(`${API}/r/${id}`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    });
    const restaurant = await response.json();
    console.log(restaurant);
    return {
      restaurant: restaurant,
    };
  } catch {
    return {
      error: "backend not runnin",
    };
  }
}
