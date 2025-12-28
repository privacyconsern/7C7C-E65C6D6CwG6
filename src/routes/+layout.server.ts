import type { LayoutServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import { API } from '$env/static/private';
import type { Actions } from './$types';

// export const load = (async () => {
//     return {};
// }) satisfies LayoutServerLoad;

export const actions: Actions = {
    register: async ({ request }) => {
        const data = await request.formData();
        const email = data.get('email')?.toString().trim();
        const password = data.get('password')?.toString().trim();
        //const confirmPassword = data.get('confirmPassword')?.toString().trim();

        const response = await fetch(`${API}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            const err = await response.json();
            const errorMsg = err.errors ? Object.values(err.errors).flat().join(', ') : "Registration failed";
            return fail(400, { error: errorMsg });
        }

        return { success: true, message: "Please check your email to confirm account." };
    }
};