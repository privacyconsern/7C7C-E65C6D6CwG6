import { fail } from '@sveltejs/kit';
import { API } from '$env/static/private';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const email = formData.get('email');
		const password = formData.get('password');
        // Add confirmPassword check here if your UI has it

		const response = await fetch(`${API}/register`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, password })
		});

		if (!response.ok) {
            const err = await response.json();
            // Map .NET Identity errors
            const errorMsg = err.errors ? Object.values(err.errors).flat().join(', ') : "Registration failed";
			return fail(400, { error: errorMsg });
		}

		return { success: true, message: "Please check your email to confirm account." };
	}
};