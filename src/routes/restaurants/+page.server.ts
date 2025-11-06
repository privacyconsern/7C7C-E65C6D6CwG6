import type { PageServerLoad } from './$types';
import { API } from '$env/static/private'; //api route

export const load: PageServerLoad = async ({ fetch }) => {

	//fetch data
    const response = await fetch(`${API}/restaurants`, {
		method: 'GET',
		headers: {
			'content-type': 'application/json'
		}
	});

	//response ok, give data
    if (response.ok) {
        const restaurants = await response.json();
        return {
            restaurants: restaurants
        };
    }
	//else return error
    return { restaurants: [] };
};