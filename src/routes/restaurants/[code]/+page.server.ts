import type { PageServerLoad } from './$types';
import { API } from '$env/static/private'; //api route

export const load: PageServerLoad = async ({ fetch }) => {

    //fetch table
    const response = await fetch(`${API}/tables`, {
        method: 'GET',
        headers: {
            'content-type': 'application/json'
        }
    });
    //fetch timeslots
    const response2 = await fetch(`${API}/timeslots`, {
        method: 'GET',
        headers: {
            'content-type': 'application/json'
        }
    });

    //response ok, give data
    if (response.ok) {
        const tables = await response.json();
        return {
            tables: tables
        };
    }
    if (response2.ok) {
        const timeslots = await response2.json();
        return {
            timeslots: timeslots
        };
    }
    //else return error
    return { tables: [], timeslots: [] };
};