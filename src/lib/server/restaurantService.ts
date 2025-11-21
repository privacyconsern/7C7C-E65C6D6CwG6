import { API } from '$env/static/private';

export async function checkRestaurantCodeExists(code: string) {
    console.log(code);
    const normalizedCode = code.trim().toUpperCase();
    const url = `${API}/check-restaurant-code?code=${normalizedCode}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                //no need for json since response only OK()
                'content-type': 'application/json' 
            }
        });

        if (response.ok) {//code exists

            return {
                exists: true,
                code: normalizedCode, //for REDIRECT TO [code]
                //restaurants: [] // Placeholder, as the API doesn't return them here
            };

        } else if (response.status === 404) {
            return { 
                exists: false,
                //restaurants: [] 
            };
        } else {
            const errorText = await response.text();
            console.error('Fetch error:', response.status, errorText);
            throw new Error(`Failed to check restaurant code. Status: ${response.status}`);
        }
    } catch (error) {
        console.error('Network or other error:', error);
        throw error;
    }
}