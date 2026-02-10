import type { PageServerLoad } from "./$types";
import { checkRestaurantCodeExists } from "$lib/server/restaurantService";
import { fail, redirect, type Actions } from "@sveltejs/kit";

export const load = (async () => {
  return {};
}) satisfies PageServerLoad;
export const actions: Actions = {
  //matches the action="?/checkCode" in the form
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
  logout: async ({ cookies, request }) => {
    const accessToken = cookies.get("accessToken");

    //revoke token on backend
    await fetch(`${API}/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        //give the refresh token
        cookie: request.headers.get("cookie") || "",
      },
    });
    console.log("logged out");

    //clear token on frontend
    cookies.delete("accessToken", { path: "/" });
    cookies.delete("RefreshToken", { path: "/" });
    console.log("passed token delete");
    throw redirect(302, "/login");
  },
};
