import { getChatsByUserId } from '$lib/server/db/queries.js';
import { error } from '@sveltejs/kit';
import { allowAnonymousChats } from '$lib/utils/constants.js';


export async function GET({ locals: { user } }) {
	if (!user) {
		console.log('!user in POST of valuva-app/src/routes/(app)/api/history/+server.ts');
		error(401, 'Unauthorized');
	}

	return await getChatsByUserId({ id: user.id }).match(
		(chats) => Response.json(chats),
		() => error(500, 'An error occurred while processing your request')
	);
}
