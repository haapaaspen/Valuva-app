import type { Handle } from '@sveltejs/kit';
// Comment out or remove unused imports if you prefer, for now, this is fine:

import {
	deleteSessionTokenCookie,
	getSessionCookie,
	setSessionTokenCookie,
	validateSessionToken
} from '.';


export const handle: Handle = async ({ event, resolve }) => {
	// --- MODIFICATION START ---
	// Temporarily bypass all authentication logic

	// Explicitly set user and session to null in case other parts of the app
	// expect these properties to exist on event.locals
	// event.locals.user = undefined;
	// event.locals.session = undefined;

	// Directly resolve the event without any auth checks
	//return resolve(event);
	// --- MODIFICATION END ---

	// Original logic commented out:
	const token = getSessionCookie(event);
	if (!token) {
		return resolve(event);
	}

	const validatedTokenResult = await validateSessionToken(token);
	if (validatedTokenResult.isErr()) {
		console.error(validatedTokenResult.error);
	} else {
		const { session, user } = validatedTokenResult.value;
		if (session) {
			setSessionTokenCookie(event.cookies, token, session.expiresAt);
			event.locals.session = session;
			event.locals.user = user;
		} else {
			deleteSessionTokenCookie(event.cookies);
		}
	}

	return resolve(event);
};
