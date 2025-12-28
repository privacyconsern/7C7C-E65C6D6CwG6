// +page.server.ts
import type { PageServerLoad } from './$types';
import { API } from '$env/static/private';

export const load = (async ({ url, fetch }) => { //get 'url' and 'fetch' from the event parameter
    const token = url.searchParams.get('token');
    const email = url.searchParams.get('email');

    if (!token || !email) {
        return {
            isSuccess: false,
            message: 'Invalid confirmation link: Missing token or email.'
        };
    }

    try {
        const res = await fetch(`${API}/verify-email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionToken: token, email })
        });
        if (!res.ok) {
            //read error message from API response if possible, otherwise use a generic error
            const errorData = await res.json().catch(() => ({}));
            const errorMessage = errorData.message || 'Verification failed. The link may be invalid or expired.';
            
            return {
                isSuccess: false,
                message: errorMessage
            };
        }

        // Success response
        return {
            isSuccess: true,
            message: 'Your email has been successfully verified! Redirecting to login...'
        };
    } catch (err) {
        // Handle network or other unexpected errors
        console.error("Verification error:", err);
        return {
            isSuccess: false,
            message: 'An unexpected error occurred during verification.'
        };
    }
}) satisfies PageServerLoad;