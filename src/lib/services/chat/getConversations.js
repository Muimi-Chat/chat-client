import { CHAT_HTTP_API_ENDPOINT } from '$lib/const';

/**
 * @param {string} username
 * @param {string} sessionToken
 */
export async function getConversations(username, sessionToken) {
	try {
		const response = await fetch(
			`${CHAT_HTTP_API_ENDPOINT}/api-chat/conversations?username=${username}`,
			{
				method: 'GET',
				headers: {
					'session-token': sessionToken
				}
			}
		);

        const data = await response.json();
		return data;
	} catch (error) {
		// @ts-ignore
		throw new Error('Error Fetching Conversations: ' + error.message);
	}
}
