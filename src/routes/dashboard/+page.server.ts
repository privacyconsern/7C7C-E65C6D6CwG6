import { redirect } from '@sveltejs/kit';
import { fail } from '@sveltejs/kit';
import { API } from '$env/static/private';
import type { Actions } from './$types';
import type { PageServerLoad } from './$types';
//GET (on load)
export const load = async ({ locals }) => {
    const restables = await fetch(`${API}/restaurants`, {
        method: 'GET',
        headers: {
            'content-type': 'application/json'
        }
    });
    //response ok, give data
    if (restables.ok) {
        const restaurant = await restables.json();
        return {
            restaurant: restaurant
        };
    }
    //this data is from hooks.server.ts
    if (!locals.user) {
        throw redirect(303, '/login');
    }
    return { restaurant: [], user: locals.user };
    //get user restaurants
    //get user reservations
};
//POST
export const actions: Actions = {
    createRestaurant: async ({ request }) => {
        const data = await request.formData();
        const restaurantName = data.get('restaurantName')?.toString().trim();
        const restaurantCode = data.get('restaurantCode')?.toString().trim();
        console.log(restaurantCode, restaurantName)
       
        const response = await fetch(`${API}/create-restaurant`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ RestaurantName: restaurantName, RestaurantCode: restaurantCode })
        });

        if (!response.ok) {
            const err = await response.json();
            //dontnet errors
            const errorMsg = err.errors ? Object.values(err.errors).flat().join(', ') : "Create failed";
            return fail(400, { error: errorMsg, message: "nauurr" });
        }

        return { success: true, message: "ok,  bro" };
    }
};