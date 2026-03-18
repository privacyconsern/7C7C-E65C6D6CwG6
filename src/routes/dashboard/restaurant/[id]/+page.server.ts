import { API } from "$env/static/private";
import { fail, type Actions } from "@sveltejs/kit";
import { page } from "$app/state";
import type { PageServerLoad } from "./$types";

// const id = "48825bc3-4f5e-4321-af92-7c3514c27fd1";

// export const load: PageServerLoad = async ({ fetch }) => {
//   try {
//     const response = await fetch(`${API}/r/${id}`, {
//       method: "GET",
//       headers: {
//         "content-type": "application/json",
//       },
//     });
//     const restaurant = await response.json();
//     return {
//       restaurant: restaurant,
//     };
//   } catch {
//     return {
//       error: "backend not runnin",
//     };
//   }
// };

export const actions: Actions = {
  updateRestaurant: async ({ locals, request }) => {
    const data = await request.formData();
    const restaurantName = data.get("restaurantName")?.toString().trim();
    const reservationsDuration = data
      .get("reservationsDuration")
      ?.toString()
      .trim();
    const openingHourAndMinute = data
      .get("openingHourAndMinute")
      ?.toString()
      .trim();
    const closingHourAndMinute = data
      .get("closingHourAndMinute")
      ?.toString()
      .trim();
    const description = data.get("description")?.toString().trim();

    const modifiedAt = new Date();
    const modifiedBy = locals.user;
    const published = false;
    console.log(
      restaurantName,
      reservationsDuration,
      openingHourAndMinute,
      closingHourAndMinute,
      description,
      modifiedAt,
      modifiedBy,
      published,
    );

    try {
      const response = await fetch(`${API}/update-restaurant`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantName,
          reservationsDuration,
          openingHourAndMinute,
          closingHourAndMinute,
          description,
          modifiedAt,
          modifiedBy,
          published,
        }),
      });
      if (!response.ok) {
        const err = await response.json();
        const generalErrors = err.errors[""] ? err.errors[""].join(" ") : "";
        const fieldErrors = err.errors;

        return fail(400, {
          error: generalErrors || "Creating restaurant failed",
          details: fieldErrors,
        });
      }
      if (!response.ok) {
        const err = await response.json();
        //grab outputted errors from backend
        const errorMsg = err.errors
          ? Object.values(err.errors).flat().join(", ")
          : "Registration failed";
        return fail(400, { error: errorMsg });
      }

      return {
        success: true,
        //redirect to restaurant detail
      };
    } catch (err) {
      return fail(503, {
        error: `rs nuts ${err}`,
      });
    }
  },
};

// export const load: PageServerLoad = async ({ fetch }) => {
//   try {
//     const response = await fetch(`${API}/r/${slug}`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     const restaurant = await response.json();
//     return {
//       restaurant: restaurant,
//     };
//     if (!response.ok) {
//       const err = await response.json();
//       //grab outputted errors from backend
//       const errorMsg = err.errors
//         ? Object.values(err.errors).flat().join(", ")
//         : "Loaad failed";
//       return fail(400, { error: errorMsg });
//     }
//   } catch {
//     return "lol";
//   }
// };
