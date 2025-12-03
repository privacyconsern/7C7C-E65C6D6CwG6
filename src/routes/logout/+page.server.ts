import { redirect } from '@sveltejs/kit';
import { API } from '$env/static/private';
import type { Actions } from '@sveltejs/kit';

export const actions: Actions = {
	default: async ({ cookies, request }) => {
        const accessToken = cookies.get('accessToken');

        // Tell backend to revoke token
		await fetch(`${API}/logout`, {
			method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                // Pass cookies so backend finds the RefreshToken to revoke
                'cookie': request.headers.get('cookie') || '' 
            }
		});
        console.log("logged out");

        // Clear SvelteKit cookies
		cookies.delete('accessToken', { path: '/' });
		cookies.delete('RefreshToken', { path: '/' });
        console.log("passed token delete");
		throw redirect(302, '/login');
	}
};