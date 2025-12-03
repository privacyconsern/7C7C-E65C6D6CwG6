import type { Handle } from '@sveltejs/kit';
import { API } from '$env/static/private';

export const handle: Handle = async ({ event, resolve }) => {
	// 1. Get the Access Token from SvelteKit's cookies
	const accessToken = event.cookies.get('accessToken');
    
    // Define a helper to fetch user info
    const fetchUserInfo = async (token: string) => {
        const response = await fetch(`${API}/user-info`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response;
    };

	if (accessToken) {
		console.log("handle called");
		// 2. Verify the token by calling your .NET /user-info endpoint
		let response = await fetchUserInfo(accessToken);

		// 3. If 401 (Unauthorized), try to refresh the token
		if (response.status === 401) {
            console.log('Access token expired, attempting refresh...');
            
            // We must pass the cookies (specifically RefreshToken) from the browser to .NET
			const refreshResponse = await fetch(`${API}/refresh`, {
				method: 'POST',
				headers: {
                    // Pass all cookies from the browser to the backend so it sees 'RefreshToken'
					cookie: event.request.headers.get('cookie') || '' 
				}
			});

			if (refreshResponse.ok) {
				const data = await refreshResponse.json();
                const newAccessToken = data.token;

				// Update the Access Token cookie in SvelteKit
				event.cookies.set('accessToken', newAccessToken, {
					path: '/',
					httpOnly: true,
					secure: false, // Set to true in production (HTTPS)
                    sameSite: 'strict',
					maxAge: 60 * 15 // 15 minutes matches your .NET config usually
				});

                // Retry the user-info request with the new token
                response = await fetchUserInfo(newAccessToken);
                
                // Note: We don't manually set the RefreshToken cookie here; 
                // The .NET response 'set-cookie' header does that, and SvelteKit 
                // automatically passes it to the browser in the resolve step below if configured correctly,
                // but explicitly managing the response headers is safer (see step 4 in login).
			} else {
                // Refresh failed (token revoked or expired), clear cookies
                event.cookies.delete('accessToken', { path: '/' });
            }
		}

		if (response.ok) {
			const user = await response.json();
			event.locals.user = {
				id: user.id,
				email: user.name, // Mapping from your LoggedUser model
				isAuthenticated: user.isAuthenticated
			};
		} else {
            event.locals.user = null;
        }
	} else {
        event.locals.user = null;
    }

	return await resolve(event);
};