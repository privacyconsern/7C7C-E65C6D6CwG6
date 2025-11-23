import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
    // This data comes from hooks.server.ts
    if (!locals.user) {
        throw redirect(303, '/login');
    }

    return {
        user: locals.user
    };
};