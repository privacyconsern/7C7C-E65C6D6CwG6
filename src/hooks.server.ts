import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
    // 1. Get the session cookie
    const sessionToken = event.cookies.get('session');

    if (!sessionToken) {
        event.locals.user = null;
    } else {
        // 2. Validate token (In real life, check DB or verify JWT)
        // const user = await db.session.find({ token: sessionToken });
        
        // MOCK: Assuming token is valid for this example
        if (sessionToken === 'valid-token') {
            event.locals.user = { id: 'user_123', email: 'test@example.com', role: 'USER' };
        } else {
            event.locals.user = null;
        }
    }

    // 3. Continue to the requested page/action
    return resolve(event);
};