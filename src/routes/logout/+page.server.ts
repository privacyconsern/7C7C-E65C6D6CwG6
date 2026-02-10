import { redirect } from "@sveltejs/kit";
import { API } from "$env/static/private";
import type { Actions } from "./$types";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ fetch, cookies, request }) => {
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
};

export const actions: Actions = {
  default: async ({ cookies, request }) => {
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
