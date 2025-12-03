import { fail, redirect } from '@sveltejs/kit';
import { API } from '$env/static/private';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData();
		const email = formData.get('email');
		const password = formData.get('password');

		const response = await fetch(`${API}/login`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, password })
		});

		if (!response.ok) {
            // Handle your specific .NET ValidationProblem response structure here
            const err = await response.json();
			return fail(400, { email, error: err.title || "Login failed" });
		}

		const data = await response.json(); // Contains { token, email, id }

		// 1. Set the Access Token (For SvelteKit to use in hooks)
		cookies.set('accessToken', data.token, {
			path: '/',
			httpOnly: true,
			secure: false, // true in prod
            sameSite: 'strict',
			maxAge: 60 * 15 // 15 minutes
		});

        // 2. Handle the Refresh Token (Sent by .NET in Set-Cookie header)
        // SvelteKit's 'fetch' on the server usually swallows Set-Cookie headers from external APIs.
        // We need to manually read the Set-Cookie header from .NET and set it in SvelteKit.
        const setCookieHeader = response.headers.get('set-cookie');
        
        if (setCookieHeader) {
            // Simple parser to forward the RefreshToken
            // In a real app, you might want a robust cookie parser
            const parts = setCookieHeader.split('.');
            const refreshTokenPart = parts.find(p => p.trim().startsWith('RefreshToken='));
            if(refreshTokenPart) {
                const value = refreshTokenPart.split('=')[1];
                cookies.set('RefreshToken', value, {
                    path: '/',
                    httpOnly: true,
                    secure: false,
                    sameSite: 'strict',
                    maxAge: 60 * 60 * 24 * 30 // 30 days
                });
            }
        }

		throw redirect(302, '/dashboard'); // Redirect after login
	}
};