import type { PageServerLoad } from './$types';
import { checkRestaurantCodeExists } from '$lib/server/restaurantService';
import { fail, redirect, type Actions } from '@sveltejs/kit';

export const load = (async () => {
    return {};
}) satisfies PageServerLoad;
export const actions: Actions = {
    //matches the action="?/checkCode" in the form
    checkCode: async ({ request }) => {
        const data = await request.formData();
        const restaurantCode = data.get('restaurantCode')?.toString().toUpperCase().trim();
        if (!restaurantCode) {
            return fail(400, { error: 'Please enter a restaurant code.' });
        }
        //code sanitizing: add regex validation here for the format "NY-000-000"
        console.log(restaurantCode)
        const codePattern = /^[A-Z]{2}-\d{3}-\d{3}$/;
        if (!codePattern.test(restaurantCode)) {
             return fail(400, { error: 'Invalid code format. Expected: XX-000-000' });
        }
       const result = await checkRestaurantCodeExists(restaurantCode);
            if (result.exists) {
                throw redirect(303, `/restaurants/${restaurantCode}`);
            } else {
                return fail(404, { 
                error: `Restaurant code "${restaurantCode}" not found.`,
                code: restaurantCode //optionally return the attempted code
            });
            }
    }
};