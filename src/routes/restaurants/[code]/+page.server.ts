import type { PageServerLoad } from './$types';
import { API } from '$env/static/private'; //api route
import type { LayoutItem, SaveLayoutRequest } from '$lib/types/layout';

export const load: PageServerLoad = async ({ fetch }) => {

   //fetch table
    const restables = await fetch(`${API}/tables`, {
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
    if (restables.ok) {
        const tables = await restables.json();
        return {
            tables: tables
        };
    }
    if (response2.ok) {
        const timeslots = await response2.json();
        console.log(timeslots)
        return {
            timeslots: timeslots
        };
    }
    //else return error
    return { tables: [], timeslots: [] };
};

// Layout
let currentLayout: LayoutItem[] = [
    {
        walls: [],
        floors: [],
        tables: [{
            id: 1764017952692,
            type: "table",
            color: "#d4a373",
            x: 475,
            y: 225,
            rotation: -45,
            width: 120,
            height: 60,
            chairs: { top: 6, bottom: 5, left: 3, right: 3 },
            info: "Standard Table"
        }],
        plants: []
    }
];

// 2. Assemble the full request body object:
const requestBody: SaveLayoutRequest = {
    userId: 'user-guid-123',
    version: 1,
    restaurantId: 5,
    layout: currentLayout, // The JavaScript object/array is included directly here
};

// 3. Send the request
const apiUrl = `${API}/save-layout`;

try {
    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // Add authorization headers if needed
        },
        // **This is the critical step:** The entire requestBody (which contains the 
        // JavaScript array in the 'layout' field) is stringified once.
        body: JSON.stringify(requestBody) 
    });

    if (response.ok) {
        console.log("Layout saved successfully!");
    } else {
        const errorData = await response.json();
        console.error("Save failed:", errorData);
    }
} catch (error) {
    console.error("Network or fetch error:", error);
}