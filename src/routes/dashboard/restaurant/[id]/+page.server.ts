import { API } from "$env/static/private";
import { checkRestaurantCodeExists } from "$lib/server/restaurantService";
import { fail, redirect, type Actions } from "@sveltejs/kit";

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
