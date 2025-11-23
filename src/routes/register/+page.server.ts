import { fail, redirect } from '@sveltejs/kit';
import { register } from '$lib/server/userService';

export const actions = {
    default: async ({ request, cookies }) => {
        const data = await request.formData();
        const email = data.get('email') as string;
        const password = data.get('password') as string;

        if (!email || !password) {
            return fail(400, { missing: true });
        }

        try {
            const newUser = await register(email, password);

            // UX: Login immediately after registration
            cookies.set('session', 'valid-token', {
                path: '/',
                httpOnly: true, // Security: JS cannot read this
                sameSite: 'strict',
                maxAge: 60 * 60 * 24 * 7 // 1 week
            });
        } catch (error) {
            return fail(400, { email, error: 'User could not be created.' });
        }

        throw redirect(303, '/dashboard');
    }
};