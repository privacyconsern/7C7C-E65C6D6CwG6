import { API } from "$env/static/private";
import { checkRestaurantCodeExists } from "$lib/server/restaurantService";
import { fail, redirect, type Actions } from "@sveltejs/kit";

export const actions: Actions = {
  createRestaurant: async ({ locals, request, cookies }) => {
    const data = await request.formData();
    const restaurantName = data.get("restaurantName")?.toString().trim();
    const restaurantCode = data.get("restaurantCode")?.toString().trim();
    const createdById = locals.user.id;
    const accessToken = cookies.get("accessToken");
    console.log(
      JSON.stringify({
        createdById,
        restaurantName,
        restaurantCode,
      }),
    );

    try {
      const response = await fetch(`${API}/create-restaurant`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          createdById,
          restaurantName,
          restaurantCode,
        }),
      });
      console.log(response);
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
  checkCode: async ({ request }) => {
    const data = await request.formData();
    //CreatedAt: Date.now.toString
    const restaurantCode = data
      .get("restaurantCode")
      ?.toString()
      .toUpperCase()
      .trim();
    if (!restaurantCode) {
      return fail(400, { error: "Please enter a restaurant code." });
    }
    //code sanitizing: add regex validation here for the format "NY-000-000"
    const codePattern = /^[A-Z]{2}-\d{3}-\d{3}$/;
    if (!codePattern.test(restaurantCode)) {
      return fail(400, { error: "Invalid code format. Expected: XX-000-000" });
    }
    try {
      const result = await checkRestaurantCodeExists(restaurantCode);
      if (result.exists) {
        throw redirect(303, `/restaurants/${restaurantCode}`);
      } else {
        return fail(404, {
          error: `Restaurant code "${restaurantCode}" not found.`,
          code: restaurantCode, //optionally return the attempted code
        });
      }
    } catch (err) {
      return fail(503, {
        error: "Our servers are temporarily offline. Please try again later.",
        message: err,
      });
    }
  },
};
