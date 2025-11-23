import { fail, redirect } from '@sveltejs/kit';
import { login } from '$lib/server/userService';

export const actions = {
    default: async ({ request, cookies }) => {
        const data = await request.formData();
        const email = data.get('email') as string;
        const password = data.get('password') as string;

        const user = await login(email, password);

        if (!user) {
            // Return email so user doesn't have to retype it
            return fail(400, { email, incorrect: true });
        }

        // Set the cookie
        cookies.set('session', 'valid-token', {
            path: '/',
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7
        });

        throw redirect(303, '/dashboard');
    }
};